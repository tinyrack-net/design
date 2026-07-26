import { describe, expect, it } from 'vitest';
import { getPaginationRange } from './pagination-range.js';

describe('getPaginationRange', () => {
  it('returns nothing for a page count below one', () => {
    expect(getPaginationRange({ currentPage: 1, totalPages: 0 })).toEqual([]);
    expect(getPaginationRange({ currentPage: 1, totalPages: -3 })).toEqual([]);
  });

  it('lists every page while the sequence still fits', () => {
    expect(getPaginationRange({ currentPage: 1, totalPages: 1 })).toEqual([1]);
    expect(getPaginationRange({ currentPage: 3, totalPages: 7 })).toEqual([
      1, 2, 3, 4, 5, 6, 7,
    ]);
  });

  it('collapses the trailing gap while the current page sits near the start', () => {
    expect(getPaginationRange({ currentPage: 1, totalPages: 20 })).toEqual([
      1,
      2,
      3,
      4,
      5,
      'end-ellipsis',
      20,
    ]);
  });

  it('collapses the leading gap while the current page sits near the end', () => {
    expect(getPaginationRange({ currentPage: 20, totalPages: 20 })).toEqual([
      1,
      'start-ellipsis',
      16,
      17,
      18,
      19,
      20,
    ]);
  });

  it('collapses both gaps while the current page sits in the middle', () => {
    expect(getPaginationRange({ currentPage: 10, totalPages: 20 })).toEqual([
      1,
      'start-ellipsis',
      9,
      10,
      11,
      'end-ellipsis',
      20,
    ]);
  });

  it('renders a lone hidden page instead of an ellipsis that saves nothing', () => {
    // Page 2 is the only page between the boundary and the sibling window, so
    // it costs the same width as the ellipsis would. The wider gap on the right
    // still collapses.
    expect(getPaginationRange({ currentPage: 4, totalPages: 8 })).toEqual([
      1,
      2,
      3,
      4,
      5,
      'end-ellipsis',
      8,
    ]);
  });

  it('widens the window with siblingCount', () => {
    expect(
      getPaginationRange({ currentPage: 10, siblingCount: 2, totalPages: 20 }),
    ).toEqual([1, 'start-ellipsis', 8, 9, 10, 11, 12, 'end-ellipsis', 20]);
  });

  it('pins more pages at each end with boundaryCount', () => {
    expect(
      getPaginationRange({ boundaryCount: 2, currentPage: 10, totalPages: 20 }),
    ).toEqual([1, 2, 'start-ellipsis', 9, 10, 11, 'end-ellipsis', 19, 20]);
  });

  it('supports dropping the boundary pages entirely', () => {
    expect(
      getPaginationRange({ boundaryCount: 0, currentPage: 10, totalPages: 20 }),
    ).toEqual(['start-ellipsis', 9, 10, 11, 'end-ellipsis']);
  });

  it('clamps a current page outside the available range', () => {
    expect(getPaginationRange({ currentPage: 0, totalPages: 5 })).toEqual(
      getPaginationRange({ currentPage: 1, totalPages: 5 }),
    );
    expect(getPaginationRange({ currentPage: 99, totalPages: 5 })).toEqual(
      getPaginationRange({ currentPage: 5, totalPages: 5 }),
    );
  });

  it('never repeats a page number', () => {
    for (let total = 1; total <= 25; total += 1) {
      for (let current = 1; current <= total; current += 1) {
        const items = getPaginationRange({ currentPage: current, totalPages: total });
        const numbers = items.filter(
          (item): item is number => typeof item === 'number',
        );
        expect(new Set(numbers).size).toBe(numbers.length);
        expect(numbers).toEqual([...numbers].sort((a, b) => a - b));
        expect(numbers).toContain(current);
      }
    }
  });
});
