import 'package:flutter_test/flutter_test.dart';
import 'package:material_ui/material_ui.dart';
import 'package:tinyrack_ui/tinyrack_ui.dart';

void main() {
  testWidgets('content-sized drawer ignores upward drags from its handle', (
    tester,
  ) async {
    await _setViewport(tester);
    await tester.pumpWidget(
      _host(
        const TRDrawer(
          maxExtent: 0.7,
          title: Text('Settings'),
          content: SizedBox(height: 320, child: Text('Content')),
        ),
      ),
    );

    final handle = find.byKey(const ValueKey('tr-drawer-drag-handle'));
    final startingRect = tester.getRect(handle);

    await tester.drag(handle, const Offset(0, -180));
    await tester.pumpAndSettle();

    expect(tester.getRect(handle), startingRect);
  });

  testWidgets('content-sized drawer drags from its complete header', (
    tester,
  ) async {
    await _setViewport(tester);
    await tester.pumpWidget(
      _host(
        const TRDrawer(
          maxExtent: 0.7,
          title: Text('Settings'),
          content: SizedBox(height: 320, child: Text('Content')),
        ),
      ),
    );

    final handle = find.byKey(const ValueKey('tr-drawer-drag-handle'));
    final startingRect = tester.getRect(handle);
    final gesture = await tester.startGesture(
      tester.getCenter(find.text('Settings')),
    );
    await gesture.moveBy(const Offset(0, 20));
    await gesture.moveBy(const Offset(0, 120));
    await tester.pump();

    expect(tester.getRect(handle).top, greaterThan(startingRect.top));

    await gesture.up();
    await tester.pumpAndSettle();
    expect(tester.getRect(handle), startingRect);
  });

  testWidgets('content drag expands a snapped drawer before it scrolls', (
    tester,
  ) async {
    await _setViewport(tester);
    await tester.pumpWidget(
      _host(
        TRDrawer(snapPoints: const <double>[0.5, 1], content: _longContent()),
      ),
    );

    final drawer = find.byType(TRDrawer);
    final viewportHeight = MediaQuery.sizeOf(tester.element(drawer)).height;
    final position = _scrollPosition(tester, drawer);
    final gesture = await tester.startGesture(
      tester.getCenter(find.text('Item 0')),
    );

    await gesture.moveBy(const Offset(0, -20));
    await gesture.moveBy(const Offset(0, -200));
    await tester.pump();
    expect(tester.getSize(drawer).height, greaterThan(viewportHeight * 0.5));
    expect(position.pixels, closeTo(0, 1e-6));

    await gesture.moveBy(const Offset(0, -220));
    await tester.pump();
    expect(tester.getSize(drawer).height, viewportHeight);
    expect(position.pixels, greaterThan(0));

    await gesture.up();
    await tester.pumpAndSettle();
  });

  testWidgets('downward content drag scrolls to top before collapsing drawer', (
    tester,
  ) async {
    await _setViewport(tester);
    await tester.pumpWidget(
      _host(
        TRDrawer(
          initialSnapIndex: 1,
          snapPoints: const <double>[0.5, 1],
          content: _longContent(),
        ),
      ),
    );

    final drawer = find.byType(TRDrawer);
    final viewportHeight = MediaQuery.sizeOf(tester.element(drawer)).height;
    final position = _scrollPosition(tester, drawer)..jumpTo(120);
    await tester.pump();
    final gesture = await tester.startGesture(
      tester.getCenter(find.text('Item 5')),
    );

    await gesture.moveBy(const Offset(0, 20));
    await gesture.moveBy(const Offset(0, 300));
    await tester.pump();

    expect(position.pixels, 0);
    expect(tester.getSize(drawer).height, lessThan(viewportHeight));

    await gesture.up();
    await tester.pumpAndSettle();
  });

  testWidgets(
    'hidden handle keeps snapped content scrollable without dragging',
    (tester) async {
      await _setViewport(tester);
      await tester.pumpWidget(
        _host(
          TRDrawer(
            showDragHandle: false,
            snapPoints: const <double>[0.5, 1],
            content: _longContent(),
          ),
        ),
      );

      final drawer = find.byType(TRDrawer);
      final startingSize = tester.getSize(drawer);
      final position = _scrollPosition(tester, drawer);

      await tester.drag(find.text('Item 0'), const Offset(0, -160));
      await tester.pumpAndSettle();

      expect(tester.getSize(drawer), startingSize);
      expect(position.pixels, greaterThan(0));
    },
  );

  testWidgets('handle-only drawer keeps content and extent gestures separate', (
    tester,
  ) async {
    await _setViewport(tester);
    await tester.pumpWidget(
      _host(
        TRDrawer(
          dragBehavior: TRDrawerDragBehavior.handleOnly,
          snapPoints: const <double>[0.5, 1],
          content: _longContent(),
        ),
      ),
    );

    final drawer = find.byType(TRDrawer);
    final startingSize = tester.getSize(drawer);
    final position = _scrollPosition(tester, drawer);
    expect(
      tester.getSize(find.byKey(const ValueKey('tr-drawer-drag-region'))),
      const Size(400 - TRSpacing.medium * 2 - 2, TRSpacing.twoExtraLarge),
    );

    await tester.drag(find.text('Item 0'), const Offset(0, -200));
    await tester.pumpAndSettle();

    expect(tester.getSize(drawer), startingSize);
    expect(position.pixels, greaterThan(0));

    await tester.drag(
      find.byKey(const ValueKey<String>('tr-drawer-drag-handle')),
      const Offset(0, -300),
    );
    await tester.pumpAndSettle();

    expect(tester.getSize(drawer).height, greaterThan(startingSize.height));
  });

  testWidgets('tap controls remain interactive inside the drag region', (
    tester,
  ) async {
    await _setViewport(tester);
    var presses = 0;
    await tester.pumpWidget(
      _host(
        TRDrawer(
          title: const Text('Settings'),
          content: TRButton(
            onPressed: () => presses += 1,
            child: const Text('Apply'),
          ),
        ),
      ),
    );

    await tester.tap(find.text('Apply'));
    await tester.pump();

    expect(presses, 1);
  });
}

Widget _longContent() => Column(
  children: <Widget>[
    for (var index = 0; index < 40; index += 1)
      SizedBox(height: 40, child: Text('Item $index')),
  ],
);

ScrollPosition _scrollPosition(WidgetTester tester, Finder drawer) => tester
    .state<ScrollableState>(
      find.descendant(of: drawer, matching: find.byType(Scrollable)),
    )
    .position;

Future<void> _setViewport(WidgetTester tester) async {
  await tester.binding.setSurfaceSize(const Size(400, 800));
  addTearDown(() => tester.binding.setSurfaceSize(null));
}

Widget _host(Widget drawer) => MaterialApp(
  theme: TinyrackTheme.light(),
  home: Scaffold(
    body: Align(alignment: Alignment.bottomCenter, child: drawer),
  ),
);
