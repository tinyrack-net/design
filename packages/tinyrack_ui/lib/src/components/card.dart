import 'package:flutter/material.dart';

import '../theme.dart';

// @tinyrack-preview card
/// A structured Tinyrack content surface.
class TRCard extends StatelessWidget {
  const TRCard({
    required this.child,
    this.padding = const EdgeInsets.all(16),
    this.semanticContainer = true,
    super.key,
  });

  final Widget child;
  final EdgeInsetsGeometry padding;
  final bool semanticContainer;

  @override
  Widget build(BuildContext context) {
    final colors = context.tinyrackTheme;
    return Card(
      clipBehavior: Clip.antiAlias,
      color: colors.surface,
      margin: EdgeInsets.zero,
      semanticContainer: semanticContainer,
      shape: RoundedRectangleBorder(
        borderRadius: const BorderRadius.all(Radius.circular(8)),
        side: BorderSide(color: colors.border),
      ),
      child: Padding(padding: padding, child: child),
    );
  }
}
