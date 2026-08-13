import 'package:material_ui/material_ui.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:tinyrack_ui/tinyrack_ui.dart';

Widget _app(Widget child, {Size size = const Size(900, 700)}) => MaterialApp(
  theme: TinyrackTheme.light(),
  darkTheme: TinyrackTheme.dark(),
  home: MediaQuery(
    data: MediaQueryData(size: size, disableAnimations: true),
    child: child,
  ),
);

/// The [Padding] that wraps [child]'s nearest enclosing column-like slot.
EdgeInsetsGeometry _paddingAround(WidgetTester tester, Finder child) => tester
    .widget<Padding>(
      find.ancestor(of: child, matching: find.byType(Padding)).first,
    )
    .padding;

Finder _surfaceColumn(Type surface) => find
    .descendant(of: find.byType(surface), matching: find.byType(Column))
    .first;

Finder _surface(Type surface) => find.descendant(
  of: find.byType(surface),
  matching: find.byWidgetPredicate(
    (widget) => widget is Material && widget.type == MaterialType.card,
  ),
);

void main() {
  group('overlay surfaces use the compact box padding', () {
    testWidgets('TRDialog keeps its slots at the compact inline inset', (
      tester,
    ) async {
      await tester.pumpWidget(
        _app(
          const TRDialog(
            title: Text('Rename workspace'),
            content: SizedBox(key: Key('body'), height: 40),
            actions: Text('Save'),
          ),
        ),
      );

      final surface = tester.getRect(_surface(TRDialog));
      expect(
        tester.getTopLeft(find.text('Rename workspace')).dx,
        surface.left + TRSpacing.medium + TRControlMetrics.borderWidth,
      );
    });

    testWidgets('TRDialog separates its content block by TRSpacing.small', (
      tester,
    ) async {
      await tester.pumpWidget(
        _app(
          const TRDialog(
            title: Text('Rename workspace'),
            content: SizedBox(key: Key('body'), height: 40),
          ),
        ),
      );

      expect(
        find.ancestor(
          of: find.byKey(const Key('body')),
          matching: find.byWidgetPredicate(
            (widget) =>
                widget is Padding &&
                widget.padding ==
                    const EdgeInsets.symmetric(vertical: TRSpacing.small),
          ),
        ),
        findsOneWidget,
      );
    });

    testWidgets('TRAlertDialog keeps its slots at the compact inline inset', (
      tester,
    ) async {
      await tester.pumpWidget(
        _app(
          const TRAlertDialog(
            title: Text('Delete host?'),
            description: Text('This cannot be undone.'),
          ),
        ),
      );

      final surface = tester.getRect(_surface(TRAlertDialog));
      expect(
        tester.getTopLeft(find.text('Delete host?')).dx,
        surface.left + TRSpacing.medium + TRControlMetrics.borderWidth,
      );
    });

    testWidgets('TRAlertDialog stacks its slots with TRSpacing.small', (
      tester,
    ) async {
      await tester.pumpWidget(
        _app(
          const TRAlertDialog(
            title: Text('Delete host?'),
            description: Text('This cannot be undone.'),
          ),
        ),
      );

      expect(
        tester.widget<Column>(_surfaceColumn(TRAlertDialog)).spacing,
        TRSpacing.small,
      );
    });

    testWidgets('TRDrawer insets a bottom sheet past its border', (
      tester,
    ) async {
      await tester.pumpWidget(
        _app(
          TRDrawer(
            title: const Text('Choose a model'),
            content: const SizedBox(key: Key('body')),
          ),
        ),
      );

      expect(
        _paddingAround(tester, _surfaceColumn(TRDrawer)),
        const EdgeInsets.all(TRSpacing.medium + TRControlMetrics.borderWidth),
        reason:
            'the Material shape border paints over the box without reserving '
            'room, and the web panel is box-sizing: border-box',
      );
    });

    testWidgets('TRDrawer insets a side drawer by the padding alone', (
      tester,
    ) async {
      await tester.pumpWidget(
        _app(
          TRDrawer(
            placement: TRDrawerPlacement.start,
            title: const Text('Choose a model'),
            content: const SizedBox(key: Key('body')),
          ),
        ),
      );

      expect(
        _paddingAround(tester, _surfaceColumn(TRDrawer)),
        const EdgeInsets.all(TRSpacing.medium),
        reason:
            'a side drawer has no border to inset past -- `.tr-drawer-popup` '
            'drops it for the left and right swipe directions',
      );
    });
  });

  group('dialog body scrolling', () {
    for (final dialog in <({String name, String title, Widget widget})>[
      (
        name: 'TRDialog',
        title: 'Scrollable dialog',
        widget: const TRDialog(
          title: Text('Scrollable dialog'),
          content: SizedBox(key: Key('long-body'), height: 600),
          actions: Text('Done'),
        ),
      ),
      (
        name: 'TRAlertDialog',
        title: 'Scrollable alert dialog',
        widget: const TRAlertDialog(
          title: Text('Scrollable alert dialog'),
          content: SizedBox(key: Key('long-body'), height: 600),
          actions: <TRButton>[TRButton(onPressed: null, child: Text('Done'))],
        ),
      ),
    ]) {
      testWidgets(
        '${dialog.name} places its body scrollbar at the surface edge',
        (tester) async {
          await tester.pumpWidget(
            _app(dialog.widget, size: const Size(420, 320)),
          );

          expect(tester.takeException(), isNull);
          final surface = tester.getRect(_surface(dialog.widget.runtimeType));
          final scrollbar = tester.getRect(
            find.descendant(
              of: find.byType(dialog.widget.runtimeType),
              matching: find.byType(Scrollbar),
            ),
          );

          expect(scrollbar.right, surface.right - TRControlMetrics.borderWidth);
          expect(
            tester.getTopLeft(find.byKey(const Key('long-body'))).dx,
            surface.left + TRSpacing.medium + TRControlMetrics.borderWidth,
          );

          final titleTop = tester.getTopLeft(find.text(dialog.title)).dy;
          final actionTop = tester.getTopLeft(find.text('Done')).dy;
          final bodyTop = tester
              .getTopLeft(find.byKey(const Key('long-body')))
              .dy;
          final scrollable = tester.state<ScrollableState>(
            find.descendant(
              of: find.byType(dialog.widget.runtimeType),
              matching: find.byType(Scrollable),
            ),
          );
          scrollable.position.jumpTo(80);
          await tester.pump();

          expect(tester.getTopLeft(find.text(dialog.title)).dy, titleTop);
          expect(tester.getTopLeft(find.text('Done')).dy, actionTop);
          expect(
            tester.getTopLeft(find.byKey(const Key('long-body'))).dy,
            bodyTop - 80,
          );
        },
      );
    }

    testWidgets('the scrollbar follows the ambient text direction', (
      tester,
    ) async {
      await tester.pumpWidget(
        _app(
          const Directionality(
            textDirection: TextDirection.rtl,
            child: TRDialog(content: SizedBox(height: 600)),
          ),
          size: const Size(420, 320),
        ),
      );

      final paint = tester.widget<CustomPaint>(
        find.descendant(
          of: find.byType(Scrollbar),
          matching: find.byWidgetPredicate(
            (widget) =>
                widget is CustomPaint &&
                widget.foregroundPainter is ScrollbarPainter,
          ),
        ),
      );
      final painter = paint.foregroundPainter! as ScrollbarPainter;
      expect(painter.textDirection, TextDirection.rtl);
    });
  });
}
