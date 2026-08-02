import 'dart:math' as math;

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../generated/tokens.g.dart';
import '../theme.dart';

/// Converts a slider value to its visible and semantic label.
typedef TRSliderLabelBuilder = String Function(double value);

// @tinyrack-preview slider
/// A scalar horizontal or vertical slider with controlled and uncontrolled APIs.
class TRSlider extends StatefulWidget {
  const TRSlider({
    this.defaultValue = 0,
    this.enabled = true,
    this.label,
    this.labelBuilder,
    this.max = 100,
    this.min = 0,
    this.onValueChange,
    this.semanticLabel,
    this.step = 1,
    this.vertical = false,
    super.key,
  }) : value = null,
       _controlled = false,
       assert(min < max && step > 0);

  const TRSlider.controlled({
    required this.value,
    this.enabled = true,
    this.label,
    this.labelBuilder,
    this.max = 100,
    this.min = 0,
    this.onValueChange,
    this.semanticLabel,
    this.step = 1,
    this.vertical = false,
    super.key,
  }) : defaultValue = 0,
       _controlled = true,
       assert(min < max && step > 0);

  final double defaultValue;
  final double? value;
  final bool enabled;
  final String? label;
  final TRSliderLabelBuilder? labelBuilder;
  final double max;
  final double min;
  final ValueChanged<double>? onValueChange;
  final String? semanticLabel;
  final double step;
  final bool vertical;
  final bool _controlled;

  @override
  State<TRSlider> createState() => _TRSliderState();
}

class _TRSliderState extends State<TRSlider> {
  late double _value = widget.defaultValue.clamp(widget.min, widget.max);

  double get _effectiveValue => (widget._controlled ? widget.value! : _value)
      .clamp(widget.min, widget.max);

  void _change(double value) {
    final next = value.clamp(widget.min, widget.max);
    if (!widget._controlled) setState(() => _value = next);
    widget.onValueChange?.call(next);
  }

  @override
  Widget build(BuildContext context) {
    final slider = _TRScalarSliderControl(
      enabled: widget.enabled,
      max: widget.max,
      min: widget.min,
      onChanged: _change,
      step: widget.step,
      value: _effectiveValue,
      vertical: widget.vertical,
    );
    return _TRSliderFrame(
      label: widget.label,
      semanticLabel: widget.semanticLabel,
      valueLabel:
          widget.labelBuilder?.call(_effectiveValue) ??
          _formatSliderValue(_effectiveValue),
      vertical: widget.vertical,
      child: slider,
    );
  }
}

/// A two-thumb slider with an optional minimum gap.
class TRRangeSlider extends StatefulWidget {
  const TRRangeSlider({
    this.defaultValue = const RangeValues(25, 75),
    this.enabled = true,
    this.label,
    this.labelBuilder,
    this.max = 100,
    this.min = 0,
    this.minGap = 0,
    this.onValueChange,
    this.semanticLabel,
    this.step = 1,
    this.vertical = false,
    super.key,
  }) : value = null,
       _controlled = false,
       assert(min < max && step > 0 && minGap >= 0);

  const TRRangeSlider.controlled({
    required this.value,
    this.enabled = true,
    this.label,
    this.labelBuilder,
    this.max = 100,
    this.min = 0,
    this.minGap = 0,
    this.onValueChange,
    this.semanticLabel,
    this.step = 1,
    this.vertical = false,
    super.key,
  }) : defaultValue = const RangeValues(25, 75),
       _controlled = true,
       assert(min < max && step > 0 && minGap >= 0);

  final RangeValues defaultValue;
  final RangeValues? value;
  final bool enabled;
  final String? label;
  final TRSliderLabelBuilder? labelBuilder;
  final double max;
  final double min;
  final double minGap;
  final ValueChanged<RangeValues>? onValueChange;
  final String? semanticLabel;
  final double step;
  final bool vertical;
  final bool _controlled;

  @override
  State<TRRangeSlider> createState() => _TRRangeSliderState();
}

