import 'dart:async';

import 'package:material_ui/material_ui.dart';
import 'package:lucide_flutter/lucide_flutter.dart';

import '../../generated/tokens.g.dart';
import '../../internal/layer.dart';
import '../../internal/press_interaction.dart';
import '../../layer_size.dart';
import '../../theme.dart';
import '../../types.dart';

/// A top-level destination and its rich navigation panel.
@immutable
class TRNavigationMenuItem<T> {
  const TRNavigationMenuItem({
    required this.value,
    required this.trigger,
    required this.content,
    this.enabled = true,
  });

  final T value;
  final Widget trigger;
  final Widget content;
  final bool enabled;
}

/// Coordinates the open panel of an uncontrolled [TRNavigationMenu].
class TRNavigationMenuController<T> extends ChangeNotifier {
  factory TRNavigationMenuController({T? value}) =>
      TRNavigationMenuController._(value);

  TRNavigationMenuController._(this._value);

  T? _value;

  T? get value => _value;
  bool get isOpen => _value != null;

  void open(T value) {
    if (_value == value) return;
    _value = value;
    notifyListeners();
  }

  void close() {
    if (_value == null) return;
    _value = null;
    notifyListeners();
  }
}

// @tinyrack-preview navigation-menu
/// A horizontal navigation list with collision-aware rich panels.
class TRNavigationMenu<T> extends StatefulWidget {
  const TRNavigationMenu({
    required this.items,
    this.controller,
    this.defaultValue,
    this.closeDelay = TRGeneratedMotion.immediate,
    this.openDelay = TRGeneratedMotion.immediate,
    this.onValueChange,
    this.layerSize = const TRLayerSize(
      width: TRLayerWidth.fixed(TRGeneratedLayerMetrics.navigationPanelWidth),
    ),
    this.placement = TRLayerPlacement.bottomStart,
    this.semanticLabel,
    this.useRootOverlay = true,
    super.key,
  }) : value = null,
       _controlled = false;

  const TRNavigationMenu.controlled({
    required this.items,
    required this.value,
    this.controller,
    this.closeDelay = TRGeneratedMotion.immediate,
    this.openDelay = TRGeneratedMotion.immediate,
    this.onValueChange,
    this.layerSize = const TRLayerSize(
      width: TRLayerWidth.fixed(TRGeneratedLayerMetrics.navigationPanelWidth),
    ),
    this.placement = TRLayerPlacement.bottomStart,
    this.semanticLabel,
    this.useRootOverlay = true,
    super.key,
  }) : defaultValue = null,
       _controlled = true;

  final List<TRNavigationMenuItem<T>> items;
  final TRNavigationMenuController<T>? controller;
  final T? defaultValue;
  final T? value;
  final Duration closeDelay;
  final Duration openDelay;
  final ValueChanged<T?>? onValueChange;
  final TRLayerSize layerSize;
  final TRLayerPlacement placement;
  final String? semanticLabel;
  final bool useRootOverlay;
  final bool _controlled;

  @override
  State<TRNavigationMenu<T>> createState() => _TRNavigationMenuState<T>();
}

class _TRNavigationMenuState<T> extends State<TRNavigationMenu<T>> {
  TRNavigationMenuController<T>? _internalController;

  TRNavigationMenuController<T> get _controller =>
      widget.controller ??
      (_internalController ??= TRNavigationMenuController<T>(
        value: widget.defaultValue,
      ));

  T? get _value => widget._controlled ? widget.value : _controller.value;

  @override
  void initState() {
    super.initState();
    _controller.addListener(_handleControllerChange);
  }

  @override
  void didUpdateWidget(TRNavigationMenu<T> oldWidget) {
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
    _controller.removeListener(_handleControllerChange);
    _internalController?.dispose();
    super.dispose();
  }

  void _handleControllerChange() {
    if (mounted) setState(() {});
  }

  void _change(T? value) {
    if (_value == value) return;
    if (!widget._controlled) {
      value == null ? _controller.close() : _controller.open(value);
    }
    widget.onValueChange?.call(value);
  }

  @override
  Widget build(BuildContext context) => Semantics(
    container: true,
    label: widget.semanticLabel,
    child: FocusTraversalGroup(
      policy: OrderedTraversalPolicy(),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          for (final item in widget.items)
            _TRNavigationMenuEntry<T>(
              closeDelay: widget.closeDelay,
              item: item,
              onChange: _change,
              open: _value == item.value,
              openDelay: widget.openDelay,
              layerSize: widget.layerSize,
              placement: widget.placement,
              useRootOverlay: widget.useRootOverlay,
            ),
        ],
      ),
    ),
  );
}

class _TRNavigationMenuEntry<T> extends StatefulWidget {
  const _TRNavigationMenuEntry({
    required this.closeDelay,
    required this.item,
    required this.onChange,
    required this.open,
    required this.openDelay,
    required this.layerSize,
    required this.placement,
    required this.useRootOverlay,
  });

  final Duration closeDelay;
  final TRNavigationMenuItem<T> item;
  final ValueChanged<T?> onChange;
  final bool open;
  final Duration openDelay;
  final TRLayerSize layerSize;
  final TRLayerPlacement placement;
  final bool useRootOverlay;

  @override
  State<_TRNavigationMenuEntry<T>> createState() =>
      _TRNavigationMenuEntryState<T>();
}

