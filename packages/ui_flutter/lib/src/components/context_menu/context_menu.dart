import 'dart:async';

import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../../generated/tokens.g.dart';
import '../../internal/layer.dart';
import '../../tokens.dart';
import '../menu/menu.dart';
import 'menu_model.dart';

export 'menu_model.dart';

/// Builds the elements a context menu shows when it is about to open.
typedef TRMenuElementsBuilder =
    List<TRMenuElement> Function(BuildContext context);

/// The operations one presented context menu supports.
///
/// A presenter's host implements this so [TRContextMenuController] can reach
/// whatever is actually showing the menu, which may be an operating-system menu
/// with no presence in the widget tree.
abstract interface class TRContextMenuHost {
  /// Opens the menu at [globalPosition], in global logical pixels.
  void openAt(Offset globalPosition);

  /// Closes the menu if it is open.
  void close();

  /// Whether the menu is showing.
  bool get isOpen;
}

/// Opens a [TRContextMenu] from code.
///
/// A surface that consumes the secondary pointer button itself, such as a
/// terminal reporting mouse events, needs this to open the menu at a position
/// it chose. Attach one controller to one [TRContextMenu].
final class TRContextMenuController {
  TRContextMenuHost? _host;

  /// Binds [host] as the menu this controller drives.
  ///
  /// Presenters call this while building; callers do not.
  void attach(TRContextMenuHost host) => _host = host;

  /// Unbinds [host], ignoring a host that has already been replaced.
  void detach(TRContextMenuHost host) {
    if (identical(_host, host)) _host = null;
  }

  /// Opens the menu at [globalPosition], in global logical pixels.
  void openAt(Offset globalPosition) => _host?.openAt(globalPosition);

  /// Closes the menu if it is open.
  ///
  /// A menu the operating system drew is dismissed by the operating system, so
  /// this reaches only a menu Flutter is drawing.
  void close() => _host?.close();

  /// Whether the menu is showing.
  bool get isOpen => _host?.isOpen ?? false;
}

/// Presents the elements of a [TRContextMenu].
///
/// The default presentation is [TRFlutterContextMenuPresenter], which draws the
/// menu with Tinyrack components inside the app's own overlay. An application
/// that wants the operating system to draw the menu installs a different
/// presenter through [TRContextMenuPresenterScope] at its composition root.
///
/// A presenter does not detect the context gesture. [TRContextMenu] owns that
/// contract so every presentation opens on the same pointer and keyboard
/// requests, then drives the host the presenter attached.
abstract interface class TRContextMenuPresenter {
  /// Wraps [child] in whatever the presentation needs and attaches its host to
  /// [controller].
  ///
  /// [itemsBuilder] runs each time the menu opens, so an element can reflect
  /// state that changed since the previous opening.
  Widget buildHost({
    required Widget child,
    required TRMenuElementsBuilder itemsBuilder,
    required TRContextMenuController controller,
    required bool enabled,
    required bool useRootOverlay,
    VoidCallback? onOpen,
    VoidCallback? onClose,
  });
}

/// Installs the [TRContextMenuPresenter] every enclosed [TRContextMenu] uses.
class TRContextMenuPresenterScope extends InheritedWidget {
  const TRContextMenuPresenterScope({
    required this.presenter,
    required super.child,
    super.key,
  });

  final TRContextMenuPresenter presenter;

  /// The presenter installed above [context], or the Flutter presentation.
  static TRContextMenuPresenter of(BuildContext context) =>
      context
          .dependOnInheritedWidgetOfExactType<TRContextMenuPresenterScope>()
          ?.presenter ??
      const TRFlutterContextMenuPresenter();

  @override
  bool updateShouldNotify(TRContextMenuPresenterScope oldWidget) =>
      presenter != oldWidget.presenter;
}

