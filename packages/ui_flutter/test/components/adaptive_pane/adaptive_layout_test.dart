import 'package:flutter_test/flutter_test.dart';
import 'package:material_ui/material_ui.dart';
import 'package:tinyrack_ui/tinyrack_ui.dart';

void main() {
  test('adaptive width classes follow the canonical window boundaries', () {
    expect(TRAdaptiveWidthClass.fromWidth(599), TRAdaptiveWidthClass.compact);
    expect(TRAdaptiveWidthClass.fromWidth(600), TRAdaptiveWidthClass.medium);
    expect(TRAdaptiveWidthClass.fromWidth(839), TRAdaptiveWidthClass.medium);
    expect(TRAdaptiveWidthClass.fromWidth(840), TRAdaptiveWidthClass.expanded);
    expect(TRAdaptiveWidthClass.fromWidth(1199), TRAdaptiveWidthClass.expanded);
    expect(TRAdaptiveWidthClass.fromWidth(1200), TRAdaptiveWidthClass.large);
    expect(TRAdaptiveWidthClass.fromWidth(1599), TRAdaptiveWidthClass.large);
    expect(
      TRAdaptiveWidthClass.fromWidth(1600),
      TRAdaptiveWidthClass.extraLarge,
    );
  });

  for (final testCase in <({double width, int panes})>[
    (width: 599, panes: 1),
    (width: 600, panes: 2),
    (width: 1199, panes: 2),
    (width: 1200, panes: 3),
    (width: 1600, panes: 3),
  ]) {
    testWidgets('${testCase.width}px composes ${testCase.panes} pane(s)', (
      tester,
    ) async {
      await _pumpLayout(tester, width: testCase.width);

      expect(find.byType(TRAdaptivePane), findsNWidgets(testCase.panes));
      expect(find.textContaining('Content:'), findsOneWidget);
      expect(
        find.text('Navigation'),
        testCase.panes == 1 ? findsNothing : findsOneWidget,
      );
      expect(
        find.text('Collection'),
        testCase.panes == 3 ? findsOneWidget : findsNothing,
      );
    });
  }

  testWidgets('nested layout uses the full viewport width class', (
    tester,
  ) async {
    await _pumpLayout(tester, width: 1200);

    expect(
      find.text('Content:large'),
      findsOneWidget,
      reason: 'the content pane is narrower than the 1200px viewport',
    );
    expect(find.text('Navigation'), findsOneWidget);
    expect(find.text('Collection'), findsOneWidget);
    expect(find.byType(TRSeparator), findsNWidgets(2));
  });

  testWidgets('layout widths and separators use caller tokens', (tester) async {
    await _pumpLayout(
      tester,
      width: 1200,
      navigationWidth: TRMeasurements.measureSm,
      collectionWidth: TRMeasurements.measureMd,
    );

    expect(
      tester.getRect(find.text('Navigation')).width,
      TRMeasurements.measureSm,
    );
    expect(
      tester.getRect(find.text('Collection')).width,
      TRMeasurements.measureMd,
    );
    for (final separator in find.byType(TRSeparator).evaluate()) {
      expect(
        tester.getRect(find.byWidget(separator.widget)).width,
        TRControlMetrics.borderWidth,
      );
    }
  });

  testWidgets('keyed content state survives breakpoint round trips', (
    tester,
  ) async {
    final contentKey = GlobalKey<_IdentityProbeState>();
    final content = _IdentityProbe(key: contentKey);

    await _pumpLayout(tester, width: 599, content: content);
    contentKey.currentState!.increment();
    await tester.pump();
    expect(find.text('identity:1'), findsOneWidget);

    tester.view.physicalSize = const Size(1200, 600);
    await tester.pump();
    expect(find.text('identity:1'), findsOneWidget);

    tester.view.physicalSize = const Size(599, 600);
    await tester.pump();
    expect(find.text('identity:1'), findsOneWidget);
  });
}

Future<void> _pumpLayout(
  WidgetTester tester, {
  required double width,
  double navigationWidth = TRMeasurements.measureSm,
  double collectionWidth = TRMeasurements.measureMd,
  Widget? content,
}) async {
  tester.view
    ..devicePixelRatio = 1
    ..physicalSize = Size(width, 600);
  addTearDown(tester.view.reset);
  final effectiveContent = content ?? const _WidthClassProbe();

  await tester.pumpWidget(
    MaterialApp(
      theme: TinyrackTheme.light(),
      home: TRAdaptiveNavigationLayout(
        navigationPaneWidth: navigationWidth,
        navigationPane: const SizedBox.expand(child: Text('Navigation')),
        contentPane: TRAdaptiveListDetailLayout(
          collectionPaneWidth: collectionWidth,
          singlePane: effectiveContent,
          collectionPane: const SizedBox.expand(child: Text('Collection')),
          detailPane: effectiveContent,
        ),
      ),
    ),
  );
  await tester.pump();
}

class _WidthClassProbe extends StatelessWidget {
  const _WidthClassProbe();

  @override
  Widget build(BuildContext context) => SizedBox.expand(
    child: Text('Content:${TRAdaptiveLayoutScope.of(context).widthClass.name}'),
  );
}

class _IdentityProbe extends StatefulWidget {
  const _IdentityProbe({super.key});

  @override
  State<_IdentityProbe> createState() => _IdentityProbeState();
}

class _IdentityProbeState extends State<_IdentityProbe> {
  var value = 0;

  void increment() => setState(() => value += 1);

  @override
  Widget build(BuildContext context) => Text('identity:$value');
}
