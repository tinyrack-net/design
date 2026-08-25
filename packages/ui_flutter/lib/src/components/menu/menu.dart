import 'package:material_ui/material_ui.dart';
import 'package:lucide_flutter/lucide_flutter.dart';

import '../../ui_density.dart';
import '../../generated/tokens.g.dart';
import '../../internal/focus_source.dart';
import '../../internal/layer.dart';
import '../../internal/press_interaction.dart';
import '../../layer_size.dart';
import '../../theme.dart';
import '../../tokens.dart';
import '../../types.dart';

const _defaultMenuLayerSize = TRLayerSize(
  width: TRLayerWidth.content(
    min: TRGeneratedMeasurements.measureMd,
    max: TRGeneratedMeasurements.overlayWidthSm + TRGeneratedSpacing.size2xl,
  ),
  height: TRLayerHeight.content(max: TRGeneratedMeasurements.measureXl),
);

// @tinyrack-preview menu
/// A Material menu anchor with Tinyrack layer styling.
class TRMenu extends StatefulWidget {
  const TRMenu({
    required this.trigger,
    required this.menuChildren,
    this.alignmentOffset = const Offset(0, TRGeneratedSpacing.xs),
    this.autofocus = false,
    this.controller,
    this.enabled = true,
    this.focusNode,
    this.layerSize = _defaultMenuLayerSize,
    this.onClose,
    this.onOpen,
    this.uiSize,
    this.useRootOverlay = true,
    super.key,
  }) : label = null;

  /// Creates a menu whose trigger is a square icon control.
  ///
  /// A menu that opens from a glyph stands in a row of [TRIconButton]s, and a
  /// text trigger's inline padding would make it the one wide control in that
  /// row. The square geometry is the same one [TRIconButton] uses, so the group
  /// reads as one set of commands rather than a pill among buttons.
  ///
  /// [label] names the control for assistive technology, exactly as it does on
  /// [TRIconButton]; a glyph alone has no accessible name.
  const TRMenu.icon({
    required Widget icon,
    required String this.label,
    required this.menuChildren,
    this.alignmentOffset = const Offset(0, TRGeneratedSpacing.xs),
    this.autofocus = false,
    this.controller,
    this.enabled = true,
    this.focusNode,
    this.layerSize = _defaultMenuLayerSize,
    this.onClose,
    this.onOpen,
    this.uiSize,
    this.useRootOverlay = true,
    super.key,
  }) : trigger = icon;

  final Widget trigger;
  final List<Widget> menuChildren;
  final Offset alignmentOffset;
  final bool autofocus;
  final MenuController? controller;
  final bool enabled;
  final FocusNode? focusNode;
  final TRLayerSize layerSize;
  final VoidCallback? onClose;
  final VoidCallback? onOpen;

  /// Control geometry of the trigger.
  ///
  /// A menu trigger stands in a row beside buttons and fields, so it takes the
  /// same sizes they do rather than fixing one density. Popup rows ignore this
  /// override and resolve from the nearest [TRUiDensityScope]: standard uses
  /// [TRUiSize.sm] and comfortable uses [TRUiSize.lg].
  final TRUiSize? uiSize;

  final bool useRootOverlay;

  /// Accessible name of an icon trigger, and the marker that selects the
  /// square geometry.
  ///
  /// Null for a text trigger, which names itself. Published for the same
  /// reason [TRIconButton.label] is: a caller that renders an icon control
  /// identifies it by the name it gave it.
  final String? label;

  @override
  State<TRMenu> createState() => _TRMenuState();
}

class _TRMenuState extends State<TRMenu> {
  MenuController? _internalController;
  FocusNode? _internalFocusNode;
  final GlobalKey _triggerKey = GlobalKey(debugLabel: 'TRMenu trigger');
  Size _anchorSize = Size.zero;

  MenuController get _controller =>
      widget.controller ?? (_internalController ??= MenuController());
  FocusNode get _focusNode =>
      widget.focusNode ?? (_internalFocusNode ??= FocusNode());

