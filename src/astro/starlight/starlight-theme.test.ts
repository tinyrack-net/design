import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { tinyrackStarlightTheme, withTinyrackStarlightTheme } from './index.js';

const repoRoot = process.cwd();

describe('tinyrack starlight theme helper', () => {
  it('exports the package css path', () => {
    expect(tinyrackStarlightTheme.customCss).toContain(
      '@tinyrack/themes/astro/starlight.css',
    );
  });

  it('prepends package css while preserving site css', () => {
    expect(
      withTinyrackStarlightTheme({
        title: 'Docs',
        customCss: ['./src/styles/global.css'],
      }),
    ).toMatchObject({
      title: 'Docs',
      customCss: ['@tinyrack/themes/astro/starlight.css', './src/styles/global.css'],
    });
  });

  it('ships a black-first dark Starlight palette', () => {
    const css = readFileSync(join(repoRoot, 'src/astro/starlight/theme.css'), 'utf8');

    expect(css).toContain(':root[data-theme="dark"]');
    expect(css).toContain('--sl-color-black: #0a0a0a;');
    expect(css).toContain('--sl-color-gray-6: #171717;');
    expect(css).toContain('--sl-color-accent-low: #171717;');
  });
});
