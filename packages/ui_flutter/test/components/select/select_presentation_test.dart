import 'package:flutter/gestures.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:material_ui/material_ui.dart';
import 'package:tinyrack_ui/tinyrack_ui.dart';

const _layer = TRSelectPresentation.layer(
  layerSize: TRLayerSize(
    width: TRLayerWidth.fixed(280),
    height: TRLayerHeight.fixed(320),
  ),
);

const _sheet = TRSelectPresentation.sheet(maxExtent: 0.7);

const _intrinsicLayer = TRSelectPresentation.layer(
  layerSize: TRLayerSize(
    width: TRLayerWidth.fixed(280),
    height: TRLayerHeight.content(max: 480),
  ),
);

final _items = <TRSelectItem<int>>[
  for (var index = 0; index < 30; index += 1)
    TRSelectItem<int>(value: index, label: 'Option $index'),
];

Finder get _trigger => find.descendant(
  of: find.byType(TRSelect<int>),
  matching: find.byType(TextButton),
);

Finder get _search => find.byType(TRTextField);

Finder get _layerSurface => find.byWidgetPredicate(
  (widget) => widget.runtimeType.toString() == 'TRLayerSurface',
);

Finder get _verticalScrollables => find.byWidgetPredicate(
  (widget) =>
      widget is Scrollable &&
      (widget.axisDirection == AxisDirection.down ||
          widget.axisDirection == AxisDirection.up),
);

Widget _app(Widget child, {Size size = const Size(900, 800)}) => MaterialApp(
  theme: TinyrackTheme.light(),
  home: MediaQuery(
    data: MediaQueryData(size: size, disableAnimations: true),
    child: Scaffold(
      body: Align(alignment: Alignment.topLeft, child: child),
    ),
  ),
);

Future<void> _open(WidgetTester tester) async {
  await tester.tap(_trigger);
  await tester.pumpAndSettle();
}

ScrollPosition _onlyOptionsPosition(WidgetTester tester) =>
    tester.state<ScrollableState>(_verticalScrollables).position;

