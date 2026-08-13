import { describe, expect, it, vi } from 'vitest';
import { trVirtualListInternals } from './virtual-list.js';

describe('TRVirtualList internals', () => {
  it('compares complete key sequences and prefixes', () => {
    expect(trVirtualListInternals.equalKeys(['a', 'b'], ['a', 'b'])).toBe(true);
    expect(trVirtualListInternals.equalKeys(['a'], ['a', 'b'])).toBe(false);
    expect(trVirtualListInternals.equalKeys(['a', 'b'], ['a', 'c'])).toBe(false);
    expect(trVirtualListInternals.equalKeyPrefix(['a'], ['a', 'b'])).toBe(true);
    expect(trVirtualListInternals.equalKeyPrefix(['a', 'x'], ['a', 'b'])).toBe(false);
  });

  it('maps every public alignment without exposing virtualizer values', () => {
    expect(trVirtualListInternals.toTanStackAlignment('center')).toBe('center');
    expect(trVirtualListInternals.toTanStackAlignment('leading')).toBe('start');
    expect(trVirtualListInternals.toTanStackAlignment('trailing')).toBe('end');
    expect(trVirtualListInternals.toTanStackAlignment('nearest')).toBe('auto');
    expect(trVirtualListInternals.toTanStackAlignment(undefined)).toBe('auto');
  });

  it('assigns object and callback refs and ignores an absent ref', () => {
    const callback = vi.fn();
    const object = { current: null as HTMLDivElement | null };
    const element = {} as HTMLDivElement;
    trVirtualListInternals.setRef(callback, element);
    trVirtualListInternals.setRef(object, element);
    trVirtualListInternals.setRef(undefined, element);
    expect(callback).toHaveBeenCalledWith(element);
    expect(object.current).toBe(element);
  });

  it('selects a visible survivor then successor then predecessor with old offsets', () => {
    const anchor = {
      atLeading: false,
      atTrailing: false,
      candidates: [
        { index: 2, key: 'c', offset: -5 },
        { index: 3, key: 'd', offset: -45 },
      ],
      positionedCandidates: [
        { index: 1, key: 'b', offset: 35 },
        { index: 2, key: 'c', offset: -5 },
        { index: 3, key: 'd', offset: -45 },
        { index: 4, key: 'e', offset: -85 },
      ],
    };
    expect(
      trVirtualListInternals.findSurvivingAnchor(
        anchor,
        ['a', 'b', 'c', 'd', 'e'],
        new Map([['d', 1]]),
      ),
    ).toEqual({ index: 3, key: 'd', offset: -45 });
    expect(
      trVirtualListInternals.findSurvivingAnchor(
        anchor,
        ['a', 'b', 'c', 'd', 'e'],
        new Map([['e', 1]]),
      ),
    ).toEqual(expect.objectContaining({ index: 4, key: 'e', offset: -85 }));
    expect(
      trVirtualListInternals.findSurvivingAnchor(
        anchor,
        ['a', 'b', 'c', 'd', 'e'],
        new Map([['b', 1]]),
      ),
    ).toEqual(expect.objectContaining({ index: 1, key: 'b', offset: 35 }));
    expect(
      trVirtualListInternals.findSurvivingAnchor(
        { ...anchor, candidates: [] },
        ['a'],
        new Map(),
      ),
    ).toBeUndefined();
    expect(
      trVirtualListInternals.findSurvivingAnchor(
        { ...anchor, positionedCandidates: [] },
        ['a', 'b', 'c', 'd', 'e'],
        new Map([['e', 1]]),
      ),
    ).toEqual({ index: 4, key: 'e', offset: -5 });
    expect(
      trVirtualListInternals.findSurvivingAnchor(
        { ...anchor, positionedCandidates: [] },
        ['a', 'b', 'c'],
        new Map([['b', 1]]),
      ),
    ).toEqual({ index: 1, key: 'b', offset: -5 });
    expect(
      trVirtualListInternals.findSurvivingAnchor(anchor, ['a', 'c'], new Map()),
    ).toBeUndefined();
  });

  it('captures horizontal candidates and treats a missing viewport as leading', () => {
    expect(
      trVirtualListInternals.captureVisibleAnchor(
        {
          getVirtualItems: () => [{ end: 40, index: 0, start: 0 }],
          isAtEnd: () => false,
          scrollElement: null,
          scrollOffset: null,
        } as never,
        [],
        'horizontal',
      ),
    ).toEqual({
      atLeading: true,
      atTrailing: false,
      candidates: [],
      positionedCandidates: [],
    });
    expect(
      trVirtualListInternals.captureVisibleAnchor(
        {
          getVirtualItems: () => [{ end: 60, index: 0, start: 20 }],
          isAtEnd: () => true,
          scrollElement: { clientHeight: 80, clientWidth: 100 },
          scrollOffset: 30,
        } as never,
        ['a'],
        'horizontal',
      ),
    ).toEqual({
      atLeading: false,
      atTrailing: true,
      candidates: [expect.objectContaining({ key: 'a', offset: 10 })],
      positionedCandidates: [expect.objectContaining({ key: 'a', offset: 10 })],
    });
  });

  it('deduplicates edge requests independently by request key', () => {
    const requested = {
      leading: new Set<string | number>(),
      trailing: new Set<string | number>(),
    };
    const onRequest = vi.fn();
    const request = { onRequest, requestKey: 'page-1' };
    trVirtualListInternals.requestEdge('leading', undefined, true, requested);
    trVirtualListInternals.requestEdge('leading', request, false, requested);
    trVirtualListInternals.requestEdge('leading', request, true, requested);
    trVirtualListInternals.requestEdge('leading', request, true, requested);
    trVirtualListInternals.requestEdge(
      'trailing',
      { ...request, requestKey: 'page-2' },
      true,
      requested,
    );
    trVirtualListInternals.requestEdge(
      'leading',
      { ...request, requestKey: 'page-2' },
      true,
      requested,
    );
    trVirtualListInternals.requestEdge('leading', request, true, requested);
    expect(onRequest).toHaveBeenCalledTimes(3);
  });

  it('resolves pixel and viewport triggers and validates invalid values', () => {
    expect(trVirtualListInternals.resolveTriggerExtent(undefined, 240)).toBe(240);
    expect(
      trVirtualListInternals.resolveTriggerExtent({ kind: 'pixels', value: 12 }, 240),
    ).toBe(12);
    expect(
      trVirtualListInternals.resolveTriggerExtent(
        { kind: 'viewports', value: 1.5 },
        240,
      ),
    ).toBe(360);
    expect(() =>
      trVirtualListInternals.assertValidTriggerExtent({ kind: 'pixels', value: -1 }),
    ).toThrow(RangeError);
    expect(() =>
      trVirtualListInternals.assertValidTriggerExtent({
        kind: 'viewports',
        value: Number.POSITIVE_INFINITY,
      }),
    ).toThrow(RangeError);
    expect(() =>
      trVirtualListInternals.assertValidTriggerExtent(undefined),
    ).not.toThrow();
  });

  it('rejects non-positive and non-finite item estimates', () => {
    expect(() => trVirtualListInternals.assertValidEstimate(0, 3)).toThrow(RangeError);
    expect(() => trVirtualListInternals.assertValidEstimate(-1, 3)).toThrow(RangeError);
    expect(() =>
      trVirtualListInternals.assertValidEstimate(Number.POSITIVE_INFINITY, 3),
    ).toThrow(RangeError);
    expect(() => trVirtualListInternals.assertValidEstimate(Number.NaN, 3)).toThrow(
      RangeError,
    );
    expect(() => trVirtualListInternals.assertValidEstimate(1, 3)).not.toThrow();
  });

  it('compensates every measured item fully above the fold in either direction', () => {
    const measured = new Map([['a', 40]]);
    const instance = {
      itemSizeCache: measured,
      scrollAdjustments: 0,
      scrollOffset: 120,
    };
    expect(
      trVirtualListInternals.shouldAdjustForSizeChange(
        { end: 80, key: 'a', start: 40 },
        20,
        instance,
      ),
    ).toBe(true);
    expect(
      trVirtualListInternals.shouldAdjustForSizeChange(
        { end: 140, key: 'a', start: 100 },
        20,
        instance,
      ),
    ).toBe(false);
    expect(
      trVirtualListInternals.shouldAdjustForSizeChange(
        { end: 140, key: 'new', start: 100 },
        20,
        instance,
      ),
    ).toBe(true);
  });

  it('restores only compatible snapshot measurements and offsets', () => {
    const items = [
      { id: 'a', size: 10 },
      { id: 'b', size: 20 },
      { id: 'c', size: 30 },
    ];
    const keys = items.map((item) => item.id);
    const estimate = (item: (typeof items)[number]) => item.size;
    const snapshot = trVirtualListInternals.createTRVirtualListSnapshot({
      candidates: [{ index: 1, key: 'b', offset: 7 }],
      itemSizes: [
        { key: 'a', size: 14 },
        { key: 'c', size: 34 },
      ],
      positionedCandidates: [{ index: 1, key: 'b', offset: 7 }],
      alignmentTarget: null,
    });
    const measurements = trVirtualListInternals.restoreMeasurements(
      items,
      keys,
      estimate,
      snapshot,
    );
    expect(measurements).toEqual([
      { end: 14, index: 0, key: 'a', lane: 0, size: 14, start: 0 },
      { end: 34, index: 1, key: 'b', lane: 0, size: 20, start: 14 },
      { end: 68, index: 2, key: 'c', lane: 0, size: 34, start: 34 },
    ]);
    expect(trVirtualListInternals.restoreOffset(keys, measurements, snapshot)).toBe(21);
    expect(
      trVirtualListInternals.restoreOffset(
        keys,
        measurements,
        trVirtualListInternals.createTRVirtualListSnapshot({
          candidates: [{ index: 1, key: 'missing', offset: 7 }],
          itemSizes: [],
          positionedCandidates: [{ index: 1, key: 'missing', offset: 7 }],
          alignmentTarget: null,
        }),
      ),
    ).toBe(0);
    expect(
      trVirtualListInternals.restoreMeasurements(items, keys, estimate, {
        version: 2,
      } as never),
    ).toEqual([]);
    expect(
      trVirtualListInternals.restoreMeasurements([], [], estimate, snapshot),
    ).toEqual([]);
    expect(
      trVirtualListInternals.restoreMeasurements(items, [], estimate, snapshot)[0]?.key,
    ).toBe(0);
    expect(
      trVirtualListInternals.restoreOffset(
        ['a'],
        [],
        trVirtualListInternals.createTRVirtualListSnapshot({
          candidates: [{ index: 0, key: 'a', offset: 7 }],
          itemSizes: [],
          positionedCandidates: [{ index: 0, key: 'a', offset: 7 }],
          alignmentTarget: null,
        }),
      ),
    ).toBe(7);
  });
});
