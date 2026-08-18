import 'dart:math' as math;

import 'package:flutter/foundation.dart';
import 'package:flutter/rendering.dart';
import 'package:flutter/scheduler.dart';
import 'package:material_ui/material_ui.dart';

import '../scroll_area/scroll_area.dart';

/// A logical end of a [TRVirtualList].
enum TRVirtualListEdge { leading, trailing }

/// How an item is placed inside the viewport by controller navigation.
enum TRVirtualListAlignment { leading, center, trailing, nearest }

/// The edge that remains pinned while content changes there.
enum TRVirtualListFollow { none, leading, trailing }

enum _TRVirtualListInitialPositionKind { leading, trailing, atIndex, byKey }

/// The position used when a virtual list has no restorable snapshot.
@immutable
class TRVirtualListInitialPosition<K> {
  const TRVirtualListInitialPosition.leading()
    : _kind = _TRVirtualListInitialPositionKind.leading,
      index = null,
      key = null,
      alignment = TRVirtualListAlignment.leading;

  const TRVirtualListInitialPosition.trailing()
    : _kind = _TRVirtualListInitialPositionKind.trailing,
      index = null,
      key = null,
      alignment = TRVirtualListAlignment.trailing;

  const TRVirtualListInitialPosition.index(
    int itemIndex, {
    this.alignment = TRVirtualListAlignment.leading,
  }) : assert(itemIndex >= 0),
       _kind = _TRVirtualListInitialPositionKind.atIndex,
       index = itemIndex,
       key = null;

  const TRVirtualListInitialPosition.key(
    this.key, {
    this.alignment = TRVirtualListAlignment.leading,
  }) : _kind = _TRVirtualListInitialPositionKind.byKey,
       index = null;

  final _TRVirtualListInitialPositionKind _kind;
  final int? index;
  final K? key;
  final TRVirtualListAlignment alignment;
}

/// A typed distance at which an edge request becomes eligible.
@immutable
sealed class TRVirtualListTriggerExtent {
  const TRVirtualListTriggerExtent();

  /// Triggers within [viewports] viewport lengths of the edge.
  const factory TRVirtualListTriggerExtent.viewports([double viewports]) =
      TRVirtualListViewportTriggerExtent;

  /// Triggers within a fixed logical-pixel [extent] of the edge.
  const factory TRVirtualListTriggerExtent.fixed(double extent) =
      TRVirtualListFixedTriggerExtent;

  double resolve(double viewportExtent);
}

/// A viewport-relative edge request distance.
@immutable
final class TRVirtualListViewportTriggerExtent
    extends TRVirtualListTriggerExtent {
  const TRVirtualListViewportTriggerExtent([this.viewports = 1])
    : assert(viewports >= 0);

  final double viewports;

  @override
  double resolve(double viewportExtent) => viewportExtent * viewports;
}

/// A fixed logical-pixel edge request distance.
@immutable
final class TRVirtualListFixedTriggerExtent extends TRVirtualListTriggerExtent {
  const TRVirtualListFixedTriggerExtent(this.extent) : assert(extent >= 0);

  final double extent;

  @override
  double resolve(double viewportExtent) => extent;
}

/// Consumer-owned loading state and callback for one list edge.
@immutable
class TRVirtualListEdgeRequest {
  const TRVirtualListEdgeRequest({
    required this.requestKey,
    required this.onRequest,
    this.slot,
    this.triggerExtent = const TRVirtualListTriggerExtent.viewports(),
  });

  /// A cursor or retry-attempt identity. Each value is requested at most once.
  final Object requestKey;
  final VoidCallback onRequest;
  final Widget? slot;
  final TRVirtualListTriggerExtent triggerExtent;
}

/// The data items intersecting the viewport.
@immutable
class TRVirtualListRange<K> {
  const TRVirtualListRange({
    required this.firstIndex,
    required this.lastIndex,
    required this.firstKey,
    required this.lastKey,
  });

  final int firstIndex;
  final int lastIndex;
  final K firstKey;
  final K lastKey;
}

/// An opaque, versioned virtual-list restoration value.
@immutable
class TRVirtualListSnapshot<K> {
  const TRVirtualListSnapshot._({
    required this._anchorKey,
    required this._anchorViewportOffset,
    required this._anchorCandidates,
    required this._measurements,
  });

  static const int version = 1;

  final K _anchorKey;
  final double _anchorViewportOffset;
  final List<K> _anchorCandidates;
  final Map<K, double> _measurements;
}

abstract interface class _TRVirtualListBinding<K> {
  Future<void> scrollToIndex(
    int index, {
    required TRVirtualListAlignment alignment,
  });
  Future<void> scrollToKey(K key, {required TRVirtualListAlignment alignment});
  Future<void> scrollToEdge(TRVirtualListEdge edge);
  TRVirtualListSnapshot<K> takeSnapshot();
  void holdVisibleAnchorForNextLayout();
}

/// Imperative navigation and restoration access for [TRVirtualList].
class TRVirtualListController<K> {
  _TRVirtualListBinding<K>? _binding;
  bool _disposed = false;

  Future<void> scrollToIndex(
    int index, {
    TRVirtualListAlignment alignment = TRVirtualListAlignment.nearest,
  }) => _requireBinding().scrollToIndex(index, alignment: alignment);

  Future<void> scrollToKey(
    K key, {
    TRVirtualListAlignment alignment = TRVirtualListAlignment.nearest,
  }) => _requireBinding().scrollToKey(key, alignment: alignment);

  Future<void> scrollToEdge(TRVirtualListEdge edge) =>
      _requireBinding().scrollToEdge(edge);

  TRVirtualListSnapshot<K> takeSnapshot() => _requireBinding().takeSnapshot();

  /// Gives the next structural or measured size change anchor priority.
  void holdVisibleAnchorForNextLayout() =>
      _requireBinding().holdVisibleAnchorForNextLayout();

  void dispose() {
    _disposed = true;
    _binding = null;
  }

  void _attach(_TRVirtualListBinding<K> binding) {
    if (_disposed) {
      throw FlutterError('A disposed TRVirtualListController cannot attach.');
    }
    if (_binding != null && !identical(_binding, binding)) {
      throw FlutterError(
        'A TRVirtualListController can control only one list at a time.',
      );
    }
    _binding = binding;
  }

  void _detach(_TRVirtualListBinding<K> binding) {
    if (identical(_binding, binding)) _binding = null;
  }

