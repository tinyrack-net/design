import 'dart:math' as math;

import 'package:material_ui/material_ui.dart';
import 'package:flutter/rendering.dart';
import 'package:flutter/services.dart';

import '../generated/tokens.g.dart';
import '../theme.dart';
import '../tokens.dart';
import '../types.dart';
import '../ui_density.dart';
import 'focus_source.dart';
import 'press_interaction.dart';

/// Internal render-tree marker used by layer tests and preview diagnostics.
///
/// The type is intentionally not exported from the package library.
enum TRLayerBoundaryKind {
  menu,
  select,
  dialog,
  alertDialog,
  popover,
  tooltip,
  previewCard,
  autocomplete,
  combobox,
  inlineSuggestions,
  contextMenu,
  menubar,
  navigationMenu,
  drawer,
  toast,
}

class TRLayerBoundary extends SingleChildRenderObjectWidget {
  const TRLayerBoundary({required this.kind, required super.child, super.key});

  final TRLayerBoundaryKind kind;

  @override
  RenderTRLayerBoundary createRenderObject(BuildContext context) =>
      RenderTRLayerBoundary(kind);

  @override
  void updateRenderObject(
    BuildContext context,
    RenderTRLayerBoundary renderObject,
  ) {
    renderObject.kind = kind;
  }
}

class RenderTRLayerBoundary extends RenderProxyBox {
  RenderTRLayerBoundary(this._kind);

  TRLayerBoundaryKind _kind;

  TRLayerBoundaryKind get kind => _kind;

  set kind(TRLayerBoundaryKind value) {
    if (_kind == value) return;
    _kind = value;
    markNeedsPaint();
  }
}

/// Internal render marker for text and icon regions measured by diagnostics.
class TRLayerPartBoundary extends SingleChildRenderObjectWidget {
  const TRLayerPartBoundary({
    required this.name,
    required super.child,
    super.key,
  });

  final String name;

  @override
  RenderTRLayerPartBoundary createRenderObject(BuildContext context) =>
      RenderTRLayerPartBoundary(name);

  @override
  void updateRenderObject(
    BuildContext context,
    RenderTRLayerPartBoundary renderObject,
  ) {
    renderObject.name = name;
  }
}

class RenderTRLayerPartBoundary extends RenderProxyBox {
  RenderTRLayerPartBoundary(this._name);

  String _name;

  String get name => _name;

  set name(String value) {
    if (_name == value) return;
    _name = value;
    markNeedsPaint();
  }
}

/// Shared layer chrome for package components. This file is intentionally not
/// exported from the public package library.
abstract final class TRLayerStyles {
  /// Resolves popup-row geometry independently from the anchor control size.
  static TRUiSize rowSizeOf(BuildContext context) =>
      switch (TRUiDensityScope.of(context)) {
        TRUiDensity.standard => TRUiSize.sm,
        TRUiDensity.comfortable => TRUiSize.lg,
      };

  static MenuStyle menu(
    BuildContext context, {
    AlignmentGeometry alignment = AlignmentDirectional.bottomStart,
    double minWidth = TRGeneratedMeasurements.measureMd,
    double maxWidth =
        TRGeneratedMeasurements.overlayWidthSm + TRGeneratedSpacing.size2xl,
  }) {
    final media = MediaQuery.of(context);
    final availableWidth = math.max(
      0.0,
      media.size.width -
          media.padding.horizontal -
          TRGeneratedMeasurements.overlayInlineInset,
    );
    final availableHeight = math.max(
      0.0,
      media.size.height -
          media.padding.vertical -
          TRGeneratedMeasurements.overlayInlineInset,
    );
    return MenuStyle(
      alignment: alignment,
      backgroundColor: const WidgetStatePropertyAll(Colors.transparent),
      elevation: const WidgetStatePropertyAll(0),
      maximumSize: WidgetStatePropertyAll(
        Size(
          math.min(maxWidth, availableWidth),
          math.min(TRGeneratedMeasurements.measureXl, availableHeight),
        ),
      ),
      minimumSize: WidgetStatePropertyAll(
        Size(math.min(minWidth, availableWidth), 0),
      ),
      padding: const WidgetStatePropertyAll(EdgeInsets.zero),
      shadowColor: const WidgetStatePropertyAll(Colors.transparent),
      surfaceTintColor: const WidgetStatePropertyAll(Colors.transparent),
      visualDensity: VisualDensity.standard,
    );
  }

