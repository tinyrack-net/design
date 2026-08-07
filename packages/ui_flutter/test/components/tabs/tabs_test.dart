import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:tinyrack_ui/tinyrack_ui.dart';

Widget _app(
  Widget child, {
  Brightness brightness = Brightness.light,
  bool disableAnimations = true,
  TextDirection textDirection = TextDirection.ltr,
  TextScaler textScaler = TextScaler.noScaling,
  double width = 640,
}) => MaterialApp(
  theme: TinyrackTheme.light(),
  darkTheme: TinyrackTheme.dark(),
  themeMode: brightness == Brightness.dark ? ThemeMode.dark : ThemeMode.light,
  home: MediaQuery(
    data: MediaQueryData(
      disableAnimations: disableAnimations,
      textScaler: textScaler,
    ),
    child: Directionality(
      textDirection: textDirection,
      child: Scaffold(
        body: Align(
          alignment: Alignment.topLeft,
          child: SizedBox(width: width, child: child),
        ),
      ),
    ),
  ),
);

List<TRTabsTab> _tabs({
  bool closable = true,
  bool disabled = false,
  VoidCallback? onClose,
}) => <TRTabsTab>[
  TRTabsTab(
    value: 'overview',
    label: 'Overview',
    leading: const Icon(Icons.circle),
    onClose: closable ? (onClose ?? () {}) : null,
    closeLabel: closable ? 'Close Overview' : null,
  ),
  TRTabsTab(
    value: 'metrics',
    label: 'Metrics',
    disabled: disabled,
    onClose: closable ? (onClose ?? () {}) : null,
    closeLabel: closable ? 'Close Metrics' : null,
  ),
];

TinyrackThemeData _theme(WidgetTester tester) => Theme.of(
  tester.element(find.byType(TRTabs)),
).extension<TinyrackThemeData>()!;

Color? _fill(WidgetTester tester, String value) =>
    (tester
                .widget<AnimatedContainer>(
                  find
                      .descendant(
                        of: find.byKey(ValueKey<String>('tr-tabs-tab-$value')),
                        matching: find.byType(AnimatedContainer),
                      )
                      .first,
                )
                .decoration
            as BoxDecoration?)
        ?.color;

