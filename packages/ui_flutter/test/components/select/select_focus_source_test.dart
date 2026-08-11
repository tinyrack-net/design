import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:tinyrack_ui/src/generated/tokens.g.dart';
import 'package:tinyrack_ui/src/internal/focus_source.dart';
import 'package:tinyrack_ui/tinyrack_ui.dart';

TinyrackThemeData get _colors =>
    TinyrackTheme.light().extension<TinyrackThemeData>()!;

/// Turns animations off without discarding the rest of the media data.
///
/// The viewport size is load-bearing now that a select picks its surface from
/// it, so replacing the whole [MediaQueryData] would silently move these cases
/// onto the sheet.
Widget _app(Widget child) => MaterialApp(
  theme: TinyrackTheme.light(),
  home: Scaffold(
    body: Builder(
      builder: (context) => MediaQuery(
        data: MediaQuery.of(context).copyWith(disableAnimations: true),
        child: Align(alignment: Alignment.topLeft, child: child),
      ),
    ),
  ),
);

Widget _select({
  TRFieldAppearance appearance = TRFieldAppearance.solid,
  String? defaultValue,
  String? errorText,
  TRSelectSurface surface = TRSelectSurface.auto,
}) => TRSelect<String>(
  appearance: appearance,
  defaultValue: defaultValue,
  errorText: errorText,
  surface: surface,
  items: const [
    TRSelectItem<String>(value: 'a', label: 'Alpha'),
    TRSelectItem<String>(value: 'b', label: 'Beta'),
  ],
);

/// The border the trigger actually paints right now, resolved from the states
/// the button is really in rather than from a hypothetical state set.
BorderSide _paintedSide(WidgetTester tester) {
  final button = tester.widget<TextButton>(find.byType(TextButton).first);
  final focused = button.focusNode?.hasFocus ?? false;
  return button.style!.side!.resolve(<WidgetState>{
    if (focused) WidgetState.focused,
  })!;
}

Color _paintedFill(WidgetTester tester) {
  final button = tester.widget<TextButton>(find.byType(TextButton).first);
  final focused = button.focusNode?.hasFocus ?? false;
  return button.style!.backgroundColor!.resolve(<WidgetState>{
    if (focused) WidgetState.focused,
  })!;
}

BorderSide _optionSide(WidgetTester tester, String label) {
  final button = tester.widget<MenuItemButton>(
    find.widgetWithText(MenuItemButton, label),
  );
  return button.style!.side!.resolve(<WidgetState>{
    if (button.focusNode?.hasFocus ?? false) WidgetState.focused,
  })!;
}

Color _optionFill(WidgetTester tester, String label) {
  final button = tester.widget<MenuItemButton>(
    find.widgetWithText(MenuItemButton, label),
  );
  return button.style!.backgroundColor!.resolve(<WidgetState>{
    if (button.focusNode?.hasFocus ?? false) WidgetState.focused,
  })!;
}

/// Opens the popup and dismisses it again, touching nothing but the mouse.
///
/// Dismissing by tapping away rather than by choosing a row keeps the flow off
/// the menu's own hit testing, and it lands on the same `onClose` path that
/// restores focus to the trigger, which is where the defect lives.
Future<void> _openAndDismissWithMouse(WidgetTester tester) async {
  // `kind` is load-bearing: the default for `tap` is touch, which flips
  // FocusManager.highlightMode and would let a broken build pass.
  await tester.tap(find.byType(TextButton), kind: PointerDeviceKind.mouse);
  await tester.pumpAndSettle();
  expect(
    find.widgetWithText(MenuItemButton, 'Beta'),
    findsOneWidget,
    reason: 'the popup has to be open for the close path to be exercised',
  );

  await tester.tapAt(const Offset(600, 500), kind: PointerDeviceKind.mouse);
  await tester.pumpAndSettle();
  expect(find.widgetWithText(MenuItemButton, 'Beta'), findsNothing);
}

