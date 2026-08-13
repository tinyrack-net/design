'use client';

import { defaultRangeExtractor, useVirtualizer } from '@tanstack/react-virtual';
import {
  type ComponentPropsWithoutRef,
  type FocusEvent,
  type Key,
  type ReactNode,
  type Ref,
  type UIEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react';
import { mergeClassNames } from '../../internal/component-class-name.js';
import { useIsoLayoutEffect } from '../../internal/iso-layout-effect.js';
import { TRScrollArea } from '../scroll-area/index.js';
import {
  attachTRVirtualListController,
  type TRVirtualListAlignment,
  type TRVirtualListController,
  type TRVirtualListControllerBinding,
  type TRVirtualListEdge,
  type TRVirtualListEdgeRequest,
  type TRVirtualListFollow,
  type TRVirtualListInitialPosition,
  type TRVirtualListRange,
  type TRVirtualListSnapshot,
} from './virtual-list-controller.js';

type NativeDivProps = Omit<ComponentPropsWithoutRef<'div'>, 'children'> & {
  [attribute: `data-${string}`]: boolean | number | string | undefined;
};

export type TRVirtualListProps<T, K extends Key> = {
  axis?: 'horizontal' | 'vertical';
  children?: ReactNode;
  controller?: TRVirtualListController<K>;
  estimateSize: (item: T, index: number) => number;
  follow?: TRVirtualListFollow;
  initialPosition?: TRVirtualListInitialPosition<K>;
  initialSnapshot?: TRVirtualListSnapshot<K>;
  itemKey: (item: T, index: number) => K;
  itemProps?: (item: T, index: number) => NativeDivProps;
  itemRef?: (element: HTMLDivElement | null, item: T, index: number) => void;
  items: readonly T[];
  leadingEdgeRequest?: TRVirtualListEdgeRequest;
  onVisibleRangeChanged?: (range: TRVirtualListRange<K>) => void;
  overscan?: number;
  renderItem: (item: T, index: number) => ReactNode;
  rootProps?: NativeDivProps;
  rootRef?: Ref<HTMLDivElement>;
  ssrFallback?: ReactNode;
  trailingEdgeRequest?: TRVirtualListEdgeRequest;
  viewportProps?: NativeDivProps;
  viewportRef?: Ref<HTMLDivElement>;
};

type VisibleAnchor<K> = {
  atLeading: boolean;
  atTrailing: boolean;
  candidates: readonly { index: number; key: K; offset: number }[];
};

type EdgeLayoutAnchor<K> = {
  anchor: VisibleAnchor<K>;
  leadingPinned: boolean;
  trailingPinned: boolean;
};

const subscribeToHydration = () => () => {};
const clientSnapshot = () => true;
const serverSnapshot = () => false;

export function TRVirtualList<T, K extends Key>({
  axis = 'vertical',
  children,
  controller,
  estimateSize,
  follow = 'none',
  initialPosition = { edge: 'leading' },
  initialSnapshot,
  itemKey,
  itemProps,
  itemRef,
  items,
  leadingEdgeRequest,
  onVisibleRangeChanged,
  overscan = 1,
  renderItem,
  rootProps,
  rootRef,
  ssrFallback,
  trailingEdgeRequest,
  viewportProps,
  viewportRef,
}: TRVirtualListProps<T, K>) {
  assertValidTriggerExtent(leadingEdgeRequest?.triggerExtent);
  assertValidTriggerExtent(trailingEdgeRequest?.triggerExtent);
  const hydrated = useSyncExternalStore(
    subscribeToHydration,
    clientSnapshot,
    serverSnapshot,
  );
  const internalViewportRef = useRef<HTMLDivElement | null>(null);
  const [isRtl, setIsRtl] = useState(false);
  const [focusedKey, setFocusedKey] = useState<K | null>(null);
  const [edgeSizes, setEdgeSizes] = useState({ leading: 0, trailing: 0 });
  const edgeSizesRef = useRef(edgeSizes);
  const edgeElementsRef = useRef<{
    leading: HTMLDivElement | null;
    trailing: HTMLDivElement | null;
  }>({ leading: null, trailing: null });
  const edgeObserversRef = useRef<{
    leading?: ResizeObserver;
    trailing?: ResizeObserver;
  }>({});
  const pendingEdgeLayoutRef = useRef<EdgeLayoutAnchor<K> | null>(null);
  const holdVisibleAnchorRef = useRef(false);
  const leadingPinnedRef = useRef(true);
  const trailingPinnedRef = useRef(false);
  const initialPositionAppliedRef = useRef(false);
  const lastVisibleRangeRef = useRef<TRVirtualListRange<K> | null>(null);
  const requestedKeysRef = useRef<{
    leading?: string | number;
    trailing?: string | number;
  }>({});
  const visibleAnchorRef = useRef<VisibleAnchor<K>>({
    atLeading: true,
    atTrailing: false,
    candidates: [],
  });

  const keys = useMemo(() => {
    const nextKeys = items.map((item, index) => itemKey(item, index));
    assertUniqueKeys(nextKeys);
    return nextKeys;
  }, [itemKey, items]);
  const keyToIndex = useMemo(
    () => new Map(keys.map((key, index) => [key, index])),
    [keys],
  );
  const previousKeysRef = useRef(keys);
  const keysChanged = !equalKeys(previousKeysRef.current, keys);

  const estimateIndexSize = useCallback(
    (index: number) => {
      const item = items[index];
      return item === undefined ? 0 : estimateSize(item, index);
    },
    [estimateSize, items],
  );
  const getItemKey = useCallback((index: number) => keys[index] ?? index, [keys]);
  const rangeExtractor = useCallback(
    (range: Parameters<typeof defaultRangeExtractor>[0]) => {
      const indexes = defaultRangeExtractor(range);
      if (focusedKey === null) return indexes;
      const focusedIndex = keyToIndex.get(focusedKey);
      if (focusedIndex === undefined || indexes.includes(focusedIndex)) return indexes;
      return [...indexes, focusedIndex].sort((left, right) => left - right);
    },
    [focusedKey, keyToIndex],
  );
  const initialMeasurementsCache = useMemo(
    () => restoreMeasurements(items, keys, estimateSize, initialSnapshot),
    [estimateSize, initialSnapshot, items, keys],
  );
  const initialOffset = useMemo(
    () => restoreOffset(keys, initialMeasurementsCache, initialSnapshot),
    [initialMeasurementsCache, initialSnapshot, keys],
  );
  const scrollToElement = useCallback(
    (offset: number, options: { adjustments?: number; behavior?: ScrollBehavior }) => {
      const viewport = internalViewportRef.current;
      if (!viewport) return;
      const target = offset + (options.adjustments ?? 0);
      viewport.scrollTo({
        ...(axis === 'vertical' ? { top: target } : { left: isRtl ? -target : target }),
        ...(options.behavior === undefined ? {} : { behavior: options.behavior }),
      });
    },
    [axis, isRtl],
  );
  const holdVisibleAnchor = holdVisibleAnchorRef.current;

  const virtualizer = useVirtualizer<HTMLDivElement, HTMLDivElement>({
    anchorTo: 'start',
    count: items.length,
    enabled: hydrated,
    estimateSize: estimateIndexSize,
    followOnAppend: false,
    getItemKey,
    getScrollElement: () => internalViewportRef.current,
    horizontal: axis === 'horizontal',
    initialMeasurementsCache,
    initialOffset,
    isRtl: axis === 'horizontal' && isRtl,
    overscan,
    paddingEnd: edgeSizes.trailing,
    paddingStart: edgeSizes.leading,
    rangeExtractor,
    scrollToFn: scrollToElement,
    useAnimationFrameWithResizeObserver: true,
    useFlushSync: false,
  });
  const virtualItems = hydrated ? virtualizer.getVirtualItems() : [];
  const totalSize = virtualizer.getTotalSize();
  const edgeMeasurementContextRef = useRef({ axis, keys, virtualizer });
  edgeMeasurementContextRef.current = { axis, keys, virtualizer };

  const measureEdgeSlot = useCallback((edge: TRVirtualListEdge) => {
    const element = edgeElementsRef.current[edge];
    const {
      axis: currentAxis,
      keys: currentKeys,
      virtualizer: currentVirtualizer,
    } = edgeMeasurementContextRef.current;
    const rect = element?.getBoundingClientRect();
    const size = Math.max(
      0,
      rect === undefined ? 0 : currentAxis === 'vertical' ? rect.height : rect.width,
    );
    if (edgeSizesRef.current[edge] === size) return;
    pendingEdgeLayoutRef.current = {
      anchor: captureVisibleAnchor(currentVirtualizer, currentKeys, currentAxis),
      leadingPinned: leadingPinnedRef.current,
      trailingPinned: trailingPinnedRef.current,
    };
    const nextSizes = { ...edgeSizesRef.current, [edge]: size };
    edgeSizesRef.current = nextSizes;
    setEdgeSizes(nextSizes);
  }, []);

  const observeEdgeSlot = useCallback(
    (edge: TRVirtualListEdge, element: HTMLDivElement | null) => {
      edgeObserversRef.current[edge]?.disconnect();
      delete edgeObserversRef.current[edge];
      edgeElementsRef.current[edge] = element;
      measureEdgeSlot(edge);
      if (element === null || typeof ResizeObserver === 'undefined') return;
      const observer = new ResizeObserver(() => measureEdgeSlot(edge));
      observer.observe(element);
      edgeObserversRef.current[edge] = observer;
    },
    [measureEdgeSlot],
  );
  const setLeadingEdgeSlotRef = useCallback(
    (element: HTMLDivElement | null) => observeEdgeSlot('leading', element),
    [observeEdgeSlot],
  );
  const setTrailingEdgeSlotRef = useCallback(
    (element: HTMLDivElement | null) => observeEdgeSlot('trailing', element),
    [observeEdgeSlot],
  );

  useIsoLayoutEffect(() => {
    measureEdgeSlot('leading');
    measureEdgeSlot('trailing');
  }, [axis, measureEdgeSlot]);

  useEffect(
    () => () => {
      edgeObserversRef.current.leading?.disconnect();
      edgeObserversRef.current.trailing?.disconnect();
    },
    [],
  );

  const setViewportRef = useCallback(
    (element: HTMLDivElement | null) => {
      internalViewportRef.current = element;
      setRef(viewportRef, element);
      if (element) {
        const nextIsRtl = getComputedStyle(element).direction === 'rtl';
        setIsRtl((current) => (current === nextIsRtl ? current : nextIsRtl));
      }
    },
    [viewportRef],
  );

  const scrollToIndex = useCallback(
    (
      index: number,
      options?: {
        alignment?: TRVirtualListAlignment;
        behavior?: ScrollBehavior;
      },
    ) => {
      if (items.length === 0) return;
      leadingPinnedRef.current = index === 0 && options?.alignment === 'leading';
      trailingPinnedRef.current =
        index === items.length - 1 && options?.alignment === 'trailing';
      virtualizer.scrollToIndex(index, {
        align: toTanStackAlignment(options?.alignment),
        ...(options?.behavior === undefined ? {} : { behavior: options.behavior }),
      });
      const key = keys[index];
      const viewport = internalViewportRef.current;
      const measurement = virtualizer.takeSnapshot()[index];
      if (key !== undefined && viewport !== null && measurement !== undefined) {
        const offset =
          axis === 'vertical'
            ? viewport.scrollTop
            : isRtl
              ? -viewport.scrollLeft
              : viewport.scrollLeft;
        visibleAnchorRef.current = {
          atLeading: offset <= 1,
          atTrailing: trailingPinnedRef.current,
          candidates: [{ index, key, offset: offset - measurement.start }],
        };
      }
    },
    [axis, isRtl, items.length, keys, virtualizer],
  );
  const scrollToKey = useCallback(
    (
      key: K,
      options?: {
        alignment?: TRVirtualListAlignment;
        behavior?: ScrollBehavior;
      },
    ) => {
      const index = keyToIndex.get(key);
      if (index !== undefined) scrollToIndex(index, options);
    },
    [keyToIndex, scrollToIndex],
  );
  const scrollToEdge = useCallback(
    (edge: TRVirtualListEdge, options?: { behavior?: ScrollBehavior }) => {
      if (edge === 'leading') {
        leadingPinnedRef.current = true;
        trailingPinnedRef.current = items.length <= 1;
        scrollToIndex(0, {
          alignment: 'leading',
          ...(options?.behavior === undefined ? {} : { behavior: options.behavior }),
        });
      } else {
        leadingPinnedRef.current = items.length <= 1;
        trailingPinnedRef.current = true;
        virtualizer.scrollToEnd(
          options?.behavior === undefined ? {} : { behavior: options.behavior },
        );
      }
    },
    [items.length, scrollToIndex, virtualizer],
  );
  const takeSnapshot = useCallback((): TRVirtualListSnapshot<K> => {
    const anchor = captureVisibleAnchor(virtualizer, keys, axis);
    const leading = anchor.candidates[0];
    return {
      anchorKey: leading?.key ?? null,
      anchorOffset: leading?.offset ?? 0,
      itemSizes: virtualizer
        .takeSnapshot()
        .flatMap((measurement) =>
          keyToIndex.has(measurement.key as K)
            ? [{ key: measurement.key as K, size: measurement.size }]
            : [],
        ),
      version: 1,
    };
  }, [axis, keyToIndex, keys, virtualizer]);
  const controllerBinding = useMemo<TRVirtualListControllerBinding<K>>(
    () => ({
      holdVisibleAnchorForNextLayout() {
        holdVisibleAnchorRef.current = true;
      },
      scrollToEdge,
      scrollToIndex,
      scrollToKey,
      takeSnapshot,
    }),
    [scrollToEdge, scrollToIndex, scrollToKey, takeSnapshot],
  );

  useIsoLayoutEffect(
    () => attachTRVirtualListController(controller, controllerBinding),
    [controller, controllerBinding],
  );

  useIsoLayoutEffect(() => {
    if (!hydrated || initialPositionAppliedRef.current || items.length === 0) return;
    initialPositionAppliedRef.current = true;
    if (initialSnapshot?.version === 1 && initialSnapshot.anchorKey !== null) {
      const index = keyToIndex.get(initialSnapshot.anchorKey);
      const start =
        index === undefined ? undefined : virtualizer.getOffsetForIndex(index, 'start');
      if (start) {
        virtualizer.scrollToOffset(start[0] + initialSnapshot.anchorOffset);
        return;
      }
    }
    if ('edge' in initialPosition) {
      scrollToEdge(initialPosition.edge);
    } else if ('key' in initialPosition) {
      scrollToKey(initialPosition.key, {
        alignment: initialPosition.alignment ?? 'nearest',
      });
    } else {
      scrollToIndex(initialPosition.index, {
        alignment: initialPosition.alignment ?? 'nearest',
      });
    }
  }, [
    hydrated,
    initialPosition,
    initialSnapshot,
    items.length,
    keyToIndex,
    scrollToEdge,
    scrollToIndex,
    scrollToKey,
    virtualizer,
  ]);

  useIsoLayoutEffect(() => {
    if (keysChanged && hydrated) {
      const previousAnchor = visibleAnchorRef.current;
      const previousKeys = previousKeysRef.current;
      const onlyTrailingExtentChanged = equalKeyPrefix(previousKeys, keys);
      if (!holdVisibleAnchor && follow === 'leading' && leadingPinnedRef.current) {
        scrollToEdge('leading');
      } else if (
        !holdVisibleAnchor &&
        follow === 'trailing' &&
        trailingPinnedRef.current
      ) {
        scrollToEdge('trailing');
      } else if (!onlyTrailingExtentChanged) {
        const candidate = findSurvivingAnchor(previousAnchor, previousKeys, keyToIndex);
        if (candidate) {
          const index = keyToIndex.get(candidate.key);
          const start =
            index === undefined
              ? undefined
              : virtualizer.getOffsetForIndex(index, 'start');
          if (start) virtualizer.scrollToOffset(start[0] + candidate.offset);
        }
      }
    }
    previousKeysRef.current = keys;
    if (holdVisibleAnchor) holdVisibleAnchorRef.current = false;
  }, [
    follow,
    holdVisibleAnchor,
    hydrated,
    keyToIndex,
    keys,
    keysChanged,
    scrollToEdge,
    virtualizer,
  ]);

  useIsoLayoutEffect(() => {
    const pending = pendingEdgeLayoutRef.current;
    if (!hydrated || pending === null) return;
    pendingEdgeLayoutRef.current = null;
    if (pending.leadingPinned) {
      scrollToEdge('leading');
      return;
    }
    if (pending.trailingPinned) {
      scrollToEdge('trailing');
      return;
    }
    const candidate = pending.anchor.candidates.find(({ key }) => keyToIndex.has(key));
    if (!candidate) return;
    const index = keyToIndex.get(candidate.key);
    const start =
      index === undefined ? undefined : virtualizer.getOffsetForIndex(index, 'start');
    if (start) virtualizer.scrollToOffset(start[0] + candidate.offset);
  }, [edgeSizes, hydrated, keyToIndex, scrollToEdge, virtualizer]);

  const previousTotalSizeRef = useRef(totalSize);
  useIsoLayoutEffect(() => {
    const sizeChanged = previousTotalSizeRef.current !== totalSize;
    if (
      sizeChanged &&
      !keysChanged &&
      !holdVisibleAnchor &&
      follow === 'trailing' &&
      trailingPinnedRef.current
    ) {
      scrollToEdge('trailing');
    }
    previousTotalSizeRef.current = totalSize;
    if (sizeChanged && holdVisibleAnchor) holdVisibleAnchorRef.current = false;
  }, [follow, holdVisibleAnchor, keysChanged, scrollToEdge, totalSize]);

  useIsoLayoutEffect(() => {
    if (hydrated) {
      visibleAnchorRef.current = captureVisibleAnchor(virtualizer, keys, axis);
    }
  });

  const rangeStart = virtualizer.range?.startIndex;
  const rangeEnd = virtualizer.range?.endIndex;
  useEffect(() => {
    if (
      !hydrated ||
      onVisibleRangeChanged === undefined ||
      rangeStart === undefined ||
      rangeEnd === undefined
    ) {
      return;
    }
    const leadingKey = keys[rangeStart];
    const trailingKey = keys[rangeEnd];
    if (leadingKey === undefined || trailingKey === undefined) return;
    const nextRange: TRVirtualListRange<K> = {
      endIndex: rangeEnd,
      leadingKey,
      startIndex: rangeStart,
      trailingKey,
    };
    const previousRange = lastVisibleRangeRef.current;
    if (
      previousRange?.startIndex === nextRange.startIndex &&
      previousRange.endIndex === nextRange.endIndex &&
      previousRange.leadingKey === nextRange.leadingKey &&
      previousRange.trailingKey === nextRange.trailingKey
    ) {
      return;
    }
    lastVisibleRangeRef.current = nextRange;
    onVisibleRangeChanged(nextRange);
  }, [hydrated, keys, onVisibleRangeChanged, rangeEnd, rangeStart]);

  const scrollOffset = virtualizer.scrollOffset ?? 0;
  useEffect(() => {
    if (!hydrated || items.length === 0) return;
    const viewport = internalViewportRef.current;
    const defaultThreshold =
      viewport === null
        ? 0
        : axis === 'vertical'
          ? viewport.clientHeight
          : viewport.clientWidth;
    const leadingThreshold = resolveTriggerExtent(
      leadingEdgeRequest?.triggerExtent,
      defaultThreshold,
    );
    const trailingThreshold = resolveTriggerExtent(
      trailingEdgeRequest?.triggerExtent,
      defaultThreshold,
    );
    requestEdge(
      'leading',
      leadingEdgeRequest,
      scrollOffset <= leadingThreshold,
      requestedKeysRef.current,
    );
    requestEdge(
      'trailing',
      trailingEdgeRequest,
      virtualizer.isAtEnd(trailingThreshold),
      requestedKeysRef.current,
    );
  }, [
    axis,
    hydrated,
    items.length,
    leadingEdgeRequest,
    scrollOffset,
    trailingEdgeRequest,
    virtualizer,
  ]);

  const {
    className: rootClassName,
    onBlurCapture: rootOnBlurCapture,
    onFocusCapture: rootOnFocusCapture,
    ...nativeRootProps
  } = rootProps ?? {};
  const {
    className: viewportClassName,
    onScroll: viewportOnScroll,
    style: viewportStyle,
    ...nativeViewportProps
  } = viewportProps ?? {};
  const handleFocusCapture = (event: FocusEvent<HTMLDivElement>) => {
    const itemElement = (event.target as Element).closest<HTMLElement>(
      '.tr-virtual-list-item',
    );
    const indexText = itemElement?.dataset['index'];
    const index = indexText === undefined ? undefined : Number(indexText);
    const key = index === undefined ? undefined : keys[index];
    if (key !== undefined) setFocusedKey(key);
    rootOnFocusCapture?.(event);
  };
  const handleBlurCapture = (event: FocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget)) setFocusedKey(null);
    rootOnBlurCapture?.(event);
  };
  const handleViewportScroll = (event: UIEvent<HTMLDivElement>) => {
    const viewport = event.currentTarget;
    const offset =
      axis === 'vertical'
        ? viewport.scrollTop
        : isRtl
          ? -viewport.scrollLeft
          : viewport.scrollLeft;
    const maximum =
      axis === 'vertical'
        ? viewport.scrollHeight - viewport.clientHeight
        : viewport.scrollWidth - viewport.clientWidth;
    leadingPinnedRef.current = offset <= 1;
    trailingPinnedRef.current = maximum - offset <= 1;
    viewportOnScroll?.(event);
  };

  return (
    <TRScrollArea.Root
      {...nativeRootProps}
      className={mergeClassNames('tr-virtual-list', rootClassName)}
      data-axis={axis}
      onBlurCapture={handleBlurCapture}
      onFocusCapture={handleFocusCapture}
      ref={rootRef}
      variant="plain"
    >
      {hydrated ? (
        <>
          <TRScrollArea.Viewport
            {...nativeViewportProps}
            className={mergeClassNames('tr-virtual-list-viewport', viewportClassName)}
            onScroll={handleViewportScroll}
            ref={setViewportRef}
            style={viewportStyle}
          >
            <TRScrollArea.Content
              className="tr-virtual-list-content"
              style={
                axis === 'vertical'
                  ? { blockSize: totalSize }
                  : { inlineSize: totalSize }
              }
            >
              {leadingEdgeRequest?.slot === undefined ? null : (
                <div
                  className="tr-virtual-list-edge-slot"
                  data-edge="leading"
                  ref={setLeadingEdgeSlotRef}
                >
                  {leadingEdgeRequest.slot}
                </div>
              )}
              {virtualItems.map((virtualItem) => {
                const item = items[virtualItem.index];
                if (item === undefined) return null;
                const consumerProps = itemProps?.(item, virtualItem.index) ?? {};
                const {
                  className: consumerClassName,
                  style: consumerStyle,
                  ...nativeItemProps
                } = consumerProps;
                const translate =
                  axis === 'vertical'
                    ? `translateY(${virtualItem.start}px)`
                    : `translateX(${isRtl ? -virtualItem.start : virtualItem.start}px)`;
                return (
                  <div
                    {...nativeItemProps}
                    className={mergeClassNames(
                      'tr-virtual-list-item',
                      consumerClassName,
                    )}
                    data-index={virtualItem.index}
                    key={keys[virtualItem.index]}
                    ref={(element) => {
                      virtualizer.measureElement(element);
                      itemRef?.(element, item, virtualItem.index);
                    }}
                    style={{ ...consumerStyle, transform: translate }}
                  >
                    {renderItem(item, virtualItem.index)}
                  </div>
                );
              })}
              {trailingEdgeRequest?.slot === undefined ? null : (
                <div
                  className="tr-virtual-list-edge-slot"
                  data-edge="trailing"
                  ref={setTrailingEdgeSlotRef}
                >
                  {trailingEdgeRequest.slot}
                </div>
              )}
            </TRScrollArea.Content>
          </TRScrollArea.Viewport>
          <TRScrollArea.Scrollbar
            orientation={axis === 'vertical' ? 'vertical' : 'horizontal'}
          >
            <TRScrollArea.Thumb />
          </TRScrollArea.Scrollbar>
        </>
      ) : (
        ssrFallback
      )}
      {children}
    </TRScrollArea.Root>
  );
}