class _TRNavigationMenuEntryState<T> extends State<_TRNavigationMenuEntry<T>> {
  Timer? _timer;

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  void _schedule(T? value) {
    _timer?.cancel();
    final duration = value == null ? widget.closeDelay : widget.openDelay;
    if (duration == Duration.zero) {
      widget.onChange(value);
    } else {
      _timer = Timer(duration, () {
        if (mounted) widget.onChange(value);
      });
    }
  }

  @override
  Widget build(BuildContext context) => TRAnchoredLayer(
    open: widget.open,
    onOpenChange: (open) => widget.onChange(open ? widget.item.value : null),
    placement: widget.placement,
    motionDuration: TRGeneratedMotion.normal,
    size: widget.layerSize,
    useRootOverlay: widget.useRootOverlay,
    triggerBuilder: (context, open, openLayer, closeLayer, toggleLayer) =>
        Semantics(
          button: true,
          enabled: widget.item.enabled,
          expanded: open,
          child: MouseRegion(
            onEnter: widget.item.enabled
                ? (_) => _schedule(widget.item.value)
                : null,
            onExit: widget.item.enabled ? (_) => _schedule(null) : null,
            child: DecoratedBox(
              position: DecorationPosition.foreground,
              decoration: BoxDecoration(
                border: open
                    ? Border(
                        bottom: BorderSide(
                          color: context.tinyrackTheme.primaryForeground,
                        ),
                      )
                    : null,
                borderRadius: BorderRadius.circular(TRGeneratedRadii.md),
              ),
              child: TRMaterialPressable(
                enabled: widget.item.enabled,
                builder: (context, states) => TextButton(
                  statesController: states,
                  onPressed: widget.item.enabled
                      ? () => widget.onChange(open ? null : widget.item.value)
                      : null,
                  style: ButtonStyle(
                    alignment: Alignment.center,
                    animationDuration: Duration.zero,
                    backgroundColor: const WidgetStatePropertyAll(
                      Colors.transparent,
                    ),
                    backgroundBuilder: (context, states, child) {
                      final colors = context.tinyrackTheme;
                      final color = open
                          ? colors.surfaceHover
                          : states.contains(WidgetState.pressed)
                          ? colors.surfacePressed
                          : states.contains(WidgetState.focused) ||
                                states.contains(WidgetState.hovered)
                          ? colors.surfaceHover
                          : Colors.transparent;
                      return trAnimatedPressBackground(
                        context,
                        states,
                        child,
                        color: color,
                        borderRadius: BorderRadius.circular(
                          TRGeneratedRadii.md,
                        ),
                      );
                    },
                    foregroundColor: WidgetStatePropertyAll(
                      widget.item.enabled
                          ? context.tinyrackTheme.text
                          : context.tinyrackTheme.textMuted,
                    ),
                    iconColor: WidgetStatePropertyAll(
                      widget.item.enabled
                          ? context.tinyrackTheme.text
                          : context.tinyrackTheme.textMuted,
                    ),
                    fixedSize: const WidgetStatePropertyAll(
                      Size.fromHeight(
                        TRGeneratedControlMetrics.mdHeight +
                            TRGeneratedSpacing.xs,
                      ),
                    ),
                    minimumSize: const WidgetStatePropertyAll(
                      Size(
                        0,
                        TRGeneratedControlMetrics.mdHeight +
                            TRGeneratedSpacing.xs,
                      ),
                    ),
                    padding: const WidgetStatePropertyAll(
                      EdgeInsets.symmetric(
                        horizontal: TRGeneratedControlMetrics.mdPaddingInline,
                      ),
                    ),
                    shape: WidgetStatePropertyAll(
                      RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(
                          TRGeneratedRadii.md,
                        ),
                      ),
                    ),
                    side: const WidgetStatePropertyAll(
                      BorderSide(color: Colors.transparent),
                    ),
                    tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                    textStyle: const WidgetStatePropertyAll(
                      TextStyle(
                        fontFamily: TRGeneratedFontFamilies.body,
                        fontSize: TRGeneratedTypographySizes.md,
                        fontWeight: TRGeneratedFontWeights.medium,
                        height:
                            TRGeneratedFlutterRendering.normalLineMd /
                            TRGeneratedTypographySizes.md,
                      ),
                    ),
                    visualDensity: VisualDensity.standard,
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    spacing: TRGeneratedControlMetrics.mdGap,
                    children: [
                      widget.item.trigger,
                      Icon(
                        open ? LucideIcons.chevronUp : LucideIcons.chevronDown,
                        size: TRGeneratedControlMetrics.mdIconSize,
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),
        ),
    layerBuilder: (context) => MouseRegion(
      onEnter: (_) => _timer?.cancel(),
      onExit: (_) => _schedule(null),
      child: TRLayerSurface(
        kind: TRLayerBoundaryKind.navigationMenu,
        minWidth: 0,
        maxWidth: double.infinity,
        padding: const EdgeInsets.all(TRGeneratedSpacing.xs),
        child: TRLayerPartBoundary(
          name: 'content',
          child: DefaultTextStyle.merge(
            style: TextStyle(
              color: context.tinyrackTheme.text,
              fontFamily: TRGeneratedFontFamilies.body,
              fontFamilyFallback: TRGeneratedFontFamilies.fallback,
              fontSize: TRGeneratedTypographySizes.md,
              height:
                  TRGeneratedFlutterRendering.normalLineMd /
                  TRGeneratedTypographySizes.md,
            ),
            child: widget.item.content,
          ),
        ),
      ),
    ),
  );
}
