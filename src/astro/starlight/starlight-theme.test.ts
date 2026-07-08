import { describe, expect, it } from 'vitest';
import { createTinyrackThemeCssFiles } from '../../css/create-tinyrack-theme-css.js';
import { tinyrackDaisyUiThemes } from '../../daisyui/index.js';
import { tinyrackStarlightTheme, withTinyrackStarlightTheme } from './index.js';

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
    const css = createTinyrackThemeCssFiles()['astro/starlight/theme.css'];
    const darkTokens = tinyrackDaisyUiThemes.dark.tokens;

    expect(css).toContain(':root[data-theme="dark"]');
    expect(css).not.toContain(':root[data-theme="tinyrack-dark"]');
    expect(css).toContain(`--sl-color-black: ${darkTokens['--color-base-100']};`);
    expect(css).toContain(`--sl-color-gray-6: ${darkTokens['--color-neutral']};`);
    expect(css).toContain(`--sl-color-accent-low: ${darkTokens['--color-neutral']};`);
  });

  it('bridges daisyUI theme tokens into Starlight color variables', () => {
    const css = createTinyrackThemeCssFiles()['astro/starlight/theme.css'];
    const lightTokens = tinyrackDaisyUiThemes.light.tokens;
    const darkTokens = tinyrackDaisyUiThemes.dark.tokens;

    expect(css).toContain(`--sl-color-accent: ${lightTokens['--color-primary']};`);
    expect(css).toContain(`--sl-color-white: ${lightTokens['--color-base-100']};`);
    expect(css).toContain(`--sl-color-black: ${lightTokens['--color-neutral']};`);
    expect(css).toContain(`--sl-color-accent: ${darkTokens['--color-primary']};`);
    expect(css).toContain(`--sl-color-white: ${darkTokens['--color-base-content']};`);
    expect(css).toContain(`--sl-color-black: ${darkTokens['--color-base-100']};`);
  });

  it('exposes Tinyrack rhythm tokens to Starlight docs surfaces', () => {
    const css = createTinyrackThemeCssFiles()['astro/starlight/theme.css'];

    expect(css).toContain('--tinyrack-starlight-space-lg: 1rem;');
    expect(css).toContain('--sl-content-pad-x: var(--tinyrack-starlight-space-lg);');
    expect(css).toContain('--tinyrack-text-md: 1rem;');
    expect(css).toContain('--sl-text-body: var(--sl-text-base);');
    expect(css).toContain('--sl-line-height-headings: 1.2;');
    expect(css).not.toContain(':lang(ja)');
    expect(css).toContain('border-radius: var(--tinyrack-starlight-radius-surface);');
    expect(css).toContain('starlight-tabs [role="tab"]');
  });
});