  static ButtonStyle item(
    BuildContext context, {
    bool selected = false,
    bool showFocusBorder = true,
    TRUiSize? uiSize,
  }) {
    final colors = context.tinyrackTheme;
    final rowSize = uiSize ?? rowSizeOf(context);
    final rowHeight = TRControlMetrics.heightOf(rowSize);
    Color background(Set<WidgetState> states) {
      if (states.contains(WidgetState.pressed)) return colors.surfacePressed;
      if (states.contains(WidgetState.focused) ||
          states.contains(WidgetState.hovered)) {
        return colors.surfaceHover;
      }
      return selected ? colors.surfaceSelected : Colors.transparent;
    }

    return ButtonStyle(
      alignment: AlignmentDirectional.centerStart,
      animationDuration: Duration.zero,
      backgroundBuilder: (context, states, child) => trAnimatedPressBackground(
        context,
        states,
        child,
        color: background(states),
        borderRadius: BorderRadius.circular(TRGeneratedRadii.sm),
      ),
      backgroundColor: const WidgetStatePropertyAll(Colors.transparent),
      foregroundColor: WidgetStateProperty.resolveWith(
        (states) => states.contains(WidgetState.disabled)
            ? colors.textMuted
            : colors.text,
      ),
      iconColor: WidgetStateProperty.resolveWith(
        (states) => states.contains(WidgetState.disabled)
            ? colors.textMuted
            : colors.text,
      ),
      iconSize: WidgetStatePropertyAll(TRControlMetrics.iconSizeOf(rowSize)),
      minimumSize: WidgetStatePropertyAll(Size(0, rowHeight)),
      maximumSize: const WidgetStatePropertyAll(Size.infinite),
      padding: WidgetStatePropertyAll(
        EdgeInsets.symmetric(
          horizontal: TRControlMetrics.inlinePaddingOf(rowSize),
        ),
      ),
      shape: WidgetStatePropertyAll(
        RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(TRGeneratedRadii.sm),
        ),
      ),
      side: WidgetStateProperty.resolveWith((states) {
        // Material focuses rows on hover, and a menu opened with the mouse
        // focuses its trigger, so raw focus would emphasise on pointer input.
        final focused =
            showFocusBorder &&
            states.contains(WidgetState.focused) &&
            TRFocusSource.instance.isKeyboardFocus;
        return BorderSide(
          color: focused ? colors.focus : Colors.transparent,
          width: focused
              ? TRGeneratedBorders.focusWidth
              : TRGeneratedBorders.defaultWidth,
        );
      }),
      tapTargetSize: MaterialTapTargetSize.shrinkWrap,
      textStyle: WidgetStatePropertyAll(TRControlMetrics.labelStyleOf(rowSize)),
      visualDensity: VisualDensity.standard,
    );
  }

  static ButtonStyle option(
    BuildContext context, {
    bool highlighted = false,
    bool selected = false,
    TRUiSize? uiSize,
  }) {
    final colors = context.tinyrackTheme;
    final rowSize = uiSize ?? rowSizeOf(context);
    final rowHeight = TRControlMetrics.heightOf(rowSize);
    Color background(Set<WidgetState> states) {
      if (states.contains(WidgetState.pressed)) return colors.surfacePressed;
      if (highlighted || states.contains(WidgetState.hovered)) {
        return colors.surfaceHover;
      }
      return selected ? colors.surfaceSelected : Colors.transparent;
    }

    return ButtonStyle(
      alignment: AlignmentDirectional.centerStart,
      animationDuration: Duration.zero,
      backgroundBuilder: (context, states, child) => trAnimatedPressBackground(
        context,
        states,
        child,
        color: background(states),
        borderRadius: BorderRadius.circular(TRGeneratedRadii.sm),
      ),
      backgroundColor: const WidgetStatePropertyAll(Colors.transparent),
      foregroundColor: WidgetStateProperty.resolveWith(
        (states) => states.contains(WidgetState.disabled)
            ? colors.textMuted
            : colors.text,
      ),
      iconColor: WidgetStateProperty.resolveWith(
        (states) => states.contains(WidgetState.disabled)
            ? colors.textMuted
            : colors.text,
      ),
      iconSize: WidgetStatePropertyAll(TRControlMetrics.iconSizeOf(rowSize)),
      minimumSize: WidgetStatePropertyAll(Size(0, rowHeight)),
      maximumSize: const WidgetStatePropertyAll(Size.infinite),
      padding: WidgetStatePropertyAll(
        EdgeInsets.symmetric(
          horizontal: TRControlMetrics.inlinePaddingOf(rowSize),
        ),
      ),
      shape: WidgetStatePropertyAll(
        RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(TRGeneratedRadii.sm),
        ),
      ),
      side: const WidgetStatePropertyAll(
        BorderSide(
          color: Colors.transparent,
          width: TRGeneratedBorders.defaultWidth,
        ),
      ),
      tapTargetSize: MaterialTapTargetSize.shrinkWrap,
      textStyle: WidgetStatePropertyAll(TRControlMetrics.labelStyleOf(rowSize)),
      visualDensity: VisualDensity.standard,
    );
  }
}

