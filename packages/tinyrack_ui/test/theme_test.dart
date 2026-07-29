import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:tinyrack_ui/tinyrack_ui.dart';

void main() {
  test('light and dark themes expose semantic extensions', () {
    final light = TinyrackTheme.light().extension<TinyrackThemeData>()!;
    final dark = TinyrackTheme.dark().extension<TinyrackThemeData>()!;

    expect(light.surface, isNot(dark.surface));
    expect(light.foregroundFor(TRIntent.danger), light.danger);
    expect(dark.surfaceFor(TRIntent.info), dark.infoSurface);
  });

  testWidgets('button reports loading semantics and prevents activation', (
    tester,
  ) async {
    var presses = 0;
    await tester.pumpWidget(
      MaterialApp(
        theme: TinyrackTheme.light(),
        home: Scaffold(
          body: TRButton(
            loading: true,
            loadingLabel: 'Deploying',
            onPressed: () => presses += 1,
            child: const Text('Deploy'),
          ),
        ),
      ),
    );

    expect(find.bySemanticsLabel('Deploying'), findsOneWidget);
    final button = tester.widget<FilledButton>(find.byType(FilledButton));
    final spinner = tester.element(find.byType(CircularProgressIndicator));
    final enabledBackground = button.style?.backgroundColor?.resolve({});
    final disabledBackground = button.style?.backgroundColor?.resolve({
      WidgetState.disabled,
    });
    expect(disabledBackground, isNot(enabledBackground));
    expect(
      ProgressIndicatorTheme.of(spinner).color,
      TinyrackTheme.light().colorScheme.onPrimary,
    );
    await tester.tap(find.byType(TRButton));
    expect(presses, 0);
  });

  testWidgets('text field preserves editing callbacks', (tester) async {
    final controller = TextEditingController(text: 'Rack alpha');
    addTearDown(controller.dispose);
    var value = '';
    await tester.pumpWidget(
      MaterialApp(
        theme: TinyrackTheme.light(),
        home: Scaffold(
          body: TRTextField(
            controller: controller,
            label: 'Name',
            onChanged: (next) => value = next,
          ),
        ),
      ),
    );

    expect(find.text('Rack alpha'), findsOneWidget);
    await tester.enterText(find.byType(TextField), 'Rack beta');
    expect(value, 'Rack beta');
  });

  testWidgets('text field participates in form validation, save, and reset', (
    tester,
  ) async {
    final formKey = GlobalKey<FormState>();
    String? savedValue;
    var resets = 0;
    await tester.pumpWidget(
      MaterialApp(
        theme: TinyrackTheme.light(),
        home: Scaffold(
          body: Form(
            key: formKey,
            child: TRTextField(
              autovalidateMode: AutovalidateMode.disabled,
              initialValue: 'Rack alpha',
              onReset: () => resets += 1,
              onSaved: (value) => savedValue = value,
              restorationId: 'rack-name',
              validator: (value) =>
                  value == null || value.isEmpty ? 'Name is required' : null,
            ),
          ),
        ),
      ),
    );

    await tester.enterText(find.byType(TextField), '');
    expect(formKey.currentState!.validate(), isFalse);
    await tester.pump();
    expect(find.text('Name is required'), findsOneWidget);

    await tester.enterText(find.byType(TextField), 'Rack beta');
    expect(formKey.currentState!.validate(), isTrue);
    formKey.currentState!.save();
    expect(savedValue, 'Rack beta');

    formKey.currentState!.reset();
    await tester.pump();
    expect(resets, 1);
    expect(find.text('Rack alpha'), findsOneWidget);
  });

  test('text field rejects controller and initial value together', () {
    final controller = TextEditingController();
    addTearDown(controller.dispose);

    expect(
      () => TRTextField(controller: controller, initialValue: 'Rack alpha'),
      throwsAssertionError,
    );
  });

  testWidgets('alert announces non-neutral status', (tester) async {
    await tester.pumpWidget(
      MaterialApp(
        theme: TinyrackTheme.dark(),
        home: const Scaffold(
          body: TRAlert(
            intent: TRIntent.success,
            title: Text('Saved'),
            description: Text('The rack was updated.'),
          ),
        ),
      ),
    );

    final semantics = tester.getSemantics(find.byType(TRAlert));
    expect(semantics.flagsCollection.isLiveRegion, isTrue);
  });
}
