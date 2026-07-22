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

const cssColorPattern = /^(#[0-9a-f]{6}|#[0-9a-f]{8}|var\(--[a-z0-9-]+\))$/i;
const minimumContrastRatio = 4.5;
const semanticColorNames = [
  'canvas',
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
  'primary',
  'primaryHover',
  'primaryPressed',
  'onPrimary',
  'info',
  'infoHover',
  'infoPressed',
  'infoSurface',
  'infoSurfaceSubtle',
  'infoSurfaceHover',
  'infoSurfacePressed',
  'infoBorder',
  'onInfo',
  'success',
  'successHover',
  'successPressed',
  'successSurface',
  'successSurfaceSubtle',
  'successSurfaceHover',
  'successSurfacePressed',
  'successBorder',
  'onSuccess',
  'warning',
  'warningHover',
  'warningPressed',
  'warningSurface',
  'warningSurfaceSubtle',
  'warningSurfaceHover',
  'warningSurfacePressed',
  'warningBorder',
  'onWarning',
  'danger',
  'dangerHover',
  'dangerPressed',
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
      expect(Object.keys(tinyrackSemanticColors[mode])).toHaveLength(60);
    }
  });

  it('provides five complete base color ramps without exposing a duplicate brand ramp', () => {
    expect(Object.keys(tinyrackPalettes)).toEqual([
      'neutral',
      'blue',
      'green',
      'amber',
      'red',
    ]);
    for (const palette of Object.values(tinyrackPalettes)) {
      expect(Object.keys(palette)).toEqual([
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
    }
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
      expect(
        contrastRatio(semanticColors.onPrimary, semanticColors.primary),
      ).toBeGreaterThanOrEqual(minimumContrastRatio);
      expect(
        contrastRatio(semanticColors.onDanger, semanticColors.danger),
      ).toBeGreaterThanOrEqual(minimumContrastRatio);
      for (const intent of ['Info', 'Success', 'Warning', 'Danger'] as const) {
        const onColor = semanticColors[`on${intent}`];
        const colorName = intent.toLowerCase() as Lowercase<typeof intent>;
        expect(
          contrastRatio(
            semanticColors[colorName],
            semanticColors[`${colorName}SurfaceSubtle`],
          ),
        ).toBeGreaterThanOrEqual(minimumContrastRatio);
        for (const state of ['', 'Hover', 'Pressed'] as const) {
          expect(
            contrastRatio(onColor, semanticColors[`${colorName}${state}`]),
          ).toBeGreaterThanOrEqual(minimumContrastRatio);
        }
      }
    }
  });

  it('keeps foundation token groups available from /core', () => {
    expect(tinyrackBreakpoints).toEqual({
      xs: '24rem',
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
      'control-width-md': '20rem',
    });
    expect(tinyrackSpinnerMetrics).toEqual({
      sizeSm: '1rem',
      sizeMd: '1.25rem',
      sizeLg: '1.75rem',
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
      loading: '2.4s',
    });
    expect(tinyrackOpacity.disabled).toBe('0.5');
    expect(tinyrackLayers).toMatchObject({
      dropdown: 1000,
      backdrop: 900,
      dialog: 1210,
      tooltip: 1400,
    });
    expect(tinyrackControlMetrics).toMatchObject({
      sm: { height: '2rem', paddingInline: '0.75rem' },
      md: { height: '2.5rem', paddingInline: '1rem' },
      lg: { height: '3rem', paddingInline: '1.25rem' },
    });
  });

  it('uses a single IBM Plex Sans font stack without explicit fallback families', () => {
    expect(Object.values(tinyrackTypography.fontStack)).toEqual(
      Array.from(
        { length: Object.keys(tinyrackTypography.fontStack).length },
        () => '"IBM Plex Sans"',
      ),
    );
    expect(tinyrackTypography.fontFamily).toEqual({
      body: 'var(--tinyrack-font-body)',
      heading: 'var(--tinyrack-font-heading)',
      mono: 'var(--tinyrack-font-mono)',
    });
    expect(tinyrackTypography.fontWeight).toEqual({
      regular: 400,
      medium: 600,
      heading: 650,
      bold: 700,
      strong: 800,
    });
    expect(tinyrackTypography.textStyle.headingLg.fontWeight).toBe('heading');
    expect(JSON.stringify(tinyrackTypography)).not.toContain('Noto Sans');
    expect(JSON.stringify(tinyrackTypography)).not.toContain('system-ui');
    expect(JSON.stringify(tinyrackTypography)).not.toContain('sans-serif');
    expect(JSON.stringify(tinyrackTypography)).not.toContain('monospace');
  });
});
