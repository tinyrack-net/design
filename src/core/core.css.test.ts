import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const repoRoot = process.cwd();

function readCoreCss() {
  return readFileSync(join(repoRoot, 'src/core/core.css'), 'utf8');
}

describe('core.css source contract', () => {
  it('is a source-owned core stylesheet without generated component CSS', () => {
    const css = readCoreCss();

    expect(css).toContain('@theme static');
    expect(css).not.toContain('Generated from');
    expect(css).not.toContain('.tr-btn');
    expect(css).not.toContain('daisyui');
    expect(css).not.toContain('mantine');
    expect(css).not.toContain('starlight');
  });

  it('contains the public Tailwind token bridge and theme variables', () => {
    const css = readCoreCss();

    expect(css).toContain('--font-tinyrack-body: var(--tinyrack-font-body);');
    expect(css).toContain('--font-tinyrack-mono: var(--tinyrack-font-mono);');
    expect(css).toContain('--text-tinyrack-md: var(--tinyrack-text-md);');
    expect(css).toContain(
      '--text-tinyrack-md--line-height: var(--tinyrack-leading-md);',
    );
    expect(css).toContain('--leading-tinyrack-lg: var(--tinyrack-leading-lg);');
    expect(css).toContain('--tracking-tinyrack-xl: var(--tinyrack-tracking-xl);');
    expect(css).toContain('--color-tinyrack-primary: var(--tinyrack-primary);');
    expect(css).toContain('--color-tinyrack-surface: var(--tinyrack-surface);');
    expect(css).toContain('--color-tinyrack-border: var(--tinyrack-border);');
    expect(css).toContain(
      ':where([data-theme="tinyrack-light"], [data-theme="tinyrack-dark"])',
    );
    expect(css).toContain('[data-theme="tinyrack-light"]');
    expect(css).toContain('[data-theme="tinyrack-dark"]');
  });

  it('keeps the intentionally small semantic variable surface', () => {
    const css = readCoreCss();

    expect(css).toContain('--tinyrack-primary: #fafafa;');
    expect(css).not.toContain('--color-tinyrack-secondary');
    expect(css).not.toContain('--color-tinyrack-success');
    expect(css).not.toContain('--color-tinyrack-warning');
    expect(css).not.toContain('--color-tinyrack-info');
    expect(css).not.toContain('--color-tinyrack-surface-raised');
    expect(css).not.toContain('--radius-tinyrack-');
  });
});
