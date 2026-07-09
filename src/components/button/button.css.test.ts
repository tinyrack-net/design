import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { buttonAppearances, buttonSizes, buttonVariants } from './contract.js';

const repoRoot = process.cwd();

function readButtonCss() {
  return readFileSync(join(repoRoot, 'src/components/button/button.css'), 'utf8');
}

describe('button.css source contract', () => {
  it('is a source-owned component stylesheet without generated core CSS', () => {
    const css = readButtonCss();

    expect(css).toContain('.tr-btn');
    expect(css).toContain('.tr-icon-btn');
    expect(css).not.toContain('Generated from');
    expect(css).not.toContain('@theme static');
    expect(css).not.toContain('[data-theme="tinyrack-light"]');
    expect(css).not.toContain('[data-theme="tinyrack-dark"]');
    expect(css).not.toContain('var(--tinyrack-surface-raised)');
    expect(css).not.toContain('.btn');
    expect(css).not.toContain('.mantine-');
    expect(css).not.toContain('daisyui');
    expect(css).not.toContain('starlight');
  });

  it('covers the full Button option contract with CSS selectors', () => {
    const css = readButtonCss();

    for (const size of buttonSizes) {
      expect(css).toContain(`.tr-btn[data-size="${size}"]`);
    }

    for (const variant of buttonVariants) {
      expect(css).toContain(`.tr-btn[data-variant="${variant}"]`);
    }

    for (const appearance of buttonAppearances) {
      expect(css).toContain(`.tr-btn[data-appearance="${appearance}"]`);
      expect(css).toContain(
        `.tr-btn[data-appearance="${appearance}"]:hover:not(:disabled):not([aria-disabled="true"])`,
      );
    }
  });

  it('keeps Tailwind scale-backed Button size values in CSS', () => {
    const css = readButtonCss();

    expect(css).toContain('--tr-btn-height: 2rem;');
    expect(css).toContain('--tr-btn-padding-x: 0.75rem;');
    expect(css).toContain('--tr-btn-gap: 0.375rem;');
    expect(css).toContain('--tr-btn-font-size: 0.875rem;');
    expect(css).toContain('--tr-btn-height: 3rem;');
    expect(css).toContain('--tr-btn-padding-x: 1.25rem;');
    expect(css).toContain('--tr-btn-gap: 0.625rem;');
    expect(css).toContain('--tr-btn-font-size: 1rem;');
  });

  it('keeps semantic variable usage in CSS rather than the Button TS contract', () => {
    const css = readButtonCss();
    const contractSource = readFileSync(
      join(repoRoot, 'src/components/button/contract.ts'),
      'utf8',
    );

    expect(css).toContain('--tr-btn-variant-fill: var(--tinyrack-primary);');
    expect(css).toContain('--tr-btn-variant-fill: var(--tinyrack-error);');
    expect(css).toContain('.tr-btn:focus-visible');
    expect(css).toContain('.tr-icon-btn:focus-visible');
    expect(css).toContain('.tr-btn:disabled');
    expect(css).toContain('.tr-btn[aria-disabled="true"]');
    expect(contractSource).not.toContain('var(--');
    expect(contractSource).not.toContain('--tinyrack-');
    expect(contractSource).not.toContain('--tr-btn-');
  });
});
