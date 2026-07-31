import 'package:flutter/material.dart';

import '../generated/tokens.g.dart';
import '../tokens.dart';
import '../types.dart';

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
    if (widget.animate) _controller.repeat();
  }

  @override
  void didUpdateWidget(covariant TRSkeleton oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (widget.animate != oldWidget.animate) {
      if (widget.animate) {
        _controller.repeat();
      } else {
        _controller.stop();
      }
    }
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
      TRSkeletonShape.circle => TRGeneratedControlMetrics.lgHeight,
    };
    final radius = switch (widget.shape) {
      TRSkeletonShape.text => TRRadii.small,
      TRSkeletonShape.rectangle => TRRadii.large,
      TRSkeletonShape.circle => TRRadii.full,
    };
    final width = widget.shape == TRSkeletonShape.circle
        ? TRGeneratedControlMetrics.lgHeight
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
                    builder: (context, child) => ShaderMask(
                      blendMode: BlendMode.srcATop,
                      shaderCallback: (bounds) {
                        final t = _controller.value;
                        return LinearGradient(
                          begin: Alignment(-1.0 + t * 3, 0),
                          end: Alignment(t * 3, 0),
                          colors: [
                            generated.skeletonFill,
                            generated.skeletonHighlight,
                            generated.skeletonFill,
                          ],
                        ).createShader(bounds);
                      },
                      child: ColoredBox(color: generated.skeletonFill),
                    ),
                  )
                : null,
          ),
        ),
      ),
    );
  }
}
