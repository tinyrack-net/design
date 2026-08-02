import 'dart:async';
import 'dart:ui' show SemanticsAction;

import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:intl/intl.dart';
import 'package:tinyrack_ui/tinyrack_ui.dart';

void main() {
  group('anchored layers', () {
    testWidgets('popover controller opens, Escape closes, and focus restores', (
      tester,
    ) async {
      final controller = TRPopoverController();
      final focusNode = FocusNode();
      addTearDown(controller.dispose);
      addTearDown(focusNode.dispose);
      await tester.pumpWidget(
        _app(
          Focus(
            focusNode: focusNode,
            child: TRPopover(
              controller: controller,
              trigger: const Text('Details'),
              content: const Text('Popover content'),
            ),
          ),
        ),
      );
      focusNode.requestFocus();
      await tester.pump();
      controller.open();
      await tester.pumpAndSettle();
      expect(find.text('Popover content'), findsOneWidget);
      await tester.sendKeyEvent(LogicalKeyboardKey.escape);
      await tester.pumpAndSettle();
      expect(find.text('Popover content'), findsNothing);
      expect(focusNode.hasFocus, isTrue);
    });

    testWidgets('tooltip honors provider hover delays', (tester) async {
      await tester.pumpWidget(
        _app(
          const TRTooltipProvider(
            openDelay: Duration(milliseconds: 200),
            child: TRTooltip(
              message: 'Refresh rack',
              width: 160,
              child: Text('Refresh'),
            ),
          ),
        ),
      );
      expect(tester.widget<TRTooltip>(find.byType(TRTooltip)).width, 160);
      final gesture = await tester.createGesture(kind: PointerDeviceKind.mouse);
      addTearDown(gesture.removePointer);
      await gesture.addPointer(location: Offset.zero);
      await gesture.moveTo(tester.getCenter(find.text('Refresh')));
      await tester.pump(const Duration(milliseconds: 199));
      expect(find.text('Refresh rack'), findsNothing);
      await tester.pump(const Duration(milliseconds: 1));
      await tester.pump();
      expect(find.text('Refresh rack'), findsOneWidget);
    });

    testWidgets('preview card keeps its interactive surface open on hover', (
      tester,
    ) async {
      await tester.pumpWidget(
        _app(
          const TRPreviewCard(
            openDelay: Duration.zero,
            closeDelay: Duration(milliseconds: 100),
            trigger: Text('Rack alpha'),
            content: Text('Healthy services'),
          ),
        ),
      );
      final gesture = await tester.createGesture(kind: PointerDeviceKind.mouse);
      addTearDown(gesture.removePointer);
      await gesture.addPointer(location: Offset.zero);
      await gesture.moveTo(tester.getCenter(find.text('Rack alpha')));
      await tester.pumpAndSettle();
      expect(find.text('Healthy services'), findsOneWidget);
      await gesture.moveTo(tester.getCenter(find.text('Healthy services')));
      await tester.pump(const Duration(milliseconds: 120));
      expect(find.text('Healthy services'), findsOneWidget);
    });
  });

  group('typed inputs', () {
    testWidgets('autocomplete keeps input focus while pointer hovers options', (
      tester,
    ) async {
      final controller = TRAutocompleteController<String>();
      var selectionCount = 0;
      addTearDown(controller.dispose);
      await tester.pumpWidget(
        _app(
          TRAutocomplete<String>(
            controller: controller,
            items: const [
              TRAutocompleteItem(value: 'alpha', label: 'Alpha'),
              TRAutocompleteItem(value: 'alpine', label: 'Alpine'),
            ],
            onSelected: (_) => selectionCount += 1,
          ),
        ),
      );

      await tester.enterText(find.byType(TextFormField), 'al');
      await tester.pumpAndSettle();
      expect(find.text('Alpha'), findsOneWidget);

      final pointer = await tester.createGesture(kind: PointerDeviceKind.mouse);
      addTearDown(pointer.removePointer);
      await pointer.addPointer(location: Offset.zero);
      await pointer.moveTo(tester.getCenter(find.text('Alpha')));
      await tester.pumpAndSettle();

      expect(controller.focusNode.hasFocus, isTrue);
      expect(find.text('Alpha'), findsOneWidget);
      await tester.tap(find.text('Alpha'));
      await tester.pumpAndSettle();
      expect(selectionCount, 1);
      expect(controller.value, 'alpha');
    });

    testWidgets('autocomplete highlights and selects options with arrow keys', (
      tester,
    ) async {
      final controller = TRAutocompleteController<String>();
      addTearDown(controller.dispose);
      await tester.pumpWidget(
        _app(
          TRAutocomplete<String>(
            controller: controller,
            items: const [
              TRAutocompleteItem(value: 'alpha', label: 'Alpha'),
              TRAutocompleteItem(value: 'alpine', label: 'Alpine'),
            ],
          ),
        ),
      );

      await tester.enterText(find.byType(TextFormField), 'al');
      await tester.pumpAndSettle();
      await tester.sendKeyEvent(LogicalKeyboardKey.arrowDown);
      await tester.pump();

      final highlighted = tester.widget<MenuItemButton>(
        find.widgetWithText(MenuItemButton, 'Alpine'),
      );
      expect(
        highlighted.style?.side?.resolve(const {}),
        isNot(const BorderSide(color: Colors.transparent)),
      );

      await tester.testTextInput.receiveAction(TextInputAction.done);
      await tester.pumpAndSettle();
      expect(controller.value, 'alpine');
      expect(controller.query, 'Alpine');
      expect(find.text('Alpha'), findsNothing);
    });

    testWidgets('autocomplete Escape and Tab follow React focus behavior', (
      tester,
    ) async {
      final controller = TRAutocompleteController<String>();
      final nextFocus = FocusNode();
      String? selected;
      addTearDown(controller.dispose);
      addTearDown(nextFocus.dispose);
      await tester.pumpWidget(
        _app(
          Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TRAutocomplete<String>(
                controller: controller,
                items: const [
                  TRAutocompleteItem(value: 'alpha', label: 'Alpha'),
                  TRAutocompleteItem(value: 'alpine', label: 'Alpine'),
                ],
                onSelected: (value) => selected = value,
              ),
              TextButton(
                focusNode: nextFocus,
                onPressed: () {},
                child: const Text('Next control'),
              ),
            ],
          ),
        ),
      );

      await tester.enterText(find.byType(TextFormField), 'al');
      await tester.pumpAndSettle();
      await tester.sendKeyEvent(LogicalKeyboardKey.escape);
      await tester.pumpAndSettle();
      expect(find.text('Alpha'), findsNothing);
      expect(controller.focusNode.hasFocus, isTrue);

      await tester.enterText(find.byType(TextFormField), 'alp');
      await tester.pumpAndSettle();
      await tester.sendKeyEvent(LogicalKeyboardKey.arrowDown);
      await tester.sendKeyEvent(LogicalKeyboardKey.tab);
      await tester.pumpAndSettle();
      expect(nextFocus.hasFocus, isTrue);
      expect(find.text('Alpha'), findsNothing);
      expect(controller.query, 'alp');
      expect(selected, isNull);
    });

    testWidgets('autocomplete scrolls the keyboard highlight into view', (
      tester,
    ) async {
      final controller = TRAutocompleteController<int>();
      addTearDown(controller.dispose);
      await tester.pumpWidget(
        _app(
          TRAutocomplete<int>(
            controller: controller,
            items: [
              for (var index = 0; index < 20; index += 1)
                TRAutocompleteItem(value: index, label: 'Item $index'),
            ],
          ),
        ),
      );

      await tester.enterText(find.byType(TextFormField), 'Item');
      await tester.pumpAndSettle();
      for (var index = 0; index < 15; index += 1) {
        await tester.sendKeyEvent(LogicalKeyboardKey.arrowDown);
        await tester.pump();
      }
      await tester.pumpAndSettle();

      final scrollable = tester.state<ScrollableState>(
        find.byType(Scrollable).last,
      );
      expect(scrollable.position.pixels, greaterThan(0));
      await tester.testTextInput.receiveAction(TextInputAction.done);
      await tester.pumpAndSettle();
      expect(controller.value, 15);
      expect(controller.query, 'Item 15');
    });

    testWidgets('autocomplete discards a stale asynchronous response', (
      tester,
    ) async {
      final oldRequest = Completer<Iterable<TRAutocompleteItem<String>>>();
      final newRequest = Completer<Iterable<TRAutocompleteItem<String>>>();
      await tester.pumpWidget(
        _app(
          TRAutocomplete<String>(
            optionsBuilder: (query) =>
                query == 'n' ? oldRequest.future : newRequest.future,
          ),
        ),
      );
      await tester.enterText(find.byType(TextFormField), 'n');
      await tester.pump();
      await tester.enterText(find.byType(TextFormField), 'ne');
      newRequest.complete(const [
        TRAutocompleteItem(value: 'new', label: 'New result'),
      ]);
      await tester.pumpAndSettle();
      oldRequest.complete(const [
        TRAutocompleteItem(value: 'old', label: 'Old result'),
      ]);
      await tester.pumpAndSettle();
      expect(find.text('New result'), findsOneWidget);
      expect(find.text('Old result'), findsNothing);
    });

    testWidgets('single and multi comboboxes update typed selections', (
      tester,
    ) async {
      String? single;
      List<String>? multiple;
      const items = [
        TRComboboxItem(value: 'stable', label: 'Stable'),
        TRComboboxItem(value: 'beta', label: 'Beta'),
      ];
      await tester.pumpWidget(
        _app(
          Column(
            children: [
              TRCombobox<String>(
                items: items,
                onValueChange: (value) => single = value,
              ),
              TRMultiCombobox<String>(
                items: items,
                onValueChange: (value) => multiple = value,
              ),
            ],
          ),
        ),
      );
      await tester.tap(find.byType(TextFormField).first);
      await tester.enterText(find.byType(TextFormField).first, 'Bet');
      await tester.pumpAndSettle();
      await tester.tap(find.text('Beta').last);
      await tester.pumpAndSettle();
      expect(single, 'beta');

      await tester.tap(find.byType(TextFormField).last);
      await tester.enterText(find.byType(TextFormField).last, 'Sta');
      await tester.pumpAndSettle();
      await tester.tap(find.text('Stable').last);
      await tester.pumpAndSettle();
      expect(multiple, ['stable']);
      expect(find.byType(InputChip), findsOneWidget);
    });

    testWidgets('number field formats by locale and supports keyboard steps', (
      tester,
    ) async {
      double? value;
      await tester.pumpWidget(
        _app(
          TRNumberField(
            defaultValue: 1234.5,
            numberFormat: NumberFormat.decimalPattern('de_DE'),
            onValueChange: (next) => value = next,
          ),
        ),
      );
      final field = find.byType(TextField).first;
      expect(
        tester.widget<TextField>(field).controller!.text,
        contains('1.234'),
      );
      await tester.tap(field);
      await tester.sendKeyEvent(LogicalKeyboardKey.arrowUp);
      await tester.pump();
      expect(value, 1235.5);
    });

    testWidgets('OTP paste is filtered, limited, and completes once full', (
      tester,
    ) async {
      String? completed;
      await tester.pumpWidget(
        _app(TROtpField(length: 4, onCompleted: (value) => completed = value)),
      );
      await tester.enterText(find.byType(TextField), '12a345');
      await tester.pump();
      expect(completed, '1234');
      expect(find.text('1'), findsOneWidget);
      expect(find.text('4'), findsOneWidget);
    });

    testWidgets('scalar and range sliders enforce values and minimum gap', (
      tester,
    ) async {
      double? scalar;
      RangeValues? range;
      await tester.pumpWidget(
        _app(
          Column(
            children: [
              SizedBox(
                width: 320,
                child: TRSlider(
                  defaultValue: 40,
                  semanticLabel: 'Traffic',
                  onValueChange: (value) => scalar = value,
                ),
              ),
              SizedBox(
                width: 320,
                child: TRRangeSlider(
                  minGap: 20,
                  onValueChange: (value) => range = value,
                ),
              ),
              const TRSlider(vertical: true, enabled: false),
            ],
          ),
        ),
      );
      final semanticsHandle = tester.ensureSemantics();
      await tester.pump();
      final scalarSemantics = tester.getSemantics(find.byType(TRSlider).first);
      expect(scalarSemantics.value, '40');
      expect(scalarSemantics.decreasedValue, '39');
      expect(scalarSemantics.increasedValue, '41');
      expect(
        scalarSemantics.getSemanticsData().hasAction(SemanticsAction.increase),
        isTrue,
      );

      final scalarControl = find.descendant(
        of: find.byType(TRSlider).first,
        matching: find.byType(GestureDetector),
      );
      final scalarRect = tester.getRect(scalarControl);
      final scalarGesture = await tester.startGesture(
        Offset(scalarRect.left + scalarRect.width * 0.4, scalarRect.center.dy),
      );
      await scalarGesture.moveTo(
        Offset(scalarRect.left + scalarRect.width * 0.5, scalarRect.center.dy),
      );
      await scalarGesture.up();
      await tester.pump();
      expect(scalar, 50);

      final rangeControl = find.descendant(
        of: find.byType(TRRangeSlider),
        matching: find.byType(GestureDetector),
      );
      final rangeRect = tester.getRect(rangeControl);
      final gesture = await tester.startGesture(
        Offset(rangeRect.left + rangeRect.width * 0.25, rangeRect.center.dy),
      );
      await gesture.moveTo(
        Offset(rangeRect.left + rangeRect.width * 0.65, rangeRect.center.dy),
      );
      await gesture.up();
      await tester.pump();
      expect(range!.end - range!.start, greaterThanOrEqualTo(20));
      final verticalSize = tester.getSize(find.byType(TRSlider).last);
      expect(verticalSize.height, greaterThan(verticalSize.width));
      semanticsHandle.dispose();
    });
  });

  group('forms and navigation', () {
    testWidgets('TRForm collects read-only values and omits disabled values', (
      tester,
    ) async {
      final formKey = GlobalKey<TRFormState>();
      final rack = TextEditingController(text: 'alpha');
      final secret = TextEditingController(text: 'hidden');
      addTearDown(rack.dispose);
      addTearDown(secret.dispose);
      await tester.pumpWidget(
        _app(
          TRForm(
            key: formKey,
            child: Column(
              children: [
                TRTextField(name: 'rack', controller: rack, readOnly: true),
                TRTextField(name: 'secret', controller: secret, enabled: false),
              ],
            ),
          ),
        ),
      );
      expect(formKey.currentState!.values.toMap(), {'rack': 'alpha'});
    });

    testWidgets('tree and file navigation expand and select leaves', (
      tester,
    ) async {
      String? selected;
      await tester.pumpWidget(
        _app(
          TRTreeNav<String>(
            onValueChange: (value) => selected = value,
            items: const [
              TRTreeNavGroup(
                value: 'group',
                label: Text('Group'),
                children: [TRTreeNavLeaf(value: 'leaf', label: Text('Leaf'))],
              ),
            ],
          ),
        ),
      );
      await tester.tap(find.text('Group'));
      await tester.pumpAndSettle();
      expect(
        tester.getTopLeft(find.text('Leaf')).dx -
            tester.getTopLeft(find.text('Group')).dx,
        moreOrLessEquals(9),
      );
      await tester.tap(find.text('Leaf'));
      expect(selected, 'leaf');
    });

    testWidgets('app shell switches between desktop and mobile navigation', (
      tester,
    ) async {
      final controller = TRAppShellController();
      addTearDown(controller.dispose);
      await tester.binding.setSurfaceSize(const Size(1200, 700));
      addTearDown(() => tester.binding.setSurfaceSize(null));
      await tester.pumpWidget(
        _app(
          TRAppShell(
            controller: controller,
            sidebar: const Text('Desktop navigation'),
            mobileDrawer: const Text('Mobile navigation'),
            body: const Text('Page'),
          ),
        ),
      );
      expect(find.text('Desktop navigation'), findsOneWidget);
      await tester.binding.setSurfaceSize(const Size(390, 700));
      controller.openMobileNavigation();
      await tester.pumpAndSettle();
      expect(find.text('Mobile navigation'), findsOneWidget);
    });
  });

  group('system and menu compositions', () {
    testWidgets('alert dialog ignores backdrop and returns a typed result', (
      tester,
    ) async {
      bool? result;
      await tester.pumpWidget(
        _app(
          Builder(
            builder: (context) => TRButton(
              onPressed: () async {
                result = await showTRAlertDialog<bool>(
                  context: context,
                  builder: (context) => TRAlertDialog(
                    title: const Text('Delete?'),
                    actions: [
                      TRButton(
                        onPressed: () => Navigator.pop(context, true),
                        child: const Text('Confirm'),
                      ),
                    ],
                  ),
                );
              },
              child: const Text('Open'),
            ),
          ),
        ),
      );
      await tester.tap(find.text('Open'));
      await tester.pumpAndSettle();
      await tester.tapAt(const Offset(2, 2));
      await tester.pumpAndSettle();
      expect(find.text('Delete?'), findsOneWidget);
      await tester.tap(find.text('Confirm'));
      await tester.pumpAndSettle();
      expect(result, isTrue);
    });

    testWidgets(
      'alert dialog actions preserve the button contract and restore focus',
      (tester) async {
        final triggerFocusNode = FocusNode();
        addTearDown(triggerFocusNode.dispose);
        const referenceKey = ValueKey('reference-button');
        const actionKey = ValueKey('dialog-action');

        await tester.pumpWidget(
          _app(
            Builder(
              builder: (context) => Column(
                children: [
                  TRButton(
                    key: referenceKey,
                    appearance: TRAppearance.outline,
                    onPressed: () {},
                    child: const Text('Confirm'),
                  ),
                  TRButton(
                    focusNode: triggerFocusNode,
                    onPressed: () => showTRAlertDialog<void>(
                      context: context,
                      builder: (dialogContext) => TRAlertDialog(
                        title: const Text('Delete?'),
                        actions: [
                          TRButton(
                            key: actionKey,
                            appearance: TRAppearance.outline,
                            onPressed: () => Navigator.pop(dialogContext),
                            child: const Text('Confirm'),
                          ),
                        ],
                      ),
                    ),
                    child: const Text('Open'),
                  ),
                ],
              ),
            ),
          ),
        );
        triggerFocusNode.requestFocus();
        await tester.pump();
        await tester.tap(find.text('Open'));
        await tester.pumpAndSettle();

        final referenceRect = tester.getRect(find.byKey(referenceKey));
        final actionRect = tester.getRect(find.byKey(actionKey));
        expect(actionRect.size, referenceRect.size);
        final referenceLabelRect = tester.getRect(
          find.descendant(
            of: find.byKey(referenceKey),
            matching: find.text('Confirm'),
          ),
        );
        final actionLabelRect = tester.getRect(
          find.descendant(
            of: find.byKey(actionKey),
            matching: find.text('Confirm'),
          ),
        );
        expect(
          actionLabelRect.center - actionRect.center,
          referenceLabelRect.center - referenceRect.center,
        );

        await tester.sendKeyEvent(LogicalKeyboardKey.escape);
        await tester.pumpAndSettle();
        expect(find.text('Delete?'), findsNothing);
        expect(triggerFocusNode.hasFocus, isTrue);

        await tester.tap(find.text('Open'));
        await tester.pumpAndSettle();
        await tester.binding.handlePopRoute();
        await tester.pumpAndSettle();
        expect(find.text('Delete?'), findsNothing);
        expect(triggerFocusNode.hasFocus, isTrue);
      },
    );

    testWidgets('alert dialog wraps actions and keeps disabled actions inert', (
      tester,
    ) async {
      await tester.binding.setSurfaceSize(const Size(300, 420));
      addTearDown(() => tester.binding.setSurfaceSize(null));
      const cancelKey = ValueKey('cancel-action');
      const deleteKey = ValueKey('delete-action');

      await tester.pumpWidget(
        _app(
          Builder(
            builder: (context) => TRButton(
              onPressed: () => showTRAlertDialog<void>(
                context: context,
                builder: (dialogContext) => TRAlertDialog(
                  title: const Text('Delete?'),
                  actions: [
                    const TRButton(
                      key: cancelKey,
                      appearance: TRAppearance.outline,
                      onPressed: null,
                      child: Text('Keep this rack'),
                    ),
                    TRButton(
                      key: deleteKey,
                      intent: TRIntent.danger,
                      onPressed: () => Navigator.pop(dialogContext),
                      child: const Text('Delete permanently'),
                    ),
                  ],
                ),
              ),
              child: const Text('Open'),
            ),
          ),
        ),
      );
      await tester.tap(find.text('Open'));
      await tester.pumpAndSettle();

      expect(
        tester.getTopLeft(find.byKey(deleteKey)).dy,
        greaterThan(tester.getTopLeft(find.byKey(cancelKey)).dy),
      );
      await tester.tap(find.byKey(cancelKey));
      await tester.pumpAndSettle();
      expect(find.text('Delete?'), findsOneWidget);
      await tester.tap(find.byKey(deleteKey));
      await tester.pumpAndSettle();
      expect(find.text('Delete?'), findsNothing);
    });

    testWidgets('drawer route supports four placements and typed results', (
      tester,
    ) async {
      String? result;
      await tester.pumpWidget(
        _app(
          Builder(
            builder: (context) => TRButton(
              onPressed: () async {
                result = await showTRDrawer<String>(
                  context: context,
                  placement: TRDrawerPlacement.end,
                  builder: (context) => TRDrawer(
                    placement: TRDrawerPlacement.end,
                    content: TRButton(
                      onPressed: () => Navigator.pop(context, 'done'),
                      child: const Text('Done'),
                    ),
                  ),
                );
              },
              child: const Text('Open drawer'),
            ),
          ),
        ),
      );
      await tester.tap(find.text('Open drawer'));
      await tester.pumpAndSettle();
      await tester.tap(find.text('Done'));
      await tester.pumpAndSettle();
      expect(result, 'done');
    });

    testWidgets('toast queue caps, updates, and dismisses notifications', (
      tester,
    ) async {
      final controller = TRToastController(maxVisible: 2);
      addTearDown(controller.dispose);
      await tester.pumpWidget(
        _app(TRToastRegion(controller: controller, child: const Text('Page'))),
      );
      controller.show(const TRToastData(title: Text('One')));
      final handle = controller.show(const TRToastData(title: Text('Two')));
      controller.show(const TRToastData(title: Text('Three')));
      await tester.pump();
      expect(find.text('One'), findsNothing);
      expect(find.text('Three'), findsOneWidget);
      handle.update(const TRToastData(title: Text('Updated')));
      await tester.pump();
      expect(find.text('Updated'), findsOneWidget);
      controller.dismissAll();
      await tester.pump();
      expect(find.text('Updated'), findsNothing);
    });

    testWidgets('context menu, menubar, toolbar, and scroll area compose', (
      tester,
    ) async {
      final contextMenuController = MenuController();
      await tester.pumpWidget(
        _app(
          Column(
            children: [
              TRContextMenu(
                controller: contextMenuController,
                menuChildren: [
                  TRMenuItem(
                    onPressed: () {},
                    child: const Text('Context action'),
                  ),
                ],
                child: const SizedBox(
                  width: 100,
                  height: 40,
                  child: Text('Target'),
                ),
              ),
              TRMenubar(
                menus: [
                  TRMenubarMenu(
                    trigger: const Text('File'),
                    menuChildren: [
                      TRMenuItem(onPressed: () {}, child: const Text('New')),
                    ],
                  ),
                ],
              ),
              TRToolbar(
                children: [
                  TRToolbarButton(onPressed: () {}, child: const Text('Save')),
                ],
              ),
              const SizedBox(
                height: 60,
                child: TRScrollArea(child: Text('Scrollable content')),
              ),
            ],
          ),
        ),
      );
      await tester.tapAt(
        tester.getCenter(find.text('Target')),
        buttons: kSecondaryMouseButton,
      );
      await tester.pumpAndSettle();
      expect(find.text('Context action'), findsOneWidget);
      contextMenuController.close();
      await tester.pumpAndSettle();
      await tester.tap(find.text('File'));
      await tester.pumpAndSettle();
      expect(find.text('New'), findsOneWidget);
      expect(find.text('Save'), findsOneWidget);
      expect(find.text('Scrollable content'), findsOneWidget);
    });
  });
}

Widget _app(Widget child, {Locale locale = const Locale('en')}) => MaterialApp(
  debugShowCheckedModeBanner: false,
  locale: locale,
  supportedLocales: [locale],
  theme: TinyrackTheme.light(),
  home: Scaffold(body: Center(child: child)),
);
