import 'dart:convert';
import 'dart:io';

import 'package:flutter_test/flutter_test.dart';
import 'package:tinyrack_ui/tinyrack_ui_check.dart';

void main() {
  late Directory root;

  setUp(() {
    final fixtures = Directory(
      '${Directory.current.path}/.dart_tool/tinyrack-flutter-check-tests',
    )..createSync(recursive: true);
    root = fixtures.createTempSync('case-');
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

  test('resolves prefixed, named, overlay, feedback, and icon APIs', () async {
    source('''
      import 'package:flutter/material.dart' as material;
      import 'package:flutter/cupertino.dart' as cupertino;
      import 'package:tinyrack_ui/tinyrack_ui.dart';

      void build(material.BuildContext context) {
        material.FilledButton.tonal(onPressed: () {}, child: const material.Text('Save'));
        cupertino.CupertinoButton(onPressed: () {}, child: const material.Text('Save'));
        material.showDialog<void>(context: context, builder: (_) => const material.Dialog());
        material.ScaffoldMessenger.of(context).showSnackBar(const material.SnackBar(content: material.Text('Saved')));
        const material.Icon(material.Icons.add);
        const cupertino.Icon(cupertino.CupertinoIcons.add);
        final color = material.Colors.red;
        final weight = material.FontWeight.w500;
        final text = material.Theme.of(context).textTheme;
        assert(color != null && weight != null && text != null);
      }

      final light = TinyrackTheme.light();
      final dark = TinyrackTheme.dark();
    ''');
    final rules = (await checkTinyrackProject(
      TinyrackCheckOptions(root: root.path),
    )).violations.map((violation) => violation.ruleId).toList();

    expect(
      rules.where((rule) => rule == 'components/no-material-equivalent'),
      hasLength(5),
    );
    expect(rules.where((rule) => rule == 'tokens/no-literal'), hasLength(5));
  });

  test('does not reject unrelated local symbols with Flutter names', () async {
    source('''
      import 'package:tinyrack_ui/tinyrack_ui.dart';

      class Card { const Card(); }
      class Icons { static const add = 'add'; }
      void showDialog() {}

      final card = const Card();
      final icon = Icons.add;
      final overlay = showDialog();
      final light = TinyrackTheme.light();
      final dark = TinyrackTheme.dark();
    ''');

    expect(
      (await checkTinyrackProject(
        TinyrackCheckOptions(root: root.path),
      )).violations,
      isEmpty,
    );
  });

  test('follows local constants that would otherwise hide a literal', () async {
    source('''
      import 'package:flutter/material.dart';
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
      import 'package:flutter/material.dart';
      import 'package:tinyrack_ui/tinyrack_ui.dart' as tr;
      abstract final class TRSpacing { static const medium = 20.0; }
      const gap = TRSpacing.medium;
      final inset = EdgeInsets.all(gap);
      final light = tr.TinyrackTheme.light();
      final dark = tr.TinyrackTheme.dark();
    ''');
    final result = await checkTinyrackProject(
      TinyrackCheckOptions(root: root.path),
    );
    expect(
      result.violations.map((violation) => violation.ruleId),
      contains('tokens/no-literal'),
    );
  });

  test('rejects every literal mixed into a public token expression', () async {
    source('''
      import 'package:flutter/material.dart';
      import 'package:tinyrack_ui/tinyrack_ui.dart';
      const gap = TRSpacing.medium;
      final inset = EdgeInsets.all(gap + 123);
      final opacity = Opacity(opacity: TROpacity.disabled * 0.5, child: const SizedBox());
      final width = SizedBox(width: TRMeasurements.measureSm * 2);
      final light = TinyrackTheme.light();
      final dark = TinyrackTheme.dark();
    ''');
    final rules = (await checkTinyrackProject(
      TinyrackCheckOptions(root: root.path),
    )).violations.map((violation) => violation.ruleId);

    expect(rules.where((rule) => rule == 'tokens/no-literal'), hasLength(3));
  });

  test('accepts token-only composition and runtime-derived geometry', () async {
    source('''
      import 'package:flutter/material.dart';
      import 'package:tinyrack_ui/tinyrack_ui.dart';

      Widget build(BoxConstraints constraints, int depth) => SizedBox(
        width: TRSpacing.medium + TRSpacing.small,
        height: constraints.maxHeight,
        child: SizedBox(width: TRSpacing.medium * depth),
      );

      final light = TinyrackTheme.light();
      final dark = TinyrackTheme.dark();
    ''');

    expect(
      (await checkTinyrackProject(
        TinyrackCheckOptions(root: root.path),
      )).violations,
      isEmpty,
    );
  });

  test('allows product policy APIs owned by the consumer', () async {
    source('''
      import 'package:flutter/material.dart';
      import 'package:lucide_flutter/lucide_flutter.dart';
      import 'package:tinyrack_ui/tinyrack_ui.dart';

      final icon = LucideIcons.plus;
      final drawer = TRDrawer(content: const SizedBox());
      final light = TinyrackTheme.light();
      final dark = TinyrackTheme.dark();
    ''');

    expect(
      (await checkTinyrackProject(
        TinyrackCheckOptions(root: root.path),
      )).violations,
      isEmpty,
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
    expect(
      formatTinyrackCheckResult(result),
      'Tinyrack UI check passed (1 files).',
    );
    expect(
      formatTinyrackCheckResult(result, TinyrackCheckFormat.github),
      'Tinyrack UI check passed (1 files).',
    );
  });

  test('does not accept local methods that spoof theme setup', () async {
    source('''
      class TinyrackTheme {
        static void light() {}
        static void dark() {}
      }
      void main() {
        TinyrackTheme.light();
        TinyrackTheme.dark();
      }
    ''');
    final rules = (await checkTinyrackProject(
      TinyrackCheckOptions(root: root.path),
    )).violations.map((violation) => violation.ruleId);

    expect(
      rules.where((rule) => rule == 'setup/require-tinyrack-theme'),
      hasLength(2),
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
