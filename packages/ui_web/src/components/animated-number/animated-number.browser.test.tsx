import '../../core/core.css';
import './animated-number.css';
import { createRef } from 'react';
import { afterEach, expect, test, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import {
  createAnimatedNumberTransitionFormatter,
  DEFAULT_ANIMATED_NUMBER_DURATION,
  easeOutCubic,
  interpolateAnimatedNumber,
  normalizeAnimatedNumberDuration,
  serializeNumberFormat,
  tokenizeAnimatedNumber,
} from './animated-number-format.js';
import { TRAnimatedNumber } from './index.js';

afterEach(() => {
  vi.restoreAllMocks();
});

async function waitForAnimationFrames(count = 2) {
  for (let frame = 0; frame < count; frame += 1) {
    await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
  }
}

function mockReducedMotion(initialMatches: boolean) {
  const listeners = new Set<() => void>();
  let matches = initialMatches;
  const media = {
    addEventListener: (_type: string, listener: () => void) => {
      listeners.add(listener);
    },
    addListener: (listener: () => void) => {
      listeners.add(listener);
    },
    dispatch(nextMatches: boolean) {
      matches = nextMatches;
      for (const listener of listeners) listener();
    },
    dispatchEvent: () => true,
    get matches() {
      return matches;
    },
    media: '(prefers-reduced-motion: reduce)',
    onchange: null,
    removeEventListener: (_type: string, listener: () => void) => {
      listeners.delete(listener);
    },
    removeListener: (listener: () => void) => {
      listeners.delete(listener);
    },
  } as unknown as MediaQueryList & { dispatch(matches: boolean): void };
  vi.spyOn(window, 'matchMedia').mockReturnValue(media);
  return media;
}

test('formats an accessible static value and preserves native span props', async () => {
  const onClick = vi.fn();
  const ref = createRef<HTMLSpanElement>();
  await render(
    <TRAnimatedNumber
      aria-live="polite"
      className="consumer-number"
      data-testid="number"
      format={{ currency: 'USD', style: 'currency' }}
      locale="en-US"
      onClick={onClick}
      ref={ref}
      style={{ color: 'rgb(12, 34, 56)' }}
      value={1234.5}
    />,
  );

  expect(ref.current).toHaveClass('tr-animated-number', 'consumer-number');
  expect(ref.current).toHaveAttribute('aria-live', 'polite');
  expect(ref.current?.dataset['animation']).toBe('roll');
  expect(ref.current?.dataset['rollDirection']).toBe('auto');
  expect(ref.current?.style.getPropertyValue('--tr-animated-number-duration')).toBe('');
  expect(getComputedStyle(ref.current as HTMLElement).color).toBe('rgb(12, 34, 56)');
  expect(
    ref.current?.querySelector('.tr-animated-number-accessible')?.textContent,
  ).toBe('$1,234.50');
  expect(ref.current?.querySelector('[aria-hidden="true"]')?.textContent).toBe(
    '$1,234.50',
  );

  ref.current?.click();
  expect(onClick).toHaveBeenCalledOnce();
});

test('rolls changed digits in the automatic increase and decrease directions', async () => {
  const view = await render(<TRAnimatedNumber duration={40} value={19} />);
  await view.rerender(<TRAnimatedNumber duration={40} value={20} />);

  await expect
    .poll(() =>
      document
        .querySelector('.tr-animated-number-roll')
        ?.getAttribute('data-direction'),
    )
    .toBe('up');
  expect(document.querySelectorAll('.tr-animated-number-incoming').length).toBe(2);
  expect(document.querySelectorAll('.tr-animated-number-outgoing').length).toBe(2);
  await expect
    .poll(
      () => document.querySelector('.tr-animated-number-presentation')?.textContent,
      { timeout: 1_000 },
    )
    .toBe('20');

  await view.rerender(<TRAnimatedNumber duration={40} value={18} />);
  await expect
    .poll(() =>
      document
        .querySelector('.tr-animated-number-roll')
        ?.getAttribute('data-direction'),
    )
    .toBe('down');
});

test('allows the roll direction to be forced independently from the value trend', async () => {
  const view = await render(
    <TRAnimatedNumber duration={40} rollDirection="up" value={20} />,
  );
  await view.rerender(<TRAnimatedNumber duration={40} rollDirection="up" value={10} />);

  await expect
    .poll(() =>
      document
        .querySelector('.tr-animated-number-roll')
        ?.getAttribute('data-direction'),
    )
    .toBe('up');
});

test.each([
  'auto',
  'up',
  'down',
] as const)('does not expose interpolation-only decimals when an active %s roll is retargeted', async (rollDirection) => {
  const view = await render(
    <TRAnimatedNumber duration={1_000} rollDirection={rollDirection} value={1248} />,
  );
  await view.rerender(
    <TRAnimatedNumber duration={1_000} rollDirection={rollDirection} value={1373} />,
  );
  await waitForAnimationFrames();
  await view.rerender(
    <TRAnimatedNumber duration={1_000} rollDirection={rollDirection} value={1498} />,
  );

  const presentation = document.querySelector('.tr-animated-number-presentation');
  expect(presentation?.textContent).not.toContain('.');
  expect(
    Array.from(
      document.querySelectorAll('.tr-animated-number-departing'),
      (element) => element.textContent,
    ),
  ).not.toContain('.');
});

test('keeps unit precision and suffix placement stable when an active roll is retargeted', async () => {
  const format = {
    style: 'unit',
    unit: 'gigabyte',
    unitDisplay: 'short',
  } as const;
  const view = await render(
    <TRAnimatedNumber duration={1_000} format={format} locale="en-US" value={1234.5} />,
  );
  await view.rerender(
    <TRAnimatedNumber duration={1_000} format={format} locale="en-US" value={9876.5} />,
  );
  await waitForAnimationFrames();
  await view.rerender(
    <TRAnimatedNumber duration={1_000} format={format} locale="en-US" value={1234.5} />,
  );

  const presentation = document.querySelector('.tr-animated-number-presentation');
  expect(presentation?.textContent?.match(/\./g)).toEqual(['.']);
  expect(document.querySelector('.tr-animated-number-removed')).toBeNull();
  expect(document.querySelectorAll('.tr-animated-number-departing')).toHaveLength(0);
});

test('animates newly added places and settles equal formatted values', async () => {
  const view = await render(<TRAnimatedNumber duration={40} value={99} />);
  await view.rerender(<TRAnimatedNumber duration={40} value={100} />);
  await expect
    .poll(() => document.querySelectorAll('.tr-animated-number-incoming').length)
    .toBe(3);

  await expect
    .poll(
      () => document.querySelector('.tr-animated-number-presentation')?.textContent,
      { timeout: 1_000 },
    )
    .toBe('100');
  await view.rerender(<TRAnimatedNumber duration={40} value={99} />);
  await expect
    .poll(() => document.querySelectorAll('.tr-animated-number-departing').length)
    .toBeGreaterThan(0);

  await view.rerender(
    <TRAnimatedNumber
      duration={40}
      format={{ maximumFractionDigits: 0 }}
      value={100.1}
    />,
  );
  await view.rerender(
    <TRAnimatedNumber
      duration={40}
      format={{ maximumFractionDigits: 0 }}
      value={100.2}
    />,
  );
  expect(document.querySelector('.tr-animated-number-roll')).toBeNull();
  expect(document.querySelector('.tr-animated-number-presentation')?.textContent).toBe(
    '100',
  );
});

test('interpolates count mode and retargets an active animation', async () => {
  const view = await render(
    <TRAnimatedNumber animation="count" duration={160} value={0} />,
  );
  await view.rerender(
    <TRAnimatedNumber animation="count" duration={160} value={100} />,
  );

  await expect
    .poll(
      () =>
        document.querySelector<HTMLElement>('.tr-animated-number-visual')?.dataset[
          'animating'
        ],
    )
    .toBe('true');
  const intermediate = document.querySelector(
    '.tr-animated-number-visual',
  )?.textContent;
  expect(intermediate).not.toBe('100');
  expect(intermediate).toMatch(/^\d+$/);

  await view.rerender(<TRAnimatedNumber animation="count" duration={40} value={200} />);
  await expect
    .poll(
      () => document.querySelector('.tr-animated-number-presentation')?.textContent,
      { timeout: 1_000 },
    )
    .toBe('200');
});

test('settles immediately for zero duration, format changes, and non-finite values', async () => {
  const view = await render(<TRAnimatedNumber duration={Number.NaN} value={10} />);
  await view.rerender(<TRAnimatedNumber duration={0} value={20} />);
  expect(document.querySelector('.tr-animated-number-presentation')?.textContent).toBe(
    '20',
  );

  await view.rerender(
    <TRAnimatedNumber
      duration={-5}
      format={{ currency: 'KRW', style: 'currency' }}
      locale="ko-KR"
      value={20}
    />,
  );
  expect(document.querySelector('.tr-animated-number-presentation')?.textContent).toBe(
    '₩20',
  );

  await view.rerender(<TRAnimatedNumber value={Number.POSITIVE_INFINITY} />);
  expect(document.querySelector('.tr-animated-number-presentation')?.textContent).toBe(
    '∞',
  );
  await view.rerender(<TRAnimatedNumber value={1} />);
  expect(document.querySelector('.tr-animated-number-presentation')?.textContent).toBe(
    '1',
  );
});

test('honors reduced motion initially and when the preference changes', async () => {
  const media = mockReducedMotion(true);
  const view = await render(<TRAnimatedNumber duration={200} value={1} />);
  await expect.poll(() => window.matchMedia).toHaveBeenCalled();
  await view.rerender(<TRAnimatedNumber duration={200} value={2} />);
  expect(document.querySelector('.tr-animated-number-roll')).toBeNull();
  expect(document.querySelector('.tr-animated-number-presentation')?.textContent).toBe(
    '2',
  );

  media.dispatch(false);
  await view.rerender(<TRAnimatedNumber duration={200} value={3} />);
  await expect
    .poll(() => document.querySelector('.tr-animated-number-roll'))
    .not.toBeNull();
  media.dispatch(true);
  await expect
    .poll(() => document.querySelector('.tr-animated-number-presentation')?.textContent)
    .toBe('3');
  expect(document.querySelector('.tr-animated-number-roll')).toBeNull();
});

test('covers locale tokenization and timing helpers in the browser bundle', () => {
  expect(normalizeAnimatedNumberDuration(undefined)).toBe(
    DEFAULT_ANIMATED_NUMBER_DURATION,
  );
  expect(normalizeAnimatedNumberDuration(Number.POSITIVE_INFINITY)).toBe(
    DEFAULT_ANIMATED_NUMBER_DURATION,
  );
  expect(normalizeAnimatedNumberDuration(-1)).toBe(0);
  expect(normalizeAnimatedNumberDuration(75)).toBe(75);
  expect(easeOutCubic(-1)).toBe(0);
  expect(easeOutCubic(2)).toBe(1);
  expect(interpolateAnimatedNumber(0, 8, 0.5)).toBe(7);
  expect(
    serializeNumberFormat(['ar-EG', 'en-US'], {
      style: undefined,
      useGrouping: false,
    }),
  ).toBe(
    serializeNumberFormat(['ar-EG', 'en-US'], {
      useGrouping: false,
    }),
  );

  const arabic = tokenizeAnimatedNumber(
    new Intl.NumberFormat('ar-EG', { maximumFractionDigits: 1 }),
    1234.5,
  );
  const scientific = tokenizeAnimatedNumber(
    new Intl.NumberFormat('en-US', { notation: 'scientific' }),
    1200,
  );
  expect(arabic.text).not.toMatch(/[0-9]/);
  expect(arabic.tokens.filter((token) => token.kind === 'digit')).toHaveLength(5);
  expect(
    scientific.tokens.some((token) => token.key.startsWith('digit:exponentInteger')),
  ).toBe(true);

  const decimal = new Intl.NumberFormat('en-US');
  expect(
    createAnimatedNumberTransitionFormatter(decimal, 42, 867).format(536.964),
  ).toBe('537');
  expect(
    createAnimatedNumberTransitionFormatter(decimal, 1.2, 2.35).format(1.775),
  ).toBe('1.78');

  const currency = new Intl.NumberFormat('en-US', {
    currency: 'USD',
    style: 'currency',
  });
  expect(createAnimatedNumberTransitionFormatter(currency, 42, 867)).toBe(currency);

  const compact = new Intl.NumberFormat('en-US', { notation: 'compact' });
  expect(
    createAnimatedNumberTransitionFormatter(compact, 1000, 2000).format(1536.964),
  ).toBe('2K');
  expect(createAnimatedNumberTransitionFormatter(compact, 1000, 1500)).toBe(compact);

  const significantZero = new Intl.NumberFormat('en-US', {
    maximumSignificantDigits: 5,
  });
  expect(
    createAnimatedNumberTransitionFormatter(significantZero, 0, 9).format(5.36964),
  ).toBe('5');
});

test('defines the semantic duration fallback and reduced-motion override', () => {
  const styles = [...document.styleSheets].flatMap((sheet) => [...sheet.cssRules]);
  expect(
    styles.some((rule) => rule.cssText.includes('--_tr-animated-number-duration')),
  ).toBe(true);
  const styleText = styles.map((rule) => rule.cssText).join('\n');
  expect(styleText).toContain('(prefers-reduced-motion: reduce)');
  expect(styleText).toContain('.tr-animated-number-outgoing');
});
