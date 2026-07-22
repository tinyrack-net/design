import type { Browser, Locator, Page } from 'playwright';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import {
  createBrowserAuditRuntime,
  expectInsideViewport,
  expectNoLocalOverflow,
  expectVerticallyCentered,
  expectVerticallyContained,
  expectVisible,
  gotoHydrated,
  highlightedCodeColors,
  holdRouteModule,
  setTheme,
  settledScrollTop,
  verticalGap,
} from './browser-audit-runtime.ts';
import { routeModulePattern } from './build-route-assets.ts';

const runtime = createBrowserAuditRuntime();

describe('built React Router documentation', () => {
  let browser: Browser;
  let origin: string;

  beforeAll(async () => {
    await runtime.start();
    browser = runtime.browser;
    origin = runtime.origin;
  });
  afterAll(async () => {
    await runtime.stop();
  });
  it('keeps mobile hash navigation inside the docs content viewport', async () => {
    const page = await browser.newPage({ viewport: { height: 844, width: 390 } });

    try {
      await gotoHydrated(page, `${origin}/en/components/textarea/#api`);

      const scrollArea = page.locator('.tr-docs-shell-scroll-area');
      const scrollViewport = page.locator('.tr-docs-shell-scroll-viewport');
      const scrollAreaBox = await scrollArea.boundingBox();
      const scrollViewportBox = await scrollViewport.boundingBox();

      expect(scrollAreaBox).not.toBeNull();
      expect(scrollViewportBox).not.toBeNull();
      await expect.poll(() => settledScrollTop(scrollArea)).toBe(0);
      await expect.poll(() => settledScrollTop(scrollViewport)).toBeGreaterThan(0);
      expect(scrollViewportBox?.y).toBe(scrollAreaBox?.y);
      expect(scrollViewportBox?.height).toBe(scrollAreaBox?.height);
      await expectVisible(page.locator('#api'));
    } finally {
      await page.close();
    }
  });

  it('searches documentation with Pagefind and persists theme selection', async () => {
    const page = await browser.newPage({ viewport: { height: 900, width: 1280 } });
    const pagefindRequests: string[] = [];
    page.on('request', (request) => {
      if (request.url().includes('/pagefind/')) pagefindRequests.push(request.url());
    });
    try {
      await page.goto(`${origin}/en/components/accordion`);
      expect(pagefindRequests).toEqual([]);

      const trigger = page.getByRole('button', { name: 'Search documentation' });
      expect(
        await page
          .locator('.tr-docs-sidebar-inner')
          .getByRole('button', { name: 'Search documentation' })
          .count(),
      ).toBe(0);
      expect(await trigger.count()).toBe(1);
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

  it('disables TRDocsSearch preview shortcuts on the TRDocsSearch page', async () => {
    const page = await browser.newPage({ viewport: { height: 900, width: 1280 } });
    try {
      await page.goto(`${origin}/en/components/docs-search/`);
      const previewTriggers = page.locator(
        '[data-component-example-id="docs-search-basic"] .tr-docs-search-trigger',
      );
      await expect.poll(() => previewTriggers.count()).toBe(1);

      await previewTriggers.press('Control+k');
      await expect.poll(() => page.getByRole('dialog').count()).toBe(1);
      await page.keyboard.press('Escape');
    } finally {
      await page.close();
    }
  });

  it('keeps the matching term visible in mobile search excerpts', async () => {
    const page = await browser.newPage({ viewport: { height: 844, width: 390 } });
    try {
      await page.goto(`${origin}/en/components/slider`);
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
      await page.goto(`${origin}/en`);
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

  it('switches TRCodeBlock syntax colors with the site theme', async () => {
    const page = await browser.newPage({ viewport: { height: 900, width: 1280 } });
    await setTheme(page, 'tinyrack-dark');
    try {
      await page.goto(`${origin}/en/components/code-block`);
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

  it('keeps the searchable Tailwind token reference usable on desktop and mobile', async () => {
    const desktopPage = await browser.newPage({
      viewport: { height: 900, width: 1440 },
    });
    const mobilePage = await browser.newPage({ viewport: { height: 844, width: 390 } });
    await setTheme(desktopPage, 'tinyrack-light');
    await setTheme(mobilePage, 'tinyrack-dark');

    try {
      await gotoHydrated(desktopPage, `${origin}/en/foundations/tailwind`);
      const desktopReference = desktopPage.locator('[data-tailwind-token-reference]');
      await expect(
        desktopReference.locator('[data-tailwind-token-group]').count(),
      ).resolves.toBe(13);
      await expect(desktopReference.locator('tbody tr').count()).resolves.toBe(189);
      await expect(
        desktopPage.locator('.tr-table-of-contents-desktop a').count(),
      ).resolves.toBe(18);
      await expectNoLocalOverflow(
        desktopPage.locator('html'),
        'Tailwind desktop document',
      );

      const search = desktopPage.getByRole('searchbox', {
        name: 'Search Tailwind token reference',
      });
      await search.fill('--z-index-tinyrack-tooltip');
      await expect(
        desktopReference.locator('[data-tailwind-token-group]').count(),
      ).resolves.toBe(1);
      await expect(desktopReference.locator('tbody tr').count()).resolves.toBe(1);
      await expectVisible(
        desktopReference.getByText('z-tinyrack-tooltip', { exact: true }),
      );
      await search.fill('');

      await gotoHydrated(desktopPage, `${origin}/en/foundations/tailwind#motion`);
      await expect.poll(() => new URL(desktopPage.url()).hash).toBe('#motion');
      await expectVisible(desktopPage.locator('[data-tailwind-token-group="motion"]'));

      await gotoHydrated(mobilePage, `${origin}/ko/foundations/tailwind`);
      expect(await mobilePage.locator('html').getAttribute('data-theme')).toBe(
        'tinyrack-dark',
      );
      await expectNoLocalOverflow(
        mobilePage.locator('html'),
        'Tailwind mobile document',
      );
      const mobileTable = mobilePage.locator(
        '[data-tailwind-token-table="typography"]',
      );
      await expectVisible(
        mobilePage.getByText(
          '좁은 화면에서는 각 표를 가로로 스크롤해 모든 열을 비교할 수 있어요.',
        ),
      );
      await expectVisible(
        mobilePage.locator('.tr-table-of-contents-mobile .tr-select-trigger'),
      );
      const mobileScroller = mobileTable.locator('xpath=..');
      await expect(mobileScroller.getAttribute('tabindex')).resolves.toBe('0');
      await expect(
        mobileScroller.evaluate((element) => element.scrollWidth),
      ).resolves.toBeGreaterThan(
        await mobileScroller.evaluate((element) => element.clientWidth),
      );
      await mobileScroller.focus();
      const before = await mobileScroller.evaluate((element) => element.scrollLeft);
      for (let press = 0; press < 10; press += 1) {
        await mobilePage.keyboard.press('ArrowRight');
      }
      await expect
        .poll(() => mobileScroller.evaluate((element) => element.scrollLeft))
        .toBeGreaterThan(before);
    } finally {
      await desktopPage.close();
      await mobilePage.close();
    }
  });

  it('keeps navigation controls and foundation references usable at their target sizes', async () => {
    const mobilePage = await browser.newPage({ viewport: { height: 844, width: 390 } });
    const desktopPage = await browser.newPage({
      viewport: { height: 900, width: 1280 },
    });
    try {
      await mobilePage.goto(`${origin}/en/components/button`);
      const mobileSearch = mobilePage.getByRole('button', {
        name: 'Search documentation',
      });
      for (const control of [
        mobilePage.getByRole('button', { name: 'Use light color scheme' }),
        mobilePage.getByRole('button', { name: 'Open navigation' }),
        mobileSearch,
      ]) {
        const box = await control.boundingBox();
        expect(box?.width).toBe(32);
        expect(box?.height).toBe(32);
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

      await desktopPage.goto(`${origin}/en/foundations/typography`);
      const search = desktopPage.getByRole('button', {
        name: 'Search documentation',
      });
      const searchBox = await search.boundingBox();
      expect(searchBox?.width).toBe(32);
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

  it('keeps TRAppShell previews and mobile drawers within their intended geometry', async () => {
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
      await expectNoLocalOverflow(page.locator('html'), 'TRAppShell document');
    };
    const expectDrawerGeometry = async (
      page: Page,
      popup: Locator,
      container?: Locator,
    ) => {
      await popup.waitFor();
      await popup.evaluate((element) =>
        Promise.all(element.getAnimations().map((animation) => animation.finished)),
      );
      await expect
        .poll(async () => {
          const popupBox = await popup.boundingBox();
          if (popupBox === null) return false;
          if (container === undefined) {
            return Math.abs(popupBox.x) <= 1 && Math.abs(popupBox.y) <= 1;
          }
          const containerBox = await container.boundingBox();
          if (containerBox === null) return false;
          return (
            popupBox.x >= containerBox.x - 1 &&
            popupBox.y >= containerBox.y - 1 &&
            popupBox.x + popupBox.width <= containerBox.x + containerBox.width + 1 &&
            popupBox.y + popupBox.height <= containerBox.y + containerBox.height + 1
          );
        })
        .toBe(true);
      const box = await popup.boundingBox();
      const viewport = page.viewportSize();
      expect(box).not.toBeNull();
      expect(viewport).not.toBeNull();
      expect(box?.width).toBe(288);
      if (container === undefined) {
        expect(box?.x).toBe(0);
        expect(box?.y).toBe(0);
        expect(
          Math.abs((box?.height ?? 0) - (viewport?.height ?? 0)),
        ).toBeLessThanOrEqual(1);
      } else {
        const containerBox = await container.boundingBox();
        expect(containerBox).not.toBeNull();
        expect(box?.x).toBeGreaterThanOrEqual((containerBox?.x ?? 0) - 1);
        expect(box?.y).toBeGreaterThanOrEqual((containerBox?.y ?? 0) - 1);
        expect((box?.x ?? 0) + (box?.width ?? 0)).toBeLessThanOrEqual(
          (containerBox?.x ?? 0) + (containerBox?.width ?? 0) + 1,
        );
        expect((box?.y ?? 0) + (box?.height ?? 0)).toBeLessThanOrEqual(
          (containerBox?.y ?? 0) + (containerBox?.height ?? 0) + 1,
        );
      }
      const sidebarBox = await popup
        .locator('aside.tr-app-shell-sidebar')
        .boundingBox();
      expect(sidebarBox).not.toBeNull();
      expect(sidebarBox?.x).toBe(box?.x);
      expect(sidebarBox?.y).toBe(box?.y);
      expect(
        Math.abs((sidebarBox?.width ?? 0) - (box?.width ?? 0)),
      ).toBeLessThanOrEqual(1);
      expect(
        Math.abs(
          (sidebarBox?.height ?? 0) -
            (container === undefined ? (viewport?.height ?? 0) : (box?.height ?? 0)),
        ),
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
      await gotoHydrated(desktopPage, `${origin}/en/components/app-shell`);
      await desktopPage.getByRole('heading', { level: 1, name: 'AppShell' }).waitFor();
      await expectVisible(desktopPage.locator('.tr-docs-shell-header').first());
      const desktopHeaderBox = await desktopPage
        .locator('.tr-docs-shell-header')
        .first()
        .boundingBox();
      expect(desktopHeaderBox).not.toBeNull();
      expect(desktopHeaderBox?.x).toBe(0);
      expect(desktopHeaderBox?.y).toBe(0);
      expect(desktopHeaderBox?.width).toBe(1440);
      await expectPreviewGeometry(desktopPage);
      const responsivePatterns = desktopPage.locator(
        '[data-component-example-id="app-shell-layouts"] .tr-app-shell',
      );
      expect(await responsivePatterns.count()).toBe(3);
      await expectVisible(
        desktopPage
          .locator('[data-component-example-id="app-shell-layouts"]')
          .getByText('Persistent mobile rail', { exact: true }),
      );
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
      expect(desktopPage.url()).toBe(`${origin}/en/components/app-shell`);
      expect(await desktopPage.evaluate(() => window.scrollY)).toBe(0);
      const stickySidebarBox = await desktopSidebar.boundingBox();
      expect(stickySidebarBox).not.toBeNull();
      expect(stickySidebarBox?.y).toBe(desktopHeaderBox?.height);
      expect(
        await desktopSidebarViewport.evaluate((element) => element.scrollTop),
      ).toBe(sidebarScrollTop);
      await desktopSidebar
        .getByRole('link', { name: 'Colors and themes', exact: true })
        .click();
      await desktopPage
        .getByRole('heading', { level: 1, name: 'Colors and themes' })
        .waitFor();
      await expect
        .poll(() => desktopMainViewport.evaluate((element) => element.scrollTop))
        .toBe(0);
      await desktopPage.goBack();
      await desktopPage.getByRole('heading', { level: 1, name: 'AppShell' }).waitFor();
      expect(desktopPage.url()).toBe(`${origin}/en/components/app-shell`);
      await expect
        .poll(() => desktopMainViewport.evaluate((element) => element.scrollTop))
        .toBe(mainScrollTop);

      await gotoHydrated(mobilePage, `${origin}/en/components/app-shell`);
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
      const staticPopup = mobilePage.locator(
        '.tr-app-shell-drawer-popup[data-open][aria-label="Example navigation"]',
      );
      await expectDrawerGeometry(
        mobilePage,
        staticPopup,
        basicExample.locator('[data-component-example-preview-frame]'),
      );
      await expectVisible(
        staticPopup.getByText('Production workspace', { exact: true }),
      );
      await expectVisible(
        staticPopup.getByRole('link', { name: 'Services', exact: true }),
      );
      await expectVisible(staticPopup.getByText('Avery Kim', { exact: true }));
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
      const sitePopup = mobilePage.locator(
        '.tr-app-shell-drawer-popup[data-open][aria-label="Documentation sidebar"]',
      );
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
      const playgroundPopup = mobilePage.locator(
        '.tr-app-shell-drawer-popup[data-open][aria-label="Example navigation"]',
      );
      await expectDrawerGeometry(
        mobilePage,
        playgroundPopup,
        mobilePage.locator('[data-playground-preview-frame]').first(),
      );
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
      let scrollableReferences = 0;
      for (const foundation of [
        { label: 'Radius reference', path: 'radius' },
        { label: 'Control size recipe', path: 'controls' },
        { label: 'Layer order reference', path: 'elevation' },
      ]) {
        await page.goto(`${origin}/en/foundations/${foundation.path}`);
        const scroller = page.getByLabel(foundation.label);
        await expect(scroller.getAttribute('tabindex')).resolves.toBe('0');
        const { clientWidth, scrollWidth } = await scroller.evaluate((element) => ({
          clientWidth: element.clientWidth,
          scrollWidth: element.scrollWidth,
        }));
        if (scrollWidth > clientWidth + 1) {
          scrollableReferences += 1;
          await scroller.focus();
          const before = await scroller.evaluate((element) => element.scrollLeft);
          for (let press = 0; press < 10; press += 1) {
            await page.keyboard.press('ArrowRight');
          }
          await expect
            .poll(() => scroller.evaluate((element) => element.scrollLeft))
            .toBeGreaterThan(before);
        }
        const fragmentedCells = await scroller
          .locator('th, td')
          .evaluateAll(
            (cells) =>
              cells.filter((cell) => cell.scrollWidth > cell.clientWidth + 1).length,
          );
        expect(fragmentedCells).toBe(0);
      }
      expect(scrollableReferences).toBeGreaterThan(0);

      for (const [path, exampleIds] of [
        ['/en/components/collapsible', ['collapsible-basic', 'collapsible-lifecycle']],
        [
          '/en/components/field',
          ['field-basic', 'field-field-states', 'field-validation'],
        ],
        [
          '/en/components/radio-group',
          ['radio-group-basic', 'radio-group-states', 'radio-group-validation'],
        ],
        ['/en/components/scroll-area', ['scroll-area-basic', 'scroll-area-states']],
        ['/en/components/slider', ['slider-validation']],
        [
          '/en/components/switch',
          ['switch-basic', 'switch-states', 'switch-validation'],
        ],
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

      await gotoHydrated(page, `${origin}/en/components/radio-group`);
      const radioGroups = page.getByRole('radiogroup');
      await expect(radioGroups.count()).resolves.toBeGreaterThan(0);
      await expect(page.getByRole('radiogroup', { name: /.+/ }).count()).resolves.toBe(
        await radioGroups.count(),
      );
      const radios = page.getByRole('radio');
      await expect(page.getByRole('radio', { name: /.+/ }).count()).resolves.toBe(
        await radios.count(),
      );

      await gotoHydrated(page, `${origin}/en/components/switch`);
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
        await page.goto(`${origin}/en/foundations/motion`);

        for (const [headingLevel, headingName] of [
          [1, 'Motion'],
          [3, 'One change, three response speeds'],
          [3, 'Same duration, different rhythm'],
          [3, 'Remove travel, preserve the state change'],
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
        await page.goto(`${origin}/en/foundations/logo`);
        await page.getByRole('heading', { level: 1, name: 'Logo' }).waitFor();

        const proseLayouts = page.locator('.tr-mdx > .tr-mdx-p + div');
        await expect(proseLayouts.count()).resolves.toBe(5);
        for (const layout of await proseLayouts.all()) {
          const paragraph = layout.locator('xpath=preceding-sibling::*[1]');
          await expect
            .poll(() => verticalGap(paragraph, layout))
            .toBeGreaterThanOrEqual(15.9);
        }

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
        await page.goto(`${origin}/en/foundations/app-icons`);
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
      await page.goto(`${origin}/en/components/accordion`);
      await page.getByRole('button', { name: 'Open navigation' }).click();
      const navigation = page.getByRole('navigation', { name: 'Documentation' });
      await navigation.getByRole('link', { name: 'Button', exact: true }).click();
      await page.getByRole('heading', { level: 1, name: 'Button' }).waitFor();
      await expect.poll(() => navigation.isVisible()).toBe(false);
      await page.goBack();
      await page.getByRole('heading', { level: 1, name: 'Accordion' }).waitFor();
      await page.goForward();
      await page.getByRole('heading', { level: 1, name: 'Button' }).waitFor();
    } finally {
      await page.close();
    }
  });

  it('shows global and link-level feedback while a document route is loading', async () => {
    const page = await browser.newPage({ viewport: { height: 900, width: 1280 } });
    const buttonRouteModule = routeModulePattern('en-components-button');
    const releaseRouteModule = await holdRouteModule(page, buttonRouteModule);
    try {
      await page.goto(`${origin}/en/components/accordion`);
      const navigation = page.getByRole('navigation', { name: 'Documentation' });
      const currentLink = navigation.getByRole('link', {
        name: 'Accordion',
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
      await expectVisible(page.getByRole('heading', { level: 1, name: 'Accordion' }));
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
    const cardRouteModule = routeModulePattern('en-components-card');
    const releaseRouteModule = await holdRouteModule(page, cardRouteModule);
    try {
      await page.goto(`${origin}/en/components/accordion`);
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
});
