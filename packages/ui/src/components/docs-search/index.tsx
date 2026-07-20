import { TRDocsSearchDialog, TRDocsSearchTrigger } from './docs-search.js';

export const TRDocsSearch = {
  Dialog: TRDocsSearchDialog,
  Trigger: TRDocsSearchTrigger,
} as const;

export type {
  TRDocsSearchDialogProps,
  TRDocsSearchMatch,
  TRDocsSearchMessages,
  TRDocsSearchResult,
  TRDocsSearchTriggerProps,
} from './docs-search.js';
export { TRDocsSearchDialog, TRDocsSearchTrigger };
