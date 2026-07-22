import type { Browser, Locator, Page } from 'playwright';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import {
  createBrowserAuditRuntime,
  expectNoLocalOverflow,
  expectVisible,
  gotoHydrated,
  setTheme,
} from './browser-audit-runtime.ts';

const runtime = createBrowserAuditRuntime();

async function sliderValue(page: Page) {
  return Number(
    await page
      .locator('[data-component-example-id="text-direction-demo"]')
      .getByRole('slider')
      .getAttribute('aria-valuenow'),
  );
}

async function expectLocallyScrollable(locator: Locator, label: string) {
  const sizes = await locator.evaluate((element) => ({
    clientWidth: element.clientWidth,
    scrollWidth: element.scrollWidth,
  }));
  expect(sizes.scrollWidth, label).toBeGreaterThan(sizes.clientWidth);
  await locator.evaluate((element) => {
    element.scrollLeft = Math.min(80, element.scrollWidth - element.clientWidth);
  });
  await expect
    .poll(() => locator.evaluate((element) => element.scrollLeft))
    .toBeGreaterThan(0);
}

describe('built integration guides', () => {
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

  it('keeps direction and MDX examples interactive across locales and layouts', async () => {
    const consoleErrors: string[] = [];

    for (const locale of ['en', 'ko', 'ja'] as const) {
      for (const scenario of [
        {
          theme: 'tinyrack-light',
          viewport: { height: 1000, width: 1440 },
        },
        {
          theme: 'tinyrack-dark',
          viewport: { height: 844, width: 390 },
        },
      ] as const) {
        const page = await browser.newPage({ viewport: scenario.viewport });
        page.on('console', (message) => {
          if (message.type() === 'error') {
            consoleErrors.push(
              `${locale}/${scenario.viewport.width}: ${message.text()}`,
            );
          }
        });

        try {
          await setTheme(page, scenario.theme);
          await gotoHydrated(page, `${origin}/${locale}/integrations/text-direction`);

          const directionExample = page.locator(
            '[data-component-example-id="text-direction-demo"]',
          );
          const directionFrame = directionExample.locator(
            '[data-component-example-preview-frame]',
          );
          const directionScope = directionFrame.locator('[data-direction-scope]');
          const slider = directionFrame.getByRole('slider');

          await expect(directionScope.getAttribute('dir')).resolves.toBe('ltr');
          await expect(
            directionFrame.locator('[data-direction-value]').textContent(),
          ).resolves.toContain('ltr');
          await slider.focus();
          const ltrStart = await sliderValue(page);
          await page.keyboard.press('ArrowRight');
          await expect.poll(() => sliderValue(page)).toBe(ltrStart + 1);

          await directionFrame.getByRole('button').nth(1).click();
          await expect(directionScope.getAttribute('dir')).resolves.toBe('rtl');
          await expect(
            directionScope.evaluate((element) => getComputedStyle(element).direction),
          ).resolves.toBe('rtl');
          await expect(
            directionFrame.locator('[data-direction-value]').textContent(),
          ).resolves.toContain('rtl');
          await slider.focus();
          const rtlStart = await sliderValue(page);
          await page.keyboard.press('ArrowRight');
          await expect.poll(() => sliderValue(page)).toBe(rtlStart - 1);
          await expectNoLocalOverflow(
            page.locator('.tr-docs-shell-content'),
            `${locale} direction ${scenario.viewport.width}`,
          );

          await gotoHydrated(page, `${origin}/${locale}/integrations/mdx`);
          const mdxExample = page.locator(
            '[data-component-example-id="mdx-component-map-demo"]',
          );
          const article = mdxExample.locator('article[data-mdx-component-map-preview]');
          await expectVisible(article);
          await expect(article.locator('main').count()).resolves.toBe(0);
          await expect(page.locator('main main').count()).resolves.toBe(0);
          await expect(article.locator('.tr-mdx-task-checkbox').count()).resolves.toBe(
            2,
          );
          await expect(
            article
              .locator('.tr-mdx-task-checkbox')
              .evaluateAll((inputs) =>
                inputs.every((input) => (input as HTMLInputElement).disabled),
              ),
          ).resolves.toBe(true);
          await expectVisible(article.locator('.tr-code-block'));
          await expectVisible(article.locator('.tr-table-container'));
          await expect(
            article
              .locator('.tr-table-container')
              .evaluate((element) => getComputedStyle(element).overflowX),
          ).resolves.toBe('auto');
          if (scenario.viewport.width === 390) {
            await expectLocallyScrollable(
              article.locator('.tr-table-container'),
              `${locale} MDX table`,
            );
          }

          await mdxExample.getByRole('tab', { exact: true, name: 'MDX' }).click();
          const mdxSource = mdxExample.locator('[data-component-example-source="mdx"]');
          await expectVisible(mdxSource);
          if (scenario.viewport.width === 390) {
            await expectLocallyScrollable(
              mdxSource.locator('.tr-code-block'),
              `${locale} MDX source`,
            );
          }
          await expectNoLocalOverflow(
            page.locator('.tr-docs-shell-content'),
            `${locale} MDX ${scenario.viewport.width}`,
          );
        } finally {
          await page.close();
        }
      }
    }

    expect(consoleErrors).toEqual([]);
  });
});
