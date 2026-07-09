import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const repoRoot = process.cwd();

describe('Link contract source boundaries', () => {
  it('keeps Link options in the framework-neutral contract', () => {
    const contractSource = readFileSync(
      join(repoRoot, 'src/components/link/contract.ts'),
      'utf8',
    );
    const reactSource = readFileSync(
      join(repoRoot, 'src/components/link/react.tsx'),
      'utf8',
    );

    expect(contractSource).toContain("export const linkClassName = 'tr-link'");
    expect(contractSource).toContain(
      "export const linkVariants = ['neutral', 'primary', 'danger']",
    );
    expect(contractSource).toContain(
      "export const linkUnderlines = ['none', 'hover', 'always']",
    );
    expect(contractSource).not.toContain("from 'react'");
    expect(contractSource).not.toContain('var(--');
    expect(reactSource).toContain("from './contract.js';");
    expect(reactSource).not.toContain("['neutral', 'primary', 'danger']");
  });
});
