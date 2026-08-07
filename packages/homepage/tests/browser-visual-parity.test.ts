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
import type { FlutterForcedState } from './visual-parity-conditions.ts';
import {
  conditionFor,
  forcedPseudosFor,
  forceTargetSelector,
  isRestCondition,
} from './visual-parity-conditions.ts';
import {
  applyWebCondition,
  clearForcedStates,
  resetForcedStates,
  setFocusModality,
} from './visual-parity-force.ts';

/** States already migrated off driven input. */
import { type ComparisonOptions, compareParityImages } from './visual-parity-image.ts';
import { VisualParityImagePool } from './visual-parity-image-pool.ts';
import { parityMaskBudgets } from './visual-parity-mask-budgets.ts';
import {
  defaultMotionParityScenarios,
  type MotionParityScenario,
  motionParityScenarios,
  motionSampleTimes,
  parityComponents,
  parityLocales,
  parityThemes,
  representativeParityScenarios,
  type VisualParityScenario,
  visualParityScenarios,
} from './visual-parity-scenarios.ts';
import { geometryToleranceFor, isDeclaredInert } from './visual-parity-tolerances.ts';

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
const loadingMotionDurationMs = 2_400;

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
  /** Echo of the declared interaction state the preview actually installed. */
  state?: string | null;
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
  motion?: {
    opacity?: number;
    scaleX?: number;
    scaleY?: number;
    translateX?: number;
    translateY?: number;
  };
  motionProgress?: number;
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

/**
 * Fraction of the image the raster masks cover, overlaps counted once.
 *
 * A mask hides a real difference, so masking has to stay small and visible. A
 * plain sum of rect areas would double-count overlaps and overstate coverage;
 * this compresses the rect edges into a grid and sums each covered cell once, so
 * the number a budget is checked against is the true masked area.
 */
function maskedFraction(
  rects: ReadonlyArray<{
    bottom: number;
    left: number;
    right: number;
    top: number;
  }>,
  width: number,
  height: number,
): number {
  if (rects.length === 0 || width <= 0 || height <= 0) return 0;
  const clamp = (value: number, max: number) => Math.max(0, Math.min(value, max));
  const clamped = rects
    .map((rect) => ({
      bottom: clamp(rect.bottom, height),
      left: clamp(rect.left, width),
      right: clamp(rect.right, width),
      top: clamp(rect.top, height),
    }))
    .filter((rect) => rect.right > rect.left && rect.bottom > rect.top);
  if (clamped.length === 0) return 0;
  const xs = [...new Set(clamped.flatMap((rect) => [rect.left, rect.right]))].sort(
    (a, b) => a - b,
  );
  const ys = [...new Set(clamped.flatMap((rect) => [rect.top, rect.bottom]))].sort(
    (a, b) => a - b,
  );
  let covered = 0;
  for (let xi = 0; xi < xs.length - 1; xi += 1) {
    for (let yi = 0; yi < ys.length - 1; yi += 1) {
      const cellLeft = xs[xi] ?? 0;
      const cellRight = xs[xi + 1] ?? 0;
      const cellTop = ys[yi] ?? 0;
      const cellBottom = ys[yi + 1] ?? 0;
      const inside = clamped.some(
        (rect) =>
          rect.left <= cellLeft &&
          rect.right >= cellRight &&
          rect.top <= cellTop &&
          rect.bottom >= cellBottom,
      );
      if (inside) covered += (cellRight - cellLeft) * (cellBottom - cellTop);
    }
  }
  return covered / (width * height);
}

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

/**
 * The parts whose raster is excluded, when only some of a component's parts are
 * ink.
 *
 * The derived mask covers every named part, which is right for a glyph run and
 * wrong for a layout container: masking `.tr-card-content` hides the whole
 * interior, so the comparison keeps only the outer border. Naming the ink parts
 * here leaves the container's fill, padding and dividers strict while still
 * forgiving the glyphs inside it. A component absent from this table masks all
 * of its parts, which is correct where every part is ink.
 */
const inkMaskParts: Partial<
  Record<VisualParityScenario['component'], readonly string[]>
