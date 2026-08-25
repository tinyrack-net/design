import 'package:material_ui/material_ui.dart';

import '../../generated/tokens.g.dart';
import '../../normal_line.dart';
import '../../theme.dart';
import '../../types.dart';

// @tinyrack-preview meter
/// A labeled measurement against a known range.
class TRMeter extends StatefulWidget {
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
  State<TRMeter> createState() => _TRMeterState();
}

class _TRMeterState extends State<TRMeter> {
  static double _fractionOf(TRMeter widget) {
    if (widget.max == widget.min) return 0;
    return ((widget.value - widget.min) / (widget.max - widget.min)).clamp(
      0.0,
      1.0,
    );
  }

  @override
  Widget build(BuildContext context) {
    final colors = context.tinyrackTheme;
    final generated = Theme.of(context).brightness == Brightness.light
        ? TRGeneratedColors.light
        : TRGeneratedColors.dark;
    final fill = switch (widget.variant) {
      TRStatusVariant.neutral => colors.text,
      TRStatusVariant.info => colors.infoForeground,
      TRStatusVariant.success => colors.successForeground,
      TRStatusVariant.warning => colors.warningForeground,
      TRStatusVariant.danger => colors.dangerForeground,
    };
    final fraction = _fractionOf(widget);
    final motionDuration = MediaQuery.disableAnimationsOf(context)
        ? Duration.zero
        : TRGeneratedMotion.normal;

    return Semantics(
      value: '${(fraction * 100).round()}%',
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        mainAxisSize: MainAxisSize.min,
        spacing: TRGeneratedSpacing.sm,
        children: [
          if (widget.label != null || widget.valueText != null)
            Row(
              children: [
                if (widget.label case final label?)
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
                if (widget.valueText case final valueText?)
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
              child: TweenAnimationBuilder<double>(
                curve: TRGeneratedMotion.easeOut,
                duration: motionDuration,
                tween: Tween<double>(begin: fraction, end: fraction),
                builder: (context, value, child) => LinearProgressIndicator(
                  backgroundColor: generated.controlTrack,
                  color: fill,
                  value: value,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
