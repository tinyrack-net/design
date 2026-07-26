import { describe, expect, it } from 'vitest';
import {
  createSiteAssetSources,
  siteAssetOutputFileName,
} from './site-assets-plugin.ts';

describe('createSiteAssetSources', () => {
  it('creates sitemap, robots, and configured feeds', () => {
    const assets = createSiteAssetSources({
      feeds: () => [
        {
          description: 'Updates',
          items: [],
          path: '/rss.xml',
          siteUrl: 'https://example.com/',
          title: 'Example',
        },
      ],
      pages: () => [
        {
          description: 'Home',
          title: 'Example',
          type: 'website',
          url: 'https://example.com/',
        },
      ],
      site: {
        description: 'Example',
        locale: { language: 'en', openGraph: 'en_US' },
        title: 'Example',
        url: 'https://example.com',
      },
    });

    expect([...assets.keys()]).toEqual(['/sitemap.xml', '/robots.txt', '/rss.xml']);
    expect(assets.get('/sitemap.xml')?.source).toContain(
      '<loc>https://example.com/</loc>',
    );
    expect(assets.get('/rss.xml')?.contentType).toBe(
      'application/rss+xml; charset=utf-8',
    );
  });

  it('emits assets at the root or configured deployment base path', () => {
    expect(siteAssetOutputFileName('/', '/robots.txt')).toBe('robots.txt');
    expect(siteAssetOutputFileName('/team/docs', '/rss.xml')).toBe('team/docs/rss.xml');
  });
});
