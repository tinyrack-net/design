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

void main() {
  test('resolves every width and height policy inside the safe viewport', () {
    const anchor = Size(180, 40);
    const viewport = Size(300, 200);

    expect(
      const TRLayerSize(
        width: TRLayerWidth.content(min: 80, max: 220),
        height: TRLayerHeight.content(min: 60, max: 160),
      ).constraintsFor(anchorSize: anchor, viewportSize: viewport),
      const BoxConstraints(
        minWidth: 80,
        maxWidth: 220,
        minHeight: 60,
        maxHeight: 160,
      ),
    );
    expect(
      const TRLayerSize(
        width: TRLayerWidth.fixed(240),
        height: TRLayerHeight.fixed(120),
      ).constraintsFor(anchorSize: anchor, viewportSize: viewport),
      const BoxConstraints.tightFor(width: 240, height: 120),
    );
    expect(
      const TRLayerSize(
        width: TRLayerWidth.matchAnchor(min: 200, max: 260),
      ).constraintsFor(anchorSize: anchor, viewportSize: viewport),
      const BoxConstraints(minWidth: 200, maxWidth: 200, maxHeight: 200),
    );
    expect(
      const TRLayerSize(
        width: TRLayerWidth.atLeastAnchor(max: 140),
      ).constraintsFor(anchorSize: anchor, viewportSize: viewport),
      const BoxConstraints(minWidth: 180, maxWidth: 180, maxHeight: 200),
    );
    expect(
      const TRLayerSize(
        width: TRLayerWidth.fixed(500),
        height: TRLayerHeight.fixed(400),
      ).constraintsFor(anchorSize: anchor, viewportSize: viewport),
      const BoxConstraints.tightFor(width: 300, height: 200),
    );
  });

  testWidgets('anchored host applies whole-layer size and viewport clamp', (
    tester,
  ) async {
    await tester.binding.setSurfaceSize(const Size(320, 240));
    addTearDown(() => tester.binding.setSurfaceSize(null));
    final controller = TRAnchoredLayerController(open: true);
    addTearDown(controller.dispose);
    await tester.pumpWidget(
      _app(
        SizedBox(
          width: 180,
          child: TRAnchoredLayer(
            controller: controller,
            size: const TRLayerSize(
              width: TRLayerWidth.matchAnchor(),
              height: TRLayerHeight.fixed(500),
            ),
            triggerBuilder: (_, _, _, _, _) => const SizedBox(height: 40),
            layerBuilder: (_) => const TRLayerSurface(
              kind: TRLayerBoundaryKind.popover,
              child: Text('Layer'),
            ),
          ),
        ),
        size: const Size(320, 240),
      ),
    );
    await tester.pumpAndSettle();

    final layer = find.byType(TRLayerSurface);
    expect(
      tester.getSize(layer),
      const Size(180, 240 - TRMeasurements.overlayInlineInset),
    );
  });

  testWidgets('focused overlay is outside the trigger focus subtree', (
    tester,
  ) async {
    final controller = TRAnchoredLayerController();
    final triggerFocus = FocusNode();
    addTearDown(controller.dispose);
    addTearDown(triggerFocus.dispose);
    var groupFocused = false;
    await tester.pumpWidget(
      _app(
        Focus(
          onFocusChange: (focused) => groupFocused = focused,
          child: TRAnchoredLayer(
            controller: controller,
            triggerBuilder: (_, _, _, _, _) => TextButton(
              focusNode: triggerFocus,
              onPressed: controller.open,
              child: const Text('Open'),
            ),
            layerBuilder: (_) => const TRLayerSurface(child: Text('Layer')),
          ),
        ),
      ),
    );

    triggerFocus.requestFocus();
    await tester.pump();
    expect(groupFocused, isTrue);
    controller.open();
    await tester.pumpAndSettle();
    expect(groupFocused, isFalse);

    controller.close();
    await tester.pumpAndSettle();
    expect(triggerFocus.hasFocus, isTrue);
    expect(groupFocused, isTrue);
  });
}
