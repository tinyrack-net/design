import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { createTinyrackThemeCssFiles } from '../css/create-tinyrack-theme-css.js';
import { tinyrackPalettes, tinyrackSemanticColors, tinyrackShadows } from './index.js';

const repoRoot = process.cwd();

describe('Tinyrack black-tone brand identity', () => {
  it('uses a near-black dark canvas with achromatic primary identity', () => {
    expect(tinyrackSemanticColors.dark).toMatchObject({
      background: '#030303',
      surface: '#0a0a0a',
      surfaceMuted: '#262626',
      text: '#fafafa',
      textMuted: '#a3a3a3',
      border: '#404040',
      primary: '#fafafa',
      primaryContent: '#0a0a0a',
      secondary: '#404040',
      accent: '#a3a3a3',
      accentContent: '#0a0a0a',
    });
  });

  it('keeps the palette achromatic with restrained rack signal colors', () => {
    expect(tinyrackPalettes.neutral[950]).toBe('#0a0a0a');
    expect(tinyrackPalettes.brand[500]).toBe('#737373');
    expect(tinyrackPalettes.accent[500]).toBe('#737373');
    expect(tinyrackShadows.md).toContain('rgb(0 0 0 / 0.22)');
  });

  it('makes the dark theme the default daisyUI and Storybook preview mode', () => {
    const daisyThemeCss = createTinyrackThemeCssFiles()['daisyui/theme.css'];
    const storybookPreview = readFileSync(
      join(repoRoot, '.storybook/preview.tsx'),
      'utf8',
    );

    expect(daisyThemeCss).toMatch(/name: "tinyrack-dark";\s+default: true;/);
    expect(storybookPreview).toContain("defaultValue: 'tinyrack-dark'");
  });
});