  _TRVirtualListBinding<K> _requireBinding() {
    if (_disposed) {
      throw FlutterError('TRVirtualListController has been disposed.');
    }
    final binding = _binding;
    if (binding == null) {
      throw FlutterError('TRVirtualListController is not attached to a list.');
    }
    return binding;
  }
}

/// A lazy, variable-size linear list with stable visual anchoring.
// @tinyrack-preview virtual-list
class TRVirtualList<T, K> extends StatefulWidget {
  const TRVirtualList({
    required this.items,
    required this.itemKey,
    required this.estimatedItemExtent,
    required this.itemBuilder,
    this.axis = Axis.vertical,
    this.scrollCacheExtent,
    this.controller,
    this.follow = TRVirtualListFollow.none,
    this.initialPosition = const TRVirtualListInitialPosition.leading(),
    this.initialSnapshot,
    this.leadingEdgeRequest,
    this.onVisibleRangeChanged,
    this.pageStorageId,
    this.physics,
    this.semanticLabel,
    this.trailingEdgeRequest,
    super.key,
  });

  final List<T> items;
  final K Function(T item) itemKey;
  final double Function(T item, int index) estimatedItemExtent;
  final Widget Function(BuildContext context, T item, int index) itemBuilder;
  final Axis axis;

  /// Extra content to lay out before and after the viewport.
  final ScrollCacheExtent? scrollCacheExtent;
  final TRVirtualListController<K>? controller;
  final TRVirtualListFollow follow;
  final TRVirtualListInitialPosition<K> initialPosition;
  final TRVirtualListSnapshot<K>? initialSnapshot;
  final TRVirtualListEdgeRequest? leadingEdgeRequest;
  final ValueChanged<TRVirtualListRange<K>>? onVisibleRangeChanged;
  final String? pageStorageId;
  final ScrollPhysics? physics;
  final String? semanticLabel;
  final TRVirtualListEdgeRequest? trailingEdgeRequest;

  @override
  State<TRVirtualList<T, K>> createState() => _TRVirtualListState<T, K>();
}

@immutable
class _ItemEntryKey<K> {
  const _ItemEntryKey(this.value);
  final K value;

  @override
  bool operator ==(Object other) =>
      other is _ItemEntryKey<K> && other.value == value;

  @override
  int get hashCode => Object.hash(_ItemEntryKey<K>, value);
}

@immutable
class _SlotEntryKey {
  const _SlotEntryKey(this.edge);
  final TRVirtualListEdge edge;

  @override
  bool operator ==(Object other) =>
      other is _SlotEntryKey && other.edge == edge;

  @override
  int get hashCode => edge.hashCode;
}

class _TRVirtualListCoordinator {
  _RenderTRVirtualSliver? renderObject;
  bool holdAnchor = false;
  bool leadingPinned = true;
  bool trailingPinned = false;

  bool consumeHold() {
    final result = holdAnchor;
    holdAnchor = false;
    return result;
  }
}

