import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:tinyrack_ui/tinyrack_ui.dart';

void main() {
  test('light and dark themes expose semantic extensions', () {
    final light = TinyrackTheme.light().extension<TinyrackThemeData>()!;
    final dark = TinyrackTheme.dark().extension<TinyrackThemeData>()!;

    expect(light.surface, isNot(dark.surface));
    expect(light.foregroundFor(TRIntent.danger), light.danger);
    expect(dark.surfaceFor(TRIntent.info), dark.infoSurface);
    expect(
      TinyrackTheme.light().textTheme.bodyMedium?.fontFamily,
      'packages/tinyrack_ui/IBMPlexSans',
    );
    expect(
      TinyrackTheme.light().textTheme.bodyMedium?.fontFamily,
      isNot(contains('packages/tinyrack_ui/packages/tinyrack_ui')),
    );
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
    final enabledBackground = button.style?.backgroundColor?.resolve({});
    final disabledBackground = button.style?.backgroundColor?.resolve({
      WidgetState.disabled,
    });
    expect(disabledBackground, enabledBackground);
    expect(find.byType(TRSpinner), findsOneWidget);
    expect(
      tester
          .widget<AnimatedOpacity>(
            find.descendant(
              of: find.byType(TRButton),
              matching: find.byType(AnimatedOpacity),
            ),
          )
          .opacity,
      0.5,
    );
    await tester.tap(find.byType(TRButton));
    expect(presses, 0);
  });

  testWidgets('disabled outline and ghost buttons keep transparent fills', (
    tester,
  ) async {
    await tester.pumpWidget(
      MaterialApp(
        theme: TinyrackTheme.light(),
        home: const Scaffold(
          body: Column(
            children: [
              TRButton(
                appearance: TRAppearance.outline,
                onPressed: null,
                child: Text('Outline'),
              ),
              TRButton(
                appearance: TRAppearance.ghost,
                onPressed: null,
                child: Text('Ghost'),
              ),
            ],
          ),
        ),
      ),
    );

    for (final button in [
      tester.widget<OutlinedButton>(find.byType(OutlinedButton)),
      tester.widget<TextButton>(find.byType(TextButton)),
    ]) {
      expect(
        button.style?.backgroundColor?.resolve({WidgetState.disabled})?.a,
        0,
      );
    }
  });

  testWidgets('neutral outline and ghost buttons use muted foreground', (
    tester,
  ) async {
    final theme = TinyrackTheme.dark();
    final textMuted = theme.extension<TinyrackThemeData>()!.textMuted;
    await tester.pumpWidget(
      MaterialApp(
        theme: theme,
        home: Scaffold(
          body: Column(
            children: [
              TRButton(
                appearance: TRAppearance.outline,
                onPressed: () {},
                child: const Text('Outline'),
              ),
              TRButton(
                appearance: TRAppearance.ghost,
                onPressed: () {},
                child: const Text('Ghost'),
              ),
            ],
          ),
        ),
      ),
    );

    expect(
      tester
          .widget<OutlinedButton>(find.byType(OutlinedButton))
          .style
          ?.foregroundColor
          ?.resolve({}),
      textMuted,
    );
    expect(
      tester
          .widget<TextButton>(find.byType(TextButton))
          .style
          ?.foregroundColor
          ?.resolve({}),
      textMuted,
    );
  });

  testWidgets('button activates Space on key release', (tester) async {
    final focusNode = FocusNode();
    addTearDown(focusNode.dispose);
    var presses = 0;
    await tester.pumpWidget(
      MaterialApp(
        theme: TinyrackTheme.light(),
        home: Scaffold(
          body: TRButton(
            focusNode: focusNode,
            onPressed: () => presses += 1,
            child: const Text('Deploy'),
          ),
        ),
      ),
    );

    focusNode.requestFocus();
    await tester.pump();
    await tester.sendKeyDownEvent(LogicalKeyboardKey.space);
    await tester.pump();
    expect(presses, 0);
    final interactionFrame = tester.widget<AnimatedContainer>(
      find
          .descendant(
            of: find.byType(TRButton),
            matching: find.byType(AnimatedContainer),
          )
          .first,
    );
    expect(interactionFrame.transform?.storage[13], 1);

    await tester.sendKeyUpEvent(LogicalKeyboardKey.space);
    await tester.pump();
    expect(presses, 1);
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
            variant: TRStatusVariant.success,
            title: Text('Saved'),
            description: Text('The rack was updated.'),
          ),
        ),
      ),
    );

    final semantics = tester.getSemantics(find.byType(TRAlert));
    expect(semantics.flagsCollection.isLiveRegion, isTrue);
  });

  testWidgets('status components expose only the React status variants', (
    tester,
  ) async {
    await tester.pumpWidget(
      MaterialApp(
        theme: TinyrackTheme.light(),
        home: const Scaffold(
          body: Column(
            children: [
              TRAlert(title: Text('Saved'), variant: TRStatusVariant.success),
              TRBadge(
                variant: TRStatusVariant.warning,
                child: Text('Attention'),
              ),
            ],
          ),
        ),
      ),
    );

    expect(TRStatusVariant.values.map((value) => value.name), [
      'neutral',
      'info',
      'success',
      'warning',
      'danger',
    ]);
    expect(find.byType(TRAlert), findsOneWidget);
    expect(find.byType(TRBadge), findsOneWidget);
  });

  testWidgets('card, spinner, icon button, and text expose parity variants', (
    tester,
  ) async {
    await tester.pumpWidget(
      MaterialApp(
        theme: TinyrackTheme.light(),
        home: Scaffold(
          body: Column(
            children: [
              const TRCard(
                padding: TRCardPadding.lg,
                variant: TRCardVariant.elevated,
                child: TRCardHeader(
                  children: [
                    TRCardTitle(child: Text('Rack alpha')),
                    TRCardDescription(child: Text('Healthy')),
                  ],
                ),
              ),
              const TRSpinner(variant: TRSpinnerVariant.primary),
              TRIconButton(
                appearance: TRAppearance.outline,
                icon: const Icon(Icons.add),
                label: 'Add rack',
                loading: true,
                onPressed: () {},
              ),
              const TRText(
                'Rack status',
                align: TRTextAlign.center,
                color: TRTextColor.muted,
                truncate: true,
                variant: TRTextVariant.headingMd,
                weight: TRTextWeight.strong,
              ),
            ],
          ),
        ),
      ),
    );

    expect(find.bySemanticsLabel('Add rack'), findsWidgets);
    expect(find.byType(TRSpinner), findsNWidgets(2));
    final text = tester.widget<Text>(find.text('Rack status'));
    expect(text.maxLines, 1);
    expect(text.overflow, TextOverflow.ellipsis);
    expect(text.textAlign, TextAlign.center);
  });
}
