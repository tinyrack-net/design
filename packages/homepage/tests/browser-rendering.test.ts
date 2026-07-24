import type { Browser } from 'playwright';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import type { ComponentDocsManifestEntry } from '../app/documentation/shared/component-docs-manifest.ts';
import {
  componentDocsManifest,
  createBrowserAuditRuntime,
  expectHidden,
  expectHorizontallyInsideViewport,
  expectNoLocalOverflow,
  expectVisible,
  gotoHydrated,
  setTheme,
  settledScrollTop,
  sharp,
} from './browser-audit-runtime.ts';

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

  it('renders each documented example group within its declared item range', async () => {
    const page = await browser.newPage({ viewport: { height: 900, width: 1280 } });
    const manifest: readonly ComponentDocsManifestEntry[] = componentDocsManifest;
    const documentedComponents = manifest.filter(
      (entry) => entry.exampleGroups !== undefined,
    );
    const violations: string[] = [];

    try {
      for (const locale of ['en', 'ko', 'ja'] as const) {
        for (const component of documentedComponents) {
          await gotoHydrated(page, `${origin}/${locale}/components/${component.id}`);

          for (const group of component.exampleGroups ?? []) {
            const label = `/${locale}/components/${component.id}#${group.id}`;
            const example = page.locator(`[data-component-example-id="${group.id}"]`);
            const exampleCount = await example.count();
            if (exampleCount !== 1) {
              violations.push(
                `${label}: expected one example, rendered ${exampleCount}`,
              );
              continue;
            }

            const itemCount = await example.locator('[data-docs-example-item]').count();
            if (itemCount < group.minItems || itemCount > group.maxItems) {
              violations.push(
                `${label}: expected ${group.minItems}-${group.maxItems} specimens, rendered ${itemCount}`,
              );
            }
          }
        }
      }

      expect(violations).toEqual([]);
    } finally {
      await page.close();
    }
  });

  it('preserves the 0.2 documentation chrome geometry', async () => {
    const desktopPage = await browser.newPage({
      viewport: { height: 900, width: 1440 },
    });
    const mobilePage = await browser.newPage({
      viewport: { height: 844, width: 390 },
    });
    try {
      await setTheme(desktopPage, 'tinyrack-dark');
      await gotoHydrated(desktopPage, `${origin}/en/components/button`);
      const desktopSidebarInner = desktopPage.locator('.tr-docs-sidebar-inner');
      const desktopHeader = desktopPage.locator('.tr-app-shell-header').first();
      const desktopMenu = desktopHeader.getByRole('button', {
        name: 'Open navigation',
      });
      const desktopClose = desktopPage.locator('.tr-docs-menu-close');
      const desktopNavigationGroup = desktopPage.locator('.tr-collapsible').first();
      const desktopLayout = desktopPage.locator('.tr-docs-content-layout');
      const desktopContent = desktopPage.locator('.tr-docs-content-column');

      await expectHidden(desktopClose);
      await expectHidden(desktopMenu);
      await expect
        .poll(() =>
          desktopNavigationGroup.evaluate(
            (element) => getComputedStyle(element).borderTopWidth,
          ),
        )
        .toBe('0px');
      const [headerBox, sidebarBox, layoutBox, contentBox] = await Promise.all([
        desktopHeader.boundingBox(),
        desktopSidebarInner.boundingBox(),
        desktopLayout.boundingBox(),
        desktopContent.boundingBox(),
      ]);
      expect(headerBox?.x).toBe(0);
      expect(headerBox?.y).toBe(0);
      expect(headerBox?.width).toBe(1440);
      expect(sidebarBox?.y).toBe(headerBox?.height);
      expect(layoutBox?.width ?? 0).toBeGreaterThan(contentBox?.width ?? 0);
      const desktopTableOfContents = desktopPage.getByRole('navigation', {
        name: 'On this page',
      });
      await expectVisible(desktopTableOfContents);
      await expectVisible(
        desktopTableOfContents.getByRole('link', { name: 'Contract' }),
      );
      const desktopOutlineBoxBefore = await desktopTableOfContents.boundingBox();
      const desktopUsageHeading = desktopPage.getByRole('heading', {
        level: 2,
        name: 'Usage',
      });
      const desktopUsageOffsetTop = await desktopUsageHeading.evaluate(
        (element) => (element as HTMLElement).offsetTop,
      );
      await desktopPage
        .locator('.tr-app-shell-scroll-viewport')
        .evaluate((element, offsetTop) => {
          element.scrollTop = offsetTop - 200;
        }, desktopUsageOffsetTop);
      await expect
        .poll(() =>
          desktopTableOfContents
            .getByRole('link', { name: 'Usage' })
            .getAttribute('aria-current'),
        )
        .toBe('location');
      const desktopOutlineBoxAfter = await desktopTableOfContents.boundingBox();
      expect(desktopOutlineBoxAfter?.y ?? Number.POSITIVE_INFINITY).toBeLessThanOrEqual(
        (desktopOutlineBoxBefore?.y ?? 0) + 2,
      );
      const desktopActions = desktopHeader.locator('.tr-app-shell-actions');
      await expect(
        desktopActions
          .locator(':scope > .tr-language-select-trigger')
          .first()
          .getAttribute('data-ui-size'),
      ).resolves.toBe('sm');
      await expect(
        desktopActions
          .locator(':scope > .tr-language-select-trigger')
          .first()
          .getAttribute('aria-label'),
      ).resolves.toBe('Language');
      await expect(
        desktopActions
          .locator(':scope > *')
          .evaluateAll((elements) =>
            elements.map((element) => element.className).filter(Boolean),
          ),
      ).resolves.toEqual([
        'tr-select-trigger tr-language-select-trigger',
        'tr-btn tr-icon-btn',
        'tr-btn tr-icon-btn tr-color-scheme-toggle',
      ]);
      const desktopPrimaryNavigation = desktopPage.getByRole('navigation', {
        name: 'Primary navigation',
      });
      await expectVisible(desktopPrimaryNavigation);
      await expect(
        desktopPrimaryNavigation
          .getByRole('link', { name: 'Docs' })
          .getAttribute('href'),
      ).resolves.toBe('/en/foundations/');
      await expect(
        desktopPrimaryNavigation
          .getByRole('link', { name: 'GitHub' })
          .getAttribute('href'),
      ).resolves.toBe('https://github.com/tinyrack-net/design');
      const desktopHeaderLinkMetrics = await desktopPrimaryNavigation.evaluate(
        (nav) => ({
          navWidth: nav.getBoundingClientRect().width,
          linkWidths: [...nav.querySelectorAll('a')].map(
            (link) => link.getBoundingClientRect().width,
          ),
        }),
      );
      expect(desktopHeaderLinkMetrics.linkWidths).toHaveLength(2);
      expect(Math.max(...desktopHeaderLinkMetrics.linkWidths)).toBeLessThan(
        desktopHeaderLinkMetrics.navWidth / 4,
      );
      await expect(
        desktopPrimaryNavigation.locator('a').evaluateAll((links) =>
          links.map((link) => ({
            className: link.className,
            display: getComputedStyle(link).display,
            padding: getComputedStyle(link).padding,
          })),
        ),
      ).resolves.toEqual([
        { className: 'tr-link', display: 'block', padding: '0px' },
        { className: 'tr-link', display: 'block', padding: '0px' },
      ]);
      await expect(
        desktopPage
          .locator('.tr-docs-sidebar-header-navigation a')
          .evaluateAll((links) => links.map((link) => link.className)),
      ).resolves.toEqual([
        'tr-link tr-docs-navigation-link',
        'tr-link tr-docs-navigation-link',
      ]);
      await expectHidden(desktopPage.getByRole('button', { name: 'Site navigation' }));
      await expect(
        desktopPage.getByRole('button', { name: 'Back to docs menu' }).count(),
      ).resolves.toBe(0);
      await expectVisible(
        desktopPage.locator('.tr-docs-sidebar-inner > .tr-docs-navigation'),
      );

      await setTheme(mobilePage, 'tinyrack-dark');
      await gotoHydrated(mobilePage, `${origin}/en/components/button`);
      await expectVisible(mobilePage.getByRole('combobox', { name: 'On this page' }));
      const mobileHeadingBox = await mobilePage
        .getByRole('heading', {
          level: 1,
          name: 'Button',
        })
        .boundingBox();
      const mobileTableOfContentsBox = await mobilePage
        .getByRole('combobox', { name: 'On this page' })
        .boundingBox();
      expect(mobileTableOfContentsBox?.y ?? Number.POSITIVE_INFINITY).toBeLessThan(
        mobileHeadingBox?.y ?? 0,
      );
      expect(mobileHeadingBox?.y ?? 0).toBeGreaterThan(
        (mobileTableOfContentsBox?.y ?? 0) + (mobileTableOfContentsBox?.height ?? 0),
      );
      await mobilePage.getByRole('combobox', { name: 'On this page' }).click();
      await mobilePage.getByRole('option', { name: 'Install' }).click();
      await expect.poll(() => mobilePage.url()).toContain('#install');
      const mobileTheme = mobilePage.getByRole('button', {
        name: 'Use light color scheme',
      });
      const mobileMenu = mobilePage.getByRole('button', {
        name: 'Open navigation',
      });
      const [mobileHeaderBox, menuBox, themeBox] = await Promise.all([
        mobilePage.locator('.tr-app-shell-header').boundingBox(),
        mobileMenu.boundingBox(),
        mobileTheme.boundingBox(),
      ]);
      expect(menuBox?.x ?? Number.POSITIVE_INFINITY).toBeCloseTo(
        (mobileHeaderBox?.x ?? 0) + 16,
        0,
      );
      expect(menuBox?.x ?? 0).toBeLessThan(themeBox?.x ?? 0);
      await expectHidden(
        mobilePage
          .locator('.tr-app-shell-header')
          .getByRole('navigation', { name: 'Primary navigation' }),
      );
      await expectHidden(
        mobilePage.locator('.tr-app-shell-header .tr-language-select-trigger'),
      );
      await mobileMenu.click();
      const mobileDrawer = mobilePage.locator('.tr-app-shell-drawer-popup[data-open]');
      const mobilePrimaryNavigation = mobileDrawer.locator('.tr-docs-navigation');
      await expectVisible(mobilePrimaryNavigation);
      const mobileLanguageSelect = mobileDrawer.locator(
        '.tr-app-shell-actions .tr-language-select-trigger',
      );
      await expectVisible(mobileLanguageSelect);
      await expect(
        mobileLanguageSelect.evaluate(
          (element) =>
            Math.abs(
              element.getBoundingClientRect().width -
                (element.parentElement?.getBoundingClientRect().width ?? 0),
            ) < 0.5,
        ),
      ).resolves.toBe(true);
      await expect(
        mobileDrawer
          .locator('.tr-docs-sidebar-inner')
          .evaluate((element) => getComputedStyle(element).display),
      ).resolves.toBe('flex');
      await expect(
        mobileDrawer
          .locator('.tr-app-shell-actions')
          .evaluate((element) => element === element.parentElement?.lastElementChild),
      ).resolves.toBe(true);
      await expect(mobileLanguageSelect.getAttribute('data-ui-size')).resolves.toBe(
        'sm',
      );
      await mobileLanguageSelect.click();
      const mobileLanguagePopup = mobilePage.locator('.tr-select-popup[data-open]');
      await expect.poll(() => mobileLanguagePopup.count()).toBe(1);
      await expectVisible(mobileLanguagePopup);
      await expect(
        mobileLanguagePopup.evaluate((element) => {
          const option = element.querySelector<HTMLElement>('[role="option"]');
          if (!option) return false;
          const rect = option.getBoundingClientRect();
          return (
            document
              .elementFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2)
              ?.closest('.tr-select-popup') === element
          );
        }),
      ).resolves.toBe(true);
      await mobilePage.keyboard.press('Escape');
      const mobileSiteNavigation = mobilePage.getByRole('button', {
        name: 'Main menu',
      });
      await expectVisible(mobileSiteNavigation);
      await mobileSiteNavigation.click();
      await expectHidden(
        mobilePage.locator('.tr-app-shell-drawer-popup[data-open] .tr-docs-navigation'),
      );
      const mobileHeaderNavigation = mobilePage
        .locator('.tr-app-shell-drawer-popup[data-open]')
        .locator('.tr-docs-sidebar-header-navigation');
      await expectVisible(
        mobilePage.getByRole('button', { name: 'Back to docs menu' }),
      );
      await expectVisible(mobileHeaderNavigation);
      await mobilePage.getByRole('button', { name: 'Back to docs menu' }).click();
      await expectVisible(
        mobilePage.locator('.tr-app-shell-drawer-popup[data-open] .tr-docs-navigation'),
      );
      await mobilePage.getByRole('button', { name: 'Close navigation' }).click();
    } finally {
      await desktopPage.close();
      await mobilePage.close();
    }
  });

  it('keeps the TOC compact until the content column has room for it', async () => {
    const page = await browser.newPage({ viewport: { height: 900, width: 1024 } });

    try {
      await setTheme(page, 'tinyrack-light');
      await gotoHydrated(page, `${origin}/en/components/button`);
      const desktopTocList = page
        .getByRole('navigation', { name: 'On this page' })
        .locator('.tr-table-of-contents-desktop > ol');

      for (const width of [1024, 1279]) {
        await page.setViewportSize({ width, height: 900 });
        const layout = page.locator('.tr-docs-content-layout');
        const content = page.locator('.tr-docs-content-column');

        await expectVisible(page.getByRole('combobox', { name: 'On this page' }));
        await expectHidden(desktopTocList);
        await expectNoLocalOverflow(page.locator('html'), `TOC at ${width}px`);
        await expect
          .poll(() =>
            layout.evaluate((element) => {
              const style = getComputedStyle(element);
              return style.gridTemplateColumns === `${element.clientWidth}px`;
            }),
          )
          .toBe(true);
        await expect
          .poll(async () => (await content.boundingBox())?.width ?? 0)
          .toBeGreaterThan(500);
      }

      await page.setViewportSize({ width: 1280, height: 900 });
      await expectVisible(desktopTocList);
      await expectHidden(page.getByRole('combobox', { name: 'On this page' }));
      await expect
        .poll(() =>
          page.locator('.tr-docs-content-layout').evaluate((element) => {
            const style = getComputedStyle(element);
            return style.gridTemplateColumns.split(' ').length;
          }),
        )
        .toBe(2);
      await expect
        .poll(async () => {
          const sidebarWidth =
            (await page.locator('.tr-app-shell-sidebar').boundingBox())?.width ?? 0;
          const outlineWidth =
            (await page.locator('.tr-app-shell-outline').boundingBox())?.width ?? 0;
          return outlineWidth <= sidebarWidth;
        })
        .toBe(true);
    } finally {
      await page.close();
    }
  });

  it('previews adjacent documents and keeps pagination responsive', async () => {
    const desktopPage = await browser.newPage({
      viewport: { height: 900, width: 1280 },
    });
    const mobilePage = await browser.newPage({ viewport: { height: 844, width: 390 } });

    try {
      await setTheme(desktopPage, 'tinyrack-light');
      await desktopPage.goto(`${origin}/en/components/icon-button`);
      const desktopViewport = desktopPage.locator('.tr-app-shell-scroll-viewport');

      const desktopPagination = desktopPage.getByRole('navigation', {
        name: 'Previous and next documents',
      });
      const previousDocument = desktopPagination.getByRole('link', {
        name: 'Previous document: CopyButton',
      });
      const nextDocument = desktopPagination.getByRole('link', {
        name: 'Next document: LinkButton',
      });

      await expect(previousDocument.getAttribute('href')).resolves.toBe(
        '/en/components/copy-button/',
      );
      await expect(nextDocument.getAttribute('href')).resolves.toBe(
        '/en/components/link-button/',
      );
      await expect(
        previousDocument.locator('.tr-document-pagination-description').textContent(),
      ).resolves.toBe(
        'A reusable copy action with Clipboard API fallback and accessible status announcements.',
      );
      await expect(
        nextDocument.locator('.tr-document-pagination-description').textContent(),
      ).resolves.toBe(
        'Navigation that looks like a button, rendered as a real anchor with six intents, three appearances, and three sizes.',
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
      await desktopPage
        .getByRole('heading', { level: 1, name: 'LinkButton' })
        .waitFor();
      await expect
        .poll(() => desktopPage.url())
        .toBe(`${origin}/en/components/link-button/`);
      await expect
        .poll(() => desktopViewport.evaluate((element) => element.scrollTop))
        .toBe(0);

      await setTheme(mobilePage, 'tinyrack-dark');
      await mobilePage.goto(`${origin}/en/components/icon-button`);
      const mobilePagination = mobilePage.getByRole('navigation', {
        name: 'Previous and next documents',
      });
      const mobilePrevious = mobilePagination.getByRole('link', {
        name: 'Previous document: CopyButton',
      });
      const mobileNext = mobilePagination.getByRole('link', {
        name: 'Next document: LinkButton',
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

  it('runs independent Welcome motion and resumes from its paused position', async () => {
    const desktopPage = await browser.newPage({
      viewport: { height: 1024, width: 1440 },
    });
    const reducedPage = await browser.newPage({
      viewport: { height: 844, width: 390 },
    });
    const readMotionValues = async (page: typeof desktopPage) => {
      const productWindow = page.locator('[data-welcome-app]');
      return {
        bars: await productWindow
          .locator('[data-welcome-throughput-bar]')
          .evaluateAll((elements) =>
            elements.map((element) => getComputedStyle(element).transform),
          ),
        deploymentPhase: await productWindow
          .locator('[data-welcome-throughput]')
          .getAttribute('data-welcome-deployment-phase'),
        liveActivity: await productWindow
          .locator('[data-welcome-live-activity] strong')
          .textContent(),
        metrics: await productWindow
          .locator('[data-welcome-metric-value]')
          .allTextContents(),
        progress: await productWindow
          .locator('[data-welcome-deployment-progress]')
          .textContent(),
        services: await productWindow
          .locator('[data-welcome-service-value]')
          .allTextContents(),
      };
    };

    try {
      await desktopPage.clock.install();
      await setTheme(desktopPage, 'tinyrack-dark');
      await gotoHydrated(desktopPage, `${origin}/en`);

      const productWindow = desktopPage.locator('[data-welcome-app]');
      await expect
        .poll(() => productWindow.getAttribute('data-welcome-simulation-running'))
        .toBe('true');
      expect(
        await productWindow.getAttribute('data-welcome-simulation-phase'),
      ).toBeNull();
      expect(
        await productWindow.evaluate(
          (element) => getComputedStyle(element).animationName,
        ),
      ).toBe('none');
      const initialBox = await productWindow.boundingBox();
      expect(initialBox).not.toBeNull();
      const status = productWindow.locator('[data-welcome-status]');
      expect(await status.textContent()).toContain('All systems operational');

      const phaseLabel = productWindow.locator('[data-welcome-phase-label]');
      await phaseLabel.evaluate((element) => {
        element.setAttribute('data-dom-marker', 'persistent');
      });
      expect(
        await phaseLabel.evaluate((element) =>
          getComputedStyle(element)
            .transitionDuration.split(',')
            .map((value) => value.trim()),
        ),
      ).toContain('0.36s');

      const barMotion = await productWindow
        .locator('[data-welcome-throughput-bar]')
        .evaluateAll((elements) =>
          elements.slice(0, 2).map((element) => {
            const style = getComputedStyle(element);
            return {
              delay: style.animationDelay,
              name: style.animationName,
              playState: style.animationPlayState,
            };
          }),
        );
      expect(barMotion).toEqual([
        {
          delay: '0s',
          name: 'welcome-throughput-wave',
          playState: 'running',
        },
        {
          delay: '-0.32s',
          name: 'welcome-throughput-wave',
          playState: 'running',
        },
      ]);

      const signalSamples = [await readMotionValues(desktopPage)];
      for (let index = 0; index < 40; index += 1) {
        const progress = await productWindow
          .locator('[data-welcome-deployment-progress]')
          .textContent();
        if (progress === '8%') break;
        await desktopPage.clock.runFor(80);
      }
      const hiddenReset = await readMotionValues(desktopPage);
      expect(hiddenReset.deploymentPhase).toBe('resetting');
      expect(hiddenReset.progress).toBe('8%');
      expect(
        await productWindow
          .locator('[data-welcome-deployment]')
          .evaluate((element) => Number.parseFloat(getComputedStyle(element).opacity)),
      ).toBeLessThan(0.2);

      for (let index = 0; index < 8; index += 1) {
        const phase = await productWindow
          .locator('[data-welcome-throughput]')
          .getAttribute('data-welcome-deployment-phase');
        if (phase === 'deploying') break;
        await desktopPage.clock.runFor(80);
      }
      await expect
        .poll(() =>
          productWindow
            .locator('[data-welcome-throughput]')
            .getAttribute('data-welcome-deployment-phase'),
        )
        .toBe('deploying');
      expect(await phaseLabel.getAttribute('data-dom-marker')).toBe('persistent');
      expect(await phaseLabel.getAttribute('data-variant')).toBe('info');
      const activityBefore = await productWindow
        .locator('[data-welcome-live-activity] strong')
        .textContent();

      let activityAfter = activityBefore;
      for (let index = 0; index < 8 && activityAfter === activityBefore; index += 1) {
        await desktopPage.clock.runFor(80);
        activityAfter = await productWindow
          .locator('[data-welcome-live-activity] strong')
          .textContent();
      }
      expect(activityAfter).not.toBe(activityBefore);
      expect(
        await productWindow
          .locator('[data-welcome-throughput]')
          .getAttribute('data-welcome-deployment-phase'),
      ).toBe('deploying');

      const deploymentProgress = [
        Number.parseInt(
          (await productWindow
            .locator('[data-welcome-deployment-progress]')
            .textContent()) ?? '0',
          10,
        ),
      ];
      for (let index = 0; index < 5; index += 1) {
        await desktopPage.clock.runFor(2_400);
        const values = await readMotionValues(desktopPage);
        signalSamples.push(values);
        deploymentProgress.push(Number.parseInt(values.progress ?? '0', 10));
      }
      expect(deploymentProgress).toEqual([...deploymentProgress].sort((a, b) => a - b));
      expect(
        new Set(signalSamples.map((sample) => sample.metrics[0])).size,
      ).toBeGreaterThan(1);
      expect(
        new Set(signalSamples.map((sample) => sample.metrics[1])).size,
      ).toBeGreaterThan(1);
      for (const serviceIndex of [0, 1, 2]) {
        expect(
          new Set(signalSamples.map((sample) => sample.services[serviceIndex])).size,
        ).toBeGreaterThan(1);
      }
      expect(
        new Set(signalSamples.map((sample) => sample.bars[0])).size,
      ).toBeGreaterThan(1);

      await desktopPage.clock.runFor(1_000);
      await expect
        .poll(() =>
          productWindow
            .locator('[data-welcome-throughput]')
            .getAttribute('data-welcome-deployment-phase'),
        )
        .toBe('verifying');
      expect(await phaseLabel.getAttribute('data-dom-marker')).toBe('persistent');
      expect(await phaseLabel.getAttribute('data-variant')).toBe('warning');

      await desktopPage.clock.runFor(4_600);
      await expect
        .poll(() =>
          productWindow
            .locator('[data-welcome-throughput]')
            .getAttribute('data-welcome-deployment-phase'),
        )
        .toBe('complete');
      expect(await phaseLabel.getAttribute('data-dom-marker')).toBe('persistent');
      expect(await phaseLabel.getAttribute('data-variant')).toBe('success');
      expect(
        await productWindow.locator('[data-welcome-deployment-progress]').textContent(),
      ).toBe('100%');
      expect(await status.textContent()).toContain('All systems operational');

      const scrollViewport = desktopPage.locator('.tr-app-shell-scroll-viewport');
      await desktopPage.setViewportSize({ height: 160, width: 1440 });
      await scrollViewport.evaluate((element) => {
        element.scrollTop = element.scrollHeight;
      });
      await desktopPage.clock.runFor(80);
      const offscreenGeometry = await productWindow.evaluate((element) => {
        const viewport = document.querySelector('.tr-app-shell-scroll-viewport');
        const productBox = element.getBoundingClientRect();
        const viewportBox = viewport?.getBoundingClientRect();
        return {
          productBottom: productBox.bottom,
          productTop: productBox.top,
          scrollHeight: viewport?.scrollHeight ?? 0,
          scrollTop: viewport?.scrollTop ?? 0,
          viewportBottom: viewportBox?.bottom ?? 0,
          viewportTop: viewportBox?.top ?? 0,
        };
      });
      expect(offscreenGeometry.productBottom).toBeLessThanOrEqual(
        offscreenGeometry.viewportTop,
      );
      await expect
        .poll(() => productWindow.getAttribute('data-welcome-simulation-running'))
        .toBe('false');
      await desktopPage.clock.runFor(80);
      const offscreenValues = await readMotionValues(desktopPage);
      await desktopPage.clock.runFor(3_000);
      const offscreenValuesAfterWait = await readMotionValues(desktopPage);
      expect({ ...offscreenValuesAfterWait, bars: offscreenValues.bars }).toEqual(
        offscreenValues,
      );
      for (const [index, transform] of offscreenValues.bars.entries()) {
        const afterTransform = offscreenValuesAfterWait.bars[index] ?? transform;
        const scale = Number.parseFloat(transform.split(',')[3] ?? '0');
        const afterScale = Number.parseFloat(afterTransform.split(',')[3] ?? '0');
        expect(Math.abs(afterScale - scale)).toBeLessThan(0.01);
      }
      expect(
        await productWindow
          .locator('[data-welcome-throughput-bar]')
          .first()
          .evaluate((element) => getComputedStyle(element).animationPlayState),
      ).toBe('paused');

      await desktopPage.setViewportSize({ height: 1024, width: 1440 });
      await scrollViewport.evaluate((element) => {
        element.scrollTop = 0;
      });
      await desktopPage.clock.runFor(80);
      await expect
        .poll(() => productWindow.getAttribute('data-welcome-simulation-running'))
        .toBe('true');
      await desktopPage.clock.runFor(480);
      expect(await readMotionValues(desktopPage)).not.toEqual(offscreenValues);

      await desktopPage.evaluate(() => {
        Object.defineProperty(document, 'hidden', {
          configurable: true,
          get: () => true,
        });
        document.dispatchEvent(new Event('visibilitychange'));
      });
      await expect
        .poll(() => productWindow.getAttribute('data-welcome-simulation-running'))
        .toBe('false');
      await desktopPage.clock.runFor(80);
      const hiddenTabValues = await readMotionValues(desktopPage);
      await desktopPage.clock.runFor(3_000);
      const hiddenTabValuesAfterWait = await readMotionValues(desktopPage);
      expect({ ...hiddenTabValuesAfterWait, bars: hiddenTabValues.bars }).toEqual(
        hiddenTabValues,
      );
      for (const [index, transform] of hiddenTabValues.bars.entries()) {
        const afterTransform = hiddenTabValuesAfterWait.bars[index] ?? transform;
        const scale = Number.parseFloat(transform.split(',')[3] ?? '0');
        const afterScale = Number.parseFloat(afterTransform.split(',')[3] ?? '0');
        expect(Math.abs(afterScale - scale)).toBeLessThan(0.01);
      }
      await desktopPage.evaluate(() => {
        Object.defineProperty(document, 'hidden', {
          configurable: true,
          get: () => false,
        });
        document.dispatchEvent(new Event('visibilitychange'));
      });
      await expect
        .poll(() => productWindow.getAttribute('data-welcome-simulation-running'))
        .toBe('true');
      const resumedBox = await productWindow.boundingBox();
      expect(resumedBox).not.toBeNull();
      expect(Math.abs((resumedBox?.x ?? 0) - (initialBox?.x ?? 0))).toBeLessThanOrEqual(
        1,
      );

      await reducedPage.clock.install();
      await reducedPage.emulateMedia({ reducedMotion: 'reduce' });
      await setTheme(reducedPage, 'tinyrack-dark');
      await gotoHydrated(reducedPage, `${origin}/ko`);
      const reducedProductWindow = reducedPage.locator('[data-welcome-app]');
      await expect
        .poll(() =>
          reducedProductWindow.getAttribute('data-welcome-simulation-running'),
        )
        .toBe('false');
      const reducedValues = await readMotionValues(reducedPage);
      expect(reducedValues.metrics.slice(0, 2)).toEqual(['12 / 14', '48%']);
      expect(reducedValues.progress).toBe('100%');
      expect(reducedValues.services).toEqual(['92%', '72%', '86%']);
      expect(reducedValues.deploymentPhase).toBe('complete');
      expect(
        await reducedProductWindow
          .locator('[data-welcome-throughput-bar]')
          .first()
          .evaluate((element) => getComputedStyle(element).animationName),
      ).toBe('none');
      await reducedPage.clock.runFor(60_000);
      expect(await readMotionValues(reducedPage)).toEqual(reducedValues);
    } finally {
      await desktopPage.close();
      await reducedPage.close();
    }
  });

  it('keeps every localized Welcome simulation readable at 320px', async () => {
    const localeCases = [
      {
        foundations: 'Foundations',
        installation: 'Get started',
        locale: 'en',
        phases: [
          { advance: 0, label: 'Done' },
          { advance: 3_400, label: 'Deploy' },
          { advance: 13_200, label: 'Verify' },
          { advance: 4_500, label: 'Done' },
        ],
      },
      {
        foundations: '파운데이션',
        installation: '시작하기',
        locale: 'ko',
        phases: [
          { advance: 0, label: '완료' },
          { advance: 3_400, label: '배포' },
          { advance: 13_200, label: '검증' },
          { advance: 4_500, label: '완료' },
        ],
      },
      {
        foundations: '基礎',
        installation: 'はじめる',
        locale: 'ja',
        phases: [
          { advance: 0, label: '完了' },
          { advance: 3_400, label: 'デプロイ' },
          { advance: 13_200, label: '検証' },
          { advance: 4_500, label: '完了' },
        ],
      },
    ] as const;

    for (const localeCase of localeCases) {
      const page = await browser.newPage({ viewport: { height: 800, width: 320 } });
      try {
        await page.clock.install();
        await setTheme(page, 'tinyrack-light');
        await gotoHydrated(page, `${origin}/${localeCase.locale}`);

        const productWindow = page.locator('[data-welcome-app]');
        const status = productWindow.locator('[data-welcome-status]');
        const phaseLabel = productWindow.locator('[data-welcome-phase-label]');
        await expectHidden(status);

        const heroContent = page.locator('[data-welcome-hero-content]');
        const [heroContentBox, installationBox, foundationsBox] = await Promise.all([
          heroContent.boundingBox(),
          page.getByRole('button', { name: localeCase.installation }).boundingBox(),
          page.getByRole('button', { name: localeCase.foundations }).boundingBox(),
        ]);
        expect(heroContentBox).not.toBeNull();
        expect(installationBox).not.toBeNull();
        expect(foundationsBox).not.toBeNull();
        expect(installationBox?.x ?? 0).toBeGreaterThanOrEqual(heroContentBox?.x ?? 0);
        expect(
          (heroContentBox?.x ?? 0) +
            (heroContentBox?.width ?? 0) -
            ((foundationsBox?.x ?? 0) + (foundationsBox?.width ?? 0)),
        ).toBeGreaterThanOrEqual(0);
        await expectHidden(page.locator('[data-welcome-description]'));

        const initialPhaseBox = await phaseLabel.boundingBox();
        expect(initialPhaseBox).not.toBeNull();
        for (const phase of localeCase.phases) {
          await page.clock.runFor(phase.advance);
          const compactPhaseLabel = phaseLabel.locator(
            '[data-welcome-phase-label-option][data-active="true"] [data-welcome-phase-label-compact]',
          );
          await expect.poll(() => compactPhaseLabel.textContent()).toBe(phase.label);
          await expectVisible(compactPhaseLabel);
          const phaseMetrics = await phaseLabel.evaluate((element) => {
            const style = getComputedStyle(element);
            return {
              height: element.getBoundingClientRect().height,
              lineHeight: Number.parseFloat(style.lineHeight),
              whiteSpace: style.whiteSpace,
            };
          });
          expect(phaseMetrics.whiteSpace).toBe('nowrap');
          expect(phaseMetrics.height).toBeLessThanOrEqual(
            phaseMetrics.lineHeight * 1.75,
          );
          const phaseBox = await phaseLabel.boundingBox();
          expect(phaseBox).not.toBeNull();
          expect(
            Math.abs((phaseBox?.width ?? 0) - (initialPhaseBox?.width ?? 0)),
          ).toBeLessThanOrEqual(1);
          expect(
            Math.abs((phaseBox?.height ?? 0) - (initialPhaseBox?.height ?? 0)),
          ).toBeLessThanOrEqual(1);
        }

        await expectNoLocalOverflow(page.locator('html'), '320px Welcome document');
        await expectHorizontallyInsideViewport(
          page,
          page.locator('[data-welcome-hero]'),
        );
      } finally {
        await page.close();
      }
    }
  });

  it('presents Welcome as a cinematic responsive product showcase', async () => {
    const desktopPage = await browser.newPage({
      viewport: { height: 1024, width: 1440 },
    });
    const compactPage = await browser.newPage({
      viewport: { height: 720, width: 1280 },
    });
    const mobilePage = await browser.newPage({ viewport: { height: 844, width: 390 } });
    const pageErrors: string[] = [];
    const consoleErrors: string[] = [];
    desktopPage.on('pageerror', (error) => pageErrors.push(error.message));
    mobilePage.on('pageerror', (error) => pageErrors.push(error.message));
    desktopPage.on('console', (message) => {
      if (message.type() === 'error') consoleErrors.push(message.text());
    });
    mobilePage.on('console', (message) => {
      if (message.type() === 'error') consoleErrors.push(message.text());
    });
    await setTheme(desktopPage, 'tinyrack-light');
    await setTheme(compactPage, 'tinyrack-dark');
    await setTheme(mobilePage, 'tinyrack-dark');
    await mobilePage.emulateMedia({ reducedMotion: 'reduce' });

    try {
      await gotoHydrated(desktopPage, `${origin}/en`);
      await gotoHydrated(compactPage, `${origin}/ko`);
      await gotoHydrated(mobilePage, `${origin}/en`);

      expect(
        await desktopPage.locator('.tr-app-shell').getAttribute('data-chrome'),
      ).toBe('splash');
      await expectHidden(desktopPage.locator('.tr-app-shell-sidebar'));

      const desktopHero = desktopPage.locator('[data-welcome-hero]');
      const productWindow = desktopHero.locator('[data-welcome-app]');
      const gradient = desktopHero.locator('[data-welcome-gradient]');
      const title = desktopPage.getByRole('heading', {
        level: 1,
        name: 'TINYRACK DESIGN SYSTEM',
      });
      const installation = desktopPage.getByRole('button', {
        name: 'Get started',
      });
      const foundations = desktopPage.getByRole('button', { name: 'Foundations' });
      const mainViewport = desktopPage.locator('.tr-app-shell-scroll-viewport');

      await expectVisible(title);
      await expectVisible(desktopHero.getByText('React 19', { exact: true }));
      await expectVisible(desktopHero.getByText('Base UI', { exact: true }));
      await expectVisible(
        desktopHero.getByText(`${componentDocsManifest.length} components`, {
          exact: true,
        }),
      );
      await expectVisible(
        desktopHero.getByText(
          'Accessible React UI for dashboards and internal tools.',
          { exact: true },
        ),
      );
      await expectVisible(productWindow);
      await expectVisible(gradient);
      const gradientBackground = await gradient.evaluate(
        (element) => getComputedStyle(element).backgroundImage,
      );
      expect(gradientBackground).toContain('linear-gradient');

      const titleTypography = await title.evaluate((element) => {
        const style = getComputedStyle(element);
        return {
          fontSize: Number.parseFloat(style.fontSize),
          lineHeight: Number.parseFloat(style.lineHeight),
        };
      });
      expect(
        titleTypography.lineHeight / titleTypography.fontSize,
      ).toBeGreaterThanOrEqual(0.96);
      expect(
        await productWindow.evaluate((element) => getComputedStyle(element).zIndex),
      ).toBe('0');
      expect(
        await gradient.evaluate((element) => getComputedStyle(element).zIndex),
      ).toBe('1');
      expect(
        await desktopHero
          .locator('[data-welcome-hero-content]')
          .evaluate((element) => getComputedStyle(element).zIndex),
      ).toBe('2');

      const rackLabel = productWindow.locator(
        '[data-welcome-environment] .tr-app-shell-sidebar-label',
      );
      const rackLabelMetrics = await rackLabel.evaluate((element) => {
        const style = getComputedStyle(element);
        return {
          height: element.getBoundingClientRect().height,
          lineHeight: Number.parseFloat(style.lineHeight),
          whiteSpace: style.whiteSpace,
        };
      });
      expect(rackLabelMetrics.whiteSpace).toBe('nowrap');
      expect(rackLabelMetrics.height).toBeLessThanOrEqual(
        rackLabelMetrics.lineHeight * 1.1,
      );
      expect
        .soft(
          await rackLabel.locator('strong').evaluate((element) => element.textContent),
        )
        .toBe('Rack A');

      const heroBox = await desktopHero.boundingBox();
      const productBox = await productWindow.boundingBox();
      const titleBox = await title.boundingBox();
      const gradientBox = await gradient.boundingBox();
      const appHeaderBox = await productWindow
        .locator('.tr-app-shell-header')
        .boundingBox();
      expect(heroBox).not.toBeNull();
      expect(productBox).not.toBeNull();
      expect(titleBox).not.toBeNull();
      expect(gradientBox).not.toBeNull();
      expect(appHeaderBox).not.toBeNull();
      expect(heroBox?.height ?? 0).toBeGreaterThanOrEqual(900);
      expect(productBox?.height ?? 0).toBeGreaterThanOrEqual(960);
      expect(productBox?.y ?? 0).toBeLessThan(titleBox?.y ?? 0);
      expect((productBox?.y ?? 0) + (productBox?.height ?? 0)).toBeGreaterThan(
        titleBox?.y ?? 0,
      );
      expect(
        Math.abs(
          (gradientBox?.y ?? 0) -
            ((appHeaderBox?.y ?? 0) + (appHeaderBox?.height ?? 0)),
        ),
      ).toBeLessThanOrEqual(1);
      expect(
        Math.abs(
          (gradientBox?.y ?? 0) +
            (gradientBox?.height ?? 0) -
            ((heroBox?.y ?? 0) + (heroBox?.height ?? 0)),
        ),
      ).toBeLessThanOrEqual(1);
      expect(await productWindow.locator('[data-welcome-throughput]').count()).toBe(1);
      expect(
        await productWindow.locator('[data-welcome-throughput-stat]').count(),
      ).toBe(3);
      expect(await productWindow.locator('[data-welcome-throughput-bar]').count()).toBe(
        12,
      );
      expect(await productWindow.locator('[data-welcome-regions]').count()).toBe(1);

      const compactTitle = compactPage.locator('[data-welcome-hero-content] h1');
      await expect(compactTitle.getAttribute('aria-label')).resolves.toBe(
        'TINYRACK 디자인 시스템',
      );
      const compactProductWindow = compactPage.locator('[data-welcome-app]');
      const titleLines = compactTitle.locator('span');
      const firstTitleLineBox = await titleLines.nth(0).boundingBox();
      const secondTitleLineBox = await titleLines.nth(1).boundingBox();
      const sidebarBox = await compactProductWindow
        .locator('[data-welcome-sidebar]')
        .boundingBox();
      expect(firstTitleLineBox).not.toBeNull();
      expect(secondTitleLineBox).not.toBeNull();
      expect(sidebarBox).not.toBeNull();
      const screenshot = await compactPage.screenshot();
      const { data: screenshotPixels, info: screenshotInfo } = await sharp(screenshot)
        .removeAlpha()
        .raw()
        .toBuffer({ resolveWithObject: true });
      const sidebarBorderX =
        Math.round((sidebarBox?.x ?? 0) + (sidebarBox?.width ?? 0)) - 1;
      const titleGapY = Math.round(
        ((firstTitleLineBox?.y ?? 0) +
          (firstTitleLineBox?.height ?? 0) +
          (secondTitleLineBox?.y ?? 0)) /
          2,
      );
      const pixelAt = (x: number, y: number) => {
        const offset = (y * screenshotInfo.width + x) * screenshotInfo.channels;
        return [...screenshotPixels.subarray(offset, offset + 3)];
      };
      const borderPixel = pixelAt(sidebarBorderX, titleGapY);
      const neighboringPixel = pixelAt(sidebarBorderX + 4, titleGapY);
      expect
        .soft(
          Math.max(
            ...borderPixel.map((channel, index) =>
              Math.abs(channel - (neighboringPixel[index] ?? channel)),
            ),
          ),
        )
        .toBeLessThanOrEqual(8);
      await expectHorizontallyInsideViewport(desktopPage, desktopHero);

      expect(await installation.getAttribute('href')).toBe('/en/installation/');
      expect(await foundations.getAttribute('href')).toBe('/en/foundations/');
      await installation.focus();
      await expect(
        installation.evaluate((element) => element === document.activeElement),
      ).resolves.toBe(true);
      await desktopPage.evaluate(() => {
        window.location.hash = 'quick-start';
      });
      await expect.poll(() => new URL(desktopPage.url()).hash).toBe('#quick-start');
      await expect.poll(() => settledScrollTop(mainViewport)).toBeGreaterThan(0);

      expect(
        await desktopPage
          .locator('main [data-welcome-page] h1, main [data-welcome-content] h2')
          .allTextContents(),
      ).toEqual([
        'TINYRACKDESIGN SYSTEM',
        'Move from design rules to product UI.',
        'Build familiar product flows.',
        'Start with the complete setup.',
        'Continue with the right level of detail.',
      ]);
      expect(await desktopPage.locator('[data-welcome-composition]').count()).toBe(0);
      expect(await desktopPage.getByText('02 / System principles').count()).toBe(0);

      await expectNoLocalOverflow(mobilePage.locator('html'), 'Welcome document');
      await expectNoLocalOverflow(
        mobilePage.locator('[data-welcome-hero]'),
        'Welcome hero',
      );
      await expectHorizontallyInsideViewport(
        mobilePage,
        mobilePage.locator('[data-welcome-app]'),
      );
      const mobileTitle = mobilePage.getByRole('heading', {
        level: 1,
        name: 'TINYRACK DESIGN SYSTEM',
      });
      const mobileTitleTypography = await mobileTitle.evaluate((element) => {
        const style = getComputedStyle(element);
        return {
          fontSize: Number.parseFloat(style.fontSize),
          lineHeight: Number.parseFloat(style.lineHeight),
        };
      });
      expect(
        mobileTitleTypography.lineHeight / mobileTitleTypography.fontSize,
      ).toBeGreaterThanOrEqual(0.96);
      const mobileHero = mobilePage.locator('[data-welcome-hero]');
      const mobileGradient = mobileHero.locator('[data-welcome-gradient]');
      const [mobileHeroBox, mobileGradientBox, mobileAppHeaderBox] = await Promise.all([
        mobileHero.boundingBox(),
        mobileGradient.boundingBox(),
        mobileHero.locator('.tr-app-shell-header').boundingBox(),
      ]);
      expect(mobileHeroBox).not.toBeNull();
      expect(mobileGradientBox).not.toBeNull();
      expect(mobileAppHeaderBox).not.toBeNull();
      expect(
        Math.abs(
          (mobileGradientBox?.y ?? 0) -
            ((mobileAppHeaderBox?.y ?? 0) + (mobileAppHeaderBox?.height ?? 0)),
        ),
      ).toBeLessThanOrEqual(1);
      expect(
        Math.abs(
          (mobileGradientBox?.y ?? 0) +
            (mobileGradientBox?.height ?? 0) -
            ((mobileHeroBox?.y ?? 0) + (mobileHeroBox?.height ?? 0)),
        ),
      ).toBeLessThanOrEqual(1);
      await expectHidden(mobileHero.locator('[data-welcome-description]'));
      const mobileQuickStartBlocks = mobilePage.locator(
        '[data-welcome-content] .tr-code-block',
      );
      await expect(mobileQuickStartBlocks.count()).resolves.toBe(2);
      for (let index = 0; index < (await mobileQuickStartBlocks.count()); index += 1) {
        await expectHorizontallyInsideViewport(
          mobilePage,
          mobileQuickStartBlocks.nth(index),
        );
      }
      expect(await mobilePage.locator('html').getAttribute('data-theme')).toBe(
        'tinyrack-dark',
      );
      expect(
        await mobilePage
          .locator('[data-welcome-app]')
          .evaluate((element) => getComputedStyle(element).animationName),
      ).toBe('none');
      const mobileShell = mobilePage.locator('[data-welcome-app] .tr-app-shell');
      const mobileRail = mobileShell.locator(':scope > .tr-app-shell-sidebar');
      const mobileMain = mobileShell.locator(':scope > .tr-app-shell-main');
      const mobileRailBox = await mobileRail.boundingBox();
      const mobileMainBox = await mobileMain.boundingBox();
      expect(await mobileShell.getAttribute('data-mobile-sidebar')).toBe('rail');
      expect(await mobileShell.getAttribute('data-sidebar-mode')).toBe('rail');
      expect(mobileRailBox?.width).toBe(64);
      expect(mobileMainBox).not.toBeNull();
      expect((mobileMainBox?.x ?? 0) + 0.5).toBeGreaterThanOrEqual(
        (mobileRailBox?.x ?? 0) + (mobileRailBox?.width ?? 0),
      );
      expect(await mobileShell.locator('.tr-app-shell-drawer-popup').count()).toBe(0);
      for (const label of ['Rack A', 'Overview', 'Deployments']) {
        const hiddenLabel = mobileShell
          .locator('.tr-app-shell-sidebar-label')
          .filter({ hasText: label })
          .first();
        const hiddenBox = await hiddenLabel.boundingBox();
        expect(hiddenBox).not.toBeNull();
        expect(hiddenBox?.width ?? Number.POSITIVE_INFINITY).toBeLessThanOrEqual(1);
        expect(hiddenBox?.height ?? Number.POSITIVE_INFINITY).toBeLessThanOrEqual(1);
      }
      const railIcons = mobileRail.locator('nav > span > svg');
      for (let index = 0; index < (await railIcons.count()); index += 1) {
        const itemBox = await railIcons.nth(index).locator('..').boundingBox();
        const glyphBox = await railIcons.nth(index).boundingBox();
        expect(itemBox).not.toBeNull();
        expect(glyphBox).not.toBeNull();
        expect
          .soft(
            Math.abs(
              (itemBox?.x ?? 0) +
                (itemBox?.width ?? 0) / 2 -
                ((glyphBox?.x ?? 0) + (glyphBox?.width ?? 0) / 2),
            ),
          )
          .toBeLessThanOrEqual(1);
      }

      await gotoHydrated(mobilePage, `${origin}/ko`);
      const monitoringSwitch = mobilePage.getByRole('switch', {
        name: '상태 모니터링 사용',
      });
      await monitoringSwitch.focus();
      await expect(
        monitoringSwitch.evaluate((element) => element === document.activeElement),
      ).resolves.toBe(true);
      await expect(monitoringSwitch.getAttribute('aria-checked')).resolves.toBe('true');
      await monitoringSwitch.press('Space');
      await expect(monitoringSwitch.getAttribute('aria-checked')).resolves.toBe(
        'false',
      );
      const feedbackTab = mobilePage.getByRole('tab', {
        name: '상태와 피드백',
      });
      await feedbackTab.focus();
      await feedbackTab.press('Enter');
      await expect(feedbackTab.getAttribute('aria-selected')).resolves.toBe('true');
      await expectVisible(
        mobilePage.getByRole('status').getByText('배포 준비 완료', {
          exact: true,
        }),
      );
      await expectVisible(
        mobilePage.locator('[data-welcome-app]').getByText('프로덕션 개요', {
          exact: true,
        }),
      );
      await expectHidden(
        mobilePage.locator('[data-welcome-app]').getByText('서비스 상태', {
          exact: true,
        }),
      );
      await expectVisible(
        mobilePage.locator('[data-welcome-app]').getByText('배포 처리량', {
          exact: true,
        }),
      );
      const consoleIcon = mobilePage.locator('[data-welcome-brand-icon]');
      const consoleTitle = mobilePage
        .locator('[data-welcome-brand]')
        .getByText('운영 콘솔', { exact: true });
      await expectVisible(consoleIcon);
      const iconBox = await consoleIcon.boundingBox();
      const iconGlyphBox = await consoleIcon.locator('svg').boundingBox();
      const consoleTitleBox = await consoleTitle.boundingBox();
      expect(iconBox).not.toBeNull();
      expect(iconGlyphBox).not.toBeNull();
      expect(consoleTitleBox).not.toBeNull();
      expect
        .soft(
          Math.abs(
            (iconBox?.y ?? 0) +
              (iconBox?.height ?? 0) / 2 -
              ((consoleTitleBox?.y ?? 0) + (consoleTitleBox?.height ?? 0) / 2),
          ),
        )
        .toBeLessThanOrEqual(1);
      expect
        .soft(
          Math.abs(
            (iconBox?.x ?? 0) +
              (iconBox?.width ?? 0) / 2 -
              ((iconGlyphBox?.x ?? 0) + (iconGlyphBox?.width ?? 0) / 2),
          ),
        )
        .toBeLessThanOrEqual(1);
      expect(pageErrors).toEqual([]);
      expect(consoleErrors).toEqual([]);
    } finally {
      await desktopPage.close();
      await compactPage.close();
      await mobilePage.close();
    }
  });
});
