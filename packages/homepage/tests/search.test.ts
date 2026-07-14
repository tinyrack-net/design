import { describe, expect, it } from 'vitest';
import { searchDocumentation } from '../app/components/documentation-search-index.js';

describe('documentation search development fallback', () => {
  it('matches static route titles without generated Pagefind assets', async () => {
    const response = await searchDocumentation('button');

    expect(response?.source).toBe('fallback');
    expect(response?.results[0]).toMatchObject({
      excerptMatches: [{ end: 18, start: 12 }],
      titleMatches: [{ end: 6, start: 0 }],
      title: 'Button',
      url: '/components/button',
    });

    const logoResponse = await searchDocumentation('logo');
    expect(logoResponse?.results[0]).toMatchObject({
      title: 'Logo',
      url: '/foundations/logo',
    });

    const appIconsResponse = await searchDocumentation('app icons');
    expect(appIconsResponse?.results[0]).toMatchObject({
      title: 'App icons',
      url: '/foundations/app-icons',
    });
  });
});
