import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const repoRoot = process.cwd();

describe('CodeBlock contract source boundaries', () => {
  it('keeps the CodeBlock class contract outside the React wrapper', () => {
    const contractSource = readFileSync(
      join(repoRoot, 'src/components/code-block/contract.ts'),
      'utf8',
    );
    const reactSource = readFileSync(
      join(repoRoot, 'src/components/code-block/react.tsx'),
      'utf8',
    );
    const shikiSource = readFileSync(
      join(repoRoot, 'src/components/code-block/shiki-react.tsx'),
      'utf8',
    );

    expect(contractSource).toContain(
      "export const codeBlockClassName = 'tr-code-block'",
    );
    expect(contractSource).not.toContain("from 'react'");
    expect(contractSource).not.toContain('var(--');
    expect(contractSource).not.toContain('--tinyrack-');
    expect(reactSource).toContain("from './contract.js';");
    expect(reactSource).not.toContain('shiki');
    expect(reactSource).not.toContain('window');
    expect(reactSource).not.toContain('document');
    expect(reactSource).not.toContain('useEffect');
    expect(shikiSource).toContain("'use client';");
    expect(shikiSource).toContain("await import('shiki/bundle/web')");
    expect(shikiSource).not.toContain('dangerouslySetInnerHTML');
  });
});
