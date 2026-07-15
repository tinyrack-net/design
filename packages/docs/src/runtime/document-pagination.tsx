import { docsManifest } from 'virtual:tinyrack-docs/manifest';
import { Link as UiLink } from '@tinyrack/ui/components/link';
import { ArrowLeftIcon, ArrowRightIcon } from 'lucide-react';
import { Link as RouterLink } from 'react-router';
import {
  type DocumentPaginationDestination,
  getDocumentPagination,
} from './document-pagination-state.ts';

type DocumentPaginationDirection = 'next' | 'previous';

function DocumentPaginationLink({
  destination,
  direction,
}: {
  destination: DocumentPaginationDestination;
  direction: DocumentPaginationDirection;
}) {
  const directionLabel = direction === 'previous' ? 'Previous' : 'Next';
  const DirectionIcon = direction === 'previous' ? ArrowLeftIcon : ArrowRightIcon;

  return (
    <UiLink
      aria-label={`${directionLabel} document: ${destination.title}`}
      className="tr-docs-pagination-link"
      data-document-pagination-link={direction}
      render={<RouterLink to={destination.path} />}
      underline="none"
    >
      <span className="tr-docs-pagination-heading">
        <span className="tr-docs-pagination-direction">
          {direction === 'previous' ? <DirectionIcon aria-hidden="true" /> : null}
          {directionLabel}
          {direction === 'next' ? <DirectionIcon aria-hidden="true" /> : null}
        </span>
        <span>{destination.sectionLabel}</span>
      </span>
      <strong className="tr-docs-pagination-title">{destination.title}</strong>
      <span className="tr-docs-pagination-summary">{destination.description}</span>
    </UiLink>
  );
}

export function DocumentPagination({ pathname }: { pathname: string }) {
  const { next, previous } = getDocumentPagination(pathname, docsManifest);
  if (next === undefined && previous === undefined) return null;

  return (
    <nav
      aria-label="Previous and next documents"
      className="tr-docs-pagination"
      data-document-pagination=""
      data-pagefind-ignore="all"
    >
      {previous === undefined ? null : (
        <DocumentPaginationLink destination={previous} direction="previous" />
      )}
      {next === undefined ? null : (
        <DocumentPaginationLink destination={next} direction="next" />
      )}
    </nav>
  );
}
