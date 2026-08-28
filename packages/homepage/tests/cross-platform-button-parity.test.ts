import type { Page } from 'playwright';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { crossPlatformParityFixtures } from '../../../scripts/cross-platform-parity-fixtures.ts';
import { createCrossPlatformParityRuntime } from './cross-platform-parity-runtime.ts';

type ButtonArgs = {
  appearance: 'ghost' | 'outline' | 'solid';
  children?: string;
  disabled?: boolean;
  intent: 'danger' | 'info' | 'neutral' | 'primary' | 'success' | 'warning';
  loading?: boolean;
  loadingLabel?: string;
  uiSize: 'lg' | 'md' | 'sm';
};

type Metrics = {
  args?: Record<string, unknown>;
  bounds: { height: number; width: number; x: number; y: number };
  interaction: Record<string, boolean | number>;
  parts?: Record<
    string,
    { bounds: { height: number; width: number; x: number; y: number } }
  >;
  style: Record<string, number | string | null>;
  theme?: string;
};

const fixture = crossPlatformParityFixtures['button'];
if (fixture === undefined) throw new Error('Button parity fixture is missing.');
const appearances = fixture.sharedOptions['appearance'] as ButtonArgs['appearance'][];
const intents = fixture.sharedOptions['intent'] as ButtonArgs['intent'][];
const uiSizes = fixture.sharedOptions['uiSize'] as ButtonArgs['uiSize'][];
const geometryTolerance = fixture.geometry?.tolerance ?? 0.5;
const runtime = await createCrossPlatformParityRuntime();
let page: Page;
let requestId = 0;

async function latestFlutterMetrics() {
  return page.evaluate(() => {
    const messages = (window as Window & { __tinyrackFlutterMessages?: unknown[] })
      .__tinyrackFlutterMessages;
    const message = [...(messages ?? [])]
      .reverse()
      .find(
        (candidate) =>
          typeof candidate === 'object' &&
          candidate !== null &&
          (candidate as { component?: string }).component === 'button' &&
          (candidate as { type?: string }).type === 'metrics',
      ) as { payload?: Metrics } | undefined;
    return message?.payload ?? null;
  });
}

async function flutterMetricsCount() {
  return page.evaluate(
    () =>
      (
        window as Window & { __tinyrackFlutterMessages?: unknown[] }
      ).__tinyrackFlutterMessages?.filter(
        (message) =>
          typeof message === 'object' &&
          message !== null &&
          (message as { component?: string }).component === 'button' &&
          (message as { type?: string }).type === 'metrics',
      ).length ?? 0,
  );
}

async function configure(args: ButtonArgs, theme: 'dark' | 'light') {
  requestId += 1;
  const id = requestId;
  await page.evaluate(
    ({ nextArgs, nextRequestId, nextTheme }) => {
      document.documentElement.dataset['theme'] = `tinyrack-${nextTheme}`;
      window.__tinyrackParity?.setArgs(nextArgs);
      const target =
        document.querySelector<HTMLIFrameElement>('#flutter-preview')?.contentWindow;
      for (const [type, payload] of [
        ['setTheme', { theme: nextTheme }],
        ['updateArgs', nextArgs],
        ['measure', { afterFrame: true }],
      ] as const) {
        target?.postMessage(
          {
            channel: 'tinyrack.flutter-preview.v1',
            component: 'button',
            payload,
            requestId: nextRequestId,
            type,
          },
          window.location.origin,
        );
      }
    },
    { nextArgs: args, nextRequestId: id, nextTheme: theme },
  );
  await expect
    .poll(
      async () => {
        const metrics = await latestFlutterMetrics();
        return (
          metrics !== null &&
          metrics.interaction !== undefined &&
          Object.entries(args).every(
            ([name, value]) =>
              (metrics as Metrics & { args?: Record<string, unknown>; theme?: string })
                .args?.[name] === value,
          ) &&
          (metrics as Metrics & { theme?: string }).theme === theme
        );
      },
      { timeout: 30_000 },
    )
    .toBe(true);
  await page.locator('#root .tr-btn').waitFor();
  await page.evaluate(() => new Promise(requestAnimationFrame));
  const metrics = await latestFlutterMetrics();
  if (metrics === null) throw new Error(`Missing Flutter metrics request ${id}.`);
  return metrics;
}

async function reactMetrics() {
  return page.evaluate(
    () => window.__tinyrackParity?.measure() ?? null,
  ) as Promise<Metrics | null>;
}

