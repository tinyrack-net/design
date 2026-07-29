import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import type { Browser, BrowserContext, Page } from 'playwright';
import sharp from 'sharp';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createBrowserAuditRuntime } from './browser-audit-runtime.ts';
import { compareParityImages } from './visual-parity-image.ts';
import {
  parityComponents,
  parityLocales,
  parityThemes,
  representativeParityScenarios,
  type VisualParityScenario,
  visualParityScenarios,
} from './visual-parity-scenarios.ts';

const enabled = process.env['TINYRACK_VISUAL_PARITY'] !== undefined;
const full = process.env['TINYRACK_VISUAL_PARITY'] === 'full';
const quick = process.env['TINYRACK_VISUAL_PARITY'] === 'quick';
const runtime = createBrowserAuditRuntime({
  chromiumArgs: ['--disable-lcd-text'],
});
const channel = 'tinyrack.flutter-preview.v1';
const artifactRoot = join(process.cwd(), 'test-results/visual-parity');

type Bounds = {
  height: number;
  width: number;
  x: number;
  y: number;
};

type FlutterMetrics = {
  baseline: number | null;
  bounds: Bounds;
  parts: Record<
    string,
    {
      baseline: number | null;
      bounds: Bounds;
    }
  >;
  textStyle?: Record<string, unknown>;
};

type ParityPages = {
  context: BrowserContext;
  flutterPage: Page;
  reactPage: Page;
};

const partSelectors: Partial<
  Record<VisualParityScenario['component'], Record<string, string>>
> = {
  alert: {
    actions: '.tr-alert-actions .tr-text',
    description: '.tr-alert-description',
    icon: '.parity-alert-icon',
    title: '.tr-alert-title',
  },
  badge: { label: '[data-parity-part="label"]' },
  button: { label: '[data-parity-part="label"]' },
  card: {
    content: '.tr-card-content',
    description: '.tr-card-description',
    footer: '.tr-card-footer',
    header: '.tr-card-header',
    title: '.tr-card-title',
  },
};

function queryFor(scenario: VisualParityScenario, locale: string, theme: string) {
  const query = new URLSearchParams({
    component: scenario.component,
    locale,
    theme,
  });
  for (const [key, value] of Object.entries(scenario.args)) {
    query.set(key, String(value));
  }
  return query;
}

async function preparePage(page: Page) {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.addStyleTag({
    content:
      '*,*::before,*::after{animation:none!important;caret-color:transparent!important;transition:none!important}',
  });
  await page.evaluate(() => document.fonts.ready);
}

async function flutterMetrics(page: Page): Promise<FlutterMetrics> {
  await expect
    .poll(
      () =>
        page.evaluate(() => {
          const messages = (window as Window & { __parityMessages?: unknown[] })
            .__parityMessages;
          const metrics = [...(messages ?? [])]
            .reverse()
            .find(
              (message) =>
                typeof message === 'object' &&
                message !== null &&
                (message as { type?: string }).type === 'metrics',
            ) as { payload?: FlutterMetrics } | undefined;
          return metrics?.payload?.bounds;
        }),
      { timeout: 60_000 },
    )
    .toBeTruthy();
  return page.evaluate(() => {
    const messages =
      (window as Window & { __parityMessages?: unknown[] }).__parityMessages ?? [];
    const metrics = [...messages]
      .reverse()
      .find(
        (message) =>
          typeof message === 'object' &&
          message !== null &&
          (message as { type?: string }).type === 'metrics',
      ) as { payload?: FlutterMetrics } | undefined;
    if (metrics?.payload === undefined) {
      throw new Error('Flutter preview did not return parity metrics.');
    }
    return metrics.payload;
  });
}

async function reactTextBaseline(page: Page, bounds: Bounds) {
  return page.locator('[data-parity-target] > *').evaluate((element, top) => {
    const marker = document.createElement('span');
    marker.style.cssText = 'display:inline-block;height:0;margin:0;padding:0;width:0';
    element.append(marker);
    const baseline = marker.getBoundingClientRect().top - top;
    marker.remove();
    return baseline;
  }, bounds.y);
}

