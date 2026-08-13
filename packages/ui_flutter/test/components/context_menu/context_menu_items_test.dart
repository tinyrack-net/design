import 'package:flutter/gestures.dart';
import 'package:material_ui/material_ui.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:tinyrack_ui/tinyrack_ui.dart';

Widget _app(Widget child) => MaterialApp(
  theme: TinyrackTheme.light(),
  home: Scaffold(body: child),
);

/// Records what it was asked to present instead of opening anything, which is
/// how a test observes a menu that an operating system would otherwise draw
/// outside the Flutter tree.
final class _RecordingPresenter implements TRContextMenuPresenter {
  final openings = <List<TRMenuElement>>[];
  final positions = <Offset>[];

  @override
  Widget buildHost({
    required Widget child,
    required TRMenuElementsBuilder itemsBuilder,
    required TRContextMenuController controller,
    required bool enabled,
    required bool useRootOverlay,
    VoidCallback? onOpen,
    VoidCallback? onClose,
  }) => _RecordingHost(
    presenter: this,
    controller: controller,
    itemsBuilder: itemsBuilder,
    onOpen: onOpen,
    child: child,
  );
}

final class _RecordingHost extends StatefulWidget {
  const _RecordingHost({
    required this.presenter,
    required this.controller,
    required this.itemsBuilder,
    required this.child,
    this.onOpen,
  });

  final _RecordingPresenter presenter;
  final TRContextMenuController controller;
  final TRMenuElementsBuilder itemsBuilder;
  final Widget child;
  final VoidCallback? onOpen;

  @override
  State<_RecordingHost> createState() => _RecordingHostState();
}

final class _RecordingHostState extends State<_RecordingHost>
    implements TRContextMenuHost {
  @override
  void initState() {
    super.initState();
    widget.controller.attach(this);
  }

  @override
  void dispose() {
    widget.controller.detach(this);
    super.dispose();
  }

  @override
  void openAt(Offset globalPosition) {
    widget.presenter.openings.add(widget.itemsBuilder(context));
    widget.presenter.positions.add(globalPosition);
    widget.onOpen?.call();
  }

  @override
  void close() {}

  @override
  bool get isOpen => false;

  @override
  Widget build(BuildContext context) => widget.child;
}

