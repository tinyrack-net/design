import type { ReactElement, Ref } from 'react';
import { TRLink } from '../link/index.js';

export type TRDocumentPaginationDestination = {
  description?: string;
  label?: string;
  path: string;
  title: string;
};

export type TRDocumentPaginationDirection = 'next' | 'previous';
export type TRDocumentPaginationProps = {
  label?: string;
  next?: TRDocumentPaginationDestination;
  nextAriaLabel?: string;
  nextLabel?: string;
  previous?: TRDocumentPaginationDestination;
  previousAriaLabel?: string;
  previousLabel?: string;
  ref?: Ref<HTMLElement>;
  renderLink?: (
    destination: TRDocumentPaginationDestination,
    direction: TRDocumentPaginationDirection,
  ) => ReactElement;
};

function PaginationLink({
  destination,
  direction,
  directionAriaLabel,
  directionLabel,
  renderLink,
}: {
  destination: TRDocumentPaginationDestination;
  direction: TRDocumentPaginationDirection;
  directionAriaLabel: string;
  directionLabel: string;
  renderLink?: TRDocumentPaginationProps['renderLink'];
}) {
  return (
    <TRLink
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
    </TRLink>
  );
}

export function TRDocumentPagination({
  label = 'Previous and next documents',
  next,
  nextAriaLabel = 'Next document',
  nextLabel = 'Next',
  previous,
  previousAriaLabel = 'Previous document',
  previousLabel = 'Previous',
  ref,
  renderLink,
}: TRDocumentPaginationProps) {
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