void main() {
  testWidgets('searchable layer owns exactly one vertical scroll position', (
    tester,
  ) async {
    await tester.pumpWidget(
      _app(
        TRSelect<int>(items: _items, searchable: true, presentation: _layer),
      ),
    );

    await _open(tester);

    expect(_verticalScrollables, findsOneWidget);
    expect(
      find.ancestor(of: _search, matching: _verticalScrollables),
      findsNothing,
    );
    expect(_onlyOptionsPosition(tester).maxScrollExtent, greaterThan(0));
  });

  testWidgets('searchable sheet owns exactly one vertical scroll position', (
    tester,
  ) async {
    await tester.pumpWidget(
      _app(
        TRSelect<int>(items: _items, searchable: true, presentation: _sheet),
        size: const Size(400, 800),
      ),
    );

    await _open(tester);

    expect(find.byType(TRDrawer), findsOneWidget);
    expect(_verticalScrollables, findsOneWidget);
    expect(
      find.ancestor(of: _search, matching: _verticalScrollables),
      findsNothing,
    );
    expect(_onlyOptionsPosition(tester).maxScrollExtent, greaterThan(0));
  });

  for (final presentation in <TRSelectPresentation>[_layer, _sheet]) {
    testWidgets(
      'scroll over search is blocked while options scroll for $presentation',
      (tester) async {
        final size = identical(presentation, _sheet)
            ? const Size(400, 800)
            : const Size(900, 800);
        await tester.pumpWidget(
          _app(
            TRSelect<int>(
              items: _items,
              searchable: true,
              presentation: presentation,
            ),
            size: size,
          ),
        );
        await _open(tester);
        final position = _onlyOptionsPosition(tester);

        await tester.sendEventToBinding(
          PointerScrollEvent(
            position: tester.getCenter(_search),
            scrollDelta: const Offset(0, 240),
          ),
        );
        await tester.pumpAndSettle();
        expect(position.pixels, 0);

        await tester.sendEventToBinding(
          PointerScrollEvent(
            position: tester.getCenter(find.text('Option 0')),
            scrollDelta: const Offset(0, 240),
          ),
        );
        await tester.pumpAndSettle();
        expect(position.pixels, greaterThan(0));
      },
    );
  }

  for (final presentation in <TRSelectPresentation>[_layer, _sheet]) {
    testWidgets(
      'touch drag over search leaves options and sheet still for $presentation',
      (tester) async {
        final size = identical(presentation, _sheet)
            ? const Size(400, 800)
            : const Size(900, 800);
        await tester.pumpWidget(
          _app(
            TRSelect<int>(
              items: _items,
              searchable: true,
              presentation: presentation,
            ),
            size: size,
          ),
        );
        await _open(tester);
        final position = _onlyOptionsPosition(tester);
        final drawerRect = identical(presentation, _sheet)
            ? tester.getRect(find.byType(TRDrawer))
            : null;

        await tester.drag(_search, const Offset(0, -160));
        await tester.pumpAndSettle();

        expect(position.pixels, 0);
        if (drawerRect != null) {
          expect(tester.getRect(find.byType(TRDrawer)), drawerRect);
        }
      },
    );
  }

  testWidgets('sheet options scroll while only the drag handle moves drawer', (
    tester,
  ) async {
    await tester.pumpWidget(
      _app(
        TRSelect<int>(
          items: _items,
          searchable: true,
          presentation: const TRSelectPresentation.sheet(
            maxExtent: 0.7,
            snapPoints: <double>[0.4, 0.7],
          ),
        ),
        size: const Size(400, 800),
      ),
    );
    await _open(tester);
    final position = _onlyOptionsPosition(tester);
    final drawer = find.byType(TRDrawer);
    final initialDrawerRect = tester.getRect(drawer);

    await tester.drag(find.text('Option 0'), const Offset(0, -120));
    await tester.pumpAndSettle();

    expect(position.pixels, greaterThan(0));
    expect(tester.getRect(drawer), initialDrawerRect);

    await tester.drag(
      find.byKey(const ValueKey<String>('tr-drawer-drag-handle')),
      const Offset(0, -120),
    );
    await tester.pumpAndSettle();

    expect(
      tester.getRect(drawer).height,
      greaterThan(initialDrawerRect.height),
    );
  });

  testWidgets('open sheet keeps its height while tracking viewport width', (
    tester,
  ) async {
    tester.view.devicePixelRatio = 1;
    tester.view.physicalSize = const Size(400, 800);
    addTearDown(tester.view.reset);
    await tester.pumpWidget(
      _app(
        TRSelect<int>(items: _items, searchable: true, presentation: _sheet),
        size: const Size(400, 800),
      ),
    );
    await _open(tester);
    final initialDrawer = tester.getRect(find.byType(TRDrawer));
    final initialSearch = tester.getRect(_search);

    tester.view.physicalSize = const Size(700, 800);
    await tester.pumpAndSettle();

    final resizedDrawer = tester.getRect(find.byType(TRDrawer));
    final resizedSearch = tester.getRect(_search);
    expect(resizedDrawer.height, initialDrawer.height);
    expect(resizedDrawer.width, 700);
    expect(resizedSearch.width, greaterThan(initialSearch.width));
  });

  for (final presentation in <TRSelectPresentation>[_layer, _sheet]) {
    testWidgets(
      'many to one to zero results keep panel and search rects for $presentation',
      (tester) async {
        final size = identical(presentation, _sheet)
            ? const Size(400, 800)
            : const Size(900, 800);
        await tester.pumpWidget(
          _app(
            TRSelect<int>(
              items: _items,
              searchable: true,
              presentation: presentation,
            ),
            size: size,
          ),
        );
        await _open(tester);
        final panel = identical(presentation, _sheet)
            ? find.byType(TRDrawer)
            : _layerSurface;
        final panelRect = tester.getRect(panel);
        final searchRect = tester.getRect(_search);

        await tester.enterText(_search, 'Option 29');
        await tester.pumpAndSettle();
        expect(tester.getRect(panel), panelRect);
        expect(tester.getRect(_search), searchRect);

        await tester.enterText(_search, 'missing');
        await tester.pumpAndSettle();
        expect(tester.getRect(panel), panelRect);
        expect(tester.getRect(_search), searchRect);
      },
    );
  }

  for (final presentation in <TRSelectPresentation>[_intrinsicLayer, _sheet]) {
    testWidgets(
      'type-to-open measures the full list before filtering for $presentation',
      (tester) async {
        final triggerFocus = FocusNode();
        addTearDown(triggerFocus.dispose);
        final size = identical(presentation, _sheet)
            ? const Size(400, 800)
            : const Size(900, 800);
        await tester.pumpWidget(
          _app(
            TRSelect<int>(
              focusNode: triggerFocus,
              items: _items,
              searchable: true,
              presentation: presentation,
            ),
            size: size,
          ),
        );

        await _open(tester);
        final panel = identical(presentation, _sheet)
            ? find.byType(TRDrawer)
            : _layerSurface;
        final fullPanelRect = tester.getRect(panel);
        final fullSearchRect = tester.getRect(_search);
        await tester.sendKeyEvent(LogicalKeyboardKey.escape);
        await tester.pumpAndSettle();

        triggerFocus.requestFocus();
        await tester.pump();
        await tester.sendKeyEvent(LogicalKeyboardKey.digit9, character: '9');
        await tester.pumpAndSettle();

        expect(find.text('Option 29'), findsOneWidget);
        expect(find.text('Option 0'), findsNothing);
        expect(tester.getRect(panel), fullPanelRect);
        expect(tester.getRect(_search), fullSearchRect);
      },
    );
  }

  testWidgets(
    'content-sized layer and search rect stay fixed while filtering',
    (tester) async {
      const presentation = TRSelectPresentation.layer(
        layerSize: TRLayerSize(
          width: TRLayerWidth.content(min: 80, max: 500),
          height: TRLayerHeight.content(max: 360),
        ),
      );
      await tester.pumpWidget(
        _app(
          const TRSelect<int>(
            width: 100,
            items: [
              TRSelectItem(value: 1, label: 'Short'),
              TRSelectItem(
                value: 2,
                label: 'A substantially longer option label that drives width',
              ),
            ],
            searchable: true,
            presentation: presentation,
          ),
        ),
      );
      await _open(tester);
      final panelRect = tester.getRect(_layerSurface);
      final searchRect = tester.getRect(_search);

      await tester.enterText(_search, 'Short');
      await tester.pumpAndSettle();

      expect(tester.getRect(_layerSurface), panelRect);
      expect(tester.getRect(_search), searchRect);
    },
  );

  testWidgets('layer size is forwarded to the anchored host', (tester) async {
    await tester.pumpWidget(
      _app(
        const TRSelect<int>(
          width: 176,
          items: <TRSelectItem<int>>[
            TRSelectItem<int>(value: 0, label: 'Option'),
          ],
          presentation: TRSelectPresentation.layer(
            layerSize: TRLayerSize(
              width: TRLayerWidth.matchAnchor(),
              height: TRLayerHeight.fixed(240),
            ),
          ),
        ),
      ),
    );

    await _open(tester);

    expect(tester.getSize(_layerSurface), const Size(176, 240));
  });

  testWidgets('content width follows option content within named bounds', (
    tester,
  ) async {
    const presentation = TRSelectPresentation.layer(
      layerSize: TRLayerSize(
        width: TRLayerWidth.content(min: 80, max: 400),
        height: TRLayerHeight.fixed(120),
      ),
    );

    await tester.pumpWidget(
      _app(
        const TRSelect<int>(
          width: 100,
          items: [TRSelectItem(value: 1, label: 'One')],
          presentation: presentation,
        ),
      ),
    );
    await _open(tester);
    final shortWidth = tester.getSize(_layerSurface).width;
    await tester.sendKeyEvent(LogicalKeyboardKey.escape);
    await tester.pumpAndSettle();

    await tester.pumpWidget(
      _app(
        const TRSelect<int>(
          width: 100,
          items: [
            TRSelectItem(
              value: 1,
              label: 'A substantially longer option label for sizing',
            ),
          ],
          presentation: presentation,
        ),
      ),
    );
    await _open(tester);
    final longWidth = tester.getSize(_layerSurface).width;

    expect(shortWidth, inInclusiveRange(80, 400));
    expect(longWidth, greaterThan(shortWidth));
    expect(longWidth, lessThanOrEqualTo(400));
  });

  for (final presentation in <TRSelectPresentation>[_layer, _sheet]) {
    testWidgets('controller opens, closes, and toggles $presentation', (
      tester,
    ) async {
      final controller = TRSelectController();
      addTearDown(controller.dispose);
      final isSheet = identical(presentation, _sheet);
      final surface = isSheet ? find.byType(TRDrawer) : _layerSurface;
      await tester.pumpWidget(
        _app(
          TRSelect<int>(
            controller: controller,
            items: _items,
            presentation: presentation,
          ),
          size: isSheet ? const Size(400, 800) : const Size(900, 800),
        ),
      );

      controller.open();
      await tester.pumpAndSettle();
      expect(controller.isOpen, isTrue);
      expect(surface, findsOneWidget);

      controller.close();
      await tester.pumpAndSettle();
      expect(controller.isOpen, isFalse);
      expect(surface, findsNothing);

      controller.toggle();
      await tester.pumpAndSettle();
      expect(controller.isOpen, isTrue);
      expect(surface, findsOneWidget);

      controller.toggle();
      await tester.pumpAndSettle();
      expect(controller.isOpen, isFalse);
      expect(surface, findsNothing);
    });
  }

  testWidgets('sheet controller preserves a reopen requested while closing', (
    tester,
  ) async {
    final controller = TRSelectController();
    addTearDown(controller.dispose);
    var opens = 0;
    var closes = 0;
    await tester.pumpWidget(
      _app(
        TRSelect<int>(
          controller: controller,
          items: _items,
          presentation: _sheet,
          onOpen: () => opens += 1,
          onClose: () => closes += 1,
        ),
        size: const Size(400, 800),
      ),
    );

    controller.open();
    await tester.pumpAndSettle();
    controller.close();
    controller.open();
    await tester.pumpAndSettle();

    expect(controller.isOpen, isTrue);
    expect(find.byType(TRDrawer), findsOneWidget);
    expect(opens, 2);
    expect(closes, 1);
  });

  testWidgets('layer focus leaves the trigger group and returns on close', (
    tester,
  ) async {
    var groupFocused = false;
    final triggerFocus = FocusNode();
    addTearDown(triggerFocus.dispose);
    await tester.pumpWidget(
      _app(
        Focus(
          onFocusChange: (value) => groupFocused = value,
          child: TRSelect<int>(
            focusNode: triggerFocus,
            items: _items,
            searchable: true,
            presentation: _layer,
          ),
        ),
      ),
    );

    triggerFocus.requestFocus();
    await tester.pumpAndSettle();
    expect(groupFocused, isTrue);

    await tester.sendKeyEvent(LogicalKeyboardKey.enter);
    await tester.pumpAndSettle();
    expect(tester.widget<TRTextField>(_search).focusNode!.hasFocus, isTrue);
    expect(groupFocused, isFalse);

    await tester.sendKeyEvent(LogicalKeyboardKey.escape);
    await tester.pumpAndSettle();
    expect(triggerFocus.hasFocus, isTrue);
    expect(groupFocused, isTrue);
  });

  for (final presentation in <TRSelectPresentation>[_layer, _sheet]) {
    testWidgets('Arrow, Enter, and Escape work across $presentation', (
      tester,
    ) async {
      int? selected;
      final triggerFocus = FocusNode();
      addTearDown(triggerFocus.dispose);
      final size = identical(presentation, _sheet)
          ? const Size(400, 800)
          : const Size(900, 800);
      await tester.pumpWidget(
        _app(
          TRSelect<int>(
            focusNode: triggerFocus,
            items: _items,
            searchable: true,
            presentation: presentation,
            onValueChange: (value) => selected = value,
          ),
          size: size,
        ),
      );

      await _open(tester);
      await tester.sendKeyEvent(LogicalKeyboardKey.arrowDown);
      await tester.sendKeyEvent(LogicalKeyboardKey.arrowDown);
      await tester.sendKeyEvent(LogicalKeyboardKey.enter);
      await tester.pumpAndSettle();

      expect(selected, 1);
      expect(triggerFocus.hasFocus, isTrue);

      await _open(tester);
      await tester.sendKeyEvent(LogicalKeyboardKey.escape);
      await tester.pumpAndSettle();

      expect(triggerFocus.hasFocus, isTrue);
      expect(find.text('Option 29'), findsNothing);
    });
  }

  for (final presentation in <TRSelectPresentation>[_layer, _sheet]) {
    testWidgets('Arrow navigation reveals long-list rows for $presentation', (
      tester,
    ) async {
      final size = identical(presentation, _sheet)
          ? const Size(400, 800)
          : const Size(900, 800);
      await tester.pumpWidget(
        _app(
          TRSelect<int>(
            items: _items,
            searchable: true,
            presentation: presentation,
          ),
          size: size,
        ),
      );
      await _open(tester);
      final position = _onlyOptionsPosition(tester);

      for (var index = 0; index < 20; index += 1) {
        await tester.sendKeyEvent(LogicalKeyboardKey.arrowDown);
        await tester.pump();
      }

      final option = tester.widget<MenuItemButton>(
        find.widgetWithText(MenuItemButton, 'Option 19'),
      );
      expect(option.focusNode?.hasFocus, isTrue);
      expect(position.pixels, greaterThan(0));
    });
  }

  testWidgets('bottom-start layer placement follows RTL anchor direction', (
    tester,
  ) async {
    await tester.pumpWidget(
      _app(
        const Directionality(
          textDirection: TextDirection.rtl,
          child: SizedBox(
            width: 600,
            child: Align(
              alignment: AlignmentDirectional.topStart,
              child: TRSelect<int>(
                width: 176,
                items: [TRSelectItem(value: 1, label: 'One')],
                presentation: TRSelectPresentation.layer(
                  layerSize: TRLayerSize(width: TRLayerWidth.fixed(176)),
                ),
              ),
            ),
          ),
        ),
      ),
    );
    final triggerRect = tester.getRect(_trigger);
    await _open(tester);

    expect(tester.getRect(_layerSurface).right, triggerRect.right);
  });
}