class _TRVirtualListState<T, K> extends State<TRVirtualList<T, K>>
    implements _TRVirtualListBinding<K> {
  late final ScrollController _scrollController = ScrollController(
    keepScrollOffset: false,
  );
  late final _TRVirtualListCoordinator _coordinator;
  final Set<Object> _requestedLeadingKeys = <Object>{};
  final Set<Object> _requestedTrailingKeys = <Object>{};
  TRVirtualListRange<K>? _lastRange;
  TRVirtualListSnapshot<K>? _pageStorageSnapshot;
  PageStorageBucket? _pageStorageBucket;
  String? _pageStorageId;
  int _initialTargetRevision = 0;

  @override
  void initState() {
    super.initState();
    _coordinator = _TRVirtualListCoordinator();
    widget.controller?._attach(this);
  }

  @override
  void didUpdateWidget(covariant TRVirtualList<T, K> oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (!identical(oldWidget.controller, widget.controller)) {
      oldWidget.controller?._detach(this);
      widget.controller?._attach(this);
    }
    _syncPageStorage();
    final leadingRequestChanged =
        oldWidget.leadingEdgeRequest?.requestKey !=
        widget.leadingEdgeRequest?.requestKey;
    final trailingRequestChanged =
        oldWidget.trailingEdgeRequest?.requestKey !=
        widget.trailingEdgeRequest?.requestKey;
    if (leadingRequestChanged || trailingRequestChanged) {
      SchedulerBinding.instance.addPostFrameCallback((_) {
        if (mounted && _scrollController.hasClients) {
          _requestEdgesIfNeeded(_scrollController.position);
        }
      });
    }
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    _syncPageStorage();
  }

  @override
  void deactivate() {
    _savePageSnapshot();
    super.deactivate();
  }

  @override
  void dispose() {
    _savePageSnapshot();
    widget.controller?._detach(this);
    _coordinator.renderObject = null;
    _scrollController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    _syncPageStorage();
    final itemKeys = <K>[];
    final seenKeys = <K>{};
    final estimates = <double>[];
    for (var index = 0; index < widget.items.length; index += 1) {
      final item = widget.items[index];
      final key = widget.itemKey(item);
      assert(
        seenKeys.add(key),
        'TRVirtualList item keys must be unique. Duplicate key: $key',
      );
      itemKeys.add(key);
      final estimate = widget.estimatedItemExtent(item, index);
      assert(
        estimate.isFinite && estimate > 0,
        'TRVirtualList estimates must be finite and positive.',
      );
      estimates.add(estimate);
    }

    final hasLeadingSlot = widget.leadingEdgeRequest?.slot != null;
    final hasTrailingSlot = widget.trailingEdgeRequest?.slot != null;
    final entryKeys = <Object>[
      if (hasLeadingSlot) const _SlotEntryKey(TRVirtualListEdge.leading),
      for (final key in itemKeys) _ItemEntryKey<K>(key),
      if (hasTrailingSlot) const _SlotEntryKey(TRVirtualListEdge.trailing),
    ];
    final entryEstimates = <double>[
      if (hasLeadingSlot) estimates.firstOrNull ?? 1,
      ...estimates,
      if (hasTrailingSlot) estimates.lastOrNull ?? 1,
    ];
    final indexByEntryKey = <Object, int>{
      for (var index = 0; index < entryKeys.length; index += 1)
        entryKeys[index]: index,
    };

    Widget buildEntry(BuildContext context, int entryIndex) {
      if (hasLeadingSlot && entryIndex == 0) {
        return KeyedSubtree(
          key: const ValueKey<Object>(_SlotEntryKey(TRVirtualListEdge.leading)),
          child: widget.leadingEdgeRequest!.slot!,
        );
      }
      final itemIndex = entryIndex - (hasLeadingSlot ? 1 : 0);
      if (itemIndex >= widget.items.length) {
        return KeyedSubtree(
          key: const ValueKey<Object>(
            _SlotEntryKey(TRVirtualListEdge.trailing),
          ),
          child: widget.trailingEdgeRequest!.slot!,
        );
      }
      final item = widget.items[itemIndex];
      return KeyedSubtree(
        key: ValueKey<Object>(_ItemEntryKey<K>(itemKeys[itemIndex])),
        child: widget.itemBuilder(context, item, itemIndex),
      );
    }

    final scrollView = NotificationListener<ScrollMetricsNotification>(
      onNotification: (notification) {
        if (notification.depth != 0) return false;
        _requestEdgesIfNeeded(notification.metrics);
        return false;
      },
      child: NotificationListener<ScrollNotification>(
        onNotification: (notification) {
          if (notification.depth != 0) return false;
          _updatePinnedEdges(notification.metrics);
          if (notification is ScrollEndNotification) _savePageSnapshot();
          return false;
        },
        child: CustomScrollView(
          controller: _scrollController,
          scrollDirection: widget.axis,
          physics: widget.physics,
          scrollCacheExtent: widget.scrollCacheExtent,
          semanticChildCount: widget.items.length,
          slivers: <Widget>[
            _TRVirtualSliver(
              canResolveInitialTarget:
                  itemKeys.isNotEmpty || !_initialTargetRequiresItems,
              coordinator: _coordinator,
              entryKeys: entryKeys,
              estimates: entryEstimates,
              initialTarget: _initialTarget(
                itemKeys,
                hasLeadingSlot: hasLeadingSlot,
              ),
              initialTargetRevision: _initialTargetRevision,
              initialMeasurements: <Object, double>{
                for (final entry
                    in (widget.initialSnapshot ?? _pageStorageSnapshot)
                            ?._measurements
                            .entries ??
                        <MapEntry<K, double>>[])
                  _ItemEntryKey<K>(entry.key): entry.value,
              },
              delegate: SliverChildBuilderDelegate(
                buildEntry,
                childCount: entryKeys.length,
                findChildIndexCallback: (key) {
                  if (key is! ValueKey<Object>) return null;
                  return indexByEntryKey[key.value];
                },
                semanticIndexCallback: (child, entryIndex) {
                  if (hasLeadingSlot && entryIndex == 0) return null;
                  final itemIndex = entryIndex - (hasLeadingSlot ? 1 : 0);
                  return itemIndex < widget.items.length ? itemIndex : null;
                },
              ),
              follow: widget.follow,
              onDetach: _savePageSnapshot,
              onRange: (firstEntryIndex, lastEntryIndex) {
                _reportRange(
                  firstEntryIndex,
                  lastEntryIndex,
                  itemKeys,
                  hasLeadingSlot: hasLeadingSlot,
                );
              },
            ),
          ],
        ),
      ),
    );
    return TRScrollArea.forScrollable(
      controller: _scrollController,
      semanticLabel: widget.semanticLabel,
      child: scrollView,
    );
  }

  void _syncPageStorage() {
    final bucket = PageStorage.maybeOf(context);
    final pageStorageId = widget.pageStorageId;
    if (identical(bucket, _pageStorageBucket) &&
        pageStorageId == _pageStorageId) {
      return;
    }
    _savePageSnapshot();
    _pageStorageBucket = bucket;
    _pageStorageId = pageStorageId;
    _pageStorageSnapshot = null;
    _coordinator.holdAnchor = false;
    if (bucket != null && pageStorageId != null) {
      final stored = bucket.readState(context, identifier: pageStorageId);
      if (stored is TRVirtualListSnapshot<K>) {
        _pageStorageSnapshot = stored;
      }
    }
    if (widget.initialSnapshot == null) _initialTargetRevision += 1;
  }

  _InitialTarget _initialTarget(
    List<K> itemKeys, {
    required bool hasLeadingSlot,
  }) {
    final snapshot = widget.initialSnapshot ?? _pageStorageSnapshot;
    if (snapshot != null) {
      final candidates = <K>[
        snapshot._anchorKey,
        ...snapshot._anchorCandidates,
      ];
      for (final candidate in candidates) {
        final index = itemKeys.indexOf(candidate);
        if (index >= 0) {
          return _InitialTarget.item(
            index + (hasLeadingSlot ? 1 : 0),
            TRVirtualListAlignment.leading,
            viewportOffset: snapshot._anchorViewportOffset,
          );
        }
      }
    }
    return switch (widget.initialPosition._kind) {
      _TRVirtualListInitialPositionKind.leading =>
        const _InitialTarget.leading(),
      _TRVirtualListInitialPositionKind.trailing =>
        const _InitialTarget.trailing(),
      _TRVirtualListInitialPositionKind.atIndex => _InitialTarget.item(
        math.min(
              widget.initialPosition.index!,
              math.max(0, itemKeys.length - 1),
            ) +
            (hasLeadingSlot ? 1 : 0),
        widget.initialPosition.alignment,
      ),
      _TRVirtualListInitialPositionKind.byKey => _InitialTarget.item(
        math.max(0, itemKeys.indexOf(widget.initialPosition.key as K)) +
            (hasLeadingSlot ? 1 : 0),
        widget.initialPosition.alignment,
      ),
    };
  }

  bool get _initialTargetRequiresItems =>
      widget.initialSnapshot != null ||
      _pageStorageSnapshot != null ||
      widget.initialPosition._kind ==
          _TRVirtualListInitialPositionKind.atIndex ||
      widget.initialPosition._kind == _TRVirtualListInitialPositionKind.byKey;

  void _updatePinnedEdges(ScrollMetrics metrics) {
    const threshold = 1.0;
    _coordinator
      ..leadingPinned = metrics.extentBefore <= threshold
      ..trailingPinned = metrics.extentAfter <= threshold;
    _requestEdgesIfNeeded(metrics);
  }

  void _requestEdgesIfNeeded(ScrollMetrics metrics) {
    _requestEdgeIfNeeded(metrics, TRVirtualListEdge.leading);
    _requestEdgeIfNeeded(metrics, TRVirtualListEdge.trailing);
  }

  void _requestEdgeIfNeeded(ScrollMetrics metrics, TRVirtualListEdge edge) {
    if (widget.items.isEmpty) return;
    final request = edge == TRVirtualListEdge.leading
        ? widget.leadingEdgeRequest
        : widget.trailingEdgeRequest;
    if (request == null) return;
    final distance = edge == TRVirtualListEdge.leading
        ? metrics.extentBefore
        : metrics.extentAfter;
    if (distance > request.triggerExtent.resolve(metrics.viewportDimension)) {
      return;
    }
    final requestedKeys = edge == TRVirtualListEdge.leading
        ? _requestedLeadingKeys
        : _requestedTrailingKeys;
    if (requestedKeys.add(request.requestKey)) request.onRequest();
  }

  void _reportRange(
    int firstEntryIndex,
    int lastEntryIndex,
    List<K> itemKeys, {
    required bool hasLeadingSlot,
  }) {
    if (itemKeys.isEmpty || firstEntryIndex < 0 || lastEntryIndex < 0) {
      _lastRange = null;
      return;
    }
    if (widget.onVisibleRangeChanged == null && widget.pageStorageId == null) {
      return;
    }
    final shift = hasLeadingSlot ? 1 : 0;
    final firstItemEntry = shift;
    final lastItemEntry = shift + itemKeys.length - 1;
    final visibleFirstEntry = math.max(firstEntryIndex, firstItemEntry);
    final visibleLastEntry = math.min(lastEntryIndex, lastItemEntry);
    if (visibleFirstEntry > visibleLastEntry) {
      _lastRange = null;
      return;
    }
    final first = visibleFirstEntry - shift;
    final last = visibleLastEntry - shift;
    final range = TRVirtualListRange<K>(
      firstIndex: first,
      lastIndex: last,
      firstKey: itemKeys[first],
      lastKey: itemKeys[last],
    );
    if (_lastRange?.firstIndex == range.firstIndex &&
        _lastRange?.lastIndex == range.lastIndex &&
        _lastRange?.firstKey == range.firstKey &&
        _lastRange?.lastKey == range.lastKey) {
      return;
    }
    _lastRange = range;
    SchedulerBinding.instance.addPostFrameCallback((_) {
      if (mounted && identical(_lastRange, range)) {
        widget.onVisibleRangeChanged?.call(range);
        _savePageSnapshot();
      }
    });
  }

  void _savePageSnapshot() {
    final pageStorageId = _pageStorageId;
    final bucket = _pageStorageBucket;
    if (pageStorageId == null || bucket == null || widget.items.isEmpty) return;
    final renderObject = _coordinator.renderObject;
    if (renderObject == null || !_scrollController.hasClients) return;
    bucket.writeState(context, takeSnapshot(), identifier: pageStorageId);
  }

  _RenderTRVirtualSliver get _renderObject {
    final renderObject = _coordinator.renderObject;
    if (renderObject == null || !_scrollController.hasClients) {
      throw FlutterError('TRVirtualList has not completed its first layout.');
    }
    return renderObject;
  }

  int _entryIndexForItemIndex(int itemIndex) {
    if (itemIndex < 0 || itemIndex >= widget.items.length) {
      throw RangeError.index(itemIndex, widget.items, 'index');
    }
    return itemIndex + (widget.leadingEdgeRequest?.slot == null ? 0 : 1);
  }

  @override
  Future<void> scrollToIndex(
    int index, {
    required TRVirtualListAlignment alignment,
  }) async {
    _jumpToEntry(_entryIndexForItemIndex(index), alignment);
  }

  @override
  Future<void> scrollToKey(
    K key, {
    required TRVirtualListAlignment alignment,
  }) async {
    final index = widget.items.indexWhere(
      (item) => widget.itemKey(item) == key,
    );
    if (index < 0) throw StateError('TRVirtualList does not contain key $key.');
    _jumpToEntry(_entryIndexForItemIndex(index), alignment);
  }

  void _jumpToEntry(int entryIndex, TRVirtualListAlignment alignment) {
    final renderObject = _renderObject;
    final position = _scrollController.position;
    final leading = renderObject.offsetForIndex(entryIndex);
    final trailing = renderObject.offsetForIndex(entryIndex + 1);
    final viewport = position.viewportDimension;
    final current = position.pixels;
    final resolvedAlignment = alignment == TRVirtualListAlignment.nearest
        ? current > leading
              ? TRVirtualListAlignment.leading
              : current + viewport < trailing
              ? TRVirtualListAlignment.trailing
              : null
        : alignment;
    if (resolvedAlignment == null) return;
    final target = renderObject.activateTarget(
      _InitialTarget.item(entryIndex, resolvedAlignment),
      viewport,
    );
    position.jumpTo(
      target.clamp(position.minScrollExtent, position.maxScrollExtent),
    );
  }

  @override
  Future<void> scrollToEdge(TRVirtualListEdge edge) async {
    final renderObject = _renderObject;
    final position = _scrollController.position;
    if (edge == TRVirtualListEdge.leading) {
      _coordinator.leadingPinned = true;
      position.jumpTo(
        renderObject
            .activateTarget(
              const _InitialTarget.leading(),
              position.viewportDimension,
            )
            .clamp(position.minScrollExtent, position.maxScrollExtent),
      );
    } else {
      _coordinator.trailingPinned = true;
      position.jumpTo(
        renderObject
            .activateTarget(
              const _InitialTarget.trailing(),
              position.viewportDimension,
            )
            .clamp(position.minScrollExtent, position.maxScrollExtent),
      );
    }
  }

  @override
  TRVirtualListSnapshot<K> takeSnapshot() {
    if (widget.items.isEmpty) {
      throw StateError('An empty TRVirtualList has no restorable snapshot.');
    }
    final renderObject = _renderObject;
    final captured = renderObject.captureAnchor(_scrollController.offset);
    final itemCandidates = captured.candidates
        .whereType<_ItemEntryKey<K>>()
        .toList(growable: false);
    final itemAnchor =
        itemCandidates.firstOrNull ??
        _ItemEntryKey<K>(widget.itemKey(widget.items.first));
    return TRVirtualListSnapshot<K>._(
      anchorKey: itemAnchor.value,
      anchorViewportOffset:
          renderObject.visualOffsetForKey(itemAnchor) -
          _scrollController.offset,
      anchorCandidates: itemCandidates
          .skip(1)
          .map((entry) => entry.value)
          .toList(growable: false),
      measurements: <K, double>{
        for (final entry in renderObject.measurements.entries)
          if (entry.key is _ItemEntryKey<K>)
            (entry.key as _ItemEntryKey<K>).value: entry.value,
      },
    );
  }

  @override
  void holdVisibleAnchorForNextLayout() {
    _coordinator.holdAnchor = true;
  }
}

