import 'package:flutter/material.dart';

import '../generated/tokens.g.dart';
import '../theme.dart';
import '../tokens.dart';

String _groupThousands(String digits) {
  final buffer = StringBuffer();
  for (var i = 0; i < digits.length; i += 1) {
    if (i > 0 && (digits.length - i) % 3 == 0) buffer.write(',');
    buffer.write(digits[i]);
  }
  return buffer.toString();
}

/// Formats [value] with thousands separators and a fixed decimal precision.
String formatAnimatedNumber(double value, {int fractionDigits = 0}) {
  final fixed = value.toStringAsFixed(fractionDigits);
  final negative = fixed.startsWith('-');
  final unsigned = negative ? fixed.substring(1) : fixed;
  final parts = unsigned.split('.');
  final grouped = _groupThousands(parts[0]);
  final formatted = parts.length > 1 ? '$grouped.${parts[1]}' : grouped;
  return negative ? '-$formatted' : formatted;
}

// @tinyrack-preview animated-number
/// A numeric value that tweens smoothly toward a new target.
///
/// This reproduces Tinyrack's React `count` animation. The digit-slot `roll`
/// animation and locale-aware `Intl.NumberFormat` grouping are not
/// reproduced here; formatting uses a fixed-decimal thousands grouping.
class TRAnimatedNumber extends StatelessWidget {
  const TRAnimatedNumber({
    required this.value,
    this.fractionDigits = 0,
    super.key,
  });

  final double value;
  final int fractionDigits;

  @override
  Widget build(BuildContext context) {
    final colors = context.tinyrackTheme;
    return TweenAnimationBuilder<double>(
      curve: TRMotion.standard,
      duration: MediaQuery.disableAnimationsOf(context)
          ? Duration.zero
          : TRMotion.number,
      tween: Tween(end: value),
      builder: (context, animatedValue, child) => Text(
        formatAnimatedNumber(animatedValue, fractionDigits: fractionDigits),
        style: const TextStyle(
          fontFamily: TRGeneratedFontFamilies.body,
          fontFeatures: [FontFeature.tabularFigures()],
          // Digits are always latin; Chromium snaps their normal line box.
          height:
              TRGeneratedFlutterRendering.normalLineMd /
              TRGeneratedTypographySizes.md,
        ).copyWith(color: colors.text),
      ),
    );
  }
}
