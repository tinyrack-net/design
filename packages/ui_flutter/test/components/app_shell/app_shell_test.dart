import 'package:flutter/material.dart';
import 'package:flutter/semantics.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:tinyrack_ui/tinyrack_ui.dart';

void main() {
  const headerKey = Key('header');
  const sidebarKey = Key('sidebar');
  const mainKey = Key('main');

  setUp(() => TestWidgetsFlutterBinding.ensureInitialized());

  testWidgets('provides a Material surface for composed Tinyrack controls', (
    tester,
  ) async {
    await tester.pumpWidget(
      MaterialApp(
        theme: TinyrackTheme.light(),
        home: const TRAppShell(
          main: TRAppShellMain(
            child: TRTextField(uiSize: TRUiSize.md, label: 'Workspace name'),
          ),
        ),
      ),
    );

    expect(tester.takeException(), isNull);
    expect(find.byType(TextField), findsOneWidget);
  });

  testWidgets('matches header-first and sidebar-first desktop geometry', (
    tester,
  ) async {
    await _setViewport(tester, const Size(800, 400));
    addTearDown(() => tester.binding.setSurfaceSize(null));

    Future<void> pump(TRAppShellLayout layout) => tester.pumpWidget(
      _app(
        TRAppShell(
          breakpoint: TRAppShellBreakpoint.sm,
          layout: layout,
          header: const TRAppShellHeader(
            height: 48,
            children: [SizedBox(key: headerKey)],
          ),
          sidebar: const TRAppShellSidebar(
            key: sidebarKey,
            child: Text('Navigation'),
          ),
          main: const TRAppShellMain(key: mainKey, child: Text('Content')),
        ),
      ),
    );

    await pump(TRAppShellLayout.headerFirst);
    expect(
      tester.getRect(find.byKey(sidebarKey)),
      const Rect.fromLTWH(0, 48, 288, 352),
    );
    expect(
      tester.getRect(find.byKey(mainKey)),
      const Rect.fromLTWH(288, 48, 512, 352),
    );

    await pump(TRAppShellLayout.sidebarFirst);
    expect(
      tester.getRect(find.byKey(sidebarKey)),
      const Rect.fromLTWH(0, 0, 288, 400),
    );
    expect(
      tester.getRect(find.byKey(mainKey)),
      const Rect.fromLTWH(288, 48, 512, 352),
    );
  });

  testWidgets('uses viewport media width rather than local layout width', (
    tester,
  ) async {
    await _setViewport(tester, const Size(800, 400));
    addTearDown(() => tester.binding.setSurfaceSize(null));
    await tester.pumpWidget(
      _app(
        Align(
          alignment: Alignment.topLeft,
          child: SizedBox(
            width: 400,
            height: 320,
            child: TRAppShell(
              breakpoint: TRAppShellBreakpoint.sm,
              sidebar: const TRAppShellSidebar(
                key: sidebarKey,
                child: Text('Navigation'),
              ),
              main: const TRAppShellMain(child: Text('Content')),
            ),
          ),
        ),
      ),
    );
    expect(tester.getSize(find.byKey(sidebarKey)).width, 288);
    expect(find.text('Navigation'), findsOneWidget);
  });

  testWidgets('desktop rail is exactly 64px and callbacks are not duplicated', (
    tester,
  ) async {
    await _setViewport(tester, const Size(800, 400));
    addTearDown(() => tester.binding.setSurfaceSize(null));
    final controller = TRAppShellController();
    addTearDown(controller.dispose);
    final sidebarChanges = <TRAppShellSidebarMode>[];
    final mobileChanges = <bool>[];
    await tester.pumpWidget(
      _app(
        TRAppShell(
          breakpoint: TRAppShellBreakpoint.sm,
          controller: controller,
          onMobileOpenChanged: mobileChanges.add,
          onSidebarModeChanged: sidebarChanges.add,
          sidebar: const TRAppShellSidebar(
            key: sidebarKey,
            child: Text('Navigation'),
          ),
          main: const TRAppShellMain(child: Text('Content')),
        ),
      ),
    );

    controller.setSidebarMode(TRAppShellSidebarMode.rail);
    controller.setSidebarMode(TRAppShellSidebarMode.rail);
    controller.openMobileNavigation();
    controller.openMobileNavigation();
    // The sidebar animates every width change, so settle before measuring.
    await tester.pumpAndSettle();
    expect(tester.getSize(find.byKey(sidebarKey)).width, 64);
    expect(sidebarChanges, [TRAppShellSidebarMode.rail]);
    expect(mobileChanges, [true]);
  });

  testWidgets('mobile rail stays inline and visually hides labels', (
    tester,
  ) async {
    await _setViewport(tester, const Size(480, 320));
    addTearDown(() => tester.binding.setSurfaceSize(null));
    final semantics = tester.ensureSemantics();
    await tester.pumpWidget(
      _app(
        TRAppShell(
          breakpoint: TRAppShellBreakpoint.sm,
          mobileSidebar: TRAppShellMobileSidebar.rail,
          sidebar: const TRAppShellSidebar(
            key: sidebarKey,
            child: TRAppShellSidebarLabel(child: Text('Overview')),
          ),
          main: const TRAppShellMain(key: mainKey, child: Text('Content')),
        ),
      ),
    );

    expect(tester.getSize(find.byKey(sidebarKey)).width, 64);
    expect(tester.getSize(find.byType(Opacity)), const Size(1, 1));
    expect(find.bySemanticsLabel('Overview'), findsOneWidget);
    semantics.dispose();
  });

  testWidgets(
    'mobile drawer is a full-height 288px modal and Escape closes it',
    (tester) async {
      await _setViewport(tester, const Size(480, 320));
      addTearDown(() => tester.binding.setSurfaceSize(null));
      final controller = TRAppShellController(mobileOpen: true);
      addTearDown(controller.dispose);
      await tester.pumpWidget(
        _app(
          TRAppShell(
            breakpoint: TRAppShellBreakpoint.sm,
            controller: controller,
            header: const TRAppShellHeader(
              height: 48,
              children: [Text('Header')],
            ),
            sidebar: const TRAppShellSidebar(
              key: sidebarKey,
              semanticLabel: 'Navigation',
              child: Text('Drawer navigation'),
            ),
            main: const TRAppShellMain(child: Text('Content')),
          ),
        ),
      );
      await tester.pumpAndSettle();

      expect(
        tester.getRect(find.byKey(sidebarKey)),
        const Rect.fromLTWH(0, 0, 288, 320),
      );
      expect(find.byType(ModalBarrier), findsWidgets);
      await tester.sendKeyEvent(LogicalKeyboardKey.escape);
      await tester.pumpAndSettle();
      expect(find.text('Drawer navigation'), findsNothing);
      expect(controller.mobileOpen, isFalse);

      controller.openMobileNavigation();
      await tester.pumpAndSettle();
      await tester.tapAt(const Offset(400, 160));
      await tester.pumpAndSettle();
      expect(controller.mobileOpen, isFalse);

      controller.openMobileNavigation();
      await tester.pumpAndSettle();
      expect(await tester.binding.handlePopRoute(), isTrue);
      await tester.pumpAndSettle();
      expect(controller.mobileOpen, isFalse);
    },
  );

  testWidgets('logical drawer side follows RTL', (tester) async {
    await _setViewport(tester, const Size(480, 320));
    addTearDown(() => tester.binding.setSurfaceSize(null));
    final controller = TRAppShellController(mobileOpen: true);
    addTearDown(controller.dispose);
    await tester.pumpWidget(
      _app(
        Directionality(
          textDirection: TextDirection.rtl,
          child: TRAppShell(
            breakpoint: TRAppShellBreakpoint.sm,
            controller: controller,
            mobileDrawerSide: TRAppShellMobileDrawerSide.start,
            sidebar: const TRAppShellSidebar(
              key: sidebarKey,
              child: Text('Navigation'),
            ),
            main: const TRAppShellMain(child: Text('Content')),
          ),
        ),
      ),
    );
    await tester.pumpAndSettle();
    expect(
      tester.getRect(find.byKey(sidebarKey)),
      const Rect.fromLTWH(192, 0, 288, 320),
    );
  });

  testWidgets('drawer traps focus and honors reduced motion', (tester) async {
    await _setViewport(tester, const Size(480, 320));
    addTearDown(() => tester.binding.setSurfaceSize(null));
    final controller = TRAppShellController(mobileOpen: true);
    final first = FocusNode();
    final second = FocusNode();
    addTearDown(controller.dispose);
    addTearDown(first.dispose);
    addTearDown(second.dispose);
    await tester.pumpWidget(
      _app(
        MediaQuery(
          data: const MediaQueryData(
            disableAnimations: true,
            size: Size(480, 320),
          ),
          child: TRAppShell(
            breakpoint: TRAppShellBreakpoint.sm,
            controller: controller,
            sidebar: TRAppShellSidebar(
              child: Column(
                children: [
                  TextButton(
                    focusNode: first,
                    onPressed: () {},
                    child: const Text('First'),
                  ),
                  TextButton(
                    focusNode: second,
                    onPressed: () {},
                    child: const Text('Second'),
                  ),
                ],
              ),
            ),
            main: const TRAppShellMain(child: Text('Content')),
          ),
        ),
      ),
    );
    await tester.pump();
    expect(find.text('First'), findsOneWidget);
    final route = ModalRoute.of(tester.element(find.text('First')))!;
    expect(route.transitionDuration, Duration.zero);

    first.requestFocus();
    await tester.pump();
    await tester.sendKeyEvent(LogicalKeyboardKey.tab);
    await tester.pump();
    expect(second.hasFocus, isTrue);
    await tester.sendKeyEvent(LogicalKeyboardKey.tab);
    await tester.pump();
    expect(first.hasFocus, isTrue);
  });

  testWidgets('Trigger and Close are 32px controls and restore trigger focus', (
    tester,
  ) async {
    await _setViewport(tester, const Size(480, 320));
    addTearDown(() => tester.binding.setSurfaceSize(null));
    final controller = TRAppShellController();
    addTearDown(controller.dispose);
    await tester.pumpWidget(
      _app(
        TRAppShell(
          breakpoint: TRAppShellBreakpoint.sm,
          controller: controller,
          header: const TRAppShellHeader(
            height: 48,
            children: [
              TRAppShellTrigger(
                icon: Icon(Icons.menu),
                label: 'Open navigation',
              ),
            ],
          ),
          sidebar: const TRAppShellSidebar(
            child: Column(
              children: [
                TRAppShellClose(
                  icon: Icon(Icons.close),
                  label: 'Close navigation',
                ),
                Text('Navigation'),
              ],
            ),
          ),
          main: const TRAppShellMain(child: Text('Content')),
        ),
      ),
    );

    final trigger = find.bySemanticsLabel('Open navigation');
    expect(tester.getSize(trigger), const Size(32, 32));
    await tester.sendKeyEvent(LogicalKeyboardKey.tab);
    await tester.pump();
    final triggerFocus = FocusManager.instance.primaryFocus;
    expect(triggerFocus, isNotNull);
    await tester.sendKeyEvent(LogicalKeyboardKey.enter);
    await tester.pumpAndSettle();
    final close = find.bySemanticsLabel('Close navigation');
    expect(tester.getSize(close), const Size(32, 32));
    await tester.tap(close);
    await tester.pumpAndSettle();
    expect(controller.mobileOpen, isFalse);
    expect(find.bySemanticsLabel('Open navigation'), findsOneWidget);
    expect(FocusManager.instance.primaryFocus, same(triggerFocus));
  });

  testWidgets('replacing an external controller detaches the old state', (
    tester,
  ) async {
    await _setViewport(tester, const Size(800, 400));
    addTearDown(() => tester.binding.setSurfaceSize(null));
    final first = TRAppShellController();
    final second = TRAppShellController(
      sidebarMode: TRAppShellSidebarMode.rail,
    );
    addTearDown(first.dispose);
    addTearDown(second.dispose);
    late StateSetter setHostState;
    var controller = first;
    final changes = <TRAppShellSidebarMode>[];
    await tester.pumpWidget(
      _app(
        StatefulBuilder(
          builder: (context, setState) {
            setHostState = setState;
            return TRAppShell(
              breakpoint: TRAppShellBreakpoint.sm,
              controller: controller,
              onSidebarModeChanged: changes.add,
              sidebar: const TRAppShellSidebar(
                key: sidebarKey,
                child: Text('Navigation'),
              ),
              main: const TRAppShellMain(child: Text('Content')),
            );
          },
        ),
      ),
    );

    setHostState(() => controller = second);
    await tester.pumpAndSettle();
    expect(tester.getSize(find.byKey(sidebarKey)).width, 64);
    first.setSidebarMode(TRAppShellSidebarMode.rail);
    await tester.pump();
    expect(changes, isEmpty);
    second.setSidebarMode(TRAppShellSidebarMode.expanded);
    await tester.pumpAndSettle();
    expect(changes, [TRAppShellSidebarMode.expanded]);
    expect(tester.getSize(find.byKey(sidebarKey)).width, 288);
  });

  testWidgets('chrome variants and pending progress match their contract', (
    tester,
  ) async {
    await _setViewport(tester, const Size(1100, 500));
    addTearDown(() => tester.binding.setSurfaceSize(null));

    Future<void> pump(TRAppShellChrome chrome) => tester.pumpWidget(
      _app(
        TRAppShell(
          breakpoint: TRAppShellBreakpoint.lg,
          chrome: chrome,
          currentPath: '/guide',
          pendingPath: '/next',
          header: const TRAppShellHeader(
            key: headerKey,
            children: [Text('Header')],
          ),
          sidebar: const TRAppShellSidebar(
            key: sidebarKey,
            child: Text('Navigation'),
          ),
          main: const TRAppShellMain(key: mainKey, child: Text('Content')),
        ),
      ),
    );

    await pump(TRAppShellChrome.docs);
    expect(tester.getSize(find.byKey(headerKey)).height, 48);
    expect(find.byKey(sidebarKey), findsOneWidget);
    expect(tester.getSize(find.byType(LinearProgressIndicator)).height, 4);

    await pump(TRAppShellChrome.splash);
    expect(find.byKey(headerKey), findsOneWidget);
    expect(find.byKey(sidebarKey), findsNothing);

    await pump(TRAppShellChrome.standalone);
    expect(find.byKey(headerKey), findsNothing);
    expect(find.byKey(sidebarKey), findsNothing);
    expect(find.byKey(mainKey), findsOneWidget);
  });

  testWidgets('animates the sidebar between expanded and collapsed', (
    tester,
  ) async {
    await _setViewport(tester, const Size(800, 400));
    addTearDown(() => tester.binding.setSurfaceSize(null));
    late StateSetter setHostState;
    var collapsed = false;
    await tester.pumpWidget(
      _app(
        StatefulBuilder(
          builder: (context, setState) {
            setHostState = setState;
            return TRAppShell(
              breakpoint: TRAppShellBreakpoint.sm,
              sidebar: TRAppShellSidebar(
                key: sidebarKey,
                collapsed: collapsed,
                child: const Text('Navigation'),
              ),
              main: const TRAppShellMain(child: Text('Content')),
            );
          },
        ),
      ),
    );
    expect(tester.getSize(find.byKey(sidebarKey)).width, 288);

    setHostState(() => collapsed = true);
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 80));
    final collapsing = tester.getSize(find.byKey(sidebarKey)).width;
    expect(collapsing, greaterThan(0));
    expect(collapsing, lessThan(288));

    await tester.pumpAndSettle();
    expect(tester.getSize(find.byKey(sidebarKey)).width, 0);
    expect(find.text('Navigation'), findsNothing);

    setHostState(() => collapsed = false);
    await tester.pump();
    expect(find.text('Navigation'), findsOneWidget);
    await tester.pump(const Duration(milliseconds: 80));
    final expanding = tester.getSize(find.byKey(sidebarKey)).width;
    expect(expanding, greaterThan(0));
    expect(expanding, lessThan(288));

    await tester.pumpAndSettle();
    expect(tester.getSize(find.byKey(sidebarKey)).width, 288);
  });

  testWidgets('a collapsing sidebar drops focus, pointers, and semantics', (
    tester,
  ) async {
    await _setViewport(tester, const Size(800, 400));
    addTearDown(() => tester.binding.setSurfaceSize(null));
    final semantics = tester.ensureSemantics();
    final focusNode = FocusNode();
    addTearDown(focusNode.dispose);
    late StateSetter setHostState;
    var collapsed = false;
    var taps = 0;
    await tester.pumpWidget(
      _app(
        StatefulBuilder(
          builder: (context, setState) {
            setHostState = setState;
            return TRAppShell(
              breakpoint: TRAppShellBreakpoint.sm,
              sidebar: TRAppShellSidebar(
                key: sidebarKey,
                collapsed: collapsed,
                child: TextButton(
                  focusNode: focusNode,
                  onPressed: () => taps++,
                  child: const Text('Navigate'),
                ),
              ),
              main: const TRAppShellMain(child: Text('Content')),
            );
          },
        ),
      ),
    );
    focusNode.requestFocus();
    await tester.pump();
    expect(focusNode.hasFocus, isTrue);

    expect(_semanticsLabels(tester), contains('Navigate'));

    setHostState(() => collapsed = true);
    await tester.pump();
    expect(focusNode.hasFocus, isFalse);
    expect(_semanticsLabels(tester), isNot(contains('Navigate')));
    await tester.tap(find.text('Navigate'), warnIfMissed: false);
    await tester.pump();
    expect(taps, 0);

    await tester.pumpAndSettle();
    expect(find.text('Navigate'), findsNothing);
    semantics.dispose();
  });

  testWidgets('animates between rail and expanded sidebar widths', (
    tester,
  ) async {
    await _setViewport(tester, const Size(800, 400));
    addTearDown(() => tester.binding.setSurfaceSize(null));
    final controller = TRAppShellController();
    addTearDown(controller.dispose);
    await tester.pumpWidget(
      _app(
        TRAppShell(
          breakpoint: TRAppShellBreakpoint.sm,
          controller: controller,
          sidebar: const TRAppShellSidebar(
            key: sidebarKey,
            child: Text('Navigation'),
          ),
          main: const TRAppShellMain(child: Text('Content')),
        ),
      ),
    );

    controller.setSidebarMode(TRAppShellSidebarMode.rail);
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 80));
    final narrowing = tester.getSize(find.byKey(sidebarKey)).width;
    expect(narrowing, greaterThan(64));
    expect(narrowing, lessThan(288));

    await tester.pumpAndSettle();
    expect(tester.getSize(find.byKey(sidebarKey)).width, 64);
  });

  testWidgets('reduced motion collapses the sidebar without animating', (
    tester,
  ) async {
    await _setViewport(tester, const Size(800, 400));
    addTearDown(() => tester.binding.setSurfaceSize(null));
    late StateSetter setHostState;
    var collapsed = false;
    await tester.pumpWidget(
      _app(
        MediaQuery(
          data: const MediaQueryData(
            disableAnimations: true,
            size: Size(800, 400),
          ),
          child: StatefulBuilder(
            builder: (context, setState) {
              setHostState = setState;
              return TRAppShell(
                breakpoint: TRAppShellBreakpoint.sm,
                sidebar: TRAppShellSidebar(
                  key: sidebarKey,
                  collapsed: collapsed,
                  child: const Text('Navigation'),
                ),
                main: const TRAppShellMain(child: Text('Content')),
              );
            },
          ),
        ),
      ),
    );

    setHostState(() => collapsed = true);
    await tester.pump();
    expect(tester.getSize(find.byKey(sidebarKey)).width, 0);

    await tester.pumpAndSettle();
    expect(find.text('Navigation'), findsNothing);
  });

  testWidgets('a sidebar composed inside main animates its own width', (
    tester,
  ) async {
    await _setViewport(tester, const Size(800, 400));
    addTearDown(() => tester.binding.setSurfaceSize(null));
    late StateSetter setHostState;
    var collapsed = false;
    await tester.pumpWidget(
      _app(
        StatefulBuilder(
          builder: (context, setState) {
            setHostState = setState;
            return TRAppShell(
              breakpoint: TRAppShellBreakpoint.sm,
              main: TRAppShellMain(
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    TRAppShellSidebar(
                      key: sidebarKey,
                      collapsed: collapsed,
                      width: 240,
                      child: const Text('Navigation'),
                    ),
                    const Expanded(child: Text('Content')),
                  ],
                ),
              ),
            );
          },
        ),
      ),
    );
    expect(tester.getSize(find.byKey(sidebarKey)).width, 240);

    setHostState(() => collapsed = true);
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 80));
    final collapsing = tester.getSize(find.byKey(sidebarKey)).width;
    expect(collapsing, greaterThan(0));
    expect(collapsing, lessThan(240));

    await tester.pumpAndSettle();
    expect(tester.getSize(find.byKey(sidebarKey)).width, 0);
    expect(find.text('Navigation'), findsNothing);
  });

  testWidgets('the mobile drawer surface ignores the collapsed flag', (
    tester,
  ) async {
    await _setViewport(tester, const Size(480, 320));
    addTearDown(() => tester.binding.setSurfaceSize(null));
    final controller = TRAppShellController(mobileOpen: true);
    addTearDown(controller.dispose);
    await tester.pumpWidget(
      _app(
        TRAppShell(
          breakpoint: TRAppShellBreakpoint.sm,
          controller: controller,
          sidebar: const TRAppShellSidebar(
            key: sidebarKey,
            collapsed: true,
            child: Text('Drawer navigation'),
          ),
          main: const TRAppShellMain(child: Text('Content')),
        ),
      ),
    );
    await tester.pumpAndSettle();

    expect(
      tester.getRect(find.byKey(sidebarKey)),
      const Rect.fromLTWH(0, 0, 288, 320),
    );
    expect(find.text('Drawer navigation'), findsOneWidget);
  });

  testWidgets('docs outline precedes content and moves inline at xl', (
    tester,
  ) async {
    const outlineKey = Key('outline');
    await _setViewport(tester, const Size(1100, 500));
    addTearDown(() => tester.binding.setSurfaceSize(null));

    Widget shell() => TRAppShell(
      breakpoint: TRAppShellBreakpoint.lg,
      chrome: TRAppShellChrome.docs,
      outline: const TRAppShellOutline(
        key: outlineKey,
        child: Text('On this page'),
      ),
      main: const TRAppShellMain(key: mainKey, child: Text('Content')),
    );

    await tester.pumpWidget(_app(shell()));
    expect(
      tester.getBottomLeft(find.byKey(outlineKey)).dy,
      lessThanOrEqualTo(tester.getTopLeft(find.byKey(mainKey)).dy),
    );

    await _setViewport(tester, const Size(1300, 500));
    await tester.pumpWidget(_app(shell()));
    expect(
      tester.getTopRight(find.byKey(mainKey)).dx,
      tester.getTopLeft(find.byKey(outlineKey)).dx,
    );
  });

  testWidgets(
    'container scrolling resets, restores POP, and follows hash anchors',
    (tester) async {
      await _setViewport(tester, const Size(800, 400));
      addTearDown(() => tester.binding.setSurfaceSize(null));
      final targetKey = GlobalKey();
      late StateSetter setHostState;
      var path = '/a';
      var locationKey = 'a';
      var hash = '';
      var kind = TRAppShellNavigationKind.push;

      await tester.pumpWidget(
        _app(
          StatefulBuilder(
            builder: (context, setState) {
              setHostState = setState;
              return TRAppShell(
                breakpoint: TRAppShellBreakpoint.sm,
                currentPath: path,
                locationKey: locationKey,
                hash: hash,
                navigationKind: kind,
                anchorTargets: {'anchor': targetKey},
                main: TRAppShellMain(
                  scroll: true,
                  child: Column(
                    children: [
                      const SizedBox(height: 600),
                      SizedBox(
                        key: targetKey,
                        height: 40,
                        child: const Text('Anchor'),
                      ),
                      const SizedBox(height: 600),
                    ],
                  ),
                ),
              );
            },
          ),
        ),
      );
      await tester.drag(
        find.byType(SingleChildScrollView).last,
        const Offset(0, -300),
      );
      await tester.pump();
      final scrollable = tester.state<ScrollableState>(
        find.byType(Scrollable).last,
      );
      final saved = scrollable.position.pixels;
      expect(saved, greaterThan(0));

      setHostState(() {
        path = '/b';
        locationKey = 'b';
        kind = TRAppShellNavigationKind.push;
      });
      await tester.pump();
      expect(scrollable.position.pixels, 0);

      setHostState(() {
        path = '/a';
        locationKey = 'a';
        kind = TRAppShellNavigationKind.pop;
      });
      await tester.pump();
      expect(scrollable.position.pixels, moreOrLessEquals(saved));

      setHostState(() => hash = '#anchor');
      await tester.pumpAndSettle();
      expect(
        tester.getTopLeft(find.text('Anchor')).dy,
        greaterThanOrEqualTo(0),
      );
      expect(tester.getTopLeft(find.text('Anchor')).dy, lessThan(80));
    },
  );

  testWidgets('primary scrolling resets and restores route positions', (
    tester,
  ) async {
    await _setViewport(tester, const Size(800, 400));
    addTearDown(() => tester.binding.setSurfaceSize(null));
    final primary = ScrollController();
    addTearDown(primary.dispose);
    late StateSetter setHostState;
    var path = '/a';
    var kind = TRAppShellNavigationKind.push;

    await tester.pumpWidget(
      _app(
        PrimaryScrollController(
          controller: primary,
          child: StatefulBuilder(
            builder: (context, setState) {
              setHostState = setState;
              return TRAppShell(
                currentPath: path,
                locationKey: path,
                navigationKind: kind,
                pageScroll: TRAppShellPageScroll.primary,
                main: const TRAppShellMain(
                  scroll: true,
                  child: SizedBox(height: 1000),
                ),
              );
            },
          ),
        ),
      ),
    );
    await tester.drag(
      find.byType(SingleChildScrollView),
      const Offset(0, -240),
    );
    await tester.pump();
    final saved = primary.offset;
    expect(saved, greaterThan(0));

    setHostState(() {
      path = '/b';
      kind = TRAppShellNavigationKind.replace;
    });
    await tester.pump();
    expect(primary.offset, 0);

    setHostState(() {
      path = '/a';
      kind = TRAppShellNavigationKind.pop;
    });
    await tester.pump();
    expect(primary.offset, moreOrLessEquals(saved));
  });
}

/// Labels reachable from the live semantics tree, not from stale render data.
Set<String> _semanticsLabels(WidgetTester tester) {
  final labels = <String>{};
  void visit(SemanticsNode node) {
    if (node.label.isNotEmpty) labels.add(node.label);
    node.visitChildren((child) {
      visit(child);
      return true;
    });
  }

  visit(tester.semantics.find(find.byType(TRAppShell)));
  return labels;
}

Future<void> _setViewport(WidgetTester tester, Size size) async {
  tester.view.devicePixelRatio = 1;
  tester.view.physicalSize = size;
  addTearDown(tester.view.resetDevicePixelRatio);
  addTearDown(tester.view.resetPhysicalSize);
  await tester.binding.setSurfaceSize(size);
}

Widget _app(Widget child) => MaterialApp(
  debugShowCheckedModeBanner: false,
  theme: TinyrackTheme.light(),
  home: Scaffold(body: child),
);
