import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:tinyrack_ui/tinyrack_ui.dart';

const _items = [
  TRSelectItem(value: 'alpha', label: 'Alpha'),
  TRSelectItem(value: 'beta', label: 'Beta'),
  TRSelectItem(value: 'gamma', label: 'Gamma'),
  TRSelectItem(value: 'delta', label: 'Delta', enabled: false),
];

Finder get _trigger => find.descendant(
  of: find.byWidgetPredicate((widget) => widget is TRSelect),
  matching: find.byType(TextButton),
);

Finder get _searchField => find.byType(TRTextField);

Finder _option(String label) => find.widgetWithText(MenuItemButton, label);

/// Turns animations off while leaving the viewport size intact, which is what
/// [TRSelectSurface.auto] reads.
Widget _app(Widget child) => MaterialApp(
  theme: TinyrackTheme.light(),
  home: Scaffold(
    body: Builder(
      builder: (context) => MediaQuery(
        data: MediaQuery.of(context).copyWith(disableAnimations: true),
        child: Align(alignment: Alignment.topLeft, child: child),
      ),
    ),
  ),
);

/// Opens a dropdown-surface select. The default viewport is 800 logical px
/// wide, which is already above [TRBreakpoints.small].
Future<void> _open(WidgetTester tester) async {
  await tester.tap(_trigger);
  await tester.pumpAndSettle();
}

