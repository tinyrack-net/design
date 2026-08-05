import 'package:flutter/material.dart';

import '../../generated/tokens.g.dart';
import '../../internal/motion_boundary.dart';
import '../../theme.dart';
import '../../types.dart';

// @tinyrack-preview progress
/// A linear determinate or indeterminate progress indicator.
class TRProgress extends StatefulWidget {
  const TRProgress({
    this.value,
    this.min = 0,
    this.max = 100,
    this.label,
    this.variant = TRStatusVariant.neutral,
    this.uiSize = TRUiSize.md,
    super.key,
  });

  /// The current value, or `null` for an indeterminate progress bar.
  final double? value;
  final double min;
  final double max;
  final String? label;
  final TRStatusVariant variant;
  final TRUiSize uiSize;

  @override
  State<TRProgress> createState() => _TRProgressState();
}

class _TRProgressState extends State<TRProgress>
    with SingleTickerProviderStateMixin {
  late final AnimationController _indeterminate = AnimationController(
    duration: TRGeneratedMotion.loading,
    vsync: this,
  );

  static double? _fractionOf(TRProgress widget) {
    if (widget.value == null) return null;
    if (widget.max == widget.min) return 0;
    return ((widget.value! - widget.min) / (widget.max - widget.min)).clamp(
      0.0,
      1.0,
    );
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    _syncIndeterminate();
  }

  @override
  void didUpdateWidget(covariant TRProgress oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.value != widget.value) _syncIndeterminate();
  }

  void _syncIndeterminate() {
    final shouldAnimate =
        widget.value == null && !MediaQuery.disableAnimationsOf(context);
    if (shouldAnimate) {
      if (!_indeterminate.isAnimating) _indeterminate.repeat();
    } else {
      _indeterminate
        ..stop()
        ..value = 0;
    }
  }

  @override
  void dispose() {
    _indeterminate.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final colors = context.tinyrackTheme;
    final fill = switch (widget.variant) {
      TRStatusVariant.neutral => colors.textMuted,
      TRStatusVariant.info => colors.info,
      TRStatusVariant.success => colors.success,
      TRStatusVariant.warning => colors.warning,
      TRStatusVariant.danger => colors.danger,
    };
    final height = switch (widget.uiSize) {
      TRUiSize.md => TRGeneratedSpacing.xs,
      TRUiSize.lg => TRGeneratedSpacing.sm,
    };
    final fraction = _fractionOf(widget);
    final motionDuration = MediaQuery.disableAnimationsOf(context)
        ? Duration.zero
        : TRGeneratedMotion.normal;

    return Semantics(
      value: fraction == null ? null : '${(fraction * 100).round()}%',
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        mainAxisSize: MainAxisSize.min,
        spacing: TRGeneratedSpacing.xs,
        children: [
          if (widget.label case final label?)
            Text(
              label,
              style: TextStyle(
                color: colors.text,
                fontFamily: TRGeneratedFontFamilies.body,
              ),
            ),
          ClipRRect(
            borderRadius: BorderRadius.circular(TRGeneratedRadii.full),
            child: SizedBox(
              height: height,
              child: fraction == null
                  ? ColoredBox(
                      color: colors.surfaceMuted,
                      child: AnimatedBuilder(
                        animation: _indeterminate,
                        builder: (context, child) => TRMotionBoundary(
                          progress: _indeterminate.value,
                          child: CustomPaint(
                            painter: _TRIndeterminateProgressPainter(
                              color: fill,
                              progress: _indeterminate.value,
                            ),
                          ),
                        ),
                      ),
                    )
                  : TweenAnimationBuilder<double>(
                      curve: TRGeneratedMotion.easeOut,
                      duration: motionDuration,
                      tween: Tween<double>(begin: fraction, end: fraction),
                      builder: (context, value, child) =>
                          LinearProgressIndicator(
                            backgroundColor: colors.surfaceMuted,
                            color: fill,
                            value: value,
                          ),
                    ),
            ),
          ),
        ],
      ),
    );
  }
}

class _TRIndeterminateProgressPainter extends CustomPainter {
  const _TRIndeterminateProgressPainter({
    required this.color,
    required this.progress,
  });

  final Color color;
  final double progress;

  @override
  void paint(Canvas canvas, Size size) {
    // Keep the CSS `from { translateX(-100%) }` endpoint fully outside the
    // clip during Flutter's sub-millisecond controller startup tick.
    if (progress < 0.001) return;
    final indicatorWidth = size.width * 2 / 5;
    final left = indicatorWidth * (-1 + 3.5 * progress);
    final rect = Rect.fromLTWH(left, 0, indicatorWidth, size.height);
    canvas.drawRRect(
      RRect.fromRectAndRadius(rect, Radius.circular(size.height / 2)),
      Paint()..color = color,
    );
  }

  @override
  bool shouldRepaint(_TRIndeterminateProgressPainter oldDelegate) =>
      oldDelegate.color != color || oldDelegate.progress != progress;
}
