import 'package:material_ui/material_ui.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:tinyrack_ui/tinyrack_ui.dart';

Widget _app(Widget child, {TextDirection direction = TextDirection.ltr}) =>
    MaterialApp(
      theme: TinyrackTheme.light(),
      home: Directionality(
        textDirection: direction,
        child: Scaffold(body: SizedBox(width: 600, height: 400, child: child)),
      ),
    );

void main() {
  testWidgets('lays out two panes from a controlled ratio', (tester) async {
    await tester.pumpWidget(
      _app(
        TRSplitView(
          axis: Axis.horizontal,
          ratio: 0.25,
          minFirstExtent: 0,
          minSecondExtent: 0,
          separatorLabel: 'Resize panes',
          onRatioChanged: (_) {},
          first: const ColoredBox(
            key: ValueKey<String>('first'),
            color: Colors.red,
          ),
          second: const ColoredBox(
            key: ValueKey<String>('second'),
            color: Colors.blue,
          ),
        ),
      ),
    );

    final available = 600 - TRControlMetrics.borderWidth;
    expect(
      tester.getSize(find.byKey(const ValueKey('first'))).width,
      available * 0.25,
    );
    expect(
      tester.getSize(find.byKey(const ValueKey('second'))).width,
      available * 0.75,
    );
    expect(
      tester
          .getSize(
            find.byKey(const ValueKey<String>('tr-split-view-separator')),
          )
          .width,
      TRSpacing.small,
    );
    final separator = find.byKey(
      const ValueKey<String>('tr-split-view-separator'),
    );
    final divider = find.descendant(
      of: separator,
      matching: find.byType(ColoredBox),
    );
    expect(tester.getSize(divider).width, TRControlMetrics.borderWidth);
    expect(tester.getSize(divider).height, 400);
    expect(
      tester.getRect(divider).left,
      tester.getRect(find.byKey(const ValueKey('first'))).right,
    );
    expect(
      tester.widget<ColoredBox>(divider).color,
      Theme.of(tester.element(divider)).extension<TinyrackThemeData>()!.border,
    );
  });

  testWidgets('draws a one-border divider between vertical panes', (
    tester,
  ) async {
    await tester.pumpWidget(
      _app(
        TRSplitView(
          axis: Axis.vertical,
          ratio: 0.5,
          minFirstExtent: 0,
          minSecondExtent: 0,
          separatorLabel: 'Resize panes',
          onRatioChanged: (_) {},
          first: const SizedBox.expand(key: ValueKey<String>('first')),
          second: const SizedBox.expand(key: ValueKey<String>('second')),
        ),
      ),
    );

    final available = 400 - TRControlMetrics.borderWidth;
    expect(
      tester.getSize(find.byKey(const ValueKey('first'))).height,
      available * 0.5,
    );
    expect(
      tester.getSize(find.byKey(const ValueKey('second'))).height,
      available * 0.5,
    );
    expect(
      tester
          .getSize(
            find.byKey(const ValueKey<String>('tr-split-view-separator')),
          )
          .height,
      TRSpacing.small,
    );
    final separator = find.byKey(
      const ValueKey<String>('tr-split-view-separator'),
    );
    final divider = find.descendant(
      of: separator,
      matching: find.byType(ColoredBox),
    );
    expect(tester.getSize(divider).height, TRControlMetrics.borderWidth);
    expect(tester.getSize(divider).width, 600);
    expect(
      tester.getRect(divider).top,
      tester.getRect(find.byKey(const ValueKey('first'))).bottom,
    );
  });

  testWidgets('keeps the divider attached to the first pane in RTL', (
    tester,
  ) async {
    await tester.pumpWidget(
      _app(
        TRSplitView(
          ratio: 0.25,
          minFirstExtent: 0,
          minSecondExtent: 0,
          separatorLabel: 'Resize panes',
          onRatioChanged: (_) {},
          first: const SizedBox.expand(key: ValueKey<String>('first')),
          second: const SizedBox.expand(key: ValueKey<String>('second')),
        ),
        direction: TextDirection.rtl,
      ),
    );

    final divider = find.descendant(
      of: find.byKey(const ValueKey<String>('tr-split-view-separator')),
      matching: find.byType(ColoredBox),
    );
    expect(
      tester.getRect(divider).right,
      tester.getRect(find.byKey(const ValueKey('first'))).left,
    );
  });

  testWidgets('reports pointer changes and the final ratio', (tester) async {
    final changes = <double>[];
    final ends = <double>[];
    await tester.pumpWidget(
      _app(
        TRSplitView(
          axis: Axis.horizontal,
          ratio: 0.5,
          minFirstExtent: 0,
          minSecondExtent: 0,
          separatorLabel: 'Resize panes',
          onRatioChanged: changes.add,
          onRatioChangeEnd: ends.add,
          first: const SizedBox.expand(),
          second: const SizedBox.expand(),
        ),
      ),
    );

    await tester.drag(
      find.byKey(const ValueKey<String>('tr-split-view-separator')),
      const Offset(60, 0),
    );
    await tester.pump();

    expect(changes.single, greaterThan(0.5));
    expect(ends.single, changes.single);
  });

  testWidgets('accumulates every drag update delivered within one frame', (
    tester,
  ) async {
    final changes = <double>[];
    final ends = <double>[];
    await tester.pumpWidget(
      _app(
        TRSplitView(
          axis: Axis.horizontal,
          ratio: 0.5,
          minFirstExtent: 0,
          minSecondExtent: 0,
          separatorLabel: 'Resize panes',
          onRatioChanged: changes.add,
          onRatioChangeEnd: ends.add,
          first: const SizedBox.expand(),
          second: const SizedBox.expand(),
        ),
      ),
    );

    final available = 600 - TRControlMetrics.borderWidth;
    final gesture = await tester.startGesture(
      tester.getCenter(
        find.byKey(const ValueKey<String>('tr-split-view-separator')),
      ),
    );
    // The first movement is consumed by drag acceptance and reports nothing.
    await gesture.moveBy(const Offset(60, 0));
    await gesture.moveBy(const Offset(20, 0));
    final afterFirst = changes.last;
    // A fast pointer delivers several move events before the next frame can
    // rebuild; every delta must land, not only the last one.
    await gesture.moveBy(const Offset(20, 0));
    await gesture.moveBy(const Offset(20, 0));
    await gesture.moveBy(const Offset(20, 0));
    await gesture.up();
    await tester.pump();

    expect(changes.last, closeTo(afterFirst + 60 / available, 1e-9));
    expect(ends.single, changes.last);
  });

  testWidgets('holds a pane at its minimum until the pointer travels back', (
    tester,
  ) async {
    final changes = <double>[];
    await tester.pumpWidget(
      _app(
        TRSplitView(
          axis: Axis.horizontal,
          ratio: 0.5,
          separatorLabel: 'Resize panes',
          onRatioChanged: changes.add,
          first: const SizedBox.expand(),
          second: const SizedBox.expand(),
        ),
      ),
    );

    final available = 600 - TRControlMetrics.borderWidth;
    final minRatio = TRMeasurements.splitPaneMinExtent / available;
    final gesture = await tester.startGesture(
      tester.getCenter(
        find.byKey(const ValueKey<String>('tr-split-view-separator')),
      ),
    );
    // The first movement is consumed by drag acceptance and reports nothing.
    await gesture.moveBy(const Offset(-30, 0));
    await gesture.moveBy(const Offset(-270, 0));
    await tester.pump();
    expect(changes.last, closeTo(minRatio, 1e-9));

    // The pointer is still far past the bound, so a partial return must not
    // move the divider yet.
    await gesture.moveBy(const Offset(50, 0));
    await tester.pump();
    expect(changes.last, closeTo(minRatio, 1e-9));

    await gesture.up();
    await tester.pump();
  });

  testWidgets('supports keyboard and accessible adjustments', (tester) async {
    final changes = <double>[];
    final semantics = tester.ensureSemantics();
    await tester.pumpWidget(
      _app(
        TRSplitView(
          axis: Axis.horizontal,
          ratio: 0.5,
          minFirstExtent: 0,
          minSecondExtent: 0,
          separatorLabel: 'Resize panes',
          onRatioChanged: changes.add,
          first: const SizedBox.expand(),
          second: const SizedBox.expand(),
        ),
      ),
    );

    await tester.tap(
      find.byKey(const ValueKey<String>('tr-split-view-separator')),
    );
    await tester.sendKeyEvent(LogicalKeyboardKey.arrowRight);
    expect(changes.single, greaterThan(0.5));
    expect(find.bySemanticsLabel('Resize panes'), findsOneWidget);
    semantics.dispose();
  });
}
