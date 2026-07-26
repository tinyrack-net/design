import type { ComponentPropsWithRef, ReactElement } from 'react';
import { mergeClassNames } from '../../internal/component-class-name.js';
import { TRLink } from '../link/index.js';
import { getPaginationRange } from './pagination-range.js';

export type TRPaginationDirection = 'next' | 'previous';

export type TRPaginationLinkState = {
  current: boolean;
  direction?: TRPaginationDirection;
};

export type TRPaginationProps = Omit<ComponentPropsWithRef<'nav'>, 'children'> & {
  boundaryCount?: number;
  currentPage: number;
  hrefFor: (page: number) => string;
  label?: string;
  nextLabel?: string;
  pageLabel?: (page: number) => string;
  previousLabel?: string;
  renderLink?: (page: number, state: TRPaginationLinkState) => ReactElement;
  siblingCount?: number;
  totalPages: number;
};

export function TRPagination({
  boundaryCount = 1,
  className,
  currentPage,
  hrefFor,
  label = 'Pagination',
  nextLabel = 'Next',
  pageLabel = (page) => `Page ${page}`,
  previousLabel = 'Previous',
  ref,
  renderLink,
  siblingCount = 1,
  totalPages,
  ...props
}: TRPaginationProps) {
  const items = getPaginationRange({
    boundaryCount,
    currentPage,
    siblingCount,
    totalPages,
  });
  if (items.length < 2) return null;

  const current = Math.min(
    Math.max(Math.floor(currentPage), 1),
    Math.floor(totalPages),
  );
  const previousPage = current - 1;
  const nextPage = current + 1;

  function step(direction: TRPaginationDirection, page: number, text: string) {
    const disabled = page < 1 || page > Math.floor(totalPages);
    return (
      <li className="tr-pagination-item">
        <TRLink
          aria-label={disabled ? undefined : `${text}: ${pageLabel(page)}`}
          className="tr-pagination-step"
          data-direction={direction}
          disabled={disabled}
          href={disabled ? undefined : hrefFor(page)}
          rel={direction === 'previous' ? 'prev' : 'next'}
          render={
            disabled ? undefined : renderLink?.(page, { current: false, direction })
          }
          underline="none"
        >
          <span aria-hidden="true" className="tr-pagination-arrow">
            {direction === 'previous' ? '←' : '→'}
          </span>
          <span className="tr-pagination-step-label">{text}</span>
        </TRLink>
      </li>
    );
  }

  return (
    <nav
      {...props}
      aria-label={label}
      className={mergeClassNames('tr-pagination', className)}
      data-pagefind-ignore="all"
      ref={ref}
    >
      <ol className="tr-pagination-list">
        {step('previous', previousPage, previousLabel)}
        {items.map((item) => {
          if (item === 'start-ellipsis' || item === 'end-ellipsis') {
            return (
              <li className="tr-pagination-item" key={item}>
                <span aria-hidden="true" className="tr-pagination-ellipsis">
                  …
                </span>
              </li>
            );
          }

          const isCurrent = item === current;
          return (
            <li className="tr-pagination-item" key={item}>
              {isCurrent ? (
                <span
                  aria-current="page"
                  className="tr-pagination-page"
                  data-current=""
                >
                  {item}
                </span>
              ) : (
                <TRLink
                  aria-label={pageLabel(item)}
                  className="tr-pagination-page"
                  href={hrefFor(item)}
                  render={renderLink?.(item, { current: false })}
                  underline="none"
                >
                  {item}
                </TRLink>
              )}
            </li>
          );
        })}
        {step('next', nextPage, nextLabel)}
      </ol>
    </nav>
  );
}
