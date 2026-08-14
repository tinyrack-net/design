import 'package:flutter/gestures.dart';
import 'package:material_ui/material_ui.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:tinyrack_ui/src/internal/focus_source.dart';
import 'package:tinyrack_ui/src/internal/layer.dart';
import 'package:tinyrack_ui/tinyrack_ui.dart';

/// Who owns focus while a layer is open, and where it goes when it closes.
///
/// Direct widget coverage distinguishes trigger focus from popup focus.
/// Animations are turned off through a copy rather than a fresh
/// [MediaQueryData] so the viewport size survives: a select reads it to decide
/// between its dropdown and its sheet, and a zero-width viewport is a sheet.
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

bool _focusHasAncestor(String debugLabel) {
  FocusNode? node = FocusManager.instance.primaryFocus;
  while (node != null) {
    if (node.debugLabel == debugLabel) return true;
    node = node.parent;
  }
  return false;
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

  testWidgets('an open select with no selection focuses its overlay scope', (
    tester,
  ) async {
    await tester.pumpWidget(_app(_select()));

    await tester.tap(find.byType(TextButton), kind: PointerDeviceKind.mouse);
    await tester.pumpAndSettle();

    final trigger = tester.widget<TextButton>(find.byType(TextButton).first);
    expect(trigger.focusNode?.hasFocus, isFalse);
    expect(
      FocusManager.instance.primaryFocus?.debugLabel,
      'TRSelect layer panel',
    );
    expect(
      _focusHasAncestor('TRAnchoredLayer surface'),
      isTrue,
      reason:
          'the panel must belong to the overlay scope, not the trigger tree',
    );
  });

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
