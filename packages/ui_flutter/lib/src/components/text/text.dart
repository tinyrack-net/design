import 'package:material_ui/material_ui.dart';

import '../../generated/tokens.g.dart';
import '../../theme.dart';
import '../../tokens.dart';
import '../../types.dart';

// @tinyrack-preview text
/// Text rendered with a named Tinyrack typography role.
class TRText extends StatelessWidget {
  const TRText(
    this.data, {
    TRTextVariant this.variant = TRTextVariant.body,
    this.color,
    this.align,
    this.weight,
    this.truncate = false,
    this.maxLines,
    this.overflow,
    this.softWrap,
    super.key,
  });

  /// Text that keeps the ambient [DefaultTextStyle] instead of replacing it
  /// with a typography role.
  ///
  /// Tinyrack components style their slots by merging into the default text
  /// style, so a slot child that names its own role loses the size, color, and
  /// truncation its host applied. Use this in those slots, and the primary
  /// constructor wherever the text owns its own role.
  const TRText.inherit(
    this.data, {
    this.color,
    this.align,
    this.weight,
    this.truncate = false,
    this.maxLines,
    this.overflow,
    this.softWrap,
    super.key,
  }) : variant = null;

  final String data;

  /// The typography role, or `null` to inherit the ambient text style.
  final TRTextVariant? variant;
  final TRTextColor? color;
  final TRTextAlign? align;
  final TRTextWeight? weight;

  /// Clips the text to one ellipsized line.
  ///
  /// This is shorthand for [maxLines], [overflow], and [softWrap]; any of those
  /// passed explicitly wins.
  final bool truncate;
  final int? maxLines;
  final TextOverflow? overflow;
  final bool? softWrap;

