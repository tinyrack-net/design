import 'dart:async';

import 'package:flutter/material.dart';

import '../../generated/tokens.g.dart';
import '../../internal/layer.dart';
import '../../types.dart';

/// Controls an uncontrolled [TRPreviewCard].
class TRPreviewCardController extends ChangeNotifier {
  TRPreviewCardController({bool open = false})
    : _controller = TRAnchoredLayerController(open: open) {
    _controller.addListener(notifyListeners);
  }

  final TRAnchoredLayerController _controller;

  bool get isOpen => _controller.isOpen;

  void open() => _controller.open();

  void close() => _controller.close();

  @override
  void dispose() {
    _controller.removeListener(notifyListeners);
    _controller.dispose();
    super.dispose();
  }
}

// @tinyrack-preview preview-card
/// A delayed hover or focus preview that may contain interactive content.
class TRPreviewCard extends StatefulWidget {
  const TRPreviewCard({
    required this.trigger,
    required this.content,
    this.closeDelay = TRGeneratedMotion.previewCloseDelay,
    this.controller,
    this.defaultOpen = false,
    this.onOpenChange,
    this.openDelay = TRGeneratedMotion.number,
    this.placement = TRLayerPlacement.bottomStart,
    this.useRootOverlay = true,
    this.width = TRGeneratedMeasurements.overlayWidthSm,
    super.key,
  }) : open = null;

  const TRPreviewCard.controlled({
    required this.trigger,
    required this.content,
    required this.open,
    this.closeDelay = TRGeneratedMotion.previewCloseDelay,
    this.controller,
    this.onOpenChange,
    this.openDelay = TRGeneratedMotion.number,
    this.placement = TRLayerPlacement.bottomStart,
    this.useRootOverlay = true,
    this.width = TRGeneratedMeasurements.overlayWidthSm,
    super.key,
  }) : defaultOpen = false;

  final Widget trigger;
  final Widget content;
  final Duration closeDelay;
  final TRPreviewCardController? controller;
  final bool defaultOpen;
  final bool? open;
  final ValueChanged<bool>? onOpenChange;
  final Duration openDelay;
  final TRLayerPlacement placement;
  final bool useRootOverlay;
  final double width;

  @override
  State<TRPreviewCard> createState() => _TRPreviewCardState();
}

class _TRPreviewCardState extends State<TRPreviewCard> {
  TRPreviewCardController? _internalController;
  Timer? _timer;

  TRPreviewCardController get _controller =>
      widget.controller ??
      (_internalController ??= TRPreviewCardController(
        open: widget.defaultOpen,
      ));

  bool get _open => widget.open ?? _controller.isOpen;

  @override
  void initState() {
    super.initState();
    _controller.addListener(_handleControllerChange);
  }

  @override
  void didUpdateWidget(TRPreviewCard oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.controller == widget.controller) return;
    (oldWidget.controller ?? _internalController)?.removeListener(
      _handleControllerChange,
    );
    if (widget.controller != null) {
      _internalController?.dispose();
      _internalController = null;
    }
    _controller.addListener(_handleControllerChange);
  }

  @override
  void dispose() {
    _timer?.cancel();
    _controller.removeListener(_handleControllerChange);
    _internalController?.dispose();
    super.dispose();
  }

  void _handleControllerChange() {
    if (mounted) setState(() {});
  }

  void _request(bool value) {
    _timer?.cancel();
    final delay = value ? widget.openDelay : widget.closeDelay;
    void update() {
      if (!mounted || _open == value) return;
      if (widget.open == null) {
        value ? _controller.open() : _controller.close();
      }
      widget.onOpenChange?.call(value);
    }

    if (delay == Duration.zero) {
      update();
    } else {
      _timer = Timer(delay, update);
    }
  }

  @override
  Widget build(BuildContext context) => TRAnchoredLayer(
    open: _open,
    onOpenChange: (value) {
      if (widget.open == null) {
        value ? _controller.open() : _controller.close();
      }
      widget.onOpenChange?.call(value);
    },
    placement: widget.placement,
    motionDuration: TRGeneratedMotion.slow,
    motionScale: false,
    requestFocus: false,
    useRootOverlay: widget.useRootOverlay,
    triggerBuilder: (context, open, openLayer, closeLayer, toggleLayer) =>
        MouseRegion(
          onEnter: (_) => _request(true),
          onExit: (_) => _request(false),
          child: Focus(onFocusChange: _request, child: widget.trigger),
        ),
    layerBuilder: (context) => MouseRegion(
      onEnter: (_) {
        _timer?.cancel();
      },
      onExit: (_) => _request(false),
      child: TRLayerSurface(
        kind: TRLayerBoundaryKind.previewCard,
        minWidth: widget.width,
        maxWidth: widget.width,
        padding: const EdgeInsets.all(TRGeneratedSpacing.lg),
        child: widget.content,
      ),
    ),
  );
}
