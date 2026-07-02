import { describe, expect, it } from 'vitest';
import { tinyrackSemanticColors, tinyrackTokens } from './index.js';

const cssColorPattern = /^(#[0-9a-f]{6}|#[0-9a-f]{8}|var\(--[a-z0-9-]+\))$/i;
const minimumContrastRatio = 4.5;

function hexToRgb(hex: string) {
  const [, red, green, blue] =
    /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(hex) ?? [];

  if (!red || !green || !blue) {
    throw new Error(`Unsupported color value: ${hex}`);
  }

  return [red, green, blue].map((channel) => Number.parseInt(channel, 16) / 255);
}

function relativeLuminance(hex: string) {
  const [red, green, blue] = hexToRgb(hex).map((channel) =>
    channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4,
  );

  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
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
});
