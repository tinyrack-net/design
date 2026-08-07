import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

import '../../generated/tokens.g.dart';
import '../../theme.dart';
import '../../tokens.dart';

/// The visual transition used when an animated number changes.
enum TRAnimatedNumberAnimation { roll, count }

/// The vertical direction used by the [TRAnimatedNumberAnimation.roll] mode.
enum TRAnimatedNumberRollDirection { auto, up, down }

/// Formats a value displayed by [TRAnimatedNumber].
typedef TRAnimatedNumberFormatter = String Function(double value);

final _animatedNumberDigitPattern = RegExp(r'[0-9\u0660-\u0669\u06f0-\u06f9]');

/// Formats [value] with locale-aware grouping and a fixed decimal precision.
String formatAnimatedNumber(
  double value, {
  int fractionDigits = 0,
  String? locale,
}) {
  return NumberFormat.decimalPatternDigits(
    locale: locale,
    decimalDigits: fractionDigits,
  ).format(value);
}

// @tinyrack-preview animated-number
/// Displays a locale-formatted number and animates changes to its value.
///
/// The first value is rendered without motion. Use [numberFormat] for standard
/// `intl` formats or [formatter] for a custom unit or domain-specific format.
class TRAnimatedNumber extends StatefulWidget {
  const TRAnimatedNumber({
    required this.value,
    this.animation = TRAnimatedNumberAnimation.roll,
    this.duration = TRMotion.number,
    this.formatter,
    this.fractionDigits = 0,
    this.numberFormat,
    this.rollDirection = TRAnimatedNumberRollDirection.auto,
    this.style,
    super.key,
  }) : assert(fractionDigits >= 0);

  final TRAnimatedNumberAnimation animation;
  final Duration duration;
  final TRAnimatedNumberFormatter? formatter;
  final int fractionDigits;
  final NumberFormat? numberFormat;
  final TRAnimatedNumberRollDirection rollDirection;
  final TextStyle? style;
  final double value;

  @override
  State<TRAnimatedNumber> createState() => _TRAnimatedNumberState();
}

class _TRAnimatedNumberState extends State<TRAnimatedNumber>
    with SingleTickerProviderStateMixin {
  late final AnimationController _controller;
  double _animationProgress = 1;
  late double _fromValue;
  late double _visualValue;
  late String _previousText;
  late String _targetText;
  Locale? _locale;
  bool _initialized = false;

  @override
  void initState() {
    super.initState();
    _fromValue = widget.value;
    _visualValue = widget.value;
    _controller = AnimationController(vsync: this, duration: widget.duration)
      ..value = 1
      ..addListener(_handleTick)
      ..addStatusListener(_handleStatus);
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    final locale = Localizations.localeOf(context);
    final motionDisabled = MediaQuery.disableAnimationsOf(context);
    if (!_initialized) {
      _locale = locale;
      _targetText = _format(widget.value);
      _previousText = _targetText;
      _initialized = true;
      return;
    }
    if (_locale != locale || motionDisabled) {
      _locale = locale;
      _settle();
    }
  }

  @override
  void didUpdateWidget(TRAnimatedNumber oldWidget) {
    super.didUpdateWidget(oldWidget);
    _controller.duration = widget.duration;
    final formatChanged =
        _formatFor(oldWidget, oldWidget.value) !=
        _formatFor(widget, oldWidget.value);
    if (formatChanged) {
      _settle();
      return;
    }
    if (oldWidget.value != widget.value) _startTransition();
  }

  void _startTransition() {
    final nextText = _format(widget.value);
    if (MediaQuery.disableAnimationsOf(context) ||
        widget.duration == Duration.zero ||
        !widget.value.isFinite ||
        !_visualValue.isFinite ||
        nextText == _targetText) {
      _settle();
      return;
    }
    _fromValue = _visualValue;
    _previousText = _format(_fromValue);
    _targetText = nextText;
    _animationProgress = 0;
    _controller
      ..duration = widget.duration
      ..forward(from: 0);
  }

  void _handleTick() {
    final progress = CurvedAnimation(
      parent: _controller,
      curve: widget.animation == TRAnimatedNumberAnimation.count
          ? Curves.easeOutCubic
          : TRMotion.easeOut,
    ).value;
    _animationProgress = progress;
    _visualValue = _fromValue + (widget.value - _fromValue) * progress;
    if (mounted) setState(() {});
  }

  void _handleStatus(AnimationStatus status) {
    if (status != AnimationStatus.completed || !_initialized) return;
    _visualValue = widget.value;
    _previousText = _targetText;
    if (mounted) setState(() {});
  }

  void _settle() {
    _controller.stop();
    _visualValue = widget.value;
    _fromValue = widget.value;
    _targetText = _format(widget.value);
    _previousText = _targetText;
    _controller.value = 1;
    _animationProgress = 1;
    if (mounted) setState(() {});
  }

  String _format(double value) => _formatFor(widget, value);

  String _formatFor(TRAnimatedNumber source, double value) =>
      source.formatter?.call(value) ??
      source.numberFormat?.format(value) ??
      formatAnimatedNumber(
        value,
        fractionDigits: source.fractionDigits,
        locale: _locale?.toString(),
      );

  @override
  void dispose() {
    _controller
      ..removeListener(_handleTick)
      ..removeStatusListener(_handleStatus)
      ..dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final colors = context.tinyrackTheme;
    final textStyle = const TextStyle(
      fontFamily: TRGeneratedFontFamilies.body,
      fontFeatures: [FontFeature.tabularFigures()],
      letterSpacing: TRGeneratedBorders.defaultWidth / TRGeneratedSpacing.xs,
      height:
          TRGeneratedFlutterRendering.normalLineMd /
          TRGeneratedTypographySizes.md,
    ).copyWith(color: colors.text).merge(widget.style);
    final animating = _controller.isAnimating;
    final visual =
        widget.animation == TRAnimatedNumberAnimation.count || !animating
        ? Text(
            widget.animation == TRAnimatedNumberAnimation.count
                ? _format(_visualValue)
                : _targetText,
            style: textStyle,
          )
        : _RollNumber(
            direction: _resolvedDirection(),
            previous: animating ? _previousText : _targetText,
            progress: _animationProgress,
            style: textStyle,
            target: _targetText,
          );
    return Semantics(label: _targetText, excludeSemantics: true, child: visual);
  }

  TRAnimatedNumberRollDirection _resolvedDirection() {
    if (widget.rollDirection != TRAnimatedNumberRollDirection.auto) {
      return widget.rollDirection;
    }
    return widget.value < _fromValue
        ? TRAnimatedNumberRollDirection.down
        : TRAnimatedNumberRollDirection.up;
  }
}

