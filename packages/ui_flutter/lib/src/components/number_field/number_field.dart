import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:intl/intl.dart';

import '../../generated/tokens.g.dart';
import '../../theme.dart';
import '../../types.dart';
import '../text_field/text_field.dart';

/// Owns the nullable numeric value of a [TRNumberField].
class TRNumberFieldController extends ChangeNotifier {
  factory TRNumberFieldController({double? value}) =>
      TRNumberFieldController._(value);

  TRNumberFieldController._(this._value);

  double? _value;

  double? get value => _value;

  set value(double? value) {
    if (_value == value) return;
    _value = value;
    notifyListeners();
  }

  void clear() => value = null;
}

// @tinyrack-preview number-field
/// A locale-aware nullable number input with stepper and scrubbing behavior.
class TRNumberField extends StatefulWidget {
  const TRNumberField({
    this.controller,
    this.defaultValue,
    this.enabled = true,
    this.errorText,
    this.helperText,
    this.label,
    this.largeStep = 10,
    this.max,
    this.min,
    this.numberFormat,
    this.onValueChange,
    this.placeholder,
    this.readOnly = false,
    this.scrubbable = true,
    this.smallStep = 0.1,
    this.step = 1,
    this.uiSize = TRUiSize.md,
    super.key,
  }) : value = null,
       _controlled = false,
       assert(step > 0 && smallStep > 0 && largeStep > 0),
       assert(min == null || max == null || min <= max);

  const TRNumberField.controlled({
    required this.value,
    this.controller,
    this.enabled = true,
    this.errorText,
    this.helperText,
    this.label,
    this.largeStep = 10,
    this.max,
    this.min,
    this.numberFormat,
    this.onValueChange,
    this.placeholder,
    this.readOnly = false,
    this.scrubbable = true,
    this.smallStep = 0.1,
    this.step = 1,
    this.uiSize = TRUiSize.md,
    super.key,
  }) : defaultValue = null,
       _controlled = true,
       assert(step > 0 && smallStep > 0 && largeStep > 0),
       assert(min == null || max == null || min <= max);

  final TRNumberFieldController? controller;
  final double? defaultValue;
  final double? value;
  final bool enabled;
  final String? errorText;
  final String? helperText;
  final String? label;
  final double largeStep;
  final double? max;
  final double? min;
  final NumberFormat? numberFormat;
  final ValueChanged<double?>? onValueChange;
  final String? placeholder;
  final bool readOnly;
  final bool scrubbable;
  final double smallStep;
  final double step;
  final TRUiSize uiSize;
  final bool _controlled;

  @override
  State<TRNumberField> createState() => _TRNumberFieldState();
}

class _TRNumberFieldState extends State<TRNumberField> {
  TRNumberFieldController? _internalController;
  late final TextEditingController _textController;
  late final FocusNode _focusNode;
  late NumberFormat _format;
  double _scrubRemainder = 0;

  TRNumberFieldController get _controller =>
      widget.controller ??
      (_internalController ??= TRNumberFieldController(
        value: widget.defaultValue,
      ));

  double? get _value => widget._controlled ? widget.value : _controller.value;

  @override
  void initState() {
    super.initState();
    _textController = TextEditingController();
    _focusNode = FocusNode()..addListener(_handleFocusChange);
    _controller.addListener(_handleControllerChange);
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    _format =
        widget.numberFormat ??
        NumberFormat.decimalPattern(Localizations.localeOf(context).toString());
    _syncText();
  }

