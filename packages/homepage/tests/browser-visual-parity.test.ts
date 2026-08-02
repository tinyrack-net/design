import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import type { Browser, BrowserContext, CDPSession, Page } from 'playwright';
import sharp from 'sharp';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import {
  partitionVisualParityWork,
  resolveVisualParityComparisonWorkers,
  resolveVisualParityConcurrency,
} from '../scripts/visual-parity-concurrency.ts';
import { VisualParityPool } from '../scripts/visual-parity-pool.ts';
import { VisualParityProfiler } from '../scripts/visual-parity-profiler.ts';
import { createBrowserAuditRuntime } from './browser-audit-runtime.ts';
import { type ComparisonOptions, compareParityImages } from './visual-parity-image.ts';
import { VisualParityImagePool } from './visual-parity-image-pool.ts';
import {
  defaultMotionParityScenarios,
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
const profiler = new VisualParityProfiler();

type Bounds = {
  height: number;
  width: number;
  x: number;
  y: number;
};

type FlutterMetrics = {
  args: Record<string, unknown>;
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
      text?: string | null;
    }
  >;
  requestId?: number;
  theme: string;
  textStyle?: Record<string, unknown>;
};

type ParityPages = {
  component: VisualParityScenario['component'];
  flutterPage: Page;
  flutterContext: BrowserContext;
  generation: number;
  locale: string;
  motion: boolean;
  reactPage: Page;
  reactContext: BrowserContext;
  theme: string;
};

type ParitySessionKey = {
  component: VisualParityScenario['component'];
  locale: string;
  theme: string;
};

let parityRequestId = 0;
let imagePool: VisualParityImagePool | undefined;
const screenshotSessions = new WeakMap<Page, CDPSession>();

function compareImages(
  react: Uint8Array,
  flutter: Uint8Array,
  width: number,
  height: number,
  options: ComparisonOptions,
) {
  return profiler.measure(
    'compare',
    () =>
      imagePool?.compare(react, flutter, width, height, options) ??
      Promise.resolve(compareParityImages(react, flutter, width, height, options)),
  );
}

async function waitForTrue(
  predicate: () => boolean | Promise<boolean>,
  timeout: number,
) {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    if (await predicate()) return;
    await new Promise((resolve) => setTimeout(resolve, 25));
  }
  throw new Error(`Condition was not met within ${timeout}ms.`);
}

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
  link: { label: '[data-parity-part="label"]' },
  toggle: { label: '[data-parity-part="label"]' },
  'toggle-group': {
    end: '[data-parity-part="end"]',
    start: '[data-parity-part="start"]',
  },
  card: {
    content: '.tr-card-content',
    description: '.tr-card-description',
    footer: '.tr-card-footer',
    header: '.tr-card-header',
    title: '.tr-card-title',
  },
  'icon-button': { icon: '.parity-plus' },
  // The copied label is the first paragraph the Flutter preview reports; it
  // anchors the pressed translation like the plain button label does.
  'copy-button': { label: '[data-copy-label="copied"]' },
  accordion: { trigger: '[data-parity-part="trigger"]' },
  'checkbox-group': { first: '[data-parity-part="first"]' },
  'radio-group': { first: '[data-parity-part="first"]' },
  'tree-nav': {
    leaf0Label: '[data-parity-part="treeNavRacksLabel"]',
    leaf1Label: '[data-parity-part="treeNavJobsLabel"]',
    leaf2Label: '[data-parity-part="treeNavSettingsLabel"]',
  },
};

function layerPartSelectors(
  component: VisualParityScenario['component'],
  open: boolean,
): Record<string, string> | undefined {
  if (component === 'app-shell') {
    return {
      activitySurface: '[data-parity-part="activitySurface"]',
      header: '[data-parity-part="appShellHeader"]',
      main: '[data-parity-part="appShellMain"]',
      metric0Surface: '[data-parity-part="metric0Surface"]',
      metric1Surface: '[data-parity-part="metric1Surface"]',
      metric2Surface: '[data-parity-part="metric2Surface"]',
      navigationRow0Surface: '[data-parity-part="navigationRow0Surface"]',
      navigationRow1Surface: '[data-parity-part="navigationRow1Surface"]',
      navigationRow2Surface: '[data-parity-part="navigationRow2Surface"]',
      navigationRow3Surface: '[data-parity-part="navigationRow3Surface"]',
      profileSurface: '[data-parity-part="profileSurface"]',
      sidebar: '[data-parity-part="appShellSidebar"]',
      statusSurface: '[data-parity-part="statusSurface"]',
      ...(open ? { drawerSurface: '.tr-drawer-popup[data-open]' } : {}),
    };
  }
  if (!open) {
    return (
      {
        dialog: { triggerLabel: '[data-parity-part="triggerLabel"]' },
        menu: { triggerLabel: '[data-parity-part="triggerLabel"]' },
        select: {
          triggerIcon: '.tr-select-icon',
          triggerLabel: '.tr-select-value',
        },
      } as Partial<Record<VisualParityScenario['component'], Record<string, string>>>
    )[component];
  }
  return (
    {
      'alert-dialog': {
        actionLabel: '[data-parity-part="alertDialogAction"]',
        cancelLabel: '[data-parity-part="alertDialogCancel"]',
        description: '.tr-alert-dialog-description',
        title: '.tr-alert-dialog-title',
      },
      autocomplete: {
        option0: '[data-parity-part="autocomplete-Seoul"]',
        option1: '[data-parity-part="autocomplete-Tokyo"]',
        option2: '[data-parity-part="autocomplete-Virginia"]',
      },
      combobox: {
        option0: '[data-parity-part="combobox-stable"]',
        option1: '[data-parity-part="combobox-beta"]',
      },
      dialog: {
        actionLabel: '[data-parity-part="actionLabel"]',
        body: '[data-parity-part="dialogBody"]',
        cancelLabel: '[data-parity-part="cancelLabel"]',
        description: '[data-parity-part="dialogDescription"]',
        title: '[data-parity-part="dialogTitle"]',
      },
      menu: {
        checkboxIndicator: '.tr-menu-checkbox-item-indicator',
        checkboxLabel: '[data-parity-part="checkboxLabel"]',
        groupLabel: '[data-parity-part="groupLabel"]',
        radioIndicator: '.tr-menu-radio-item-indicator',
        radioLabel: '[data-parity-part="radioLabel"]',
      },
      drawer: {
        content: '[data-parity-part="drawerContent"]',
        description: '.tr-drawer-description',
        title: '.tr-drawer-title',
      },
      'navigation-menu': {
        content: '[data-parity-part="navigationContent"]',
      },
      popover: {
        content: '[data-parity-part="popoverContent"]',
        description: '.tr-popover-description',
        title: '.tr-popover-title',
      },
      'preview-card': {
        description: '.tr-preview-card-popup p',
        title: '.tr-preview-card-popup strong',
      },
      select: {
        item0Indicator: '.tr-select-item:first-child .tr-select-item-indicator',
        item0Label: '.tr-select-item:first-child .tr-select-item-text',
        item1Label: '.tr-select-item:nth-child(2) .tr-select-item-text',
      },
      toast: {
        description: '.tr-toast-description',
        dismissIcon: '.tr-toast-close',
        title: '.tr-toast-title',
      },
    } as Partial<Record<VisualParityScenario['component'], Record<string, string>>>
  )[component];
}