  @override
  Widget build(BuildContext context) {
    final resolvedMaxLines = maxLines ?? (truncate ? 1 : null);
    final resolvedOverflow =
        overflow ?? (truncate ? TextOverflow.ellipsis : null);
    // Only a single-line clip may stop wrapping. A multi-line cap has to wrap
    // to reach its later lines.
    final resolvedSoftWrap =
        softWrap ?? (truncate && resolvedMaxLines == 1 ? false : null);
    final resolvedTextAlign = switch (align) {
      null => null,
      TRTextAlign.start => TextAlign.start,
      TRTextAlign.center => TextAlign.center,
      TRTextAlign.end => TextAlign.end,
    };
    final colors = context.tinyrackTheme;
    final resolvedColor = switch (color) {
      null => null,
      TRTextColor.defaultColor => colors.text,
      TRTextColor.muted => colors.textMuted,
      TRTextColor.placeholder => colors.textPlaceholder,
      TRTextColor.inverse => colors.textInverse,
      TRTextColor.primary => colors.primaryForeground,
      TRTextColor.info => colors.infoForeground,
      TRTextColor.success => colors.successForeground,
      TRTextColor.warning => colors.warningForeground,
      TRTextColor.danger => colors.dangerForeground,
    };
    final resolvedWeight = switch (weight) {
      null => null,
      TRTextWeight.regular => TRGeneratedFontWeights.regular,
      TRTextWeight.medium => TRGeneratedFontWeights.medium,
      TRTextWeight.heading => TRGeneratedFontWeights.heading,
      TRTextWeight.bold => TRGeneratedFontWeights.bold,
      TRTextWeight.strong => TRGeneratedFontWeights.strong,
    };

    final variant = this.variant;
    if (variant == null) {
      // A partial style with `inherit` left on merges into the ambient one, and
      // a null strut keeps the host's line metrics.
      return Text(
        data,
        maxLines: resolvedMaxLines,
        overflow: resolvedOverflow,
        softWrap: resolvedSoftWrap,
        style: resolvedColor == null && resolvedWeight == null
            ? null
            : TextStyle(color: resolvedColor, fontWeight: resolvedWeight),
        textAlign: resolvedTextAlign,
      );
    }

    final style = TRTypography.resolve(context, variant);
    final locale = Localizations.localeOf(context).languageCode;
    final resolvedTracking = switch ((variant, weight, locale)) {
      (TRTextVariant.body, TRTextWeight.regular, 'en') =>
        TRGeneratedFlutterRendering.textTrackingBodyRegularEn,
      (TRTextVariant.body, TRTextWeight.strong, 'en') =>
        TRGeneratedFlutterRendering.textTrackingBodyStrongEn,
      (TRTextVariant.bodySm, TRTextWeight.bold || TRTextWeight.heading, 'en') =>
        TRGeneratedFlutterRendering.textTrackingBodySmBoldEn,
      (TRTextVariant.bodySm, TRTextWeight.strong, 'en') =>
        TRGeneratedFlutterRendering.textTrackingBodySmStrongEn,
      (TRTextVariant.bodySm, TRTextWeight.strong, 'ja') =>
        TRGeneratedFlutterRendering.textTrackingBodySmStrongJa,
      (TRTextVariant.bodySm, TRTextWeight.strong, 'ko') =>
        TRGeneratedFlutterRendering.textTrackingBodySmStrongKo,
      (TRTextVariant.bodySm, _, 'ko') =>
        TRGeneratedFlutterRendering.textTrackingBodySmNonStrongKo,
      (
        TRTextVariant.caption,
        TRTextWeight.bold || TRTextWeight.heading,
        'en',
      ) =>
        TRGeneratedFlutterRendering.textTrackingCaptionBoldEn,
      (TRTextVariant.caption, TRTextWeight.strong, 'en') =>
        TRGeneratedFlutterRendering.textTrackingCaptionStrongEn,
      (TRTextVariant.caption, TRTextWeight.strong, 'ko') =>
        TRGeneratedFlutterRendering.textTrackingCaptionStrongKo,
      (TRTextVariant.caption, _, 'ko') =>
        TRGeneratedFlutterRendering.textTrackingCaptionNonStrongKo,
      (TRTextVariant.code, TRTextWeight.strong, 'en') =>
        TRGeneratedFlutterRendering.textTrackingCodeStrongEn,
      (TRTextVariant.code, TRTextWeight.strong, 'ko') =>
        TRGeneratedFlutterRendering.textTrackingCodeStrongKo,
      (TRTextVariant.code, _, 'en') =>
        TRGeneratedFlutterRendering.textTrackingCodeNonStrongEn,
      (TRTextVariant.code, _, 'ko') =>
        TRGeneratedFlutterRendering.textTrackingCodeNonStrongKo,
      (TRTextVariant.display, TRTextWeight.regular, 'en') =>
        TRGeneratedFlutterRendering.textTrackingDisplayRegularEn,
      (TRTextVariant.display, TRTextWeight.medium, 'en') =>
        TRGeneratedFlutterRendering.textTrackingDisplayMediumEn,
      (TRTextVariant.display, TRTextWeight.strong, 'en') =>
        TRGeneratedFlutterRendering.textTrackingDisplayStrongEn,
      (TRTextVariant.display, TRTextWeight.strong, 'ko') =>
        -TRGeneratedBorders.defaultWidth /
            (TRGeneratedSpacing.xs + TRGeneratedBorders.defaultWidth),
      (TRTextVariant.display, _, 'ko') =>
        TRGeneratedFlutterRendering.textTrackingDisplayNonStrongKo,
      (
        TRTextVariant.displayLg,
        TRTextWeight.bold || TRTextWeight.heading,
        'en',
      ) =>
        TRGeneratedFlutterRendering.textTrackingDisplayLgBoldEn,
      (TRTextVariant.headingLg, TRTextWeight.regular, 'en') =>
        TRGeneratedFlutterRendering.textTrackingHeadingLgRegularEn,
      (TRTextVariant.headingLg, TRTextWeight.strong, 'en') =>
        TRGeneratedFlutterRendering.textTrackingHeadingLgStrongEn,
      (TRTextVariant.headingLg, TRTextWeight.strong, 'ko') =>
        TRGeneratedFlutterRendering.textTrackingHeadingLgStrongKo,
      (TRTextVariant.headingMd, TRTextWeight.regular, 'en') =>
        TRGeneratedFlutterRendering.textTrackingHeadingMdRegularEn,
      (TRTextVariant.headingMd, TRTextWeight.strong, 'en') =>
        TRGeneratedFlutterRendering.textTrackingHeadingMdStrongEn,
      (TRTextVariant.headingSm, TRTextWeight.strong, 'en') =>
        TRGeneratedFlutterRendering.textTrackingHeadingSmStrongEn,
      (TRTextVariant.label, TRTextWeight.bold || TRTextWeight.heading, 'en') =>
        TRGeneratedFlutterRendering.textTrackingLabelBoldEn,
      (TRTextVariant.label, TRTextWeight.strong, 'en') =>
        TRGeneratedFlutterRendering.textTrackingLabelStrongEn,
      (TRTextVariant.label, TRTextWeight.strong, 'ko') =>
        TRGeneratedFlutterRendering.textTrackingLabelStrongKo,
      (TRTextVariant.label, _, 'ko') =>
        TRGeneratedFlutterRendering.textTrackingLabelNonStrongKo,
      _ =>
        weight == TRTextWeight.strong && locale != 'ja'
            ? -TRGeneratedBorders.defaultWidth /
                  (TRGeneratedSpacing.xs + TRGeneratedBorders.defaultWidth)
            : style.letterSpacing,
    };
    return Text(
      data,
      maxLines: resolvedMaxLines,
      overflow: resolvedOverflow,
      softWrap: resolvedSoftWrap,
      style: style.copyWith(
        color: resolvedColor,
        fontWeight: resolvedWeight,
        letterSpacing: resolvedTracking,
      ),
      strutStyle: StrutStyle(
        fontFamily: style.fontFamily,
        fontFamilyFallback: style.fontFamilyFallback,
        fontSize: style.fontSize,
        fontWeight: resolvedWeight ?? style.fontWeight,
        forceStrutHeight: true,
        height: style.height,
      ),
      textAlign: resolvedTextAlign ?? TextAlign.start,
    );
  }
}
