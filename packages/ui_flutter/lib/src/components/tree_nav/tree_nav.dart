import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:lucide_flutter/lucide_flutter.dart';

import '../../generated/tokens.g.dart';
import '../../theme.dart';
import '../../tokens.dart';

/// Base class for tree navigation nodes.
sealed class TRTreeNavItem<T extends Object> {
  const TRTreeNavItem({
    required this.value,
    required this.label,
    this.description,
    this.disabled,
  });

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
    super.description,
    super.disabled,
    this.leading,
    this.trailing,
  });

  final Widget? leading;
  final Widget? trailing;
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
  Widget build(BuildContext context) => Semantics(
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
              controller: _controller,
              depth: 0,
              item: item,
              onSelect: _select,
              selectedValue: _value,
            ),
        ],
      ),
    ),
  );
}

class _TRTreeNavNode<T extends Object> extends StatefulWidget {
  const _TRTreeNavNode({
    required this.controller,
    required this.depth,
    required this.item,
    required this.onSelect,
    required this.selectedValue,
  });

  final TRTreeNavController<T> controller;
  final int depth;
  final TRTreeNavItem<T> item;
  final ValueChanged<T> onSelect;
  final T? selectedValue;

  @override
  State<_TRTreeNavNode<T>> createState() => _TRTreeNavNodeState<T>();
}

class _TRTreeNavNodeState<T extends Object> extends State<_TRTreeNavNode<T>> {
  final FocusNode _focusNode = FocusNode();
  bool _focused = false;
  bool _hovered = false;

  @override
  void initState() {
    super.initState();
    // A row carries the focus surface only while it is the focused control
    // itself. `Focus.onFocusChange` reports `hasFocus`, which a trailing button
    // or menu trigger inside the row also satisfies; listening to the node
    // reads the primary focus directly and reports it on every change.
    _focusNode.addListener(_handleFocusChange);
  }