// Pointer states default to the component's center, but composite components
// need the pointer on their interactive trigger instead.
function interactionPoint(
  scenario: VisualParityScenario,
  bounds: Bounds,
  parts: Record<string, Bounds>,
): { x: number; y: number } {
  const partTarget = (
    {
      accordion: 'trigger',
      'checkbox-group': 'first',
      'radio-group': 'first',
      'toggle-group': 'start',
    } as Partial<Record<VisualParityScenario['component'], string>>
  )[scenario.component];
  const part = partTarget === undefined ? undefined : parts[partTarget];
  if (part !== undefined) {
    return { x: part.x + part.width / 2, y: part.y + part.height / 2 };
  }
  if (scenario.component === 'tabs') {
    const tabHeight =
      scenario.args['uiSize'] === 'sm'
        ? 32
        : scenario.args['uiSize'] === 'lg'
          ? 48
          : 40;
    return { x: bounds.x + 30, y: bounds.y + tabHeight / 2 };
  }
  if (scenario.component === 'collapsible') {
    return { x: bounds.x + bounds.width / 2, y: bounds.y + 22 };
  }
  return { x: bounds.x + bounds.width / 2, y: bounds.y + bounds.height / 2 };
}

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

async function flutterMetrics(page: Page, requestId?: number): Promise<FlutterMetrics> {
  const deadline = Date.now() + 60_000;
  while (Date.now() < deadline) {
    const metrics = await page.evaluate((expectedRequestId) => {
      const messages =
        (window as Window & { __parityMessages?: unknown[] }).__parityMessages ?? [];
      return [...messages]
        .reverse()
        .find(
          (message) =>
            typeof message === 'object' &&
            message !== null &&
            (message as { type?: string }).type === 'metrics' &&
            (expectedRequestId === undefined ||
              (message as { payload?: { requestId?: number } }).payload?.requestId ===
                expectedRequestId),
        ) as { payload?: FlutterMetrics } | undefined;
    }, requestId);
    if (metrics?.payload !== undefined) return metrics.payload;
    await new Promise((resolve) => setTimeout(resolve, 25));
  }
  throw new Error('Flutter preview did not return parity metrics.');
}

async function measureFlutter(
  page: Page,
  component: VisualParityScenario['component'],
) {
  const requestId = ++parityRequestId;
  await page.evaluate(
    ({ afterFrame, id, selectedComponent, selectedChannel }) => {
      const messages = (window as Window & { __parityMessages?: unknown[] })
        .__parityMessages;
      if (messages !== undefined) messages.length = 0;
      window.postMessage(
        {
          channel: selectedChannel,
          component: selectedComponent,
          payload: { afterFrame },
          requestId: id,
          type: 'measure',
        },
        location.origin,
      );
    },
    {
      afterFrame: !motion,
      id: requestId,
      selectedChannel: channel,
      selectedComponent: component,
    },
  );
  return flutterMetrics(page, requestId);
}

async function renderFlutterScenario(
  page: Page,
  component: VisualParityScenario['component'],
  args: Record<string, boolean | string>,
  theme: string,
) {
  const requestId = ++parityRequestId;
  await page.evaluate(
    ({
      afterFrame,
      id,
      scenarioArgs,
      selectedChannel,
      selectedComponent,
      selectedTheme,
    }) => {
      const messages = (window as Window & { __parityMessages?: unknown[] })
        .__parityMessages;
      if (messages !== undefined) messages.length = 0;
      window.postMessage(
        {
          channel: selectedChannel,
          component: selectedComponent,
          payload: { afterFrame, args: scenarioArgs, theme: selectedTheme },
          requestId: id,
          type: 'renderScenario',
        },
        location.origin,
      );
    },
    {
      afterFrame: !motion,
      id: requestId,
      scenarioArgs:
        component === 'text-field' || component === 'textarea'
          ? { ...args, parity: true }
          : args,
      selectedChannel: channel,
      selectedComponent: component,
      selectedTheme: theme,
    },
  );
  const metrics = await flutterMetrics(page, requestId);
  expect(metrics.theme).toBe(theme);
  expect(metrics.args).toMatchObject(args);
  return metrics;
}

