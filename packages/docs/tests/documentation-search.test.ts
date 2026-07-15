import { describe, expect, it } from 'vitest';
import {
  prepareDocumentationSearch,
  searchDocumentation,
} from '../src/runtime/documentation-search-index.js';

describe('documentation search fallback', () => {
  it('uses manifest titles when Pagefind assets do not exist in development', async () => {
    expect(await prepareDocumentationSearch()).toBe('fallback');
    expect(await searchDocumentation('button')).toEqual({
      results: [
        expect.objectContaining({
          title: 'Button',
          titleMatches: [{ end: 6, start: 0 }],
          url: '/components/button',
        }),
      ],
      source: 'fallback',
    });
  });

  it('returns no results for an empty query', async () => {
    expect(await searchDocumentation('  ')).toEqual({
      results: [],
      source: 'fallback',
    });
  });
});
