import 'package:material_ui/material_ui.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:tinyrack_ui/tinyrack_ui.dart';

void main() {
  Future<Color> pumpSurface(WidgetTester tester, ThemeData theme) async {
    late Color expected;
    await tester.pumpWidget(
      MaterialApp(
        theme: theme,
        home: Scaffold(
          body: Builder(
            builder: (context) {
              expected = context.tinyrackTheme.surface;
              return const TRSurface(
                child: SizedBox.expand(child: Text('content')),
              );
            },
          ),
        ),
      ),
    );
    return expected;
  }

  testWidgets('paints the themed surface colour in light and dark', (
    tester,
  ) async {
    for (final theme in <ThemeData>[
      TinyrackTheme.light(),
      TinyrackTheme.dark(),
    ]) {
      final expected = await pumpSurface(tester, theme);
      final painted = tester.widget<ColoredBox>(
        find.descendant(
          of: find.byType(TRSurface),
          matching: find.byType(ColoredBox),
        ),
      );

      expect(painted.color, expected);
      expect(
        painted.color.a,
        1.0,
        reason: 'a page background must be fully opaque',
      );
    }
  });

  testWidgets('covers the region its child occupies', (tester) async {
    await pumpSurface(tester, TinyrackTheme.light());

    expect(
      tester.getRect(find.byType(TRSurface)),
      tester.getRect(
        find.descendant(
          of: find.byType(TRSurface),
          matching: find.byType(SizedBox),
        ),
      ),
      reason: 'the fill must take the size of its child',
    );
  });
}
