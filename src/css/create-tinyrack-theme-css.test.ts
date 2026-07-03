import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { createTinyrackThemeCssFiles } from './create-tinyrack-theme-css.js';

const repoRoot = process.cwd();

describe('generated Tinyrack theme CSS', () => {
  it.each(
    Object.entries(createTinyrackThemeCssFiles()),
  )('keeps src/%s generated from shared tokens', (path, expectedCss) => {
    const actualCss = readFileSync(join(repoRoot, 'src', path), 'utf8');

    expect(actualCss).toBe(expectedCss);
  });
});
