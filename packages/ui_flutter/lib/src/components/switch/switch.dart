import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../../generated/tokens.g.dart';
import '../../theme.dart';
import '../../tokens.dart';

// @tinyrack-preview switch
/// A binary on/off Tinyrack control.
class TRSwitch extends StatefulWidget {
  const TRSwitch({
    this.checked,
    this.defaultChecked = false,
    this.onCheckedChange,
    this.disabled = false,
    this.readOnly = false,
    this.invalid = false,
    this.focusNode,
    this.autofocus = false,
    super.key,
  });

  final bool? checked;
  final bool defaultChecked;
  final ValueChanged<bool>? onCheckedChange;
  final bool disabled;
  final bool readOnly;
  final bool invalid;
  final FocusNode? focusNode;
  final bool autofocus;

  @override
  State<TRSwitch> createState() => _TRSwitchState();
}

class _TRSwitchState extends State<TRSwitch> {
  late bool _uncontrolledChecked = widget.defaultChecked;
  FocusNode? _internalFocusNode;
  bool _hovered = false;
  bool _focused = false;
  bool _spaceDown = false;

  FocusNode get _focusNode =>
      widget.focusNode ?? (_internalFocusNode ??= FocusNode());

  /// Native switches activate Space on key release, not key press.
  KeyEventResult _handleSpace(KeyEvent event, VoidCallback activate) {
    if (event.logicalKey != LogicalKeyboardKey.space) {
      return KeyEventResult.ignored;
    }
    if (event is KeyDownEvent) {
      _spaceDown = true;
    } else if (event is KeyUpEvent && _spaceDown) {
      _spaceDown = false;
      activate();
    }
    return KeyEventResult.handled;
  }

  @override
  void dispose() {
    _internalFocusNode?.dispose();
    super.dispose();
  }

  static const _width = TRGeneratedSpacing.size2xl + TRGeneratedSpacing.sm;
  static const _height = TRGeneratedSpacing.xl;
  static const _padding = TRGeneratedSpacing.xs;
  static const _thumbSize = TRGeneratedSpacing.lg;

  @override
  Widget build(BuildContext context) {
    final colors = context.tinyrackTheme;
    final generated = Theme.of(context).brightness == Brightness.light
        ? TRGeneratedColors.light
        : TRGeneratedColors.dark;
    final checked = widget.checked ?? _uncontrolledChecked;
    final disabled = widget.disabled;
    final interactive = !disabled && !widget.readOnly;

    void toggle() {
      if (!interactive) return;
      final next = !checked;
      if (widget.checked == null) setState(() => _uncontrolledChecked = next);
      widget.onCheckedChange?.call(next);
    }

    final showFocusRing =
        _focused &&
        FocusManager.instance.highlightMode == FocusHighlightMode.traditional;
    final background = disabled
        ? (checked ? generated.surfaceSelected : colors.surfaceMuted)
        : checked
        ? (_hovered ? generated.primaryHover : colors.primary)
        : (_hovered ? colors.surfaceHover : colors.surfaceMuted);
    final borderColor = widget.invalid
        ? colors.dangerBorder
        : disabled
        ? (checked ? colors.primary : colors.borderStrong)
        : checked
        ? (_hovered ? generated.primaryHover : colors.primary)
        : generated.controlBorder;
    final thumbColor = checked
        ? (disabled ? colors.primary : colors.onPrimary)
        : colors.text;
    final disableAnimations = MediaQuery.disableAnimationsOf(context);
    final motionDuration = disableAnimations ? Duration.zero : TRMotion.fast;
    final travelDuration = disableAnimations ? Duration.zero : TRMotion.normal;

    return MouseRegion(
      cursor: interactive ? SystemMouseCursors.click : MouseCursor.defer,
      onEnter: (_) => setState(() => _hovered = true),
      onExit: (_) => setState(() => _hovered = false),
      child: Focus(
        autofocus: widget.autofocus,
        focusNode: _focusNode,
        onFocusChange: (focused) => setState(() => _focused = focused),
        onKeyEvent: interactive
            ? (node, event) => _handleSpace(event, toggle)
            : null,
        child: GestureDetector(
          behavior: HitTestBehavior.opaque,
          onTap: interactive ? toggle : null,
          child: Semantics(
            enabled: !disabled,
            toggled: checked,
            child: CustomPaint(
              foregroundPainter: _TRSwitchFocusRingPainter(
                color: colors.focus,
                visible: showFocusRing,
              ),
              child: AnimatedContainer(
                curve: TRMotion.standard,
                duration: motionDuration,
                width: _width,
                height: _height,
                padding: const EdgeInsets.all(_padding),
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(TRGeneratedRadii.full),
                  border: Border.all(
                    color: borderColor,
                    width: TRGeneratedBorders.defaultWidth,
                  ),
                  color: background,
                ),
                child: AnimatedAlign(
                  curve: TRMotion.easeOut,
                  duration: travelDuration,
                  alignment: checked
                      ? Alignment.centerRight
                      : Alignment.centerLeft,
                  child: AnimatedOpacity(
                    curve: TRMotion.standard,
                    duration: motionDuration,
                    opacity: disabled && !checked
                        ? TRGeneratedOpacity.disabled
                        : 1,
                    child: DecoratedBox(
                      decoration: BoxDecoration(
                        color: thumbColor,
                        shape: BoxShape.circle,
                        boxShadow: const [TRGeneratedShadows.raised],
                      ),
                      child: const SizedBox.square(dimension: _thumbSize),
                    ),
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class _TRSwitchFocusRingPainter extends CustomPainter {
  const _TRSwitchFocusRingPainter({required this.color, required this.visible});

  final Color color;
  final bool visible;

  @override
  void paint(Canvas canvas, Size size) {
    if (!visible) return;
    const width = TRGeneratedBorders.focusWidth;
    const offset = TRGeneratedBorders.focusOffset;
    final rect = (Offset.zero & size).inflate(offset + width / 2);
    canvas.drawRRect(
      RRect.fromRectAndRadius(
        rect,
        Radius.circular(rect.shortestSide / 2 + TRGeneratedBorders.focusOffset),
      ),
      Paint()
        ..color = color
        ..style = PaintingStyle.stroke
        ..strokeWidth = width,
    );
  }

  @override
  bool shouldRepaint(_TRSwitchFocusRingPainter oldDelegate) =>
      color != oldDelegate.color || visible != oldDelegate.visible;
}
