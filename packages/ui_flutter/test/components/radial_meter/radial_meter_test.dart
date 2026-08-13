import 'package:material_ui/material_ui.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:tinyrack_ui/tinyrack_ui.dart';

void main() {
  testWidgets('renders a compact labelled measurement', (tester) async {
    final semantics = tester.ensureSemantics();
    await tester.pumpWidget(
      MaterialApp(
        theme: TinyrackTheme.light(),
        home: const Scaffold(
          body: TRRadialMeter(
            value: 72,
            semanticLabel: 'Context window',
            uiSize: TRUiSize.sm,
          ),
        ),
      ),
    );

    expect(find.bySemanticsLabel('Context window'), findsOneWidget);
    expect(tester.getSemantics(find.byType(TRRadialMeter)).value, '72%');
    expect(
      tester.getSize(find.byType(TRRadialMeter)),
      Size.square(TRControlMetrics.iconSizeOf(TRUiSize.sm)),
    );
    semantics.dispose();
  });

  testWidgets('clamps invalid ranges and supports status variants', (
    tester,
  ) async {
    await tester.pumpWidget(
      MaterialApp(
        darkTheme: TinyrackTheme.dark(),
        themeMode: ThemeMode.dark,
        home: const Scaffold(
          body: TRRadialMeter(
            value: 150,
            max: 100,
            semanticLabel: 'Budget',
            variant: TRStatusVariant.danger,
            uiSize: TRUiSize.lg,
          ),
        ),
      ),
    );

    expect(tester.getSemantics(find.byType(TRRadialMeter)).value, '100%');
    expect(
      tester.getSize(find.byType(TRRadialMeter)),
      Size.square(TRControlMetrics.iconSizeOf(TRUiSize.lg)),
    );
    expect(
      find.descendant(
        of: find.byType(TRRadialMeter),
        matching: find.byType(CustomPaint),
      ),
      findsOneWidget,
    );
  });
}
