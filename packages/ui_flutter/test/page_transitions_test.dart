import 'package:flutter_test/flutter_test.dart';
import 'package:material_ui/material_ui.dart';
import 'package:tinyrack_ui/tinyrack_ui.dart';

void main() {
  test('none page transitions keep route lifecycle without visual motion', () {
    const builder = TRPageTransitionsBuilder.none();
    const child = SizedBox();

    expect(builder.transitionDuration, Duration.zero);
    expect(
      builder.buildTransitions<void>(
        null,
        null,
        const AlwaysStoppedAnimation<double>(1),
        const AlwaysStoppedAnimation<double>(0),
        child,
      ),
      same(child),
    );
  });
}
