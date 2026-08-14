import 'package:flutter_test/flutter_test.dart';
import 'package:material_ui/material_ui.dart';
import 'package:tinyrack_ui/src/internal/layer.dart';
import 'package:tinyrack_ui/tinyrack_ui.dart';

const _contentSize = TRLayerSize(
  width: TRLayerWidth.content(min: 40, max: 400),
  height: TRLayerHeight.fixed(96),
);

Widget _app(Widget child) => MaterialApp(
  theme: TinyrackTheme.light(),
  home: MediaQuery(
    data: const MediaQueryData(size: Size(800, 600), disableAnimations: true),
    child: Scaffold(
      body: Align(alignment: Alignment.topLeft, child: child),
    ),
  ),
);

Finder _boundary(TRLayerBoundaryKind kind) => find.byWidgetPredicate(
  (widget) => widget is TRLayerBoundary && widget.kind == kind,
);

void main() {
  testWidgets('popover content width follows short and long content', (
    tester,
  ) async {
    await tester.pumpWidget(
      _app(
        const TRPopover.controlled(
          open: true,
          layerSize: _contentSize,
          trigger: SizedBox(width: 80, height: 32),
          content: Text('Short'),
        ),
      ),
    );
    await tester.pumpAndSettle();
    final shortWidth = tester
        .getSize(_boundary(TRLayerBoundaryKind.popover))
        .width;

    await tester.pumpWidget(
      _app(
        const TRPopover.controlled(
          open: true,
          layerSize: _contentSize,
          trigger: SizedBox(width: 80, height: 32),
          content: Text('A substantially longer popover value'),
        ),
      ),
    );
    await tester.pumpAndSettle();
    final longWidth = tester
        .getSize(_boundary(TRLayerBoundaryKind.popover))
        .width;

    expect(shortWidth, lessThan(400));
    expect(longWidth, greaterThan(shortWidth));
  });

  testWidgets('preview and navigation content widths do not fill their max', (
    tester,
  ) async {
    await tester.pumpWidget(
      _app(
        const TRPreviewCard.controlled(
          open: true,
          openDelay: Duration.zero,
          closeDelay: Duration.zero,
          layerSize: _contentSize,
          trigger: SizedBox(width: 80, height: 32),
          content: Text('Short'),
        ),
      ),
    );
    await tester.pumpAndSettle();
    expect(
      tester.getSize(_boundary(TRLayerBoundaryKind.previewCard)).width,
      lessThan(400),
    );

    await tester.pumpWidget(
      _app(
        const TRNavigationMenu<String>.controlled(
          value: 'one',
          layerSize: _contentSize,
          items: [
            TRNavigationMenuItem(
              value: 'one',
              trigger: Text('One'),
              content: Text('Short'),
            ),
          ],
        ),
      ),
    );
    await tester.pumpAndSettle();
    expect(
      tester.getSize(_boundary(TRLayerBoundaryKind.navigationMenu)).width,
      lessThan(400),
    );
  });

  testWidgets('menu and inline suggestions do not fill content width max', (
    tester,
  ) async {
    await tester.pumpWidget(
      _app(
        TRMenu(
          layerSize: _contentSize,
          trigger: const Text('Menu'),
          menuChildren: [
            TRMenuItem(onPressed: _noop, child: const Text('Short')),
          ],
        ),
      ),
    );
    await tester.tap(find.text('Menu'));
    await tester.pumpAndSettle();
    expect(
      tester.getSize(_boundary(TRLayerBoundaryKind.menu)).width,
      lessThan(400),
    );

    await tester.pumpWidget(
      _app(
        const SizedBox(
          width: 80,
          child: TRInlineSuggestions<String>(
            open: true,
            layerSize: _contentSize,
            items: [TRInlineSuggestionItem(value: 'one', label: 'Short')],
            onSelected: _ignoreSuggestion,
            child: SizedBox(height: 32),
          ),
        ),
      ),
    );
    await tester.pumpAndSettle();
    final shortWidth = tester
        .getSize(_boundary(TRLayerBoundaryKind.inlineSuggestions))
        .width;
    expect(shortWidth, lessThan(400));

    await tester.pumpWidget(
      _app(
        const SizedBox(
          width: 80,
          child: TRInlineSuggestions<String>(
            open: true,
            layerSize: _contentSize,
            items: [
              TRInlineSuggestionItem(
                value: 'one',
                label: 'A substantially longer inline suggestion value',
              ),
            ],
            onSelected: _ignoreSuggestion,
            child: SizedBox(height: 32),
          ),
        ),
      ),
    );
    await tester.pumpAndSettle();
    expect(
      tester.getSize(_boundary(TRLayerBoundaryKind.inlineSuggestions)).width,
      greaterThan(shortWidth),
    );
  });
}

void _noop() {}

void _ignoreSuggestion(TRInlineSuggestionItem<String> _) {}
