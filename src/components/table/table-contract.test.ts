import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const repoRoot = process.cwd();

describe('Table contract source boundaries', () => {
  it('keeps the Table option contract outside the React wrapper', () => {
    const contractSource = readFileSync(
      join(repoRoot, 'src/components/table/contract.ts'),
      'utf8',
    );
    const reactTableSource = readFileSync(
      join(repoRoot, 'src/components/table/react.tsx'),
      'utf8',
    );

    expect(contractSource).toContain("export const tableClassName = 'tr-table'");
    expect(contractSource).toContain(
      "export const tableContainerClassName = 'tr-table-container'",
    );
    expect(contractSource).toContain(
      "export const tableDensities = ['compact', 'normal', 'comfortable']",
    );
    expect(contractSource).not.toContain("from 'react'");
    expect(contractSource).not.toContain('var(--');
    expect(contractSource).not.toContain('--tinyrack-');
    expect(contractSource).not.toContain('--tr-table-');
    expect(reactTableSource).toContain("from './contract.js';");
    expect(reactTableSource).not.toContain("['compact', 'normal', 'comfortable']");
    expect(reactTableSource).not.toContain('TableHead');
    expect(reactTableSource).not.toContain('TableRow');
    expect(reactTableSource).not.toContain('TableCell');
  });
});