enum _InitialTargetKind { leading, trailing, item }

@immutable
class _InitialTarget {
  const _InitialTarget.leading()
    : kind = _InitialTargetKind.leading,
      index = null,
      alignment = TRVirtualListAlignment.leading,
      viewportOffset = null;
  const _InitialTarget.trailing()
    : kind = _InitialTargetKind.trailing,
      index = null,
      alignment = TRVirtualListAlignment.trailing,
      viewportOffset = null;
  const _InitialTarget.item(this.index, this.alignment, {this.viewportOffset})
    : kind = _InitialTargetKind.item;

  final _InitialTargetKind kind;
  final int? index;
  final TRVirtualListAlignment alignment;
  final double? viewportOffset;
}

class _TRVirtualSliver extends SliverMultiBoxAdaptorWidget {
  const _TRVirtualSliver({
    required super.delegate,
    required this.canResolveInitialTarget,
    required this.coordinator,
    required this.entryKeys,
    required this.estimates,
    required this.follow,
    required this.initialMeasurements,
    required this.initialTarget,
    required this.initialTargetRevision,
    required this.onDetach,
    required this.onRange,
  });

  final bool canResolveInitialTarget;
  final _TRVirtualListCoordinator coordinator;
  final List<Object> entryKeys;
  final List<double> estimates;
  final TRVirtualListFollow follow;
  final Map<Object, double> initialMeasurements;
  final _InitialTarget initialTarget;
  final int initialTargetRevision;
  final VoidCallback onDetach;
  final void Function(int firstIndex, int lastIndex) onRange;

