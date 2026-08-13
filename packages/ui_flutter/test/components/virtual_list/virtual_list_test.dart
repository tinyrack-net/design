import 'dart:math' as math;

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:tinyrack_ui/tinyrack_ui.dart';

const _viewportHeight = 240.0;

Widget _host(
  Widget child, {
  TextDirection textDirection = TextDirection.ltr,
  double viewportHeight = _viewportHeight,
  TextScaler textScaler = TextScaler.noScaling,
}) => MaterialApp(
  theme: TinyrackTheme.light(),
  home: MediaQuery(
    data: MediaQueryData(textScaler: textScaler),
    child: Directionality(
      textDirection: textDirection,
      child: Scaffold(
        body: Center(
          child: SizedBox(
            key: const ValueKey('viewport'),
            width: 360,
            height: viewportHeight,
            child: child,
          ),
        ),
      ),
    ),
  ),
);

class _VirtualListHarness extends StatefulWidget {
  const _VirtualListHarness({
    required this.controller,
    required this.initialItems,
    this.axis = Axis.vertical,
    this.follow = TRVirtualListFollow.none,
    this.initialPosition = const TRVirtualListInitialPosition.leading(),
    this.initialSnapshot,
    this.leadingEdgeRequest,
    this.pageStorageId,
    this.trailingEdgeRequest,
    super.key,
  });

  final TRVirtualListController<String> controller;
  final List<String> initialItems;
  final Axis axis;
  final TRVirtualListFollow follow;
  final TRVirtualListInitialPosition<String> initialPosition;
  final TRVirtualListSnapshot<String>? initialSnapshot;
  final TRVirtualListEdgeRequest? leadingEdgeRequest;
  final String? pageStorageId;
  final TRVirtualListEdgeRequest? trailingEdgeRequest;

  @override
  State<_VirtualListHarness> createState() => _VirtualListHarnessState();
}

class _VirtualListHarnessState extends State<_VirtualListHarness> {
  late List<String> items = List<String>.of(widget.initialItems);
  final Map<String, double> heights = <String, double>{};
  var buildCount = 0;

  void append(String item, {double? height}) {
    setState(() {
      items = <String>[...items, item];
      if (height != null) heights[item] = height;
    });
  }

  void prepend(String item, {double? height}) {
    setState(() {
      items = <String>[item, ...items];
      if (height != null) heights[item] = height;
    });
  }

  void resize(String item, double height) {
    setState(() => heights[item] = height);
  }

  void replaceItems(List<String> next) {
    setState(() => items = List<String>.of(next));
  }

  @override
  Widget build(BuildContext context) => TRVirtualList<String, String>(
    controller: widget.controller,
    items: items,
    axis: widget.axis,
    itemKey: (item) => item,
    estimatedItemExtent: (item, index) => heights[item] ?? 40,
    itemBuilder: (context, item, index) {
      buildCount += 1;
      return SizedBox(
        key: ValueKey('row-$item'),
        width: widget.axis == Axis.horizontal ? heights[item] ?? 40 : null,
        height: widget.axis == Axis.vertical ? heights[item] ?? 40 : null,
        child: TRText(item),
      );
    },
    initialPosition: widget.initialPosition,
    initialSnapshot: widget.initialSnapshot,
    follow: widget.follow,
    leadingEdgeRequest: widget.leadingEdgeRequest,
    pageStorageId: widget.pageStorageId,
    trailingEdgeRequest: widget.trailingEdgeRequest,
  );
}

double _top(WidgetTester tester, String item) =>
    tester.getTopLeft(find.byKey(ValueKey('row-$item'))).dy;

double _bottom(WidgetTester tester, String item) =>
    tester.getBottomLeft(find.byKey(ValueKey('row-$item'))).dy;

double _left(WidgetTester tester, String item) =>
    tester.getTopLeft(find.byKey(ValueKey('row-$item'))).dx;

