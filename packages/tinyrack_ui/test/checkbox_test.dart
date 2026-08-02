import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:tinyrack_ui/tinyrack_ui.dart';

Widget _app(Widget child) => MaterialApp(
  theme: TinyrackTheme.light(),
  home: Scaffold(body: Center(child: child)),
);

void main() {
  testWidgets('checkbox activates with Space on key release', (tester) async {
    var calls = 0;
    await tester.pumpWidget(
      _app(
        TRCheckbox(
          autofocus: true,
          onCheckedChange: (_) => calls += 1,
          semanticLabel: 'Backups',
        ),
      ),
    );
    await tester.pump();

    await tester.sendKeyDownEvent(LogicalKeyboardKey.space);
    await tester.pump();
    expect(calls, 0);

    await tester.sendKeyUpEvent(LogicalKeyboardKey.space);
    await tester.pump();
    expect(calls, 1);
  });

  testWidgets('mixed controlled checkbox reports the resolved value', (
    tester,
  ) async {
    final reported = <bool>[];
    await tester.pumpWidget(
      _app(
        TRCheckbox(
          checked: true,
          indeterminate: true,
          onCheckedChange: reported.add,
        ),
      ),
    );

    await tester.tap(find.byType(TRCheckbox));
    await tester.pump();
    expect(reported, [false]);
  });

  testWidgets('checkbox form field validates, saves, and resets', (
    tester,
  ) async {
    final formKey = GlobalKey<FormState>();
    bool? saved;
    var resets = 0;
    await tester.pumpWidget(
      _app(
        Form(
          key: formKey,
          child: TRCheckboxFormField(
            initialValue: false,
            onReset: () => resets += 1,
            onSaved: (value) => saved = value,
            semanticLabel: 'Terms',
            validator: (value) => value == true ? null : 'Accept the terms',
          ),
        ),
      ),
    );

    expect(formKey.currentState!.validate(), isFalse);
    await tester.pump();
    expect(tester.widget<TRCheckbox>(find.byType(TRCheckbox)).invalid, isTrue);

    await tester.tap(find.byType(TRCheckbox));
    await tester.pump();
    expect(formKey.currentState!.validate(), isTrue);
    formKey.currentState!.save();
    expect(saved, isTrue);

    formKey.currentState!.reset();
    await tester.pump();
    expect(resets, 1);
    expect(tester.widget<TRCheckbox>(find.byType(TRCheckbox)).checked, isFalse);
  });

  testWidgets('checkbox form fields serialize enabled and read-only values', (
    tester,
  ) async {
    final formKey = GlobalKey<TRFormState>();
    await tester.pumpWidget(
      _app(
        TRForm(
          key: formKey,
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TRCheckboxFormField(
                initialValue: true,
                name: 'monitoring',
                checkedValue: 'enabled',
                uncheckedValue: 'disabled',
              ),
              TRCheckboxFormField(
                initialValue: false,
                name: 'readonly',
                readOnly: true,
              ),
              TRCheckboxFormField(
                initialValue: true,
                enabled: false,
                name: 'secret',
              ),
            ],
          ),
        ),
      ),
    );

    expect(formKey.currentState!.values.toMap(), {
      'monitoring': 'enabled',
      'readonly': false,
    });

    await tester.tap(find.byType(TRCheckbox).first);
    await tester.pump();
    expect(formKey.currentState!.values['monitoring'], 'disabled');
  });
}