// @tinyrack-preview context-menu
/// Opens menu items at a pointer or keyboard context-menu position.
///
/// The default constructor takes widgets and always draws them with Flutter,
/// because arbitrary widgets cannot be handed to an operating-system menu. Use
/// [TRContextMenu.items] to describe the menu as [TRMenuElement]s, which the
/// installed [TRContextMenuPresenter] may present natively.
class TRContextMenu extends StatefulWidget {
  const TRContextMenu({
    required this.child,
    required this.menuChildren,
    this.controller,
    this.menuController,
    this.enabled = true,
    this.onClose,
    this.onOpen,
    this.useRootOverlay = true,
    super.key,
  }) : items = null,
       itemsBuilder = null;

  /// Opens [items] through the presenter installed above this widget.
  const TRContextMenu.items({
    required this.child,
    required List<TRMenuElement> this.items,
    this.menuController,
    this.enabled = true,
    this.onClose,
    this.onOpen,
    this.useRootOverlay = true,
    super.key,
  }) : menuChildren = const <Widget>[],
       itemsBuilder = null,
       controller = null;

  /// Opens the elements [itemsBuilder] returns on each opening.
  const TRContextMenu.itemsBuilder({
    required this.child,
    required TRMenuElementsBuilder this.itemsBuilder,
    this.menuController,
    this.enabled = true,
    this.onClose,
    this.onOpen,
    this.useRootOverlay = true,
    super.key,
  }) : menuChildren = const <Widget>[],
       items = null,
       controller = null;

  final Widget child;

  /// The contents of the widget-based constructor, always drawn by Flutter.
  final List<Widget> menuChildren;

  /// The described contents, or `null` for the widget-based constructor.
  final List<TRMenuElement>? items;

  /// Builds the described contents on each opening.
  final TRMenuElementsBuilder? itemsBuilder;

  /// Drives the widget-based constructor's Flutter menu.
  final MenuController? controller;

  /// Opens and closes the menu from code, whichever presentation is installed.
  final TRContextMenuController? menuController;

  final bool enabled;
  final VoidCallback? onClose;
  final VoidCallback? onOpen;
  final bool useRootOverlay;

  @override
  State<TRContextMenu> createState() => _TRContextMenuState();
}

/// Requests the menu from the keyboard context-menu keys only, so the default
/// Enter and Space [ActivateIntent] mapping keeps belonging to the child.
final class _ContextMenuKeyboardIntent extends Intent {
  const _ContextMenuKeyboardIntent();
}

class _TRContextMenuState extends State<TRContextMenu> {
  late final TRContextMenuController _internalController =
      TRContextMenuController();
  TRContextMenuController get _controller =>
      widget.menuController ?? _internalController;

  bool get _isDescribed => widget.items != null || widget.itemsBuilder != null;

  List<TRMenuElement> _items(BuildContext context) =>
      widget.itemsBuilder?.call(context) ?? widget.items ?? const [];

  void _openAt(Offset globalPosition) {
    if (!widget.enabled) return;
    _controller.openAt(globalPosition);
  }

