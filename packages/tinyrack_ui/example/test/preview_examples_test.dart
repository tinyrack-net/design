import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:tinyrack_ui/tinyrack_ui.dart';

import '../lib/main.dart' as preview;
import '../lib/preview_examples.dart';

Widget _preview(String id) => MaterialApp(
  theme: TinyrackTheme.light(),
  home: Scaffold(
    body: Builder(
      builder: (context) =>
          previewExampleScenarios[id]!(context, const Locale('en')),
    ),
  ),
);

void main() {
  testWidgets('checkbox group playground reports the next selected values', (
    tester,
  ) async {
    final controller = TextEditingController();
    addTearDown(controller.dispose);
    Map<String, Object?>? reported;
    await tester.pumpWidget(
      MaterialApp(
        theme: TinyrackTheme.light(),
        home: Scaffold(
          body: preview.PreviewComponent(
            args: const {
              'disabled': false,
              'label': 'Rack features',
              'readOnly': false,
              'selectedValues': ['metrics', 'backups'],
            },
            component: 'checkbox-group',
            locale: 'en',
            measureKey: GlobalKey(),
            partKeys: {},
            textFieldController: controller,
            onStateChanged: (value) => reported = value,
          ),
        ),
      ),
    );

    expect(find.text('Rack features'), findsOneWidget);
    expect(find.text('Metrics'), findsOneWidget);
    await tester.tap(find.byType(TRCheckbox).first);
    await tester.pumpAndSettle();

    expect(reported, {
      'args': {
        'selectedValues': ['backups'],
      },
    });
  });

  testWidgets('checkbox group option example keeps interactive selection', (
    tester,
  ) async {
    await tester.pumpWidget(_preview('checkbox-group-options'));

    expect(find.text('✓'), findsOneWidget);
    await tester.tap(find.byType(TRCheckbox).at(1));
    await tester.pumpAndSettle();

    expect(find.text('✓'), findsNWidgets(2));
  });

  testWidgets('disabled checkbox group example blocks child activation', (
    tester,
  ) async {
    await tester.pumpWidget(_preview('checkbox-group-disabled'));

    final disabledGroup = find.byType(TRCheckboxGroup).last;
    final disabledCheckbox = find
        .descendant(of: disabledGroup, matching: find.byType(TRCheckbox))
        .first;
    expect(find.text('✓'), findsNWidgets(3));

    await tester.tap(disabledCheckbox);
    await tester.pumpAndSettle();

    expect(find.text('✓'), findsNWidgets(3));
  });
}
