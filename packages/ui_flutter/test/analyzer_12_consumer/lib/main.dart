import 'package:tinyrack_ui/tinyrack_ui.dart';
import 'package:flutter/widgets.dart';

void main() {
  TinyrackTheme.light();
  TinyrackTheme.dark();
  const spacing = TRSpacing.small;
  const padding = EdgeInsets.all(TRSpacing.small);
  assert(spacing > 0, 'The public token should resolve.');
  assert(padding != EdgeInsets.zero, 'The public token should resolve.');
}