class _TRRangeSliderState extends State<TRRangeSlider> {
  late RangeValues _value = _clampRange(
    widget.defaultValue,
    widget.min,
    widget.max,
  );

  RangeValues get _effectiveValue => _clampRange(
    widget._controlled ? widget.value! : _value,
    widget.min,
    widget.max,
  );

  void _change(RangeValues values) {
    final current = _effectiveValue;
    var next = _clampRange(values, widget.min, widget.max);
    if (next.end - next.start < widget.minGap) {
      if ((next.start - current.start).abs() > (next.end - current.end).abs()) {
        next = RangeValues(next.end - widget.minGap, next.end);
      } else {
        next = RangeValues(next.start, next.start + widget.minGap);
      }
      next = _clampRange(next, widget.min, widget.max);
    }
    if (!widget._controlled) setState(() => _value = next);
    widget.onValueChange?.call(next);
  }

  @override
  Widget build(BuildContext context) {
    final value = _effectiveValue;
    final slider = _TRRangeSliderControl(
      enabled: widget.enabled,
      max: widget.max,
      min: widget.min,
      onChanged: _change,
      step: widget.step,
      values: value,
      vertical: widget.vertical,
    );
    return _TRSliderFrame(
      label: widget.label,
      semanticLabel: widget.semanticLabel,
      valueLabel: widget.labelBuilder == null
          ? '${_formatSliderValue(value.start)}–${_formatSliderValue(value.end)}'
          : '${widget.labelBuilder!(value.start)}–${widget.labelBuilder!(value.end)}',
      vertical: widget.vertical,
      child: slider,
    );
  }
}

class _TRSliderFrame extends StatelessWidget {
  const _TRSliderFrame({
    required this.child,
    required this.label,
    required this.semanticLabel,
    required this.valueLabel,
    required this.vertical,
  });

  final Widget child;
  final String? label;
  final String? semanticLabel;
  final String valueLabel;
  final bool vertical;

  @override
  Widget build(BuildContext context) {
    final colors = context.tinyrackTheme;
    Widget result = Semantics(label: semanticLabel ?? label, child: child);
    if (label == null) return result;
    final heading = DefaultTextStyle(
      style: TextStyle(
        color: colors.text,
        fontFamily: TRGeneratedFontFamilies.body,
        fontFamilyFallback: TRGeneratedFontFamilies.fallback,
        fontSize: TRGeneratedTypographySizes.md,
        fontWeight: TRGeneratedFontWeights.medium,
        height:
            TRGeneratedFlutterRendering.normalLineMd /
            TRGeneratedTypographySizes.md,
      ),
      child: Row(
        spacing: TRGeneratedSpacing.md,
        children: [
          Expanded(child: Text(label!)),
          Text(
            valueLabel,
            style: TextStyle(
              color: colors.textMuted,
              fontSize: TRGeneratedTypographySizes.sm,
            ),
          ),
        ],
      ),
    );
    if (vertical) {
      return SizedBox(
        width: TRGeneratedLayerMetrics.sliderVerticalWidth,
        child: LayoutBuilder(
          builder: (context, constraints) {
            final height = constraints.hasBoundedHeight
                ? constraints.maxHeight
                : TRGeneratedMeasurements.measureMd;
            final controlHeight = (height - TRGeneratedSpacing.sm + 4) / 2;
            final headingHeight =
                height - TRGeneratedSpacing.sm - controlHeight;
            return SizedBox(
              height: height,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  SizedBox(height: headingHeight, child: heading),
                  const SizedBox(height: TRGeneratedSpacing.sm),
                  SizedBox(height: controlHeight, child: result),
                ],
              ),
            );
          },
        ),
      );
    }
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      mainAxisSize: MainAxisSize.min,
      spacing: TRGeneratedSpacing.sm,
      children: [heading, result],
    );
  }
}

class _TRScalarSliderControl extends StatefulWidget {
  const _TRScalarSliderControl({
    required this.enabled,
    required this.max,
    required this.min,
    required this.onChanged,
    required this.step,
    required this.value,
    required this.vertical,
  });

