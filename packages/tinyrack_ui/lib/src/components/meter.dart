import 'package:flutter/material.dart';

import '../generated/tokens.g.dart';
import '../normal_line.dart';
import '../theme.dart';
import '../types.dart';

// @tinyrack-preview meter
/// A labeled measurement against a known range.
class TRMeter extends StatelessWidget {
  const TRMeter({
    required this.value,
    this.min = 0,
    this.max = 100,
    this.label,
    this.valueText,
    this.variant = TRStatusVariant.neutral,
    super.key,
  });

  final double value;
  final double min;
  final double max;
  final String? label;
  final String? valueText;
  final TRStatusVariant variant;

  @override
  Widget build(BuildContext context) {
    final colors = context.tinyrackTheme;
    final generated = Theme.of(context).brightness == Brightness.light
        ? TRGeneratedColors.light
        : TRGeneratedColors.dark;
    final fill = switch (variant) {
      TRStatusVariant.neutral => colors.text,
      TRStatusVariant.info => colors.info,
      TRStatusVariant.success => colors.success,
      TRStatusVariant.warning => colors.warning,
      TRStatusVariant.danger => colors.danger,
    };
    final fraction = ((value - min) / (max - min)).clamp(0.0, 1.0);

    return Semantics(
      value: '${(fraction * 100).round()}%',
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        mainAxisSize: MainAxisSize.min,
        spacing: TRGeneratedSpacing.sm,
        children: [
          if (label != null || valueText != null)
            Row(
              children: [
                if (label case final label?)
                  Expanded(
                    child: Text(
                      label,
                      style: TextStyle(
                        color: colors.text,
                        fontFamily: TRGeneratedFontFamilies.body,
                        fontSize: TRGeneratedTypographySizes.md,
                        fontWeight: TRGeneratedFontWeights.medium,
                        // The web label inherits `line-height: normal`.
                        height: normalLineHeightFor(
                          label,
                          TRGeneratedTypographySizes.md,
                          TRGeneratedFlutterRendering.normalLineMd,
                        ),
                      ),
                    ),
                  ),
                if (valueText case final valueText?)
                  Text(
                    valueText,
                    style: TextStyle(
                      color: colors.textMuted,
                      fontFamily: TRGeneratedFontFamilies.body,
                      fontSize: TRGeneratedTypographySizes.sm,
                      height: normalLineHeightFor(
                        valueText,
                        TRGeneratedTypographySizes.sm,
                        TRGeneratedFlutterRendering.normalLineSm,
                      ),
                    ),
                  ),
              ],
            ),
          ClipRRect(
            borderRadius: BorderRadius.circular(TRGeneratedRadii.full),
            child: SizedBox(
              height: TRGeneratedSpacing.sm,
              child: LinearProgressIndicator(
                backgroundColor: generated.controlTrack,
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
