'use client';

import {
  defaultRangeExtractor,
  type Rect,
  useVirtualizer,
  type Virtualizer,
} from '@tanstack/react-virtual';
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
  createTRVirtualListSnapshot,
  readTRVirtualListSnapshot,
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
  positionedCandidates: readonly { index: number; key: K; offset: number }[];
};

type EdgeLayoutAnchor<K> = {
  anchor: VisibleAnchor<K>;
  leadingPinned: boolean;
  trailingPinned: boolean;
};

type RequestedEdgeKeys = Record<TRVirtualListEdge, Set<string | number>>;

type AlignmentTarget<K> = {
  alignment: Exclude<TRVirtualListAlignment, 'nearest'>;
  key: K;
};

type VisualLayout<K> =
  | { alignmentTarget: AlignmentTarget<K>; kind: 'alignment' }
  | { kind: 'offset'; value: number }
  | null;

const subscribeToHydration = () => () => {};
const clientSnapshot = () => true;
const serverSnapshot = () => false;

function observeScrollportRect(
  instance: Virtualizer<HTMLDivElement, HTMLDivElement>,
  callback: (rect: Rect) => void,
) {
  const element = instance.scrollElement;
  const targetWindow = instance.targetWindow;
  if (element === null || targetWindow === null) return;

  let previous: Rect | undefined;
  const notify = () => {
    const next = { height: element.clientHeight, width: element.clientWidth };
    if (previous?.height === next.height && previous.width === next.width) return;
    previous = next;
    callback(next);
  };
  notify();

  const ResizeObserverConstructor = targetWindow.ResizeObserver;
  if (ResizeObserverConstructor === undefined) return;
  let animationFrame: number | undefined;
  const scheduleNotify = () => {
    if (animationFrame !== undefined) return;
    animationFrame = targetWindow.requestAnimationFrame(() => {
      animationFrame = undefined;
      notify();
    });
  };
  const observer = new ResizeObserverConstructor(() => {
    if (!instance.options.useAnimationFrameWithResizeObserver) {
      notify();
      return;
    }
    scheduleNotify();
  });
  observer.observe(element, { box: 'content-box' });
  if (instance.options.useAnimationFrameWithResizeObserver) scheduleNotify();
  return () => {
    observer.disconnect();
    if (animationFrame !== undefined) {
      targetWindow.cancelAnimationFrame(animationFrame);
    }
  };
}

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
  const [horizontalDirection, setHorizontalDirection] = useState<'ltr' | 'rtl' | null>(
    null,
  );
  const directionReady = axis === 'vertical' || horizontalDirection !== null;
  const isRtl = axis === 'horizontal' && horizontalDirection === 'rtl';
  const [visualLayout, setVisualLayout] = useState<VisualLayout<K>>(() =>
    initialVisualLayout(items, itemKey, initialPosition, initialSnapshot),
  );
  const [focusedKey, setFocusedKey] = useState<K | null>(null);
  const [edgeRequestsReady, setEdgeRequestsReady] = useState(false);
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
  const requestedKeysRef = useRef<RequestedEdgeKeys>({
    leading: new Set(),
    trailing: new Set(),
  });
  const visibleAnchorRef = useRef<VisibleAnchor<K>>({
    atLeading: true,
    atTrailing: false,
    candidates: [],
    positionedCandidates: [],
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
      if (item === undefined) return 0;
      const estimate = estimateSize(item, index);
      assertValidEstimate(estimate, index);
      return estimate;
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
    enabled: hydrated && directionReady,
    estimateSize: estimateIndexSize,
    followOnAppend: false,
    getItemKey,
    getScrollElement: () => internalViewportRef.current,
    horizontal: axis === 'horizontal',
    initialMeasurementsCache,
    initialOffset,
    isRtl: axis === 'horizontal' && isRtl,
    observeElementRect: observeScrollportRect,
    overscan,
    paddingEnd: edgeSizes.trailing,
    paddingStart: edgeSizes.leading,
    rangeExtractor,
    scrollToFn: scrollToElement,
    useAnimationFrameWithResizeObserver: true,
    useFlushSync: false,
  });
  virtualizer.shouldAdjustScrollPositionOnItemSizeChange = shouldAdjustForSizeChange;
  const virtualItems = hydrated && directionReady ? virtualizer.getVirtualItems() : [];
  const totalSize = virtualizer.getTotalSize();
  const visualOffset = resolveVisualOffset(
    visualLayout,
    virtualItems,
    edgeSizes,
    (axis === 'vertical'
      ? virtualizer.scrollRect?.height
      : virtualizer.scrollRect?.width) ?? 0,
    totalSize,
  );
  const edgeMeasurementContextRef = useRef({
    axis,
    isRtl,
    keys,
    visualOffset,
    virtualizer,
  });
  edgeMeasurementContextRef.current = {
    axis,
    isRtl,
    keys,
    visualOffset,
    virtualizer,
  };

  const measureEdgeSlot = useCallback((edge: TRVirtualListEdge) => {
    const element = edgeElementsRef.current[edge];
    const {
      axis: currentAxis,
      isRtl: currentIsRtl,
      keys: currentKeys,
      visualOffset: currentVisualOffset,
      virtualizer: currentVirtualizer,
    } = edgeMeasurementContextRef.current;
    const rect = element?.getBoundingClientRect();
    const size = Math.max(
      0,
      rect === undefined ? 0 : currentAxis === 'vertical' ? rect.height : rect.width,
    );
    if (edgeSizesRef.current[edge] === size) return;
    if (initialPositionAppliedRef.current) {
      pendingEdgeLayoutRef.current = {
        anchor: captureVisibleAnchor(
          currentVirtualizer,
          currentKeys,
          currentAxis,
          currentVisualOffset,
          logicalScrollOffset(
            currentVirtualizer.scrollElement,
            currentAxis,
            currentIsRtl,
          ),
        ),
        leadingPinned: leadingPinnedRef.current,
        trailingPinned: trailingPinnedRef.current,
      };
    }
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

  const syncHorizontalDirection = useCallback(() => {
    if (axis !== 'horizontal') return;
    const viewport = internalViewportRef.current;
    if (viewport === null) return;
    const nextDirection =
      getComputedStyle(viewport).direction === 'rtl' ? 'rtl' : 'ltr';
    setHorizontalDirection((current) =>
      current === nextDirection ? current : nextDirection,
    );
  }, [axis]);

  const setViewportRef = useCallback(
    (element: HTMLDivElement | null) => {
      internalViewportRef.current = element;
      setRef(viewportRef, element);
      if (element) syncHorizontalDirection();
    },
    [syncHorizontalDirection, viewportRef],
  );

  useIsoLayoutEffect(syncHorizontalDirection);

  const scrollToIndex = useCallback(
    (
      index: number,
      options?: {
        alignment?: TRVirtualListAlignment;
        behavior?: ScrollBehavior;
      },
    ) => {
      if (items.length === 0) return;
      const key = keys[index];
      setVisualLayout(
        key === undefined ||
          options?.alignment === undefined ||
          options.alignment === 'nearest'
          ? null
          : {
              alignmentTarget: { alignment: options.alignment, key },
              kind: 'alignment',
            },
      );
      leadingPinnedRef.current = index === 0 && options?.alignment === 'leading';
      trailingPinnedRef.current =
        index === items.length - 1 && options?.alignment === 'trailing';
      virtualizer.scrollToIndex(index, {
        align: toTanStackAlignment(options?.alignment),
        ...(options?.behavior === undefined ? {} : { behavior: options.behavior }),
      });
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
          candidates: [
            { index, key, offset: offset - measurement.start - visualOffset },
          ],
          positionedCandidates: [
            { index, key, offset: offset - measurement.start - visualOffset },
          ],
        };
      }
    },
    [axis, isRtl, items.length, keys, virtualizer, visualOffset],
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
      const key = edge === 'leading' ? keys[0] : keys.at(-1);
      setVisualLayout(
        key === undefined
          ? null
          : {
              alignmentTarget: { alignment: edge, key },
              kind: 'alignment',
            },
      );
      if (edge === 'leading') {
        leadingPinnedRef.current = true;
        trailingPinnedRef.current = items.length <= 1;
        virtualizer.scrollToOffset(0, {
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
    [items.length, keys, virtualizer],
  );
  const restoreCandidate = useCallback(
    (candidate: { key: K; offset: number } | undefined) => {
      if (candidate === undefined) return false;
      const index = keyToIndex.get(candidate.key);
      if (index === undefined) return false;
      const target = virtualizer.getOffsetForIndex(index, 'start');
      if (target === undefined) return false;
      const itemStart =
        virtualizer.getVirtualItems().find((item) => item.index === index)?.start ??
        target[0];
      const viewportExtent =
        (axis === 'vertical'
          ? virtualizer.scrollRect?.height
          : virtualizer.scrollRect?.width) ?? 0;
      const requestedOffset = itemStart + candidate.offset;
      const actualOffset = Math.min(
        Math.max(requestedOffset, 0),
        Math.max(virtualizer.getTotalSize() - viewportExtent, 0),
      );
      virtualizer.scrollToOffset(actualOffset);
      setVisualLayout({
        kind: 'offset',
        value: actualOffset - itemStart - candidate.offset,
      });
      return true;
    },
    [axis, keyToIndex, virtualizer],
  );
  const takeSnapshot = useCallback((): TRVirtualListSnapshot<K> => {
    const anchor = captureVisibleAnchor(
      virtualizer,
      keys,
      axis,
      visualOffset,
      logicalScrollOffset(internalViewportRef.current, axis, isRtl),
    );
    return createTRVirtualListSnapshot({
      candidates: anchor.candidates,
      itemSizes: virtualizer
        .takeSnapshot()
        .flatMap((measurement) =>
          keyToIndex.has(measurement.key as K)
            ? [{ key: measurement.key as K, size: measurement.size }]
            : [],
        ),
      positionedCandidates: anchor.positionedCandidates,
      alignmentTarget:
        visualLayout?.kind === 'alignment' ? visualLayout.alignmentTarget : null,
    });
  }, [axis, isRtl, keyToIndex, keys, virtualizer, visualLayout, visualOffset]);
  const controllerBinding = useMemo<TRVirtualListControllerBinding<K>>(
    () => ({
      holdVisibleAnchorForNextLayout() {
        visibleAnchorRef.current = captureVisibleAnchor(
          virtualizer,
          keys,
          axis,
          visualOffset,
          logicalScrollOffset(internalViewportRef.current, axis, isRtl),
        );
        holdVisibleAnchorRef.current = true;
      },
      scrollToEdge,
      scrollToIndex,
      scrollToKey,
      takeSnapshot,
    }),
    [
      axis,
      isRtl,
      keys,
      scrollToEdge,
      scrollToIndex,
      scrollToKey,
      takeSnapshot,
      visualOffset,
      virtualizer,
    ],
  );

  useIsoLayoutEffect(
    () => attachTRVirtualListController(controller, controllerBinding),
    [controller, controllerBinding],
  );

  useIsoLayoutEffect(() => {
    if (
      !hydrated ||
      !directionReady ||
      initialPositionAppliedRef.current ||
      items.length === 0
    ) {
      return;
    }
    initialPositionAppliedRef.current = true;
    const enableEdgeRequests = () => {
      requestAnimationFrame(() => setEdgeRequestsReady(true));
    };
    const snapshotAlignment =
      readTRVirtualListSnapshot(initialSnapshot)?.alignmentTarget;
    if (
      snapshotAlignment !== null &&
      snapshotAlignment !== undefined &&
      keyToIndex.has(snapshotAlignment.key)
    ) {
      scrollToKey(snapshotAlignment.key, {
        alignment: snapshotAlignment.alignment,
      });
      enableEdgeRequests();
      return;
    }
    const snapshotAnchor = resolveSnapshotAnchor(initialSnapshot, keyToIndex);
    if (restoreCandidate(snapshotAnchor)) {
      enableEdgeRequests();
      return;
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
    enableEdgeRequests();
  }, [
    hydrated,
    directionReady,
    initialPosition,
    initialSnapshot,
    items.length,
    keyToIndex,
    restoreCandidate,
    scrollToEdge,
    scrollToIndex,
    scrollToKey,
    visualOffset,
    virtualizer,
  ]);

  useIsoLayoutEffect(() => {
    if (keysChanged && hydrated) {
      const previousAnchor = visibleAnchorRef.current;
      const previousKeys = previousKeysRef.current;
      const onlyTrailingExtentChanged = isTrailingAppend(previousKeys, keys);
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
        restoreCandidate(candidate);
      }
    }
    previousKeysRef.current = keys;
    if (keysChanged && holdVisibleAnchor) holdVisibleAnchorRef.current = false;
  }, [
    follow,
    holdVisibleAnchor,
    hydrated,
    keyToIndex,
    keys,
    keysChanged,
    restoreCandidate,
    scrollToEdge,
    visualOffset,
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
    restoreCandidate(candidate);
  }, [edgeSizes, hydrated, keyToIndex, restoreCandidate, scrollToEdge]);

  const previousTotalSizeRef = useRef(totalSize);
  useIsoLayoutEffect(() => {
    const sizeChanged = previousTotalSizeRef.current !== totalSize;
    if (sizeChanged && holdVisibleAnchor) {
      const candidate = visibleAnchorRef.current.candidates.find(({ key }) =>
        keyToIndex.has(key),
      );
      restoreCandidate(candidate);
    }
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
  }, [
    follow,
    holdVisibleAnchor,
    keysChanged,
    keyToIndex,
    restoreCandidate,
    scrollToEdge,
    totalSize,
  ]);

  useIsoLayoutEffect(() => {
    if (hydrated) {
      visibleAnchorRef.current = captureVisibleAnchor(
        virtualizer,
        keys,
        axis,
        visualOffset,
        logicalScrollOffset(internalViewportRef.current, axis, isRtl),
      );
    }
  });

  const scrollOffset =
    logicalScrollOffset(internalViewportRef.current, axis, isRtl) ??
    virtualizer.scrollOffset ??
    0;
  const viewportExtent =
    (axis === 'vertical'
      ? virtualizer.scrollRect?.height
      : virtualizer.scrollRect?.width) ?? 0;
  const visibleRange = resolveVisibleRange(
    virtualItems,
    keys,
    scrollOffset,
    viewportExtent,
    visualOffset,
  );
  useEffect(() => {
    if (
      !hydrated ||
      onVisibleRangeChanged === undefined ||
      edgeSizes.leading !== edgeSizesRef.current.leading ||
      edgeSizes.trailing !== edgeSizesRef.current.trailing
    ) {
      return;
    }
    if (visibleRange === null) {
      lastVisibleRangeRef.current = null;
      return;
    }
    const nextRange = visibleRange;
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
  }, [edgeSizes, hydrated, onVisibleRangeChanged, visibleRange]);

  useEffect(() => {
    if (!hydrated || !edgeRequestsReady || items.length === 0) return;
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
    edgeRequestsReady,
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
    if (!trailingPinnedRef.current) {
      setVisualLayout((current) => (current?.kind === 'offset' ? current : null));
    } else if (follow === 'trailing') {
      const key = keys.at(-1);
      if (key !== undefined) {
        setVisualLayout({
          alignmentTarget: { alignment: 'trailing', key },
          kind: 'alignment',
        });
      }
    }
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
            style={{
              ...viewportStyle,
              // Base UI supplies `overflow: scroll`. Override that same
              // shorthand key so WebKit never lays out a transient scrollbar
              // on the inactive axis before TanStack reads the scrollport.
              overflow: axis === 'horizontal' ? 'auto hidden' : 'hidden auto',
            }}
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
                  style={{
                    transform:
                      axis === 'vertical'
                        ? `translateY(${visualOffset}px)`
                        : `translateX(${isRtl ? -visualOffset : visualOffset}px)`,
                  }}
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
                    ? `translateY(${virtualItem.start + visualOffset}px)`
                    : `translateX(${
                        isRtl
                          ? -(virtualItem.start + visualOffset)
                          : virtualItem.start + visualOffset
                      }px)`;
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

function isTrailingAppend<K>(previous: readonly K[], current: readonly K[]) {
  return previous.length < current.length && equalKeyPrefix(previous, current);
}

function initialVisualLayout<T, K extends Key>(
  items: readonly T[],
  itemKey: (item: T, index: number) => K,
  initialPosition: TRVirtualListInitialPosition<K>,
  initialSnapshot: TRVirtualListSnapshot<K> | undefined,
): VisualLayout<K> {
  const keys = items.map(itemKey);
  const snapshotTarget = readTRVirtualListSnapshot(initialSnapshot)?.alignmentTarget;
  if (snapshotTarget !== null && snapshotTarget !== undefined) {
    return keys.includes(snapshotTarget.key)
      ? { alignmentTarget: snapshotTarget, kind: 'alignment' }
      : null;
  }
  let alignment: TRVirtualListAlignment | undefined;
  let key: K | undefined;
  if ('edge' in initialPosition) {
    alignment = initialPosition.edge;
    key = initialPosition.edge === 'leading' ? keys[0] : keys.at(-1);
  } else {
    alignment = initialPosition.alignment;
    if ('key' in initialPosition) key = initialPosition.key;
    else if (keys.length > 0) {
      key = keys[Math.min(Math.max(initialPosition.index, 0), keys.length - 1)];
    }
  }
  return key === undefined || alignment === undefined || alignment === 'nearest'
    ? null
    : { alignmentTarget: { alignment, key }, kind: 'alignment' };
}

function resolveVisualOffset<K extends Key>(
  layout: VisualLayout<K>,
  measurements: readonly { key: Key; size: number; start: number }[],
  edgeSizes: { leading: number; trailing: number },
  viewportExtent: number,
  totalSize: number,
) {
  if (layout === null) return 0;
  if (layout.kind === 'offset') return layout.value;
  if (viewportExtent <= 0 || totalSize > viewportExtent) return 0;
  const measurement = measurements.find(
    ({ key }) => key === layout.alignmentTarget.key,
  );
  if (measurement === undefined) return 0;
  const desiredStart =
    layout.alignmentTarget.alignment === 'leading'
      ? edgeSizes.leading
      : layout.alignmentTarget.alignment === 'trailing'
        ? viewportExtent - edgeSizes.trailing - measurement.size
        : (viewportExtent - measurement.size) / 2;
  return desiredStart - measurement.start;
}

function resolveVisibleRange<K extends Key>(
  virtualItems: readonly { end: number; index: number; start: number }[],
  keys: readonly K[],
  scrollOffset: number,
  viewportExtent: number,
  visualOffset: number,
): TRVirtualListRange<K> | null {
  if (viewportExtent <= 0) return null;
  const visible = virtualItems.filter(
    (item) =>
      item.end + visualOffset > scrollOffset &&
      item.start + visualOffset < scrollOffset + viewportExtent,
  );
  const first = visible[0];
  const last = visible.at(-1);
  if (first === undefined || last === undefined) return null;
  const leadingKey = keys[first.index];
  const trailingKey = keys[last.index];
  return leadingKey === undefined || trailingKey === undefined
    ? null
    : {
        endIndex: last.index,
        leadingKey,
        startIndex: first.index,
        trailingKey,
      };
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
  visualOffset = 0,
  scrollOffset?: number,
): VisibleAnchor<K> {
  const viewport = virtualizer.scrollElement;
  const offset = scrollOffset ?? virtualizer.scrollOffset ?? 0;
  const extent =
    viewport === null
      ? 0
      : axis === 'vertical'
        ? viewport.clientHeight
        : viewport.clientWidth;
  const positionedCandidates = virtualizer.getVirtualItems().flatMap((item) => {
    const key = keys[item.index];
    return key === undefined
      ? []
      : [
          {
            end: item.end + visualOffset,
            index: item.index,
            key,
            offset: offset - item.start - visualOffset,
            start: item.start + visualOffset,
          },
        ];
  });
  const candidates = positionedCandidates.filter(
    (item) => item.end > offset && item.start < offset + extent,
  );
  return {
    atLeading: offset <= 1,
    atTrailing: virtualizer.isAtEnd(1),
    candidates,
    positionedCandidates,
  };
}

function logicalScrollOffset(
  viewport: HTMLDivElement | null,
  axis: 'horizontal' | 'vertical',
  isRtl: boolean,
) {
  if (viewport === null) return undefined;
  return axis === 'vertical'
    ? viewport.scrollTop
    : isRtl
      ? -viewport.scrollLeft
      : viewport.scrollLeft;
}

function resolveSnapshotAnchor<K extends Key>(
  snapshot: TRVirtualListSnapshot<K> | undefined,
  keyToIndex: ReadonlyMap<K, number>,
) {
  const data = readTRVirtualListSnapshot(snapshot);
  if (data === undefined) return undefined;
  const visible = data.candidates.find(({ key }) => keyToIndex.has(key));
  if (visible !== undefined) return visible;
  const primary = data.candidates[0];
  if (primary === undefined) return undefined;
  const successor = data.positionedCandidates.find(
    ({ index, key }) => index > primary.index && keyToIndex.has(key),
  );
  if (successor !== undefined) return successor;
  for (let index = data.positionedCandidates.length - 1; index >= 0; index -= 1) {
    const candidate = data.positionedCandidates[index];
    if (
      candidate !== undefined &&
      candidate.index < primary.index &&
      keyToIndex.has(candidate.key)
    ) {
      return candidate;
    }
  }
  return undefined;
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
      return (
        anchor.positionedCandidates.find((candidate) => candidate.key === key) ?? {
          index,
          key,
          offset: primary.offset,
        }
      );
    }
  }
  for (let index = primary.index - 1; index >= 0; index -= 1) {
    const key = previousKeys[index];
    if (key !== undefined && keyToIndex.has(key)) {
      return (
        anchor.positionedCandidates.find((candidate) => candidate.key === key) ?? {
          index,
          key,
          offset: primary.offset,
        }
      );
    }
  }
  return undefined;
}

function requestEdge(
  edge: TRVirtualListEdge,
  request: TRVirtualListEdgeRequest | undefined,
  reached: boolean,
  requestedKeys: RequestedEdgeKeys,
) {
  if (!request || !reached || requestedKeys[edge].has(request.requestKey)) return;
  requestedKeys[edge].add(request.requestKey);
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

function assertValidEstimate(estimate: number, index: number) {
  if (!Number.isFinite(estimate) || estimate <= 0) {
    throw new RangeError(
      `TRVirtualList estimateSize must return a finite value greater than zero at index ${index}.`,
    );
  }
}

function shouldAdjustForSizeChange(
  item: { end: number; key: Key; start: number },
  _delta: number,
  instance: {
    itemSizeCache: ReadonlyMap<Key, number>;
    scrollAdjustments: number;
    scrollOffset: number | null;
  },
) {
  const fold = (instance.scrollOffset ?? 0) + instance.scrollAdjustments;
  return instance.itemSizeCache.has(item.key) ? item.end <= fold : item.start < fold;
}

function restoreMeasurements<T, K extends Key>(
  items: readonly T[],
  keys: readonly K[],
  estimateSize: (item: T, index: number) => number,
  snapshot: TRVirtualListSnapshot<K> | undefined,
) {
  const data = readTRVirtualListSnapshot(snapshot);
  if (data === undefined || items.length === 0) return [];
  const savedSizes = new Map(
    data.itemSizes.map((measurement) => [measurement.key, measurement.size]),
  );
  let start = 0;
  return items.map((item, index) => {
    const key = keys[index] ?? index;
    const size = savedSizes.get(key as K) ?? estimateSize(item, index);
    assertValidEstimate(size, index);
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
  const anchor = resolveSnapshotAnchor(
    snapshot,
    new Map(keys.map((key, index) => [key, index])),
  );
  if (anchor === undefined) return 0;
  const index = keys.indexOf(anchor.key);
  return (measurements[index]?.start ?? 0) + anchor.offset;
}

export const trVirtualListInternals = {
  assertUniqueKeys,
  assertValidEstimate,
  assertValidTriggerExtent,
  captureVisibleAnchor,
  createTRVirtualListSnapshot,
  equalKeyPrefix,
  equalKeys,
  findSurvivingAnchor,
  initialVisualLayout,
  observeScrollportRect,
  requestEdge,
  readTRVirtualListSnapshot,
  resolveSnapshotAnchor,
  resolveTriggerExtent,
  resolveVisibleRange,
  resolveVisualOffset,
  restoreMeasurements,
  restoreOffset,
  setRef,
  shouldAdjustForSizeChange,
  toTanStackAlignment,
};
