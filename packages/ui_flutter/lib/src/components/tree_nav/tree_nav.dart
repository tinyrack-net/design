import 'package:material_ui/material_ui.dart';
import 'package:flutter/services.dart';
import 'package:lucide_flutter/lucide_flutter.dart';
import '../../internal/focus_source.dart';
import '../../internal/press_interaction.dart';

import '../../generated/tokens.g.dart';
import '../../theme.dart';
import '../../tokens.dart';
import '../../types.dart';
import '../../ui_density.dart';

/// Base class for tree navigation nodes.
sealed class TRTreeNavItem<T extends Object> {
  const TRTreeNavItem({
    required this.value,
    required this.label,
    this.key,
    this.description,
    this.disabled,
  });

  /// Identifies the rendered navigation row.
  final Key? key;
  final T value;
  final Widget label;
  final Widget? description;
  final bool? disabled;
}

/// Expandable tree navigation group.
final class TRTreeNavGroup<T extends Object> extends TRTreeNavItem<T> {
  const TRTreeNavGroup({
    required super.value,
    required super.label,
    required this.children,
    super.key,
    super.description,
    super.disabled,
    this.initiallyExpanded = false,
    this.leading,
    this.trailing,
  });

  final List<TRTreeNavItem<T>> children;
  final bool initiallyExpanded;
  final Widget? leading;
  final Widget? trailing;
}

/// Selectable tree navigation destination.
final class TRTreeNavLeaf<T extends Object> extends TRTreeNavItem<T> {
  const TRTreeNavLeaf({
    required super.value,
    required super.label,
    super.key,
    super.description,
    super.disabled,
    this.leading,
    this.trailing,
    this.showDisclosureIndicator = false,
  });

  final Widget? leading;
  final Widget? trailing;

  /// Whether an actionable leaf shows a direction-aware disclosure indicator.
  ///
  /// Defaults to false to preserve the appearance of existing tree leaves.
  final bool showDisclosureIndicator;
}

/// A standalone navigation destination with TreeNav interaction and geometry.
class TRNavigationRow extends StatelessWidget {
  const TRNavigationRow({
    required this.label,
    this.description,
    this.leading,
    this.trailing,
    this.selected = false,
    this.enabled = true,
    this.onPressed,
    this.uiSize,
    super.key,
  });

  final Widget label;
  final Widget? description;
  final Widget? leading;
  final Widget? trailing;
  final bool selected;
  final bool enabled;
  final VoidCallback? onPressed;

  /// Overrides the size supplied by [TRUiDensityScope].
  final TRUiSize? uiSize;

  @override
  Widget build(BuildContext context) {
    final effectiveUiSize = TRUiDensityScope.resolveSize(context, uiSize);
    final actionable = enabled && onPressed != null;
    return _TRNavigationRowSurface(
      label: label,
      description: description,
      leading: leading,
      trailing: trailing,
      selected: selected,
      active: selected,
      enabled: actionable,
      showDisclosureIndicator: actionable,
      kind: _TRNavigationRowKind.leaf,
      onPressed: actionable ? onPressed : null,
      uiSize: effectiveUiSize,
    );
  }
}

/// Owns tree expansion and selection state.
class TRTreeNavController<T extends Object> extends ChangeNotifier {
  factory TRTreeNavController({T? value, Iterable<T> expanded = const []}) =>
      TRTreeNavController._(value, Set<T>.of(expanded));

  TRTreeNavController._(this._value, this._expanded);

  T? _value;
  Set<T> _expanded;

  T? get value => _value;
  Set<T> get expanded => Set.unmodifiable(_expanded);

  void select(T? value) {
    if (_value == value) return;
    _value = value;
    notifyListeners();
  }

  void setExpanded(T value, bool expanded) {
    final next = Set<T>.of(_expanded);
    final changed = expanded ? next.add(value) : next.remove(value);
    if (!changed) return;
    _expanded = next;
    notifyListeners();
  }

  void toggle(T value) => setExpanded(value, !_expanded.contains(value));

  void replaceExpanded(Iterable<T> values) {
    final next = Set<T>.of(values);
    if (next.length == _expanded.length && next.containsAll(_expanded)) return;
    _expanded = next;
    notifyListeners();
  }
}