  final bool enabled;
  final double max;
  final double min;
  final ValueChanged<double> onChanged;
  final double step;
  final double value;
  final bool vertical;

  @override
  State<_TRScalarSliderControl> createState() => _TRScalarSliderControlState();
}

class _TRScalarSliderControlState extends State<_TRScalarSliderControl> {
  bool _focused = false;

  double _valueFor(Offset position, Size size) {
    final raw = widget.vertical
        ? 1 - position.dy / size.height
        : position.dx / size.width;
    final continuous =
        widget.min + raw.clamp(0.0, 1.0) * (widget.max - widget.min);
    return _snapSliderValue(continuous, widget.min, widget.max, widget.step);
  }

  void _update(Offset position, Size size) {
    if (widget.enabled) {
      widget.onChanged(_valueFor(position, size));
    }
  }

  KeyEventResult _handleKey(FocusNode node, KeyEvent event) {
    if (!widget.enabled || event is! KeyDownEvent) {
      return KeyEventResult.ignored;
    }
    final direction = switch (event.logicalKey) {
      LogicalKeyboardKey.arrowRight || LogicalKeyboardKey.arrowUp => 1,
      LogicalKeyboardKey.arrowLeft || LogicalKeyboardKey.arrowDown => -1,
      _ => 0,
    };
    if (direction == 0) return KeyEventResult.ignored;
    widget.onChanged(
      _snapSliderValue(
        widget.value + direction * widget.step,
        widget.min,
        widget.max,
        widget.step,
      ),
    );
    return KeyEventResult.handled;
  }

  @override
  Widget build(BuildContext context) {
    final colors = context.tinyrackTheme;
    final ratio = (widget.value - widget.min) / (widget.max - widget.min);
    return SizedBox(
      height: widget.vertical
          ? TRGeneratedMeasurements.measureMd
          : TRGeneratedSpacing.xl,
      width: widget.vertical ? TRGeneratedSpacing.xl : null,
      child: LayoutBuilder(
        builder: (context, constraints) {
          final size = Size(constraints.maxWidth, constraints.maxHeight);
          final decreasedValue = _snapSliderValue(
            widget.value - widget.step,
            widget.min,
            widget.max,
            widget.step,
          );
          final increasedValue = _snapSliderValue(
            widget.value + widget.step,
            widget.min,
            widget.max,
            widget.step,
          );
          return Semantics(
            decreasedValue: widget.enabled
                ? _formatSliderValue(decreasedValue)
                : null,
            enabled: widget.enabled,
            focusable: true,
            focused: _focused,
            onDecrease: widget.enabled
                ? () => widget.onChanged(
                    _snapSliderValue(
                      widget.value - widget.step,
                      widget.min,
                      widget.max,
                      widget.step,
                    ),
                  )
                : null,
            increasedValue: widget.enabled
                ? _formatSliderValue(increasedValue)
                : null,
            onIncrease: widget.enabled
                ? () => widget.onChanged(
                    _snapSliderValue(
                      widget.value + widget.step,
                      widget.min,
                      widget.max,
                      widget.step,
                    ),
                  )
                : null,
            value: _formatSliderValue(widget.value),
            child: Focus(
              onFocusChange: (focused) => setState(() => _focused = focused),
              onKeyEvent: _handleKey,
              child: GestureDetector(
                behavior: HitTestBehavior.opaque,
                onPanDown: widget.enabled
                    ? (details) => _update(details.localPosition, size)
                    : null,
                onPanUpdate: widget.enabled
                    ? (details) => _update(details.localPosition, size)
                    : null,
                child: CustomPaint(
                  painter: _TRSliderPainter(
                    active: colors.primary,
                    inactive: colors.surfaceMuted,
                    focused: _focused,
                    focus: colors.focus,
                    ratios: [ratio],
                    surface: colors.surface,
                    vertical: widget.vertical,
                  ),
                ),
              ),
            ),
          );
        },
      ),
    );
  }
}

