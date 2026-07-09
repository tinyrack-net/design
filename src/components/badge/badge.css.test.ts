import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { badgeSizes, badgeVariants } from './contract.js';

const repoRoot = process.cwd();

function readBadgeCss() {
  return readFileSync(join(repoRoot, 'src/components/badge/badge.css'), 'utf8');
}

describe('badge.css source contract', () => {
  it('is a source-owned component stylesheet without generated core CSS', () => {
    const css = readBadgeCss();

    expect(css).toContain('.tr-badge');
    expect(css).not.toContain('Generated from');
    expect(css).not.toContain('@theme static');
    expect(css).not.toContain('[data-theme="tinyrack-light"]');
    expect(css).not.toContain('[data-theme="tinyrack-dark"]');
    expect(css).not.toContain('.badge');
    expect(css).not.toContain('.mantine-');
    expect(css).not.toContain('daisyui');
    expect(css).not.toContain('starlight');
  });

  it('covers the full Badge option contract with CSS selectors', () => {
    const css = readBadgeCss();

    for (const size of badgeSizes) {
      expect(css).toContain(`.tr-badge[data-size="${size}"]`);
    }

    for (const variant of badgeVariants) {
      expect(css).toContain(`.tr-badge[data-variant="${variant}"]`);
    }
  });

  it('keeps semantic variable usage in CSS rather than the Badge TS contract', () => {
    const css = readBadgeCss();
    const contractSource = readFileSync(
      join(repoRoot, 'src/components/badge/contract.ts'),
      'utf8',
    );

    expect(css).toContain('--tr-badge-background: var(--tinyrack-primary);');
    expect(css).toContain('--tr-badge-background: var(--tinyrack-error);');
    expect(css).toContain('border-radius: 9999px;');
    expect(contractSource).not.toContain('var(--');
    expect(contractSource).not.toContain('--tinyrack-');
    expect(contractSource).not.toContain('--tr-badge-');
  });
});
