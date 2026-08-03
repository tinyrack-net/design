import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../../generated/tokens.g.dart';
import '../../theme.dart';
import '../../tokens.dart';
import '../../types.dart';

// @tinyrack-preview toggle
/// A two-state pressable Tinyrack control.
class TRToggle extends StatefulWidget {
  const TRToggle({
    required this.child,
    this.pressed,
    this.defaultPressed = false,
    this.onPressedChange,
    this.disabled = false,
    this.uiSize = TRUiSize.md,
    this.focusNode,
    this.autofocus = false,
    this.value,
    super.key,
  });

  final Widget child;
  final bool? pressed;
  final bool defaultPressed;
  final ValueChanged<bool>? onPressedChange;
  final bool disabled;
  final TRUiSize uiSize;
  final FocusNode? focusNode;
  final bool autofocus;

  /// Identifies this toggle when nested inside a [TRToggleGroup].
  final String? value;

  @override
  State<TRToggle> createState() => _TRToggleState();
}

class _TRToggleState extends State<TRToggle> {
  late bool _uncontrolledPressed = widget.defaultPressed;
  FocusNode? _internalFocusNode;
  bool _hovered = false;
  bool _focused = false;
  bool _spaceDown = false;

  FocusNode get _focusNode =>
      widget.focusNode ?? (_internalFocusNode ??= FocusNode());

  /// Native buttons activate Space on key release, not key press.
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
    final scope = _TRToggleGroupScope.maybeOf(context);
    final grouped = widget.value != null && scope != null;
    final pressed = grouped
        ? scope.selected.contains(widget.value)
        : widget.pressed ?? _uncontrolledPressed;
    final disabled = widget.disabled || (grouped && scope.disabled);

    void toggle() {
      if (disabled) return;
      if (grouped) {
        scope.onToggle(widget.value!);
        return;
      }
      final next = !pressed;
      if (widget.pressed == null) setState(() => _uncontrolledPressed = next);
      widget.onPressedChange?.call(next);
    }

    final showFocusRing =
        _focused &&
        FocusManager.instance.highlightMode == FocusHighlightMode.traditional;
    // The web hover rule outranks the pressed rule by selector specificity,
    // so a hovered toggle shows the hover fill even while pressed.
    final background = _hovered && !disabled
        ? colors.surfaceHover
        : pressed
        ? generated.surfaceSelected
        : colors.surface;
    final borderColor = pressed ? colors.primary : generated.controlBorder;
    final height = switch (widget.uiSize) {
      TRUiSize.sm => TRGeneratedControlMetrics.smHeight,
      TRUiSize.md => TRGeneratedControlMetrics.mdHeight,
      TRUiSize.lg => TRGeneratedControlMetrics.lgHeight,
    };
    final paddingInline = switch (widget.uiSize) {
      TRUiSize.sm => TRGeneratedControlMetrics.smPaddingInline,
      TRUiSize.md => TRGeneratedControlMetrics.mdPaddingInline,
      TRUiSize.lg => TRGeneratedControlMetrics.lgPaddingInline,
    };
    final fontSize = switch (widget.uiSize) {
      TRUiSize.sm => TRGeneratedControlMetrics.smFontSize,
      TRUiSize.md => TRGeneratedControlMetrics.mdFontSize,
      TRUiSize.lg => TRGeneratedControlMetrics.lgFontSize,
    };
    final lineHeight = switch (widget.uiSize) {
      TRUiSize.sm => TRGeneratedControlMetrics.smLineHeight,
      TRUiSize.md => TRGeneratedControlMetrics.mdLineHeight,
      TRUiSize.lg => TRGeneratedControlMetrics.lgLineHeight,
    };
    final motionDuration = MediaQuery.disableAnimationsOf(context)
        ? Duration.zero
        : TRMotion.fast;
    final childText = widget.child is Text ? (widget.child as Text).data : null;
    final usesCjkFallback =
        childText != null &&
        RegExp(
          r'[\u3040-\u30ff\u3400-\u9fff\uac00-\ud7af]',
        ).hasMatch(childText);
    final japanese = Localizations.localeOf(context).languageCode == 'ja';
    final english = Localizations.localeOf(context).languageCode == 'en';

