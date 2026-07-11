import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { alertVariants } from './contract.js';

const repoRoot = process.cwd();

function readAlertCss() {
  return readFileSync(join(repoRoot, 'src/components/alert/alert.css'), 'utf8');
}

describe('alert.css source contract', () => {
  it('is standalone and uses semantic variables only in CSS', () => {
    const css = readAlertCss();

    expect(css).toContain('.tr-alert');
    expect(css).toContain('--_tr-alert-background: var(--tinyrack-danger-surface);');
    expect(css).toContain('--_tr-alert-border: var(--tinyrack-danger-border);');
    expect(css).toContain('var(--tr-alert-radius, var(--_tr-alert-radius))');
    expect(css).not.toContain('Generated from');
    expect(css).not.toContain('@theme static');
    expect(css).not.toContain('[data-theme="tinyrack-light"]');
    expect(css).not.toContain('[data-theme="tinyrack-dark"]');
  });

  it('covers every Alert variant', () => {
    const css = readAlertCss();

    for (const variant of alertVariants) {
      expect(css).toContain(`.tr-alert[data-variant="${variant}"]`);
    }

    expect(css).not.toContain('.tr-alert[data-variant="primary"]');
  });
});
