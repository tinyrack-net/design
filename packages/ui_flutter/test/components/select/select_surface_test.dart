import 'dart:ui' show SemanticsRole, Tristate;

import 'package:flutter/gestures.dart';
import 'package:material_ui/material_ui.dart';
import 'package:flutter/semantics.dart' show SemanticsNode;
import 'package:flutter_test/flutter_test.dart';
import 'package:tinyrack_ui/tinyrack_ui.dart';

const _items = [
  TRSelectItem(value: 'alpha', label: 'Alpha'),
  TRSelectItem(value: 'beta', label: 'Beta'),
  TRSelectItem(value: 'gamma', label: 'Gamma'),
];

Finder get _trigger => find.descendant(
  of: find.byWidgetPredicate((widget) => widget is TRSelect),
  matching: find.byType(TextButton),
);

/// Turns animations off while leaving the viewport size intact.
Widget _app(Widget child) => MaterialApp(
  theme: TinyrackTheme.light(),
  home: Scaffold(
    body: Builder(
      builder: (context) => MediaQuery(
        data: MediaQuery.of(context).copyWith(disableAnimations: true),
        child: Align(alignment: Alignment.topLeft, child: child),
      ),
    ),
  ),
);

Widget _withDensity(TRUiDensity density, Widget child) =>
    TRUiDensityScope(density: density, child: child);

/// Sizes the viewport, which is what [TRSelectSurface.auto] reads.
///
/// `setSurfaceSize` resizes the render view without touching the view metrics
/// [MediaQuery] is built from, so the view itself is what has to move.
void _sizeViewport(WidgetTester tester, Size size) {
  tester.view.devicePixelRatio = 1;
  tester.view.physicalSize = size;
  addTearDown(tester.view.reset);
}

const _narrow = Size(400, 800);
const _wide = Size(900, 800);

