import 'package:flutter/rendering.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:material_ui/material_ui.dart';
import 'package:tinyrack_ui/tinyrack_ui.dart';

/// A caller that wants a fixed popup width and nothing else.
///
/// Sizing one axis must not silently unbound the other: the option list still
/// has to stop at the Select's own cap and scroll past it.
const _fixedWidth = TRSelectPresentation.layer(
  width: TRLayerWidth.fixed(TRMeasurements.overlayWidthSm),
);

final _manyItems = <TRSelectItem<int>>[
  for (var index = 0; index < 40; index += 1)
    TRSelectItem<int>(value: index, label: 'Option $index'),
];

const _longLabel =
    'release/2026-08-20-a-very-long-branch-name-that-cannot-fit-the-popup';

Finder get _trigger => find.descendant(
  of: find.byType(TRSelect<int>),
  matching: find.byType(TextButton),
);

Finder get _layerSurface => find.byWidgetPredicate(
  (widget) => widget.runtimeType.toString() == 'TRLayerSurface',
);

Finder get _verticalScrollable => find.byWidgetPredicate(
  (widget) =>
      widget is Scrollable &&
      (widget.axisDirection == AxisDirection.down ||
          widget.axisDirection == AxisDirection.up),
);

Widget _app(Widget child, {Size size = const Size(900, 900)}) => MaterialApp(
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

void main() {
  testWidgets('a width-only layer keeps the default height cap', (
    tester,
  ) async {
    await tester.pumpWidget(
      _app(
        TRSelect<int>(
          items: _manyItems,
          searchable: true,
          presentation: _fixedWidth,
        ),
      ),
    );

    await _open(tester);

    final surface = tester.getRect(_layerSurface);
    expect(surface.width, TRMeasurements.overlayWidthSm);
    // The viewport is 900 tall and the options would happily fill it, so an
    // unbounded height would show here as a surface far past the cap.
    expect(surface.height, lessThanOrEqualTo(TRMeasurements.measureXl));
    expect(
      tester
          .state<ScrollableState>(_verticalScrollable)
          .position
          .maxScrollExtent,
      greaterThan(0),
    );
  });

  testWidgets('the default layer presentation caps its own height', (
    tester,
  ) async {
    await tester.pumpWidget(
      _app(TRSelect<int>(items: _manyItems, searchable: true)),
    );

    await _open(tester);

    expect(
      tester.getRect(_layerSurface).height,
      lessThanOrEqualTo(TRMeasurements.measureXl),
    );
  });

  testWidgets('an option label without a description ellipsises', (
    tester,
  ) async {
    await tester.pumpWidget(
      _app(
        TRSelect<int>(
          items: <TRSelectItem<int>>[
            const TRSelectItem<int>(value: 0, label: _longLabel),
            const TRSelectItem<int>(value: 1, label: 'main'),
          ],
          searchable: true,
          presentation: _fixedWidth,
        ),
      ),
    );

    await _open(tester);

    final label = tester.widget<Text>(
      find.descendant(of: _layerSurface, matching: find.text(_longLabel)),
    );
    expect(label.overflow, TextOverflow.ellipsis);
    expect(label.maxLines, 1);

    // The row hard-caps its own height, so a wrapped label overflows it.
    // Truncation is the proof that the label stayed inside the row.
    final rendered = tester.renderObject<RenderParagraph>(
      find.descendant(of: _layerSurface, matching: find.text(_longLabel)),
    );
    expect(
      rendered.size.width,
      lessThanOrEqualTo(TRMeasurements.overlayWidthSm),
    );
    expect(
      rendered.didExceedMaxLines,
      isTrue,
      reason: 'a long option label must ellipsise rather than wrap',
    );
  });
}
