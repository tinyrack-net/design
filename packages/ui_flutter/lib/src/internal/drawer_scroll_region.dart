import 'package:flutter/gestures.dart';
import 'package:material_ui/material_ui.dart';

/// Internal bridge between a drawer and a fixed-header scrolling region.
class TRInternalDrawerDragScope extends InheritedWidget {
  const TRInternalDrawerDragScope({
    required this.onDragEnd,
    required this.onDragUpdate,
    required super.child,
    super.key,
  });

  final GestureDragEndCallback onDragEnd;
  final GestureDragUpdateCallback onDragUpdate;

  static TRInternalDrawerDragScope? maybeOf(BuildContext context) =>
      context.dependOnInheritedWidgetOfExactType<TRInternalDrawerDragScope>();

  @override
  bool updateShouldNotify(TRInternalDrawerDragScope oldWidget) =>
      onDragEnd != oldWidget.onDragEnd ||
      onDragUpdate != oldWidget.onDragUpdate;
}

/// Gives one scroll position the complete drag region while keeping its
/// viewport free to occupy only part of that region.
class TRInternalDrawerScrollRegion extends StatefulWidget {
  const TRInternalDrawerScrollRegion({
    required this.controller,
    required this.child,
    super.key,
  });

  final ScrollController controller;
  final Widget child;

  @override
  State<TRInternalDrawerScrollRegion> createState() =>
      _TRInternalDrawerScrollRegionState();
}

class _TRInternalDrawerScrollRegionState
    extends State<TRInternalDrawerScrollRegion> {
  DragStartDetails? _startDetails;
  Drag? _scrollDrag;
  bool _draggingDrawer = false;

  bool get _canScroll => widget.controller.hasClients;

  bool get _atStart =>
      _canScroll &&
      widget.controller.position.pixels <=
          widget.controller.position.minScrollExtent;

  void _start(DragStartDetails details) {
    _startDetails = details;
    _scrollDrag = null;
    _draggingDrawer = false;
  }

  void _update(DragUpdateDetails details) {
    if (_scrollDrag == null && !_draggingDrawer) {
      final drawer = TRInternalDrawerDragScope.maybeOf(context);
      if (_atStart && details.delta.dy > 0 && drawer != null) {
        _draggingDrawer = true;
      } else if (_canScroll) {
        _scrollDrag = widget.controller.position.drag(
          _startDetails!,
          _disposeScrollDrag,
        );
      }
    }
    if (_draggingDrawer) {
      TRInternalDrawerDragScope.maybeOf(context)?.onDragUpdate(details);
    } else {
      _scrollDrag?.update(details);
    }
  }

  void _end(DragEndDetails details) {
    if (_draggingDrawer) {
      TRInternalDrawerDragScope.maybeOf(context)?.onDragEnd(details);
    } else {
      _scrollDrag?.end(details);
    }
    _reset();
  }

  void _cancel() {
    _scrollDrag?.cancel();
    _reset();
  }

  void _disposeScrollDrag() => _scrollDrag = null;

  void _reset() {
    _startDetails = null;
    _scrollDrag = null;
    _draggingDrawer = false;
  }

  void _handlePointerSignal(PointerSignalEvent event) {
    if (event is! PointerScrollEvent || !_canScroll) return;
    GestureBinding.instance.pointerSignalResolver.register(event, (signal) {
      final scroll = signal as PointerScrollEvent;
      widget.controller.position.pointerScroll(scroll.scrollDelta.dy);
    });
  }

  @override
  Widget build(BuildContext context) => Listener(
    onPointerSignal: _handlePointerSignal,
    child: GestureDetector(
      behavior: HitTestBehavior.translucent,
      onVerticalDragCancel: _cancel,
      onVerticalDragEnd: _end,
      onVerticalDragStart: _start,
      onVerticalDragUpdate: _update,
      child: ScrollConfiguration(
        behavior: ScrollConfiguration.of(
          context,
        ).copyWith(dragDevices: const <PointerDeviceKind>{}),
        child: widget.child,
      ),
    ),
  );
}