class _TRRangeSliderControl extends StatefulWidget {
  const _TRRangeSliderControl({
    required this.enabled,
    required this.max,
    required this.min,
    required this.onChanged,
    required this.step,
    required this.values,
    required this.vertical,
  });

  final bool enabled;
  final double max;
  final double min;
  final ValueChanged<RangeValues> onChanged;
  final double step;
  final RangeValues values;
  final bool vertical;

  @override
  State<_TRRangeSliderControl> createState() => _TRRangeSliderControlState();
}

class _TRRangeSliderControlState extends State<_TRRangeSliderControl> {
  bool _focused = false;
  bool _movingStart = true;

  double _valueFor(Offset position, Size size) {
    final raw = widget.vertical
        ? 1 - position.dy / size.height
        : position.dx / size.width;
    return _snapSliderValue(
      widget.min + raw.clamp(0.0, 1.0) * (widget.max - widget.min),
      widget.min,
      widget.max,
      widget.step,
    );
  }

  void _start(Offset position, Size size) {
    final value = _valueFor(position, size);
    _movingStart =
        (value - widget.values.start).abs() <=
        (value - widget.values.end).abs();
    _update(position, size);
  }

  void _update(Offset position, Size size) {
    if (!widget.enabled) return;
    final value = _valueFor(position, size);
    widget.onChanged(
      _movingStart
          ? RangeValues(math.min(value, widget.values.end), widget.values.end)
          : RangeValues(
              widget.values.start,
              math.max(value, widget.values.start),
            ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final colors = context.tinyrackTheme;
    final extent = widget.max - widget.min;
    return SizedBox(
      height: widget.vertical
          ? TRGeneratedMeasurements.measureMd
          : TRGeneratedSpacing.xl,
      width: widget.vertical ? TRGeneratedSpacing.xl : null,
      child: LayoutBuilder(
        builder: (context, constraints) {
          final size = Size(constraints.maxWidth, constraints.maxHeight);
          return Semantics(
            enabled: widget.enabled,
            focusable: true,
            focused: _focused,
            value:
                '${_formatSliderValue(widget.values.start)}–${_formatSliderValue(widget.values.end)}',
            child: Focus(
              onFocusChange: (focused) => setState(() => _focused = focused),
              child: GestureDetector(
                behavior: HitTestBehavior.opaque,
                onPanDown: widget.enabled
                    ? (details) => _start(details.localPosition, size)
                    : null,
                onPanUpdate: widget.enabled
                    ? (details) => _update(details.localPosition, size)
                    : null,
                child: CustomPaint(
                  painter: _TRSliderPainter(
                    active: colors.primary,
                    inactive: colors.surfaceMuted,
                    focused: _focused,
                    focus: colors.focus,
                    ratios: [
                      (widget.values.start - widget.min) / extent,
                      (widget.values.end - widget.min) / extent,
                    ],
                    surface: colors.surface,
                    vertical: widget.vertical,
                  ),
                ),
              ),
            ),
          );
        },
      ),
    );
  }
}

class _TRSliderPainter extends CustomPainter {
  const _TRSliderPainter({
    required this.active,
    required this.inactive,
    required this.focused,
    required this.focus,
    required this.ratios,
    required this.surface,
    required this.vertical,
  });

  final Color active;
  final Color inactive;
  final bool focused;
  final Color focus;
  final List<double> ratios;
  final Color surface;
  final bool vertical;

  @override
  void paint(Canvas canvas, Size size) {
    const track = TRGeneratedLayerMetrics.sliderTrackThickness;
    const thumb = TRGeneratedLayerMetrics.sliderThumbSize / 2 + 2;
    final trackRect = vertical
        ? Rect.fromCenter(
            center: Offset(size.width / 2, size.height / 2),
            width: track,
            height: size.height,
          )
        : Rect.fromCenter(
            center: Offset(size.width / 2, size.height / 2),
            width: size.width,
            height: track,
          );
    canvas.drawRRect(
      RRect.fromRectAndRadius(trackRect, const Radius.circular(track / 2)),
      Paint()..color = inactive,
    );
    final start = ratios.length == 1 ? 0.0 : ratios.first;
    final end = ratios.last;
    final activeRect = vertical
        ? Rect.fromLTRB(
            trackRect.left,
            size.height * (1 - end),
            trackRect.right,
            size.height * (1 - start),
          )
        : Rect.fromLTRB(
            size.width * start,
            trackRect.top,
            size.width * end,
            trackRect.bottom,
          );
    canvas.drawRRect(
      RRect.fromRectAndRadius(activeRect, const Radius.circular(track / 2)),
      Paint()..color = active,
    );
    for (final ratio in ratios) {
      final center = vertical
          ? Offset(size.width / 2, size.height * (1 - ratio))
          : Offset(size.width * ratio, size.height / 2);
      if (focused) {
        canvas.drawCircle(
          center,
          thumb + TRGeneratedBorders.focusWidth,
          Paint()..color = focus,
        );
      }
      canvas.drawCircle(center, thumb, Paint()..color = surface);
      canvas.drawCircle(
        center,
        thumb - TRGeneratedBorders.strongWidth / 2,
        Paint()
          ..color = active
          ..style = PaintingStyle.stroke
          ..strokeWidth = TRGeneratedBorders.strongWidth,
      );
    }
  }

  @override
  bool shouldRepaint(_TRSliderPainter oldDelegate) =>
      active != oldDelegate.active ||
      inactive != oldDelegate.inactive ||
      focused != oldDelegate.focused ||
      focus != oldDelegate.focus ||
      surface != oldDelegate.surface ||
      vertical != oldDelegate.vertical ||
      !_listEquals(ratios, oldDelegate.ratios);
}

double _snapSliderValue(double value, double min, double max, double step) =>
    (min + ((value - min) / step).round() * step).clamp(min, max);

String _formatSliderValue(double value) => value == value.roundToDouble()
    ? value.round().toString()
    : value
          .toStringAsFixed(2)
          .replaceFirst(RegExp(r'0+$'), '')
          .replaceFirst(RegExp(r'\.$'), '');

bool _listEquals(List<double> left, List<double> right) {
  if (left.length != right.length) return false;
  for (var index = 0; index < left.length; index += 1) {
    if (left[index] != right[index]) return false;
  }
  return true;
}

/// Form-integrated scalar slider.
class TRSliderFormField extends FormField<double> {
  TRSliderFormField({
    super.initialValue = 0,
    super.autovalidateMode,
    super.enabled = true,
    String? label,
    double max = 100,
    double min = 0,
    ValueChanged<double>? onValueChange,
    super.onSaved,
    double step = 1,
    super.validator,
    super.key,
  }) : super(
         builder: (field) => TRSlider.controlled(
           value: field.value ?? initialValue,
           enabled: enabled,
           label: label,
           max: max,
           min: min,
           onValueChange: (value) {
             field.didChange(value);
             onValueChange?.call(value);
           },
           step: step,
         ),
       );
}

/// Form-integrated range slider.
class TRRangeSliderFormField extends FormField<RangeValues> {
  TRRangeSliderFormField({
    super.initialValue = const RangeValues(25, 75),
    super.autovalidateMode,
    super.enabled = true,
    String? label,
    double max = 100,
    double min = 0,
    double minGap = 0,
    ValueChanged<RangeValues>? onValueChange,
    super.onSaved,
    double step = 1,
    super.validator,
    super.key,
  }) : super(
         builder: (field) => TRRangeSlider.controlled(
           value: field.value ?? initialValue,
           enabled: enabled,
           label: label,
           max: max,
           min: min,
           minGap: minGap,
           onValueChange: (value) {
             field.didChange(value);
             onValueChange?.call(value);
           },
           step: step,
         ),
       );
}

RangeValues _clampRange(RangeValues value, double min, double max) {
  final start = value.start.clamp(min, max);
  final end = value.end.clamp(min, max);
  return RangeValues(math.min(start, end), math.max(start, end));
}
