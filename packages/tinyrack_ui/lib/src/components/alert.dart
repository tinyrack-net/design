import 'package:flutter/material.dart';

import '../generated/tokens.g.dart';
import '../theme.dart';
import '../types.dart';

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
        ? 1.45
        : 1.5;
    final content = Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisSize: MainAxisSize.min,
      children: [
        DefaultTextStyle.merge(
          style: TRGeneratedTextStyles.bodySm.copyWith(
            color: foreground,
            fontWeight: FontWeight.w700,
            height: 1.2,
          ),
          child: title,
        ),
        if (description case final description?)
          Padding(
            padding: const EdgeInsets.only(top: 4),
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
            padding: const EdgeInsets.only(top: 12),
            child: Wrap(spacing: 8, runSpacing: 8, children: actions),
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
          ),
          borderRadius: const BorderRadius.all(Radius.circular(6)),
        ),
        child: Padding(
          padding: EdgeInsets.symmetric(
            horizontal: TRGeneratedSpacing.lg + 1,
            vertical: TRGeneratedSpacing.md + 1,
          ),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              if (icon case final icon?) ...[
                IconTheme(
                  data: IconThemeData(color: foreground),
                  child: icon,
                ),
                const SizedBox(width: 12),
              ],
              Expanded(child: content),
            ],
          ),
        ),
      ),
    );
  }
}
