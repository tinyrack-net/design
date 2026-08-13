import 'package:flutter/gestures.dart';
import 'package:material_ui/material_ui.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:lucide_flutter/lucide_flutter.dart';
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

Color? _ringColor(WidgetTester tester, String label) =>
    (_row(tester, label).foregroundDecoration as BoxDecoration?)
        ?.border
        ?.top
        .color;

void main() {
  testWidgets('node keys identify their rendered rows', (tester) async {
    const groupKey = ValueKey<String>('guides-row');
    const leafKey = ValueKey<String>('install-row');
    await tester.pumpWidget(
      _app(
        const TRTreeNav<String>(
          items: [
            TRTreeNavGroup(
              key: groupKey,
              value: 'guides',
              label: Text('Guides'),
              initiallyExpanded: true,
              children: [
                TRTreeNavLeaf(
                  key: leafKey,
                  value: 'install',
                  label: Text('Install'),
                ),
              ],
            ),
          ],
        ),
      ),
    );

    expect(find.byKey(groupKey).hitTestable(), findsOneWidget);
    expect(find.byKey(leafKey).hitTestable(), findsOneWidget);
  });

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
    expect(
      tester
          .widget<Icon>(
            find
                .descendant(
                  of: find.byType(AnimatedRotation).first,
                  matching: find.byType(Icon),
                )
                .first,
          )
          .size,
      TRSpacing.medium,
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

  testWidgets(
    'comfortable density enlarges rows, typography, and inherited icons',
    (tester) async {
      await tester.pumpWidget(
        _app(
          const TRUiDensityScope(
            density: TRUiDensity.comfortable,
            child: TRTreeNav<String>(
              items: [
                TRTreeNavGroup(
                  value: 'group',
                  label: Text('Group'),
                  leading: Icon(Icons.folder, key: ValueKey('group-icon')),
                  children: [],
                ),
                TRTreeNavLeaf(
                  value: 'leaf',
                  label: Text('Leaf'),
                  description: Text('Supporting copy'),
                  leading: Icon(Icons.description, key: ValueKey('leaf-icon')),
                ),
              ],
            ),
          ),
        ),
      );

      for (final label in ['Group', 'Leaf']) {
        expect(_row(tester, label).constraints?.minHeight, 48);
        expect(
          DefaultTextStyle.of(tester.element(find.text(label))).style.fontSize,
          16,
        );
      }
      expect(
        DefaultTextStyle.of(
          tester.element(find.text('Supporting copy')),
        ).style.fontSize,
        14,
      );
      for (final key in ['group-icon', 'leaf-icon']) {
        expect(
          IconTheme.of(tester.element(find.byKey(ValueKey<String>(key)))).size,
          20,
        );
      }
      expect(
        tester
            .widget<Icon>(
              find
                  .descendant(
                    of: find.byType(AnimatedRotation).first,
                    matching: find.byType(Icon),
                  )
                  .first,
            )
            .size,
        20,
      );
    },
  );

  testWidgets('explicit uiSize overrides the inherited density', (
    tester,
  ) async {
    const items = [
      TRTreeNavGroup<String>(
        value: 'group',
        label: Text('Group'),
        children: [],
      ),
      TRTreeNavLeaf<String>(
        value: 'leaf',
        label: Text('Leaf'),
        description: Text('Supporting copy'),
      ),
    ];

    await tester.pumpWidget(
      _app(
        const TRUiDensityScope(
          density: TRUiDensity.comfortable,
          child: TRTreeNav<String>(items: items, uiSize: TRUiSize.md),
        ),
      ),
    );
    expect(_row(tester, 'Group').constraints?.minHeight, 32);
    expect(_row(tester, 'Leaf').constraints?.minHeight, 40);
    expect(
      DefaultTextStyle.of(tester.element(find.text('Group'))).style.fontSize,
      12,
    );
    expect(
      DefaultTextStyle.of(tester.element(find.text('Leaf'))).style.fontSize,
      14,
    );
    expect(
      DefaultTextStyle.of(
        tester.element(find.text('Supporting copy')),
      ).style.fontSize,
      12,
    );

    await tester.pumpWidget(
      _app(const TRTreeNav<String>(items: items, uiSize: TRUiSize.xl)),
    );
    expect(_row(tester, 'Group').constraints?.minHeight, 48);
    expect(_row(tester, 'Leaf').constraints?.minHeight, 48);
    expect(
      DefaultTextStyle.of(tester.element(find.text('Group'))).style.fontSize,
      16,
    );
    expect(
      DefaultTextStyle.of(tester.element(find.text('Leaf'))).style.fontSize,
      16,
    );
    expect(
      DefaultTextStyle.of(
        tester.element(find.text('Supporting copy')),
      ).style.fontSize,
      14,
    );
  });

  testWidgets('itemSpacing overrides the default top-level gap', (
    tester,
  ) async {
    final flatItems = [
      const TRTreeNavLeaf(value: 'a', label: Text('A')),
      const TRTreeNavLeaf(value: 'b', label: Text('B')),
    ];

    await tester.pumpWidget(_app(TRTreeNav<String>(items: flatItems)));
    final defaultGap =
        tester.getTopLeft(find.text('B')).dy -
        tester.getBottomLeft(find.text('A')).dy;

    await tester.pumpWidget(
      _app(
        TRTreeNav<String>(items: flatItems, itemSpacing: TRSpacing.extraSmall),
      ),
    );
    final tightGap =
        tester.getTopLeft(find.text('B')).dy -
        tester.getBottomLeft(find.text('A')).dy;

    expect(defaultGap - tightGap, TRSpacing.large - TRSpacing.extraSmall);
  });

  testWidgets('leaf disclosure indicator is opt-in and direction-aware', (
    tester,
  ) async {
    const items = [
      TRTreeNavLeaf<String>(
        value: 'destination',
        label: Text('Destination'),
        showDisclosureIndicator: true,
      ),
    ];

    await tester.pumpWidget(_app(const TRTreeNav<String>(items: items)));
    expect(
      tester.widget<Icon>(find.byType(Icon)).icon,
      LucideIcons.chevronRight,
    );

    await tester.pumpWidget(
      _app(
        const TRTreeNav<String>(items: items),
        textDirection: TextDirection.rtl,
      ),
    );
    expect(
      tester.widget<Icon>(find.byType(Icon)).icon,
      LucideIcons.chevronLeft,
    );

    await tester.pumpWidget(
      _app(
        const TRTreeNav<String>(
          items: [
            TRTreeNavLeaf(value: 'plain', label: Text('Plain')),
            TRTreeNavLeaf(
              value: 'disabled',
              label: Text('Disabled'),
              disabled: true,
              showDisclosureIndicator: true,
            ),
          ],
        ),
      ),
    );
    expect(find.byType(Icon), findsNothing);
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

  testWidgets('shows pressed surfaces for enabled leaf and group rows', (
    tester,
  ) async {
    await tester.pumpWidget(
      _app(
        TRTreeNav<String>(items: _items(disabled: true), onValueChange: (_) {}),
      ),
    );
    final theme = Theme.of(
      tester.element(find.byType(TRTreeNav<String>)),
    ).extension<TinyrackThemeData>()!;
    final mouse = await tester.createGesture(kind: PointerDeviceKind.mouse);
    await mouse.addPointer(location: Offset.zero);
    addTearDown(mouse.removePointer);

    await mouse.moveTo(tester.getCenter(find.text('Install')));
    await tester.pumpAndSettle();
    expect(_background(tester, 'Install'), theme.surfaceHover);

    await mouse.down(tester.getCenter(find.text('Install')));
    await tester.pump();
    expect(_background(tester, 'Install'), theme.surfacePressed);

    await mouse.moveTo(const Offset(319, 319));
    await tester.pumpAndSettle();
    expect(_background(tester, 'Install'), Colors.transparent);

    await mouse.up();
    await tester.pumpAndSettle();

    await mouse.moveTo(tester.getCenter(find.text('Install')));
    await tester.pumpAndSettle();
    expect(_background(tester, 'Install'), theme.surfaceHover);

    await mouse.moveTo(tester.getCenter(find.text('GUIDES')));
    await tester.pumpAndSettle();
    await mouse.down(tester.getCenter(find.text('GUIDES')));
    await tester.pump();
    expect(_background(tester, 'GUIDES'), theme.surfacePressed);

    await mouse.cancel();
    await tester.pumpAndSettle();
    expect(_background(tester, 'GUIDES'), theme.surfaceHover);

    await mouse.moveTo(tester.getCenter(find.text('Disabled')));
    await tester.pumpAndSettle();
    await mouse.down(tester.getCenter(find.text('Disabled')));
    await tester.pump();
    expect(_background(tester, 'Disabled'), Colors.transparent);
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
      await tester.binding.setSurfaceSize(const Size(800, 800));
      addTearDown(() => tester.binding.setSurfaceSize(null));
      await tester.pumpWidget(
        _app(
          const TRTreeNav<String>(
            items: [
              TRTreeNavGroup(
                value: 'group',
                label: Text('A long group label that wraps onto another line'),
                description: Text('A secondary group description'),
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
                    description: Text('A secondary destination description'),
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

  TRTreeNavLeaf<String> menuLeaf(String value) => TRTreeNavLeaf<String>(
    value: value,
    label: Text(value),
    trailing: TRMenu.icon(
      key: ValueKey('$value-menu'),
      icon: const Icon(Icons.more_horiz),
      label: '$value menu',
      menuChildren: [
        TRMenuItem(
          key: ValueKey('$value-menu-item'),
          onPressed: () {},
          child: Text('$value action'),
        ),
      ],
    ),
  );

  Future<TestGesture> pressWithMouse(
    WidgetTester tester,
    Finder target, {
    TestGesture? reuse,
  }) async {
    final mouse =
        reuse ?? await tester.createGesture(kind: PointerDeviceKind.mouse);
    if (reuse == null) await mouse.addPointer(location: Offset.zero);
    // A pointer hovers a control before it presses it, and frames render while
    // the button is held. The row must not rebuild itself out from under the
    // press.
    await mouse.moveTo(tester.getCenter(target));
    await tester.pumpAndSettle();
    await mouse.down(tester.getCenter(target));
    await tester.pump();
    await mouse.up();
    await tester.pumpAndSettle();
    return mouse;
  }

  testWidgets('a control inside a row keeps the row unfocused and pressable', (
    tester,
  ) async {
    await tester.pumpWidget(
      _app(
        TRTreeNav<String>(
          items: [
            TRTreeNavLeaf(
              value: 'leaf',
              label: const Text('Leaf'),
              trailing: TRMenu.icon(
                key: const ValueKey('row-menu'),
                icon: const Icon(Icons.more_horiz),
                label: 'Row menu',
                menuChildren: [
                  TRMenuItem(
                    key: const ValueKey('row-menu-item'),
                    onPressed: () {},
                    child: const Text('Go'),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );

    final trigger = find.byKey(const ValueKey('row-menu'));
    final mouse = await tester.createGesture(kind: PointerDeviceKind.mouse);
    await mouse.addPointer(location: Offset.zero);
    addTearDown(mouse.removePointer);

    // A pointer hovers a control before it presses it, and frames render while
    // the button is held. The row must not rebuild itself out from under the
    // press.
    await mouse.moveTo(tester.getCenter(trigger));
    await tester.pumpAndSettle();
    await mouse.down(tester.getCenter(trigger));
    await tester.pump();
    await mouse.up();
    await tester.pumpAndSettle();

    expect(find.byKey(const ValueKey('row-menu-item')), findsOneWidget);

    // The control owns the focus ring; the row that hosts it does not, so the
    // row falls back to idle once the pointer leaves it.
    expect(_ringColor(tester, 'Leaf'), Colors.transparent);
    await mouse.moveTo(const Offset(1, 300));
    await tester.pumpAndSettle();
    expect(_background(tester, 'Leaf'), Colors.transparent);
  });

  testWidgets('one press moves an open row menu to another row', (
    tester,
  ) async {
    await tester.pumpWidget(
      _app(TRTreeNav<String>(items: [menuLeaf('Upper'), menuLeaf('Lower')])),
    );

    // A menu panel opens downwards, so pressing the row above it reaches the
    // trigger rather than the open panel.
    final mouse = await pressWithMouse(
      tester,
      find.byKey(const ValueKey('Lower-menu')),
    );
    expect(find.byKey(const ValueKey('Lower-menu-item')), findsOneWidget);

    await pressWithMouse(
      tester,
      find.byKey(const ValueKey('Upper-menu')),
      reuse: mouse,
    );
    expect(find.byKey(const ValueKey('Lower-menu-item')), findsNothing);
    expect(find.byKey(const ValueKey('Upper-menu-item')), findsOneWidget);
    await mouse.removePointer();
  });

  testWidgets('Tab leaves the tree once a row with a trailing control has it', (
    tester,
  ) async {
    await tester.pumpWidget(
      _app(
        Column(
          children: [
            TRTreeNav<String>(items: [menuLeaf('Upper'), menuLeaf('Lower')]),
            TRButton(
              key: const ValueKey<String>('after'),
              onPressed: () {},
              child: const Text('After'),
            ),
          ],
        ),
      ),
    );

    // Toggling the row's focus ring must not re-inflate the row, or the
    // trailing control's focus node is destroyed as traversal steps onto it
    // and the tree becomes a keyboard trap.
    var reached = false;
    for (var attempt = 0; attempt < 20 && !reached; attempt += 1) {
      await tester.sendKeyEvent(LogicalKeyboardKey.tab);
      await tester.pumpAndSettle();
      FocusManager.instance.primaryFocus?.context?.visitAncestorElements((
        element,
      ) {
        if (element.widget.key == const ValueKey<String>('after')) {
          reached = true;
        }
        return !reached;
      });
    }
    expect(reached, isTrue, reason: 'Tab never escaped TRTreeNav');
  });

  testWidgets(
    'Tab leaves the tree once a group with a trailing control has it',
    (tester) async {
      await tester.pumpWidget(
        _app(
          Column(
            children: [
              TRTreeNav<String>(
                items: [
                  TRTreeNavGroup<String>(
                    value: 'group',
                    label: const Text('Group'),
                    trailing: TRMenu.icon(
                      key: const ValueKey('group-menu'),
                      icon: const Icon(Icons.more_horiz),
                      label: 'Group menu',
                      menuChildren: [
                        TRMenuItem(
                          onPressed: () {},
                          child: const Text('Action'),
                        ),
                      ],
                    ),
                    children: const [
                      TRTreeNavLeaf(value: 'leaf', label: Text('Leaf')),
                    ],
                  ),
                ],
              ),
              TRButton(
                key: const ValueKey<String>('after'),
                onPressed: () {},
                child: const Text('After'),
              ),
            ],
          ),
        ),
      );

      // A group row toggling its ring re-inflates the row exactly as a leaf row
      // did, so the trailing trigger's focus node dies as traversal reaches it.
      var reached = false;
      for (var attempt = 0; attempt < 20 && !reached; attempt += 1) {
        await tester.sendKeyEvent(LogicalKeyboardKey.tab);
        await tester.pumpAndSettle();
        FocusManager.instance.primaryFocus?.context?.visitAncestorElements((
          element,
        ) {
          if (element.widget.key == const ValueKey<String>('after')) {
            reached = true;
          }
          return !reached;
        });
      }
      expect(reached, isTrue, reason: 'Tab never escaped a group row');
    },
  );
}