  @override
  void didUpdateWidget(TRNumberField oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.controller != widget.controller) {
      (oldWidget.controller ?? _internalController)?.removeListener(
        _handleControllerChange,
      );
      if (widget.controller != null) {
        _internalController?.dispose();
        _internalController = null;
      }
      _controller.addListener(_handleControllerChange);
    }
    if (oldWidget.numberFormat != widget.numberFormat) {
      _format =
          widget.numberFormat ??
          NumberFormat.decimalPattern(
            Localizations.localeOf(context).toString(),
          );
    }
    _syncText();
  }

  @override
  void dispose() {
    _focusNode.removeListener(_handleFocusChange);
    _focusNode.dispose();
    _textController.dispose();
    _controller.removeListener(_handleControllerChange);
    _internalController?.dispose();
    super.dispose();
  }

  void _handleControllerChange() {
    _syncText();
    if (mounted) setState(() {});
  }

  void _handleFocusChange() {
    if (!_focusNode.hasFocus) {
      _commitText();
      _syncText(force: true);
    }
  }

  void _syncText({bool force = false}) {
    if (!force && _focusNode.hasFocus) return;
    final next = _value == null ? '' : _format.format(_value);
    if (_textController.text == next) return;
    _textController.value = TextEditingValue(
      text: next,
      selection: TextSelection.collapsed(offset: next.length),
    );
  }

  double _clamp(double value) {
    if (widget.min case final min?) value = value.clamp(min, double.infinity);
    if (widget.max case final max?) value = value.clamp(-double.infinity, max);
    return value;
  }

  void _change(double? value) {
    final next = value == null ? null : _clamp(value);
    if (_value == next) return;
    if (!widget._controlled) _controller.value = next;
    widget.onValueChange?.call(next);
    if (widget._controlled) _syncText(force: true);
  }

  void _commitText() {
    final text = _textController.text.trim();
    if (text.isEmpty) {
      _change(null);
      return;
    }
    try {
      _change(_format.parse(text).toDouble());
    } on FormatException {
      _syncText(force: true);
    }
  }

  void _increment(double amount) {
    if (!widget.enabled || widget.readOnly) return;
    _change((_value ?? 0) + amount);
    _syncText(force: true);
  }

  KeyEventResult _handleKey(FocusNode node, KeyEvent event) {
    if (event is! KeyDownEvent || !widget.enabled || widget.readOnly) {
      return KeyEventResult.ignored;
    }
    final modifier = HardwareKeyboard.instance.isShiftPressed
        ? widget.largeStep
        : HardwareKeyboard.instance.isAltPressed
        ? widget.smallStep
        : widget.step;
    if (event.logicalKey == LogicalKeyboardKey.arrowUp) {
      _increment(modifier);
      return KeyEventResult.handled;
    }
    if (event.logicalKey == LogicalKeyboardKey.arrowDown) {
      _increment(-modifier);
      return KeyEventResult.handled;
    }
    if (event.logicalKey == LogicalKeyboardKey.pageUp) {
      _increment(widget.largeStep);
      return KeyEventResult.handled;
    }
    if (event.logicalKey == LogicalKeyboardKey.pageDown) {
      _increment(-widget.largeStep);
      return KeyEventResult.handled;
    }
    if (event.logicalKey == LogicalKeyboardKey.home && widget.min != null) {
      _change(widget.min);
      _syncText(force: true);
      return KeyEventResult.handled;
    }
    if (event.logicalKey == LogicalKeyboardKey.end && widget.max != null) {
      _change(widget.max);
      _syncText(force: true);
      return KeyEventResult.handled;
    }
    return KeyEventResult.ignored;
  }

  void _scrub(DragUpdateDetails details) {
    if (!widget.scrubbable || !widget.enabled || widget.readOnly) return;
    _scrubRemainder += details.delta.dx;
    final steps = (_scrubRemainder / TRGeneratedSpacing.sm).truncate();
    if (steps == 0) return;
    _scrubRemainder -= steps * TRGeneratedSpacing.sm;
    _increment(steps * widget.step);
  }

  @override
  Widget build(BuildContext context) {
    final colors = context.tinyrackTheme;
    final control = Row(
      mainAxisSize: MainAxisSize.min,
      spacing: TRGeneratedSpacing.xs,
      children: [
        _TRNumberStepButton(
          icon: Icons.remove,
          label: 'Decrement',
          onPressed: widget.enabled && !widget.readOnly
              ? () => _increment(-widget.step)
              : null,
        ),
        SizedBox(
          width: TRGeneratedMeasurements.measureSm,
          child: Focus(
            onKeyEvent: _handleKey,
            child: TRTextField(
              controller: _textController,
              enabled: widget.enabled,
              errorText: widget.errorText,
              focusNode: _focusNode,
              helperText: widget.helperText,
              keyboardType: const TextInputType.numberWithOptions(
                decimal: true,
                signed: true,
              ),
              onChanged: (_) {},
              onSubmitted: (_) {
                _commitText();
                _syncText(force: true);
              },
              placeholder: widget.placeholder,
              readOnly: widget.readOnly,
              uiSize: widget.uiSize,
            ),
          ),
        ),
        _TRNumberStepButton(
          icon: Icons.add,
          label: 'Increment',
          onPressed: widget.enabled && !widget.readOnly
              ? () => _increment(widget.step)
              : null,
        ),
      ],
    );
    if (widget.label == null) return control;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisSize: MainAxisSize.min,
      spacing: TRGeneratedSpacing.sm,
      children: [
        GestureDetector(
          behavior: HitTestBehavior.opaque,
          onHorizontalDragEnd: (_) => _scrubRemainder = 0,
          onHorizontalDragUpdate: _scrub,
          child: MouseRegion(
            cursor: widget.scrubbable && widget.enabled && !widget.readOnly
                ? SystemMouseCursors.resizeLeftRight
                : MouseCursor.defer,
            child: SizedBox(
              height: TRGeneratedFlutterRendering.normalLineSm,
              child: Align(
                alignment: AlignmentDirectional.topStart,
                child: Text(
                  widget.label!.toUpperCase(),
                  strutStyle: const StrutStyle(
                    fontFamily: TRGeneratedFontFamilies.body,
                    fontSize: TRGeneratedTypographySizes.xs,
                    fontWeight: TRGeneratedFontWeights.strong,
                    forceStrutHeight: true,
                    height: TRGeneratedTypographyLineHeights.xs,
                  ),
                  style: TRGeneratedTextStyles.label.copyWith(
                    color: widget.enabled ? colors.text : colors.textMuted,
                    fontFamilyFallback: TRGeneratedFontFamilies.fallback,
                  ),
                ),
              ),
            ),
          ),
        ),
        control,
      ],
    );
  }
}

