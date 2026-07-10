import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { tableDensities } from './contract.js';

const repoRoot = process.cwd();

function readTableCss() {
  return readFileSync(join(repoRoot, 'src/components/table/table.css'), 'utf8');
}

describe('table.css source contract', () => {
  it('is a source-owned component stylesheet without generated core CSS', () => {
    const css = readTableCss();

    expect(css).toContain('.tr-table-container');
    expect(css).toContain('.tr-table');
    expect(css).not.toContain('Generated from');
    expect(css).not.toContain('@theme static');
    expect(css).not.toContain('[data-theme="tinyrack-light"]');
    expect(css).not.toContain('[data-theme="tinyrack-dark"]');
    expect(css).not.toContain('.tr-btn');
    expect(css).not.toContain('.mantine-');
    expect(css).not.toContain('daisyui');
    expect(css).not.toContain('starlight');
  });

  it('covers the full Table option contract with CSS selectors', () => {
    const css = readTableCss();

    for (const density of tableDensities) {
      expect(css).toContain(`.tr-table[data-density="${density}"]`);
    }

    expect(css).toContain('.tr-table[data-striped="true"] tbody tr:nth-child(even)');
    expect(css).not.toContain('.tr-table caption');
    expect(css).toContain('.tr-table thead');
    expect(css).toContain('.tr-table tfoot');
    expect(css).toContain('.tr-table :where(th, td)');
    expect(css).toContain('.tr-table :where(th, td)[align="left"]');
    expect(css).toContain('.tr-table :where(th, td)[align="center"]');
    expect(css).toContain('.tr-table :where(th, td)[align="right"]');
    expect(css).toContain('.tr-table tbody tr:hover');
    expect(css).not.toContain('text-transform: uppercase;');
  });

  it('keeps density spacing values in CSS', () => {
    const css = readTableCss();

    expect(css).toContain('--_tr-table-cell-padding-y: 0.375rem;');
    expect(css).toContain('--_tr-table-cell-padding-x: var(--tinyrack-space-md);');
    expect(css).toContain('--_tr-table-cell-line-height: 1.25rem;');
    expect(css).toContain('--_tr-table-cell-padding-y: 0.875rem;');
    expect(css).toContain('--_tr-table-cell-padding-x: 1.25rem;');
    expect(css).toContain('--_tr-table-cell-line-height: 1.5rem;');
    expect(css).toContain('width: 100%;');
    expect(css).toContain('min-width: 100%;');
    expect(css).toContain('margin: 0;');
  });

  it('keeps semantic variable usage in CSS rather than the Table TS contract', () => {
    const css = readTableCss();
    const contractSource = readFileSync(
      join(repoRoot, 'src/components/table/contract.ts'),
      'utf8',
    );

    expect(css).toContain('background-color: var(--tinyrack-surface);');
    expect(css).toContain('background-color: var(--tinyrack-surface-muted);');
    expect(css).toContain(
      'border: var(--tinyrack-border-width-default) solid var(--tinyrack-border);',
    );
    expect(css).toContain('color: var(--tinyrack-text);');
    expect(css).toContain('color: var(--tinyrack-text-muted);');
    expect(contractSource).not.toContain('var(--');
    expect(contractSource).not.toContain('--tinyrack-');
    expect(contractSource).not.toContain('--tr-table-');
  });
});