> = {
  card: ['title', 'description'],
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
  link: { label: '[data-parity-part="label"]' },
  toggle: { label: '[data-parity-part="label"]' },
  switch: { thumb: '.tr-switch-thumb' },
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
    group0Label: '[data-parity-part="treeNavGroup0Label"]',
    group1Label: '[data-parity-part="treeNavGroup1Label"]',
    leaf0Label: '[data-parity-part="treeNavLeaf0Label"]',
    leaf1Label: '[data-parity-part="treeNavLeaf1Label"]',
    leaf2Label: '[data-parity-part="treeNavLeaf2Label"]',
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
  // Scrollbars are browser chrome, not component pixels, and the classic track
  // stays white regardless of the page's dark theme. Only a viewport-wide clip
  // (the down and up drawers) ever reaches the edge where it lives, and there
  // it reads as a white column on the Flutter side. Hidden on both pages so the
  // crops stay symmetric.
  const scrollbars =
    'html{scrollbar-width:none!important}::-webkit-scrollbar{display:none!important}';
  await page.addStyleTag({
    content: motion
      ? `*,*::before,*::after{caret-color:transparent!important}${scrollbars}`
      : `*,*::before,*::after{animation:none!important;caret-color:transparent!important;transition:none!important}${scrollbars}`,
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
  const diagnostics = await page.evaluate(() =>
    (
      (window as Window & { __parityMessages?: unknown[] }).__parityMessages ?? []
    ).slice(-8),
  );
  throw new Error(
    `Flutter preview did not return parity metrics: ${JSON.stringify(diagnostics)}`,
  );
}

/**
 * The rigid translation between two renders of the same layout.
 *
 * A press offset moves everything a control paints by one vector without
 * relaying anything out, and the Flutter screenshot has to be clipped along
 * that vector or the two images compare misaligned. When the measured parts
 * disagree the renders differ in layout rather than in paint, and the geometry
 * assertions below are the ones that should speak, so this reports no shift.
 *
 * Generalised from a hand-listed anchor part per component, which had to be
 * extended by hand before any new component could carry a pressed state.
 */
function rigidDelta(
  rest: Record<string, { x: number; y: number }>,
  state: Record<string, { x: number; y: number }>,
): { x: number; y: number } {
  const deltas = Object.entries(rest).flatMap(([name, restPart]) => {
    const statePart = state[name];
    return statePart === undefined
      ? []
      : [{ x: statePart.x - restPart.x, y: statePart.y - restPart.y }];
  });
  const [first] = deltas;
  if (first === undefined) return { x: 0, y: 0 };
  const rigid = deltas.every(
    (delta) => Math.abs(delta.x - first.x) < 0.5 && Math.abs(delta.y - first.y) < 0.5,
  );
  return rigid ? first : { x: 0, y: 0 };
}

function partOrigins(
  parts: Record<string, { bounds: { x: number; y: number } }>,
): Record<string, { x: number; y: number }> {
  return Object.fromEntries(
    Object.entries(parts).map(([name, part]) => [
      name,
      { x: part.bounds.x, y: part.bounds.y },
    ]),
  );
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
  args: Record<string, boolean | number | string>,
  theme: string,
  state?: FlutterForcedState,
) {
  const requestId = ++parityRequestId;
  await page.evaluate(
    ({
      afterFrame,
      declaredState,
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
          payload: {
            afterFrame,
            args: scenarioArgs,
            theme: selectedTheme,
            ...(declaredState === undefined ? {} : { state: declaredState }),
          },
          requestId: id,
          type: 'renderScenario',
        },
        location.origin,
      );
    },
    {
      afterFrame: !motion,
      declaredState: state,
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
  // A payload field the preview silently ignored is the exact failure mode a
  // declared model has, so the echo is checked rather than assumed.
  // The preview reports 'default' when nothing was declared, so both sides are
  // normalised before comparing.
  expect(metrics.state ?? 'default', `${component} declared state echo`).toBe(
    state ?? 'default',
  );
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
  const forceTarget = forceTargetSelector(component);
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
    ({ forceTarget, rasterOnlySelectors, selectedComponent, selectors }) => {
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
          menubar: '.tr-menu-content[data-open]',
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
        focusModality: document.documentElement.getAttribute('data-tr-focus-modality'),
        // Every painted property of the target subtree, so a declared state
        // that resolves to the same paint as rest can be told apart from a
        // forcing call that never landed. `matches(':hover')` cannot do this:
        // forced pseudo classes are honoured during style resolution but not
        // in selector queries, so computed style is the only witness.
        paintFingerprint: [
          geometryTarget,
          ...geometryTarget.querySelectorAll<HTMLElement>('*'),
        ]
          .slice(0, 400)
          .map((element) => {
            const elementStyle = getComputedStyle(element);
            // `getPropertyValue` takes CSS property names, not the camel-case
            // aliases; a camel-case name silently returns an empty string and
            // the fingerprint goes blind.
            return [
              'background-color',
              'background-image',
              'border-bottom-color',
              'border-bottom-width',
              'border-left-color',
              'border-left-width',
              'border-right-color',
              'border-right-width',
              'border-top-color',
              'border-top-width',
              'box-shadow',
              'color',
              'fill',
              'opacity',
              'outline-color',
              'outline-offset',
              'outline-style',
              'outline-width',
              'stroke',
              'text-decoration-color',
              'text-decoration-line',
              'transform',
            ]
              .map((property) => elementStyle.getPropertyValue(property))
              .join('|');
          })
          .join('\n'),
        partText,
        rasterOnlyParts,
        ring: (() => {
          const ringElement = document.querySelector<HTMLElement>(forceTarget);
          if (ringElement === null) return null;
          const ringStyle = getComputedStyle(ringElement);
          return {
            outlineStyle: ringStyle.getPropertyValue('outline-style'),
            outlineWidth: ringStyle.getPropertyValue('outline-width'),
          };
        })(),
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
      forceTarget,
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

  // Before the rest render, not only after the state one. A failing assertion
  // aborts this function, and forcing that outlives it makes the *next*
  // scenario's rest render carry the previous state -- which turns one real
  // failure into a cascade and, worse, can make a genuinely broken pair compare
  // equal because both of its renders were forced.
  await clearForcedStates(reactPage);
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
  const reactRest = await reactSnapshot(reactPage, scenario.component, scenario.args);
  const reactBox = reactRest.bounds;
  const reactTypography = reactRest.typography;
  const reactRestParts = reactRest.parts;
  const condition = conditionFor(scenario);
  // Every state is declared to both runtimes rather than driven, so there is no
  // held pointer or held key to release afterwards, and no event pipeline to
  // wait on. A rest condition declares nothing and re-renders nothing.
  // A rest condition is already on screen, and re-rendering it would not be
  // free: an open select re-runs its popup layout, which moves the highlight and
  // the scroll offset. The modality attribute is still cleared, so a previous
  // scenario's declaration cannot leak into this one.
  const [, declaredStateMetrics] = isRestCondition(condition)
    ? [await setFocusModality(reactPage, condition.modality), metrics]
    : await Promise.all([
        applyWebCondition(reactPage, forceTargetSelector(scenario.component), {
          forced: forcedPseudosFor(condition, scenario.component),
          modality: condition.modality,
        }),
        renderFlutterScenario(
          flutterPage,
          scenario.component,
          scenario.args,
          theme,
          condition.flutterState,
        ),
      ]);
  const [reactState, initialStateMetrics] = isRestCondition(condition)
    ? [reactRest, metrics]
    : [
        await reactSnapshot(reactPage, scenario.component, scenario.args),
        declaredStateMetrics,
      ];
  {
    // The only way a declared model fails silently: forcing that never landed
    // renders rest on both sides and the pixel comparison agrees. Computed
    // style is the sole witness -- `matches(':hover')` cannot see a forced
    // pseudo class, because forcing is honoured during style resolution and not
    // in selector queries.
    const repainted = reactRest.paintFingerprint !== reactState.paintFingerprint;
    // A pair listed as inert flips the assertion rather than skipping it.
    const expectsRepaint = condition.paint === 'changes' && !isDeclaredInert(scenario);
    expect(
      repainted,
      expectsRepaint
        ? `${scenario.id} declared ${scenario.state} changed no painted property; the forcing did not land`
        : `${scenario.id} is declared visually inert in ${scenario.state} but repainted`,
    ).toBe(expectsRepaint);

    if (condition.ring !== 'unchecked' && reactState.ring !== null) {
      const painted =
        reactState.ring.outlineStyle !== 'none' &&
        Number.parseFloat(reactState.ring.outlineWidth) > 0;
      expect(
        painted,
        `${scenario.id} ${condition.ring === 'present' ? 'keyboard focus painted no ring' : 'pointer focus painted a ring'} (outline ${reactState.ring.outlineStyle} ${reactState.ring.outlineWidth})`,
      ).toBe(condition.ring === 'present');
    }
    if (condition.modality !== undefined) {
      expect(reactState.focusModality, `${scenario.id} focus modality`).toBe(
        condition.modality,
      );
    }
  }

  const reactStateBox = reactState.bounds;
  const reactParts = reactState.parts;
  const reactPartText = reactState.partText;
  const stateMetrics = initialStateMetrics;
  // The Flutter preview echoes back what it was asked to render. The declared
  // interaction flags are deliberately absent: the preview seeds them from the
  // declaration, so asserting them back would only compare the harness with its
  // own input. That a declaration reached the paint is proved by the
  // rest-versus-state comparison instead.
  expect(
    stateMetrics.interaction,
    `${scenario.id} Flutter interaction telemetry ${JSON.stringify(
      stateMetrics.interaction,
    )}`,
  ).toMatchObject({
    enabled: scenario.args['disabled'] !== true && scenario.args['loading'] !== true,
    invalid: scenario.args['errorText'] !== undefined,
    loading: scenario.args['loading'] === true,
    readonly: scenario.args['readOnly'] === true,
  });
  const measureFlutterAnchorDelta = () =>
    rigidDelta(partOrigins(metrics.parts), partOrigins(stateMetrics.parts));
  const flutterAnchorDelta = measureFlutterAnchorDelta();
  const flutterStateBox = {
    ...stateMetrics.bounds,
    x: stateMetrics.bounds.x + flutterAnchorDelta.x,
    y: stateMetrics.bounds.y + flutterAnchorDelta.y,
  };

  for (const axis of ['x', 'y'] as const) {
    const reactPartDelta = rigidDelta(reactRestParts, reactParts);
    const reactDelta =
      Object.keys(reactRestParts).length === 0
        ? reactStateBox[axis] - reactBox[axis]
        : reactPartDelta[axis];
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
    // A tolerance raises the bar to its declared budget and nothing more, so a
    // regression stacked on top of a known residue still fails.
    const tolerance = geometryToleranceFor(scenario, key);
    expect(
      geometryDeltas[key],
      tolerance === undefined
        ? `${scenario.id} ${locale}/${theme} ${key}`
        : `${scenario.id} ${locale}/${theme} ${key} exceeded the ${tolerance.id} budget`,
    ).toBeLessThan(tolerance?.maxDelta ?? 1);
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
          // A text component is nothing but a glyph run: its family, size,
          // weight, tracking and baseline are asserted separately, and the
          // residue the shared-palette classifier cannot absorb is CJK edge
          // rasterization. Every other formerly whole-box mask is gone.
          {
            bottom: 16 + normalizedDimensions.height + 1,
            left: 15,
            right: 16 + normalizedDimensions.width + 1,
            top: 15,
          },
        ]
      : scenario.component === 'text-field'
        ? []
        : scenario.component === 'collapsible' || scenario.component === 'accordion'
          ? []
          : scenario.component === 'animated-number'
            ? []
            : scenario.component === 'copy-button'
              ? []
              : scenario.component === 'textarea'
                ? [
                    ...(scenario.args['value'] !== undefined ||
                    scenario.args['placeholder'] !== undefined
                      ? [
                          // Only the text rows; the border, fill and focus ring
                          // stay strict.
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
                  ? []
                  : scenario.component === 'checkbox' &&
                      scenario.args['mark'] !== 'unchecked'
                    ? []
                    : scenario.component === 'breadcrumbs'
                      ? []
                      : scenario.component === 'steps'
                        ? [
                            // Only the copy column; the numbered markers and the
                            // connecting rail stay strict. CJK locales leave a
                            // residue here the classifier does not absorb.
                            {
                              bottom: 16 + normalizedDimensions.height + 1,
                              left: 16 + 30,
                              right: 16 + normalizedDimensions.width + 1,
                              top: 15,
                            },
                          ]
                        : scenario.component === 'fieldset'
                          ? []
                          : scenario.component === 'field'
                            ? []
                            : scenario.component === 'meter'
                              ? []
                              : scenario.component === 'code'
                                ? []
                                : scenario.component === 'code-block'
                                  ? []
                                  : scenario.component === 'navigation-menu' &&
                                      scenario.args['open'] !== true
                                    ? []
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
                                            // Rows only. The residue here is the
                                            // same in every locale and theme, so
                                            // it is a rendering difference rather
                                            // than glyph shaping -- worth its own
                                            // investigation.
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
                                                if (
                                                  stateMetrics.parts[name]?.bounds ===
                                                  undefined
                                                ) {
                                                  return [];
                                                }
                                                const ink =
                                                  inkMaskParts[scenario.component];
                                                if (
                                                  ink !== undefined &&
                                                  !ink.includes(name)
                                                ) {
                                                  return [];
                                                }
                                                // The React box alone, never the union
                                                // with Flutter's: a union grows the mask
                                                // by however far the two parts drift, so
                                                // a geometry regression would widen its
                                                // own cover instead of failing. Part
                                                // geometry is asserted separately above.
                                                const left =
                                                  reactPart.x - reactStateBox.x + 16;
                                                const top =
                                                  reactPart.y - reactStateBox.y + 16;
                                                return [
                                                  {
                                                    bottom: top + reactPart.height + 1,
                                                    left: left - 1,
                                                    right: left + reactPart.width + 1,
                                                    top: top - 1,
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
    // Only the band the shadow actually reaches, not the whole margin. Beyond
    // it both runtimes paint plain page background, and masking that far out
    // meant the elevated card compared almost nothing outside its border.
    const shadowBand = 8;
    rasterRects.push(
      {
        bottom: 15,
        left: 16 - shadowBand,
        right: 16 + normalizedDimensions.width + shadowBand,
        top: 16 - shadowBand,
      },
      {
        bottom: 16 + normalizedDimensions.height + shadowBand,
        left: 16 - shadowBand,
        right: 16 + normalizedDimensions.width + shadowBand,
        top: 16 + normalizedDimensions.height,
      },
      {
        bottom: 16 + normalizedDimensions.height,
        left: 16 - shadowBand,
        right: 15,
        top: 16,
      },
      {
        bottom: 16 + normalizedDimensions.height,
        left: 16 + normalizedDimensions.width,
        right: 16 + normalizedDimensions.width + shadowBand,
        top: 16,
      },
    );
  }
  // A mask hides real pixels from the comparison, so its size is a budget, not a
  // free parameter. Freezing it at the measured maximum makes a widened rect or
  // a mask creeping over a border fail here instead of passing green.
  const maskPercent = maskedFraction(rasterRects, imageWidth, imageHeight) * 100;
  const maskBudget = parityMaskBudgets[scenario.component];
  expect(
    maskPercent,
    `${scenario.id} ${locale}/${theme} masks ${maskPercent.toFixed(2)}% of the image, over its ${maskBudget}% budget`,
  ).toBeLessThanOrEqual(maskBudget);
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
  await clearForcedStates(reactPage);
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
  const committedFlutterFrame = flutterPage.evaluate(
    () => new Promise<void>((resolve) => requestAnimationFrame(() => resolve())),
  );
  await flutterPage.clock.runFor(16);
  await committedFlutterFrame;
}

async function compareMotionScenario(
  pages: ParityPages,
  scenario: (typeof motionParityScenarios)[number],
  theme: string,
) {
  const { flutterPage, reactPage } = pages;
  // Flutter Web's scheduler uses a stable time-dilation ratio under the
  // installed Playwright clock.
  const flutterClockFactor = scenario.component === 'toast' ? 56 : 97;
  await Promise.all([reactPage.mouse.move(1, 1), flutterPage.mouse.move(1, 1)]);
  const advanceFlutterClock = async (duration: number) => {
    if (duration <= 0) return;
    // Flutter Web's scheduler advances animation time at roughly 1/97 of the
    // installed Playwright clock. Calibrate against the shared 120ms token so
    // 30/60/90ms samples land on the same easing coordinates as Chromium CSS.
    await flutterPage.clock.runFor(duration * flutterClockFactor);
    const nextFrame = flutterPage.evaluate(
      () => new Promise<void>((resolve) => requestAnimationFrame(() => resolve())),
    );
    // Flush the paint scheduled by the last time-dilated animation tick. The
    // additional 16ms advances Flutter's animation clock by only 0.16ms.
    await flutterPage.clock.runFor(16);
    await nextFrame;
  };
  await configureMotionScenario(pages, scenario, theme);
  // Begin every sampled transition from a fully committed endpoint. This is
  // deliberately longer than the 120ms fast token so a state-off scenario
  // does not inherit the reversing-adjusted timing of its setup transition.
  // Repeating animations are freshly mounted by configureMotionScenario and
  // must retain that exact zero phase; their layout does not need settling.
  const initialSettle =
    scenario.transition === 'continuous'
      ? 0
      : Math.max(240, Math.max(...(scenario.sampleTimes ?? motionSampleTimes)) + 20);
  await Promise.all([
    reactPage.clock.runFor(initialSettle),
    advanceFlutterClock(initialSettle),
  ]);
  const motionLayerSelector = (
    {
      'alert-dialog': '.tr-alert-dialog-popup[data-open]',
      dialog: '.tr-dialog-box[data-open]',
      drawer: '.tr-drawer-popup',
      menu: '.tr-menu-content[data-open]',
      'navigation-menu': '.tr-navigation-menu-popup[data-open]',
      popover: '.tr-popover-popup[data-open]',
      'preview-card': '.tr-preview-card-popup[data-open]',
      toast: '.tr-toast',
    } as Partial<Record<MotionParityScenario['component'], string>>
  )[scenario.component];
  const reactTarget = reactPage.locator(
    motionLayerSelector ?? '[data-parity-target] > *',
  );
  const reactRestTarget =
    motionLayerSelector === undefined
      ? reactTarget
      : reactPage.locator('[data-parity-target] > *');
  const measureReactMotionBox = async () => {
    const target =
      motionLayerSelector !== undefined && scenario.transition === 'open'
        ? reactRestTarget
        : reactTarget;
    const bounds = await target.boundingBox();
    if (bounds === null || scenario.component !== 'spinner') return bounds;
    // A CSS transform changes getBoundingClientRect() to the axis-aligned box
    // around the rotated square even though the circular spinner's layout and
    // painted envelope remain fixed. Compare that stable layout envelope to
    // Flutter's RenderBox and leave the pixels themselves fully strict.
    return target.evaluate((element) => {
      const bounds = element.getBoundingClientRect();
      const style = getComputedStyle(element);
      const width = Number.parseFloat(style.width);
      const height = Number.parseFloat(style.height);
      return {
        height,
        width,
        x: bounds.x + bounds.width / 2 - width / 2,
        y: bounds.y + bounds.height / 2 - height / 2,
      };
    });
  };
  const reactRest = await measureReactMotionBox();
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
      reactPage.mouse.move(
        scenario.component === 'pagination'
          ? reactRest.x + 70
          : scenario.component === 'tabs'
            ? reactRest.x + 130
            : scenario.component === 'tree-nav'
              ? reactRest.x + 100
              : center(reactRest).x,
        scenario.component === 'pagination' || scenario.component === 'tabs'
          ? reactRest.y + 20
          : scenario.component === 'tree-nav'
            ? reactRest.y + 16
            : center(reactRest).y,
      ),
      flutterPage.mouse.move(
        scenario.component === 'pagination'
          ? flutterRest.x + 70
          : scenario.component === 'tabs'
            ? flutterRest.x + 130
            : scenario.component === 'tree-nav'
              ? flutterRest.x + 100
              : center(flutterRest).x,
        scenario.component === 'pagination' || scenario.component === 'tabs'
          ? flutterRest.y + 20
          : scenario.component === 'tree-nav'
            ? flutterRest.y + 16
            : center(flutterRest).y,
      ),
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
  if (
    scenario.transition === 'state-on' ||
    scenario.transition === 'state-off' ||
    scenario.transition === 'value-increase' ||
    scenario.transition === 'value-decrease' ||
    scenario.transition === 'open' ||
    scenario.transition === 'close'
  ) {
    const nextArgs = { ...scenario.args, ...scenario.nextArgs };
    const nextQuery = queryFor({ ...scenario, args: nextArgs }, 'en', theme);
    nextQuery.set('motion', 'true');
    await Promise.all([
      reactPage.evaluate((search) => {
        (
          window as Window & {
            __setParityQuery?: (nextSearch: string) => void;
          }
        ).__setParityQuery?.(search);
      }, nextQuery.toString()),
      flutterPage.evaluate(
        ({ args, component, selectedChannel }) => {
          const messages = (window as Window & { __parityMessages?: unknown[] })
            .__parityMessages;
          if (messages !== undefined) messages.length = 0;
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
          args: nextArgs,
          component: scenario.component,
          selectedChannel: channel,
        },
      ),
    ]);
    if (
      (scenario.transition === 'open' || scenario.transition === 'close') &&
      motionLayerSelector !== undefined
    ) {
      await waitForTrue(
        () =>
          reactPage
            .locator(motionLayerSelector)
            .count()
            .then((count) => count > 0),
        60_000,
      );
    } else if (scenario.component === 'app-shell') {
      await waitForTrue(
        () =>
          reactPage.evaluate(
            (collapsed) =>
              document
                .querySelector('.tr-app-shell-sidebar')
                ?.getAttribute('data-collapsed') === String(collapsed),
            nextArgs['sidebarCollapsed'] === true,
          ),
        60_000,
      );
    } else if (scenario.transition === 'open' || scenario.transition === 'close') {
      await waitForTrue(
        () =>
          reactPage.evaluate(
            ({ component, open }) =>
              document
                .querySelector(
                  component === 'accordion'
                    ? '.tr-accordion-content'
                    : '.tr-collapsible',
                )
                ?.hasAttribute('data-open') === open,
            {
              component: scenario.component,
              open: nextArgs['open'] === true,
            },
          ),
        60_000,
      );
    } else if (scenario.component === 'animated-number') {
      await waitForTrue(
        () =>
          reactPage.evaluate(
            (value) =>
              document.querySelector('.tr-animated-number-accessible')?.textContent ===
              new Intl.NumberFormat('en').format(Number(value)),
            nextArgs['value'],
          ),
        60_000,
      );
    } else if (
      scenario.transition === 'value-increase' ||
      scenario.transition === 'value-decrease'
    ) {
      await waitForTrue(
        () =>
          reactPage.evaluate(
            (value) =>
              document
                .querySelector('.tr-meter, .tr-progress')
                ?.getAttribute('aria-valuenow') === String(value),
            nextArgs['value'],
          ),
        60_000,
      );
    } else {
      const stateAttribute =
        scenario.component === 'toggle' ? 'data-pressed' : 'data-checked';
      const stateEnabled =
        scenario.component === 'toggle'
          ? nextArgs['pressed'] === true
          : scenario.component === 'checkbox'
            ? nextArgs['mark'] === 'checked'
            : nextArgs['checked'] === true;
      await waitForTrue(
        () =>
          reactPage.evaluate(
            ({ attribute, enabled }) => {
              const target = document.querySelector(
                attribute === 'data-pressed'
                  ? '.tr-toggle'
                  : '.tr-checkbox, .tr-radio, .tr-switch',
              );
              return target?.hasAttribute(attribute) === enabled;
            },
            { attribute: stateAttribute, enabled: stateEnabled },
          ),
        60_000,
      );
    }
    await waitForTrue(
      () =>
        measureFlutter(flutterPage, scenario.component).then(
          (metrics) =>
            Object.entries(nextArgs).every(
              ([key, value]) => metrics.args[key] === value,
            ) &&
            (motionLayerSelector === undefined ||
              Object.keys(metrics.parts).length > 0),
        ),
      60_000,
    );
    if (scenario.transition === 'open' || scenario.transition === 'close') {
      // Base UI commits the mounted panel's starting style across animation
      // frames. Let that lifecycle create its CSS transitions, then the sample
      // loop seeks every animation back to the shared 0ms origin.
      await reactPage.clock.runFor(32);
      if (motionLayerSelector !== undefined) {
        await reactPage.locator(motionLayerSelector).evaluate((element) => {
          const forceExplicitMotion =
            element.classList.contains('tr-drawer-popup') ||
            element.classList.contains('tr-alert-dialog-popup') ||
            element.classList.contains('tr-dialog-box') ||
            element.classList.contains('tr-toast');
          if (!forceExplicitMotion && element.getAnimations().length > 0) return;
          if (forceExplicitMotion) {
            for (const animation of element.getAnimations()) animation.cancel();
          }
          // Chromium does not instantiate an @starting-style transition when
          // the controlled Base UI portal is committed inside flushSync. Use
          // the same public CSS contract as an explicit Web Animation so the
          // fixed-frame catalog still exercises opacity and scale.
          const fadeOnly =
            element.classList.contains('tr-alert-dialog-popup') ||
            element.classList.contains('tr-preview-card-popup') ||
            element.classList.contains('tr-toast');
          const slow =
            element.classList.contains('tr-alert-dialog-popup') ||
            element.classList.contains('tr-preview-card-popup') ||
            element.classList.contains('tr-dialog-box') ||
            element.classList.contains('tr-drawer-popup');
          const drawerDirection = element.getAttribute('data-swipe-direction');
          const drawerTransform =
            drawerDirection === 'up'
              ? 'translateY(-100%)'
              : drawerDirection === 'left'
                ? 'translateX(-100%)'
                : drawerDirection === 'right'
                  ? 'translateX(100%)'
                  : 'translateY(100%)';
          element.animate(
            element.classList.contains('tr-drawer-popup')
              ? [{ transform: drawerTransform }, { transform: 'translate(0, 0)' }]
              : element.classList.contains('tr-toast')
                ? [
                    { opacity: 0, transform: 'translateY(8px)' },
                    { opacity: 1, transform: 'translateY(0)' },
                  ]
                : fadeOnly
                  ? [{ opacity: 0 }, { opacity: 1 }]
                  : [
                      { opacity: 0, scale: 'var(--tinyrack-overlay-closed-scale)' },
                      { opacity: 1, scale: '1' },
                    ],
            {
              duration: slow ? 180 : 160,
              easing: 'ease-out',
              fill: 'both',
            },
          );
        });
      } else if (scenario.component === 'accordion') {
        await reactPage
          .locator('.tr-accordion-content')
          .first()
          .evaluate((element) => {
            if (element.getAnimations().length > 0) return;
            // Base UI may commit a controlled Accordion panel without keeping
            // its data-starting-style frame alive under the installed clock.
            // Recreate the component's public height/border transition from
            // the resolved endpoint so this catalog still samples that exact
            // CSS contract instead of silently treating it as instantaneous.
            const style = getComputedStyle(element);
            element.animate(
              [
                { borderBlockStartWidth: '0px', height: '0px' },
                {
                  borderBlockStartWidth: style.borderBlockStartWidth,
                  height: style.height,
                },
              ],
              {
                duration: 160,
                easing: 'ease-out',
                fill: 'both',
              },
            );
          });
      }
      await waitForTrue(
        () =>
          scenario.component === 'accordion'
            ? reactPage
                .locator('.tr-accordion-content')
                .count()
                .then((count) => count > 0)
            : motionLayerSelector === undefined
              ? reactPage.evaluate(
                  (contentClass) =>
                    document
                      .getAnimations()
                      .some(
                        (animation) =>
                          (animation.effect as KeyframeEffect | null)?.target instanceof
                            HTMLElement &&
                          (
                            (animation.effect as KeyframeEffect).target as HTMLElement
                          ).classList.contains(contentClass),
                      ),
                  scenario.component === 'app-shell'
                    ? 'tr-app-shell-sidebar'
                    : 'tr-collapsible-content',
                )
              : reactPage
                  .locator(motionLayerSelector)
                  .evaluate((element) => element.getAnimations().length > 0),
        60_000,
      );
    } else if (scenario.component === 'animated-number') {
      await reactPage.clock.runFor(16);
      await waitForTrue(
        () =>
          reactPage.evaluate(
            (roll) =>
              document.querySelector(
                '.tr-animated-number-visual[data-animating="true"]',
              ) !== null &&
              (!roll || document.getAnimations().length > 0),
            scenario.args['animation'] === 'roll',
          ),
        60_000,
      );
    }
  }

  let elapsed = 0;
  let layerPhaseOrigin: number | undefined;
  let continuousPhaseOrigin: number | undefined;
  const frameFailures: string[] = [];
  for (const sampleTime of scenario.sampleTimes ?? motionSampleTimes) {
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
    const flutterMetricsAtTime = await measureFlutter(flutterPage, scenario.component);
    const reactAnimations = await reactPage.evaluate(
      ({
        component,
        desiredHeight,
        desiredOpacity,
        desiredProgress,
        desiredSwitchThumbX,
        desiredTranslateX,
        desiredTranslateY,
        layerSelector,
        time,
      }) => {
        if (component === 'accordion') {
          const panel = document.querySelector('.tr-accordion-content');
          if (panel instanceof HTMLElement && panel.getAnimations().length === 0) {
            const style = getComputedStyle(panel);
            const animation = panel.animate(
              [
                { borderBlockStartWidth: '0px', height: '0px' },
                {
                  borderBlockStartWidth: style.borderBlockStartWidth,
                  height: style.height,
                },
              ],
              { duration: 160, easing: 'ease-out', fill: 'both' },
            );
            animation.pause();
          }
        }
        for (const animation of document.getAnimations()) {
          animation.pause();
          const duration = animation.effect?.getTiming().duration;
          animation.currentTime =
            desiredProgress !== undefined && typeof duration === 'number'
              ? desiredProgress * duration
              : time;
        }
        if (component === 'switch' && desiredSwitchThumbX !== undefined) {
          const root = document.querySelector('.tr-switch');
          const thumb = document.querySelector('.tr-switch-thumb');
          const animations = document.getAnimations();
          const duration = Math.max(
            0,
            ...animations.map((animation) => {
              const value = animation.effect?.getTiming().duration;
              return typeof value === 'number' ? value : 0;
            }),
          );
          if (root !== null && thumb !== null && duration > 0) {
            const seek = (value: number) => {
              for (const animation of animations) {
                const animationDuration = animation.effect?.getTiming().duration;
                animation.currentTime =
                  typeof animationDuration === 'number'
                    ? Math.min(value, animationDuration)
                    : value;
              }
              return thumb.getBoundingClientRect().x - root.getBoundingClientRect().x;
            };
            const start = seek(0);
            const end = seek(duration);
            let low = 0;
            let high = duration;
            for (let iteration = 0; iteration < 18; iteration += 1) {
              const middle = (low + high) / 2;
              const current = seek(middle);
              if (
                (end >= start && current < desiredSwitchThumbX) ||
                (end < start && current > desiredSwitchThumbX)
              ) {
                low = middle;
              } else {
                high = middle;
              }
            }
            seek((low + high) / 2);
          }
        }
        let alignedTime: number | null = null;
        if (component === 'accordion' && desiredHeight !== undefined) {
          const panel = document.querySelector('.tr-accordion-content');
          const root = document.querySelector('[data-parity-target] > *');
          const animations =
            panel === null
              ? []
              : panel.getAnimations().filter((animation) => {
                  const duration = animation.effect?.getTiming().duration;
                  return typeof duration === 'number' && duration > 0;
                });
          const duration = animations[0]?.effect?.getTiming().duration;
          if (root !== null && typeof duration === 'number') {
            let low = 0;
            let high = duration;
            for (let iteration = 0; iteration < 18; iteration += 1) {
              const middle = (low + high) / 2;
              for (const animation of animations) animation.currentTime = middle;
              if (root.getBoundingClientRect().height < desiredHeight) low = middle;
              else high = middle;
            }
            alignedTime = (low + high) / 2;
            for (const animation of animations) animation.currentTime = alignedTime;
          }
        }
        if (
          layerSelector !== undefined &&
          desiredTranslateX !== undefined &&
          desiredTranslateY !== undefined &&
          Math.hypot(desiredTranslateX, desiredTranslateY) > 0.001
        ) {
          const element = document.querySelector(layerSelector);
          const animation =
            element
              ?.getAnimations()
              .find((candidate) =>
                (candidate.effect as KeyframeEffect | null)
                  ?.getKeyframes()
                  .some((frame) => frame['transform'] !== undefined),
              ) ?? element?.getAnimations()[0];
          const duration = animation?.effect?.getTiming().duration;
          if (
            element !== null &&
            animation !== undefined &&
            typeof duration === 'number'
          ) {
            const desiredMagnitude = Math.hypot(desiredTranslateX, desiredTranslateY);
            let low = 0;
            let high = duration;
            for (let iteration = 0; iteration < 18; iteration += 1) {
              const middle = (low + high) / 2;
              animation.currentTime = middle;
              const style = getComputedStyle(element);
              const transform = new DOMMatrix(
                style.transform === 'none' ? undefined : style.transform,
              );
              if (Math.hypot(transform.m41, transform.m42) > desiredMagnitude) {
                low = middle;
              } else {
                high = middle;
              }
            }
            alignedTime = (low + high) / 2;
            animation.currentTime = alignedTime;
          }
        }
        if (
          layerSelector !== undefined &&
          desiredOpacity !== undefined &&
          desiredOpacity > 0 &&
          desiredOpacity < 0.999
        ) {
          const element = document.querySelector(layerSelector);
          const animation =
            element
              ?.getAnimations()
              .find((candidate) =>
                (candidate.effect as KeyframeEffect | null)
                  ?.getKeyframes()
                  .some((frame) => frame['opacity'] !== undefined),
              ) ?? element?.getAnimations()[0];
          const duration = animation?.effect?.getTiming().duration;
          if (
            element !== null &&
            animation !== undefined &&
            typeof duration === 'number'
          ) {
            let low = 0;
            let high = duration;
            for (let iteration = 0; iteration < 18; iteration += 1) {
              const middle = (low + high) / 2;
              animation.currentTime = middle;
              const opacity = Number(getComputedStyle(element).opacity);
              if (opacity < desiredOpacity) low = middle;
              else high = middle;
            }
            alignedTime = (low + high) / 2;
            animation.currentTime = alignedTime;
          }
        }
        const target = document.querySelector('[data-parity-target] > *');
        const collapsiblePanel = document.querySelector('.tr-collapsible-content');
        const panelStyle =
          collapsiblePanel === null ? null : getComputedStyle(collapsiblePanel);
        const animatedNumber = document.querySelector('.tr-animated-number-visual');
        return {
          alignedTime,
          animations: document.getAnimations().length,
          animationDetails: document.getAnimations().map((animation) => {
            const effect = animation.effect as KeyframeEffect | null;
            return {
              duration: effect?.getTiming().duration,
              keyframes: effect?.getKeyframes().map((frame) => ({
                borderTopWidth: frame['borderTopWidth'],
                height: frame['height'],
                paddingBottom: frame['paddingBottom'],
                paddingTop: frame['paddingTop'],
                width: frame['width'],
              })),
              target:
                effect?.target instanceof HTMLElement
                  ? effect.target.className
                  : String(effect?.target),
            };
          }),
          animatedNumber:
            animatedNumber === null
              ? null
              : {
                  animating: animatedNumber.getAttribute('data-animating'),
                  text: animatedNumber.textContent,
                },
          panel:
            panelStyle === null
              ? null
              : {
                  borderTopWidth: panelStyle.borderTopWidth,
                  height: panelStyle.height,
                  paddingBottom: panelStyle.paddingBottom,
                  paddingTop: panelStyle.paddingTop,
                },
          motionStyle:
            layerSelector === undefined
              ? null
              : (() => {
                  const element = document.querySelector(layerSelector);
                  if (element === null) return null;
                  const style = getComputedStyle(element);
                  const scale = style.scale === 'none' ? 1 : Number(style.scale);
                  const transform = new DOMMatrix(
                    style.transform === 'none' ? undefined : style.transform,
                  );
                  return {
                    opacity: Number(style.opacity),
                    scale,
                    translateX: transform.m41,
                    translateY: transform.m42,
                  };
                })(),
          transition: target === null ? '' : getComputedStyle(target).transition,
        };
      },
      {
        component: scenario.component,
        desiredHeight:
          scenario.component === 'accordion'
            ? reactRest.height + flutterMetricsAtTime.bounds.height - flutterRest.height
            : undefined,
        desiredOpacity: flutterMetricsAtTime.motion?.opacity,
        desiredProgress: flutterMetricsAtTime.motionProgress,
        desiredSwitchThumbX:
          scenario.component === 'switch'
            ? (flutterMetricsAtTime.parts['thumb']?.bounds.x ?? 0) -
              flutterMetricsAtTime.bounds.x
            : undefined,
        desiredTranslateX:
          scenario.component === 'drawer' || scenario.component === 'toast'
            ? flutterMetricsAtTime.motion?.translateX
            : undefined,
        desiredTranslateY:
          scenario.component === 'drawer' || scenario.component === 'toast'
            ? flutterMetricsAtTime.motion?.translateY
            : undefined,
        layerSelector: motionLayerSelector,
        time: sampleTime,
      },
    );
    if (flutterMetricsAtTime.motionProgress !== undefined) {
      continuousPhaseOrigin ??= flutterMetricsAtTime.motionProgress;
      const expected =
        (continuousPhaseOrigin + sampleTime / loadingMotionDurationMs) % 1;
      const phaseError = Math.abs(flutterMetricsAtTime.motionProgress - expected);
      expect(
        Math.min(phaseError, 1 - phaseError),
        `${scenario.id} ${sampleTime}ms Flutter continuous phase`,
      ).toBeLessThan(0.015);
    }
    const reactBox =
      motionLayerSelector === undefined
        ? await measureReactMotionBox()
        : await reactTarget.evaluate((element) => {
            const bounds = element.getBoundingClientRect();
            const style = getComputedStyle(element);
            const width = Number.parseFloat(style.width);
            const height = Number.parseFloat(style.height);
            return {
              height,
              width,
              x: bounds.x + bounds.width / 2 - width / 2,
              y: bounds.y + bounds.height / 2 - height / 2,
            };
          });
    if (reactBox === null) throw new Error(`${scenario.id} lost its React bounds`);
    if (motionLayerSelector !== undefined) {
      const reactMotion = reactAnimations.motionStyle;
      const flutterMotion = flutterMetricsAtTime.motion;
      expect(reactMotion, `${scenario.id} ${sampleTime}ms React motion`).not.toBeNull();
      expect(
        flutterMotion,
        `${scenario.id} ${sampleTime}ms Flutter motion`,
      ).toBeDefined();
      if (reactMotion !== null && flutterMotion !== undefined) {
        if (reactAnimations.alignedTime !== null) {
          layerPhaseOrigin ??= reactAnimations.alignedTime - sampleTime;
          expect(
            Math.abs(reactAnimations.alignedTime - layerPhaseOrigin - sampleTime),
            `${scenario.id} ${sampleTime}ms phase`,
          ).toBeLessThan(12);
        }
        if (flutterMotion.opacity !== undefined) {
          expect(
            Math.abs(reactMotion.opacity - flutterMotion.opacity),
            `${scenario.id} ${sampleTime}ms opacity (${JSON.stringify({ flutterMotion, reactAnimations, reactMotion })})`,
          ).toBeLessThan(0.005);
        }
        for (const flutterScale of [flutterMotion.scaleX, flutterMotion.scaleY]) {
          expect(
            Math.abs(reactMotion.scale - (flutterScale ?? 1)) *
              Math.max(reactBox.width, reactBox.height),
            `${scenario.id} ${sampleTime}ms scale`,
          ).toBeLessThan(1);
        }
        if (scenario.component === 'drawer' || scenario.component === 'toast') {
          for (const axis of ['X', 'Y'] as const) {
            expect(
              Math.abs(
                reactMotion[`translate${axis}`] -
                  (flutterMotion[`translate${axis}`] ?? 0),
              ),
              `${scenario.id} ${sampleTime}ms translate${axis} (React ${reactMotion[`translate${axis}`]}, Flutter ${flutterMotion[`translate${axis}`] ?? 0})`,
            ).toBeLessThan(1);
          }
        }
      }
    }
    if (scenario.component === 'accordion' && reactAnimations.alignedTime !== null) {
      expect(
        Math.abs(reactAnimations.alignedTime - Math.min(sampleTime, 160)),
        `${scenario.id} ${sampleTime}ms phase`,
      ).toBeLessThan(10);
    }
    for (const axis of ['x', 'y', 'width', 'height'] as const) {
      if (
        (scenario.transition === 'state-on' ||
          scenario.transition === 'state-off' ||
          scenario.transition === 'value-increase' ||
          scenario.transition === 'value-decrease' ||
          scenario.transition === 'open' ||
          scenario.transition === 'close') &&
        (axis === 'x' || axis === 'y')
      ) {
        continue;
      }
      const reactDelta = reactBox[axis] - reactRest[axis];
      const flutterDelta =
        interactionAnchor !== undefined && (axis === 'x' || axis === 'y')
          ? (flutterMetricsAtTime.parts[interactionAnchor]?.bounds[axis] ?? 0) -
            (flutterRestMetrics.parts[interactionAnchor]?.bounds[axis] ?? 0)
          : flutterMetricsAtTime.bounds[axis] - flutterRest[axis];
      expect(
        Math.abs(reactDelta - flutterDelta),
        `${scenario.id} ${sampleTime}ms ${axis} (React ${reactBox[axis]} from ${reactRest[axis]} = ${reactDelta}, Flutter ${flutterMetricsAtTime.bounds[axis]} from ${flutterRest[axis]} = ${flutterDelta}, ${JSON.stringify(reactAnimations)})`,
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
    if (
      scenario.transition === 'continuous' ||
      scenario.component === 'animated-number'
    ) {
      // CanvasKit can leave the previous animation frame in its compositor
      // surface after layout/telemetry has advanced, especially when several
      // parity sessions share SwiftShader. A discarded capture commits that
      // surface without advancing either virtual clock, so the compared image
      // remains the requested fixed-time frame.
      await flutterPage.screenshot({ type: 'png' });
    }
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
      await reactSnapshot(
        reactPage,
        scenario.component,
        scenario.transition === 'open'
          ? { ...scenario.args, ...scenario.nextArgs }
          : scenario.args,
      )
    ).parts;
    if (scenario.component === 'switch') {
      const reactThumb = reactPartsAtTime['thumb'];
      const flutterThumb = flutterMetricsAtTime.parts['thumb']?.bounds;
      expect(reactThumb, `${scenario.id} ${sampleTime}ms React thumb`).toBeDefined();
      expect(
        flutterThumb,
        `${scenario.id} ${sampleTime}ms Flutter thumb`,
      ).toBeDefined();
      if (reactThumb !== undefined && flutterThumb !== undefined) {
        for (const size of ['width', 'height'] as const) {
          expect(
            Math.abs(reactThumb[size] - flutterThumb[size]),
            `${scenario.id} ${sampleTime}ms thumb.${size}`,
          ).toBeLessThan(1);
        }
        for (const axis of ['x', 'y'] as const) {
          expect(
            Math.abs(
              reactThumb[axis] -
                reactBox[axis] -
                (flutterThumb[axis] - flutterVisualBox[axis]),
            ),
            `${scenario.id} ${sampleTime}ms thumb.${axis} (React ${reactThumb[axis] - reactBox[axis]}, Flutter ${flutterThumb[axis] - flutterVisualBox[axis]})`,
          ).toBeLessThan(1);
        }
      }
    }
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
            const partPadding = scenario.component === 'toggle' ? 2 : 1;
            if (scenario.component === 'switch' && name === 'thumb') {
              // CanvasKit and CSS rasterize the moving circular shadow edge
              // differently. Keep the central 6x6 color sample strict while
              // masking only the anti-aliased ring; thumb geometry is asserted
              // independently above at every sampled frame.
              const left = Math.min(reactLeft, flutterLeft) - 4;
              const top = Math.min(reactTop, flutterTop) - 4;
              const right =
                Math.max(reactLeft + reactPart.width, flutterLeft + flutterPart.width) +
                4;
              const bottom =
                Math.max(reactTop + reactPart.height, flutterTop + flutterPart.height) +
                4;
              const centerX = (left + right) / 2;
              const centerY = (top + bottom) / 2;
              return [
                { bottom: centerY - 3, left, right, top },
                { bottom, left, right, top: centerY + 3 },
                {
                  bottom: centerY + 3,
                  left,
                  right: centerX - 3,
                  top: centerY - 3,
                },
                {
                  bottom: centerY + 3,
                  left: centerX + 3,
                  right,
                  top: centerY - 3,
                },
              ];
            }
            return [
              {
                bottom:
                  Math.max(
                    reactTop + reactPart.height,
                    flutterTop + flutterPart.height,
                  ) + partPadding,
                left: Math.min(reactLeft, flutterLeft) - partPadding,
                right:
                  Math.max(
                    reactLeft + reactPart.width,
                    flutterLeft + flutterPart.width,
                  ) + partPadding,
                top: Math.min(reactTop, flutterTop) - partPadding,
              },
            ];
          });
    if (
      scenario.component === 'button' ||
      scenario.component === 'icon-button' ||
      scenario.component === 'toggle'
    ) {
      // Endpoint tests keep border color and geometry strict. During a
      // fractional transform, CSS and Canvas rasterize that same one-pixel
      // static border at different coverage, so bound the motion-only AA
      // exclusion to the component's four edge strips.
      rasterRects.push(
        { bottom: 23, left: 9, right: 23 + dimensions.width, top: 9 },
        {
          bottom: 23 + dimensions.height,
          left: 9,
          right: 23 + dimensions.width,
          top: 9 + dimensions.height,
        },
        { bottom: 23 + dimensions.height, left: 9, right: 23, top: 9 },
        {
          bottom: 23 + dimensions.height,
          left: 9 + dimensions.width,
          right: 23 + dimensions.width,
          top: 9,
        },
      );
    }
    if (scenario.component === 'animated-number') {
      // The endpoint catalog remains strict. During count interpolation the
      // final antialiased glyph row can differ by one coverage pixel between
      // Chromium text and CanvasKit text; constrain that motion-only exclusion
      // to the baseline fringe rather than masking the numeral body.
      rasterRects.push({
        bottom: 34,
        left: 14,
        right: 18 + dimensions.width,
        top: 27,
      });
    }
    if (scenario.component === 'switch') {
      // Root and thumb geometry are asserted above. Keep the track interior
      // strict while excluding only the four-pixel antialiased capsule edge,
      // whose coverage differs between CSS rounded borders and CanvasKit.
      rasterRects.push(
        { bottom: 20, left: 13, right: 19 + dimensions.width, top: 13 },
        {
          bottom: 19 + dimensions.height,
          left: 13,
          right: 19 + dimensions.width,
          top: 12 + dimensions.height,
        },
        { bottom: 19 + dimensions.height, left: 13, right: 28, top: 13 },
        {
          bottom: 19 + dimensions.height,
          left: 4 + dimensions.width,
          right: 19 + dimensions.width,
          top: 13,
        },
      );
    }
    if (
      motionLayerSelector !== undefined &&
      sampleTime <
        Math.max(
          0,
          ...reactAnimations.animationDetails.map(({ duration }) =>
            typeof duration === 'number' ? duration : 0,
          ),
        )
    ) {
      // Fractional opacity/scale is composited by CSS and CanvasKit through
      // different raster pipelines. Validate those values above, mask the
      // affected surface raster here, and keep the completed endpoint strict.
      rasterRects.push({
        bottom: 32 + dimensions.height,
        left: 0,
        right: 32 + dimensions.width,
        top: 0,
      });
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
              flutterMotionProgress: flutterMetricsAtTime.motionProgress,
              interaction: flutterMetricsAtTime.interaction,
              reactBox,
              reactAnimations,
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
      matches: (pages, key) => pages.component === key.component,
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
      // Only the motion suite still drives real input, so only it can hand back
      // a page with a button or a key held down.
      if (motion) {
        await Promise.allSettled([
          pages.reactPage.mouse.up(),
          pages.flutterPage.mouse.up(),
          pages.reactPage.keyboard.up('Space'),
          pages.flutterPage.keyboard.up('Space'),
        ]);
      }
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
    // Detaching discards every forced state this page ever had, including any
    // whose node survived a re-render under an id no longer held.
    await resetForcedStates(pages.reactPage);
    const cleanup = motion
      ? await Promise.allSettled([
          pages.reactPage.mouse.up(),
          pages.flutterPage.mouse.up(),
          pages.reactPage.keyboard.up('Space'),
          pages.flutterPage.keyboard.up('Space'),
        ])
      : [];
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
        (
          [
            'app-shell',
            'button',
            'animated-number',
            'accordion',
            'alert-dialog',
            'checkbox',
            'collapsible',
            'dialog',
            'drawer',
            'icon-button',
            'link',
            'meter',
            'menu',
            'pagination',
            'progress',
            'popover',
            'preview-card',
            'navigation-menu',
            'radio',
            'scroll-area',
            'skeleton',
            'spinner',
            'switch',
            'table',
            'tabs',
            'text-field',
            'toggle',
            'toast',
            'tree-nav',
          ] as const
        )
          .flatMap((component) => {
            const componentScenarios = selectedMotionScenarios.filter(
              (scenario) => scenario.component === component,
            );
            const shards = partitionVisualParityWork(componentScenarios, 8);
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
              (componentFilter === undefined ||
                componentFilters.has(group.component)) &&
              (themeFilter === undefined || group.theme === themeFilter),
          )
          .sort(
            (left, right) =>
              left.component.localeCompare(right.component) ||
              left.shard - right.shard ||
              Number(left.theme === 'dark') - Number(right.theme === 'dark'),
          ),
      )
    : [];

  it.concurrent.each(motionGroups)(
    '$component motion [$shard/$shards] matches in $theme',
    async ({ component, scenarios: componentScenarios, theme }) => {
      const pages = await acquirePages(component, 'en', theme);
      // Collect rather than throw, matching the endpoint loop above. Letting the
      // first failure escape aborted the rest of the shard, so the reported
      // count understated how many scenarios were actually broken.
      const failures: string[] = [];
      try {
        for (const scenario of componentScenarios) {
          try {
            await profiler.measure('motionScenario', () =>
              compareMotionScenario(pages, scenario, theme),
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
      expect(failures, `${component} motion ${theme}`).toEqual([]);
    },
    2_700_000,
  );
});
