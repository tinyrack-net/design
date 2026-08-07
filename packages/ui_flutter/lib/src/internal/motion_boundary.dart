import 'package:flutter/rendering.dart';
import 'package:flutter/widgets.dart';

/// Internal render marker used by tests and the preview to read animation phase.
///
/// It is deliberately not exported from the public package barrel.
class TRMotionBoundary extends SingleChildRenderObjectWidget {
  const TRMotionBoundary({required this.progress, super.child, super.key});

  final double progress;

  @override
  RenderTRMotionBoundary createRenderObject(BuildContext context) =>
      RenderTRMotionBoundary(progress: progress);

  @override
  void updateRenderObject(
    BuildContext context,
    RenderTRMotionBoundary renderObject,
  ) {
    renderObject.progress = progress;
  }
}

class RenderTRMotionBoundary extends RenderProxyBox {
  RenderTRMotionBoundary({required this._progress});

  double _progress;

  double get progress => _progress;

  set progress(double value) {
    if (_progress == value) return;
    _progress = value;
    markNeedsPaint();
  }
}
