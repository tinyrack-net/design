import 'package:flutter/material.dart';

import '../generated/tokens.g.dart';
import '../theme.dart';
import '../types.dart';

// @tinyrack-preview text
/// Text rendered with a named Tinyrack typography role.
class TRText extends StatelessWidget {
  const TRText(
    this.data, {
    this.variant = TRTextVariant.body,
    this.color,
    this.align,
    this.weight,
    this.truncate = false,
    this.maxLines,
    super.key,
  });

  final String data;
  final TRTextVariant variant;
  final TRTextColor? color;
  final TRTextAlign? align;
  final TRTextWeight? weight;
  final bool truncate;
  final int? maxLines;

  @override
  Widget build(BuildContext context) {
    final style = switch (variant) {
      TRTextVariant.caption => TRGeneratedTextStyles.caption,
      TRTextVariant.label => TRGeneratedTextStyles.label,
      TRTextVariant.body => TRGeneratedTextStyles.body,
      TRTextVariant.bodySm => TRGeneratedTextStyles.bodySm,
      TRTextVariant.code => TRGeneratedTextStyles.code,
      TRTextVariant.headingSm => TRGeneratedTextStyles.headingSm,
      TRTextVariant.headingMd => TRGeneratedTextStyles.headingMd,
      TRTextVariant.headingLg => TRGeneratedTextStyles.headingLg,
      TRTextVariant.display => TRGeneratedTextStyles.display,
      TRTextVariant.displayLg => TRGeneratedTextStyles.displayLg,
    };
    final colors = context.tinyrackTheme;
    final resolvedColor = switch (color) {
      null => null,
      TRTextColor.defaultColor => colors.text,
      TRTextColor.muted => colors.textMuted,
      TRTextColor.placeholder => colors.textPlaceholder,
      TRTextColor.inverse => colors.textInverse,
      TRTextColor.primary => colors.primary,
      TRTextColor.info => colors.info,
      TRTextColor.success => colors.success,
      TRTextColor.warning => colors.warning,
      TRTextColor.danger => colors.danger,
    };
    final resolvedWeight = switch (weight) {
      null => null,
      TRTextWeight.regular => TRGeneratedFontWeights.regular,
      TRTextWeight.medium => TRGeneratedFontWeights.medium,
      TRTextWeight.heading => TRGeneratedFontWeights.heading,
      TRTextWeight.bold => TRGeneratedFontWeights.bold,
      TRTextWeight.strong => TRGeneratedFontWeights.strong,
    };
    return Text(
      data,
      maxLines: truncate ? 1 : maxLines,
      overflow: truncate ? TextOverflow.ellipsis : null,
      softWrap: truncate ? false : null,
      style: style.copyWith(
        color: resolvedColor,
        fontWeight: resolvedWeight,
        letterSpacing: style.letterSpacing,
      ),
      strutStyle: StrutStyle(
        fontFamily: style.fontFamily,
        fontFamilyFallback: style.fontFamilyFallback,
        fontSize: style.fontSize,
        fontWeight: resolvedWeight ?? style.fontWeight,
        forceStrutHeight: true,
        height: style.height,
      ),
      textAlign: switch (align) {
        null || TRTextAlign.start => TextAlign.start,
        TRTextAlign.center => TextAlign.center,
        TRTextAlign.end => TextAlign.end,
      },
    );
  }
}
