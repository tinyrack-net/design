import { readFile, stat } from 'node:fs/promises';
import { createServer, type Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import { extname, join, resolve, sep } from 'node:path';
import { loadDocsManifest } from '@tinyrack/docs/config';
import { type Browser, chromium, type Locator, type Page } from 'playwright';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { componentDocsManifest } from '../app/content/shared/component-docs-manifest.js';
import config from '../docs.config.js';

const buildRoot = join(process.cwd(), 'build/client');
const staticDocumentRoutes = loadDocsManifest(config, {
  root: process.cwd(),
}).pages;

const contentTypes: Record<string, string> = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.pagefind': 'application/wasm',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
  '.ttf': 'font/ttf',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.xml': 'application/xml; charset=utf-8',
};

async function staticPath(requestUrl: string) {
  const pathname = decodeURIComponent(
    new URL(requestUrl, 'http://homepage.local').pathname,
  ).replaceAll('\\', '/');
  const relative = pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, '');
  const baseCandidate = resolve(buildRoot, relative);
  const rootPrefix = `${resolve(buildRoot)}${sep}`;
  if (baseCandidate !== resolve(buildRoot) && !baseCandidate.startsWith(rootPrefix)) {
    return undefined;
  }

  for (const candidate of [
    baseCandidate,
    join(baseCandidate, 'index.html'),
    `${baseCandidate}.html`,
  ]) {
    try {
      const candidateStat = await stat(candidate);
      if (candidateStat.isFile()) return candidate;
    } catch {}
  }
  return undefined;
}