async function reactSnapshot(
  page: Page,
  component: VisualParityScenario['component'],
  args: Record<string, unknown> = {},
) {
  const selectors =
    layerPartSelectors(component, args['open'] === true) ??
    partSelectors[component] ??
    {};
  const rasterOnlySelectors =
    component === 'app-shell'
      ? {
          activityHeader: '[data-parity-raster="activityHeader"]',
          activityRows: '[data-parity-raster="activityRows"]',
          avatar: '[data-parity-raster="avatar"]',
          brandIcon: '[data-parity-raster="brandIcon"]',
          closeIcon: '[data-parity-raster="closeIcon"]',
          headerAction: '[data-parity-raster="headerAction"]',
          headerCopy: '[data-parity-raster="headerCopy"]',
          headerIcon: '[data-parity-raster="headerIcon"]',
          mainHeading: '[data-parity-raster="mainHeading"]',
          metricCopy0: '[data-parity-raster="metricCopy0"]',
          metricCopy1: '[data-parity-raster="metricCopy1"]',
          metricCopy2: '[data-parity-raster="metricCopy2"]',
          navigationIcon0: '[data-parity-raster="navigationIcon0"]',
          navigationIcon1: '[data-parity-raster="navigationIcon1"]',
          navigationIcon2: '[data-parity-raster="navigationIcon2"]',
          navigationIcon3: '[data-parity-raster="navigationIcon3"]',
          navigationLabel0: '[data-parity-raster="navigationLabel0"]',
          navigationLabel1: '[data-parity-raster="navigationLabel1"]',
          navigationLabel2: '[data-parity-raster="navigationLabel2"]',
          navigationLabel3: '[data-parity-raster="navigationLabel3"]',
          profileCopy: '[data-parity-raster="profileCopy"]',
          sidebarBrand: '[data-parity-raster="sidebarBrand"]',
          statusCopy: '[data-parity-raster="statusCopy"]',
          toggleIcon: '[data-parity-raster="toggleIcon"]',
        }
      : args['open'] === true
        ? component === 'menu'
          ? { openTriggerLabel: '[data-parity-part="triggerLabel"]' }
          : component === 'select'
            ? { openTriggerLabel: '.tr-select-value' }
            : {}
        : {};
  return page.evaluate(
    ({ rasterOnlySelectors, selectedComponent, selectors }) => {
      const target = document.querySelector<HTMLElement>('[data-parity-target] > *');
      if (target === null) throw new Error('React parity target is missing.');
      const openLayerSelector = (
        {
          'alert-dialog': '.tr-alert-dialog-popup[data-open]',
          autocomplete: '.tr-autocomplete-popup[data-open]',
          combobox: '.tr-combobox-content[data-open]',
          'context-menu': '.tr-context-menu-popup[data-open]',
          dialog: '.tr-dialog-box[data-open]',
          drawer: '.tr-drawer-popup[data-open]',
          menu: '.tr-menu-content[data-open]',
          'navigation-menu': '.tr-navigation-menu-popup[data-open]',
          popover: '.tr-popover-popup[data-open]',
          'preview-card': '.tr-preview-card-popup[data-open]',
          select: '.tr-select-popup[data-open]',
          toast: '.tr-toast:not([data-ending-style]):last-of-type',
          tooltip: '.tr-tooltip-content[data-open]',
        } as Partial<Record<VisualParityScenario['component'], string>>
      )[selectedComponent];
      const openLayer =
        openLayerSelector === undefined
          ? null
          : document.querySelector<HTMLElement>(openLayerSelector);
      const closedGeometrySelector = (
        {
          'alert-dialog': '.tr-alert-dialog-trigger',
          'app-shell': '.tr-app-shell',
          autocomplete: '.tr-field',
          combobox: '.tr-field',
          'context-menu': '.tr-context-menu-trigger',
          drawer: '.tr-drawer-trigger',
          'file-tree': '.tr-file-tree',
          form: '.tr-form',
          menubar: '.tr-menubar',
          'navigation-menu': '.tr-navigation-menu',
          'number-field': '.tr-field',
          'otp-field': '.tr-field',
          popover: '.tr-popover-trigger',
          'preview-card': '.tr-preview-card-trigger',
          'scroll-area': '.tr-scroll-area',
          slider: '.tr-slider',
          toast: '.tr-button',
          toolbar: '.tr-toolbar',
          tooltip: '.tr-tooltip',
          'tree-nav': '.tr-tree-nav',
        } as Partial<Record<VisualParityScenario['component'], string>>
      )[selectedComponent];
      const closedGeometryTarget =
        closedGeometrySelector === undefined
          ? null
          : document.querySelector<HTMLElement>(closedGeometrySelector);
      const geometryTarget =
        openLayer ??
        closedGeometryTarget ??
        (selectedComponent === 'text' ? target.parentElement : target);
      if (geometryTarget === null) {
        throw new Error('React parity geometry target is missing.');
      }
      const toBounds = (element: Element): Bounds => {
        const bounds = element.getBoundingClientRect();
        return {
          height: bounds.height,
          width: bounds.width,
          x: bounds.x,
          y: bounds.y,
        };
      };
      const parts: Record<string, Bounds> = {};
      const partText: Record<string, string | null> = {};
      for (const [name, selector] of Object.entries(selectors)) {
        const element = geometryTarget.matches(selector)
          ? geometryTarget
          : (geometryTarget.querySelector(selector) ??
            document.querySelector(selector));
        if (element === null) continue;
        parts[name] = toBounds(element);
        partText[name] = element.textContent;
      }
      const rasterOnlyParts: Record<string, Bounds> = {};
      for (const [name, selector] of Object.entries(rasterOnlySelectors)) {
        const element = document.querySelector(selector);
        if (element !== null) rasterOnlyParts[name] = toBounds(element);
      }
      const bounds = toBounds(geometryTarget);
      let baseline: number | null = null;
      if (selectedComponent === 'text') {
        const marker = document.createElement('span');
        marker.style.cssText =
          'display:inline-block;height:0;margin:0;padding:0;width:0';
        target.append(marker);
        baseline = marker.getBoundingClientRect().top - bounds.y;
        marker.remove();
      }
      const style = getComputedStyle(target);
      return {
        baseline,
        bounds,
        parts,
        partText,
        rasterOnlyParts,
        typography: {
          fontFamily: style.fontFamily,
          fontSize: style.fontSize,
          fontWeight: style.fontWeight,
          letterSpacing: style.letterSpacing,
          lineHeight: style.lineHeight,
        },
      };
    },
    {
      rasterOnlySelectors,
      selectedComponent: component,
      selectors,
    },
  );
}

async function image(
  page: Page,
  bounds: Bounds,
  dimensions: { height: number; width: number },
) {
  const margin = 16;
  return profiler.measure('screenshot', async () => {
    const clip = {
      height: dimensions.height + margin * 2,
      scale: 1,
      width: dimensions.width + margin * 2,
      x: bounds.x - margin,
      y: bounds.y - margin,
    };
    const session = screenshotSessions.get(page);
    if (session === undefined) {
      return page.screenshot({
        clip: {
          height: clip.height,
          width: clip.width,
          x: clip.x,
          y: clip.y,
        },
        type: 'png',
      });
    }
    let screenshotTimeout: NodeJS.Timeout | undefined;
    try {
      const result = (await Promise.race([
        session.send('Page.captureScreenshot', {
          captureBeyondViewport: false,
          clip,
          format: 'png',
          fromSurface: true,
        }),
        new Promise<never>((_, reject) => {
          screenshotTimeout = setTimeout(
            () => reject(new Error('CDP screenshot timed out after 5 seconds.')),
            5_000,
          );
          screenshotTimeout.unref();
        }),
      ])) as { data: string };
      return Buffer.from(result.data, 'base64');
    } catch {
      screenshotSessions.delete(page);
      return page.screenshot({
        clip: {
          height: clip.height,
          width: clip.width,
          x: clip.x,
          y: clip.y,
        },
        type: 'png',
      });
    } finally {
      if (screenshotTimeout !== undefined) clearTimeout(screenshotTimeout);
    }
  });
}

