import 'package:flutter/material.dart';

import '../generated/tokens.g.dart';
import '../theme.dart';
import '../types.dart';

/// The corner treatment of a [TRAvatar].
enum TRAvatarShape { circle, square }

// @tinyrack-preview avatar
/// A circular or square identity badge with an image or fallback initials.
class TRAvatar extends StatelessWidget {
  const TRAvatar({
    this.image,
    this.fallback,
    this.shape = TRAvatarShape.circle,
    this.uiSize = TRUiSize.md,
    super.key,
  });

  final ImageProvider? image;
  final String? fallback;
  final TRAvatarShape shape;
  final TRUiSize uiSize;

  @override
  Widget build(BuildContext context) {
    final colors = context.tinyrackTheme;
    final generated = Theme.of(context).brightness == Brightness.light
        ? TRGeneratedColors.light
        : TRGeneratedColors.dark;
    final size = switch (uiSize) {
      TRUiSize.sm => TRGeneratedControlMetrics.smHeight,
      TRUiSize.md => TRGeneratedControlMetrics.mdHeight,
      TRUiSize.lg => TRGeneratedControlMetrics.lgHeight,
    };
    final fontSize = switch (uiSize) {
      TRUiSize.sm => TRGeneratedTypographySizes.xs,
      TRUiSize.md => TRGeneratedTypographySizes.sm,
      TRUiSize.lg => TRGeneratedTypographySizes.md,
    };
    final radius = switch (shape) {
      TRAvatarShape.circle => TRGeneratedRadii.full,
      TRAvatarShape.square => TRGeneratedRadii.md,
    };

    return Semantics(
      image: image != null,
      label: fallback,
      child: Container(
        height: size,
        width: size,
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(radius),
          border: Border.all(
            color: generated.controlBorder,
            width: TRGeneratedBorders.defaultWidth,
          ),
          color: colors.surfaceMuted,
        ),
        clipBehavior: Clip.antiAlias,
        child: image != null
            ? Image(image: image!, fit: BoxFit.cover)
            : fallback != null
            ? Center(
                child: Text(
                  fallback!,
                  style: TextStyle(
                    color: colors.text,
                    fontFamily: TRGeneratedFontFamilies.body,
                    fontSize: fontSize,
                    fontWeight: TRGeneratedFontWeights.medium,
                    height: TRGeneratedTypographyLineHeights.xs,
                  ),
                ),
              )
            : null,
      ),
    );
  }
}
