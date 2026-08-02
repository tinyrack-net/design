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

class _TRContextMenuState extends State<TRContextMenu> {
  late final MenuController _internalController = MenuController();
  MenuController get _controller => widget.controller ?? _internalController;

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
        padding: const EdgeInsets.all(TRGeneratedControlMetrics.smGap),
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
    onClose: widget.onClose,
    onOpen: widget.onOpen,
    style: TRLayerStyles.menu(
      context,
      minWidth: TRGeneratedControlMetrics.mdHeight * 5,
      maxWidth: TRGeneratedMeasurements.overlayWidthMd,
    ),
    useRootOverlay: widget.useRootOverlay,
    builder: (context, controller, child) => FocusableActionDetector(
      enabled: widget.enabled,
      shortcuts: const {
        SingleActivator(LogicalKeyboardKey.contextMenu): ActivateIntent(),
        SingleActivator(LogicalKeyboardKey.f10, shift: true): ActivateIntent(),
      },
      actions: {
        ActivateIntent: CallbackAction<ActivateIntent>(
          onInvoke: (_) {
            final box = context.findRenderObject()! as RenderBox;
            controller.open(position: Offset(0, box.size.height));
            return null;
          },
        ),
      },
      child: GestureDetector(
        behavior: HitTestBehavior.opaque,
        onLongPressStart: widget.enabled
            ? (details) => _openAt(context, details.globalPosition)
            : null,
        onSecondaryTapDown: widget.enabled
            ? (details) => _openAt(context, details.globalPosition)
            : null,
        child: widget.child,
      ),
    ),
  );
}
