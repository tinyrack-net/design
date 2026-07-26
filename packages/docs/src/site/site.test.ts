import { describe, expect, it } from 'vitest';
import {
  createRobots,
  createRss,
  createSiteMeta,
  createSitemap,
  type SitePageDescriptor,
  type SiteSeoConfig,
  siteAssetUrl,
} from './site.ts';

const site: SiteSeoConfig = {
  basePath: '/docs',
  description: 'Tinyrack docs',
  locale: { language: 'en', openGraph: 'en_US' },
  title: 'Tinyrack',
  url: 'https://example.com',
};

const page: SitePageDescriptor = {
  alternates: [
    {
      language: 'ko',
      locale: { language: 'ko', openGraph: 'ko_KR' },
      url: 'https://example.com/docs/ko/guide/',
    },
  ],
  description: 'A guide & reference.',
  image: {
    height: 630,
    url: 'https://example.com/docs/og/guide.png',
    width: 1200,
  },
  publishedAt: '2026-07-27T00:00:00.000Z',
  title: 'Guide <One>',
  type: 'article',
  url: 'https://example.com/docs/guide/',
};

describe('site SEO generators', () => {
  it('builds canonical, alternate, article, image, and locale metadata', () => {
    expect(createSiteMeta(site, page)).toEqual(
      expect.arrayContaining([
        { href: page.url, rel: 'canonical', tagName: 'link' },
        {
          href: 'https://example.com/docs/ko/guide/',
          hrefLang: 'ko',
          rel: 'alternate',
          tagName: 'link',
        },
        { content: 'article', property: 'og:type' },
        { content: 'ko_KR', property: 'og:locale:alternate' },
        {
          content: '2026-07-27T00:00:00.000Z',
          property: 'article:published_time',
        },
        { content: '1200', property: 'og:image:width' },
      ]),
    );
  });

  it('escapes sitemap values and excludes opted-out pages', () => {
    const sitemap = createSitemap([
      page,
      { ...page, sitemap: false, url: 'https://example.com/private/' },
    ]);
    expect(sitemap).toContain('<loc>https://example.com/docs/guide/</loc>');
    expect(sitemap).not.toContain('/private/');
    expect(sitemap).toContain('hreflang="ko"');
    expect(createSiteMeta(site, { ...page, sitemap: false })).toContainEqual({
      content: 'index,follow',
      name: 'robots',
    });
  });

  it('resolves base-path assets and robots URLs', () => {
    expect(siteAssetUrl(site, 'sitemap.xml')).toBe(
      'https://example.com/docs/sitemap.xml',
    );
    expect(createRobots(site)).toContain(
      'Sitemap: https://example.com/docs/sitemap.xml',
    );
  });

  it('creates an escaped RSS 2.0 feed with stable GUIDs and UTC dates', () => {
    const rss = createRss({
      description: 'News & updates',
      imageUrl: 'https://example.com/icon.svg',
      items: [
        {
          description: 'A <release>',
          publishedAt: '2026-07-27T00:00:00.000Z',
          title: 'Release & notes',
          url: 'https://example.com/release/',
        },
      ],
      language: 'en',
      path: '/rss.xml',
      siteUrl: 'https://example.com/',
      title: 'Tinyrack',
    });
    expect(rss).toContain('<rss version="2.0">');
    expect(rss).toContain('Release &amp; notes');
    expect(rss).toContain('A &lt;release&gt;');
    expect(rss).toContain('<guid>https://example.com/release/</guid>');
    expect(rss).toContain('<pubDate>Mon, 27 Jul 2026 00:00:00 GMT</pubDate>');
    expect(rss).toContain('rel="self"');
  });
});
