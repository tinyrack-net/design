import 'package:flutter/material.dart';

import '../../generated/tokens.g.dart';
import '../../theme.dart';

// @tinyrack-preview code
/// An inline monospace code chip.
///
/// Matches the web contract: the font size is inherited from the surrounding
/// text and the line box uses the font's natural metrics.
class TRCode extends StatelessWidget {
  const TRCode(this.data, {super.key});

  final String data;

  @override
  Widget build(BuildContext context) {
    final colors = context.tinyrackTheme;
    return DecoratedBox(
      decoration: BoxDecoration(
        color: colors.surfaceMuted,
        border: Border.all(
          color: colors.border,
          width: TRGeneratedBorders.defaultWidth,
        ),
        borderRadius: const BorderRadius.all(
          Radius.circular(TRGeneratedRadii.sm),
        ),
      ),
      child: Padding(
        // CSS border-box sizing adds the border outside the padding; the
        // decoration border here paints inside, so widen the inset by it.
        padding: const EdgeInsets.symmetric(
          horizontal: TRGeneratedSpacing.xs + TRGeneratedBorders.defaultWidth,
          vertical:
              TRGeneratedSpacing.size3xs + TRGeneratedBorders.defaultWidth,
        ),
        child: Text(
          data,
          style: TextStyle(
            color: colors.text,
            fontFamily: TRGeneratedFontFamilies.mono,
            letterSpacing:
                TRGeneratedBorders.defaultWidth /
                (TRGeneratedSpacing.size3xs +
                    TRGeneratedBorders.defaultWidth * 1.5),
            // Chromium sizes an inline code box from the font's normal
            // metrics; CanvasKit resolves them slightly taller.
            height: TRGeneratedFlutterRendering.codeInlineLineHeight,
          ),
        ),
      ),
    );
  }
}
