import type { MetaDescriptor } from 'react-router';
import type { DocsManifest, DocsPage } from '../config/docs-config.ts';
import { normalizeDocumentPathname } from '../config/docs-config.ts';

export function documentPathFromLocation(pathname: string, manifest: DocsManifest) {
  const normalized = normalizeDocumentPathname(pathname);
  const { basePath } = manifest.site;
  if (basePath === '/') return normalized;
  if (normalized === basePath) return '/';
  if (normalized.startsWith(`${basePath}/`)) {
    return normalizeDocumentPathname(normalized.slice(basePath.length));
  }
  return normalized;
}

export function findDocsPage(pathname: string, manifest: DocsManifest) {
  const documentPath = documentPathFromLocation(pathname, manifest);
  return manifest.pages.find((page) => page.path === documentPath);
}

function structuredData(page: DocsPage, manifest: DocsManifest) {
  if (page.contentKey === '/') {
    return {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: manifest.site.title,
      url: page.canonicalUrl,
    };
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: page.breadcrumbs.map((breadcrumb, index) => ({
      '@type': 'ListItem',
      item: breadcrumb.url,
      name: breadcrumb.name,
      position: index + 1,
    })),
  };
}

export function createDocumentMeta(
  pathname: string,
  manifest: DocsManifest,
): MetaDescriptor[] {
  const page = findDocsPage(pathname, manifest);
  if (page === undefined) {
    return [
      { title: `Page not found · ${manifest.site.title}` },
      { content: 'noindex,nofollow', name: 'robots' },
    ];
  }

  const imageAlt = `${page.title} · ${manifest.site.title}`;
  const locale = manifest.locales[page.locale];
  return [
    { title: page.documentTitle },
    { content: page.description, name: 'description' },
    { href: page.canonicalUrl, rel: 'canonical', tagName: 'link' },
    ...page.alternates.map((alternate) => ({
      href: alternate.url,
      hrefLang: alternate.language,
      rel: 'alternate',
      tagName: 'link' as const,
    })),
    { content: 'index,follow', name: 'robots' },
    { content: 'website', property: 'og:type' },
    { content: manifest.site.title, property: 'og:site_name' },
    {
      content: locale?.openGraph ?? manifest.site.locale.openGraph,
      property: 'og:locale',
    },
    ...page.alternates
      .filter((alternate) => alternate.locale !== page.locale)
      .map((alternate) => ({
        content: manifest.locales[alternate.locale]?.openGraph ?? alternate.language,
        property: 'og:locale:alternate',
      })),
    { content: page.documentTitle, property: 'og:title' },
    { content: page.description, property: 'og:description' },
    { content: page.canonicalUrl, property: 'og:url' },
    { content: page.imageUrl, property: 'og:image' },
    { content: '1200', property: 'og:image:width' },
    { content: '630', property: 'og:image:height' },
    { content: imageAlt, property: 'og:image:alt' },
    { content: 'summary_large_image', name: 'twitter:card' },
    { content: page.documentTitle, name: 'twitter:title' },
    { content: page.description, name: 'twitter:description' },
    { content: page.imageUrl, name: 'twitter:image' },
    { content: imageAlt, name: 'twitter:image:alt' },
    { 'script:ld+json': structuredData(page, manifest) },
  ];
}

export function docsAssetPath(path: string, manifest: DocsManifest) {
  if (/^(?:[a-z]+:)?\/\//i.test(path)) return path;
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return manifest.site.basePath === '/'
    ? normalized
    : `${manifest.site.basePath}${normalized}`;
}
