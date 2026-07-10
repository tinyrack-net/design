import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const repoRoot = process.cwd();

function readCoreCss() {
  return readFileSync(join(repoRoot, 'src/core/core.css'), 'utf8');
}

describe('core.css generated token contract', () => {
  it('is generated from TypeScript tokens without component CSS', () => {
    const css = readCoreCss();

    expect(css).toContain('@theme static');
    expect(css).toContain('Generated from src/core/tokens');
    expect(css).not.toContain('.tr-btn');
    expect(css).not.toContain('.tr-table');
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
    expect(css).toContain(
      '--font-weight-tinyrack-heading: var(--tinyrack-weight-heading);',
    );
    expect(css).toContain('--spacing-tinyrack-md: var(--tinyrack-space-md);');
    expect(css).toContain('--radius-tinyrack-md: var(--tinyrack-radius-md);');
    expect(css).toContain('--shadow-tinyrack-overlay: var(--tinyrack-shadow-overlay);');
    expect(css).toContain('--color-tinyrack-primary: var(--tinyrack-primary);');
    expect(css).toContain('--color-tinyrack-surface: var(--tinyrack-surface);');
    expect(css).toContain('--color-tinyrack-border: var(--tinyrack-border);');
    expect(css).toContain(':root {');
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
    expect(css).toContain('--color-tinyrack-surface-raised');
    expect(css).toContain('--color-tinyrack-border-strong');
    expect(css).toContain('--radius-tinyrack-');
  });

  it('contains shared control, focus, motion, opacity, and elevation decisions', () => {
    const css = readCoreCss();

    expect(css).toContain('--tinyrack-control-height-sm: 2rem;');
    expect(css).toContain('--tinyrack-control-height-md: 2.5rem;');
    expect(css).toContain('--tinyrack-control-height-lg: 3rem;');
    expect(css).toContain('--tinyrack-focus-width: 2px;');
    expect(css).toContain('--tinyrack-duration-fast: 120ms;');
    expect(css).toContain('--tinyrack-duration-loading: 2.4s;');
    expect(css).toContain('--tinyrack-ease-linear: linear;');
    expect(css).toContain('--tinyrack-opacity-disabled: 0.5;');
    expect(css).toContain('--tinyrack-shadow-overlay:');
  });
});
