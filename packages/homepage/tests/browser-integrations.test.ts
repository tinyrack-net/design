import type { Browser, Locator, Page } from 'playwright';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import {
  createBrowserAuditRuntime,
  expectBaseSurface,
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

async function expectReadableMdxSpacing(article: Locator, label: string) {
  const audit = await article.evaluate((element) => {
    const blocks = [...element.children]
      .map((child) => {
        const rect = child.getBoundingClientRect();
        return {
          bottom: rect.bottom,
          height: rect.height,
          tag: child.tagName.toLowerCase(),
          top: rect.top,
        };
      })
      .filter((block) => block.height > 0);
    const gaps = blocks
      .slice(1)
      .map((block, index) => block.top - (blocks[index]?.bottom ?? block.top));
    const headings = blocks.filter((block) => /^h[3-6]$/.test(block.tag));
    const headingIndexes = headings.map((heading) => blocks.indexOf(heading));

    return {
      gaps,
      headingIndexes,
      nextTags: headingIndexes.map((index) => blocks[index + 1]?.tag ?? null),
      scrollWidth: element.scrollWidth,
      clientWidth: element.clientWidth,
    };
  });

  expect(audit.scrollWidth, `${label} document overflow`).toBeLessThanOrEqual(
    audit.clientWidth,
  );
  expect(audit.headingIndexes, `${label} heading blocks`).toHaveLength(4);
  expect(audit.nextTags, `${label} heading content`).not.toContain('h3');
  expect(audit.nextTags, `${label} heading content`).not.toContain('h4');
  expect(audit.nextTags, `${label} heading content`).not.toContain('h5');
  expect(audit.nextTags, `${label} heading content`).not.toContain('h6');
  expect(Math.max(...audit.gaps), `${label} excessive block gap`).toBeLessThanOrEqual(
    128,
  );
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
          await gotoHydrated(
            page,
            `${origin}/${locale}/web/integrations/text-direction`,
          );

          const directionExample = page.locator(
            '[data-component-example-id="text-direction-demo"]',
          );
          const directionFrame = directionExample.locator(
            '[data-component-example-preview-frame]',
          );
          await expectBaseSurface(
            directionFrame,
            `${locale} direction ${scenario.theme}`,
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
            page.locator('.tr-app-shell-main-content'),
            `${locale} direction ${scenario.viewport.width}`,
          );

          await gotoHydrated(page, `${origin}/${locale}/web/integrations/mdx`);
          const mdxExample = page.locator(
            '[data-component-example-id="mdx-component-map-demo"]',
          );
          await expectBaseSurface(
            mdxExample.locator('[data-component-example-preview-frame]'),
            `${locale} MDX ${scenario.theme}`,
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
          await expectVisible(article.locator('.tr-code-block').first());
          await expectVisible(article.locator('.tr-table-container'));
          const blockquotes = article.locator('.tr-mdx-blockquote');
          await expect(blockquotes.count()).resolves.toBe(2);
          await expect(
            blockquotes.first().locator('.tr-mdx-blockquote').count(),
          ).resolves.toBe(1);
          await expect(
            blockquotes.first().locator('.tr-mdx-list').count(),
          ).resolves.toBe(1);
          await expect(
            blockquotes.first().locator('.tr-mdx-code-block').count(),
          ).resolves.toBe(1);
          await expect(
            blockquotes.first().locator('.tr-mdx-image').count(),
          ).resolves.toBe(1);
          await expect(
            article.locator('.tr-mdx-table .tr-mdx-strong').count(),
          ).resolves.toBe(1);
          await expect(
            article.locator('.tr-mdx-table .tr-mdx-em').count(),
          ).resolves.toBe(1);
          await expect(
            article.locator('.tr-mdx-table .tr-mdx-del').count(),
          ).resolves.toBe(1);
          await expect(article.locator('.tr-mdx-table .tr-code').count()).resolves.toBe(
            1,
          );
          await expect(
            article.locator('.tr-mdx-table .tr-mdx-link').count(),
          ).resolves.toBe(1);
          await expect(
            article.locator('.tr-mdx-footnotes .tr-mdx-strong').count(),
          ).resolves.toBe(1);
          await expect(
            article.locator('.tr-mdx-footnotes .tr-mdx-link').count(),
          ).resolves.toBe(2);
          await expect(
            article.locator('.tr-mdx-footnotes .tr-code').count(),
          ).resolves.toBe(1);
          const blockquoteGeometry = await blockquotes.first().evaluate((element) => {
            const first = element.firstElementChild?.getBoundingClientRect();
            const last = element.lastElementChild?.getBoundingClientRect();
            return {
              clientWidth: element.clientWidth,
              scrollWidth: element.scrollWidth,
              firstTop: first?.top ?? 0,
              lastBottom: last?.bottom ?? 0,
              firstMarginTop: element.firstElementChild
                ? getComputedStyle(element.firstElementChild).marginTop
                : '',
              lastMarginBottom: element.lastElementChild
                ? getComputedStyle(element.lastElementChild).marginBottom
                : '',
              top: element.getBoundingClientRect().top,
              bottom: element.getBoundingClientRect().bottom,
              children: [...element.children].map((child) => ({
                tag: child.tagName,
                marginTop: getComputedStyle(child).marginTop,
                marginBottom: getComputedStyle(child).marginBottom,
                top: child.getBoundingClientRect().top,
                bottom: child.getBoundingClientRect().bottom,
              })),
            };
          });
          expect(
            blockquoteGeometry.scrollWidth,
            `${locale} MDX blockquote overflow`,
          ).toBeLessThanOrEqual(blockquoteGeometry.clientWidth);
          expect(
            blockquoteGeometry.firstTop,
            `${locale} MDX blockquote first child spacing`,
          ).toBeGreaterThanOrEqual(blockquoteGeometry.top);
          expect(
            blockquoteGeometry.lastBottom,
            `${locale} MDX blockquote last child spacing`,
          ).toBeLessThanOrEqual(blockquoteGeometry.bottom);
          expect(blockquoteGeometry.firstMarginTop).toBe('0px');
          expect(blockquoteGeometry.lastMarginBottom).toBe('0px');
          await expectReadableMdxSpacing(
            article,
            `${locale} MDX ${scenario.viewport.width}`,
          );
          const imageSize = await article
            .locator('.tr-mdx-image')
            .evaluate((image) => ({
              complete: (image as HTMLImageElement).complete,
              height: image.getBoundingClientRect().height,
              width: image.getBoundingClientRect().width,
            }));
          expect(imageSize.complete, `${locale} MDX image loaded`).toBe(true);
          expect(imageSize.width, `${locale} MDX image width`).toBeGreaterThan(1);
          expect(imageSize.height, `${locale} MDX image height`).toBeGreaterThan(1);
          await expect
            .poll(() => article.locator('.tr-mdx-image').boundingBox())
            .not.toBeNull();
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
            page.locator('.tr-app-shell-main-content'),
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
