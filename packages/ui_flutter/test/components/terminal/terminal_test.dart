import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:tinyrack_ui/tinyrack_ui.dart';

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
}
