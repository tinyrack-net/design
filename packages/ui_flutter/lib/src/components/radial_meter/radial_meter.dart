import 'dart:math' as math;

import 'package:material_ui/material_ui.dart';

import '../../generated/tokens.g.dart';
import '../../theme.dart';
import '../../tokens.dart';
import '../../types.dart';
import '../../ui_density.dart';

// @tinyrack-preview radial-meter
/// A compact circular measurement against a known range.
class TRRadialMeter extends StatelessWidget {
  /// Creates a radial meter with an assistive [semanticLabel].
  const TRRadialMeter({
    required this.value,
    required this.semanticLabel,
    this.min = 0,
    this.max = 100,
    this.variant = TRStatusVariant.neutral,
    this.uiSize,
    super.key,
  });

  /// Current measured value.
  final double value;

  /// Inclusive lower bound.
  final double min;

  /// Inclusive upper bound.
  final double max;

  /// Localized assistive name for the otherwise label-free glyph.
  final String semanticLabel;

  /// Semantic status color of the filled arc.
  final TRStatusVariant variant;

  /// Token-backed glyph size.
  final TRUiSize? uiSize;

  double get _fraction {
    if (!value.isFinite || !min.isFinite || !max.isFinite || max <= min) {
      return 0;
    }
    return ((value - min) / (max - min)).clamp(0, 1).toDouble();
  }

  @override
  Widget build(BuildContext context) {
    final uiSize = TRUiDensityScope.resolveSize(context, this.uiSize);
    final colors = context.tinyrackTheme;
    final generated = Theme.of(context).brightness == Brightness.light
        ? TRGeneratedColors.light
        : TRGeneratedColors.dark;
    final fill = switch (variant) {
      TRStatusVariant.neutral => colors.textMuted,
      TRStatusVariant.info => colors.infoForeground,
      TRStatusVariant.success => colors.successForeground,
      TRStatusVariant.warning => colors.warningForeground,
      TRStatusVariant.danger => colors.dangerForeground,
    };
    final fraction = _fraction;
    final size = TRControlMetrics.iconSizeOf(uiSize);
    final strokeWidth = switch (uiSize) {
      TRUiSize.sm => TRGeneratedBorders.defaultWidth,
      TRUiSize.md ||
      TRUiSize.lg ||
      TRUiSize.xl => TRGeneratedBorders.strongWidth,
    };
    final duration = MediaQuery.disableAnimationsOf(context)
        ? Duration.zero
        : TRGeneratedMotion.normal;

    return Semantics(
      image: true,
      label: semanticLabel,
      value: '${(fraction * 100).round()}%',
      child: ExcludeSemantics(
        child: SizedBox.square(
          dimension: size,
          child: TweenAnimationBuilder<double>(
            curve: TRGeneratedMotion.easeOut,
            duration: duration,
            tween: Tween<double>(begin: fraction, end: fraction),
            builder: (context, animatedFraction, child) => CustomPaint(
              painter: _TRRadialMeterPainter(
                fraction: animatedFraction,
                track: generated.controlTrack,
                fill: fill,
                strokeWidth: strokeWidth,
              ),
            ),
          ),
        ),
      ),
    );
  }
}

final class _TRRadialMeterPainter extends CustomPainter {
  const _TRRadialMeterPainter({
    required this.fraction,
    required this.track,
    required this.fill,
    required this.strokeWidth,
  });

  final double fraction;
  final Color track;
  final Color fill;
  final double strokeWidth;

  @override
  void paint(Canvas canvas, Size size) {
    final center = size.center(Offset.zero);
    final radius = (size.shortestSide - strokeWidth) / 2;
    final bounds = Rect.fromCircle(center: center, radius: radius);
    canvas.drawCircle(
      center,
      radius,
      Paint()
        ..color = track
        ..style = PaintingStyle.stroke
        ..strokeWidth = strokeWidth,
    );
    if (fraction <= 0) return;
    canvas.drawArc(
      bounds,
      -math.pi / 2,
      math.pi * 2 * fraction,
      false,
      Paint()
        ..color = fill
        ..style = PaintingStyle.stroke
        ..strokeCap = StrokeCap.round
        ..strokeWidth = strokeWidth,
    );
  }

  @override
  bool shouldRepaint(_TRRadialMeterPainter oldDelegate) =>
      oldDelegate.fraction != fraction ||
      oldDelegate.track != track ||
      oldDelegate.fill != fill ||
      oldDelegate.strokeWidth != strokeWidth;
}