void main() {
  group('TRMenuElement', () {
    test('an action carries the fields a system menu can render', () {
      var pressed = 0;
      final action = TRMenuActionElement(
        id: 'copy',
        title: 'Copy',
        onPressed: () => pressed += 1,
        icon: Icons.copy,
        shortcut: const SingleActivator(LogicalKeyboardKey.keyC, control: true),
        enabled: false,
        checked: true,
      );

      expect(action.id, 'copy');
      expect(action.title, 'Copy');
      expect(action.enabled, isFalse);
      expect(action.checked, isTrue);
      action.onPressed();
      expect(pressed, 1);
    });

    test('an action defaults to enabled, unchecked, and unadorned', () {
      const action = TRMenuActionElement(id: 'a', title: 'A', onPressed: _noop);

      expect(action.enabled, isTrue);
      expect(action.checked, isNull);
      expect(action.icon, isNull);
      expect(action.shortcut, isNull);
    });

    test('a submenu nests further elements', () {
      const submenu = TRMenuSubmenuElement(
        title: 'More',
        children: <TRMenuElement>[
          TRMenuActionElement(id: 'a', title: 'A', onPressed: _noop),
          TRMenuSeparatorElement(),
        ],
      );

      expect(submenu.children, hasLength(2));
      expect(submenu.children.last, isA<TRMenuSeparatorElement>());
    });
  });

  group('TRContextMenu.items', () {
    testWidgets('Flutter-rendered rows inherit comfortable density', (
      tester,
    ) async {
      await tester.pumpWidget(
        _app(
          const TRUiDensityScope(
            density: TRUiDensity.comfortable,
            child: TRContextMenu.items(
              items: <TRMenuElement>[
                TRMenuActionElement(
                  id: 'copy',
                  title: 'Copy',
                  onPressed: _noop,
                ),
              ],
              child: SizedBox(width: 100, height: 40, child: Text('Target')),
            ),
          ),
        ),
      );

      await tester.tapAt(
        tester.getCenter(find.text('Target')),
        buttons: kSecondaryMouseButton,
      );
      await tester.pumpAndSettle();
      final item = find.widgetWithText(MenuItemButton, 'Copy');
      expect(
        tester.getSize(item).height,
        TRControlMetrics.heightOf(TRUiSize.lg),
      );
      expect(
        tester
            .widget<MenuItemButton>(item)
            .style
            ?.textStyle
            ?.resolve({})
            ?.fontSize,
        TRControlMetrics.fontSizeOf(TRUiSize.lg),
      );
    });

    testWidgets('renders each element with its Tinyrack menu component', (
      tester,
    ) async {
      var copied = 0;
      await tester.pumpWidget(
        _app(
          TRContextMenu.items(
            items: <TRMenuElement>[
              TRMenuActionElement(
                id: 'copy',
                title: 'Copy',
                onPressed: () => copied += 1,
              ),
              const TRMenuSeparatorElement(),
              const TRMenuActionElement(
                id: 'paste',
                title: 'Paste',
                enabled: false,
                onPressed: _noop,
              ),
              const TRMenuActionElement(
                id: 'wrap',
                title: 'Wrap lines',
                checked: true,
                onPressed: _noop,
              ),
              const TRMenuSubmenuElement(
                title: 'More',
                children: <TRMenuElement>[
                  TRMenuActionElement(
                    id: 'clear',
                    title: 'Clear',
                    onPressed: _noop,
                  ),
                ],
              ),
            ],
            child: const SizedBox(
              width: 100,
              height: 40,
              child: Text('Target'),
            ),
          ),
        ),
      );

      await tester.tapAt(
        tester.getCenter(find.text('Target')),
        buttons: kSecondaryMouseButton,
      );
      await tester.pumpAndSettle();

      // TRMenuSubmenu presents its own trigger item, so each element is found
      // by the id it declared rather than by a count of item types.
      expect(find.byKey(const ValueKey<String>('copy')), findsOneWidget);
      expect(find.byType(TRMenuSeparator), findsOneWidget);
      expect(find.byType(TRMenuCheckboxItem), findsOneWidget);
      expect(find.byType(TRMenuSubmenu), findsOneWidget);
      expect(
        tester
            .widget<TRMenuItem>(find.byKey(const ValueKey<String>('paste')))
            .onPressed,
        isNull,
        reason: 'a disabled element must not present a pressable item',
      );
      expect(
        tester
            .widget<TRMenuCheckboxItem>(find.byType(TRMenuCheckboxItem))
            .value,
        isTrue,
      );

      await tester.tap(find.text('Copy'));
      await tester.pumpAndSettle();
      expect(copied, 1);
    });

    testWidgets('opens for the keyboard context-menu request', (tester) async {
      await tester.pumpWidget(
        _app(
          TRContextMenu.items(
            items: const <TRMenuElement>[
              TRMenuActionElement(id: 'a', title: 'Alpha', onPressed: _noop),
            ],
            child: const SizedBox(
              width: 100,
              height: 40,
              child: Text('Target'),
            ),
          ),
        ),
      );

      // The shortcut lives on the menu's own focus node, which a user reaches
      // by tabbing to the target.
      await tester.sendKeyEvent(LogicalKeyboardKey.tab);
      await tester.pumpAndSettle();
      await tester.sendKeyEvent(LogicalKeyboardKey.contextMenu);
      await tester.pumpAndSettle();

      expect(find.text('Alpha'), findsOneWidget);
    });

    testWidgets('a controller opens the menu at a caller-chosen position', (
      tester,
    ) async {
      final controller = TRContextMenuController();
      final presenter = _RecordingPresenter();
      await tester.pumpWidget(
        _app(
          TRContextMenuPresenterScope(
            presenter: presenter,
            child: TRContextMenu.items(
              menuController: controller,
              items: const <TRMenuElement>[
                TRMenuActionElement(id: 'a', title: 'Alpha', onPressed: _noop),
              ],
              child: const SizedBox(
                width: 100,
                height: 40,
                child: Text('Target'),
              ),
            ),
          ),
        ),
      );

      controller.openAt(const Offset(12, 34));
      await tester.pump();

      expect(presenter.positions, <Offset>[const Offset(12, 34)]);
      expect(presenter.openings.single, hasLength(1));
    });
  });

  group('TRContextMenuPresenterScope', () {
    testWidgets('an installed presenter receives the elements and position', (
      tester,
    ) async {
      final presenter = _RecordingPresenter();
      await tester.pumpWidget(
        _app(
          TRContextMenuPresenterScope(
            presenter: presenter,
            child: TRContextMenu.items(
              items: const <TRMenuElement>[
                TRMenuActionElement(
                  id: 'copy',
                  title: 'Copy',
                  onPressed: _noop,
                ),
                TRMenuSeparatorElement(),
              ],
              child: const SizedBox(
                width: 100,
                height: 40,
                child: Text('Target'),
              ),
            ),
          ),
        ),
      );

      final target = tester.getCenter(find.text('Target'));
      await tester.tapAt(target, buttons: kSecondaryMouseButton);
      await tester.pumpAndSettle();

      expect(presenter.positions, <Offset>[target]);
      expect(presenter.openings.single.first, isA<TRMenuActionElement>());
      expect(find.byType(TRMenuItem), findsNothing);
    });

    testWidgets('the Flutter presenter is the default', (tester) async {
      late TRContextMenuPresenter resolved;
      await tester.pumpWidget(
        _app(
          Builder(
            builder: (context) {
              resolved = TRContextMenuPresenterScope.of(context);
              return const SizedBox.shrink();
            },
          ),
        ),
      );

      expect(resolved, isA<TRFlutterContextMenuPresenter>());
    });

    testWidgets('the widget-children menu ignores an installed presenter', (
      tester,
    ) async {
      final presenter = _RecordingPresenter();
      await tester.pumpWidget(
        _app(
          TRContextMenuPresenterScope(
            presenter: presenter,
            child: TRContextMenu(
              menuChildren: [
                TRMenuItem(onPressed: () {}, child: const Text('Widget item')),
              ],
              child: const SizedBox(
                width: 100,
                height: 40,
                child: Text('Target'),
              ),
            ),
          ),
        ),
      );

      await tester.tapAt(
        tester.getCenter(find.text('Target')),
        buttons: kSecondaryMouseButton,
      );
      await tester.pumpAndSettle();

      expect(
        find.text('Widget item'),
        findsOneWidget,
        reason: 'arbitrary widgets cannot be handed to a system menu',
      );
      expect(presenter.openings, isEmpty);
    });
  });
}

void _noop() {}
