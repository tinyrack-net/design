import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../../ui_density.dart';
import '../../generated/tokens.g.dart';
import '../../internal/focus_source.dart';
import '../../internal/form_registry.dart';
import '../../theme.dart';
import '../../tokens.dart';
import '../../types.dart';

// @tinyrack-preview checkbox
/// A tri-state Tinyrack selection control.
class TRCheckbox extends StatefulWidget {
  const TRCheckbox({
    this.checked,
    this.defaultChecked = false,
    this.indeterminate = false,
    this.onCheckedChange,
    this.disabled = false,
    this.readOnly = false,
    this.invalid = false,
    this.uiSize,
    this.focusNode,
    this.autofocus = false,
    this.semanticLabel,
    this.value,
    super.key,
  });

  final bool? checked;
  final bool defaultChecked;
  final bool indeterminate;
  final ValueChanged<bool>? onCheckedChange;
  final bool disabled;
  final bool readOnly;
  final bool invalid;

  /// Overrides the size supplied by [TRUiDensityScope].
  final TRUiSize? uiSize;
  final FocusNode? focusNode;
  final bool autofocus;
  final String? semanticLabel;

  /// Identifies this checkbox when nested inside a [TRCheckboxGroup].
  final String? value;

  @override
  State<TRCheckbox> createState() => _TRCheckboxState();
}

class _TRCheckboxState extends State<TRCheckbox> with TRFocusSourceMixin {
  late bool _uncontrolledChecked = widget.defaultChecked;
  FocusNode? _internalFocusNode;
  bool _focused = false;
  bool _spaceDown = false;

  FocusNode get _focusNode =>
      widget.focusNode ?? (_internalFocusNode ??= FocusNode());

  /// Native checkboxes activate Space on key release, not key press.
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
    final uiSize = TRUiDensityScope.resolveSize(context, widget.uiSize);
    final colors = context.tinyrackTheme;
    final scope = _TRCheckboxGroupScope.maybeOf(context);
    final grouped = widget.value != null && scope != null;
    final checked = grouped
        ? scope.selected.contains(widget.value)
        : widget.checked ?? _uncontrolledChecked;
    final disabled = widget.disabled || (grouped && scope.disabled);
    final interactive = !disabled && !widget.readOnly;

    void toggle() {
      if (!interactive) return;
      if (grouped) {
        scope.onToggle(widget.value!);
        return;
      }
      final next = !checked;
      if (widget.checked == null) setState(() => _uncontrolledChecked = next);
      widget.onCheckedChange?.call(next);
    }

    final showFocusRing = focusVisible(hasFocus: _focused);
    final filled = checked || widget.indeterminate;
    final generated = Theme.of(context).brightness == Brightness.light
        ? TRGeneratedColors.light
        : TRGeneratedColors.dark;
    final borderColor = widget.invalid
        ? colors.dangerBorder
        : filled
        ? colors.primary
        : generated.controlBorder;
    final size = switch (uiSize) {
      TRUiSize.sm => TRGeneratedSpacing.sm,
      TRUiSize.md => TRGeneratedSpacing.md,
      TRUiSize.lg => TRGeneratedSpacing.lg,
      TRUiSize.xl => TRGeneratedControlMetrics.xlIconSize,
    };
    final indicatorFontSize = switch (uiSize) {
      TRUiSize.sm =>
        TRGeneratedTypographySizes.size2xs - TRGeneratedSpacing.size3xs * 4,
      TRUiSize.md =>
        TRGeneratedTypographySizes.size2xs - TRGeneratedSpacing.size3xs,
      TRUiSize.lg => TRGeneratedTypographySizes.xs,
      TRUiSize.xl => TRGeneratedTypographySizes.sm,
    };
    final motionDuration = MediaQuery.disableAnimationsOf(context)
        ? Duration.zero
        : TRMotion.fast;

