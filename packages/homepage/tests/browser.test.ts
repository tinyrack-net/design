import { readFile, stat } from 'node:fs/promises';
import { createServer, type Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import { extname, join, resolve, sep } from 'node:path';
import { type Browser, chromium, type Locator, type Page } from 'playwright';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { staticDocumentRoutes } from '../app/content/shared/static-document-routes.js';

const buildRoot = join(process.cwd(), 'build/client');

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

async function expectVerticallyCentered(container: Locator, item: Locator) {
  const containerBox = await container.boundingBox();
  const itemBox = await item.boundingBox();
  expect(containerBox).not.toBeNull();
  expect(itemBox).not.toBeNull();

  const containerCenter = (containerBox?.y ?? 0) + (containerBox?.height ?? 0) / 2;
  const itemCenter = (itemBox?.y ?? 0) + (itemBox?.height ?? 0) / 2;
  expect(Math.abs(itemCenter - containerCenter)).toBeLessThanOrEqual(1);
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
    it(`renders every document in ${scenario.name}`, async () => {
      const page = await browser.newPage({ viewport: scenario.viewport });
      await setTheme(page, scenario.theme);
      const pageErrors: string[] = [];
      const consoleErrors: string[] = [];
      page.on('pageerror', (error) => pageErrors.push(error.message));
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
          if (documentRoute.componentEntry !== undefined) {
            await expect(
              page.locator('[data-component-playground]').count(),
            ).resolves.toBe(1);
            await expect(
              page.locator('[data-component-example]').count(),
            ).resolves.toBeGreaterThanOrEqual(
              documentRoute.componentEntry.requiredExamples.length,
            );
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
            await page
              .locator('.tr-app-shell-header')
              .first()
              .getByRole('button', { name: 'Open navigation' })
              .click();
          }
          const currentNavigationLink = page.locator(
            'nav[aria-label="Documentation"] [aria-current="page"]',
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
        await page.close();
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
      const desktopViewport = desktopPage.locator('.tr-site-main-scroll-viewport');

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
        previousDocument.locator('.tr-document-pagination-summary').textContent(),
      ).resolves.toBe('Compact status labels with semantic color and density axes.');
      await expect(
        nextDocument.locator('.tr-document-pagination-summary').textContent(),
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
        dialog.locator('.tr-combobox-input-group'),
        dialog.locator('.tr-combobox-input-adornment > svg'),
      );
      await expect(
        search.evaluate((element) => element === document.activeElement),
      ).resolves.toBe(true);
      await search.fill('button');
      await expect
        .poll(() =>
          dialog.locator('.tr-site-search-result-heading strong').first().textContent(),
        )
        .toBe('Button');
      expect(pagefindRequests.length).toBeGreaterThan(0);

      await page.keyboard.press('Escape');
      await expect.poll(() => dialog.isVisible()).toBe(false);
      await expect(
        trigger.evaluate((element) => element === document.activeElement),
      ).resolves.toBe(true);

      await page.keyboard.press('Control+k');
      await search.fill('getAriaValueText');
      await expect(
        dialog.locator('.tr-site-search-result-heading strong').first().textContent(),
      ).resolves.toBe('Slider');
      await page.keyboard.press('ArrowDown');
      await expect
        .poll(() =>
          dialog
            .locator('.tr-site-search-result')
            .first()
            .getAttribute('data-highlighted'),
        )
        .not.toBeNull();
      await page.keyboard.press('Enter');
      await page.getByRole('heading', { level: 1, name: 'Slider' }).waitFor();
      await expect
        .poll(() => new URL(page.url()).hash)
        .toBe('#slider-validation-heading');
      const searchDestination = page.locator('#slider-validation-heading');
      await expect
        .poll(async () => (await searchDestination.boundingBox())?.y ?? 0)
        .toBeGreaterThanOrEqual(60);

      await page.getByRole('button', { name: 'Use light theme' }).click();
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
        background: 'rgb(36, 41, 46)',
        token: 'rgb(249, 117, 131)',
      });
      const highlightedMarkup = await codeBlock.innerHTML();

      await page.getByRole('button', { name: 'Use light theme' }).click();

      await expect
        .poll(() => highlightedCodeColors(codeBlock))
        .toEqual({
          background: 'rgb(255, 255, 255)',
          token: 'rgb(215, 58, 73)',
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
        mobilePage.getByRole('button', { name: 'Use light theme' }),
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
        mobileSearchDialog.locator('.tr-combobox-input-group'),
        mobileSearchDialog.locator('.tr-combobox-input-adornment > svg'),
      );
      await mobileSearchDialog
        .getByRole('combobox', { name: 'Search documentation' })
        .fill('switch');
      await expect
        .poll(() =>
          mobileSearchDialog
            .locator('.tr-site-search-result-heading strong')
            .first()
            .textContent(),
        )
        .toBe('Switch');
      await mobileSearchDialog.locator('.tr-site-search-result').first().click();
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
        const metrics = await page.locator(selector).evaluate((element) => {
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
      await expectPreviewGeometry(desktopPage);
      const desktopSidebar = desktopPage
        .locator('.tr-app-shell > aside.tr-app-shell-sidebar')
        .first();
      const desktopSidebarViewport = desktopSidebar.locator(
        '.tr-app-shell-scroll-viewport',
      );
      const desktopMainViewport = desktopPage.locator('.tr-site-main-scroll-viewport');
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
      const mobileMainViewport = mobilePage.locator('.tr-site-main-scroll-viewport');
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
              .locator('.tr-site-content')
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
        page.locator('.tr-site-content').getAttribute('aria-busy'),
      ).resolves.toBe('true');

      releaseRouteModule();
      await page.getByRole('heading', { level: 1, name: 'Button' }).waitFor();

      await expect(
        page.getByRole('progressbar', { name: 'Loading page' }).count(),
      ).resolves.toBe(0);
      await expect(
        page.locator('.tr-site-content').getAttribute('aria-busy'),
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
        page.locator('.tr-site-content').getAttribute('aria-busy'),
      ).resolves.toBe('true');

      releaseRouteModule();
      await page.getByRole('heading', { level: 1, name: 'Card' }).waitFor();
      await expect(progress.count()).resolves.toBe(0);
      await expect(
        page.locator('.tr-site-content').getAttribute('aria-busy'),
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
      await page.getByRole('button', { name: 'Reset', exact: true }).click();
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
      await page.getByRole('button', { name: 'Reset', exact: true }).click();
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
      await page.getByRole('button', { name: 'Reset', exact: true }).click();
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
      await page.getByRole('button', { name: 'Reset', exact: true }).click();
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
      await page.getByRole('button', { name: 'Reset', exact: true }).click();
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
      await page.getByRole('button', { name: 'Reset', exact: true }).click();
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
      await page.getByRole('button', { name: 'Reset', exact: true }).click();
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
      await page.getByRole('button', { name: 'Reset', exact: true }).click();
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
      await page.getByRole('button', { name: 'Reset', exact: true }).click();
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
      const platformNavigation = page.getByRole('navigation', {
        name: 'Platform navigation example',
      });
      await expect(platformNavigation.isVisible()).resolves.toBe(true);
      const resources = platformNavigation.getByRole('button', {
        name: 'Resources',
      });
      await resources.press('Enter');
      const navigationPopup = page.locator('.tr-navigation-menu-popup[data-open]');
      await navigationPopup.waitFor();
      await expectInsideViewport(page, navigationPopup);
      await expect(
        navigationPopup.getByRole('link', { name: 'Guides' }).isVisible(),
      ).resolves.toBe(true);
      await page.keyboard.press('Escape');
      await expect
        .poll(() => resources.evaluate((element) => document.activeElement === element))
        .toBe(true);

      await page.goto(`${origin}/components/tooltip`);
      const tooltipTrigger = page
        .locator('[data-component-example-id="tooltip-basic"]')
        .getByRole('button', { name: 'Rack temperature' });
      await tooltipTrigger.focus();
      const tooltip = page.getByRole('tooltip', { name: '24°C' });
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
      const previewCard = page.locator('.tr-preview-card-popup[data-open]');
      await previewCard.waitFor();
      await expectInsideViewport(page, previewCard);
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
});
