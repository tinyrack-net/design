import 'package:material_ui/material_ui.dart';
import 'package:flutter_test/flutter_test.dart';
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

  test('navigator keeps typed history and pops the deepest destination', () {
    final navigator = TRThreePaneNavigator<String>(
      initialDestination: const TRPaneDestination(
        role: TRPaneRole.navigation,
        value: 'navigation',
      ),
    );
    addTearDown(navigator.dispose);

    navigator
      ..push(
        const TRPaneDestination(role: TRPaneRole.primary, value: 'collection'),
      )
      ..push(
        const TRPaneDestination(role: TRPaneRole.secondary, value: 'detail'),
      );

    expect(navigator.currentDestination.value, 'detail');
    expect(navigator.canPop, isTrue);
    expect(navigator.pop(), isTrue);
    expect(navigator.currentDestination.value, 'collection');
    navigator.replace(
      const TRPaneDestination(role: TRPaneRole.primary, value: 'replacement'),
    );
    expect(navigator.currentDestination.value, 'replacement');
  });

  for (final testCase in <({double width, int panes})>[
    (width: 599, panes: 1),
    (width: 600, panes: 2),
    (width: 1199, panes: 2),
    (width: 1200, panes: 3),
  ]) {
    testWidgets('${testCase.width}px renders ${testCase.panes} pane(s)', (
      tester,
    ) async {
      tester.view
        ..devicePixelRatio = 1
        ..physicalSize = Size(testCase.width, 600);
      addTearDown(tester.view.reset);
      final navigator =
          TRThreePaneNavigator<String>(
              initialDestination: const TRPaneDestination(
                role: TRPaneRole.navigation,
                value: 'navigation',
              ),
            )
            ..push(
              const TRPaneDestination(
                role: TRPaneRole.primary,
                value: 'primary',
              ),
            )
            ..push(
              const TRPaneDestination(
                role: TRPaneRole.secondary,
                value: 'secondary',
              ),
            );
      addTearDown(navigator.dispose);

      await tester.pumpWidget(
        MaterialApp(
          theme: TinyrackTheme.light(),
          home: TRNavigableThreePaneScaffold<String>(
            navigator: navigator,
            navigationPane: const Text('Navigation'),
            primaryPane: const Text('Primary'),
            secondaryPane: const Text('Secondary'),
          ),
        ),
      );
      await tester.pumpAndSettle();

      expect(find.byType(TRAdaptivePane), findsNWidgets(testCase.panes));
      if (testCase.panes == 1) {
        expect(find.text('Secondary'), findsOneWidget);
      } else {
        expect(find.text('Navigation'), findsOneWidget);
        expect(find.text('Secondary'), findsOneWidget);
      }
    });
  }

  testWidgets('navigation pane and sections own shared token geometry', (
    tester,
  ) async {
    await tester.pumpWidget(
      MaterialApp(
        theme: TinyrackTheme.light(),
        home: const TRNavigationPane(
          children: [
            TRNavigationSection(label: Text('App'), child: Text('General')),
            TRNavigationSection(label: Text('Daemon'), child: Text('Embedded')),
          ],
        ),
      ),
    );

    final list = tester.widget<ListView>(find.byType(ListView));
    expect(list.padding, const EdgeInsets.all(TRSpacing.medium));
    expect(
      tester.getTopLeft(find.text('General')).dx,
      tester.getTopLeft(find.text('Embedded')).dx,
    );
    expect(
      tester.getTopLeft(find.text('Daemon')).dy -
          tester.getBottomLeft(find.text('General')).dy,
      greaterThanOrEqualTo(TRSpacing.large),
    );
  });

  testWidgets('resize preserves the active destination and expands panes', (
    tester,
  ) async {
    tester.view
      ..devicePixelRatio = 1
      ..physicalSize = const Size(599, 600);
    addTearDown(tester.view.reset);
    final navigator = TRThreePaneNavigator<String>(
      initialDestination: const TRPaneDestination(
        role: TRPaneRole.secondary,
        value: 'detail',
      ),
    );
    addTearDown(navigator.dispose);

    await tester.pumpWidget(
      MaterialApp(
        theme: TinyrackTheme.light(),
        home: TRNavigableThreePaneScaffold<String>(
          navigator: navigator,
          navigationPane: const Text('Navigation'),
          primaryPane: const Text('Primary'),
          secondaryPane: const Text('Detail'),
        ),
      ),
    );
    await tester.pumpAndSettle();
    expect(find.byType(TRAdaptivePane), findsOneWidget);

    tester.view.physicalSize = const Size(600, 600);
    await tester.pumpAndSettle();
    expect(find.byType(TRAdaptivePane), findsNWidgets(2));
    expect(find.text('Detail'), findsOneWidget);

    tester.view.physicalSize = const Size(1200, 600);
    await tester.pumpAndSettle();
    expect(find.byType(TRAdaptivePane), findsNWidgets(3));
    expect(navigator.currentDestination.value, 'detail');
  });

  testWidgets('tablet navigation root keeps the primary pane beside it', (
    tester,
  ) async {
    tester.view
      ..devicePixelRatio = 1
      ..physicalSize = const Size(600, 600);
    addTearDown(tester.view.reset);
    final navigator = TRThreePaneNavigator<String>(
      initialDestination: const TRPaneDestination(
        role: TRPaneRole.navigation,
        value: 'navigation',
      ),
    );
    addTearDown(navigator.dispose);

    await tester.pumpWidget(
      MaterialApp(
        theme: TinyrackTheme.light(),
        home: TRNavigableThreePaneScaffold<String>(
          navigator: navigator,
          navigationPane: const Text('Navigation'),
          primaryPane: const Text('Primary'),
        ),
      ),
    );

    expect(find.byType(TRAdaptivePane), findsNWidgets(2));
    expect(find.text('Navigation'), findsOneWidget);
    expect(find.text('Primary'), findsOneWidget);
  });

  testWidgets('classifies the logical layout constraint, not the host view', (
    tester,
  ) async {
    tester.view
      ..devicePixelRatio = 3
      ..physicalSize = const Size(3600, 1800);
    addTearDown(tester.view.reset);
    final navigator = TRThreePaneNavigator<String>(
      initialDestination: const TRPaneDestination(
        role: TRPaneRole.primary,
        value: 'primary',
      ),
    );
    addTearDown(navigator.dispose);

    await tester.pumpWidget(
      MaterialApp(
        theme: TinyrackTheme.light(),
        home: Align(
          child: SizedBox(
            width: 599,
            height: 600,
            child: TRNavigableThreePaneScaffold<String>(
              navigator: navigator,
              navigationPane: const Text('Navigation'),
              primaryPane: const Text('Primary'),
            ),
          ),
        ),
      ),
    );

    expect(find.byType(TRAdaptivePane), findsOneWidget);
    expect(find.text('Navigation'), findsNothing);
    expect(find.text('Primary'), findsOneWidget);
  });

  testWidgets('honors reduced motion and logical navigation order', (
    tester,
  ) async {
    tester.view
      ..devicePixelRatio = 1
      ..physicalSize = const Size(600, 600);
    addTearDown(tester.view.reset);
    final navigator = TRThreePaneNavigator<String>(
      initialDestination: const TRPaneDestination(
        role: TRPaneRole.primary,
        value: 'primary',
      ),
    );
    addTearDown(navigator.dispose);

    await tester.pumpWidget(
      MaterialApp(
        theme: TinyrackTheme.light(),
        home: MediaQuery(
          data: const MediaQueryData(
            size: Size(600, 600),
            disableAnimations: true,
          ),
          child: Directionality(
            textDirection: TextDirection.rtl,
            child: TRNavigableThreePaneScaffold<String>(
              navigator: navigator,
              navigationPane: const Text('Navigation'),
              primaryPane: const Text('Primary'),
            ),
          ),
        ),
      ),
    );

    expect(find.byType(AnimatedSwitcher), findsNothing);
    expect(
      tester.getCenter(find.text('Navigation')).dx,
      greaterThan(tester.getCenter(find.text('Primary')).dx),
    );
  });
}