  @override
  RenderSliverMultiBoxAdaptor createRenderObject(BuildContext context) {
    final element = context as SliverMultiBoxAdaptorElement;
    return _RenderTRVirtualSliver(
      childManager: element,
      canResolveInitialTarget: canResolveInitialTarget,
      coordinator: coordinator,
      entryKeys: entryKeys,
      estimates: estimates,
      follow: follow,
      initialMeasurements: initialMeasurements,
      initialTarget: initialTarget,
      initialTargetRevision: initialTargetRevision,
      onDetach: onDetach,
      onRange: onRange,
    );
  }

  @override
  void updateRenderObject(
    BuildContext context,
    covariant _RenderTRVirtualSliver renderObject,
  ) {
    renderObject
      ..canResolveInitialTarget = canResolveInitialTarget
      ..coordinator = coordinator
      ..follow = follow
      ..initialTarget = initialTarget
      ..initialTargetRevision = initialTargetRevision
      ..onDetach = onDetach
      ..onRange = onRange
      ..updateEntries(entryKeys, estimates, initialMeasurements);
  }

  @override
  double estimateMaxScrollOffset(
    SliverConstraints? constraints,
    int firstIndex,
    int lastIndex,
    double leadingScrollOffset,
    double trailingScrollOffset,
  ) => estimates.fold<double>(0, (sum, extent) => sum + extent);
}

class _ExtentIndex {
  _ExtentIndex(List<double> values) {
    rebuild(values);
  }

  late List<double> _values;
  late List<double> _tree;

  int get length => _values.length;
  double get total => prefix(length);
  double valueAt(int index) => _values[index];

  void rebuild(List<double> values) {
    _values = List<double>.of(values);
    _tree = List<double>.filled(values.length + 1, 0);
    for (var cursor = 1; cursor < _tree.length; cursor += 1) {
      _tree[cursor] += values[cursor - 1];
      final parent = cursor + (cursor & -cursor);
      if (parent < _tree.length) _tree[parent] += _tree[cursor];
    }
  }

  void update(int index, double value) {
    final delta = value - _values[index];
    if (delta.abs() <= precisionErrorTolerance) return;
    _values[index] = value;
    _add(index, delta);
  }

  void _add(int index, double delta) {
    for (
      var cursor = index + 1;
      cursor < _tree.length;
      cursor += cursor & -cursor
    ) {
      _tree[cursor] += delta;
    }
  }

  double prefix(int end) {
    var result = 0.0;
    for (var cursor = end; cursor > 0; cursor -= cursor & -cursor) {
      result += _tree[cursor];
    }
    return result;
  }

  int indexForOffset(double offset) {
    if (_values.isEmpty) return 0;
    final target = offset.clamp(
      0,
      math.max(0, total - precisionErrorTolerance),
    );
    var index = 0;
    var sum = 0.0;
    var bit = 1;
    while (bit < _tree.length) {
      bit <<= 1;
    }
    for (bit >>= 1; bit > 0; bit >>= 1) {
      final next = index + bit;
      if (next < _tree.length && sum + _tree[next] <= target) {
        index = next;
        sum += _tree[next];
      }
    }
    return math.min(index, _values.length - 1);
  }

  int indexBeforeOffset(double offset) {
    if (_values.isEmpty) return 0;
    final target = offset.clamp(0, total);
    var index = 0;
    var sum = 0.0;
    var bit = 1;
    while (bit < _tree.length) {
      bit <<= 1;
    }
    for (bit >>= 1; bit > 0; bit >>= 1) {
      final next = index + bit;
      if (next < _tree.length && sum + _tree[next] < target) {
        index = next;
        sum += _tree[next];
      }
    }
    return math.min(index, _values.length - 1);
  }
}

class _CapturedAnchor {
  const _CapturedAnchor(this.key, this.candidates, this.oldOffsets);
  final Object key;
  final List<Object> candidates;
  final Map<Object, double> oldOffsets;
}

