import { mkdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { createServer, type Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import { extname, join, resolve, sep } from 'node:path';
import { chromium, type Locator, type Page } from 'playwright';
import sharp from 'sharp';
import { staticDocumentRoutes } from '../app/content/shared/static-document-routes.ts';

const buildRoot = join(process.cwd(), 'build/client');
const outputRoot = resolve(process.cwd(), '../../audits/homepage-capture');
const reviewOnly = process.env['TINYRACK_CAPTURE_REVIEW_ONLY'] === '1';
const contentTypes: Record<string, string> = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

type CaptureEntry = {
  highlightedBlocks: number;
  mainCount: number;
  path: string;
  screenshot: string;
  scenario: string;
  title: string;
  viewportWidth: number;
};

type ReviewCaptureEntry = {
  file: string;
  geometry: Awaited<ReturnType<Locator['boundingBox']>>;
  path: string;
  theme: 'tinyrack-dark' | 'tinyrack-light';
  viewport: { height: number; width: number };
};

type ReviewCapture = {
  file: string;
  path: string;
  prepare: (page: Page) => Promise<Locator>;
  theme: 'tinyrack-dark' | 'tinyrack-light';
  viewport: { height: number; width: number };
};

function staticPath(requestUrl: string) {
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
      if (statSync(candidate).isFile()) return candidate;
    } catch {}
  }
  return undefined;
}

function startServer() {
  const server = createServer((request, response) => {
    const path = staticPath(request.url ?? '/');
    if (path === undefined) {
      const notFound = readFileSync(join(buildRoot, '404.html'));
      response.writeHead(404, { 'content-type': 'text/html; charset=utf-8' });
      response.end(notFound);
      return;
    }
    response.writeHead(200, {
      'cache-control': 'no-store',
      'content-type': contentTypes[extname(path)] ?? 'application/octet-stream',
    });
    response.end(readFileSync(path));
  });

  return new Promise<{ origin: string; server: Server }>((resolveListen, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', () => {
      server.off('error', reject);
      resolveListen({
        origin: `http://127.0.0.1:${(server.address() as AddressInfo).port}`,
        server,
      });
    });
  });
}

function closeServer(server: Server) {
  return new Promise<void>((resolveClose, reject) => {
    server.close((error) => (error === undefined ? resolveClose() : reject(error)));
  });
}

