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
      const desktopHeader = desktopPage.locator('.tr-docs-shell-header').first();
      const desktopMenu = desktopHeader.getByRole('button', {
        name: 'Open navigation',
      });
      const desktopClose = desktopPage.locator('.tr-docs-shell-menu-close');
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
        .locator('.tr-docs-shell-scroll-viewport')
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
      const desktopActions = desktopHeader.locator('.tr-docs-shell-actions');
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
        'tr-btn tr-docs-search-trigger tr-docs-header-search',
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
        mobilePage.locator('.tr-docs-shell-header').boundingBox(),
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
          .locator('.tr-docs-shell-header')
          .getByRole('navigation', { name: 'Primary navigation' }),
      );
      await expectHidden(
        mobilePage.locator('.tr-docs-shell-header .tr-language-select-trigger'),
      );
      await mobileMenu.click();
      const mobileDrawer = mobilePage.locator('.tr-app-shell-drawer-popup[data-open]');
      const mobilePrimaryNavigation = mobileDrawer.locator('.tr-docs-navigation');
      await expectVisible(mobilePrimaryNavigation);
      const mobileLanguageSelect = mobileDrawer.locator(
        '.tr-docs-shell-actions .tr-language-select-trigger',
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
          .locator('.tr-docs-shell-actions')
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
            (await page.locator('.tr-docs-shell-sidebar').boundingBox())?.width ?? 0;
          const outlineWidth =
            (await page.locator('.tr-docs-shell-outline').boundingBox())?.width ?? 0;
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
      await desktopPage.goto(`${origin}/en/components/button`);
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
        '/en/components/badge/',
      );
      await expect(nextDocument.getAttribute('href')).resolves.toBe(
        '/en/components/card/',
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
      await expect.poll(() => desktopPage.url()).toBe(`${origin}/en/components/card/`);
      await expect
        .poll(() => desktopViewport.evaluate((element) => element.scrollTop))
        .toBe(0);

      await setTheme(mobilePage, 'tinyrack-dark');
      await mobilePage.goto(`${origin}/en/components/button`);
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

  it('loops the Welcome operations simulation without moving the app window', async () => {
    const desktopPage = await browser.newPage({
      viewport: { height: 1024, width: 1440 },
    });
    const reducedPage = await browser.newPage({
      viewport: { height: 844, width: 390 },
    });
    const readSimulationValues = async (page: typeof desktopPage) => {
      const productWindow = page.locator('[data-welcome-app]');
      return {
        bars: await productWindow
          .locator('[data-welcome-throughput-bar]')
          .evaluateAll((elements) =>
            elements.map((element) => (element as HTMLElement).style.height),
          ),
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
      expect(await productWindow.getAttribute('data-welcome-simulation-phase')).toBe(
        'monitoring',
      );
      expect(
        await productWindow.evaluate(
          (element) => getComputedStyle(element).animationName,
        ),
      ).toBe('none');
      const initialBox = await productWindow.boundingBox();
      expect(initialBox).not.toBeNull();

      const expectedFrames = [
        {
          load: '41%',
          nodes: '12 / 12',
          phase: 'monitoring',
          progress: '100%',
          services: ['92%', '68%', '84%'],
          status: 'All systems operational',
        },
        {
          load: '48%',
          nodes: '12 / 12',
          phase: 'deploying',
          progress: '28%',
          services: ['91%', '74%', '84%'],
          status: 'Deploying v2.8.5',
        },
        {
          load: '57%',
          nodes: '14 / 14',
          phase: 'scaling',
          progress: '62%',
          services: ['90%', '82%', '82%'],
          status: 'Scaling compute',
        },
        {
          load: '46%',
          nodes: '14 / 14',
          phase: 'verifying',
          progress: '88%',
          services: ['91%', '76%', '83%'],
          status: 'Verifying rollout',
        },
        {
          load: '41%',
          nodes: '12 / 12',
          phase: 'complete',
          progress: '100%',
          services: ['92%', '68%', '84%'],
          status: 'Deployment completed',
        },
      ] as const;

      for (const [index, expectedFrame] of expectedFrames.entries()) {
        await expect
          .poll(() => productWindow.getAttribute('data-welcome-simulation-phase'))
          .toBe(expectedFrame.phase);
        expect(
          await productWindow.locator('[data-welcome-status]').textContent(),
        ).toContain(expectedFrame.status);
        const values = await readSimulationValues(desktopPage);
        expect(values.metrics.slice(0, 2)).toEqual([
          expectedFrame.nodes,
          expectedFrame.load,
        ]);
        expect(values.progress).toBe(expectedFrame.progress);
        expect(values.services).toEqual(expectedFrame.services);

        if (index < expectedFrames.length - 1) {
          await desktopPage.clock.runFor(2_400);
        }
      }

      const completedValues = await readSimulationValues(desktopPage);
      await desktopPage.clock.runFor(2_400);
      await expect
        .poll(() => productWindow.getAttribute('data-welcome-simulation-phase'))
        .toBe('monitoring');
      expect(await readSimulationValues(desktopPage)).toEqual(completedValues);
      const loopedBox = await productWindow.boundingBox();
      expect(loopedBox).not.toBeNull();
      expect(Math.abs((loopedBox?.x ?? 0) - (initialBox?.x ?? 0))).toBeLessThanOrEqual(
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
      const reducedValues = await readSimulationValues(reducedPage);
      await reducedPage.clock.runFor(12_000);
      expect(
        await reducedProductWindow.getAttribute('data-welcome-simulation-phase'),
      ).toBe('monitoring');
      expect(await readSimulationValues(reducedPage)).toEqual(reducedValues);
    } finally {
      await desktopPage.close();
      await reducedPage.close();
    }
  });

  it('keeps every localized Welcome simulation readable at 320px', async () => {
    const localeCases = [
      {
        foundations: 'Foundations',
        installation: 'Installation',
        locale: 'en',
        phases: ['Live', 'Deploy', 'Scale', 'Verify', 'Done'],
      },
      {
        foundations: '파운데이션',
        installation: '설치',
        locale: 'ko',
        phases: ['정상', '배포', '확장', '검증', '완료'],
      },
      {
        foundations: '基礎',
        installation: 'インストール',
        locale: 'ja',
        phases: ['正常', 'デプロイ', '拡張', '検証', '完了'],
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
        const compactPhaseLabel = phaseLabel.locator(
          '[data-welcome-phase-label-compact]',
        );
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

        for (const compactLabel of localeCase.phases) {
          await expect.poll(() => compactPhaseLabel.textContent()).toBe(compactLabel);
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
          await page.clock.runFor(2_400);
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
        await desktopPage.locator('.tr-docs-shell').getAttribute('data-docs-layout'),
      ).toBe('splash');
      await expectHidden(desktopPage.locator('.tr-docs-shell-sidebar'));

      const desktopHero = desktopPage.locator('[data-welcome-hero]');
      const productWindow = desktopHero.locator('[data-welcome-app]');
      const gradient = desktopHero.locator('[data-welcome-gradient]');
      const title = desktopPage.getByRole('heading', {
        level: 1,
        name: 'TINYRACK DESIGN SYSTEM',
      });
      const installation = desktopPage.getByRole('button', {
        name: 'Installation',
      });
      const foundations = desktopPage.getByRole('button', { name: 'Foundations' });
      const mainViewport = desktopPage.locator('.tr-docs-shell-scroll-viewport');

      await expectVisible(title);
      await expectVisible(desktopHero.getByText('React 19', { exact: true }));
      await expectVisible(desktopHero.getByText('Base UI', { exact: true }));
      await expectVisible(
        desktopHero.getByText(`${componentDocsManifest.length} components`, {
          exact: true,
        }),
      );
      expect(
        await desktopPage
          .getByText(
            'A React design system for precise operational interfaces—without rebuilding the fundamentals.',
            { exact: true },
          )
          .count(),
      ).toBe(0);
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
        'Tokens',
        'Themes',
        'Components',
        'Start with the essentials.',
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
      const mobileQuickStartBlocks = mobilePage.locator(
        '[data-welcome-content] .tr-code-block',
      );
      await expect(mobileQuickStartBlocks.count()).resolves.toBe(6);
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
