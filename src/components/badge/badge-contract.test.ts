import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const repoRoot = process.cwd();

describe('Badge contract source boundaries', () => {
  it('keeps the Badge option contract outside the React wrapper', () => {
    const contractSource = readFileSync(
      join(repoRoot, 'src/components/badge/contract.ts'),
      'utf8',
    );
    const reactBadgeSource = readFileSync(
      join(repoRoot, 'src/components/badge/react.tsx'),
      'utf8',
    );

    expect(contractSource).toContain("export const badgeSizes = ['sm', 'md']");
    expect(contractSource).toContain(
      "export const badgeVariants = ['neutral', 'primary', 'danger']",
    );
    expect(contractSource).not.toContain("from 'react'");
    expect(contractSource).not.toContain('var(--');
    expect(contractSource).not.toContain('--tinyrack-');
    expect(contractSource).not.toContain('--tr-badge-');
    expect(reactBadgeSource).toContain("from './contract.js';");
    expect(reactBadgeSource).not.toContain("['sm', 'md']");
    expect(reactBadgeSource).not.toContain("['neutral', 'primary', 'danger']");
    expect(reactBadgeSource).not.toContain('Doc');
  });
});
