import 'dart:math' as math;

import 'package:material_ui/material_ui.dart';

enum _TRLayerWidthMode { content, fixed, matchAnchor, atLeastAnchor }

enum _TRLayerHeightMode { content, fixed }

/// Width policy for a caller-sized anchored layer.
///
/// Named bounds describe the whole layer, including its border and padding.
/// The safe viewport is always the final upper bound.
@immutable
final class TRLayerWidth {
  /// Lets content choose its width between [min] and [max].
  const TRLayerWidth.content({double? min, double? max})
    : assert(min == null || min >= 0),
      assert(max == null || max >= 0),
      assert(min == null || max == null || min <= max),
      _mode = _TRLayerWidthMode.content,
      _min = min,
      _max = max,
      _value = null;

  /// Requests an exact width before the safe viewport clamp is applied.
  const TRLayerWidth.fixed(double value)
    : assert(value >= 0 && value < double.infinity),
      _mode = _TRLayerWidthMode.fixed,
      _min = null,
      _max = null,
      _value = value;

  /// Uses the anchor width, optionally clamped between [min] and [max].
  const TRLayerWidth.matchAnchor({double? min, double? max})
    : assert(min == null || min >= 0),
      assert(max == null || max >= 0),
      assert(min == null || max == null || min <= max),
      _mode = _TRLayerWidthMode.matchAnchor,
      _min = min,
      _max = max,
      _value = null;

  /// Lets content grow while keeping the layer at least as wide as its anchor.
  ///
  /// The anchor wins when it is wider than [max]; only the safe viewport may
  /// make an at-least-anchor layer narrower than its anchor.
  const TRLayerWidth.atLeastAnchor({double? min, double? max})
    : assert(min == null || min >= 0),
      assert(max == null || max >= 0),
      assert(min == null || max == null || min <= max),
      _mode = _TRLayerWidthMode.atLeastAnchor,
      _min = min,
      _max = max,
      _value = null;

  final _TRLayerWidthMode _mode;
  final double? _min;
  final double? _max;
  final double? _value;

  ({double min, double max}) _resolve({
    required double anchor,
    required double viewport,
  }) {
    final safeViewport = math.max(0.0, viewport);
    double desiredMin;
    double desiredMax;
    switch (_mode) {
      case _TRLayerWidthMode.content:
        desiredMin = _min ?? 0;
        desiredMax = _max ?? safeViewport;
      case _TRLayerWidthMode.fixed:
        final value = _value!;
        desiredMin = value;
        desiredMax = value;
      case _TRLayerWidthMode.matchAnchor:
        final target = anchor
            .clamp(_min ?? 0, _max ?? double.infinity)
            .toDouble();
        desiredMin = target;
        desiredMax = target;
      case _TRLayerWidthMode.atLeastAnchor:
        desiredMin = math.max(anchor, _min ?? 0);
        desiredMax = math.max(desiredMin, _max ?? safeViewport);
    }
    final resolvedMin = desiredMin.clamp(0, safeViewport).toDouble();
    final resolvedMax = desiredMax.clamp(resolvedMin, safeViewport).toDouble();
    return (min: resolvedMin, max: resolvedMax);
  }

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is TRLayerWidth &&
          _mode == other._mode &&
          _min == other._min &&
          _max == other._max &&
          _value == other._value;

  @override
  int get hashCode => Object.hash(_mode, _min, _max, _value);

  @override
  String toString() => switch (_mode) {
    _TRLayerWidthMode.content => 'TRLayerWidth.content(min: $_min, max: $_max)',
    _TRLayerWidthMode.fixed => 'TRLayerWidth.fixed($_value)',
    _TRLayerWidthMode.matchAnchor =>
      'TRLayerWidth.matchAnchor(min: $_min, max: $_max)',
    _TRLayerWidthMode.atLeastAnchor =>
      'TRLayerWidth.atLeastAnchor(min: $_min, max: $_max)',
  };
}

/// Height policy for a caller-sized anchored layer.
///
/// Named bounds describe the whole layer, including its border and padding.
/// The safe viewport is always the final upper bound.
@immutable
final class TRLayerHeight {
  /// Lets content choose its height between [min] and [max].
  const TRLayerHeight.content({double? min, double? max})
    : assert(min == null || min >= 0),
      assert(max == null || max >= 0),
      assert(min == null || max == null || min <= max),
      _mode = _TRLayerHeightMode.content,
      _min = min,
      _max = max,
      _value = null;

  /// Requests an exact height before the safe viewport clamp is applied.
  const TRLayerHeight.fixed(double value)
    : assert(value >= 0 && value < double.infinity),
      _mode = _TRLayerHeightMode.fixed,
      _min = null,
      _max = null,
      _value = value;

  final _TRLayerHeightMode _mode;
  final double? _min;
  final double? _max;
  final double? _value;

  ({double min, double max}) _resolve(double viewport) {
    final safeViewport = math.max(0.0, viewport);
    final desiredMin = _mode == _TRLayerHeightMode.fixed ? _value! : _min ?? 0;
    final desiredMax = _mode == _TRLayerHeightMode.fixed
        ? _value!
        : _max ?? safeViewport;
    final resolvedMin = desiredMin.clamp(0, safeViewport).toDouble();
    final resolvedMax = desiredMax.clamp(resolvedMin, safeViewport).toDouble();
    return (min: resolvedMin, max: resolvedMax);
  }

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is TRLayerHeight &&
          _mode == other._mode &&
          _min == other._min &&
          _max == other._max &&
          _value == other._value;

  @override
  int get hashCode => Object.hash(_mode, _min, _max, _value);

  @override
  String toString() => _mode == _TRLayerHeightMode.fixed
      ? 'TRLayerHeight.fixed($_value)'
      : 'TRLayerHeight.content(min: $_min, max: $_max)';
}

/// Width and height policy for the complete bounds of an anchored layer.
@immutable
final class TRLayerSize {
  const TRLayerSize({
    this.width = const TRLayerWidth.content(),
    this.height = const TRLayerHeight.content(),
  });

  final TRLayerWidth width;
  final TRLayerHeight height;

  /// Resolves this policy against an anchor and safe viewport.
  ///
  /// Layer hosts call this after safe-area and keyboard insets are removed.
  BoxConstraints constraintsFor({
    required Size anchorSize,
    required Size viewportSize,
  }) {
    final resolvedWidth = width._resolve(
      anchor: anchorSize.width,
      viewport: viewportSize.width,
    );
    final resolvedHeight = height._resolve(viewportSize.height);
    return BoxConstraints(
      minWidth: resolvedWidth.min,
      maxWidth: resolvedWidth.max,
      minHeight: resolvedHeight.min,
      maxHeight: resolvedHeight.max,
    );
  }

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is TRLayerSize && width == other.width && height == other.height;

  @override
  int get hashCode => Object.hash(width, height);

  @override
  String toString() => 'TRLayerSize(width: $width, height: $height)';
}
