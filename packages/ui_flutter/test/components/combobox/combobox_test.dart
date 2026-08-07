import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:tinyrack_ui/tinyrack_ui.dart';

Widget _app(Widget child) => MaterialApp(
  theme: TinyrackTheme.light(),
  home: Scaffold(
    body: Center(child: SizedBox(width: 320, child: child)),
  ),
);

const _channels = [
  TRComboboxItem(value: 'stable', label: 'Stable'),
  TRComboboxItem(value: 'beta', label: 'Beta'),
  TRComboboxItem(value: 'unstable', label: 'Unstable'),
];

Future<void> _query(WidgetTester tester, String query) async {
  await tester.tap(find.byType(TextFormField).first);
  await tester.pumpAndSettle();
  await tester.enterText(find.byType(TextFormField).first, query);
  await tester.pumpAndSettle();
}

/// Options render in an overlay above the field, so the popup copy is whatever
/// is left once the field's own text is excluded.
Finder _option(String label) => find.descendant(
  of: find.byType(MenuItemButton),
  matching: find.text(label),
);

void main() {
  testWidgets('contains keeps infix matches by default', (tester) async {
    await tester.pumpWidget(_app(TRCombobox<String>(items: _channels)));
    await _query(tester, 'sta');

    expect(_option('Stable'), findsOneWidget);
    expect(_option('Unstable'), findsOneWidget);
    expect(_option('Beta'), findsNothing);
  });

  testWidgets('startsWith narrows to prefix matches', (tester) async {
    await tester.pumpWidget(
      _app(
        TRCombobox<String>(
          items: _channels,
          filterMode: TRComboboxFilterMode.startsWith,
        ),
      ),
    );
    await _query(tester, 'sta');

    expect(_option('Stable'), findsOneWidget);
    expect(_option('Unstable'), findsNothing);
  });

  testWidgets('none leaves narrowing to the option source', (tester) async {
    await tester.pumpWidget(
      _app(
        TRCombobox<String>(
          items: _channels,
          filterMode: TRComboboxFilterMode.none,
          optionsBuilder: (query) => const [
            TRComboboxItem(value: 'remote', label: 'Remote result'),
          ],
        ),
      ),
    );
    await _query(tester, 'nothing matches this');

    expect(_option('Remote result'), findsOneWidget);
  });

  testWidgets('a filter predicate overrides the filter mode', (tester) async {
    await tester.pumpWidget(
      _app(
        TRCombobox<String>(
          items: _channels,
          filterMode: TRComboboxFilterMode.startsWith,
          filter: (item, query) => item.label.toLowerCase().endsWith(query),
        ),
      ),
    );
    await _query(tester, 'able');

    expect(_option('Stable'), findsOneWidget);
    expect(_option('Unstable'), findsOneWidget);
  });

  testWidgets('disabled options render but cannot be selected', (tester) async {
    String? selected;
    await tester.pumpWidget(
      _app(
        TRCombobox<String>(
          items: const [
            TRComboboxItem(value: 'stable', label: 'Stable'),
            TRComboboxItem(value: 'beta', label: 'Beta', enabled: false),
          ],
          onValueChange: (value) => selected = value,
        ),
      ),
    );
    await _query(tester, 'bet');

    expect(_option('Beta'), findsOneWidget);
    await tester.tap(_option('Beta'));
    await tester.pumpAndSettle();
    expect(selected, isNull);
  });

  testWidgets('autoHighlight commits the first match on Enter', (tester) async {
    String? selected;
    await tester.pumpWidget(
      _app(
        TRCombobox<String>(
          autoHighlight: true,
          items: _channels,
          onValueChange: (value) => selected = value,
        ),
      ),
    );
    await _query(tester, 'bet');

    await tester.testTextInput.receiveAction(TextInputAction.done);
    await tester.pumpAndSettle();
    expect(selected, 'beta');
  });

  testWidgets('autoHighlight false requires an arrow key before Enter', (
    tester,
  ) async {
    String? selected;
    await tester.pumpWidget(
      _app(
        TRCombobox<String>(
          autoHighlight: false,
          items: _channels,
          onValueChange: (value) => selected = value,
        ),
      ),
    );
    await _query(tester, 'bet');

    await tester.testTextInput.receiveAction(TextInputAction.done);
    await tester.pumpAndSettle();
    expect(selected, isNull);

    // Submitting drops the input connection, so the field is re-engaged before
    // the keyboard walk.
    await _query(tester, 'bet');
    await tester.sendKeyEvent(LogicalKeyboardKey.arrowDown);
    await tester.pumpAndSettle();
    await tester.testTextInput.receiveAction(TextInputAction.done);
    await tester.pumpAndSettle();
    expect(selected, 'beta');
  });

  testWidgets('arrow navigation steps past a disabled option', (tester) async {
    String? selected;
    await tester.pumpWidget(
      _app(
        TRCombobox<String>(
          items: const [
            TRComboboxItem(value: 'stable', label: 'Stable'),
            TRComboboxItem(value: 'beta', label: 'Beta', enabled: false),
            TRComboboxItem(value: 'canary', label: 'Canary'),
          ],
          onValueChange: (value) => selected = value,
        ),
      ),
    );
    await _query(tester, '');

    await tester.sendKeyEvent(LogicalKeyboardKey.arrowDown);
    await tester.pumpAndSettle();
    await tester.sendKeyEvent(LogicalKeyboardKey.arrowDown);
    await tester.pumpAndSettle();
    await tester.testTextInput.receiveAction(TextInputAction.done);
    await tester.pumpAndSettle();

    expect(selected, 'canary');
  });

  testWidgets('the clear button appears with content and resets the field', (
    tester,
  ) async {
    final cleared = <String?>[];
    await tester.pumpWidget(
      _app(
        TRCombobox<String>(
          clearable: true,
          items: _channels,
          onValueChange: cleared.add,
        ),
      ),
    );
    expect(find.byType(TRIconButton), findsNothing);

    await _query(tester, 'bet');
    expect(find.byType(TRIconButton), findsOneWidget);

    await tester.tap(find.byType(TRIconButton));
    await tester.pumpAndSettle();

    expect(cleared.last, isNull);
    expect(find.byType(TRIconButton), findsNothing);
    expect(
      tester.widget<TextFormField>(find.byType(TextFormField)).controller?.text,
      '',
    );
  });

  testWidgets('clearing a multi combobox drops the chips and the query', (
    tester,
  ) async {
    List<String>? values;
    await tester.pumpWidget(
      _app(
        TRMultiCombobox<String>(
          clearable: true,
          items: _channels,
          onValueChange: (value) => values = value,
        ),
      ),
    );
    await _query(tester, 'bet');
    await tester.tap(_option('Beta'));
    await tester.pumpAndSettle();
    expect(find.byType(InputChip), findsOneWidget);

    await tester.tap(find.byType(TRIconButton));
    await tester.pumpAndSettle();

    expect(values, isEmpty);
    expect(find.byType(InputChip), findsNothing);
  });
}
