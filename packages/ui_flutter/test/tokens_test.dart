import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:tinyrack_ui/tinyrack_ui.dart';

void main() {
  group('TRMeasurements', () {
    // A layout sizing content to the measure scale needs every step of it.
    // Publishing only two forces a consumer to approximate the rest with a
    // literal, which is the thing the scale exists to prevent.
    test('publishes the complete measure scale in ascending order', () {
      const scale = <double>[
        TRMeasurements.measureXs,
        TRMeasurements.measureSm,
        TRMeasurements.measureMd,
        TRMeasurements.measureLg,
        TRMeasurements.measureXl,
      ];
      expect(scale.first, greaterThan(0));
      for (var step = 1; step < scale.length; step++) {
        expect(scale[step], greaterThan(scale[step - 1]));
      }
    });
  });

  group('TRBreakpoints', () {
    // A responsive layout has to decide where it changes shape. Without a
    // published scale every consumer invents its own threshold, so two
    // surfaces in the same app reflow at different widths for no reason.
    test('publishes an ascending breakpoint scale', () {
      const scale = <double>[
        TRBreakpoints.extraSmall,
        TRBreakpoints.small,
        TRBreakpoints.medium,
        TRBreakpoints.large,
        TRBreakpoints.extraLarge,
      ];
      expect(scale.first, greaterThan(0));
      for (var step = 1; step < scale.length; step++) {
        expect(scale[step], greaterThan(scale[step - 1]));
      }
    });

    // The threshold between a stacked and a side-by-side layout has to be
    // wider than the panes it separates, or the layout switches to two panes
    // it cannot fit.
    test('separates a stacked layout from two panes that fit beside it', () {
      expect(
        TRBreakpoints.medium,
        greaterThan(TRMeasurements.paneSm + TRMeasurements.paneMd),
      );
    });
  });

  group('TRMeasurements pane widths', () {
    // A navigation rail and a list pane are structural widths, not content
    // measures and not control widths. Borrowing `measure` or
    // `controlWidth` for them reads as a token while meaning something else,
    // and leaves the two panes free to drift apart across surfaces.
    test('publishes an ascending pane scale', () {
      expect(TRMeasurements.paneSm, greaterThan(0));
      expect(TRMeasurements.paneMd, greaterThan(TRMeasurements.paneSm));
    });

    // A pane holds rows of labelled content, so it has to be wider than a
    // single control sitting inside it.
    test('fits a control at the largest size', () {
      expect(
        TRMeasurements.paneSm,
        greaterThan(TRControlMetrics.heightOf(TRUiSize.lg)),
      );
    });
  });

  group('TRMeasurements reading widths', () {
    // A settings or article column stops being readable past a certain
    // inline size. Without this scale a consumer either leaves the column
    // unbounded, stretching a label and its control to opposite edges of a
    // wide window, or caps it with a literal.
    test('publishes an ascending reading width scale', () {
      const scale = <double>[
        TRMeasurements.readingWidthSm,
        TRMeasurements.readingWidthMd,
        TRMeasurements.readingWidthLg,
      ];
      expect(scale.first, greaterThan(0));
      for (var step = 1; step < scale.length; step++) {
        expect(scale[step], greaterThan(scale[step - 1]));
      }
    });

    // Wider than the widest measure step, which sizes a single text region
    // rather than a whole content column.
    test('exceeds the measure scale it complements', () {
      expect(
        TRMeasurements.readingWidthSm,
        greaterThan(TRMeasurements.measureXl),
      );
    });
  });

  group('TRBrandMark measurements', () {
    // A brand mark is a graphic, not a text region and not a control glyph.
    // Without its own scale a splash or an empty state has to borrow a
    // `measure` inline size or a `TRSpacing` gap, which reads as a token while
    // meaning something else.
    test('publishes an ascending brand mark scale', () {
      const scale = <double>[
        TRMeasurements.brandMarkSm,
        TRMeasurements.brandMarkMd,
        TRMeasurements.brandMarkLg,
      ];
      expect(scale.first, greaterThan(0));
      for (var step = 1; step < scale.length; step++) {
        expect(scale[step], greaterThan(scale[step - 1]));
      }
      // Larger than the glyph inside a control, so the two are never confused.
      expect(
        TRMeasurements.brandMarkSm,
        greaterThan(TRControlMetrics.iconSizeOf(TRUiSize.lg)),
      );
    });
  });

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
