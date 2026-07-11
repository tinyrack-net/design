import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const repoRoot = process.cwd();

function readCodeBlockCss() {
  return readFileSync(
    join(repoRoot, 'src/components/code-block/code-block.css'),
    'utf8',
  );
}

describe('code-block.css source contract', () => {
  it('is a source-owned component stylesheet without generated core CSS', () => {
    const css = readCodeBlockCss();

    expect(css).toContain('.tr-code-block');
    expect(css).toContain('.tr-code-block[data-wrap="true"]');
    expect(css).not.toContain('.tr-code ');
    expect(css).not.toContain('Generated from');
    expect(css).not.toContain('@theme static');
    expect(css).not.toContain('[data-theme="tinyrack-light"]');
    expect(css).not.toContain('[data-theme="tinyrack-dark"]');
    expect(css).not.toContain('.mantine-');
    expect(css).not.toContain('daisyui');
    expect(css).not.toContain('starlight');
  });

  it('keeps semantic variable usage in CSS rather than the CodeBlock TS contract', () => {
    const css = readCodeBlockCss();
    const contractSource = readFileSync(
      join(repoRoot, 'src/components/code-block/contract.ts'),
      'utf8',
    );

    expect(css).toContain('var(--tinyrack-surface-muted)');
    expect(css).toContain('var(--tr-code-block-border, var(--tinyrack-border))');
    expect(css).toContain('color: var(--tinyrack-text);');
    expect(css).toContain('font-family: var(--tinyrack-font-mono);');
    expect(css).toContain('overflow-x: auto;');
    expect(contractSource).not.toContain('var(--');
    expect(contractSource).not.toContain('--tinyrack-');
  });
});
