import { describe, expect, it } from 'vitest';
import {
  partitionVisualParityWork,
  resolveVisualParityComparisonWorkers,
  resolveVisualParityConcurrency,
} from '../scripts/visual-parity-concurrency.ts';
import { VisualParityPool } from '../scripts/visual-parity-pool.ts';
import { VisualParityImagePool } from './visual-parity-image-pool.ts';

describe('visual parity concurrency', () => {
  it('reserves one quarter of the processors for image comparison', () => {
    expect(resolveVisualParityConcurrency(32, 'full')).toBe(24);
    expect(resolveVisualParityComparisonWorkers(32, 'full')).toBe(8);
  });

  it('bounds virtual-clock motion work to eight concurrent contexts', () => {
    expect(resolveVisualParityConcurrency(32, 'motion')).toBe(8);
    expect(resolveVisualParityConcurrency(4, 'motion')).toBe(4);
    expect(resolveVisualParityComparisonWorkers(32, 'motion')).toBe(8);
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

describe('visual parity session pool', () => {
  it('reuses released sessions before creating more', async () => {
    let next = 0;
    const destroyed: number[] = [];
    const pool = new VisualParityPool<number, string>({
      create: async () => ++next,
      destroy: async (value) => {
        destroyed.push(value);
      },
      maximumSize: 2,
    });
    const first = await pool.acquire('shared');
    const second = await pool.acquire('shared');
    const waiting = pool.acquire('shared');
    await pool.release(first);

    await expect(waiting).resolves.toBe(first);
    expect(second).toBe(2);
    expect(next).toBe(2);
    await pool.release(second);
    await pool.release(first);
    await pool.close();
    expect(destroyed.sort()).toEqual([1, 2]);
  });

  it('replaces a discarded session for the next waiter', async () => {
    let next = 0;
    const pool = new VisualParityPool<number, string>({
      create: async () => ++next,
      destroy: async () => {},
      maximumSize: 1,
    });
    const first = await pool.acquire('shared');
    const waiting = pool.acquire('shared');
    await pool.release(first, { discard: true });

    await expect(waiting).resolves.toBe(2);
    expect(pool.size).toBe(1);
    await pool.close();
  });
});

describe('visual parity image pool', () => {
  it('runs the structural comparator in a worker', async () => {
    const pool = new VisualParityImagePool(1);
    try {
      const pixel = Uint8Array.from([12, 24, 48, 255]);
      const result = await pool.compare(pixel, pixel, 1, 1);
      expect(result.structuralPixels).toBe(0);
      expect(result.diff).toBeInstanceOf(Buffer);
    } finally {
      await pool.close();
    }
  });
});
