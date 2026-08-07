import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:tinyrack_ui/src/internal/focus_source.dart';
import 'package:tinyrack_ui/tinyrack_ui.dart';

Widget _app(Widget child) => MaterialApp(
  theme: TinyrackTheme.light(),
  home: Scaffold(
    body: Align(alignment: Alignment.topLeft, child: child),
  ),
);

RenderObject _ringPainter(WidgetTester tester, Finder owner) =>
    tester.renderObject(
      find.descendant(of: owner, matching: find.byType(CustomPaint)).first,
    );

Color get _focus => TinyrackTheme.light().extension<TinyrackThemeData>()!.focus;

void main() {
  setUp(TRFocusSource.instance.debugReset);
  tearDown(TRFocusSource.instance.debugReset);

  testWidgets('focus ring paints keyboard focus but not pointer focus', (
    tester,
  ) async {
    await tester.pumpWidget(
      _app(
        const TRFocusRing(
          focused: true,
          child: SizedBox(width: 120, height: 40),
        ),
      ),
    );

    TRFocusSource.instance.debugSetKeyboardModality(true);
    await tester.pump();
    expect(
      _ringPainter(tester, find.byType(TRFocusRing)),
      paints..rrect(color: _focus),
    );

    TRFocusSource.instance.debugSetKeyboardModality(false);
    await tester.pump();
    expect(
      _ringPainter(tester, find.byType(TRFocusRing)),
      isNot(paints..rrect(color: _focus)),
    );
  });

  testWidgets('focus ring never changes its child size', (tester) async {
    Future<Size> size({required bool focused}) async {
      await tester.pumpWidget(
        _app(
          TRFocusRing(
            focused: focused,
            child: const SizedBox(width: 120, height: 40),
          ),
        ),
      );
      return tester.getSize(find.byType(TRFocusRing));
    }

    expect(await size(focused: true), await size(focused: false));
  });

  testWidgets('card focus follows the same keyboard-only contract', (
    tester,
  ) async {
    await tester.pumpWidget(
      _app(
        const TRCard(focused: true, child: SizedBox(width: 120, height: 40)),
      ),
    );

    List<BorderSide> paintedBorders() => tester
        .widgetList<DecoratedBox>(
          find.descendant(
            of: find.byType(TRCard),
            matching: find.byType(DecoratedBox),
          ),
        )
        .map((box) => box.decoration)
        .whereType<BoxDecoration>()
        .map((decoration) => decoration.border?.top)
        .nonNulls
        .toList();

    TRFocusSource.instance.debugSetKeyboardModality(true);
    await tester.pump();
    expect(
      paintedBorders().where((side) => side.color == _focus),
      hasLength(1),
    );

    TRFocusSource.instance.debugSetKeyboardModality(false);
    await tester.pump();
    expect(paintedBorders().where((side) => side.color == _focus), isEmpty);
  });
}