    return CallbackShortcuts(
      bindings: disabled
          ? const {}
          : {const SingleActivator(LogicalKeyboardKey.enter): toggle},
      child: MouseRegion(
        cursor: disabled ? MouseCursor.defer : SystemMouseCursors.click,
        onEnter: (_) => setState(() => _hovered = true),
        onExit: (_) => setState(() => _hovered = false),
        child: Focus(
          autofocus: widget.autofocus,
          focusNode: _focusNode,
          onFocusChange: (focused) => setState(() => _focused = focused),
          onKeyEvent: disabled
              ? null
              : (node, event) => _handleSpace(event, toggle),
          child: GestureDetector(
            behavior: HitTestBehavior.opaque,
            onTap: disabled ? null : toggle,
            child: Semantics(
              button: true,
              enabled: !disabled,
              toggled: pressed,
              child: AnimatedOpacity(
                curve: TRMotion.standard,
                duration: motionDuration,
                opacity: disabled ? TRGeneratedOpacity.disabled : 1,
                child: CustomPaint(
                  foregroundPainter: _TRToggleFocusRingPainter(
                    color: colors.focus,
                    visible: showFocusRing,
                  ),
                  child: AnimatedContainer(
                    curve: TRMotion.standard,
                    duration: motionDuration,
                    constraints: BoxConstraints(minHeight: height),
                    padding: EdgeInsets.symmetric(horizontal: paddingInline),
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(TRGeneratedRadii.md),
                      border: Border.all(
                        color: borderColor,
                        width: TRGeneratedBorders.defaultWidth,
                      ),
                      color: background,
                    ),
                    child: Center(
                      widthFactor: 1,
                      child: DefaultTextStyle.merge(
                        style: TextStyle(
                          color: colors.text,
                          fontFamily: TRGeneratedFontFamilies.body,
                          fontSize: fontSize,
                          fontWeight: TRGeneratedFontWeights.medium,
                          height: lineHeight / fontSize,
                          letterSpacing: usesCjkFallback && !japanese
                              ? -TRGeneratedBorders.defaultWidth /
                                    (TRGeneratedSpacing.size3xs +
                                        TRGeneratedBorders.defaultWidth)
                              : english
                              ? -TRGeneratedBorders.defaultWidth /
                                    TRGeneratedSpacing.xl
                              : null,
                        ),
                        child: widget.child,
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

class _TRToggleFocusRingPainter extends CustomPainter {
  const _TRToggleFocusRingPainter({required this.color, required this.visible});

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
        const Radius.circular(
          TRGeneratedRadii.md + TRGeneratedBorders.focusOffset + width / 2,
        ),
      ),
      Paint()
        ..color = color
        ..style = PaintingStyle.stroke
        ..strokeWidth = width,
    );
  }

  @override
  bool shouldRepaint(_TRToggleFocusRingPainter oldDelegate) =>
      color != oldDelegate.color || visible != oldDelegate.visible;
}

// @tinyrack-preview toggle-group
/// Coordinates the pressed state of a set of [TRToggle] children by value.
class TRToggleGroup extends StatefulWidget {
  const TRToggleGroup({
    required this.children,
    this.value,
    this.defaultValue = const [],
    this.multiple = false,
    this.onValueChange,
    this.disabled = false,
    this.orientation = Axis.horizontal,
    super.key,
  });

  final List<TRToggle> children;
  final List<String>? value;
  final List<String> defaultValue;
  final bool multiple;
  final ValueChanged<List<String>>? onValueChange;
  final bool disabled;
  final Axis orientation;

  @override
  State<TRToggleGroup> createState() => _TRToggleGroupState();
}

class _TRToggleGroupState extends State<TRToggleGroup> {
  late Set<String> _uncontrolledValue = widget.defaultValue.toSet();

  void _toggleValue(String value) {
    final current = widget.value?.toSet() ?? _uncontrolledValue;
    final next = <String>{...current};
    if (widget.multiple) {
      if (!next.add(value)) next.remove(value);
    } else {
      next
        ..clear()
        ..addAll(current.contains(value) ? const <String>{} : {value});
    }
    if (widget.value == null) setState(() => _uncontrolledValue = next);
    widget.onValueChange?.call(next.toList(growable: false));
  }

  @override
  Widget build(BuildContext context) {
    final selected = widget.value?.toSet() ?? _uncontrolledValue;
    return Semantics(
      container: true,
      child: _TRToggleGroupScope(
        disabled: widget.disabled,
        onToggle: _toggleValue,
        selected: selected,
        child: Flex(
          direction: widget.orientation,
          mainAxisSize: MainAxisSize.min,
          spacing: TRGeneratedSpacing.xs,
          children: widget.children,
        ),
      ),
    );
  }
}

class _TRToggleGroupScope extends InheritedWidget {
  const _TRToggleGroupScope({
    required this.disabled,
    required this.onToggle,
    required this.selected,
    required super.child,
  });

  final bool disabled;
  final ValueChanged<String> onToggle;
  final Set<String> selected;

  static _TRToggleGroupScope? maybeOf(BuildContext context) =>
      context.dependOnInheritedWidgetOfExactType<_TRToggleGroupScope>();

  @override
  bool updateShouldNotify(_TRToggleGroupScope oldWidget) =>
      disabled != oldWidget.disabled ||
      onToggle != oldWidget.onToggle ||
      !setEquals(selected, oldWidget.selected);
}
