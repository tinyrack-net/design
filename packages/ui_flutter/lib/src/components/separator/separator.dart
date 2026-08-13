import 'package:material_ui/material_ui.dart';

import '../../generated/tokens.g.dart';
import '../../theme.dart';
import '../../types.dart';

// @tinyrack-preview separator
/// A thin divider line between content regions.
class TRSeparator extends StatelessWidget {
  const TRSeparator({
    this.orientation = TRSeparatorOrientation.horizontal,
    this.minLength,
    this.variant = TRSeparatorVariant.defaultVariant,
    super.key,
  });

  final TRSeparatorOrientation orientation;
  final double? minLength;
  final TRSeparatorVariant variant;

  @override
  Widget build(BuildContext context) {
    final generated = Theme.of(context).brightness == Brightness.light
        ? TRGeneratedColors.light
        : TRGeneratedColors.dark;
    final thickness = TRGeneratedBorders.defaultWidth;
    final color = switch (variant) {
      TRSeparatorVariant.defaultVariant => generated.controlBorder,
      TRSeparatorVariant.muted => context.tinyrackTheme.border,
    };
    return Semantics(
      child: switch (orientation) {
        TRSeparatorOrientation.horizontal => ColoredBox(
          color: color,
          child: SizedBox(height: thickness, width: double.infinity),
        ),
        TRSeparatorOrientation.vertical => ConstrainedBox(
          constraints: BoxConstraints(
            minHeight: minLength ?? TRGeneratedSpacing.lg,
          ),
          child: ColoredBox(
            color: color,
            child: SizedBox(width: thickness, height: double.infinity),
          ),
        ),
      },
    );
  }
}