// @tinyrack-preview tree-nav
/// A hierarchical navigation tree with keyboard expansion and selection.
class TRTreeNav<T extends Object> extends StatefulWidget {
  const TRTreeNav({
    required this.items,
    this.controller,
    this.defaultValue,
    this.onValueChange,
    this.pageStorageId,
    this.semanticLabel,
    this.uiSize,
    this.itemSpacing = TRGeneratedSpacing.lg,
    super.key,
  }) : value = null,
       _controlled = false;

  const TRTreeNav.controlled({
    required this.items,
    required this.value,
    this.controller,
    this.onValueChange,
    this.pageStorageId,
    this.semanticLabel,
    this.uiSize,
    this.itemSpacing = TRGeneratedSpacing.lg,
    super.key,
  }) : defaultValue = null,
       _controlled = true;

  final List<TRTreeNavItem<T>> items;
  final TRTreeNavController<T>? controller;
  final T? defaultValue;
  final T? value;
  final ValueChanged<T?>? onValueChange;
  final Object? pageStorageId;
  final String? semanticLabel;

  /// Overrides the size supplied by [TRUiDensityScope].
  final TRUiSize? uiSize;

  /// Gap between this tree's top-level items.
  ///
  /// Defaults to [TRGeneratedSpacing.lg], sized for separating unrelated
  /// top-level branches. A consumer rendering a flat list of adjacent
  /// destinations (for example, a settings sidebar) should pass a smaller
  /// public [TRSpacing] token instead.
  final double itemSpacing;
  final bool _controlled;

  @override
  State<TRTreeNav<T>> createState() => _TRTreeNavState<T>();
}

class _TRTreeNavState<T extends Object> extends State<TRTreeNav<T>> {
  TRTreeNavController<T>? _internalController;
  bool _restored = false;

  TRTreeNavController<T> get _controller =>
      widget.controller ??
      (_internalController ??= TRTreeNavController<T>(
        value: widget.defaultValue,
        expanded: _initiallyExpanded(widget.items),
      ));

  T? get _value => widget._controlled ? widget.value : _controller.value;

  @override
  void initState() {
    super.initState();
    _controller.addListener(_handleControllerChange);
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if (_restored || widget.pageStorageId == null) return;
    _restored = true;
    _restoreExpansion();
  }

  @override
  void didUpdateWidget(TRTreeNav<T> oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.controller != widget.controller) {
      (oldWidget.controller ?? _internalController)?.removeListener(
        _handleControllerChange,
      );
      if (widget.controller != null) {
        _internalController?.dispose();
        _internalController = null;
      }
      if (widget.pageStorageId != null) _restoreExpansion();
      _controller.addListener(_handleControllerChange);
    }
    if (oldWidget.pageStorageId != widget.pageStorageId) _restored = false;
  }

  @override
  void dispose() {
    _controller.removeListener(_handleControllerChange);
    _internalController?.dispose();
    super.dispose();
  }

  void _handleControllerChange() {
    if (widget.pageStorageId != null) {
      PageStorage.maybeOf(context)?.writeState(
        context,
        _controller.expanded,
        identifier: widget.pageStorageId,
      );
    }
    if (mounted) setState(() {});
  }

  void _restoreExpansion() {
    final stored = PageStorage.maybeOf(
      context,
    )?.readState(context, identifier: widget.pageStorageId);
    if (stored is Set<T>) _controller.replaceExpanded(stored);
  }

  void _select(T value) {
    if (!widget._controlled) _controller.select(value);
    widget.onValueChange?.call(value);
  }

  @override
  Widget build(BuildContext context) {
    final uiSize = TRUiDensityScope.resolveSize(context, widget.uiSize);
    return Semantics(
      container: true,
      label: widget.semanticLabel,
      child: FocusTraversalGroup(
        policy: ReadingOrderTraversalPolicy(),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          mainAxisSize: MainAxisSize.min,
          spacing: widget.itemSpacing,
          children: [
            for (final item in widget.items)
              _TRTreeNavNode<T>(
                key: item.key,
                controller: _controller,
                depth: 0,
                item: item,
                onSelect: _select,
                selectedValue: _value,
                uiSize: uiSize,
              ),
          ],
        ),
      ),
    );
  }
}

class _TRTreeNavNode<T extends Object> extends StatelessWidget {
  const _TRTreeNavNode({
    required this.controller,
    required this.depth,
    required this.item,
    required this.onSelect,
    required this.selectedValue,
    required this.uiSize,
    super.key,
  });

