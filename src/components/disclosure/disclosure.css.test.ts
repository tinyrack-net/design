import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const repoRoot = process.cwd();

function readDisclosureCss() {
  return readFileSync(
    join(repoRoot, 'src/components/disclosure/disclosure.css'),
    'utf8',
  );
}

describe('disclosure.css source contract', () => {
  it('progressively animates native details content with shared motion tokens', () => {
    const css = readDisclosureCss();

    expect(css).toContain('selector(details::details-content)');
    expect(css).toContain('interpolate-size: allow-keywords');
    expect(css).toContain('.tr-disclosure::details-content');
    expect(css).toContain('block-size: 0;');
    expect(css).toContain('.tr-disclosure[open]::details-content');
    expect(css).toContain('block-size: auto;');
    expect(css).toContain(
      'var(--tr-disclosure-duration, var(--tinyrack-duration-normal))',
    );
    expect(css).toContain('allow-discrete');
  });

  it('removes content and chevron motion for reduced-motion users', () => {
    const css = readDisclosureCss();

    expect(css).toContain('@media (prefers-reduced-motion: reduce)');
    expect(css).toContain('.tr-disclosure-summary::after');
    expect(css).toContain('@supports selector(details::details-content)');
    expect(css).toContain('.tr-disclosure::details-content');
    expect(css).toContain('transition: none;');
  });
});
