import 'dart:async';

import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../components/context_menu/context_menu.dart';

/// The channel the desktop embedders answer with a system menu.
const MethodChannel trNativeContextMenuChannel = MethodChannel(
  'net.tinyrack.ui/native_menu',
);

/// The error code an embedder reports when no menu reached the screen.
///
/// Distinct from a `null` reply, which means the person dismissed a menu that
/// was drawn. A platform that cannot present one at all says so with this, and
/// the request falls back to [TRFlutterContextMenuPresenter].
const String trNativeContextMenuNotShown = 'menu-not-shown';

/// The desktop platforms whose embedder ships a system-menu implementation.
const _nativePlatforms = <TargetPlatform>{
  TargetPlatform.linux,
  TargetPlatform.macOS,
  TargetPlatform.windows,
};

/// Asks the operating system to draw a [TRContextMenu].
///
/// Install this at an application's composition root to replace the Flutter
/// presentation of every described context menu below it:
///
/// ```dart
/// TRContextMenuPresenterScope(
///   presenter: const TRNativeContextMenuPresenter(),
///   child: child,
/// )
/// ```
///
/// The menu then carries the platform's own appearance, keyboard navigation,
/// and accessibility, and is free to paint outside the window. Two limits come
/// with that. A system menu takes a platform bitmap rather than an [IconData],
/// so [TRMenuActionElement.icon] is dropped; and the system owns dismissal, so
/// [TRContextMenuController.close] does nothing once the menu is up.
///
/// Anything the platform cannot present falls back to
/// [TRFlutterContextMenuPresenter], including mobile, web, and a desktop build
/// whose embedder did not register the plugin.
final class TRNativeContextMenuPresenter implements TRContextMenuPresenter {
  const TRNativeContextMenuPresenter({
    this.channel = trNativeContextMenuChannel,
  });

  /// The platform channel to ask for the menu.
  ///
  /// A test replaces this to observe the menu the system would otherwise draw
  /// outside the Flutter tree.
  final MethodChannel channel;

  @override
  Widget buildHost({
    required Widget child,
    required TRMenuElementsBuilder itemsBuilder,
    required TRContextMenuController controller,
    required bool enabled,
    required bool useRootOverlay,
    VoidCallback? onOpen,
    VoidCallback? onClose,
  }) => _TRNativeMenuHost(
    presenter: this,
    controller: controller,
    itemsBuilder: itemsBuilder,
    useRootOverlay: useRootOverlay,
    onOpen: onOpen,
    onClose: onClose,
    child: child,
  );

  @override
  bool operator ==(Object other) =>
      other is TRNativeContextMenuPresenter && other.channel == channel;

  @override
  int get hashCode => Object.hash(TRNativeContextMenuPresenter, channel);
}

/// Opens a system menu, and the Flutter menu wherever there is no system one.
class _TRNativeMenuHost extends StatefulWidget {
  const _TRNativeMenuHost({
    required this.presenter,
    required this.controller,
    required this.itemsBuilder,
    required this.useRootOverlay,
    required this.child,
    this.onOpen,
    this.onClose,
  });

  final TRNativeContextMenuPresenter presenter;
  final TRContextMenuController controller;
  final TRMenuElementsBuilder itemsBuilder;
  final bool useRootOverlay;
  final Widget child;
  final VoidCallback? onOpen;
  final VoidCallback? onClose;

  @override
  State<_TRNativeMenuHost> createState() => _TRNativeMenuHostState();
}

