import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

function readMdxCss() {
  return readFileSync(join(process.cwd(), 'src/mdx/mdx.css'), 'utf8');
}

describe('MDX CSS contract', () => {
  it('provides standalone MDX document classes without owning theme variables', () => {
    const css = readMdxCss();

    expect(css).toContain('.tr-mdx');
    expect(css).toContain('.tr-mdx-h1');
    expect(css).toContain('.tr-mdx-h2');
    expect(css).toContain('--_tr-mdx-section-gap: 3rem;');
    expect(css).toContain('--_tr-mdx-block-gap: 1.25rem;');
    expect(css).toContain('var(--tr-mdx-content-width, var(--_tr-mdx-content-width))');
    expect(css).toContain('.tr-mdx-h3');
    expect(css).toContain('.tr-mdx-h4');
    expect(css).toContain('.tr-mdx-h5');
    expect(css).toContain('.tr-mdx-h6');
    expect(css).toContain(
      'var(--tr-mdx-heading-content-gap, var(--tinyrack-space-lg))',
    );
    expect(css).toContain('.tr-mdx-p');
    expect(css).toContain('.tr-mdx-strong');
    expect(css).toContain('.tr-mdx-em');
    expect(css).toContain('.tr-mdx-del');
    expect(css).toContain('.tr-mdx-break');
    expect(css).toContain('.tr-mdx-list');
    expect(css).toContain('.tr-mdx-task-list');
    expect(css).toContain('.tr-mdx-task-item');
    expect(css).toContain('.tr-mdx-task-checkbox');
    expect(css).toContain('.tr-mdx-link');
    expect(css).toContain('.tr-mdx-image');
    expect(css).toContain('.tr-mdx-code-block');
    expect(css).toContain('--tr-code-block-radius: var(--tinyrack-radius-lg);');
    expect(css).toContain('.tr-mdx-table-container');
    expect(css).toContain('.tr-mdx-table');
    expect(css).toContain('--tr-table-radius: var(--tinyrack-radius-md);');
    expect(css).toContain('overflow-x: auto;');
    expect(css).toContain('width: max-content;');
    expect(css).toContain('min-width: 100%;');
    expect(css).toContain('.tr-mdx-rule');
    expect(css).toContain('.tr-mdx-blockquote');
    expect(css).toContain('.tr-mdx-footnotes');
    expect(css).toContain('.tr-mdx-footnote-ref');
    expect(css).toContain('.tr-mdx .sr-only');
    expect(css).not.toContain('@theme static');
    expect(css).not.toContain('[data-theme="tinyrack-light"]');
    expect(css).not.toContain('[data-theme="tinyrack-dark"]');
  });
});
