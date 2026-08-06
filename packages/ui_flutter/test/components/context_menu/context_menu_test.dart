import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:tinyrack_ui/tinyrack_ui.dart';

void main() {
  Widget harness({Widget? child}) => MaterialApp(
    theme: TinyrackTheme.light(),
    home: Center(
      child: TRContextMenu(
        menuChildren: [
          TRMenuItem(
            key: const ValueKey<String>('context-menu-item'),
            onPressed: () {},
            child: const Text('Item'),
          ),
        ],
        child: SizedBox(
          width: 320,
          height: 240,
          child: child ?? const ColoredBox(color: Colors.transparent),
        ),
      ),
    ),
  );

  final item = find.byKey(const ValueKey<String>('context-menu-item'));

  testWidgets('context menu opens at the secondary pointer', (tester) async {
    await tester.pumpWidget(harness());

    final target = tester.getCenter(find.byType(TRContextMenu));
    final gesture = await tester.startGesture(
      target,
      kind: PointerDeviceKind.mouse,
      buttons: kSecondaryButton,
    );
    await tester.pump(const Duration(milliseconds: 50));
    await gesture.up();
    await tester.pumpAndSettle();

    expect(item, findsOneWidget);
  });

  testWidgets('context menu ignores a held primary mouse button', (
    tester,
  ) async {
    await tester.pumpWidget(harness());

    final target = tester.getCenter(find.byType(TRContextMenu));
    final gesture = await tester.startGesture(
      target,
      kind: PointerDeviceKind.mouse,
    );
    await tester.pump(const Duration(milliseconds: 700));
    await gesture.up();
    await tester.pumpAndSettle();

    expect(item, findsNothing);
  });

  testWidgets('context menu opens from a touch long press', (tester) async {
    await tester.pumpWidget(harness());

    final target = tester.getCenter(find.byType(TRContextMenu));
    final gesture = await tester.startGesture(target);
    await tester.pump(const Duration(milliseconds: 700));
    await gesture.up();
    await tester.pumpAndSettle();

    expect(item, findsOneWidget);
  });

  testWidgets('context menu leaves Enter and Space to the focused child', (
    tester,
  ) async {
    var pressed = 0;
    await tester.pumpWidget(
      harness(
        child: Center(
          child: TRButton(
            autofocus: true,
            onPressed: () => pressed++,
            child: const Text('Press'),
          ),
        ),
      ),
    );
    await tester.pump();

    await tester.sendKeyEvent(LogicalKeyboardKey.enter);
    await tester.pumpAndSettle();
    await tester.sendKeyEvent(LogicalKeyboardKey.space);
    await tester.pumpAndSettle();

    expect(pressed, greaterThan(0));
    expect(item, findsNothing);
  });

  testWidgets('context menu opens from the keyboard context-menu keys', (
    tester,
  ) async {
    await tester.pumpWidget(
      harness(
        child: Center(
          child: TRButton(
            autofocus: true,
            onPressed: () {},
            child: const Text('Press'),
          ),
        ),
      ),
    );
    await tester.pump();

    await tester.sendKeyEvent(LogicalKeyboardKey.contextMenu);
    await tester.pumpAndSettle();

    expect(item, findsOneWidget);
  });

  testWidgets('context menu closes when the pointer taps its own child', (
    tester,
  ) async {
    await tester.pumpWidget(harness());

    final target = tester.getCenter(find.byType(TRContextMenu));
    final gesture = await tester.startGesture(
      target,
      kind: PointerDeviceKind.mouse,
      buttons: kSecondaryButton,
    );
    await tester.pump(const Duration(milliseconds: 50));
    await gesture.up();
    await tester.pumpAndSettle();

    expect(item, findsOneWidget);

    // The anchor child shares the menu's tap region, so this tap is not an
    // outside tap and the menu must close itself.
    await tester.tapAt(
      tester.getTopLeft(find.byType(TRContextMenu)) + const Offset(8, 8),
    );
    await tester.pumpAndSettle();

    expect(item, findsNothing);
  });

  testWidgets('context menu closes on Escape while it is open', (tester) async {
    await tester.pumpWidget(harness());

    final target = tester.getCenter(find.byType(TRContextMenu));
    final gesture = await tester.startGesture(
      target,
      kind: PointerDeviceKind.mouse,
      buttons: kSecondaryButton,
    );
    await tester.pump(const Duration(milliseconds: 50));
    await gesture.up();
    await tester.pumpAndSettle();

    expect(item, findsOneWidget);

    await tester.sendKeyEvent(LogicalKeyboardKey.escape);
    await tester.pumpAndSettle();

    expect(item, findsNothing);
  });
}
