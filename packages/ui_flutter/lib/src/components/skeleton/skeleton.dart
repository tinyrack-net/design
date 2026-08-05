import 'package:flutter/material.dart';

import '../../generated/tokens.g.dart';
import '../../internal/motion_boundary.dart';
import '../../tokens.dart';
import '../../types.dart';

// @tinyrack-preview skeleton
/// A placeholder surface shown while content is loading.
class TRSkeleton extends StatefulWidget {
  const TRSkeleton({
    this.shape = TRSkeletonShape.text,
    this.animate = true,
    this.width,
    super.key,
  });

  final TRSkeletonShape shape;
  final bool animate;
  final double? width;

  @override
  State<TRSkeleton> createState() => _TRSkeletonState();
}

class _TRSkeletonState extends State<TRSkeleton>
    with SingleTickerProviderStateMixin {
  late final AnimationController _controller;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(vsync: this, duration: TRMotion.loading);
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    _syncAnimation();
  }

  @override
  void didUpdateWidget(covariant TRSkeleton oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (widget.animate != oldWidget.animate) _syncAnimation();
  }

  void _syncAnimation() {
    final shouldAnimate =
        widget.animate && !MediaQuery.disableAnimationsOf(context);
    if (shouldAnimate) {
      if (!_controller.isAnimating) _controller.repeat();
      return;
    }
    _controller.stop();
    if (_controller.value != 0) _controller.value = 0;
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final generated = Theme.of(context).brightness == Brightness.light
        ? TRGeneratedColors.light
        : TRGeneratedColors.dark;
    final height = switch (widget.shape) {
      TRSkeletonShape.text => TRGeneratedTypographySizes.md,
      TRSkeletonShape.rectangle =>
        TRGeneratedMeasurements.skeletonRectangleHeight,
      TRSkeletonShape.circle => TRGeneratedSpacing.size3xl,
    };
    final radius = switch (widget.shape) {
      TRSkeletonShape.text => TRRadii.small,
      TRSkeletonShape.rectangle => TRRadii.large,
      TRSkeletonShape.circle => TRRadii.full,
    };
    final width = widget.shape == TRSkeletonShape.circle
        ? TRGeneratedSpacing.size3xl
        : widget.width ?? double.infinity;

    return Semantics(
      liveRegion: false,
      child: ClipRRect(
        borderRadius: BorderRadius.all(radius),
        child: SizedBox(
          height: height,
          width: width,
          child: ColoredBox(
            color: generated.skeletonFill,
            child: widget.animate
                ? AnimatedBuilder(
                    animation: _controller,
                    builder: (context, child) => TRMotionBoundary(
                      progress: _controller.value,
                      child: CustomPaint(
                        painter: _TRSkeletonShimmerPainter(
                          highlight: generated.skeletonHighlight,
                          progress: _controller.value,
                        ),
                      ),
                    ),
                  )
                : null,
          ),
        ),
      ),
    );
  }
}

class _TRSkeletonShimmerPainter extends CustomPainter {
  const _TRSkeletonShimmerPainter({
    required this.highlight,
    required this.progress,
  });

  final Color highlight;
  final double progress;

  @override
  void paint(Canvas canvas, Size size) {
    // CSS uses a 200%-wide transparent/highlight/transparent background whose
    // position travels from 200% to -100%. This is the equivalent canvas
    // coordinate system: the highlight center moves from -1x to +2x width.
    final center = size.width * (-1 + 3 * progress);
    final rect = Rect.fromLTWH(
      center - size.width,
      0,
      size.width * 2,
      size.height,
    );
    canvas.drawRect(
      Offset.zero & size,
      Paint()
        ..shader = LinearGradient(
          colors: [
            highlight.withValues(alpha: 0),
            highlight,
            highlight.withValues(alpha: 0),
          ],
        ).createShader(rect),
    );
  }

  @override
  bool shouldRepaint(_TRSkeletonShimmerPainter oldDelegate) =>
      oldDelegate.highlight != highlight || oldDelegate.progress != progress;
}