class _RenderTRVirtualSliver extends RenderSliverMultiBoxAdaptor {
  _RenderTRVirtualSliver({
    required super.childManager,
    required this._canResolveInitialTarget,
    required this._coordinator,
    required List<Object> entryKeys,
    required List<double> estimates,
    required this._follow,
    required Map<Object, double> initialMeasurements,
    required this._initialTarget,
    required this._initialTargetRevision,
    required this._onDetach,
    required this._onRange,
  }) : _entryKeys = List<Object>.of(entryKeys),
       _estimates = List<double>.of(estimates),
       _measurements = Map<Object, double>.of(initialMeasurements),
       _extentIndex = _ExtentIndex(<double>[
         for (var index = 0; index < entryKeys.length; index += 1)
           initialMeasurements[entryKeys[index]] ?? estimates[index],
       ]) {
    _coordinator.renderObject = this;
  }

  _TRVirtualListCoordinator _coordinator;
  bool _canResolveInitialTarget;
  List<Object> _entryKeys;
  List<double> _estimates;
  final Map<Object, double> _measurements;
  _ExtentIndex _extentIndex;
  _InitialTarget _initialTarget;
  int _initialTargetRevision;
  TRVirtualListFollow _follow;
  VoidCallback _onDetach;
  void Function(int, int) _onRange;
  bool _initialResolved = false;
  _InitialTarget? _activeTarget;
  double _underfillOffset = 0;
  double _pendingCorrection = 0;
  bool _holdAnchorForLayout = false;
  double? _lastViewportExtent;

  set canResolveInitialTarget(bool value) {
    if (_canResolveInitialTarget == value) return;
    _canResolveInitialTarget = value;
    if (!_initialResolved) markNeedsLayout();
  }

  set coordinator(_TRVirtualListCoordinator value) {
    if (identical(_coordinator, value)) return;
    if (identical(_coordinator.renderObject, this)) {
      _coordinator.renderObject = null;
    }
    _coordinator = value..renderObject = this;
  }

  set follow(TRVirtualListFollow value) {
    if (_follow == value) return;
    _follow = value;
    markNeedsLayout();
  }

  set initialTarget(_InitialTarget value) {
    _initialTarget = value;
    if (!_initialResolved) markNeedsLayout();
  }

  set initialTargetRevision(int value) {
    if (_initialTargetRevision == value) return;
    _initialTargetRevision = value;
    _initialResolved = false;
    _activeTarget = null;
    _pendingCorrection = 0;
    _holdAnchorForLayout = false;
    markNeedsLayout();
  }

  set onRange(void Function(int, int) value) => _onRange = value;

  set onDetach(VoidCallback value) => _onDetach = value;

  Map<Object, double> get measurements =>
      Map<Object, double>.unmodifiable(_measurements);

  void updateEntries(
    List<Object> keys,
    List<double> estimates,
    Map<Object, double> initialMeasurements,
  ) {
    var restoredMeasurements = false;
    if (!_initialResolved) {
      for (final entry in initialMeasurements.entries) {
        if (_measurements[entry.key] != entry.value) {
          _measurements[entry.key] = entry.value;
          restoredMeasurements = true;
        }
      }
    }
    if (!restoredMeasurements &&
        listEquals(_entryKeys, keys) &&
        listEquals(_estimates, estimates)) {
      return;
    }
    final oldKeys = _entryKeys;
    final oldIndex = _extentIndex;
    final anchor = _initialResolved && geometry != null && oldKeys.isNotEmpty
        ? captureAnchor(constraints.scrollOffset)
        : null;
    _entryKeys = List<Object>.of(keys);
    _estimates = List<double>.of(estimates);
    final keySet = keys.toSet();
    _measurements.removeWhere((key, _) => !keySet.contains(key));
    _extentIndex = _ExtentIndex(<double>[
      for (var index = 0; index < keys.length; index += 1)
        _measurements[keys[index]] ?? estimates[index],
    ]);
    if (_initialResolved) {
      if (_coordinator.consumeHold()) _holdAnchorForLayout = true;
      final held = _holdAnchorForLayout;
      if (!held &&
          _follow == TRVirtualListFollow.leading &&
          _coordinator.leadingPinned) {
        // Offset zero already keeps the logical leading edge pinned.
      } else if (!held &&
          _follow == TRVirtualListFollow.trailing &&
          _coordinator.trailingPinned) {
        _activeTarget = const _InitialTarget.trailing();
      } else if (anchor != null) {
        final replacement = _replacementAnchor(anchor, oldKeys, keySet);
        if (replacement != null) {
          final oldReplacementOffset = oldIndex.prefix(
            oldKeys.indexOf(replacement),
          );
          _pendingCorrection +=
              offsetForKey(replacement) - oldReplacementOffset;
        }
      }
    }
    markNeedsLayout();
  }

  Object? _replacementAnchor(
    _CapturedAnchor anchor,
    List<Object> oldKeys,
    Set<Object> newKeys,
  ) {
    if (newKeys.contains(anchor.key)) return anchor.key;
    for (final candidate in anchor.candidates) {
      if (newKeys.contains(candidate)) return candidate;
    }
    final oldAnchorIndex = oldKeys.indexOf(anchor.key);
    for (var index = oldAnchorIndex + 1; index < oldKeys.length; index += 1) {
      if (newKeys.contains(oldKeys[index])) {
        return oldKeys[index];
      }
    }
    for (var index = oldAnchorIndex - 1; index >= 0; index -= 1) {
      if (newKeys.contains(oldKeys[index])) {
        return oldKeys[index];
      }
    }
    return null;
  }

  double offsetForIndex(int index) =>
      _extentIndex.prefix(index.clamp(0, _extentIndex.length));

  double offsetForKey(Object key) {
    final index = _entryKeys.indexOf(key);
    if (index < 0) throw StateError('Unknown virtual-list key: $key');
    return offsetForIndex(index);
  }

  double activateTarget(_InitialTarget target, double viewportExtent) {
    _activeTarget = target;
    markNeedsLayout();
    return _resolveTargetOffset(target, viewportExtent);
  }

  double visualOffsetForKey(Object key) => offsetForKey(key) + _underfillOffset;

  _CapturedAnchor captureAnchor(double scrollOffset) {
    if (_entryKeys.isEmpty) {
      throw StateError('An empty virtual list has no restorable anchor.');
    }
    final first = _extentIndex.indexForOffset(scrollOffset);
    final last = _extentIndex.indexForOffset(
      scrollOffset +
          (geometry != null
              ? constraints.viewportMainAxisExtent
              : constraints.remainingPaintExtent),
    );
    final candidates = _entryKeys.sublist(
      first,
      math.min(last + 1, _entryKeys.length),
    );
    return _CapturedAnchor(_entryKeys[first], candidates, <Object, double>{
      for (
        var index = math.max(0, first - 1);
        index <= math.min(_entryKeys.length - 1, last + 1);
        index += 1
      )
        _entryKeys[index]: offsetForIndex(index),
    });
  }

