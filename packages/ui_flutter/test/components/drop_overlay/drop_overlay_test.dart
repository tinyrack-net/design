import 'package:material_ui/material_ui.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:tinyrack_ui/tinyrack_ui.dart';

Widget _app(
  Widget child, {
  bool disableAnimations = true,
  ThemeMode themeMode = ThemeMode.light,
}) => MaterialApp(
  theme: TinyrackTheme.light(),
  darkTheme: TinyrackTheme.dark(),
  themeMode: themeMode,
  home: Scaffold(
    body: MediaQuery(
      data: MediaQueryData(disableAnimations: disableAnimations),
      child: Align(alignment: Alignment.topLeft, child: child),
    ),
  ),
);

void main() {
  testWidgets(
    'drop overlay covers its child and exposes the drop instruction',
    (tester) async {
      final semantics = tester.ensureSemantics();
      await tester.pumpWidget(
        _app(
          const SizedBox(
            width: 320,
            height: 240,
            child: TRDropOverlay(
              visible: true,
              label: 'Drop files here',
              child: ColoredBox(
                key: ValueKey<String>('content'),
                color: Colors.red,
              ),
            ),
          ),
        ),
      );

      expect(find.text('Drop files here'), findsOneWidget);
      expect(find.bySemanticsLabel(RegExp('Drop files here')), findsOneWidget);
      expect(
        tester.getRect(find.byType(TRDropOverlay)),
        tester.getRect(find.byKey(const ValueKey<String>('content'))),
      );
      expect(
        tester
            .widget<IgnorePointer>(
              find.descendant(
                of: find.byType(TRDropOverlay),
                matching: find.byType(IgnorePointer),
              ),
            )
            .ignoring,
        isTrue,
      );
      expect(
        tester.widget<AnimatedOpacity>(find.byType(AnimatedOpacity)).opacity,
        1,
      );
      semantics.dispose();
    },
  );

  testWidgets(
    'hidden overlay keeps the child interactive and removes semantics',
    (tester) async {
      final semantics = tester.ensureSemantics();
      var taps = 0;
      await tester.pumpWidget(
        _app(
          SizedBox(
            width: 320,
            height: 240,
            child: TRDropOverlay(
              visible: false,
              label: 'Drop files here',
              child: GestureDetector(onTap: () => taps++),
            ),
          ),
        ),
      );

      expect(
        tester.widget<AnimatedOpacity>(find.byType(AnimatedOpacity)).opacity,
        0,
      );
      expect(find.text('Drop files here'), findsOneWidget);
      expect(find.bySemanticsLabel(RegExp('Drop files here')), findsNothing);
      await tester.tap(find.byType(TRDropOverlay));
      expect(taps, 1);
      semantics.dispose();
    },
  );

  testWidgets('drop overlay honors reduced motion', (tester) async {
    await tester.pumpWidget(
      _app(
        const TRDropOverlay(
          visible: true,
          label: 'Drop files here',
          child: SizedBox(width: 320, height: 240),
        ),
      ),
    );

    expect(
      tester.widget<AnimatedOpacity>(find.byType(AnimatedOpacity)).duration,
      Duration.zero,
    );
  });

  for (final mode in ThemeMode.values.where(
    (mode) => mode != ThemeMode.system,
  )) {
    testWidgets('drop overlay resolves the $mode surface color', (
      tester,
    ) async {
      await tester.pumpWidget(
        _app(
          const TRDropOverlay(
            visible: true,
            label: 'Drop files here',
            child: SizedBox(width: 320, height: 240),
          ),
          themeMode: mode,
        ),
      );

      final expectedTheme = mode == ThemeMode.dark
          ? TinyrackTheme.dark()
          : TinyrackTheme.light();
      final expected = expectedTheme
          .extension<TinyrackThemeData>()!
          .surface
          .withValues(alpha: TROpacity.dropOverlay);
      final overlay = tester
          .widgetList<ColoredBox>(find.byType(ColoredBox))
          .last;
      expect(overlay.color, expected);
    });
  }
}