  @override
  void dispose() {
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

  @override
  Widget build(BuildContext context) {
    final item = widget.item;
    final group = item is TRTreeNavGroup<T> ? item : null;
    final leaf = item is TRTreeNavLeaf<T> ? item : null;
    final expanded =
        group != null && widget.controller.expanded.contains(item.value);
    final selected = widget.selectedValue == item.value;
    final activeBranch =
        group != null && _containsValue(group.children, widget.selectedValue);
    final disabled = item.disabled ?? false;
    final leading = group?.leading ?? leaf?.leading;
    final trailing = group?.trailing ?? leaf?.trailing;
    final showFocusRing =
        _focused &&
        FocusManager.instance.highlightMode == FocusHighlightMode.traditional;
    final colors = context.tinyrackTheme;
    final motionDuration = MediaQuery.disableAnimationsOf(context)
        ? Duration.zero
        : TRMotion.fast;

    void activate() {
      if (disabled) return;
      group == null
          ? widget.onSelect(item.value)
          : widget.controller.toggle(item.value);
    }

    KeyEventResult onKey(FocusNode node, KeyEvent event) {
      if (event is! KeyDownEvent || disabled) return KeyEventResult.ignored;
      if (event.logicalKey == LogicalKeyboardKey.enter ||
          event.logicalKey == LogicalKeyboardKey.space) {
        activate();
        return KeyEventResult.handled;
      }
      if (event.logicalKey == LogicalKeyboardKey.arrowRight && group != null) {
        widget.controller.setExpanded(
          item.value,
          Directionality.of(context) == TextDirection.ltr,
        );
        return KeyEventResult.handled;
      }
      if (event.logicalKey == LogicalKeyboardKey.arrowLeft && group != null) {
        widget.controller.setExpanded(
          item.value,
          Directionality.of(context) == TextDirection.rtl,
        );
        return KeyEventResult.handled;
      }
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

    if (group == null) {
      final background = !disabled && (_hovered || _focused || selected)
          ? colors.surfaceHover
          : Colors.transparent;
      return MouseRegion(
        cursor: disabled ? MouseCursor.defer : SystemMouseCursors.click,
        onEnter: (_) => setState(() => _hovered = true),
        onExit: (_) => setState(() => _hovered = false),
        child: Semantics(
          button: true,
          enabled: !disabled,
          selected: selected,
          child: Focus(
            focusNode: _focusNode,
            canRequestFocus: !disabled,
            skipTraversal: disabled,
            onKeyEvent: onKey,
            child: GestureDetector(
              behavior: HitTestBehavior.opaque,
              onTap: disabled ? null : activate,
              child: AnimatedOpacity(
                duration: motionDuration,
                opacity: disabled ? TRGeneratedOpacity.disabled : 1,
                child: AnimatedContainer(
                  duration: motionDuration,
                  constraints: const BoxConstraints(
                    // Web navigation links use a 32px content box plus 4px
                    // block padding on each side (content-box sizing).
                    minHeight:
                        TRGeneratedControlMetrics.mdHeight +
                        TRGeneratedSpacing.xs * 2,
                  ),
                  padding: const EdgeInsets.symmetric(
                    horizontal: TRGeneratedSpacing.md,
                    vertical: TRGeneratedSpacing.xs,
                  ),
                  // The ring is always present and only changes colour.
                  // Swapping it against null adds and removes a foreground
                  // layer, which re-inflates the row; the trailing control's
                  // focus node would then be destroyed as traversal steps onto
                  // it, trapping the keyboard inside the tree.
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
                  child: Row(
                    children: [
                      ?leading,
                      if (leading != null)
                        const SizedBox(width: TRGeneratedSpacing.sm),
                      Expanded(
                        child: _TRTreeNavItemContent(
                          description: item.description,
                          descriptionStyle: TRGeneratedTextStyles.caption
                              .copyWith(
                                color: colors.textMuted,
                                fontFamilyFallback:
                                    TRGeneratedFontFamilies.fallback,
                              ),
                          label: item.label,
                          labelStyle: TRGeneratedTextStyles.bodySm.copyWith(
                            color: selected || _hovered || _focused
                                ? colors.text
                                : colors.textMuted,
                            fontFamilyFallback:
                                TRGeneratedFontFamilies.fallback,
                          ),
                        ),
                      ),
                      if (trailing != null) ...[
                        const SizedBox(width: TRGeneratedSpacing.sm),
                        trailing,
                      ],
                    ],
                  ),
                ),
              ),
            ),
          ),
        ),
      );
    }
    final groupBackground = !disabled && (_hovered || _focused)
        ? colors.surfaceHover
        : Colors.transparent;
    final groupColor = disabled
        ? colors.textMuted
        : activeBranch || _hovered || _focused
        ? colors.text
        : colors.textMuted;
    final row = MouseRegion(
      cursor: disabled ? MouseCursor.defer : SystemMouseCursors.click,
      onEnter: (_) => setState(() => _hovered = true),
      onExit: (_) => setState(() => _hovered = false),
      child: Semantics(
        button: true,
        enabled: !disabled,
        expanded: expanded,
        child: Focus(
          focusNode: _focusNode,
          canRequestFocus: !disabled,
          skipTraversal: disabled,
          onKeyEvent: onKey,
          child: GestureDetector(
            behavior: HitTestBehavior.opaque,
            onTap: disabled ? null : activate,
            child: AnimatedOpacity(
              duration: motionDuration,
              opacity: disabled ? TRGeneratedOpacity.disabled : 1,
              child: AnimatedContainer(
                duration: motionDuration,
                constraints: const BoxConstraints(
                  minHeight: TRGeneratedLayerMetrics.treeItemHeight,
                ),
                padding: const EdgeInsets.symmetric(
                  horizontal: TRGeneratedSpacing.md,
                  vertical: TRGeneratedSpacing.xs,
                ),
                foregroundDecoration: showFocusRing
                    ? BoxDecoration(
                        border: Border.all(
                          color: colors.focus,
                          width: TRGeneratedBorders.focusWidth,
                        ),
                        borderRadius: BorderRadius.circular(
                          TRGeneratedRadii.md,
                        ),
                      )
                    : null,
                decoration: BoxDecoration(
                  color: groupBackground,
                  borderRadius: BorderRadius.circular(TRGeneratedRadii.md),
                ),
                child: Row(
                  children: [
                    ?leading,
                    if (leading != null)
                      const SizedBox(width: TRGeneratedSpacing.sm),
                    Expanded(
                      child: Transform.translate(
                        offset: const Offset(
                          0,
                          -TRGeneratedBorders.defaultWidth / 2,
                        ),
                        child: _TRTreeNavItemContent(
                          description: item.description,
                          descriptionStyle: TRGeneratedTextStyles.caption
                              .copyWith(
                                color: colors.textMuted,
                                fontFamilyFallback:
                                    TRGeneratedFontFamilies.fallback,
                              ),
                          label: item.label,
                          labelStyle: TRGeneratedTextStyles.label.copyWith(
                            color: groupColor,
                            fontWeight: activeBranch
                                ? TRGeneratedFontWeights.bold
                                : TRGeneratedFontWeights.medium,
                            fontFamilyFallback:
                                TRGeneratedFontFamilies.fallback,
                            height: TRGeneratedTypographyLineHeights.sm,
                          ),
                        ),
                      ),
                    ),
                    if (trailing != null) ...[
                      const SizedBox(width: TRGeneratedSpacing.sm),
                      trailing,
                    ] else
                      AnimatedRotation(
                        duration: motionDuration,
                        curve: TRMotion.standard,
                        turns: expanded ? 0.25 : 0,
                        child: Icon(
                          LucideIcons.chevronRight,
                          color: groupColor,
                          size: TRGeneratedSpacing.md,
                        ),
                      ),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
    final nestedList = expanded
        ? Padding(
            padding: const EdgeInsets.only(top: TRGeneratedSpacing.xs),
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
                spacing: TRGeneratedSpacing.xs,
                children: [
                  for (final child in group.children)
                    _TRTreeNavNode<T>(
                      controller: widget.controller,
                      depth: widget.depth + 1,
                      item: child,
                      onSelect: widget.onSelect,
                      selectedValue: widget.selectedValue,
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
