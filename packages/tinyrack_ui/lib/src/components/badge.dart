import 'package:flutter/material.dart';

import '../generated/tokens.g.dart';
import '../theme.dart';
import '../types.dart';

// @tinyrack-preview badge
/// A compact semantic status label.
class TRBadge extends StatelessWidget {
  const TRBadge({
    required this.child,
    this.variant = TRStatusVariant.neutral,
    this.uiSize = TRUiSize.md,
    super.key,
  });

  final Widget child;
  final TRStatusVariant variant;
  final TRUiSize uiSize;

  @override
  Widget build(BuildContext context) {
    final colors = context.tinyrackTheme;
    final vertical = switch (uiSize) {
      TRUiSize.sm => 4.0,
      TRUiSize.md => TRGeneratedSpacing.xs + 1,
      TRUiSize.lg => 7.0,
    };
    final horizontal = switch (uiSize) {
      TRUiSize.sm => TRGeneratedSpacing.sm + 1,
      TRUiSize.md => 11.0,
      TRUiSize.lg => TRGeneratedSpacing.md + 1,
    };
    final fontSize = switch (uiSize) {
      TRUiSize.sm => TRGeneratedTypographySizes.xs,
      TRUiSize.md => TRGeneratedTypographySizes.sm,
      TRUiSize.lg => TRGeneratedTypographySizes.md,
    };
    return DecoratedBox(
      decoration: BoxDecoration(
        color: colors.surfaceForStatus(variant),
        border: Border.all(color: colors.borderForStatus(variant)),
        borderRadius: const BorderRadius.all(Radius.circular(9999)),
      ),
      child: Padding(
        padding: EdgeInsets.symmetric(
          horizontal: horizontal,
          vertical: vertical,
        ),
        child: DefaultTextStyle.merge(
          style: Theme.of(context).textTheme.labelMedium?.copyWith(
            color: colors.foregroundForStatus(variant),
            fontSize: fontSize,
            fontWeight: FontWeight.w700,
            height: 1,
            letterSpacing: 0,
          ),
          child: child,
        ),
      ),
    );
  }
}
