import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:tinyrack_ui/tinyrack_ui.dart';

void main() {
  group('TRControlMetrics', () {
    test('publishes the geometry of a control at every size', () {
      for (final size in TRUiSize.values) {
        expect(TRControlMetrics.heightOf(size), greaterThan(0));
        expect(TRControlMetrics.iconSizeOf(size), greaterThan(0));
        expect(TRControlMetrics.gapOf(size), greaterThan(0));
        expect(TRControlMetrics.inlinePaddingOf(size), greaterThan(0));
        expect(TRControlMetrics.fontSizeOf(size), greaterThan(0));
      }
      expect(
        TRControlMetrics.heightOf(TRUiSize.lg),
        greaterThan(TRControlMetrics.heightOf(TRUiSize.md)),
      );
      expect(TRControlMetrics.borderWidth, greaterThan(0));
    });

    test('orders the compact size below the default size', () {
      expect(TRControlMetrics.heightOf(TRUiSize.sm), 28);
      expect(TRControlMetrics.inlinePaddingOf(TRUiSize.sm), 8);
      expect(TRControlMetrics.gapOf(TRUiSize.sm), 4);
      expect(TRControlMetrics.iconSizeOf(TRUiSize.sm), 14);
      expect(TRControlMetrics.fontSizeOf(TRUiSize.sm), 12);
      expect(TRControlMetrics.lineHeightOf(TRUiSize.sm), 16);
      for (final metric in <double Function(TRUiSize)>[
        TRControlMetrics.heightOf,
        TRControlMetrics.inlinePaddingOf,
        TRControlMetrics.gapOf,
        TRControlMetrics.iconSizeOf,
        TRControlMetrics.fontSizeOf,
        TRControlMetrics.lineHeightOf,
      ]) {
        expect(metric(TRUiSize.sm), lessThan(metric(TRUiSize.md)));
      }
    });

    testWidgets('describes the button it is published for', (tester) async {
      for (final size in TRUiSize.values) {
        await tester.pumpWidget(
          MaterialApp(
            theme: TinyrackTheme.light(),
            home: Scaffold(
              body: Center(
                child: TRButton(
                  uiSize: size,
                  onPressed: () {},
                  child: const Text('Label'),
                ),
              ),
            ),
          ),
        );

        // A consumer laying out its own control strip needs the height to be
        // the height, and the inline padding to account for the border the
        // button draws, or it measures a control that does not exist.
        final button = tester.getSize(find.byType(TRButton));
        expect(button.height, TRControlMetrics.heightOf(size));

        final label = tester.getSize(find.text('Label'));
        expect(
          button.width,
          moreOrLessEquals(
            label.width +
                2 *
                    (TRControlMetrics.inlinePaddingOf(size) +
                        TRControlMetrics.borderWidth),
            epsilon: 0.5,
          ),
        );
      }
    });

    testWidgets('publishes the style a control renders its label in', (
      tester,
    ) async {
      for (final size in TRUiSize.values) {
        await tester.pumpWidget(
          MaterialApp(
            theme: TinyrackTheme.light(),
            home: Scaffold(
              body: Center(
                child: TRButton(
                  uiSize: size,
                  onPressed: () {},
                  child: const Text('Label'),
                ),
              ),
            ),
          ),
        );

        // A consumer measuring a label to decide what fits has to measure it
        // in the weight and tracking the control will actually render.
        final rendered = tester.widget<RichText>(
          find.descendant(
            of: find.byType(TRButton),
            matching: find.byType(RichText),
          ),
        );
        final published = TRControlMetrics.labelStyleOf(size);
        final actual = (rendered.text as TextSpan).style!;
        expect(actual.fontFamily, published.fontFamily);
        expect(actual.fontSize, published.fontSize);
        expect(actual.fontWeight, published.fontWeight);
        expect(actual.letterSpacing, published.letterSpacing);
        expect(actual.height, published.height);

        final painter = TextPainter(
          text: TextSpan(text: 'Label', style: published),
          textDirection: TextDirection.ltr,
        )..layout();
        expect(
          tester.getSize(find.text('Label')).width,
          moreOrLessEquals(painter.width, epsilon: 0.5),
        );
        painter.dispose();
      }
    });

    testWidgets('sizes the icon of an icon button', (tester) async {
      for (final size in TRUiSize.values) {
        await tester.pumpWidget(
          MaterialApp(
            theme: TinyrackTheme.light(),
            home: Scaffold(
              body: Center(
                child: TRIconButton(
                  uiSize: size,
                  onPressed: () {},
                  icon: const Icon(Icons.add),
                  label: 'Add',
                ),
              ),
            ),
          ),
        );

        expect(
          tester.getSize(find.byType(TRIconButton)),
          Size.square(TRControlMetrics.heightOf(size)),
        );
        expect(
          IconTheme.of(tester.element(find.byIcon(Icons.add))).size,
          TRControlMetrics.iconSizeOf(size),
        );
      }
    });
  });
}
