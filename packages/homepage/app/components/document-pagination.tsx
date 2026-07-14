import { documentSeoManifest } from 'virtual:tinyrack-document-seo';
import { Link as UiLink } from '@tinyrack/ui/components/link';
import { ArrowLeftIcon, ArrowRightIcon } from 'lucide-react';
import { Link as RouterLink } from 'react-router';
import {
  type DocumentPaginationDestination,
  getDocumentPagination,
} from '../content/shared/document-pagination.js';
import type { StaticDocumentSection } from '../content/shared/static-document-routes.js';

const sectionLabels: Record<StaticDocumentSection, string> = {
  components: 'Components',
  foundations: 'Foundations',
  integrations: 'Integrations',
  start: 'Start',
};

type DocumentPaginationDirection = 'next' | 'previous';

function DocumentPaginationLink({
  className,
  destination,
  direction,
}: {
  className?: string;
  destination: DocumentPaginationDestination;
  direction: DocumentPaginationDirection;
}) {
  const directionLabel = direction === 'previous' ? 'Previous' : 'Next';
  const DirectionIcon = direction === 'previous' ? ArrowLeftIcon : ArrowRightIcon;

  return (
    <UiLink
      aria-label={`${directionLabel} document: ${destination.title}`}
      className={[
        'tr-document-pagination-link group grid min-w-0 gap-tinyrack-sm border border-tinyrack-border bg-tinyrack-surface p-tinyrack-lg text-left transition-colors hover:border-tinyrack-primary hover:bg-tinyrack-surface-hover',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      data-document-pagination-link={direction}
      render={<RouterLink to={destination.path} />}
      underline="none"
    >
      <span className="flex items-center justify-between gap-tinyrack-sm text-tinyrack-xs font-semibold uppercase tracking-tinyrack-wide text-tinyrack-text-muted">
        <span className="flex items-center gap-tinyrack-xs">
          {direction === 'previous' ? (
            <DirectionIcon aria-hidden="true" className="size-tinyrack-lg" />
          ) : null}
          {directionLabel}
          {direction === 'next' ? (
            <DirectionIcon aria-hidden="true" className="size-tinyrack-lg" />
          ) : null}
        </span>
        <span>{sectionLabels[destination.section]}</span>
      </span>
      <strong className="text-tinyrack-lg leading-tinyrack-sm text-tinyrack-text transition-colors group-hover:text-tinyrack-primary">
        {destination.title}
      </strong>
      <span className="tr-document-pagination-summary text-tinyrack-sm leading-tinyrack-md text-tinyrack-text-muted">
        {destination.description}
      </span>
    </UiLink>
  );
}

export function DocumentPagination({ pathname }: { pathname: string }) {
  const { next, previous } = getDocumentPagination(pathname, documentSeoManifest);

  if (next === undefined && previous === undefined) return null;

  return (
    <nav
      aria-label="Previous and next documents"
      className="mt-tinyrack-2xl grid gap-tinyrack-md border-t border-tinyrack-border pt-tinyrack-xl sm:grid-cols-2 sm:gap-tinyrack-lg"
      data-document-pagination=""
      data-pagefind-ignore="all"
    >
      {previous === undefined ? null : (
        <DocumentPaginationLink destination={previous} direction="previous" />
      )}
      {next === undefined ? null : (
        <DocumentPaginationLink
          className={previous === undefined ? 'sm:col-start-2' : ''}
          destination={next}
          direction="next"
        />
      )}
    </nav>
  );
}
