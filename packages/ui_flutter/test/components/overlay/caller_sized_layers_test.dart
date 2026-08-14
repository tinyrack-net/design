import 'package:flutter_test/flutter_test.dart';
import 'package:material_ui/material_ui.dart';
import 'package:tinyrack_ui/src/internal/layer.dart';
import 'package:tinyrack_ui/tinyrack_ui.dart';

Widget _app(Widget child, {Size size = const Size(800, 600)}) => MaterialApp(
  theme: TinyrackTheme.light(),
  home: MediaQuery(
    data: MediaQueryData(size: size, disableAnimations: true),
    child: Scaffold(
      body: Align(alignment: Alignment.topLeft, child: child),
    ),
  ),
);

Finder _boundary(TRLayerBoundaryKind kind) => find.byWidgetPredicate(
  (widget) => widget is TRLayerBoundary && widget.kind == kind,
);

const _fixed = TRLayerSize(
  width: TRLayerWidth.fixed(240),
  height: TRLayerHeight.fixed(120),
);

void main() {
  testWidgets('popover and preview card apply shared whole-layer sizing', (
    tester,
  ) async {
    final popover = TRPopoverController(open: true);
    addTearDown(popover.dispose);
    await tester.pumpWidget(
      _app(
        TRPopover(
          controller: popover,
          layerSize: _fixed,
          trigger: const SizedBox(width: 80, height: 32),
          content: const Text('Popover'),
        ),
      ),
    );
    await tester.pumpAndSettle();
    expect(
      tester.getSize(_boundary(TRLayerBoundaryKind.popover)),
      const Size(240, 120),
    );

    await tester.pumpWidget(
      _app(
        const TRPreviewCard.controlled(
          open: true,
          openDelay: Duration.zero,
          closeDelay: Duration.zero,
          layerSize: _fixed,
          trigger: SizedBox(width: 80, height: 32),
          content: Text('Preview'),
        ),
      ),
    );
    await tester.pumpAndSettle();
    expect(
      tester.getSize(_boundary(TRLayerBoundaryKind.previewCard)),
      const Size(240, 120),
    );
  });

  testWidgets(
    'navigation and inline suggestions use the shared size contract',
    (tester) async {
      await tester.pumpWidget(
        _app(
          const TRNavigationMenu<String>.controlled(
            value: 'one',
            layerSize: _fixed,
            items: [
              TRNavigationMenuItem(
                value: 'one',
                trigger: Text('One'),
                content: Text('Navigation'),
              ),
            ],
          ),
        ),
      );
      await tester.pumpAndSettle();
      expect(
        tester.getSize(_boundary(TRLayerBoundaryKind.navigationMenu)),
        const Size(240, 120),
      );

      await tester.pumpWidget(
        _app(
          const SizedBox(
            width: 180,
            child: TRInlineSuggestions<String>(
              open: true,
              layerSize: TRLayerSize(
                width: TRLayerWidth.matchAnchor(),
                height: TRLayerHeight.fixed(120),
              ),
              items: [TRInlineSuggestionItem(value: 'one', label: 'One')],
              onSelected: _ignoreSuggestion,
              child: SizedBox(height: 32),
            ),
          ),
        ),
      );
      await tester.pumpAndSettle();
      expect(
        tester.getSize(_boundary(TRLayerBoundaryKind.inlineSuggestions)),
        const Size(180, 120),
      );
    },
  );

  testWidgets(
    'menu, autocomplete, and combobox accept layer sizing independently',
    (tester) async {
      await tester.pumpWidget(
        _app(
          TRMenu(
            layerSize: _fixed,
            trigger: const Text('Menu'),
            menuChildren: [
              TRMenuItem(onPressed: _noop, child: const Text('Item')),
            ],
          ),
        ),
      );
      await tester.tap(find.text('Menu'));
      await tester.pumpAndSettle();
      expect(
        tester.getSize(_boundary(TRLayerBoundaryKind.menu)),
        const Size(240, 120),
      );

      await tester.pumpWidget(
        _app(
          TRAutocomplete<String>(
            layerSize: _fixed,
            items: const [TRAutocompleteItem(value: 'one', label: 'One')],
          ),
        ),
      );
      await tester.tap(find.byType(TextField));
      await tester.pumpAndSettle();
      expect(
        tester.getSize(_boundary(TRLayerBoundaryKind.autocomplete)),
        const Size(240, 120),
      );

      await tester.pumpWidget(
        _app(
          TRCombobox<String>(
            layerSize: _fixed,
            items: const [TRComboboxItem(value: 'one', label: 'One')],
          ),
        ),
      );
      await tester.tap(find.byType(TextField));
      await tester.pumpAndSettle();
      expect(
        tester.getSize(_boundary(TRLayerBoundaryKind.combobox)),
        const Size(240, 120),
      );
    },
  );

  testWidgets('submenu applies its own shared whole-layer sizing', (
    tester,
  ) async {
    await tester.pumpWidget(
      _app(
        TRMenu(
          trigger: const Text('Menu'),
          menuChildren: [
            TRMenuSubmenu(
              layerSize: const TRLayerSize(
                width: TRLayerWidth.fixed(210),
                height: TRLayerHeight.fixed(96),
              ),
              menuChildren: [
                TRMenuItem(onPressed: _noop, child: const Text('Nested item')),
              ],
              child: const Text('More'),
            ),
          ],
        ),
      ),
    );
    await tester.tap(find.text('Menu'));
    await tester.pumpAndSettle();
    await tester.tap(find.text('More'));
    await tester.pumpAndSettle();

    final layerSizes = _boundary(TRLayerBoundaryKind.menu).evaluate().map(
      (element) => tester.getSize(find.byWidget(element.widget)),
    );
    expect(layerSizes, contains(const Size(210, 96)));
  });

  testWidgets('menu fixed height is clamped above the software keyboard', (
    tester,
  ) async {
    tester.view.devicePixelRatio = 1;
    tester.view.physicalSize = const Size(400, 600);
    tester.view.viewInsets = const FakeViewPadding(bottom: 200);
    addTearDown(tester.view.reset);
    await tester.pumpWidget(
      _app(
        TRMenu(
          layerSize: const TRLayerSize(
            width: TRLayerWidth.fixed(240),
            height: TRLayerHeight.fixed(500),
          ),
          trigger: const Text('Menu'),
          menuChildren: [
            TRMenuItem(onPressed: _noop, child: const Text('Item')),
          ],
        ),
        size: const Size(400, 600),
      ),
    );
    await tester.tap(find.text('Menu'));
    await tester.pumpAndSettle();

    expect(
      tester.getSize(_boundary(TRLayerBoundaryKind.menu)).height,
      600 - 200 - TRMeasurements.overlayInlineInset,
    );
  });

  testWidgets(
    'autocomplete and combobox match their constrained rendered anchors',
    (tester) async {
      await tester.pumpWidget(
        _app(
          SizedBox(
            width: 180,
            child: TRAutocomplete<String>(
              items: const [TRAutocompleteItem(value: 'one', label: 'One')],
            ),
          ),
        ),
      );
      await tester.tap(find.byType(TextField));
      await tester.pumpAndSettle();
      expect(
        tester.getSize(_boundary(TRLayerBoundaryKind.autocomplete)).width,
        180,
      );

      await tester.pumpWidget(
        _app(
          SizedBox(
            width: 180,
            child: TRCombobox<String>(
              items: const [TRComboboxItem(value: 'one', label: 'One')],
            ),
          ),
        ),
      );
      await tester.tap(find.byType(TextField));
      await tester.pumpAndSettle();
      expect(
        tester.getSize(_boundary(TRLayerBoundaryKind.combobox)).width,
        180,
      );
    },
  );

  testWidgets('fixed layers can outgrow constrained autocomplete inputs', (
    tester,
  ) async {
    await tester.pumpWidget(
      _app(
        SizedBox(
          width: 180,
          child: TRAutocomplete<String>(
            layerSize: _fixed,
            items: const [TRAutocompleteItem(value: 'one', label: 'One')],
          ),
        ),
      ),
    );
    await tester.tap(find.byType(TextField));
    await tester.pumpAndSettle();

    expect(
      tester.getSize(_boundary(TRLayerBoundaryKind.autocomplete)),
      const Size(240, 120),
    );
  });

  testWidgets('fixed layers can outgrow constrained combobox inputs', (
    tester,
  ) async {
    await tester.pumpWidget(
      _app(
        SizedBox(
          width: 180,
          child: TRCombobox<String>(
            layerSize: _fixed,
            items: const [TRComboboxItem(value: 'one', label: 'One')],
          ),
        ),
      ),
    );
    await tester.tap(find.byType(TextField));
    await tester.pumpAndSettle();

    expect(
      tester.getSize(_boundary(TRLayerBoundaryKind.combobox)),
      const Size(240, 120),
    );
  });

  testWidgets('autocomplete content width follows its option labels', (
    tester,
  ) async {
    const contentSize = TRLayerSize(
      width: TRLayerWidth.content(min: 80, max: 400),
      height: TRLayerHeight.fixed(120),
    );
    await tester.pumpWidget(
      _app(
        TRAutocomplete<String>(
          key: ValueKey('short-autocomplete'),
          layerSize: contentSize,
          items: [TRAutocompleteItem(value: 'one', label: 'One')],
        ),
      ),
    );
    await tester.tap(find.byType(TextField));
    await tester.pumpAndSettle();
    final shortWidth = tester
        .getSize(_boundary(TRLayerBoundaryKind.autocomplete))
        .width;

    await tester.pumpWidget(
      _app(
        TRAutocomplete<String>(
          key: ValueKey('long-autocomplete'),
          layerSize: contentSize,
          items: [
            TRAutocompleteItem(
              value: 'long',
              label: 'Long autocomplete option',
            ),
          ],
        ),
      ),
    );
    await tester.tap(find.byType(TextField));
    await tester.pumpAndSettle();
    final longWidth = tester
        .getSize(_boundary(TRLayerBoundaryKind.autocomplete))
        .width;

    expect(shortWidth, inInclusiveRange(80, 400));
    expect(longWidth, greaterThan(shortWidth));
    expect(longWidth, lessThanOrEqualTo(400));
  });

  testWidgets('combobox content width follows its option labels', (
    tester,
  ) async {
    const contentSize = TRLayerSize(
      width: TRLayerWidth.content(min: 80, max: 400),
      height: TRLayerHeight.fixed(120),
    );
    await tester.pumpWidget(
      _app(
        TRCombobox<String>(
          key: ValueKey('short-combobox'),
          layerSize: contentSize,
          items: [TRComboboxItem(value: 'one', label: 'One')],
        ),
      ),
    );
    await tester.tap(find.byType(TextField));
    await tester.pumpAndSettle();
    final shortWidth = tester
        .getSize(_boundary(TRLayerBoundaryKind.combobox))
        .width;

    await tester.pumpWidget(
      _app(
        TRCombobox<String>(
          key: ValueKey('long-combobox'),
          layerSize: contentSize,
          items: [TRComboboxItem(value: 'long', label: 'Long combobox option')],
        ),
      ),
    );
    await tester.tap(find.byType(TextField));
    await tester.pumpAndSettle();
    final longWidth = tester
        .getSize(_boundary(TRLayerBoundaryKind.combobox))
        .width;

    expect(shortWidth, inInclusiveRange(80, 400));
    expect(longWidth, greaterThan(shortWidth));
    expect(longWidth, lessThanOrEqualTo(400));
  });
}

void _noop() {}

void _ignoreSuggestion(TRInlineSuggestionItem<String> _) {}
