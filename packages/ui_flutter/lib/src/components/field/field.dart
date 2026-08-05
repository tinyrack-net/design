import 'package:flutter/material.dart';

import '../../generated/tokens.g.dart';
import '../../theme.dart';
import '../../tokens.dart';

// @tinyrack-preview field
/// Labels a control with an optional description or error message.
class TRField extends StatelessWidget {
  const TRField({
    required this.control,
    this.label,
    this.description,
    this.errorText,
    this.disabled = false,
    super.key,
  });

  final Widget control;
  final String? label;
  final String? description;
  final String? errorText;
  final bool disabled;

  @override
  Widget build(BuildContext context) {
    final colors = context.tinyrackTheme;
    final supportingText = errorText ?? description;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisSize: MainAxisSize.min,
      spacing: TRGeneratedControlMetrics.mdGap,
      children: [
        if (label case final label?)
          Text(
            label.toUpperCase(),
            style: TextStyle(
              color: disabled ? colors.textMuted : colors.text,
              fontFamily: TRGeneratedFontFamilies.body,
              fontSize: TRGeneratedTypographySizes.xs,
              fontWeight: TRGeneratedFontWeights.strong,
              height: TRGeneratedTypographyLineHeights.xs,
              letterSpacing:
                  TRGeneratedTypographyTracking.md *
                  TRGeneratedTypographySizes.xs,
            ),
          ),
        AnimatedOpacity(
          curve: TRMotion.standard,
          duration: TRMotion.fast,
          opacity: disabled ? TRGeneratedOpacity.disabled : 1,
          child: control,
        ),
        if (supportingText case final supportingText?)
          Text(
            supportingText,
            strutStyle: const StrutStyle(
              fontFamily: TRGeneratedFontFamilies.body,
              fontSize: TRGeneratedTypographySizes.xs,
              forceStrutHeight: true,
              height: TRGeneratedTypographyLineHeights.md,
            ),
            style: TextStyle(
              color: errorText == null ? colors.textMuted : colors.danger,
              fontFamily: TRGeneratedFontFamilies.body,
              fontSize: TRGeneratedTypographySizes.xs,
              height: TRGeneratedTypographyLineHeights.md,
            ),
          ),
      ],
    );
  }
}