void main() {
  testWidgets('a plain select shows no search field', (tester) async {
    await tester.pumpWidget(_app(const TRSelect<String>(items: _items)));

    await _open(tester);

    expect(_searchField, findsNothing);
  });

  testWidgets('a searchable select filters options by label', (tester) async {
    await tester.pumpWidget(
      _app(const TRSelect<String>(items: _items, searchable: true)),
    );

    await _open(tester);
    expect(_searchField, findsOneWidget);
    expect(_option('Alpha'), findsOneWidget);

    await tester.enterText(_searchField, 'a');
    await tester.pumpAndSettle();

    // Case-insensitive contains, so Beta and Gamma stay and Delta is disabled
    // but still matched.
    expect(_option('Alpha'), findsOneWidget);
    expect(_option('Beta'), findsOneWidget);
    expect(_option('Gamma'), findsOneWidget);

    await tester.enterText(_searchField, 'GAM');
    await tester.pumpAndSettle();

    expect(_option('Gamma'), findsOneWidget);
    expect(_option('Alpha'), findsNothing);
    expect(_option('Beta'), findsNothing);
  });

  testWidgets('a searchable select explains an empty result', (tester) async {
    await tester.pumpWidget(
      _app(
        const TRSelect<String>(
          items: _items,
          searchable: true,
          noResultsText: 'Nothing here',
        ),
      ),
    );

    await _open(tester);
    await tester.enterText(_searchField, 'zzz');
    await tester.pumpAndSettle();

    expect(find.text('Nothing here'), findsOneWidget);
    expect(find.byType(MenuItemButton), findsNothing);
  });

  testWidgets('a custom filter replaces the default contains match', (
    tester,
  ) async {
    await tester.pumpWidget(
      _app(
        TRSelect<String>(
          items: _items,
          searchable: true,
          filter: (item, query) => item.value.startsWith(query),
        ),
      ),
    );

    await _open(tester);
    await tester.enterText(_searchField, 'a');
    await tester.pumpAndSettle();

    expect(_option('Alpha'), findsOneWidget);
    expect(_option('Gamma'), findsNothing);
  });

  testWidgets('the query resets between openings', (tester) async {
    await tester.pumpWidget(
      _app(const TRSelect<String>(items: _items, searchable: true)),
    );

    await _open(tester);
    await tester.enterText(_searchField, 'gam');
    await tester.pumpAndSettle();
    expect(_option('Alpha'), findsNothing);

    await tester.tap(_option('Gamma'));
    await tester.pumpAndSettle();
    await _open(tester);

    expect(_option('Alpha'), findsOneWidget);
  });

  testWidgets('opening a searchable select focuses the query field', (
    tester,
  ) async {
    await tester.pumpWidget(
      _app(const TRSelect<String>(items: _items, searchable: true)),
    );

    await _open(tester);

    final field = tester.widget<TRTextField>(_searchField);
    expect(field.focusNode?.hasFocus, isTrue);
  });

  testWidgets('arrow down leaves the query field for the first match', (
    tester,
  ) async {
    String? value;
    await tester.pumpWidget(
      _app(
        TRSelect<String>(
          items: _items,
          searchable: true,
          onValueChange: (next) => value = next,
        ),
      ),
    );

    await _open(tester);
    await tester.enterText(_searchField, 'a');
    await tester.pumpAndSettle();
    await tester.sendKeyEvent(LogicalKeyboardKey.arrowDown);
    await tester.pumpAndSettle();
    await tester.sendKeyEvent(LogicalKeyboardKey.enter);
    await tester.pumpAndSettle();

    expect(value, 'alpha');
  });

  testWidgets('arrow down skips a disabled first match', (tester) async {
    String? value;
    await tester.pumpWidget(
      _app(
        TRSelect<String>(
          items: _items,
          searchable: true,
          onValueChange: (next) => value = next,
        ),
      ),
    );

    await _open(tester);
    await tester.enterText(_searchField, 'delta');
    await tester.pumpAndSettle();
    expect(_option('Delta'), findsOneWidget);

    await tester.sendKeyEvent(LogicalKeyboardKey.arrowDown);
    await tester.pumpAndSettle();
    await tester.sendKeyEvent(LogicalKeyboardKey.enter);
    await tester.pumpAndSettle();

    expect(value, isNull, reason: 'a disabled row must not be committable');
  });

  testWidgets('enter commits the sole remaining match', (tester) async {
    String? value;
    await tester.pumpWidget(
      _app(
        TRSelect<String>(
          items: _items,
          searchable: true,
          onValueChange: (next) => value = next,
        ),
      ),
    );

    await _open(tester);
    await tester.enterText(_searchField, 'gam');
    await tester.pumpAndSettle();
    await tester.testTextInput.receiveAction(TextInputAction.done);
    await tester.pumpAndSettle();

    expect(value, 'gamma');
    expect(_searchField, findsNothing);
  });

  testWidgets('enter does nothing while several options match', (tester) async {
    String? value;
    await tester.pumpWidget(
      _app(
        TRSelect<String>(
          items: _items,
          searchable: true,
          onValueChange: (next) => value = next,
        ),
      ),
    );

    await _open(tester);
    await tester.enterText(_searchField, 'a');
    await tester.pumpAndSettle();
    await tester.testTextInput.receiveAction(TextInputAction.done);
    await tester.pumpAndSettle();

    expect(value, isNull);
    expect(_searchField, findsOneWidget);
  });

  testWidgets('escape closes a searchable dropdown', (tester) async {
    await tester.pumpWidget(
      _app(const TRSelect<String>(items: _items, searchable: true)),
    );

    await _open(tester);
    await tester.sendKeyEvent(LogicalKeyboardKey.escape);
    await tester.pumpAndSettle();

    expect(_searchField, findsNothing);
  });

  testWidgets('typing on the trigger seeds the query instead of jumping rows', (
    tester,
  ) async {
    final focusNode = FocusNode();
    addTearDown(focusNode.dispose);
    await tester.pumpWidget(
      _app(
        TRSelect<String>(items: _items, searchable: true, focusNode: focusNode),
      ),
    );

    focusNode.requestFocus();
    await tester.pump();
    await tester.sendKeyEvent(LogicalKeyboardKey.keyG, character: 'g');
    await tester.pumpAndSettle();

    expect(_searchField, findsOneWidget);
    expect(_option('Gamma'), findsOneWidget);
    expect(_option('Alpha'), findsNothing);
  });

  testWidgets('a sheet surface carries the same search field', (tester) async {
    tester.view.devicePixelRatio = 1;
    tester.view.physicalSize = const Size(400, 800);
    addTearDown(tester.view.reset);
    String? value;
    await tester.pumpWidget(
      _app(
        TRSelect<String>(
          items: _items,
          searchable: true,
          onValueChange: (next) => value = next,
        ),
      ),
    );

    await _open(tester);
    expect(find.byType(TRDrawer), findsOneWidget);
    expect(_searchField, findsOneWidget);

    await tester.enterText(_searchField, 'gam');
    await tester.pumpAndSettle();
    expect(_option('Alpha'), findsNothing);

    await tester.tap(_option('Gamma'));
    await tester.pumpAndSettle();

    expect(value, 'gamma');
    expect(find.byType(TRDrawer), findsNothing);
  });
}