void main() {
  setUp(TRFocusSource.instance.debugReset);
  tearDown(TRFocusSource.instance.debugReset);

  testWidgets(
    'a pointer-open ghost select uses selection without a focus border',
    (tester) async {
      await tester.pumpWidget(
        _app(_select(appearance: TRFieldAppearance.ghost)),
      );

      await tester.tap(find.byType(TextButton), kind: PointerDeviceKind.mouse);
      await tester.pumpAndSettle();

      expect(find.widgetWithText(MenuItemButton, 'Beta'), findsOneWidget);
      expect(_paintedFill(tester), _colors.surfaceSelected);
      expect(_paintedSide(tester).color, Colors.transparent);
      expect(_paintedSide(tester).width, TRGeneratedBorders.defaultWidth);
    },
  );

  for (final surface in <TRSelectSurface>[
    TRSelectSurface.menu,
    TRSelectSurface.sheet,
  ]) {
    testWidgets(
      'a pointer-open ${surface.name} selected option uses fill without a focus border',
      (tester) async {
        await tester.pumpWidget(
          _app(_select(defaultValue: 'b', surface: surface)),
        );

        await tester.tap(
          find.byType(TextButton),
          kind: PointerDeviceKind.mouse,
        );
        await tester.pumpAndSettle();

        expect(_optionFill(tester, 'Beta'), isNot(Colors.transparent));
        final side = _optionSide(tester, 'Beta');
        expect(side.color, Colors.transparent);
        expect(side.width, TRGeneratedBorders.defaultWidth);
      },
    );
  }

  for (final appearance in TRFieldAppearance.values) {
    testWidgets(
      'a mouse-driven ${appearance.name} select round trip leaves no focus border',
      (tester) async {
        await tester.pumpWidget(_app(_select(appearance: appearance)));

        await _openAndDismissWithMouse(tester);

        final side = _paintedSide(tester);
        expect(
          side.color,
          isNot(_colors.focus),
          reason:
              'closing the popup restores focus to the trigger, but the '
              'interaction was a mouse click, so nothing should be emphasised',
        );
        expect(side.width, TRGeneratedBorders.defaultWidth);
      },
    );
  }

  /// Gives the trigger keyboard focus.
  ///
  /// Tab is not enough on its own here: the harness wraps the select in a
  /// scope that takes the first stop, so the trigger's own node is focused
  /// directly and the modality is pinned, because the singleton would
  /// otherwise carry the mouse presses of the cases above into this one.
  Future<void> focusWithKeyboard(WidgetTester tester) async {
    TRFocusSource.instance.debugSetKeyboardModality(true);
    tester
        .widget<TextButton>(find.byType(TextButton).first)
        .focusNode!
        .requestFocus();
    await tester.pumpAndSettle();
  }

  testWidgets(
    'a keyboard-focused solid trigger paints the input focus border',
    (tester) async {
      await tester.pumpWidget(_app(_select()));

      await focusWithKeyboard(tester);

      expect(_paintedFill(tester), _colors.surface);
      final side = _paintedSide(tester);
      expect(side.color, _colors.focus);
      expect(side.width, TRGeneratedBorders.focusWidth);
    },
  );

  testWidgets('keyboard focus outranks hover on the trigger', (tester) async {
    await tester.pumpWidget(_app(_select()));

    await focusWithKeyboard(tester);
    final button = tester.widget<TextButton>(find.byType(TextButton).first);

    expect(
      button.style!.backgroundColor!.resolve({
        WidgetState.focused,
        WidgetState.hovered,
      }),
      _colors.surface,
    );
    expect(
      button.style!.side!.resolve({
        WidgetState.focused,
        WidgetState.hovered,
      })!.color,
      _colors.focus,
    );
  });

  testWidgets(
    'a keyboard-focused ghost trigger paints the input focus border',
    (tester) async {
      await tester.pumpWidget(
        _app(_select(appearance: TRFieldAppearance.ghost)),
      );

      await focusWithKeyboard(tester);

      expect(_paintedFill(tester), _colors.surface);
      final side = _paintedSide(tester);
      expect(side.color, _colors.focus);
      expect(side.width, TRGeneratedBorders.focusWidth);
    },
  );

  testWidgets('a keyboard-driven select round trip keeps the focus border', (
    tester,
  ) async {
    await tester.pumpWidget(_app(_select()));

    await focusWithKeyboard(tester);
    await tester.sendKeyEvent(LogicalKeyboardKey.enter);
    await tester.pumpAndSettle();
    await tester.sendKeyEvent(LogicalKeyboardKey.enter);
    await tester.pumpAndSettle();

    expect(_paintedFill(tester), _colors.surface);
    expect(_paintedSide(tester).color, _colors.focus);
  });

  testWidgets('an invalid trigger keeps its danger emphasis while focused', (
    tester,
  ) async {
    await tester.pumpWidget(_app(_select(errorText: 'Pick one')));

    await focusWithKeyboard(tester);

    final side = _paintedSide(tester);
    expect(
      side.color,
      _colors.danger,
      reason: 'invalid emphasis is not what this change removes',
    );
    expect(side.width, TRGeneratedBorders.focusWidth);
  });
}
