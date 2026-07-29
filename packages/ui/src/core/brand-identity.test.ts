import { describe, expect, it } from 'vitest';
import { tinyrackPalettes, tinyrackSemanticColors } from './index.js';

describe('Tinyrack Rack Blue brand identity', () => {
  it('keeps the dark foundation neutral while using Rack Blue for interaction', () => {
    expect(tinyrackSemanticColors.dark).toMatchObject({
      surface: '#0a0a0a',
      surfaceMuted: '#171717',
      surfaceHover: '#172554',
      surfaceSelected: '#1e3a8a',
      text: '#fafafa',
      textMuted: '#a3a3a3',
      border: '#404040',
      focus: '#60a5fa',
      primary: '#60a5fa',
      onPrimary: '#172554',
      danger: '#f87171',
      onDanger: '#450a0a',
    });
  });

  it('uses the existing blue ramp for the default action identity', () => {
    expect(tinyrackPalettes.neutral[950]).toBe('#0a0a0a');
    expect(tinyrackPalettes.blue[700]).toBe('#1d4ed8');
    expect(tinyrackSemanticColors.light).toMatchObject({
      surface: '#ffffff',
      surfaceHover: '#eff6ff',
      surfaceSelected: '#dbeafe',
      focus: '#2563eb',
      primary: '#1d4ed8',
      onPrimary: '#ffffff',
    });
    expect(tinyrackPalettes.red[700]).toBe('#b91c1c');
  });
});