function screenshotName(path: string) {
  return path === '/' ? 'home' : path.replace(/^\//, '').replaceAll('/', '--');
}

async function setTheme(page: Page, theme: 'tinyrack-dark' | 'tinyrack-light') {
  await page.addInitScript((selectedTheme) => {
    localStorage.setItem('tinyrack-theme', selectedTheme);
  }, theme);
}

async function assertInsideViewport(page: Page, locator: Locator) {
  const box = await locator.boundingBox();
  const viewport = page.viewportSize();
  if (box === null || viewport === null) throw new Error('Missing overlay geometry');
  if (
    box.x < -1 ||
    box.y < -1 ||
    box.x + box.width > viewport.width + 1 ||
    box.y + box.height > viewport.height + 1
  ) {
    throw new Error(`Overlay escaped viewport: ${JSON.stringify({ box, viewport })}`);
  }
}

statSync(join(buildRoot, 'index.html'));
rmSync(outputRoot, { force: true, recursive: true });
mkdirSync(outputRoot, { recursive: true });

const started = await startServer();
const browser = await chromium.launch();
const entries: CaptureEntry[] = [];
const failures: string[] = [];
const reviewEntries: ReviewCaptureEntry[] = [];
const contactSheets: string[] = [];
let interactionCount = 0;

try {
  if (!reviewOnly) {
    for (const scenario of [
      {
        name: 'light-desktop',
        theme: 'tinyrack-light',
        viewport: { height: 900, width: 1440 },
      },
      {
        name: 'dark-mobile',
        theme: 'tinyrack-dark',
        viewport: { height: 844, width: 390 },
      },
    ] as const) {
      const scenarioRoot = join(outputRoot, scenario.name);
      mkdirSync(scenarioRoot, { recursive: true });
      const page = await browser.newPage({ viewport: scenario.viewport });
      await setTheme(page, scenario.theme);
      let activePath = '/';
      page.on('pageerror', (error) =>
        failures.push(`${scenario.name}${activePath}: ${error.message}`),
      );
      page.on('console', (message) => {
        if (message.type() === 'error') {
          failures.push(`${scenario.name}${activePath}: console: ${message.text()}`);
        }
      });

      for (const route of staticDocumentRoutes) {
        activePath = route.path;
        await page.goto(`${started.origin}${route.path}`, { waitUntil: 'networkidle' });
        await page.locator('h1').filter({ hasText: route.title }).waitFor();
        await page.waitForFunction(() =>
          [...document.querySelectorAll('pre[data-language]')].every((element) =>
            element.hasAttribute('data-highlighted'),
          ),
        );
        const metrics = await page.locator('html').evaluate((element) => ({
          highlightedBlocks: document.querySelectorAll('pre[data-highlighted="true"]')
            .length,
          mainCount: document.querySelectorAll('main').length,
          scrollWidth: element.scrollWidth,
          viewportWidth: element.clientWidth,
        }));
        if (
          metrics.mainCount !== 1 ||
          metrics.scrollWidth > metrics.viewportWidth + 1
        ) {
          failures.push(`${scenario.name}${route.path}: ${JSON.stringify(metrics)}`);
        }
        if (
          (await page.locator('html').getAttribute('data-theme')) !== scenario.theme
        ) {
          failures.push(`${scenario.name}${route.path}: theme mismatch`);
        }

        await page.evaluate(() => {
          document.body.style.overflow = 'visible';
          const shell = document.querySelector<HTMLElement>('.tr-app-shell');
          const main = document.querySelector<HTMLElement>('.tr-app-shell-main');
          const scrollArea = document.querySelector<HTMLElement>(
            '.tr-site-main-scroll-area',
          );
          const viewport = document.querySelector<HTMLElement>(
            '.tr-site-main-scroll-viewport',
          );
          const scrollbar = scrollArea?.querySelector<HTMLElement>(
            '.tr-scroll-area-scrollbar',
          );
          if (shell !== null) {
            shell.style.height = 'auto';
            shell.style.overflow = 'visible';
          }
          if (main !== null) main.style.overflow = 'visible';
          if (scrollArea !== null) {
            scrollArea.style.height = 'auto';
            scrollArea.style.overflow = 'visible';
          }
          if (viewport !== null) {
            viewport.style.height = 'auto';
            viewport.style.overflow = 'visible';
          }
          if (scrollbar !== undefined && scrollbar !== null) {
            scrollbar.style.display = 'none';
          }
        });
        const screenshot = join(scenarioRoot, `${screenshotName(route.path)}.png`);
        await page.screenshot({ fullPage: true, path: screenshot });
        entries.push({
          highlightedBlocks: metrics.highlightedBlocks,
          mainCount: metrics.mainCount,
          path: route.path,
          screenshot,
          scenario: scenario.name,
          title: await page.title(),
          viewportWidth: metrics.viewportWidth,
        });
      }
      await page.close();
    }

    const interactionsRoot = join(outputRoot, 'interactions');
    mkdirSync(interactionsRoot, { recursive: true });
    const interactions = [
      {
        name: 'select-open-mobile',
        path: '/components/select',
        viewport: { height: 844, width: 390 },
        act: async (page: Page) => {
          await page
            .locator('[data-component-example-id="select-basic"]')
            .getByRole('combobox')
            .click();
          return page.locator('.tr-select-popup[data-open]');
        },
      },
      {
        name: 'alert-dialog-open-mobile',
        path: '/components/alert-dialog',
        viewport: { height: 844, width: 390 },
        act: async (page: Page) => {
          await page
            .locator('[data-component-example-id="alert-dialog-basic"]')
            .getByRole('button', { name: 'Delete rack' })
            .click();
          return page.getByRole('alertdialog', { name: 'Delete rack?' });
        },
      },
      {
        name: 'drawer-open-mobile',
        path: '/components/drawer',
        viewport: { height: 844, width: 390 },
        act: async (page: Page) => {
          await page
            .locator('[data-component-example-id="drawer-basic"]')
            .getByRole('button', { name: 'Open settings' })
            .click();
          return page.getByRole('dialog', { name: 'Rack settings' });
        },
      },
      {
        name: 'preview-card-focus-desktop',
        path: '/components/preview-card',
        viewport: { height: 900, width: 1440 },
        act: async (page: Page) => {
          await page
            .locator('[data-component-example-id="preview-card-states"]')
            .getByRole('link', { name: 'Rack Beta' })
            .focus();
          return page
            .locator('.tr-preview-card-popup[data-open]')
            .filter({ hasText: 'Rack Beta' });
        },
      },
      {
        name: 'form-error-recovery-desktop',
        path: '/components/form',
        viewport: { height: 900, width: 1440 },
        act: async (page: Page) => {
          const example = page.locator(
            '[data-component-example-id="form-server-errors"]',
          );
          await example.getByRole('button', { name: 'Create rack' }).click();
          return example.getByText('Rack Alpha already exists.');
        },
      },
      {
        name: 'app-shell-site-nav-open-mobile',
        path: '/components/app-shell',
        viewport: { height: 844, width: 390 },
        act: async (page: Page) => {
          await page
            .locator('.tr-app-shell-header')
            .first()
            .getByRole('button', { name: 'Open navigation' })
            .click();
          const popup = page.getByRole('dialog', { name: 'Documentation sidebar' });
          await popup.waitFor();
          await popup.evaluate((element) =>
            Promise.all(element.getAnimations().map((animation) => animation.finished)),
          );
          return popup;
        },
      },
      {
        name: 'app-shell-preview-nav-open-mobile',
        path: '/components/app-shell',
        viewport: { height: 844, width: 390 },
        act: async (page: Page) => {
          await page
            .locator('[data-component-example-id="app-shell-basic"]')
            .getByRole('button', { name: 'Open navigation' })
            .click();
          const popup = page.getByRole('dialog', { name: 'Example navigation' });
          await popup.waitFor();
          await popup.evaluate((element) =>
            Promise.all(element.getAnimations().map((animation) => animation.finished)),
          );
          return popup;
        },
      },
      {
        name: 'copy-button-copied-desktop',
        path: '/components/copy-button',
        viewport: { height: 900, width: 1440 },
        act: async (page: Page) => {
          const example = page.locator(
            '[data-component-example-id="copy-button-basic"]',
          );
          await example.getByRole('button', { name: 'Copy command' }).click();
          return example.locator('[data-copy-status="copied"]');
        },
      },
    ];
    interactionCount = interactions.length;

    for (const interaction of interactions) {
      const page = await browser.newPage({ viewport: interaction.viewport });
      await setTheme(
        page,
        interaction.viewport.width < 600 ? 'tinyrack-dark' : 'tinyrack-light',
      );
      await page.goto(`${started.origin}${interaction.path}`, {
        waitUntil: 'networkidle',
      });
      const surface = await interaction.act(page);
      await surface.waitFor();
      await surface.evaluate((element) =>
        Promise.allSettled(
          element.getAnimations().map((animation) => animation.finished),
        ),
      );
      if (interaction.name !== 'form-error-recovery-desktop') {
        await assertInsideViewport(page, surface);
      }
      await page.screenshot({
        path: join(interactionsRoot, `${interaction.name}.png`),
      });
      await page.close();
    }
  }

  const desktop = { height: 900, width: 1440 } as const;
  const mobile = { height: 844, width: 390 } as const;
  const light = 'tinyrack-light' as const;
  const dark = 'tinyrack-dark' as const;
  const example = (page: Page, id: string) =>
    page.locator(`[data-component-example-id="${id}"]`);
  const playground = (page: Page) => page.locator('[data-component-playground]');
  const reviewCaptures: ReviewCapture[] = [
    {
      file: '01-copy-buttons-too-large.png',
      path: '/components/copy-button',
      theme: light,
      viewport: desktop,
      prepare: async (page) => playground(page),
    },
    {
      file: '02-playground-controls-layout.png',
      path: '/components/alert',
      theme: light,
      viewport: desktop,
      prepare: async (page) => playground(page),
    },
    {
      file: '03-checkbox-layout-global.png',
      path: '/components/checkbox',
      theme: dark,
      viewport: mobile,
      prepare: async (page) => playground(page),
    },
    {
      file: '04-accordion-playground-horizontal-scroll.png',
      path: '/components/accordion',
      theme: dark,
      viewport: mobile,
      prepare: async (page) => playground(page),
    },
    {
      file: '05-alert-contract-mobile-commas.png',
      path: '/components/alert',
      theme: dark,
      viewport: mobile,
      prepare: async (page) =>
        page.locator('.tr-mdx-table[data-contract-table]').first(),
    },
    {
      file: '06-alert-actions-padding-desktop.png',
      path: '/components/alert',
      theme: light,
      viewport: desktop,
      prepare: async (page) => example(page, 'alert-actions'),
    },
    {
      file: '07-app-shell-playground-not-full.png',
      path: '/components/app-shell',
      theme: light,
      viewport: desktop,
      prepare: async (page) => playground(page),
    },
    {
      file: '08-card-background-low-contrast.png',
      path: '/components/card',
      theme: dark,
      viewport: mobile,
      prepare: async (page) => example(page, 'card-variants'),
    },
    {
      file: '09-code-container-width-control.png',
      path: '/components/code',
      theme: light,
      viewport: desktop,
      prepare: async (page) => playground(page),
    },
    {
      file: '10-combobox-disabled-selected-controls.png',
      path: '/components/combobox',
      theme: light,
      viewport: desktop,
      prepare: async (page) => playground(page),
    },
    {
      file: '11-combobox-multiple-chip-chevron.png',
      path: '/components/combobox',
      theme: dark,
      viewport: mobile,
      prepare: async (page) => example(page, 'combobox-multiple-anatomy'),
    },
    {
      file: '12-menu-flicker-behind-overlay.png',
      path: '/components/menu',
      theme: light,
      viewport: desktop,
      prepare: async (page) => {
        const target = playground(page);
        await target.getByRole('button', { name: 'Actions' }).click();
        const popup = page.locator('.tr-menu-content[data-open]').first();
        await popup.waitFor();
        return popup;
      },
    },
    {
      file: '13-menu-detached-actions-error.png',
      path: '/components/menu',
      theme: light,
      viewport: desktop,
      prepare: async (page) => {
        const target = example(page, 'menu-handle');
        await target.scrollIntoViewIfNeeded();
        await target.getByRole('button', { name: 'Detached rack actions' }).click();
        const popup = page.locator('.tr-menu-content[data-open]');
        await popup.waitFor();
        await popup.getByRole('menuitem', { name: 'Inspect rack' }).click();
        await target
          .getByRole('status')
          .filter({ hasText: 'Rack Delta inspected' })
          .waitFor();
        return target;
      },
    },
    {
      file: '14-dialog-size-control.png',
      path: '/components/dialog',
      theme: light,
      viewport: desktop,
      prepare: async (page) => playground(page),
    },
    {
      file: '15-dialog-description-control.png',
      path: '/components/dialog',
      theme: dark,
      viewport: mobile,
      prepare: async (page) => playground(page),
    },
    {
      file: '16-otp-field-broken-layout.png',
      path: '/components/otp-field',
      theme: dark,
      viewport: mobile,
      prepare: async (page) => playground(page),
    },
    {
      file: '17-table-border-divider.png',
      path: '/components/table',
      theme: light,
      viewport: desktop,
      prepare: async (page) => playground(page),
    },
    {
      file: '18-tabs-border-divider.png',
      path: '/components/tabs',
      theme: light,
      viewport: desktop,
      prepare: async (page) => playground(page),
    },
    {
      file: '19-tabs-focused-header-border.png',
      path: '/components/tabs',
      theme: dark,
      viewport: mobile,
      prepare: async (page) => {
        const target = example(page, 'tabs-basic');
        await target.getByRole('tab', { name: 'Overview' }).focus();
        return target;
      },
    },
    {
      file: '20-toast-top-right-padding.png',
      path: '/components/toast',
      theme: light,
      viewport: desktop,
      prepare: async (page) => {
        const target = example(page, 'toast-basic');
        await target.getByRole('button', { name: 'Show toast' }).click();
        const toast = page.locator('.tr-toast').first();
        await toast.waitFor();
        return toast;
      },
    },
    {
      file: '21-context-menu-backdrop.png',
      path: '/components/context-menu',
      theme: light,
      viewport: desktop,
      prepare: async (page) => {
        const target = playground(page);
        await target.getByRole('button', { name: /Open actions/ }).click();
        const popup = page.locator('.tr-context-menu-popup[data-open]');
        await popup.waitFor();
        return popup;
      },
    },
    {
      file: '22-context-menu-layer-chevron.png',
      path: '/components/context-menu',
      theme: light,
      viewport: desktop,
      prepare: async (page) => {
        const target = example(page, 'context-menu-basic');
        await target.getByRole('button', { name: /Open actions/ }).click();
        const popup = page.locator('.tr-context-menu-popup[data-open]');
        await popup.waitFor();
        return popup;
      },
    },
    {
      file: '23-drawer-bottom-mobile-clipped.png',
      path: '/components/drawer',
      theme: dark,
      viewport: mobile,
      prepare: async (page) => {
        const target = playground(page);
        await target.getByRole('button', { name: 'Open settings' }).click();
        const drawer = page.getByRole('dialog', { name: 'Rack settings' });
        await drawer.waitFor();
        return drawer;
      },
    },
    {
      file: '24-menubar-layer-padding.png',
      path: '/components/menubar',
      theme: light,
      viewport: desktop,
      prepare: async (page) => {
        const target = example(page, 'menubar-basic');
        await target.getByText('File', { exact: true }).click();
        const popup = page.locator('.tr-menu-content[data-open]');
        await popup.waitFor();
        return popup;
      },
    },
    {
      file: '25-navigation-menu-use-case.png',
      path: '/components/navigation-menu',
      theme: light,
      viewport: desktop,
      prepare: async (page) => {
        const target = example(page, 'navigation-menu-states');
        const popup = page.locator('.tr-navigation-menu-popup[data-open]');
        await popup.waitFor();
        return target;
      },
    },
    {
      file: '26-number-field-scrollbar-padding.png',
      path: '/components/number-field',
      theme: dark,
      viewport: mobile,
      prepare: async (page) => example(page, 'number-field-basic'),
    },
    {
      file: '27-scroll-area-auto-hide-option.png',
      path: '/components/scroll-area',
      theme: light,
      viewport: desktop,
      prepare: async (page) => {
        const target = example(page, 'scroll-area-auto-hide');
        await target.locator('.tr-scroll-area[data-auto-hide="true"]').hover();
        return target;
      },
    },
    {
      file: '28-select-modal-layer-behind.png',
      path: '/components/select',
      theme: light,
      viewport: desktop,
      prepare: async (page) => {
        const target = playground(page);
        await target.locator('[data-playground-control="modal"] label').click();
        await target.getByRole('combobox', { name: 'Deployment rack' }).click();
        const popup = page.locator('.tr-select-popup[data-open]');
        await popup.waitFor();
        return popup;
      },
    },
    {
      file: '29-select-readonly-style.png',
      path: '/components/select',
      theme: dark,
      viewport: mobile,
      prepare: async (page) => example(page, 'select-states'),
    },
    {
      file: '30-select-layer-padding.png',
      path: '/components/select',
      theme: light,
      viewport: desktop,
      prepare: async (page) => {
        const target = example(page, 'select-basic');
        await target.getByRole('combobox').click();
        const popup = page.locator('.tr-select-popup[data-open]');
        await popup.waitFor();
        return popup;
      },
    },
    {
      file: '31-contract-table-radius-clipping.png',
      path: '/components/dialog',
      theme: dark,
      viewport: mobile,
      prepare: async (page) =>
        page.locator('.tr-mdx-table[data-contract-table]').first(),
    },
    {
      file: '32-toolbar-redesign.png',
      path: '/components/toolbar',
      theme: light,
      viewport: desktop,
      prepare: async (page) => playground(page),
    },
  ];
  const afterRoot = join(outputRoot, 'after');
  mkdirSync(afterRoot, { recursive: true });

  for (const capture of reviewCaptures) {
    const page = await browser.newPage({ viewport: capture.viewport });
    await setTheme(page, capture.theme);
    await page.goto(`${started.origin}${capture.path}`, { waitUntil: 'networkidle' });
    const target = await capture.prepare(page);
    await target.scrollIntoViewIfNeeded();
    await target.evaluate((element) =>
      Promise.allSettled(
        element.getAnimations().map((animation) => animation.finished),
      ),
    );
    const geometry = await target.boundingBox();
    if (geometry === null)
      failures.push(`review ${capture.file}: missing target geometry`);
    const file = join(afterRoot, capture.file);
    await page.screenshot({ path: file });
    reviewEntries.push({
      file,
      geometry,
      path: capture.path,
      theme: capture.theme,
      viewport: capture.viewport,
    });
    await page.close();
  }

  for (let sheetIndex = 0; sheetIndex < 4; sheetIndex += 1) {
    const captures = reviewEntries.slice(sheetIndex * 8, sheetIndex * 8 + 8);
    const tiles = await Promise.all(
      captures.map(async (capture, index) => {
        const label = `${String(sheetIndex * 8 + index + 1).padStart(2, '0')} ${
          capture.file
            .split('\\')
            .at(-1)
            ?.replace(/^\d+-|\.png$/g, '') ?? ''
        }`;
        const overlay = Buffer.from(
          `<svg width="720" height="450"><rect width="720" height="34" fill="#000" fill-opacity="0.78"/><text x="14" y="23" fill="#fff" font-family="sans-serif" font-size="16">${label.replaceAll('&', '&amp;')}</text></svg>`,
        );
        return sharp(capture.file)
          .resize(720, 450, { fit: 'contain', background: '#111111' })
          .composite([{ input: overlay, left: 0, top: 0 }])
          .jpeg({ quality: 88 })
          .toBuffer();
      }),
    );
    const sheet = join(afterRoot, `after-contact-sheet-${sheetIndex + 1}.jpg`);
    await sharp({
      create: { width: 1440, height: 1800, channels: 3, background: '#111111' },
    })
      .composite(
        tiles.map((input, index) => ({
          input,
          left: (index % 2) * 720,
          top: Math.floor(index / 2) * 450,
        })),
      )
      .jpeg({ quality: 90 })
      .toFile(sheet);
    contactSheets.push(sheet);
  }
} finally {
  await browser.close();
  await closeServer(started.server);
}

writeFileSync(
  join(outputRoot, 'manifest.json'),
  `${JSON.stringify(
    {
      captures: entries,
      expectedCaptures: staticDocumentRoutes.length * 2,
      failures,
      generatedAt: new Date().toISOString(),
      reviewCaptures: reviewEntries,
      contactSheets,
      routes: staticDocumentRoutes.length,
    },
    null,
    2,
  )}\n`,
);

if (
  (!reviewOnly && entries.length !== staticDocumentRoutes.length * 2) ||
  reviewEntries.length !== 32 ||
  contactSheets.length !== 4 ||
  failures.length > 0
) {
  throw new Error(`Homepage capture audit failed:\n${failures.join('\n')}`);
}

console.log(
  `captured ${entries.length} full pages and ${interactionCount} interaction states at ${outputRoot}`,
);
