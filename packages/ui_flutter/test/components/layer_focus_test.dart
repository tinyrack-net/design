import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:tinyrack_ui/src/internal/focus_source.dart';
import 'package:tinyrack_ui/src/internal/layer.dart';
import 'package:tinyrack_ui/tinyrack_ui.dart';

/// Who owns focus while a layer is open, and where it goes when it closes.
///
/// The visual parity suite carried this as a hard-coded component allow-list
/// (`openLayerOwnsFocus`) purely because its telemetry channel happened to
/// expose a `focused` flag, and that flag came from a wrapper around the whole
/// preview -- so trigger focus and popup focus were indistinguishable to it.
/// Stating the contract here makes the difference visible.
Widget _app(Widget child) => MaterialApp(
  theme: TinyrackTheme.light(),
  home: Scaffold(
    body: MediaQuery(
      data: const MediaQueryData(disableAnimations: true),
      child: Align(alignment: Alignment.topLeft, child: child),
    ),
  ),
);

Widget _select() => const TRSelect<String>(
  items: [
    TRSelectItem<String>(value: 'a', label: 'Alpha'),
    TRSelectItem<String>(value: 'b', label: 'Beta'),
  ],
);

/// Whether the primary focus sits inside a layer surface of any kind.
bool _focusIsInsideLayer() {
  final context = FocusManager.instance.primaryFocus?.context;
  if (context == null) return false;
  var found = false;
  context.visitAncestorElements((ancestor) {
    if (ancestor.renderObject is RenderTRLayerBoundary) {
      found = true;
      return false;
    }
    return true;
  });
  return found;
}

void main() {
  setUp(TRFocusSource.instance.debugReset);
  tearDown(TRFocusSource.instance.debugReset);

  testWidgets('an open select keeps focus reachable for the keyboard', (
    tester,
  ) async {
    await tester.pumpWidget(_app(_select()));

    await tester.tap(find.byType(TextButton), kind: PointerDeviceKind.mouse);
    await tester.pumpAndSettle();

    expect(
      find.widgetWithText(MenuItemButton, 'Beta'),
      findsOneWidget,
      reason: 'the popup has to be open for the focus claim to mean anything',
    );
    expect(
      FocusManager.instance.primaryFocus?.hasPrimaryFocus,
      isTrue,
      reason: 'something must hold focus or the list cannot be driven by key',
    );
  });

  testWidgets(
    'an open select with no selection focuses its trigger, not the popup',
    (tester) async {
      await tester.pumpWidget(_app(_select()));

      await tester.tap(find.byType(TextButton), kind: PointerDeviceKind.mouse);
      await tester.pumpAndSettle();

      // Records today's behaviour rather than the intended one. `TRSelect`
      // focuses the selected row on open and falls back to the trigger when
      // nothing is selected, while Base UI moves focus into the popup on the
      // web. The parity suite could not see the difference because its
      // `focused` flag came from a wrapper around the whole preview. Change
      // this expectation when the two platforms are aligned.
      expect(_focusIsInsideLayer(), isFalse);
      // The popup contributes buttons of its own, so the trigger is the first.
      final trigger = tester.widget<TextButton>(find.byType(TextButton).first);
      expect(trigger.focusNode?.hasFocus, isTrue);
    },
  );

  testWidgets('an open select with a selection focuses the selected row', (
    tester,
  ) async {
    await tester.pumpWidget(
      _app(
        const TRSelect<String>(
          defaultValue: 'b',
          items: [
            TRSelectItem<String>(value: 'a', label: 'Alpha'),
            TRSelectItem<String>(value: 'b', label: 'Beta'),
          ],
        ),
      ),
    );

    await tester.tap(find.byType(TextButton), kind: PointerDeviceKind.mouse);
    await tester.pumpAndSettle();

    expect(
      _focusIsInsideLayer(),
      isTrue,
      reason: 'the selected row takes focus so arrow keys start from it',
    );
  });

  testWidgets('closing returns focus to the trigger', (tester) async {
    await tester.pumpWidget(_app(_select()));

    await tester.tap(find.byType(TextButton), kind: PointerDeviceKind.mouse);
    await tester.pumpAndSettle();
    await tester.sendKeyEvent(LogicalKeyboardKey.escape);
    await tester.pumpAndSettle();

    expect(find.widgetWithText(MenuItemButton, 'Beta'), findsNothing);
    final trigger = tester.widget<TextButton>(find.byType(TextButton));
    expect(
      trigger.focusNode?.hasFocus,
      isTrue,
      reason: 'a keyboard user must land back where they started',
    );
  });
}
