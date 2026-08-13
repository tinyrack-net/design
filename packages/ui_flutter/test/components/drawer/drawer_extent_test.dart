import 'package:material_ui/material_ui.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:tinyrack_ui/tinyrack_ui.dart';

void main() {
  testWidgets('content-sized drawer respects its maximum extent', (
    tester,
  ) async {
    await tester.binding.setSurfaceSize(const Size(400, 800));
    addTearDown(() => tester.binding.setSurfaceSize(null));

    await tester.pumpWidget(
      _host(
        TRDrawer(
          maxExtent: 0.7,
          content: Column(
            children: <Widget>[
              for (var index = 0; index < 40; index += 1)
                SizedBox(height: 40, child: Text('Item $index')),
            ],
          ),
        ),
      ),
    );

    final viewportHeight = MediaQuery.sizeOf(
      tester.element(find.byType(TRDrawer)),
    ).height;
    final drawerRect = tester.getRect(find.byType(TRDrawer));
    expect(tester.getSize(find.byType(TRDrawer)).height, viewportHeight * 0.7);
    expect(find.text('Item 39'), findsOneWidget);
    expect(
      tester.getRect(find.text('Item 39')).top,
      greaterThan(drawerRect.bottom),
    );

    await tester.ensureVisible(find.text('Item 39'));
    await tester.pumpAndSettle();
    expect(
      tester.getRect(find.text('Item 39')).bottom,
      lessThanOrEqualTo(drawerRect.bottom),
    );
  });

  testWidgets('short content stays smaller than its maximum extent', (
    tester,
  ) async {
    await tester.binding.setSurfaceSize(const Size(400, 800));
    addTearDown(() => tester.binding.setSurfaceSize(null));

    await tester.pumpWidget(
      _host(
        const TRDrawer(
          maxExtent: 0.7,
          content: SizedBox(height: 80, child: Text('Short content')),
        ),
      ),
    );

    final viewportHeight = MediaQuery.sizeOf(
      tester.element(find.byType(TRDrawer)),
    ).height;
    expect(
      tester.getSize(find.byType(TRDrawer)).height,
      lessThan(viewportHeight * 0.7),
    );
  });

  testWidgets('default content-sized drawer can use the full viewport', (
    tester,
  ) async {
    await tester.binding.setSurfaceSize(const Size(400, 800));
    addTearDown(() => tester.binding.setSurfaceSize(null));

    await tester.pumpWidget(
      _host(
        const TRDrawer(
          content: SizedBox(height: 1200, child: Text('Tall content')),
        ),
      ),
    );

    final viewportHeight = MediaQuery.sizeOf(
      tester.element(find.byType(TRDrawer)),
    ).height;
    expect(tester.getSize(find.byType(TRDrawer)).height, viewportHeight);
  });

  testWidgets('snap points cannot exceed the maximum extent', (tester) async {
    await tester.pumpWidget(
      _host(
        TRDrawer(
          maxExtent: 0.7,
          snapPoints: const <double>[0.5, 0.8],
          content: const SizedBox.shrink(),
        ),
      ),
    );
    expect(tester.takeException(), isAssertionError);
  });
}

Widget _host(Widget drawer) => MaterialApp(
  theme: TinyrackTheme.light(),
  home: Scaffold(
    body: Align(alignment: Alignment.bottomCenter, child: drawer),
  ),
);
