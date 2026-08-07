import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:tinyrack_ui/src/generated/tokens.g.dart';
import 'package:tinyrack_ui/src/internal/focus_source.dart';
import 'package:tinyrack_ui/tinyrack_ui.dart';

/// The two press visuals and the focus ring.
///
/// Pointer press and Space press are separate paths in the interaction frame --
/// one animates, one does not -- so a declared render condition has to name
/// which of the two it means. These tests pin that they are genuinely distinct
/// and that each restores on release.
Widget _app(Widget child) => MaterialApp(
  theme: TinyrackTheme.light(),
  home: Scaffold(
    body: MediaQuery(
      data: const MediaQueryData(disableAnimations: true),
      child: Align(alignment: Alignment.topLeft, child: child),
    ),
  ),
);

TinyrackThemeData get _colors =>
    TinyrackTheme.light().extension<TinyrackThemeData>()!;

Future<void> _pumpButton(WidgetTester tester, {bool autofocus = false}) async {
  await tester.pumpWidget(
    _app(
      TRButton(
        autofocus: autofocus,
        onPressed: () {},
        child: const Text('Deploy'),
      ),
    ),
  );
  await tester.pumpAndSettle();
}

double _labelTop(WidgetTester tester) =>
    tester.getTopLeft(find.text('Deploy')).dy;

/// The render object that draws the focus ring.
///
/// The ring lives on a `CustomPaint`'s foreground painter, which is private, so
/// the paint output is read rather than the painter's fields.
RenderObject _ringPainter(WidgetTester tester) => tester.renderObject(
  find
      .descendant(of: find.byType(TRButton), matching: find.byType(CustomPaint))
      .first,
);

void main() {
  setUp(TRFocusSource.instance.debugReset);
  tearDown(TRFocusSource.instance.debugReset);

  testWidgets('a held pointer lowers the label and releasing restores it', (
    tester,
  ) async {
    await _pumpButton(tester);
    final rest = _labelTop(tester);

    final gesture = await tester.startGesture(
      tester.getCenter(find.byType(TRButton)),
      kind: PointerDeviceKind.mouse,
    );
    await tester.pumpAndSettle();
    expect(
      _labelTop(tester) - rest,
      TRGeneratedMeasurements.controlPressDistance,
    );

    await gesture.up();
    await tester.pumpAndSettle();
    expect(_labelTop(tester), rest);
  });

  testWidgets('a held Space lowers the label by the same distance', (
    tester,
  ) async {
    await _pumpButton(tester, autofocus: true);
    final rest = _labelTop(tester);

    await tester.sendKeyDownEvent(LogicalKeyboardKey.space);
    await tester.pumpAndSettle();
    expect(
      _labelTop(tester) - rest,
      TRGeneratedMeasurements.controlPressDistance,
      reason: 'the keyboard press must read the same as the pointer press',
    );

    await tester.sendKeyUpEvent(LogicalKeyboardKey.space);
    await tester.pumpAndSettle();
    expect(_labelTop(tester), rest);
  });

  testWidgets('keyboard focus paints the ring and pointer focus does not', (
    tester,
  ) async {
    await _pumpButton(tester, autofocus: true);

    TRFocusSource.instance.debugSetKeyboardModality(true);
    await tester.pumpAndSettle();
    expect(_ringPainter(tester), paints..rrect(color: _colors.focus));

    // Same focus, different modality: the ring is the only thing that changes.
    TRFocusSource.instance.debugSetKeyboardModality(false);
    await tester.pumpAndSettle();
    expect(_ringPainter(tester), isNot(paints..rrect(color: _colors.focus)));
  });
}
