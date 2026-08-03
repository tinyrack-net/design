import 'package:flutter/material.dart';

import '../../generated/tokens.g.dart';
import '../../theme.dart';
import '../../types.dart';

// @tinyrack-preview badge
/// A compact semantic status label.
class TRBadge extends StatelessWidget {
  const TRBadge({
    required this.child,
    this.variant = TRStatusVariant.neutral,
    this.uiSize = TRUiSize.md,
    super.key,
  });

  final Widget child;
  final TRStatusVariant variant;
  final TRUiSize uiSize;

  @override
  Widget build(BuildContext context) {
    final colors = context.tinyrackTheme;
    final borderWidth = TRGeneratedBorders.defaultWidth;
    final vertical = switch (uiSize) {
      TRUiSize.sm => TRGeneratedSpacing.size3xs * 3 + borderWidth,
      TRUiSize.md => TRGeneratedSpacing.xs + borderWidth,
      TRUiSize.lg => TRGeneratedControlMetrics.smGap + borderWidth,
    };
    final horizontal = switch (uiSize) {
      TRUiSize.sm => TRGeneratedSpacing.sm + borderWidth,
      TRUiSize.md => TRGeneratedControlMetrics.lgGap + borderWidth,
      TRUiSize.lg => TRGeneratedSpacing.md + borderWidth,
    };
    final fontSize = switch (uiSize) {
      TRUiSize.sm => TRGeneratedTypographySizes.xs,
      TRUiSize.md => TRGeneratedTypographySizes.sm,
      TRUiSize.lg => TRGeneratedTypographySizes.md,
    };
    final locale = Localizations.localeOf(context).languageCode;
    final letterSpacing = switch ((uiSize, locale)) {
      (TRUiSize.sm, 'en') =>
        TRGeneratedBorders.defaultWidth / TRGeneratedSpacing.xs,
      (TRUiSize.md, 'en') =>
        -TRGeneratedBorders.defaultWidth / TRGeneratedSpacing.xs,
      (TRUiSize.md, 'ko') =>
        -TRGeneratedBorders.defaultWidth +
            TRGeneratedBorders.defaultWidth / TRGeneratedSpacing.md,
      _ =>
        TRGeneratedBorders.defaultWidth /
            (TRGeneratedSpacing.sm - TRGeneratedBorders.defaultWidth),
    };
    return DecoratedBox(
      decoration: BoxDecoration(
        color: colors.surfaceForStatus(variant),
        border: Border.all(
          color: colors.borderForStatus(variant),
          width: borderWidth,
        ),
        borderRadius: const BorderRadius.all(
          Radius.circular(TRGeneratedRadii.full),
        ),
      ),
      child: Padding(
        padding: EdgeInsets.symmetric(
          horizontal: horizontal,
          vertical: vertical,
        ),
        child: DefaultTextStyle.merge(
          style: Theme.of(context).textTheme.labelMedium?.copyWith(
            color: colors.foregroundForStatus(variant),
            fontSize: fontSize,
            fontWeight: TRGeneratedFontWeights.strong,
            height: TRGeneratedTypographyLineHeights.xs,
            letterSpacing: letterSpacing,
          ),
          child: child,
        ),
      ),
    );
  }
}
