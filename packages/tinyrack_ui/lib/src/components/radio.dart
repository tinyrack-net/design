import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../generated/tokens.g.dart';
import '../internal/form_registry.dart';
import '../theme.dart';
import '../tokens.dart';
import '../types.dart';

// @tinyrack-preview radio
/// A single option within a [TRRadioGroup].
class TRRadio extends StatefulWidget {
  const TRRadio({
    required this.value,
    this.disabled = false,
    this.readOnly = false,
    this.invalid = false,
    this.uiSize = TRUiSize.md,
    this.focusNode,
    this.autofocus = false,
    super.key,
  });

  final String value;
  final bool disabled;
  final bool readOnly;
  final bool invalid;
  final TRUiSize uiSize;
  final FocusNode? focusNode;
  final bool autofocus;

  @override
  State<TRRadio> createState() => _TRRadioState();
}

class _TRRadioState extends State<TRRadio> {
  FocusNode? _internalFocusNode;
  bool _hovered = false;
  bool _focused = false;
  bool _spaceDown = false;

  FocusNode get _focusNode =>
      widget.focusNode ?? (_internalFocusNode ??= FocusNode());

  /// Native radios activate Space on key release, not key press.
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

  @override
  Widget build(BuildContext context) {
    final colors = context.tinyrackTheme;
    final generated = Theme.of(context).brightness == Brightness.light
        ? TRGeneratedColors.light
        : TRGeneratedColors.dark;
    final scope = _TRRadioGroupScope.maybeOf(context);
    final checked = scope?.value == widget.value;
    final disabled = widget.disabled || (scope?.disabled ?? false);
    final readOnly = widget.readOnly || (scope?.readOnly ?? false);
    final interactive = !disabled && !readOnly;

    void select() {
      if (!interactive) return;
      scope?.onSelect(widget.value);
    }

    final showFocusRing =
        _focused &&
        FocusManager.instance.highlightMode == FocusHighlightMode.traditional;
    final borderColor = widget.invalid
        ? colors.dangerBorder
        : checked
        ? (_hovered && interactive ? generated.primaryHover : colors.primary)
        : generated.controlBorder;
    final background = checked || !interactive || !_hovered
        ? colors.surface
        : colors.surfaceHover;
    final size = switch (widget.uiSize) {
      TRUiSize.sm => TRGeneratedSpacing.md,
      TRUiSize.md => TRGeneratedSpacing.lg,
      TRUiSize.lg => TRGeneratedSpacing.xl,
    };
    final indicatorSize = switch (widget.uiSize) {
      TRUiSize.sm => TRGeneratedSpacing.xs,
      TRUiSize.md => TRGeneratedSpacing.sm,
      TRUiSize.lg => TRGeneratedSpacing.md,
    };
    final motionDuration = MediaQuery.disableAnimationsOf(context)
        ? Duration.zero
        : TRMotion.fast;

    return MouseRegion(
      cursor: interactive ? SystemMouseCursors.click : MouseCursor.defer,
      onEnter: (_) => setState(() => _hovered = true),
      onExit: (_) => setState(() => _hovered = false),
      child: Focus(
        autofocus: widget.autofocus,
        focusNode: _focusNode,
        onFocusChange: (focused) => setState(() => _focused = focused),
        onKeyEvent: interactive
            ? (node, event) => _handleSpace(event, select)
            : null,
        child: GestureDetector(
          behavior: HitTestBehavior.opaque,
          onTap: interactive ? select : null,
          child: Semantics(
            checked: checked,
            enabled: !disabled,
            inMutuallyExclusiveGroup: true,
            child: AnimatedOpacity(
              curve: TRMotion.standard,
              duration: motionDuration,
              opacity: disabled ? TRGeneratedOpacity.disabled : 1,
              child: CustomPaint(
                foregroundPainter: _TRRadioFocusRingPainter(
                  color: colors.focus,
                  visible: showFocusRing,
                ),
                child: AnimatedContainer(
                  curve: TRMotion.standard,
                  duration: motionDuration,
                  height: size,
                  width: size,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    border: Border.all(
                      color: borderColor,
                      width: TRGeneratedBorders.strongWidth,
                    ),
                    color: background,
                  ),
                  child: checked
                      ? Center(
                          child: Container(
                            height: indicatorSize,
                            width: indicatorSize,
                            decoration: BoxDecoration(
                              color: colors.primary,
                              shape: BoxShape.circle,
                            ),
                          ),
                        )
                      : null,
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class _TRRadioFocusRingPainter extends CustomPainter {
  const _TRRadioFocusRingPainter({required this.color, required this.visible});

  final Color color;
  final bool visible;

  @override
  void paint(Canvas canvas, Size size) {
    if (!visible) return;
    const width = TRGeneratedBorders.focusWidth;
    const offset = TRGeneratedBorders.focusOffset;
    final rect = (Offset.zero & size).inflate(offset + width / 2);
    canvas.drawOval(
      rect,
      Paint()
        ..color = color
        ..style = PaintingStyle.stroke
        ..strokeWidth = width,
    );
  }

  @override
  bool shouldRepaint(_TRRadioFocusRingPainter oldDelegate) =>
      color != oldDelegate.color || visible != oldDelegate.visible;
}

// @tinyrack-preview radio-group
/// Coordinates the mutually exclusive selection of [TRRadio] children.
class TRRadioGroup extends StatefulWidget {
  const TRRadioGroup({
    required this.children,
    this.value,
    this.defaultValue,
    this.onValueChange,
    this.disabled = false,
    this.name,
    this.readOnly = false,
    super.key,
  });

  final List<TRRadio> children;
  final String? value;
  final String? defaultValue;
  final ValueChanged<String>? onValueChange;
  final bool disabled;
  final String? name;
  final bool readOnly;

  @override
  State<TRRadioGroup> createState() => _TRRadioGroupState();
}

class _TRRadioGroupState extends State<TRRadioGroup> {
  late String? _uncontrolledValue = widget.defaultValue;

  void _select(String value) {
    if (widget.value == null) setState(() => _uncontrolledValue = value);
    widget.onValueChange?.call(value);
  }

  @override
  Widget build(BuildContext context) {
    final selected = widget.value ?? _uncontrolledValue;
    return TRFormRegistration(
      name: widget.name,
      value: () => selected,
      enabled: !widget.disabled,
      readOnly: widget.readOnly,
      child: Semantics(
        container: true,
        child: _TRRadioGroupScope(
          disabled: widget.disabled,
          onSelect: _select,
          readOnly: widget.readOnly,
          value: selected,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisSize: MainAxisSize.min,
            spacing: TRGeneratedSpacing.sm,
            children: widget.children,
          ),
        ),
      ),
    );
  }
}

class _TRRadioGroupScope extends InheritedWidget {
  const _TRRadioGroupScope({
    required this.disabled,
    required this.onSelect,
    required this.readOnly,
    required this.value,
    required super.child,
  });

  final bool disabled;
  final ValueChanged<String> onSelect;
  final bool readOnly;
  final String? value;

  static _TRRadioGroupScope? maybeOf(BuildContext context) =>
      context.dependOnInheritedWidgetOfExactType<_TRRadioGroupScope>();

  @override
  bool updateShouldNotify(_TRRadioGroupScope oldWidget) =>
      disabled != oldWidget.disabled ||
      onSelect != oldWidget.onSelect ||
      readOnly != oldWidget.readOnly ||
      value != oldWidget.value;
}
