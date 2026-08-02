import 'dart:math';

import 'package:flutter/material.dart';

import '../../generated/tokens.g.dart';
import '../../theme.dart';
import '../../types.dart';

// @tinyrack-preview spinner
/// A progress indicator sized for Tinyrack controls.
class TRSpinner extends StatefulWidget {
  const TRSpinner({
    this.label,
    this.uiSize = TRUiSize.md,
    this.value,
    this.variant = TRSpinnerVariant.current,
    super.key,
  });

  final String? label;
  final TRUiSize uiSize;
  final double? value;
  final TRSpinnerVariant variant;

  @override
  State<TRSpinner> createState() => _TRSpinnerState();
}

class _TRSpinnerState extends State<TRSpinner>
    with SingleTickerProviderStateMixin {
  late final AnimationController _rotation = AnimationController(
    duration: TRGeneratedMotion.loading,
    vsync: this,
  );

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    _syncAnimation();
  }

  void _syncAnimation() {
    if (widget.value != null || MediaQuery.disableAnimationsOf(context)) {
      _rotation
        ..stop()
        ..value = 0;
    } else if (!_rotation.isAnimating) {
      _rotation.repeat();
    }
  }

  @override
  void didUpdateWidget(TRSpinner oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.value != widget.value) _syncAnimation();
  }

  @override
  void dispose() {
    _rotation.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final size = switch (widget.uiSize) {
      TRUiSize.sm => TRGeneratedSpinnerMetrics.sizeSm,
      TRUiSize.md => TRGeneratedSpinnerMetrics.sizeMd,
      TRUiSize.lg => TRGeneratedSpinnerMetrics.sizeLg,
    };
    final colors = context.tinyrackTheme;
    final color = switch (widget.variant) {
      TRSpinnerVariant.current => IconTheme.of(context).color ?? colors.text,
      TRSpinnerVariant.muted => colors.textMuted,
      TRSpinnerVariant.primary => colors.primary,
      TRSpinnerVariant.danger => colors.danger,
    };
    final spinner = SizedBox.square(
      dimension: size,
      child: RotationTransition(
        turns: _rotation,
        child: CustomPaint(
          painter: _TRSpinnerPainter(color: color, value: widget.value),
        ),
      ),
    );
    return widget.label == null
        ? ExcludeSemantics(child: spinner)
        : Semantics(
            label: widget.label,
            value: widget.value?.toString(),
            child: spinner,
          );
  }
}

class _TRSpinnerPainter extends CustomPainter {
  const _TRSpinnerPainter({required this.color, required this.value});

  final Color color;
  final double? value;

  @override
  void paint(Canvas canvas, Size size) {
    final spinnerColor = color;
    const strokeWidth = TRGeneratedSpinnerMetrics.strokeWidth;
    final bounds = Offset.zero & size;
    final arcBounds = bounds.deflate(strokeWidth / 2);
    final paint = Paint()
      ..isAntiAlias = true
      ..style = PaintingStyle.stroke
      ..strokeCap = StrokeCap.butt
      ..strokeWidth = strokeWidth;
    canvas.drawOval(
      arcBounds,
      paint
        ..color = spinnerColor.withValues(
          alpha: TRGeneratedSpinnerOpacity.track,
        ),
    );
    canvas.drawArc(
      arcBounds,
      value == null ? -3 * pi / 4 : -pi / 2,
      value == null ? pi / 2 : 2 * pi * value!.clamp(0, 1),
      false,
      paint..color = spinnerColor,
    );
  }

  @override
  bool shouldRepaint(_TRSpinnerPainter oldDelegate) =>
      color != oldDelegate.color || value != oldDelegate.value;
}
