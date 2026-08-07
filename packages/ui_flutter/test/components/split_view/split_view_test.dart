import 'package:flutter/material.dart';
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

    expect(tester.getSize(find.byKey(const ValueKey('first'))).width, 148);
    expect(tester.getSize(find.byKey(const ValueKey('second'))).width, 444);
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
