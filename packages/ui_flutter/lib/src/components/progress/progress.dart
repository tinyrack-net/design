import 'package:flutter/material.dart';

import '../../generated/tokens.g.dart';
import '../../theme.dart';
import '../../types.dart';

// @tinyrack-preview progress
/// A linear determinate or indeterminate progress indicator.
class TRProgress extends StatelessWidget {
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
  Widget build(BuildContext context) {
    final colors = context.tinyrackTheme;
    final fill = switch (variant) {
      TRStatusVariant.neutral => colors.textMuted,
      TRStatusVariant.info => colors.info,
      TRStatusVariant.success => colors.success,
      TRStatusVariant.warning => colors.warning,
      TRStatusVariant.danger => colors.danger,
    };
    final height = switch (uiSize) {
      TRUiSize.sm => TRGeneratedSpacing.xs,
      TRUiSize.md => TRGeneratedSpacing.sm,
      TRUiSize.lg => TRGeneratedSpacing.md,
    };
    final fraction = value == null
        ? null
        : ((value! - min) / (max - min)).clamp(0.0, 1.0);

    return Semantics(
      value: fraction == null ? null : '${(fraction * 100).round()}%',
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        mainAxisSize: MainAxisSize.min,
        spacing: TRGeneratedSpacing.xs,
        children: [
          if (label case final label?)
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
              child: LinearProgressIndicator(
                backgroundColor: colors.surfaceMuted,
                color: fill,
                value: fraction,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
