import 'dart:io';

import 'package:flutter_test/flutter_test.dart';

void main() {
  test('terminal emulation is owned by termworld, not tinyrack_ui', () {
    final manifest = File('pubspec.yaml').readAsStringSync();
    final publicLibrary = File('lib/tinyrack_ui.dart').readAsStringSync();

    expect(manifest, isNot(contains('  xterm:')));
    expect(publicLibrary, isNot(contains("components/terminal/terminal.dart")));
    expect(
      File('lib/src/components/terminal/terminal.dart').existsSync(),
      isFalse,
    );
  });
}
