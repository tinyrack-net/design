import type { Browser } from 'playwright';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import {
  createBrowserAuditRuntime,
  expectInsideViewport,
  expectVisible,
  gotoHydrated,
  setTheme,
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
  it('keeps code examples, dialogs, selects, and mobile navigation interactive', async () => {
    const page = await browser.newPage({ viewport: { height: 844, width: 390 } });
    try {
      await page.context().grantPermissions(['clipboard-read', 'clipboard-write'], {
        origin,
      });
      await gotoHydrated(page, `${origin}/en/components/button`);
      const example = page.locator('[data-component-example-id="button-basic"]');
      const reactTab = example.getByRole('tab', { name: 'React' });
      await reactTab.click();
      await expect.poll(() => reactTab.getAttribute('aria-selected')).toBe('true');
      await expectVisible(example.locator('[data-component-example-source="react"]'));
      const copyButton = example.getByRole('button', {
        name: 'Copy React source for Basic action',
      });
      await copyButton.click();
      await expect.poll(() => copyButton.textContent()).toContain('Copied');

      await gotoHydrated(page, `${origin}/en/components/dialog`);
      await page
        .locator('[data-component-example-id="dialog-basic"]')
        .getByRole('button', { name: 'Open dialog' })
        .click();
      await expectVisible(page.getByRole('dialog'));
      await expectInsideViewport(page, page.getByRole('dialog'));
      await page.keyboard.press('Escape');
      await expect.poll(() => page.getByRole('dialog').isVisible()).toBe(false);

      await gotoHydrated(page, `${origin}/en/components/select`);
      await page
        .locator('[data-component-example-id="select-basic"]')
        .getByRole('combobox')
        .click();
      await expectInsideViewport(page, page.locator('.tr-select-popup[data-open]'));
      await page.getByRole('option', { name: 'Rack Beta' }).click();

      await gotoHydrated(page, `${origin}/en/components/toast`);
      await page
        .locator('[data-component-example-id="toast-basic"]')
        .getByRole('button', { name: 'Show toast' })
        .click();
      await page.locator('.tr-toast').waitFor();
      await expectInsideViewport(page, page.locator('.tr-toast'));

      await gotoHydrated(page, `${origin}/en/components/accordion`);
      await page.getByRole('button', { name: 'Open navigation' }).click();
      await expectVisible(page.getByRole('navigation', { name: 'Documentation' }));
    } finally {
      await page.close();
    }
  });

  it('opens TRContextMenu rack commands from pointer, keyboard, and touch fallback', async () => {
    const page = await browser.newPage({ viewport: { height: 900, width: 1280 } });
    await setTheme(page, 'tinyrack-light');
    try {
      await page.goto(`${origin}/en/components/context-menu`);
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
      await page.goto(`${origin}/en/components/menubar`);
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

      await page.goto(`${origin}/en/components/navigation-menu`);
      const responsiveNavigation = page.locator(
        '[data-component-example-id="navigation-menu-states"]',
      );
      const openNavigation = responsiveNavigation.getByRole('button', {
        name: 'Open site navigation',
      });
      await expectVisible(openNavigation);
      await openNavigation.click();
      const mobileNavigation = page.getByRole('navigation', {
        name: 'Mobile site navigation',
      });
      await mobileNavigation.waitFor();
      await expectInsideViewport(page, mobileNavigation);
      await expectVisible(mobileNavigation.getByRole('link', { name: 'Guides' }));
      await page.getByRole('button', { name: 'Close navigation' }).click();
      await expect.poll(() => mobileNavigation.isVisible()).toBe(false);

      await page.goto(`${origin}/en/components/tooltip`);
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

      await page.goto(`${origin}/en/components/alert-dialog`);
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

      await page.goto(`${origin}/en/components/drawer`);
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

      await page.goto(`${origin}/en/components/preview-card`);
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
      await expectVisible(previewCard.getByText('Degraded · 8 of 10 services healthy'));
      await expect(
        previewCard.locator('a, button, input, select, textarea').count(),
      ).resolves.toBe(0);
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
      await page.goto(`${origin}/en/components/accordion`);
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

      await page.goto(`${origin}/en/components/button#button-outline-intents`);
      const buttonMatrix = page.locator(
        '[data-component-example-id="button-outline-intents"]',
      );
      const neutralOutline = buttonMatrix.locator(
        '.tr-btn[data-appearance="outline"][data-intent="neutral"]',
      );
      const primaryOutline = buttonMatrix.locator(
        '.tr-btn[data-appearance="outline"][data-intent="primary"]',
      );
      await expect.poll(() => neutralOutline.count()).toBe(1);
      await expect(
        Promise.all(
          [neutralOutline, primaryOutline].map((button) =>
            button.evaluate((element) => getComputedStyle(element).height),
          ),
        ),
      ).resolves.toEqual(['40px', '40px']);
      await expect(
        Promise.all(
          [neutralOutline, primaryOutline].map((button) =>
            button.evaluate((element) => getComputedStyle(element).color),
          ),
        ),
      ).resolves.not.toEqual([
        await neutralOutline.evaluate((element) => getComputedStyle(element).color),
        await neutralOutline.evaluate((element) => getComputedStyle(element).color),
      ]);

      await page.goto(`${origin}/en/components/alert`);
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
      const alertVariants = page.locator(
        '[data-component-example-id="alert-variants"]',
      );
      const interactionTokens = {
        danger: [
          '--tinyrack-danger-surface-hover',
          '--tinyrack-danger-surface-pressed',
        ],
        info: ['--tinyrack-info-surface-hover', '--tinyrack-info-surface-pressed'],
        neutral: ['--tinyrack-surface-hover', '--tinyrack-surface-selected'],
        success: [
          '--tinyrack-success-surface-hover',
          '--tinyrack-success-surface-pressed',
        ],
        warning: [
          '--tinyrack-warning-surface-hover',
          '--tinyrack-warning-surface-pressed',
        ],
      } as const;
      const alertSurfaceTokens = {
        danger: '--tinyrack-danger-surface-subtle',
        info: '--tinyrack-info-surface-subtle',
        neutral: '--tinyrack-surface-muted',
        success: '--tinyrack-success-surface-subtle',
        warning: '--tinyrack-warning-surface-subtle',
      } as const;
      const resolveColor = (token: string) =>
        page.evaluate((variable) => {
          const probe = document.createElement('div');
          probe.style.backgroundColor = `var(${variable})`;
          document.body.append(probe);
          const color = getComputedStyle(probe).backgroundColor;
          probe.remove();
          return color;
        }, token);

      await expect.poll(() => alertVariants.locator('.tr-btn').count()).toBe(5);
      for (const [intent, [hoverToken, pressedToken]] of Object.entries(
        interactionTokens,
      )) {
        const button = alertVariants.locator(`.tr-btn[data-intent="${intent}"]`);
        const alert = button.locator('xpath=ancestor::*[@data-variant][1]');
        await expect(button.count()).resolves.toBe(1);
        await expect(
          button.evaluate((element) => getComputedStyle(element).height),
        ).resolves.toBe('40px');
        await expect(
          alert.evaluate((element) => getComputedStyle(element).backgroundColor),
        ).resolves.toBe(
          await resolveColor(
            alertSurfaceTokens[intent as keyof typeof alertSurfaceTokens],
          ),
        );
        await expect(
          button.evaluate((element) => getComputedStyle(element).backgroundColor),
        ).resolves.toBe('rgba(0, 0, 0, 0)');

        await button.hover();
        await expect
          .poll(() =>
            button.evaluate((element) => getComputedStyle(element).backgroundColor),
          )
          .toBe(await resolveColor(hoverToken));

        const box = await button.boundingBox();
        expect(box).not.toBeNull();
        await page.mouse.move(
          (box?.x ?? 0) + (box?.width ?? 0) / 2,
          (box?.y ?? 0) + (box?.height ?? 0) / 2,
        );
        await page.mouse.down();
        await expect
          .poll(() =>
            button.evaluate((element) => getComputedStyle(element).backgroundColor),
          )
          .toBe(await resolveColor(pressedToken));
        await page.mouse.up();
      }
      await page.mouse.move(0, 0);
      const neutralAction = alertVariants.locator('.tr-btn[data-intent="neutral"]');
      const infoAction = alertVariants.locator('.tr-btn[data-intent="info"]');
      await neutralAction.focus();
      await page.keyboard.press('Tab');
      await expect
        .poll(() =>
          infoAction.evaluate((element) => document.activeElement === element),
        )
        .toBe(true);
      await expect(
        infoAction.evaluate((element) => getComputedStyle(element).outlineWidth),
      ).resolves.toBe('2px');
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

      await page.goto(`${origin}/en/components/checkbox`);
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
        ['combobox', ['selected']],
        ['dialog', ['description', 'size']],
      ] as const) {
        await page.goto(`${origin}/en/components/${route}`);
        for (const control of removed) {
          await expect(
            page.locator(`[data-playground-control="${control}"]`).count(),
          ).resolves.toBe(0);
        }
      }

      await page.goto(`${origin}/en/components/menu`);
      const detachedErrors: string[] = [];
      page.on('pageerror', (error) => detachedErrors.push(error.message));
      const detachedExample = page.locator('[data-component-example-id="menu-handle"]');
      const detachedTrigger = detachedExample.getByRole('button', {
        name: 'Detached rack actions',
      });
      await detachedTrigger.click();
      const detachedPopup = page.locator('.tr-menu-content[data-open]');
      await detachedPopup.waitFor();
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
        url: `${origin}/en/components/menu`,
      });
      await detachedPopup.getByRole('menuitem', { name: 'Inspect rack' }).click();
      await expect(
        detachedExample.getByRole('status').textContent(),
      ).resolves.toContain('Rack Delta inspected');

      await page.setViewportSize({ height: 900, width: 1440 });
      await page.goto(`${origin}/en/components/app-shell`);
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

      await page.goto(`${origin}/en/components/number-field`);
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

      await page.goto(`${origin}/en/components/context-menu`);
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

      await page.goto(`${origin}/en/components/navigation-menu`);
      await expectVisible(page.getByRole('link', { name: 'Tinyrack Cloud' }).first());
      const product = page.getByRole('button', { name: /Product/ }).first();
      await product.press('Enter');
      await expectVisible(page.getByRole('link', { name: /Deployments/ }).last());

      await page.goto(`${origin}/en/components/toolbar`);
      const bold = page.getByRole('button', { name: 'Bold' }).first();
      const boldBox = await bold.boundingBox();
      expect(Math.round(boldBox?.width ?? 0)).toBe(32);
      expect(Math.round(boldBox?.height ?? 0)).toBe(32);

      await page.setViewportSize({ height: 844, width: 390 });
      await page.goto(`${origin}/en/components/drawer`);
      const drawerTrigger = page
        .locator('[data-component-playground]')
        .getByRole('button', { name: 'Open settings' });
      await drawerTrigger.click();
      const drawer = page.getByRole('dialog', { name: 'Rack settings' });
      await drawer.waitFor();
      await expectVisible(page.getByRole('button', { name: 'Close' }).last());
      await expectInsideViewport(page, drawer);
    } finally {
      await page.close();
    }
  });
});
