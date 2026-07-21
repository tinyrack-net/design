import { describe, expect, it } from 'vitest';
import {
  docsPageModuleStem,
  docsPagePathStem,
  isDocsPageFile,
  isDocsTsxPageFile,
} from '../src/config/docs-page-file.js';

describe('isDocsPageFile', () => {
  it.each([
    ['index.mdx', true],
    ['button.docs.mdx', true],
    ['index.docs.tsx', true],
    ['welcome-page.tsx', true],
    ['button.demo.tsx', true],
    ['index.tsx', true],
    ['metadata.ts', false],
    ['readme.md', false],
  ])('classifies %s', (path, expected) => {
    expect(isDocsPageFile(path)).toBe(expected);
  });

  it.each([
    ['index.tsx', true],
    ['guide.docs.tsx', true],
    ['index.mdx', false],
    ['component.ts', false],
  ])('classifies TSX page %s', (path, expected) => {
    expect(isDocsTsxPageFile(path)).toBe(expected);
  });

  it('strips only the final route extension', () => {
    expect(docsPageModuleStem('guides/button.docs.mdx')).toBe('button.docs');
    expect(docsPageModuleStem('guides\\index.tsx')).toBe('index');
    expect(docsPagePathStem('guides/button.docs.mdx')).toBe('guides/button.docs');
    expect(docsPagePathStem('guides\\button.docs.tsx')).toBe('guides/button.docs');
  });
});