  @override
  void didUpdateWidget(TRMenu oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.controller != widget.controller) _internalController = null;
    if (oldWidget.focusNode != widget.focusNode && widget.focusNode != null) {
      _internalFocusNode?.dispose();
      _internalFocusNode = null;
    }
  }

  @override
  void dispose() {
    _internalFocusNode?.dispose();
    super.dispose();
  }

  void _handleOpen() {
    if (mounted) setState(() {});
    widget.onOpen?.call();
  }

  void _handleClose() {
    if (mounted) setState(() {});
    widget.onClose?.call();
  }

  void _measureAnchor() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (!mounted) return;
      final context = _triggerKey.currentContext;
      final renderObject = context?.findRenderObject();
      if (renderObject is! RenderBox || !renderObject.hasSize) return;
      final size = renderObject.size;
      if (size == _anchorSize) return;
      setState(() => _anchorSize = size);
    });
  }

  @override
  Widget build(BuildContext context) {
    _measureAnchor();
    final uiSize = TRUiDensityScope.resolveSize(context, widget.uiSize);
    final density = TRUiDensityScope.of(context);
    final controller = _controller;
    final colors = context.tinyrackTheme;
    final height = TRControlMetrics.heightOf(uiSize);
    final iconLabel = widget.label;
    final square = iconLabel != null;
    Color triggerBackground(Set<WidgetState> states) {
      if (states.contains(WidgetState.pressed)) return colors.surfacePressed;
      if (controller.isOpen || states.contains(WidgetState.hovered)) {
        return colors.surfaceHover;
      }
      return Colors.transparent;
    }

    final triggerStyle = ButtonStyle(
      animationDuration: Duration.zero,
      backgroundColor: const WidgetStatePropertyAll(Colors.transparent),
      backgroundBuilder: (context, states, child) => trAnimatedPressBackground(
        context,
        states,
        child,
        color: triggerBackground(states),
        borderRadius: BorderRadius.circular(TRGeneratedRadii.md),
      ),
      foregroundColor: WidgetStateProperty.resolveWith(
        (states) => states.contains(WidgetState.disabled)
            ? colors.textMuted
            : colors.text,
      ),
      minimumSize: WidgetStatePropertyAll(
        square ? Size.square(height) : Size(0, height),
      ),
      padding: WidgetStatePropertyAll(
        square
            ? EdgeInsets.zero
            : EdgeInsets.symmetric(
                horizontal:
                    TRControlMetrics.inlinePaddingOf(uiSize) +
                    TRControlMetrics.borderWidth,
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
      textStyle: WidgetStatePropertyAll(
        TextStyle(
          fontFamily: TRGeneratedFontFamilies.body,
          fontFamilyFallback: TRGeneratedFontFamilies.fallback,
          fontSize: TRControlMetrics.fontSizeOf(uiSize),
          fontWeight: TRGeneratedFontWeights.medium,
          height:
              TRControlMetrics.lineHeightOf(uiSize) /
              TRControlMetrics.fontSizeOf(uiSize),
        ),
      ),
      visualDensity: VisualDensity.standard,
    );

    return SizedBox(
      height: height,
      width: square ? height : null,
      child: MenuAnchor(
        alignmentOffset: widget.alignmentOffset,
        animated: false,
        childFocusNode: _focusNode,
        controller: controller,
        menuChildren: [
          TRUiDensityScope(
            density: density,
            child: _TRMenuEntryMotion(
              child: TRLayerSurface(
                constraints: trLayerConstraints(
                  context,
                  widget.layerSize,
                  anchorSize: _anchorSize,
                ),
                child: SingleChildScrollView(
                  primary: false,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    mainAxisSize: MainAxisSize.min,
                    children: widget.menuChildren,
                  ),
                ),
              ),
            ),
          ),
        ],
        onClose: _handleClose,
        onOpen: _handleOpen,
        style: TRLayerStyles.menu(
          context,
          size: widget.layerSize,
          anchorSize: _anchorSize,
        ),
        useRootOverlay: widget.useRootOverlay,
        builder: (context, menuController, child) => Semantics(
          key: _triggerKey,
          button: true,
          enabled: widget.enabled,
          expanded: menuController.isOpen,
          label: iconLabel,
          child: TRMaterialPressable(
            enabled: widget.enabled,
            builder: (context, states) => TextButton(
              autofocus: widget.autofocus,
              focusNode: _focusNode,
              onPressed: widget.enabled
                  ? () => menuController.isOpen
                        ? menuController.close()
                        : menuController.open()
                  : null,
              statesController: states,
              style: triggerStyle,
              child: square
                  ? IconTheme.merge(
                      data: IconThemeData(
                        size: TRControlMetrics.iconSizeOf(uiSize),
                      ),
                      child: widget.trigger,
                    )
                  : widget.trigger,
            ),
          ),
        ),
      ),
    );
  }
}

