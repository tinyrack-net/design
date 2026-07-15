import { DocsSearchDialog, DocsSearchTrigger } from './docs-search.js';

export const DocsSearch = {
  Dialog: DocsSearchDialog,
  Trigger: DocsSearchTrigger,
} as const;

export type {
  DocsSearchDialogProps,
  DocsSearchMatch,
  DocsSearchMessages,
  DocsSearchResult,
  DocsSearchTriggerProps,
} from './docs-search.js';
export { DocsSearchDialog, DocsSearchTrigger };
