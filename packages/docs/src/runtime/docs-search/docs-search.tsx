'use client';

import { TRButton } from '@tinyrack/ui/components/button';
import { TRDialog } from '@tinyrack/ui/components/dialog';
import { TRSpinner } from '@tinyrack/ui/components/spinner';
import { Search } from 'lucide-react';
import type { ComponentProps, ReactNode, Ref, RefObject } from 'react';
import { useEffect, useId, useRef, useState } from 'react';
import { mergeComponentClassName } from '../utils/component-class-name.ts';

export type TRDocsSearchMatch = { end: number; start: number };
export type TRDocsSearchResult = {
  excerpt: string;
  excerptMatches?: readonly TRDocsSearchMatch[];
  id: string;
  section?: string;
  sectionMatches?: readonly TRDocsSearchMatch[];
  title: string;
  titleMatches?: readonly TRDocsSearchMatch[];
  url: string;
};

export type TRDocsSearchMessages = {
  close: string;
  empty: string;
  error: string;
  fallback: string;
  idle: string;
  loading: string;
  placeholder: string;
  results: string;
  title: string;
  trigger: string;
};

const defaultMessages: TRDocsSearchMessages = {
  close: 'Close search',
  empty: 'No documentation found.',
  error: 'Documentation search is unavailable.',
  fallback: 'Search is using the bundled fallback index.',
  idle: 'Type to search documentation.',
  loading: 'Searching documentation',
  placeholder: 'Search documentation',
  results: 'Search results',
  title: 'Search documentation',
  trigger: 'Search docs',
};

export type TRDocsSearchTriggerProps = Omit<
  ComponentProps<typeof TRButton>,
  'children'
> & { compact?: boolean; label?: string; shortcutLabel?: string };

export function TRDocsSearchTrigger({
  className,
  compact = false,
  label = defaultMessages.trigger,
  shortcutLabel = 'Ctrl / ⌘ K',
  ...props
}: TRDocsSearchTriggerProps) {
  return (
    <TRButton
      {...props}
      appearance={compact ? 'ghost' : 'outline'}
      aria-keyshortcuts="Control+K Meta+K"
      className={mergeComponentClassName('tr-docs-search-trigger', className)}
      data-compact={compact || undefined}
    >
      <Search aria-hidden="true" className="tr-docs-search-icon" />
      <span>{label}</span>
      <kbd>{shortcutLabel}</kbd>
    </TRButton>
  );
}

function HighlightedText({
  matches,
  text,
}: {
  matches: readonly TRDocsSearchMatch[] | undefined;
  text: string;
}) {
  const content: ReactNode[] = [];
  let cursor = 0;
  for (const match of matches ?? []) {
    if (match.start > cursor) content.push(text.slice(cursor, match.start));
    content.push(
      <mark className="tr-docs-search-match" key={`${match.start}-${match.end}`}>
        {text.slice(match.start, match.end)}
      </mark>,
    );
    cursor = match.end;
  }
  if (cursor < text.length) content.push(text.slice(cursor));
  return content;
}

export type TRDocsSearchDialogProps = {
  enableShortcut?: boolean;
  fallback?: boolean;
  messages?: Partial<TRDocsSearchMessages>;
  onOpenChange: (open: boolean) => void;
  onSearch: (
    query: string,
    signal: AbortSignal,
  ) => Promise<readonly TRDocsSearchResult[]>;
  onSelect: (result: TRDocsSearchResult) => void;
  open: boolean;
  popupRef?: Ref<HTMLDivElement>;
  returnFocusRef?: RefObject<HTMLElement | null>;
};

