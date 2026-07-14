import type { DocumentSeoEntry } from '../../seo/document-seo.js';
import {
  canonicalDocumentPath,
  normalizeDocumentPathname,
  type StaticDocumentRoute,
  staticDocumentRoutes,
} from './static-document-routes.js';

export type DocumentPaginationDestination = Pick<
  DocumentSeoEntry,
  'description' | 'section' | 'title'
> & {
  path: string;
};

export type DocumentPagination = {
  next?: DocumentPaginationDestination;
  previous?: DocumentPaginationDestination;
};

function destinationForRoute(
  route: StaticDocumentRoute,
  manifest: readonly DocumentSeoEntry[],
): DocumentPaginationDestination {
  const metadata = manifest.find(
    (entry) => normalizeDocumentPathname(entry.path) === route.path,
  );

  if (metadata === undefined) {
    throw new Error(`Missing document metadata for ${route.path}`);
  }

  return {
    description: metadata.description,
    path: canonicalDocumentPath(route.path),
    section: route.section,
    title: route.title,
  };
}

export function getDocumentPagination(
  pathname: string,
  manifest: readonly DocumentSeoEntry[],
): DocumentPagination {
  const currentPathname = normalizeDocumentPathname(pathname);
  const currentIndex = staticDocumentRoutes.findIndex(
    (route) => route.path === currentPathname,
  );

  if (currentIndex < 0) return {};

  const previousRoute = staticDocumentRoutes[currentIndex - 1];
  const nextRoute = staticDocumentRoutes[currentIndex + 1];

  return {
    ...(nextRoute === undefined
      ? {}
      : { next: destinationForRoute(nextRoute, manifest) }),
    ...(previousRoute === undefined
      ? {}
      : { previous: destinationForRoute(previousRoute, manifest) }),
  };
}
