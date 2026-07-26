import type { MetaDescriptor } from 'react-router';

type SiteLocale = {
  language: string;
  openGraph: string;
};

type SiteImage = {
  alt?: string;
  height?: number;
  url: string;
  width?: number;
};

export type SiteSeoConfig = {
  basePath?: string;
  description: string;
  image?: SiteImage;
  locale: SiteLocale;
  title: string;
  url: string;
};

export type SitePageDescriptor = {
  alternates?: readonly {
    language: string;
    locale?: SiteLocale;
    url: string;
  }[];
  description: string;
  image?: SiteImage;
  jsonLd?: unknown;
  locale?: SiteLocale;
  publishedAt?: string;
  sitemap?: boolean;
  title: string;
  type: 'article' | 'website';
  url: string;
};

export type SiteFeedDescriptor = {
  description: string;
  imageUrl?: string;
  items: readonly {
    description: string;
    guid?: string;
    publishedAt?: string;
    title: string;
    url: string;
  }[];
  language?: string;
  path: string;
  siteUrl: string;
  title: string;
};

function escapeXml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

function normalizedBasePath(basePath = '/') {
  const normalized = `/${basePath}`.replace(/\/+/g, '/').replace(/\/+$/, '');
  return normalized.length === 0 ? '/' : normalized;
}

export function siteAssetUrl(
  site: Pick<SiteSeoConfig, 'basePath' | 'url'>,
  path: string,
) {
  const basePath = normalizedBasePath(site.basePath);
  const assetPath = path.startsWith('/') ? path : `/${path}`;
  const pathname = basePath === '/' ? assetPath : `${basePath}${assetPath}`;
  return new URL(pathname, site.url).toString();
}

export function createSiteMeta(
  site: SiteSeoConfig,
  page: SitePageDescriptor,
): MetaDescriptor[] {
  const image = page.image ?? site.image;
  const locale = page.locale ?? site.locale;
  const alternates = page.alternates ?? [];
  const descriptors: MetaDescriptor[] = [
    { title: page.title },
    { content: page.description, name: 'description' },
    { href: page.url, rel: 'canonical', tagName: 'link' },
    ...alternates.map((alternate) => ({
      href: alternate.url,
      hrefLang: alternate.language,
      rel: 'alternate',
      tagName: 'link' as const,
    })),
    { content: 'index,follow', name: 'robots' },
    { content: page.type, property: 'og:type' },
    { content: site.title, property: 'og:site_name' },
    { content: locale.openGraph, property: 'og:locale' },
    ...alternates
      .map((alternate) => alternate.locale?.openGraph)
      .filter((value): value is string => value !== undefined)
      .map((openGraph) => ({
        content: openGraph,
        property: 'og:locale:alternate',
      })),
    { content: page.title, property: 'og:title' },
    { content: page.description, property: 'og:description' },
    { content: page.url, property: 'og:url' },
    { content: 'summary_large_image', name: 'twitter:card' },
    { content: page.title, name: 'twitter:title' },
    { content: page.description, name: 'twitter:description' },
  ];

  if (page.type === 'article' && page.publishedAt !== undefined) {
    descriptors.push({
      content: page.publishedAt,
      property: 'article:published_time',
    });
  }

  if (image !== undefined) {
    const alt = image.alt ?? `${page.title} · ${site.title}`;
    descriptors.push(
      { content: image.url, property: 'og:image' },
      ...(image.width === undefined
        ? []
        : [{ content: String(image.width), property: 'og:image:width' }]),
      ...(image.height === undefined
        ? []
        : [{ content: String(image.height), property: 'og:image:height' }]),
      { content: alt, property: 'og:image:alt' },
      { content: image.url, name: 'twitter:image' },
      { content: alt, name: 'twitter:image:alt' },
    );
  }

  if (page.jsonLd !== undefined) {
    descriptors.push({ 'script:ld+json': page.jsonLd });
  }

  return descriptors;
}

export function createSitemap(pages: readonly SitePageDescriptor[]): string {
  const urls = pages
    .filter((page) => page.sitemap !== false)
    .map(
      (page) =>
        `  <url><loc>${escapeXml(page.url)}</loc>${(page.alternates ?? [])
          .map(
            (alternate) =>
              `<xhtml:link rel="alternate" hreflang="${escapeXml(alternate.language)}" href="${escapeXml(alternate.url)}" />`,
          )
          .join('')}</url>`,
    )
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls}\n</urlset>\n`;
}

export function createRobots(
  site: SiteSeoConfig,
  sitemapUrl = siteAssetUrl(site, '/sitemap.xml'),
): string {
  return `User-agent: *\nAllow: /\n\nSitemap: ${sitemapUrl}\n`;
}

export function createRss(feed: SiteFeedDescriptor): string {
  const feedUrl = new URL(feed.path, feed.siteUrl).toString();
  const items = feed.items
    .map((item) => {
      const pubDate =
        item.publishedAt === undefined
          ? undefined
          : new Date(item.publishedAt).toUTCString();
      const guid = item.guid ?? item.url;
      return [
        '    <item>',
        `      <title>${escapeXml(item.title)}</title>`,
        `      <description>${escapeXml(item.description)}</description>`,
        ...(pubDate === undefined ? [] : [`      <pubDate>${pubDate}</pubDate>`]),
        `      <link>${escapeXml(item.url)}</link>`,
        `      <guid>${escapeXml(guid)}</guid>`,
        '    </item>',
      ].join('\n');
    })
    .join('\n');
  const language =
    feed.language === undefined
      ? ''
      : `\n    <language>${escapeXml(feed.language)}</language>`;
  const image =
    feed.imageUrl === undefined
      ? ''
      : `\n    <image>\n      <url>${escapeXml(feed.imageUrl)}</url>\n      <title>${escapeXml(feed.title)}</title>\n      <link>${escapeXml(feed.siteUrl)}</link>\n    </image>`;

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(feed.title)}</title>
    <description>${escapeXml(feed.description)}</description>
    <link>${escapeXml(feed.siteUrl)}</link>
    <atom:link xmlns:atom="http://www.w3.org/2005/Atom" href="${escapeXml(feedUrl)}" rel="self" type="application/rss+xml" />${language}${image}
${items}
  </channel>
</rss>
`;
}