/// A clipped Tinyrack popup surface with shared overlay geometry.
class TRLayerSurface extends StatelessWidget {
  const TRLayerSurface({
    required this.child,
    this.kind = TRLayerBoundaryKind.menu,
    this.maxWidth =
        TRGeneratedMeasurements.overlayWidthSm + TRGeneratedSpacing.size2xl,
    this.minWidth = TRGeneratedMeasurements.measureMd,
    this.padding = const EdgeInsets.all(TRGeneratedSpacing.xs),
    super.key,
  });

  final Widget child;
  final TRLayerBoundaryKind kind;
  final double maxWidth;
  final double minWidth;
  final EdgeInsetsGeometry padding;

  @override
  Widget build(BuildContext context) {
    final colors = context.tinyrackTheme;
    return TRLayerBoundary(
      kind: kind,
      child: Container(
        constraints: BoxConstraints(minWidth: minWidth, maxWidth: maxWidth),
        decoration: BoxDecoration(
          color: colors.surface,
          // A layer already separates itself from the page with a shadow, so
          // its edge only has to close the shape. The quiet border keeps that
          // edge from reading heavier than the content it frames.
          border: Border.all(
            color: colors.border,
            width: TRGeneratedBorders.defaultWidth,
          ),
          borderRadius: BorderRadius.circular(TRGeneratedRadii.md),
          boxShadow: const [TRGeneratedShadows.overlay],
        ),
        child: ClipRRect(
          borderRadius: BorderRadius.circular(
            TRGeneratedRadii.md - TRGeneratedBorders.defaultWidth,
          ),
          child: Padding(padding: padding, child: child),
        ),
      ),
    );
  }
}

/// Private controller shared by public anchored-layer controllers.
class TRAnchoredLayerController extends ChangeNotifier {
  TRAnchoredLayerController({bool open = false}) : _isOpen = open;

  bool _isOpen;

  bool get isOpen => _isOpen;

  void open() => _setOpen(true);

  void close() => _setOpen(false);

  void toggle() => _setOpen(!_isOpen);

  void _setOpen(bool value) {
    if (_isOpen == value) return;
    _isOpen = value;
    notifyListeners();
  }
}

typedef TRAnchoredLayerTriggerBuilder =
    Widget Function(
      BuildContext context,
      bool open,
      VoidCallback openLayer,
      VoidCallback closeLayer,
      VoidCallback toggleLayer,
    );

/// Collision-aware anchored overlay used by non-menu Tinyrack layers.
class TRAnchoredLayer extends StatefulWidget {
  const TRAnchoredLayer({
    required this.layerBuilder,
    required this.triggerBuilder,
    this.controller,
    this.open,
    this.defaultOpen = false,
    this.onOpenChange,
    this.placement = TRLayerPlacement.bottomStart,
    this.gap = TRGeneratedLayerMetrics.anchorGap,
    this.motionDuration = TRGeneratedMotion.normal,
    this.motionScale = true,
    this.viewportInset = TRGeneratedMeasurements.overlayInlineInset / 2,
    this.useRootOverlay = true,
    this.dismissOnTapOutside = true,
    this.requestFocus = true,
    this.matchAnchorWidth = false,
    super.key,
  });

  final WidgetBuilder layerBuilder;
  final TRAnchoredLayerTriggerBuilder triggerBuilder;
  final TRAnchoredLayerController? controller;
  final bool? open;
  final bool defaultOpen;
  final ValueChanged<bool>? onOpenChange;
  final TRLayerPlacement placement;
  final double gap;
  final Duration motionDuration;
  final bool motionScale;
  final double viewportInset;
  final bool useRootOverlay;
  final bool dismissOnTapOutside;
  final bool requestFocus;

