import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import type { Browser, BrowserContext, Page } from 'playwright';
import sharp from 'sharp';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createBrowserAuditRuntime } from './browser-audit-runtime.ts';
import { compareParityImages } from './visual-parity-image.ts';
import {
  motionParityScenarios,
  motionSampleTimes,
  parityComponents,
  parityLocales,
  parityThemes,
  representativeParityScenarios,
  type VisualParityScenario,
  visualParityScenarios,
} from './visual-parity-scenarios.ts';

const enabled = process.env['TINYRACK_VISUAL_PARITY'] !== undefined;
const full = process.env['TINYRACK_VISUAL_PARITY'] === 'full';
const motion = process.env['TINYRACK_VISUAL_PARITY'] === 'motion';
const quick = process.env['TINYRACK_VISUAL_PARITY'] === 'quick';
const runtime = createBrowserAuditRuntime({
  chromiumArgs: ['--disable-lcd-text'],
  requiredEntry: '__visual-parity/index.html',
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
  interaction: {
    activations: number;
    enabled: boolean;
    focusVisible: boolean;
    focused: boolean;
    hovered: boolean;
    invalid: boolean;
    loading: boolean;
    pressed: boolean;
    readonly: boolean;
  };
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
  'icon-button': { icon: '.parity-plus' },
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

async function preparePage(page: Page, motion = false) {
  await page.emulateMedia({ reducedMotion: motion ? 'no-preference' : 'reduce' });
  await page.addStyleTag({
    content: motion
      ? '*,*::before,*::after{caret-color:transparent!important}'
      : '*,*::before,*::after{animation:none!important;caret-color:transparent!important;transition:none!important}',
  });
  await page.evaluate(() => document.fonts.ready);
}

async function flutterMetrics(page: Page): Promise<FlutterMetrics> {
  const deadline = Date.now() + 60_000;
  while (Date.now() < deadline) {
    const metrics = await page.evaluate(() => {
      const messages =
        (window as Window & { __parityMessages?: unknown[] }).__parityMessages ?? [];
      return [...messages]
        .reverse()
        .find(
          (message) =>
            typeof message === 'object' &&
            message !== null &&
            (message as { type?: string }).type === 'metrics',
        ) as { payload?: FlutterMetrics } | undefined;
    });
    if (metrics?.payload !== undefined) return metrics.payload;
    await new Promise((resolve) => setTimeout(resolve, 25));
  }
  throw new Error('Flutter preview did not return parity metrics.');
}

async function measureFlutter(
  page: Page,
  component: VisualParityScenario['component'],
) {
  await page.evaluate(
    ({ selectedComponent, selectedChannel }) => {
      const messages = (window as Window & { __parityMessages?: unknown[] })
        .__parityMessages;
      if (messages !== undefined) messages.length = 0;
      window.postMessage(
        {
          channel: selectedChannel,
          component: selectedComponent,
          type: 'measure',
        },
        location.origin,
      );
    },
    { selectedChannel: channel, selectedComponent: component },
  );
  return flutterMetrics(page);
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
  const keyboardFocus =
    state === 'focus-visible' ||
    state === 'focus-visible-hover' ||
    state === 'keyboard-pressed' ||
    state === 'readonly-focus-visible' ||
    state === 'invalid-focus-visible';
  if (keyboardFocus) {
    await page.keyboard.press('Tab');
  }

  const pointerOver =
    state === 'hover' ||
    state === 'pressed' ||
    state === 'release-hover' ||
    state === 'pointer-focused' ||
    state === 'focus-visible-hover' ||
    state === 'disabled-hover' ||
    state === 'loading-hover' ||
    state === 'invalid-hover';
  if (pointerOver) {
    await page.mouse.move(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2);
  }
  if (state === 'pressed' || state === 'release-hover') await page.mouse.down();
  if (state === 'pointer-focused') {
    await page.mouse.down();
    await page.mouse.up();
  }
  if (state === 'keyboard-pressed') await page.keyboard.down('Space');
  await page.evaluate(
    () =>
      new Promise<void>((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
      ),
  );
  if (state === 'release-hover') {
    await page.mouse.up();
    await page.evaluate(
      () =>
        new Promise<void>((resolve) =>
          requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
        ),
    );
  }
  return async () => {
    if (state === 'pressed') await page.mouse.up();
    if (state === 'keyboard-pressed') await page.keyboard.up('Space');
  };
}

async function createParityPages(
  browser: Browser,
  origin: string,
  component: VisualParityScenario['component'],
  locale: string,
  theme: string,
  motion = false,
): Promise<ParityPages> {
  const context = await browser.newContext({
    deviceScaleFactor: 1,
    reducedMotion: motion ? 'no-preference' : 'reduce',
    viewport: { height: 320, width: 480 },
  });
  const reactPage = await context.newPage();
  const flutterPage = await context.newPage();
  if (motion) {
    await Promise.all([reactPage.clock.install(), flutterPage.clock.install()]);
  }
  await flutterPage.addInitScript(() => {
    const messages: unknown[] = [];
    Object.defineProperty(window, '__parityMessages', { value: messages });
    window.addEventListener('message', (event) => messages.push(event.data));
  });
  const reactNavigation = reactPage.goto(
    `${origin}/__visual-parity/?${new URLSearchParams({
      component,
      locale,
      theme,
    })}`,
  );
  if (motion) await reactPage.clock.runFor(1_000);
  await reactNavigation;
  await preparePage(reactPage, motion);
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
  const flutterNavigation = flutterPage.goto(
    `${origin}/flutter-preview/index.html?component=${component}&locale=${locale}&theme=${theme}${motion ? '&motion=true' : ''}`,
  );
  if (motion) await flutterPage.clock.runFor(1_000);
  await flutterNavigation;
  if (motion) await flutterPage.clock.runFor(1_000);
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
  await preparePage(flutterPage, motion);
  const initialFrames = flutterPage.evaluate(async () => {
    for (let frame = 0; frame < 5; frame += 1) {
      await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
    }
  });
  if (motion) await flutterPage.clock.runFor(100);
  await initialFrames;
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
    document.body.tabIndex = -1;
    document.body.focus();
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
  const reactRestParts = await reactPartBounds(reactPage, scenario.component);
  const releaseReact = await applyInteraction(reactPage, reactBox, scenario.state);
  const expectedPseudoClasses: string[] | undefined = (
    {
      hover: [':hover'],
      pressed: [':hover', ':active'],
      'release-hover': [':hover'],
      'focus-visible': [':focus-visible'],
      'focus-visible-hover': [':focus-visible', ':hover'],
      'keyboard-pressed': [':focus-visible'],
      'pointer-focused': [':focus', ':focus-visible'],
      'readonly-focus-visible': [':focus-visible'],
      'invalid-hover': [':hover'],
      'invalid-focus-visible': [':focus-visible'],
    } as Partial<Record<NonNullable<VisualParityScenario['state']>, string[]>>
  )[scenario.state ?? 'default'];
  if (expectedPseudoClasses !== undefined) {
    const hasPseudoClass = (pseudoClass: string) =>
      reactTarget.evaluate(
        (element, selector) =>
          element.matches(selector) || element.querySelector(selector) !== null,
        pseudoClass,
      );
    for (const pseudoClass of expectedPseudoClasses) {
      if (pseudoClass === ':focus-visible') {
        await expect
          .poll(
            async () => {
              if (await hasPseudoClass(pseudoClass)) return true;
              await reactPage.keyboard.press('Tab');
              return hasPseudoClass(pseudoClass);
            },
            { timeout: 2_000 },
          )
          .toBe(true);
      } else {
        expect(
          await hasPseudoClass(pseudoClass),
          `${scenario.id} did not enter ${pseudoClass}`,
        ).toBe(true);
      }
    }
  } else if (scenario.state === 'disabled' || scenario.state === 'disabled-hover') {
    const disabledTarget =
      (await reactTarget.locator('button,input').count()) > 0
        ? reactTarget.locator('button,input').first()
        : reactTarget;
    expect(await disabledTarget.isDisabled()).toBe(true);
  } else if (scenario.state === 'loading' || scenario.state === 'loading-hover') {
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
  const metrics = await measureFlutter(flutterPage, scenario.component);
  const flutterBox = metrics.bounds;
  const releaseFlutter = await applyInteraction(
    flutterPage,
    flutterBox,
    scenario.state,
  );
  const reactStateBox = await reactGeometryTarget.boundingBox();
  if (reactStateBox === null) {
    throw new Error('React parity target has no bounds after interaction');
  }
  const reactParts = await reactPartBounds(reactPage, scenario.component);
  let stateMetrics = await measureFlutter(flutterPage, scenario.component);
  const pointerOver =
    scenario.state === 'hover' ||
    scenario.state === 'pressed' ||
    scenario.state === 'release-hover' ||
    scenario.state === 'pointer-focused' ||
    scenario.state === 'focus-visible-hover' ||
    scenario.state === 'disabled-hover' ||
    scenario.state === 'loading-hover' ||
    scenario.state === 'invalid-hover';
  const focused =
    scenario.state === 'pointer-focused' ||
    scenario.state === 'focus-visible' ||
    scenario.state === 'focus-visible-hover' ||
    scenario.state === 'keyboard-pressed' ||
    scenario.state === 'readonly-focus-visible' ||
    scenario.state === 'invalid-focus-visible' ||
    (scenario.component === 'text-field' && scenario.state === 'pressed');
  for (
    let attempt = 0;
    focused && !stateMetrics.interaction.focused && attempt < 3;
    attempt += 1
  ) {
    await flutterPage.keyboard.press('Tab');
    await flutterPage.evaluate(
      () =>
        new Promise<void>((resolve) =>
          requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
        ),
    );
    stateMetrics = await measureFlutter(flutterPage, scenario.component);
  }
  expect(
    stateMetrics.interaction,
    `${scenario.id} Flutter interaction telemetry ${JSON.stringify(
      stateMetrics.interaction,
    )}`,
  ).toMatchObject({
    activations: scenario.state === 'release-hover' ? 1 : 0,
    enabled: scenario.args['disabled'] !== true && scenario.args['loading'] !== true,
    focusVisible: focused,
    focused,
    hovered: pointerOver,
    invalid: scenario.args['errorText'] !== undefined,
    loading: scenario.args['loading'] === true,
    pressed: scenario.state === 'pressed',
    readonly: scenario.args['readOnly'] === true,
  });
  const interactionAnchor =
    scenario.component === 'button'
      ? 'label'
      : scenario.component === 'icon-button'
        ? 'icon'
        : undefined;
  const flutterAnchorDelta =
    interactionAnchor === undefined
      ? { x: 0, y: 0 }
      : {
          x:
            (stateMetrics.parts[interactionAnchor]?.bounds.x ?? 0) -
            (metrics.parts[interactionAnchor]?.bounds.x ?? 0),
          y:
            (stateMetrics.parts[interactionAnchor]?.bounds.y ?? 0) -
            (metrics.parts[interactionAnchor]?.bounds.y ?? 0),
        };
  const flutterStateBox = {
    ...stateMetrics.bounds,
    x: stateMetrics.bounds.x + flutterAnchorDelta.x,
    y: stateMetrics.bounds.y + flutterAnchorDelta.y,
  };

  for (const axis of ['x', 'y'] as const) {
    const reactDelta =
      interactionAnchor === undefined
        ? reactStateBox[axis] - reactBox[axis]
        : (reactParts[interactionAnchor]?.[axis] ?? 0) -
          (reactRestParts[interactionAnchor]?.[axis] ?? 0);
    const flutterDelta = flutterAnchorDelta[axis];
    if (Math.abs(reactDelta - flutterDelta) >= 1) {
      await mkdir(artifactRoot, { recursive: true });
      const interactionName = `${scenario.id}-${locale}-${theme}-interaction`;
      await Promise.all([
        reactPage.screenshot({
          path: join(artifactRoot, `${interactionName}-react-full.png`),
        }),
        flutterPage.screenshot({
          path: join(artifactRoot, `${interactionName}-flutter-full.png`),
        }),
        writeFile(
          join(artifactRoot, `${interactionName}.json`),
          JSON.stringify(
            {
              axis,
              flutterAnchorDelta,
              flutterMetrics: stateMetrics,
              reactDelta,
              reactParts,
              reactRestParts,
            },
            null,
            2,
          ),
        ),
      ]);
    }
    expect(
      Math.abs(reactDelta - flutterDelta),
      `${scenario.id} ${locale}/${theme} interaction.${axis} (React ${reactDelta}, Flutter ${flutterDelta})`,
    ).toBeLessThan(1);
  }

  // The two runtimes center their targets independently. Component geometry
  // compares local edges; viewport position is intentionally normalized by
  // cropping each target before the pixel comparison.
  const geometryDeltas = Object.fromEntries(
    (['width', 'height'] as const).map((key) => [
      key,
      Math.abs(reactStateBox[key] - flutterStateBox[key]),
    ]),
  ) as Record<'height' | 'width', number>;
  if (Object.values(geometryDeltas).some((delta) => delta >= 1)) {
    await mkdir(artifactRoot, { recursive: true });
    await writeFile(
      join(artifactRoot, `${scenario.id}-${locale}-${theme}.json`),
      JSON.stringify(
        {
          args: scenario.args,
          flutterBox: flutterStateBox,
          flutterMetrics: stateMetrics,
          geometryDeltas,
          reactBox: reactStateBox,
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
    new Set(Object.keys(stateMetrics.parts)),
    `${scenario.id} ${locale}/${theme} Flutter parts`,
  ).toEqual(new Set(Object.keys(reactParts)));
  for (const [name, reactPart] of Object.entries(reactParts)) {
    const flutterPart = stateMetrics.parts[name]?.bounds;
    if (flutterPart === undefined) {
      throw new Error(`Flutter metrics omitted the ${name} part.`);
    }
    if (
      name === 'label' &&
      (scenario.component === 'button' || scenario.component === 'badge')
    ) {
      for (const axis of ['x', 'y'] as const) {
        const size = axis === 'x' ? 'width' : 'height';
        const reactCenter = reactPart[axis] + reactPart[size] / 2 - reactStateBox[axis];
        const flutterCenter =
          flutterPart[axis] + flutterPart[size] / 2 - flutterStateBox[axis];
        expect(
          Math.abs(reactCenter - flutterCenter),
          `${scenario.id} ${locale}/${theme} ${name}.center-${axis}`,
        ).toBeLessThan(1);
      }
      continue;
    }
    for (const axis of ['x', 'y'] as const) {
      const reactOffset = reactPart[axis] - reactStateBox[axis];
      const flutterOffset = flutterPart[axis] - flutterStateBox[axis];
      expect(
        Math.abs(reactOffset - flutterOffset),
        `${scenario.id} ${locale}/${theme} ${name}.${axis}`,
      ).toBeLessThan(1);
    }
  }
  if (scenario.component === 'text') {
    const reactBaseline = await reactTextBaseline(reactPage, reactStateBox);
    expect(
      Math.abs(reactBaseline - (stateMetrics.baseline ?? Number.NaN)),
      `${scenario.id} ${locale}/${theme} baseline`,
    ).toBeLessThan(1);
  }

  const normalizedDimensions = {
    height: Math.floor(Math.min(reactStateBox.height, flutterStateBox.height)),
    width: Math.floor(Math.min(reactStateBox.width, flutterStateBox.width)),
  };
  const [reactPng, flutterPng] = await Promise.all([
    image(reactPage, reactStateBox, normalizedDimensions),
    image(flutterPage, flutterStateBox, normalizedDimensions),
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
  const rasterRects: Array<{
    bottom: number;
    left: number;
    right: number;
    top: number;
  }> =
    scenario.component === 'text'
      ? [
          {
            bottom: 16 + normalizedDimensions.height + 1,
            left: 15,
            right: 16 + normalizedDimensions.width + 1,
            top: 15,
          },
        ]
      : scenario.component === 'text-field'
        ? [
            // CanvasKit and Chromium rasterize the same IBM Plex glyph
            // outlines differently. Keep these exclusions bounded to the
            // label, editable text, and supporting-copy rows so fills,
            // borders, focus rings, and geometry remain strict.
            { bottom: 29, left: 16, right: 336, top: 15 },
            { bottom: 64, left: 24, right: 336, top: 44 },
            { bottom: 102, left: 16, right: 336, top: 78 },
          ]
        : Object.entries(reactParts).flatMap(([name, reactPart]) => {
            const flutterPart = stateMetrics.parts[name]?.bounds;
            if (flutterPart === undefined) return [];
            const reactLeft = reactPart.x - reactStateBox.x + 16;
            const reactTop = reactPart.y - reactStateBox.y + 16;
            const flutterLeft = flutterPart.x - flutterStateBox.x + 16;
            const flutterTop = flutterPart.y - flutterStateBox.y + 16;
            return [
              {
                bottom:
                  Math.max(
                    reactTop + reactPart.height,
                    flutterTop + flutterPart.height,
                  ) + 1,
                left: Math.min(reactLeft, flutterLeft) - 1,
                right:
                  Math.max(
                    reactLeft + reactPart.width,
                    flutterLeft + flutterPart.width,
                  ) + 1,
                top: Math.min(reactTop, flutterTop) - 1,
              },
            ];
          });
  if (scenario.component === 'card' && scenario.args['variant'] === 'elevated') {
    rasterRects.push(
      { bottom: 15, left: 0, right: imageWidth, top: 0 },
      {
        bottom: imageHeight,
        left: 0,
        right: imageWidth,
        top: 16 + normalizedDimensions.height,
      },
      { bottom: imageHeight, left: 0, right: 15, top: 16 },
      {
        bottom: imageHeight,
        left: 16 + normalizedDimensions.width,
        right: imageWidth,
        top: 16,
      },
    );
  }
  const {
    antialiasedPixels,
    diff,
    mismatchedPixels,
    structuralPixels,
    structuralSamples,
  } = compareParityImages(reactRaw, flutterRaw, imageWidth, imageHeight, {
    geometry: {
      contentHeight: normalizedDimensions.height,
      contentWidth: normalizedDimensions.width,
      heightDelta: geometryDeltas.height,
      margin: 16,
      widthDelta: geometryDeltas.width,
    },
    rasterRects,
  });
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
            flutterBox: flutterStateBox,
            mismatchedPixels,
            reactBox: reactStateBox,
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
  if (scenario.component === 'button' || scenario.component === 'icon-button') {
    if (scenario.state === 'focus-visible') {
      await Promise.all([
        reactPage.keyboard.press('Enter'),
        flutterPage.keyboard.press('Enter'),
      ]);
    }
    const expectedActivations =
      scenario.state === 'release-hover' ||
      scenario.state === 'pressed' ||
      scenario.state === 'keyboard-pressed' ||
      scenario.state === 'focus-visible'
        ? 1
        : 0;
    const [reactActivations, flutterActivations] = await Promise.all([
      reactPage.evaluate(
        () =>
          (
            window as Window & {
              __parityActivations?: () => number;
            }
          ).__parityActivations?.() ?? 0,
      ),
      measureFlutter(flutterPage, scenario.component).then(
        (currentMetrics) => currentMetrics.interaction.activations,
      ),
    ]);
    expect(reactActivations, `${scenario.id} React activations`).toBe(
      expectedActivations,
    );
    expect(flutterActivations, `${scenario.id} Flutter activations`).toBe(
      expectedActivations,
    );
  }
}

async function configureMotionScenario(
  pages: ParityPages,
  scenario: (typeof motionParityScenarios)[number],
  theme: string,
) {
  const { flutterPage, reactPage } = pages;
  const query = queryFor(scenario, 'en', theme);
  query.set('motion', 'true');
  await reactPage.evaluate((search) => {
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
    (
      window as Window & {
        __setParityQuery?: (nextSearch: string) => void;
      }
    ).__setParityQuery?.(search);
  }, query.toString());
  await flutterPage.evaluate(
    ({ args, component, selectedChannel, selectedTheme }) => {
      const messages = (window as Window & { __parityMessages?: unknown[] })
        .__parityMessages;
      if (messages !== undefined) messages.length = 0;
      for (const message of [
        { channel: selectedChannel, component, type: 'reset' },
        {
          channel: selectedChannel,
          component,
          payload: { theme: selectedTheme },
          type: 'setTheme',
        },
        {
          channel: selectedChannel,
          component,
          payload: component === 'text-field' ? { ...args, parity: true } : args,
          type: 'updateArgs',
        },
      ]) {
        window.postMessage(message, location.origin);
      }
    },
    {
      args: scenario.args,
      component: scenario.component,
      selectedChannel: channel,
      selectedTheme: theme,
    },
  );
  await Promise.all([
    reactPage.evaluate(
      () =>
        new Promise<void>((resolve) =>
          requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
        ),
    ),
    expect
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
                (message as { type?: string }).type === 'stateChanged',
            ),
          ),
        { timeout: 60_000 },
      )
      .toBe(true),
  ]);
}

async function compareMotionScenario(
  pages: ParityPages,
  scenario: (typeof motionParityScenarios)[number],
  theme: string,
) {
  const { flutterPage, reactPage } = pages;
  await Promise.all([reactPage.mouse.move(1, 1), flutterPage.mouse.move(1, 1)]);
  const advanceFlutterClock = async (duration: number) => {
    if (duration <= 0) return;
    await flutterPage.clock.runFor(duration * 92);
    const nextFrame = flutterPage.evaluate(
      () => new Promise<void>((resolve) => requestAnimationFrame(() => resolve())),
    );
    // Flush the paint scheduled by the last time-dilated animation tick. The
    // additional 16ms advances Flutter's animation clock by only 0.16ms.
    await flutterPage.clock.runFor(16);
    await nextFrame;
  };
  await configureMotionScenario(pages, scenario, theme);
  await Promise.all([reactPage.clock.runFor(140), advanceFlutterClock(140)]);
  const reactTarget = reactPage.locator('[data-parity-target] > *');
  const reactRest = await reactTarget.boundingBox();
  const flutterRestMetrics = await measureFlutter(flutterPage, scenario.component);
  const flutterRest = flutterRestMetrics.bounds;
  const interactionAnchor =
    scenario.component === 'button'
      ? 'label'
      : scenario.component === 'icon-button'
        ? 'icon'
        : undefined;
  if (reactRest === null) throw new Error(`${scenario.id} has no React bounds`);

  const center = (bounds: Bounds) => ({
    x: bounds.x + bounds.width / 2,
    y: bounds.y + bounds.height / 2,
  });
  const moveInside = () =>
    Promise.all([
      reactPage.mouse.move(center(reactRest).x, center(reactRest).y),
      flutterPage.mouse.move(center(flutterRest).x, center(flutterRest).y),
    ]);
  const settle = () =>
    Promise.all([reactPage.clock.runFor(140), advanceFlutterClock(140)]);

  if (scenario.transition === 'hover-out' || scenario.transition.startsWith('press')) {
    await moveInside();
    await settle();
  }
  if (scenario.transition === 'press-out') {
    await Promise.all([reactPage.mouse.down(), flutterPage.mouse.down()]);
    await settle();
  }
  if (scenario.transition === 'hover-in') await moveInside();
  if (scenario.transition === 'hover-out') {
    await Promise.all([reactPage.mouse.move(1, 1), flutterPage.mouse.move(1, 1)]);
  }
  if (scenario.transition === 'press-in') {
    await Promise.all([reactPage.mouse.down(), flutterPage.mouse.down()]);
  }
  if (scenario.transition === 'press-out') {
    await Promise.all([reactPage.mouse.up(), flutterPage.mouse.up()]);
  }

  let elapsed = 0;
  const frameFailures: string[] = [];
  for (const sampleTime of motionSampleTimes) {
    const advance = sampleTime - elapsed;
    if (advance > 0) {
      await Promise.all([
        reactPage.clock.runFor(advance),
        advanceFlutterClock(advance),
      ]);
    }
    elapsed = sampleTime;
    // Chromium exposes CSS transitions through Web Animations. Seeking the
    // compositor animation removes any event-dispatch latency from the 0ms
    // sample while Flutter advances through the same virtual clock interval.
    const reactAnimations = await reactPage.evaluate((time) => {
      for (const animation of document.getAnimations()) {
        animation.pause();
        animation.currentTime = time;
      }
      const target = document.querySelector('[data-parity-target] > *');
      return {
        animations: document.getAnimations().length,
        transition: target === null ? '' : getComputedStyle(target).transition,
      };
    }, sampleTime);
    const reactBox = await reactTarget.boundingBox();
    const flutterMetricsAtTime = await measureFlutter(flutterPage, scenario.component);
    if (reactBox === null) throw new Error(`${scenario.id} lost its React bounds`);
    for (const axis of ['x', 'y', 'width', 'height'] as const) {
      const reactDelta = reactBox[axis] - reactRest[axis];
      const flutterDelta =
        interactionAnchor !== undefined && (axis === 'x' || axis === 'y')
          ? (flutterMetricsAtTime.parts[interactionAnchor]?.bounds[axis] ?? 0) -
            (flutterRestMetrics.parts[interactionAnchor]?.bounds[axis] ?? 0)
          : flutterMetricsAtTime.bounds[axis] - flutterRest[axis];
      expect(
        Math.abs(reactDelta - flutterDelta),
        `${scenario.id} ${sampleTime}ms ${axis} (React ${reactDelta}, Flutter ${flutterDelta}, ${JSON.stringify(reactAnimations)})`,
      ).toBeLessThan(1);
    }

    const dimensions = {
      height: Math.ceil(Math.max(reactBox.height, flutterMetricsAtTime.bounds.height)),
      width: Math.ceil(Math.max(reactBox.width, flutterMetricsAtTime.bounds.width)),
    };
    const flutterVisualBox = {
      ...flutterMetricsAtTime.bounds,
      x:
        flutterMetricsAtTime.bounds.x +
        (interactionAnchor === undefined
          ? 0
          : (flutterMetricsAtTime.parts[interactionAnchor]?.bounds.x ?? 0) -
            (flutterRestMetrics.parts[interactionAnchor]?.bounds.x ?? 0)),
      y:
        flutterMetricsAtTime.bounds.y +
        (interactionAnchor === undefined
          ? 0
          : (flutterMetricsAtTime.parts[interactionAnchor]?.bounds.y ?? 0) -
            (flutterRestMetrics.parts[interactionAnchor]?.bounds.y ?? 0)),
    };
    const [reactPng, flutterPng] = await Promise.all([
      image(reactPage, reactBox, dimensions),
      image(flutterPage, flutterVisualBox, dimensions),
    ]);
    const [reactImage, flutterImage] = await Promise.all([
      sharp(reactPng).ensureAlpha().raw().toBuffer({ resolveWithObject: true }),
      sharp(flutterPng).ensureAlpha().raw().toBuffer({ resolveWithObject: true }),
    ]);
    const reactPartsAtTime = await reactPartBounds(reactPage, scenario.component);
    const rasterRects: Array<{
      bottom: number;
      left: number;
      right: number;
      top: number;
    }> =
      scenario.component === 'text-field'
        ? [
            { bottom: 29, left: 16, right: 336, top: 15 },
            { bottom: 64, left: 24, right: 336, top: 44 },
          ]
        : Object.entries(reactPartsAtTime).flatMap(([name, reactPart]) => {
            const flutterPart = flutterMetricsAtTime.parts[name]?.bounds;
            if (flutterPart === undefined) return [];
            const reactLeft = reactPart.x - reactBox.x + 16;
            const reactTop = reactPart.y - reactBox.y + 16;
            const flutterLeft = flutterPart.x - flutterVisualBox.x + 16;
            const flutterTop = flutterPart.y - flutterVisualBox.y + 16;
            return [
              {
                bottom:
                  Math.max(
                    reactTop + reactPart.height,
                    flutterTop + flutterPart.height,
                  ) + 1,
                left: Math.min(reactLeft, flutterLeft) - 1,
                right:
                  Math.max(
                    reactLeft + reactPart.width,
                    flutterLeft + flutterPart.width,
                  ) + 1,
                top: Math.min(reactTop, flutterTop) - 1,
              },
            ];
          });
    if (scenario.component === 'button' || scenario.component === 'icon-button') {
      // Endpoint tests keep border color and geometry strict. During a
      // fractional transform, CSS and Canvas rasterize that same one-pixel
      // static border at different coverage, so bound the motion-only AA
      // exclusion to the component's four edge strips.
      rasterRects.push(
        { bottom: 17, left: 15, right: 17 + dimensions.width, top: 15 },
        {
          bottom: 17 + dimensions.height,
          left: 15,
          right: 17 + dimensions.width,
          top: 15 + dimensions.height,
        },
        { bottom: 17 + dimensions.height, left: 15, right: 17, top: 15 },
        {
          bottom: 17 + dimensions.height,
          left: 15 + dimensions.width,
          right: 17 + dimensions.width,
          top: 15,
        },
      );
    }
    const result = compareParityImages(
      reactImage.data,
      flutterImage.data,
      reactImage.info.width,
      reactImage.info.height,
      { rasterRects },
    );
    if (result.structuralPixels > 0) {
      const name = `${scenario.id}-${theme}-${sampleTime}ms`;
      await mkdir(artifactRoot, { recursive: true });
      await Promise.all([
        writeFile(join(artifactRoot, `${name}-react.png`), reactPng),
        writeFile(join(artifactRoot, `${name}-flutter.png`), flutterPng),
        sharp(result.diff, {
          raw: {
            channels: 4,
            height: reactImage.info.height,
            width: reactImage.info.width,
          },
        })
          .png()
          .toFile(join(artifactRoot, `${name}-diff.png`)),
        writeFile(
          join(artifactRoot, `${name}.json`),
          JSON.stringify(
            {
              flutterBox: flutterMetricsAtTime.bounds,
              interaction: flutterMetricsAtTime.interaction,
              reactBox,
              sampleTime,
              structuralSamples: result.structuralSamples,
              structuralPixels: result.structuralPixels,
              transition: scenario.transition,
            },
            null,
            2,
          ),
        ),
      ]);
    }
    if (result.structuralPixels > 0) {
      frameFailures.push(`${sampleTime}ms:${result.structuralPixels}`);
    }
  }
  if (scenario.transition === 'press-in') {
    await Promise.all([reactPage.mouse.up(), flutterPage.mouse.up()]);
  }
  expect(frameFailures, `${scenario.id} ${theme}`).toEqual([]);
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
  const scenarioFilters = new Set(scenarioFilter?.split(','));
  const componentFilter = process.env['TINYRACK_VISUAL_PARITY_COMPONENT'];
  const componentFilters = new Set(componentFilter?.split(','));
  const scenarios = (
    motion ? [] : full ? visualParityScenarios : representativeParityScenarios
  ).filter(
    (scenario) => scenarioFilter === undefined || scenarioFilters.has(scenario.id),
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
    .filter(
      (group) =>
        group.scenarios.length > 0 &&
        (componentFilter === undefined || componentFilters.has(group.component)),
    );

  it.each(groups)(
    '$component scenarios match in $locale/$theme',
    async ({ component, locale, scenarios: componentScenarios, theme }) => {
      const pages = await createParityPages(browser, origin, component, locale, theme);
      const failures: string[] = [];
      try {
        for (const scenario of componentScenarios) {
          try {
            await compareScenario(pages, scenario, locale, theme);
          } catch (error) {
            failures.push(
              `${scenario.id}: ${error instanceof Error ? error.message : String(error)}`,
            );
            await Promise.allSettled([
              pages.reactPage.mouse.up(),
              pages.flutterPage.mouse.up(),
              pages.reactPage.keyboard.up('Space'),
              pages.flutterPage.keyboard.up('Space'),
            ]);
          }
        }
      } finally {
        await pages.context.close();
      }
      expect(failures, `${component} ${locale}/${theme}`).toEqual([]);
    },
    full ? 300_000 : 30_000,
  );

  const selectedMotionScenarios = motionParityScenarios.filter((scenario) => {
    if (scenarioFilter !== undefined) return scenarioFilters.has(scenario.id);
    if (scenario.component === 'text-field') return true;
    if (scenario.args['uiSize'] !== 'md') return true;
    if (scenario.transition === 'hover-in' || scenario.transition === 'press-in') {
      return true;
    }
    return scenario.args['intent'] === 'primary';
  });
  const motionGroups = motion
    ? parityThemes.flatMap((theme) =>
        (['button', 'icon-button', 'text-field'] as const)
          .map((component) => ({
            component,
            scenarios: selectedMotionScenarios.filter(
              (scenario) => scenario.component === component,
            ),
            theme,
          }))
          .filter(
            (group) =>
              group.scenarios.length > 0 &&
              (componentFilter === undefined || componentFilters.has(group.component)),
          ),
      )
    : [];

  it.each(motionGroups)('$component motion matches in $theme', async ({
    component,
    scenarios: componentScenarios,
    theme,
  }) => {
    const pages = await createParityPages(
      browser,
      origin,
      component,
      'en',
      theme,
      true,
    );
    try {
      for (const scenario of componentScenarios) {
        await compareMotionScenario(pages, scenario, theme);
      }
    } finally {
      await pages.context.close();
    }
  }, 2_700_000);
});
