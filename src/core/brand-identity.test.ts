import { describe, expect, it } from 'vitest';
import { tinyrackPalettes, tinyrackSemanticColors } from './index.js';

describe('Tinyrack black-tone brand identity', () => {
  it('uses a near-black dark canvas with achromatic primary identity', () => {
    expect(tinyrackSemanticColors.dark).toMatchObject({
      canvas: '#030303',
      surface: '#0a0a0a',
      surfaceMuted: '#171717',
      text: '#fafafa',
      textMuted: '#a3a3a3',
      border: '#404040',
      primary: '#fafafa',
      onPrimary: '#0a0a0a',
      danger: '#f87171',
      onDanger: '#450a0a',
    });
  });

  it('keeps the default brand action achromatic while providing status ramps', () => {
    expect(tinyrackPalettes.neutral[950]).toBe('#0a0a0a');
    expect(tinyrackPalettes.blue[700]).toBe('#1d4ed8');
    expect(tinyrackPalettes.red[700]).toBe('#b91c1c');
  });
});
