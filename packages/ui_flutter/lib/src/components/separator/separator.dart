import 'package:flutter/material.dart';

import '../../generated/tokens.g.dart';
import '../../types.dart';

// @tinyrack-preview separator
/// A thin divider line between content regions.
class TRSeparator extends StatelessWidget {
  const TRSeparator({
    this.orientation = TRSeparatorOrientation.horizontal,
    this.minLength,
    super.key,
  });

  final TRSeparatorOrientation orientation;
  final double? minLength;

  @override
  Widget build(BuildContext context) {
    final generated = Theme.of(context).brightness == Brightness.light
        ? TRGeneratedColors.light
        : TRGeneratedColors.dark;
    final thickness = TRGeneratedBorders.defaultWidth;
    return Semantics(
      child: switch (orientation) {
        TRSeparatorOrientation.horizontal => ColoredBox(
          color: generated.controlBorder,
          child: SizedBox(height: thickness, width: double.infinity),
        ),
        TRSeparatorOrientation.vertical => ConstrainedBox(
          constraints: BoxConstraints(
            minHeight: minLength ?? TRGeneratedSpacing.lg,
          ),
          child: ColoredBox(
            color: generated.controlBorder,
            child: SizedBox(width: thickness, height: double.infinity),
          ),
        ),
      },
    );
  }
}
