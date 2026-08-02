import 'dart:async';

import 'package:flutter/material.dart';

import '../../generated/tokens.g.dart';
import '../../internal/layer.dart';
import '../../theme.dart';
import '../../types.dart';

/// Shared tooltip delay settings for a subtree.
class TRTooltipProvider extends InheritedWidget {
  const TRTooltipProvider({
    required super.child,
    this.openDelay = const Duration(milliseconds: 600),
    this.closeDelay = const Duration(milliseconds: 100),
    super.key,
  });

  final Duration openDelay;
  final Duration closeDelay;

  static TRTooltipProvider? maybeOf(BuildContext context) =>
      context.dependOnInheritedWidgetOfExactType<TRTooltipProvider>();

  @override
  bool updateShouldNotify(TRTooltipProvider oldWidget) =>
      openDelay != oldWidget.openDelay || closeDelay != oldWidget.closeDelay;
}

/// Controls an uncontrolled [TRTooltip].
class TRTooltipController extends ChangeNotifier {
  TRTooltipController({bool open = false})
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

// @tinyrack-preview tooltip
/// A hover, focus, and long-press description for a compact trigger.
class TRTooltip extends StatefulWidget {
  const TRTooltip({
    required this.child,
    required this.message,
    this.closeDelay,
    this.controller,
    this.defaultOpen = false,
    this.openDelay,
    this.onOpenChange,
    this.placement = TRLayerPlacement.topCenter,
    this.useRootOverlay = true,
    this.width,
    super.key,
  }) : open = null;

  const TRTooltip.controlled({
    required this.child,
    required this.message,
    required this.open,
    this.closeDelay,
    this.controller,
    this.openDelay,
    this.onOpenChange,
    this.placement = TRLayerPlacement.topCenter,
    this.useRootOverlay = true,
    this.width,
    super.key,
  }) : defaultOpen = false;

  final Widget child;
  final String message;
  final Duration? closeDelay;
  final TRTooltipController? controller;
  final bool defaultOpen;
  final bool? open;
  final Duration? openDelay;
  final ValueChanged<bool>? onOpenChange;
  final TRLayerPlacement placement;
  final bool useRootOverlay;
  final double? width;

  @override
  State<TRTooltip> createState() => _TRTooltipState();
}

class _TRTooltipState extends State<TRTooltip> {
  TRTooltipController? _internalController;
  Timer? _timer;

  TRTooltipController get _controller =>
      widget.controller ??
      (_internalController ??= TRTooltipController(open: widget.defaultOpen));

  bool get _open => widget.open ?? _controller.isOpen;

  @override
  void initState() {
    super.initState();
    _controller.addListener(_handleControllerChange);
  }

  @override
  void didUpdateWidget(TRTooltip oldWidget) {
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
    final provider = TRTooltipProvider.maybeOf(context);
    final delay = value
        ? widget.openDelay ??
              provider?.openDelay ??
              const Duration(milliseconds: 600)
        : widget.closeDelay ??
              provider?.closeDelay ??
              const Duration(milliseconds: 100);
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
    requestFocus: false,
    useRootOverlay: widget.useRootOverlay,
    dismissOnTapOutside: false,
    triggerBuilder: (context, open, openLayer, closeLayer, toggleLayer) =>
        Semantics(
          tooltip: widget.message,
          child: MouseRegion(
            onEnter: (_) => _request(true),
            onExit: (_) => _request(false),
            child: Focus(
              onFocusChange: _request,
              child: GestureDetector(
                behavior: HitTestBehavior.opaque,
                onLongPress: () => _request(true),
                onLongPressEnd: (_) => _request(false),
                child: widget.child,
              ),
            ),
          ),
        ),
    layerBuilder: (context) {
      final colors = context.tinyrackTheme;
      final generated = Theme.of(context).brightness == Brightness.light
          ? TRGeneratedColors.light
          : TRGeneratedColors.dark;
      final surface = DecoratedBox(
        decoration: BoxDecoration(
          color: generated.surfaceInverse,
          border: Border.all(color: generated.borderInverse),
          borderRadius: BorderRadius.circular(TRGeneratedRadii.sm),
          boxShadow: const [TRGeneratedShadows.overlay],
        ),
        child: Padding(
          padding: const EdgeInsets.symmetric(
            horizontal: TRGeneratedSpacing.sm,
            vertical: TRGeneratedSpacing.xs,
          ),
          child: DefaultTextStyle(
            style: TRGeneratedTextStyles.bodySm.copyWith(
              color: colors.textInverse,
              fontFamilyFallback: TRGeneratedFontFamilies.fallback,
              fontSize: TRGeneratedTypographySizes.xs,
              fontWeight: TRGeneratedFontWeights.medium,
              height:
                  TRGeneratedFlutterRendering.normalLineMd /
                  TRGeneratedTypographySizes.xs,
            ),
            child: Text(
              widget.message,
              strutStyle: const StrutStyle(
                fontFamily: TRGeneratedFontFamilies.body,
                fontFamilyFallback: TRGeneratedFontFamilies.fallback,
                fontSize: TRGeneratedTypographySizes.xs,
                height:
                    TRGeneratedFlutterRendering.normalLineMd /
                    TRGeneratedTypographySizes.xs,
                forceStrutHeight: true,
              ),
            ),
          ),
        ),
      );
      return TRLayerBoundary(
        kind: TRLayerBoundaryKind.tooltip,
        child: widget.width == null
            ? surface
            : SizedBox(width: widget.width, child: surface),
      );
    },
  );
}
