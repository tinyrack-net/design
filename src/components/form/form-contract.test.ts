import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const repoRoot = process.cwd();

describe('Form contract source boundaries', () => {
  it('keeps form primitive options in the contract module', () => {
    const contractSource = readFileSync(
      join(repoRoot, 'src/components/form/contract.ts'),
      'utf8',
    );
    const reactSource = readFileSync(
      join(repoRoot, 'src/components/form/react.tsx'),
      'utf8',
    );

    expect(contractSource).toContain("export const fieldClassName = 'tr-field'");
    expect(contractSource).toContain("export const inputClassName = 'tr-input'");
    expect(contractSource).toContain(
      "export const formControlSizes = ['sm', 'md', 'lg']",
    );
    expect(contractSource).toContain(
      "export const radioGroupOrientations = ['vertical', 'horizontal']",
    );
    expect(contractSource).not.toContain("from 'react'");
    expect(contractSource).not.toContain('var(--');
    expect(reactSource).toContain("from './contract.js';");
    expect(reactSource).not.toContain("['sm', 'md', 'lg']");
  });
});
