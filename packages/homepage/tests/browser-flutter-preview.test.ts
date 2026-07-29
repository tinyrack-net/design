import type { Browser } from 'playwright';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createBrowserAuditRuntime, gotoHydrated } from './browser-audit-runtime.ts';

const runtime = createBrowserAuditRuntime();
const channel = 'tinyrack.flutter-preview.v1';

describe('built Flutter Web component preview', () => {
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

  it('loads one engine and synchronizes controls, reset, theme, and focus', async () => {
    const page = await browser.newPage({ viewport: { height: 900, width: 1280 } });
    await page.addInitScript(() => {
      const messages: unknown[] = [];
      Object.defineProperty(window, '__flutterPreviewMessages', { value: messages });
      window.addEventListener('message', (event) => messages.push(event.data));
    });

    try {
      await gotoHydrated(page, `${origin}/en/flutter/components/button`);
      const preview = page.locator('[data-flutter-preview="button"]');
      await preview.scrollIntoViewIfNeeded();
      const frame = preview.locator('[data-flutter-preview-frame]');
      await expect(frame.getAttribute('src')).resolves.toContain(
        'component=button&locale=en',
      );
      await expect
        .poll(() => preview.getByText('Loading the Flutter preview').count(), {
          timeout: 60_000,
        })
        .toBe(0);
      await expect(
        page.locator('iframe[data-flutter-preview-frame]').count(),
      ).resolves.toBe(1);

      const intent = page
        .locator('[data-playground-control="intent"]')
        .getByRole('combobox');
      await intent.click();
      await page.getByRole('option', { exact: true, name: 'danger' }).click();
      await expect
        .poll(() =>
          page.evaluate(() => {
            const messages = (
              window as Window & { __flutterPreviewMessages?: unknown[] }
            ).__flutterPreviewMessages;
            return messages?.some(
              (message) =>
                typeof message === 'object' &&
                message !== null &&
                (message as { type?: string }).type === 'stateChanged' &&
                (message as { payload?: { args?: { intent?: string } } }).payload?.args
                  ?.intent === 'danger',
            );
          }),
        )
        .toBe(true);

      await page
        .locator('[data-component-playground]')
        .getByRole('button', { exact: true, name: 'Reset' })
        .click();
      await expect(intent.textContent()).resolves.toContain('primary');

      await page.evaluate(() => {
        document.documentElement.dataset['theme'] = 'tinyrack-dark';
      });
      await expect
        .poll(() =>
          page.evaluate(() => {
            const messages = (
              window as Window & { __flutterPreviewMessages?: unknown[] }
            ).__flutterPreviewMessages;
            return messages?.some(
              (message) =>
                typeof message === 'object' &&
                message !== null &&
                (message as { payload?: { theme?: string }; type?: string }).type ===
                  'stateChanged' &&
                (message as { payload?: { theme?: string } }).payload?.theme === 'dark',
            );
          }),
        )
        .toBe(true);

      await frame.focus();
      await expect(page.evaluate(() => document.activeElement?.tagName)).resolves.toBe(
        'IFRAME',
      );
      for (let index = 0; index < 12; index += 1) {
        if ((await page.evaluate(() => document.activeElement?.tagName)) !== 'IFRAME') {
          break;
        }
        await page.keyboard.press('Tab');
      }
      await expect
        .poll(() => page.evaluate(() => document.activeElement?.tagName))
        .not.toBe('IFRAME');

      await page.setViewportSize({ height: 800, width: 390 });
      await expect
        .poll(async () => {
          const box = await frame.boundingBox();
          return box !== null && box.x >= 0 && box.x + box.width <= 391;
        })
        .toBe(true);
    } finally {
      await page.close();
    }
  });

  it('rejects an invalid payload and exposes a retry fallback', async () => {
    const page = await browser.newPage({ viewport: { height: 800, width: 1000 } });
    try {
      await gotoHydrated(page, `${origin}/ko/flutter/components/button`);
      const preview = page.locator('[data-flutter-preview="button"]');
      await preview.scrollIntoViewIfNeeded();
      const frame = preview.locator('[data-flutter-preview-frame]');
      await expect
        .poll(() => preview.getByText('Flutter 미리보기를 불러오는 중이에요').count(), {
          timeout: 60_000,
        })
        .toBe(0);

      await frame.evaluate(
        (element, message) =>
          (element as HTMLIFrameElement).contentWindow?.postMessage(
            message,
            window.location.origin,
          ),
        {
          channel,
          component: 'button',
          payload: { intent: 'not-an-intent' },
          type: 'updateArgs',
        },
      );
      await preview.getByRole('alert').waitFor();
      await preview.locator('button[aria-label="초기화"]').click();
      await expect(preview.getByRole('alert').count()).resolves.toBe(0);
    } finally {
      await page.close();
    }
  });
});
