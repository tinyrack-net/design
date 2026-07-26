export type TRPaginationRangeItem = 'end-ellipsis' | 'start-ellipsis' | number;

export type TRPaginationRangeOptions = {
  boundaryCount?: number;
  currentPage: number;
  siblingCount?: number;
  totalPages: number;
};

function range(start: number, end: number) {
  return Array.from(
    { length: Math.max(end - start + 1, 0) },
    (_, index) => start + index,
  );
}

/**
 * Builds the visible page sequence for a numbered pagination control.
 *
 * `boundaryCount` pages stay pinned at each end and `siblingCount` pages sit on
 * each side of the current page. A gap wider than one page collapses into an
 * ellipsis; a gap of exactly one page renders that page instead, so the
 * sequence never hides a single number behind an ellipsis.
 */
export function getPaginationRange({
  boundaryCount = 1,
  currentPage,
  siblingCount = 1,
  totalPages,
}: TRPaginationRangeOptions): TRPaginationRangeItem[] {
  if (!Number.isFinite(totalPages) || totalPages < 1) return [];

  const pages = Math.floor(totalPages);
  const boundary = Math.max(Math.floor(boundaryCount), 0);
  const siblings = Math.max(Math.floor(siblingCount), 0);
  const current = Math.min(Math.max(Math.floor(currentPage), 1), pages);

  const startPages = range(1, Math.min(boundary, pages));
  const endPages = range(Math.max(pages - boundary + 1, boundary + 1), pages);

  const siblingsStart = Math.max(
    Math.min(current - siblings, pages - boundary - siblings * 2 - 1),
    boundary + 2,
  );
  const siblingsEnd = Math.min(
    Math.max(current + siblings, boundary + siblings * 2 + 2),
    endPages.length > 0 ? (endPages[0] as number) - 2 : pages - 1,
  );

  return [
    ...startPages,
    ...(siblingsStart > boundary + 2
      ? (['start-ellipsis'] as TRPaginationRangeItem[])
      : boundary + 1 < pages - boundary
        ? [boundary + 1]
        : []),
    ...range(siblingsStart, siblingsEnd),
    ...(siblingsEnd < pages - boundary - 1
      ? (['end-ellipsis'] as TRPaginationRangeItem[])
      : pages - boundary > boundary
        ? [pages - boundary]
        : []),
    ...endPages,
  ];
}
