import { mkdir, readFile, rm, stat } from 'node:fs/promises';
import { createServer, type Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import { extname, join, resolve, sep } from 'node:path';
import { type Browser, chromium, type Page } from 'playwright';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { componentDocsManifest } from '../stories/shared/component-docs-manifest.js';

const repoRoot = process.cwd();
const storybookRoot = join(repoRoot, 'storybook-static');
const artifactRoot = join(repoRoot, 'artifacts', 'storybook-docs');
const captureAllScreenshots = process.env['STORYBOOK_CAPTURE_ALL'] === '1';

const contentTypes: Record<string, string> = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ttf': 'font/ttf',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

type StorybookTheme = 'tinyrack-dark' | 'tinyrack-light';

function contentTypeFor(path: string) {
  return contentTypes[extname(path)] ?? 'application/octet-stream';
}

async function resolveStaticPath(requestUrl: string) {
  const pathname = decodeURIComponent(
    new URL(requestUrl, 'http://storybook.local').pathname,
  );
  const relativePath = pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, '');
  const candidatePath = resolve(storybookRoot, relativePath);
  const rootPrefix = `${resolve(storybookRoot)}${sep}`;

  if (
    candidatePath !== resolve(storybookRoot) &&
    !candidatePath.startsWith(rootPrefix)
  ) {
    return undefined;
  }

  try {
    const candidateStat = await stat(candidatePath);
    return candidateStat.isDirectory()
      ? join(candidatePath, 'index.html')
      : candidatePath;
  } catch {
    return undefined;
  }
}

async function startStaticServer() {
  const server = createServer(async (request, response) => {
    const filePath = await resolveStaticPath(request.url ?? '/');

    if (filePath === undefined) {
      response.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
      response.end('Not found');
      return;
    }

    try {
      const file = await readFile(filePath);
      response.writeHead(200, {
        'cache-control': 'no-store',
        'content-type': contentTypeFor(filePath),
      });
      response.end(file);
    } catch {
      response.writeHead(500, { 'content-type': 'text/plain; charset=utf-8' });
      response.end('Unable to read Storybook asset');
    }
  });

  await new Promise<void>((resolveListen, rejectListen) => {
    server.once('error', rejectListen);
    server.listen(0, '127.0.0.1', () => {
      server.off('error', rejectListen);
      resolveListen();
    });
  });

  return {
    origin: `http://127.0.0.1:${(server.address() as AddressInfo).port}`,
    server,
  };
}

async function closeStaticServer(server: Server) {
  await new Promise<void>((resolveClose, rejectClose) => {
    server.close((error) => {
      if (error === undefined) resolveClose();
      else rejectClose(error);
    });
  });
}

function iframeUrl(
  origin: string,
  storyId: string,
  viewMode: 'docs' | 'story',
  theme: StorybookTheme,
) {
  const search = new URLSearchParams({
    globals: `theme:${theme}`,
    id: storyId,
    viewMode,
  });
  return `${origin}/iframe.html?${search}`;
}

function defaultStoryId(docsStoryId: string) {
  return docsStoryId.replace(/--docs$/, '--default');
}

function artifactName(parts: string[]) {
  return parts
    .join('-')
    .replace(/[^a-z0-9-]+/gi, '-')
    .toLowerCase();
}

async function captureFailure(page: Page, parts: string[]) {
  await mkdir(artifactRoot, { recursive: true });
  await page.screenshot({
    fullPage: true,
    path: join(artifactRoot, `${artifactName(parts)}.png`),
  });
}

async function captureSnapshot(page: Page, parts: string[]) {
  if (!captureAllScreenshots) return;
  await mkdir(artifactRoot, { recursive: true });
  await page.screenshot({
    fullPage: true,
    path: join(artifactRoot, `${artifactName(['snapshot', ...parts])}.png`),
  });
}

