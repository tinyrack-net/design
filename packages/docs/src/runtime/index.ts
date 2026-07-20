/// <reference path="./docs-virtual.d.ts" />

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
