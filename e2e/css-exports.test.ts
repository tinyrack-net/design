import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import packageJson from '../package.json' with { type: 'json' };

function readSourceCss(path: string) {
  return readFileSync(join(process.cwd(), 'src', path), 'utf8');
}

describe('CSS exports', () => {
  it('provides Tinyrack Tailwind v4 theme variables as a CSS subpath', () => {
    const css = readSourceCss('core/core.css');

    expect(css).toContain('@theme');
    expect(css).toContain('--color-tinyrack-primary: var(--tinyrack-primary);');
    expect(css).toContain('--color-tinyrack-surface: var(--tinyrack-surface);');
    expect(css).toContain('--color-tinyrack-border: var(--tinyrack-border);');
    expect(css).not.toContain(':root {');
    expect(css).toContain(
      ':where([data-theme="tinyrack-light"], [data-theme="tinyrack-dark"])',
    );
    expect(css).toContain('[data-theme="tinyrack-light"]');
    expect(css).toContain('[data-theme="tinyrack-dark"]');
    expect(css).toContain('--tinyrack-primary: #fafafa;');
    expect(css).toContain('--font-tinyrack-body: var(--tinyrack-font-body);');
    expect(css).toContain('--font-tinyrack-mono: var(--tinyrack-font-mono);');
    expect(css).toContain('--text-tinyrack-md: var(--tinyrack-text-md);');
    expect(css).toContain(
      '--text-tinyrack-md--line-height: var(--tinyrack-leading-md);',
    );
    expect(css).toContain('--leading-tinyrack-lg: var(--tinyrack-leading-lg);');
    expect(css).toContain('--tracking-tinyrack-xl: var(--tinyrack-tracking-xl);');
    expect(css).not.toContain('--color-tinyrack-secondary');
    expect(css).not.toContain('--color-tinyrack-success');
    expect(css).not.toContain('--color-tinyrack-warning');
    expect(css).not.toContain('--color-tinyrack-info');
    expect(css).not.toContain('--color-tinyrack-surface-raised');
    expect(css).not.toContain('--radius-tinyrack-');
    expect(css).not.toContain('.tr-btn');
    expect(css).not.toContain('.tr-table');
  });

  it('provides standalone Button CSS without core theme CSS', () => {
    const css = readSourceCss('components/button/button.css');

    expect(css).toContain('.tr-btn');
    expect(css).toContain('.tr-btn[data-variant="primary"]');
    expect(css).toContain('.tr-btn[data-appearance="ghost"]');
    expect(css).not.toContain('@theme static');
    expect(css).not.toContain('[data-theme="tinyrack-light"]');
  });

  it('provides standalone Table CSS without core theme CSS', () => {
    const css = readSourceCss('components/table/table.css');

    expect(css).toContain('.tr-table-container');
    expect(css).toContain('.tr-table[data-density="normal"]');
    expect(css).toContain('.tr-table[data-striped="true"]');
    expect(css).not.toContain('@theme static');
    expect(css).not.toContain('[data-theme="tinyrack-light"]');
  });

  it('keeps source CSS tracked and split by domain', () => {
    const gitignore = readFileSync(join(process.cwd(), '.gitignore'), 'utf8');

    expect(gitignore).not.toContain('src/core/core.css');
    expect(gitignore).not.toContain('src/components/button/button.css');
    expect(gitignore).not.toContain('src/components/table/table.css');
  });

  it('maps CSS package exports to copied dist css', () => {
    expect(packageJson.exports['./core/core.css']).toBe('./dist/core/core.css');
    expect(packageJson.exports['./components/button/button.css']).toBe(
      './dist/components/button/button.css',
    );
    expect(packageJson.exports['./components/table/table.css']).toBe(
      './dist/components/table/table.css',
    );
    expect(packageJson.exports).not.toHaveProperty('./tailwind.css');
    expect(packageJson.exports).not.toHaveProperty('./styles.css');
    expect(packageJson.exports).not.toHaveProperty('./tailwind/daisyui.css');
    expect(packageJson.exports).not.toHaveProperty('./tailwind/mantine.css');
  });
});