class _TRMenuEntryMotion extends StatefulWidget {
  const _TRMenuEntryMotion({required this.child});

  final Widget child;

  @override
  State<_TRMenuEntryMotion> createState() => _TRMenuEntryMotionState();
}

class _TRMenuEntryMotionState extends State<_TRMenuEntryMotion>
    with SingleTickerProviderStateMixin {
  late final AnimationController _controller = AnimationController(
    duration: TRGeneratedMotion.normal,
    vsync: this,
  );

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if (MediaQuery.disableAnimationsOf(context)) {
      _controller.value = 1;
    } else if (_controller.value == 0 && !_controller.isAnimating) {
      _controller.forward();
    }
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) => AnimatedBuilder(
    animation: _controller,
    child: widget.child,
    builder: (context, child) {
      final value = TRGeneratedMotion.easeOut.transform(_controller.value);
      return Opacity(
        opacity: value,
        child: Transform.scale(
          alignment: Alignment.topCenter,
          scale:
              TRGeneratedMeasurements.overlayClosedScale +
              (1 - TRGeneratedMeasurements.overlayClosedScale) * value,
          child: child,
        ),
      );
    },
  );
}

/// A command in a [TRMenu].
class TRMenuItem extends StatelessWidget {
  const TRMenuItem({
    required this.child,
    required this.onPressed,
    this.autofocus = false,
    this.closeOnActivate = true,
    this.focusNode,
    this.leadingIcon,
    this.semanticLabel,
    this.shortcut,
    this.trailingIcon,
    super.key,
  });

  final Widget child;
  final VoidCallback? onPressed;
  final bool autofocus;
  final bool closeOnActivate;
  final FocusNode? focusNode;
  final Widget? leadingIcon;
  final String? semanticLabel;
  final MenuSerializableShortcut? shortcut;
  final Widget? trailingIcon;

  @override
  Widget build(BuildContext context) {
    final item = TRMaterialPressable(
      enabled: onPressed != null,
      builder: (context, states) => MenuItemButton(
        autofocus: autofocus,
        closeOnActivate: closeOnActivate,
        focusNode: focusNode,
        leadingIcon: leadingIcon,
        onPressed: onPressed,
        shortcut: shortcut,
        statesController: states,
        style: TRLayerStyles.item(context, showFocusBorder: false),
        trailingIcon: trailingIcon,
        child: child,
      ),
    );
    final spacedItem = Theme(
      data: Theme.of(context).copyWith(
        visualDensity: const VisualDensity(
          horizontal: -TRGeneratedBorders.defaultWidth * 2,
        ),
      ),
      child: item,
    );
    return semanticLabel == null
        ? spacedItem
        : Semantics(label: semanticLabel, child: spacedItem);
  }
}

