import 'package:flutter/material.dart';

import '../../generated/tokens.g.dart';
import '../../theme.dart';
import '../../types.dart';

// @tinyrack-preview alert
/// A persistent semantic status message.
class TRAlert extends StatelessWidget {
  const TRAlert({
    required this.title,
    this.actions = const [],
    this.description,
    this.icon,
    this.variant = TRStatusVariant.neutral,
    super.key,
  });

  final List<Widget> actions;
  final Widget? description;
  final Widget? icon;
  final TRStatusVariant variant;
  final Widget title;

  @override
  Widget build(BuildContext context) {
    final colors = context.tinyrackTheme;
    final generated = Theme.of(context).brightness == Brightness.light
        ? TRGeneratedColors.light
        : TRGeneratedColors.dark;
    final foreground = colors.foregroundForStatus(variant);
    final languageCode = Localizations.localeOf(context).languageCode;
    final descriptionHeight = languageCode == 'ko' || languageCode == 'ja'
        ? TRGeneratedFlutterRendering.alertCjkDescriptionLineHeight
        : TRGeneratedTypographyLineHeights.md;
    final content = Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisSize: MainAxisSize.min,
      children: [
        DefaultTextStyle.merge(
          style: TRGeneratedTextStyles.bodySm.copyWith(
            color: foreground,
            fontWeight: TRGeneratedFontWeights.strong,
            height: TRGeneratedTypographyLineHeights.sm,
          ),
          child: title,
        ),
        if (description case final description?)
          Padding(
            padding: const EdgeInsets.only(top: TRGeneratedSpacing.xs),
            child: DefaultTextStyle.merge(
              style: TRGeneratedTextStyles.bodySm.copyWith(
                color: colors.text,
                // CJK fallback metrics need a tighter multiplier to preserve
                // the same 21px CSS line box as IBM Plex Sans.
                height: descriptionHeight,
              ),
              child: description,
            ),
          ),
        if (actions.isNotEmpty)
          Padding(
            padding: const EdgeInsets.only(top: TRGeneratedSpacing.md),
            child: Wrap(
              spacing: TRGeneratedSpacing.sm,
              runSpacing: TRGeneratedSpacing.sm,
              children: actions,
            ),
          ),
      ],
    );
    return Semantics(
      container: true,
      liveRegion: variant != TRStatusVariant.neutral,
      child: DecoratedBox(
        decoration: BoxDecoration(
          color: colors.surfaceForStatus(variant, subtle: true),
          border: Border.all(
            color: variant == TRStatusVariant.neutral
                ? generated.controlBorder
                : colors.borderForStatus(variant),
            width: TRGeneratedBorders.defaultWidth,
          ),
          borderRadius: const BorderRadius.all(
            Radius.circular(TRGeneratedRadii.md),
          ),
        ),
        child: Padding(
          padding: EdgeInsets.symmetric(
            horizontal: TRGeneratedSpacing.lg + TRGeneratedBorders.defaultWidth,
            vertical: TRGeneratedSpacing.md + TRGeneratedBorders.defaultWidth,
          ),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              if (icon case final icon?) ...[
                IconTheme(
                  data: IconThemeData(color: foreground),
                  child: icon,
                ),
                const SizedBox(width: TRGeneratedSpacing.md),
              ],
              Expanded(child: content),
            ],
          ),
        ),
      ),
    );
  }
}
