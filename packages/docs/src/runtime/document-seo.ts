import type { MetaDescriptor } from 'react-router';
import type {
  DocsManifest,
  DocsPage,
  DocsResolvedInstance,
} from '../config/docs-config.ts';
import { normalizeDocumentPathname } from '../config/document-path.ts';
import {
  createSiteMeta,
  type SitePageDescriptor,
  type SiteSeoConfig,
} from '../site/site.ts';

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

export function findDocsInstance(
  pathname: string,
  manifest: DocsManifest,
): DocsResolvedInstance | undefined {
  const page = findDocsPage(pathname, manifest);
  if (page?.instanceId !== undefined) {
    return manifest.instances.find((instance) => instance.id === page.instanceId);
  }
  const path = documentPathFromLocation(pathname, manifest);
  return [...manifest.instances]
    .sort((first, second) => second.routeBasePath.length - first.routeBasePath.length)
    .find((instance) =>
      Object.values(instance.landingPaths).some(
        (landingPath) => path === landingPath || path.startsWith(`${landingPath}/`),
      ),
    );
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

  const site: SiteSeoConfig = {
    basePath: manifest.site.basePath,
    description: manifest.site.description,
    locale: manifest.site.locale,
    title: manifest.site.title,
    url: manifest.site.url,
  };
  const descriptor: SitePageDescriptor = {
    alternates: page.alternates.map((alternate) => {
      const alternateLocale = manifest.locales[alternate.locale];
      return {
        language: alternate.language,
        ...(alternateLocale === undefined ? {} : { locale: alternateLocale }),
        url: alternate.url,
      };
    }),
    description: page.description,
    image: {
      alt: `${page.title} · ${manifest.site.title}`,
      height: 630,
      url: page.imageUrl,
      width: 1200,
    },
    jsonLd: structuredData(page, manifest),
    locale: manifest.locales[page.locale] ?? manifest.site.locale,
    title: page.documentTitle,
    type: 'website',
    url: page.canonicalUrl,
  };
  return createSiteMeta(site, descriptor);
}

export function docsAssetPath(path: string, manifest: DocsManifest) {
  if (/^(?:[a-z]+:)?\/\//i.test(path)) return path;
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return manifest.site.basePath === '/'
    ? normalized
    : `${manifest.site.basePath}${normalized}`;
}
