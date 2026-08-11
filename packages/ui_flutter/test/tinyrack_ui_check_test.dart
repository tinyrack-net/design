import 'dart:convert';
import 'dart:io';

import 'package:flutter_test/flutter_test.dart';
import 'package:tinyrack_ui/tinyrack_ui_check.dart';

void main() {
  late Directory root;

  setUp(() {
    root = Directory.systemTemp.createTempSync('tinyrack-flutter-check-');
    Directory('${root.path}/lib').createSync();
  });

  tearDown(() => root.deleteSync(recursive: true));

  void source(String value) =>
      File('${root.path}/lib/main.dart').writeAsStringSync(value);

  test('the checker version stays aligned with the package manifest', () {
    final pubspec = File('pubspec.yaml').readAsStringSync();
    expect(pubspec, contains('version: ${TinyrackCheckResult.packageVersion}'));
  });

  test('accepts public tokens, components, aliases, and both themes', () async {
    source('''
      import 'package:tinyrack_ui/tinyrack_ui.dart';
      const gap = TRSpacing.medium;
      final padding = EdgeInsets.all(gap);
      final light = TinyrackTheme.light();
      final dark = TinyrackTheme.dark();
      final button = TRButton(label: 'Save', onPressed: () {});
    ''');
    expect(
      (await checkTinyrackProject(
        TinyrackCheckOptions(root: root.path),
      )).violations,
      isEmpty,
    );
  });

  test(
    'rejects named design literals, Material controls, and private imports',
    () async {
      source('''
      import 'package:flutter/material.dart';
      import 'package:tinyrack_ui/src/theme.dart';
      final inset = EdgeInsets.only(left: 20, bottom: 4);
      final button = ElevatedButton(onPressed: () {}, child: const Text('Save'));
      final light = TinyrackTheme.light();
      final dark = TinyrackTheme.dark();
    ''');
      final rules = (await checkTinyrackProject(
        TinyrackCheckOptions(root: root.path),
      )).violations.map((violation) => violation.ruleId);
      expect(rules.where((rule) => rule == 'tokens/no-literal'), hasLength(2));
      expect(rules, contains('components/no-material-equivalent'));
      expect(rules, contains('imports/no-private-tinyrack'));
    },
  );

  test('follows local constants that would otherwise hide a literal', () async {
    source('''
      import 'package:tinyrack_ui/tinyrack_ui.dart';
      const gap = 20.0;
      final inset = EdgeInsets.all(gap);
      final light = TinyrackTheme.light();
      final dark = TinyrackTheme.dark();
    ''');
    final result = await checkTinyrackProject(
      TinyrackCheckOptions(root: root.path),
    );
    expect(
      result.violations.map((violation) => violation.ruleId),
      contains('tokens/no-literal'),
    );
  });

  test('does not trust locally spoofed token class names', () async {
    source('''
      abstract final class TRSpacing { static const medium = 20.0; }
      const gap = TRSpacing.medium;
      final inset = EdgeInsets.all(gap);
      final light = TinyrackTheme.light();
      final dark = TinyrackTheme.dark();
    ''');
    final result = await checkTinyrackProject(
      TinyrackCheckOptions(root: root.path),
    );
    expect(
      result.violations.map((violation) => violation.ruleId),
      contains('tokens/no-literal'),
    );
  });

  test('supports reasoned suppressions and stable JSON output', () async {
    source('''
      import 'package:tinyrack_ui/tinyrack_ui.dart';
      // tinyrack-check-ignore-next-line tokens/no-literal -- data-owned canvas coordinate
      final inset = EdgeInsets.only(left: 20);
      final light = TinyrackTheme.light();
      final dark = TinyrackTheme.dark();
    ''');
    final result = await checkTinyrackProject(
      TinyrackCheckOptions(root: root.path),
    );
    expect(result.violations, isEmpty);
    expect(
      jsonDecode(formatTinyrackCheckResult(result, TinyrackCheckFormat.json)),
      containsPair('platform', 'flutter'),
    );
  });

  test('resolves a custom config relative to the project root', () async {
    source('''
      import 'package:tinyrack_ui/tinyrack_ui.dart';
      final inset = EdgeInsets.all(20);
      final light = TinyrackTheme.light();
      final dark = TinyrackTheme.dark();
    ''');
    File('${root.path}/custom.json').writeAsStringSync(
      jsonEncode(<String, Object>{
        'exclude': <String>['lib/**'],
      }),
    );
    final result = await checkTinyrackProject(
      TinyrackCheckOptions(configPath: 'custom.json', root: root.path),
    );
    expect(result.checkedFiles, 0);
    expect(result.violations, isEmpty);
  });

  test('reports syntax errors as checker errors', () async {
    source('final broken = ;');
    await expectLater(
      checkTinyrackProject(TinyrackCheckOptions(root: root.path)),
      throwsA(isA<FormatException>()),
    );
  });
}
