import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const repoRoot = process.cwd();

describe('Alert contract source boundaries', () => {
  it('keeps the Alert option contract outside the React wrapper', () => {
    const contractSource = readFileSync(
      join(repoRoot, 'src/components/alert/contract.ts'),
      'utf8',
    );
    const reactSource = readFileSync(
      join(repoRoot, 'src/components/alert/react.tsx'),
      'utf8',
    );

    expect(contractSource).toContain(
      "'neutral',\n  'info',\n  'success',\n  'warning',\n  'danger'",
    );
    expect(contractSource).not.toContain("'primary'");
    expect(contractSource).not.toContain("from 'react'");
    expect(contractSource).not.toContain('var(--');
    expect(reactSource).toContain("from './contract.js';");
    expect(reactSource).not.toContain("'success'");
  });
});