  @override
  void detach() {
    _onDetach();
    if (identical(_coordinator.renderObject, this)) {
      _coordinator.renderObject = null;
    }
    super.detach();
  }

  @override
  void performLayout() {
    if (_pendingCorrection.abs() > precisionErrorTolerance) {
      final correction = _pendingCorrection;
      _pendingCorrection = 0;
      geometry = SliverGeometry(scrollOffsetCorrection: correction);
      return;
    }

    final sliverConstraints = constraints;
    final viewportExtent = sliverConstraints.viewportMainAxisExtent;
    final viewportChanged = switch (_lastViewportExtent) {
      final previous? =>
        (previous - viewportExtent).abs() > precisionErrorTolerance,
      null => false,
    };
    if (_initialResolved &&
        viewportChanged &&
        _activeTarget == null &&
        !_holdAnchorForLayout &&
        !_coordinator.holdAnchor) {
      if (_follow == TRVirtualListFollow.leading &&
          _coordinator.leadingPinned) {
        _activeTarget = const _InitialTarget.leading();
      } else if (_follow == TRVirtualListFollow.trailing &&
          _coordinator.trailingPinned) {
        _activeTarget = const _InitialTarget.trailing();
      }
    }
    if (!_initialResolved &&
        _entryKeys.isNotEmpty &&
        _canResolveInitialTarget) {
      _initialResolved = true;
      _activeTarget = _initialTarget;
      // The effective target can come from an explicit or PageStorage
      // snapshot, so the widget's fallback initial position is not enough to
      // decide which edge should follow subsequent size corrections.
      _coordinator
        ..leadingPinned = _initialTarget.kind == _InitialTargetKind.leading
        ..trailingPinned = _initialTarget.kind == _InitialTargetKind.trailing;
      final target = _resolveTargetOffset(
        _initialTarget,
        sliverConstraints.viewportMainAxisExtent,
      );
      final correction = target - sliverConstraints.scrollOffset;
      if (correction.abs() > precisionErrorTolerance) {
        geometry = SliverGeometry(scrollOffsetCorrection: correction);
        return;
      }
    }

    childManager.didStartLayout();
    childManager.setDidUnderflow(false);
    if (_entryKeys.isEmpty) {
      collectGarbage(childCount, 0);
      geometry = SliverGeometry.zero;
      _holdAnchorForLayout = false;
      _lastViewportExtent = viewportExtent;
      childManager.didFinishLayout();
      return;
    }

    final scrollOffset =
        sliverConstraints.scrollOffset + sliverConstraints.cacheOrigin;
    final targetEnd = scrollOffset + sliverConstraints.remainingCacheExtent;
    final firstIndex = _extentIndex.indexForOffset(scrollOffset);
    final targetLastIndex = _extentIndex.indexForOffset(targetEnd);

    if (firstChild != null) {
      collectGarbage(
        calculateLeadingGarbage(firstIndex: firstIndex),
        calculateTrailingGarbage(lastIndex: targetLastIndex),
      );
    } else {
      collectGarbage(0, 0);
    }

    if (firstChild == null &&
        !addInitialChild(
          index: firstIndex,
          layoutOffset: offsetForIndex(firstIndex),
        )) {
      geometry = SliverGeometry(
        scrollExtent: _extentIndex.total,
        maxPaintExtent: _extentIndex.total,
      );
      _holdAnchorForLayout = false;
      _lastViewportExtent = viewportExtent;
      childManager.didFinishLayout();
      return;
    }

    final childConstraints = sliverConstraints.asBoxConstraints();
    RenderBox? trailingChild;
    for (
      var index = indexOf(firstChild!) - 1;
      index >= firstIndex;
      index -= 1
    ) {
      final child = insertAndLayoutLeadingChild(
        childConstraints,
        parentUsesSize: true,
      );
      if (child == null) break;
      final parentData = child.parentData! as SliverMultiBoxAdaptorParentData;
      parentData.layoutOffset = offsetForIndex(index);
      trailingChild ??= child;
    }
    if (trailingChild == null) {
      firstChild!.layout(childConstraints, parentUsesSize: true);
      (firstChild!.parentData! as SliverMultiBoxAdaptorParentData)
          .layoutOffset = offsetForIndex(
        firstIndex,
      );
      trailingChild = firstChild;
    }

    void layoutThrough(int lastIndex) {
      for (
        var index = indexOf(trailingChild!) + 1;
        index <= lastIndex;
        index += 1
      ) {
        var child = childAfter(trailingChild!);
        if (child == null || indexOf(child) != index) {
          child = insertAndLayoutChild(
            childConstraints,
            after: trailingChild,
            parentUsesSize: true,
          );
          if (child == null) return;
        } else {
          child.layout(childConstraints, parentUsesSize: true);
        }
        trailingChild = child;
        (child.parentData! as SliverMultiBoxAdaptorParentData).layoutOffset =
            offsetForIndex(index);
      }
    }

    layoutThrough(targetLastIndex);

    final anchor = captureAnchor(sliverConstraints.scrollOffset);
    var changed = false;
    while (true) {
      var roundChanged = false;
      RenderBox? child = firstChild;
      while (child != null) {
        final index = indexOf(child);
        final measured = paintExtentOf(child);
        final key = _entryKeys[index];
        if ((measured - _extentIndex.valueAt(index)).abs() >
            precisionErrorTolerance) {
          _measurements[key] = measured;
          _extentIndex.update(index, measured);
          changed = true;
          roundChanged = true;
        }
        child = childAfter(child);
      }
      if (roundChanged) {
        child = firstChild;
        while (child != null) {
          final parentData =
              child.parentData! as SliverMultiBoxAdaptorParentData;
          parentData.layoutOffset = offsetForIndex(indexOf(child));
          child = childAfter(child);
        }
      }
      final measuredTargetLast = _extentIndex.indexForOffset(targetEnd);
      if (indexOf(trailingChild!) >= measuredTargetLast) break;
      final previousTrailingIndex = indexOf(trailingChild!);
      layoutThrough(measuredTargetLast);
      if (indexOf(trailingChild!) == previousTrailingIndex) break;
    }

    var correction = 0.0;
    final heldBeforeMeasurement = _holdAnchorForLayout;
    final targetUnderfillOffset =
        !heldBeforeMeasurement &&
        _follow == TRVirtualListFollow.trailing &&
        _coordinator.trailingPinned;
    var resolvedUnderfillOffset =
        heldBeforeMeasurement || _follow == TRVirtualListFollow.none
        ? _underfillOffset
        : 0.0;
    if (targetUnderfillOffset) {
      resolvedUnderfillOffset = math.max(
        0.0,
        sliverConstraints.viewportMainAxisExtent - _extentIndex.total,
      );
    }
    if (_activeTarget case final activeTarget?) {
      resolvedUnderfillOffset = _resolveTargetUnderfillOffset(
        activeTarget,
        sliverConstraints.viewportMainAxisExtent,
      );
      correction =
          _resolveTargetOffset(
            activeTarget,
            sliverConstraints.viewportMainAxisExtent,
          ) -
          sliverConstraints.scrollOffset;
    } else if (changed) {
      if (_coordinator.consumeHold()) _holdAnchorForLayout = true;
      final held = _holdAnchorForLayout;
      if (held) {
        resolvedUnderfillOffset = _underfillOffset;
        correction = offsetForKey(anchor.key) - anchor.oldOffsets[anchor.key]!;
      } else if (_follow == TRVirtualListFollow.leading &&
          _coordinator.leadingPinned) {
        correction = 0;
      } else if (_follow == TRVirtualListFollow.trailing &&
          _coordinator.trailingPinned) {
        _activeTarget = const _InitialTarget.trailing();
        correction =
            _resolveTargetOffset(
              _activeTarget!,
              sliverConstraints.viewportMainAxisExtent,
            ) -
            sliverConstraints.scrollOffset;
      } else {
        correction = offsetForKey(anchor.key) - anchor.oldOffsets[anchor.key]!;
      }
    }
    if (correction.abs() > precisionErrorTolerance) {
      childManager.didFinishLayout();
      geometry = SliverGeometry(scrollOffsetCorrection: correction);
      return;
    }
    _underfillOffset = resolvedUnderfillOffset;
    RenderBox? positionedChild = firstChild;
    while (positionedChild != null) {
      final parentData =
          positionedChild.parentData! as SliverMultiBoxAdaptorParentData;
      parentData.layoutOffset =
          _underfillOffset + offsetForIndex(indexOf(positionedChild));
      positionedChild = childAfter(positionedChild);
    }
    _activeTarget = null;

    final total = _extentIndex.total;
    final visualTotal = _underfillOffset + total;
    final firstOffset = _underfillOffset > 0
        ? 0.0
        : offsetForIndex(indexOf(firstChild!));
    final lastOffset = _underfillOffset > 0
        ? visualTotal
        : offsetForIndex(indexOf(lastChild!) + 1);
    final paintExtent = calculatePaintOffset(
      sliverConstraints,
      from: firstOffset,
      to: lastOffset,
    );
    final cacheExtent = calculateCacheOffset(
      sliverConstraints,
      from: firstOffset,
      to: lastOffset,
    );
    geometry = SliverGeometry(
      scrollExtent: visualTotal,
      paintExtent: paintExtent,
      cacheExtent: cacheExtent,
      maxPaintExtent: visualTotal,
      hasVisualOverflow:
          visualTotal > sliverConstraints.remainingPaintExtent ||
          sliverConstraints.scrollOffset > 0,
    );
    if (indexOf(lastChild!) == _entryKeys.length - 1) {
      childManager.setDidUnderflow(true);
    }
    final visibleEnd = math.min(
      total,
      sliverConstraints.scrollOffset + sliverConstraints.remainingPaintExtent,
    );
    if (visibleEnd <= sliverConstraints.scrollOffset) {
      _onRange(-1, -1);
    } else {
      final visibleFirst = _extentIndex.indexForOffset(
        sliverConstraints.scrollOffset,
      );
      final visibleLast = _extentIndex.indexBeforeOffset(visibleEnd);
      _onRange(visibleFirst, visibleLast);
    }
    _holdAnchorForLayout = false;
    _lastViewportExtent = viewportExtent;
    childManager.didFinishLayout();
  }