async function reactPartBounds(
  page: Page,
  component: VisualParityScenario['component'],
) {
  const result: Record<string, Bounds> = {};
  for (const [name, selector] of Object.entries(partSelectors[component] ?? {})) {
    const locator = page.locator(selector);
    if ((await locator.count()) === 0) continue;
    const bounds = await locator.first().boundingBox();
    if (bounds !== null) result[name] = bounds;
  }
  return result;
}

async function image(
  page: Page,
  bounds: Bounds,
  dimensions: { height: number; width: number },
) {
  const margin = 16;
  return page.screenshot({
    clip: {
      height: dimensions.height + margin * 2,
      width: dimensions.width + margin * 2,
      x: bounds.x - margin,
      y: bounds.y - margin,
    },
    type: 'png',
  });
}

async function applyInteraction(
  page: Page,
  bounds: Bounds,
  state: VisualParityScenario['state'],
) {
  if (state === 'hover' || state === 'pressed') {
    await page.mouse.move(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2);
  }
  if (state === 'pressed') await page.mouse.down();
  if (state === 'focus-visible') await page.keyboard.press('Tab');
  await page.evaluate(
    () =>
      new Promise<void>((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
      ),
  );
  return async () => {
    if (state === 'pressed') await page.mouse.up();
  };
}

async function createParityPages(
  browser: Browser,
  origin: string,
  component: VisualParityScenario['component'],
  locale: string,
  theme: string,
): Promise<ParityPages> {
  const context = await browser.newContext({
    deviceScaleFactor: 1,
    reducedMotion: 'reduce',
    viewport: { height: 320, width: 480 },
  });
  const reactPage = await context.newPage();
  const flutterPage = await context.newPage();
  await flutterPage.addInitScript(() => {
    const messages: unknown[] = [];
    Object.defineProperty(window, '__parityMessages', { value: messages });
    window.addEventListener('message', (event) => messages.push(event.data));
  });
  await reactPage.goto(
    `${origin}/__visual-parity/?${new URLSearchParams({
      component,
      locale,
      theme,
    })}`,
  );
  await preparePage(reactPage);
  await reactPage.evaluate(async () => {
    const loadFont = async (font: string) => {
      for (let attempt = 0; attempt < 3; attempt += 1) {
        try {
          await document.fonts.load(font);
          return;
        } catch (error) {
          if (attempt === 2) throw error;
          await new Promise((resolve) => setTimeout(resolve, 50 * (attempt + 1)));
        }
      }
    };
    await Promise.all([
      loadFont('400 14px "IBM Plex Sans"'),
      loadFont('600 14px "IBM Plex Sans"'),
      loadFont('700 14px "IBM Plex Sans"'),
      loadFont('400 14px "IBM Plex Mono"'),
      loadFont('500 14px "IBM Plex Mono"'),
      loadFont('400 14px "IBM Plex Sans KR"'),
      loadFont('600 14px "IBM Plex Sans KR"'),
      loadFont('700 14px "IBM Plex Sans KR"'),
      loadFont('400 14px "IBM Plex Sans JP"'),
      loadFont('600 14px "IBM Plex Sans JP"'),
      loadFont('700 14px "IBM Plex Sans JP"'),
    ]);
  });
  await flutterPage.goto(
    `${origin}/flutter-preview/index.html?component=${component}&locale=${locale}`,
  );
  await expect
    .poll(
      () =>
        flutterPage.evaluate(() =>
          (
            (window as Window & { __parityMessages?: unknown[] }).__parityMessages ?? []
          ).some(
            (message) =>
              typeof message === 'object' &&
              message !== null &&
              (message as { type?: string }).type === 'ready',
          ),
        ),
      { timeout: 60_000 },
    )
    .toBe(true);
  await flutterPage.waitForLoadState('networkidle');
  await preparePage(flutterPage);
  await flutterPage.evaluate(async () => {
    for (let frame = 0; frame < 5; frame += 1) {
      await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
    }
  });
  if (component === 'text') {
    await flutterPage.evaluate(
      ({ selectedChannel }) => {
        const messages = (window as Window & { __parityMessages?: unknown[] })
          .__parityMessages;
        if (messages !== undefined) messages.length = 0;
        window.postMessage(
          {
            channel: selectedChannel,
            component: 'text',
            payload: { variant: 'code' },
            type: 'updateArgs',
          },
          location.origin,
        );
      },
      { selectedChannel: channel },
    );
    await expect
      .poll(
        () =>
          flutterPage.evaluate(() =>
            (
              (window as Window & { __parityMessages?: unknown[] }).__parityMessages ??
              []
            ).some(
              (message) =>
                typeof message === 'object' &&
                message !== null &&
                (message as { type?: string }).type === 'stateChanged' &&
                (
                  message as {
                    payload?: { args?: Record<string, unknown> };
                  }
                ).payload?.args?.['variant'] === 'code',
            ),
          ),
        { timeout: 60_000 },
      )
      .toBe(true);
    await flutterPage.waitForLoadState('networkidle');
    await flutterPage.evaluate(
      () =>
        new Promise<void>((resolve) =>
          requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
        ),
    );
  }
  return { context, flutterPage, reactPage };
}

async function compareScenario(
  pages: ParityPages,
  scenario: VisualParityScenario,
  locale: string,
  theme: string,
) {
  const { flutterPage, reactPage } = pages;
  const query = queryFor(scenario, locale, theme);

  await Promise.all([reactPage.mouse.move(1, 1), flutterPage.mouse.move(1, 1)]);
  await reactPage.evaluate((search) => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    (
      window as Window & {
        __setParityQuery?: (nextSearch: string) => void;
      }
    ).__setParityQuery?.(search);
  }, query.toString());
  await reactPage.evaluate(
    () =>
      new Promise<void>((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
      ),
  );
  const reactTarget = reactPage.locator('[data-parity-target] > *');
  await reactTarget.waitFor();
  const reactGeometryTarget =
    scenario.component === 'text'
      ? reactPage.locator('[data-parity-target]')
      : reactTarget;
  const reactBox = await reactGeometryTarget.boundingBox();
  if (reactBox === null) throw new Error('React parity target has no bounds');
  const reactTypography = await reactTarget.evaluate((element) => {
    const style = getComputedStyle(element);
    return {
      fontFamily: style.fontFamily,
      fontSize: style.fontSize,
      fontWeight: style.fontWeight,
      letterSpacing: style.letterSpacing,
      lineHeight: style.lineHeight,
    };
  });
  const reactParts = await reactPartBounds(reactPage, scenario.component);
  const releaseReact = await applyInteraction(reactPage, reactBox, scenario.state);
  if (
    scenario.state === 'hover' ||
    scenario.state === 'pressed' ||
    scenario.state === 'focus-visible'
  ) {
    const pseudoClass = {
      hover: ':hover',
      pressed: ':active',
      'focus-visible': ':focus-visible',
    }[scenario.state];
    const hasPseudoClass = () =>
      reactTarget.evaluate(
        (element, selector) =>
          element.matches(selector) || element.querySelector(selector) !== null,
        pseudoClass,
      );
    if (scenario.state === 'focus-visible') {
      await expect
        .poll(
          async () => {
            if (await hasPseudoClass()) return true;
            await reactPage.keyboard.press('Tab');
            return hasPseudoClass();
          },
          { timeout: 2_000 },
        )
        .toBe(true);
    } else {
      expect(
        await hasPseudoClass(),
        `${scenario.id} did not enter ${scenario.state}`,
      ).toBe(true);
    }
  } else if (scenario.state === 'disabled') {
    const disabledTarget =
      (await reactTarget.locator('button,input').count()) > 0
        ? reactTarget.locator('button,input').first()
        : reactTarget;
    expect(await disabledTarget.isDisabled()).toBe(true);
  } else if (scenario.state === 'loading') {
    expect(await reactTarget.isDisabled()).toBe(true);
    expect(await reactTarget.getAttribute('aria-busy')).toBe('true');
  }

  await flutterPage.evaluate(
    ({ args, component, selectedTheme, selectedChannel }) => {
      const messages = (window as Window & { __parityMessages?: unknown[] })
        .__parityMessages;
      if (messages !== undefined) messages.length = 0;
      window.postMessage(
        {
          channel: selectedChannel,
          component,
          type: 'reset',
        },
        location.origin,
      );
      window.postMessage(
        {
          channel: selectedChannel,
          component,
          payload: { theme: selectedTheme },
          type: 'setTheme',
        },
        location.origin,
      );
      window.postMessage(
        {
          channel: selectedChannel,
          component,
          payload: args,
          type: 'updateArgs',
        },
        location.origin,
      );
    },
    {
      args:
        scenario.component === 'text-field'
          ? { ...scenario.args, parity: true }
          : scenario.args,
      component: scenario.component,
      selectedChannel: channel,
      selectedTheme: theme,
    },
  );
  await expect
    .poll(
      () =>
        flutterPage.evaluate(
          ({ expectedArgs, expectedTheme }) => {
            const messages = (window as Window & { __parityMessages?: unknown[] })
              .__parityMessages;
            return (messages ?? []).some((message) => {
              if (
                typeof message !== 'object' ||
                message === null ||
                (message as { type?: string }).type !== 'stateChanged'
              ) {
                return false;
              }
              const payload = (
                message as {
                  payload?: {
                    args?: Record<string, unknown>;
                    theme?: string;
                  };
                }
              ).payload;
              return (
                payload?.theme === expectedTheme &&
                Object.entries(expectedArgs).every(
                  ([key, value]) => payload.args?.[key] === value,
                )
              );
            });
          },
          { expectedArgs: scenario.args, expectedTheme: theme },
        ),
      { timeout: 60_000 },
    )
    .toBe(true);
  await flutterPage.evaluate(
    () =>
      new Promise<void>((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
      ),
  );
  await flutterPage.evaluate(
    ({ component, selectedChannel }) => {
      const messages = (window as Window & { __parityMessages?: unknown[] })
        .__parityMessages;
      if (messages !== undefined) messages.length = 0;
      window.postMessage(
        {
          channel: selectedChannel,
          component,
          type: 'measure',
        },
        location.origin,
      );
    },
    { component: scenario.component, selectedChannel: channel },
  );
  const metrics = await flutterMetrics(flutterPage);
  const flutterBox = metrics.bounds;
  const releaseFlutter = await applyInteraction(
    flutterPage,
    flutterBox,
    scenario.state,
  );

  // The two runtimes center their targets independently. Component geometry
  // compares local edges; viewport position is intentionally normalized by
  // cropping each target before the pixel comparison.
  const geometryDeltas = Object.fromEntries(
    (['width', 'height'] as const).map((key) => [
      key,
      Math.abs(reactBox[key] - flutterBox[key]),
    ]),
  ) as Record<'height' | 'width', number>;
  if (Object.values(geometryDeltas).some((delta) => delta >= 1)) {
    await mkdir(artifactRoot, { recursive: true });
    await writeFile(
      join(artifactRoot, `${scenario.id}-${locale}-${theme}.json`),
      JSON.stringify(
        {
          args: scenario.args,
          flutterBox,
          flutterMetrics: metrics,
          geometryDeltas,
          reactBox,
          reactParts,
          reactTypography,
        },
        null,
        2,
      ),
    );
  }
  for (const key of ['width', 'height'] as const) {
    expect(
      geometryDeltas[key],
      `${scenario.id} ${locale}/${theme} ${key}`,
    ).toBeLessThan(1);
  }
  expect(
    new Set(Object.keys(metrics.parts)),
    `${scenario.id} ${locale}/${theme} Flutter parts`,
  ).toEqual(new Set(Object.keys(reactParts)));
  for (const [name, reactPart] of Object.entries(reactParts)) {
    const flutterPart = metrics.parts[name]?.bounds;
    if (flutterPart === undefined) {
      throw new Error(`Flutter metrics omitted the ${name} part.`);
    }
    if (
      name === 'label' &&
      (scenario.component === 'button' || scenario.component === 'badge')
    ) {
      for (const axis of ['x', 'y'] as const) {
        const size = axis === 'x' ? 'width' : 'height';
        const reactCenter = reactPart[axis] + reactPart[size] / 2 - reactBox[axis];
        const flutterCenter =
          flutterPart[axis] + flutterPart[size] / 2 - flutterBox[axis];
        expect(
          Math.abs(reactCenter - flutterCenter),
          `${scenario.id} ${locale}/${theme} ${name}.center-${axis}`,
        ).toBeLessThan(1);
      }
      continue;
    }
    for (const axis of ['x', 'y'] as const) {
      const reactOffset = reactPart[axis] - reactBox[axis];
      const flutterOffset = flutterPart[axis] - flutterBox[axis];
      expect(
        Math.abs(reactOffset - flutterOffset),
        `${scenario.id} ${locale}/${theme} ${name}.${axis}`,
      ).toBeLessThan(1);
    }
  }
  if (scenario.component === 'text') {
    const reactBaseline = await reactTextBaseline(reactPage, reactBox);
    expect(
      Math.abs(reactBaseline - (metrics.baseline ?? Number.NaN)),
      `${scenario.id} ${locale}/${theme} baseline`,
    ).toBeLessThan(1);
  }

  const normalizedDimensions = {
    height: Math.floor(Math.min(reactBox.height, flutterBox.height)),
    width: Math.floor(Math.min(reactBox.width, flutterBox.width)),
  };
  const [reactPng, flutterPng] = await Promise.all([
    image(reactPage, reactBox, normalizedDimensions),
    image(flutterPage, flutterBox, normalizedDimensions),
  ]);
  const reactImage = sharp(reactPng).ensureAlpha();
  const flutterImage = sharp(flutterPng).ensureAlpha();
  const [reactMeta, flutterMeta] = await Promise.all([
    reactImage.metadata(),
    flutterImage.metadata(),
  ]);
  expect(flutterMeta.width).toBe(reactMeta.width);
  expect(flutterMeta.height).toBe(reactMeta.height);
  if (reactMeta.width === undefined || reactMeta.height === undefined) {
    throw new Error('React parity screenshot omitted its dimensions.');
  }
  const { height: imageHeight, width: imageWidth } = reactMeta;
  const [reactRaw, flutterRaw] = await Promise.all([
    reactImage.raw().toBuffer(),
    flutterImage.raw().toBuffer(),
  ]);
  const {
    antialiasedPixels,
    diff,
    mismatchedPixels,
    structuralPixels,
    structuralSamples,
  } = compareParityImages(reactRaw, flutterRaw, imageWidth, imageHeight);
  if (structuralPixels > 0) {
    const name = `${scenario.id}-${locale}-${theme}`;
    await mkdir(artifactRoot, { recursive: true });
    await Promise.all([
      writeFile(join(artifactRoot, `${name}-react.png`), reactPng),
      writeFile(join(artifactRoot, `${name}-flutter.png`), flutterPng),
      reactPage.screenshot({
        path: join(artifactRoot, `${name}-react-full.png`),
      }),
      flutterPage.screenshot({
        path: join(artifactRoot, `${name}-flutter-full.png`),
      }),
      sharp(diff, {
        raw: {
          channels: 4,
          height: imageHeight,
          width: imageWidth,
        },
      })
        .png()
        .toFile(join(artifactRoot, `${name}-diff.png`)),
      writeFile(
        join(artifactRoot, `${name}.json`),
        JSON.stringify(
          {
            antialiasedPixels,
            flutterBox,
            mismatchedPixels,
            reactBox,
            structuralPixels,
            structuralSamples,
          },
          null,
          2,
        ),
      ),
    ]);
  }
  expect(structuralPixels, `${scenario.id} ${locale}/${theme}`).toBe(0);
  await Promise.all([releaseReact(), releaseFlutter()]);
}

describe.skipIf(!enabled)('React and Flutter pixel parity', () => {
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

  const scenarioFilter = process.env['TINYRACK_VISUAL_PARITY_SCENARIO'];
  const scenarios = (
    full ? visualParityScenarios : representativeParityScenarios
  ).filter(
    (scenario) => scenarioFilter === undefined || scenario.id.includes(scenarioFilter),
  );
  const environments = quick
    ? [{ locale: 'en' as const, theme: 'light' as const }]
    : parityLocales.flatMap((locale) =>
        parityThemes.map((theme) => ({ locale, theme })),
      );
  const groups = environments
    .flatMap(({ locale, theme }) =>
      parityComponents.map((component) => ({
        component,
        locale,
        scenarios: scenarios.filter((scenario) => scenario.component === component),
        theme,
      })),
    )
    .filter((group) => group.scenarios.length > 0);

  it.each(groups)(
    '$component scenarios match in $locale/$theme',
    async ({ component, locale, scenarios: componentScenarios, theme }) => {
      const pages = await createParityPages(browser, origin, component, locale, theme);
      try {
        for (const scenario of componentScenarios) {
          await compareScenario(pages, scenario, locale, theme);
        }
      } finally {
        await pages.context.close();
      }
    },
    full ? 300_000 : 30_000,
  );
});
