import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const repoRoot = process.cwd();

describe('Button contract source boundaries', () => {
  it('keeps the Button option contract outside the React wrapper', () => {
    const contractSource = readFileSync(
      join(repoRoot, 'src/components/button/contract.ts'),
      'utf8',
    );
    const reactButtonSource = readFileSync(
      join(repoRoot, 'src/components/button/react.tsx'),
      'utf8',
    );

    expect(contractSource).toContain("export const buttonSizes = ['sm', 'md', 'lg']");
    expect(contractSource).toContain(
      "export const iconButtonClassName = 'tr-icon-btn'",
    );
    expect(contractSource).toContain(
      "export const buttonVariants = ['secondary', 'primary', 'danger']",
    );
    expect(contractSource).toContain(
      "export const buttonAppearances = ['solid', 'outline', 'ghost']",
    );
    expect(contractSource).not.toContain("from 'react'");
    expect(contractSource).not.toContain('var(--');
    expect(contractSource).not.toContain('--tinyrack-');
    expect(contractSource).not.toContain('--tr-btn-');
    expect(reactButtonSource).toContain("from './contract.js';");
    expect(reactButtonSource).toContain('IconButton');
    expect(reactButtonSource).not.toContain("['sm', 'md', 'lg']");
    expect(reactButtonSource).not.toContain("['secondary', 'primary', 'danger']");
    expect(reactButtonSource).not.toContain("['solid', 'outline', 'ghost']");
    expect(reactButtonSource).not.toContain('ButtonTone');
    expect(reactButtonSource).not.toContain('tone?:');
  });
});