  final TRTreeNavController<T> controller;
  final int depth;
  final TRTreeNavItem<T> item;
  final ValueChanged<T> onSelect;
  final T? selectedValue;
  final TRUiSize uiSize;

  @override
  Widget build(BuildContext context) {
    final item = this.item;
    final group = item is TRTreeNavGroup<T> ? item : null;
    final leaf = item is TRTreeNavLeaf<T> ? item : null;
    final expanded = group != null && controller.expanded.contains(item.value);
    final selected = selectedValue == item.value;
    final activeBranch =
        group != null && _containsValue(group.children, selectedValue);
    final disabled = item.disabled ?? false;
    final leading = group?.leading ?? leaf?.leading;
    final trailing = group?.trailing ?? leaf?.trailing;
    final colors = context.tinyrackTheme;
    final motionDuration = MediaQuery.disableAnimationsOf(context)
        ? Duration.zero
        : TRMotion.fast;
    final verticalPadding = _treeNavVerticalPadding(uiSize);

    void activate() {
      if (disabled) return;
      group == null ? onSelect(item.value) : controller.toggle(item.value);
    }

    KeyEventResult onDirectionalKey(LogicalKeyboardKey key) {
      if (key == LogicalKeyboardKey.arrowRight && group != null) {
        controller.setExpanded(
          item.value,
          Directionality.of(context) == TextDirection.ltr,
        );
        return KeyEventResult.handled;
      }
      if (key == LogicalKeyboardKey.arrowLeft && group != null) {
        controller.setExpanded(
          item.value,
          Directionality.of(context) == TextDirection.rtl,
        );
        return KeyEventResult.handled;
      }
      return KeyEventResult.ignored;
    }

    if (group == null) {
      return _TRNavigationRowSurface(
        label: item.label,
        description: item.description,
        leading: leading,
        trailing: trailing,
        selected: selected,
        active: selected,
        enabled: !disabled,
        showDisclosureIndicator: leaf?.showDisclosureIndicator ?? false,
        kind: _TRNavigationRowKind.leaf,
        onPressed: activate,
        onDirectionalKey: onDirectionalKey,
        uiSize: uiSize,
      );
    }
    final row = _TRNavigationRowSurface(
      label: item.label,
      description: item.description,
      leading: leading,
      trailing: trailing,
      active: activeBranch,
      enabled: !disabled,
      expanded: expanded,
      kind: _TRNavigationRowKind.group,
      onPressed: activate,
      onDirectionalKey: onDirectionalKey,
      uiSize: uiSize,
    );
    final nestedList = expanded
        ? Padding(
            padding: EdgeInsets.only(top: verticalPadding),
            child: Container(
              margin: const EdgeInsetsDirectional.only(
                start: TRGeneratedSpacing.md,
              ),
              padding: const EdgeInsetsDirectional.only(
                start: TRGeneratedSpacing.sm,
              ),
              decoration: BoxDecoration(
                border: BorderDirectional(
                  start: BorderSide(color: colors.border),
                ),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                mainAxisSize: MainAxisSize.min,
                spacing: verticalPadding,
                children: [
                  for (final child in group.children)
                    _TRTreeNavNode<T>(
                      key: child.key,
                      controller: controller,
                      depth: depth + 1,
                      item: child,
                      onSelect: onSelect,
                      selectedValue: selectedValue,
                      uiSize: uiSize,
                    ),
                ],
              ),
            ),
          )
        : const SizedBox.shrink();
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      mainAxisSize: MainAxisSize.min,
      children: [
        row,
        if (motionDuration == Duration.zero)
          nestedList
        else
          AnimatedSize(
            duration: motionDuration,
            curve: TRMotion.standard,
            alignment: Alignment.topCenter,
            child: nestedList,
          ),
      ],
    );
  }
}

enum _TRNavigationRowKind { leaf, group }

class _TRNavigationRowSurface extends StatefulWidget {
  const _TRNavigationRowSurface({
    required this.label,
    required this.active,
    required this.enabled,
    required this.kind,
    required this.onPressed,
    required this.uiSize,
    this.description,
    this.leading,
    this.trailing,
    this.selected = false,
    this.expanded = false,
    this.showDisclosureIndicator = false,
    this.onDirectionalKey,
  });

