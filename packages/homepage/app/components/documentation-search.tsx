'use client';

import { Button } from '@tinyrack/ui/components/button';
import { Combobox } from '@tinyrack/ui/components/combobox';
import { Dialog } from '@tinyrack/ui/components/dialog';
import { ScrollArea } from '@tinyrack/ui/components/scroll-area';
import { Spinner } from '@tinyrack/ui/components/spinner';
import { SearchIcon } from 'lucide-react';
import { type ReactNode, type RefObject, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import {
  type DocumentationSearchMatch,
  type DocumentationSearchResult,
  type DocumentationSearchSource,
  prepareDocumentationSearch,
  searchDocumentation,
} from './documentation-search-index.js';

type DocumentationSearchDialogProps = {
  onOpenChange: (open: boolean) => void;
  open: boolean;
  returnFocusRef: RefObject<HTMLElement | null>;
};

type SearchStatus = 'idle' | 'loading' | 'ready';

function HighlightedSearchText({
  matches,
  text,
}: {
  matches: DocumentationSearchMatch[];
  text: string;
}) {
  const content: ReactNode[] = [];
  let cursor = 0;

  for (const match of matches) {
    if (match.start > cursor) content.push(text.slice(cursor, match.start));
    content.push(
      <mark className="tr-site-search-match" key={`${match.start}-${match.end}`}>
        {text.slice(match.start, match.end)}
      </mark>,
    );
    cursor = match.end;
  }
  if (cursor < text.length) content.push(text.slice(cursor));

  return content;
}

export function DocumentationSearchTrigger({
  onClick,
}: {
  onClick: (trigger: HTMLButtonElement) => void;
}) {
  return (
    <Button
      appearance="outline"
      aria-label="Search documentation"
      aria-keyshortcuts="Control+K Meta+K"
      className="tr-site-search-trigger"
      onClick={(event) => onClick(event.currentTarget)}
    >
      <SearchIcon aria-hidden="true" />
      <span aria-hidden="true">Search docs</span>
      <kbd>Ctrl / ⌘ K</kbd>
    </Button>
  );
}

export function DocumentationSearchDialog({
  onOpenChange,
  open,
  returnFocusRef,
}: DocumentationSearchDialogProps) {
  const navigate = useNavigate();
  const requestSequence = useRef(0);
  const resultRefs = useRef(new Map<string, HTMLElement>());
  const searchBodyRef = useRef<HTMLDivElement>(null);
  const [highlightedResultId, setHighlightedResultId] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<DocumentationSearchResult[]>([]);
  const [source, setSource] = useState<DocumentationSearchSource>('fallback');
  const [status, setStatus] = useState<SearchStatus>('idle');

  useEffect(() => {
    function openFromShortcut(event: KeyboardEvent) {
      if (!(event.ctrlKey || event.metaKey) || event.key.toLocaleLowerCase() !== 'k') {
        return;
      }
      event.preventDefault();
      if (document.activeElement instanceof HTMLElement) {
        returnFocusRef.current = document.activeElement;
      }
      onOpenChange(true);
    }

    window.addEventListener('keydown', openFromShortcut);
    return () => window.removeEventListener('keydown', openFromShortcut);
  }, [onOpenChange, returnFocusRef]);

  useEffect(() => {
    if (!open) {
      requestSequence.current += 1;
      setHighlightedResultId(null);
      setQuery('');
      setResults([]);
      setSource('fallback');
      setStatus('idle');
      return;
    }

    let active = true;
    void prepareDocumentationSearch().then((preparedSource) => {
      if (active) setSource(preparedSource);
    });
    return () => {
      active = false;
    };
  }, [open]);

  function updateQuery(nextQuery: string) {
    if (searchBodyRef.current !== null) searchBodyRef.current.scrollTop = 0;
    setQuery(nextQuery);
    setHighlightedResultId(null);
    const sequence = requestSequence.current + 1;
    requestSequence.current = sequence;

    if (nextQuery.trim().length === 0) {
      setResults([]);
      setStatus('idle');
      return;
    }

    setStatus('loading');
    void searchDocumentation(nextQuery).then((response) => {
      if (response === null || requestSequence.current !== sequence) return;
      setResults(response.results);
      setSource(response.source);
      setStatus('ready');
    });
  }

  function selectResult(resultId: string | null) {
    const result = results.find((entry) => entry.id === resultId);
    if (result === undefined) return;
    onOpenChange(false);
    void navigate(result.url);
  }

  function scrollResultIntoView(resultId: string) {
    requestAnimationFrame(() => {
      const body = searchBodyRef.current;
      const result = resultRefs.current.get(resultId);
      if (body === null || result === undefined) return;

      const bodyRect = body.getBoundingClientRect();
      const resultRect = result.getBoundingClientRect();
      if (resultRect.top < bodyRect.top) {
        body.scrollTop -= bodyRect.top - resultRect.top;
      } else if (resultRect.bottom > bodyRect.bottom) {
        body.scrollTop += resultRect.bottom - bodyRect.bottom;
      }
    });
  }

  return (
    <Dialog.Root onOpenChange={(nextOpen) => onOpenChange(nextOpen)} open={open}>
      <Dialog.Portal>
        <Dialog.Backdrop />
        <Dialog.Popup
          className="tr-site-search-dialog"
          finalFocus={returnFocusRef}
          onKeyDownCapture={(event) => {
            if (event.key !== 'Escape') return;
            event.preventDefault();
            event.stopPropagation();
            onOpenChange(false);
          }}
          size="lg"
        >
          <Dialog.Title className="sr-only">Search documentation</Dialog.Title>
          <Dialog.Description className="sr-only">
            Search components, APIs, foundations, and integration guidance.
          </Dialog.Description>
          <Combobox.Root
            autoComplete="none"
            autoHighlight
            filter={null}
            filteredItems={results.map((result) => result.id)}
            inputValue={query}
            inline
            items={results.map((result) => result.id)}
            onItemHighlighted={(value) => {
              const resultId = typeof value === 'string' ? value : null;
              setHighlightedResultId(resultId);
              if (resultId !== null) scrollResultIntoView(resultId);
            }}
            onInputValueChange={updateQuery}
            onOpenChange={(nextOpen) => onOpenChange(nextOpen)}
            onValueChange={(value) =>
              selectResult(typeof value === 'string' ? value : null)
            }
            open={open}
          >
            <div className="tr-site-search-heading">
              <Combobox.InputGroup>
                <Combobox.InputAdornment aria-hidden="true">
                  <SearchIcon aria-hidden="true" />
                </Combobox.InputAdornment>
                <Combobox.Input
                  aria-label="Search documentation"
                  autoFocus
                  onKeyDown={(event) => {
                    if (event.key !== 'Enter' || event.nativeEvent.isComposing) return;
                    const resultId = highlightedResultId ?? results[0]?.id;
                    if (resultId === undefined) return;
                    event.preventDefault();
                    selectResult(resultId);
                  }}
                  placeholder="Search docs and APIs"
                />
              </Combobox.InputGroup>
              <Dialog.Close
                render={
                  <Button
                    appearance="ghost"
                    aria-keyshortcuts="Escape"
                    aria-label="Close search"
                    className="tr-site-search-close"
                    size="sm"
                  >
                    <kbd>Esc</kbd>
                  </Button>
                }
              />
            </div>
            <Combobox.Status className="sr-only">
              {status === 'loading'
                ? 'Searching documentation'
                : status === 'ready'
                  ? `${results.length} documentation results`
                  : 'Type to search documentation'}
            </Combobox.Status>
            <ScrollArea.Root className="tr-site-search-scroll-area" variant="plain">
              <ScrollArea.Viewport
                aria-label="Search results"
                className="tr-site-search-body"
                ref={searchBodyRef}
                role="region"
              >
                <ScrollArea.Content
                  className="tr-site-search-content"
                  style={{ minWidth: '100%' }}
                >
                  {status === 'idle' ? (
                    <p className="tr-site-search-message">
                      Search by component name, API, behavior, or design-system concept.
                    </p>
                  ) : null}
                  {status === 'loading' ? (
                    <div className="tr-site-search-loading">
                      <Spinner decorative size="sm" />
                      Searching documentation…
                    </div>
                  ) : null}
                  {status === 'ready' && source === 'fallback' ? (
                    <p className="tr-site-search-notice">
                      Full-text index unavailable. Showing matching page titles.
                    </p>
                  ) : null}
                  {status === 'ready' ? (
                    <Combobox.List className="tr-site-search-results">
                      {results.map((result, index) => (
                        <Combobox.Item
                          className="tr-site-search-result"
                          index={index}
                          key={result.id}
                          ref={(element) => {
                            if (element === null) resultRefs.current.delete(result.id);
                            else resultRefs.current.set(result.id, element);
                          }}
                          value={result.id}
                        >
                          <span className="tr-site-search-result-heading">
                            <strong>
                              <HighlightedSearchText
                                matches={result.titleMatches}
                                text={result.title}
                              />
                            </strong>
                            {result.section ? (
                              <span>
                                <HighlightedSearchText
                                  matches={result.sectionMatches ?? []}
                                  text={result.section}
                                />
                              </span>
                            ) : null}
                          </span>
                          <span className="tr-site-search-result-excerpt">
                            <HighlightedSearchText
                              matches={result.excerptMatches}
                              text={result.excerpt}
                            />
                          </span>
                        </Combobox.Item>
                      ))}
                      <Combobox.Empty>No documentation found.</Combobox.Empty>
                    </Combobox.List>
                  ) : null}
                </ScrollArea.Content>
              </ScrollArea.Viewport>
              <ScrollArea.Scrollbar orientation="vertical">
                <ScrollArea.Thumb />
              </ScrollArea.Scrollbar>
            </ScrollArea.Root>
            <div aria-hidden="true" className="tr-site-search-footer">
              <span>
                <kbd>↑↓</kbd> Navigate
              </span>
              <span>
                <kbd>Enter</kbd> Open
              </span>
              <span>
                <kbd>Esc</kbd> Close
              </span>
            </div>
          </Combobox.Root>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