void main() {
  group('TRTabs.bar layout', () {
    testWidgets('is one control tall inside its own inset', (tester) async {
      await tester.pumpWidget(_app(TRTabs.bar(tabs: _tabs())));

      final rule = tester.getSize(
        find.byKey(const ValueKey<String>('tr-tabs-bar-rule')),
      );
      expect(
        tester.getSize(find.byType(TRTabs)).height,
        TRControlMetrics.heightOf(TRUiSize.md) +
            TRSpacing.small * 2 +
            rule.height,
      );

      final tab = find.byKey(const ValueKey<String>('tr-tabs-tab-overview'));
      final origin = tester.getTopLeft(find.byType(TRTabs));
      final offset = tester.getTopLeft(tab).translate(-origin.dx, -origin.dy);
      expect(offset.dx, TRSpacing.medium);
      expect(offset.dy, TRSpacing.small);
      expect(
        tester.getSize(tab).height,
        TRControlMetrics.heightOf(TRUiSize.md),
      );
      expect(tester.getSize(tab).width, TRMeasurements.measureSm);
    });

    testWidgets('closes the strip with a hairline rule', (tester) async {
      await tester.pumpWidget(_app(TRTabs.bar(tabs: _tabs())));

      final theme = Theme.of(
        tester.element(find.byType(TRTabs)),
      ).extension<TinyrackThemeData>()!;
      final rule = tester.widget<ColoredBox>(
        find.byKey(const ValueKey<String>('tr-tabs-bar-rule')),
      );
      expect(rule.color, theme.border);
    });

    testWidgets('keeps the rule in the dark palette', (tester) async {
      await tester.pumpWidget(
        _app(TRTabs.bar(tabs: _tabs()), brightness: Brightness.dark),
      );

      final theme = Theme.of(
        tester.element(find.byType(TRTabs)),
      ).extension<TinyrackThemeData>()!;
      final rule = tester.widget<ColoredBox>(
        find.byKey(const ValueKey<String>('tr-tabs-bar-rule')),
      );
      expect(rule.color, theme.border);
    });

    testWidgets('mirrors its inset under right-to-left text', (tester) async {
      await tester.pumpWidget(
        _app(TRTabs.bar(tabs: _tabs()), textDirection: TextDirection.rtl),
      );

      final strip = find.byType(TRTabs);
      final tab = find.byKey(const ValueKey<String>('tr-tabs-tab-overview'));
      expect(
        tester.getTopRight(strip).dx - tester.getTopRight(tab).dx,
        TRSpacing.medium,
      );
    });

    testWidgets('holds its height when text scales up', (tester) async {
      await tester.pumpWidget(
        _app(TRTabs.bar(tabs: _tabs()), textScaler: const TextScaler.linear(2)),
      );

      expect(tester.takeException(), isNull);
      expect(
        tester
            .getSize(find.byKey(const ValueKey<String>('tr-tabs-tab-overview')))
            .height,
        TRControlMetrics.heightOf(TRUiSize.md),
      );
    });

    testWidgets('scrolls rather than overflowing a crowded strip', (
      tester,
    ) async {
      await tester.pumpWidget(
        _app(
          TRTabs.bar(
            tabs: <TRTabsTab>[
              for (var index = 0; index < 12; index++)
                TRTabsTab(value: 'tab-$index', label: 'Tab $index'),
            ],
          ),
          width: 320,
        ),
      );

      expect(tester.takeException(), isNull);
      await tester.drag(find.byType(TRTabs), const Offset(-400, 0));
      await tester.pumpAndSettle();
      expect(tester.takeException(), isNull);
    });

    testWidgets('seats leading and action slots inside the inset', (
      tester,
    ) async {
      await tester.pumpWidget(
        _app(
          TRTabs.bar(
            tabs: _tabs(),
            leading: const Icon(
              Icons.arrow_back,
              key: ValueKey<String>('back'),
            ),
            actions: const <Widget>[
              Icon(Icons.add, key: ValueKey<String>('add')),
            ],
          ),
        ),
      );

      final origin = tester.getTopLeft(find.byType(TRTabs));
      expect(
        tester.getTopLeft(find.byKey(const ValueKey<String>('back'))).dx -
            origin.dx,
        TRSpacing.medium,
      );
      expect(
        tester.getTopRight(find.byType(TRTabs)).dx -
            tester.getTopRight(find.byKey(const ValueKey<String>('add'))).dx,
        TRSpacing.medium,
      );
    });
  });

  group('TRTabs.bar behavior', () {
    testWidgets('moves a tab to a target strip insertion index', (
      tester,
    ) async {
      final drops = <TRTabDropDetails>[];
      await tester.pumpWidget(
        _app(
          Row(
            children: <Widget>[
              Expanded(
                child: TRTabs.bar(
                  tabs: _tabs(closable: false),
                  dragConfiguration: TRTabsDragConfiguration(
                    groupId: 'left',
                    onDrop: drops.add,
                  ),
                ),
              ),
              Expanded(
                child: TRTabs.bar(
                  tabs: const <TRTabsTab>[
                    TRTabsTab(value: 'target', label: 'Target'),
                  ],
                  dragConfiguration: TRTabsDragConfiguration(
                    groupId: 'right',
                    onDrop: drops.add,
                  ),
                ),
              ),
            ],
          ),
        ),
      );

      await tester.dragFrom(
        tester.getCenter(
          find.byKey(const ValueKey<String>('tr-tabs-tab-overview')),
        ),
        tester.getCenter(
              find.byKey(const ValueKey<String>('tr-tabs-tab-target')),
            ) -
            tester.getCenter(
              find.byKey(const ValueKey<String>('tr-tabs-tab-overview')),
            ),
      );
      await tester.pumpAndSettle();

      expect(drops, hasLength(1));
      expect(drops.single.value, 'overview');
      expect(drops.single.sourceGroupId, 'left');
      expect(drops.single.targetGroupId, 'right');
      expect(drops.single.targetIndex, 0);
    });

    testWidgets('reports the tapped tab without owning a panel', (
      tester,
    ) async {
      final selected = <String>[];
      await tester.pumpWidget(
        _app(TRTabs.bar(tabs: _tabs(), onValueChange: selected.add)),
      );

      await tester.tap(
        find.byKey(const ValueKey<String>('tr-tabs-tab-metrics')),
      );
      await tester.pumpAndSettle();

      expect(selected, <String>['metrics']);
    });

    testWidgets('closes a tab without selecting it', (tester) async {
      final closed = <String>[];
      final selected = <String>[];
      await tester.pumpWidget(
        _app(
          TRTabs.bar(
            tabs: <TRTabsTab>[
              TRTabsTab(
                value: 'overview',
                label: 'Overview',
                onClose: () => closed.add('overview'),
                closeLabel: 'Close Overview',
              ),
            ],
            onValueChange: selected.add,
          ),
        ),
      );

      await tester.tap(
        find.byKey(const ValueKey<String>('tr-tabs-close-overview')),
      );
      await tester.pumpAndSettle();

      expect(closed, <String>['overview']);
      expect(selected, isEmpty);
    });

    testWidgets('omits the close control when a tab cannot close', (
      tester,
    ) async {
      await tester.pumpWidget(_app(TRTabs.bar(tabs: _tabs(closable: false))));

      expect(
        find.byKey(const ValueKey<String>('tr-tabs-close-overview')),
        findsNothing,
      );
    });

    testWidgets('activates on Enter and on Space release', (tester) async {
      final selected = <String>[];
      await tester.pumpWidget(
        _app(TRTabs.bar(tabs: _tabs(), onValueChange: selected.add)),
      );

      await tester.sendKeyEvent(LogicalKeyboardKey.tab);
      await tester.pump();

      await tester.sendKeyEvent(LogicalKeyboardKey.enter);
      await tester.pumpAndSettle();
      expect(selected, <String>['overview']);

      selected.clear();
      await tester.sendKeyDownEvent(LogicalKeyboardKey.space);
      await tester.pumpAndSettle();
      expect(selected, isEmpty);
      await tester.sendKeyUpEvent(LogicalKeyboardKey.space);
      await tester.pumpAndSettle();
      expect(selected, <String>['overview']);
    });

    testWidgets('ignores a disabled tab', (tester) async {
      final selected = <String>[];
      await tester.pumpWidget(
        _app(
          TRTabs.bar(tabs: _tabs(disabled: true), onValueChange: selected.add),
        ),
      );

      await tester.tap(
        find.byKey(const ValueKey<String>('tr-tabs-tab-metrics')),
      );
      await tester.pumpAndSettle();

      expect(selected, isEmpty);
    });

    testWidgets('keeps a controlled value fixed', (tester) async {
      await tester.pumpWidget(
        _app(TRTabs.bar(tabs: _tabs(), value: 'overview')),
      );

      await tester.tap(
        find.byKey(const ValueKey<String>('tr-tabs-tab-metrics')),
      );
      await tester.pumpAndSettle();

      // Uncontrolled state would have moved the fill to Metrics.
      expect(_fill(tester, 'overview'), _theme(tester).surfaceSelected);
      expect(_fill(tester, 'metrics'), isNot(_theme(tester).surfaceSelected));
    });

    testWidgets('tracks an uncontrolled default', (tester) async {
      await tester.pumpWidget(
        _app(TRTabs.bar(tabs: _tabs(), defaultValue: 'metrics')),
      );

      expect(_fill(tester, 'metrics'), _theme(tester).surfaceSelected);

      await tester.tap(
        find.byKey(const ValueKey<String>('tr-tabs-tab-overview')),
      );
      await tester.pumpAndSettle();

      expect(_fill(tester, 'overview'), _theme(tester).surfaceSelected);
    });

    testWidgets('names the close control for assistive technology', (
      tester,
    ) async {
      final semantics = tester.ensureSemantics();
      await tester.pumpWidget(_app(TRTabs.bar(tabs: _tabs())));

      expect(find.bySemanticsLabel('Close Overview'), findsOneWidget);
      semantics.dispose();
    });

    testWidgets('labels the strip when a caller names it', (tester) async {
      final semantics = tester.ensureSemantics();
      await tester.pumpWidget(
        _app(TRTabs.bar(tabs: _tabs(), semanticLabel: 'Open sessions')),
      );

      expect(find.bySemanticsLabel('Open sessions'), findsOneWidget);
      semantics.dispose();
    });
  });
}