  final Widget label;
  final Widget? description;
  final Widget? leading;
  final Widget? trailing;
  final bool selected;
  final bool active;
  final bool enabled;
  final bool expanded;
  final bool showDisclosureIndicator;
  final _TRNavigationRowKind kind;
  final VoidCallback? onPressed;
  final KeyEventResult Function(LogicalKeyboardKey key)? onDirectionalKey;
  final TRUiSize uiSize;

  @override
  State<_TRNavigationRowSurface> createState() =>
      _TRNavigationRowSurfaceState();
}

class _TRNavigationRowSurfaceState extends State<_TRNavigationRowSurface>
    with TRFocusSourceMixin {
  final FocusNode _focusNode = FocusNode();
  bool _focused = false;
  bool _hovered = false;
  bool _pressed = false;
  final _touchPress = TRTouchPressCoordinator();

  @override
  void initState() {
    super.initState();
    initFocusSource();
    // A trailing control owns its own focus surface. Listening to the row's
    // primary focus keeps the row ring from appearing for focused descendants.
    _focusNode.addListener(_handleFocusChange);
  }

  @override
  void dispose() {
    disposeFocusSource();
    _focusNode
      ..removeListener(_handleFocusChange)
      ..dispose();
    super.dispose();
  }

  void _handleFocusChange() {
    final focused = _focusNode.hasPrimaryFocus;
    if (focused == _focused || !mounted) return;
    setState(() => _focused = focused);
  }

  void _handlePointerEnter() {
    if (_hovered) return;
    setState(() => _hovered = true);
  }

  void _handlePointerExit() {
    if (!_hovered && !_pressed) return;
    _touchPress.cancel();
    setState(() {
      _hovered = false;
      _pressed = false;
    });
  }

  void _handlePressChanged(bool pressed) {
    if (_pressed == pressed) return;
    if (!pressed) _touchPress.cancel();
    setState(() => _pressed = pressed);
  }

  void _handlePointerDown(PointerDownEvent event) {
    if (_touchPress.begin(event)) _handlePressChanged(true);
  }

  void _handlePointerEnd(PointerEvent event) {
    if (_touchPress.end(event)) _handlePressChanged(false);
  }

  void _activate() {
    if (!widget.enabled) return;
    widget.onPressed?.call();
  }

  KeyEventResult _onKey(FocusNode node, KeyEvent event) {
    if (event is! KeyDownEvent || !widget.enabled) {
      return KeyEventResult.ignored;
    }
    if (event.logicalKey == LogicalKeyboardKey.enter ||
        event.logicalKey == LogicalKeyboardKey.space) {
      _activate();
      return KeyEventResult.handled;
    }
    final directionalResult = widget.onDirectionalKey?.call(event.logicalKey);
    if (directionalResult == KeyEventResult.handled) return directionalResult!;
    if (event.logicalKey == LogicalKeyboardKey.arrowDown) {
      FocusScope.of(context).focusInDirection(TraversalDirection.down);
      return KeyEventResult.handled;
    }
    if (event.logicalKey == LogicalKeyboardKey.arrowUp) {
      FocusScope.of(context).focusInDirection(TraversalDirection.up);
      return KeyEventResult.handled;
    }
    return KeyEventResult.ignored;
  }

  @override
  Widget build(BuildContext context) {
    final isGroup = widget.kind == _TRNavigationRowKind.group;
    final colors = context.tinyrackTheme;
    final motionDuration = trPressedMotionDuration(context, pressed: _pressed);
    final motionCurve = trPressedMotionCurve(pressed: _pressed);
    final showFocusRing = focusVisible(hasFocus: _focused);
    final background = widget.enabled && _pressed
        ? colors.surfacePressed
        : widget.enabled &&
              (_hovered || _focused || (!isGroup && widget.selected))
        ? colors.surfaceHover
        : Colors.transparent;
    final foreground = widget.enabled && (widget.active || _hovered || _focused)
        ? colors.text
        : colors.textMuted;
    final contentGap = _treeNavContentGap(widget.uiSize);
    final indicator = _indicator(
      context,
      color: foreground,
      motionDuration: motionDuration,
    );
    final content = _TRTreeNavItemContent(
      description: widget.description,
      descriptionStyle: _treeNavDescriptionStyle(widget.uiSize).copyWith(
        color: colors.textMuted,
        fontFamilyFallback: TRGeneratedFontFamilies.fallback,
      ),
      label: widget.label,
      labelStyle:
          (isGroup
                  ? _treeNavGroupLabelStyle(widget.uiSize)
                  : _treeNavLeafLabelStyle(widget.uiSize))
              .copyWith(
                color: foreground,
                fontWeight: isGroup
                    ? widget.active
                          ? TRGeneratedFontWeights.bold
                          : TRGeneratedFontWeights.medium
                    : null,
                fontFamilyFallback: TRGeneratedFontFamilies.fallback,
                height: isGroup ? TRGeneratedTypographyLineHeights.sm : null,
              ),
    );

    return MouseRegion(
      cursor: widget.enabled ? SystemMouseCursors.click : MouseCursor.defer,
      onEnter: widget.enabled ? (_) => _handlePointerEnter() : null,
      onExit: widget.enabled ? (_) => _handlePointerExit() : null,
      child: Semantics(
        button: true,
        enabled: widget.enabled,
        selected: isGroup ? null : widget.selected,
        expanded: isGroup ? widget.expanded : null,
        child: Focus(
          focusNode: _focusNode,
          canRequestFocus: widget.enabled,
          skipTraversal: !widget.enabled,
          onKeyEvent: _onKey,
          child: Listener(
            onPointerCancel: widget.enabled ? _handlePointerEnd : null,
            onPointerDown: widget.enabled ? _handlePointerDown : null,
            onPointerUp: widget.enabled ? _handlePointerEnd : null,
            child: GestureDetector(
              behavior: HitTestBehavior.opaque,
              onTap: widget.enabled ? _activate : null,
              onTapCancel: widget.enabled
                  ? () => _handlePressChanged(false)
                  : null,
              onTapDown: widget.enabled
                  ? (_) => _handlePressChanged(true)
                  : null,
              onTapUp: widget.enabled
                  ? (_) => _handlePressChanged(false)
                  : null,
              child: AnimatedOpacity(
                curve: motionCurve,
                duration: motionDuration,
                opacity: widget.enabled ? 1 : TRGeneratedOpacity.disabled,
                child: AnimatedContainer(
                  curve: motionCurve,
                  duration: motionDuration,
                  constraints: BoxConstraints(
                    minHeight: isGroup
                        ? _treeNavGroupMinHeight(widget.uiSize)
                        : _treeNavLeafMinHeight(widget.uiSize),
                  ),
                  padding: EdgeInsets.symmetric(
                    horizontal: TRGeneratedSpacing.md,
                    vertical: _treeNavVerticalPadding(widget.uiSize),
                  ),
                  // Keep the ring layer mounted so focus changes do not re-inflate
                  // the row and destroy a trailing control's focus node.
                  foregroundDecoration: BoxDecoration(
                    border: Border.all(
                      color: showFocusRing ? colors.focus : Colors.transparent,
                      width: TRGeneratedBorders.focusWidth,
                    ),
                    borderRadius: BorderRadius.circular(TRGeneratedRadii.md),
                  ),
                  decoration: BoxDecoration(
                    color: background,
                    borderRadius: BorderRadius.circular(TRGeneratedRadii.md),
                  ),
                  child: _treeNavIconTheme(
                    widget.uiSize,
                    Row(
                      children: [
                        ?widget.leading,
                        if (widget.leading != null) SizedBox(width: contentGap),
                        Expanded(
                          child: isGroup
                              ? Transform.translate(
                                  offset: const Offset(
                                    0,
                                    -TRGeneratedBorders.defaultWidth / 2,
                                  ),
                                  child: content,
                                )
                              : content,
                        ),
                        if (widget.trailing != null) ...[
                          SizedBox(width: contentGap),
                          widget.trailing!,
                        ],
                        if (indicator != null) ...[
                          if (widget.trailing != null)
                            SizedBox(width: contentGap),
                          indicator,
                        ],
                      ],
                    ),
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget? _indicator(
    BuildContext context, {
    required Color color,
    required Duration motionDuration,
  }) {
    if (widget.kind == _TRNavigationRowKind.group) {
      if (widget.trailing != null) return null;
      return AnimatedRotation(
        duration: motionDuration,
        curve: TRMotion.standard,
        turns: widget.expanded ? 0.25 : 0,
        child: Icon(
          LucideIcons.chevronRight,
          color: color,
          size: _treeNavChevronSize(widget.uiSize),
        ),
      );
    }
    if (!widget.enabled || !widget.showDisclosureIndicator) return null;
    return Icon(
      Directionality.of(context) == TextDirection.rtl
          ? LucideIcons.chevronLeft
          : LucideIcons.chevronRight,
      color: color,
      size: _treeNavChevronSize(widget.uiSize),
    );
  }
}

double _treeNavLeafMinHeight(TRUiSize uiSize) => switch (uiSize) {
  TRUiSize.sm ||
  TRUiSize.md => TRControlMetrics.heightOf(uiSize) + TRSpacing.extraSmall * 2,
  TRUiSize.lg || TRUiSize.xl => TRControlMetrics.heightOf(uiSize),
};

double _treeNavGroupMinHeight(TRUiSize uiSize) =>
    TRControlMetrics.heightOf(uiSize);

double _treeNavVerticalPadding(TRUiSize uiSize) => TRSpacing.small;

double _treeNavContentGap(TRUiSize uiSize) => switch (uiSize) {
  TRUiSize.sm => TRSpacing.extraSmall,
  TRUiSize.md || TRUiSize.lg || TRUiSize.xl => TRSpacing.small,
};

double _treeNavChevronSize(TRUiSize uiSize) => uiSize == TRUiSize.md
    ? TRSpacing.medium
    : TRControlMetrics.iconSizeOf(uiSize);

TextStyle _treeNavLeafLabelStyle(TRUiSize uiSize) => TRGeneratedTextStyles
    .bodySm
    .copyWith(fontSize: TRControlMetrics.fontSizeOf(uiSize));

TextStyle _treeNavGroupLabelStyle(TRUiSize uiSize) {
  if (uiSize == TRUiSize.md) return TRGeneratedTextStyles.label;
  final fontSize = TRControlMetrics.fontSizeOf(uiSize);
  return TRGeneratedTextStyles.label.copyWith(
    fontSize: fontSize,
    letterSpacing: TRGeneratedTypographyTracking.lg * fontSize,
  );
}

TextStyle _treeNavDescriptionStyle(TRUiSize uiSize) {
  final supportingSize = switch (uiSize) {
    TRUiSize.sm || TRUiSize.md => TRUiSize.sm,
    TRUiSize.lg => TRUiSize.md,
    TRUiSize.xl => TRUiSize.lg,
  };
  return TRGeneratedTextStyles.caption.copyWith(
    fontSize: TRControlMetrics.fontSizeOf(supportingSize),
  );
}

Widget _treeNavIconTheme(TRUiSize uiSize, Widget child) => uiSize == TRUiSize.md
    ? child
    : IconTheme.merge(
        data: IconThemeData(size: TRControlMetrics.iconSizeOf(uiSize)),
        child: child,
      );

bool _containsValue<T extends Object>(
  List<TRTreeNavItem<T>> items,
  T? selectedValue,
) {
  if (selectedValue == null) return false;
  for (final item in items) {
    if (item.value == selectedValue) return true;
    if (item case final TRTreeNavGroup<T> group) {
      if (_containsValue(group.children, selectedValue)) return true;
    }
  }
  return false;
}

class _TRTreeNavItemContent extends StatelessWidget {
  const _TRTreeNavItemContent({
    required this.description,
    required this.descriptionStyle,
    required this.label,
    required this.labelStyle,
  });

  final Widget? description;
  final TextStyle descriptionStyle;
  final Widget label;
  final TextStyle labelStyle;

  @override
  Widget build(BuildContext context) {
    final description = this.description;
    if (description == null) {
      return DefaultTextStyle.merge(style: labelStyle, child: label);
    }
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisSize: MainAxisSize.min,
      children: [
        DefaultTextStyle.merge(style: labelStyle, child: label),
        DefaultTextStyle.merge(
          maxLines: 1,
          overflow: TextOverflow.ellipsis,
          style: descriptionStyle,
          child: description,
        ),
      ],
    );
  }
}

Set<T> _initiallyExpanded<T extends Object>(List<TRTreeNavItem<T>> items) {
  final values = <T>{};
  for (final item in items) {
    if (item case final TRTreeNavGroup<T> group) {
      if (group.initiallyExpanded) values.add(group.value);
      values.addAll(_initiallyExpanded(group.children));
    }
  }
  return values;
}
