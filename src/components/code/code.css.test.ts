import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const repoRoot = process.cwd();

function readCodeCss() {
  return readFileSync(join(repoRoot, 'src/components/code/code.css'), 'utf8');
}

describe('code.css source contract', () => {
  it('is a source-owned component stylesheet without generated core CSS', () => {
    const css = readCodeCss();

    expect(css).toContain('.tr-code');
    expect(css).not.toContain('.tr-code-block');
    expect(css).not.toContain('Generated from');
    expect(css).not.toContain('@theme static');
    expect(css).not.toContain('[data-theme="tinyrack-light"]');
    expect(css).not.toContain('[data-theme="tinyrack-dark"]');
    expect(css).not.toContain('.mantine-');
    expect(css).not.toContain('daisyui');
    expect(css).not.toContain('starlight');
  });

  it('keeps semantic variable usage in CSS rather than the Code TS contract', () => {
    const css = readCodeCss();
    const contractSource = readFileSync(
      join(repoRoot, 'src/components/code/contract.ts'),
      'utf8',
    );

    expect(css).toContain('background-color: var(--tinyrack-surface-muted);');
    expect(css).toContain('border: 1px solid var(--tinyrack-border);');
    expect(css).toContain('color: var(--tinyrack-primary);');
    expect(css).toContain('font-family: var(--tinyrack-font-mono);');
    expect(css).toContain('overflow-wrap: anywhere;');
    expect(css).not.toContain('overflow-x: auto;');
    expect(contractSource).not.toContain('var(--');
    expect(contractSource).not.toContain('--tinyrack-');
  });
});