class _RollNumber extends StatelessWidget {
  const _RollNumber({
    required this.direction,
    required this.previous,
    required this.progress,
    required this.style,
    required this.target,
  });

  final TRAnimatedNumberRollDirection direction;
  final String previous;
  final double progress;
  final TextStyle style;
  final String target;

  @override
  Widget build(BuildContext context) {
    final length = previous.length > target.length
        ? previous.length
        : target.length;
    final oldText = previous.padLeft(length);
    final nextText = target.padLeft(length);
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        for (var index = 0; index < length; index += 1)
          _RollCharacter(
            direction: direction,
            next: nextText[index],
            previous: oldText[index],
            progress: progress,
            style: style,
          ),
      ],
    );
  }
}

class _RollCharacter extends StatelessWidget {
  const _RollCharacter({
    required this.direction,
    required this.next,
    required this.previous,
    required this.progress,
    required this.style,
  });

  final TRAnimatedNumberRollDirection direction;
  final String next;
  final String previous;
  final double progress;
  final TextStyle style;

  @override
  Widget build(BuildContext context) {
    if (previous == next || progress >= 1) return Text(next, style: style);
    final rollsVertically =
        _animatedNumberDigitPattern.hasMatch(previous) &&
        _animatedNumberDigitPattern.hasMatch(next);
    final sign = direction == TRAnimatedNumberRollDirection.down ? -1.0 : 1.0;
    final outgoingOpacity = 1 - progress;
    final previousText = Text(previous, style: style);
    final nextText = Text(next, style: style);
    return ClipRect(
      child: Stack(
        alignment: Alignment.center,
        children: [
          Opacity(
            opacity: outgoingOpacity,
            child: Transform.translate(
              offset: rollsVertically
                  ? Offset(
                      0,
                      -sign *
                          progress *
                          (style.fontSize ?? TRGeneratedTypographySizes.md),
                    )
                  : Offset.zero,
              child: previousText,
            ),
          ),
          Opacity(
            opacity: progress,
            child: Transform.translate(
              offset: rollsVertically
                  ? Offset(
                      0,
                      sign *
                          (1 - progress) *
                          (style.fontSize ?? TRGeneratedTypographySizes.md),
                    )
                  : Offset.zero,
              child: nextText,
            ),
          ),
        ],
      ),
    );
  }
}
