import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:tinyrack_ui/src/generated/tokens.g.dart';
import 'package:tinyrack_ui/src/internal/field_chrome.dart';
import 'package:tinyrack_ui/tinyrack_ui.dart';

TinyrackThemeData get _colors =>
    TinyrackTheme.light().extension<TinyrackThemeData>()!;

Widget _app(Widget child) => MaterialApp(
  theme: TinyrackTheme.light(),
  home: Scaffold(
    body: MediaQuery(
      data: const MediaQueryData(disableAnimations: true),
      child: Align(alignment: Alignment.topLeft, child: child),
    ),
  ),
);

void main() {
  group('resolveFieldChrome', () {
    // Distinctive stand-ins so a passthrough is unambiguous.
    const solidFill = Color(0xFF010203);
    const solidBorder = Color(0xFF040506);
    const solidWidth = 7.0;

    TRFieldChrome resolve(
      TRFieldAppearance appearance, {
      bool enabled = true,
      bool error = false,
      bool focused = false,
      bool hovered = false,
      bool open = false,
      bool readOnly = false,
    }) => resolveFieldChrome(
      appearance: appearance,
      colors: _colors,
      solidFill: solidFill,
      solidBorderColor: solidBorder,
      solidBorderWidth: solidWidth,
      enabled: enabled,
      error: error,
      focused: focused,
      hovered: hovered,
      open: open,
      readOnly: readOnly,
    );

    test('solid returns the caller values for every state', () {
      for (final state in <Map<String, bool>>[
        {},
        {'focused': true},
        {'hovered': true},
        {'error': true},
        {'open': true},
        {'enabled': false},
        {'readOnly': true},
        {'error': true, 'focused': true},
      ]) {
        final chrome = resolve(
          TRFieldAppearance.solid,
          enabled: state['enabled'] ?? true,
          error: state['error'] ?? false,
          focused: state['focused'] ?? false,
          hovered: state['hovered'] ?? false,
          open: state['open'] ?? false,
          readOnly: state['readOnly'] ?? false,
        );
        expect(chrome.fill, solidFill, reason: '$state');
        expect(chrome.borderColor, solidBorder, reason: '$state');
        expect(chrome.borderWidth, solidWidth, reason: '$state');
      }
    });

    test('ghost is flat at rest and when disabled or read-only', () {
      for (final chrome in [
        resolve(TRFieldAppearance.ghost),
        resolve(TRFieldAppearance.ghost, enabled: false),
        resolve(TRFieldAppearance.ghost, readOnly: true),
        // A read-only field must not answer the pointer either.
        resolve(TRFieldAppearance.ghost, hovered: true, readOnly: true),
      ]) {
        expect(chrome.fill, Colors.transparent);
        expect(chrome.borderColor, Colors.transparent);
      }
    });

    test('ghost keeps hover, focus, open, and invalid emphasis', () {
      final colors = _colors;

      final hovered = resolve(TRFieldAppearance.ghost, hovered: true);
      expect(hovered.fill, colors.surfaceHover);
      expect(hovered.borderColor, Colors.transparent);

      final focused = resolve(TRFieldAppearance.ghost, focused: true);
      expect(focused.fill, colors.surface);
      expect(focused.borderColor, colors.focus);

      final open = resolve(TRFieldAppearance.ghost, open: true);
      expect(open.fill, colors.surfaceSelected);
      expect(open.borderColor, Colors.transparent);
      expect(open.borderWidth, TRGeneratedBorders.defaultWidth);

      final invalid = resolve(TRFieldAppearance.ghost, error: true);
      expect(invalid.borderColor, colors.dangerBorder);

      final invalidFocused = resolve(
        TRFieldAppearance.ghost,
        error: true,
        focused: true,
      );
      expect(invalidFocused.borderColor, colors.danger);
    });

    test('plain paints no chrome of its own in any interactive state', () {
      // The enclosing group owns the frame, so the field must not answer
      // hover, focus, or open with a second border inside that frame.
      for (final chrome in [
        resolve(TRFieldAppearance.plain),
        resolve(TRFieldAppearance.plain, hovered: true),
        resolve(TRFieldAppearance.plain, focused: true),
        resolve(TRFieldAppearance.plain, open: true),
        resolve(TRFieldAppearance.plain, enabled: false),
        resolve(TRFieldAppearance.plain, readOnly: true),
      ]) {
        expect(chrome.fill, Colors.transparent);
        expect(chrome.borderColor, Colors.transparent);
        expect(chrome.borderWidth, greaterThan(0));
      }
    });

    test('plain still reports an invalid value', () {
      // A group cannot know the field is invalid, so this emphasis is the one
      // thing the field keeps.
      final colors = _colors;

      expect(
        resolve(TRFieldAppearance.plain, error: true).borderColor,
        colors.dangerBorder,
      );
      expect(
        resolve(
          TRFieldAppearance.plain,
          error: true,
          focused: true,
        ).borderColor,
        colors.danger,
      );
    });

    test('ghost never changes a field metric', () {
      // Every ghost state returns a real border width, so a field keeps the
      // same box whichever appearance it is given.
      for (final chrome in [
        resolve(TRFieldAppearance.ghost),
        resolve(TRFieldAppearance.ghost, hovered: true),
        resolve(TRFieldAppearance.ghost, enabled: false),
        resolve(TRFieldAppearance.ghost, error: true),
      ]) {
        expect(chrome.borderWidth, greaterThan(0));
      }
    });
  });

  testWidgets('a ghost select trigger drops only its resting chrome', (
    tester,
  ) async {
    await tester.pumpWidget(
      _app(
        const TRSelect<String>(
          appearance: TRFieldAppearance.ghost,
          items: [TRSelectItem<String>(value: 'a', label: 'Alpha')],
        ),
      ),
    );
    final style = tester.widget<TextButton>(find.byType(TextButton)).style!;
    final colors = _colors;

    expect(style.backgroundColor!.resolve(<WidgetState>{}), Colors.transparent);
    expect(style.side!.resolve(<WidgetState>{})!.color, Colors.transparent);
    expect(
      style.backgroundColor!.resolve({WidgetState.hovered}),
      colors.surfaceHover,
    );
    expect(
      style.backgroundColor!.resolve({WidgetState.focused}),
      colors.surface,
      reason: 'keyboard focus restores the shared field surface',
    );
    expect(
      style.side!.resolve({WidgetState.focused})!.color,
      colors.focus,
      reason: 'keyboard focus uses the same focus border as an input',
    );
  });

  testWidgets('a solid select trigger keeps its resting chrome', (
    tester,
  ) async {
    await tester.pumpWidget(
      _app(
        const TRSelect<String>(
          items: [TRSelectItem<String>(value: 'a', label: 'Alpha')],
        ),
      ),
    );
    final style = tester.widget<TextButton>(find.byType(TextButton)).style!;

    expect(style.backgroundColor!.resolve(<WidgetState>{}), _colors.surface);
    expect(style.side!.resolve(<WidgetState>{})!.color, _colors.border);
  });

  testWidgets('a focused plain text field leaves the frame to its group', (
    tester,
  ) async {
    final focusNode = FocusNode();
    addTearDown(focusNode.dispose);
    await tester.pumpWidget(
      _app(
        SizedBox(
          width: TRMeasurements.measureSm,
          child: TRTextField(
            appearance: TRFieldAppearance.plain,
            focusNode: focusNode,
          ),
        ),
      ),
    );

    Color border() => tester
        .widgetList<AnimatedContainer>(find.byType(AnimatedContainer))
        .map((container) => container.foregroundDecoration)
        .whereType<BoxDecoration>()
        .map((decoration) => decoration.border!.top.color)
        .first;

    expect(border(), Colors.transparent);

    focusNode.requestFocus();
    await tester.pumpAndSettle();

    expect(
      border(),
      Colors.transparent,
      reason: 'the surface wrapping the field paints the focus ring instead',
    );
  });

  testWidgets('an invalid text field paints the error border without a '
      'message', (tester) async {
    // A field whose message is owned by an enclosing component still has to
    // read as invalid on its own frame.
    await tester.pumpWidget(_app(const TRTextField(invalid: true)));
    await tester.pumpAndSettle();

    final border = tester
        .widgetList<AnimatedContainer>(find.byType(AnimatedContainer))
        .map((container) => container.foregroundDecoration)
        .whereType<BoxDecoration>()
        .map((decoration) => decoration.border!.top.color);
    expect(border, contains(_colors.dangerBorder));
    expect(find.byType(Text), findsNothing);
  });

  testWidgets('ghost OTP slots stay flat until they are invalid', (
    tester,
  ) async {
    Future<List<BoxDecoration>> slots({String? errorText}) async {
      await tester.pumpWidget(
        _app(
          TROtpField(
            appearance: TRFieldAppearance.ghost,
            errorText: errorText,
            length: 3,
          ),
        ),
      );
      await tester.pumpAndSettle();
      return tester
          .widgetList<AnimatedContainer>(find.byType(AnimatedContainer))
          .map((container) => container.decoration)
          .whereType<BoxDecoration>()
          .toList();
    }

    final resting = await slots();
    expect(resting, isNotEmpty);
    for (final decoration in resting) {
      expect(decoration.color, Colors.transparent);
      expect(decoration.border!.top.color, Colors.transparent);
    }

    final invalid = await slots(errorText: 'Wrong code');
    expect(
      invalid.map((decoration) => decoration.border!.top.color),
      everyElement(_colors.dangerBorder),
    );
  });
}