async function applyInteraction(
  page: Page,
  bounds: Bounds,
  state: VisualParityScenario['state'],
  target?: { x: number; y: number },
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
    await page.mouse.move(
      target?.x ?? bounds.x + bounds.width / 2,
      target?.y ?? bounds.y + bounds.height / 2,
    );
  }
  if (state === 'pressed' || state === 'release-hover') await page.mouse.down();
  if (state === 'pointer-focused') {
    await page.mouse.down();
    await page.mouse.up();
  }
  if (state === 'keyboard-pressed') await page.keyboard.down('Space');
  if (state === 'release-hover') {
    await page.mouse.up();
  }
  return async () => {
    if (state === 'pressed') await page.mouse.up();
    if (state === 'keyboard-pressed') await page.keyboard.up('Space');
  };
}

async function createParityPages(
  browser: Browser,
  origin: string,
  motion = false,
  initial: {
    component: VisualParityScenario['component'];
    locale: string;
    theme: string;
  } = { component: 'button', locale: 'en', theme: 'light' },
): Promise<ParityPages> {
  const contextOptions = {
    deviceScaleFactor: 1,
    // The copy button writes through the async clipboard API; without the
    // permission headless Chromium rejects it and React falls back to the
    // "unavailable" label.
    permissions: ['clipboard-read', 'clipboard-write'],
    reducedMotion: motion ? ('no-preference' as const) : ('reduce' as const),
    viewport: { height: 320, width: 480 },
  };
  const [reactContext, flutterContext] = await Promise.all([
    browser.newContext(contextOptions),
    browser.newContext(contextOptions),
  ]);
  const [reactPage, flutterPage] = await Promise.all([
    reactContext.newPage(),
    flutterContext.newPage(),
  ]);
  const [reactScreenshotSession, flutterScreenshotSession] = await Promise.all([
    reactContext.newCDPSession(reactPage),
    flutterContext.newCDPSession(flutterPage),
  ]);
  screenshotSessions.set(reactPage, reactScreenshotSession);
  screenshotSessions.set(flutterPage, flutterScreenshotSession);
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
      component: initial.component,
      locale: initial.locale,
      theme: initial.theme,
      ...(motion ? { motion: 'true' } : {}),
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
    `${origin}/flutter-preview/index.html?component=${initial.component}&locale=${initial.locale}&theme=${initial.theme}&parity=true${motion ? '&motion=true' : ''}`,
  );
  if (motion) await flutterPage.clock.runFor(1_000);
  await flutterNavigation;
  if (motion) await flutterPage.clock.runFor(1_000);
  await waitForTrue(
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
    60_000,
  );
  await flutterPage.waitForLoadState('networkidle');
  await preparePage(flutterPage, motion);
  const initialFrames = flutterPage.evaluate(async () => {
    for (let frame = 0; frame < 5; frame += 1) {
      await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
    }
  });
  if (motion) await flutterPage.clock.runFor(100);
  await initialFrames;
  return {
    component: initial.component,
    flutterContext,
    flutterPage,
    generation: 0,
    locale: initial.locale,
    motion,
    reactContext,
    reactPage,
    theme: initial.theme,
  };
}

async function closeParityPages(pages: ParityPages) {
  await Promise.allSettled([pages.reactContext.close(), pages.flutterContext.close()]);
}

async function configureParityPages(
  pages: ParityPages,
  component: VisualParityScenario['component'],
  locale: string,
  theme: string,
) {
  const { flutterPage, reactPage } = pages;
  const requestId = ++parityRequestId;
  const query = new URLSearchParams({
    component,
    locale,
    theme,
    ...(pages.motion ? { motion: 'true' } : {}),
  });
  if (
    pages.component === component &&
    pages.locale === locale &&
    pages.theme === theme
  ) {
    await reactPage.evaluate((search) => {
      (
        window as Window & {
          __setParityQuery?: (nextSearch: string) => void;
        }
      ).__setParityQuery?.(search);
    }, query.toString());
    return;
  }
  if (pages.component === component) {
    const requestId = ++parityRequestId;
    await Promise.all([
      reactPage.evaluate((search) => {
        (
          window as Window & {
            __setParityQuery?: (nextSearch: string) => void;
          }
        ).__setParityQuery?.(search);
      }, query.toString()),
      flutterPage.evaluate(
        ({ id, selectedChannel, selectedComponent, selectedLocale, selectedTheme }) => {
          const messages = (window as Window & { __parityMessages?: unknown[] })
            .__parityMessages;
          if (messages !== undefined) messages.length = 0;
          window.postMessage(
            {
              channel: selectedChannel,
              component: selectedComponent,
              payload: { locale: selectedLocale, theme: selectedTheme },
              requestId: id,
              type: 'configureEnvironment',
            },
            location.origin,
          );
        },
        {
          id: requestId,
          selectedChannel: channel,
          selectedComponent: component,
          selectedLocale: locale,
          selectedTheme: theme,
        },
      ),
    ]);
    await waitForTrue(
      () =>
        flutterPage.evaluate(
          ({ expectedLocale, expectedTheme, id }) =>
            (
              (window as Window & { __parityMessages?: unknown[] }).__parityMessages ??
              []
            ).some(
              (message) =>
                typeof message === 'object' &&
                message !== null &&
                (message as { type?: string }).type === 'environmentConfigured' &&
                (
                  message as {
                    payload?: {
                      locale?: string;
                      requestId?: number;
                      theme?: string;
                    };
                  }
                ).payload?.requestId === id &&
                (
                  message as {
                    payload?: { locale?: string; theme?: string };
                  }
                ).payload?.locale === expectedLocale &&
                (message as { payload?: { theme?: string } }).payload?.theme ===
                  expectedTheme,
            ),
          { expectedLocale: locale, expectedTheme: theme, id: requestId },
        ),
      60_000,
    );
    pages.locale = locale;
    pages.theme = theme;
    await renderFlutterScenario(flutterPage, component, {}, theme);
    await flutterPage.waitForLoadState('networkidle');
    if (!pages.motion) {
      await flutterPage.evaluate(
        () =>
          new Promise<void>((resolve) =>
            requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
          ),
      );
    }
    return;
  }
  await Promise.all([
    reactPage.evaluate((search) => {
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
      (
        window as Window & {
          __setParityQuery?: (nextSearch: string) => void;
        }
      ).__setParityQuery?.(search);
    }, query.toString()),
    flutterPage.evaluate(
      ({ selectedChannel, selectedComponent, selectedLocale, selectedTheme, id }) => {
        const messages = (window as Window & { __parityMessages?: unknown[] })
          .__parityMessages;
        if (messages !== undefined) messages.length = 0;
        window.postMessage(
          {
            channel: selectedChannel,
            component: selectedComponent,
            payload: {
              component: selectedComponent,
              locale: selectedLocale,
              theme: selectedTheme,
            },
            requestId: id,
            type: 'configureParity',
          },
          location.origin,
        );
      },
      {
        id: requestId,
        selectedChannel: channel,
        selectedComponent: component,
        selectedLocale: locale,
        selectedTheme: theme,
      },
    ),
  ]);
  await waitForTrue(
    () =>
      flutterPage.evaluate(
        ({ expectedComponent, id }) =>
          (
            (window as Window & { __parityMessages?: unknown[] }).__parityMessages ?? []
          ).some((message) => {
            if (
              typeof message !== 'object' ||
              message === null ||
              (message as { component?: string }).component !== expectedComponent ||
              (message as { type?: string }).type !== 'configured'
            ) {
              return false;
            }
            return (
              (
                message as {
                  payload?: { generation?: number; requestId?: number };
                }
              ).payload?.requestId === id
            );
          }),
        { expectedComponent: component, id: requestId },
      ),
    60_000,
  );
  const generation = await flutterPage.evaluate(
    ({ id }) => {
      const message = [
        ...((window as Window & { __parityMessages?: unknown[] }).__parityMessages ??
          []),
      ]
        .reverse()
        .find(
          (candidate) =>
            typeof candidate === 'object' &&
            candidate !== null &&
            (candidate as { type?: string }).type === 'configured' &&
            (candidate as { payload?: { requestId?: number } }).payload?.requestId ===
              id,
        ) as { payload?: { generation?: number } } | undefined;
      return message?.payload?.generation;
    },
    { id: requestId },
  );
  if (generation === undefined) throw new Error('Missing parity generation.');
  pages.generation = generation;
  pages.component = component;
  pages.locale = locale;
  pages.theme = theme;

  const frames = Promise.all([
    reactPage.evaluate(
      () =>
        new Promise<void>((resolve) =>
          requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
        ),
    ),
    flutterPage.evaluate(
      () =>
        new Promise<void>((resolve) =>
          requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
        ),
    ),
  ]);
  if (pages.motion) {
    await Promise.all([
      reactPage.clock.runFor(32),
      flutterPage.clock.runFor(3_200),
      frames,
    ]);
  } else {
    await frames;
  }
}