  double _resolveTargetOffset(_InitialTarget target, double viewportExtent) {
    final maxOffset = math.max(0.0, _extentIndex.total - viewportExtent);
    if (target.kind == _InitialTargetKind.leading) return 0;
    if (target.kind == _InitialTargetKind.trailing) return maxOffset;
    final index = target.index!.clamp(0, _entryKeys.length - 1);
    final leading = offsetForIndex(index);
    if (target.viewportOffset case final viewportOffset?) {
      return (leading - viewportOffset).clamp(0.0, maxOffset).toDouble();
    }
    final trailing = offsetForIndex(index + 1);
    return switch (target.alignment) {
      TRVirtualListAlignment.leading ||
      TRVirtualListAlignment.nearest => leading,
      TRVirtualListAlignment.center =>
        (leading + trailing - viewportExtent) / 2,
      TRVirtualListAlignment.trailing => trailing - viewportExtent,
    }.clamp(0.0, maxOffset).toDouble();
  }

  double _resolveTargetUnderfillOffset(
    _InitialTarget target,
    double viewportExtent,
  ) {
    final maxUnderfill = math.max(0.0, viewportExtent - _extentIndex.total);
    if (maxUnderfill == 0 || target.kind == _InitialTargetKind.leading) {
      return 0;
    }
    if (target.kind == _InitialTargetKind.trailing) {
      return maxUnderfill;
    }
    final index = target.index!.clamp(0, _entryKeys.length - 1);
    final leading = offsetForIndex(index);
    final trailing = offsetForIndex(index + 1);
    final desiredLeading = switch (target.viewportOffset) {
      final viewportOffset? => viewportOffset,
      null => switch (target.alignment) {
        TRVirtualListAlignment.leading || TRVirtualListAlignment.nearest => 0,
        TRVirtualListAlignment.center =>
          (viewportExtent - (trailing - leading)) / 2,
        TRVirtualListAlignment.trailing =>
          viewportExtent - (trailing - leading),
      },
    };
    return (desiredLeading - leading).clamp(0.0, maxUnderfill).toDouble();
  }
}
