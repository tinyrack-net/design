import 'package:flutter/material.dart';

import '../theme.dart';
import '../types.dart';

// @tinyrack-preview badge
/// A compact semantic status label.
class TRBadge extends StatelessWidget {
  const TRBadge({
    required this.child,
    this.intent = TRIntent.neutral,
    this.uiSize = TRUiSize.md,
    super.key,
  });

  final Widget child;
  final TRIntent intent;
  final TRUiSize uiSize;

  @override
  Widget build(BuildContext context) {
    final colors = context.tinyrackTheme;
    final vertical = uiSize == TRUiSize.lg ? 5.0 : 3.0;
    final horizontal = switch (uiSize) {
      TRUiSize.sm => 7.0,
      TRUiSize.md => 9.0,
      TRUiSize.lg => 11.0,
    };
    return DecoratedBox(
      decoration: BoxDecoration(
        color: colors.surfaceFor(intent),
        border: Border.all(color: colors.foregroundFor(intent)),
        borderRadius: const BorderRadius.all(Radius.circular(9999)),
      ),
      child: Padding(
        padding: EdgeInsets.symmetric(
          horizontal: horizontal,
          vertical: vertical,
        ),
        child: DefaultTextStyle.merge(
          style: Theme.of(context).textTheme.labelMedium?.copyWith(
            color: colors.foregroundFor(intent),
          ),
          child: child,
        ),
      ),
    );
  }
}
