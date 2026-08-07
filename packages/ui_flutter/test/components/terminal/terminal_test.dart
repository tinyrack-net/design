import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:tinyrack_ui/tinyrack_ui.dart';
import 'package:xterm/xterm.dart' as xterm;

void main() {
  testWidgets(
    'terminal forwards input and resize through its public controller',
    (tester) async {
      final input = <String>[];
      final sizes = <TRTerminalSize>[];
      final controller = TRTerminalController();
      addTearDown(controller.dispose);

      await tester.pumpWidget(
        MaterialApp(
          theme: TinyrackTheme.light(),
          home: SizedBox(
            width: 640,
            height: 360,
            child: TRTerminalView(
              controller: controller,
              autofocus: true,
              onInput: input.add,
              onResize: sizes.add,
            ),
          ),
        ),
      );

      controller.write('ready\r\n');
      await tester.pump();
      controller.input('a');
      await tester.pump();

      expect(find.byType(TRTerminalView), findsOneWidget);
      expect(input, contains('a'));
      expect(sizes, isNotEmpty);
      expect(sizes.last.columns, greaterThan(0));
      expect(sizes.last.rows, greaterThan(0));
    },
  );

  testWidgets('terminal sends each composed syllable to the program once', (
    tester,
  ) async {
    final input = <String>[];
    final controller = TRTerminalController();
    addTearDown(controller.dispose);

    await tester.pumpWidget(
      MaterialApp(
        theme: TinyrackTheme.light(),
        home: SizedBox(
          width: 640,
          height: 360,
          child: TRTerminalView(
            controller: controller,
            autofocus: true,
            onInput: input.add,
          ),
        ),
      ),
    );
    await tester.pump();

    // A Hangul input method keeps the committed text in the platform editing
    // buffer across a composition session instead of honouring the reset the
    // terminal asks for, so every commit repeats the whole buffer.
    const session = <TextEditingValue>[
      TextEditingValue(
        text: 'ㅂ',
        selection: TextSelection.collapsed(offset: 1),
        composing: TextRange(start: 0, end: 1),
      ),
      TextEditingValue(
        text: '바',
        selection: TextSelection.collapsed(offset: 1),
        composing: TextRange(start: 0, end: 1),
      ),
      TextEditingValue(
        text: '반',
        selection: TextSelection.collapsed(offset: 1),
        composing: TextRange(start: 0, end: 1),
      ),
      TextEditingValue(
        text: '반',
        selection: TextSelection.collapsed(offset: 1),
      ),
      TextEditingValue(
        text: '반ㄱ',
        selection: TextSelection.collapsed(offset: 2),
        composing: TextRange(start: 1, end: 2),
      ),
      TextEditingValue(
        text: '반가',
        selection: TextSelection.collapsed(offset: 2),
        composing: TextRange(start: 1, end: 2),
      ),
      TextEditingValue(
        text: '반갑',
        selection: TextSelection.collapsed(offset: 2),
        composing: TextRange(start: 1, end: 2),
      ),
      TextEditingValue(
        text: '반갑',
        selection: TextSelection.collapsed(offset: 2),
      ),
      TextEditingValue(
        text: '반갑ㄷ',
        selection: TextSelection.collapsed(offset: 3),
        composing: TextRange(start: 2, end: 3),
      ),
      TextEditingValue(
        text: '반갑다',
        selection: TextSelection.collapsed(offset: 3),
        composing: TextRange(start: 2, end: 3),
      ),
      TextEditingValue(
        text: '반갑다',
        selection: TextSelection.collapsed(offset: 3),
      ),
    ];
    for (final value in session) {
      tester.testTextInput.updateEditingValue(value);
      await tester.pump();
    }

    expect(input.join(), '반갑다');
  });

  testWidgets('terminal sends a sticky buffer that repeats its commit once', (
    tester,
  ) async {
    final input = <String>[];
    final controller = TRTerminalController();
    addTearDown(controller.dispose);

    await tester.pumpWidget(
      MaterialApp(
        theme: TinyrackTheme.light(),
        home: SizedBox(
          width: 640,
          height: 360,
          child: TRTerminalView(
            controller: controller,
            autofocus: true,
            onInput: input.add,
          ),
        ),
      ),
    );
    await tester.pump();

    // A sticky input method ends a composition session by reporting the same
    // committed buffer one more time, without any new character.
    const session = <TextEditingValue>[
      TextEditingValue(
        text: '한',
        selection: TextSelection.collapsed(offset: 1),
        composing: TextRange(start: 0, end: 1),
      ),
      TextEditingValue(
        text: '한',
        selection: TextSelection.collapsed(offset: 1),
      ),
      TextEditingValue(
        text: '한솔',
        selection: TextSelection.collapsed(offset: 2),
        composing: TextRange(start: 1, end: 2),
      ),
      TextEditingValue(
        text: '한솔',
        selection: TextSelection.collapsed(offset: 2),
      ),
      TextEditingValue(
        text: '한솔',
        selection: TextSelection.collapsed(offset: 2),
      ),
    ];
    for (final value in session) {
      tester.testTextInput.updateEditingValue(value);
      await tester.pump();
    }

    expect(input.join(), '한솔');
  });

  testWidgets('terminal sends repeated characters when the buffer resets', (
    tester,
  ) async {
    final input = <String>[];
    final controller = TRTerminalController();
    addTearDown(controller.dispose);

    await tester.pumpWidget(
      MaterialApp(
        theme: TinyrackTheme.light(),
        home: SizedBox(
          width: 640,
          height: 360,
          child: TRTerminalView(
            controller: controller,
            autofocus: true,
            onInput: input.add,
          ),
        ),
      ),
    );
    await tester.pump();

    // A platform that honours the editing state reset reports one character at
    // a time, including the same character twice in a row.
    for (final text in const ['a', 'a', 'b']) {
      tester.testTextInput.updateEditingValue(
        TextEditingValue(
          text: text,
          selection: const TextSelection.collapsed(offset: 1),
        ),
      );
      await tester.pump();
    }

    expect(input.join(), 'aab');
  });

  testWidgets(
    'terminal exposes its selection and pastes through its controller',
    (tester) async {
      final input = <String>[];
      final controller = TRTerminalController();
      addTearDown(controller.dispose);
      var selectionNotifications = 0;
      controller.selectionChanges.addListener(() => selectionNotifications++);

      await tester.pumpWidget(
        MaterialApp(
          theme: TinyrackTheme.light(),
          home: SizedBox(
            width: 640,
            height: 360,
            child: TRTerminalView(controller: controller, onInput: input.add),
          ),
        ),
      );
      controller.write('selectable output');
      await tester.pump();

      expect(controller.hasSelection, isFalse);
      expect(controller.selectedText, isNull);

      controller.selectAll();
      await tester.pump();

      expect(controller.hasSelection, isTrue);
      expect(controller.selectedText, contains('selectable output'));
      expect(selectionNotifications, greaterThan(0));

      controller.clearSelection();
      await tester.pump();

      expect(controller.hasSelection, isFalse);
      expect(controller.selectedText, isNull);

      controller.paste('pasted');
      await tester.pump();

      expect(input, contains('pasted'));
    },
  );

  testWidgets('terminal reports the region the pointer selects', (
    tester,
  ) async {
    final controller = TRTerminalController();
    addTearDown(controller.dispose);

    await tester.pumpWidget(
      MaterialApp(
        theme: TinyrackTheme.light(),
        home: SizedBox(
          width: 640,
          height: 360,
          child: TRTerminalView(controller: controller),
        ),
      ),
    );
    controller.write('draggable output');
    await tester.pump();

    final surface = find.byKey(const ValueKey<String>('tr-terminal-surface'));
    final origin = tester.getTopLeft(surface) + const Offset(12, 12);
    final gesture = await tester.startGesture(
      origin,
      kind: PointerDeviceKind.mouse,
    );
    await tester.pump();
    await gesture.moveBy(const Offset(120, 0));
    await tester.pump();
    await gesture.up();
    await tester.pump();

    expect(controller.hasSelection, isTrue);
    expect(controller.selectedText, isNotEmpty);
  });

  testWidgets('terminal opens its context menu at the secondary pointer', (
    tester,
  ) async {
    final controller = TRTerminalController();
    addTearDown(controller.dispose);
    var copied = 0;

    await tester.pumpWidget(
      MaterialApp(
        theme: TinyrackTheme.light(),
        home: SizedBox(
          width: 640,
          height: 360,
          child: TRTerminalView(
            controller: controller,
            contextMenuBuilder: (context) => [
              TRMenuItem(
                key: const ValueKey<String>('terminal-copy'),
                onPressed: () => copied++,
                child: const Text('Copy'),
              ),
            ],
          ),
        ),
      ),
    );
    controller.write('output');
    await tester.pump();

    final copy = find.byKey(const ValueKey<String>('terminal-copy'));
    expect(copy, findsNothing);

    final surface = find.byKey(const ValueKey<String>('tr-terminal-surface'));
    final origin = tester.getTopLeft(surface) + const Offset(24, 24);
    final gesture = await tester.startGesture(
      origin,
      kind: PointerDeviceKind.mouse,
      buttons: kSecondaryButton,
    );
    await tester.pump(const Duration(milliseconds: 50));
    await gesture.up();
    await tester.pumpAndSettle();

    expect(copy, findsOneWidget);
    // The menu opens next to the pointer rather than at the terminal origin.
    expect(
      tester.getTopLeft(copy).dx,
      greaterThan(tester.getTopLeft(surface).dx),
    );

    await tester.tap(copy);
    await tester.pumpAndSettle();

    expect(copied, 1);
  });

  testWidgets('terminal closes its context menu at a primary tap on itself', (
    tester,
  ) async {
    final controller = TRTerminalController();
    addTearDown(controller.dispose);

    await tester.pumpWidget(
      MaterialApp(
        theme: TinyrackTheme.light(),
        home: SizedBox(
          width: 640,
          height: 360,
          child: TRTerminalView(
            controller: controller,
            autofocus: true,
            contextMenuBuilder: (context) => [
              TRMenuItem(
                key: const ValueKey<String>('terminal-copy'),
                onPressed: () {},
                child: const Text('Copy'),
              ),
            ],
          ),
        ),
      ),
    );
    controller.write('output');
    await tester.pump();

    final surface = find.byKey(const ValueKey<String>('tr-terminal-surface'));
    final origin = tester.getTopLeft(surface) + const Offset(24, 24);
    final gesture = await tester.startGesture(
      origin,
      kind: PointerDeviceKind.mouse,
      buttons: kSecondaryButton,
    );
    await tester.pump(const Duration(milliseconds: 50));
    await gesture.up();
    await tester.pumpAndSettle();

    final copy = find.byKey(const ValueKey<String>('terminal-copy'));
    expect(copy, findsOneWidget);

    // The terminal anchors its own menu, so a tap on the terminal is not an
    // outside tap for the anchor and must close the menu explicitly.
    await tester.tapAt(tester.getBottomRight(surface) - const Offset(24, 24));
    await tester.pumpAndSettle();

    expect(copy, findsNothing);

    // Let the terminal's double-tap recognition window expire.
    await tester.pump(const Duration(milliseconds: 350));
  });

  testWidgets('terminal closes its context menu on Escape and keeps it', (
    tester,
  ) async {
    final input = <String>[];
    final controller = TRTerminalController();
    addTearDown(controller.dispose);

    await tester.pumpWidget(
      MaterialApp(
        theme: TinyrackTheme.light(),
        home: SizedBox(
          width: 640,
          height: 360,
          child: TRTerminalView(
            controller: controller,
            autofocus: true,
            onInput: input.add,
            contextMenuBuilder: (context) => [
              TRMenuItem(
                key: const ValueKey<String>('terminal-copy'),
                onPressed: () {},
                child: const Text('Copy'),
              ),
            ],
          ),
        ),
      ),
    );
    controller.write('output');
    await tester.pump();

    final surface = find.byKey(const ValueKey<String>('tr-terminal-surface'));
    final origin = tester.getTopLeft(surface) + const Offset(24, 24);
    final gesture = await tester.startGesture(
      origin,
      kind: PointerDeviceKind.mouse,
      buttons: kSecondaryButton,
    );
    await tester.pump(const Duration(milliseconds: 50));
    await gesture.up();
    await tester.pumpAndSettle();

    final copy = find.byKey(const ValueKey<String>('terminal-copy'));
    expect(copy, findsOneWidget);

    await tester.sendKeyEvent(LogicalKeyboardKey.escape);
    await tester.pumpAndSettle();

    expect(copy, findsNothing);
    expect(input.join(), isNot(contains('\x1b')));

    // With the menu closed again, Escape belongs to the program.
    await tester.sendKeyEvent(LogicalKeyboardKey.escape);
    await tester.pump();

    expect(input.join(), contains('\x1b'));
  });

  testWidgets('terminal without a context menu builder ignores right clicks', (
    tester,
  ) async {
    final controller = TRTerminalController();
    addTearDown(controller.dispose);

    await tester.pumpWidget(
      MaterialApp(
        theme: TinyrackTheme.light(),
        home: SizedBox(
          width: 640,
          height: 360,
          child: TRTerminalView(controller: controller),
        ),
      ),
    );
    await tester.pump();

    expect(find.byType(TRContextMenu), findsNothing);
  });

  testWidgets('terminal follows the active Tinyrack light and dark themes', (
    tester,
  ) async {
    final controller = TRTerminalController()..write('themed');
    addTearDown(controller.dispose);

    Future<void> pump(ThemeMode mode) async {
      await tester.pumpWidget(
        MaterialApp(
          theme: TinyrackTheme.light(),
          darkTheme: TinyrackTheme.dark(),
          themeMode: mode,
          home: TRTerminalView(controller: controller),
        ),
      );
      await tester.pumpAndSettle();
    }

    await pump(ThemeMode.light);
    final light = tester
        .widget<ColoredBox>(
          find.byKey(const ValueKey<String>('tr-terminal-surface')),
        )
        .color;
    await pump(ThemeMode.dark);
    final dark = tester
        .widget<ColoredBox>(
          find.byKey(const ValueKey<String>('tr-terminal-surface')),
        )
        .color;

    expect(light, isNot(dark));
  });

  testWidgets('terminal selection overlays content at half opacity', (
    tester,
  ) async {
    final controller = TRTerminalController()..write('selectable');
    addTearDown(controller.dispose);

    for (final mode in ThemeMode.values.where(
      (mode) => mode != ThemeMode.system,
    )) {
      await tester.pumpWidget(
        MaterialApp(
          theme: TinyrackTheme.light(),
          darkTheme: TinyrackTheme.dark(),
          themeMode: mode,
          home: TRTerminalView(controller: controller),
        ),
      );
      await tester.pumpAndSettle();

      final colors = tester.element(find.byType(TRTerminalView)).tinyrackTheme;
      final terminal = tester.widget<xterm.TerminalView>(
        find.byType(xterm.TerminalView),
      );

      expect(
        terminal.theme.selection,
        colors.surfaceSelected.withValues(alpha: 0.5),
        reason: '$mode selection must preserve terminal glyphs beneath it',
      );
    }
  });
}
