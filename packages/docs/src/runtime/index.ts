/// <reference path="./docs-virtual.d.ts" />

export type { DocsPageProps } from './docs-page/index.tsx';
export { DocsPage } from './docs-page/index.tsx';
export { default, Layout, links, meta } from './docs-root.tsx';
export type {
  DocumentPaginationState,
  TRDocumentPaginationDestination,
} from './document-pagination-state.ts';
export { getDocumentPagination } from './document-pagination-state.ts';
export { createDocumentMeta, findDocsPage } from './document-seo.ts';
export type {
  DocumentationSearchMatch,
  DocumentationSearchResponse,
  DocumentationSearchResult,
  DocumentationSearchSource,
} from './documentation-search-index.ts';
export {
  prepareDocumentationSearch,
  searchDocumentation,
} from './documentation-search-index.ts';
