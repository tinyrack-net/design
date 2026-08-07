import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../../internal/focus_source.dart';

import '../../generated/tokens.g.dart';
import '../../theme.dart';
import '../../tokens.dart';
import '../../types.dart';

// @tinyrack-preview toggle
/// A two-state pressable Tinyrack control.
class TRToggle extends StatefulWidget {
  const TRToggle({
    required this.child,
    this.pressed,
    this.defaultPressed = false,
    this.onPressedChange,
    this.disabled = false,
    this.uiSize = TRUiSize.md,
    this.focusNode,
    this.autofocus = false,
    this.value,
    super.key,
  });

  final Widget child;
  final bool? pressed;
  final bool defaultPressed;
  final ValueChanged<bool>? onPressedChange;
  final bool disabled;
  final TRUiSize uiSize;
  final FocusNode? focusNode;
  final bool autofocus;

  /// Identifies this toggle when nested inside a [TRToggleGroup].
  final String? value;

  @override
  State<TRToggle> createState() => _TRToggleState();
}

class _TRToggleState extends State<TRToggle> with TRFocusSourceMixin {
  late bool _uncontrolledPressed = widget.defaultPressed;
  FocusNode? _internalFocusNode;
  bool _hovered = false;
  bool _focused = false;
  bool _spaceDown = false;

  /// An explicit [TRToggle.focusNode] always wins; a grouped toggle otherwise
  /// borrows the node its [TRToggleGroup] manages for roving focus.
  FocusNode _resolveFocusNode(FocusNode? groupNode) =>
      widget.focusNode ?? groupNode ?? (_internalFocusNode ??= FocusNode());

  /// Native buttons activate Space on key release, not key press.
  KeyEventResult _handleSpace(KeyEvent event, VoidCallback activate) {
    if (event.logicalKey != LogicalKeyboardKey.space) {
      return KeyEventResult.ignored;
    }
    if (event is KeyDownEvent) {
      _spaceDown = true;
    } else if (event is KeyUpEvent && _spaceDown) {
      _spaceDown = false;
      activate();
    }
    return KeyEventResult.handled;
  }

  @override
  void initState() {
    super.initState();
    initFocusSource();
  }

