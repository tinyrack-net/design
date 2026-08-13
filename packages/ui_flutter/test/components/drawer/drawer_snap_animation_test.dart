import 'package:material_ui/material_ui.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:tinyrack_ui/tinyrack_ui.dart';

Widget _app(Widget child, {bool disableAnimations = false}) => MaterialApp(
  theme: TinyrackTheme.light(),
  home: MediaQuery(
    data: MediaQueryData(
      size: const Size(800, 600),
      disableAnimations: disableAnimations,
    ),
    child: Scaffold(body: child),
  ),
);

void main() {
  testWidgets('bottom drawer animates to its nearest snap after a drag', (
    tester,
  ) async {
    await tester.binding.setSurfaceSize(const Size(800, 600));
    addTearDown(() => tester.binding.setSurfaceSize(null));
    final snapped = <int>[];

    await tester.pumpWidget(
      _app(
        Align(
          alignment: Alignment.bottomCenter,
          child: TRDrawer(
            snapPoints: const <double>[0.5, 1],
            onSnapChanged: snapped.add,
            content: const Text('Bottom drawer'),
          ),
        ),
      ),
    );
    expect(tester.getSize(find.byType(TRDrawer)).height, 300);

    await tester.timedDrag(
      find.byType(TRDrawer),
      const Offset(0, -180),
      TRMotion.slow,
    );
    await tester.pump();

    final releasedHeight = tester.getSize(find.byType(TRDrawer)).height;
    expect(releasedHeight, greaterThan(300));
    expect(releasedHeight, lessThan(600));
    expect(snapped, <int>[1]);

    await tester.pump(TRMotion.normal ~/ 2);
    final animatedHeight = tester.getSize(find.byType(TRDrawer)).height;
    expect(animatedHeight, greaterThan(releasedHeight));
    expect(animatedHeight, lessThan(600));

    await tester.pumpAndSettle();
    expect(tester.getSize(find.byType(TRDrawer)).height, 600);
    expect(snapped, <int>[1]);
  });

  testWidgets('side drawer animates back to its nearest snap after a drag', (
    tester,
  ) async {
    await tester.binding.setSurfaceSize(const Size(800, 600));
    addTearDown(() => tester.binding.setSurfaceSize(null));

    await tester.pumpWidget(
      _app(
        Align(
          alignment: Alignment.centerLeft,
          child: TRDrawer(
            placement: TRDrawerPlacement.start,
            snapPoints: const <double>[0.5, 1],
            content: const Text('Side drawer'),
          ),
        ),
      ),
    );
    expect(tester.getSize(find.byType(TRDrawer)).width, 400);

    await tester.timedDrag(
      find.byType(TRDrawer),
      const Offset(80, 0),
      TRMotion.slow,
    );
    await tester.pump();

    final releasedWidth = tester.getSize(find.byType(TRDrawer)).width;
    expect(releasedWidth, greaterThan(400));
    expect(releasedWidth, lessThan(800));

    await tester.pump(TRMotion.normal ~/ 2);
    final animatedWidth = tester.getSize(find.byType(TRDrawer)).width;
    expect(animatedWidth, lessThan(releasedWidth));
    expect(animatedWidth, greaterThan(400));

    await tester.pumpAndSettle();
    expect(tester.getSize(find.byType(TRDrawer)).width, 400);
  });

  testWidgets('reduced motion snaps a dragged drawer immediately', (
    tester,
  ) async {
    await tester.binding.setSurfaceSize(const Size(800, 600));
    addTearDown(() => tester.binding.setSurfaceSize(null));

    await tester.pumpWidget(
      _app(
        Align(
          alignment: Alignment.bottomCenter,
          child: TRDrawer(
            snapPoints: const <double>[0.5, 1],
            content: const Text('Reduced motion drawer'),
          ),
        ),
        disableAnimations: true,
      ),
    );

    await tester.timedDrag(
      find.byType(TRDrawer),
      const Offset(0, -180),
      TRMotion.slow,
    );
    await tester.pump();

    expect(tester.getSize(find.byType(TRDrawer)).height, 600);
  });

  testWidgets('a fast closing drag preserves drawer dismissal', (tester) async {
    var dismissed = 0;
    await tester.pumpWidget(
      MaterialApp(
        theme: TinyrackTheme.light(),
        home: Builder(
          builder: (context) => TRButton(
            onPressed: () => showTRDrawer<void>(
              context: context,
              builder: (_) => TRDrawer(
                onDismiss: () => dismissed += 1,
                snapPoints: const <double>[0.5, 1],
                content: const Text('Dismissible drawer'),
              ),
            ),
            child: const Text('Open drawer'),
          ),
        ),
      ),
    );
    await tester.tap(find.text('Open drawer'));
    await tester.pumpAndSettle();

    await tester.fling(find.byType(TRDrawer), const Offset(0, 100), 1000);
    await tester.pumpAndSettle();

    expect(find.byType(TRDrawer), findsNothing);
    expect(dismissed, 1);
  });
}
