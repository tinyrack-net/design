import { mkdir, readFile, rm, stat } from 'node:fs/promises';
import { createServer, type Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import { extname, join, resolve, sep } from 'node:path';
import { type Browser, chromium, type Locator, type Page } from 'playwright';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { componentDocsManifest } from '../stories/shared/component-docs-manifest.js';

const repoRoot = process.cwd();
const storybookRoot = join(repoRoot, 'storybook-static');
const artifactRoot = join(repoRoot, 'artifacts', 'storybook-docs');

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

  const address = server.address() as AddressInfo;

  return {
    origin: `http://127.0.0.1:${address.port}`,
    server,
  };
}

async function closeStaticServer(server: Server) {
  await new Promise<void>((resolveClose, rejectClose) => {
    server.close((error) => {
      if (error === undefined) {
        resolveClose();
        return;
      }

      rejectClose(error);
    });
  });
}

function docsUrl(origin: string, storyId: string, theme: StorybookTheme) {
  const search = new URLSearchParams({
    globals: `theme:${theme}`,
    id: storyId,
    viewMode: 'docs',
  });

  return `${origin}/iframe.html?${search}`;
}

function storyUrl(origin: string, storyId: string, theme: StorybookTheme) {
  const search = new URLSearchParams({
    globals: `theme:${theme}`,
    id: storyId,
    viewMode: 'story',
  });

  return `${origin}/iframe.html?${search}`;
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

async function horizontalOverflowMetrics(locator: Locator) {
  await locator.waitFor({ state: 'visible' });

  return locator.evaluate((element) => {
    const htmlElement = element as HTMLElement;

    return {
      clientWidth: htmlElement.clientWidth,
      overflowX: window.getComputedStyle(htmlElement).overflowX,
      scrollWidth: htmlElement.scrollWidth,
    };
  });
}

type StorybookTheme = 'tinyrack-dark' | 'tinyrack-light';

const renderScenarios = [
  {
    name: 'dark desktop',
    theme: 'tinyrack-dark',
    viewport: { height: 900, width: 1440 },
  },
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
  {
    name: 'light mobile',
    theme: 'tinyrack-light',
    viewport: { height: 844, width: 390 },
  },
] as const satisfies ReadonlyArray<{
  name: string;
  theme: StorybookTheme;
  viewport: { height: number; width: number };
}>;

const guidedDocsManifest = [
  {
    headings: [
      'Principles',
      'Start in 5 minutes',
      'Build one operational surface',
      'Where next',
      'Package map',
      'Primitive component paths',
      'Use boundary',
    ],
    id: 'welcome',
    storyId: 'welcome-start-here--docs',
    title: 'Tinyrack UI',
  },
  {
    headings: ['Model', 'System in one surface', 'Consumption', 'Next'],
    id: 'foundations-overview',
    storyId: 'foundations-overview--docs',
    title: 'Foundations',
  },
  {
    headings: [
      'Principle',
      'Visual scale',
      'Applied pattern',
      'Implementation',
      'Reference',
    ],
    id: 'foundations-colors',
    reference: 'colors',
    storyId: 'foundations-colors--docs',
    title: 'Colors',
  },
  {
    headings: [
      'Principle',
      'Visual scale',
      'Applied pattern',
      'Implementation',
      'Reference',
    ],
    id: 'foundations-typography',
    reference: 'typography',
    storyId: 'foundations-typography--docs',
    title: 'Typography',
  },
  {
    headings: [
      'Principle',
      'Visual scale',
      'Applied pattern',
      'Implementation',
      'Reference',
    ],
    id: 'foundations-spacing',
    reference: 'spacing',
    storyId: 'foundations-spacing--docs',
    title: 'Spacing',
  },
  {
    headings: [
      'Principle',
      'Visual scale',
      'Applied pattern',
      'Implementation',
      'Reference',
    ],
    id: 'foundations-radius',
    reference: 'radius',
    storyId: 'foundations-radius--docs',
    title: 'Radius',
  },
  {
    headings: [
      'Principle',
      'Visual scale',
      'Applied pattern',
      'Implementation',
      'Reference',
    ],
    id: 'foundations-controls',
    reference: 'controls',
    storyId: 'foundations-controls--docs',
    title: 'Controls',
  },
  {
    headings: [
      'Principle',
      'Visual scale',
      'Applied pattern',
      'Implementation',
      'Reference',
    ],
    id: 'foundations-motion',
    reference: 'motion',
    storyId: 'foundations-motion--docs',
    title: 'Motion',
  },
  {
    headings: [
      'Principle',
      'Visual scale',
      'Applied pattern',
      'Implementation',
      'Reference',
    ],
    id: 'foundations-elevation',
    reference: 'elevation',
    storyId: 'foundations-elevation--docs',
    title: 'Elevation',
  },
] as const;

const deepInteractionPages = new Set([
  'button',
  'code-block',
  'form-input',
  'table',
  'tabs',
]);

describe('built Storybook component docs', () => {
  let browser: Browser | undefined;
  let origin = '';
  let staticServer: Server | undefined;

  beforeAll(async () => {
    expect(
      await stat(join(storybookRoot, 'iframe.html')).then(
        () => true,
        () => false,
      ),
      'Run `pnpm storybook:build` before the Storybook docs browser audit.',
    ).toBe(true);

    await rm(artifactRoot, { force: true, recursive: true });

    const startedServer = await startStaticServer();
    origin = startedServer.origin;
    staticServer = startedServer.server;

    try {
      browser = await chromium.launch({ headless: true });
    } catch (error) {
      await closeStaticServer(startedServer.server);
      staticServer = undefined;
      throw error;
    }
  });

  afterAll(async () => {
    await browser?.close();

    if (staticServer !== undefined) {
      await closeStaticServer(staticServer);
    }
  });

  for (const scenario of renderScenarios) {
    it(`renders every component page in ${scenario.name}`, async () => {
      if (browser === undefined) {
        throw new Error('Chromium did not start.');
      }

      const context = await browser.newContext({ viewport: scenario.viewport });
      const page = await context.newPage();

      try {
        for (const entry of componentDocsManifest) {
          try {
            await page.goto(docsUrl(origin, entry.storyId, scenario.theme), {
              waitUntil: 'domcontentloaded',
            });
            const docs = page.locator('.sbdocs-content');

            await docs
              .getByRole('heading', { exact: true, level: 1, name: entry.title })
              .waitFor();

            expect(await page.locator('html').getAttribute('data-theme')).toBe(
              scenario.theme,
            );
            expect(await docs.locator('h1').allTextContents()).toEqual([entry.title]);
            expect(
              await docs
                .locator('h2')
                .evaluateAll((headings) =>
                  headings
                    .filter(
                      (heading) => heading.closest('[data-component-example]') === null,
                    )
                    .map((heading) => heading.textContent ?? ''),
                ),
            ).toEqual([
              'Contract',
              'Install',
              'Usage',
              'Examples',
              'Guidance',
              'API',
              'CSS tokens',
            ]);

            const sectionGaps = await page.evaluate(() =>
              Array.from(document.querySelectorAll<HTMLElement>('.sbdocs-content h2'))
                .filter(
                  (heading) => heading.closest('[data-component-example]') === null,
                )
                .flatMap((heading) => {
                  const nextElement = heading.nextElementSibling;

                  if (!(nextElement instanceof HTMLElement)) {
                    return [];
                  }

                  return [
                    {
                      gap:
                        nextElement.getBoundingClientRect().top -
                        heading.getBoundingClientRect().bottom,
                      heading: heading.textContent?.trim() ?? '',
                    },
                  ];
                }),
            );

            expect(sectionGaps).toHaveLength(7);

            for (const sectionGap of sectionGaps) {
              expect(
                sectionGap.gap,
                `${entry.id} ${scenario.name} ${sectionGap.heading} spacing`,
              ).toBeGreaterThanOrEqual(15.5);
            }

            const exampleCount = await docs.locator('[data-component-example]').count();
            expect(exampleCount).toBeGreaterThanOrEqual(entry.requiredExamples.length);

            const sourceCount = await docs
              .locator('[data-component-example-source]')
              .count();
            expect(sourceCount).toBeGreaterThanOrEqual(exampleCount * 2);
            await expect
              .poll(
                () =>
                  docs
                    .locator(
                      '[data-component-example-source] pre[data-highlighted="true"]',
                    )
                    .count(),
                { timeout: 10_000 },
              )
              .toBe(sourceCount);

            const codeSamples = await page.evaluate(() =>
              Array.from(
                document.querySelectorAll<HTMLElement>(
                  '[data-component-example-source]',
                ),
              ).map((source) => {
                const pre = source.querySelector('pre');
                const code = source.querySelector('code');

                return {
                  code: code?.textContent ?? '',
                  highlighted: pre?.getAttribute('data-highlighted'),
                  language: pre?.getAttribute('data-language'),
                };
              }),
            );

            for (const sample of codeSamples) {
              expect(sample.language).toBeDefined();
              expect(sample.highlighted).toBe('true');
              expect(sample.code).not.toMatch(/\.(?:map|forEach|filter|reduce)\s*\(/);
              expect(sample.code).not.toMatch(/\b(?:for|while)\s*\(/);
              expect(sample.code).not.toContain('...');
              expect(sample.code).not.toMatch(/\t/);
              expect(sample.code).not.toMatch(/[ \t]+$/m);
              expect(sample.code).not.toMatch(/^\n|\n$/);
              expect(
                sample.code.split('\n').some((line) => {
                  const indentation = line.match(/^ */)?.[0].length ?? 0;

                  return indentation % 2 !== 0;
                }),
              ).toBe(false);
            }

            const previewAlignment = await page.evaluate(() =>
              Array.from(
                document.querySelectorAll<HTMLElement>('[data-preview-layout]'),
              ).map((preview) => {
                const previewRect = preview.getBoundingClientRect();
                const content = preview.firstElementChild;
                const contentRect = content?.getBoundingClientRect();
                const { previewLayout } = preview.dataset;

                return {
                  layout: previewLayout,
                  horizontalDelta:
                    contentRect === undefined
                      ? null
                      : (contentRect.left + contentRect.right) / 2 -
                        (previewRect.left + previewRect.right) / 2,
                  verticalDelta:
                    contentRect === undefined
                      ? null
                      : (contentRect.top + contentRect.bottom) / 2 -
                        (previewRect.top + previewRect.bottom) / 2,
                };
              }),
            );

            expect(
              previewAlignment.filter(({ layout }) => layout === 'start'),
              `${entry.id} should not leave intrinsic examples left-aligned`,
            ).toHaveLength(0);

            for (const alignment of previewAlignment.filter(
              ({ layout }) => layout === 'center',
            )) {
              expect(
                Math.abs(alignment.horizontalDelta ?? Number.POSITIVE_INFINITY),
                `${entry.id} ${scenario.name} horizontal preview alignment`,
              ).toBeLessThanOrEqual(1);
              expect(
                Math.abs(alignment.verticalDelta ?? Number.POSITIVE_INFINITY),
                `${entry.id} ${scenario.name} vertical preview alignment`,
              ).toBeLessThanOrEqual(1);
            }

            for (const exampleId of entry.requiredExamples) {
              const example = docs.locator(`#${exampleId}`);

              await expect(example.count()).resolves.toBe(1);
              await expect(
                example.locator(`a[href="#${exampleId}"]`).count(),
              ).resolves.toBe(1);
              await expect(
                example.getByRole('tab', { exact: true, name: 'HTML' }).count(),
              ).resolves.toBe(1);
              await expect(
                example.getByRole('tab', { exact: true, name: 'React' }).count(),
              ).resolves.toBe(1);
            }

            const documentWidths = await page.evaluate(() => ({
              clientWidth: document.documentElement.clientWidth,
              scrollWidth: document.documentElement.scrollWidth,
            }));

            expect(documentWidths.scrollWidth).toBeLessThanOrEqual(
              documentWidths.clientWidth + 1,
            );

            if (scenario.viewport.width === 390) {
              const localOverflowTarget =
                entry.id === 'table'
                  ? docs.locator(
                      '#table-responsive-overflow [data-component-example-tabs] > [role="tabpanel"]:not([hidden]) .tr-table-container',
                    )
                  : entry.id === 'tabs'
                    ? docs.locator(
                        '#tabs-responsive-overflow [data-component-example-tabs] > [role="tabpanel"]:not([hidden]) .tr-tabs-list',
                      )
                    : entry.id === 'code-block'
                      ? docs.locator(
                          '#code-block-wrapping [data-component-example-tabs] > [role="tabpanel"]:not([hidden]) .tr-code-block:not([data-wrap="true"])',
                        )
                      : undefined;

              if (localOverflowTarget !== undefined) {
                const overflow = await horizontalOverflowMetrics(localOverflowTarget);

                expect(['auto', 'scroll']).toContain(overflow.overflowX);
                expect(overflow.scrollWidth).toBeGreaterThanOrEqual(
                  overflow.clientWidth,
                );
              }

              if (entry.id === 'skeleton') {
                const shapePreview = docs.locator(
                  '#skeleton-shape [data-preview-layout]',
                );
                const shapePreviewCount = await shapePreview.count();

                expect(shapePreviewCount).toBe(1);

                const shapeMetrics = await shapePreview.evaluate((element) => {
                  const preview = element as HTMLElement;
                  const circle = preview.querySelector<HTMLElement>(
                    '.tr-skeleton[data-shape="circle"]',
                  );
                  const cell = circle?.parentElement;

                  if (circle === null || cell === null || cell === undefined) {
                    throw new Error('Unable to find the mobile Skeleton circle cell.');
                  }

                  const circleRect = circle.getBoundingClientRect();
                  const cellRect = cell.getBoundingClientRect();

                  return {
                    circleCellDelta: Math.abs(
                      (circleRect.left + circleRect.right) / 2 -
                        (cellRect.left + cellRect.right) / 2,
                    ),
                    clientWidth: preview.clientWidth,
                    scrollWidth: preview.scrollWidth,
                  };
                });

                expect(shapeMetrics.circleCellDelta).toBeLessThanOrEqual(1);
                expect(shapeMetrics.scrollWidth).toBeLessThanOrEqual(
                  shapeMetrics.clientWidth + 1,
                );
              }
            }
          } catch (error) {
            await captureFailure(page, [entry.id, scenario.name]);
            throw error;
          }
        }
      } finally {
        await context.close();
      }
    });
  }

  for (const scenario of renderScenarios) {
    it(`centers the Skeleton canvas preview in ${scenario.name}`, async () => {
      if (browser === undefined) {
        throw new Error('Chromium did not start.');
      }

      const context = await browser.newContext({ viewport: scenario.viewport });
      const page = await context.newPage();

      try {
        await page.goto(
          storyUrl(origin, 'components-skeleton--default', scenario.theme),
          { waitUntil: 'domcontentloaded' },
        );

        const skeleton = page.locator('.tr-skeleton');
        await skeleton.waitFor({ state: 'visible' });

        const metrics = await skeleton.evaluate((element) => {
          const rect = element.getBoundingClientRect();
          const documentElement = document.documentElement;

          return {
            animationDuration: getComputedStyle(element, '::after').animationDuration,
            centerDelta: Math.abs((rect.left + rect.right) / 2 - window.innerWidth / 2),
            clientWidth: documentElement.clientWidth,
            scrollWidth: documentElement.scrollWidth,
            width: rect.width,
          };
        });

        expect(metrics.animationDuration).toBe('2.4s');
        expect(metrics.centerDelta).toBeLessThanOrEqual(1);
        expect(metrics.width).toBeLessThanOrEqual(192);
        expect(metrics.scrollWidth).toBeLessThanOrEqual(metrics.clientWidth + 1);
      } catch (error) {
        await captureFailure(page, ['skeleton-canvas', scenario.name]);
        throw error;
      } finally {
        await context.close();
      }
    });
  }

  for (const scenario of renderScenarios) {
    it(`renders guided Welcome and Foundation pages in ${scenario.name}`, async () => {
      if (browser === undefined) {
        throw new Error('Chromium did not start.');
      }

      const context = await browser.newContext({ viewport: scenario.viewport });
      const page = await context.newPage();
      const consoleErrors: string[] = [];
      const pageErrors: string[] = [];

      page.on('console', (message) => {
        if (message.type() === 'error') {
          consoleErrors.push(message.text());
        }
      });
      page.on('pageerror', (error) => {
        pageErrors.push(error.message);
      });

      try {
        for (const entry of guidedDocsManifest) {
          consoleErrors.length = 0;
          pageErrors.length = 0;

          try {
            await page.goto(docsUrl(origin, entry.storyId, scenario.theme), {
              waitUntil: 'domcontentloaded',
            });
            const docs = page.locator('.sbdocs-content');

            await docs
              .getByRole('heading', { exact: true, level: 1, name: entry.title })
              .waitFor();
            await page.waitForLoadState('networkidle');

            expect(await page.locator('html').getAttribute('data-theme')).toBe(
              scenario.theme,
            );
            expect(await docs.locator('h1').allTextContents()).toEqual([entry.title]);
            expect(await docs.locator('h2').allTextContents()).toEqual(entry.headings);

            const documentWidths = await page.evaluate(() => ({
              clientWidth: document.documentElement.clientWidth,
              scrollWidth: document.documentElement.scrollWidth,
            }));

            expect(documentWidths.scrollWidth).toBeLessThanOrEqual(
              documentWidths.clientWidth + 1,
            );

            if ('reference' in entry) {
              const reference = docs.locator(
                `[data-foundation-reference="${entry.reference}"]`,
              );

              await expect(reference.count()).resolves.toBe(1);

              if (scenario.viewport.width === 390) {
                const overflow = await horizontalOverflowMetrics(reference);

                expect(['auto', 'scroll']).toContain(overflow.overflowX);
                expect(overflow.scrollWidth).toBeGreaterThanOrEqual(
                  overflow.clientWidth,
                );
              }
            }

            if (entry.id === 'welcome') {
              await expect(
                docs.locator('[data-component-install]').count(),
              ).resolves.toBe(1);
              await expect(
                docs.locator('#welcome-operational-surface').count(),
              ).resolves.toBe(1);
              const routes = docs.locator('a[data-docs-route]');

              await expect(routes.count()).resolves.toBe(4);
              expect(
                await routes.evaluateAll((links) =>
                  links.map((link) => ({
                    href: link.getAttribute('href'),
                    target: link.getAttribute('target'),
                  })),
                ),
              ).toEqual([
                { href: '/?path=/docs/foundations-overview--docs', target: '_top' },
                { href: '/?path=/docs/components-button--docs', target: '_top' },
                {
                  href: '/?path=/docs/components-form-overview--docs',
                  target: '_top',
                },
                {
                  href: '/?path=/docs/integrations-mdx-renderer--docs',
                  target: '_top',
                },
              ]);
            }

            if (entry.id === 'foundations-colors') {
              await expect(
                docs
                  .locator('[aria-label="Light semantic colors"] [role="listitem"]')
                  .count(),
              ).resolves.toBe(18);
              await expect(
                docs
                  .locator('[aria-label="Dark semantic colors"] [role="listitem"]')
                  .count(),
              ).resolves.toBe(18);
            }

            expect(consoleErrors, `${entry.id} ${scenario.name} console`).toEqual([]);
            expect(pageErrors, `${entry.id} ${scenario.name} page errors`).toEqual([]);
          } catch (error) {
            await captureFailure(page, [entry.id, scenario.name]);
            throw error;
          }
        }
      } finally {
        await context.close();
      }
    });
  }

  it('supports keyboard install targets and copy on Welcome', async () => {
    if (browser === undefined) {
      throw new Error('Chromium did not start.');
    }

    const context = await browser.newContext({
      permissions: ['clipboard-read', 'clipboard-write'],
      viewport: { height: 900, width: 1440 },
    });
    const page = await context.newPage();

    try {
      await page.goto(docsUrl(origin, 'welcome-start-here--docs', 'tinyrack-dark'), {
        waitUntil: 'domcontentloaded',
      });
      const install = page.locator('[data-component-install]');
      const cssTab = install.getByRole('tab', { exact: true, name: 'CSS / HTML' });
      const astroTab = install.getByRole('tab', {
        exact: true,
        name: 'Astro MDX',
      });

      await cssTab.focus();
      await cssTab.press('End');
      await expect(astroTab.getAttribute('aria-selected')).resolves.toBe('true');

      const activePanel = install.locator('[role="tabpanel"]:not([hidden])');
      const astroUsage = activePanel.locator('pre[data-language="astro"]');

      await expect.poll(() => astroUsage.count()).toBe(1);
      await activePanel
        .getByRole('button', {
          exact: true,
          name: 'Copy Astro MDX usage code',
        })
        .click();
      await expect
        .poll(async () =>
          (await page.evaluate(() => navigator.clipboard.readText())).replaceAll(
            '\r\n',
            '\n',
          ),
        )
        .toBe(
          [
            '---',
            "import { tinyrackAstroMdxComponents } from '@tinyrack/ui/mdx/astro';",
            'const { Content } = await entry.render();',
            '---',
            '',
            '<Content components={tinyrackAstroMdxComponents} />',
          ].join('\n'),
        );
    } catch (error) {
      await captureFailure(page, ['welcome', 'install-interaction']);
      throw error;
    } finally {
      await context.close();
    }
  });

  it('supports keyboard source tabs, exact copy, and live feedback on deep pages', async () => {
    if (browser === undefined) {
      throw new Error('Chromium did not start.');
    }

    const context = await browser.newContext({
      permissions: ['clipboard-read', 'clipboard-write'],
      viewport: { height: 900, width: 1440 },
    });
    const page = await context.newPage();

    try {
      for (const entry of componentDocsManifest.filter(({ id }) =>
        deepInteractionPages.has(id),
      )) {
        try {
          await page.goto(docsUrl(origin, entry.storyId, 'tinyrack-dark'), {
            waitUntil: 'domcontentloaded',
          });

          const example = page.locator(`#${entry.requiredExamples[0]}`);
          const previewTab = example.getByRole('tab', {
            exact: true,
            name: 'Preview',
          });
          const htmlTab = example.getByRole('tab', { exact: true, name: 'HTML' });

          await previewTab.focus();
          await previewTab.press('ArrowRight');
          await expect.poll(() => htmlTab.getAttribute('aria-selected')).toBe('true');

          const activePanel = example.locator(
            '[data-component-example-tabs] > [role="tabpanel"]:not([hidden])',
          );
          const visibleSource = activePanel.locator('pre code');
          const sourceText = await visibleSource.textContent();

          if (sourceText === null) {
            throw new Error(`No visible HTML source for ${entry.id}.`);
          }

          const expectedSource = sourceText.replaceAll('\r\n', '\n');
          const copyButton = activePanel.locator('[data-copy-source="HTML"]');
          const status = activePanel.locator('[data-copy-status]');

          await copyButton.click();

          await expect.poll(() => status.textContent()).toContain('Copied');
          await expect.poll(() => status.getAttribute('aria-live')).toBe('polite');
          await expect
            .poll(async () =>
              (await page.evaluate(() => navigator.clipboard.readText())).replaceAll(
                '\r\n',
                '\n',
              ),
            )
            .toBe(expectedSource);
        } catch (error) {
          await captureFailure(page, [entry.id, 'deep-interaction']);
          throw error;
        }
      }
    } finally {
      await context.close();
    }
  });

  it('supports keyboard install targets and grouped highlighted copy', async () => {
    if (browser === undefined) {
      throw new Error('Chromium did not start.');
    }

    const context = await browser.newContext({
      permissions: ['clipboard-read', 'clipboard-write'],
      viewport: { height: 900, width: 1440 },
    });
    const page = await context.newPage();

    try {
      await page.goto(docsUrl(origin, 'components-codeblock--docs', 'tinyrack-dark'), {
        waitUntil: 'domcontentloaded',
      });

      await page
        .locator('.sbdocs-content')
        .getByRole('heading', { exact: true, level: 1, name: 'CodeBlock' })
        .waitFor();

      const install = page.locator('[data-component-install]');
      const cssTab = install.getByRole('tab', {
        exact: true,
        name: 'CSS / HTML',
      });
      const reactTab = install.getByRole('tab', {
        exact: true,
        name: 'React plain block',
      });
      const cssPanel = install.locator('[role="tabpanel"]:not([hidden])');
      const cssCodeBlocks = cssPanel.locator('pre code');

      await expect.poll(() => cssCodeBlocks.count()).toBe(2);
      await expect(cssCodeBlocks.nth(1).textContent()).resolves.toContain(
        '@import "@tinyrack/ui/components/code-block/code-block.css";',
      );

      await cssTab.focus();
      await cssTab.press('ArrowRight');
      await expect.poll(() => reactTab.getAttribute('aria-selected')).toBe('true');

      const activePanel = install.locator('[role="tabpanel"]:not([hidden])');

      await expect
        .poll(() => activePanel.locator('[data-highlighted="true"]').count())
        .toBe(2);

      const usageCode = activePanel.locator('pre code').nth(1);
      const expectedCode = (await usageCode.textContent())?.replaceAll('\r\n', '\n');

      if (expectedCode === undefined) {
        throw new Error('No visible install usage code.');
      }

      await activePanel
        .locator('[data-install-copy="React plain block usage code"]')
        .click();

      const status = activePanel.locator('[data-install-copy-status="copied"]');

      await expect.poll(() => status.count()).toBe(1);
      await expect.poll(() => status.textContent()).toContain('Copied');
      await expect.poll(() => status.getAttribute('aria-live')).toBe('polite');
      await expect
        .poll(async () =>
          (await page.evaluate(() => navigator.clipboard.readText())).replaceAll(
            '\r\n',
            '\n',
          ),
        )
        .toBe(expectedCode);
    } catch (error) {
      await captureFailure(page, ['code-block', 'install-interaction']);
      throw error;
    } finally {
      await context.close();
    }
  });

  it('opens and dismisses native Overlay examples in built docs', async () => {
    if (browser === undefined) {
      throw new Error('Chromium did not start.');
    }

    const context = await browser.newContext({
      viewport: { height: 900, width: 1440 },
    });
    const page = await context.newPage();

    try {
      await page.goto(docsUrl(origin, 'components-overlay--docs', 'tinyrack-dark'), {
        waitUntil: 'domcontentloaded',
      });

      const modalPreview = page.locator(
        '#overlay-modal-basic [data-component-example-tabs] > [role="tabpanel"]:not([hidden])',
      );
      await modalPreview.getByRole('button', { name: 'Open settings' }).click();
      const modal = page.locator('dialog.tr-modal:modal');

      await modal.waitFor();
      await expect(modal.getAttribute('data-topmost')).resolves.toBe('true');
      await page.keyboard.press('Escape');
      await expect.poll(() => modal.count()).toBe(0);

      const layerPreview = page.locator(
        '#overlay-layer [data-component-example-tabs] > [role="tabpanel"]:not([hidden])',
      );
      await layerPreview.getByRole('button', { name: 'Open actions' }).click();
      const layer = page.locator('.tr-layer:popover-open');

      await layer.waitFor();
      await expect(layer.getAttribute('data-positioned')).resolves.toBe('true');
      await page.keyboard.press('Escape');
      await expect.poll(() => layer.count()).toBe(0);
    } catch (error) {
      await captureFailure(page, ['overlay', 'native-interaction']);
      throw error;
    } finally {
      await context.close();
    }
  });

  it('announces when clipboard copy is unavailable', async () => {
    if (browser === undefined) {
      throw new Error('Chromium did not start.');
    }

    const context = await browser.newContext({
      viewport: { height: 900, width: 1440 },
    });
    const page = await context.newPage();

    try {
      await page.addInitScript(() => {
        Object.defineProperty(navigator, 'clipboard', {
          configurable: true,
          value: {
            writeText: async () => {
              throw new Error('Clipboard disabled for failure-state coverage.');
            },
          },
        });
      });
      await page.goto(docsUrl(origin, 'components-button--docs', 'tinyrack-dark'), {
        waitUntil: 'domcontentloaded',
      });

      const example = page.locator('#button-basic');

      await example.getByRole('tab', { exact: true, name: 'HTML' }).click();

      const activePanel = example.locator(
        '[data-component-example-tabs] > [role="tabpanel"]:not([hidden])',
      );

      await activePanel.locator('[data-copy-source="HTML"]').click();
      await expect
        .poll(() => activePanel.locator('[data-copy-status]').textContent())
        .toContain('Copy unavailable');
    } catch (error) {
      await captureFailure(page, ['button', 'copy-unavailable']);
      throw error;
    } finally {
      await context.close();
    }
  });
});
