import { describe, expect, it } from 'vitest';
import {
  partitionVisualParityWork,
  resolveVisualParityConcurrency,
} from '../scripts/visual-parity-concurrency.ts';

describe('visual parity concurrency', () => {
  it('uses every available logical processor', () => {
    expect(resolveVisualParityConcurrency(32, 'full')).toBe(32);
  });

  it('bounds virtual-clock motion work to eight concurrent contexts', () => {
    expect(resolveVisualParityConcurrency(32, 'motion')).toBe(8);
    expect(resolveVisualParityConcurrency(4, 'motion')).toBe(4);
  });

  it('keeps at least one worker for invalid platform reports', () => {
    expect(resolveVisualParityConcurrency(0)).toBe(1);
    expect(resolveVisualParityConcurrency(Number.NaN)).toBe(1);
  });

  it('partitions large component matrices without losing their order', () => {
    expect(partitionVisualParityWork([1, 2, 3, 4, 5], 2)).toEqual([
      [1, 2],
      [3, 4],
      [5],
    ]);
  });
});