  /// Sizes the layer to the anchor instead of the surface's own width.
  ///
  /// A layer that continues an input, rather than floating beside it, reads as
  /// part of that control only when the two share an edge.
  final bool matchAnchorWidth;

  @override
  State<TRAnchoredLayer> createState() => _TRAnchoredLayerState();
}

class _TRAnchoredLayerState extends State<TRAnchoredLayer> {
  late final OverlayPortalController _overlayController;
  final FocusNode _layerFocusNode = FocusNode(
    debugLabel: 'TRAnchoredLayer surface',
  );
  TRAnchoredLayerController? _internalController;
  final Object _tapRegionGroup = Object();
  FocusNode? _previousFocus;

  TRAnchoredLayerController get _controller =>
      widget.controller ??
      (_internalController ??= TRAnchoredLayerController(
        open: widget.open ?? widget.defaultOpen,
      ));

  bool get _isOpen => widget.open ?? _controller.isOpen;

  @override
  void initState() {
    super.initState();
    _overlayController = OverlayPortalController(debugLabel: 'TRAnchoredLayer');
    _controller.addListener(_handleControllerChange);
    if (_isOpen) _showAfterLayout();
  }

  @override
  void didUpdateWidget(TRAnchoredLayer oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.controller != widget.controller) {
      (oldWidget.controller ?? _internalController)?.removeListener(
        _handleControllerChange,
      );
      if (widget.controller != null) {
        _internalController?.dispose();
        _internalController = null;
      }
      _controller.addListener(_handleControllerChange);
    }
    if (oldWidget.open != widget.open) {
      _isOpen ? _showAfterLayout() : _hideAfterLayout();
    }
  }

  @override
  void dispose() {
    _controller.removeListener(_handleControllerChange);
    _internalController?.dispose();
    _layerFocusNode.dispose();
    super.dispose();
  }

  void _handleControllerChange() {
    if (widget.open != null) return;
    if (_controller.isOpen) {
      _show();
    } else {
      _hide();
    }
    if (mounted) setState(() {});
  }

  void _showAfterLayout() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (mounted && _isOpen) _show();
    });
  }

  void _hideAfterLayout() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (mounted && !_isOpen) _hide();
    });
  }

  void _show() {
    if (widget.requestFocus) {
      _previousFocus ??= FocusManager.instance.primaryFocus;
    }
    _overlayController.show();
    if (widget.requestFocus) {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        if (mounted && _isOpen) _layerFocusNode.requestFocus();
      });
    }
  }

  void _hide() {
    // Restore focus only while this layer still holds it. A layer that never
    // took focus, such as a tooltip opened by focusing its trigger, would
    // otherwise pull focus back to that trigger as it closes and dismiss
    // whatever gained focus meanwhile, such as a just-opened menubar menu.
    final restoreFocus = widget.requestFocus && _layerFocusNode.hasFocus;
    _overlayController.hide();
    final focus = _previousFocus;
    _previousFocus = null;
    if (!restoreFocus) return;
    if (focus != null && focus.canRequestFocus) focus.requestFocus();
  }

  void _setOpen(bool value) {
    if (_isOpen == value) return;
    if (widget.open == null) {
      value ? _controller.open() : _controller.close();
    }
    widget.onOpenChange?.call(value);
  }

  @override
  Widget build(BuildContext context) {
    final media = MediaQuery.of(context);
    final textDirection = Directionality.of(context);
    final density = TRUiDensityScope.of(context);
    final target = TapRegion(
      groupId: _tapRegionGroup,
      onTapOutside: widget.dismissOnTapOutside && _isOpen
          ? (_) => _setOpen(false)
          : null,
      child: widget.triggerBuilder(
        context,
        _isOpen,
        () => _setOpen(true),
        () => _setOpen(false),
        () => _setOpen(!_isOpen),
      ),
    );

    return Semantics(
      container: true,
      child: OverlayPortal.overlayChildLayoutBuilder(
        controller: _overlayController,
        overlayLocation: widget.useRootOverlay
            ? OverlayChildLocation.rootOverlay
            : OverlayChildLocation.nearestOverlay,
        overlayChildBuilder: (context, info) {
          final anchor = MatrixUtils.transformRect(
            info.childPaintTransform,
            Offset.zero & info.childSize,
          );
          final safeRect = Rect.fromLTRB(
            media.padding.left + widget.viewportInset,
            media.padding.top + widget.viewportInset,
            info.overlaySize.width - media.padding.right - widget.viewportInset,
            info.overlaySize.height -
                math.max(media.padding.bottom, media.viewInsets.bottom) -
                widget.viewportInset,
          );
          Widget layer = TRUiDensityScope(
            density: density,
            child: Builder(builder: widget.layerBuilder),
          );
          if (widget.requestFocus) {
            layer = Focus(
              focusNode: _layerFocusNode,
              onKeyEvent: (_, event) {
                if (event is KeyDownEvent &&
                    event.logicalKey == LogicalKeyboardKey.escape) {
                  _setOpen(false);
                  return KeyEventResult.handled;
                }
                return KeyEventResult.ignored;
              },
              child: layer,
            );
          }
          layer = TapRegion(
            groupId: _tapRegionGroup,
            onTapOutside: widget.dismissOnTapOutside
                ? (_) => _setOpen(false)
                : null,
            child: layer,
          );
          final anchorWidth = math.min(anchor.width, safeRect.width);
          layer = ConstrainedBox(
            constraints: BoxConstraints(
              minWidth: widget.matchAnchorWidth ? math.max(0, anchorWidth) : 0,
              maxWidth: math.max(
                0,
                widget.matchAnchorWidth ? anchorWidth : safeRect.width,
              ),
              maxHeight: math.max(0, safeRect.height),
            ),
            child: _TRAnchoredLayerMotion(
              duration: widget.motionDuration,
              scale: widget.motionScale,
              alignment: _motionAlignment(widget.placement),
              child: layer,
            ),
          );
          return CustomSingleChildLayout(
            delegate: _TRAnchoredLayerLayoutDelegate(
              anchor: anchor,
              gap: widget.gap,
              placement: widget.placement,
              safeRect: safeRect,
              textDirection: textDirection,
            ),
            child: layer,
          );
        },
        child: target,
      ),
    );
  }
}

