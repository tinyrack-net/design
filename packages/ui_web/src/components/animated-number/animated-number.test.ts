import { describe, expect, it } from 'vitest';
import {
  createAnimatedNumberTransitionFormatter,
  DEFAULT_ANIMATED_NUMBER_DURATION,
  easeOutCubic,
  interpolateAnimatedNumber,
  normalizeAnimatedNumberDuration,
  serializeNumberFormat,
  tokenizeAnimatedNumber,
} from './animated-number-format.js';

describe('animated number formatting', () => {
  it('normalizes animation timing and interpolation boundaries', () => {
    expect(normalizeAnimatedNumberDuration(undefined)).toBe(
      DEFAULT_ANIMATED_NUMBER_DURATION,
    );
    expect(normalizeAnimatedNumberDuration(Number.NaN)).toBe(
      DEFAULT_ANIMATED_NUMBER_DURATION,
    );
    expect(normalizeAnimatedNumberDuration(-10)).toBe(0);
    expect(normalizeAnimatedNumberDuration(250)).toBe(250);
    expect(easeOutCubic(-1)).toBe(0);
    expect(easeOutCubic(2)).toBe(1);
    expect(interpolateAnimatedNumber(10, 20, 0.5)).toBe(18.75);
  });

  it('serializes locale arrays and format options deterministically', () => {
    expect(
      serializeNumberFormat(['ko-KR', 'en-US'], {
        currency: 'KRW',
        style: 'currency',
      }),
    ).toBe(
      serializeNumberFormat(['ko-KR', 'en-US'], {
        style: 'currency',
        currency: 'KRW',
      }),
    );
    expect(serializeNumberFormat(undefined, undefined)).toBe('\u0001');
  });

  it('keeps interpolation within the fraction precision visible at its endpoints', () => {
    const decimal = new Intl.NumberFormat('en-US');
    const integerTransition = createAnimatedNumberTransitionFormatter(decimal, 42, 867);
    expect(integerTransition.format(536.964)).toBe('537');

    const fractionalTransition = createAnimatedNumberTransitionFormatter(
      decimal,
      1.2,
      2.35,
    );
    expect(fractionalTransition.format(1.775)).toBe('1.78');

    const currency = new Intl.NumberFormat('en-US', {
      currency: 'USD',
      style: 'currency',
    });
    const currencyTransition = createAnimatedNumberTransitionFormatter(
      currency,
      42,
      867,
    );
    expect(currencyTransition.format(536.964)).toBe('$536.96');

    const unit = new Intl.NumberFormat('en-US', {
      style: 'unit',
      unit: 'gigabyte',
      unitDisplay: 'short',
    });
    const unitTransition = createAnimatedNumberTransitionFormatter(
      unit,
      1234.5,
      9876.5,
    );
    expect(unitTransition.format(6933.417)).toBe('6,933.4 GB');

    const percent = new Intl.NumberFormat('en-US', {
      maximumFractionDigits: 1,
      style: 'percent',
    });
    const percentTransition = createAnimatedNumberTransitionFormatter(
      percent,
      0.123,
      0.456,
    );
    expect(percentTransition.format(0.32154)).toBe('32.2%');
  });

  it('keeps interpolation within significant and scientific endpoint precision', () => {
    const compact = new Intl.NumberFormat('en-US', { notation: 'compact' });
    const compactTransition = createAnimatedNumberTransitionFormatter(
      compact,
      1000,
      2000,
    );
    expect(compactTransition.format(1536.964)).toBe('2K');

    const significant = new Intl.NumberFormat('en-US', {
      maximumSignificantDigits: 5,
    });
    const significantTransition = createAnimatedNumberTransitionFormatter(
      significant,
      1000,
      2000,
    );
    expect(significantTransition.format(1536.964)).toBe('1,537');

    const scientific = new Intl.NumberFormat('en-US', { notation: 'scientific' });
    const scientificTransition = createAnimatedNumberTransitionFormatter(
      scientific,
      1000,
      2000,
    );
    expect(scientificTransition.format(1536.964)).toBe('2E3');

    const arabic = new Intl.NumberFormat('ar-EG');
    const arabicTransition = createAnimatedNumberTransitionFormatter(arabic, 42, 867);
    expect(
      arabicTransition.formatToParts(536.964).some((part) => part.type === 'fraction'),
    ).toBe(false);

    const arabicSignificant = new Intl.NumberFormat('ar-EG', {
      maximumSignificantDigits: 5,
    });
    expect(
      createAnimatedNumberTransitionFormatter(arabicSignificant, 1, 9)
        .formatToParts(5.36964)
        .some((part) => part.type === 'fraction'),
    ).toBe(false);
  });

  it('assigns stable place-value keys across localized formatted output', () => {
    const formatter = new Intl.NumberFormat('en-US', {
      currency: 'USD',
      minimumFractionDigits: 2,
      style: 'currency',
    });
    const formatted = tokenizeAnimatedNumber(formatter, -1234.5);

    expect(formatted.text).toBe('-$1,234.50');
    expect(
      formatted.tokens
        .filter((token) => token.kind === 'digit')
        .map((token) => token.key),
    ).toEqual([
      'digit:integer:3',
      'digit:integer:2',
      'digit:integer:1',
      'digit:integer:0',
      'digit:fraction:0',
      'digit:fraction:1',
    ]);
  });

  it('recognizes non-Latin digits and exponent digits', () => {
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
  });
});
