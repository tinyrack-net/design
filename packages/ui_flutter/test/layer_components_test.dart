import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:tinyrack_ui/tinyrack_ui.dart';
// ignore: implementation_imports
import 'package:tinyrack_ui/src/internal/layer.dart';

Finder get _selectTriggers => find.descendant(
  of: find.byWidgetPredicate((widget) => widget is TRSelect),
  matching: find.byType(TextButton),
);

Finder _layerBoundary(TRLayerBoundaryKind kind) => find.byWidgetPredicate(
  (widget) => widget is TRLayerBoundary && widget.kind == kind,
);

Widget _app(Widget child, {double? width, TextDirection? textDirection}) {
  final body = width == null
      ? child
      : Align(
          alignment: Alignment.topLeft,
          child: SizedBox(width: width, child: child),
        );
  return MaterialApp(
    theme: TinyrackTheme.light(),
    builder: textDirection == null
        ? null
        : (context, child) =>
              Directionality(textDirection: textDirection, child: child!),
    home: Scaffold(body: body),
  );
}

void main() {
  group('TRMenu', () {
    testWidgets('opens, activates a command, and restores trigger focus', (
      tester,
    ) async {
      final triggerFocus = FocusNode();
      addTearDown(triggerFocus.dispose);
      var activations = 0;
      await tester.pumpWidget(
        _app(
          TRMenu(
            focusNode: triggerFocus,
            trigger: const Text('Actions'),
            menuChildren: [
              TRMenuItem(
                onPressed: () => activations += 1,
                child: const Text('Duplicate'),
              ),
            ],
          ),
        ),
      );

      await tester.tap(find.text('Actions'));
      await tester.pumpAndSettle();
      expect(find.text('Duplicate'), findsOneWidget);

      await tester.tap(find.text('Duplicate'));
      await tester.pumpAndSettle();
      expect(activations, 1);
      expect(find.text('Duplicate'), findsNothing);
      expect(triggerFocus.hasFocus, isTrue);
    });

    testWidgets('checkbox and radio settings remain open by default', (
      tester,
    ) async {
      var checked = false;
      var selected = 'comfortable';
      await tester.pumpWidget(
        _app(
          StatefulBuilder(
            builder: (context, setState) => TRMenu(
              trigger: const Text('View'),
              menuChildren: [
                TRMenuCheckboxItem(
                  value: checked,
                  onChanged: (value) => setState(() => checked = value!),
                  child: const Text('Show grid'),
                ),
                TRMenuRadioItem<String>(
                  value: 'compact',
                  groupValue: selected,
                  onChanged: (value) => setState(() => selected = value!),
                  child: const Text('Compact'),
                ),
              ],
            ),
          ),
        ),
      );

      await tester.tap(find.text('View'));
      await tester.pumpAndSettle();
      await tester.tap(find.text('Show grid'));
      await tester.pumpAndSettle();
      expect(checked, isTrue);
      expect(find.text('Compact'), findsOneWidget);

      await tester.tap(find.text('Compact'));
      await tester.pumpAndSettle();
      expect(selected, 'compact');
      expect(find.text('Show grid'), findsOneWidget);
    });

    testWidgets('supports keyboard opening, escape, and disabled items', (
      tester,
    ) async {
      final triggerFocus = FocusNode();
      addTearDown(triggerFocus.dispose);
      var disabledActivations = 0;
      await tester.pumpWidget(
        _app(
          TRMenu(
            focusNode: triggerFocus,
            trigger: const Text('Keyboard menu'),
            menuChildren: [
              TRMenuItem(onPressed: null, child: const Text('Unavailable')),
              TRMenuItem(
                onPressed: () => disabledActivations += 1,
                child: const Text('Available'),
              ),
            ],
          ),
        ),
      );

      triggerFocus.requestFocus();
      await tester.pump();
      await tester.sendKeyEvent(LogicalKeyboardKey.enter);
      await tester.pumpAndSettle();
      expect(find.text('Unavailable'), findsOneWidget);
      await tester.tap(find.text('Unavailable'));
      expect(disabledActivations, 0);
      await tester.sendKeyEvent(LogicalKeyboardKey.escape);
      await tester.pumpAndSettle();
      expect(find.text('Unavailable'), findsNothing);
      expect(triggerFocus.hasFocus, isTrue);
    });

    testWidgets('opens submenus in RTL', (tester) async {
      await tester.pumpWidget(
        _app(
          TRMenu(
            trigger: const Text('More'),
            menuChildren: [
              TRMenuSubmenu(
                menuChildren: [
                  TRMenuItem(
                    onPressed: () {},
                    child: const Text('Nested command'),
                  ),
                ],
                child: const Text('Nested'),
              ),
            ],
          ),
          textDirection: TextDirection.rtl,
        ),
      );

      await tester.tap(find.text('More'));
      await tester.pumpAndSettle();
      await tester.tap(find.text('Nested'));
      await tester.pumpAndSettle();
      expect(find.text('Nested command'), findsOneWidget);
    });

    testWidgets('reports open and outside-click close', (tester) async {
      var opens = 0;
      var closes = 0;
      await tester.pumpWidget(
        _app(
          Stack(
            fit: StackFit.expand,
            children: [
              Align(
                alignment: Alignment.topLeft,
                child: TRMenu(
                  onOpen: () => opens += 1,
                  onClose: () => closes += 1,
                  trigger: const Text('Tracked menu'),
                  menuChildren: [
                    TRMenuItem(onPressed: () {}, child: const Text('Command')),
                  ],
                ),
              ),
              const Positioned(bottom: 0, right: 0, child: Text('Outside')),
            ],
          ),
        ),
      );

      await tester.tap(find.text('Tracked menu'));
      await tester.pumpAndSettle();
      expect(opens, 1);
      await tester.tap(find.text('Outside'));
      await tester.pumpAndSettle();
      expect(closes, 1);
      expect(find.text('Command'), findsNothing);
    });

    testWidgets('matches the canonical 192 by 112 layer geometry', (
      tester,
    ) async {
      await tester.pumpWidget(
        _app(
          TRMenu(
            trigger: const Text('View'),
            menuChildren: [
              const TRMenuGroupLabel(child: Text('Layout')),
              TRMenuCheckboxItem(
                value: true,
                onChanged: (_) {},
                child: const Text('Show grid'),
              ),
              TRMenuRadioItem<String>(
                value: 'compact',
                groupValue: 'compact',
                onChanged: (_) {},
                child: const Text('Compact'),
              ),
            ],
          ),
        ),
      );

      await tester.tap(find.text('View'));
      await tester.pumpAndSettle();
      expect(
        tester.getSize(_layerBoundary(TRLayerBoundaryKind.menu)),
        const Size(192, 112),
      );
    });
  });

  group('TRSelect', () {
    const items = [
      TRSelectItem(value: 'alpha', label: 'Alpha'),
      TRSelectItem(value: 'beta', label: 'Beta'),
      TRSelectItem(value: 'disabled', label: 'Disabled', enabled: false),
    ];

    testWidgets('keeps a controlled null until its parent updates', (
      tester,
    ) async {
      String? change;
      await tester.pumpWidget(
        _app(
          TRSelect<String>.controlled(
            items: items,
            value: null,
            placeholder: 'Choose one',
            onValueChange: (value) => change = value,
          ),
        ),
      );

      await tester.tap(_selectTriggers);
      await tester.pumpAndSettle();
      await tester.tap(find.text('Beta').last);
      await tester.pumpAndSettle();
      expect(change, 'beta');
      expect(find.text('Choose one'), findsOneWidget);
    });

    testWidgets('renders and selects an explicit null-valued option', (
      tester,
    ) async {
      String? value;
      await tester.pumpWidget(
        _app(
          StatefulBuilder(
            builder: (context, setState) => TRSelect<String?>.controlled(
              items: const [
                TRSelectItem<String?>(value: null, label: 'System default'),
                TRSelectItem<String?>(value: 'en', label: 'English'),
              ],
              value: value,
              placeholder: 'Choose one',
              onValueChange: (next) => setState(() => value = next),
            ),
          ),
        ),
      );

      expect(find.text('System default'), findsOneWidget);
      expect(find.text('Choose one'), findsNothing);

      await tester.tap(_selectTriggers);
      await tester.pumpAndSettle();
      await tester.tap(find.text('English').last);
      await tester.pumpAndSettle();
      expect(value, 'en');

      await tester.tap(_selectTriggers);
      await tester.pumpAndSettle();
      await tester.tap(find.text('System default').last);
      await tester.pumpAndSettle();
      expect(value, isNull);
      expect(find.text('System default'), findsOneWidget);
    });

    testWidgets('accepts external controlled updates', (tester) async {
      String? value;
      await tester.pumpWidget(
        _app(
          StatefulBuilder(
            builder: (context, setState) => TRSelect<String>.controlled(
              items: items,
              value: value,
              onValueChange: (next) => setState(() => value = next),
            ),
          ),
        ),
      );

      await tester.tap(_selectTriggers);
      await tester.pumpAndSettle();
      await tester.tap(find.text('Alpha').last);
      await tester.pumpAndSettle();
      expect(value, 'alpha');
      expect(find.text('Alpha'), findsOneWidget);
    });

    testWidgets('participates in validation, save, and reset', (tester) async {
      final formKey = GlobalKey<FormState>();
      String? saved;
      await tester.pumpWidget(
        _app(
          Form(
            key: formKey,
            child: TRSelectFormField<String>(
              items: items,
              initialValue: 'alpha',
              onSaved: (value) => saved = value,
              validator: (value) => value == 'beta' ? null : 'Choose Beta',
            ),
          ),
        ),
      );

      expect(formKey.currentState!.validate(), isFalse);
      await tester.pump();
      expect(find.text('Choose Beta'), findsOneWidget);
      await tester.tap(_selectTriggers);
      await tester.pumpAndSettle();
      await tester.tap(find.text('Beta').last);
      await tester.pumpAndSettle();
      expect(formKey.currentState!.validate(), isTrue);
      formKey.currentState!.save();
      expect(saved, 'beta');

      formKey.currentState!.reset();
      await tester.pump();
      expect(find.text('Alpha'), findsOneWidget);
    });

    testWidgets('does not open when disabled or read-only', (tester) async {
      final disabledController = MenuController();
      final readOnlyController = MenuController();
      await tester.pumpWidget(
        _app(
          Column(
            children: [
              TRSelect<String>(
                items: items,
                enabled: false,
                menuController: disabledController,
              ),
              TRSelect<String>(
                items: items,
                readOnly: true,
                menuController: readOnlyController,
              ),
            ],
          ),
        ),
      );

      await tester.tap(_selectTriggers.first);
      await tester.pump();
      expect(disabledController.isOpen, isFalse);
      await tester.tap(_selectTriggers.last);
      await tester.pump();
      expect(readOnlyController.isOpen, isFalse);
    });

    testWidgets('supports keyboard selection and narrow viewports', (
      tester,
    ) async {
      final focusNode = FocusNode();
      addTearDown(focusNode.dispose);
      String? value;
      await tester.binding.setSurfaceSize(const Size(240, 360));
      addTearDown(() => tester.binding.setSurfaceSize(null));
      await tester.pumpWidget(
        _app(
          TRSelect<String>(
            items: items,
            focusNode: focusNode,
            width: 220,
            onValueChange: (next) => value = next,
          ),
          width: 240,
        ),
      );

      focusNode.requestFocus();
      await tester.pump();
      await tester.sendKeyEvent(LogicalKeyboardKey.enter);
      await tester.pumpAndSettle();
      await tester.sendKeyEvent(LogicalKeyboardKey.arrowDown);
      await tester.sendKeyEvent(LogicalKeyboardKey.enter);
      await tester.pumpAndSettle();
      expect(value, 'alpha');
    });

    testWidgets('uses a 500ms prefix buffer for typeahead selection', (
      tester,
    ) async {
      final focusNode = FocusNode();
      addTearDown(focusNode.dispose);
      String? value;
      await tester.pumpWidget(
        _app(
          TRSelect<String>(
            items: items,
            focusNode: focusNode,
            onValueChange: (next) => value = next,
          ),
        ),
      );

      focusNode.requestFocus();
      await tester.pump();
      await tester.sendKeyEvent(LogicalKeyboardKey.keyB, character: 'b');
      await tester.pumpAndSettle();
      await tester.sendKeyEvent(LogicalKeyboardKey.enter);
      await tester.pumpAndSettle();
      expect(value, 'beta');
      expect(focusNode.hasFocus, isTrue);
    });

    testWidgets('matches trigger sizes and canonical popup geometry', (
      tester,
    ) async {
      final controller = MenuController();
      await tester.pumpWidget(
        _app(
          Column(
            children: [
              for (final size in TRUiSize.values)
                TRSelect<String>.controlled(
                  items: const [
                    TRSelectItem(
                      value: 'stable',
                      label: 'Stable',
                      trailing: Icon(Icons.check, size: 16),
                    ),
                    TRSelectItem(value: 'beta', label: 'Beta'),
                  ],
                  value: 'stable',
                  menuController: size == TRUiSize.md ? controller : null,
                  uiSize: size,
                  width: 320,
                ),
            ],
          ),
        ),
      );

      expect(tester.getSize(_selectTriggers.at(0)), const Size(320, 32));
      expect(tester.getSize(_selectTriggers.at(1)), const Size(320, 40));
      expect(tester.getSize(_selectTriggers.at(2)), const Size(320, 48));
      final triggerRect = tester.getRect(_selectTriggers.at(1));
      controller.open();
      await tester.pumpAndSettle();
      expect(
        tester.getSize(_layerBoundary(TRLayerBoundaryKind.select)),
        const Size(320, 86),
      );
      final layerRect = tester.getRect(
        _layerBoundary(TRLayerBoundaryKind.select),
      );
      expect(layerRect.top - triggerRect.bottom, 4);
    });

    testWidgets('flips above when the preferred bottom side has no room', (
      tester,
    ) async {
      final controller = MenuController();
      await tester.pumpWidget(
        _app(
          Align(
            alignment: Alignment.bottomLeft,
            child: TRSelect<String>.controlled(
              items: const [
                TRSelectItem(value: 'alpha', label: 'Alpha'),
                TRSelectItem(value: 'beta', label: 'Beta'),
              ],
              value: 'alpha',
              menuController: controller,
              width: 320,
            ),
          ),
        ),
      );

      final triggerRect = tester.getRect(_selectTriggers);
      controller.open();
      await tester.pumpAndSettle();
      final layerRect = tester.getRect(
        _layerBoundary(TRLayerBoundaryKind.select),
      );

      expect(triggerRect.top - layerRect.bottom, 4);
    });

    testWidgets(
      'reports opening and selection close with its internal controller',
      (tester) async {
        var opens = 0;
        var closes = 0;
        await tester.pumpWidget(
          _app(
            TRSelect<String>(
              items: items,
              onOpen: () => opens += 1,
              onClose: () => closes += 1,
            ),
          ),
        );

        await tester.tap(_selectTriggers);
        await tester.pumpAndSettle();
        expect(opens, 1);
        await tester.tap(find.text('Alpha').last);
        await tester.pumpAndSettle();
        expect(closes, 1);
      },
    );

    testWidgets('restores a form field value', (tester) async {
      await tester.pumpWidget(
        MaterialApp(
          restorationScopeId: 'app',
          theme: TinyrackTheme.light(),
          home: Scaffold(
            body: Form(
              child: TRSelectFormField<String>(
                restorationId: 'channel',
                initialValue: 'alpha',
                items: items,
              ),
            ),
          ),
        ),
      );

      await tester.tap(_selectTriggers);
      await tester.pumpAndSettle();
      await tester.tap(find.text('Beta').last);
      await tester.pumpAndSettle();
      expect(find.text('Beta'), findsOneWidget);

      await tester.restartAndRestore();
      expect(find.text('Beta'), findsOneWidget);
    });
  });

  group('TRDialog', () {
    testWidgets('returns a typed result and restores focus', (tester) async {
      final triggerFocus = FocusNode();
      addTearDown(triggerFocus.dispose);
      Future<String?>? result;
      await tester.pumpWidget(
        _app(
          Builder(
            builder: (context) => TextButton(
              focusNode: triggerFocus,
              onPressed: () {
                result = showTRDialog<String>(
                  context: context,
                  builder: (dialogContext) => TRDialog(
                    title: const Text('Confirm deployment'),
                    content: const Text('This action is reversible.'),
                    actions: TextButton(
                      onPressed: () => Navigator.pop(dialogContext, 'confirm'),
                      child: const Text('Confirm'),
                    ),
                  ),
                );
              },
              child: const Text('Open dialog'),
            ),
          ),
        ),
      );

      triggerFocus.requestFocus();
      await tester.tap(find.text('Open dialog'));
      await tester.pumpAndSettle();
      expect(find.text('Confirm deployment'), findsOneWidget);
      await tester.tap(find.text('Confirm'));
      await tester.pumpAndSettle();
      expect(await result, 'confirm');
      expect(triggerFocus.hasFocus, isTrue);
    });

    testWidgets('honors a non-dismissible barrier and system back', (
      tester,
    ) async {
      await tester.pumpWidget(
        _app(
          Builder(
            builder: (context) => TextButton(
              onPressed: () => showTRDialog<void>(
                context: context,
                barrierDismissible: false,
                builder: (_) => const TRDialog(content: Text('Protected')),
              ),
              child: const Text('Open protected'),
            ),
          ),
        ),
      );

      await tester.tap(find.text('Open protected'));
      await tester.pumpAndSettle();
      await tester.tapAt(const Offset(4, 4));
      await tester.pumpAndSettle();
      expect(find.text('Protected'), findsOneWidget);
      await tester.binding.handlePopRoute();
      await tester.pumpAndSettle();
      expect(find.text('Protected'), findsNothing);
    });

    testWidgets('resolves logical start and end placement in RTL', (
      tester,
    ) async {
      await tester.binding.setSurfaceSize(const Size(800, 600));
      addTearDown(() => tester.binding.setSurfaceSize(null));
      await tester.pumpWidget(
        _app(
          const TRDialog(
            placement: TRDialogPlacement.start,
            content: Text('Start'),
          ),
          textDirection: TextDirection.rtl,
        ),
      );

      final startSurface = find.descendant(
        of: find.byType(TRDialog),
        matching: find.byWidgetPredicate(
          (widget) => widget is Material && widget.type == MaterialType.card,
        ),
      );
      expect(tester.getCenter(startSurface).dx, greaterThan(400));
      await tester.pumpWidget(
        _app(
          const TRDialog(
            placement: TRDialogPlacement.end,
            content: Text('End'),
          ),
          textDirection: TextDirection.rtl,
        ),
      );
      final endSurface = find.descendant(
        of: find.byType(TRDialog),
        matching: find.byWidgetPredicate(
          (widget) => widget is Material && widget.type == MaterialType.card,
        ),
      );
      expect(tester.getCenter(endSurface).dx, lessThan(400));
    });

    testWidgets('supports nested menu and select layers', (tester) async {
      await tester.pumpWidget(
        _app(
          Builder(
            builder: (context) => TextButton(
              onPressed: () => showTRDialog<void>(
                context: context,
                builder: (_) => TRDialog(
                  title: const Text('Layer settings'),
                  content: Column(
                    children: [
                      TRMenu(
                        trigger: const Text('Open nested menu'),
                        menuChildren: [
                          TRMenuItem(
                            onPressed: () {},
                            child: const Text('Nested item'),
                          ),
                        ],
                      ),
                      const TRSelect<String>(
                        items: [TRSelectItem(value: 'one', label: 'One')],
                      ),
                    ],
                  ),
                ),
              ),
              child: const Text('Open layers'),
            ),
          ),
        ),
      );

      await tester.tap(find.text('Open layers'));
      await tester.pumpAndSettle();
      await tester.tap(find.text('Open nested menu'));
      await tester.pumpAndSettle();
      expect(find.text('Nested item'), findsOneWidget);
      await tester.sendKeyEvent(LogicalKeyboardKey.escape);
      await tester.pumpAndSettle();
      expect(find.text('Layer settings'), findsOneWidget);
    });

    testWidgets('uses a closed focus loop', (tester) async {
      final first = FocusNode();
      final second = FocusNode();
      addTearDown(first.dispose);
      addTearDown(second.dispose);
      await tester.pumpWidget(
        _app(
          Builder(
            builder: (context) => TextButton(
              onPressed: () => showTRDialog<void>(
                context: context,
                builder: (_) => TRDialog(
                  title: const Text('Focus loop'),
                  actions: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      TextButton(
                        focusNode: first,
                        onPressed: () {},
                        child: const Text('First'),
                      ),
                      TextButton(
                        focusNode: second,
                        onPressed: () {},
                        child: const Text('Second'),
                      ),
                    ],
                  ),
                ),
              ),
              child: const Text('Open focus loop'),
            ),
          ),
        ),
      );

      await tester.tap(find.text('Open focus loop'));
      await tester.pumpAndSettle();
      first.requestFocus();
      await tester.pump();
      await tester.sendKeyEvent(LogicalKeyboardKey.tab);
      await tester.pump();
      expect(second.hasFocus, isTrue);
      await tester.sendKeyEvent(LogicalKeyboardKey.tab);
      await tester.pump();
      expect(first.hasFocus, isTrue);
    });

    testWidgets('honors safe areas and reduced motion', (tester) async {
      addTearDown(tester.view.reset);
      tester.view.padding = FakeViewPadding(
        top: tester.view.devicePixelRatio * 40,
      );
      await tester.pumpWidget(
        MaterialApp(
          theme: TinyrackTheme.light(),
          home: MediaQuery(
            data: const MediaQueryData(
              disableAnimations: true,
              size: Size(800, 600),
            ),
            child: Scaffold(
              body: Builder(
                builder: (context) => TextButton(
                  onPressed: () => showTRDialog<void>(
                    context: context,
                    builder: (_) => const TRDialog(
                      placement: TRDialogPlacement.top,
                      content: Text('Safe dialog'),
                    ),
                  ),
                  child: const Text('Open safe dialog'),
                ),
              ),
            ),
          ),
        ),
      );

      await tester.tap(find.text('Open safe dialog'));
      await tester.pump();
      expect(find.text('Safe dialog'), findsOneWidget);
      final route = ModalRoute.of(tester.element(find.text('Safe dialog')))!;
      expect(route.transitionDuration, Duration.zero);
      expect(
        tester
            .getTopLeft(
              find.descendant(
                of: find.byType(TRDialog),
                matching: find.byWidgetPredicate(
                  (widget) =>
                      widget is Material && widget.type == MaterialType.card,
                ),
              ),
            )
            .dy,
        greaterThanOrEqualTo(40),
      );
    });
  });
}
