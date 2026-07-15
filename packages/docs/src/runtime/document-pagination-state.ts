import type { DocsManifest, DocsPage } from '../config/docs-config.ts';
import { canonicalDocumentPath } from '../config/docs-config.ts';
import { documentPathFromLocation } from './document-seo.ts';

export type DocumentPaginationDestination = Pick<
  DocsPage,
  'description' | 'section' | 'sectionLabel' | 'title'
> & {
  path: string;
};

export type DocumentPaginationState = {
  next?: DocumentPaginationDestination;
  previous?: DocumentPaginationDestination;
};

function destination(page: DocsPage): DocumentPaginationDestination {
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
  const currentIndex = manifest.pages.findIndex((page) => page.path === documentPath);
  if (currentIndex < 0) return {};

  const previous = manifest.pages[currentIndex - 1];
  const next = manifest.pages[currentIndex + 1];
  return {
    ...(next === undefined ? {} : { next: destination(next) }),
    ...(previous === undefined ? {} : { previous: destination(previous) }),
  };
}
