import type { DocsManifest, DocsPage } from '../config/docs-config.ts';
import { canonicalDocumentPath } from '../config/docs-config.ts';
import { documentPathFromLocation } from './document-seo.ts';

export type TRDocumentPaginationDestination = Pick<
  DocsPage,
  'description' | 'section' | 'sectionLabel' | 'title'
> & {
  path: string;
};

export type DocumentPaginationState = {
  next?: TRDocumentPaginationDestination;
  previous?: TRDocumentPaginationDestination;
};

function destination(page: DocsPage): TRDocumentPaginationDestination {
  return {
    description: page.description,
    path: canonicalDocumentPath(page.path),
    section: page.section,
    sectionLabel: page.sectionLabel,
    title: page.title,
  };
}

export function getDocumentPagination(
  pathname: string,
  manifest: DocsManifest,
): DocumentPaginationState {
  const documentPath = documentPathFromLocation(pathname, manifest);
  const currentPage = manifest.pages.find((page) => page.path === documentPath);
  if (currentPage === undefined) return {};
  const pages = manifest.pages.filter(
    (page) =>
      page.locale === currentPage.locale && page.layout === 'docs' && page.navigation,
  );
  const currentIndex = pages.findIndex((page) => page.path === documentPath);
  if (currentIndex < 0) return {};

  const previous = pages[currentIndex - 1];
  const next = pages[currentIndex + 1];
  return {
    ...(next === undefined ? {} : { next: destination(next) }),
    ...(previous === undefined ? {} : { previous: destination(previous) }),
  };
}