describe('built React-only Storybook', () => {
  let browser: Browser;
  let origin: string;
  let server: Server;

  beforeAll(async () => {
    await stat(join(storybookRoot, 'index.html'));
    await rm(artifactRoot, { force: true, recursive: true });
    const staticServer = await startStaticServer();
    origin = staticServer.origin;
    server = staticServer.server;
    browser = await chromium.launch();
  });

  afterAll(async () => {
    await browser?.close();
    if (server) await closeStaticServer(server);
  });

  it('publishes every component docs page and default story', async () => {
    const index = JSON.parse(
      await readFile(join(storybookRoot, 'index.json'), 'utf8'),
    ) as { entries: Record<string, { type: string }> };

    for (const entry of componentDocsManifest) {
      expect(index.entries[entry.storyId]?.type, entry.storyId).toBe('docs');
      expect(
        index.entries[defaultStoryId(entry.storyId)]?.type,
        defaultStoryId(entry.storyId),
      ).toBe('story');
    }
  });

  for (const scenario of [
    {
      name: 'light desktop',
      theme: 'tinyrack-light',
      viewport: { height: 900, width: 1440 },
    },
    {
      name: 'dark mobile',
      theme: 'tinyrack-dark',
      viewport: { height: 844, width: 390 },
    },
  ] as const) {
    it(`renders all component docs without page errors in ${scenario.name}`, async () => {
      const page = await browser.newPage({ viewport: scenario.viewport });
      const pageErrors: string[] = [];
      page.on('pageerror', (error) => pageErrors.push(error.message));

      try {
        for (const entry of componentDocsManifest) {
          try {
            await page.goto(iframeUrl(origin, entry.storyId, 'docs', scenario.theme), {
              waitUntil: 'domcontentloaded',
            });
            const heading = page.locator('.sbdocs-content h1').first();
            await heading.waitFor({ state: 'visible' });
            await expect(heading.textContent()).resolves.toContain(entry.title);
            await expect(
              page.locator('[data-component-example]').count(),
            ).resolves.toBeGreaterThanOrEqual(entry.requiredExamples.length);

            const bodyText = (await page.locator('body').innerText()).toLowerCase();
            expect(bodyText).not.toContain("couldn't find story");
            expect(bodyText).not.toContain('no story found');

            const overflow = await page.locator('html').evaluate((element) => ({
              clientWidth: element.clientWidth,
              scrollWidth: element.scrollWidth,
            }));
            expect(overflow.scrollWidth).toBeLessThanOrEqual(overflow.clientWidth + 1);

            if (scenario.theme === 'tinyrack-dark') {
              const canvasColors = await page
                .locator(
                  `[data-component-example-id="${entry.requiredExamples[0]}"] [data-preview-layout]`,
                )
                .evaluate((element) => ({
                  actual: getComputedStyle(element).backgroundColor,
                  expected: getComputedStyle(document.documentElement)
                    .getPropertyValue('--tinyrack-canvas')
                    .trim(),
                }));
              expect(canvasColors.actual).toBe('rgb(3, 3, 3)');
              expect(canvasColors.expected).toBe('#030303');
            }
            await captureSnapshot(page, [scenario.name, 'docs', entry.id]);
          } catch (error) {
            await captureFailure(page, [scenario.name, entry.id]);
            throw error;
          }
        }

        expect(pageErrors).toEqual([]);
      } finally {
        await page.close();
      }
    });
  }

  it('renders every default component story in isolation', async () => {
    const page = await browser.newPage({ viewport: { height: 800, width: 1280 } });
    const pageErrors: string[] = [];
    page.on('pageerror', (error) => pageErrors.push(error.message));

    try {
      for (const viewport of [
        { height: 800, name: 'desktop', width: 1280 },
        { height: 844, name: 'mobile', width: 390 },
      ]) {
        await page.setViewportSize(viewport);

        for (const entry of componentDocsManifest) {
          const storyId = defaultStoryId(entry.storyId);
          try {
            await page.goto(iframeUrl(origin, storyId, 'story', 'tinyrack-dark'), {
              waitUntil: 'domcontentloaded',
            });
            await page.locator('#storybook-root > *').first().waitFor({
              state: 'attached',
            });
            expect(
              (await page.locator('body').innerText()).toLowerCase(),
            ).not.toContain('no story found');

            const height = await page.locator('html').evaluate((element) => ({
              clientHeight: element.clientHeight,
              scrollHeight: element.scrollHeight,
            }));
            expect(
              height.scrollHeight,
              `${entry.id} ${viewport.name} story height`,
            ).toBeLessThanOrEqual(height.clientHeight + 1);
            await captureSnapshot(page, [viewport.name, 'story', entry.id]);
          } catch (error) {
            await captureFailure(page, ['story', viewport.name, entry.id]);
            throw error;
          }
        }
      }

      expect(pageErrors).toEqual([]);
    } finally {
      await page.close();
    }
  });

  it('keeps fluid docs previews full-width and compound controls together', async () => {
    const page = await browser.newPage({ viewport: { height: 900, width: 900 } });

    try {
      for (const [component, example, selector] of [
        ['accordion', 'accordion-basic', '.tr-accordion'],
        ['progress', 'progress-basic', '.tr-progress'],
        ['table', 'table-basic', '.tr-table'],
        ['tabs', 'tabs-basic', '.tr-tabs'],
      ] as const) {
        await page.goto(
          iframeUrl(origin, `components-${component}--docs`, 'docs', 'tinyrack-dark'),
        );
        const frame = page.locator(
          `[data-component-example-id="${example}"] [data-preview-layout]`,
        );
        const componentRoot = frame.locator(selector).first();
        await componentRoot.waitFor({ state: 'visible' });
        const [frameBox, componentBox] = await Promise.all([
          frame.boundingBox(),
          componentRoot.boundingBox(),
        ]);
        expect(frameBox).not.toBeNull();
        expect(componentBox).not.toBeNull();
        expect(componentBox?.width).toBeGreaterThanOrEqual((frameBox?.width ?? 0) - 50);
      }

      await page.goto(
        iframeUrl(origin, 'components-combobox--default', 'story', 'tinyrack-dark'),
      );
      const inputBox = await page.getByRole('combobox').boundingBox();
      const triggerBox = await page.getByRole('button', { name: 'Open' }).boundingBox();
      expect(inputBox).not.toBeNull();
      expect(triggerBox).not.toBeNull();
      expect(Math.abs((inputBox?.y ?? 0) - (triggerBox?.y ?? 0))).toBeLessThanOrEqual(
        1,
      );
      expect((triggerBox?.x ?? 0) - (inputBox?.x ?? 0) - (inputBox?.width ?? 0)).toBe(
        8,
      );
    } finally {
      await page.close();
    }
  });

  it('switches rich example tabs and copies paste-ready React source', async () => {
    const page = await browser.newPage({ viewport: { height: 900, width: 1280 } });

    try {
      await page.goto(
        iframeUrl(origin, 'components-button--docs', 'docs', 'tinyrack-dark'),
      );
      const example = page.locator(
        '[data-component-example-id="button-appearance-variant-matrix"]',
      );
      await example.getByRole('tab', { name: 'React' }).click();
      const source = example.locator('[data-component-example-source="react"]');
      await source.waitFor({ state: 'visible' });
      const sourceText = await source.locator('pre').innerText();
      expect(sourceText).toContain('\n  <div');
      await source.getByRole('button', { name: /Copy React source/ }).click();
      await expect.poll(() => source.getByRole('button').textContent()).toBe('Copied');
    } finally {
      await page.close();
    }
  });

  it('contains every open portal surface inside the mobile viewport', async () => {
    const page = await browser.newPage({ viewport: { height: 844, width: 390 } });

    try {
      for (const [component, selector] of [
        ['alert-dialog', '.tr-alert-dialog-popup'],
        ['autocomplete', '.tr-autocomplete-popup'],
        ['combobox', '.tr-combobox-content'],
        ['context-menu', '.tr-context-menu-popup'],
        ['drawer', '.tr-drawer-popup'],
        ['menu', '.tr-menu-content'],
        ['dialog', '.tr-dialog-box'],
        ['popover', '.tr-popover-positioner'],
        ['preview-card', '.tr-preview-card-popup'],
        ['select', '.tr-select-popup'],
        ['toast', '.tr-toast-viewport'],
        ['tooltip', '.tr-tooltip-content'],
      ] as const) {
        await page.goto(
          iframeUrl(origin, `components-${component}--open`, 'story', 'tinyrack-dark'),
        );
        const surface = page.locator(selector).first();
        await surface.waitFor({ state: 'visible' });
        const box = await surface.boundingBox();
        expect(box, `${component} open surface`).not.toBeNull();
        expect(box?.x ?? -1).toBeGreaterThanOrEqual(0);
        expect(box?.y ?? -1).toBeGreaterThanOrEqual(0);
        expect((box?.x ?? 0) + (box?.width ?? 0)).toBeLessThanOrEqual(390);
        expect((box?.y ?? 0) + (box?.height ?? 0)).toBeLessThanOrEqual(844);
      }
    } finally {
      await page.close();
    }
  });

  it('preserves Base UI keyboard, portal, and selection behavior in stories', async () => {
    const page = await browser.newPage({ viewport: { height: 800, width: 1280 } });

    try {
      await page.goto(
        iframeUrl(origin, 'components-alert-dialog--docs', 'docs', 'tinyrack-dark'),
      );
      for (const exampleId of ['alert-dialog-basic', 'alert-dialog-states']) {
        const example = page.locator(`[data-component-example-id="${exampleId}"]`);
        await example.getByRole('button', { name: 'Delete rack' }).click();
        await expect(page.getByRole('alertdialog').isVisible()).resolves.toBe(true);
        await page.getByRole('button', { name: 'Cancel' }).click();
        await expect.poll(() => page.getByRole('alertdialog').isVisible()).toBe(false);
      }

      await page.goto(
        iframeUrl(origin, 'components-dialog--default', 'story', 'tinyrack-dark'),
      );
      await page.getByRole('button', { name: 'Open dialog' }).click();
      await expect(page.getByRole('dialog').isVisible()).resolves.toBe(true);
      await page.keyboard.press('Escape');
      await expect.poll(() => page.getByRole('dialog').isVisible()).toBe(false);

      await page.goto(
        iframeUrl(origin, 'components-popover--default', 'story', 'tinyrack-dark'),
      );
      await page.getByRole('button', { name: 'Rack details' }).click();
      await expect(page.getByText('All nodes online.').isVisible()).resolves.toBe(true);
      await page.getByRole('button', { name: 'Close' }).click();
      await expect
        .poll(() => page.getByText('All nodes online.').isVisible())
        .toBe(false);

      await page.goto(
        iframeUrl(origin, 'components-tabs--default', 'story', 'tinyrack-dark'),
      );
      await page.getByRole('tab', { name: 'Network' }).click();
      await expect(
        page.getByRole('tabpanel', { name: 'Network' }).textContent(),
      ).resolves.toContain('10 Gbps uplink.');

      await page.goto(
        iframeUrl(origin, 'components-combobox--default', 'story', 'tinyrack-dark'),
      );
      await page.getByRole('button', { name: 'Open' }).click();
      await page.getByRole('option', { name: 'Rack B' }).click();
      await expect(page.getByRole('combobox').inputValue()).resolves.toBe('Rack B');
    } finally {
      await page.close();
    }
  });
});