function expectNear(actual: unknown, expected: unknown, tolerance = 0) {
  expect(typeof actual).toBe('number');
  expect(typeof expected).toBe('number');
  expect(Math.abs((actual as number) - (expected as number))).toBeLessThanOrEqual(
    tolerance,
  );
}

async function requestFlutterMetrics() {
  const previousCount = await flutterMetricsCount();
  requestId += 1;
  const id = requestId;
  await page.locator('#flutter-preview').evaluate((element, nextRequestId) => {
    (element as HTMLIFrameElement).contentWindow?.postMessage(
      {
        channel: 'tinyrack.flutter-preview.v1',
        component: 'button',
        payload: { afterFrame: true },
        requestId: nextRequestId,
        type: 'measure',
      },
      window.location.origin,
    );
  }, id);
  await expect
    .poll(() => flutterMetricsCount(), { timeout: 30_000 })
    .toBeGreaterThan(previousCount);
  const metrics = await latestFlutterMetrics();
  if (metrics === null) throw new Error(`Missing Flutter metrics request ${id}.`);
  return metrics;
}

async function flutterPoint(metrics: Metrics) {
  const frame = await page.locator('#flutter-preview').boundingBox();
  if (frame === null) throw new Error('Flutter preview frame has no bounds.');
  return {
    x: frame.x + metrics.bounds.x + metrics.bounds.width / 2,
    y: frame.y + metrics.bounds.y + metrics.bounds.height / 2,
  };
}

