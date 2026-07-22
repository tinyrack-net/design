import type { Browser } from 'playwright';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import {
  createBrowserAuditRuntime,
  expectVisible,
  gotoHydrated,
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
  it('keeps interaction state inside the Preview while configuration controls still work', async () => {
    const page = await browser.newPage({ viewport: { height: 900, width: 1280 } });
    try {
      await gotoHydrated(page, `${origin}/en/components/toggle`);
      const preview = page.locator('[data-playground-preview]');
      const toggle = preview.getByRole('button', { name: 'Bold' });
      await expect(
        page.locator('[data-playground-control="pressed"]').count(),
      ).resolves.toBe(0);
      await toggle.click();
      await expect(toggle.getAttribute('aria-pressed')).resolves.toBe('true');
      await page
        .locator('[data-component-playground]')
        .getByRole('button', { name: 'Reset', exact: true })
        .click();
      await expect(toggle.getAttribute('aria-pressed')).resolves.toBe('false');

      await gotoHydrated(page, `${origin}/en/components/progress`);
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

      await gotoHydrated(page, `${origin}/en/components/button`);
      const select = page
        .locator('[data-playground-control="intent"]')
        .getByRole('combobox');
      await select.click();
      await page.getByRole('option', { name: 'danger', exact: true }).click();
      await expect(
        page.locator('[data-playground-preview] .tr-btn').getAttribute('data-intent'),
      ).resolves.toBe('danger');

      await page.goto(`${origin}/en/components/checkbox`);
      const checkboxPreview = page.locator('[data-playground-preview]');
      const mixedControl = page
        .locator('[data-playground-control="indeterminate"]')
        .getByRole('checkbox');
      const checkbox = checkboxPreview.getByRole('checkbox', {
        name: 'Enable backups',
      });
      await expect(
        page.locator('[data-playground-control="checked"]').count(),
      ).resolves.toBe(0);
      await mixedControl.check();
      await expect(checkbox.getAttribute('aria-checked')).resolves.toBe('mixed');
      await checkbox.click();
      await expect(mixedControl.isChecked()).resolves.toBe(false);
      await expect(checkbox.getAttribute('aria-checked')).resolves.toBe('false');
      const sizeControl = page
        .locator('[data-playground-control="uiSize"]')
        .getByRole('combobox');
      await sizeControl.click();
      await page.getByRole('option', { name: 'sm', exact: true }).click();
      await expect(checkbox.getAttribute('data-ui-size')).resolves.toBe('sm');

      await page
        .locator('[data-component-playground]')
        .getByRole('button', { name: 'Reset', exact: true })
        .click();
      await expect(checkbox.isChecked()).resolves.toBe(true);
      await expect(checkbox.getAttribute('data-ui-size')).resolves.toBe('md');

      await page.goto(`${origin}/en/components/radio`);
      const radioPreview = page.locator('[data-playground-preview]');
      const radio = radioPreview.getByRole('radio', { name: 'Primary rack' });
      await expect(
        page.locator('[data-playground-control="selected"]').count(),
      ).resolves.toBe(0);
      const radioSizeControl = page
        .locator('[data-playground-control="uiSize"]')
        .getByRole('combobox');
      await radioSizeControl.click();
      await page.getByRole('option', { name: 'lg', exact: true }).click();
      await expect(radio.getAttribute('data-ui-size')).resolves.toBe('lg');

      await gotoHydrated(page, `${origin}/en/components/radio-group`);
      await expect(
        page.locator('[data-playground-control="disabled"]').count(),
      ).resolves.toBe(1);
      await expect(
        page.locator('[data-playground-control="readOnly"]').count(),
      ).resolves.toBe(1);
      await expect(
        page.locator('[data-playground-control="required"]').count(),
      ).resolves.toBe(0);
      await expect(
        page.locator('[data-playground-control="value"]').count(),
      ).resolves.toBe(0);
    } finally {
      await page.close();
    }
  });

  it('keeps playground controls compact without shrinking the preview', async () => {
    const page = await browser.newPage({ viewport: { height: 900, width: 1280 } });
    try {
      for (const route of [
        'input',
        'select',
        'textarea',
        'checkbox',
        'radio',
        'slider',
      ]) {
        await gotoHydrated(page, `${origin}/en/components/${route}`);
        const controls = page.locator('[data-playground-controls]');
        await expect(
          controls.locator('[data-ui-size="sm"]').count(),
        ).resolves.toBeGreaterThan(0);
        await expect(
          controls
            .locator(
              '.tr-input[data-ui-size="md"], .tr-textarea[data-ui-size="md"], .tr-select-trigger[data-ui-size="md"], .tr-checkbox[data-ui-size="md"], .tr-radio[data-ui-size="md"], .tr-slider[data-ui-size="md"]',
            )
            .count(),
        ).resolves.toBe(0);
      }
    } finally {
      await page.close();
    }
  });

  it('filters and selects Autocomplete playground results', async () => {
    const page = await browser.newPage({ viewport: { height: 900, width: 1280 } });
    try {
      await gotoHydrated(page, `${origin}/en/components/autocomplete`);
      const input = page
        .locator('[data-playground-preview]')
        .locator('.tr-autocomplete-input');

      await input.fill('Beta');
      const visibleOptions = page.getByRole('option').filter({ visible: true });
      await expect(visibleOptions.allTextContents()).resolves.toEqual(['Rack Beta']);

      await visibleOptions.getByText('Rack Beta', { exact: true }).click();
      await expect(input.inputValue()).resolves.toBe('Rack Beta');
    } finally {
      await page.close();
    }
  });

  it('wires Avatar public visual controls to the preview', async () => {
    const page = await browser.newPage({ viewport: { height: 900, width: 1280 } });
    try {
      await gotoHydrated(page, `${origin}/en/components/avatar`);
      await expect(
        page.locator('[data-playground-control="fallback"]').count(),
      ).resolves.toBe(0);

      const imageStateControl = page
        .locator('[data-playground-control="imageState"]')
        .getByRole('combobox');
      await imageStateControl.click();
      await page.getByRole('option', { name: 'missing', exact: true }).click();
      await expect(
        page.locator('[data-playground-control="fallback"]').count(),
      ).resolves.toBe(1);

      const sizeControl = page
        .locator('[data-playground-control="uiSize"]')
        .getByRole('combobox');
      await sizeControl.click();
      await page.getByRole('option', { name: 'lg', exact: true }).click();
      const avatar = page.locator('[data-playground-preview] .tr-avatar');
      await expect(avatar.getAttribute('data-ui-size')).resolves.toBe('lg');
      await expect(avatar.getAttribute('size')).resolves.toBeNull();
    } finally {
      await page.close();
    }
  });

  it('wires component size controls to the public uiSize prop', async () => {
    const page = await browser.newPage({ viewport: { height: 900, width: 1280 } });
    try {
      for (const [route, selector] of [
        ['avatar', '.tr-avatar'],
        ['badge', '.tr-badge'],
        ['button', '.tr-btn'],
        ['copy-button', '.tr-btn'],
        ['icon-button', '.tr-icon-btn'],
        ['progress', '.tr-progress'],
        ['spinner', '.tr-spinner'],
      ] as const) {
        await gotoHydrated(page, `${origin}/en/components/${route}`);
        const sizeControl = page
          .locator('[data-playground-control="uiSize"]')
          .getByRole('combobox');
        await sizeControl.click();
        await page.getByRole('option', { name: 'lg', exact: true }).click();
        const component = page
          .locator('[data-playground-preview]')
          .locator(selector)
          .first();
        await expect(component.getAttribute('data-ui-size'), route).resolves.toBe('lg');
        if (route === 'avatar') {
          await expect(component.getAttribute('size')).resolves.toBeNull();
        }
      }
    } finally {
      await page.close();
    }
  });

  it('exposes missing public uiSize controls on form components', async () => {
    const page = await browser.newPage({ viewport: { height: 900, width: 1280 } });
    try {
      for (const [route, selector] of [
        ['input', '.tr-input'],
        ['textarea', '.tr-textarea'],
        ['slider', '.tr-slider'],
        ['select', '.tr-select-trigger'],
      ] as const) {
        await gotoHydrated(page, `${origin}/en/components/${route}`);
        const sizeControl = page
          .locator('[data-playground-control="uiSize"]')
          .getByRole('combobox');
        await sizeControl.click();
        await page.getByRole('option', { name: 'lg', exact: true }).click();
        await expect(
          page
            .locator('[data-playground-preview]')
            .locator(selector)
            .first()
            .getAttribute('data-ui-size'),
          route,
        ).resolves.toBe('lg');
      }
    } finally {
      await page.close();
    }
  });

  it('offers visual controls for newly enabled utility Playgrounds', async () => {
    const page = await browser.newPage({ viewport: { height: 900, width: 1280 } });
    try {
      for (const [route, selector] of [
        ['color-scheme-toggle', '.tr-color-scheme-toggle'],
        ['docs-search', '.tr-docs-search-trigger'],
        ['language-select', '.tr-language-select-trigger'],
      ] as const) {
        await gotoHydrated(page, `${origin}/en/components/${route}`);
        await expect(page.locator('[data-component-playground]').count()).resolves.toBe(
          1,
        );
        await expect(
          page.locator('[data-playground-control="value"]').count(),
        ).resolves.toBe(0);
        const sizeControl = page
          .locator('[data-playground-control="uiSize"]')
          .getByRole('combobox');
        await sizeControl.click();
        await page.getByRole('option', { name: 'lg', exact: true }).click();
        await expect(
          page
            .locator('[data-playground-preview]')
            .locator(selector)
            .first()
            .getAttribute('data-ui-size'),
          route,
        ).resolves.toBe('lg');
      }
    } finally {
      await page.close();
    }
  });

  it('omits empty Playgrounds while keeping component examples available', async () => {
    const page = await browser.newPage({ viewport: { height: 900, width: 1280 } });
    try {
      for (const route of ['file-tree', 'steps']) {
        await gotoHydrated(page, `${origin}/en/components/${route}`);
        await expect(page.locator('[data-component-playground]').count()).resolves.toBe(
          0,
        );
        await expectVisible(
          page.locator(`[data-component-example-id="${route}-basic"]`),
        );
      }
    } finally {
      await page.close();
    }
  });

  it('operates and resets stateful Previews without duplicate state controls', async () => {
    const page = await browser.newPage({ viewport: { height: 900, width: 1280 } });
    try {
      await gotoHydrated(page, `${origin}/en/components/drawer`);
      await expect(
        page.locator('[data-playground-control="open"]').count(),
      ).resolves.toBe(0);
      await expect(
        page.locator('[data-playground-control="activeSnapPoint"]').count(),
      ).resolves.toBe(0);
      await page
        .locator('[data-playground-preview]')
        .getByRole('button', { name: 'Open settings' })
        .click();
      const drawer = page.getByRole('dialog', { name: 'Rack settings' });
      await drawer.waitFor();
      await drawer.getByRole('button', { name: 'Close', exact: true }).click();
      const drawerLabel = page.locator('[data-playground-control="label"] input');
      await drawerLabel.fill('Open deployment settings');
      await page
        .locator('[data-component-playground]')
        .getByRole('button', { name: 'Reset', exact: true })
        .click();
      await expect(drawerLabel.inputValue()).resolves.toBe('Open settings');

      await gotoHydrated(page, `${origin}/en/components/form`);
      await expect(
        page.locator('[data-playground-control="value"]').count(),
      ).resolves.toBe(0);
      const rackInput = page
        .locator('[data-playground-preview]')
        .getByRole('textbox', { name: 'Rack name' });
      await rackInput.fill('rack-gamma');
      await page
        .locator('[data-component-playground]')
        .getByRole('button', { name: 'Reset', exact: true })
        .click();
      await expect(rackInput.inputValue()).resolves.toBe('rack-alpha');

      await gotoHydrated(page, `${origin}/en/components/number-field`);
      await expect(
        page.locator('[data-playground-control="value"]').count(),
      ).resolves.toBe(0);
      const replicas = page
        .locator('[data-playground-preview]')
        .getByRole('textbox', { name: 'Replicas' });
      await replicas.focus();
      await page.keyboard.press('ArrowUp');
      await expect(replicas.inputValue()).resolves.toBe('4');
      await page
        .locator('[data-component-playground]')
        .getByRole('button', { name: 'Reset', exact: true })
        .click();
      await expect(replicas.inputValue()).resolves.toBe('3');

      await gotoHydrated(page, `${origin}/en/components/otp-field`);
      await expect(
        page.locator('[data-playground-control="value"]').count(),
      ).resolves.toBe(0);
      const otpInputs = page.locator('[data-playground-preview] .tr-otp-field-digit');
      await otpInputs.first().focus();
      await page.keyboard.type('2468');
      await expect
        .poll(() =>
          otpInputs.evaluateAll((inputs) =>
            inputs.map((input) => (input as HTMLInputElement).value).join(''),
          ),
        )
        .toBe('2468');
      await page
        .locator('[data-component-playground]')
        .getByRole('button', { name: 'Reset', exact: true })
        .click();
      await expect
        .poll(() =>
          otpInputs.evaluateAll((inputs) =>
            inputs.map((input) => (input as HTMLInputElement).value).join(''),
          ),
        )
        .toBe('');

      await gotoHydrated(page, `${origin}/en/components/select`);
      await expect(
        page.locator('[data-playground-control="value"]').count(),
      ).resolves.toBe(0);
      await expect(
        page.locator('[data-playground-control="open"]').count(),
      ).resolves.toBe(0);
      const selectTrigger = page
        .locator('[data-playground-preview]')
        .getByRole('combobox', { name: 'Deployment rack' });
      await selectTrigger.click();
      await page.getByRole('option', { name: 'Staging rack' }).click();
      await expect.poll(() => selectTrigger.textContent()).toContain('Staging rack');
      await page
        .locator('[data-component-playground]')
        .getByRole('button', { name: 'Reset', exact: true })
        .click();
      await expect.poll(() => selectTrigger.textContent()).toContain('Rack Alpha');

      await gotoHydrated(page, `${origin}/en/components/slider`);
      await expect(
        page.locator('[data-playground-control="value"]').count(),
      ).resolves.toBe(0);
      const sliderThumb = page
        .locator('[data-playground-preview]')
        .getByRole('slider', { name: 'Volume' });
      await sliderThumb.focus();
      await page.keyboard.press('ArrowRight');
      await expect(sliderThumb.getAttribute('aria-valuenow')).resolves.toBe('49');
      await page
        .locator('[data-component-playground]')
        .getByRole('button', { name: 'Reset', exact: true })
        .click();
      await expect(sliderThumb.getAttribute('aria-valuenow')).resolves.toBe('48');

      await gotoHydrated(page, `${origin}/en/components/switch`);
      await expect(
        page.locator('[data-playground-control="checked"]').count(),
      ).resolves.toBe(0);
      const switchControl = page
        .locator('[data-playground-preview]')
        .getByRole('switch', { name: 'Automatic updates' });
      await switchControl.click();
      await expect(switchControl.isChecked()).resolves.toBe(false);
      await page
        .locator('[data-component-playground]')
        .getByRole('button', { name: 'Reset', exact: true })
        .click();
      await expect(switchControl.isChecked()).resolves.toBe(true);

      await gotoHydrated(page, `${origin}/en/components/toggle-group`);
      await expect(
        page.locator('[data-playground-control="value"]').count(),
      ).resolves.toBe(0);
      const group = page
        .locator('[data-playground-preview]')
        .getByRole('group', { name: 'Text alignment' });
      await group.getByRole('button', { name: 'End' }).click();
      await expect
        .poll(() =>
          group.getByRole('button', { name: 'End' }).getAttribute('aria-pressed'),
        )
        .toBe('true');
      await page
        .locator('[data-component-playground]')
        .getByRole('button', { name: 'Reset', exact: true })
        .click();
      await expect
        .poll(() =>
          group.getByRole('button', { name: 'Start' }).getAttribute('aria-pressed'),
        )
        .toBe('true');
    } finally {
      await page.close();
    }
  });
});
