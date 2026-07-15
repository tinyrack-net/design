import type { ReactElement, Ref } from 'react';
import { Link } from '../link/index.js';

export type DocumentPaginationDestination = {
  description?: string;
  label?: string;
  path: string;
  title: string;
};

export type DocumentPaginationDirection = 'next' | 'previous';
export type DocumentPaginationProps = {
  label?: string;
  next?: DocumentPaginationDestination;
  nextAriaLabel?: string;
  nextLabel?: string;
  previous?: DocumentPaginationDestination;
  previousAriaLabel?: string;
  previousLabel?: string;
  ref?: Ref<HTMLElement>;
  renderLink?: (
    destination: DocumentPaginationDestination,
    direction: DocumentPaginationDirection,
  ) => ReactElement;
};

function PaginationLink({
  destination,
  direction,
  directionAriaLabel,
  directionLabel,
  renderLink,
}: {
  destination: DocumentPaginationDestination;
  direction: DocumentPaginationDirection;
  directionAriaLabel: string;
  directionLabel: string;
  renderLink?: DocumentPaginationProps['renderLink'];
}) {
  return (
    <Link
      aria-label={`${directionAriaLabel}: ${destination.title}`}
      className="tr-document-pagination-link"
      data-direction={direction}
      href={destination.path}
      render={renderLink?.(destination, direction)}
      underline="none"
    >
      <span className="tr-document-pagination-heading">
        <span>
          {direction === 'previous' ? '←' : '→'} {directionLabel}
        </span>
        {destination.label === undefined ? null : <span>{destination.label}</span>}
      </span>
      <strong>{destination.title}</strong>
      {destination.description === undefined ? null : (
        <span className="tr-document-pagination-description">
          {destination.description}
        </span>
      )}
    </Link>
  );
}

export function DocumentPagination({
  label = 'Previous and next documents',
  next,
  nextAriaLabel = 'Next document',
  nextLabel = 'Next',
  previous,
  previousAriaLabel = 'Previous document',
  previousLabel = 'Previous',
  ref,
  renderLink,
}: DocumentPaginationProps) {
  if (previous === undefined && next === undefined) return null;
  return (
    <nav
      aria-label={label}
      className="tr-document-pagination"
      data-pagefind-ignore="all"
      ref={ref}
    >
      {previous === undefined ? null : (
        <PaginationLink
          destination={previous}
          direction="previous"
          directionAriaLabel={previousAriaLabel}
          directionLabel={previousLabel}
          renderLink={renderLink}
        />
      )}
      {next === undefined ? null : (
        <PaginationLink
          destination={next}
          direction="next"
          directionAriaLabel={nextAriaLabel}
          directionLabel={nextLabel}
          renderLink={renderLink}
        />
      )}
    </nav>
  );
}