describe('Button React-Flutter parity', () => {
  beforeAll(async () => {
    await runtime.start();
    page = await runtime.browser.newPage({
      deviceScaleFactor: 1,
      viewport: { height: 720, width: 1100 },
    });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.addInitScript(() => {
      const messages: unknown[] = [];
      Object.defineProperty(window, '__tinyrackFlutterMessages', {
        value: messages,
      });
      window.addEventListener('message', (event) => messages.push(event.data));
    });
    await page.goto(runtime.origin);
    await page.locator('#flutter-preview').waitFor();
    await page.waitForFunction(
      () =>
        (
          window as Window & { __tinyrackFlutterMessages?: unknown[] }
        ).__tinyrackFlutterMessages?.some(
          (message) =>
            typeof message === 'object' &&
            message !== null &&
            (message as { type?: string }).type === 'ready',
        ),
      undefined,
      { timeout: 60_000 },
    );
  }, 120_000);

  afterAll(async () => {
    await page?.close();
    await runtime.stop();
  });

  it('matches every shared intent and appearance color recipe in both themes', async () => {
    for (const theme of fixture.themes) {
      for (const appearance of appearances) {
        for (const intent of intents) {
          await page.mouse.move(0, 0);
          const flutter = await configure({ appearance, intent, uiSize: 'md' }, theme);
          const react = await reactMetrics();
          expect(react).not.toBeNull();
          expect(flutter.style['backgroundColor']).toBe(
            react?.style['backgroundColor'],
          );
          expect(flutter.style['foregroundColor']).toBe(
            react?.style['foregroundColor'],
          );
          expect(flutter.style['borderColor']).toBe(react?.style['borderColor']);
          expectNear(flutter.style['borderWidth'], react?.style['borderWidth']);
          expectNear(flutter.style['radius'], react?.style['radius']);
        }
      }
    }
  }, 120_000);

  it('matches shared size geometry and typography within half a logical pixel', async () => {
    for (const uiSize of uiSizes) {
      const flutter = await configure(
        { appearance: 'outline', intent: 'primary', uiSize },
        'light',
      );
      const react = await reactMetrics();
      expect(react).not.toBeNull();
      expectNear(flutter.bounds.height, react?.bounds.height, geometryTolerance);
      for (const property of [
        'borderWidth',
        'fontSize',
        'fontWeight',
        'gap',
        'lineHeight',
        'paddingInline',
        'radius',
      ]) {
        expectNear(flutter.style[property], react?.style[property], geometryTolerance);
      }
      const flutterFont = String(flutter.style['fontFamily'])
        .split('/')
        .at(-1)
        ?.replaceAll(' ', '');
      const reactFontStack = String(react?.style['fontFamily'])
        .split(',')
        .map((family) => family.split('/').at(-1)?.replaceAll(/[ "']/gu, ''));
      expect(reactFontStack).toContain(flutterFont);
    }
  });

  it('matches hover, pointer press, focus, disabled, loading, and activation', async () => {
    let flutter = await configure(
      { appearance: 'solid', intent: 'primary', uiSize: 'md' },
      'light',
    );
    const reactButton = page.locator('#root .tr-btn');

    await reactButton.hover();
    const reactHover = await reactMetrics();
    const flutterTarget = await flutterPoint(flutter);
    await page.mouse.move(flutterTarget.x, flutterTarget.y);
    const flutterHover = await requestFlutterMetrics();
    expect(flutterHover.interaction['hovered']).toBe(true);
    expect(reactHover?.interaction['hovered']).toBe(true);
    expect(flutterHover.style['backgroundColor']).toBe(
      reactHover?.style['backgroundColor'],
    );

    const reactBox = await reactButton.boundingBox();
    if (reactBox === null) throw new Error('React Button has no bounds.');
    await page.mouse.move(
      reactBox.x + reactBox.width / 2,
      reactBox.y + reactBox.height / 2,
    );
    await page.mouse.down();
    const reactPressed = await reactMetrics();
    await page.mouse.up();
    await page.mouse.move(flutterTarget.x, flutterTarget.y);
    await page.mouse.down();
    const flutterPressed = await requestFlutterMetrics();
    await page.mouse.up();
    expect(flutterPressed.interaction['pressed']).toBe(true);
    expect(reactPressed?.interaction['pressed']).toBe(true);
    expectNear(
      flutterPressed.style['pressDistance'],
      reactPressed?.style['pressDistance'],
      geometryTolerance,
    );

    await page.mouse.move(0, 0);
    await page.evaluate(() => {
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
    });
    await page.keyboard.press('Tab');
    await reactButton.focus();
    const reactFocused = await reactMetrics();
    await page.locator('#flutter-preview').focus();
    let flutterFocused = await requestFlutterMetrics();
    for (let attempt = 0; attempt < 6; attempt += 1) {
      if (flutterFocused.interaction['focused'] === true) break;
      await page.keyboard.press('Tab');
      flutterFocused = await requestFlutterMetrics();
    }
    await page.keyboard.press('ArrowDown');
    flutterFocused = await requestFlutterMetrics();
    expect(reactFocused?.interaction['focused']).toBe(true);
    expect(reactFocused?.interaction['focusVisible']).toBe(true);
    expect(flutterFocused.interaction['focused']).toBe(true);
    expect(flutterFocused.interaction['focusVisible']).toBe(true);
    expectNear(flutterFocused.style['focusWidth'], reactFocused?.style['focusWidth']);
    expectNear(flutterFocused.style['focusOffset'], reactFocused?.style['focusOffset']);
    expect(flutterFocused.style['focusColor']).toBe(reactFocused?.style['focusColor']);

    for (const state of ['disabled', 'loading'] as const) {
      flutter = await configure(
        {
          appearance: 'solid',
          disabled: state === 'disabled',
          intent: 'primary',
          loading: state === 'loading',
          loadingLabel: 'Deploying',
          uiSize: 'md',
        },
        'light',
      );
      const react = await reactMetrics();
      expect(flutter.interaction['enabled']).toBe(false);
      expect(react?.interaction['enabled']).toBe(false);
      expect(flutter.interaction['loading']).toBe(state === 'loading');
      expect(react?.interaction['loading']).toBe(state === 'loading');
      expectNear(flutter.style['disabledOpacity'], react?.style['disabledOpacity']);
      const flutterActivations = Number(flutter.interaction['activations']);
      const reactActivations = Number(react?.interaction['activations']);
      await reactButton.click({ force: true });
      const target = await flutterPoint(flutter);
      await page.mouse.click(target.x, target.y);
      const afterFlutter = await requestFlutterMetrics();
      const afterReact = await reactMetrics();
      expect(afterFlutter.interaction['activations']).toBe(flutterActivations);
      expect(afterReact?.interaction['activations']).toBe(reactActivations);
    }
  }, 120_000);

  it('executes every strict component fixture in both runtimes', async () => {
    for (const currentFixture of Object.values(crossPlatformParityFixtures)) {
      if (currentFixture.component === 'button') continue;
      const { component, flutterPreview, sharedOptions } = currentFixture;
      await page.evaluate(
        ({ nextComponent, nextFlutterPreview }) => {
          const messages = (
            window as Window & { __tinyrackFlutterMessages?: unknown[] }
          ).__tinyrackFlutterMessages;
          messages?.splice(0, messages.length);
          window.__tinyrackParity?.setComponent(nextComponent);
          const frame = document.querySelector<HTMLIFrameElement>('#flutter-preview');
          frame?.setAttribute(
            'src',
            `/flutter-preview/index.html?component=${encodeURIComponent(nextFlutterPreview)}&locale=en`,
          );
        },
        { nextComponent: component, nextFlutterPreview: flutterPreview },
      );
      await page.waitForFunction(
        (nextComponent) =>
          document
            .querySelector('#react-target')
            ?.getAttribute('data-parity-component') === nextComponent &&
          document.querySelector('#react-target [class*="tr-"]') !== null,
        component,
        { timeout: 30_000 },
      );
      await page.waitForFunction(
        ({ nextFlutterPreview }) =>
          (
            window as Window & { __tinyrackFlutterMessages?: unknown[] }
          ).__tinyrackFlutterMessages?.some(
            (message) =>
              typeof message === 'object' &&
              message !== null &&
              (message as { component?: string }).component === nextFlutterPreview &&
              (message as { type?: string }).type === 'ready',
          ),
        { nextFlutterPreview: flutterPreview },
        { timeout: 60_000 },
      );

      const support = await page.evaluate(
        ({ nextComponent, nextFlutterPreview }) => {
          const messages = (
            window as Window & { __tinyrackFlutterMessages?: unknown[] }
          ).__tinyrackFlutterMessages;
          const ready = [...(messages ?? [])]
            .reverse()
            .find(
              (message) =>
                typeof message === 'object' &&
                message !== null &&
                (message as { component?: string }).component === nextFlutterPreview &&
                (message as { type?: string }).type === 'ready',
            ) as { payload?: { supportedArgs?: string[] } } | undefined;
          return {
            flutter: ready?.payload?.supportedArgs ?? [],
            react: window.__tinyrackParity?.supportedOptions(nextComponent) ?? {},
          };
        },
        { nextComponent: component, nextFlutterPreview: flutterPreview },
      );
      for (const option of Object.keys(sharedOptions)) {
        expect(
          option in support.react,
          `${component} React fixture must expose ${option}`,
        ).toBe(true);
        expect(
          support.flutter.includes(option),
          `${flutterPreview} Flutter fixture must expose ${option}`,
        ).toBe(true);
      }

      for (const theme of currentFixture.themes) {
        requestId += 1;
        const nextRequestId = requestId;
        await page.evaluate(
          ({ nextFlutterPreview, nextRequestId, theme }) => {
            document.documentElement.dataset['theme'] = `tinyrack-${theme}`;
            const target =
              document.querySelector<HTMLIFrameElement>(
                '#flutter-preview',
              )?.contentWindow;
            target?.postMessage(
              {
                channel: 'tinyrack.flutter-preview.v1',
                component: nextFlutterPreview,
                payload: { theme },
                requestId: nextRequestId,
                type: 'setTheme',
              },
              window.location.origin,
            );
            target?.postMessage(
              {
                channel: 'tinyrack.flutter-preview.v1',
                component: nextFlutterPreview,
                payload: { afterFrame: true },
                requestId: nextRequestId,
                type: 'measure',
              },
              window.location.origin,
            );
          },
          { nextFlutterPreview: flutterPreview, nextRequestId, theme },
        );
        await page.waitForFunction(
          ({ nextFlutterPreview, nextRequestId, theme }) =>
            (
              window as Window & { __tinyrackFlutterMessages?: unknown[] }
            ).__tinyrackFlutterMessages?.some(
              (message) =>
                typeof message === 'object' &&
                message !== null &&
                (message as { component?: string }).component === nextFlutterPreview &&
                (message as { payload?: Metrics & { requestId?: number } }).payload
                  ?.requestId === nextRequestId &&
                (message as { payload?: Metrics }).payload?.theme === theme,
            ) === true,
          { nextFlutterPreview: flutterPreview, nextRequestId, theme },
          { timeout: 30_000 },
        );
      }

      for (const [option, values] of Object.entries(sharedOptions)) {
        for (const value of values) {
          requestId += 1;
          const nextRequestId = requestId;
          await page.evaluate(
            ({ nextFlutterPreview, nextRequestId, option, value }) => {
              window.__tinyrackParity?.setArgs({ [option]: value });
              const target =
                document.querySelector<HTMLIFrameElement>(
                  '#flutter-preview',
                )?.contentWindow;
              target?.postMessage(
                {
                  channel: 'tinyrack.flutter-preview.v1',
                  component: nextFlutterPreview,
                  payload: { [option]: value },
                  requestId: nextRequestId,
                  type: 'updateArgs',
                },
                window.location.origin,
              );
              target?.postMessage(
                {
                  channel: 'tinyrack.flutter-preview.v1',
                  component: nextFlutterPreview,
                  payload: { afterFrame: true },
                  requestId: nextRequestId,
                  type: 'measure',
                },
                window.location.origin,
              );
            },
            { nextFlutterPreview: flutterPreview, nextRequestId, option, value },
          );
          await page.waitForFunction(
            ({ nextFlutterPreview, nextRequestId, option, value }) =>
              (
                window as Window & { __tinyrackFlutterMessages?: unknown[] }
              ).__tinyrackFlutterMessages?.some(
                (message) =>
                  typeof message === 'object' &&
                  message !== null &&
                  (message as { component?: string }).component ===
                    nextFlutterPreview &&
                  (message as { payload?: Metrics & { requestId?: number } }).payload
                    ?.requestId === nextRequestId &&
                  (message as { payload?: Metrics }).payload?.args?.[option] === value,
              ) === true,
            { nextFlutterPreview: flutterPreview, nextRequestId, option, value },
            { timeout: 30_000 },
          );
          expect((await reactMetrics())?.bounds.height).toBeGreaterThan(0);
        }
      }

      requestId += 1;
      const finalRequestId = requestId;
      await page.evaluate(
        ({ nextFlutterPreview, nextRequestId }) => {
          document.documentElement.dataset['theme'] = 'tinyrack-light';
          const target =
            document.querySelector<HTMLIFrameElement>(
              '#flutter-preview',
            )?.contentWindow;
          for (const [type, payload] of [
            ['setTheme', { theme: 'light' }],
            ['measure', { afterFrame: true }],
          ] as const) {
            target?.postMessage(
              {
                channel: 'tinyrack.flutter-preview.v1',
                component: nextFlutterPreview,
                payload,
                requestId: nextRequestId,
                type,
              },
              window.location.origin,
            );
          }
        },
        { nextFlutterPreview: flutterPreview, nextRequestId: finalRequestId },
      );
      await page.waitForFunction(
        ({ nextFlutterPreview, nextRequestId }) =>
          (
            window as Window & { __tinyrackFlutterMessages?: unknown[] }
          ).__tinyrackFlutterMessages?.some(
            (message) =>
              typeof message === 'object' &&
              message !== null &&
              (message as { component?: string }).component === nextFlutterPreview &&
              (message as { payload?: Metrics & { requestId?: number } }).payload
                ?.requestId === nextRequestId &&
              (message as { payload?: Metrics }).payload?.theme === 'light',
          ) === true,
        { nextFlutterPreview: flutterPreview, nextRequestId: finalRequestId },
        { timeout: 30_000 },
      );

      const observations = await page.evaluate(
        ({ nextFlutterPreview }) => {
          const messages = (
            window as Window & { __tinyrackFlutterMessages?: unknown[] }
          ).__tinyrackFlutterMessages;
          const metrics = [...(messages ?? [])]
            .reverse()
            .find(
              (message) =>
                typeof message === 'object' &&
                message !== null &&
                (message as { component?: string }).component === nextFlutterPreview &&
                (message as { type?: string }).type === 'metrics' &&
                (message as { payload?: Metrics }).payload?.theme === 'light',
            ) as { payload?: Metrics } | undefined;
          return {
            flutter: metrics?.payload ?? null,
            react: window.__tinyrackParity?.measure() ?? null,
          };
        },
        { nextFlutterPreview: flutterPreview },
      );
      expect(observations.react, `${component} React observation`).not.toBeNull();
      expect(
        observations.flutter,
        `${flutterPreview} Flutter observation`,
      ).not.toBeNull();
      expect(observations.react?.bounds.height).toBeGreaterThan(0);
      expect(observations.flutter?.bounds.height).toBeGreaterThan(0);
      expect(observations.react?.parts?.['root']).toBeDefined();
      expect(observations.flutter?.parts?.['root']).toBeDefined();
      if (currentFixture.level === 'geometry') {
        expect(currentFixture.geometry?.compare).toEqual(['bounds', 'parts', 'style']);
        expect(currentFixture.geometry?.tolerance).toBe(0.5);
        expect(Object.keys(observations.react?.style ?? {}).length).toBeGreaterThan(0);
        expect(Object.keys(observations.flutter?.style ?? {}).length).toBeGreaterThan(
          0,
        );
        for (const token of [
          'tokenBorderWidth',
          'tokenDisabledOpacity',
          'tokenFocusColor',
          'tokenFocusOffset',
          'tokenFocusWidth',
        ]) {
          expect(observations.flutter?.style[token], `${component} ${token}`).toBe(
            observations.react?.style[token],
          );
        }
      }
    }
  }, 600_000);
});
