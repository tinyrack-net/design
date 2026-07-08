import { describe, expect, it } from 'vitest';
import {
  tinyrackAvatarContract,
  tinyrackBadgeContract,
  tinyrackBreadcrumbsContract,
  tinyrackControlContract,
  tinyrackIndicatorContract,
  tinyrackKbdContract,
  tinyrackListContract,
  tinyrackLoaderContract,
  tinyrackMenuContract,
  tinyrackOverlayContract,
  tinyrackProgressContract,
  tinyrackRadialProgressContract,
  tinyrackRangeContract,
  tinyrackRatingContract,
  tinyrackSelectionControlContract,
  tinyrackSemanticColors,
  tinyrackStepperContract,
  tinyrackSwitchContract,
  tinyrackTableContract,
  tinyrackTabsContract,
  tinyrackTimelineContract,
  tinyrackTokens,
  tinyrackTooltipContract,
  tinyrackTypography,
} from '../exports/tokens.js';

const cssColorPattern = /^(#[0-9a-f]{6}|#[0-9a-f]{8}|var\(--[a-z0-9-]+\))$/i;
const minimumContrastRatio = 4.5;

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
  it('provides required light and dark semantic colors', () => {
    for (const mode of ['light', 'dark'] as const) {
      expect(tinyrackSemanticColors[mode]).toMatchObject({
        background: expect.any(String),
        surface: expect.any(String),
        text: expect.any(String),
        border: expect.any(String),
        focus: expect.any(String),
        primary: expect.any(String),
        secondary: expect.any(String),
        success: expect.any(String),
        warning: expect.any(String),
        error: expect.any(String),
        info: expect.any(String),
      });
    }
  });

  it('uses valid css color values', () => {
    for (const semanticColors of Object.values(tinyrackSemanticColors)) {
      for (const color of Object.values(semanticColors)) {
        expect(color).toMatch(cssColorPattern);
      }
    }
  });

  it('keeps semantic content colors readable on their paired fills', () => {
    for (const semanticColors of Object.values(tinyrackSemanticColors)) {
      for (const tone of [
        'primary',
        'secondary',
        'accent',
        'success',
        'warning',
        'error',
        'info',
      ] as const) {
        expect(
          contrastRatio(semanticColors[`${tone}Content`], semanticColors[tone]),
        ).toBeGreaterThanOrEqual(minimumContrastRatio);
      }
    }
  });

  it('keeps shared tokens library-agnostic', () => {
    const serialized = JSON.stringify(tinyrackTokens).toLowerCase();
    expect(serialized).not.toContain('mantine');
    expect(serialized).not.toContain('daisy');
    expect(serialized).not.toContain('starlight');
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
      korean: 'var(--tinyrack-font-korean)',
      japanese: 'var(--tinyrack-font-japanese)',
    });
    expect(JSON.stringify(tinyrackTypography)).not.toContain('Noto Sans');
    expect(JSON.stringify(tinyrackTypography)).not.toContain('system-ui');
    expect(JSON.stringify(tinyrackTypography)).not.toContain('sans-serif');
    expect(JSON.stringify(tinyrackTypography)).not.toContain('monospace');
  });

  it('uses named typography scale keys instead of legacy descriptor keys', () => {
    expect(tinyrackTypography.fontSize).toMatchObject({
      xs: expect.any(String),
      sm: expect.any(String),
      md: expect.any(String),
      lg: expect.any(String),
      xl: expect.any(String),
    });
    expect(tinyrackTypography.lineHeight).toMatchObject({
      xs: expect.any(String),
      sm: expect.any(String),
      md: expect.any(String),
      lg: expect.any(String),
      xl: expect.any(String),
    });
    expect(tinyrackTypography.letterSpacing).toMatchObject({
      none: expect.any(String),
      sm: expect.any(String),
      md: expect.any(String),
      lg: expect.any(String),
      xl: expect.any(String),
    });
    expect(tinyrackTypography.lineHeight).not.toHaveProperty('tight');
    expect(tinyrackTypography.lineHeight).not.toHaveProperty('normal');
    expect(tinyrackTypography.lineHeight).not.toHaveProperty('relaxed');
    expect(tinyrackTypography.letterSpacing).not.toHaveProperty('wide');
  });

  it('defines a shared control size contract for cross-library component parity', () => {
    expect(tinyrackControlContract.sizes).toMatchObject({
      xs: expect.objectContaining({ height: '1.5rem' }),
      sm: expect.objectContaining({ height: '2rem', paddingY: '0.375rem' }),
      md: expect.objectContaining({ height: '2.5rem' }),
      lg: expect.objectContaining({ height: '3rem' }),
      xl: expect.objectContaining({ height: '3.5rem' }),
    });
    expect(tinyrackControlContract.radius).toBe('0.25rem');
    expect(tinyrackControlContract.fontWeight).toBe('600');
  });

  it('defines compact component contracts for cross-library Badge and Kbd parity', () => {
    expect(tinyrackBadgeContract.sizes).toMatchObject({
      xs: expect.objectContaining({ height: '1rem', fontSize: '0.625rem' }),
      sm: expect.objectContaining({ height: '1.25rem', fontSize: '0.75rem' }),
      md: expect.objectContaining({ height: '1.5rem', fontSize: '0.875rem' }),
      lg: expect.objectContaining({ height: '1.75rem', fontSize: '1rem' }),
      xl: expect.objectContaining({ height: '2rem', fontSize: '1.125rem' }),
    });
    expect(tinyrackBadgeContract.radius).toBe(tinyrackControlContract.radius);
    expect(tinyrackKbdContract.sizes.sm).toEqual(tinyrackBadgeContract.sizes.sm);
    expect(tinyrackKbdContract.borderBottomWidth).toBe('2px');
  });

  it('defines selection control contracts for cross-library form state parity', () => {
    expect(tinyrackSelectionControlContract.sizes).toMatchObject({
      xs: expect.objectContaining({ size: '1rem', padding: '0.125rem' }),
      sm: expect.objectContaining({ size: '1.25rem', padding: '0.1875rem' }),
      md: expect.objectContaining({ size: '1.5rem', padding: '0.25rem' }),
      lg: expect.objectContaining({ size: '1.75rem', padding: '0.3125rem' }),
      xl: expect.objectContaining({ size: '2rem', padding: '0.375rem' }),
    });
    expect(tinyrackSelectionControlContract.checkboxRadius).toBe(
      tinyrackControlContract.radius,
    );
    expect(tinyrackSelectionControlContract.radioRadius).toBe('9999px');
    expect(tinyrackSwitchContract.radius).toBe('9999px');
    expect(tinyrackSwitchContract.sizes.md.height).toBe('1.5rem');
  });

  it('defines progress size contracts for cross-library progress parity', () => {
    expect(tinyrackProgressContract.sizes).toMatchObject({
      xs: { size: '0.25rem' },
      sm: { size: '0.375rem' },
      md: { size: '0.5rem' },
      lg: { size: '0.75rem' },
      xl: { size: '1rem' },
    });
    expect(tinyrackProgressContract.radius).toBe(tinyrackControlContract.radius);
  });

  it('defines visual status contracts for cross-library Avatar, Loader and Rating parity', () => {
    expect(tinyrackAvatarContract.sizes).toMatchObject({
      xs: { size: '1.5rem' },
      sm: { size: '2rem' },
      md: { size: '2.5rem' },
      lg: { size: '3rem' },
      xl: { size: '3.5rem' },
    });
    expect(tinyrackAvatarContract.radius).toBe('9999px');
    expect(tinyrackIndicatorContract.sizes.md.size).toBe('0.75rem');
    expect(tinyrackLoaderContract.sizes.md.height).toBe('1.5rem');
    expect(tinyrackRatingContract.sizes.md.height).toBe('1.5rem');
  });

  it('defines radial progress contracts for cross-library progress ring parity', () => {
    expect(tinyrackRadialProgressContract.sizes).toMatchObject({
      xs: { size: '3rem', thickness: '0.3rem' },
      sm: { size: '4rem', thickness: '0.4rem' },
      md: { size: '5rem', thickness: '0.5rem' },
      lg: { size: '6rem', thickness: '0.6rem' },
      xl: { size: '7rem', thickness: '0.7rem' },
    });
    expect(tinyrackRadialProgressContract.color).toBe('var(--tinyrack-primary)');
  });

  it('defines navigation and data-display contracts for cross-library parity', () => {
    expect(tinyrackBreadcrumbsContract.fontSize).toBe(tinyrackTypography.fontSize.sm);
    expect(tinyrackListContract.radius).toBe('var(--tinyrack-radius-box)');
    expect(tinyrackTableContract.sizes).toMatchObject({
      xs: expect.objectContaining({ fontSize: '0.6875rem', paddingX: '0.5rem' }),
      md: expect.objectContaining({ fontSize: '0.875rem', paddingY: '0.5rem' }),
      xl: expect.objectContaining({ fontSize: '1.125rem', paddingX: '1.5rem' }),
    });
    expect(tinyrackTabsContract.sizes.md).toMatchObject({
      fontSize: '0.875rem',
      height: '2.5rem',
      paddingX: '1rem',
    });
    expect(tinyrackTimelineContract.lineWidth).toBe('0.375rem');
    expect(tinyrackTimelineContract.activeTextColor).toBe(
      'var(--tinyrack-primary-contrast)',
    );
  });

  it('defines Stepper and Range contracts for size and state parity', () => {
    expect(tinyrackStepperContract.sizes.md).toMatchObject({
      fontSize: '0.875rem',
      iconSize: '2.5rem',
      lineWidth: '0.5rem',
    });
    expect(tinyrackStepperContract.activeTextColor).toBe(
      'var(--tinyrack-primary-contrast)',
    );
    expect(tinyrackRangeContract.sizes.md).toMatchObject({
      thumbSize: '1.5rem',
      trackSize: '0.75rem',
    });
    expect(tinyrackRangeContract.focusColor).toBe('var(--tinyrack-focus)');
  });

  it('defines overlay contracts for Menu, Modal, Drawer and Tooltip parity', () => {
    expect(tinyrackMenuContract.sizes.md).toMatchObject({
      fontSize: '0.875rem',
      paddingX: '0.75rem',
      paddingY: '0.375rem',
    });
    expect(tinyrackMenuContract.activeColor).toBe('var(--tinyrack-primary-contrast)');
    expect(tinyrackOverlayContract).toMatchObject({
      background: 'var(--tinyrack-surface)',
      borderColor: 'var(--tinyrack-border)',
      overlayColor: 'rgb(0 0 0 / 0.4)',
      shadow: 'none',
    });
    expect(tinyrackTooltipContract).toMatchObject({
      background: 'var(--tinyrack-primary)',
      color: 'var(--tinyrack-primary-contrast)',
      radius: tinyrackControlContract.radius,
    });
  });
});
