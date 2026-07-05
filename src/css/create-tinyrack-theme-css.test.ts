import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { createTinyrackThemeCssFiles } from './create-tinyrack-theme-css.js';

const repoRoot = process.cwd();
const expectedGeneratedCssPaths = [
  'tailwind/theme.css',
  'tailwind/daisyui.css',
  'tailwind/mantine.css',
  'daisyui/theme.css',
  'mantine/styles.css',
  'astro/starlight/theme.css',
] as const;

describe('generated Tinyrack theme CSS', () => {
  it('generates the expected public CSS entrypoints', () => {
    const generatedCssFiles = createTinyrackThemeCssFiles();

    expect(Object.keys(generatedCssFiles).sort()).toEqual(
      [...expectedGeneratedCssPaths].sort(),
    );
  });

  it.each(
    Object.entries(createTinyrackThemeCssFiles()),
  )('marks src/%s as generated CSS', (_path, css) => {
    expect(css).toContain(
      '/* Generated from src/css/create-tinyrack-theme-css.ts. Do not edit directly. */',
    );
  });

  it('keeps generated CSS files ignored by git', () => {
    const gitignore = readFileSync(join(repoRoot, '.gitignore'), 'utf8');

    for (const path of expectedGeneratedCssPaths) {
      expect(gitignore).toContain(`src/${path}`);
    }
  });

  it('sets Mantine filled text fallback to the dark primary contrast token', () => {
    const css = createTinyrackThemeCssFiles()['mantine/styles.css'];

    expect(css).toContain('--tinyrack-mantine-filled-color: #0a0a0a;');
  });

  it('hardens Mantine generated CSS against low-contrast light states', () => {
    const css = createTinyrackThemeCssFiles()['mantine/styles.css'];

    expect(css).toContain('--mantine-color-disabled-color: #737373 !important;');
    expect(css).toContain('--tinyrack-mantine-stepper-outline-color: #e5e5e5;');
    expect(css).toContain(
      '--stepper-outline-color: var(--tinyrack-mantine-stepper-outline-color) !important;',
    );
    expect(css).toContain(
      'background-color: var(--tinyrack-mantine-stepper-outline-color) !important;',
    );
    expect(css).toContain(
      '[data-mantine-color-scheme] .mantine-SegmentedControl-label:not([data-active]):not([data-disabled]) .mantine-SegmentedControl-innerLabel',
    );
    expect(css).toContain(
      '[data-mantine-color-scheme] .mantine-SegmentedControl-label[data-active] .mantine-SegmentedControl-innerLabel',
    );
  });
});
