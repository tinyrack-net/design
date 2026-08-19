import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:material_ui/material_ui.dart';
import 'package:tinyrack_ui/tinyrack_ui.dart';

const _items = [
  TRSelectItem(value: 'alpha', label: 'Alpha'),
  TRSelectItem(value: 'beta', label: 'Beta'),
  TRSelectItem(value: 'gamma', label: 'Gamma'),
];

Finder get _trigger => find.descendant(
  of: find.byWidgetPredicate((widget) => widget is TRSelect),
  matching: find.byType(TextButton),
);

Finder get _searchField => find.byType(TRTextField);

TextEditingController _query(WidgetTester tester) =>
    tester.widget<TRTextField>(_searchField).controller!;

/// Serves one page from a [Router], the shape every declarative-routing app
/// takes. The root overlay is then the router's own navigator, which is where
/// an anchored layer that opts into the root overlay lands.
class _SinglePageDelegate extends RouterDelegate<Object>
    with ChangeNotifier, PopNavigatorRouterDelegateMixin<Object> {
  _SinglePageDelegate(this.child);

  final Widget child;

  @override
  final GlobalKey<NavigatorState> navigatorKey = GlobalKey<NavigatorState>();

  @override
  Widget build(BuildContext context) => Navigator(
    key: navigatorKey,
    pages: <Page<void>>[
      MaterialPage<void>(
        child: Scaffold(
          body: Align(alignment: Alignment.topLeft, child: child),
        ),
      ),
    ],
    onDidRemovePage: (_) {},
  );

  @override
  Future<void> setNewRoutePath(Object configuration) async {}
}

Widget _routedApp(Widget child) => MaterialApp.router(
  theme: TinyrackTheme.light(),
  routerDelegate: _SinglePageDelegate(child),
);

const _select = TRSelect<String>(
  items: _items,
  searchable: true,
  presentation: TRSelectPresentation.layer(useRootOverlay: true),
);

Future<void> _open(WidgetTester tester) async {
  await tester.tap(_trigger);
  await tester.pumpAndSettle();
}

void main() {
  testWidgets('a root-overlay layer query field keeps text editing keys', (
    tester,
  ) async {
    await tester.pumpWidget(_routedApp(_select));
    await _open(tester);

    // A host delivers printable characters over the text input channel and
    // Backspace as a key event, so the two halves are driven separately. Only
    // the key event proves the field still sits under the app's text editing
    // shortcuts.
    await tester.enterText(_searchField, 'gam');
    await tester.pumpAndSettle();

    await tester.sendKeyEvent(LogicalKeyboardKey.backspace);
    await tester.pumpAndSettle();

    expect(_query(tester).text, 'ga');
  });

  testWidgets('a root-overlay layer query field selects all and deletes', (
    tester,
  ) async {
    await tester.pumpWidget(_routedApp(_select));
    await _open(tester);

    await tester.enterText(_searchField, 'gam');
    await tester.pumpAndSettle();

    await tester.sendKeyDownEvent(LogicalKeyboardKey.control);
    await tester.sendKeyEvent(LogicalKeyboardKey.keyA);
    await tester.sendKeyUpEvent(LogicalKeyboardKey.control);
    await tester.sendKeyEvent(LogicalKeyboardKey.delete);
    await tester.pumpAndSettle();

    expect(_query(tester).text, isEmpty);
  });
}
