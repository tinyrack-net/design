import { describe, expect, it } from 'vitest';
import { tinyrackPalettes, tinyrackSemanticColors } from './index.js';

describe('Tinyrack black-tone brand identity', () => {
  it('uses a near-black dark canvas with achromatic primary identity', () => {
    expect(tinyrackSemanticColors.dark).toMatchObject({
      canvas: '#030303',
      surface: '#0a0a0a',
      surfaceMuted: '#262626',
      text: '#fafafa',
      textMuted: '#a3a3a3',
      border: '#404040',
      primary: '#fafafa',
      primaryContrast: '#0a0a0a',
      error: '#f87171',
      errorContrast: '#450a0a',
    });
  });

  it('keeps the palette achromatic', () => {
    expect(tinyrackPalettes.neutral[950]).toBe('#0a0a0a');
    expect(tinyrackPalettes.brand[500]).toBe('#737373');
  });
});
