import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { tinyrackPalettes, tinyrackSemanticColors, tinyrackShadows } from './index.js';

const repoRoot = process.cwd();

describe('Tinyrack black-tone brand identity', () => {
  it('uses a near-black dark canvas with luminous blue primary identity', () => {
    expect(tinyrackSemanticColors.dark).toMatchObject({
      background: '#050506',
      surface: '#0b0d12',
      surfaceMuted: '#141821',
      text: '#f7f8f8',
      primary: '#72a7ff',
      primaryContent: '#050506',
      secondary: '#ff7a3d',
      accent: '#8b7cff',
    });
  });

  it('keeps the palette mostly achromatic with restrained rack signal colors', () => {
    expect(tinyrackPalettes.neutral[950]).toBe('#050506');
    expect(tinyrackPalettes.brand[500]).toBe('#72a7ff');
    expect(tinyrackPalettes.accent[500]).toBe('#ff7a3d');
    expect(tinyrackShadows.md).toContain('rgb(0 0 0 / 0.32)');
  });

  it('makes the dark theme the default daisyUI and Storybook preview mode', () => {
    const daisyThemeCss = readFileSync(join(repoRoot, 'src/daisyui/theme.css'), 'utf8');
    const storybookPreview = readFileSync(
      join(repoRoot, '.storybook/preview.tsx'),
      'utf8',
    );

    expect(daisyThemeCss).toMatch(/name: "tinyrack-dark";\s+default: true;/);
    expect(storybookPreview).toContain("defaultValue: 'tinyrack-dark'");
  });
});
