import 'dart:io';

import 'package:flutter_test/flutter_test.dart';

Iterable<File> _dartFiles(Directory directory) sync* {
  for (final entity in directory.listSync(recursive: true)) {
    if (entity is File && entity.path.endsWith('.dart')) yield entity;
  }
}

void main() {
  test('shared option states never paint the focus border', () {
    final source = File('lib/src/internal/layer.dart').readAsStringSync();
    final optionSource = source
        .split('static ButtonStyle option(')
        .last
        .split('static ButtonStyle menuItem(')
        .first;

    expect(optionSource, contains('colors.surfaceHover'));
    expect(optionSource, contains('colors.surfaceSelected'));
    expect(optionSource, isNot(contains('colors.focus')));
  });

  test('focus-colored WidgetState borders are gated by keyboard modality', () {
    final violations = <String>[];

    for (final file in _dartFiles(Directory('lib/src'))) {
      final source = file.readAsStringSync();
      if (!source.contains('WidgetState.focused') ||
          !source.contains('colors.focus')) {
        continue;
      }
      if (!source.contains('TRFocusSource.instance.isKeyboardFocus') &&
          !source.contains('TRFocusSourceMixin') &&
          !source.contains('focusVisible(')) {
        violations.add(file.path);
      }
    }

    expect(violations, isEmpty);
  });

  test('select options do not infer focus chrome from selection', () {
    final source = File(
      'lib/src/components/select/select_options.dart',
    ).readAsStringSync();

    expect(source, contains('TRFocusSource.instance.isKeyboardFocus'));
    expect(source, isNot(contains('selected && highlightSelected')));
    expect(source, isNot(contains('highlightSelected:')));
  });
}
