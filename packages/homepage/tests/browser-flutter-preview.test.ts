import type { Browser } from 'playwright';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createBrowserAuditRuntime, gotoHydrated } from './browser-audit-runtime.ts';

const runtime = createBrowserAuditRuntime();
const channel = 'tinyrack.flutter-preview.v1';
const flutterPreviewComponents = [
  'accordion',
  'alert',
  'alert-dialog',
  'animated-number',
  'app-shell',
  'autocomplete',
  'avatar',
  'badge',
  'breadcrumbs',
  'button',
  'card',
  'checkbox',
  'code',
  'code-block',
  'field',
  'fieldset',
  'icon-button',
  'meter',
  'progress',
  'separator',
  'skeleton',
  'spinner',
  'steps',
  'text',
  'text-field',
] as const;

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

  it.each(
    flutterPreviewComponents,
  )('loads the %s playground without a preview contract error', async (component) => {
    const page = await browser.newPage({
      viewport: { height: 900, width: 1280 },
    });
    await page.addInitScript(() => {
      const messages: unknown[] = [];
      Object.defineProperty(window, '__flutterPreviewMessages', {
        value: messages,
      });
      window.addEventListener('message', (event) => messages.push(event.data));
    });

    try {
      await gotoHydrated(page, `${origin}/en/flutter/components/${component}`);
      const preview = page.locator(`[data-flutter-preview="${component}"]`);
      await preview.scrollIntoViewIfNeeded();
      const frame = preview.locator('[data-flutter-preview-frame]');
      await frame.waitFor();
      await expect
        .poll(() => preview.locator('[aria-live="polite"]').count(), {
          timeout: 60_000,
        })
        .toBe(0);
      await expect(preview.getByRole('alert').count()).resolves.toBe(0);

      if (component === 'icon-button') {
        const intent = page
          .locator('[data-playground-control="intent"]')
          .getByRole('combobox');
        await intent.click();
        await page.getByRole('option', { exact: true, name: 'danger' }).click();
        await expect
          .poll(
            () =>
              page.evaluate(() => {
                const messages = (
                  window as Window & { __flutterPreviewMessages?: unknown[] }
                ).__flutterPreviewMessages;
                return (messages ?? []).some(
                  (message) =>
                    typeof message === 'object' &&
                    message !== null &&
                    (message as { type?: string }).type === 'stateChanged' &&
                    (
                      message as {
                        payload?: { args?: { intent?: string } };
                      }
                    ).payload?.args?.intent === 'danger',
                );
              }),
            { timeout: 60_000 },
          )
          .toBe(true);

        const uiSize = page
          .locator('[data-playground-control="uiSize"]')
          .getByRole('combobox');
        await uiSize.click();
        await page.getByRole('option', { exact: true, name: 'lg' }).click();

        await expect
          .poll(
            () =>
              page.evaluate(() => {
                const messages = (
                  window as Window & { __flutterPreviewMessages?: unknown[] }
                ).__flutterPreviewMessages;
                return (messages ?? []).some(
                  (message) =>
                    typeof message === 'object' &&
                    message !== null &&
                    (message as { type?: string }).type === 'stateChanged' &&
                    (
                      message as {
                        payload?: { args?: { uiSize?: string } };
                      }
                    ).payload?.args?.uiSize === 'lg',
                );
              }),
            { timeout: 60_000 },
          )
          .toBe(true);
      }
    } finally {
      await page.close();
    }
  });

  it('updates Accordion content, multiple selection, and disabled items', async () => {
    const page = await browser.newPage({ viewport: { height: 900, width: 1280 } });
    await page.addInitScript(() => {
      const messages: unknown[] = [];
      Object.defineProperty(window, '__flutterPreviewMessages', { value: messages });
      window.addEventListener('message', (event) => messages.push(event.data));
    });

    try {
      await gotoHydrated(page, `${origin}/en/flutter/components/accordion`);
      const preview = page.locator('[data-flutter-preview="accordion"]');
      await preview.scrollIntoViewIfNeeded();
      const frame = preview.locator('[data-flutter-preview-frame]');
      await frame.waitFor();
      await expect
        .poll(() => preview.getByText('Loading the Flutter preview').count(), {
          timeout: 60_000,
        })
        .toBe(0);

      async function clickFlutterPart(part: string) {
        const readBounds = () =>
          page.evaluate((partName) => {
            const messages = (
              window as Window & { __flutterPreviewMessages?: unknown[] }
            ).__flutterPreviewMessages;
            for (const message of [...(messages ?? [])].reverse()) {
              if (
                typeof message === 'object' &&
                message !== null &&
                (message as { component?: string }).component === 'accordion' &&
                (message as { type?: string }).type === 'metrics'
              ) {
                const bounds = (
                  message as {
                    payload?: {
                      parts?: Record<
                        string,
                        {
                          bounds?: {
                            height: number;
                            width: number;
                            x: number;
                            y: number;
                          };
                        }
                      >;
                    };
                  }
                ).payload?.parts?.[partName]?.bounds;
                if (bounds !== undefined) return bounds;
              }
            }
            return null;
          }, part);
        await expect.poll(readBounds, { timeout: 60_000 }).not.toBeNull();
        const bounds = await readBounds();
        const frameBounds = await frame.boundingBox();
        if (bounds === null || frameBounds === null) {
          throw new Error(`Could not locate Flutter Accordion part: ${part}`);
        }
        await page.mouse.click(
          frameBounds.x + bounds.x + bounds.width / 2,
          frameBounds.y + bounds.y + bounds.height / 2,
        );
      }

      const hasInteractiveValue = (expected: string) =>
        page.evaluate((value) => {
          const messages = (window as Window & { __flutterPreviewMessages?: unknown[] })
            .__flutterPreviewMessages;
          return (messages ?? []).some(
            (message) =>
              typeof message === 'object' &&
              message !== null &&
              (message as { component?: string }).component === 'accordion' &&
              (message as { type?: string }).type === 'stateChanged' &&
              (message as { payload?: { value?: string } }).payload?.value === value,
          );
        }, expected);

      await clickFlutterPart('configureTrigger');
      await expect.poll(() => hasInteractiveValue('configure')).toBe(true);

      await frame.evaluate((element) => element.setAttribute('data-before-reset', ''));
      await page
        .locator('[data-component-playground]')
        .getByRole('button', { exact: true, name: 'Reset' })
        .click();
      await expect.poll(() => frame.getAttribute('data-before-reset')).toBeNull();
      await expect
        .poll(() => preview.getByText('Loading the Flutter preview').count(), {
          timeout: 60_000,
        })
        .toBe(0);
      await clickFlutterPart('trigger');
      await expect.poll(() => hasInteractiveValue('')).toBe(true);
      await clickFlutterPart('trigger');
      await expect.poll(() => hasInteractiveValue('install')).toBe(true);

      const multiple = page
        .locator('[data-playground-control="multiple"]')
        .getByRole('checkbox');
      await multiple.check();
      await clickFlutterPart('configureTrigger');
      await expect.poll(() => hasInteractiveValue('install,configure')).toBe(true);

      const disabledItem = page
        .locator('[data-playground-control="disabledItem"]')
        .getByRole('checkbox');
      await disabledItem.check();
      await expect
        .poll(() =>
          page.evaluate(() => {
            const messages = (
              window as Window & { __flutterPreviewMessages?: unknown[] }
            ).__flutterPreviewMessages;
            const latestMetrics = [...(messages ?? [])]
              .reverse()
              .find(
                (message) =>
                  typeof message === 'object' &&
                  message !== null &&
                  (message as { component?: string }).component === 'accordion' &&
                  (message as { type?: string }).type === 'metrics',
              ) as { payload?: { parts?: Record<string, unknown> } } | undefined;
            return latestMetrics?.payload?.parts?.['configureContent'] === undefined;
          }),
        )
        .toBe(true);

      const disabledActivationCount = await page.evaluate(() => {
        const messages = (window as Window & { __flutterPreviewMessages?: unknown[] })
          .__flutterPreviewMessages;
        return (messages ?? []).filter(
          (message) =>
            typeof message === 'object' &&
            message !== null &&
            (message as { component?: string }).component === 'accordion' &&
            (message as { type?: string }).type === 'stateChanged' &&
            typeof (message as { payload?: { value?: unknown } }).payload?.value ===
              'string',
        ).length;
      });
      await clickFlutterPart('configureTrigger');
      await page.waitForTimeout(300);
      await expect(
        page.evaluate(() => {
          const messages = (window as Window & { __flutterPreviewMessages?: unknown[] })
            .__flutterPreviewMessages;
          return (messages ?? []).filter(
            (message) =>
              typeof message === 'object' &&
              message !== null &&
              (message as { component?: string }).component === 'accordion' &&
              (message as { type?: string }).type === 'stateChanged' &&
              typeof (message as { payload?: { value?: unknown } }).payload?.value ===
                'string',
          ).length;
        }),
      ).resolves.toBe(disabledActivationCount);
    } finally {
      await page.close();
    }
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
        .poll(
          () =>
            page.evaluate(() => {
              const messages = (
                window as Window & { __flutterPreviewMessages?: unknown[] }
              ).__flutterPreviewMessages;
              return messages?.some(
                (message) =>
                  typeof message === 'object' &&
                  message !== null &&
                  (message as { type?: string }).type === 'stateChanged' &&
                  (message as { payload?: { args?: { intent?: string } } }).payload
                    ?.args?.intent === 'danger',
              );
            }),
          { timeout: 60_000 },
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
        .poll(
          () =>
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
                  (message as { payload?: { theme?: string } }).payload?.theme ===
                    'dark',
              );
            }),
          { timeout: 60_000 },
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

  it('drives every AnimatedNumber playground axis through the Flutter preview', async () => {
    const page = await browser.newPage({ viewport: { height: 900, width: 1280 } });
    await page.addInitScript(() => {
      const messages: unknown[] = [];
      Object.defineProperty(window, '__flutterPreviewMessages', { value: messages });
      window.addEventListener('message', (event) => messages.push(event.data));
    });

    try {
      await gotoHydrated(page, `${origin}/en/flutter/components/animated-number`);
      const preview = page.locator('[data-flutter-preview="animated-number"]');
      await preview.scrollIntoViewIfNeeded();
      await expect
        .poll(() => preview.locator('[aria-live="polite"]').count(), {
          timeout: 60_000,
        })
        .toBe(0);
      for (const name of [
        'animation',
        'duration',
        'formatPreset',
        'locale',
        'rollDirection',
        'value',
      ]) {
        await expect(
          page.locator(`[data-playground-control="${name}"]`).count(),
        ).resolves.toBe(1);
      }

      const animation = page
        .locator('[data-playground-control="animation"]')
        .getByRole('combobox');
      await animation.click();
      await page.getByRole('option', { exact: true, name: 'count' }).click();
      const value = page
        .locator('[data-playground-control="value"]')
        .getByRole('slider');
      await value.focus();
      await value.press('End');

      await expect
        .poll(
          () =>
            page.evaluate(() => {
              const messages = (
                window as Window & { __flutterPreviewMessages?: unknown[] }
              ).__flutterPreviewMessages;
              return (messages ?? []).some(
                (message) =>
                  typeof message === 'object' &&
                  message !== null &&
                  (message as { type?: string }).type === 'stateChanged' &&
                  (
                    message as {
                      payload?: { args?: { animation?: string; value?: number } };
                    }
                  ).payload?.args?.animation === 'count' &&
                  (message as { payload?: { args?: { value?: number } } }).payload?.args
                    ?.value === 10_000,
              );
            }),
          { timeout: 60_000 },
        )
        .toBe(true);
      await expect(preview.getByRole('alert').count()).resolves.toBe(0);
    } finally {
      await page.close();
    }
  });

  it('synchronizes AlertDialog label, disabled, and open controls', async () => {
    const page = await browser.newPage({ viewport: { height: 900, width: 1280 } });
    await page.addInitScript(() => {
      const messages: unknown[] = [];
      Object.defineProperty(window, '__flutterPreviewMessages', { value: messages });
      window.addEventListener('message', (event) => messages.push(event.data));
    });

    try {
      await gotoHydrated(page, `${origin}/en/flutter/components/alert-dialog`);
      const preview = page.locator('[data-flutter-preview="alert-dialog"]');
      await preview.scrollIntoViewIfNeeded();
      await expect
        .poll(() => preview.locator('[aria-live="polite"]').count(), {
          timeout: 60_000,
        })
        .toBe(0);

      await page.locator('[data-playground-control="label"] input').fill('Remove rack');
      await page
        .locator('[data-playground-control="disabled"]')
        .getByRole('checkbox')
        .click();
      await page
        .locator('[data-playground-control="open"]')
        .getByRole('checkbox')
        .click();

      await expect
        .poll(() =>
          page.evaluate(() => {
            const messages = (
              window as Window & { __flutterPreviewMessages?: unknown[] }
            ).__flutterPreviewMessages;
            return (messages ?? []).some(
              (message) =>
                typeof message === 'object' &&
                message !== null &&
                (message as { type?: string }).type === 'stateChanged' &&
                (
                  message as {
                    payload?: {
                      args?: { disabled?: boolean; label?: string; open?: boolean };
                    };
                  }
                ).payload?.args?.label === 'Remove rack' &&
                (
                  message as {
                    payload?: { args?: { disabled?: boolean; open?: boolean } };
                  }
                ).payload?.args?.disabled === true &&
                (message as { payload?: { args?: { open?: boolean } } }).payload?.args
                  ?.open === true,
            );
          }),
        )
        .toBe(true);
    } finally {
      await page.close();
    }
  });

  it('keeps a control value stable with a cached preview that omits request IDs', async () => {
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
      await expect
        .poll(() => preview.getByText('Loading the Flutter preview').count(), {
          timeout: 60_000,
        })
        .toBe(0);

      const flutterFrame = page
        .frames()
        .find((candidate) => candidate.url().includes('/flutter-preview/index.html'));
      expect(flutterFrame).toBeDefined();
      await flutterFrame?.evaluate(() => {
        let legacyArgs: Record<string, unknown> = {};
        window.addEventListener('message', (event) => {
          const message = event.data;
          if (
            event.origin !== window.location.origin ||
            typeof message !== 'object' ||
            message === null ||
            message.channel !== 'tinyrack.flutter-preview.v1' ||
            message.component !== 'button' ||
            message.type !== 'updateArgs' ||
            typeof message.payload !== 'object' ||
            message.payload === null
          ) {
            return;
          }
          legacyArgs = { ...legacyArgs, ...message.payload };
          window.parent.postMessage(
            {
              channel: 'tinyrack.flutter-preview.v1',
              component: 'button',
              payload: { args: legacyArgs, theme: 'light' },
              type: 'stateChanged',
            },
            window.location.origin,
          );
        });
      });

      await page.evaluate(() => {
        const messages = (window as Window & { __flutterPreviewMessages?: unknown[] })
          .__flutterPreviewMessages;
        if (messages !== undefined) messages.length = 0;
      });

      const intent = page
        .locator('[data-playground-control="intent"]')
        .getByRole('combobox');
      await intent.click();
      await page.getByRole('option', { exact: true, name: 'danger' }).click();
      await page.waitForTimeout(750);

      await expect(intent.textContent()).resolves.toContain('danger');
      const stateChanges = await page.evaluate(
        () =>
          (
            (window as Window & { __flutterPreviewMessages?: unknown[] })
              .__flutterPreviewMessages ?? []
          ).filter(
            (message) =>
              typeof message === 'object' &&
              message !== null &&
              (message as { type?: string }).type === 'stateChanged',
          ).length,
      );
      expect(stateChanges).toBeLessThan(10);
    } finally {
      await page.close();
    }
  });

  it('accepts a text field value interaction without accepting full state echoes', async () => {
    const page = await browser.newPage({ viewport: { height: 900, width: 1280 } });
    try {
      await gotoHydrated(page, `${origin}/en/flutter/components/text-field`);
      const preview = page.locator('[data-flutter-preview="text-field"]');
      await preview.scrollIntoViewIfNeeded();
      await expect
        .poll(() => preview.getByText('Loading the Flutter preview').count(), {
          timeout: 60_000,
        })
        .toBe(0);

      const flutterFrame = page
        .frames()
        .find((candidate) => candidate.url().includes('/flutter-preview/index.html'));
      expect(flutterFrame).toBeDefined();
      await flutterFrame?.evaluate(() => {
        window.parent.postMessage(
          {
            channel: 'tinyrack.flutter-preview.v1',
            component: 'text-field',
            payload: { args: { value: 'Rack beta' } },
            type: 'stateChanged',
          },
          window.location.origin,
        );
      });

      const valueControl = page.locator('[data-playground-control="value"] input');
      await expect.poll(() => valueControl.inputValue()).toBe('Rack beta');

      const frame = preview.locator('[data-flutter-preview-frame]');
      const frameBounds = await frame.boundingBox();
      expect(frameBounds).not.toBeNull();
      if (frameBounds === null) return;
      await page.mouse.click(
        frameBounds.x + frameBounds.width / 2,
        frameBounds.y + frameBounds.height / 2,
      );
      // Keystrokes into the Flutter canvas can drop under load; a mid-string
      // drop can't be fixed by appending, so reselect and retype the whole
      // value each poll until it converges.
      await expect
        .poll(
          async () => {
            if ((await valueControl.inputValue()) === 'Rack beta xyz') {
              return 'Rack beta xyz';
            }
            await page.keyboard.press('Control+a');
            await page.keyboard.type('Rack beta xyz', { delay: 60 });
            return valueControl.inputValue();
          },
          { interval: 250, timeout: 20_000 },
        )
        .toBe('Rack beta xyz');
    } finally {
      await page.close();
    }
  });

  it('keeps CheckboxGroup playground selections in sync and resets them', async () => {
    const page = await browser.newPage({ viewport: { height: 900, width: 1280 } });
    await page.addInitScript(() => {
      const messages: unknown[] = [];
      Object.defineProperty(window, '__flutterPreviewMessages', { value: messages });
      window.addEventListener('message', (event) => messages.push(event.data));
    });

    try {
      await gotoHydrated(page, `${origin}/en/flutter/components/checkbox-group`);
      const preview = page.locator('[data-flutter-preview="checkbox-group"]');
      await preview.scrollIntoViewIfNeeded();
      await expect
        .poll(() => preview.getByText('Loading the Flutter preview').count(), {
          timeout: 60_000,
        })
        .toBe(0);

      const flutterFrame = page
        .frames()
        .find((candidate) => candidate.url().includes('/flutter-preview/index.html'));
      expect(flutterFrame).toBeDefined();
      await flutterFrame?.evaluate(() => {
        window.parent.postMessage(
          {
            channel: 'tinyrack.flutter-preview.v1',
            component: 'checkbox-group',
            payload: { args: { selectedValues: ['backups'] } },
            type: 'stateChanged',
          },
          window.location.origin,
        );
      });
      await expect
        .poll(() =>
          page.evaluate(() => {
            const messages = (
              window as Window & { __flutterPreviewMessages?: unknown[] }
            ).__flutterPreviewMessages;
            return (messages ?? []).some((message) => {
              const selectedValues = (
                message as {
                  payload?: { args?: { selectedValues?: unknown } };
                  type?: string;
                }
              ).payload?.args?.selectedValues;
              return (
                (message as { type?: string }).type === 'stateChanged' &&
                Array.isArray(selectedValues) &&
                selectedValues.length === 1 &&
                selectedValues[0] === 'backups' &&
                (
                  message as {
                    payload?: { args?: { label?: unknown } };
                  }
                ).payload?.args?.label === 'Rack features'
              );
            });
          }),
        )
        .toBe(true);

      await page
        .locator('[data-component-playground]')
        .getByRole('button', { exact: true, name: 'Reset' })
        .click();
      await expect
        .poll(() =>
          page.evaluate(() => {
            const messages = (
              window as Window & { __flutterPreviewMessages?: unknown[] }
            ).__flutterPreviewMessages;
            const selectedValues = [...(messages ?? [])]
              .reverse()
              .map(
                (message) =>
                  (
                    message as {
                      payload?: { args?: { selectedValues?: unknown } };
                      type?: string;
                    }
                  ).payload?.args?.selectedValues,
              )
              .find(Array.isArray);
            return JSON.stringify(selectedValues);
          }),
        )
        .toBe(JSON.stringify(['metrics', 'backups']));
    } finally {
      await page.close();
    }
  });

  it.each([
    'en',
    'ko',
    'ja',
  ] as const)('keeps the %s Checkbox playground interactive and synchronized', async (locale) => {
    const page = await browser.newPage({ viewport: { height: 900, width: 1280 } });
    try {
      await gotoHydrated(page, `${origin}/${locale}/flutter/components/checkbox`);
      const preview = page.locator('[data-flutter-preview="checkbox"]');
      await preview.scrollIntoViewIfNeeded();
      await expect
        .poll(() => preview.locator('[aria-live="polite"]').count(), {
          timeout: 60_000,
        })
        .toBe(0);
      await expect(preview.getByRole('alert').count()).resolves.toBe(0);

      const checkedControl = page
        .locator('[data-playground-control="checked"]')
        .getByRole('checkbox');
      const mixedControl = page
        .locator('[data-playground-control="indeterminate"]')
        .getByRole('checkbox');
      await expect(checkedControl.isChecked()).resolves.toBe(true);
      await mixedControl.check();

      const frame = preview.locator('[data-flutter-preview-frame]');
      const bounds = await frame.boundingBox();
      expect(bounds).not.toBeNull();
      if (bounds === null) return;
      await page.mouse.click(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2);

      await expect.poll(() => checkedControl.isChecked()).toBe(false);
      await expect.poll(() => mixedControl.isChecked()).toBe(false);

      await page
        .locator('[data-component-playground]')
        .getByRole('button', {
          exact: true,
          name: { en: 'Reset', ja: 'リセット', ko: '초기화' }[locale],
        })
        .click();
      await expect.poll(() => checkedControl.isChecked()).toBe(true);
    } finally {
      await page.close();
    }
  });

  it.each([
    ['accordion', 'accordion-controlled'],
    ['accordion', 'accordion-expansion-states'],
    ['button', 'button-intents'],
    ['alert', 'alert-actions'],
    ['card', 'card-recipe'],
    ['tabs', 'tabs-recipe'],
    ['checkbox', 'checkbox-states'],
    ['checkbox', 'checkbox-sizes'],
    ['checkbox', 'checkbox-availability'],
    ['checkbox', 'checkbox-validation'],
    ['checkbox', 'checkbox-form-values'],
    ['checkbox-group', 'checkbox-group-options'],
    ['code-block', 'code-block-highlighted'],
    ['animated-number', 'animated-number-basic'],
    ['animated-number', 'animated-number-modes'],
    ['animated-number', 'animated-number-formats'],
    ['animated-number', 'animated-number-direction'],
    ['alert-dialog', 'alert-dialog-result'],
    ['app-shell', 'app-shell-navigation'],
    ['app-shell', 'app-shell-controls'],
    ['app-shell', 'app-shell-docs'],
  ] as const)('renders the %s docs example %s without a preview error', async (component, example) => {
    const page = await browser.newPage({ viewport: { height: 900, width: 1280 } });
    try {
      await gotoHydrated(page, `${origin}/en/flutter/components/${component}`);
      const example_ = page.locator(`#${example}`);
      await example_.scrollIntoViewIfNeeded();
      const preview = example_.locator(`[data-flutter-example="${component}"]`);
      await preview.locator('[data-flutter-example-frame]').waitFor();
      await expect
        .poll(() => preview.locator('[aria-live="polite"]').count(), {
          timeout: 60_000,
        })
        .toBe(0);
      await expect(preview.getByRole('alert').count()).resolves.toBe(0);
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
