import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:tinyrack_ui/src/generated/tokens.g.dart';
import 'package:tinyrack_ui/src/internal/focus_source.dart';
import 'package:tinyrack_ui/src/internal/forced_states.dart';
import 'package:tinyrack_ui/tinyrack_ui.dart';

/// Proves a declared state actually reaches the paint, per component family.
///
/// The wiring is a one-line change at each read site, which is exactly the kind
/// of edit that is easy to omit for one component. A missed one is invisible in
/// the parity suite: the control renders its rest appearance for every declared
/// state, and the comparison against an equally unforced other runtime passes.
Widget _app(Widget child, {TRForcedStateSet? forced}) => MaterialApp(
  theme: TinyrackTheme.light(),
  home: Scaffold(
    body: MediaQuery(
      data: const MediaQueryData(disableAnimations: true),
      child: Align(
        alignment: Alignment.topLeft,
        child: forced == null
            ? child
            : TRForcedStates(states: forced, child: child),
      ),
    ),
  ),
);

TinyrackThemeData get _colors =>
    TinyrackTheme.light().extension<TinyrackThemeData>()!;

void main() {
  setUp(TRFocusSource.instance.debugReset);
  tearDown(TRFocusSource.instance.debugReset);

  testWidgets('a declared press moves the button label', (tester) async {
    const button = TRButton(onPressed: _noop, child: Text('Deploy'));

    await tester.pumpWidget(_app(button));
    await tester.pumpAndSettle();
    final rest = tester.getTopLeft(find.text('Deploy')).dy;

    await tester.pumpWidget(
      _app(button, forced: const TRForcedStateSet(pressed: true)),
    );
    await tester.pumpAndSettle();

    expect(
      tester.getTopLeft(find.text('Deploy')).dy - rest,
      TRGeneratedMeasurements.controlPressDistance,
    );
  });

  testWidgets('a declared keyboard press moves it the same distance', (
    tester,
  ) async {
    const button = TRButton(onPressed: _noop, child: Text('Deploy'));

    await tester.pumpWidget(_app(button));
    await tester.pumpAndSettle();
    final rest = tester.getTopLeft(find.text('Deploy')).dy;

    await tester.pumpWidget(
      _app(button, forced: const TRForcedStateSet(keyboardPressed: true)),
    );
    await tester.pumpAndSettle();

    expect(
      tester.getTopLeft(find.text('Deploy')).dy - rest,
      TRGeneratedMeasurements.controlPressDistance,
    );
  });

  testWidgets('a declared press on a disabled button paints nothing', (
    tester,
  ) async {
    const button = TRButton(onPressed: null, child: Text('Deploy'));

    await tester.pumpWidget(_app(button));
    await tester.pumpAndSettle();
    final rest = tester.getTopLeft(find.text('Deploy')).dy;

    await tester.pumpWidget(
      _app(button, forced: const TRForcedStateSet(pressed: true)),
    );
    await tester.pumpAndSettle();

    expect(
      tester.getTopLeft(find.text('Deploy')).dy,
      rest,
      reason: 'the web has no :active on a disabled button either',
    );
  });

  testWidgets('declared keyboard focus paints the button ring', (tester) async {
    const button = TRButton(onPressed: _noop, child: Text('Deploy'));
    final ring = find
        .descendant(
          of: find.byType(TRButton),
          matching: find.byType(CustomPaint),
        )
        .first;

    await tester.pumpWidget(
      _app(
        button,
        forced: const TRForcedStateSet(focused: true, focusVisible: true),
      ),
    );
    await tester.pumpAndSettle();
    expect(tester.renderObject(ring), paints..rrect(color: _colors.focus));

    // Focus without the keyboard: same focus, no emphasis.
    await tester.pumpWidget(
      _app(button, forced: const TRForcedStateSet(focused: true)),
    );
    await tester.pumpAndSettle();
    expect(
      tester.renderObject(ring),
      isNot(paints..rrect(color: _colors.focus)),
    );
  });

  testWidgets('a declared hover reaches a hand-rolled control', (tester) async {
    const link = TRLink(underline: TRLinkUnderline.hover, child: Text('Docs'));

    await tester.pumpWidget(_app(link));
    await tester.pumpAndSettle();
    final rest = tester
        .widget<DefaultTextStyle>(
          find
              .descendant(
                of: find.byType(TRLink),
                matching: find.byType(DefaultTextStyle),
              )
              .last,
        )
        .style
        .decoration;

    await tester.pumpWidget(
      _app(link, forced: const TRForcedStateSet(hovered: true)),
    );
    await tester.pumpAndSettle();
    final hovered = tester
        .widget<DefaultTextStyle>(
          find
              .descendant(
                of: find.byType(TRLink),
                matching: find.byType(DefaultTextStyle),
              )
              .last,
        )
        .style
        .decoration;

    expect(hovered, isNot(rest));
  });

  testWidgets('a declared focus reaches a field through its chrome', (
    tester,
  ) async {
    const field = SizedBox(width: 200, child: TRTextField());

    await tester.pumpWidget(_app(field));
    await tester.pumpAndSettle();
    final rest = _fieldBorderColor(tester);

    await tester.pumpWidget(
      _app(
        field,
        forced: const TRForcedStateSet(focused: true, focusVisible: true),
      ),
    );
    await tester.pumpAndSettle();

    expect(_fieldBorderColor(tester), _colors.focus);
    expect(_fieldBorderColor(tester), isNot(rest));
  });
}

void _noop() {}

Color? _fieldBorderColor(WidgetTester tester) {
  final container = tester
      .widgetList<AnimatedContainer>(
        find.descendant(
          of: find.byType(TRTextField),
          matching: find.byType(AnimatedContainer),
        ),
      )
      .first;
  final decoration = container.foregroundDecoration ?? container.decoration;
  return (decoration as BoxDecoration?)?.border?.top.color;
}
