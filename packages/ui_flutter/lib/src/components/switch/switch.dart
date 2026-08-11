import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../../internal/focus_source.dart';

import '../../control_density.dart';
import '../../generated/tokens.g.dart';
import '../../theme.dart';
import '../../tokens.dart';
import '../../types.dart';

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
    this.semanticLabel,
    this.thumbKey,
    this.uiSize,
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

  /// Names the switch for assistive technology when no visible label is
  /// associated with it.
  final String? semanticLabel;

  /// Identifies the visual thumb for geometry measurement and composition.
  final Key? thumbKey;

  /// Overrides the size supplied by [TRControlDensityScope].
  final TRUiSize? uiSize;

  @override
  State<TRSwitch> createState() => _TRSwitchState();
}

class _TRSwitchState extends State<TRSwitch> with TRFocusSourceMixin {
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
  void initState() {
    super.initState();
    initFocusSource();
  }

  @override
  void dispose() {
    disposeFocusSource();
    _internalFocusNode?.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final uiSize = TRControlDensityScope.resolve(context, widget.uiSize);
    final width = switch (uiSize) {
      TRUiSize.sm => TRGeneratedSpacing.size2xl,
      TRUiSize.md => TRGeneratedSpacing.size2xl + TRGeneratedSpacing.sm,
      TRUiSize.lg => TRGeneratedSpacing.size3xl,
    };
    final height = switch (uiSize) {
      TRUiSize.sm => TRGeneratedSpacing.lg + TRGeneratedSpacing.xs,
      TRUiSize.md => TRGeneratedSpacing.xl,
      TRUiSize.lg => TRGeneratedSpacing.size2xl,
    };
    final padding = switch (uiSize) {
      TRUiSize.sm => TRGeneratedSpacing.size3xs * 2,
      TRUiSize.md || TRUiSize.lg => TRGeneratedSpacing.xs,
    };
    final thumbSize = switch (uiSize) {
      TRUiSize.sm => TRGeneratedControlMetrics.smIconSize,
      TRUiSize.md => TRGeneratedSpacing.lg,
      TRUiSize.lg => TRGeneratedSpacing.xl,
    };
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

    final showFocusRing = focusVisible(hasFocus: _focused);
    // Only an interactive switch answers the pointer, so a disabled or
    // read-only one keeps its resting colors while the cursor is over it.
    final hovered = _hovered && interactive;
    final background = checked
        ? (hovered ? generated.primaryHover : colors.primary)
        : (hovered ? colors.surfaceHover : colors.surfaceMuted);
    final borderColor = widget.invalid
        ? colors.dangerBorder
        : checked
        ? (hovered ? generated.primaryHover : colors.primary)
        : generated.controlBorder;
    final thumbColor = checked ? colors.onPrimary : colors.text;
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
            label: widget.semanticLabel,
            toggled: checked,
            // Fading the whole control keeps on and off reading as the same
            // switch the user just lost access to, and matches the checkbox.
            child: AnimatedOpacity(
              curve: TRMotion.standard,
              duration: motionDuration,
              opacity: disabled ? TRGeneratedOpacity.disabled : 1,
              child: CustomPaint(
                foregroundPainter: _TRSwitchFocusRingPainter(
                  color: colors.focus,
                  visible: showFocusRing,
                ),
                child: AnimatedContainer(
                  curve: TRMotion.standard,
                  duration: motionDuration,
                  width: width,
                  height: height,
                  padding: EdgeInsets.all(padding),
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
                    child: SizedBox(
                      width: thumbSize,
                      height:
                          height -
                          (padding * 2) -
                          (TRGeneratedBorders.defaultWidth * 2),
                      child: OverflowBox(
                        minWidth: thumbSize,
                        maxWidth: thumbSize,
                        minHeight: thumbSize,
                        maxHeight: thumbSize,
                        child: AnimatedContainer(
                          key: widget.thumbKey,
                          curve: TRMotion.standard,
                          duration: motionDuration,
                          decoration: BoxDecoration(
                            color: thumbColor,
                            shape: BoxShape.circle,
                            boxShadow: const [TRGeneratedShadows.raised],
                          ),
                          width: thumbSize,
                          height: thumbSize,
                        ),
                      ),
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
