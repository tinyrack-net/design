import { describe, expect, it } from 'vitest';
import packageJson from '../../../package.json' with { type: 'json' };
import { createTinyrackThemeCssFiles } from '../../theme/create-css.js';

type GeneratedCssPath = keyof ReturnType<typeof createTinyrackThemeCssFiles>;

function readCss(path: GeneratedCssPath) {
  return createTinyrackThemeCssFiles()[path];
}

describe('Tailwind CSS theme exports', () => {
  it('provides Tinyrack Tailwind v4 theme variables as a CSS subpath', () => {
    const css = readCss('tailwind/theme.css');

    expect(css).toContain('@theme');
    expect(css).toContain('--color-tinyrack-primary: var(--tinyrack-primary);');
    expect(css).toContain('--color-tinyrack-surface: var(--tinyrack-surface);');
    expect(css).toContain(
      '--color-tinyrack-surface-raised: var(--tinyrack-surface-raised);',
    );
    expect(css).toContain('--color-tinyrack-border: var(--tinyrack-border);');
    expect(css).not.toContain(':root {');
    expect(css).toContain(
      ':where([data-theme="tinyrack-light"], [data-theme="tinyrack-dark"])',
    );
    expect(css).toContain('[data-theme="tinyrack-light"]');
    expect(css).toContain('[data-theme="tinyrack-dark"]');
    expect(css).toContain('--tinyrack-primary: #fafafa;');
    expect(css).toContain('--font-tinyrack-body:');
    expect(css).toContain('--font-tinyrack-mono: var(--tinyrack-font-mono);');
    expect(css).toContain('--font-tinyrack-korean: var(--tinyrack-font-korean);');
    expect(css).toContain('--font-tinyrack-japanese: var(--tinyrack-font-japanese);');
    expect(css).toContain('--text-tinyrack-md: var(--tinyrack-text-md);');
    expect(css).toContain(
      '--text-tinyrack-md--line-height: var(--tinyrack-leading-md);',
    );
    expect(css).toContain('--leading-tinyrack-lg: var(--tinyrack-leading-lg);');
    expect(css).toContain('--tracking-tinyrack-xl: var(--tinyrack-tracking-xl);');
    expect(css).not.toContain(':lang(ko)');
    expect(css).not.toContain(':lang(ja)');
    expect(css).toContain('--radius-tinyrack-box: var(--tinyrack-radius-box);');
  });

  it('provides preset composition CSS for Tailwind plus daisyUI and Mantine', () => {
    const daisyCss = readCss('tailwind/daisyui.css');
    const mantineCss = readCss('tailwind/mantine.css');

    expect(daisyCss).toContain('@import "./theme.css"');
    expect(daisyCss).toContain('@import "../daisyui/theme.css"');
    expect(daisyCss).toContain('@plugin "daisyui"');
    expect(daisyCss).toContain('tinyrack-dark;');
    expect(daisyCss).not.toContain('--default');
    expect(daisyCss).not.toContain('--prefersdark');
    expect(daisyCss).toContain('.btn-sm');
    expect(daisyCss).toContain('--size: var(--tinyrack-control-height-sm, 2rem);');

    expect(mantineCss).toContain('@import "./theme.css"');
    expect(mantineCss).toContain('@import "../mantine/styles.css"');
  });

  it('maps Tailwind CSS package exports to copied dist css', () => {
    expect(packageJson.exports['./tailwind.css']).toBe('./dist/tailwind/theme.css');
    expect(packageJson.exports['./tailwind/daisyui.css']).toBe(
      './dist/tailwind/daisyui.css',
    );
    expect(packageJson.exports['./tailwind/mantine.css']).toBe(
      './dist/tailwind/mantine.css',
    );
  });
});