/// A checkbox setting that stays inside the open menu by default.
class TRMenuCheckboxItem extends StatelessWidget {
  const TRMenuCheckboxItem({
    required this.child,
    required this.value,
    required this.onChanged,
    this.closeOnActivate = false,
    this.focusNode,
    this.trailingIcon,
    this.tristate = false,
    super.key,
  });

  final Widget child;
  final bool? value;
  final ValueChanged<bool?>? onChanged;
  final bool closeOnActivate;
  final FocusNode? focusNode;
  final Widget? trailingIcon;
  final bool tristate;

  @override
  Widget build(BuildContext context) {
    final enabled = onChanged != null;
    return Semantics(
      checked: value,
      enabled: enabled,
      child: TRMenuItem(
        closeOnActivate: closeOnActivate,
        focusNode: focusNode,
        leadingIcon: _TRMenuIndicator(
          kind: value == true
              ? _TRMenuIndicatorKind.check
              : _TRMenuIndicatorKind.empty,
        ),
        onPressed: enabled
            ? () {
                final next = tristate
                    ? switch (value) {
                        false => true,
                        true => null,
                        null => false,
                      }
                    : !(value ?? false);
                onChanged?.call(next);
              }
            : null,
        trailingIcon: trailingIcon,
        child: child,
      ),
    );
  }
}

/// A radio setting that stays inside the open menu by default.
class TRMenuRadioItem<T> extends StatelessWidget {
  const TRMenuRadioItem({
    required this.child,
    required this.groupValue,
    required this.onChanged,
    required this.value,
    this.closeOnActivate = false,
    this.focusNode,
    this.toggleable = false,
    this.trailingIcon,
    super.key,
  });

  final Widget child;
  final T? groupValue;
  final ValueChanged<T?>? onChanged;
  final T value;
  final bool closeOnActivate;
  final FocusNode? focusNode;
  final bool toggleable;
  final Widget? trailingIcon;

  @override
  Widget build(BuildContext context) {
    final selected = groupValue == value;
    final enabled = onChanged != null;
    return Semantics(
      checked: selected,
      enabled: enabled,
      inMutuallyExclusiveGroup: true,
      child: TRMenuItem(
        closeOnActivate: closeOnActivate,
        focusNode: focusNode,
        leadingIcon: _TRMenuIndicator(
          kind: selected
              ? _TRMenuIndicatorKind.dot
              : _TRMenuIndicatorKind.empty,
        ),
        onPressed: enabled
            ? () => onChanged?.call(selected && toggleable ? null : value)
            : null,
        trailingIcon: trailingIcon,
        child: child,
      ),
    );
  }
}

/// A cascading submenu inside a [TRMenu].
class TRMenuSubmenu extends StatefulWidget {
  const TRMenuSubmenu({
    required this.child,
    required this.menuChildren,
    this.alignmentOffset,
    this.controller,
    this.focusNode,
    this.layerSize = _defaultMenuLayerSize,
    this.leadingIcon,
    this.trailingIcon,
    super.key,
  });

  final Widget child;
  final List<Widget> menuChildren;
  final Offset? alignmentOffset;
  final MenuController? controller;
  final FocusNode? focusNode;
  final TRLayerSize layerSize;
  final Widget? leadingIcon;
  final Widget? trailingIcon;

  @override
  State<TRMenuSubmenu> createState() => _TRMenuSubmenuState();
}

class _TRMenuSubmenuState extends State<TRMenuSubmenu> {
  final GlobalKey _triggerKey = GlobalKey(debugLabel: 'TRMenuSubmenu trigger');
  Size _anchorSize = Size.zero;

