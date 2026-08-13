import 'package:material_ui/material_ui.dart';

import '../../generated/tokens.g.dart';
import '../../theme.dart';
import '../../types.dart';
import '../../ui_density.dart';

// @tinyrack-preview badge
/// A compact semantic status label.
class TRBadge extends StatelessWidget {
  const TRBadge({
    required this.child,
    this.variant = TRStatusVariant.neutral,
    this.uiSize,
    super.key,
  });

  final Widget child;
  final TRStatusVariant variant;
  final TRUiSize? uiSize;

  @override
  Widget build(BuildContext context) {
    final uiSize = TRUiDensityScope.resolveSize(context, this.uiSize);
    final colors = context.tinyrackTheme;
    final borderWidth = TRGeneratedBorders.defaultWidth;
    final vertical = switch (uiSize) {
      TRUiSize.sm => TRGeneratedSpacing.size3xs * 2 + borderWidth,
      TRUiSize.md => TRGeneratedSpacing.size3xs * 3 + borderWidth,
      TRUiSize.lg => TRGeneratedSpacing.xs + borderWidth,
      TRUiSize.xl => TRGeneratedSpacing.sm + borderWidth,
    };
    final horizontal = switch (uiSize) {
      TRUiSize.sm => TRGeneratedSpacing.xs + borderWidth,
      TRUiSize.md => TRGeneratedSpacing.sm + borderWidth,
      TRUiSize.lg => TRGeneratedControlMetrics.lgGap + borderWidth,
      TRUiSize.xl => TRGeneratedControlMetrics.xlGap + borderWidth,
    };
    final fontSize = switch (uiSize) {
      TRUiSize.sm => TRGeneratedTypographySizes.size2xs,
      TRUiSize.md => TRGeneratedTypographySizes.xs,
      TRUiSize.lg => TRGeneratedTypographySizes.sm,
      TRUiSize.xl => TRGeneratedTypographySizes.md,
    };
    final locale = Localizations.localeOf(context).languageCode;
    final letterSpacing = switch ((uiSize, locale)) {
      (TRUiSize.md, 'en') =>
        TRGeneratedBorders.defaultWidth / TRGeneratedSpacing.xs,
      (TRUiSize.lg, 'en') =>
        -TRGeneratedBorders.defaultWidth / TRGeneratedSpacing.xs,
      (TRUiSize.lg, 'ko') =>
        -TRGeneratedBorders.defaultWidth +
            TRGeneratedBorders.defaultWidth / TRGeneratedSpacing.md,
      (TRUiSize.xl, 'en' || 'ko') => TRGeneratedTypographyTracking.none,
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
