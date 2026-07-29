import 'package:flutter/material.dart';

import '../types.dart';

// @tinyrack-preview spinner
/// A progress indicator sized for Tinyrack controls.
class TRSpinner extends StatelessWidget {
  const TRSpinner({
    this.label,
    this.uiSize = TRUiSize.md,
    this.value,
    super.key,
  });

  final String? label;
  final TRUiSize uiSize;
  final double? value;

  @override
  Widget build(BuildContext context) {
    final size = switch (uiSize) {
      TRUiSize.sm => 16.0,
      TRUiSize.md => 20.0,
      TRUiSize.lg => 28.0,
    };
    final spinner = SizedBox.square(
      dimension: size,
      child: CircularProgressIndicator(strokeWidth: 2, value: value),
    );
    return label == null
        ? ExcludeSemantics(child: spinner)
        : Semantics(label: label, value: value?.toString(), child: spinner);
  }
}
