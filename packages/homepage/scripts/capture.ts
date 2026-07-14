import { mkdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { createServer, type Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import { extname, join, resolve, sep } from 'node:path';
import { chromium, type Locator, type Page } from 'playwright';
import { staticDocumentRoutes } from '../app/content/shared/static-document-routes.ts';

const buildRoot = join(process.cwd(), 'build/client');
const outputRoot = resolve(process.cwd(), '../../audits/homepage-capture');
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

try {
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
      await page.getByRole('heading', { level: 1, name: route.title }).waitFor();
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
      if (metrics.mainCount !== 1 || metrics.scrollWidth > metrics.viewportWidth + 1) {
        failures.push(`${scenario.name}${route.path}: ${JSON.stringify(metrics)}`);
      }
      if ((await page.locator('html').getAttribute('data-theme')) !== scenario.theme) {
        failures.push(`${scenario.name}${route.path}: theme mismatch`);
      }

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
        return page.locator('.tr-preview-card-popup[data-open]');
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
      name: 'app-shell-open-mobile',
      path: '/components/button',
      viewport: { height: 844, width: 390 },
      act: async (page: Page) => {
        await page.getByRole('button', { name: 'Open navigation' }).click();
        return page.locator('.tr-app-shell-drawer-popup[data-open]');
      },
    },
    {
      name: 'copy-button-copied-desktop',
      path: '/components/copy-button',
      viewport: { height: 900, width: 1440 },
      act: async (page: Page) => {
        const example = page.locator('[data-component-example-id="copy-button-basic"]');
        await example.getByRole('button', { name: 'Copy command' }).click();
        return example.locator('[data-copy-status="copied"]');
      },
    },
  ];

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
    if (interaction.name !== 'form-error-recovery-desktop') {
      await assertInsideViewport(page, surface);
    }
    await page.screenshot({ path: join(interactionsRoot, `${interaction.name}.png`) });
    await page.close();
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
      routes: staticDocumentRoutes.length,
    },
    null,
    2,
  )}\n`,
);

if (entries.length !== staticDocumentRoutes.length * 2 || failures.length > 0) {
  throw new Error(`Homepage capture audit failed:\n${failures.join('\n')}`);
}

console.log(
  `captured ${entries.length} full pages and 7 interaction states at ${outputRoot}`,
);