export function TRDocsSearchDialog({
  enableShortcut = true,
  fallback = false,
  messages: messageOverrides,
  onOpenChange,
  onSearch,
  onSelect,
  open,
  popupRef,
  returnFocusRef,
}: TRDocsSearchDialogProps) {
  const messages = { ...defaultMessages, ...messageOverrides };
  const descriptionId = useId();
  const [activeIndex, setActiveIndex] = useState(-1);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<readonly TRDocsSearchResult[]>([]);
  const [searchFailed, setSearchFailed] = useState(false);
  const [loading, setLoading] = useState(false);
  const activeIndexRef = useRef(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const requestRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!enableShortcut) return;
    const handleShortcut = (event: KeyboardEvent) => {
      if (!(event.ctrlKey || event.metaKey) || event.key.toLowerCase() !== 'k') return;
      event.preventDefault();
      onOpenChange(true);
    };
    window.addEventListener('keydown', handleShortcut);
    return () => window.removeEventListener('keydown', handleShortcut);
  }, [enableShortcut, onOpenChange]);

  useEffect(() => {
    if (open) return;
    requestRef.current?.abort();
    activeIndexRef.current = -1;
    setActiveIndex(-1);
    setLoading(false);
    setSearchFailed(false);
    setQuery('');
    setResults([]);
  }, [open]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    requestRef.current?.abort();
    if (query.trim().length === 0) {
      setLoading(false);
      setSearchFailed(false);
      setResults([]);
      return;
    }
    const controller = new AbortController();
    requestRef.current = controller;
    setLoading(true);
    setSearchFailed(false);
    void onSearch(query, controller.signal)
      .then((nextResults) => {
        if (!controller.signal.aborted) {
          activeIndexRef.current = -1;
          setActiveIndex(-1);
          setResults(nextResults);
        }
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          activeIndexRef.current = -1;
          setActiveIndex(-1);
          setResults([]);
          setSearchFailed(true);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [onSearch, query]);

  useEffect(() => {
    const id = results[activeIndex]?.id;
    if (id !== undefined) {
      document.getElementById(id)?.scrollIntoView({ block: 'nearest' });
    }
  }, [activeIndex, results]);

  function select(result: TRDocsSearchResult | undefined) {
    if (result === undefined) return;
    onOpenChange(false);
    onSelect(result);
  }

  return (
    <TRDialog.Root onOpenChange={onOpenChange} open={open}>
      <TRDialog.Portal>
        <TRDialog.Backdrop />
        <TRDialog.Popup
          className="tr-docs-search-dialog"
          finalFocus={returnFocusRef}
          ref={popupRef}
        >
          <TRDialog.Title className="tr-docs-search-visually-hidden">
            {messages.title}
          </TRDialog.Title>
          <TRDialog.Description className="tr-docs-search-visually-hidden">
            {messages.idle}
          </TRDialog.Description>
          <div className="tr-docs-search-heading">
            <Search aria-hidden="true" className="tr-docs-search-icon" />
            <input
              aria-activedescendant={results[activeIndex]?.id}
              aria-autocomplete="list"
              aria-controls={descriptionId}
              aria-expanded={open}
              aria-label={messages.title}
              className="tr-docs-search-input"
              onChange={(event) => setQuery(event.currentTarget.value)}
              onKeyDown={(event) => {
                if (event.key === 'ArrowDown') {
                  event.preventDefault();
                  if (results.length > 0) {
                    const nextIndex = Math.min(
                      activeIndexRef.current + 1,
                      results.length - 1,
                    );
                    activeIndexRef.current = nextIndex;
                    setActiveIndex(nextIndex);
                  }
                } else if (event.key === 'ArrowUp') {
                  event.preventDefault();
                  if (results.length > 0) {
                    const nextIndex = Math.max(activeIndexRef.current - 1, 0);
                    activeIndexRef.current = nextIndex;
                    setActiveIndex(nextIndex);
                  }
                } else if (event.key === 'Enter') {
                  event.preventDefault();
                  select(results[activeIndexRef.current]);
                }
              }}
              placeholder={messages.placeholder}
              ref={inputRef}
              role="combobox"
              value={query}
            />
            <TRDialog.Close
              render={
                <TRButton appearance="ghost" aria-label={messages.close} uiSize="sm">
                  <kbd>Esc</kbd>
                </TRButton>
              }
            />
          </div>
          <div
            aria-busy={loading}
            aria-label={messages.results}
            className="tr-docs-search-body"
            id={descriptionId}
            role="listbox"
          >
            {fallback ? (
              <p className="tr-docs-search-notice">{messages.fallback}</p>
            ) : null}
            {loading ? (
              <p className="tr-docs-search-message" role="status">
                <TRSpinner decorative uiSize="sm" /> {messages.loading}
              </p>
            ) : searchFailed ? (
              <p className="tr-docs-search-message" role="alert">
                {messages.error}
              </p>
            ) : query.trim().length === 0 ? (
              <p className="tr-docs-search-message">{messages.idle}</p>
            ) : results.length === 0 ? (
              <p className="tr-docs-search-message">{messages.empty}</p>
            ) : (
              results.map((result, index) => (
                <button
                  aria-selected={index === activeIndex}
                  className="tr-docs-search-result"
                  data-highlighted={index === activeIndex ? '' : undefined}
                  id={result.id}
                  key={result.id}
                  onClick={() => select(result)}
                  role="option"
                  type="button"
                >
                  <span className="tr-docs-search-result-heading">
                    <strong>
                      <HighlightedText
                        matches={result.titleMatches}
                        text={result.title}
                      />
                    </strong>
                    {result.section === undefined ? null : (
                      <span>
                        <HighlightedText
                          matches={result.sectionMatches}
                          text={result.section}
                        />
                      </span>
                    )}
                  </span>
                  <span className="tr-docs-search-result-excerpt">
                    <HighlightedText
                      matches={result.excerptMatches}
                      text={result.excerpt}
                    />
                  </span>
                </button>
              ))
            )}
          </div>
        </TRDialog.Popup>
      </TRDialog.Portal>
    </TRDialog.Root>
  );
}

export const TRDocsSearch = {
  Dialog: TRDocsSearchDialog,
  Trigger: TRDocsSearchTrigger,
} as const;