void main() {
  testWidgets('builds only the visible and cached part of a 100k item list', (
    tester,
  ) async {
    final key = GlobalKey<_VirtualListHarnessState>();
    final controller = TRVirtualListController<String>();
    addTearDown(controller.dispose);

    await tester.pumpWidget(
      _host(
        _VirtualListHarness(
          key: key,
          controller: controller,
          initialItems: List<String>.generate(100000, (index) => 'item-$index'),
        ),
      ),
    );

    expect(find.byKey(const ValueKey('row-item-0')), findsOneWidget);
    expect(find.byKey(const ValueKey('row-item-99999')), findsNothing);
    expect(key.currentState!.buildCount, lessThan(40));
  });

  testWidgets('keeps following streaming growth while pinned to trailing', (
    tester,
  ) async {
    final key = GlobalKey<_VirtualListHarnessState>();
    final controller = TRVirtualListController<String>();
    addTearDown(controller.dispose);

    await tester.pumpWidget(
      _host(
        _VirtualListHarness(
          key: key,
          controller: controller,
          initialItems: List<String>.generate(30, (index) => 'item-$index'),
          initialPosition: const TRVirtualListInitialPosition.trailing(),
          follow: TRVirtualListFollow.trailing,
        ),
      ),
    );

    key.currentState!.append('item-30', height: 40);
    await tester.pump();
    key.currentState!.resize('item-30', 120);
    await tester.pump();

    expect(
      _bottom(tester, 'item-30'),
      moreOrLessEquals(
        tester.getBottomLeft(find.byKey(const ValueKey('viewport'))).dy,
      ),
    );
  });

  testWidgets('streaming below a scrolled-up viewport preserves its anchor', (
    tester,
  ) async {
    final key = GlobalKey<_VirtualListHarnessState>();
    final controller = TRVirtualListController<String>();
    addTearDown(controller.dispose);

    await tester.pumpWidget(
      _host(
        _VirtualListHarness(
          key: key,
          controller: controller,
          initialItems: List<String>.generate(60, (index) => 'item-$index'),
          initialPosition: const TRVirtualListInitialPosition.trailing(),
          follow: TRVirtualListFollow.trailing,
        ),
      ),
    );
    await controller.scrollToKey(
      'item-30',
      alignment: TRVirtualListAlignment.leading,
    );
    await tester.pump();
    final anchorTop = _top(tester, 'item-30');

    key.currentState!.append('item-60', height: 40);
    await tester.pump();
    key.currentState!.resize('item-60', 160);
    await tester.pump();

    expect(_top(tester, 'item-30'), moreOrLessEquals(anchorTop));
    expect(find.byKey(const ValueKey('row-item-60')), findsNothing);
  });

  testWidgets('prepend and disclosure resize preserve a visible anchor', (
    tester,
  ) async {
    final key = GlobalKey<_VirtualListHarnessState>();
    final controller = TRVirtualListController<String>();
    addTearDown(controller.dispose);

    await tester.pumpWidget(
      _host(
        _VirtualListHarness(
          key: key,
          controller: controller,
          initialItems: List<String>.generate(30, (index) => 'item-$index'),
          initialPosition: const TRVirtualListInitialPosition.trailing(),
          follow: TRVirtualListFollow.trailing,
        ),
      ),
    );
    await controller.scrollToKey(
      'item-16',
      alignment: TRVirtualListAlignment.leading,
    );
    await tester.pump();
    final beforePrepend = _top(tester, 'item-16');

    key.currentState!.prepend('older', height: 96);
    await tester.pump();
    expect(_top(tester, 'item-16'), moreOrLessEquals(beforePrepend));

    await controller.scrollToEdge(TRVirtualListEdge.trailing);
    await tester.pump();
    final disclosureTop = _top(tester, 'item-29');
    controller.holdVisibleAnchorForNextLayout();
    key.currentState!.resize('item-29', 160);
    await tester.pump();

    expect(_top(tester, 'item-29'), moreOrLessEquals(disclosureTop));
  });

  testWidgets('trailing follow resumes only after returning to the edge', (
    tester,
  ) async {
    final key = GlobalKey<_VirtualListHarnessState>();
    final controller = TRVirtualListController<String>();
    addTearDown(controller.dispose);

    await tester.pumpWidget(
      _host(
        _VirtualListHarness(
          key: key,
          controller: controller,
          initialItems: List<String>.generate(50, (index) => 'item-$index'),
          initialPosition: const TRVirtualListInitialPosition.trailing(),
          follow: TRVirtualListFollow.trailing,
        ),
      ),
    );
    await controller.scrollToKey(
      'item-20',
      alignment: TRVirtualListAlignment.leading,
    );
    await tester.pump();
    final scrolledUpTop = _top(tester, 'item-20');

    key.currentState!.append('item-50');
    await tester.pump();
    expect(_top(tester, 'item-20'), moreOrLessEquals(scrolledUpTop));

    await controller.scrollToEdge(TRVirtualListEdge.trailing);
    await tester.pump();
    key.currentState!.append('item-51');
    await tester.pump();

    expect(
      _bottom(tester, 'item-51'),
      moreOrLessEquals(
        tester.getBottomLeft(find.byKey(const ValueKey('viewport'))).dy,
      ),
    );
  });

  testWidgets(
    'keeps forward order and restores a snapshot with mixed heights',
    (tester) async {
      final key = GlobalKey<_VirtualListHarnessState>();
      final firstController = TRVirtualListController<String>();
      addTearDown(firstController.dispose);
      final items = List<String>.generate(40, (index) => 'item-$index');

      await tester.pumpWidget(
        _host(
          _VirtualListHarness(
            key: key,
            controller: firstController,
            initialItems: items,
          ),
        ),
      );
      key.currentState!
        ..resize('item-0', 32)
        ..resize('item-1', 84)
        ..resize('item-2', 48);
      await tester.pump();

      expect(_top(tester, 'item-0'), lessThan(_top(tester, 'item-1')));
      expect(_top(tester, 'item-1'), lessThan(_top(tester, 'item-2')));

      await firstController.scrollToKey(
        'item-18',
        alignment: TRVirtualListAlignment.leading,
      );
      await tester.pump();
      final restoredTop = _top(tester, 'item-18');
      final snapshot = firstController.takeSnapshot();
      final secondController = TRVirtualListController<String>();
      addTearDown(secondController.dispose);

      await tester.pumpWidget(
        _host(
          _VirtualListHarness(
            controller: secondController,
            initialItems: items,
            initialSnapshot: snapshot,
            initialPosition: const TRVirtualListInitialPosition.trailing(),
          ),
        ),
      );

      expect(_top(tester, 'item-18'), moreOrLessEquals(restoredTop));
      expect(find.byKey(const ValueKey('row-item-0')), findsNothing);
    },
  );

  testWidgets('middle insert remove and reorder preserve the visible anchor', (
    tester,
  ) async {
    final key = GlobalKey<_VirtualListHarnessState>();
    final controller = TRVirtualListController<String>();
    addTearDown(controller.dispose);
    final items = List<String>.generate(50, (index) => 'item-$index');

    await tester.pumpWidget(
      _host(
        _VirtualListHarness(
          key: key,
          controller: controller,
          initialItems: items,
        ),
      ),
    );
    await controller.scrollToKey(
      'item-24',
      alignment: TRVirtualListAlignment.leading,
    );
    await tester.pump();
    final anchorTop = _top(tester, 'item-24');

    key.currentState!.replaceItems(<String>[
      ...items.take(4),
      'inserted',
      ...items.skip(4),
    ]);
    await tester.pump();
    expect(_top(tester, 'item-24'), moreOrLessEquals(anchorTop));

    key.currentState!.replaceItems(<String>[
      ...items.take(10),
      ...items.skip(11),
    ]);
    await tester.pump();
    expect(_top(tester, 'item-24'), moreOrLessEquals(anchorTop));

    key.currentState!.replaceItems(<String>[
      items.first,
      items[2],
      items[1],
      ...items.skip(3),
    ]);
    await tester.pump();
    expect(_top(tester, 'item-24'), moreOrLessEquals(anchorTop));
  });

  testWidgets('anchor deletion promotes the next visible survivor', (
    tester,
  ) async {
    final key = GlobalKey<_VirtualListHarnessState>();
    final controller = TRVirtualListController<String>();
    addTearDown(controller.dispose);
    final items = List<String>.generate(40, (index) => 'item-$index');

    await tester.pumpWidget(
      _host(
        _VirtualListHarness(
          key: key,
          controller: controller,
          initialItems: items,
        ),
      ),
    );
    await controller.scrollToKey(
      'item-18',
      alignment: TRVirtualListAlignment.leading,
    );
    await tester.pump();
    final successorTop = _top(tester, 'item-19');

    key.currentState!.replaceItems(
      items.where((item) => item != 'item-18').toList(),
    );
    await tester.pump();

    expect(_top(tester, 'item-19'), moreOrLessEquals(successorTop));
  });

  testWidgets('removing every visible candidate promotes a distant successor', (
    tester,
  ) async {
    final key = GlobalKey<_VirtualListHarnessState>();
    final controller = TRVirtualListController<String>();
    addTearDown(controller.dispose);
    final items = List<String>.generate(60, (index) => 'item-$index');
    await tester.pumpWidget(
      _host(
        _VirtualListHarness(
          key: key,
          controller: controller,
          initialItems: items,
        ),
      ),
    );
    await controller.scrollToKey(
      'item-20',
      alignment: TRVirtualListAlignment.leading,
    );
    await tester.pump();
    final oldPosition = tester
        .state<ScrollableState>(find.byType(Scrollable))
        .position
        .pixels;
    final successorViewportOffset = 28 * 40 - oldPosition;

    key.currentState!.replaceItems(<String>[
      ...items.take(20),
      ...items.skip(28),
    ]);
    await tester.pump();

    expect(tester.takeException(), isNull);
    expect(
      tester.state<ScrollableState>(find.byType(Scrollable)).position.pixels,
      moreOrLessEquals(20 * 40 - successorViewportOffset),
    );
  });

  testWidgets('leading follow reveals prepended content only while pinned', (
    tester,
  ) async {
    final key = GlobalKey<_VirtualListHarnessState>();
    final controller = TRVirtualListController<String>();
    addTearDown(controller.dispose);

    await tester.pumpWidget(
      _host(
        _VirtualListHarness(
          key: key,
          controller: controller,
          initialItems: List<String>.generate(30, (index) => 'item-$index'),
          follow: TRVirtualListFollow.leading,
        ),
      ),
    );
    key.currentState!.prepend('new-leading');
    await tester.pump();
    expect(
      _top(tester, 'new-leading'),
      moreOrLessEquals(
        tester.getTopLeft(find.byKey(const ValueKey('viewport'))).dy,
      ),
    );

    await controller.scrollToKey(
      'item-12',
      alignment: TRVirtualListAlignment.leading,
    );
    await tester.pump();
    final anchorTop = _top(tester, 'item-12');
    key.currentState!.prepend('another-leading');
    await tester.pump();
    expect(_top(tester, 'item-12'), moreOrLessEquals(anchorTop));
  });

  testWidgets('horizontal RTL keeps the first item at logical leading', (
    tester,
  ) async {
    final controller = TRVirtualListController<String>();
    addTearDown(controller.dispose);

    await tester.pumpWidget(
      _host(
        _VirtualListHarness(
          controller: controller,
          initialItems: List<String>.generate(30, (index) => 'item-$index'),
          axis: Axis.horizontal,
        ),
        textDirection: TextDirection.rtl,
      ),
    );

    expect(_left(tester, 'item-0'), greaterThan(_left(tester, 'item-1')));
    await controller.scrollToEdge(TRVirtualListEdge.trailing);
    await tester.pump();
    expect(find.byKey(const ValueKey('row-item-29')), findsOneWidget);
    expect(find.byKey(const ValueKey('row-item-0')), findsNothing);
  });

  testWidgets('page storage restores the stable item anchor', (tester) async {
    final bucket = PageStorageBucket();
    final firstController = TRVirtualListController<String>();
    addTearDown(firstController.dispose);
    final items = List<String>.generate(50, (index) => 'item-$index');

    Widget storedHost(Widget child) =>
        PageStorage(bucket: bucket, child: _host(child));

    await tester.pumpWidget(
      storedHost(
        _VirtualListHarness(
          controller: firstController,
          initialItems: items,
          pageStorageId: 'restorable-list',
        ),
      ),
    );
    await firstController.scrollToKey(
      'item-22',
      alignment: TRVirtualListAlignment.leading,
    );
    await tester.pump();
    final restoreGesture = await tester.startGesture(
      tester.getCenter(find.byKey(const ValueKey('viewport'))),
    );
    await restoreGesture.moveBy(
      const Offset(0, -17),
      timeStamp: const Duration(seconds: 1),
    );
    await restoreGesture.up();
    await tester.pumpAndSettle();
    final anchorTop = _top(tester, 'item-22');
    await tester.pumpWidget(storedHost(const SizedBox.shrink()));

    final secondController = TRVirtualListController<String>();
    addTearDown(secondController.dispose);
    await tester.pumpWidget(
      storedHost(
        _VirtualListHarness(
          controller: secondController,
          initialItems: items,
          initialPosition: const TRVirtualListInitialPosition.trailing(),
          pageStorageId: 'restorable-list',
        ),
      ),
    );

    expect(_top(tester, 'item-22'), moreOrLessEquals(anchorTop));
    expect(find.byKey(const ValueKey('row-item-49')), findsNothing);
  });

  testWidgets(
    'edge requests deduplicate by key and slots resize while pinned',
    (tester) async {
      final key = GlobalKey<_VirtualListHarnessState>();
      final controller = TRVirtualListController<String>();
      addTearDown(controller.dispose);
      var leadingRequests = 0;
      var trailingRequests = 0;
      final items = List<String>.generate(30, (index) => 'item-$index');

      TRVirtualListEdgeRequest leadingRequest(String requestKey) =>
          TRVirtualListEdgeRequest(
            requestKey: requestKey,
            onRequest: () => leadingRequests += 1,
            slot: const SizedBox(key: ValueKey('leading-slot'), height: 56),
          );
      TRVirtualListEdgeRequest trailingRequest(
        String requestKey,
        double height,
      ) => TRVirtualListEdgeRequest(
        requestKey: requestKey,
        onRequest: () => trailingRequests += 1,
        triggerExtent: const TRVirtualListTriggerExtent.fixed(80),
        slot: SizedBox(key: const ValueKey('trailing-slot'), height: height),
      );
      Widget list({
        required String leadingKey,
        required String trailingKey,
        required double trailingHeight,
      }) => _host(
        _VirtualListHarness(
          key: key,
          controller: controller,
          initialItems: items,
          follow: TRVirtualListFollow.trailing,
          leadingEdgeRequest: leadingRequest(leadingKey),
          trailingEdgeRequest: trailingRequest(trailingKey, trailingHeight),
        ),
      );

      await tester.pumpWidget(
        list(
          leadingKey: 'leading-1',
          trailingKey: 'trailing-1',
          trailingHeight: 48,
        ),
      );
      expect(find.byKey(const ValueKey('leading-slot')), findsOneWidget);
      expect(leadingRequests, 1);
      expect(trailingRequests, 0);

      await tester.pumpWidget(
        list(
          leadingKey: 'leading-1',
          trailingKey: 'trailing-1',
          trailingHeight: 48,
        ),
      );
      expect(leadingRequests, 1);

      await tester.pumpWidget(
        list(
          leadingKey: 'leading-2',
          trailingKey: 'trailing-1',
          trailingHeight: 48,
        ),
      );
      await tester.pump();
      expect(leadingRequests, 2);

      await controller.scrollToEdge(TRVirtualListEdge.trailing);
      await tester.pump();
      expect(find.byKey(const ValueKey('trailing-slot')), findsOneWidget);
      expect(trailingRequests, 1);
      await tester.pumpWidget(
        list(
          leadingKey: 'leading-2',
          trailingKey: 'trailing-2',
          trailingHeight: 112,
        ),
      );
      await tester.pump();

      expect(trailingRequests, 2);
      expect(
        tester.getBottomLeft(find.byKey(const ValueKey('trailing-slot'))).dy,
        moreOrLessEquals(
          tester.getBottomLeft(find.byKey(const ValueKey('viewport'))).dy,
        ),
      );
    },
  );

  testWidgets('horizontal LTR follows forward data order', (tester) async {
    final controller = TRVirtualListController<String>();
    addTearDown(controller.dispose);

    await tester.pumpWidget(
      _host(
        _VirtualListHarness(
          controller: controller,
          initialItems: List<String>.generate(30, (index) => 'item-$index'),
          axis: Axis.horizontal,
        ),
      ),
    );

    expect(_left(tester, 'item-0'), lessThan(_left(tester, 'item-1')));
    await controller.scrollToEdge(TRVirtualListEdge.trailing);
    await tester.pump();
    expect(find.byKey(const ValueKey('row-item-29')), findsOneWidget);
  });

  testWidgets('duplicate stable keys fail before layout', (tester) async {
    final controller = TRVirtualListController<String>();
    addTearDown(controller.dispose);

    await tester.pumpWidget(
      _host(
        _VirtualListHarness(
          controller: controller,
          initialItems: const <String>['duplicate', 'duplicate'],
        ),
      ),
    );
    expect(tester.takeException(), isA<AssertionError>());
  });

  testWidgets('an incompatible snapshot falls back to initial position', (
    tester,
  ) async {
    final firstController = TRVirtualListController<String>();
    addTearDown(firstController.dispose);
    await tester.pumpWidget(
      _host(
        _VirtualListHarness(
          controller: firstController,
          initialItems: List<String>.generate(20, (index) => 'old-$index'),
        ),
      ),
    );
    await firstController.scrollToKey(
      'old-10',
      alignment: TRVirtualListAlignment.leading,
    );
    await tester.pump();
    final snapshot = firstController.takeSnapshot();
    final secondController = TRVirtualListController<String>();
    addTearDown(secondController.dispose);

    await tester.pumpWidget(
      _host(
        _VirtualListHarness(
          key: const ValueKey('new-list'),
          controller: secondController,
          initialItems: List<String>.generate(20, (index) => 'new-$index'),
          initialSnapshot: snapshot,
          initialPosition: const TRVirtualListInitialPosition.trailing(),
        ),
      ),
    );

    expect(find.byKey(const ValueKey('row-new-19')), findsOneWidget);
    expect(find.byKey(const ValueKey('row-new-0')), findsNothing);
  });

  testWidgets('viewport resize keeps a trailing list pinned', (tester) async {
    final key = GlobalKey<_VirtualListHarnessState>();
    final controller = TRVirtualListController<String>();
    addTearDown(controller.dispose);
    final list = _VirtualListHarness(
      key: key,
      controller: controller,
      initialItems: List<String>.generate(30, (index) => 'item-$index'),
      initialPosition: const TRVirtualListInitialPosition.trailing(),
      follow: TRVirtualListFollow.trailing,
    );

    await tester.pumpWidget(_host(list));
    await tester.pumpWidget(_host(list, viewportHeight: 320));
    await tester.pump();

    expect(
      _bottom(tester, 'item-29'),
      moreOrLessEquals(
        tester.getBottomLeft(find.byKey(const ValueKey('viewport'))).dy,
      ),
    );
  });

  testWidgets('text scale growth preserves a scrolled visible item', (
    tester,
  ) async {
    final controller = TRVirtualListController<String>();
    addTearDown(controller.dispose);
    final items = List<String>.generate(40, (index) => '항목 $index 긴 설명 텍스트');
    Widget list() => TRVirtualList<String, String>(
      controller: controller,
      items: items,
      itemKey: (item) => item,
      estimatedItemExtent: (item, index) => 40,
      itemBuilder: (context, item, index) => SizedBox(
        key: ValueKey('natural-$index'),
        width: double.infinity,
        child: TRText('$item $item $item'),
      ),
    );

    await tester.pumpWidget(_host(list()));
    await controller.scrollToIndex(
      18,
      alignment: TRVirtualListAlignment.leading,
    );
    await tester.pump();
    final anchorTop = tester
        .getTopLeft(find.byKey(const ValueKey('natural-18')))
        .dy;
    await tester.pumpWidget(
      _host(list(), textScaler: const TextScaler.linear(1.8)),
    );
    await tester.pump();

    expect(
      tester.getTopLeft(find.byKey(const ValueKey('natural-18'))).dy,
      moreOrLessEquals(anchorTop),
    );
  });

  testWidgets('active drag mutations preserve the current visible anchor', (
    tester,
  ) async {
    final key = GlobalKey<_VirtualListHarnessState>();
    final controller = TRVirtualListController<String>();
    addTearDown(controller.dispose);
    await tester.pumpWidget(
      _host(
        _VirtualListHarness(
          key: key,
          controller: controller,
          initialItems: List<String>.generate(60, (index) => 'item-$index'),
        ),
      ),
    );
    await controller.scrollToKey(
      'item-25',
      alignment: TRVirtualListAlignment.leading,
    );
    await tester.pump();
    final gesture = await tester.startGesture(
      tester.getCenter(find.byKey(const ValueKey('viewport'))),
    );
    await gesture.moveBy(const Offset(0, -18));
    await tester.pump();
    final anchorTop = _top(tester, 'item-26');

    key.currentState!.prepend('drag-prepend', height: 72);
    await tester.pump();
    expect(_top(tester, 'item-26'), moreOrLessEquals(anchorTop));
    await gesture.up();
  });

  testWidgets(
    'fixed-seed structural mutations keep a surviving anchor stable',
    (tester) async {
      final key = GlobalKey<_VirtualListHarnessState>();
      final controller = TRVirtualListController<String>();
      addTearDown(controller.dispose);
      final random = math.Random(14821);
      var items = List<String>.generate(80, (index) => 'item-$index');
      await tester.pumpWidget(
        _host(
          _VirtualListHarness(
            key: key,
            controller: controller,
            initialItems: items,
          ),
        ),
      );
      await controller.scrollToKey(
        'item-50',
        alignment: TRVirtualListAlignment.leading,
      );
      await tester.pump();
      final anchorTop = _top(tester, 'item-50');

      for (var iteration = 0; iteration < 20; iteration += 1) {
        final next = List<String>.of(items);
        if (iteration.isEven) {
          next.insert(random.nextInt(20), 'insert-$iteration');
        } else {
          next.removeAt(random.nextInt(20));
        }
        items = next;
        key.currentState!.replaceItems(items);
        await tester.pump();
        expect(
          _top(tester, 'item-50'),
          moreOrLessEquals(anchorTop),
          reason: 'fixed seed 14821, iteration $iteration',
        );
      }
    },
  );
}