async function startServer() {
  const server = createServer(async (request, response) => {
    const path = await staticPath(request.url ?? '/');
    if (path === undefined) {
      const notFound = await readFile(join(buildRoot, '404.html'));
      response.writeHead(404, { 'content-type': 'text/html; charset=utf-8' });
      response.end(notFound);
      return;
    }
    const file = await readFile(path);
    response.writeHead(200, {
      'cache-control': 'no-store',
      'content-type': contentTypes[extname(path)] ?? 'application/octet-stream',
    });
    response.end(file);
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

async function closeServer(server: Server) {
  await new Promise<void>((resolveClose, rejectClose) => {
    server.close((error) =>
      error === undefined ? resolveClose() : rejectClose(error),
    );
  });
}

async function holdRouteModule(page: Page, assetPattern: RegExp) {
  let releaseRequest = () => {};
  const requestGate = new Promise<void>((resolveRequest) => {
    releaseRequest = resolveRequest;
  });
  await page.route(assetPattern, async (route) => {
    await requestGate;
    await route.continue();
  });
  return releaseRequest;
}

async function setTheme(page: Page, theme: 'tinyrack-dark' | 'tinyrack-light') {
  await page.addInitScript((selectedTheme) => {
    localStorage.setItem('tinyrack-theme', selectedTheme);
  }, theme);
}

async function gotoHydrated(page: Page, url: string) {
  await page.goto(url);
  await page.locator('html[data-hydrated="true"]').waitFor();
}

async function expectInsideViewport(page: Page, locator: Locator) {
  await expect
    .poll(async () => {
      const box = await locator.boundingBox();
      const viewport = page.viewportSize();
      if (box === null || viewport === null) return false;

      return (
        box.x >= -1 &&
        box.y >= -1 &&
        box.x + box.width <= viewport.width + 1 &&
        box.y + box.height <= viewport.height + 1
      );
    })
    .toBe(true);
}

async function expectHorizontallyInsideViewport(page: Page, locator: Locator) {
  await expect
    .poll(async () => {
      const box = await locator.boundingBox();
      const viewport = page.viewportSize();
      if (box === null || viewport === null) return false;

      return box.x >= -1 && box.x + box.width <= viewport.width + 1;
    })
    .toBe(true);
}

async function expectVerticallyCentered(container: Locator, item: Locator) {
  const containerBox = await container.boundingBox();
  const itemBox = await item.boundingBox();
  expect(containerBox).not.toBeNull();
  expect(itemBox).not.toBeNull();

  const containerCenter = (containerBox?.y ?? 0) + (containerBox?.height ?? 0) / 2;
  const itemCenter = (itemBox?.y ?? 0) + (itemBox?.height ?? 0) / 2;
  expect(Math.abs(itemCenter - containerCenter)).toBeLessThanOrEqual(1);
}

async function expectVerticallyContained(container: Locator, item: Locator) {
  const containerBox = await container.boundingBox();
  const itemBox = await item.boundingBox();
  expect(containerBox).not.toBeNull();
  expect(itemBox).not.toBeNull();

  expect(itemBox?.y ?? 0).toBeGreaterThanOrEqual(containerBox?.y ?? 0);
  expect((itemBox?.y ?? 0) + (itemBox?.height ?? 0)).toBeLessThanOrEqual(
    (containerBox?.y ?? 0) + (containerBox?.height ?? 0),
  );
}

async function expectNoLocalOverflow(locator: Locator, label: string) {
  const overflow = await locator.evaluate((element) => ({
    clientWidth: element.clientWidth,
    scrollWidth: element.scrollWidth,
  }));
  expect(overflow.scrollWidth, label).toBeLessThanOrEqual(overflow.clientWidth + 1);
}

async function verticalGap(heading: Locator, content: Locator) {
  const headingBox = await heading.boundingBox();
  const contentBox = await content.boundingBox();
  expect(headingBox).not.toBeNull();
  expect(contentBox).not.toBeNull();
  return (contentBox?.y ?? 0) - ((headingBox?.y ?? 0) + (headingBox?.height ?? 0));
}

async function settledScrollTop(locator: Locator) {
  return locator.evaluate(async (element) => {
    let previous = element.scrollTop;
    let stableFrames = 0;
    for (let frame = 0; frame < 120; frame += 1) {
      await new Promise<void>((resolveFrame) =>
        requestAnimationFrame(() => resolveFrame()),
      );
      const current = element.scrollTop;
      stableFrames = Math.abs(current - previous) < 1 ? stableFrames + 1 : 0;
      previous = current;
      if (stableFrames >= 6) return current;
    }
    return element.scrollTop;
  });
}

async function highlightedCodeColors(locator: Locator) {
  return locator.evaluate((element) => {
    const token = element.querySelector('span');
    if (token === null) throw new Error('Highlighted CodeBlock has no token spans.');

    return {
      background: getComputedStyle(element).backgroundColor,
      token: getComputedStyle(token).color,
    };
  });
}

describe('built React Router documentation', () => {
  let browser: Browser;
  let origin: string;
  let server: Server;

  beforeAll(async () => {
    await stat(join(buildRoot, 'index.html'));
    const started = await startServer();
    origin = started.origin;
    server = started.server;
    browser = await chromium.launch();
  });

  afterAll(async () => {
    await browser?.close();
    if (server) await closeServer(server);
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
    it.concurrent(`renders every document in ${scenario.name}`, async ({ expect }) => {
      const context = await browser.newContext({ viewport: scenario.viewport });
      const page = await context.newPage();
      await setTheme(page, scenario.theme);
      const pageErrors: string[] = [];
      const consoleErrors: string[] = [];
      page.on('pageerror', (error) =>
        pageErrors.push(`${page.url()}: ${error.message}`),
      );
      page.on('console', (message) => {
        if (message.type() !== 'error') return;
        const source = message.location().url;
        consoleErrors.push(source ? `${message.text()} [${source}]` : message.text());
      });
      try {
        for (const documentRoute of staticDocumentRoutes) {
          await page.goto(`${origin}${documentRoute.path}`, {
            waitUntil: 'domcontentloaded',
          });
          await page
            .getByRole('heading', { level: 1, name: documentRoute.title })
            .waitFor();
          const componentEntry = componentDocsManifest.find(
            (entry) => documentRoute.path === `/components/${entry.id}`,
          );
          if (componentEntry !== undefined) {
            await expect(
              page.locator('[data-component-playground]').count(),
            ).resolves.toBe(1);
            await expect(
              page.locator('[data-component-example]').count(),
            ).resolves.toBeGreaterThanOrEqual(componentEntry.requiredExamples.length);
          }
          const overflow = await page.locator('html').evaluate((element) => ({
            clientWidth: element.clientWidth,
            scrollWidth: element.scrollWidth,
          }));
          expect(overflow.scrollWidth, documentRoute.path).toBeLessThanOrEqual(
            overflow.clientWidth + 1,
          );
          expect(await page.locator('html').getAttribute('data-theme')).toBe(
            scenario.theme,
          );
          await expect(page.locator('main').count()).resolves.toBe(1);
          if (scenario.name === 'dark mobile') {
            await page.keyboard.press('Escape');
            await expect
              .poll(
                () =>
                  page
                    .locator('.tr-docs-shell-header')
                    .first()
                    .getAttribute('aria-hidden'),
                { message: documentRoute.path },
              )
              .toBeNull();
            const siteNavigationTrigger = page
              .locator('.tr-docs-shell-header')
              .first()
              .getByRole('button', { name: 'Open navigation' });
            await expect
              .poll(() => siteNavigationTrigger.count(), {
                message: documentRoute.path,
                timeout: 10_000,
              })
              .toBe(1);
            await siteNavigationTrigger.click();
          }
          const currentNavigationLink = page.locator(
            '.tr-docs-sidebar-inner > nav[aria-label="Documentation"] [aria-current="page"]',
          );
          await expect
            .poll(() => currentNavigationLink.count(), {
              message: documentRoute.path,
              timeout: 10_000,
            })
            .toBe(1);
        }
        expect(pageErrors).toEqual([]);
        expect(consoleErrors).toEqual([]);
      } finally {
        await context.close();
      }
    });
  }

  it('previews adjacent documents and keeps pagination responsive', async () => {
    const desktopPage = await browser.newPage({
      viewport: { height: 900, width: 1280 },
    });
    const mobilePage = await browser.newPage({ viewport: { height: 844, width: 390 } });

    try {
      await setTheme(desktopPage, 'tinyrack-light');
      await desktopPage.goto(`${origin}/components/button`);
      const desktopViewport = desktopPage.locator('.tr-docs-shell-scroll-viewport');

      const desktopPagination = desktopPage.getByRole('navigation', {
        name: 'Previous and next documents',
      });
      const previousDocument = desktopPagination.getByRole('link', {
        name: 'Previous document: Badge',
      });
      const nextDocument = desktopPagination.getByRole('link', {
        name: 'Next document: Card',
      });

      await expect(previousDocument.getAttribute('href')).resolves.toBe(
        '/components/badge/',
      );
      await expect(nextDocument.getAttribute('href')).resolves.toBe(
        '/components/card/',
      );
      await expect(
        previousDocument.locator('.tr-document-pagination-description').textContent(),
      ).resolves.toBe('Compact status labels with semantic color and density axes.');
      await expect(
        nextDocument.locator('.tr-document-pagination-description').textContent(),
      ).resolves.toBe(
        'Structured content surfaces with semantic sections, elevation, and padding density.',
      );
      await expectNoLocalOverflow(desktopPagination, 'desktop document pagination');

      const previousBox = await previousDocument.boundingBox();
      const nextBox = await nextDocument.boundingBox();
      expect(previousBox).not.toBeNull();
      expect(nextBox).not.toBeNull();
      expect(Math.abs((previousBox?.y ?? 0) - (nextBox?.y ?? 0))).toBeLessThanOrEqual(
        1,
      );
      expect(
        await desktopViewport.evaluate((element) => {
          element.scrollTop = element.scrollHeight;
          return element.scrollTop;
        }),
      ).toBeGreaterThan(0);

      await nextDocument.click();
      await desktopPage.getByRole('heading', { level: 1, name: 'Card' }).waitFor();
      await expect.poll(() => desktopPage.url()).toBe(`${origin}/components/card/`);
      await expect
        .poll(() => desktopViewport.evaluate((element) => element.scrollTop))
        .toBe(0);

      await setTheme(mobilePage, 'tinyrack-dark');
      await mobilePage.goto(`${origin}/components/button`);
      const mobilePagination = mobilePage.getByRole('navigation', {
        name: 'Previous and next documents',
      });
      const mobilePrevious = mobilePagination.getByRole('link', {
        name: 'Previous document: Badge',
      });
      const mobileNext = mobilePagination.getByRole('link', {
        name: 'Next document: Card',
      });
      const mobilePreviousBox = await mobilePrevious.boundingBox();
      const mobileNextBox = await mobileNext.boundingBox();

      expect(mobilePreviousBox).not.toBeNull();
      expect(mobileNextBox).not.toBeNull();
      expect(mobileNextBox?.y ?? 0).toBeGreaterThanOrEqual(
        (mobilePreviousBox?.y ?? 0) + (mobilePreviousBox?.height ?? 0),
      );
      await expectNoLocalOverflow(mobilePagination, 'mobile document pagination');
      await expectNoLocalOverflow(mobilePrevious, 'mobile previous document');
      await expectNoLocalOverflow(mobileNext, 'mobile next document');
    } finally {
      await desktopPage.close();
      await mobilePage.close();
    }
  });

  it('presents Welcome as a responsive rack-console launch point', async () => {
    const desktopPage = await browser.newPage({
      viewport: { height: 1024, width: 1440 },
    });
    const mobilePage = await browser.newPage({ viewport: { height: 844, width: 390 } });
    const pageErrors: string[] = [];
    desktopPage.on('pageerror', (error) => pageErrors.push(error.message));
    mobilePage.on('pageerror', (error) => pageErrors.push(error.message));
    await setTheme(desktopPage, 'tinyrack-light');
    await setTheme(mobilePage, 'tinyrack-dark');

    try {
      await gotoHydrated(desktopPage, origin);
      await gotoHydrated(mobilePage, origin);

      const desktopHero = desktopPage.locator('[data-welcome-hero]');
      const rackStatus = desktopPage.getByRole('region', {
        name: 'Rack A production status',
      });
      const startBuilding = desktopPage.getByRole('link', {
        name: 'Start building',
      });
      const mainViewport = desktopPage.locator('.tr-docs-shell-scroll-viewport');

      await expect(
        desktopPage.getByRole('heading', { level: 1, name: 'Tinyrack UI' }).isVisible(),
      ).resolves.toBe(true);
      await expect(
        desktopHero.getByText('React 19', { exact: true }).isVisible(),
      ).resolves.toBe(true);
      await expect(
        desktopHero.getByText('Base UI', { exact: true }).isVisible(),
      ).resolves.toBe(true);
      await expect(
        desktopHero
          .getByText(`${componentDocsManifest.length} components`, {
            exact: true,
          })
          .isVisible(),
      ).resolves.toBe(true);
      await expect(
        desktopPage
          .getByText(
            'Build compact operational interfaces without rebuilding the basics.',
            { exact: true },
          )
          .isVisible(),
      ).resolves.toBe(true);

      await expect(rackStatus.isVisible()).resolves.toBe(true);
      expect(
        await rackStatus
          .getByRole('progressbar', { name: 'Cluster load' })
          .getAttribute('aria-valuenow'),
      ).toBe('41');
      for (const status of ['online', 'ready', 'complete']) {
        await expect(
          rackStatus.getByText(status, { exact: true }).isVisible(),
        ).resolves.toBe(true);
      }

      expect(await startBuilding.getAttribute('href')).toBe('#quick-start');
      expect(
        await desktopPage
          .getByRole('link', { name: 'Explore foundations' })
          .getAttribute('href'),
      ).toBe('/foundations/');
      await startBuilding.focus();
      await expect(
        startBuilding.evaluate((element) => element === document.activeElement),
      ).resolves.toBe(true);
      await startBuilding.click();
      await expect.poll(() => new URL(desktopPage.url()).hash).toBe('#quick-start');
      await expect.poll(() => settledScrollTop(mainViewport)).toBeGreaterThan(0);

      expect(await desktopPage.locator('main h1, main h2').allTextContents()).toEqual([
        'Tinyrack UI',
        'Start building in five minutes',
        'Built for operational products',
        'Choose your next step',
      ]);
      await expect(
        desktopPage.getByText('Public package map', { exact: true }).count(),
      ).resolves.toBe(0);
      for (const [name, href] of [
        ['Learn the foundations', '/foundations/'],
        ['Build an app shell', '/components/app-shell/'],
        ['Configure providers', '/integrations/base-ui-providers/'],
      ] as const) {
        expect(await desktopPage.getByRole('link', { name }).getAttribute('href')).toBe(
          href,
        );
      }

      await expectNoLocalOverflow(mobilePage.locator('html'), 'Welcome document');
      await expectNoLocalOverflow(
        mobilePage.locator('[data-welcome-hero]'),
        'Welcome hero',
      );
      await expectHorizontallyInsideViewport(
        mobilePage,
        mobilePage.locator('[data-welcome-rack]'),
      );
      await expectHorizontallyInsideViewport(
        mobilePage,
        mobilePage.locator('[data-component-install]'),
      );
      expect(await mobilePage.locator('html').getAttribute('data-theme')).toBe(
        'tinyrack-dark',
      );
      expect(pageErrors).toEqual([]);
    } finally {
      await desktopPage.close();
      await mobilePage.close();
    }
  });

  it('searches documentation with Pagefind and persists theme selection', async () => {
    const page = await browser.newPage({ viewport: { height: 900, width: 1280 } });
    const pagefindRequests: string[] = [];
    page.on('request', (request) => {
      if (request.url().includes('/pagefind/')) pagefindRequests.push(request.url());
    });
    try {
      await page.goto(origin);
      expect(pagefindRequests).toEqual([]);

      const trigger = page.getByRole('button', { name: 'Search documentation' });
      await trigger.click();
      const dialog = page.getByRole('dialog', { name: 'Search documentation' });
      const search = dialog.getByRole('combobox', { name: 'Search documentation' });
      await expectVerticallyCentered(
        dialog.locator('.tr-docs-search-heading'),
        dialog.locator('.tr-docs-search-heading > .tr-docs-search-icon'),
      );
      await expect(
        search.evaluate((element) => element === document.activeElement),
      ).resolves.toBe(true);
      await search.fill('button');
      await expect
        .poll(() =>
          dialog.locator('.tr-docs-search-result-heading strong').first().textContent(),
        )
        .toBe('Button');
      await expect(
        dialog
          .locator('.tr-docs-search-result-heading strong mark')
          .first()
          .textContent(),
      ).resolves.toBe('Button');
      expect(pagefindRequests.length).toBeGreaterThan(0);

      await page.keyboard.press('Escape');
      await expect.poll(() => dialog.isVisible()).toBe(false);
      await expect(
        trigger.evaluate((element) => element === document.activeElement),
      ).resolves.toBe(true);

      await page.keyboard.press('Control+k');
      await search.fill('getAriaValueText');
      const resultOptions = dialog.getByRole('option');
      const sliderResult = dialog.getByRole('option', { name: /Slider/ });
      await expect(
        sliderResult.locator('.tr-docs-search-result-heading strong').textContent(),
      ).resolves.toBe('Slider');
      await expect(
        sliderResult
          .locator('.tr-docs-search-result-excerpt mark')
          .first()
          .textContent(),
      ).resolves.toBe('getAriaValueText');
      const sliderIndex = await resultOptions.evaluateAll((options) =>
        options.findIndex((option) =>
          option
            .querySelector('.tr-docs-search-result-heading')
            ?.textContent?.includes('Slider'),
        ),
      );
      expect(sliderIndex).toBeGreaterThanOrEqual(0);
      await expect
        .poll(() =>
          resultOptions.evaluateAll((options) =>
            options.findIndex((option) => option.hasAttribute('data-highlighted')),
          ),
        )
        .toBe(-1);
      for (let index = 0; index <= sliderIndex; index += 1) {
        await page.keyboard.press('ArrowDown');
      }
      await expect
        .poll(() =>
          resultOptions.evaluateAll((options) =>
            options.findIndex((option) => option.hasAttribute('data-highlighted')),
          ),
        )
        .toBe(sliderIndex);
      await expect
        .poll(() => sliderResult.getAttribute('data-highlighted'))
        .not.toBeNull();
      await page.keyboard.press('Enter');
      await page.getByRole('heading', { level: 1, name: 'Slider' }).waitFor();
      await expect.poll(() => new URL(page.url()).hash).toBe('#api');
      const searchDestination = page.locator('#api');
      await expect
        .poll(async () => (await searchDestination.boundingBox())?.y ?? 0)
        .toBeGreaterThanOrEqual(60);

      await page.getByRole('button', { name: 'Use light color scheme' }).click();
      expect(await page.locator('html').getAttribute('data-theme')).toBe(
        'tinyrack-light',
      );
      await page.reload();
      expect(await page.locator('html').getAttribute('data-theme')).toBe(
        'tinyrack-light',
      );
    } finally {
      await page.close();
    }
  });

  it('keeps the matching term visible in mobile search excerpts', async () => {
    const page = await browser.newPage({ viewport: { height: 844, width: 390 } });
    try {
      await page.goto(`${origin}/components/slider`);
      await page.getByRole('button', { name: 'Search documentation' }).click();
      const dialog = page.getByRole('dialog', { name: 'Search documentation' });
      const search = dialog.getByRole('combobox', { name: 'Search documentation' });

      await search.fill('getAriaValueText');
      const sliderResult = dialog.getByRole('option', { name: /Slider/ });
      const excerpt = sliderResult.locator('.tr-docs-search-result-excerpt');
      const match = excerpt.locator('mark').first();
      await expect.poll(() => match.textContent()).toBe('getAriaValueText');
      await expectVerticallyContained(excerpt, match);
    } finally {
      await page.close();
    }
  });

  it('keeps keyboard-highlighted search results inside the scroll viewport', async () => {
    const page = await browser.newPage({ viewport: { height: 900, width: 1280 } });
    try {
      await page.goto(origin);
      await page.getByRole('button', { name: 'Search documentation' }).click();
      const dialog = page.getByRole('dialog', { name: 'Search documentation' });
      const search = dialog.getByRole('combobox', { name: 'Search documentation' });
      const scrollBody = dialog.locator('.tr-docs-search-body');
      const results = dialog.locator('.tr-docs-search-result');

      await search.fill('component');
      await expect.poll(() => results.count()).toBeGreaterThanOrEqual(8);
      await expect.poll(() => scrollBody.count()).toBe(1);
      await expect
        .poll(() =>
          scrollBody.evaluate((element) => element.scrollHeight > element.clientHeight),
        )
        .toBe(true);
      expect(
        await scrollBody.evaluate((element) => getComputedStyle(element).overflowY),
      ).toBe('auto');
      expect(await scrollBody.getAttribute('aria-label')).toBe('Search results');
      expect(await scrollBody.getAttribute('role')).toBe('listbox');
      expect(await scrollBody.evaluate((element) => element.scrollTop)).toBe(0);

      for (let index = 0; index < 8; index += 1) {
        await page.keyboard.press('ArrowDown');
      }
      const lowerHighlightedResult = dialog
        .locator('.tr-docs-search-result[data-highlighted]')
        .first();
      await expect.poll(() => lowerHighlightedResult.count()).toBe(1);
      await expectVerticallyContained(scrollBody, lowerHighlightedResult);
      const lowerScrollTop = await scrollBody.evaluate((element) => element.scrollTop);
      expect(lowerScrollTop).toBeGreaterThan(0);

      for (let index = 0; index < 7; index += 1) {
        await page.keyboard.press('ArrowUp');
      }
      const upperHighlightedResult = dialog
        .locator('.tr-docs-search-result[data-highlighted]')
        .first();
      await expectVerticallyContained(scrollBody, upperHighlightedResult);
      expect(await scrollBody.evaluate((element) => element.scrollTop)).toBeLessThan(
        lowerScrollTop,
      );

      await search.fill('button');
      await expect
        .poll(() => scrollBody.evaluate((element) => element.scrollTop))
        .toBe(0);
    } finally {
      await page.close();
    }
  });

  it('switches CodeBlock syntax colors with the site theme', async () => {
    const page = await browser.newPage({ viewport: { height: 900, width: 1280 } });
    await setTheme(page, 'tinyrack-dark');
    try {
      await page.goto(`${origin}/components/code-block`);
      const codeBlock = page.locator(
        '[data-component-example-id="code-block-basic"] [data-preview-layout] pre.tr-code-block',
      );
      await expect
        .poll(() => codeBlock.getAttribute('data-highlighted'), { timeout: 10_000 })
        .toBe('true');
      expect(await highlightedCodeColors(codeBlock)).toEqual({
        background: 'rgb(10, 12, 16)',
        token: 'rgb(255, 148, 146)',
      });
      const highlightedMarkup = await codeBlock.innerHTML();

      await page.getByRole('button', { name: 'Use light color scheme' }).click();

      await expect
        .poll(() => highlightedCodeColors(codeBlock))
        .toEqual({
          background: 'rgb(255, 255, 255)',
          token: 'rgb(160, 17, 31)',
        });
      expect(await codeBlock.innerHTML()).toBe(highlightedMarkup);
    } finally {
      await page.close();
    }
  });

  it('keeps navigation controls and foundation references usable at their target sizes', async () => {
    const mobilePage = await browser.newPage({ viewport: { height: 844, width: 390 } });
    const desktopPage = await browser.newPage({
      viewport: { height: 900, width: 1280 },
    });
    try {
      await mobilePage.goto(`${origin}/components/button`);
      const mobileSearch = mobilePage.getByRole('button', {
        name: 'Search documentation',
      });
      for (const control of [
        mobilePage.getByRole('button', { name: 'Use light color scheme' }),
        mobilePage.getByRole('button', { name: 'Open navigation' }),
        mobileSearch,
      ]) {
        const box = await control.boundingBox();
        expect(box?.width).toBeGreaterThanOrEqual(44);
        expect(box?.height).toBeGreaterThanOrEqual(44);
      }
      await mobileSearch.click();
      const mobileSearchDialog = mobilePage.getByRole('dialog', {
        name: 'Search documentation',
      });
      await expectInsideViewport(mobilePage, mobileSearchDialog);
      await expectVerticallyCentered(
        mobileSearchDialog.locator('.tr-docs-search-heading'),
        mobileSearchDialog.locator('.tr-docs-search-heading > .tr-docs-search-icon'),
      );
      await mobileSearchDialog
        .getByRole('combobox', { name: 'Search documentation' })
        .fill('switch');
      await expect
        .poll(() =>
          mobileSearchDialog
            .locator('.tr-docs-search-result-heading strong')
            .first()
            .textContent(),
        )
        .toBe('Switch');
      await mobileSearchDialog.locator('.tr-docs-search-result').first().click();
      await mobilePage.getByRole('heading', { level: 1, name: 'Switch' }).waitFor();
      await expect.poll(() => mobileSearchDialog.isVisible()).toBe(false);

      await desktopPage.goto(`${origin}/foundations/typography`);
      const search = desktopPage.getByRole('button', {
        name: 'Search documentation',
      });
      const searchBox = await search.boundingBox();
      expect(searchBox?.width).toBeGreaterThanOrEqual(200);
      const reference = desktopPage.locator('[data-foundation-reference="typography"]');
      await expect(
        reference.evaluate((element) => element.scrollWidth),
      ).resolves.toBeGreaterThan(0);
      await expect(
        reference.locator('xpath=..').getAttribute('tabindex'),
      ).resolves.toBe('0');
    } finally {
      await mobilePage.close();
      await desktopPage.close();
    }
  });

  it('keeps AppShell previews and mobile drawers within their intended geometry', async () => {
    const desktopPage = await browser.newPage({
      viewport: { height: 1000, width: 1440 },
    });
    const mobilePage = await browser.newPage({ viewport: { height: 844, width: 390 } });
    await setTheme(desktopPage, 'tinyrack-light');
    await setTheme(mobilePage, 'tinyrack-dark');

    const previewSelectors = [
      '[data-playground-preview] .tr-app-shell',
      '[data-component-example-id="app-shell-basic"] .tr-app-shell',
      '[data-component-example-id="app-shell-layouts"] .tr-app-shell',
    ];
    const expectPreviewGeometry = async (page: Page) => {
      for (const selector of previewSelectors) {
        const previews = await page.locator(selector).all();
        expect(previews.length, selector).toBeGreaterThan(0);
        for (const preview of previews) {
          const metrics = await preview.evaluate((element) => {
            const box = element.getBoundingClientRect();
            const parentBox = element.parentElement?.getBoundingClientRect();
            return {
              height: box.height,
              parentWidth: parentBox?.width ?? 0,
              width: box.width,
            };
          });
          expect(metrics.height, selector).toBe(320);
          expect(metrics.width, selector).toBeLessThanOrEqual(metrics.parentWidth + 1);
        }
      }
      await expectNoLocalOverflow(page.locator('html'), 'AppShell document');
    };
    const expectDrawerGeometry = async (page: Page, popup: Locator) => {
      await popup.waitFor();
      await popup.evaluate((element) =>
        Promise.all(element.getAnimations().map((animation) => animation.finished)),
      );
      const box = await popup.boundingBox();
      const viewport = page.viewportSize();
      expect(box).not.toBeNull();
      expect(viewport).not.toBeNull();
      expect(box?.x).toBe(0);
      expect(box?.y).toBe(0);
      expect(box?.width).toBe(288);
      expect(
        Math.abs((box?.height ?? 0) - (viewport?.height ?? 0)),
      ).toBeLessThanOrEqual(1);
      const sidebarBox = await popup
        .locator('aside.tr-app-shell-sidebar')
        .boundingBox();
      expect(sidebarBox).not.toBeNull();
      expect(sidebarBox?.x).toBe(0);
      expect(sidebarBox?.y).toBe(0);
      expect(
        Math.abs((sidebarBox?.width ?? 0) - (box?.width ?? 0)),
      ).toBeLessThanOrEqual(1);
      expect(
        Math.abs((sidebarBox?.height ?? 0) - (viewport?.height ?? 0)),
      ).toBeLessThanOrEqual(1);
    };
    const expectFocusReturned = async (trigger: Locator) => {
      await expect
        .poll(() => trigger.evaluate((element) => document.activeElement === element))
        .toBe(true);
    };
    const expectClosed = async (trigger: Locator, popup: Locator) => {
      await expect.poll(() => trigger.getAttribute('aria-expanded')).toBe('false');
      await expect.poll(() => popup.isVisible()).toBe(false);
      await expectFocusReturned(trigger);
    };

    try {
      await desktopPage.goto(`${origin}/components/app-shell`);
      await desktopPage.getByRole('heading', { level: 1, name: 'AppShell' }).waitFor();
      await expect(
        desktopPage.locator('.tr-docs-shell-header').first().isVisible(),
      ).resolves.toBe(false);
      await expectPreviewGeometry(desktopPage);
      const desktopSidebar = desktopPage
        .locator('.tr-app-shell > aside.tr-app-shell-sidebar')
        .first();
      const desktopSidebarViewport = desktopSidebar.locator(
        '.tr-app-shell-scroll-viewport',
      );
      const desktopMainViewport = desktopPage.locator('.tr-docs-shell-scroll-viewport');
      const sidebarScrollTop = await desktopSidebarViewport.evaluate((element) => {
        const maxScrollTop = element.scrollHeight - element.clientHeight;
        element.scrollTop = Math.min(160, maxScrollTop);
        return element.scrollTop;
      });
      expect(sidebarScrollTop).toBeGreaterThan(0);
      const mainViewportBox = await desktopMainViewport.boundingBox();
      expect(mainViewportBox).not.toBeNull();
      await desktopPage.mouse.move(
        (mainViewportBox?.x ?? 0) + (mainViewportBox?.width ?? 0) / 2,
        (mainViewportBox?.y ?? 0) + (mainViewportBox?.height ?? 0) / 2,
      );
      await desktopPage.mouse.wheel(0, 500);
      await expect
        .poll(() => desktopMainViewport.evaluate((element) => element.scrollTop))
        .toBeGreaterThan(0);
      const wheelScrollTop = await desktopMainViewport.evaluate(
        (element) => element.scrollTop,
      );
      await desktopMainViewport.focus();
      await desktopPage.keyboard.press('PageDown');
      await expect
        .poll(() => desktopMainViewport.evaluate((element) => element.scrollTop))
        .toBeGreaterThan(wheelScrollTop);
      const mainScrollTop = await settledScrollTop(desktopMainViewport);
      expect(await desktopPage.evaluate(() => window.scrollY)).toBe(0);
      const stickySidebarBox = await desktopSidebar.boundingBox();
      expect(stickySidebarBox).not.toBeNull();
      expect(stickySidebarBox?.y).toBe(0);
      expect(
        await desktopSidebarViewport.evaluate((element) => element.scrollTop),
      ).toBe(sidebarScrollTop);
      await desktopSidebar.getByRole('link', { name: 'Colors', exact: true }).click();
      await desktopPage.getByRole('heading', { level: 1, name: 'Colors' }).waitFor();
      await expect
        .poll(() => desktopMainViewport.evaluate((element) => element.scrollTop))
        .toBe(0);
      await desktopPage.goBack();
      await desktopPage.getByRole('heading', { level: 1, name: 'AppShell' }).waitFor();
      await expect
        .poll(() => desktopMainViewport.evaluate((element) => element.scrollTop))
        .toBe(mainScrollTop);

      await mobilePage.goto(`${origin}/components/app-shell`);
      await mobilePage.getByRole('heading', { level: 1, name: 'AppShell' }).waitFor();
      await expectPreviewGeometry(mobilePage);

      const basicExample = mobilePage.locator(
        '[data-component-example-id="app-shell-basic"]',
      );
      const staticTrigger = basicExample.locator(
        'button[aria-label="Open navigation"]',
      );
      await staticTrigger.click();
      await expect.poll(() => staticTrigger.getAttribute('aria-expanded')).toBe('true');
      const staticPopup = mobilePage.getByRole('dialog', {
        name: 'Example navigation',
      });
      await expectDrawerGeometry(mobilePage, staticPopup);
      await staticPopup.getByRole('button', { name: 'Close navigation' }).click();
      await expectClosed(staticTrigger, staticPopup);

      await staticTrigger.click();
      await staticPopup.waitFor();
      await mobilePage.keyboard.press('Escape');
      await expectClosed(staticTrigger, staticPopup);

      await staticTrigger.click();
      await staticPopup.waitFor();
      await mobilePage.mouse.click(350, 422);
      await expectClosed(staticTrigger, staticPopup);

      const siteTrigger = mobilePage
        .locator('.tr-app-shell-header')
        .first()
        .locator('button[aria-label="Open navigation"]');
      await siteTrigger.click();
      const sitePopup = mobilePage.getByRole('dialog', {
        name: 'Documentation sidebar',
      });
      await expectDrawerGeometry(mobilePage, sitePopup);
      const mobileMainViewport = mobilePage.locator('.tr-docs-shell-scroll-viewport');
      const mobileMainScrollTop = await mobileMainViewport.evaluate((element) => {
        element.scrollTop = Math.min(160, element.scrollHeight - element.clientHeight);
        return element.scrollTop;
      });
      await mobilePage.mouse.move(350, 422);
      await mobilePage.mouse.wheel(0, 300);
      expect(await mobileMainViewport.evaluate((element) => element.scrollTop)).toBe(
        mobileMainScrollTop,
      );
      expect(await mobilePage.evaluate(() => window.scrollY)).toBe(0);
      const siteSidebarBox = await sitePopup
        .locator('aside.tr-app-shell-sidebar')
        .boundingBox();
      const siteScrollbarBox = await sitePopup
        .locator('.tr-scroll-area-scrollbar[data-orientation="vertical"]')
        .boundingBox();
      expect(siteSidebarBox).not.toBeNull();
      expect(siteScrollbarBox).not.toBeNull();
      expect(
        Math.abs(
          (siteSidebarBox?.x ?? 0) +
            (siteSidebarBox?.width ?? 0) -
            ((siteScrollbarBox?.x ?? 0) + (siteScrollbarBox?.width ?? 0)),
        ),
      ).toBeLessThanOrEqual(1);
      await sitePopup.getByRole('button', { name: 'Close navigation' }).click();
      await expectClosed(siteTrigger, sitePopup);

      const playgroundTrigger = mobilePage
        .locator('[data-playground-preview]')
        .locator('button[aria-label="Open navigation"]');
      await playgroundTrigger.click();
      const playgroundPopup = mobilePage.getByRole('dialog', {
        name: 'Example navigation',
      });
      await expectDrawerGeometry(mobilePage, playgroundPopup);
      await playgroundPopup.getByRole('button', { name: 'Close navigation' }).click();
      await expectClosed(playgroundTrigger, playgroundPopup);

      const permalink = basicExample.getByRole('link', {
        name: 'Responsive shell permalink',
      });
      await permalink.click();
      await expect.poll(() => mobilePage.url()).toContain('#app-shell-basic');
      const headingBox = await basicExample
        .getByRole('heading', { level: 3, name: /Responsive shell/ })
        .boundingBox();
      expect(headingBox).not.toBeNull();
      expect(headingBox?.y).toBeGreaterThanOrEqual(56);
    } finally {
      await desktopPage.close();
      await mobilePage.close();
    }
  });

  it('keeps narrow foundation references and repaired preview canvases locally usable', async () => {
    const page = await browser.newPage({ viewport: { height: 844, width: 390 } });
    try {
      for (const foundation of ['radius', 'controls', 'elevation']) {
        await page.goto(`${origin}/foundations/${foundation}`);
        const table = page.locator(`[data-foundation-reference="${foundation}"]`);
        const scroller = table.locator('xpath=..');
        await expect(scroller.getAttribute('tabindex')).resolves.toBe('0');
        await scroller.focus();
        const before = await scroller.evaluate((element) => element.scrollLeft);
        for (let press = 0; press < 10; press += 1) {
          await page.keyboard.press('ArrowRight');
        }
        await expect
          .poll(() => scroller.evaluate((element) => element.scrollLeft))
          .toBeGreaterThan(before);
        const fragmentedCells = await table
          .locator('th, td')
          .evaluateAll(
            (cells) =>
              cells.filter((cell) => cell.scrollWidth > cell.clientWidth + 1).length,
          );
        expect(fragmentedCells).toBe(0);
      }

      for (const [path, exampleIds] of [
        ['/components/collapsible', ['collapsible-basic', 'collapsible-lifecycle']],
        [
          '/components/field',
          ['field-basic', 'field-field-states', 'field-validation'],
        ],
        [
          '/components/radio-group',
          ['radio-group-basic', 'radio-group-states', 'radio-group-validation'],
        ],
        ['/components/scroll-area', ['scroll-area-basic', 'scroll-area-states']],
        ['/components/slider', ['slider-validation']],
        ['/components/switch', ['switch-basic', 'switch-states', 'switch-validation']],
      ] as const) {
        await page.goto(`${origin}${path}`);
        for (const exampleId of exampleIds) {
          await expectNoLocalOverflow(
            page
              .locator(`[data-component-example-id="${exampleId}"]`)
              .locator('[data-preview-layout]'),
            `${path}#${exampleId}`,
          );
        }
      }

      await page.goto(`${origin}/components/radio-group`);
      const radioGroups = page.getByRole('radiogroup');
      await expect(radioGroups.count()).resolves.toBeGreaterThan(0);
      await expect(page.getByRole('radiogroup', { name: /.+/ }).count()).resolves.toBe(
        await radioGroups.count(),
      );
      const radios = page.getByRole('radio');
      await expect(page.getByRole('radio', { name: /.+/ }).count()).resolves.toBe(
        await radios.count(),
      );

      await page.goto(`${origin}/components/switch`);
      const switches = page.getByRole('switch');
      await expect(page.getByRole('switch', { name: /.+/ }).count()).resolves.toBe(
        await switches.count(),
      );
    } finally {
      await page.close();
    }
  });

  it('keeps Motion headings separated from Markdown and custom component content', async () => {
    for (const scenario of [
      {
        theme: 'tinyrack-light',
        viewport: { height: 900, width: 1440 },
      },
      {
        theme: 'tinyrack-dark',
        viewport: { height: 844, width: 390 },
      },
    ] as const) {
      const page = await browser.newPage({ viewport: scenario.viewport });
      try {
        await setTheme(page, scenario.theme);
        await page.goto(`${origin}/foundations/motion`);

        for (const [headingLevel, headingName] of [
          [1, 'Motion'],
          [3, 'Loading is a cycle'],
          [3, 'Easing changes the rhythm'],
          [3, 'Reduced motion'],
          [3, 'Durations'],
          [3, 'Easing'],
        ] as const) {
          const heading = page.getByRole('heading', {
            exact: true,
            level: headingLevel,
            name: headingName,
          });
          const content = heading.locator('xpath=following-sibling::*[1]');
          await expect
            .poll(() => verticalGap(heading, content))
            .toBeGreaterThanOrEqual(15.9);
        }
      } finally {
        await page.close();
      }
    }
  });

  it('renders the logo guide and adopted site lockup in both documentation themes', async () => {
    for (const scenario of [
      {
        expectedAsset: '/brand/tinyrack-lockup.svg',
        theme: 'tinyrack-light',
        viewport: { height: 900, width: 1440 },
      },
      {
        expectedAsset: '/brand/tinyrack-lockup-inverse.svg',
        theme: 'tinyrack-dark',
        viewport: { height: 844, width: 390 },
      },
    ] as const) {
      const page = await browser.newPage({ viewport: scenario.viewport });
      try {
        await setTheme(page, scenario.theme);
        await page.goto(`${origin}/foundations/logo`);
        await page.getByRole('heading', { level: 1, name: 'Logo' }).waitFor();

        const siteBrand = page.locator('[data-site-brand]:visible img[alt="Tinyrack"]');
        await expect.poll(() => siteBrand.count()).toBe(1);
        await expect
          .poll(
            async () =>
              new URL((await siteBrand.getAttribute('src')) ?? '', origin).pathname,
          )
          .toBe(scenario.expectedAsset);

        const downloads = page.locator('[data-logo-downloads] a[download]');
        await expect(downloads.count()).resolves.toBe(5);
        for (const image of await page.locator('main img').all()) {
          await expect
            .poll(() =>
              image.evaluate((element) => (element as HTMLImageElement).naturalWidth),
            )
            .toBeGreaterThan(0);
        }

        const minimumMark = page.getByAltText('Tinyrack mark at the 16 pixel minimum');
        const minimumLockup = page.getByAltText(
          'Tinyrack lockup at the 112 pixel minimum',
        );
        await expect
          .poll(async () => (await minimumMark.boundingBox())?.width)
          .toBe(16);
        await expect
          .poll(async () => (await minimumMark.boundingBox())?.height)
          .toBe(16);
        await expect
          .poll(async () => (await minimumLockup.boundingBox())?.width)
          .toBe(112);
        await expect
          .poll(() =>
            page
              .locator('.tr-docs-shell-content')
              .evaluate((element) => element.scrollWidth <= element.clientWidth),
          )
          .toBe(true);
      } finally {
        await page.close();
      }
    }
  });

  it('renders app icon assets, native sizes, and downloads without overflow', async () => {
    for (const scenario of [
      {
        theme: 'tinyrack-light',
        viewport: { height: 900, width: 1440 },
      },
      {
        theme: 'tinyrack-dark',
        viewport: { height: 844, width: 390 },
      },
    ] as const) {
      const page = await browser.newPage({ viewport: scenario.viewport });
      try {
        await setTheme(page, scenario.theme);
        await page.goto(`${origin}/foundations/app-icons`);
        await page.getByRole('heading', { level: 1, name: 'App icons' }).waitFor();

        const downloads = page.locator('[data-app-icon-downloads] a[download]');
        await expect(downloads.count()).resolves.toBe(12);
        await expect
          .poll(
            async () =>
              new Set(
                await downloads.evaluateAll((links) =>
                  links.map((link) => link.getAttribute('href')),
                ),
              ).size,
          )
          .toBe(12);

        for (const image of await page.locator('main img').all()) {
          await expect
            .poll(() =>
              image.evaluate((element) => (element as HTMLImageElement).naturalWidth),
            )
            .toBeGreaterThan(0);
        }

        for (const size of [16, 32, 48, 128]) {
          const previews = page.locator(`[data-app-icon-size="${size}"]`);
          await expect(previews.count()).resolves.toBe(2);
          for (const preview of await previews.all()) {
            await expect
              .poll(async () => (await preview.boundingBox())?.width)
              .toBe(size);
            await expect
              .poll(async () => (await preview.boundingBox())?.height)
              .toBe(size);
          }
        }

        await expect
          .poll(() =>
            page
              .locator('.tr-docs-shell-content')
              .evaluate((element) => element.scrollWidth <= element.clientWidth),
          )
          .toBe(true);
      } finally {
        await page.close();
      }
    }
  });

  it('closes mobile navigation on route changes and preserves browser history', async () => {
    const page = await browser.newPage({ viewport: { height: 844, width: 390 } });
    try {
      await page.goto(origin);
      await page.getByRole('button', { name: 'Open navigation' }).click();
      const navigation = page.getByRole('navigation', { name: 'Documentation' });
      await navigation.getByRole('link', { name: 'Button', exact: true }).click();
      await page.getByRole('heading', { level: 1, name: 'Button' }).waitFor();
      await expect.poll(() => navigation.isVisible()).toBe(false);
      await page.goBack();
      await page.getByRole('heading', { level: 1, name: 'Tinyrack UI' }).waitFor();
      await page.goForward();
      await page.getByRole('heading', { level: 1, name: 'Button' }).waitFor();
    } finally {
      await page.close();
    }
  });

  it('shows global and link-level feedback while a document route is loading', async () => {
    const page = await browser.newPage({ viewport: { height: 900, width: 1280 } });
    const buttonRouteModule = /\/assets\/button\.docs-[^/]+\.js$/;
    const releaseRouteModule = await holdRouteModule(page, buttonRouteModule);
    try {
      await page.goto(origin);
      const navigation = page.getByRole('navigation', { name: 'Documentation' });
      const currentLink = navigation.getByRole('link', {
        name: 'Tinyrack UI',
        exact: true,
      });
      const pendingLink = navigation.getByRole('link', {
        name: 'Button',
        exact: true,
      });
      const routeModuleRequest = page.waitForRequest(buttonRouteModule);

      await pendingLink.click();
      await routeModuleRequest;

      await page.getByRole('progressbar', { name: 'Loading page' }).waitFor();
      await expect(
        page.getByRole('heading', { level: 1, name: 'Tinyrack UI' }).isVisible(),
      ).resolves.toBe(true);
      await expect(currentLink.getAttribute('aria-current')).resolves.toBe('page');
      await expect(pendingLink.getAttribute('aria-current')).resolves.toBeNull();
      await expect(pendingLink.locator('.tr-spinner').count()).resolves.toBe(1);
      await expect(
        pendingLink.locator('.tr-spinner').getAttribute('aria-hidden'),
      ).resolves.toBe('true');
      await expect(
        page.locator('.tr-docs-shell-content').getAttribute('aria-busy'),
      ).resolves.toBe('true');

      releaseRouteModule();
      await page.getByRole('heading', { level: 1, name: 'Button' }).waitFor();

      await expect(
        page.getByRole('progressbar', { name: 'Loading page' }).count(),
      ).resolves.toBe(0);
      await expect(
        page.locator('.tr-docs-shell-content').getAttribute('aria-busy'),
      ).resolves.toBeNull();
      await expect(pendingLink.locator('.tr-spinner').count()).resolves.toBe(0);
      await expect(pendingLink.getAttribute('aria-current')).resolves.toBe('page');
      await expect(currentLink.getAttribute('aria-current')).resolves.toBeNull();
    } finally {
      releaseRouteModule();
      await page.close();
    }
  });

  it('keeps global route feedback visible after the mobile navigation closes', async () => {
    const viewport = { height: 844, width: 390 };
    const page = await browser.newPage({ viewport });
    const cardRouteModule = /\/assets\/card\.docs-[^/]+\.js$/;
    const releaseRouteModule = await holdRouteModule(page, cardRouteModule);
    try {
      await page.goto(origin);
      await page.getByRole('button', { name: 'Open navigation' }).click();
      const navigation = page.getByRole('navigation', { name: 'Documentation' });
      const routeModuleRequest = page.waitForRequest(cardRouteModule);

      await navigation.getByRole('link', { name: 'Card', exact: true }).click();
      await routeModuleRequest;

      await expect.poll(() => navigation.isVisible()).toBe(false);
      const progress = page.getByRole('progressbar', { name: 'Loading page' });
      await progress.waitFor();
      const progressBox = await progress.boundingBox();
      expect(progressBox).not.toBeNull();
      expect(progressBox?.x).toBe(0);
      expect(progressBox?.y).toBe(0);
      expect(progressBox?.width).toBe(viewport.width);
      expect(progressBox?.height).toBeGreaterThan(0);
      await expect(
        page.locator('.tr-docs-shell-content').getAttribute('aria-busy'),
      ).resolves.toBe('true');

      releaseRouteModule();
      await page.getByRole('heading', { level: 1, name: 'Card' }).waitFor();
      await expect(progress.count()).resolves.toBe(0);
      await expect(
        page.locator('.tr-docs-shell-content').getAttribute('aria-busy'),
      ).resolves.toBeNull();
    } finally {
      releaseRouteModule();
      await page.close();
    }
  });

  it('updates controls from inputs and component interaction, then resets', async () => {
    const page = await browser.newPage({ viewport: { height: 900, width: 1280 } });
    try {
      await gotoHydrated(page, `${origin}/components/toggle`);
      const preview = page.locator('[data-playground-preview]');
      const pressedControl = page
        .locator('[data-playground-control="pressed"]')
        .getByRole('checkbox');
      const toggle = preview.getByRole('button', { name: 'Bold' });
      await pressedControl.check();
      await expect(toggle.getAttribute('aria-pressed')).resolves.toBe('true');
      await toggle.click();
      await expect(pressedControl.isChecked()).resolves.toBe(false);
      await pressedControl.check();
      await page
        .locator('[data-component-playground]')
        .getByRole('button', { name: 'Reset', exact: true })
        .click();
      await expect(pressedControl.isChecked()).resolves.toBe(false);

      await gotoHydrated(page, `${origin}/components/progress`);
      const range = page
        .locator('[data-playground-control="value"]')
        .getByRole('slider');
      await range.focus();
      await range.press('Home');
      for (let value = 0; value < 72; value += 1) await range.press('ArrowRight');
      await expect(
        page
          .locator('[data-playground-preview] [role="progressbar"]')
          .getAttribute('aria-valuenow'),
      ).resolves.toBe('72');

      await gotoHydrated(page, `${origin}/components/checkbox-group`);
      const checklist = page.locator('[data-playground-control="selectedValues"]');
      await expect(checklist.getByRole('checkbox').count()).resolves.toBeGreaterThan(1);

      await gotoHydrated(page, `${origin}/components/accordion`);
      const jsonControl = page.locator('[data-playground-control="value"] textarea');
      await jsonControl.fill('not-json');
      await expect(jsonControl.getAttribute('aria-invalid')).resolves.toBe('true');

      await gotoHydrated(page, `${origin}/components/button`);
      const select = page
        .locator('[data-playground-control="variant"]')
        .getByRole('combobox');
      await select.click();
      await page.getByRole('option', { name: 'danger', exact: true }).click();
      await expect(
        page.locator('[data-playground-preview] .tr-btn').getAttribute('data-variant'),
      ).resolves.toBe('danger');

      await page.goto(`${origin}/components/checkbox`);
      const checkboxPreview = page.locator('[data-playground-preview]');
      const mixedControl = page
        .locator('[data-playground-control="indeterminate"]')
        .getByRole('checkbox');
      const checkbox = checkboxPreview.getByRole('checkbox', {
        name: 'Enable backups',
      });
      await mixedControl.check();
      await expect(checkbox.getAttribute('aria-checked')).resolves.toBe('mixed');
      await checkbox.click();
      await expect(mixedControl.isChecked()).resolves.toBe(false);
      await expect(checkbox.getAttribute('aria-checked')).resolves.toBe('false');
    } finally {
      await page.close();
    }
  });

  it('keeps stateful Playground controls synchronized in both directions', async () => {
    const page = await browser.newPage({ viewport: { height: 900, width: 1280 } });
    try {
      await gotoHydrated(page, `${origin}/components/drawer`);
      const drawerOpen = page
        .locator('[data-playground-control="open"]')
        .getByRole('checkbox');
      await drawerOpen.check();
      const drawer = page.getByRole('dialog', { name: 'Rack settings' });
      await drawer.waitFor();
      await drawer.getByRole('button', { name: 'Close', exact: true }).click();
      await expect(drawerOpen.isChecked()).resolves.toBe(false);
      const drawerLabel = page.locator('[data-playground-control="label"] input');
      await drawerLabel.fill('Open deployment settings');
      await page
        .locator('[data-component-playground]')
        .getByRole('button', { name: 'Reset', exact: true })
        .click();
      await expect(drawerOpen.isChecked()).resolves.toBe(false);
      await expect(drawerLabel.inputValue()).resolves.toBe('Open settings');

      await gotoHydrated(page, `${origin}/components/form`);
      const formValue = page.locator('[data-playground-control="value"] input');
      const rackInput = page
        .locator('[data-playground-preview]')
        .getByRole('textbox', { name: 'Rack name' });
      await formValue.fill('rack-beta');
      await expect(rackInput.inputValue()).resolves.toBe('rack-beta');
      await rackInput.fill('rack-gamma');
      await expect(formValue.inputValue()).resolves.toBe('rack-gamma');
      await page
        .locator('[data-component-playground]')
        .getByRole('button', { name: 'Reset', exact: true })
        .click();
      await expect(rackInput.inputValue()).resolves.toBe('rack-alpha');

      await gotoHydrated(page, `${origin}/components/number-field`);
      const numberValue = page.locator('[data-playground-control="value"] input');
      const replicas = page
        .locator('[data-playground-preview]')
        .getByRole('textbox', { name: 'Replicas' });
      await numberValue.fill('7');
      await expect(replicas.inputValue()).resolves.toBe('7');
      await replicas.focus();
      await page.keyboard.press('ArrowUp');
      await expect(numberValue.inputValue()).resolves.toBe('8');
      await page
        .locator('[data-component-playground]')
        .getByRole('button', { name: 'Reset', exact: true })
        .click();
      await expect(replicas.inputValue()).resolves.toBe('3');

      await gotoHydrated(page, `${origin}/components/otp-field`);
      const otpValue = page.locator('[data-playground-control="value"] input');
      const otpInputs = page.locator('[data-playground-preview] .tr-otp-field-digit');
      await otpValue.fill('1234');
      await expect
        .poll(() =>
          otpInputs.evaluateAll((inputs) =>
            inputs.map((input) => (input as HTMLInputElement).value).join(''),
          ),
        )
        .toBe('1234');
      await otpValue.fill('');
      await otpInputs.first().focus();
      await page.keyboard.type('2468');
      await expect(otpValue.inputValue()).resolves.toBe('2468');
      await page
        .locator('[data-component-playground]')
        .getByRole('button', { name: 'Reset', exact: true })
        .click();
      await expect(otpValue.inputValue()).resolves.toBe('');

      await gotoHydrated(page, `${origin}/components/select`);
      const selectValue = page
        .locator('[data-playground-control="value"]')
        .getByRole('combobox');
      const selectOpen = page
        .locator('[data-playground-control="open"]')
        .getByRole('checkbox');
      const selectTrigger = page
        .locator('[data-playground-preview]')
        .getByRole('combobox', { name: 'Deployment rack' });
      await selectValue.click();
      await page.getByRole('option', { name: 'beta', exact: true }).click();
      await expect(selectTrigger.textContent()).resolves.toContain('Rack Beta');
      await selectTrigger.click();
      await expect.poll(() => selectOpen.isChecked()).toBe(true);
      await page.getByRole('option', { name: 'Staging rack' }).click();
      await expect.poll(() => selectValue.textContent()).toContain('staging');
      await expect.poll(() => selectOpen.isChecked()).toBe(false);
      await page
        .locator('[data-component-playground]')
        .getByRole('button', { name: 'Reset', exact: true })
        .click();
      await expect.poll(() => selectValue.textContent()).toContain('alpha');

      await gotoHydrated(page, `${origin}/components/slider`);
      const sliderValue = page
        .locator('[data-playground-control="value"]')
        .getByRole('spinbutton');
      const sliderThumb = page
        .locator('[data-playground-preview]')
        .getByRole('slider', { name: 'Volume' });
      await sliderValue.fill('72');
      await expect(sliderThumb.getAttribute('aria-valuenow')).resolves.toBe('72');
      await sliderThumb.focus();
      await page.keyboard.press('ArrowRight');
      await expect(sliderValue.inputValue()).resolves.toBe('73');
      await page
        .locator('[data-component-playground]')
        .getByRole('button', { name: 'Reset', exact: true })
        .click();
      await expect(sliderValue.inputValue()).resolves.toBe('48');

      await gotoHydrated(page, `${origin}/components/switch`);
      const switchChecked = page
        .locator('[data-playground-control="checked"]')
        .getByRole('checkbox');
      const switchControl = page
        .locator('[data-playground-preview]')
        .getByRole('switch', { name: 'Automatic updates' });
      await switchChecked.uncheck();
      await expect(switchControl.isChecked()).resolves.toBe(false);
      await switchControl.click();
      await expect(switchChecked.isChecked()).resolves.toBe(true);
      await page
        .locator('[data-component-playground]')
        .getByRole('button', { name: 'Reset', exact: true })
        .click();
      await expect(switchChecked.isChecked()).resolves.toBe(true);

      await gotoHydrated(page, `${origin}/components/toggle-group`);
      const groupValue = page.locator('[data-playground-control="value"] textarea');
      const group = page
        .locator('[data-playground-preview]')
        .getByRole('group', { name: 'Text alignment' });
      await groupValue.fill('["center"]');
      await expect
        .poll(() =>
          group.getByRole('button', { name: 'Center' }).getAttribute('aria-pressed'),
        )
        .toBe('true');
      await group.getByRole('button', { name: 'End' }).click();
      await expect.poll(() => groupValue.inputValue()).toContain('end');
      await page
        .locator('[data-component-playground]')
        .getByRole('button', { name: 'Reset', exact: true })
        .click();
      await expect.poll(() => groupValue.inputValue()).toContain('start');
    } finally {
      await page.close();
    }
  });

  it('keeps code examples, dialogs, selects, and mobile navigation interactive', async () => {
    const page = await browser.newPage({ viewport: { height: 844, width: 390 } });
    try {
      await page.context().grantPermissions(['clipboard-read', 'clipboard-write'], {
        origin,
      });
      await page.goto(`${origin}/components/button`);
      const example = page.locator('[data-component-example-id="button-basic"]');
      await example.getByRole('tab', { name: 'React' }).click();
      await expect(
        example.locator('[data-component-example-source="react"]').isVisible(),
      ).resolves.toBe(true);
      const copyButton = example.getByRole('button', {
        name: 'Copy React source for Basic action',
      });
      await copyButton.click();
      await expect.poll(() => copyButton.textContent()).toContain('Copied');

      await page.goto(`${origin}/components/dialog`);
      await page
        .locator('[data-component-example-id="dialog-basic"]')
        .getByRole('button', { name: 'Open dialog' })
        .click();
      await expect(page.getByRole('dialog').isVisible()).resolves.toBe(true);
      await expectInsideViewport(page, page.getByRole('dialog'));
      await page.keyboard.press('Escape');
      await expect.poll(() => page.getByRole('dialog').isVisible()).toBe(false);

      await page.goto(`${origin}/components/select`);
      await page
        .locator('[data-component-example-id="select-basic"]')
        .getByRole('combobox')
        .click();
      await expectInsideViewport(page, page.locator('.tr-select-popup'));
      await page.getByRole('option', { name: 'Rack Beta' }).click();

      await page.goto(`${origin}/components/toast`);
      await page
        .locator('[data-component-example-id="toast-basic"]')
        .getByRole('button', { name: 'Show toast' })
        .click();
      await page.locator('.tr-toast').waitFor();
      await expectInsideViewport(page, page.locator('.tr-toast'));

      await page.goto(origin);
      await page.getByRole('button', { name: 'Open navigation' }).click();
      await expect(
        page.getByRole('navigation', { name: 'Documentation' }).isVisible(),
      ).resolves.toBe(true);
    } finally {
      await page.close();
    }
  });

  it('opens ContextMenu rack commands from pointer, keyboard, and touch fallback', async () => {
    const page = await browser.newPage({ viewport: { height: 900, width: 1280 } });
    await setTheme(page, 'tinyrack-light');
    try {
      await page.goto(`${origin}/components/context-menu`);
      const example = page.locator('[data-component-example-id="context-menu-basic"]');
      const target = example.getByRole('button', {
        name: 'Rack Alpha, online rack. Open context menu for actions.',
      });
      const moreActions = example.getByRole('button', {
        name: 'Open actions for Rack Alpha',
      });
      const openPopup = page.locator('.tr-context-menu-popup[data-open]').first();

      await target.focus();
      const targetBox = await target.boundingBox();
      expect(targetBox).not.toBeNull();
      await target.click({
        button: 'right',
        position: {
          x: (targetBox?.width ?? 0) - 8,
          y: (targetBox?.height ?? 0) / 2,
        },
      });
      await openPopup.waitFor();
      await expectInsideViewport(page, openPopup);
      const pointerPopupBox = await openPopup.boundingBox();
      expect(pointerPopupBox?.x ?? 0).toBeGreaterThanOrEqual(targetBox?.x ?? 0);
      expect(pointerPopupBox?.x ?? 0).toBeLessThanOrEqual(
        (targetBox?.x ?? 0) + (targetBox?.width ?? 0),
      );
      const pointerCommands = await openPopup.getByRole('menuitem').allTextContents();
      await openPopup.getByRole('menuitem', { name: 'Copy address' }).click();
      await expect
        .poll(() => example.locator('output[aria-live="polite"]').textContent())
        .toContain('10.42.0.18 copied.');
      await expect
        .poll(() => target.evaluate((element) => document.activeElement === element))
        .toBe(true);

      await target.click({ button: 'right' });
      await openPopup.waitFor();
      await page.keyboard.press('Escape');
      await expect.poll(() => openPopup.isVisible()).toBe(false);
      await expect
        .poll(() => target.evaluate((element) => document.activeElement === element))
        .toBe(true);

      await page.keyboard.press('Shift+F10');
      await openPopup.waitFor();
      await page.keyboard.press('Escape');
      await expect
        .poll(() => target.evaluate((element) => document.activeElement === element))
        .toBe(true);

      await moreActions.click();
      await openPopup.waitFor();
      await expect(openPopup.getByRole('menuitem').allTextContents()).resolves.toEqual(
        pointerCommands,
      );
      await openPopup.getByRole('menuitem', { name: 'Restart' }).click();
      await expect
        .poll(() => example.locator('output[aria-live="polite"]').textContent())
        .toContain('Restart requested for Rack Alpha.');
      await expect
        .poll(() =>
          moreActions.evaluate((element) => document.activeElement === element),
        )
        .toBe(true);
    } finally {
      await page.close();
    }
  });

  it('accepts complex popup and menu contracts at mobile bounds', async () => {
    const page = await browser.newPage({ viewport: { height: 844, width: 390 } });
    try {
      await page.goto(`${origin}/components/menubar`);
      const menubarExample = page.locator(
        '[data-component-example-id="menubar-states"]',
      );
      const fileMenu = menubarExample.getByRole('menuitem', { name: 'File' });
      const editMenu = menubarExample.getByRole('menuitem', { name: 'Edit' });
      await fileMenu.focus();
      await page.keyboard.press('ArrowRight');
      await expect(
        editMenu.evaluate((element) => document.activeElement === element),
      ).resolves.toBe(true);
      await page.keyboard.press('Enter');
      const menuPopup = page.locator('.tr-menu-content[data-open]');
      await menuPopup.waitFor();
      await expectInsideViewport(page, menuPopup);
      await page.keyboard.press('Escape');
      await expect
        .poll(() => editMenu.evaluate((element) => document.activeElement === element))
        .toBe(true);

      await page.goto(`${origin}/components/navigation-menu`);
      const responsiveNavigation = page.locator(
        '[data-component-example-id="navigation-menu-states"]',
      );
      const openNavigation = responsiveNavigation.getByRole('button', {
        name: 'Open site navigation',
      });
      await expect(openNavigation.isVisible()).resolves.toBe(true);
      await openNavigation.click();
      const mobileNavigation = page.getByRole('navigation', {
        name: 'Mobile site navigation',
      });
      await mobileNavigation.waitFor();
      await expectInsideViewport(page, mobileNavigation);
      await expect(
        mobileNavigation.getByRole('link', { name: 'Guides' }).isVisible(),
      ).resolves.toBe(true);
      await page.getByRole('button', { name: 'Close navigation' }).click();
      await expect.poll(() => mobileNavigation.isVisible()).toBe(false);

      await page.goto(`${origin}/components/tooltip`);
      const tooltipExample = page.locator(
        '[data-component-example-id="tooltip-basic"]',
      );
      const tooltipTrigger = tooltipExample.getByRole('button', {
        name: 'Rack temperature',
      });
      await tooltipTrigger.scrollIntoViewIfNeeded();
      await tooltipTrigger.focus();
      await expect
        .poll(() => tooltipTrigger.getAttribute('aria-describedby'))
        .not.toBeNull();
      const tooltipId = await tooltipTrigger.getAttribute('aria-describedby');
      const tooltip = page.locator(`[id="${tooltipId}"]`);
      await tooltip.waitFor();
      await expectInsideViewport(page, tooltip);
      await expect(tooltipTrigger.getAttribute('aria-describedby')).resolves.toBe(
        await tooltip.getAttribute('id'),
      );
      await page.keyboard.press('Escape');
      await expect.poll(() => tooltip.isVisible()).toBe(false);
      await expect
        .poll(() =>
          tooltipTrigger.evaluate((element) => document.activeElement === element),
        )
        .toBe(true);

      await page.goto(`${origin}/components/alert-dialog`);
      const alertTrigger = page
        .locator('[data-component-example-id="alert-dialog-basic"]')
        .getByRole('button', { name: 'Delete rack' });
      await alertTrigger.click();
      const alertDialog = page.getByRole('alertdialog', { name: 'Delete rack?' });
      await alertDialog.waitFor();
      await expectInsideViewport(page, alertDialog);
      await expect(
        alertDialog
          .getByRole('button', { name: 'Cancel' })
          .evaluate((element) => document.activeElement === element),
      ).resolves.toBe(true);
      await page.keyboard.press('Escape');
      await expect.poll(() => alertDialog.isVisible()).toBe(false);
      await expect
        .poll(() =>
          alertTrigger.evaluate((element) => document.activeElement === element),
        )
        .toBe(true);

      await page.goto(`${origin}/components/drawer`);
      const drawerTrigger = page
        .locator('[data-component-example-id="drawer-basic"]')
        .getByRole('button', { name: 'Open settings' });
      await drawerTrigger.click();
      const drawer = page.getByRole('dialog', { name: 'Rack settings' });
      await drawer.waitFor();
      await drawer.evaluate((element) =>
        Promise.all(element.getAnimations().map((animation) => animation.finished)),
      );
      await expectInsideViewport(page, drawer);
      await page.keyboard.press('Escape');
      await expect.poll(() => drawer.isVisible()).toBe(false);
      await expect
        .poll(() =>
          drawerTrigger.evaluate((element) => document.activeElement === element),
        )
        .toBe(true);

      await page.goto(`${origin}/components/preview-card`);
      const previewTrigger = page
        .locator('[data-component-example-id="preview-card-states"]')
        .getByRole('link', { name: 'Rack Beta' });
      await previewTrigger.focus();
      const previewCard = page
        .locator('.tr-preview-card-popup[data-open]')
        .filter({ hasText: 'Rack Beta' });
      await previewCard.waitFor();
      await previewCard.evaluate((element) =>
        Promise.all(element.getAnimations().map((animation) => animation.finished)),
      );
      const previewBox = await previewCard.boundingBox();
      const previewViewport = page.viewportSize();
      expect(previewBox).not.toBeNull();
      expect(previewViewport).not.toBeNull();
      expect((previewBox?.x ?? -2) >= -1).toBe(true);
      expect((previewBox?.y ?? -2) >= -1).toBe(true);
      expect(
        (previewBox?.x ?? 0) + (previewBox?.width ?? 0) <=
          (previewViewport?.width ?? 0) + 1,
      ).toBe(true);
      await expect
        .poll(async () => {
          const settledBox = await previewCard.boundingBox();
          return (
            (settledBox?.y ?? 0) + (settledBox?.height ?? 0) <=
            (previewViewport?.height ?? 0) + 1
          );
        })
        .toBe(true);
      await expect(
        previewCard.getByRole('link', { name: 'View incidents' }).isVisible(),
      ).resolves.toBe(true);
      await page.keyboard.press('Escape');
      await expect.poll(() => previewCard.isVisible()).toBe(false);
      await expect
        .poll(() =>
          previewTrigger.evaluate((element) => document.activeElement === element),
        )
        .toBe(true);
    } finally {
      await page.close();
    }
  });

  it('01-32 preserves the reviewed component and documentation geometry', async () => {
    const page = await browser.newPage({
      colorScheme: 'dark',
      viewport: { height: 844, width: 390 },
    });
    try {
      await page.goto(`${origin}/components/accordion`);
      await expect
        .poll(() =>
          page.evaluate(
            () =>
              document.documentElement.scrollWidth <=
              document.documentElement.clientWidth,
          ),
        )
        .toBe(true);
      const accordionPreview = page.locator(
        '[data-component-example-id="accordion-basic"] [data-component-example-preview-frame]',
      );
      await expect
        .poll(() =>
          accordionPreview.evaluate(
            (element) => element.scrollWidth <= element.clientWidth,
          ),
        )
        .toBe(true);
      const accordionPlaygroundViewport = page.locator(
        '[data-component-playground] [data-playground-preview] .tr-scroll-area-viewport',
      );
      const accordionOverflowers = await accordionPlaygroundViewport.evaluate(
        (element) => {
          const rootRect = element.getBoundingClientRect();
          return [...element.querySelectorAll<HTMLElement>('*')]
            .map((child) => ({
              className: child.className,
              clientWidth: child.clientWidth,
              right: Math.round(child.getBoundingClientRect().right - rootRect.right),
              scrollWidth: child.scrollWidth,
            }))
            .filter(
              (child) => child.right > 1 || child.scrollWidth > child.clientWidth + 1,
            );
        },
      );
      expect(accordionOverflowers).toEqual([]);

      await page.goto(`${origin}/components/alert`);
      const contract = page.locator('.tr-mdx-table[data-contract-table]').first();
      await expect.poll(() => contract.locator('td').count()).toBeGreaterThan(0);
      await expect
        .poll(() =>
          contract
            .locator('td')
            .evaluateAll((cells) =>
              cells.every(
                (cell) =>
                  cell.children.length === 1 &&
                  cell.firstElementChild?.classList.contains('tr-mdx-contract-value'),
              ),
            ),
        )
        .toBe(true);
      const contractContainer = contract.locator('xpath=..');
      await expect
        .poll(() =>
          contractContainer.evaluate((element) => getComputedStyle(element).overflowX),
        )
        .not.toBe('visible');
      const compactAlert = page.locator(
        '[data-component-example-id="alert-actions"] [data-component-example-preview-frame]',
      );
      await expect
        .poll(() =>
          compactAlert.evaluate((element) =>
            Number.parseFloat(getComputedStyle(element).paddingTop),
          ),
        )
        .toBeLessThanOrEqual(16);

      await page.goto(`${origin}/components/checkbox`);
      const booleanControl = page.locator('[data-control-kind="boolean"]').first();
      const booleanLabel = booleanControl.locator('label');
      const booleanCheckbox = booleanControl.locator('.tr-checkbox');
      await expect.poll(() => booleanLabel.count()).toBe(1);
      await expect
        .poll(async () => {
          const [labelBox, checkboxBox] = await Promise.all([
            booleanLabel.boundingBox(),
            booleanCheckbox.boundingBox(),
          ]);
          return Math.abs(
            (labelBox?.y ?? 0) +
              (labelBox?.height ?? 0) / 2 -
              ((checkboxBox?.y ?? 0) + (checkboxBox?.height ?? 0) / 2),
          );
        })
        .toBeLessThan(4);

      for (const [route, removed] of [
        ['code', ['containerWidth']],
        ['combobox', ['disabledOption', 'selected']],
        ['dialog', ['description', 'size']],
      ] as const) {
        await page.goto(`${origin}/components/${route}`);
        for (const control of removed) {
          await expect(
            page.locator(`[data-playground-control="${control}"]`).count(),
          ).resolves.toBe(0);
        }
      }

      await page.goto(`${origin}/components/menu`);
      const detachedErrors: string[] = [];
      page.on('pageerror', (error) => detachedErrors.push(error.message));
      const detachedExample = page.locator('[data-component-example-id="menu-handle"]');
      const detachedTrigger = detachedExample.getByRole('button', {
        name: 'Detached rack actions',
      });
      await detachedTrigger.click();
      await page.waitForTimeout(300);
      expect({
        errors: detachedErrors,
        heading: await page.locator('h1').textContent(),
        triggerCount: await detachedTrigger.count(),
        url: page.url(),
        openPopups: await page.locator('.tr-menu-content[data-open]').count(),
      }).toEqual({
        errors: [],
        heading: 'Menu',
        openPopups: 1,
        triggerCount: 1,
        url: `${origin}/components/menu`,
      });
      const detachedPopup = page.locator('.tr-menu-content[data-open]');
      await detachedPopup.waitFor();
      await detachedPopup.getByRole('menuitem', { name: 'Inspect rack' }).click();
      await expect(
        detachedExample.getByRole('status').textContent(),
      ).resolves.toContain('Rack Delta inspected');

      await page.setViewportSize({ height: 900, width: 1440 });
      await page.goto(`${origin}/components/app-shell`);
      const appShellFrame = page.locator('[data-playground-preview-frame]');
      const appShell = appShellFrame.locator('.tr-app-shell');
      await expect
        .poll(async () => {
          const [frameBox, shellBox] = await Promise.all([
            appShellFrame.boundingBox(),
            appShell.boundingBox(),
          ]);
          return Math.abs((frameBox?.width ?? 0) - (shellBox?.width ?? 0));
        })
        .toBeLessThan(2);

      await page.goto(`${origin}/components/number-field`);
      const numberPreview = page
        .locator('[data-component-example-id="number-field-basic"] .tr-scroll-area')
        .first();
      const numberFrame = numberPreview.locator(
        '[data-component-example-preview-frame]',
      );
      await expect
        .poll(async () => {
          const [rootBox, frameBox] = await Promise.all([
            numberPreview.boundingBox(),
            numberFrame.boundingBox(),
          ]);
          return (
            (rootBox?.x ?? 0) +
            (rootBox?.width ?? 0) -
            ((frameBox?.x ?? 0) + (frameBox?.width ?? 0))
          );
        })
        .toBeGreaterThanOrEqual(0);

      await page.goto(`${origin}/components/context-menu`);
      const contextExample = page.locator(
        '[data-component-example-id="context-menu-basic"]',
      );
      await contextExample.getByRole('button', { name: /Open actions/ }).click();
      const contextBackdrop = page.locator('.tr-context-menu-backdrop[data-open]');
      await contextBackdrop.waitFor();
      await expect
        .poll(() =>
          contextBackdrop.evaluate(
            (element) => getComputedStyle(element).backgroundColor,
          ),
        )
        .toBe('rgba(0, 0, 0, 0)');

      await page.goto(`${origin}/components/navigation-menu`);
      await expect(
        page.getByRole('link', { name: 'Tinyrack Cloud' }).first().isVisible(),
      ).resolves.toBe(true);
      const product = page.getByRole('button', { name: /Product/ }).first();
      await product.press('Enter');
      await expect(
        page
          .getByRole('link', { name: /Deployments/ })
          .last()
          .isVisible(),
      ).resolves.toBe(true);

      await page.goto(`${origin}/components/toolbar`);
      const bold = page.getByRole('button', { name: 'Bold' }).first();
      const boldBox = await bold.boundingBox();
      expect(Math.round(boldBox?.width ?? 0)).toBe(32);
      expect(Math.round(boldBox?.height ?? 0)).toBe(32);

      await page.setViewportSize({ height: 844, width: 390 });
      await page.goto(`${origin}/components/drawer`);
      const drawerTrigger = page
        .locator('[data-component-playground]')
        .getByRole('button', { name: 'Open settings' });
      await drawerTrigger.click();
      const drawer = page.getByRole('dialog', { name: 'Rack settings' });
      await drawer.waitFor();
      await expect(
        page.getByRole('button', { name: 'Close' }).last().isVisible(),
      ).resolves.toBe(true);
      await expectInsideViewport(page, drawer);
    } finally {
      await page.close();
    }
  });
});
