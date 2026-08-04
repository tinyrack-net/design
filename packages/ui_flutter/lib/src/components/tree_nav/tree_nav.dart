import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:lucide_flutter/lucide_flutter.dart';

import '../../generated/tokens.g.dart';
import '../../theme.dart';

/// Base class for tree navigation nodes.
sealed class TRTreeNavItem<T extends Object> {
  const TRTreeNavItem({
    required this.value,
    required this.label,
    this.disabled,
  });

  final T value;
  final Widget label;
  final bool? disabled;
}

/// Expandable tree navigation group.
final class TRTreeNavGroup<T extends Object> extends TRTreeNavItem<T> {
  const TRTreeNavGroup({
    required super.value,
    required super.label,
    required this.children,
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
    final stored = PageStorage.maybeOf(
      context,
    )?.readState(context, identifier: widget.pageStorageId);
    if (stored is Set<T>) _controller.replaceExpanded(stored);
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
        spacing: TRGeneratedSpacing.lg,
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

class _TRTreeNavNode<T extends Object> extends StatelessWidget {
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
  Widget build(BuildContext context) {
    final group = item is TRTreeNavGroup<T> ? item as TRTreeNavGroup<T> : null;
    final leaf = item is TRTreeNavLeaf<T> ? item as TRTreeNavLeaf<T> : null;
    final expanded = group != null && controller.expanded.contains(item.value);
    final selected = selectedValue == item.value;
    final disabled = item.disabled ?? false;
    final leading = group?.leading ?? leaf?.leading;
    final trailing = group?.trailing ?? leaf?.trailing;

    void activate() {
      if (disabled) return;
      group == null ? onSelect(item.value) : controller.toggle(item.value);
    }

    KeyEventResult onKey(FocusNode node, KeyEvent event) {
      if (event is! KeyDownEvent || disabled) return KeyEventResult.ignored;
      if (event.logicalKey == LogicalKeyboardKey.enter ||
          event.logicalKey == LogicalKeyboardKey.space) {
        activate();
        return KeyEventResult.handled;
      }
      if (event.logicalKey == LogicalKeyboardKey.arrowRight && group != null) {
        controller.setExpanded(item.value, true);
        return KeyEventResult.handled;
      }
      if (event.logicalKey == LogicalKeyboardKey.arrowLeft && group != null) {
        controller.setExpanded(item.value, false);
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

    final colors = context.tinyrackTheme;
    if (group == null) {
      final fontSize = depth == 0
          ? TRGeneratedTypographySizes.md
          : TRGeneratedTypographySizes.sm;
      final lineHeight = depth == 0
          ? TRGeneratedFlutterRendering.normalLineMd
          : TRGeneratedTypographySizes.sm * TRGeneratedTypographyLineHeights.md;
      return Semantics(
        button: true,
        enabled: !disabled,
        selected: selected,
        child: Focus(
          onKeyEvent: onKey,
          child: InkWell(
            onTap: disabled ? null : activate,
            borderRadius: BorderRadius.circular(TRGeneratedRadii.sm),
            child: Container(
              height: lineHeight,
              decoration: BoxDecoration(
                color: selected ? colors.surfaceSelected : Colors.transparent,
                borderRadius: BorderRadius.circular(TRGeneratedRadii.sm),
              ),
              child: Row(
                children: [
                  ?leading,
                  if (leading != null)
                    const SizedBox(width: TRGeneratedSpacing.xs),
                  Expanded(
                    child: DefaultTextStyle.merge(
                      style: TextStyle(
                        color: disabled ? colors.textMuted : colors.text,
                        fontFamily: TRGeneratedFontFamilies.body,
                        fontFamilyFallback: TRGeneratedFontFamilies.fallback,
                        fontSize: fontSize,
                        height: lineHeight / fontSize,
                      ),
                      child: depth == 0
                          ? item.label
                          : Transform.translate(
                              offset: const Offset(
                                0,
                                TRGeneratedBorders.defaultWidth,
                              ),
                              child: item.label,
                            ),
                    ),
                  ),
                  ?trailing,
                ],
              ),
            ),
          ),
        ),
      );
    }
    final row = Semantics(
      button: true,
      enabled: !disabled,
      expanded: expanded,
      child: Focus(
        onKeyEvent: onKey,
        child: InkWell(
          onTap: disabled ? null : activate,
          borderRadius: BorderRadius.circular(TRGeneratedRadii.md),
          child: Container(
            height: TRGeneratedLayerMetrics.treeItemHeight,
            padding: const EdgeInsets.symmetric(
              horizontal: TRGeneratedSpacing.md,
              vertical: TRGeneratedSpacing.xs,
            ),
            decoration: BoxDecoration(
              color: Colors.transparent,
              borderRadius: BorderRadius.circular(TRGeneratedRadii.md),
            ),
            child: Row(
              children: [
                ?leading,
                if (leading != null)
                  const SizedBox(width: TRGeneratedSpacing.sm),
                Expanded(
                  child: DefaultTextStyle.merge(
                    style: TRGeneratedTextStyles.label.copyWith(
                      color: disabled ? colors.textMuted : colors.text,
                      fontFamilyFallback: TRGeneratedFontFamilies.fallback,
                    ),
                    child: Builder(
                      builder: (context) =>
                          DefaultTextStyle.merge(child: item.label),
                    ),
                  ),
                ),
                trailing ??
                    Icon(
                      expanded
                          ? LucideIcons.chevronDown
                          : LucideIcons.chevronRight,
                      color: disabled ? colors.textMuted : colors.textMuted,
                      size: TRGeneratedSpacing.md,
                    ),
              ],
            ),
          ),
        ),
      ),
    );
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      mainAxisSize: MainAxisSize.min,
      children: [
        row,
        AnimatedSize(
          duration: MediaQuery.disableAnimationsOf(context)
              ? Duration.zero
              : TRGeneratedMotion.fast,
          alignment: Alignment.topCenter,
          child: expanded
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
                            controller: controller,
                            depth: depth + 1,
                            item: child,
                            onSelect: onSelect,
                            selectedValue: selectedValue,
                          ),
                      ],
                    ),
                  ),
                )
              : const SizedBox.shrink(),
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
