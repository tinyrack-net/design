import type { MetaDescriptor } from 'react-router';
import { normalizeDocumentPathname } from '../content/shared/static-document-routes.js';

export const documentSiteName = 'Tinyrack UI';
export const documentSiteUrl = 'https://design.tinyrack.net';
export const releaseFeedUrl = 'https://github.com/tinyrack-net/themes/releases.atom';

export type DocumentSeoBreadcrumb = {
  name: string;
  url: string;
};

export type DocumentSeoEntry = {
  breadcrumbs: readonly DocumentSeoBreadcrumb[];
  canonicalPath: string;
  canonicalUrl: string;
  description: string;
  documentTitle: string;
  imagePath: string;
  imageUrl: string;
  path: string;
  section: 'start' | 'foundations' | 'components' | 'integrations';
  sourceFile: string;
  title: string;
};

function structuredData(entry: DocumentSeoEntry) {
  if (entry.path === '/') {
    return {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: documentSiteName,
      url: `${documentSiteUrl}/`,
    };
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: entry.breadcrumbs.map((breadcrumb, index) => ({
      '@type': 'ListItem',
      item: breadcrumb.url,
      name: breadcrumb.name,
      position: index + 1,
    })),
  };
}

export function findDocumentSeoEntry(
  pathname: string,
  manifest: readonly DocumentSeoEntry[],
) {
  const normalizedPathname = normalizeDocumentPathname(pathname);
  return manifest.find((entry) => entry.path === normalizedPathname);
}

export function createDocumentMeta(
  pathname: string,
  manifest: readonly DocumentSeoEntry[],
): MetaDescriptor[] {
  const entry = findDocumentSeoEntry(pathname, manifest);

  if (entry === undefined) {
    return [
      { title: `Page not found · ${documentSiteName}` },
      { content: 'noindex,nofollow', name: 'robots' },
    ];
  }

  const imageAlt = `${entry.title} · ${documentSiteName}`;

  return [
    { title: entry.documentTitle },
    { content: entry.description, name: 'description' },
    { href: entry.canonicalUrl, rel: 'canonical', tagName: 'link' },
    { content: 'index,follow', name: 'robots' },
    { content: 'website', property: 'og:type' },
    { content: documentSiteName, property: 'og:site_name' },
    { content: 'en_US', property: 'og:locale' },
    { content: entry.documentTitle, property: 'og:title' },
    { content: entry.description, property: 'og:description' },
    { content: entry.canonicalUrl, property: 'og:url' },
    { content: entry.imageUrl, property: 'og:image' },
    { content: '1200', property: 'og:image:width' },
    { content: '630', property: 'og:image:height' },
    { content: imageAlt, property: 'og:image:alt' },
    { content: 'summary_large_image', name: 'twitter:card' },
    { content: entry.documentTitle, name: 'twitter:title' },
    { content: entry.description, name: 'twitter:description' },
    { content: entry.imageUrl, name: 'twitter:image' },
    { content: imageAlt, name: 'twitter:image:alt' },
    { 'script:ld+json': structuredData(entry) },
  ];
}