  @override
  void dispose() {
    disposeFocusSource();
    _internalFocusNode?.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final colors = context.tinyrackTheme;
    final generated = Theme.of(context).brightness == Brightness.light
        ? TRGeneratedColors.light
        : TRGeneratedColors.dark;
    final scope = _TRToggleGroupScope.maybeOf(context);
    final grouped = widget.value != null && scope != null;
    final itemScope = grouped ? _TRToggleGroupItemScope.maybeOf(context) : null;
    // Captured eagerly so the focus callback needs no null checks.
    final rovingScope = grouped && itemScope != null ? scope : null;
    final rovingIndex = itemScope?.index ?? -1;
    final focusNode = _resolveFocusNode(rovingScope?.focusNodeAt(rovingIndex));
    final pressed = grouped
        ? scope.selected.contains(widget.value)
        : widget.pressed ?? _uncontrolledPressed;
    final disabled = widget.disabled || (grouped && scope.disabled);

    void toggle() {
      if (disabled) return;
      if (grouped) {
        scope.onToggle(widget.value!);
        return;
      }
      final next = !pressed;
      if (widget.pressed == null) setState(() => _uncontrolledPressed = next);
      widget.onPressedChange?.call(next);
    }

    final showFocusRing = focusVisible(hasFocus: _focused);
    // The web hover rule outranks the pressed rule by selector specificity,
    // so a hovered toggle shows the hover fill even while pressed.
    final background = _hovered && !disabled
        ? colors.surfaceHover
        : pressed
        ? generated.surfaceSelected
        : colors.surface;
    final borderColor = pressed ? colors.primary : generated.controlBorder;
    final height = switch (widget.uiSize) {
      TRUiSize.sm => TRGeneratedControlMetrics.smHeight,
      TRUiSize.md => TRGeneratedControlMetrics.mdHeight,
      TRUiSize.lg => TRGeneratedControlMetrics.lgHeight,
    };
    final paddingInline = switch (widget.uiSize) {
      TRUiSize.sm => TRGeneratedControlMetrics.smPaddingInline,
      TRUiSize.md => TRGeneratedControlMetrics.mdPaddingInline,
      TRUiSize.lg => TRGeneratedControlMetrics.lgPaddingInline,
    };
    final fontSize = switch (widget.uiSize) {
      TRUiSize.sm => TRGeneratedControlMetrics.smFontSize,
      TRUiSize.md => TRGeneratedControlMetrics.mdFontSize,
      TRUiSize.lg => TRGeneratedControlMetrics.lgFontSize,
    };
    final lineHeight = switch (widget.uiSize) {
      TRUiSize.sm => TRGeneratedControlMetrics.smLineHeight,
      TRUiSize.md => TRGeneratedControlMetrics.mdLineHeight,
      TRUiSize.lg => TRGeneratedControlMetrics.lgLineHeight,
    };
    final motionDuration = MediaQuery.disableAnimationsOf(context)
        ? Duration.zero
        : TRMotion.fast;
    final childText = widget.child is Text ? (widget.child as Text).data : null;
    final usesCjkFallback =
        childText != null &&
        RegExp(
          r'[\u3040-\u30ff\u3400-\u9fff\uac00-\ud7af]',
        ).hasMatch(childText);
    final japanese = Localizations.localeOf(context).languageCode == 'ja';
    final english = Localizations.localeOf(context).languageCode == 'en';

    return CallbackShortcuts(
      bindings: disabled
          ? const {}
          : {const SingleActivator(LogicalKeyboardKey.enter): toggle},
      child: MouseRegion(
        cursor: disabled ? MouseCursor.defer : SystemMouseCursors.click,
        onEnter: (_) => setState(() => _hovered = true),
        onExit: (_) => setState(() => _hovered = false),
        child: Focus(
          autofocus: widget.autofocus,
          focusNode: focusNode,
          // Grouped toggles share one tab stop: Tab reaches the active item and
          // the arrow keys move between the rest.
          canRequestFocus: !(rovingScope != null && disabled),
          skipTraversal:
              rovingScope != null &&
              (disabled || rovingScope.activeIndex != rovingIndex),
          onFocusChange: (focused) {
            setState(() => _focused = focused);
            if (focused) rovingScope?.onFocusItem(rovingIndex);
          },
          onKeyEvent: disabled
              ? null
              : (node, event) => _handleSpace(event, toggle),
          child: GestureDetector(
            behavior: HitTestBehavior.opaque,
            onTap: disabled ? null : toggle,
            child: Semantics(
              button: true,
              enabled: !disabled,
              toggled: pressed,
              child: AnimatedOpacity(
                curve: TRMotion.standard,
                duration: motionDuration,
                opacity: disabled ? TRGeneratedOpacity.disabled : 1,
                child: CustomPaint(
                  foregroundPainter: _TRToggleFocusRingPainter(
                    color: colors.focus,
                    visible: showFocusRing,
                  ),
                  child: AnimatedContainer(
                    curve: TRMotion.standard,
                    duration: motionDuration,
                    constraints: BoxConstraints(minHeight: height),
                    padding: EdgeInsets.symmetric(horizontal: paddingInline),
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(TRGeneratedRadii.md),
                      border: Border.all(
                        color: borderColor,
                        width: TRGeneratedBorders.defaultWidth,
                      ),
                      color: background,
                    ),
                    child: Center(
                      widthFactor: 1,
                      child: DefaultTextStyle.merge(
                        style: TextStyle(
                          color: colors.text,
                          fontFamily: TRGeneratedFontFamilies.body,
                          fontSize: fontSize,
                          fontWeight: TRGeneratedFontWeights.medium,
                          height: lineHeight / fontSize,
                          letterSpacing: usesCjkFallback && !japanese
                              ? -TRGeneratedBorders.defaultWidth /
                                    (TRGeneratedSpacing.size3xs +
                                        TRGeneratedBorders.defaultWidth)
                              : english
                              ? -TRGeneratedBorders.defaultWidth /
                                    TRGeneratedSpacing.xl
                              : null,
                        ),
                        child: widget.child,
                      ),
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
}

class _TRToggleFocusRingPainter extends CustomPainter {
  const _TRToggleFocusRingPainter({required this.color, required this.visible});

  final Color color;
  final bool visible;

  @override
  void paint(Canvas canvas, Size size) {
    if (!visible) return;
    const width = TRGeneratedBorders.focusWidth;
    const offset = TRGeneratedBorders.focusOffset;
    final rect = (Offset.zero & size).inflate(offset + width / 2);
    canvas.drawRRect(
      RRect.fromRectAndRadius(
        rect,
        const Radius.circular(
          TRGeneratedRadii.md + TRGeneratedBorders.focusOffset + width / 2,
        ),
      ),
      Paint()
        ..color = color
        ..style = PaintingStyle.stroke
        ..strokeWidth = width,
    );
  }

  @override
  bool shouldRepaint(_TRToggleFocusRingPainter oldDelegate) =>
      color != oldDelegate.color || visible != oldDelegate.visible;
}

// @tinyrack-preview toggle-group
/// Coordinates the pressed state of a set of [TRToggle] children by value.
class TRToggleGroup extends StatefulWidget {
  const TRToggleGroup({
    required this.children,
    this.value,
    this.defaultValue = const [],
    this.multiple = false,
    this.onValueChange,
    this.disabled = false,
    this.orientation = Axis.horizontal,
    this.loopFocus = true,
    super.key,
  });

  final List<TRToggle> children;
  final List<String>? value;
  final List<String> defaultValue;
  final bool multiple;
  final ValueChanged<List<String>>? onValueChange;
  final bool disabled;
  final Axis orientation;

  /// Wraps arrow-key focus at the first and last enabled item.
  final bool loopFocus;

  @override
  State<TRToggleGroup> createState() => _TRToggleGroupState();
}

class _TRToggleGroupState extends State<TRToggleGroup> {
  late Set<String> _uncontrolledValue = widget.defaultValue.toSet();
  final List<FocusNode> _focusNodes = [];
  int? _focusedIndex;

  @override
  void dispose() {
    for (final node in _focusNodes) {
      node.dispose();
    }
    super.dispose();
  }

  bool _enabledAt(int index) =>
      !widget.disabled && !widget.children[index].disabled;

  /// Grows the node pool to cover the current children. Extra nodes from a
  /// shorter child list are kept until dispose so a node is never released
  /// while the [Focus] that still holds it unmounts.
  void _syncFocusNodes() {
    while (_focusNodes.length < widget.children.length) {
      _focusNodes.add(
        FocusNode(debugLabel: 'TRToggleGroup item ${_focusNodes.length}'),
      );
    }
  }

  /// The single item Tab reaches: the last focused item when it is still
  /// enabled, then the first enabled selected item, then the first enabled one.
  int _resolveActiveIndex(Set<String> selected) {
    final focused = _focusedIndex;
    if (focused != null && focused < widget.children.length) {
      if (_enabledAt(focused)) return focused;
    }
    for (var index = 0; index < widget.children.length; index++) {
      final value = widget.children[index].value;
      if (_enabledAt(index) && value != null && selected.contains(value)) {
        return index;
      }
    }
    for (var index = 0; index < widget.children.length; index++) {
      if (_enabledAt(index)) return index;
    }
    return 0;
  }

  void _focusItem(int index) {
    if (!mounted) return;
    if (_focusedIndex != index) setState(() => _focusedIndex = index);
  }

  /// Focuses the node the item actually uses, which is its own
  /// [TRToggle.focusNode] when one was provided.
  void _requestFocus(int index) {
    _focusItem(index);
    (widget.children[index].focusNode ?? _focusNodes[index]).requestFocus();
  }

  /// Steps by [delta] to the next enabled item, wrapping only when
  /// [TRToggleGroup.loopFocus] is set.
  bool _moveFocus(int from, int delta) {
    final count = widget.children.length;
    var index = from;
    for (var step = 0; step < count; step++) {
      index += delta;
      if (index < 0 || index >= count) {
        if (!widget.loopFocus) return false;
        index = index < 0 ? count - 1 : 0;
      }
      if (index == from) return false;
      if (_enabledAt(index)) {
        _requestFocus(index);
        return true;
      }
    }
    return false;
  }

  bool _focusEdge({required bool last}) {
    final count = widget.children.length;
    for (var step = 0; step < count; step++) {
      final index = last ? count - 1 - step : step;
      if (_enabledAt(index)) {
        _requestFocus(index);
        return true;
      }
    }
    return false;
  }

  KeyEventResult _handleKey(KeyEvent event, int activeIndex) {
    if (event is! KeyDownEvent || widget.disabled) {
      return KeyEventResult.ignored;
    }
    final horizontal = widget.orientation == Axis.horizontal;
    final previousKey = horizontal
        ? LogicalKeyboardKey.arrowLeft
        : LogicalKeyboardKey.arrowUp;
    final nextKey = horizontal
        ? LogicalKeyboardKey.arrowRight
        : LogicalKeyboardKey.arrowDown;
    final key = event.logicalKey;
    if (key == previousKey) {
      _moveFocus(activeIndex, -1);
      return KeyEventResult.handled;
    }
    if (key == nextKey) {
      _moveFocus(activeIndex, 1);
      return KeyEventResult.handled;
    }
    if (key == LogicalKeyboardKey.home) {
      _focusEdge(last: false);
      return KeyEventResult.handled;
    }
    if (key == LogicalKeyboardKey.end) {
      _focusEdge(last: true);
      return KeyEventResult.handled;
    }
    return KeyEventResult.ignored;
  }

  void _toggleValue(String value) {
    final current = widget.value?.toSet() ?? _uncontrolledValue;
    final next = <String>{...current};
    if (widget.multiple) {
      if (!next.add(value)) next.remove(value);
    } else {
      next
        ..clear()
        ..addAll(current.contains(value) ? const <String>{} : {value});
    }
    if (widget.value == null) setState(() => _uncontrolledValue = next);
    widget.onValueChange?.call(next.toList(growable: false));
  }

  @override
  Widget build(BuildContext context) {
    final selected = widget.value?.toSet() ?? _uncontrolledValue;
    _syncFocusNodes();
    final activeIndex = _resolveActiveIndex(selected);
    return Semantics(
      container: true,
      child: _TRToggleGroupScope(
        activeIndex: activeIndex,
        disabled: widget.disabled,
        focusNodes: _focusNodes,
        onFocusItem: _focusItem,
        onToggle: _toggleValue,
        selected: selected,
        child: Focus(
          canRequestFocus: false,
          skipTraversal: true,
          onKeyEvent: (node, event) => _handleKey(event, activeIndex),
          child: Flex(
            direction: widget.orientation,
            mainAxisSize: MainAxisSize.min,
            spacing: TRGeneratedSpacing.xs,
            children: [
              for (final (index, child) in widget.children.indexed)
                _TRToggleGroupItemScope(index: index, child: child),
            ],
          ),
        ),
      ),
    );
  }
}

class _TRToggleGroupScope extends InheritedWidget {
  const _TRToggleGroupScope({
    required this.activeIndex,
    required this.disabled,
    required this.focusNodes,
    required this.onFocusItem,
    required this.onToggle,
    required this.selected,
    required super.child,
  });

  final int activeIndex;
  final bool disabled;
  final List<FocusNode> focusNodes;
  final ValueChanged<int> onFocusItem;
  final ValueChanged<String> onToggle;
  final Set<String> selected;

  FocusNode? focusNodeAt(int index) =>
      index < focusNodes.length ? focusNodes[index] : null;

  static _TRToggleGroupScope? maybeOf(BuildContext context) =>
      context.dependOnInheritedWidgetOfExactType<_TRToggleGroupScope>();

  @override
  bool updateShouldNotify(_TRToggleGroupScope oldWidget) =>
      activeIndex != oldWidget.activeIndex ||
      disabled != oldWidget.disabled ||
      onFocusItem != oldWidget.onFocusItem ||
      onToggle != oldWidget.onToggle ||
      !setEquals(selected, oldWidget.selected);
}

/// Tells a grouped [TRToggle] which slot it occupies in its [TRToggleGroup].
class _TRToggleGroupItemScope extends InheritedWidget {
  const _TRToggleGroupItemScope({required this.index, required super.child});

  final int index;

  static _TRToggleGroupItemScope? maybeOf(BuildContext context) =>
      context.dependOnInheritedWidgetOfExactType<_TRToggleGroupItemScope>();

  @override
  bool updateShouldNotify(_TRToggleGroupItemScope oldWidget) =>
      index != oldWidget.index;
}
