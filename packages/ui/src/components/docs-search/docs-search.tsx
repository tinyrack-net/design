'use client';

import { Search } from 'lucide-react';
import type { ComponentPropsWithoutRef, ReactNode, Ref, RefObject } from 'react';
import { useEffect, useId, useRef, useState } from 'react';
import { mergeComponentClassName } from '../../internal/component-class-name.js';
import { Button } from '../button/index.js';
import { Dialog } from '../dialog/index.js';
import { Spinner } from '../spinner/index.js';

export type DocsSearchMatch = { end: number; start: number };
export type DocsSearchResult = {
  excerpt: string;
  excerptMatches?: readonly DocsSearchMatch[];
  id: string;
  section?: string;
  sectionMatches?: readonly DocsSearchMatch[];
  title: string;
  titleMatches?: readonly DocsSearchMatch[];
  url: string;
};

export type DocsSearchMessages = {
  close: string;
  empty: string;
  fallback: string;
  idle: string;
  loading: string;
  placeholder: string;
  results: string;
  title: string;
  trigger: string;
};

const defaultMessages: DocsSearchMessages = {
  close: 'Close search',
  empty: 'No documentation found.',
  fallback: 'Search is using the bundled fallback index.',
  idle: 'Type to search documentation.',
  loading: 'Searching documentation',
  placeholder: 'Search documentation',
  results: 'Search results',
  title: 'Search documentation',
  trigger: 'Search docs',
};

export type DocsSearchTriggerProps = Omit<
  ComponentPropsWithoutRef<typeof Button>,
  'children'
> & { compact?: boolean; label?: string; shortcutLabel?: string };

export function DocsSearchTrigger({
  className,
  compact = false,
  label = defaultMessages.trigger,
  shortcutLabel = 'Ctrl / ⌘ K',
  ...props
}: DocsSearchTriggerProps) {
  return (
    <Button
      {...props}
      appearance={compact ? 'ghost' : 'outline'}
      aria-keyshortcuts="Control+K Meta+K"
      className={mergeComponentClassName('tr-docs-search-trigger', className)}
      data-compact={compact || undefined}
    >
      <Search aria-hidden="true" className="tr-docs-search-icon" />
      <span>{label}</span>
      <kbd>{shortcutLabel}</kbd>
    </Button>
  );
}

function HighlightedText({
  matches,
  text,
}: {
  matches: readonly DocsSearchMatch[] | undefined;
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

export type DocsSearchDialogProps = {
  enableShortcut?: boolean;
  fallback?: boolean;
  messages?: Partial<DocsSearchMessages>;
  onOpenChange: (open: boolean) => void;
  onSearch: (
    query: string,
    signal: AbortSignal,
  ) => Promise<readonly DocsSearchResult[]>;
  onSelect: (result: DocsSearchResult) => void;
  open: boolean;
  popupRef?: Ref<HTMLDivElement>;
  returnFocusRef?: RefObject<HTMLElement | null>;
};

export function DocsSearchDialog({
  enableShortcut = true,
  fallback = false,
  messages: messageOverrides,
  onOpenChange,
  onSearch,
  onSelect,
  open,
  popupRef,
  returnFocusRef,
}: DocsSearchDialogProps) {
  const messages = { ...defaultMessages, ...messageOverrides };
  const descriptionId = useId();
  const [activeIndex, setActiveIndex] = useState(-1);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<readonly DocsSearchResult[]>([]);
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
      setResults([]);
      return;
    }
    const controller = new AbortController();
    requestRef.current = controller;
    setLoading(true);
    void onSearch(query, controller.signal)
      .then((nextResults) => {
        if (!controller.signal.aborted) {
          activeIndexRef.current = -1;
          setActiveIndex(-1);
          setResults(nextResults);
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

  function select(result: DocsSearchResult | undefined) {
    if (result === undefined) return;
    onOpenChange(false);
    onSelect(result);
  }

  return (
    <Dialog.Root onOpenChange={onOpenChange} open={open}>
      <Dialog.Portal>
        <Dialog.Backdrop />
        <Dialog.Popup
          className="tr-docs-search-dialog"
          finalFocus={returnFocusRef}
          ref={popupRef}
        >
          <Dialog.Title className="tr-docs-search-visually-hidden">
            {messages.title}
          </Dialog.Title>
          <Dialog.Description className="tr-docs-search-visually-hidden">
            {messages.idle}
          </Dialog.Description>
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
            <Dialog.Close
              render={
                <Button appearance="ghost" aria-label={messages.close} uiSize="sm">
                  <kbd>Esc</kbd>
                </Button>
              }
            />
          </div>
          <div
            aria-label={messages.results}
            className="tr-docs-search-body"
            id={descriptionId}
            role="listbox"
          >
            {fallback ? (
              <p className="tr-docs-search-notice">{messages.fallback}</p>
            ) : null}
            {loading ? (
              <p className="tr-docs-search-message">
                <Spinner decorative uiSize="sm" /> {messages.loading}
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
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
