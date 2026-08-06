import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:tinyrack_ui/tinyrack_ui.dart';

Widget _app(Widget child, {Size size = const Size(900, 700)}) => MaterialApp(
  theme: TinyrackTheme.light(),
  darkTheme: TinyrackTheme.dark(),
  home: MediaQuery(
    data: MediaQueryData(size: size, disableAnimations: true),
    child: child,
  ),
);

/// The [Padding] that wraps [child]'s nearest enclosing column-like slot.
EdgeInsetsGeometry _paddingAround(WidgetTester tester, Finder child) => tester
    .widget<Padding>(
      find.ancestor(of: child, matching: find.byType(Padding)).first,
    )
    .padding;

Finder _surfaceColumn(Type surface) => find
    .descendant(of: find.byType(surface), matching: find.byType(Column))
    .first;

void main() {
  group('overlay surfaces use the compact box padding', () {
    testWidgets('TRDialog insets its slots by TRSpacing.medium', (
      tester,
    ) async {
      await tester.pumpWidget(
        _app(
          const TRDialog(
            title: Text('Rename workspace'),
            content: SizedBox(key: Key('body'), height: 40),
            actions: Text('Save'),
          ),
        ),
      );

      expect(
        _paddingAround(tester, _surfaceColumn(TRDialog)),
        const EdgeInsets.all(TRSpacing.medium),
      );
    });

    testWidgets('TRDialog separates its content block by TRSpacing.small', (
      tester,
    ) async {
      await tester.pumpWidget(
        _app(
          const TRDialog(
            title: Text('Rename workspace'),
            content: SizedBox(key: Key('body'), height: 40),
          ),
        ),
      );

      expect(
        _paddingAround(tester, find.byKey(const Key('body'))),
        const EdgeInsets.symmetric(vertical: TRSpacing.small),
      );
    });

    testWidgets('TRAlertDialog insets its slots by TRSpacing.medium', (
      tester,
    ) async {
      await tester.pumpWidget(
        _app(
          const TRAlertDialog(
            title: Text('Delete host?'),
            description: Text('This cannot be undone.'),
          ),
        ),
      );

      expect(
        _paddingAround(tester, _surfaceColumn(TRAlertDialog)),
        const EdgeInsets.all(TRSpacing.medium + TRControlMetrics.borderWidth),
      );
    });

    testWidgets('TRAlertDialog stacks its slots with TRSpacing.small', (
      tester,
    ) async {
      await tester.pumpWidget(
        _app(
          const TRAlertDialog(
            title: Text('Delete host?'),
            description: Text('This cannot be undone.'),
          ),
        ),
      );

      expect(
        tester.widget<Column>(_surfaceColumn(TRAlertDialog)).spacing,
        TRSpacing.small,
      );
    });

    testWidgets('TRDrawer insets its slots by TRSpacing.medium', (
      tester,
    ) async {
      await tester.pumpWidget(
        _app(
          TRDrawer(
            title: const Text('Choose a model'),
            content: const SizedBox(key: Key('body')),
          ),
        ),
      );

      expect(
        _paddingAround(tester, _surfaceColumn(TRDrawer)),
        const EdgeInsets.all(TRSpacing.medium),
      );
    });
  });
}
