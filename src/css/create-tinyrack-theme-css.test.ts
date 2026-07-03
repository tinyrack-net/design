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
});