function equalKeys<K>(left: readonly K[], right: readonly K[]) {
  return (
    left.length === right.length && left.every((key, index) => key === right[index])
  );
}

function equalKeyPrefix<K>(left: readonly K[], right: readonly K[]) {
  const sharedLength = Math.min(left.length, right.length);
  for (let index = 0; index < sharedLength; index += 1) {
    if (left[index] !== right[index]) return false;
  }
  return true;
}

function assertUniqueKeys(keys: readonly Key[]) {
  const seen = new Set<Key>();
  for (const [index, key] of keys.entries()) {
    if (seen.has(key)) {
      throw new Error(
        `TRVirtualList received duplicate itemKey "${String(key)}" at index ${index}; itemKey values must be unique.`,
      );
    }
    seen.add(key);
  }
}

function toTanStackAlignment(alignment: TRVirtualListAlignment | undefined) {
  switch (alignment) {
    case 'center':
      return 'center';
    case 'leading':
      return 'start';
    case 'trailing':
      return 'end';
    case 'nearest':
    case undefined:
      return 'auto';
  }
}

function setRef<Value>(ref: Ref<Value> | undefined, value: Value | null) {
  if (typeof ref === 'function') ref(value);
  else if (ref) ref.current = value;
}

function captureVisibleAnchor<K extends Key>(
  virtualizer: ReturnType<typeof useVirtualizer<HTMLDivElement, HTMLDivElement>>,
  keys: readonly K[],
  axis: 'horizontal' | 'vertical',
): VisibleAnchor<K> {
  const viewport = virtualizer.scrollElement;
  const offset = virtualizer.scrollOffset ?? 0;
  const extent =
    viewport === null
      ? 0
      : axis === 'vertical'
        ? viewport.clientHeight
        : viewport.clientWidth;
  const visibleItems = virtualizer
    .getVirtualItems()
    .filter((item) => item.end > offset && item.start < offset + extent);
  const candidates = visibleItems.flatMap((item) => {
    const key = keys[item.index];
    return key === undefined
      ? []
      : [{ index: item.index, key, offset: offset - item.start }];
  });
  return {
    atLeading: offset <= 1,
    atTrailing: virtualizer.isAtEnd(1),
    candidates,
  };
}

