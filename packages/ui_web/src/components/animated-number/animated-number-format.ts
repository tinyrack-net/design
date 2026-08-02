export const DEFAULT_ANIMATED_NUMBER_DURATION = 600;

export type AnimatedNumberToken = {
  key: string;
  kind: 'digit' | 'static';
  type: Intl.NumberFormatPartTypes;
  value: string;
};

export type TokenizedAnimatedNumber = {
  text: string;
  tokens: AnimatedNumberToken[];
};

const digitPartTypes = new Set<Intl.NumberFormatPartTypes>([
  'integer',
  'fraction',
  'exponentInteger',
]);

export function serializeNumberFormat(
  locale: Intl.LocalesArgument | undefined,
  format: Intl.NumberFormatOptions | undefined,
) {
  const localeKey = Array.isArray(locale)
    ? locale.map((item) => String(item)).join('\u0000')
    : String(locale ?? '');
  const formatKey = Object.entries(format ?? {})
    .filter(([, value]) => value !== undefined)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, value]) => `${key}:${String(value)}`)
    .join('\u0000');

  return `${localeKey}\u0001${formatKey}`;
}

export function normalizeAnimatedNumberDuration(duration: number | undefined) {
  if (duration === undefined || !Number.isFinite(duration)) {
    return DEFAULT_ANIMATED_NUMBER_DURATION;
  }

  return Math.max(0, duration);
}

export function easeOutCubic(progress: number) {
  const clampedProgress = Math.min(1, Math.max(0, progress));
  return 1 - (1 - clampedProgress) ** 3;
}

export function interpolateAnimatedNumber(from: number, to: number, progress: number) {
  return from + (to - from) * easeOutCubic(progress);
}

function formattedFractionDigits(formatter: Intl.NumberFormat, value: number) {
  return formatter
    .formatToParts(value)
    .filter((part) => part.type === 'fraction')
    .reduce((count, part) => count + Array.from(part.value).length, 0);
}

function createDigitGlyphMap(formatter: Intl.NumberFormat) {
  const { locale, numberingSystem } = formatter.resolvedOptions();
  const digitFormatter = new Intl.NumberFormat(locale, {
    numberingSystem,
    useGrouping: false,
  });
  const glyphs = new Map<string, number>();

  for (let digit = 0; digit <= 9; digit += 1) {
    for (const glyph of Array.from(digitFormatter.format(digit))) {
      glyphs.set(glyph, digit);
    }
  }

  return glyphs;
}

function formattedSignificantDigits(formatter: Intl.NumberFormat, value: number) {
  const digitGlyphs = createDigitGlyphMap(formatter);
  const digits = formatter
    .formatToParts(value)
    .filter((part) => part.type === 'integer' || part.type === 'fraction')
    .flatMap((part) =>
      Array.from(part.value).flatMap((glyph) => {
        const digit = digitGlyphs.get(glyph);
        return digit === undefined ? [] : [digit];
      }),
    );
  const firstSignificantDigit = digits.findIndex((digit) => digit !== 0);
  return firstSignificantDigit === -1
    ? Math.min(1, digits.length)
    : digits.length - firstSignificantDigit;
}

export function createAnimatedNumberTransitionFormatter(
  formatter: Intl.NumberFormat,
  from: number,
  to: number,
) {
  const resolved = formatter.resolvedOptions();
  if (
    resolved.maximumSignificantDigits !== undefined &&
    resolved.minimumSignificantDigits !== undefined
  ) {
    const endpointSignificantDigits = Math.max(
      formattedSignificantDigits(formatter, from),
      formattedSignificantDigits(formatter, to),
    );
    const maximumSignificantDigits = Math.min(
      resolved.maximumSignificantDigits,
      Math.max(resolved.minimumSignificantDigits, endpointSignificantDigits),
    );
    if (maximumSignificantDigits === resolved.maximumSignificantDigits) {
      return formatter;
    }

    const { locale, ...options } = resolved;
    return new Intl.NumberFormat(locale, {
      ...options,
      maximumSignificantDigits,
    });
  }

  if (
    resolved.maximumFractionDigits === undefined ||
    resolved.minimumFractionDigits === undefined
  ) {
    return formatter;
  }

  const endpointFractionDigits = Math.max(
    formattedFractionDigits(formatter, from),
    formattedFractionDigits(formatter, to),
  );
  const maximumFractionDigits = Math.min(
    resolved.maximumFractionDigits,
    Math.max(resolved.minimumFractionDigits, endpointFractionDigits),
  );
  if (maximumFractionDigits === resolved.maximumFractionDigits) return formatter;

  const { locale, ...options } = resolved;
  return new Intl.NumberFormat(locale, {
    ...options,
    maximumFractionDigits,
  });
}

function createDigitGlyphs(formatter: Intl.NumberFormat) {
  return new Set(createDigitGlyphMap(formatter).keys());
}

export function tokenizeAnimatedNumber(
  formatter: Intl.NumberFormat,
  value: number,
): TokenizedAnimatedNumber {
  const parts = formatter.formatToParts(value);
  const digitGlyphs = createDigitGlyphs(formatter);
  const digitTotals = new Map<Intl.NumberFormatPartTypes, number>();

  for (const part of parts) {
    if (!digitPartTypes.has(part.type)) continue;
    const count = Array.from(part.value).filter((glyph) =>
      digitGlyphs.has(glyph),
    ).length;
    digitTotals.set(part.type, (digitTotals.get(part.type) ?? 0) + count);
  }

  const digitIndexes = new Map<Intl.NumberFormatPartTypes, number>();
  const staticOccurrences = new Map<string, number>();
  const tokens: AnimatedNumberToken[] = [];

  for (const part of parts) {
    for (const glyph of Array.from(part.value)) {
      if (digitPartTypes.has(part.type) && digitGlyphs.has(glyph)) {
        const index = digitIndexes.get(part.type) ?? 0;
        const position =
          part.type === 'fraction'
            ? index
            : (digitTotals.get(part.type) as number) - index - 1;
        digitIndexes.set(part.type, index + 1);
        tokens.push({
          key: `digit:${part.type}:${position}`,
          kind: 'digit',
          type: part.type,
          value: glyph,
        });
        continue;
      }

      const occurrenceKey = `${part.type}:${glyph}`;
      const occurrence = staticOccurrences.get(occurrenceKey) ?? 0;
      staticOccurrences.set(occurrenceKey, occurrence + 1);
      tokens.push({
        key: `static:${occurrenceKey}:${occurrence}`,
        kind: 'static',
        type: part.type,
        value: glyph,
      });
    }
  }

  return { text: parts.map((part) => part.value).join(''), tokens };
}
