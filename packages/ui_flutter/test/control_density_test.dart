import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:tinyrack_ui/tinyrack_ui.dart';

void main() {
  testWidgets('comfortable density enlarges controls that omit uiSize', (
    tester,
  ) async {
    await tester.pumpWidget(
      _DensityHarness(
        density: TRControlDensity.comfortable,
        child: TRButton(onPressed: () {}, child: const Text('Deploy')),
      ),
    );

    expect(
      tester.getSize(find.byType(TRButton)).height,
      TRControlMetrics.heightOf(TRUiSize.lg),
    );
  });

  testWidgets('explicit uiSize overrides comfortable density', (tester) async {
    await tester.pumpWidget(
      _DensityHarness(
        density: TRControlDensity.comfortable,
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
    final density = ValueNotifier(TRControlDensity.standard);
    addTearDown(density.dispose);

    await tester.pumpWidget(
      ValueListenableBuilder<TRControlDensity>(
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

    density.value = TRControlDensity.comfortable;
    await tester.pump();

    expect(
      tester.getSize(find.byType(TRIconButton)).height,
      TRControlMetrics.heightOf(TRUiSize.lg),
    );
  });

  testWidgets('comfortable density enlarges switch geometry', (tester) async {
    await tester.pumpWidget(
      const _DensityHarness(
        density: TRControlDensity.comfortable,
        child: TRSwitch(),
      ),
    );

    expect(tester.getSize(find.byType(TRSwitch)), const Size(48, 32));

    await tester.pumpWidget(const SizedBox.shrink());
    await tester.pumpWidget(
      const _DensityHarness(
        density: TRControlDensity.comfortable,
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
        density: TRControlDensity.comfortable,
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
      TRControlMetrics.heightOf(TRUiSize.lg),
    );
    expect(tester.getSize(find.byType(TRCheckbox)), const Size.square(16));
    expect(tester.getSize(find.byType(TRRadio)), const Size.square(16));
    expect(
      tester.getSize(find.byType(TRToggle)).height,
      TRControlMetrics.heightOf(TRUiSize.lg),
    );
  });

  testWidgets('comfortable density leaves display components unchanged', (
    tester,
  ) async {
    await tester.pumpWidget(
      const _DensityHarness(
        density: TRControlDensity.comfortable,
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
      tester.getSize(find.byKey(const ValueKey('inherited'))),
      tester.getSize(find.byKey(const ValueKey('explicit'))),
    );
  });
}

class _DensityHarness extends StatelessWidget {
  const _DensityHarness({required this.density, required this.child});

  final TRControlDensity density;
  final Widget child;

  @override
  Widget build(BuildContext context) => MaterialApp(
    theme: TinyrackTheme.light(),
    home: TRControlDensityScope(
      density: density,
      child: Scaffold(body: Center(child: child)),
    ),
  );
}
