import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const repoRoot = process.cwd();

describe('Code contract source boundaries', () => {
  it('keeps the Code class contract outside the React wrapper', () => {
    const contractSource = readFileSync(
      join(repoRoot, 'src/components/code/contract.ts'),
      'utf8',
    );
    const reactCodeSource = readFileSync(
      join(repoRoot, 'src/components/code/react.tsx'),
      'utf8',
    );

    expect(contractSource).toContain("export const codeClassName = 'tr-code'");
    expect(contractSource).not.toContain('codeBlockClassName');
    expect(contractSource).not.toContain("from 'react'");
    expect(contractSource).not.toContain('var(--');
    expect(contractSource).not.toContain('--tinyrack-');
    expect(reactCodeSource).toContain("from './contract.js';");
    expect(reactCodeSource).not.toContain('CodeBlock');
    expect(reactCodeSource).not.toContain('Doc');
  });
});
