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
    expect(css).not.toContain('.tr-badge');
    expect(css).not.toContain('.tr-btn');
    expect(css).not.toContain('.tr-code-block');
    expect(css).not.toContain('.tr-code');
    expect(css).not.toContain('.tr-table');
  });

  it('provides standalone Badge CSS without core theme CSS', () => {
    const css = readSourceCss('components/badge/badge.css');

    expect(css).toContain('.tr-badge');
    expect(css).toContain('.tr-badge[data-variant="primary"]');
    expect(css).toContain('.tr-badge[data-size="md"]');
    expect(css).not.toContain('@theme static');
    expect(css).not.toContain('[data-theme="tinyrack-light"]');
  });

  it('provides standalone Button CSS without core theme CSS', () => {
    const css = readSourceCss('components/button/button.css');

    expect(css).toContain('.tr-btn');
    expect(css).toContain('.tr-icon-btn');
    expect(css).toContain('.tr-btn[data-variant="primary"]');
    expect(css).toContain('.tr-btn[data-appearance="ghost"]');
    expect(css).not.toContain('@theme static');
    expect(css).not.toContain('[data-theme="tinyrack-light"]');
  });

  it('provides standalone Code CSS without core theme CSS', () => {
    const css = readSourceCss('components/code/code.css');

    expect(css).toContain('.tr-code');
    expect(css).toContain('overflow-wrap: anywhere;');
    expect(css).not.toContain('.tr-code-block');
    expect(css).not.toContain('overflow-x: auto;');
    expect(css).not.toContain('@theme static');
    expect(css).not.toContain('[data-theme="tinyrack-light"]');
  });

  it('provides standalone CodeBlock CSS without core theme CSS', () => {
    const css = readSourceCss('components/code-block/code-block.css');

    expect(css).toContain('.tr-code-block');
    expect(css).toContain('.tr-code-block[data-wrap="true"]');
    expect(css).toContain('overflow-x: auto;');
    expect(css).not.toContain('.tr-code {');
    expect(css).not.toContain('@theme static');
    expect(css).not.toContain('[data-theme="tinyrack-light"]');
  });

  it('provides standalone primitive group CSS without core theme CSS', () => {
    const linkCss = readSourceCss('components/link/link.css');
    const formCss = readSourceCss('components/form/form.css');

    expect(linkCss).toContain('.tr-link[data-underline="hover"]');
    expect(formCss).toContain('.tr-input[data-size="md"]');
    expect(formCss).toContain('.tr-switch-input:checked + .tr-switch-track');

    for (const css of [linkCss, formCss]) {
      expect(css).not.toContain('@theme static');
      expect(css).not.toContain('[data-theme="tinyrack-light"]');
    }
  });

  it('provides standalone Table CSS without core theme CSS', () => {
    const css = readSourceCss('components/table/table.css');

    expect(css).toContain('.tr-table-container');
    expect(css).toContain('.tr-table[data-density="normal"]');
    expect(css).toContain('.tr-table[data-striped="true"]');
    expect(css).not.toContain('@theme static');
    expect(css).not.toContain('[data-theme="tinyrack-light"]');
  });

  it('provides standalone Tabs CSS without core theme CSS', () => {
    const css = readSourceCss('components/tabs/tabs.css');

    expect(css).toContain('.tr-tabs');
    expect(css).toContain('.tr-tabs-list');
    expect(css).toContain('.tr-tabs-trigger[aria-selected="true"]');
    expect(css).toContain('.tr-tabs-panel[hidden]');
    expect(css).not.toContain('@theme static');
    expect(css).not.toContain('[data-theme="tinyrack-light"]');
  });

  it('provides standalone MDX CSS without core theme CSS', () => {
    const css = readSourceCss('mdx/mdx.css');

    expect(css).toContain('.tr-mdx');
    expect(css).toContain('.tr-mdx-h1');
    expect(css).toContain('.tr-mdx-h6');
    expect(css).toContain('.tr-mdx-p');
    expect(css).toContain('.tr-mdx-list');
    expect(css).toContain('.tr-mdx-task-list');
    expect(css).toContain('.tr-mdx-link');
    expect(css).toContain('.tr-mdx-image');
    expect(css).toContain('.tr-mdx-code-block');
    expect(css).toContain('.tr-mdx-table-container');
    expect(css).toContain('.tr-mdx-table');
    expect(css).toContain('.tr-mdx-rule');
    expect(css).toContain('.tr-mdx-blockquote');
    expect(css).toContain('.tr-mdx-footnotes');
    expect(css).not.toContain('@theme static');
    expect(css).not.toContain('[data-theme="tinyrack-light"]');
  });

  it('keeps source CSS tracked and split by domain', () => {
    const gitignore = readFileSync(join(process.cwd(), '.gitignore'), 'utf8');

    expect(gitignore).not.toContain('src/core/core.css');
    expect(gitignore).not.toContain('src/components/badge/badge.css');
    expect(gitignore).not.toContain('src/components/button/button.css');
    expect(gitignore).not.toContain('src/components/code-block/code-block.css');
    expect(gitignore).not.toContain('src/components/code/code.css');
    expect(gitignore).not.toContain('src/components/form/form.css');
    expect(gitignore).not.toContain('src/components/link/link.css');
    expect(gitignore).not.toContain('src/components/table/table.css');
    expect(gitignore).not.toContain('src/components/tabs/tabs.css');
    expect(gitignore).not.toContain('src/mdx/mdx.css');
  });

  it('maps CSS package exports to copied dist css', () => {
    expect(packageJson.exports['./core/core.css']).toBe('./dist/core/core.css');
    expect(packageJson.exports['./components/badge/badge.css']).toBe(
      './dist/components/badge/badge.css',
    );
    expect(packageJson.exports['./components/button/button.css']).toBe(
      './dist/components/button/button.css',
    );
    expect(packageJson.exports['./components/code-block/code-block.css']).toBe(
      './dist/components/code-block/code-block.css',
    );
    expect(packageJson.exports['./components/code/code.css']).toBe(
      './dist/components/code/code.css',
    );
    expect(packageJson.exports).not.toHaveProperty(
      './components/feedback/feedback.css',
    );
    expect(packageJson.exports['./components/form/form.css']).toBe(
      './dist/components/form/form.css',
    );
    expect(packageJson.exports['./components/link/link.css']).toBe(
      './dist/components/link/link.css',
    );
    expect(packageJson.exports['./components/table/table.css']).toBe(
      './dist/components/table/table.css',
    );
    expect(packageJson.exports['./components/tabs/tabs.css']).toBe(
      './dist/components/tabs/tabs.css',
    );
    expect(packageJson.exports['./mdx/mdx.css']).toBe('./dist/mdx/mdx.css');
    expect(packageJson.exports).not.toHaveProperty('./tailwind.css');
    expect(packageJson.exports).not.toHaveProperty('./styles.css');
    expect(packageJson.exports).not.toHaveProperty('./tailwind/daisyui.css');
    expect(packageJson.exports).not.toHaveProperty('./tailwind/mantine.css');
  });
});