  void _measureAnchor() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (!mounted) return;
      final renderObject = _triggerKey.currentContext?.findRenderObject();
      if (renderObject is! RenderBox || !renderObject.hasSize) return;
      final size = renderObject.size;
      if (size == _anchorSize) return;
      setState(() => _anchorSize = size);
    });
  }

  @override
  Widget build(BuildContext context) {
    _measureAnchor();
    final density = TRUiDensityScope.of(context);
    return KeyedSubtree(
      key: _triggerKey,
      child: TRMaterialPressable(
        enabled: true,
        builder: (context, states) => SubmenuButton(
          alignmentOffset: widget.alignmentOffset,
          animated: !MediaQuery.disableAnimationsOf(context),
          controller: widget.controller,
          focusNode: widget.focusNode,
          statesController: states,
          leadingIcon: widget.leadingIcon,
          menuChildren: [
            TRUiDensityScope(
              density: density,
              child: TRLayerSurface(
                constraints: trLayerConstraints(
                  context,
                  widget.layerSize,
                  anchorSize: _anchorSize,
                ),
                child: SingleChildScrollView(
                  primary: false,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    mainAxisSize: MainAxisSize.min,
                    children: widget.menuChildren,
                  ),
                ),
              ),
            ),
          ],
          menuStyle: TRLayerStyles.menu(
            context,
            alignment: AlignmentDirectional.topEnd,
            size: widget.layerSize,
            anchorSize: _anchorSize,
          ),
          style: TRLayerStyles.item(context, showFocusBorder: false),
          trailingIcon: widget.trailingIcon,
          useRootOverlay: true,
          child: widget.child,
        ),
      ),
    );
  }
}

/// A muted heading for a related group of menu items.
class TRMenuGroupLabel extends StatelessWidget {
  const TRMenuGroupLabel({required this.child, super.key});

  final Widget child;

  @override
  Widget build(BuildContext context) {
    final rowSize = TRLayerStyles.rowSizeOf(context);
    return Padding(
      padding: EdgeInsets.fromLTRB(
        TRControlMetrics.inlinePaddingOf(rowSize),
        TRGeneratedSpacing.sm,
        TRControlMetrics.inlinePaddingOf(rowSize),
        TRGeneratedSpacing.xs,
      ),
      child: DefaultTextStyle.merge(
        style: TRTypography.caption.copyWith(
          color: context.tinyrackTheme.textMuted,
          fontFamilyFallback: TRGeneratedFontFamilies.fallback,
          fontWeight: TRGeneratedFontWeights.strong,
          height: TRGeneratedTypographyLineHeights.md,
        ),
        child: Transform.translate(
          offset: const Offset(0, TRGeneratedBorders.defaultWidth),
          child: child,
        ),
      ),
    );
  }
}

enum _TRMenuIndicatorKind { empty, check, dot }

class _TRMenuIndicator extends StatelessWidget {
  const _TRMenuIndicator({required this.kind});

  final _TRMenuIndicatorKind kind;

  @override
  Widget build(BuildContext context) => TRLayerPartBoundary(
    name: kind == _TRMenuIndicatorKind.dot
        ? 'radioIndicator'
        : 'checkboxIndicator',
    child: SizedBox.square(
      dimension: TRGeneratedSpacing.lg,
      child: switch (kind) {
        _TRMenuIndicatorKind.empty => null,
        _TRMenuIndicatorKind.check => Icon(
          LucideIcons.check,
          color: context.tinyrackTheme.primaryForeground,
          size: TRGeneratedSpacing.lg,
        ),
        _TRMenuIndicatorKind.dot => Center(
          child: DecoratedBox(
            decoration: BoxDecoration(
              color: context.tinyrackTheme.primaryForeground,
              shape: BoxShape.circle,
            ),
            child: const SizedBox.square(dimension: TRGeneratedSpacing.sm),
          ),
        ),
      },
    ),
  );
}

/// A visual separator between menu groups.
class TRMenuSeparator extends StatelessWidget {
  const TRMenuSeparator({super.key});

  @override
  Widget build(BuildContext context) => Padding(
    padding: const EdgeInsets.symmetric(vertical: TRGeneratedSpacing.xs),
    child: ColoredBox(
      color: context.tinyrackTheme.border,
      child: const SizedBox(height: TRGeneratedBorders.defaultWidth),
    ),
  );
}