class _TRNumberStepButton extends StatelessWidget {
  const _TRNumberStepButton({
    required this.icon,
    required this.label,
    required this.onPressed,
  });

  final IconData icon;
  final String label;
  final VoidCallback? onPressed;

  @override
  Widget build(BuildContext context) {
    final colors = context.tinyrackTheme;
    final generated = Theme.of(context).brightness == Brightness.light
        ? TRGeneratedColors.light
        : TRGeneratedColors.dark;
    return SizedBox(
      width: TRGeneratedLayerMetrics.numberStepWidth,
      height: TRGeneratedControlMetrics.mdHeight,
      child: TextButton(
        onPressed: onPressed,
        style: ButtonStyle(
          backgroundColor: WidgetStateProperty.resolveWith((states) {
            if (states.contains(WidgetState.pressed)) {
              return colors.surfacePressed;
            }
            if (states.contains(WidgetState.hovered)) {
              return colors.surfaceHover;
            }
            return colors.surface;
          }),
          foregroundColor: WidgetStatePropertyAll(colors.text),
          fixedSize: const WidgetStatePropertyAll(
            Size(
              TRGeneratedLayerMetrics.numberStepWidth,
              TRGeneratedControlMetrics.mdHeight,
            ),
          ),
          padding: const WidgetStatePropertyAll(EdgeInsets.zero),
          shape: WidgetStatePropertyAll(
            RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(TRGeneratedRadii.md),
            ),
          ),
          side: WidgetStatePropertyAll(
            BorderSide(color: generated.controlBorder),
          ),
          tapTargetSize: MaterialTapTargetSize.shrinkWrap,
          visualDensity: VisualDensity.standard,
        ),
        child: Icon(icon, size: TRGeneratedControlMetrics.smIconSize),
      ),
    );
  }
}

/// Form-integrated [TRNumberField].
class TRNumberFieldFormField extends FormField<double> {
  TRNumberFieldFormField({
    super.initialValue,
    super.autovalidateMode,
    super.enabled = true,
    String? helperText,
    String? label,
    double? max,
    double? min,
    NumberFormat? numberFormat,
    ValueChanged<double?>? onValueChange,
    super.onSaved,
    super.validator,
    String? placeholder,
    double step = 1,
    super.key,
  }) : super(
         builder: (field) => TRNumberField.controlled(
           value: field.value,
           enabled: enabled,
           errorText: field.errorText,
           helperText: helperText,
           label: label,
           max: max,
           min: min,
           numberFormat: numberFormat,
           onValueChange: (value) {
             field.didChange(value);
             onValueChange?.call(value);
           },
           placeholder: placeholder,
           step: step,
         ),
       );
}