function findSurvivingAnchor<K>(
  anchor: VisibleAnchor<K>,
  previousKeys: readonly K[],
  keyToIndex: ReadonlyMap<K, number>,
) {
  const visibleCandidate = anchor.candidates.find(({ key }) => keyToIndex.has(key));
  if (visibleCandidate) return visibleCandidate;
  const primary = anchor.candidates[0];
  if (!primary) return undefined;
  for (let index = primary.index + 1; index < previousKeys.length; index += 1) {
    const key = previousKeys[index];
    if (key !== undefined && keyToIndex.has(key)) {
      return { index, key, offset: primary.offset };
    }
  }
  for (let index = primary.index - 1; index >= 0; index -= 1) {
    const key = previousKeys[index];
    if (key !== undefined && keyToIndex.has(key)) {
      return { index, key, offset: primary.offset };
    }
  }
  return undefined;
}

function requestEdge(
  edge: TRVirtualListEdge,
  request: TRVirtualListEdgeRequest | undefined,
  reached: boolean,
  requestedKeys: { leading?: string | number; trailing?: string | number },
) {
  if (!request || !reached || requestedKeys[edge] === request.requestKey) return;
  requestedKeys[edge] = request.requestKey;
  request.onRequest();
}

function resolveTriggerExtent(
  extent: TRVirtualListEdgeRequest['triggerExtent'],
  viewportSize: number,
) {
  if (extent === undefined) return viewportSize;
  return Math.max(
    0,
    extent.kind === 'pixels' ? extent.value : extent.value * viewportSize,
  );
}

