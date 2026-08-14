import 'package:flutter/gestures.dart';
import 'package:material_ui/material_ui.dart';
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
Widget _app(Widget child, {bool disableAnimations = true, ThemeData? theme}) =>
    MaterialApp(
      theme: theme?.brightness == Brightness.light
          ? theme
          : TinyrackTheme.light(),
      darkTheme: theme?.brightness == Brightness.dark
          ? theme
          : TinyrackTheme.dark(),
      themeMode: theme?.brightness == Brightness.dark
          ? ThemeMode.dark
          : ThemeMode.light,
      home: Scaffold(
        body: MediaQuery(
          data: MediaQueryData(disableAnimations: disableAnimations),
          child: Align(alignment: Alignment.topLeft, child: child),
        ),
      ),
    );

TinyrackThemeData get _colors =>
    TinyrackTheme.light().extension<TinyrackThemeData>()!;

Future<void> _pumpButton(
  WidgetTester tester, {
  bool autofocus = false,
  bool disableAnimations = true,
}) async {
  await tester.pumpWidget(
    _app(
      TRButton(
        autofocus: autofocus,
        onPressed: () {},
        child: const Text('Deploy'),
      ),
      disableAnimations: disableAnimations,
    ),
  );
  await tester.pumpAndSettle();
}

AnimatedContainer _surface(WidgetTester tester) => tester
    .widgetList<AnimatedContainer>(
      find.descendant(
        of: find.byType(TRButton),
        matching: find.byType(AnimatedContainer),
      ),
    )
    .singleWhere((container) => container.decoration != null);

Color _paintedSurfaceColor(WidgetTester tester) {
  final decorated = find.descendant(
    of: find.byWidget(_surface(tester)),
    matching: find.byType(DecoratedBox),
  );
  return (tester.widget<DecoratedBox>(decorated.first).decoration
          as BoxDecoration)
      .color!;
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

  testWidgets('touch press starts immediately and uses asymmetric motion', (
    tester,
  ) async {
    await _pumpButton(tester, disableAnimations: false);
    final rest = _labelTop(tester);
    final colors = _colors;

    final gesture = await tester.startGesture(
      tester.getCenter(find.byType(TRButton)),
      kind: PointerDeviceKind.touch,
    );
    await tester.pump();

    final entering = _surface(tester);
    expect(
      (entering.decoration! as BoxDecoration).color,
      colors.surfaceSelected,
    );
    expect(entering.duration, TRGeneratedMotion.immediate);
    expect(entering.curve, TRGeneratedMotion.easeOut);

    final startColor = _paintedSurfaceColor(tester);
    await tester.pump(TRGeneratedMotion.immediate ~/ 2);
    final halfwayColor = _paintedSurfaceColor(tester);
    expect(halfwayColor, isNot(startColor));
    expect(halfwayColor, isNot(colors.surfaceSelected));

    await tester.pump(TRGeneratedMotion.immediate ~/ 2);
    expect(_paintedSurfaceColor(tester), colors.surfaceSelected);
    expect(
      _labelTop(tester) - rest,
      TRGeneratedMeasurements.controlPressDistance,
    );

    await gesture.up();
    await tester.pump();
    final releasing = _surface(tester);
    expect(releasing.duration, TRGeneratedMotion.fast);
    expect(releasing.curve, TRGeneratedMotion.standard);
    await tester.pump(TRGeneratedMotion.fast);
    expect(_labelTop(tester), rest);
  });

  testWidgets('reduced motion makes both touch transitions immediate', (
    tester,
  ) async {
    await _pumpButton(tester);
    final gesture = await tester.startGesture(
      tester.getCenter(find.byType(TRButton)),
      kind: PointerDeviceKind.touch,
    );
    await tester.pump();
    expect(_surface(tester).duration, Duration.zero);
    expect(_paintedSurfaceColor(tester), _colors.surfaceSelected);

    await gesture.up();
    await tester.pump();
    expect(_surface(tester).duration, Duration.zero);
  });

  testWidgets('touch keeps intent pressed colors in light and dark themes', (
    tester,
  ) async {
    for (final (theme, pressedColor) in [
      (TinyrackTheme.light(), TRGeneratedColors.light.dangerPressed),
      (TinyrackTheme.dark(), TRGeneratedColors.dark.dangerPressed),
    ]) {
      await tester.pumpWidget(
        _app(
          TRButton(
            intent: TRIntent.danger,
            onPressed: () {},
            child: const Text('Deploy'),
          ),
          disableAnimations: false,
          theme: theme,
        ),
      );
      await tester.pumpAndSettle();
      final gesture = await tester.startGesture(
        tester.getCenter(find.byType(TRButton)),
        kind: PointerDeviceKind.touch,
      );
      await tester.pump();
      await tester.pump(TRGeneratedMotion.immediate);
      expect(_paintedSurfaceColor(tester), pressedColor);
      await gesture.up();
      await tester.pumpAndSettle();
    }
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
