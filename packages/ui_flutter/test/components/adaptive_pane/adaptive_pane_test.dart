import 'package:flutter_test/flutter_test.dart';
import 'package:material_ui/material_ui.dart';
import 'package:tinyrack_ui/tinyrack_ui.dart';

void main() {
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

  testWidgets(
    'navigation pane and sections enlarge block rhythm in comfortable density',
    (tester) async {
      await tester.pumpWidget(
        MaterialApp(
          theme: TinyrackTheme.light(),
          home: const TRUiDensityScope(
            density: TRUiDensity.comfortable,
            child: TRNavigationPane(
              children: [
                TRNavigationSection(label: Text('App'), child: Text('General')),
                TRNavigationSection(
                  label: Text('Daemon'),
                  child: Text('Embedded'),
                ),
              ],
            ),
          ),
        ),
      );

      final list = tester.widget<ListView>(find.byType(ListView));
      expect(
        list.padding,
        const EdgeInsets.symmetric(
          horizontal: TRSpacing.medium,
          vertical: TRSpacing.large,
        ),
      );
      final labelPadding = tester.widget<Padding>(
        find
            .ancestor(of: find.text('App'), matching: find.byType(Padding))
            .first,
      );
      expect(
        labelPadding.padding,
        const EdgeInsets.fromLTRB(
          TRSpacing.medium,
          TRSpacing.medium,
          TRSpacing.medium,
          TRSpacing.large,
        ),
      );
      expect(
        tester.getTopLeft(find.text('Daemon')).dy -
            tester.getBottomLeft(find.text('General')).dy,
        greaterThanOrEqualTo(TRSpacing.extraLarge),
      );
    },
  );

  testWidgets('explicit navigation pane padding overrides density defaults', (
    tester,
  ) async {
    const padding = EdgeInsets.all(TRSpacing.extraSmall);
    await tester.pumpWidget(
      MaterialApp(
        theme: TinyrackTheme.light(),
        home: const TRUiDensityScope(
          density: TRUiDensity.comfortable,
          child: TRNavigationPane(
            padding: padding,
            children: [Text('Navigation')],
          ),
        ),
      ),
    );

    expect(tester.widget<ListView>(find.byType(ListView)).padding, padding);
  });

  testWidgets('pane header shares insets and density-aware typography', (
    tester,
  ) async {
    Future<void> pump(TRUiDensity density) async {
      await tester.pumpWidget(
        MaterialApp(
          theme: TinyrackTheme.light(),
          home: TRUiDensityScope(
            density: density,
            child: const TRPaneHeader(
              title: Text('Projects'),
              description: Text('1 project'),
            ),
          ),
        ),
      );
    }

    await pump(TRUiDensity.standard);
    expect(tester.getTopLeft(find.text('Projects')).dx, TRSpacing.extraLarge);
    expect(
      DefaultTextStyle.of(tester.element(find.text('Projects'))).style.fontSize,
      TRTypography.headingSm.fontSize,
    );
    expect(
      DefaultTextStyle.of(
        tester.element(find.text('1 project')),
      ).style.fontSize,
      TRTypography.bodySm.fontSize,
    );
    expect(find.byType(TRSeparator), findsOneWidget);

    await pump(TRUiDensity.comfortable);
    expect(
      DefaultTextStyle.of(tester.element(find.text('Projects'))).style.fontSize,
      TRTypography.resolve(
        tester.element(find.text('Projects')),
        TRTextVariant.headingSm,
      ).fontSize,
    );
    expect(
      DefaultTextStyle.of(
        tester.element(find.text('1 project')),
      ).style.fontSize,
      TRTypography.resolve(
        tester.element(find.text('1 project')),
        TRTextVariant.bodySm,
      ).fontSize,
    );
  });

  testWidgets('pane header wraps actions without overflowing narrow panes', (
    tester,
  ) async {
    tester.view
      ..devicePixelRatio = 1
      ..physicalSize = const Size(TRMeasurements.measureLg, 400);
    addTearDown(tester.view.reset);
    await tester.pumpWidget(
      MaterialApp(
        theme: TinyrackTheme.light(),
        home: const MediaQuery(
          data: MediaQueryData(textScaler: TextScaler.linear(2)),
          child: TRPaneHeader(
            leading: SizedBox.square(
              key: ValueKey('leading'),
              dimension: TRSpacing.large,
            ),
            title: Text('Projects'),
            description: Text('Workspace projects'),
            actions: [
              SizedBox(
                key: ValueKey('first-action'),
                width: TRMeasurements.measureSm,
                height: TRSpacing.extraLarge,
              ),
              SizedBox(
                key: ValueKey('second-action'),
                width: TRMeasurements.measureSm,
                height: TRSpacing.extraLarge,
              ),
            ],
          ),
        ),
      ),
    );

    expect(tester.takeException(), isNull);
    expect(
      tester.getTopLeft(find.byKey(const ValueKey('first-action'))).dy,
      lessThan(
        tester.getTopLeft(find.byKey(const ValueKey('second-action'))).dy,
      ),
    );

    tester.view.physicalSize = const Size(600, 400);
    await tester.pump();
    expect(
      tester.getTopLeft(find.byKey(const ValueKey('first-action'))).dy,
      tester.getTopLeft(find.byKey(const ValueKey('second-action'))).dy,
    );
  });

  testWidgets('pane header aligns its identity to a capped content rail', (
    tester,
  ) async {
    tester.view
      ..devicePixelRatio = 1
      ..physicalSize = const Size(1000, 400);
    addTearDown(tester.view.reset);
    await tester.pumpWidget(
      MaterialApp(
        theme: TinyrackTheme.light(),
        home: const TRPaneHeader(
          contentMaxWidth: 640,
          title: Text('Projects'),
          actions: <Widget>[Text('Save')],
        ),
      ),
    );

    expect(tester.getTopLeft(find.text('Projects')).dx, 180);
    expect(tester.getRect(find.byType(TRSeparator)).width, 1000);
    expect(tester.getRect(find.text('Save')).right, lessThanOrEqualTo(820));
  });
}
