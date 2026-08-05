import 'package:flutter/gestures.dart';
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
          child: SizedBox(width: 320, child: child),
        ),
      ),
    ),
  ),
);

List<TRTreeNavItem<String>> _items({bool disabled = false}) => [
  TRTreeNavGroup(
    value: 'guides',
    label: const Text('GUIDES'),
    initiallyExpanded: true,
    children: [
      const TRTreeNavLeaf(value: 'install', label: Text('Install')),
      TRTreeNavGroup(
        value: 'advanced',
        label: const Text('ADVANCED'),
        initiallyExpanded: true,
        children: [const TRTreeNavLeaf(value: 'themes', label: Text('Themes'))],
      ),
    ],
  ),
  TRTreeNavLeaf(
    value: 'disabled',
    label: const Text('Disabled'),
    disabled: disabled,
  ),
];

AnimatedContainer _row(WidgetTester tester, String label) =>
    tester.widget<AnimatedContainer>(
      find
          .ancestor(
            of: find.text(label),
            matching: find.byType(AnimatedContainer),
          )
          .first,
    );

Color? _background(WidgetTester tester, String label) =>
    (_row(tester, label).decoration as BoxDecoration?)?.color;

void main() {
  testWidgets('matches web row heights, nested gaps, and progressive rails', (
    tester,
  ) async {
    await tester.pumpWidget(_app(TRTreeNav<String>(items: _items())));

    for (final label in [
      'GUIDES',
      'Install',
      'ADVANCED',
      'Themes',
      'Disabled',
    ]) {
      expect(tester.getSize(find.text(label)).height, lessThanOrEqualTo(21));
      expect(
        tester
            .getSize(
              find
                  .ancestor(
                    of: find.text(label),
                    matching: find.byType(AnimatedContainer),
                  )
                  .first,
            )
            .height,
        label == 'GUIDES' || label == 'ADVANCED' ? 32 : 40,
      );
    }
    final guidesLeft = tester.getTopLeft(
      find
          .ancestor(
            of: find.text('GUIDES'),
            matching: find.byType(AnimatedContainer),
          )
          .first,
    );
    final installLeft = tester.getTopLeft(
      find
          .ancestor(
            of: find.text('Install'),
            matching: find.byType(AnimatedContainer),
          )
          .first,
    );
    final themesLeft = tester.getTopLeft(
      find
          .ancestor(
            of: find.text('Themes'),
            matching: find.byType(AnimatedContainer),
          )
          .first,
    );
    // The measured paragraph origin includes the font's 3px visual bearing;
    // each level still advances by the same margin + rail-padding geometry.
    expect(installLeft.dx - guidesLeft.dx, 21);
    expect(themesLeft.dx - installLeft.dx, 21);
    expect(
      tester.getTopLeft(find.text('Disabled')).dy -
          tester.getBottomLeft(find.text('Themes')).dy,
      greaterThanOrEqualTo(20),
    );

    final rails = tester
        .widgetList<Container>(find.byType(Container))
        .where(
          (widget) =>
              widget.decoration is BoxDecoration &&
              (widget.decoration! as BoxDecoration).border is BorderDirectional,
        );
    expect(rails, hasLength(2));
  });

  testWidgets('renders selected leaf and its ancestor groups as active', (
    tester,
  ) async {
    await tester.pumpWidget(
      _app(TRTreeNav<String>(items: _items(), defaultValue: 'themes')),
    );
    final theme = Theme.of(
      tester.element(find.byType(TRTreeNav<String>)),
    ).extension<TinyrackThemeData>()!;

    expect(_background(tester, 'Themes'), theme.surfaceHover);
    expect(
      DefaultTextStyle.of(tester.element(find.text('Themes'))).style.color,
      theme.text,
    );
    expect(
      DefaultTextStyle.of(tester.element(find.text('GUIDES'))).style.color,
      theme.text,
    );
    expect(
      DefaultTextStyle.of(tester.element(find.text('GUIDES'))).style.fontWeight,
      FontWeight.w700,
    );
    expect(
      DefaultTextStyle.of(
        tester.element(find.text('ADVANCED')),
      ).style.fontWeight,
      FontWeight.w700,
    );
  });

  testWidgets('shows hover and focus surfaces and blocks disabled activation', (
    tester,
  ) async {
    String? selected;
    await tester.pumpWidget(
      _app(
        TRTreeNav<String>(
          items: _items(disabled: true),
          onValueChange: (value) => selected = value,
        ),
      ),
    );
    final theme = Theme.of(
      tester.element(find.byType(TRTreeNav<String>)),
    ).extension<TinyrackThemeData>()!;

    final mouse = await tester.createGesture(kind: PointerDeviceKind.mouse);
    await mouse.addPointer(location: Offset.zero);
    await mouse.moveTo(tester.getCenter(find.text('Install')));
    await tester.pumpAndSettle();
    expect(_background(tester, 'Install'), theme.surfaceHover);

    await tester.tap(find.text('Disabled'));
    expect(selected, isNull);
    await tester.tap(find.text('Install'));
    expect(selected, 'install');

    await tester.sendKeyEvent(LogicalKeyboardKey.tab);
    await tester.pump();
    expect(_background(tester, 'GUIDES'), theme.surfaceHover);
    await mouse.removePointer();
  });

  testWidgets('pointer and keyboard toggle groups and select leaves', (
    tester,
  ) async {
    final controller = TRTreeNavController<String>(expanded: ['guides']);
    String? selected;
    await tester.pumpWidget(
      _app(
        TRTreeNav<String>(
          controller: controller,
          items: _items(),
          onValueChange: (value) => selected = value,
        ),
      ),
    );

    expect(find.text('Install'), findsOneWidget);
    expect(
      tester
          .widget<AnimatedRotation>(find.byType(AnimatedRotation).first)
          .turns,
      0.25,
    );
    await tester.tap(find.text('GUIDES'));
    await tester.pumpAndSettle();
    expect(find.text('Install'), findsNothing);
    expect(
      tester
          .widget<AnimatedRotation>(find.byType(AnimatedRotation).first)
          .turns,
      0,
    );
    await tester.tap(find.text('GUIDES'));
    await tester.pumpAndSettle();

    await tester.sendKeyEvent(LogicalKeyboardKey.tab);
    await tester.sendKeyEvent(LogicalKeyboardKey.arrowRight);
    expect(controller.expanded, contains('guides'));
    await tester.sendKeyEvent(LogicalKeyboardKey.arrowLeft);
    expect(controller.expanded, isNot(contains('guides')));
    controller.setExpanded('guides', true);
    await tester.pump();
    await tester.sendKeyEvent(LogicalKeyboardKey.arrowDown);
    await tester.sendKeyEvent(LogicalKeyboardKey.enter);
    expect(selected, 'install');
    controller.dispose();
  });

  testWidgets('RTL reverses logical expand and collapse keys', (tester) async {
    final controller = TRTreeNavController<String>();
    await tester.pumpWidget(
      _app(
        TRTreeNav<String>(controller: controller, items: _items()),
        textDirection: TextDirection.rtl,
      ),
    );
    await tester.sendKeyEvent(LogicalKeyboardKey.tab);
    await tester.sendKeyEvent(LogicalKeyboardKey.arrowLeft);
    expect(controller.expanded, contains('guides'));
    await tester.sendKeyEvent(LogicalKeyboardKey.arrowRight);
    expect(controller.expanded, isNot(contains('guides')));
    controller.dispose();
  });

  testWidgets('controller replacement and PageStorage preserve expansion', (
    tester,
  ) async {
    final bucket = PageStorageBucket();
    final first = TRTreeNavController<String>();
    final second = TRTreeNavController<String>();

    Widget build(TRTreeNavController<String> controller) => _app(
      PageStorage(
        bucket: bucket,
        child: TRTreeNav<String>(
          controller: controller,
          items: _items(),
          pageStorageId: 'docs-tree',
        ),
      ),
    );

    await tester.pumpWidget(build(first));
    first.setExpanded('guides', true);
    await tester.pump();
    await tester.pumpWidget(build(second));
    await tester.pump();
    expect(second.expanded, contains('guides'));

    first.setExpanded('guides', false);
    await tester.pump();
    expect(second.expanded, contains('guides'));
    first.dispose();
    second.dispose();
  });

  testWidgets('uses the active dark palette and zero-duration reduced motion', (
    tester,
  ) async {
    await tester.pumpWidget(
      _app(
        TRTreeNav<String>(items: _items(), defaultValue: 'themes'),
        brightness: Brightness.dark,
      ),
    );
    final theme = Theme.of(
      tester.element(find.byType(TRTreeNav<String>)),
    ).extension<TinyrackThemeData>()!;
    expect(_background(tester, 'Themes'), theme.surfaceHover);
    expect(_row(tester, 'Themes').duration, Duration.zero);
    expect(
      tester
          .widget<AnimatedRotation>(find.byType(AnimatedRotation).first)
          .duration,
      Duration.zero,
    );
  });

  testWidgets(
    'keeps long scaled labels and leading or trailing content aligned',
    (tester) async {
      await tester.pumpWidget(
        _app(
          const TRTreeNav<String>(
            items: [
              TRTreeNavGroup(
                value: 'group',
                label: Text('A long group label that wraps onto another line'),
                initiallyExpanded: true,
                trailing: Icon(
                  Icons.more_horiz,
                  key: ValueKey('group-trailing'),
                ),
                children: [
                  TRTreeNavLeaf(
                    value: 'leaf',
                    label: Text(
                      'A long destination label that remains readable',
                    ),
                    leading: Icon(
                      Icons.description,
                      key: ValueKey('leaf-leading'),
                    ),
                    trailing: Text('⌘1', key: ValueKey('leaf-trailing')),
                  ),
                ],
              ),
            ],
          ),
          textScaler: const TextScaler.linear(2),
        ),
      );

      expect(tester.takeException(), isNull);
      expect(find.byType(AnimatedRotation), findsNothing);
      expect(
        tester.getTopLeft(find.byKey(const ValueKey('leaf-leading'))).dx,
        lessThan(
          tester
              .getTopLeft(
                find.text('A long destination label that remains readable'),
              )
              .dx,
        ),
      );
      expect(
        tester.getTopLeft(find.byKey(const ValueKey('leaf-trailing'))).dx,
        greaterThan(
          tester
              .getTopLeft(
                find.text('A long destination label that remains readable'),
              )
              .dx,
        ),
      );
    },
  );
}
