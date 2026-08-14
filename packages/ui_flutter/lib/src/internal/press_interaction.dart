import 'package:flutter/gestures.dart';
import 'package:material_ui/material_ui.dart';

import '../generated/tokens.g.dart';

/// Tracks the touch-like pointer that owns an immediate pressed visual.
final class TRTouchPressCoordinator {
  int? _pointer;

  bool begin(PointerDownEvent event) {
    if (_pointer != null ||
        !_isTouchLike(event.kind) ||
        event.buttons & kPrimaryButton == 0) {
      return false;
    }
    _pointer = event.pointer;
    return true;
  }

  bool end(PointerEvent event) {
    if (_pointer != event.pointer) return false;
    _pointer = null;
    return true;
  }

  void cancel() => _pointer = null;
}

/// Shares immediate touch state with controls that keep their own gesture,
/// focus, semantics, and visual composition.
mixin TRTouchPressStateMixin<T extends StatefulWidget> on State<T> {
  final _touchPress = TRTouchPressCoordinator();
  bool touchPressed = false;

  void beginTouchPress(PointerDownEvent event) {
    if (_touchPress.begin(event)) {
      setState(() => touchPressed = true);
    }
  }

  void endTouchPress(PointerEvent event) {
    if (_touchPress.end(event) && touchPressed) {
      setState(() => touchPressed = false);
    }
  }

  void cancelTouchPress() {
    _touchPress.cancel();
    if (touchPressed) setState(() => touchPressed = false);
  }
}

bool _isTouchLike(PointerDeviceKind kind) =>
    kind == PointerDeviceKind.touch ||
    kind == PointerDeviceKind.stylus ||
    kind == PointerDeviceKind.invertedStylus;

Duration trPressedMotionDuration(
  BuildContext context, {
  required bool pressed,
}) => MediaQuery.disableAnimationsOf(context)
    ? Duration.zero
    : pressed
    ? TRGeneratedMotion.immediate
    : TRGeneratedMotion.fast;

Curve trPressedMotionCurve({required bool pressed}) =>
    pressed ? TRGeneratedMotion.easeOut : TRGeneratedMotion.standard;

typedef TRMaterialPressableBuilder =
    Widget Function(BuildContext context, WidgetStatesController states);

/// Gives a Material button an immediate touch state without replacing its
/// gesture recognizer, focus behavior, keyboard handling, or semantics.
final class TRMaterialPressable extends StatefulWidget {
  const TRMaterialPressable({
    required this.builder,
    required this.enabled,
    super.key,
  });

  final TRMaterialPressableBuilder builder;
  final bool enabled;

  @override
  State<TRMaterialPressable> createState() => _TRMaterialPressableState();
}

final class _TRMaterialPressableState extends State<TRMaterialPressable> {
  final _states = WidgetStatesController();
  final _touchPress = TRTouchPressCoordinator();

  @override
  void didUpdateWidget(TRMaterialPressable oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.enabled && !widget.enabled) {
      _touchPress.cancel();
      _states.update(WidgetState.pressed, false);
    }
  }

  @override
  void dispose() {
    _states.dispose();
    super.dispose();
  }

  void _handlePointerDown(PointerDownEvent event) {
    if (_touchPress.begin(event)) {
      _states.update(WidgetState.pressed, true);
    }
  }

  void _handlePointerEnd(PointerEvent event) {
    if (_touchPress.end(event)) {
      _states.update(WidgetState.pressed, false);
    }
  }

  @override
  Widget build(BuildContext context) => Listener(
    onPointerCancel: widget.enabled ? _handlePointerEnd : null,
    onPointerDown: widget.enabled ? _handlePointerDown : null,
    onPointerUp: widget.enabled ? _handlePointerEnd : null,
    child: widget.builder(context, _states),
  );
}

/// Animates a Material button's full state-layer fill with Tinyrack's
/// asymmetric press timing.
Widget trAnimatedPressBackground(
  BuildContext context,
  Set<WidgetState> states,
  Widget? child, {
  required Color color,
  BorderRadiusGeometry? borderRadius,
}) {
  final pressed = states.contains(WidgetState.pressed);
  return AnimatedContainer(
    curve: trPressedMotionCurve(pressed: pressed),
    duration: trPressedMotionDuration(context, pressed: pressed),
    decoration: BoxDecoration(color: color, borderRadius: borderRadius),
    child: child,
  );
}
