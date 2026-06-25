import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import packageJson from '../../../package.json' with { type: 'json' };

const repoRoot = join(import.meta.dirname, '../../..');

function readCss(path: string) {
  return readFileSync(join(repoRoot, path), 'utf8');
}

describe('Tailwind CSS theme exports', () => {
  it('provides Tinyrack Tailwind v4 theme variables as a CSS subpath', () => {
    const css = readCss('src/tailwind/theme.css');

    expect(css).toContain('@theme');
    expect(css).toContain('--color-tinyrack-primary: #72a7ff');
    expect(css).toContain('--color-tinyrack-surface: #0b0d12');
    expect(css).toContain('--font-tinyrack-body:');
    expect(css).toContain('--radius-tinyrack-box: 1rem');
  });

  it('provides preset composition CSS for Tailwind plus daisyUI and Mantine', () => {
    const daisyCss = readCss('src/tailwind/daisyui.css');
    const mantineCss = readCss('src/tailwind/mantine.css');

    expect(daisyCss).toContain('@import "./theme.css"');
    expect(daisyCss).toContain('@import "../daisyui/theme.css"');
    expect(daisyCss).toContain('@plugin "daisyui"');

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
