import 'dart:async';

import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../../generated/tokens.g.dart';
import '../../internal/layer.dart';

// @tinyrack-preview context-menu
/// Opens Tinyrack menu items at a pointer or keyboard context-menu position.
class TRContextMenu extends StatefulWidget {
  const TRContextMenu({
    required this.child,
    required this.menuChildren,
    this.controller,
    this.enabled = true,
    this.onClose,
    this.onOpen,
    this.useRootOverlay = true,
    super.key,
  });

  final Widget child;
  final List<Widget> menuChildren;
  final MenuController? controller;
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
  late final MenuController _internalController = MenuController();
  MenuController get _controller => widget.controller ?? _internalController;

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
        !_controller.isOpen) {
      return false;
    }
    scheduleMicrotask(() {
      if (_controller.isOpen) _controller.close();
    });
    return false;
  }

  @override
  void dispose() {
    _removeEscapeHandler();
    super.dispose();
  }

  void _openAt(BuildContext context, Offset globalPosition) {
    if (!widget.enabled) return;
    final box = context.findRenderObject()! as RenderBox;
    _controller.open(position: box.globalToLocal(globalPosition));
  }

  @override
  Widget build(BuildContext context) => MenuAnchor(
    controller: _controller,
    menuChildren: [
      TRLayerSurface(
        kind: TRLayerBoundaryKind.contextMenu,
        minWidth: TRGeneratedControlMetrics.mdHeight * 5,
        maxWidth: TRGeneratedMeasurements.overlayWidthMd,
        padding: const EdgeInsets.all(TRGeneratedControlMetrics.mdGap),
        child: SingleChildScrollView(
          primary: false,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            mainAxisSize: MainAxisSize.min,
            children: widget.menuChildren,
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
      minWidth: TRGeneratedControlMetrics.mdHeight * 5,
      maxWidth: TRGeneratedMeasurements.overlayWidthMd,
    ),
    useRootOverlay: widget.useRootOverlay,
    builder: (context, controller, child) => FocusableActionDetector(
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
            final box = context.findRenderObject()! as RenderBox;
            controller.open(position: Offset(0, box.size.height));
            return null;
          },
        ),
      },
      // The anchor child shares the menu's tap region, so a press on the
      // child never counts as an outside tap; close the open menu here
      // before the press resolves into any gesture.
      child: Listener(
        behavior: HitTestBehavior.translucent,
        onPointerDown: (_) {
          if (controller.isOpen) controller.close();
        },
        child: GestureDetector(
          behavior: HitTestBehavior.opaque,
          onSecondaryTapDown: widget.enabled
              ? (details) => _openAt(context, details.globalPosition)
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
                ? (details) => _openAt(context, details.globalPosition)
                : null,
            child: widget.child,
          ),
        ),
      ),
    ),
  );
}