function assertValidTriggerExtent(extent: TRVirtualListEdgeRequest['triggerExtent']) {
  if (extent !== undefined && (!Number.isFinite(extent.value) || extent.value < 0)) {
    throw new RangeError(
      'TRVirtualList triggerExtent.value must be a finite, non-negative number.',
    );
  }
}

function restoreMeasurements<T, K extends Key>(
  items: readonly T[],
  keys: readonly K[],
  estimateSize: (item: T, index: number) => number,
  snapshot: TRVirtualListSnapshot<K> | undefined,
) {
  if (snapshot?.version !== 1 || items.length === 0) return [];
  const savedSizes = new Map(
    snapshot.itemSizes.map((measurement) => [measurement.key, measurement.size]),
  );
  let start = 0;
  return items.map((item, index) => {
    const key = keys[index] ?? index;
    const size = savedSizes.get(key as K) ?? estimateSize(item, index);
    const measurement = { end: start + size, index, key, lane: 0, size, start };
    start += size;
    return measurement;
  });
}

function restoreOffset<K extends Key>(
  keys: readonly K[],
  measurements: readonly { key: Key; start: number }[],
  snapshot: TRVirtualListSnapshot<K> | undefined,
) {
  if (snapshot?.version !== 1 || snapshot.anchorKey === null) return 0;
  const index = keys.indexOf(snapshot.anchorKey);
  return index < 0 ? 0 : (measurements[index]?.start ?? 0) + snapshot.anchorOffset;
}

export const trVirtualListInternals = {
  assertUniqueKeys,
  assertValidTriggerExtent,
  captureVisibleAnchor,
  equalKeyPrefix,
  equalKeys,
  findSurvivingAnchor,
  requestEdge,
  resolveTriggerExtent,
  restoreMeasurements,
  restoreOffset,
  setRef,
  toTanStackAlignment,
};
