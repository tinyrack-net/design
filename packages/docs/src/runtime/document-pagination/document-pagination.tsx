import type { ComponentPropsWithRef, ReactElement } from 'react';
import { mergeClassNames } from '../utils/component-class-name.ts';
import { TRLink } from '@tinyrack/ui/components/link';

export type TRDocumentPaginationDestination = {
  description?: string;
  disabled?: boolean;
  label?: string;
  path: string;
  title: string;
};

export type TRDocumentPaginationDirection = 'next' | 'previous';
export type TRDocumentPaginationProps = Omit<
  ComponentPropsWithRef<'nav'>,
  'children'
> & {
  label?: string;
  next?: TRDocumentPaginationDestination;
  nextAriaLabel?: string;
  nextLabel?: string;
  onNavigate?: (
    destination: TRDocumentPaginationDestination,
    direction: TRDocumentPaginationDirection,
  ) => void;
  previous?: TRDocumentPaginationDestination;
  previousAriaLabel?: string;
  previousLabel?: string;
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
  onNavigate,
  renderLink,
}: {
  destination: TRDocumentPaginationDestination;
  direction: TRDocumentPaginationDirection;
  directionAriaLabel: string;
  directionLabel: string;
  onNavigate?: TRDocumentPaginationProps['onNavigate'];
  renderLink?: TRDocumentPaginationProps['renderLink'];
}) {
  return (
    <TRLink
      aria-label={`${directionAriaLabel}: ${destination.title}`}
      className="tr-document-pagination-link"
      data-direction={direction}
      disabled={destination.disabled ?? false}
      href={destination.path}
      onClick={() => onNavigate?.(destination, direction)}
      rel={direction === 'previous' ? 'prev' : 'next'}
      render={renderLink?.(destination, direction)}
      underline="none"
    >
      <span className="tr-document-pagination-heading">
        <span>
          <span aria-hidden="true" className="tr-document-pagination-arrow">
            {direction === 'previous' ? '←' : '→'}
          </span>{' '}
          {directionLabel}
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
  className,
  label = 'Previous and next documents',
  next,
  nextAriaLabel = 'Next document',
  nextLabel = 'Next',
  onNavigate,
  previous,
  previousAriaLabel = 'Previous document',
  previousLabel = 'Previous',
  ref,
  renderLink,
  ...props
}: TRDocumentPaginationProps) {
  if (previous === undefined && next === undefined) return null;
  return (
    <nav
      {...props}
      aria-label={label}
      className={mergeClassNames('tr-document-pagination', className)}
      data-pagefind-ignore="all"
      ref={ref}
    >
      {previous === undefined ? null : (
        <PaginationLink
          destination={previous}
          direction="previous"
          directionAriaLabel={previousAriaLabel}
          directionLabel={previousLabel}
          onNavigate={onNavigate}
          renderLink={renderLink}
        />
      )}
      {next === undefined ? null : (
        <PaginationLink
          destination={next}
          direction="next"
          directionAriaLabel={nextAriaLabel}
          directionLabel={nextLabel}
          onNavigate={onNavigate}
          renderLink={renderLink}
        />
      )}
    </nav>
  );
}