    return Focus(
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
          checked: checked,
          enabled: !disabled,
          label: widget.semanticLabel,
          mixed: widget.indeterminate,
          child: MouseRegion(
            cursor: interactive ? SystemMouseCursors.click : MouseCursor.defer,
            child: AnimatedOpacity(
              curve: TRMotion.standard,
              duration: motionDuration,
              opacity: disabled ? TRGeneratedOpacity.disabled : 1,
              child: CustomPaint(
                foregroundPainter: _TRCheckboxFocusRingPainter(
                  color: colors.focus,
                  visible: showFocusRing,
                ),
                child: AnimatedContainer(
                  curve: TRMotion.standard,
                  duration: motionDuration,
                  height: size,
                  width: size,
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(TRGeneratedRadii.sm),
                    border: Border.all(
                      color: borderColor,
                      width: TRGeneratedBorders.strongWidth,
                    ),
                    color: filled ? colors.primary : colors.surface,
                  ),
                  child: filled
                      ? Center(
                          child: Text(
                            widget.indeterminate ? '−' : '✓',
                            style: TextStyle(
                              color: colors.onPrimary,
                              fontFamily: TRGeneratedFontFamilies.body,
                              fontSize: indicatorFontSize,
                              fontWeight: TRGeneratedFontWeights.bold,
                              height: TRGeneratedTypographyLineHeights.xs,
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

/// A [Form] participant backed by the controlled [TRCheckbox] contract.
class TRCheckboxFormField extends FormField<bool> {
  TRCheckboxFormField({
    super.initialValue = false,
    super.autovalidateMode,
    super.enabled = true,
    bool readOnly = false,
    bool indeterminate = false,
    String? name,
    Object? checkedValue = true,
    Object? uncheckedValue = false,
    ValueChanged<bool>? onCheckedChange,
    super.onSaved,
    super.onReset,
    super.validator,
    super.restorationId,
    TRUiSize? uiSize,
    FocusNode? focusNode,
    bool autofocus = false,
    String? semanticLabel,
    super.key,
  }) : super(
         builder: (field) => TRFormRegistration(
           name: name,
           value: () => field.value == true ? checkedValue : uncheckedValue,
           enabled: enabled,
           readOnly: readOnly,
           child: TRCheckbox(
             checked: field.value ?? initialValue,
             indeterminate: indeterminate,
             onCheckedChange: (checked) {
               field.didChange(checked);
               onCheckedChange?.call(checked);
             },
             disabled: !enabled,
             readOnly: readOnly,
             invalid: field.hasError,
             uiSize: uiSize,
             focusNode: focusNode,
             autofocus: autofocus,
             semanticLabel: semanticLabel,
           ),
         ),
       );
}

class _TRCheckboxFocusRingPainter extends CustomPainter {
  const _TRCheckboxFocusRingPainter({
    required this.color,
    required this.visible,
  });

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
          TRGeneratedRadii.sm + TRGeneratedBorders.focusOffset + width / 2,
        ),
      ),
      Paint()
        ..color = color
        ..style = PaintingStyle.stroke
        ..strokeWidth = width,
    );
  }

  @override
  bool shouldRepaint(_TRCheckboxFocusRingPainter oldDelegate) =>
      color != oldDelegate.color || visible != oldDelegate.visible;
}

// @tinyrack-preview checkbox-group
/// Coordinates the checked values of a set of [TRCheckbox] children.
class TRCheckboxGroup extends StatefulWidget {
  const TRCheckboxGroup({
    required this.children,
    this.value,
    this.defaultValue = const [],
    this.onValueChange,
    this.disabled = false,
    this.name,
    super.key,
  });

  final List<Widget> children;
  final List<String>? value;
  final List<String> defaultValue;
  final ValueChanged<List<String>>? onValueChange;
  final bool disabled;
  final String? name;

  @override
  State<TRCheckboxGroup> createState() => _TRCheckboxGroupState();
}

class _TRCheckboxGroupState extends State<TRCheckboxGroup> {
  late Set<String> _uncontrolledValue = widget.defaultValue.toSet();

  void _toggleValue(String value) {
    final current = widget.value?.toSet() ?? _uncontrolledValue;
    final next = <String>{...current};
    if (!next.add(value)) next.remove(value);
    if (widget.value == null) setState(() => _uncontrolledValue = next);
    widget.onValueChange?.call(next.toList(growable: false));
  }

  @override
  Widget build(BuildContext context) {
    final selected = widget.value?.toSet() ?? _uncontrolledValue;
    return TRFormRegistration(
      name: widget.name,
      value: () => selected.toList(growable: false),
      enabled: !widget.disabled,
      child: Semantics(
        container: true,
        child: _TRCheckboxGroupScope(
          disabled: widget.disabled,
          onToggle: _toggleValue,
          selected: selected,
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

class _TRCheckboxGroupScope extends InheritedWidget {
  const _TRCheckboxGroupScope({
    required this.disabled,
    required this.onToggle,
    required this.selected,
    required super.child,
  });

  final bool disabled;
  final ValueChanged<String> onToggle;
  final Set<String> selected;

  static _TRCheckboxGroupScope? maybeOf(BuildContext context) =>
      context.dependOnInheritedWidgetOfExactType<_TRCheckboxGroupScope>();

  @override
  bool updateShouldNotify(_TRCheckboxGroupScope oldWidget) =>
      disabled != oldWidget.disabled ||
      onToggle != oldWidget.onToggle ||
      !setEquals(selected, oldWidget.selected);
}
