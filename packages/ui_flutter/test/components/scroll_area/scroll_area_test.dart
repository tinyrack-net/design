import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:tinyrack_ui/tinyrack_ui.dart';

Widget _host(Widget child, {bool dark = false}) => MaterialApp(
  theme: dark ? TinyrackTheme.dark() : TinyrackTheme.light(),
  home: Scaffold(body: SizedBox(height: 240, child: child)),
);

void main() {
  testWidgets('uses the strong border only while the thumb is dragged', (
    tester,
  ) async {
    await tester.pumpWidget(
      _host(const TRScrollArea(child: SizedBox(height: 900)), dark: true),
    );

    final data = tester
        .widget<ScrollbarTheme>(find.byType(ScrollbarTheme))
        .data;
    final colors = TinyrackTheme.dark().extension<TinyrackThemeData>()!;
    expect(data.thumbColor!.resolve({}), colors.border);
    expect(
      data.thumbColor!.resolve({WidgetState.dragged}),
      colors.borderStrong,
    );
  });

  testWidgets('the default constructor supplies its own viewport', (
    tester,
  ) async {
    await tester.pumpWidget(
      _host(const TRScrollArea(child: SizedBox(height: 900))),
    );

    expect(find.byType(SingleChildScrollView), findsOneWidget);
    expect(find.byType(Scrollbar), findsOneWidget);
  });

  group('TRScrollArea.forScrollable', () {
    testWidgets('themes a scrollable the caller owns without nesting one', (
      tester,
    ) async {
      await tester.pumpWidget(
        _host(
          TRScrollArea.forScrollable(
            child: ListView.builder(
              reverse: true,
              itemCount: 60,
              itemBuilder: (_, index) =>
                  SizedBox(height: 40, child: TRText('row $index')),
            ),
          ),
        ),
      );

      // Nesting a viewport here would unbound the list's height and defeat its
      // lazy building, so the caller's scrollable must be the only one.
      expect(find.byType(SingleChildScrollView), findsNothing);
      expect(find.byType(Scrollbar), findsOneWidget);
      expect(find.byType(ListView), findsOneWidget);
    });

    testWidgets('keeps the hosted list lazy and reversed', (tester) async {
      await tester.pumpWidget(
        _host(
          TRScrollArea.forScrollable(
            child: ListView.builder(
              reverse: true,
              itemCount: 60,
              itemBuilder: (_, index) =>
                  SizedBox(height: 40, child: TRText('row $index')),
            ),
          ),
        ),
      );

      // `reverse: true` pins the list to its last row, and only the visible
      // window is built.
      expect(find.text('row 0'), findsOneWidget);
      expect(find.text('row 59'), findsNothing);
    });

    testWidgets('drives the scrollbar from the scrollable it wraps', (
      tester,
    ) async {
      final controller = ScrollController();
      addTearDown(controller.dispose);

      await tester.pumpWidget(
        _host(
          TRScrollArea.forScrollable(
            child: ListView.builder(
              controller: controller,
              itemCount: 60,
              itemBuilder: (_, index) =>
                  SizedBox(height: 40, child: TRText('row $index')),
            ),
          ),
        ),
      );
      controller.jumpTo(400);
      await tester.pump();

      expect(controller.offset, 400);
      expect(tester.takeException(), isNull);
    });
  });
}
