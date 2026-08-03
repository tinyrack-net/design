import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:tinyrack_ui/tinyrack_ui.dart';
import 'package:tinyrack_ui_example/main.dart' as preview;
import 'package:tinyrack_ui_example/preview_examples.dart';

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
  testWidgets('otp field examples build every registered scenario', (
    tester,
  ) async {
    for (final id in const [
      'otp-field-sizes',
      'otp-field-states',
      'otp-field-validation',
      'otp-field-masked',
    ]) {
      await tester.pumpWidget(_preview(id));
      await tester.pumpAndSettle();
      expect(find.byType(TROtpField), findsWidgets, reason: id);
    }
  });

  testWidgets('otp validation example reports a short code on submit', (
    tester,
  ) async {
    await tester.pumpWidget(_preview('otp-field-validation'));
    await tester.enterText(find.byType(TextField), '123');
    await tester.pump();
    await tester.tap(find.text('Verify'));
    await tester.pumpAndSettle();
    expect(find.text('A six-digit code is required.'), findsOneWidget);
    expect(find.text('Fix the code and try again.'), findsOneWidget);
  });

  testWidgets('otp masked example hides digits and clears on demand', (
    tester,
  ) async {
    await tester.pumpWidget(_preview('otp-field-masked'));
    await tester.pumpAndSettle();
    expect(find.text('•'), findsNWidgets(4));
    expect(find.text('4'), findsNothing);
    await tester.tap(find.text('Clear'));
    await tester.pumpAndSettle();
    expect(find.text('•'), findsNothing);
  });

  testWidgets('otp field playground echoes the typed value back', (
    tester,
  ) async {
    final controller = TextEditingController();
    addTearDown(controller.dispose);
    final otpController = TROtpFieldController();
    addTearDown(otpController.dispose);
    Map<String, Object?>? reported;
    await tester.pumpWidget(
      MaterialApp(
        theme: TinyrackTheme.light(),
        home: Scaffold(
          body: preview.PreviewComponent(
            args: const {'length': 4, 'uiSize': 'md', 'value': ''},
            component: 'otp-field',
            locale: 'en',
            measureKey: GlobalKey(),
            partKeys: {},
            textFieldController: controller,
            otpFieldController: otpController,
            onStateChanged: (value) => reported = value,
          ),
        ),
      ),
    );
    await tester.enterText(find.byType(TextField), '20');
    await tester.pump();
    expect(reported?['args'], {'value': '20'});
    expect(find.text('2'), findsOneWidget);
  });

  testWidgets('checkbox group playground reports the next selected values', (
    tester,
  ) async {
    final controller = TextEditingController();
    addTearDown(controller.dispose);
    final otpController = TROtpFieldController();
    addTearDown(otpController.dispose);
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
            otpFieldController: otpController,
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

  testWidgets('toggle playground reports the next pressed value', (
    tester,
  ) async {
    final controller = TextEditingController();
    addTearDown(controller.dispose);
    final otpController = TROtpFieldController();
    addTearDown(otpController.dispose);
    Map<String, Object?>? reported;
    await tester.pumpWidget(
      MaterialApp(
        theme: TinyrackTheme.light(),
        home: Scaffold(
          body: preview.PreviewComponent(
            args: const {'disabled': false, 'pressed': false, 'uiSize': 'md'},
            component: 'toggle',
            locale: 'en',
            measureKey: GlobalKey(),
            partKeys: {},
            textFieldController: controller,
            otpFieldController: otpController,
            onStateChanged: (value) => reported = value,
          ),
        ),
      ),
    );

    await tester.tap(find.text('Bold'));
    await tester.pumpAndSettle();

    expect(reported, {
      'pressed': true,
      'args': {'pressed': true},
    });
  });

  testWidgets('toggle group playground reports the next selected values', (
    tester,
  ) async {
    final controller = TextEditingController();
    addTearDown(controller.dispose);
    final otpController = TROtpFieldController();
    addTearDown(otpController.dispose);
    Map<String, Object?>? reported;
    await tester.pumpWidget(
      MaterialApp(
        theme: TinyrackTheme.light(),
        home: Scaffold(
          body: preview.PreviewComponent(
            args: const {
              'disabled': false,
              'disabledItem': false,
              'loopFocus': true,
              'multiple': false,
              'orientation': 'horizontal',
              'selectedValues': ['start'],
            },
            component: 'toggle-group',
            locale: 'en',
            measureKey: GlobalKey(),
            partKeys: {},
            textFieldController: controller,
            otpFieldController: otpController,
            onStateChanged: (value) => reported = value,
          ),
        ),
      ),
    );

    expect(find.text('Center'), findsOneWidget);
    await tester.tap(find.text('Center'));
    await tester.pumpAndSettle();

    expect(reported, {
      'pressed': true,
      'args': {
        'selectedValues': ['center'],
      },
    });
  });

  testWidgets('toggle group example keeps interactive selection', (
    tester,
  ) async {
    await tester.pumpWidget(_preview('toggle-group-controlled'));

    expect(find.text('Alignment: start'), findsOneWidget);
    await tester.tap(find.text('Center'));
    await tester.pumpAndSettle();

    expect(find.text('Alignment: center'), findsOneWidget);
  });

  testWidgets('toggle example keeps interactive pressed state', (tester) async {
    await tester.pumpWidget(_preview('toggle-controlled'));

    expect(find.text('Bold: off'), findsOneWidget);
    await tester.tap(find.text('Bold'));
    await tester.pumpAndSettle();

    expect(find.text('Bold: on'), findsOneWidget);
  });
}