/// Grows a layer from the edge nearest its anchor.
///
/// A layer placed above its trigger that scaled from the top would appear to
/// pull away from the control it belongs to.
Alignment _motionAlignment(TRLayerPlacement placement) => switch (placement) {
  TRLayerPlacement.topStart ||
  TRLayerPlacement.topCenter ||
  TRLayerPlacement.topEnd => Alignment.bottomCenter,
  TRLayerPlacement.leftStart ||
  TRLayerPlacement.leftCenter ||
  TRLayerPlacement.leftEnd => Alignment.centerRight,
  TRLayerPlacement.rightStart ||
  TRLayerPlacement.rightCenter ||
  TRLayerPlacement.rightEnd => Alignment.centerLeft,
  TRLayerPlacement.bottomStart ||
  TRLayerPlacement.bottomCenter ||
  TRLayerPlacement.bottomEnd => Alignment.topCenter,
};

class _TRAnchoredLayerMotion extends StatelessWidget {
  const _TRAnchoredLayerMotion({
    required this.child,
    required this.duration,
    required this.scale,
    this.alignment = Alignment.topCenter,
  });

  final Widget child;
  final Duration duration;
  final bool scale;
  final Alignment alignment;

  @override
  Widget build(BuildContext context) {
    if (MediaQuery.disableAnimationsOf(context)) return child;
    return TweenAnimationBuilder<double>(
      duration: duration,
      curve: TRGeneratedMotion.easeOut,
      tween: Tween(begin: 0, end: 1),
      builder: (context, value, child) => Opacity(
        opacity: value,
        child: scale
            ? Transform.scale(
                alignment: alignment,
                scale:
                    TRGeneratedMeasurements.overlayClosedScale +
                    (1 - TRGeneratedMeasurements.overlayClosedScale) * value,
                child: child,
              )
            : child,
      ),
      child: child,
    );
  }
}

class _TRAnchoredLayerLayoutDelegate extends SingleChildLayoutDelegate {
  const _TRAnchoredLayerLayoutDelegate({
    required this.anchor,
    required this.gap,
    required this.placement,
    required this.safeRect,
    required this.textDirection,
  });

  final Rect anchor;
  final double gap;
  final TRLayerPlacement placement;
  final Rect safeRect;
  final TextDirection textDirection;

  @override
  BoxConstraints getConstraintsForChild(BoxConstraints constraints) =>
      BoxConstraints.loose(safeRect.size);

