import 'package:flutter_test/flutter_test.dart';
import 'package:material_ui/material_ui.dart';
import 'package:tinyrack_ui/tinyrack_ui.dart';

Widget _app(
  Widget child, {
  double width = 720,
  TRUiDensity density = TRUiDensity.standard,
  TextScaler textScaler = TextScaler.noScaling,
}) => MaterialApp(
  theme: TinyrackTheme.light(),
  home: MediaQuery(
    data: MediaQueryData(disableAnimations: true, textScaler: textScaler),
    child: Scaffold(
      body: Align(
        alignment: Alignment.topLeft,
        child: SizedBox(
          width: width,
          child: TRUiDensityScope(density: density, child: child),
        ),
      ),
    ),
  ),
);

void main() {
  group('TRPaneHeader height', () {
    testWidgets('a title-only header stands one header tall', (tester) async {
      await tester.pumpWidget(
        _app(
          const TRPaneHeader(title: TRText.inherit('Provider'), divider: false),
        ),
      );

      expect(
        tester.getSize(find.byType(TRPaneHeader)).height,
        TRMeasurements.headerHeight,
      );
    });

    testWidgets('carrying an action does not make the header taller', (
      tester,
    ) async {
      await tester.pumpWidget(
        _app(const TRPaneHeader(title: TRText.inherit('Provider'))),
      );
      final bare = tester.getSize(find.byType(TRPaneHeader)).height;

      await tester.pumpWidget(
        _app(
          TRPaneHeader(
            title: const TRText.inherit('Provider'),
            actions: <Widget>[
              TRIconButton(
                label: 'Add provider',
                onPressed: () {},
                icon: const Icon(Icons.add),
              ),
            ],
          ),
        ),
      );

      // Two panes draw their own headers side by side. A collection carrying
      // an action used to stand a control taller than a title-only detail, and
      // the seam between them showed it. A standard control is exactly the
      // resting height less its inset, so it costs the header nothing.
      expect(tester.getSize(find.byType(TRPaneHeader)).height, bare);
    });

    testWidgets('a second identity line grows the header past its rest', (
      tester,
    ) async {
      await tester.pumpWidget(
        _app(const TRPaneHeader(title: TRText.inherit('Provider'))),
      );
      final bare = tester.getSize(find.byType(TRPaneHeader)).height;

      await tester.pumpWidget(
        _app(
          const TRPaneHeader(
            title: TRText.inherit('Provider'),
            description: TRText.inherit('Two connected'),
          ),
        ),
      );

      // Two stacked lines of type are more than the resting height holds, and
      // asking for a description is a deliberate choice by the caller. The
      // header grows for it rather than crushing the two lines together.
      expect(
        tester.getSize(find.byType(TRPaneHeader)).height,
        greaterThan(bare),
      );
    });

    testWidgets('content that cannot fit still grows the header', (
      tester,
    ) async {
      await tester.pumpWidget(
        _app(
          const TRPaneHeader(
            title: TRText.inherit('A deliberately long pane heading'),
            description: TRText.inherit('/a/long/supporting/path'),
          ),
          width: 320,
          textScaler: const TextScaler.linear(2),
        ),
      );

      // The header height is a floor, not a cap: an enlarged text scale has to
      // be able to push the identity onto more lines rather than lose them.
      expect(
        tester.getSize(find.byType(TRPaneHeader)).height,
        greaterThan(TRMeasurements.headerHeight),
      );
      expect(tester.takeException(), isNull);
    });

    testWidgets('a comfortable pane header is taller than a standard one', (
      tester,
    ) async {
      await tester.pumpWidget(
        _app(const TRPaneHeader(title: TRText.inherit('Provider'))),
      );
      final standard = tester.getSize(find.byType(TRPaneHeader)).height;

      await tester.pumpWidget(
        _app(
          const TRPaneHeader(title: TRText.inherit('Provider')),
          density: TRUiDensity.comfortable,
        ),
      );

      expect(
        tester.getSize(find.byType(TRPaneHeader)).height,
        greaterThan(standard),
      );
    });
  });
}