  @override
  Widget build(BuildContext context) {
    // Arbitrary widgets have no system-menu representation, so the widget-based
    // constructor stays on the Flutter presentation whatever is installed.
    final host = _isDescribed
        ? TRContextMenuPresenterScope.of(context).buildHost(
            child: widget.child,
            itemsBuilder: _items,
            controller: _controller,
            enabled: widget.enabled,
            useRootOverlay: widget.useRootOverlay,
            onOpen: widget.onOpen,
            onClose: widget.onClose,
          )
        : _TRFlutterMenuHost(
            controller: _controller,
            menuController: widget.controller,
            menuChildren: (_) => widget.menuChildren,
            useRootOverlay: widget.useRootOverlay,
            onOpen: widget.onOpen,
            onClose: widget.onClose,
            child: widget.child,
          );

    return FocusableActionDetector(
      enabled: widget.enabled,
      shortcuts: const {
        SingleActivator(LogicalKeyboardKey.contextMenu):
            _ContextMenuKeyboardIntent(),
        SingleActivator(LogicalKeyboardKey.f10, shift: true):
            _ContextMenuKeyboardIntent(),
      },
      actions: {
        _ContextMenuKeyboardIntent: CallbackAction<_ContextMenuKeyboardIntent>(
          onInvoke: (_) {
            final box = context.findRenderObject();
            if (box is! RenderBox) return null;
            // A keyboard request carries no pointer, so the menu hangs from the
            // bottom-left of the target the way a system menu does.
            _openAt(box.localToGlobal(box.size.bottomLeft(Offset.zero)));
            return null;
          },
        ),
      },
      child: GestureDetector(
        behavior: HitTestBehavior.opaque,
        onSecondaryTapDown: widget.enabled
            ? (details) => _openAt(details.globalPosition)
            : null,
        // A long press means "context menu" only for a pointer without a
        // secondary button; a held mouse button must never open it.
        child: GestureDetector(
          behavior: HitTestBehavior.opaque,
          supportedDevices: const {
            PointerDeviceKind.touch,
            PointerDeviceKind.stylus,
          },
          onLongPressStart: widget.enabled
              ? (details) => _openAt(details.globalPosition)
              : null,
          child: host,
        ),
      ),
    );
  }
}

/// Draws a context menu with Tinyrack components inside the app's overlay.
///
/// This is the presentation every platform falls back to, and the only one the
/// widget-based [TRContextMenu] constructor uses.
final class TRFlutterContextMenuPresenter implements TRContextMenuPresenter {
  const TRFlutterContextMenuPresenter();

  @override
  Widget buildHost({
    required Widget child,
    required TRMenuElementsBuilder itemsBuilder,
    required TRContextMenuController controller,
    required bool enabled,
    required bool useRootOverlay,
    VoidCallback? onOpen,
    VoidCallback? onClose,
  }) => _TRFlutterMenuHost(
    controller: controller,
    menuChildren: (context) => trMenuElementWidgets(itemsBuilder(context)),
    useRootOverlay: useRootOverlay,
    onOpen: onOpen,
    onClose: onClose,
    child: child,
  );

  @override
  bool operator ==(Object other) => other is TRFlutterContextMenuPresenter;

  @override
  int get hashCode => (TRFlutterContextMenuPresenter).hashCode;
}

/// Renders [elements] with the Tinyrack menu components.
///
/// A presenter that draws only part of a menu with Flutter reuses this rather
/// than repeating the mapping.
List<Widget> trMenuElementWidgets(List<TRMenuElement> elements) => <Widget>[
  for (final element in elements) _elementWidget(element),
];

Widget _elementWidget(TRMenuElement element) => switch (element) {
  TRMenuSeparatorElement() => const TRMenuSeparator(),
  TRMenuSubmenuElement(:final title, :final icon, :final children) =>
    TRMenuSubmenu(
      leadingIcon: icon == null ? null : Icon(icon),
      menuChildren: trMenuElementWidgets(children),
      child: Text(title),
    ),
  TRMenuActionElement(:final checked?) => TRMenuCheckboxItem(
    key: ValueKey<String>(element.id),
    value: checked,
    onChanged: element.enabled ? (_) => element.onPressed() : null,
    child: Text(element.title),
  ),
  TRMenuActionElement(:final id, :final title, :final icon, :final shortcut) =>
    TRMenuItem(
      key: ValueKey<String>(id),
      leadingIcon: icon == null ? null : Icon(icon),
      onPressed: element.enabled ? element.onPressed : null,
      shortcut: shortcut,
      child: Text(title),
    ),
};

/// Hosts a [MenuAnchor] that opens where the context gesture landed.
class _TRFlutterMenuHost extends StatefulWidget {
  const _TRFlutterMenuHost({
    required this.controller,
    required this.menuChildren,
    required this.useRootOverlay,
    required this.child,
    this.menuController,
    this.onOpen,
    this.onClose,
  });

