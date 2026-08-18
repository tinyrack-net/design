import 'dart:math' as math;

import 'package:flutter_test/flutter_test.dart';
import 'package:material_ui/material_ui.dart';
import 'package:tinyrack_ui/tinyrack_ui.dart';

const _viewportHeight = 240.0;

Widget _host(
  Widget child, {
  PageStorageBucket? pageStorageBucket,
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
            child: pageStorageBucket == null
                ? child
                : PageStorage(bucket: pageStorageBucket, child: child),
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
    this.defaultEstimate,
    this.leadingEdgeRequest,
    this.nestedScrollableItem,
    this.onVisibleRangeChanged,
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
  final double? defaultEstimate;
  final TRVirtualListEdgeRequest? leadingEdgeRequest;
  final String? nestedScrollableItem;
  final ValueChanged<TRVirtualListRange<String>>? onVisibleRangeChanged;
  final String? pageStorageId;
  final TRVirtualListEdgeRequest? trailingEdgeRequest;

  @override
  State<_VirtualListHarness> createState() => _VirtualListHarnessState();
}

class _VirtualListHarnessState extends State<_VirtualListHarness> {
  late List<String> items = List<String>.of(widget.initialItems);
  final Map<String, double> estimates = <String, double>{};
  final Map<String, double> heights = <String, double>{};
  var buildCount = 0;

  void append(String item, {double? estimate, double? height}) {
    setState(() {
      items = <String>[...items, item];
      if (estimate != null) estimates[item] = estimate;
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
    estimatedItemExtent: (item, index) =>
        estimates[item] ?? widget.defaultEstimate ?? heights[item] ?? 40,
    itemBuilder: (context, item, index) {
      buildCount += 1;
      return SizedBox(
        key: ValueKey('row-$item'),
        width: widget.axis == Axis.horizontal ? heights[item] ?? 40 : null,
        height: widget.axis == Axis.vertical ? heights[item] ?? 40 : null,
        child: item == widget.nestedScrollableItem
            ? ListView(
                primary: false,
                children: List<Widget>.generate(
                  10,
                  (index) => SizedBox(height: 40, child: TRText('$index')),
                ),
              )
            : TRText(item),
      );
    },
    initialPosition: widget.initialPosition,
    initialSnapshot: widget.initialSnapshot,
    follow: widget.follow,
    leadingEdgeRequest: widget.leadingEdgeRequest,
    onVisibleRangeChanged: widget.onVisibleRangeChanged,
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

Widget _mismatchedExtentList({
  required TRVirtualListController<String> controller,
  required String keyPrefix,
  int itemCount = 50,
  TRVirtualListInitialPosition<String> initialPosition =
      const TRVirtualListInitialPosition.leading(),
}) => TRVirtualList<String, String>(
  controller: controller,
  items: List<String>.generate(itemCount, (index) => 'item-$index'),
  itemKey: (item) => item,
  estimatedItemExtent: (item, index) => 80,
  initialPosition: initialPosition,
  itemBuilder: (context, item, index) => SizedBox(
    key: ValueKey('$keyPrefix-$item'),
    height: 40,
    child: TRText(item),
  ),
);

Widget _storedHost(PageStorageBucket bucket, Widget child) =>
    _host(child, pageStorageBucket: bucket);

Future<void> _seedStoredAnchor(
  WidgetTester tester, {
  required PageStorageBucket bucket,
  required List<String> items,
  required String pageStorageId,
  required String target,
  required Key widgetKey,
}) async {
  final controller = TRVirtualListController<String>();
  addTearDown(controller.dispose);
  await tester.pumpWidget(
    _storedHost(
      bucket,
      _VirtualListHarness(
        key: widgetKey,
        controller: controller,
        initialItems: items,
        pageStorageId: pageStorageId,
      ),
    ),
  );
  await controller.scrollToKey(
    target,
    alignment: TRVirtualListAlignment.leading,
  );
  await tester.pump();
  await tester.pumpWidget(_storedHost(bucket, const SizedBox.shrink()));
}

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
    for (final height in <double>[72, 120, 184, 260, 340]) {
      key.currentState!.resize('item-30', height);
      await tester.pump();

      expect(
        _bottom(tester, 'item-30'),
        moreOrLessEquals(
          tester.getBottomLeft(find.byKey(const ValueKey('viewport'))).dy,
        ),
      );
    }
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

  testWidgets(
    'one-shot hold spans structural and measured disclosure changes',
    (tester) async {
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
      final anchorTop = _top(tester, 'item-29');

      controller.holdVisibleAnchorForNextLayout();
      key.currentState!.append('disclosure', estimate: 20, height: 120);
      await tester.pump();

      expect(_top(tester, 'item-29'), moreOrLessEquals(anchorTop));

      await controller.scrollToEdge(TRVirtualListEdge.trailing);
      await tester.pump();
      key.currentState!.append('after-hold', estimate: 20, height: 100);
      await tester.pump();

      final viewport = tester.getRect(find.byKey(const ValueKey('viewport')));
      expect(_bottom(tester, 'after-hold'), moreOrLessEquals(viewport.bottom));
    },
  );

  testWidgets(
    'one-shot hold preserves an underfilled disclosure through grow and shrink',
    (tester) async {
      final key = GlobalKey<_VirtualListHarnessState>();
      final controller = TRVirtualListController<String>();
      addTearDown(controller.dispose);

      await tester.pumpWidget(
        _host(
          _VirtualListHarness(
            key: key,
            controller: controller,
            initialItems: const <String>['summary', 'disclosure'],
            initialPosition: const TRVirtualListInitialPosition.trailing(),
            follow: TRVirtualListFollow.trailing,
          ),
        ),
      );
      final viewport = tester.getRect(find.byKey(const ValueKey('viewport')));
      final disclosureTop = _top(tester, 'disclosure');
      expect(_bottom(tester, 'disclosure'), moreOrLessEquals(viewport.bottom));

      controller.holdVisibleAnchorForNextLayout();
      key.currentState!.resize('disclosure', 120);
      await tester.pump();
      expect(_top(tester, 'disclosure'), moreOrLessEquals(disclosureTop));
      await tester.pump();
      expect(_top(tester, 'disclosure'), moreOrLessEquals(disclosureTop));

      controller.holdVisibleAnchorForNextLayout();
      key.currentState!.resize('disclosure', 40);
      await tester.pump();
      expect(_top(tester, 'disclosure'), moreOrLessEquals(disclosureTop));
      expect(_bottom(tester, 'disclosure'), moreOrLessEquals(viewport.bottom));
      await tester.pump();
      expect(_top(tester, 'disclosure'), moreOrLessEquals(disclosureTop));
      expect(_bottom(tester, 'disclosure'), moreOrLessEquals(viewport.bottom));
    },
  );

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

  testWidgets(
    'restoring a snapshot wins over trailing follow while rows are measured',
    (tester) async {
      final firstController = TRVirtualListController<String>();
      addTearDown(firstController.dispose);
      final items = List<String>.generate(80, (index) => 'item-$index');

      await tester.pumpWidget(
        _host(
          _VirtualListHarness(controller: firstController, initialItems: items),
        ),
      );
      await firstController.scrollToKey(
        'item-30',
        alignment: TRVirtualListAlignment.leading,
      );
      await tester.pump();
      final snapshot = firstController.takeSnapshot();
      final secondController = TRVirtualListController<String>();
      addTearDown(secondController.dispose);
      final secondKey = GlobalKey<_VirtualListHarnessState>();

      await tester.pumpWidget(
        _host(
          _VirtualListHarness(
            key: secondKey,
            controller: secondController,
            initialItems: items.skip(30).toList(),
            initialSnapshot: snapshot,
            initialPosition: const TRVirtualListInitialPosition.trailing(),
            follow: TRVirtualListFollow.trailing,
            defaultEstimate: 40,
          ),
        ),
      );
      expect(find.byKey(const ValueKey('row-item-30')), findsOneWidget);

      secondKey.currentState!.resize('item-30', 96);
      await tester.pump();

      expect(find.byKey(const ValueKey('row-item-30')), findsOneWidget);
      expect(find.byKey(const ValueKey('row-item-79')), findsNothing);
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
    final secondKey = GlobalKey<_VirtualListHarnessState>();

    await tester.pumpWidget(
      _host(
        _VirtualListHarness(
          key: secondKey,
          controller: secondController,
          initialItems: List<String>.generate(20, (index) => 'new-$index'),
          initialSnapshot: snapshot,
          initialPosition: const TRVirtualListInitialPosition.trailing(),
          follow: TRVirtualListFollow.trailing,
        ),
      ),
    );

    expect(find.byKey(const ValueKey('row-new-19')), findsOneWidget);
    expect(find.byKey(const ValueKey('row-new-0')), findsNothing);

    secondKey.currentState!.append('new-20');
    await tester.pump();
    expect(find.byKey(const ValueKey('row-new-20')), findsOneWidget);
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

  testWidgets(
    'viewport shrink keeps following later streaming growth at trailing',
    (tester) async {
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

      await tester.pumpWidget(_host(list, viewportHeight: 320));
      await tester.pumpWidget(_host(list, viewportHeight: 160));
      await tester.pump();

      for (final height in <double>[72, 120, 200]) {
        key.currentState!.resize('item-29', height);
        await tester.pump();
        expect(
          _bottom(tester, 'item-29'),
          moreOrLessEquals(
            tester.getBottomLeft(find.byKey(const ValueKey('viewport'))).dy,
          ),
        );
      }

      await tester.pumpWidget(_host(list, viewportHeight: 320));
      key.currentState!.resize('item-29', 280);
      await tester.pump();
      expect(
        _bottom(tester, 'item-29'),
        moreOrLessEquals(
          tester.getBottomLeft(find.byKey(const ValueKey('viewport'))).dy,
        ),
      );
    },
  );

  testWidgets(
    'nested scroll activity does not stop trailing streaming follow',
    (tester) async {
      final key = GlobalKey<_VirtualListHarnessState>();
      final controller = TRVirtualListController<String>();
      addTearDown(controller.dispose);

      await tester.pumpWidget(
        _host(
          _VirtualListHarness(
            key: key,
            controller: controller,
            initialItems: List<String>.generate(30, (index) => 'item-$index'),
            nestedScrollableItem: 'item-29',
            initialPosition: const TRVirtualListInitialPosition.trailing(),
            follow: TRVirtualListFollow.trailing,
          ),
        ),
      );
      await tester.pump();

      final nestedScrollable = find.descendant(
        of: find.byKey(const ValueKey('row-item-29')),
        matching: find.byType(Scrollable),
      );
      tester.state<ScrollableState>(nestedScrollable).position.jumpTo(80);
      await tester.pump();

      key.currentState!.resize('item-29', 120);
      await tester.pump();

      expect(
        _bottom(tester, 'item-29'),
        moreOrLessEquals(
          tester.getBottomLeft(find.byKey(const ValueKey('viewport'))).dy,
        ),
      );
    },
  );

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

  testWidgets('fills the viewport when estimates exceed measured extents', (
    tester,
  ) async {
    final controller = TRVirtualListController<String>();
    addTearDown(controller.dispose);

    await tester.pumpWidget(
      _host(
        TRVirtualList<String, String>(
          controller: controller,
          items: List<String>.generate(100, (index) => 'item-$index'),
          itemKey: (item) => item,
          estimatedItemExtent: (item, index) => 100,
          itemBuilder: (context, item, index) => SizedBox(
            key: ValueKey('short-$index'),
            height: 20,
            child: TRText(item),
          ),
        ),
      ),
    );

    expect(find.byKey(const ValueKey('short-11')), findsOneWidget);
    expect(
      tester.getBottomLeft(find.byKey(const ValueKey('short-11'))).dy,
      moreOrLessEquals(
        tester.getBottomLeft(find.byKey(const ValueKey('viewport'))).dy,
      ),
    );
  });

  testWidgets('initial item alignment converges after measuring the target', (
    tester,
  ) async {
    final controller = TRVirtualListController<String>();
    addTearDown(controller.dispose);
    const target = 'item-20';

    await tester.pumpWidget(
      _host(
        _mismatchedExtentList(
          controller: controller,
          keyPrefix: 'measured',
          itemCount: 40,
          initialPosition: const TRVirtualListInitialPosition.key(
            target,
            alignment: TRVirtualListAlignment.center,
          ),
        ),
      ),
    );

    final viewport = tester.getRect(find.byKey(const ValueKey('viewport')));
    final item = tester.getRect(find.byKey(const ValueKey('measured-$target')));
    expect(item.center.dy, moreOrLessEquals(viewport.center.dy));
  });

  testWidgets('controller item and edge alignment converge after measurement', (
    tester,
  ) async {
    final controller = TRVirtualListController<String>();
    addTearDown(controller.dispose);

    await tester.pumpWidget(
      _host(
        _mismatchedExtentList(controller: controller, keyPrefix: 'controller'),
      ),
    );

    await controller.scrollToKey(
      'item-24',
      alignment: TRVirtualListAlignment.center,
    );
    await tester.pump();
    var viewport = tester.getRect(find.byKey(const ValueKey('viewport')));
    var item = tester.getRect(find.byKey(const ValueKey('controller-item-24')));
    expect(item.center.dy, moreOrLessEquals(viewport.center.dy));

    await controller.scrollToIndex(
      30,
      alignment: TRVirtualListAlignment.trailing,
    );
    await tester.pump();
    viewport = tester.getRect(find.byKey(const ValueKey('viewport')));
    item = tester.getRect(find.byKey(const ValueKey('controller-item-30')));
    expect(item.bottom, moreOrLessEquals(viewport.bottom));

    await controller.scrollToEdge(TRVirtualListEdge.trailing);
    await tester.pump();
    viewport = tester.getRect(find.byKey(const ValueKey('viewport')));
    item = tester.getRect(find.byKey(const ValueKey('controller-item-49')));
    expect(item.bottom, moreOrLessEquals(viewport.bottom));
  });

  testWidgets('retains empty index and key targets when edge slots exist', (
    tester,
  ) async {
    final items = List<String>.generate(30, (index) => 'item-$index');

    Future<void> verifyTarget({
      required Key listKey,
      required TRVirtualListInitialPosition<String> position,
      required String target,
      required TRVirtualListAlignment alignment,
      TRVirtualListEdgeRequest? leadingEdgeRequest,
      TRVirtualListEdgeRequest? trailingEdgeRequest,
    }) async {
      final controller = TRVirtualListController<String>();
      addTearDown(controller.dispose);
      await tester.pumpWidget(
        _host(
          _VirtualListHarness(
            key: listKey,
            controller: controller,
            initialItems: const <String>[],
            initialPosition: position,
            leadingEdgeRequest: leadingEdgeRequest,
            trailingEdgeRequest: trailingEdgeRequest,
          ),
        ),
      );
      final state = tester.state<_VirtualListHarnessState>(
        find.byType(_VirtualListHarness),
      );
      state.replaceItems(items);
      await tester.pump();

      final viewport = tester.getRect(find.byKey(const ValueKey('viewport')));
      final item = tester.getRect(find.byKey(ValueKey('row-$target')));
      if (alignment == TRVirtualListAlignment.leading) {
        expect(item.top, moreOrLessEquals(viewport.top));
      } else {
        expect(item.bottom, moreOrLessEquals(viewport.bottom));
      }
    }

    await verifyTarget(
      listKey: const ValueKey('empty-index'),
      position: const TRVirtualListInitialPosition.index(12),
      target: 'item-12',
      alignment: TRVirtualListAlignment.leading,
      leadingEdgeRequest: TRVirtualListEdgeRequest(
        requestKey: 'empty-index-leading-slot',
        onRequest: () {},
        slot: const SizedBox(height: 56),
      ),
    );
    await verifyTarget(
      listKey: const ValueKey('empty-key'),
      position: const TRVirtualListInitialPosition.key(
        'item-18',
        alignment: TRVirtualListAlignment.trailing,
      ),
      target: 'item-18',
      alignment: TRVirtualListAlignment.trailing,
      trailingEdgeRequest: TRVirtualListEdgeRequest(
        requestKey: 'empty-key-trailing-slot',
        onRequest: () {},
        slot: const SizedBox(height: 56),
      ),
    );
  });

  testWidgets('retains an empty snapshot target when an edge slot exists', (
    tester,
  ) async {
    final items = List<String>.generate(40, (index) => 'item-$index');
    final sourceController = TRVirtualListController<String>();
    addTearDown(sourceController.dispose);
    await tester.pumpWidget(
      _host(
        _VirtualListHarness(
          key: const ValueKey('snapshot-source'),
          controller: sourceController,
          initialItems: items,
        ),
      ),
    );
    await sourceController.scrollToKey(
      'item-16',
      alignment: TRVirtualListAlignment.leading,
    );
    await tester.pump();
    final gesture = await tester.startGesture(
      tester.getCenter(find.byKey(const ValueKey('viewport'))),
    );
    await gesture.moveBy(const Offset(0, -13));
    await gesture.up();
    await tester.pumpAndSettle();
    final expectedTop = _top(tester, 'item-16');
    final snapshot = sourceController.takeSnapshot();

    final targetKey = GlobalKey<_VirtualListHarnessState>();
    final targetController = TRVirtualListController<String>();
    addTearDown(targetController.dispose);
    await tester.pumpWidget(
      _host(
        _VirtualListHarness(
          key: targetKey,
          controller: targetController,
          initialItems: const <String>[],
          initialPosition: const TRVirtualListInitialPosition.trailing(),
          initialSnapshot: snapshot,
          leadingEdgeRequest: TRVirtualListEdgeRequest(
            requestKey: 'empty-snapshot-leading-slot',
            onRequest: () {},
            slot: const SizedBox(height: 56),
          ),
        ),
      ),
    );
    targetKey.currentState!.replaceItems(items);
    await tester.pump();

    expect(_top(tester, 'item-16'), moreOrLessEquals(expectedTop));
    expect(find.byKey(const ValueKey('row-item-39')), findsNothing);
  });

  testWidgets('visible ranges use half-open viewport boundaries', (
    tester,
  ) async {
    final controller = TRVirtualListController<String>();
    addTearDown(controller.dispose);
    final ranges = <TRVirtualListRange<String>>[];

    await tester.pumpWidget(
      _host(
        _VirtualListHarness(
          key: const ValueKey('range-boundary'),
          controller: controller,
          initialItems: List<String>.generate(20, (index) => 'item-$index'),
          onVisibleRangeChanged: ranges.add,
        ),
      ),
    );
    expect(ranges, isNotEmpty);
    expect(ranges.last.firstIndex, 0);
    expect(ranges.last.lastIndex, 5);
  });

  testWidgets('visible range reports index changes for the same keys', (
    tester,
  ) async {
    final key = GlobalKey<_VirtualListHarnessState>();
    final controller = TRVirtualListController<String>();
    addTearDown(controller.dispose);
    final ranges = <TRVirtualListRange<String>>[];
    await tester.pumpWidget(
      _host(
        _VirtualListHarness(
          key: key,
          controller: controller,
          initialItems: List<String>.generate(40, (index) => 'item-$index'),
          onVisibleRangeChanged: ranges.add,
        ),
      ),
    );
    await controller.scrollToKey(
      'item-16',
      alignment: TRVirtualListAlignment.leading,
    );
    await tester.pump();
    final before = ranges.last;
    final reportCount = ranges.length;

    key.currentState!.prepend('prepended');
    await tester.pump();

    expect(ranges, hasLength(reportCount + 1));
    expect(ranges.last.firstKey, before.firstKey);
    expect(ranges.last.lastKey, before.lastKey);
    expect(ranges.last.firstIndex, before.firstIndex + 1);
    expect(ranges.last.lastIndex, before.lastIndex + 1);
  });

  testWidgets('page storage follows page id and bucket changes', (
    tester,
  ) async {
    final firstBucket = PageStorageBucket();
    final secondBucket = PageStorageBucket();
    final items = List<String>.generate(50, (index) => 'item-$index');
    await _seedStoredAnchor(
      tester,
      bucket: firstBucket,
      items: items,
      pageStorageId: 'second-id',
      target: 'item-30',
      widgetKey: const ValueKey('id-seed'),
    );

    final switchController = TRVirtualListController<String>();
    addTearDown(switchController.dispose);
    await tester.pumpWidget(
      _storedHost(
        firstBucket,
        _VirtualListHarness(
          key: const ValueKey('identity-switch'),
          controller: switchController,
          initialItems: items,
          pageStorageId: 'first-id',
        ),
      ),
    );
    await switchController.scrollToKey(
      'item-10',
      alignment: TRVirtualListAlignment.leading,
    );
    await tester.pump();
    await tester.pumpWidget(
      _storedHost(
        firstBucket,
        _VirtualListHarness(
          key: const ValueKey('identity-switch'),
          controller: switchController,
          initialItems: items,
          pageStorageId: 'second-id',
        ),
      ),
    );
    expect(_top(tester, 'item-30'), moreOrLessEquals(_viewportTop(tester)));

    await _seedStoredAnchor(
      tester,
      bucket: secondBucket,
      items: items,
      pageStorageId: 'shared-id',
      target: 'item-34',
      widgetKey: const ValueKey('bucket-seed'),
    );

    final bucketSwitchController = TRVirtualListController<String>();
    addTearDown(bucketSwitchController.dispose);
    await tester.pumpWidget(
      _storedHost(
        firstBucket,
        _VirtualListHarness(
          key: const ValueKey('bucket-switch'),
          controller: bucketSwitchController,
          initialItems: items,
          pageStorageId: 'shared-id',
        ),
      ),
    );
    await bucketSwitchController.scrollToKey(
      'item-8',
      alignment: TRVirtualListAlignment.leading,
    );
    await tester.pump();
    await tester.pumpWidget(
      _storedHost(
        secondBucket,
        _VirtualListHarness(
          key: const ValueKey('bucket-switch'),
          controller: bucketSwitchController,
          initialItems: items,
          pageStorageId: 'shared-id',
        ),
      ),
    );
    expect(_top(tester, 'item-34'), moreOrLessEquals(_viewportTop(tester)));
  });

  testWidgets('page storage identity changes discard a pending one-shot hold', (
    tester,
  ) async {
    final bucket = PageStorageBucket();
    final key = GlobalKey<_VirtualListHarnessState>();
    final controller = TRVirtualListController<String>();
    addTearDown(controller.dispose);
    final items = List<String>.generate(20, (index) => 'item-$index');

    Widget list(String pageStorageId) => _storedHost(
      bucket,
      _VirtualListHarness(
        key: key,
        controller: controller,
        initialItems: items,
        initialPosition: const TRVirtualListInitialPosition.trailing(),
        follow: TRVirtualListFollow.trailing,
        pageStorageId: pageStorageId,
      ),
    );

    await tester.pumpWidget(list('first-session'));
    controller.holdVisibleAnchorForNextLayout();
    await tester.pumpWidget(list('second-session'));

    key.currentState!.append('item-20');
    await tester.pump();

    expect(
      _bottom(tester, 'item-20'),
      moreOrLessEquals(
        tester.getRect(find.byKey(const ValueKey('viewport'))).bottom,
      ),
    );
  });

  testWidgets('dispose stores the final in-progress scroll anchor', (
    tester,
  ) async {
    final bucket = PageStorageBucket();
    final items = List<String>.generate(50, (index) => 'item-$index');
    Widget storedHost(Widget child) =>
        PageStorage(bucket: bucket, child: _host(child));
    final firstController = TRVirtualListController<String>();
    addTearDown(firstController.dispose);
    await tester.pumpWidget(
      storedHost(
        _VirtualListHarness(
          controller: firstController,
          initialItems: items,
          pageStorageId: 'dispose-final',
        ),
      ),
    );
    await firstController.scrollToKey(
      'item-22',
      alignment: TRVirtualListAlignment.leading,
    );
    await tester.pump();
    final storedGesture = await tester.startGesture(
      tester.getCenter(find.byKey(const ValueKey('viewport'))),
    );
    await storedGesture.moveBy(const Offset(0, -17));
    await storedGesture.up();
    await tester.pumpAndSettle();

    final finalGesture = await tester.startGesture(
      tester.getCenter(find.byKey(const ValueKey('viewport'))),
    );
    await finalGesture.moveBy(const Offset(0, -5));
    await tester.pump();
    final finalTop = _top(tester, 'item-22');
    await tester.pumpWidget(storedHost(const SizedBox.shrink()));
    await finalGesture.cancel();

    final secondController = TRVirtualListController<String>();
    addTearDown(secondController.dispose);
    await tester.pumpWidget(
      storedHost(
        _VirtualListHarness(
          controller: secondController,
          initialItems: items,
          pageStorageId: 'dispose-final',
        ),
      ),
    );
    expect(_top(tester, 'item-22'), moreOrLessEquals(finalTop));
  });

  testWidgets('initial trailing alignment converges after measurement', (
    tester,
  ) async {
    final controller = TRVirtualListController<String>();
    addTearDown(controller.dispose);
    await tester.pumpWidget(
      _host(
        _mismatchedExtentList(
          controller: controller,
          keyPrefix: 'initial-trailing',
          itemCount: 40,
          initialPosition: const TRVirtualListInitialPosition.trailing(),
        ),
      ),
    );

    expect(
      tester
          .getRect(find.byKey(const ValueKey('initial-trailing-item-39')))
          .bottom,
      moreOrLessEquals(
        tester.getRect(find.byKey(const ValueKey('viewport'))).bottom,
      ),
    );
  });

  testWidgets('does not report items while only an edge slot is visible', (
    tester,
  ) async {
    final controller = TRVirtualListController<String>();
    addTearDown(controller.dispose);
    final ranges = <TRVirtualListRange<String>>[];
    await tester.pumpWidget(
      _host(
        _VirtualListHarness(
          controller: controller,
          initialItems: List<String>.generate(20, (index) => 'item-$index'),
          leadingEdgeRequest: TRVirtualListEdgeRequest(
            requestKey: 'leading-slot',
            onRequest: () {},
            slot: const SizedBox(height: 320),
          ),
          onVisibleRangeChanged: ranges.add,
        ),
      ),
    );

    expect(ranges, isEmpty);
  });

  testWidgets('trailing follow bottom-aligns an underfilled list and slot', (
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
          initialItems: const <String>['item-0', 'item-1'],
          initialPosition: const TRVirtualListInitialPosition.trailing(),
          follow: TRVirtualListFollow.trailing,
          trailingEdgeRequest: TRVirtualListEdgeRequest(
            requestKey: 'short-trailing',
            onRequest: () {},
            slot: const SizedBox(
              key: ValueKey('short-trailing-slot'),
              height: 56,
            ),
          ),
        ),
      ),
    );
    var viewport = tester.getRect(find.byKey(const ValueKey('viewport')));
    var slot = tester.getRect(
      find.byKey(const ValueKey('short-trailing-slot')),
    );
    expect(slot.bottom, moreOrLessEquals(viewport.bottom));

    for (var index = 2; index < 6; index += 1) {
      key.currentState!.append('item-$index');
    }
    await tester.pump();
    viewport = tester.getRect(find.byKey(const ValueKey('viewport')));
    slot = tester.getRect(find.byKey(const ValueKey('short-trailing-slot')));
    expect(slot.bottom, moreOrLessEquals(viewport.bottom));
  });

  testWidgets(
    'trailing initial alignment without follow retains its underfill anchor',
    (tester) async {
      final key = GlobalKey<_VirtualListHarnessState>();
      final controller = TRVirtualListController<String>();
      addTearDown(controller.dispose);
      await tester.pumpWidget(
        _host(
          _VirtualListHarness(
            key: key,
            controller: controller,
            initialItems: const <String>['item-0', 'item-1'],
            initialPosition: const TRVirtualListInitialPosition.trailing(),
          ),
        ),
      );
      final anchorTop = _top(tester, 'item-0');
      expect(
        _bottom(tester, 'item-1'),
        moreOrLessEquals(
          tester.getRect(find.byKey(const ValueKey('viewport'))).bottom,
        ),
      );

      key.currentState!.append('item-2', estimate: 20, height: 80);
      await tester.pump();
      expect(_top(tester, 'item-0'), moreOrLessEquals(anchorTop));

      key.currentState!.resize('item-0', 72);
      await tester.pump();
      expect(_top(tester, 'item-0'), moreOrLessEquals(anchorTop));
    },
  );

  testWidgets('horizontal RTL underfill aligns to logical trailing', (
    tester,
  ) async {
    final controller = TRVirtualListController<String>();
    addTearDown(controller.dispose);
    await tester.pumpWidget(
      _host(
        _VirtualListHarness(
          controller: controller,
          initialItems: const <String>['item-0', 'item-1', 'item-2'],
          axis: Axis.horizontal,
          initialPosition: const TRVirtualListInitialPosition.trailing(),
          follow: TRVirtualListFollow.trailing,
        ),
        textDirection: TextDirection.rtl,
      ),
    );

    expect(
      tester.getRect(find.byKey(const ValueKey('row-item-2'))).left,
      moreOrLessEquals(
        tester.getRect(find.byKey(const ValueKey('viewport'))).left,
      ),
    );
  });

  testWidgets('an underfilled snapshot restores its trailing inset', (
    tester,
  ) async {
    const items = <String>['item-0', 'item-1', 'item-2'];
    final sourceController = TRVirtualListController<String>();
    addTearDown(sourceController.dispose);
    await tester.pumpWidget(
      _host(
        _VirtualListHarness(
          controller: sourceController,
          initialItems: items,
          initialPosition: const TRVirtualListInitialPosition.trailing(),
        ),
      ),
    );
    final snapshot = sourceController.takeSnapshot();

    final targetController = TRVirtualListController<String>();
    addTearDown(targetController.dispose);
    await tester.pumpWidget(
      _host(
        _VirtualListHarness(
          key: const ValueKey('underfilled-snapshot-target'),
          controller: targetController,
          initialItems: items,
          initialSnapshot: snapshot,
        ),
      ),
    );

    expect(
      _bottom(tester, 'item-2'),
      moreOrLessEquals(
        tester.getRect(find.byKey(const ValueKey('viewport'))).bottom,
      ),
    );
  });

  testWidgets('rejects zero item estimates before layout', (tester) async {
    final controller = TRVirtualListController<String>();
    addTearDown(controller.dispose);
    await tester.pumpWidget(
      _host(
        TRVirtualList<String, String>(
          controller: controller,
          items: const <String>['item'],
          itemKey: (item) => item,
          estimatedItemExtent: (item, index) => 0,
          itemBuilder: (context, item, index) => const SizedBox(height: 40),
        ),
      ),
    );

    expect(tester.takeException(), isA<AssertionError>());
  });
}

double _viewportTop(WidgetTester tester) =>
    tester.getTopLeft(find.byKey(const ValueKey('viewport'))).dy;
