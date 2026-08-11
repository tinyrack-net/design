import 'package:tinyrack_ui/tinyrack_ui.dart';

void main() {
  TinyrackTheme.light();
  TinyrackTheme.dark();
  const spacing = TRSpacing.small;
  assert(spacing > 0, 'The public token should resolve.');
}
