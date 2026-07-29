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
    var value = '';
    await tester.pumpWidget(
      MaterialApp(
        theme: TinyrackTheme.light(),
        home: Scaffold(
          body: TRTextField(label: 'Name', onChanged: (next) => value = next),
        ),
      ),
    );

    await tester.enterText(find.byType(TextField), 'Rack alpha');
    expect(value, 'Rack alpha');
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
