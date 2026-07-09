import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { linkUnderlines, linkVariants } from './contract.js';

const repoRoot = process.cwd();

function readLinkCss() {
  return readFileSync(join(repoRoot, 'src/components/link/link.css'), 'utf8');
}

describe('link.css source contract', () => {
  it('is standalone component CSS', () => {
    const css = readLinkCss();

    expect(css).toContain('.tr-link');
    expect(css).not.toContain('Generated from');
    expect(css).not.toContain('@theme static');
    expect(css).not.toContain('[data-theme="tinyrack-light"]');
  });

  it('covers the full Link option contract', () => {
    const css = readLinkCss();

    for (const variant of linkVariants) {
      expect(css).toContain(`.tr-link[data-variant="${variant}"]`);
    }

    for (const underline of linkUnderlines) {
      expect(css).toContain(`.tr-link[data-underline="${underline}"]`);
    }

    expect(css).toContain('.tr-link:focus-visible');
    expect(css).toContain('.tr-link[aria-disabled="true"]');
  });
});
