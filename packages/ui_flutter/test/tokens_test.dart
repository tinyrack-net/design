import 'package:material_ui/material_ui.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:tinyrack_ui/src/generated/tokens.g.dart';
import 'package:tinyrack_ui/tinyrack_ui.dart';

void main() {
  group('TROpacity', () {
    test('publishes the file-drop overlay opacity', () {
      expect(TROpacity.dropOverlay, 0.7);
    });
  });

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

  group('neutral border colours', () {
    test('keeps the light control border distinct from the strong border', () {
      expect(
        TRGeneratedColors.light.controlBorder,
        TRGeneratedColors.light.border,
      );
      expect(
        TRGeneratedColors.light.controlBorder,
        isNot(TRGeneratedColors.light.borderStrong),
      );
    });

    test('keeps dark resting boundaries subtle and interaction stronger', () {
      const resting = Color(0xff262626);
      const interaction = Color(0xff404040);
      final colors = TRGeneratedColors.dark;

      expect(colors.border, resting);
      expect(colors.controlBorder, resting);
      expect(colors.controlTrack, resting);
      expect(colors.borderStrong, interaction);
    });
  });

  group('TRBreakpoints', () {
    // A responsive layout has to decide where it changes shape. Without a
    // published scale every consumer invents its own threshold, so two
    // surfaces in the same app reflow at different widths for no reason.
    test('publishes an ascending breakpoint scale', () {
      const scale = <double>[TRBreakpoints.small, TRBreakpoints.extraLarge];
      expect(scale.first, greaterThan(0));
      for (var step = 1; step < scale.length; step++) {
        expect(scale[step], greaterThan(scale[step - 1]));
      }
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
      expect(TRControlMetrics.heightOf(TRUiSize.xl), 48);
      expect(TRControlMetrics.inlinePaddingOf(TRUiSize.xl), 20);
      expect(TRControlMetrics.gapOf(TRUiSize.xl), 8);
      expect(TRControlMetrics.iconSizeOf(TRUiSize.xl), 20);
      expect(TRControlMetrics.fontSizeOf(TRUiSize.xl), 16);
      expect(TRControlMetrics.lineHeightOf(TRUiSize.xl), 24);
      expect(
        TRControlMetrics.heightOf(TRUiSize.xl),
        greaterThan(TRControlMetrics.heightOf(TRUiSize.lg)),
      );
      expect(TRControlMetrics.borderWidth, greaterThan(0));
    });

    // A composite that draws its own focus ring — a settings row, a nav item —
    // has to match the ring the controls beside it draw. Without these it
    // guesses a width, and the two rings disagree by a pixel.
    test('publishes the focus ring geometry', () {
      expect(
        TRControlMetrics.focusWidth,
        greaterThan(TRControlMetrics.borderWidth),
      );
      expect(TRControlMetrics.focusOffset, greaterThan(0));
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
        expect(
          published.fontSize! * published.height!,
          TRControlMetrics.lineHeightOf(size),
        );

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