async function compareScenario(
  pages: ParityPages,
  scenario: VisualParityScenario,
  locale: string,
  theme: string,
) {
  const { flutterPage, reactPage } = pages;
  const viewport =
    scenario.component === 'app-shell' && scenario.args['breakpoint'] === 'sm'
      ? { height: 400, width: 768 }
      : { height: 320, width: 480 };
  await Promise.all([
    reactPage.setViewportSize(viewport),
    flutterPage.setViewportSize(viewport),
  ]);
  const query = queryFor(scenario, locale, theme);

  await Promise.all([reactPage.mouse.move(1, 1), flutterPage.mouse.move(1, 1)]);
  const [, metrics] = await Promise.all([
    reactPage.evaluate((search) => {
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
    }, query.toString()),
    renderFlutterScenario(flutterPage, scenario.component, scenario.args, theme),
  ]);
  const reactTarget = reactPage.locator('[data-parity-target] > *');
  const reactRest = await reactSnapshot(reactPage, scenario.component, scenario.args);
  const reactBox = reactRest.bounds;
  const reactTypography = reactRest.typography;
  const reactRestParts = reactRest.parts;
  const flutterPartBounds = Object.fromEntries(
    Object.entries(metrics.parts).map(([name, part]) => [name, part.bounds]),
  );
  const [releaseReact, releaseFlutter] = await Promise.all([
    applyInteraction(
      reactPage,
      reactBox,
      scenario.state,
      interactionPoint(scenario, reactBox, reactRestParts),
    ),
    applyInteraction(
      flutterPage,
      metrics.bounds,
      scenario.state,
      interactionPoint(scenario, metrics.bounds, flutterPartBounds),
    ),
  ]);
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
        await waitForTrue(async () => {
          if (await hasPseudoClass(pseudoClass)) return true;
          await reactPage.keyboard.press('Tab');
          return hasPseudoClass(pseudoClass);
        }, 2_000);
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
    // Anchors have no native disabled state; they disable via aria-disabled.
    expect(
      (await disabledTarget.isDisabled()) ||
        (await disabledTarget.getAttribute('aria-disabled')) === 'true',
    ).toBe(true);
  } else if (scenario.state === 'loading' || scenario.state === 'loading-hover') {
    expect(await reactTarget.isDisabled()).toBe(true);
    expect(await reactTarget.getAttribute('aria-busy')).toBe('true');
  }

  const stableWithoutInteraction =
    scenario.state === undefined || scenario.state === 'default';
  const [reactState, initialStateMetrics] = stableWithoutInteraction
    ? [reactRest, metrics]
    : await Promise.all([
        reactSnapshot(reactPage, scenario.component, scenario.args),
        measureFlutter(flutterPage, scenario.component),
      ]);
  const reactStateBox = reactState.bounds;
  const reactParts = reactState.parts;
  const reactPartText = reactState.partText;
  let stateMetrics = initialStateMetrics;
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
  const openLayerOwnsFocus =
    scenario.args['open'] === true &&
    new Set<VisualParityScenario['component']>([
      'autocomplete',
      'combobox',
      'menu',
      'navigation-menu',
      'popover',
      'preview-card',
      'select',
    ]).has(scenario.component);
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
  // Under load the measure round-trip can overtake the CDP pointer event;
  // re-measure until the pointer state has landed.
  for (
    let attempt = 0;
    (stateMetrics.interaction.hovered !== pointerOver ||
      stateMetrics.interaction.pressed !== (scenario.state === 'pressed')) &&
    attempt < 5;
    attempt += 1
  ) {
    await new Promise((resolve) => setTimeout(resolve, 50));
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
    focusVisible: focused || openLayerOwnsFocus,
    focused: focused || openLayerOwnsFocus,
    hovered: pointerOver,
    invalid: scenario.args['errorText'] !== undefined,
    loading: scenario.args['loading'] === true,
    pressed: scenario.state === 'pressed',
    readonly: scenario.args['readOnly'] === true,
  });
  const interactionAnchor =
    scenario.component === 'button' || scenario.component === 'copy-button'
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
    const flutterText = stateMetrics.parts[name]?.text;
    const reactText = reactPartText[name];
    const verifiesDisplayedText =
      !name.toLowerCase().endsWith('indicator') && !name.toLowerCase().endsWith('icon');
    if (
      verifiesDisplayedText &&
      reactText !== null &&
      reactText !== undefined &&
      flutterText != null
    ) {
      expect(flutterText, `${scenario.id} ${locale}/${theme} ${name}.text`).toBe(
        reactText,
      );
    }
    if (
      name === 'label' &&
      (scenario.component === 'button' ||
        scenario.component === 'badge' ||
        scenario.component === 'copy-button')
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
        `${scenario.id} ${locale}/${theme} ${name}.${axis} (React ${reactOffset}, Flutter ${flutterOffset})`,
      ).toBeLessThan(1);
    }
    if (scenario.component === 'app-shell') {
      for (const size of ['width', 'height'] as const) {
        expect(
          Math.abs(reactPart[size] - flutterPart[size]),
          `${scenario.id} ${locale}/${theme} ${name}.${size} (React ${reactPart[size]}, Flutter ${flutterPart[size]})`,
        ).toBeLessThan(1);
      }
    }
  }
  if (scenario.component === 'text') {
    expect(
      Math.abs(
        (reactState.baseline ?? Number.NaN) - (stateMetrics.baseline ?? Number.NaN),
      ),
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
  const [reactRaw, flutterRaw] = await profiler.measure('decode', () =>
    Promise.all([reactImage.raw().toBuffer(), flutterImage.raw().toBuffer()]),
  );
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
        : scenario.component === 'collapsible' || scenario.component === 'accordion'
          ? [
              // Trigger copy, chevrons, and panel copy carry glyphs and
              // stroke-drawn shapes; the outer border, radius, and row
              // separators near the edges stay strict.
              {
                bottom: 16 + normalizedDimensions.height - 4,
                left: 16 + 10,
                right: 16 + normalizedDimensions.width - 10,
                top: 16 + 4,
              },
            ]
          : scenario.component === 'animated-number'
            ? [
                {
                  bottom: 16 + normalizedDimensions.height + 1,
                  left: 15,
                  right: 16 + normalizedDimensions.width + 1,
                  top: 15,
                },
              ]
            : scenario.component === 'copy-button'
              ? [
                  // The label glyphs are excluded; the button border, fill,
                  // and radius stay strict.
                  {
                    bottom: 16 + normalizedDimensions.height - 6,
                    left: 16 + 6,
                    right: 16 + normalizedDimensions.width - 6,
                    top: 16 + 6,
                  },
                ]
              : scenario.component === 'textarea'
                ? [
                    // Chromium paints a native resize grip in the corner that the
                    // Flutter control does not reproduce.
                    {
                      bottom: 16 + normalizedDimensions.height - 1,
                      left: 16 + normalizedDimensions.width - 14,
                      right: 16 + normalizedDimensions.width - 1,
                      top: 16 + normalizedDimensions.height - 14,
                    },
                    ...(scenario.args['value'] !== undefined ||
                    scenario.args['placeholder'] !== undefined
                      ? [
                          // Only the text rows carry glyphs; the border, fill, and
                          // focus ring stay strict.
                          {
                            bottom: 16 + normalizedDimensions.height - 8,
                            left: 16 + 8,
                            right: 16 + normalizedDimensions.width - 8,
                            top: 16 + 8,
                          },
                        ]
                      : []),
                  ]
                : scenario.component === 'tabs'
                  ? [
                      // Tab labels and panel copy carry glyphs; the indicator and
                      // the list divider stay strict.
                      {
                        bottom:
                          13 +
                          (scenario.args['uiSize'] === 'sm'
                            ? 32
                            : scenario.args['uiSize'] === 'lg'
                              ? 48
                              : 40),
                        left: 15,
                        right: 16 + normalizedDimensions.width + 1,
                        top: 15,
                      },
                      {
                        bottom: 16 + normalizedDimensions.height + 1,
                        left: 15,
                        right: 16 + normalizedDimensions.width + 1,
                        top:
                          18 +
                          (scenario.args['uiSize'] === 'sm'
                            ? 32
                            : scenario.args['uiSize'] === 'lg'
                              ? 48
                              : 40),
                      },
                    ]
                  : scenario.component === 'checkbox' &&
                      scenario.args['mark'] !== 'unchecked'
                    ? [
                        // The check and dash indicators are glyphs; the box border and
                        // fill stay strict.
                        {
                          bottom: 16 + normalizedDimensions.height - 3,
                          left: 16 + 3,
                          right: 16 + normalizedDimensions.width - 3,
                          top: 16 + 3,
                        },
                      ]
                    : scenario.component === 'breadcrumbs'
                      ? [
                          // A trail of plain text; geometry and layout stay strict while
                          // glyph rasterization is excluded like the text component.
                          {
                            bottom: 16 + normalizedDimensions.height + 1,
                            left: 15,
                            right: 16 + normalizedDimensions.width + 1,
                            top: 15,
                          },
                        ]
                      : scenario.component === 'steps'
                        ? [
                            // Exclude the step copy column; the numbered markers and the
                            // connecting rail stay strict.
                            {
                              bottom: 16 + normalizedDimensions.height + 1,
                              left: 16 + 30,
                              right: 16 + normalizedDimensions.width + 1,
                              top: 15,
                            },
                          ]
                        : scenario.component === 'fieldset'
                          ? [
                              // Exclude the legend and body copy; the border, radius,
                              // and disabled fade stay strict.
                              {
                                bottom: 16 + normalizedDimensions.height - 10,
                                left: 16 + 10,
                                right: 16 + normalizedDimensions.width - 10,
                                top: 16 + 10,
                              },
                            ]
                          : scenario.component === 'field'
                            ? [
                                // Label, control text, and helper rows carry glyphs; the
                                // control border and fill stay strict.
                                { bottom: 29, left: 16, right: 352, top: 15 },
                                { bottom: 64, left: 24, right: 344, top: 44 },
                                { bottom: 104, left: 16, right: 352, top: 78 },
                              ]
                            : scenario.component === 'meter'
                              ? [
                                  // The label and value rows carry glyphs; the track and
                                  // indicator stay strict.
                                  {
                                    bottom: 16 + normalizedDimensions.height - 16,
                                    left: 15,
                                    right: 16 + normalizedDimensions.width + 1,
                                    top: 15,
                                  },
                                ]
                              : scenario.component === 'code'
                                ? [
                                    // Exclude only the glyph run; the chip border, fill,
                                    // and radius stay strict.
                                    {
                                      bottom: 16 + normalizedDimensions.height - 2,
                                      left: 16 + 5,
                                      right: 16 + normalizedDimensions.width - 5,
                                      top: 16 + 2,
                                    },
                                  ]
                                : scenario.component === 'code-block'
                                  ? [
                                      // Exclude only the code text inside the 12/16px padding;
                                      // the block border, fill, and radius stay strict.
                                      {
                                        bottom: 16 + normalizedDimensions.height - 10,
                                        left: 16 + 10,
                                        right: 16 + normalizedDimensions.width - 10,
                                        top: 16 + 10,
                                      },
                                    ]
                                  : scenario.component === 'navigation-menu' &&
                                      scenario.args['open'] !== true
                                    ? [
                                        {
                                          bottom: 16 + 34,
                                          left: 16 + 30,
                                          right: 16 + 122,
                                          top: 16 + 10,
                                        },
                                        {
                                          bottom: 16 + 34,
                                          left: 16 + 158,
                                          right: 16 + 261,
                                          top: 16 + 10,
                                        },
                                      ]
                                    : scenario.component === 'context-menu'
                                      ? [
                                          {
                                            bottom: 16 + 72,
                                            left: 16 + 20,
                                            right: 16 + normalizedDimensions.width - 20,
                                            top: 16 + 48,
                                          },
                                        ]
                                      : scenario.component === 'file-tree'
                                        ? [
                                            {
                                              bottom: 16 + 35,
                                              left: 16 + 14,
                                              right: 16 + 90,
                                              top: 16 + 15,
                                            },
                                            {
                                              bottom: 16 + 57,
                                              left: 16 + 30,
                                              right: 16 + 150,
                                              top: 16 + 35,
                                            },
                                            {
                                              bottom: 16 + 79,
                                              left: 16 + 30,
                                              right: 16 + 150,
                                              top: 16 + 57,
                                            },
                                            {
                                              bottom: 16 + 101,
                                              left: 16 + 24,
                                              right: 16 + 150,
                                              top: 16 + 79,
                                            },
                                          ]
                                        : scenario.component === 'toolbar'
                                          ? [
                                              {
                                                bottom: 16 + 39,
                                                left: 16 + 8,
                                                right: 16 + 34,
                                                top: 16 + 11,
                                              },
                                              {
                                                bottom: 16 + 39,
                                                left: 16 + 44,
                                                right: 16 + 70,
                                                top: 16 + 11,
                                              },
                                              {
                                                bottom: 16 + 36,
                                                left: 16 + 98,
                                                right: 16 + 154,
                                                top: 16 + 14,
                                              },
                                            ]
                                          : Object.entries(reactParts).flatMap(
                                              ([name, reactPart]) => {
                                                const flutterPart =
                                                  stateMetrics.parts[name]?.bounds;
                                                if (flutterPart === undefined)
                                                  return [];
                                                const reactLeft =
                                                  reactPart.x - reactStateBox.x + 16;
                                                const reactTop =
                                                  reactPart.y - reactStateBox.y + 16;
                                                const flutterLeft =
                                                  flutterPart.x -
                                                  flutterStateBox.x +
                                                  16;
                                                const flutterTop =
                                                  flutterPart.y -
                                                  flutterStateBox.y +
                                                  16;
                                                return [
                                                  {
                                                    bottom:
                                                      Math.max(
                                                        reactTop + reactPart.height,
                                                        flutterTop + flutterPart.height,
                                                      ) + 1,
                                                    left:
                                                      Math.min(reactLeft, flutterLeft) -
                                                      1,
                                                    right:
                                                      Math.max(
                                                        reactLeft + reactPart.width,
                                                        flutterLeft + flutterPart.width,
                                                      ) + 1,
                                                    top:
                                                      Math.min(reactTop, flutterTop) -
                                                      1,
                                                  },
                                                ];
                                              },
                                            );
  if (scenario.component === 'app-shell') rasterRects.length = 0;
  for (const reactPart of Object.values(reactState.rasterOnlyParts)) {
    const left = reactPart.x - reactStateBox.x + 16;
    const top = reactPart.y - reactStateBox.y + 16;
    rasterRects.push({
      bottom: top + reactPart.height + 1,
      left: left - 1,
      right: left + reactPart.width + 1,
      top: top - 1,
    });
  }
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
  } = await compareImages(reactRaw, flutterRaw, imageWidth, imageHeight, {
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
  const verifiesActivation =
    scenario.state === 'release-hover' ||
    scenario.state === 'pressed' ||
    scenario.state === 'keyboard-pressed' ||
    scenario.state === 'focus-visible';
  if (
    (scenario.component === 'button' || scenario.component === 'icon-button') &&
    verifiesActivation
  ) {
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
    waitForTrue(
      () =>
        flutterPage.evaluate(() =>
          (
            (window as Window & { __parityMessages?: unknown[] }).__parityMessages ?? []
          ).some(
            (message) =>
              typeof message === 'object' &&
              message !== null &&
              (message as { type?: string }).type === 'stateChanged',
          ),
        ),
      60_000,
    ),
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
    const [reactImage, flutterImage] = await profiler.measure('decode', () =>
      Promise.all([
        sharp(reactPng).ensureAlpha().raw().toBuffer({ resolveWithObject: true }),
        sharp(flutterPng).ensureAlpha().raw().toBuffer({ resolveWithObject: true }),
      ]),
    );
    const reactPartsAtTime = (
      await reactSnapshot(reactPage, scenario.component, scenario.args)
    ).parts;
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
    const result = await compareImages(
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
  let pagesPool: VisualParityPool<ParityPages, ParitySessionKey>;
  const isolatedSessions =
    process.env['TINYRACK_VISUAL_PARITY_SESSION_MODE'] === 'isolated';

  beforeAll(async () => {
    await runtime.start();
    browser = runtime.browser;
    origin = runtime.origin;
    imagePool = new VisualParityImagePool(resolveVisualParityComparisonWorkers());
    pagesPool = new VisualParityPool({
      create: (key: ParitySessionKey) =>
        profiler.measure('boot', () => createParityPages(browser, origin, motion, key)),
      destroy: closeParityPages,
      maximumSize: resolveVisualParityConcurrency(),
    });
  });

  afterAll(async () => {
    await pagesPool.close();
    await imagePool?.close();
    imagePool = undefined;
    if (process.env['TINYRACK_VISUAL_PARITY_PROFILE'] === '1') {
      const mode = motion ? 'motion' : full ? 'endpoint' : quick ? 'quick' : 'smoke';
      const report = await profiler.write(join(artifactRoot, `profile-${mode}.json`), {
        comparisonWorkers: resolveVisualParityComparisonWorkers(),
        mode,
        sessionMode: isolatedSessions ? 'isolated' : 'persistent',
        sessions: resolveVisualParityConcurrency(),
      });
      console.info(`Visual parity profile: ${JSON.stringify(report)}`);
    }
    await runtime.stop();
  });

  async function acquirePages(
    component: VisualParityScenario['component'],
    locale: string,
    theme: string,
  ) {
    const pages = isolatedSessions
      ? await createParityPages(browser, origin, motion, {
          component,
          locale,
          theme,
        })
      : await pagesPool.acquire({ component, locale, theme });
    try {
      await Promise.allSettled([
        pages.reactPage.mouse.up(),
        pages.flutterPage.mouse.up(),
        pages.reactPage.keyboard.up('Space'),
        pages.flutterPage.keyboard.up('Space'),
      ]);
      if (!isolatedSessions) {
        await profiler.measure('configure', () =>
          configureParityPages(pages, component, locale, theme),
        );
      }
      return pages;
    } catch (error) {
      if (isolatedSessions) await closeParityPages(pages);
      else await pagesPool.release(pages, { discard: true });
      throw error;
    }
  }

  async function releasePages(pages: ParityPages) {
    const cleanup = await Promise.allSettled([
      pages.reactPage.mouse.up(),
      pages.flutterPage.mouse.up(),
      pages.reactPage.keyboard.up('Space'),
      pages.flutterPage.keyboard.up('Space'),
    ]);
    const discard =
      pages.reactPage.isClosed() ||
      pages.flutterPage.isClosed() ||
      cleanup.some((result) => result.status === 'rejected');
    if (isolatedSessions) await closeParityPages(pages);
    else await pagesPool.release(pages, { discard });
  }

  const scenarioFilter = process.env['TINYRACK_VISUAL_PARITY_SCENARIO'];
  const scenarioFilters = new Set(scenarioFilter?.split(','));
  const componentFilter = process.env['TINYRACK_VISUAL_PARITY_COMPONENT'];
  const componentFilters = new Set(componentFilter?.split(','));
  const localeFilter = process.env['TINYRACK_VISUAL_PARITY_LOCALE'];
  const localeFilters = new Set(localeFilter?.split(','));
  const themeFilter = process.env['TINYRACK_VISUAL_PARITY_THEME'];
  const themeFilters = new Set(themeFilter?.split(','));
  const scenarios = (
    motion ? [] : full ? visualParityScenarios : representativeParityScenarios
  ).filter(
    (scenario) => scenarioFilter === undefined || scenarioFilters.has(scenario.id),
  );
  const environments = quick
    ? [{ locale: 'en' as const, theme: 'light' as const }]
    : parityLocales
        .flatMap((locale) => parityThemes.map((theme) => ({ locale, theme })))
        .filter(
          ({ locale, theme }) =>
            (localeFilter === undefined || localeFilters.has(locale)) &&
            (themeFilter === undefined || themeFilters.has(theme)),
        );
  const endpointShardSize = full ? 16 : Number.MAX_SAFE_INTEGER;
  const groups = environments
    .flatMap(({ locale, theme }) =>
      parityComponents.flatMap((component) => {
        const componentScenarios = scenarios.filter(
          (scenario) => scenario.component === component,
        );
        const shards = partitionVisualParityWork(componentScenarios, endpointShardSize);
        return shards.map((shardScenarios, shardIndex) => ({
          component,
          locale,
          scenarios: shardScenarios,
          shard: shardIndex + 1,
          shards: shards.length,
          theme,
        }));
      }),
    )
    .filter(
      (group) =>
        group.scenarios.length > 0 &&
        (componentFilter === undefined || componentFilters.has(group.component)),
    )
    .sort(
      (left, right) =>
        left.component.localeCompare(right.component) ||
        left.shard - right.shard ||
        Number(left.theme === 'dark') - Number(right.theme === 'dark') ||
        left.locale.localeCompare(right.locale),
    );

  it.concurrent.each(groups)(
    '$component scenarios [$shard/$shards] match in $locale/$theme',
    async ({ component, locale, scenarios: componentScenarios, theme }) => {
      const pages = await acquirePages(component, locale, theme);
      const failures: string[] = [];
      try {
        for (const scenario of componentScenarios) {
          try {
            await profiler.measure('scenario', () =>
              compareScenario(pages, scenario, locale, theme),
            );
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
        await releasePages(pages);
      }
      expect(failures, `${component} ${locale}/${theme}`).toEqual([]);
    },
    full ? 300_000 : 30_000,
  );

  const selectedMotionScenarios =
    scenarioFilter === undefined
      ? defaultMotionParityScenarios
      : motionParityScenarios.filter((scenario) => scenarioFilters.has(scenario.id));
  const motionGroups = motion
    ? parityThemes.flatMap((theme) =>
        (['button', 'icon-button', 'text-field'] as const)
          .flatMap((component) => {
            const componentScenarios = selectedMotionScenarios.filter(
              (scenario) => scenario.component === component,
            );
            const shards = partitionVisualParityWork(componentScenarios, 1);
            return shards.map((shardScenarios, shardIndex) => ({
              component,
              scenarios: shardScenarios,
              shard: shardIndex + 1,
              shards: shards.length,
              theme,
            }));
          })
          .filter(
            (group) =>
              group.scenarios.length > 0 &&
              (componentFilter === undefined || componentFilters.has(group.component)),
          )
          .sort(
            (left, right) =>
              left.component.localeCompare(right.component) ||
              left.shard - right.shard ||
              Number(left.theme === 'dark') - Number(right.theme === 'dark'),
          ),
      )
    : [];

  it.concurrent.each(
    motionGroups,
  )('$component motion [$shard/$shards] matches in $theme', async ({
    component,
    scenarios: componentScenarios,
    theme,
  }) => {
    const pages = await acquirePages(component, 'en', theme);
    try {
      for (const scenario of componentScenarios) {
        await profiler.measure('motionScenario', () =>
          compareMotionScenario(pages, scenario, theme),
        );
      }
    } finally {
      await releasePages(pages);
    }
  }, 2_700_000);
});