  @override
  Offset getPositionForChild(Size size, Size childSize) {
    var resolved = placement;
    var position = _position(resolved, childSize);
    if (_mainAxisOverflows(resolved, position, childSize)) {
      resolved = _opposite(resolved);
      position = _position(resolved, childSize);
    }
    return Offset(
      position.dx
          .clamp(safeRect.left, safeRect.right - childSize.width)
          .toDouble(),
      position.dy
          .clamp(safeRect.top, safeRect.bottom - childSize.height)
          .toDouble(),
    );
  }

  Offset _position(TRLayerPlacement value, Size child) {
    final startX = textDirection == TextDirection.ltr
        ? anchor.left
        : anchor.right - child.width;
    final endX = textDirection == TextDirection.ltr
        ? anchor.right - child.width
        : anchor.left;
    final centerX = anchor.center.dx - child.width / 2;
    final startY = anchor.top;
    final centerY = anchor.center.dy - child.height / 2;
    final endY = anchor.bottom - child.height;
    return switch (value) {
      TRLayerPlacement.topStart => Offset(
        startX,
        anchor.top - gap - child.height,
      ),
      TRLayerPlacement.topCenter => Offset(
        centerX,
        anchor.top - gap - child.height,
      ),
      TRLayerPlacement.topEnd => Offset(endX, anchor.top - gap - child.height),
      TRLayerPlacement.bottomStart => Offset(startX, anchor.bottom + gap),
      TRLayerPlacement.bottomCenter => Offset(centerX, anchor.bottom + gap),
      TRLayerPlacement.bottomEnd => Offset(endX, anchor.bottom + gap),
      TRLayerPlacement.leftStart => Offset(
        anchor.left - gap - child.width,
        startY,
      ),
      TRLayerPlacement.leftCenter => Offset(
        anchor.left - gap - child.width,
        centerY,
      ),
      TRLayerPlacement.leftEnd => Offset(anchor.left - gap - child.width, endY),
      TRLayerPlacement.rightStart => Offset(anchor.right + gap, startY),
      TRLayerPlacement.rightCenter => Offset(anchor.right + gap, centerY),
      TRLayerPlacement.rightEnd => Offset(anchor.right + gap, endY),
    };
  }

  bool _mainAxisOverflows(
    TRLayerPlacement value,
    Offset position,
    Size child,
  ) => switch (value) {
    TRLayerPlacement.topStart ||
    TRLayerPlacement.topCenter ||
    TRLayerPlacement.topEnd => position.dy < safeRect.top,
    TRLayerPlacement.bottomStart ||
    TRLayerPlacement.bottomCenter ||
    TRLayerPlacement.bottomEnd => position.dy + child.height > safeRect.bottom,
    TRLayerPlacement.leftStart ||
    TRLayerPlacement.leftCenter ||
    TRLayerPlacement.leftEnd => position.dx < safeRect.left,
    TRLayerPlacement.rightStart ||
    TRLayerPlacement.rightCenter ||
    TRLayerPlacement.rightEnd => position.dx + child.width > safeRect.right,
  };

  TRLayerPlacement _opposite(TRLayerPlacement value) => switch (value) {
    TRLayerPlacement.topStart => TRLayerPlacement.bottomStart,
    TRLayerPlacement.topCenter => TRLayerPlacement.bottomCenter,
    TRLayerPlacement.topEnd => TRLayerPlacement.bottomEnd,
    TRLayerPlacement.bottomStart => TRLayerPlacement.topStart,
    TRLayerPlacement.bottomCenter => TRLayerPlacement.topCenter,
    TRLayerPlacement.bottomEnd => TRLayerPlacement.topEnd,
    TRLayerPlacement.leftStart => TRLayerPlacement.rightStart,
    TRLayerPlacement.leftCenter => TRLayerPlacement.rightCenter,
    TRLayerPlacement.leftEnd => TRLayerPlacement.rightEnd,
    TRLayerPlacement.rightStart => TRLayerPlacement.leftStart,
    TRLayerPlacement.rightCenter => TRLayerPlacement.leftCenter,
    TRLayerPlacement.rightEnd => TRLayerPlacement.leftEnd,
  };

  @override
  bool shouldRelayout(_TRAnchoredLayerLayoutDelegate oldDelegate) =>
      anchor != oldDelegate.anchor ||
      gap != oldDelegate.gap ||
      placement != oldDelegate.placement ||
      safeRect != oldDelegate.safeRect ||
      textDirection != oldDelegate.textDirection;
}
