import 'package:flutter/material.dart';

import '../generated/tokens.g.dart';
import '../theme.dart';

// @tinyrack-preview code-block
/// A multi-line, scrollable monospace code surface.
///
/// This renders unhighlighted plain text. Tinyrack's React `TRCodeBlock`
/// supports pluggable syntax highlighting; that grammar-aware tokenization is
/// not reproduced here.
class TRCodeBlock extends StatelessWidget {
  const TRCodeBlock({required this.code, this.wrap = false, super.key});

  final String code;
  final bool wrap;

  @override
  Widget build(BuildContext context) {
    final colors = context.tinyrackTheme;
    final generated = Theme.of(context).brightness == Brightness.light
        ? TRGeneratedColors.light
        : TRGeneratedColors.dark;
    final content = Text(code, style: TRGeneratedTextStyles.code);

    return DecoratedBox(
      decoration: BoxDecoration(
        color: colors.surfaceMuted,
        border: Border.all(
          color: generated.border,
          width: TRGeneratedBorders.defaultWidth,
        ),
        borderRadius: BorderRadius.circular(TRGeneratedRadii.lg),
      ),
      child: Padding(
        // CSS border-box sizing adds the border outside the padding; the
        // decoration border here paints inside, so widen the inset by it.
        padding: const EdgeInsets.symmetric(
          horizontal: TRGeneratedSpacing.lg + TRGeneratedBorders.defaultWidth,
          vertical: TRGeneratedSpacing.md + TRGeneratedBorders.defaultWidth,
        ),
        child: wrap
            ? content
            : SingleChildScrollView(
                scrollDirection: Axis.horizontal,
                child: content,
              ),
      ),
    );
  }
}
