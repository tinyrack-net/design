import 'package:flutter/gestures.dart';
import 'package:material_ui/material_ui.dart';

/// Internal bridge between a drawer and a fixed-header scrolling region.
class TRInternalDrawerDragScope extends InheritedWidget {
  const TRInternalDrawerDragScope({
    required this.onDragEnd,
    required this.onDragUpdate,
    required this.shouldDragBeforeScroll,
    required super.child,
    super.key,
  });

  final GestureDragEndCallback onDragEnd;

  /// Applies [primaryDelta] to the drawer and returns the unused delta.
  final double Function(double primaryDelta) onDragUpdate;

  /// Whether the drawer should consume this delta before the scroll position.
  final bool Function(double primaryDelta) shouldDragBeforeScroll;

  static TRInternalDrawerDragScope? maybeOf(BuildContext context) =>
      context.dependOnInheritedWidgetOfExactType<TRInternalDrawerDragScope>();

  @override
  bool updateShouldNotify(TRInternalDrawerDragScope oldWidget) =>
      onDragEnd != oldWidget.onDragEnd ||
      onDragUpdate != oldWidget.onDragUpdate ||
      shouldDragBeforeScroll != oldWidget.shouldDragBeforeScroll;
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
  bool _drawerChanged = false;
  bool _lastChangedDrawer = false;

  bool get _canScroll => widget.controller.hasClients;

  void _start(DragStartDetails details) {
    _drawerChanged = false;
    _lastChangedDrawer = false;
  }

  void _update(DragUpdateDetails details) {
    final drawer = TRInternalDrawerDragScope.maybeOf(context);
    var remaining = details.delta.dy;
    if (drawer != null && drawer.shouldDragBeforeScroll(remaining)) {
      remaining = _consumeDrawer(drawer, remaining);
    }
    remaining = _consumeScroll(remaining);
    if (drawer != null && remaining != 0) {
      _consumeDrawer(drawer, remaining);
    }
  }

  void _end(DragEndDetails details) {
    final drawer = TRInternalDrawerDragScope.maybeOf(context);
    if (_drawerChanged && drawer != null) {
      drawer.onDragEnd(
        _lastChangedDrawer
            ? details
            : DragEndDetails(velocity: Velocity.zero, primaryVelocity: 0),
      );
    }
    if (!_lastChangedDrawer && _canScroll) {
      final position = widget.controller.position;
      if (position is ScrollPositionWithSingleContext) {
        position.goBallistic(-details.velocity.pixelsPerSecond.dy);
      }
    }
    _reset();
  }

  void _cancel() {
    final drawer = TRInternalDrawerDragScope.maybeOf(context);
    if (_drawerChanged && drawer != null) {
      drawer.onDragEnd(
        DragEndDetails(velocity: Velocity.zero, primaryVelocity: 0),
      );
    }
    _reset();
  }

  double _consumeDrawer(TRInternalDrawerDragScope drawer, double primaryDelta) {
    final remaining = drawer.onDragUpdate(primaryDelta);
    if (remaining != primaryDelta) {
      _drawerChanged = true;
      _lastChangedDrawer = true;
    }
    return remaining;
  }

  double _consumeScroll(double primaryDelta) {
    if (!_canScroll || primaryDelta == 0) return primaryDelta;
    final position = widget.controller.position;
    final current = position.pixels;
    final target = (current - primaryDelta).clamp(
      position.minScrollExtent,
      position.maxScrollExtent,
    );
    if (target == current) return primaryDelta;
    position.jumpTo(target);
    _lastChangedDrawer = false;
    final consumed = current - target;
    return primaryDelta - consumed;
  }

  void _reset() {
    _drawerChanged = false;
    _lastChangedDrawer = false;
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
