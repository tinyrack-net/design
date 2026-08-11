import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:tinyrack_ui/tinyrack_ui.dart';

void main() {
  testWidgets('comfortable UI density enlarges controls that omit uiSize', (
    tester,
  ) async {
    await tester.pumpWidget(
      _DensityHarness(
        density: TRUiDensity.comfortable,
        child: TRButton(onPressed: () {}, child: const Text('Deploy')),
      ),
    );

    expect(
      tester.getSize(find.byType(TRButton)).height,
      TRControlMetrics.heightOf(TRUiSize.xl),
    );
  });

  testWidgets('explicit uiSize overrides comfortable density', (tester) async {
    await tester.pumpWidget(
      _DensityHarness(
        density: TRUiDensity.comfortable,
        child: TRButton(
          uiSize: TRUiSize.sm,
          onPressed: () {},
          child: const Text('Deploy'),
        ),
      ),
    );

    expect(
      tester.getSize(find.byType(TRButton)).height,
      TRControlMetrics.heightOf(TRUiSize.sm),
    );
  });

  testWidgets('the default density preserves medium control geometry', (
    tester,
  ) async {
    await tester.pumpWidget(
      MaterialApp(
        theme: TinyrackTheme.light(),
        home: Scaffold(
          body: Center(
            child: TRButton(onPressed: () {}, child: const Text('Deploy')),
          ),
        ),
      ),
    );

    expect(
      tester.getSize(find.byType(TRButton)).height,
      TRControlMetrics.heightOf(TRUiSize.md),
    );
  });

  testWidgets('density changes rebuild inherited controls', (tester) async {
    final density = ValueNotifier(TRUiDensity.standard);
    addTearDown(density.dispose);

    await tester.pumpWidget(
      ValueListenableBuilder<TRUiDensity>(
        valueListenable: density,
        builder: (context, value, child) => _DensityHarness(
          density: value,
          child: TRIconButton(
            label: 'Deploy',
            onPressed: () {},
            icon: const Icon(Icons.rocket_launch),
          ),
        ),
      ),
    );

    expect(
      tester.getSize(find.byType(TRIconButton)).height,
      TRControlMetrics.heightOf(TRUiSize.md),
    );

    density.value = TRUiDensity.comfortable;
    await tester.pump();

    expect(
      tester.getSize(find.byType(TRIconButton)).height,
      TRControlMetrics.heightOf(TRUiSize.xl),
    );
  });

  testWidgets('comfortable density enlarges switch geometry', (tester) async {
    await tester.pumpWidget(
      const _DensityHarness(
        density: TRUiDensity.comfortable,
        child: TRSwitch(),
      ),
    );

    expect(tester.getSize(find.byType(TRSwitch)), const Size(56, 36));

    await tester.pumpWidget(const SizedBox.shrink());
    await tester.pumpWidget(
      const _DensityHarness(
        density: TRUiDensity.comfortable,
        child: TRSwitch(uiSize: TRUiSize.md),
      ),
    );

    expect(tester.getSize(find.byType(TRSwitch)), const Size(40, 24));
  });

  testWidgets('comfortable density reaches field and selection controls', (
    tester,
  ) async {
    await tester.pumpWidget(
      _DensityHarness(
        density: TRUiDensity.comfortable,
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const SizedBox(width: 240, child: TRTextField()),
            TRSelect<int>(items: const [TRSelectItem(value: 1, label: 'One')]),
            const TRCheckbox(),
            const TRRadioGroup(
              defaultValue: 'one',
              children: [TRRadio(value: 'one')],
            ),
            const TRToggle(child: Text('Pin')),
          ],
        ),
      ),
    );

    expect(
      tester.getSize(find.byType(TRTextField)).height,
      greaterThan(TRControlMetrics.heightOf(TRUiSize.md)),
    );
    expect(
      tester.getSize(find.byType(TRSelect<int>)).height,
      TRControlMetrics.heightOf(TRUiSize.xl),
    );
    expect(tester.getSize(find.byType(TRCheckbox)), const Size.square(20));
    expect(tester.getSize(find.byType(TRRadio)), const Size.square(20));
    expect(
      tester.getSize(find.byType(TRToggle)).height,
      TRControlMetrics.heightOf(TRUiSize.xl),
    );
  });

  testWidgets('comfortable density enlarges default display components', (
    tester,
  ) async {
    await tester.pumpWidget(
      const _DensityHarness(
        density: TRUiDensity.comfortable,
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            TRBadge(key: ValueKey('inherited'), child: Text('Ready')),
            TRBadge(
              key: ValueKey('explicit'),
              uiSize: TRUiSize.md,
              child: Text('Ready'),
            ),
          ],
        ),
      ),
    );

    expect(
      tester.getSize(find.byKey(const ValueKey('inherited'))).height,
      greaterThan(
        tester.getSize(find.byKey(const ValueKey('explicit'))).height,
      ),
    );
  });

  testWidgets('comfortable density enlarges text and card padding', (
    tester,
  ) async {
    await tester.pumpWidget(
      const _DensityHarness(
        density: TRUiDensity.comfortable,
        child: TRCard(
          child: TRText('Readable', key: ValueKey('comfortable-text')),
        ),
      ),
    );

    final text = tester.widget<Text>(find.text('Readable'));
    expect(text.style?.fontSize, 18);
    final padding = tester.widget<Padding>(
      find.descendant(of: find.byType(TRCard), matching: find.byType(Padding)),
    );
    final resolved = padding.padding.resolve(TextDirection.ltr);
    expect(resolved.left, TRSpacing.large + TRControlMetrics.borderWidth);
    expect(resolved.top, greaterThan(resolved.left));
  });

  testWidgets('comfortable density advances every typography role', (
    tester,
  ) async {
    late Map<TRTextVariant, double?> sizes;
    await tester.pumpWidget(
      _DensityHarness(
        density: TRUiDensity.comfortable,
        child: Builder(
          builder: (context) {
            sizes = <TRTextVariant, double?>{
              for (final variant in TRTextVariant.values)
                variant: TRTypography.resolve(context, variant).fontSize,
            };
            return const SizedBox.shrink();
          },
        ),
      ),
    );

    expect(sizes[TRTextVariant.caption], 14);
    expect(sizes[TRTextVariant.label], 14);
    expect(sizes[TRTextVariant.bodySm], 16);
    expect(sizes[TRTextVariant.code], 16);
    expect(sizes[TRTextVariant.body], 18);
    expect(sizes[TRTextVariant.headingSm], 20);
    expect(sizes[TRTextVariant.headingMd], 30);
    expect(sizes[TRTextVariant.headingLg], 36);
    expect(sizes[TRTextVariant.display], 56);
    expect(sizes[TRTextVariant.displayLg], 56);
  });

  testWidgets('comfortable typography preserves system text scaling', (
    tester,
  ) async {
    await tester.pumpWidget(
      const _DensityHarness(
        density: TRUiDensity.comfortable,
        child: MediaQuery(
          data: MediaQueryData(textScaler: TextScaler.linear(2)),
          child: TRText('Scaled'),
        ),
      ),
    );

    final richText = tester.widget<RichText>(
      find.descendant(of: find.byType(TRText), matching: find.byType(RichText)),
    );
    expect(richText.textScaler.scale(18), 36);
  });

  testWidgets('explicit card padding overrides comfortable density', (
    tester,
  ) async {
    await tester.pumpWidget(
      const _DensityHarness(
        density: TRUiDensity.comfortable,
        child: TRCard(padding: TRCardPadding.sm, child: Text('Compact')),
      ),
    );

    final padding = tester.widget<Padding>(
      find.descendant(of: find.byType(TRCard), matching: find.byType(Padding)),
    );
    expect(
      padding.padding.resolve(TextDirection.ltr).left,
      TRSpacing.small + TRControlMetrics.borderWidth,
    );
  });
}

class _DensityHarness extends StatelessWidget {
  const _DensityHarness({required this.density, required this.child});

  final TRUiDensity density;
  final Widget child;

  @override
  Widget build(BuildContext context) => MaterialApp(
    theme: TinyrackTheme.light(),
    home: TRUiDensityScope(
      density: density,
      child: Scaffold(body: Center(child: child)),
    ),
  );
}