void main() {
  testWidgets(
    'intrinsic trigger truncates a scaled label inside a bounded parent',
    (tester) async {
      _sizeViewport(tester, _narrow);
      await tester.pumpWidget(
        _app(
          const MediaQuery(
            data: MediaQueryData(textScaler: TextScaler.linear(2)),
            child: SizedBox(
              width: 266,
              child: TRSelect<String>(
                items: <TRSelectItem<String>>[
                  TRSelectItem(
                    value: 'ask',
                    label: 'Ask before changes to the workspace',
                  ),
                ],
                defaultValue: 'ask',
              ),
            ),
          ),
        ),
      );

      expect(tester.takeException(), isNull);
      expect(tester.getSize(_trigger).width, 266);
      expect(
        tester
            .widget<Text>(find.text('Ask before changes to the workspace'))
            .overflow,
        TextOverflow.ellipsis,
      );
    },
  );

  testWidgets('intrinsic trigger remains content-sized without a width', (
    tester,
  ) async {
    _sizeViewport(tester, _wide);
    await tester.pumpWidget(
      _app(const TRSelect<String>(items: _items, defaultValue: 'alpha')),
    );

    expect(tester.takeException(), isNull);
    expect(tester.getSize(_trigger).width, lessThan(_wide.width));
  });

  group('surface resolution', () {
    testWidgets(
      'searchable menu can outgrow its trigger and spaces its content',
      (tester) async {
        _sizeViewport(tester, _wide);
        await tester.pumpWidget(
          _app(
            const TRSelect<String>(
              width: 140,
              items: <TRSelectItem<String>>[
                TRSelectItem(
                  value: 'alpha',
                  label: 'Alpha',
                  description: 'Primary rack permission',
                ),
                TRSelectItem(value: 'beta', label: 'Beta'),
              ],
              searchable: true,
            ),
          ),
        );

        await tester.tap(_trigger);
        await tester.pumpAndSettle();

        final layer = find.ancestor(
          of: find.byType(TRTextField),
          matching: find.byWidgetPredicate(
            (widget) => widget.runtimeType.toString() == 'TRLayerSurface',
          ),
        );
        final firstOption = find.widgetWithText(MenuItemButton, 'Alpha');
        expect(tester.getSize(layer).width, TRMeasurements.measureLg);
        expect(tester.getSize(layer).width, greaterThan(140));
        expect(
          tester.getTopLeft(firstOption).dy -
              tester.getBottomLeft(find.byType(TRTextField)).dy,
          TRSpacing.small * 2 + TRSpacing.threeExtraSmall,
        );
        expect(
          find.descendant(of: layer, matching: find.byType(TRSeparator)),
          findsOneWidget,
        );
        expect(
          tester.getSize(find.byType(TRSeparator)).width,
          tester.getSize(layer).width - TRControlMetrics.borderWidth * 2,
        );

        final button = tester.widget<MenuItemButton>(firstOption);
        expect(
          button.style?.padding?.resolve(<WidgetState>{}),
          const EdgeInsets.symmetric(
            horizontal: TRSpacing.small,
            vertical: TRSpacing.extraSmall,
          ),
        );
      },
    );

    testWidgets('renders leading content in the trigger', (tester) async {
      _sizeViewport(tester, _wide);
      await tester.pumpWidget(
        _app(
          const TRSelect<String>(
            items: _items,
            defaultValue: 'alpha',
            leading: Icon(Icons.hub, key: ValueKey('select-leading')),
          ),
        ),
      );

      expect(find.byKey(const ValueKey('select-leading')), findsOneWidget);
      expect(
        find.descendant(of: _trigger, matching: find.byIcon(Icons.hub)),
        findsOneWidget,
      );
    });

    testWidgets('form field forwards leading content to the trigger', (
      tester,
    ) async {
      _sizeViewport(tester, _wide);
      await tester.pumpWidget(
        _app(
          TRSelectFormField<String>(
            items: _items,
            initialValue: 'alpha',
            leading: const Icon(
              Icons.hub,
              key: ValueKey('form-select-leading'),
            ),
          ),
        ),
      );

      expect(find.byKey(const ValueKey('form-select-leading')), findsOneWidget);
    });

    testWidgets('opens a sheet below the small breakpoint', (tester) async {
      _sizeViewport(tester, _narrow);
      await tester.pumpWidget(_app(const TRSelect<String>(items: _items)));

      await tester.tap(_trigger);
      await tester.pumpAndSettle();

      expect(find.byType(TRDrawer), findsOneWidget);
    });

    testWidgets('sheet keeps search fixed while only options scroll', (
      tester,
    ) async {
      _sizeViewport(tester, _narrow);
      await tester.pumpWidget(
        _app(const TRSelect<String>(items: _items, searchable: true)),
      );

      await tester.tap(_trigger);
      await tester.pumpAndSettle();

      final drawer = find.byType(TRDrawer);
      final optionsScroll = find.descendant(
        of: drawer,
        matching: find.byType(SingleChildScrollView),
      );
      expect(optionsScroll, findsOneWidget);
      expect(
        find.ancestor(
          of: find.byType(TRTextField),
          matching: find.byType(SingleChildScrollView),
        ),
        findsNothing,
      );
      expect(
        find.descendant(of: drawer, matching: find.byType(TRSeparator)),
        findsOneWidget,
      );
      expect(
        tester.getSize(find.byType(TRSeparator)).width,
        tester.getSize(drawer).width,
      );
      expect(
        tester.getTopLeft(find.byType(TRSeparator)).dy -
            tester.getBottomLeft(find.byType(TRTextField)).dy,
        TRSpacing.medium,
      );
      expect(tester.getSize(drawer).height, lessThan(_narrow.height / 2));
      final firstOption = find.widgetWithText(MenuItemButton, 'Alpha');
      final button = tester.widget<MenuItemButton>(firstOption);
      expect(
        button.style?.minimumSize?.resolve(<WidgetState>{})?.height,
        TRControlMetrics.heightOf(TRUiSize.xl),
      );
      expect(
        button.style?.padding?.resolve(<WidgetState>{}),
        EdgeInsets.symmetric(
          horizontal: TRSpacing.medium,
          vertical: TRControlMetrics.gapOf(TRUiSize.md),
        ),
      );
      expect(
        find.descendant(
          of: optionsScroll,
          matching: find.widgetWithText(MenuItemButton, 'Alpha'),
        ),
        findsOneWidget,
      );
    });

    testWidgets('compact sheet options keep 48px touch targets', (
      tester,
    ) async {
      _sizeViewport(tester, _narrow);
      await tester.pumpWidget(_app(const TRSelect<String>(items: _items)));

      await tester.tap(_trigger);
      await tester.pumpAndSettle();

      final option = find.widgetWithText(MenuItemButton, 'Alpha');
      final minimumTouchTarget = TRControlMetrics.heightOf(TRUiSize.xl);
      expect(
        tester.getSize(option).height,
        greaterThanOrEqualTo(minimumTouchTarget),
      );
      final button = tester.widget<MenuItemButton>(option);
      expect(
        button.style?.minimumSize?.resolve(<WidgetState>{})?.height,
        greaterThanOrEqualTo(minimumTouchTarget),
      );
      expect(
        button.style?.textStyle?.resolve(<WidgetState>{})?.fontSize,
        TRControlMetrics.fontSizeOf(TRUiSize.md),
      );
    });

    testWidgets('sheet caps long option content at the viewport height', (
      tester,
    ) async {
      _sizeViewport(tester, _narrow);
      await tester.pumpWidget(
        _app(
          TRSelect<int>(
            items: <TRSelectItem<int>>[
              for (var index = 0; index < 40; index += 1)
                TRSelectItem(value: index, label: 'Option $index'),
            ],
            searchable: true,
          ),
        ),
      );

      await tester.tap(_trigger);
      await tester.pumpAndSettle();

      final drawer = find.byType(TRDrawer);
      expect(tester.getSize(drawer).height, lessThanOrEqualTo(_narrow.height));
      expect(
        tester.getRect(find.text('Option 39')).top,
        greaterThanOrEqualTo(tester.getRect(drawer).bottom),
      );

      await tester.ensureVisible(find.text('Option 39'));
      await tester.pumpAndSettle();
      expect(
        tester.getRect(find.text('Option 39')).bottom,
        lessThanOrEqualTo(tester.getRect(drawer).bottom),
      );
    });

    testWidgets('sheet gives upward trackpad drags to its long option list', (
      tester,
    ) async {
      _sizeViewport(tester, _narrow);
      await tester.pumpWidget(
        _app(
          TRSelect<int>(
            items: <TRSelectItem<int>>[
              for (var index = 0; index < 40; index += 1)
                TRSelectItem(value: index, label: 'Option $index'),
            ],
            searchable: true,
          ),
        ),
      );

      await tester.tap(_trigger);
      await tester.pumpAndSettle();

      final drawer = find.byType(TRDrawer);
      final search = find.byType(TRTextField);
      final optionsScroll = find.descendant(
        of: drawer,
        matching: find.byType(SingleChildScrollView),
      );
      final drawerRect = tester.getRect(drawer);
      final searchRect = tester.getRect(search);
      final position = tester
          .state<ScrollableState>(
            find.descendant(
              of: optionsScroll,
              matching: find.byType(Scrollable),
            ),
          )
          .position;

      await tester.trackpadFling(search, const Offset(0, -300), 1000);
      await tester.pumpAndSettle();

      expect(position.pixels, greaterThan(0));
      expect(tester.getRect(drawer), drawerRect);
      expect(tester.getRect(search), searchRect);
    });

    testWidgets('sheet scrolls back before handing a downward drag to drawer', (
      tester,
    ) async {
      _sizeViewport(tester, _narrow);
      await tester.pumpWidget(
        _app(
          TRSelect<int>(
            items: <TRSelectItem<int>>[
              for (var index = 0; index < 40; index += 1)
                TRSelectItem(value: index, label: 'Option $index'),
            ],
            searchable: true,
          ),
        ),
      );

      await tester.tap(_trigger);
      await tester.pumpAndSettle();

      final drawer = find.byType(TRDrawer);
      final search = find.byType(TRTextField);
      final drawerRect = tester.getRect(drawer);
      final position = tester
          .state<ScrollableState>(
            find.descendant(
              of: find.descendant(
                of: drawer,
                matching: find.byType(SingleChildScrollView),
              ),
              matching: find.byType(Scrollable),
            ),
          )
          .position;
      position.jumpTo(500);
      final startingPixels = position.pixels;

      await tester.trackpadFling(search, const Offset(0, 100), 400);
      await tester.pumpAndSettle();

      expect(position.pixels, greaterThan(0));
      expect(position.pixels, lessThan(startingPixels));
      expect(tester.getRect(drawer), drawerRect);
    });

    testWidgets('sheet hands a downward drag at the top to the drawer', (
      tester,
    ) async {
      _sizeViewport(tester, _narrow);
      await tester.pumpWidget(
        _app(
          TRSelect<int>(
            items: <TRSelectItem<int>>[
              for (var index = 0; index < 40; index += 1)
                TRSelectItem(value: index, label: 'Option $index'),
            ],
            searchable: true,
          ),
        ),
      );

      await tester.tap(_trigger);
      await tester.pumpAndSettle();
      final search = find.byType(TRTextField);
      final startingRect = tester.getRect(search);
      final searchCenter = tester.getCenter(search);
      final gesture = await tester.startGesture(
        searchCenter,
        kind: PointerDeviceKind.trackpad,
      );
      await gesture.panZoomUpdate(searchCenter, pan: const Offset(0, 120));
      await tester.pump();
      await gesture.panZoomUpdate(searchCenter, pan: const Offset(0, 240));
      await tester.pump();

      expect(tester.getRect(search).top, greaterThan(startingRect.top));
      await gesture.panZoomEnd();
      await tester.pumpAndSettle();
    });

    testWidgets('sheet forwards a wheel over its fixed search to options', (
      tester,
    ) async {
      _sizeViewport(tester, _narrow);
      await tester.pumpWidget(
        _app(
          TRSelect<int>(
            items: <TRSelectItem<int>>[
              for (var index = 0; index < 40; index += 1)
                TRSelectItem(value: index, label: 'Option $index'),
            ],
            searchable: true,
          ),
        ),
      );

      await tester.tap(_trigger);
      await tester.pumpAndSettle();
      final drawer = find.byType(TRDrawer);
      final search = find.byType(TRTextField);
      final drawerRect = tester.getRect(drawer);
      final position = tester
          .state<ScrollableState>(
            find.descendant(
              of: find.descendant(
                of: drawer,
                matching: find.byType(SingleChildScrollView),
              ),
              matching: find.byType(Scrollable),
            ),
          )
          .position;

      await tester.sendEventToBinding(
        PointerScrollEvent(
          position: tester.getCenter(search),
          scrollDelta: const Offset(0, 300),
        ),
      );
      await tester.pumpAndSettle();

      expect(position.pixels, greaterThan(0));
      expect(tester.getRect(drawer), drawerRect);
    });

    testWidgets('opens a dropdown at the small breakpoint', (tester) async {
      // The breakpoint is the first width that keeps the dropdown, so the
      // exact boundary is asserted rather than a comfortably wide viewport.
      _sizeViewport(tester, const Size(TRBreakpoints.small, 800));
      await tester.pumpWidget(_app(const TRSelect<String>(items: _items)));

      await tester.tap(_trigger);
      await tester.pumpAndSettle();

      expect(find.byType(TRDrawer), findsNothing);
      expect(find.widgetWithText(MenuItemButton, 'Gamma'), findsOneWidget);
    });

    testWidgets('opens a sheet for comfortable density on a wide viewport', (
      tester,
    ) async {
      _sizeViewport(tester, _wide);
      await tester.pumpWidget(
        _app(
          _withDensity(
            TRUiDensity.comfortable,
            const TRSelect<String>(items: _items, searchable: true),
          ),
        ),
      );

      await tester.tap(_trigger);
      await tester.pumpAndSettle();

      expect(find.byType(TRDrawer), findsOneWidget);
      final option = tester.widget<MenuItemButton>(
        find.widgetWithText(MenuItemButton, 'Alpha'),
      );
      expect(
        tester.getSize(find.widgetWithText(MenuItemButton, 'Alpha')).height,
        TRControlMetrics.heightOf(TRUiSize.xl),
      );
      expect(
        option.style?.minimumSize?.resolve(<WidgetState>{})?.height,
        TRControlMetrics.heightOf(TRUiSize.xl),
      );
      expect(
        option.style?.padding?.resolve(<WidgetState>{}),
        EdgeInsets.symmetric(
          horizontal: TRControlMetrics.inlinePaddingOf(TRUiSize.xl),
          vertical: TRControlMetrics.gapOf(TRUiSize.xl),
        ),
      );
      expect(
        option.style?.iconSize?.resolve(<WidgetState>{}),
        TRControlMetrics.iconSizeOf(TRUiSize.xl),
      );
      expect(
        option.style?.textStyle?.resolve(<WidgetState>{})?.fontSize,
        TRControlMetrics.fontSizeOf(TRUiSize.xl),
      );
    });

    testWidgets('opens a dropdown for standard density on a narrow viewport', (
      tester,
    ) async {
      _sizeViewport(tester, _narrow);
      await tester.pumpWidget(
        _app(
          _withDensity(
            TRUiDensity.standard,
            const TRSelect<String>(items: _items),
          ),
        ),
      );

      await tester.tap(_trigger);
      await tester.pumpAndSettle();

      expect(find.byType(TRDrawer), findsNothing);
      expect(find.widgetWithText(MenuItemButton, 'Gamma'), findsOneWidget);
    });

    testWidgets('honours an explicit menu surface on a narrow viewport', (
      tester,
    ) async {
      _sizeViewport(tester, _narrow);
      await tester.pumpWidget(
        _app(
          const TRSelect<String>(items: _items, surface: TRSelectSurface.menu),
        ),
      );

      await tester.tap(_trigger);
      await tester.pumpAndSettle();

      expect(find.byType(TRDrawer), findsNothing);
      expect(find.widgetWithText(MenuItemButton, 'Gamma'), findsOneWidget);
    });

    testWidgets('honours an explicit sheet surface on a wide viewport', (
      tester,
    ) async {
      _sizeViewport(tester, _wide);
      await tester.pumpWidget(
        _app(
          const TRSelect<String>(items: _items, surface: TRSelectSurface.sheet),
        ),
      );

      await tester.tap(_trigger);
      await tester.pumpAndSettle();

      expect(find.byType(TRDrawer), findsOneWidget);
    });

    testWidgets('attaches item keys on dropdown and sheet surfaces', (
      tester,
    ) async {
      const keyedItems = <TRSelectItem<String>>[
        TRSelectItem<String>(
          key: ValueKey('select-option-alpha'),
          value: 'alpha',
          label: 'Alpha',
        ),
      ];
      _sizeViewport(tester, _wide);
      await tester.pumpWidget(_app(const TRSelect<String>(items: keyedItems)));

      await tester.tap(_trigger);
      await tester.pumpAndSettle();
      expect(find.byKey(const ValueKey('select-option-alpha')), findsOneWidget);

      await tester.tap(find.text('Alpha').last);
      await tester.pumpAndSettle();
      tester.view.physicalSize = _narrow;
      await tester.pumpWidget(_app(const TRSelect<String>(items: keyedItems)));
      await tester.tap(_trigger);
      await tester.pumpAndSettle();

      expect(find.byType(TRDrawer), findsOneWidget);
      expect(find.byKey(const ValueKey('select-option-alpha')), findsOneWidget);
    });

    testWidgets('keeps descriptions in options but out of the trigger', (
      tester,
    ) async {
      const describedItems = <TRSelectItem<String>>[
        TRSelectItem<String>(
          value: 'alpha',
          label: 'Alpha',
          description: 'Primary rack',
        ),
      ];
      _sizeViewport(tester, _wide);
      await tester.pumpWidget(
        _app(
          const TRSelect<String>(items: describedItems, defaultValue: 'alpha'),
        ),
      );

      expect(
        find.descendant(of: _trigger, matching: find.text('Alpha')),
        findsOneWidget,
      );
      expect(
        find.descendant(of: _trigger, matching: find.text('Primary rack')),
        findsNothing,
      );

      await tester.tap(_trigger);
      await tester.pumpAndSettle();
      expect(find.text('Primary rack'), findsOneWidget);

      await tester.tap(find.text('Alpha').last);
      await tester.pumpAndSettle();
      tester.view.physicalSize = _narrow;
      await tester.pumpWidget(
        _app(const TRSelect<String>(items: describedItems)),
      );
      await tester.tap(_trigger);
      await tester.pumpAndSettle();

      expect(find.byType(TRDrawer), findsOneWidget);
      expect(find.text('Primary rack'), findsOneWidget);
    });

    testWidgets('keeps the surface it opened with across a resize', (
      tester,
    ) async {
      _sizeViewport(tester, _narrow);
      await tester.pumpWidget(_app(const TRSelect<String>(items: _items)));

      await tester.tap(_trigger);
      await tester.pumpAndSettle();
      expect(find.byType(TRDrawer), findsOneWidget);

      tester.view.physicalSize = _wide;
      await tester.pumpAndSettle();

      expect(
        find.byType(TRDrawer),
        findsOneWidget,
        reason:
            'swapping surfaces under an open select would lose the '
            'user place in the list',
      );
    });
  });

  group('sheet behaviour', () {
    testWidgets('commits a chosen value and closes', (tester) async {
      _sizeViewport(tester, _narrow);
      String? value;
      await tester.pumpWidget(
        _app(
          StatefulBuilder(
            builder: (context, setState) => TRSelect<String>.controlled(
              items: _items,
              value: value,
              placeholder: 'Choose one',
              onValueChange: (next) => setState(() => value = next),
            ),
          ),
        ),
      );

      await tester.tap(_trigger);
      await tester.pumpAndSettle();
      await tester.tap(find.text('Beta').last);
      await tester.pumpAndSettle();

      expect(value, 'beta');
      expect(find.byType(TRDrawer), findsNothing);
      expect(find.text('Beta'), findsOneWidget);
    });

    testWidgets('commits an explicit null option', (tester) async {
      _sizeViewport(tester, _narrow);
      String? value = 'en';
      var changes = 0;
      await tester.pumpWidget(
        _app(
          StatefulBuilder(
            builder: (context, setState) => TRSelect<String?>.controlled(
              items: const [
                TRSelectItem<String?>(value: null, label: 'System default'),
                TRSelectItem<String?>(value: 'en', label: 'English'),
              ],
              value: value,
              onValueChange: (next) => setState(() {
                changes += 1;
                value = next;
              }),
            ),
          ),
        ),
      );

      await tester.tap(_trigger);
      await tester.pumpAndSettle();
      await tester.tap(find.text('System default').last);
      await tester.pumpAndSettle();

      expect(changes, 1);
      expect(find.text('System default'), findsOneWidget);
    });

    testWidgets('leaves the value untouched when dismissed', (tester) async {
      _sizeViewport(tester, _narrow);
      var changes = 0;
      await tester.pumpWidget(
        _app(
          TRSelect<String>(
            items: _items,
            defaultValue: 'alpha',
            onValueChange: (_) => changes += 1,
          ),
        ),
      );

      await tester.tap(_trigger);
      await tester.pumpAndSettle();
      // The sheet snaps to 80% of the viewport, so the top of the screen is
      // barrier rather than content.
      await tester.tapAt(const Offset(200, 20));
      await tester.pumpAndSettle();

      expect(find.byType(TRDrawer), findsNothing);
      expect(changes, 0);
      expect(find.text('Alpha'), findsOneWidget);
    });

    testWidgets('reports open and close once per round trip', (tester) async {
      _sizeViewport(tester, _narrow);
      var opens = 0;
      var closes = 0;
      await tester.pumpWidget(
        _app(
          TRSelect<String>(
            items: _items,
            onOpen: () => opens += 1,
            onClose: () => closes += 1,
          ),
        ),
      );

      await tester.tap(_trigger);
      await tester.pumpAndSettle();
      expect(opens, 1);
      expect(closes, 0);

      await tester.tap(find.text('Alpha').last);
      await tester.pumpAndSettle();
      expect(closes, 1);
    });

    testWidgets('hands the assistive surface to the sheet and takes it back', (
      tester,
    ) async {
      _sizeViewport(tester, _narrow);
      final handle = tester.ensureSemantics();
      await tester.pumpWidget(_app(const TRSelect<String>(items: _items)));

      expect(_triggerHasExpandedState(tester), isTrue);
      expect(_triggerIsExpanded(tester), isFalse);

      await tester.tap(_trigger);
      await tester.pumpAndSettle();
      // The sheet is a modal route, so it blocks the semantics of everything
      // beneath it. The expanded trigger is not the thing to announce here;
      // the dialog that replaced it is.
      expect(
        tester
            .getSemantics(
              find
                  .descendant(
                    of: find.byType(TRDrawer),
                    matching: find.byType(Semantics),
                  )
                  .first,
            )
            .role,
        SemanticsRole.dialog,
      );

      await tester.tap(find.text('Alpha').last);
      await tester.pumpAndSettle();
      expect(_triggerHasExpandedState(tester), isTrue);
      expect(_triggerIsExpanded(tester), isFalse);
      handle.dispose();
    });

    testWidgets('does not open when disabled or read-only', (tester) async {
      _sizeViewport(tester, _narrow);
      await tester.pumpWidget(
        _app(
          const Column(
            children: [
              TRSelect<String>(items: _items, enabled: false),
              TRSelect<String>(items: _items, readOnly: true),
            ],
          ),
        ),
      );

      await tester.tap(_trigger.first);
      await tester.pumpAndSettle();
      expect(find.byType(TRDrawer), findsNothing);

      await tester.tap(_trigger.last);
      await tester.pumpAndSettle();
      expect(find.byType(TRDrawer), findsNothing);
    });

    testWidgets('validates and saves through a form field', (tester) async {
      _sizeViewport(tester, _narrow);
      final formKey = GlobalKey<FormState>();
      String? saved;
      await tester.pumpWidget(
        _app(
          Form(
            key: formKey,
            child: TRSelectFormField<String>(
              items: _items,
              initialValue: 'alpha',
              onSaved: (value) => saved = value,
              validator: (value) => value == 'beta' ? null : 'Choose Beta',
            ),
          ),
        ),
      );

      expect(formKey.currentState!.validate(), isFalse);
      await tester.pump();

      await tester.tap(_trigger);
      await tester.pumpAndSettle();
      await tester.tap(find.text('Beta').last);
      await tester.pumpAndSettle();

      expect(formKey.currentState!.validate(), isTrue);
      formKey.currentState!.save();
      expect(saved, 'beta');
    });
  });
}

SemanticsNode _triggerSemantics(WidgetTester tester) => tester.getSemantics(
  find.ancestor(of: _trigger, matching: find.byType(Semantics)).first,
);

/// Whether the trigger annotation carries an expanded state at all.
bool _triggerHasExpandedState(WidgetTester tester) =>
    _triggerSemantics(tester).flagsCollection.isExpanded != Tristate.none;

bool _triggerIsExpanded(WidgetTester tester) =>
    _triggerSemantics(tester).flagsCollection.isExpanded == Tristate.isTrue;
