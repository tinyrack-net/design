import { describe, expect, it } from 'vitest';
import {
  tinyrackBorders,
  tinyrackBreakpoints,
  tinyrackControlMetrics,
  tinyrackLayers,
  tinyrackMeasurements,
  tinyrackMotion,
  tinyrackOpacity,
  tinyrackPalettes,
  tinyrackRadii,
  tinyrackSemanticColors,
  tinyrackShadows,
  tinyrackSpacing,
  tinyrackSpinnerMetrics,
  tinyrackTypography,
} from './index.js';
import { tinyrackComponentColors } from './tokens.js';

const cssColorPattern = /^(#[0-9a-f]{6}|#[0-9a-f]{8}|var\(--[a-z0-9-]+\))$/i;
const minimumContrastRatio = 4.5;
const semanticColorNames = [
  'surface',
  'surfaceMuted',
  'surfaceHover',
  'surfaceSelected',
  'surfacePressed',
  'text',
  'textMuted',
  'textPlaceholder',
  'border',
  'borderStrong',
  'controlBorder',
  'controlTrack',
  'focus',
  'surfaceInverse',
  'textInverse',
  'borderInverse',
  'skeletonFill',
  'skeletonHighlight',
  'illustrationFillPrimary',
  'illustrationFillSecondary',
  'illustrationFillTertiary',
  'illustrationDetail',
  'illustrationStroke',
  'illustrationShadow',
  'primary',
  'primaryHover',
  'primaryPressed',
  'primaryForeground',
  'onPrimary',
  'info',
  'infoHover',
  'infoPressed',
  'infoForeground',
  'infoSurface',
  'infoSurfaceSubtle',
  'infoSurfaceHover',
  'infoSurfacePressed',
  'infoBorder',
  'onInfo',
  'success',
  'successHover',
  'successPressed',
  'successForeground',
  'successSurface',
  'successSurfaceSubtle',
  'successSurfaceHover',
  'successSurfacePressed',
  'successBorder',
  'onSuccess',
  'warning',
  'warningHover',
  'warningPressed',
  'warningForeground',
  'warningSurface',
  'warningSurfaceSubtle',
  'warningSurfaceHover',
  'warningSurfacePressed',
  'warningBorder',
  'onWarning',
  'danger',
  'dangerHover',
  'dangerPressed',
  'dangerForeground',
  'dangerSurface',
  'dangerSurfaceSubtle',
  'dangerSurfaceHover',
  'dangerSurfacePressed',
  'dangerBorder',
  'onDanger',
  'scrim',
] as const;

function hexToRgb(hex: string): [number, number, number] {
  const match = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(hex);

  if (!match) {
    throw new Error(`Unsupported color value: ${hex}`);
  }

  const red = match[1];
  const green = match[2];
  const blue = match[3];

  if (!red || !green || !blue) {
    throw new Error(`Unsupported color value: ${hex}`);
  }

  return [
    Number.parseInt(red, 16) / 255,
    Number.parseInt(green, 16) / 255,
    Number.parseInt(blue, 16) / 255,
  ];
}

function relativeLuminance(hex: string) {
  const [red, green, blue] = hexToRgb(hex);
  const linearRed = red <= 0.03928 ? red / 12.92 : ((red + 0.055) / 1.055) ** 2.4;
  const linearGreen =
    green <= 0.03928 ? green / 12.92 : ((green + 0.055) / 1.055) ** 2.4;
  const linearBlue = blue <= 0.03928 ? blue / 12.92 : ((blue + 0.055) / 1.055) ** 2.4;

  return 0.2126 * linearRed + 0.7152 * linearGreen + 0.0722 * linearBlue;
}

function contrastRatio(foreground: string, background: string) {
  const foregroundLuminance = relativeLuminance(foreground);
  const backgroundLuminance = relativeLuminance(background);
  const light = Math.max(foregroundLuminance, backgroundLuminance);
  const dark = Math.min(foregroundLuminance, backgroundLuminance);

  return (light + 0.05) / (dark + 0.05);
}

describe('tinyrack design tokens', () => {
  it('provides exactly the public light and dark functional colors', () => {
    for (const mode of ['light', 'dark'] as const) {
      expect(Object.keys(tinyrackSemanticColors[mode])).toEqual(semanticColorNames);
      expect(Object.keys(tinyrackSemanticColors[mode])).toHaveLength(70);
    }
  });

  it('keeps illustration faces ordered from light to dark in both themes', () => {
    for (const semanticColors of Object.values(tinyrackSemanticColors)) {
      const luminance = [
        semanticColors.illustrationFillPrimary,
        semanticColors.illustrationFillSecondary,
        semanticColors.illustrationFillTertiary,
      ].map(relativeLuminance);
      expect(luminance[0]).toBeGreaterThan(luminance[1] ?? 0);
      expect(luminance[1]).toBeGreaterThan(luminance[2] ?? 0);
      expect(
        relativeLuminance(semanticColors.illustrationFillTertiary),
      ).toBeGreaterThan(relativeLuminance(semanticColors.border));
    }
  });

  it('provides only palette steps consumed by functional colors', () => {
    expect(Object.keys(tinyrackPalettes)).toEqual([
      'neutral',
      'blue',
      'green',
      'amber',
      'red',
    ]);
    expect(Object.keys(tinyrackPalettes.neutral)).toEqual([
      '50',
      '100',
      '200',
      '300',
      '400',
      '500',
      '600',
      '700',
      '800',
      '900',
      '950',
    ]);
    expect(Object.keys(tinyrackPalettes.blue)).toEqual([
      '50',
      '100',
      '200',
      '300',
      '400',
      '600',
      '700',
      '800',
      '900',
      '950',
    ]);
    expect(Object.keys(tinyrackPalettes.green)).toEqual([
      '50',
      '100',
      '200',
      '300',
      '400',
      '600',
      '700',
      '800',
      '900',
      '950',
    ]);
    expect(Object.keys(tinyrackPalettes.amber)).toEqual([
      '50',
      '100',
      '200',
      '300',
      '400',
      '600',
      '800',
      '900',
      '950',
    ]);
    expect(Object.keys(tinyrackPalettes.red)).toEqual([
      '50',
      '100',
      '200',
      '300',
      '400',
      '600',
      '700',
      '800',
      '900',
      '950',
    ]);
    expect(tinyrackPalettes).not.toHaveProperty('brand');
  });

  it('uses valid css color values', () => {
    for (const semanticColors of Object.values(tinyrackSemanticColors)) {
      for (const color of Object.values(semanticColors)) {
        expect(color).toMatch(cssColorPattern);
      }
    }
  });

  it('derives functional colors from base colors with only approved direct values', () => {
    const approvedValues = new Set([
      '#ffffff',
      '#030303',
      '#0000008f',
      '#000000b8',
      '#262d34',
      '#25322a',
      '#342e1e',
      '#332222',
      ...Object.values(tinyrackPalettes).flatMap((palette) => Object.values(palette)),
    ]);
    for (const semanticColors of Object.values(tinyrackSemanticColors)) {
      for (const color of Object.values(semanticColors)) {
        expect(approvedValues.has(color)).toBe(true);
      }
    }
  });

  it('keeps semantic content colors readable on their paired fills', () => {
    for (const semanticColors of Object.values(tinyrackSemanticColors)) {
      for (const state of ['', 'Hover', 'Pressed'] as const) {
        expect(
          contrastRatio(semanticColors.onPrimary, semanticColors[`primary${state}`]),
        ).toBeGreaterThanOrEqual(minimumContrastRatio);
      }
      expect(
        contrastRatio(semanticColors.onDanger, semanticColors.danger),
      ).toBeGreaterThanOrEqual(minimumContrastRatio);
      for (const intent of ['Info', 'Success', 'Warning', 'Danger'] as const) {
        const onColor = semanticColors[`on${intent}`];
        const colorName = intent.toLowerCase() as Lowercase<typeof intent>;
        expect(
          contrastRatio(
            semanticColors[`${colorName}Foreground`],
            semanticColors[`${colorName}SurfaceSubtle`],
          ),
        ).toBeGreaterThanOrEqual(minimumContrastRatio);
        for (const state of ['', 'Hover', 'Pressed'] as const) {
          expect(
            contrastRatio(onColor, semanticColors[`${colorName}${state}`]),
          ).toBeGreaterThanOrEqual(minimumContrastRatio);
        }
      }
      expect(
        contrastRatio(semanticColors.primaryForeground, semanticColors.surface),
      ).toBeGreaterThanOrEqual(minimumContrastRatio);
    }
  });

  it('keeps foundation token groups available from /core', () => {
    expect(tinyrackBreakpoints).toEqual({
      sm: '40rem',
      md: '48rem',
      lg: '64rem',
      xl: '80rem',
    });
    expect(tinyrackPalettes.neutral[950]).toBe('#0a0a0a');
    expect(tinyrackSpacing).toMatchObject({ md: '0.75rem', xl: '1.5rem' });
    expect(tinyrackMeasurements).toMatchObject({
      'measure-md': '12rem',
      'overlay-width-md': '32rem',
    });
    expect(tinyrackComponentColors).toMatchObject({
      'scrim-base': '#000000',
      'window-frame-control-close': '#ff5f57',
    });
    expect(tinyrackSpinnerMetrics).toEqual({
      sizeSm: '0.75rem',
      sizeMd: '1rem',
      sizeLg: '1.25rem',
      strokeWidth: '0.125rem',
      trackOpacity: '24%',
    });
    expect(tinyrackRadii).toMatchObject({ sm: '0.25rem', md: '0.375rem' });
    expect(tinyrackBorders.focus).toEqual({ width: '2px', offset: '2px' });
    expect(tinyrackShadows).toHaveProperty('overlay');
    expect(tinyrackMotion.duration).toEqual({
      fast: '120ms',
      normal: '160ms',
      slow: '180ms',
      number: '600ms',
      loading: '2.4s',
    });
    expect(tinyrackOpacity.disabled).toBe('0.5');
    expect(tinyrackLayers).toMatchObject({
      chrome: 100,
      dropdown: 1000,
      backdrop: 900,
      dialog: 1210,
      tooltip: 1400,
    });
    // Sticky page chrome has to stay under every scrim, or a modal cannot
    // dim the page it blocks.
    expect(tinyrackLayers.chrome).toBeLessThan(tinyrackLayers.backdrop);
    expect(tinyrackControlMetrics).toMatchObject({
      sm: { height: '1.75rem', paddingInline: '0.5rem' },
      md: { height: '2rem', paddingInline: '0.75rem' },
      lg: { height: '2.5rem', paddingInline: '1rem' },
    });
    expect(Object.keys(tinyrackControlMetrics)).toEqual(['sm', 'md', 'lg']);
  });

  it('keeps IBM Plex for prose and IBM Plex Mono for the mono role', () => {
    // Prose roles enumerate only the official variable, Latin, Korean, and
    // Japanese IBM Plex Sans family names. The mono role keeps the generic
    // `monospace` fallback because aligned code remains readable while its
    // dedicated face loads.
    expect(tinyrackTypography.fontStack).toEqual({
      body: '"IBM Plex Sans Variable", "IBM Plex Sans", "IBM Plex Sans KR", "IBM Plex Sans JP"',
      heading:
        '"IBM Plex Sans Variable", "IBM Plex Sans", "IBM Plex Sans KR", "IBM Plex Sans JP"',
      mono: '"IBM Plex Mono", monospace',
    });
    expect(tinyrackTypography).not.toHaveProperty('fontFamily');
    expect(tinyrackTypography.fontWeight).toEqual({
      regular: 400,
      medium: 600,
      heading: 650,
      bold: 700,
      strong: 700,
    });
    // IBM Plex Sans tops out at Bold 700, and the variable build's `wght` axis
    // ends there too, so anything heavier silently renders as 700. Keep every
    // weight inside what the typeface can actually draw.
    for (const weight of Object.values(tinyrackTypography.fontWeight)) {
      expect(weight).toBeLessThanOrEqual(700);
    }
    expect(tinyrackTypography.textStyle.headingLg.fontWeight).toBe('heading');
    expect(tinyrackTypography.fontSize['6xl']).toBe('3.5rem');
    expect(tinyrackTypography.textStyle.displayLg).toEqual({
      fontSize: '6xl',
      lineHeight: 'xs',
      letterSpacing: 'none',
      fontWeight: 'heading',
    });
    expect(JSON.stringify(tinyrackTypography)).not.toContain('Noto Sans');
    expect(JSON.stringify(tinyrackTypography)).not.toContain('system-ui');
    expect(JSON.stringify(tinyrackTypography)).not.toContain('sans-serif');
    // `monospace` is permitted only inside the mono stack.
    expect(tinyrackTypography.fontStack.body).not.toContain('monospace');
    expect(tinyrackTypography.fontStack.heading).not.toContain('monospace');
  });
});
