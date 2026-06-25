import { describe, expect, it } from 'vitest';
import { tinyrackStarlightTheme, withTinyrackStarlightTheme } from '../index.js';

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
});
