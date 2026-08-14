import 'package:flutter/gestures.dart';
import 'package:material_ui/material_ui.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:tinyrack_ui/src/internal/focus_source.dart';
import 'package:tinyrack_ui/tinyrack_ui.dart';

/// Activation semantics for the shared button interaction frame.
///
/// Direct widget coverage keeps event failures separate from rendering checks.
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
  // The source is a process-global singleton, so without this one test's mouse
  // press decides whether the next one paints a ring.
  setUp(TRFocusSource.instance.debugReset);
  tearDown(TRFocusSource.instance.debugReset);

  group('pointer', () {
    testWidgets('a short touch activates once without a press delay', (
      tester,
    ) async {
      var activations = 0;
      await tester.pumpWidget(
        _app(
          TRButton(
            onPressed: () => activations += 1,
            child: const Text('Deploy'),
          ),
        ),
      );

      final gesture = await tester.startGesture(
        tester.getCenter(find.byType(TRButton)),
        kind: PointerDeviceKind.touch,
      );
      await gesture.up();
      await tester.pump();

      expect(activations, 1);
    });

    testWidgets('a held pointer does not activate', (tester) async {
      var activations = 0;
      await tester.pumpWidget(
        _app(
          TRButton(
            onPressed: () => activations += 1,
            child: const Text('Deploy'),
          ),
        ),
      );

      // `kind` is load-bearing everywhere in this file: the default is touch,
      // which flips FocusManager.highlightMode and changes what is painted.
      final gesture = await tester.startGesture(
        tester.getCenter(find.byType(TRButton)),
        kind: PointerDeviceKind.mouse,
      );
      await tester.pump();
      expect(activations, 0);

      await gesture.up();
      await tester.pump();
      expect(activations, 1, reason: 'release is what activates');
    });

    testWidgets('a cancelled press does not activate', (tester) async {
      var activations = 0;
      await tester.pumpWidget(
        _app(
          TRButton(
            onPressed: () => activations += 1,
            child: const Text('Deploy'),
          ),
        ),
      );

      final gesture = await tester.startGesture(
        tester.getCenter(find.byType(TRButton)),
        kind: PointerDeviceKind.mouse,
      );
      await tester.pump();
      await gesture.cancel();
      await tester.pumpAndSettle();

      expect(activations, 0);
    });

    testWidgets('a touch that becomes a scroll does not activate', (
      tester,
    ) async {
      var activations = 0;
      await tester.pumpWidget(
        _app(
          SizedBox(
            width: 300,
            height: 200,
            child: ListView(
              children: [
                const SizedBox(height: 80),
                TRButton(
                  onPressed: () => activations += 1,
                  child: const Text('Deploy'),
                ),
                const SizedBox(height: 400),
              ],
            ),
          ),
        ),
      );

      final gesture = await tester.startGesture(
        tester.getCenter(find.byType(TRButton)),
        kind: PointerDeviceKind.touch,
      );
      await gesture.moveBy(const Offset(0, -80));
      await gesture.up();
      await tester.pumpAndSettle();

      expect(activations, 0);
    });
  });

  group('keyboard', () {
    Future<int Function()> pumpFocused(WidgetTester tester) async {
      var activations = 0;
      await tester.pumpWidget(
        _app(
          TRButton(
            autofocus: true,
            onPressed: () => activations += 1,
            child: const Text('Deploy'),
          ),
        ),
      );
      await tester.pumpAndSettle();
      return () => activations;
    }

    testWidgets('Space activates on release, not on press', (tester) async {
      final activations = await pumpFocused(tester);

      await tester.sendKeyDownEvent(LogicalKeyboardKey.space);
      await tester.pump();
      expect(activations(), 0, reason: 'the button is held, not activated');

      await tester.sendKeyUpEvent(LogicalKeyboardKey.space);
      await tester.pump();
      expect(activations(), 1);
    });

    testWidgets('a repeated Space keydown does not double-activate', (
      tester,
    ) async {
      final activations = await pumpFocused(tester);

      await tester.sendKeyDownEvent(LogicalKeyboardKey.space);
      // A held key repeats. `sendKeyRepeatEvent` rather than a second
      // `sendKeyDownEvent`, which flutter_test asserts on as a duplicate.
      await tester.sendKeyRepeatEvent(LogicalKeyboardKey.space);
      await tester.sendKeyRepeatEvent(LogicalKeyboardKey.space);
      await tester.pump();
      expect(activations(), 0);

      await tester.sendKeyUpEvent(LogicalKeyboardKey.space);
      await tester.pump();
      expect(activations(), 1, reason: 'the repeats must not each activate');
    });

    testWidgets('Enter activates on press', (tester) async {
      final activations = await pumpFocused(tester);

      await tester.sendKeyDownEvent(LogicalKeyboardKey.enter);
      await tester.pump();
      expect(activations(), 1, reason: 'Enter activates without waiting');

      await tester.sendKeyUpEvent(LogicalKeyboardKey.enter);
      await tester.pump();
      expect(activations(), 1, reason: 'the release adds nothing');
    });
  });

  testWidgets('a disabled button ignores pointer, Space and Enter', (
    tester,
  ) async {
    var activations = 0;
    await tester.pumpWidget(
      _app(
        TRButton(autofocus: true, onPressed: null, child: const Text('Deploy')),
      ),
    );
    await tester.pumpAndSettle();

    await tester.tap(find.byType(TRButton), kind: PointerDeviceKind.mouse);
    await tester.sendKeyDownEvent(LogicalKeyboardKey.space);
    await tester.sendKeyUpEvent(LogicalKeyboardKey.space);
    await tester.sendKeyDownEvent(LogicalKeyboardKey.enter);
    await tester.pumpAndSettle();

    expect(activations, 0);
  });
}