  final TRContextMenuController controller;
  final MenuController? menuController;
  final List<Widget> Function(BuildContext context) menuChildren;
  final bool useRootOverlay;
  final Widget child;
  final VoidCallback? onOpen;
  final VoidCallback? onClose;

  @override
  State<_TRFlutterMenuHost> createState() => _TRFlutterMenuHostState();
}

class _TRFlutterMenuHostState extends State<_TRFlutterMenuHost>
    implements TRContextMenuHost {
  late final MenuController _internalMenuController = MenuController();
  MenuController get _menuController =>
      widget.menuController ?? _internalMenuController;

  bool _escapeHandlerInstalled = false;

  void _installEscapeHandler() {
    if (_escapeHandlerInstalled) return;
    _escapeHandlerInstalled = true;
    HardwareKeyboard.instance.addHandler(_handleEscape);
  }

  void _removeEscapeHandler() {
    if (!_escapeHandlerInstalled) return;
    _escapeHandlerInstalled = false;
    HardwareKeyboard.instance.removeHandler(_handleEscape);
  }

  /// Closes the open menu on Escape wherever focus is.
  ///
  /// The close waits for a microtask so the focused child sees the key first:
  /// a terminal closes the menu itself instead of sending Escape to its
  /// program, and by the time the microtask runs there is nothing left to do.
  bool _handleEscape(KeyEvent event) {
    if (event is! KeyDownEvent ||
        event.logicalKey != LogicalKeyboardKey.escape ||
        !_menuController.isOpen) {
      return false;
    }
    scheduleMicrotask(() {
      if (_menuController.isOpen) _menuController.close();
    });
    return false;
  }

  @override
  void initState() {
    super.initState();
    widget.controller.attach(this);
  }

  @override
  void didUpdateWidget(_TRFlutterMenuHost oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.controller != widget.controller) {
      oldWidget.controller.detach(this);
      widget.controller.attach(this);
    }
  }

  @override
  void dispose() {
    _removeEscapeHandler();
    widget.controller.detach(this);
    super.dispose();
  }

  @override
  void openAt(Offset globalPosition) {
    final box = context.findRenderObject();
    if (box is! RenderBox) return;
    _menuController.open(position: box.globalToLocal(globalPosition));
  }

  @override
  void close() => _menuController.close();

  @override
  bool get isOpen => _menuController.isOpen;

  @override
  Widget build(BuildContext context) => MenuAnchor(
    controller: _menuController,
    menuChildren: [
      TRLayerSurface(
        kind: TRLayerBoundaryKind.contextMenu,
        minWidth: TRControlMetrics.heightOf(TRLayerStyles.rowSize) * 5,
        maxWidth: TRGeneratedMeasurements.overlayWidthMd,
        padding: EdgeInsets.all(TRControlMetrics.gapOf(TRLayerStyles.rowSize)),
        child: SingleChildScrollView(
          primary: false,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            mainAxisSize: MainAxisSize.min,
            children: widget.menuChildren(context),
          ),
        ),
      ),
    ],
    onClose: () {
      _removeEscapeHandler();
      widget.onClose?.call();
    },
    onOpen: () {
      _installEscapeHandler();
      widget.onOpen?.call();
    },
    style: TRLayerStyles.menu(
      context,
      minWidth: TRControlMetrics.heightOf(TRLayerStyles.rowSize) * 5,
      maxWidth: TRGeneratedMeasurements.overlayWidthMd,
    ),
    useRootOverlay: widget.useRootOverlay,
    // The anchor child shares the menu's tap region, so a press on the child
    // never counts as an outside tap; close the open menu here before the
    // press resolves into any gesture.
    child: Listener(
      behavior: HitTestBehavior.translucent,
      onPointerDown: (_) {
        if (_menuController.isOpen) _menuController.close();
      },
      child: widget.child,
    ),
  );
}