class _TRNativeMenuHostState extends State<_TRNativeMenuHost>
    implements TRContextMenuHost {
  /// Drives the Flutter menu this host keeps ready as its fallback.
  final TRContextMenuController _fallback = TRContextMenuController();

  bool _isOpen = false;

  /// Whether [_TRNativeMenuHost.onOpen] has fired without its matching close.
  ///
  /// One request may travel from the system attempt to the Flutter fallback.
  /// The caller hears one open and one close for that whole journey, so a
  /// terminal that returns keyboard focus on close does so exactly once, when
  /// the interaction is really over.
  bool _notifiedOpen = false;

  /// Identifies the newest native request; replies to older ones are stale.
  ///
  /// A platform that loses a popup without ever replying would otherwise
  /// leave [_isOpen] standing and swallow every later request.
  int _generation = 0;

  @override
  void initState() {
    super.initState();
    widget.controller.attach(this);
  }

  @override
  void didUpdateWidget(_TRNativeMenuHost oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.controller != widget.controller) {
      oldWidget.controller.detach(this);
      widget.controller.attach(this);
    }
  }

  @override
  void dispose() {
    widget.controller.detach(this);
    super.dispose();
  }

  @override
  void openAt(Offset globalPosition) {
    if (!_nativePlatforms.contains(defaultTargetPlatform) || kIsWeb) {
      _fallback.openAt(globalPosition);
      return;
    }
    // A request while the system menu is up cannot come from the person,
    // because the system menu owns the pointer. One that arrives anyway means
    // the previous popup is gone without a reply — wedged, or lost by the
    // platform — so it supersedes that silent request instead of being
    // swallowed by it.
    unawaited(_openNative(globalPosition));
  }

  Future<void> _openNative(Offset globalPosition) async {
    final elements = widget.itemsBuilder(context);
    if (elements.isEmpty) return;
    final actions = <String, TRMenuActionElement>{};
    _indexActions(elements, actions);

    final generation = ++_generation;
    _isOpen = true;
    _notifyOpen();
    String? selected;
    try {
      selected = await widget.presenter.channel.invokeMethod<String>(
        'showContextMenu',
        <String, Object?>{
          'x': globalPosition.dx,
          'y': globalPosition.dy,
          'devicePixelRatio': MediaQuery.devicePixelRatioOf(context),
          'items': <Object?>[for (final e in elements) _encode(e)],
        },
      );
    } on MissingPluginException {
      if (generation != _generation) return;
      // A desktop build without the plugin registered still deserves a menu.
      _isOpen = false;
      _fallback.openAt(globalPosition);
      return;
    } on PlatformException catch (error, stackTrace) {
      if (generation != _generation) return;
      _isOpen = false;
      if (error.code == trNativeContextMenuNotShown) {
        // The platform accepted the request but the menu never reached the
        // screen. That is not a dismissal, so falling back keeps a menu in
        // front of the person instead of doing nothing at all. The fallback
        // host reports the close when that menu is dismissed.
        _fallback.openAt(globalPosition);
        return;
      }
      // Anything else ends the request too. Reported rather than rethrown,
      // because nothing awaits this future, and a request left half-open
      // would swallow every later right-click.
      _notifyClose();
      FlutterError.reportError(
        FlutterErrorDetails(
          exception: error,
          stack: stackTrace,
          library: 'tinyrack_ui',
          context: ErrorDescription('while showing a system context menu'),
        ),
      );
      return;
    }
    if (generation != _generation) return;
    _isOpen = false;
    _notifyClose();

    final action = selected == null ? null : actions[selected];
    if (action != null && action.enabled) action.onPressed();
  }

  void _notifyOpen() {
    if (_notifiedOpen) return;
    _notifiedOpen = true;
    widget.onOpen?.call();
  }

  void _notifyClose() {
    if (!_notifiedOpen) return;
    _notifiedOpen = false;
    widget.onClose?.call();
  }

  @override
  void close() {
    // The system owns a menu it drew; only the fallback can be closed here.
    _fallback.close();
  }

  @override
  bool get isOpen => _isOpen || _fallback.isOpen;

  @override
  Widget build(BuildContext context) =>
      const TRFlutterContextMenuPresenter().buildHost(
        child: widget.child,
        itemsBuilder: widget.itemsBuilder,
        controller: _fallback,
        enabled: true,
        useRootOverlay: widget.useRootOverlay,
        onOpen: _notifyOpen,
        onClose: _notifyClose,
      );
}

void _indexActions(
  List<TRMenuElement> elements,
  Map<String, TRMenuActionElement> into,
) {
  for (final element in elements) {
    switch (element) {
      case TRMenuActionElement():
        into[element.id] = element;
      case TRMenuSubmenuElement():
        _indexActions(element.children, into);
      case TRMenuSeparatorElement():
        break;
    }
  }
}

Map<String, Object?> _encode(TRMenuElement element) => switch (element) {
  TRMenuSeparatorElement() => const <String, Object?>{'type': 'separator'},
  TRMenuSubmenuElement(:final title, :final children) => <String, Object?>{
    'type': 'submenu',
    'title': title,
    'children': <Object?>[for (final child in children) _encode(child)],
  },
  TRMenuActionElement(
    :final id,
    :final title,
    :final enabled,
    :final checked,
  ) =>
    <String, Object?>{
      'type': 'action',
      'id': id,
      'title': title,
      'enabled': enabled,
      'checked': checked,
      'shortcut': _encodeShortcut(element.shortcut),
    },
};

/// Describes a shortcut in the terms all three platform menus accept.
///
/// Only a [SingleActivator] maps onto a platform accelerator. Any other
/// [MenuSerializableShortcut] is omitted rather than mislabeled, and still
/// works because the shortcut itself lives in the widget tree.
Map<String, Object?>? _encodeShortcut(MenuSerializableShortcut? shortcut) {
  if (shortcut is! SingleActivator) return null;
  final character = shortcut.trigger.keyLabel;
  if (character.isEmpty) return null;
  return <String, Object?>{
    'character': character,
    'control': shortcut.control,
    'shift': shortcut.shift,
    'alt': shortcut.alt,
    'meta': shortcut.meta,
  };
}
