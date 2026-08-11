import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../../ui_density.dart';
import '../../generated/tokens.g.dart';
import '../../internal/focus_source.dart';
import '../../internal/form_registry.dart';
import '../../theme.dart';
import '../../tokens.dart';
import '../../types.dart';

/// How a radio glyph aligns with its label.
enum TRRadioLabelAlignment { firstLine, center }

// @tinyrack-preview radio
/// A single option within a [TRRadioGroup].
class TRRadio extends StatefulWidget {
  const TRRadio({
    required this.value,
    this.label,
    this.disabled = false,
    this.readOnly = false,
    this.invalid = false,
    this.uiSize,
    this.labelAlignment = TRRadioLabelAlignment.firstLine,
    this.focusNode,
    this.autofocus = false,
    super.key,
  });

  final String value;

  /// Rendered beside the glyph as one semantic and one tappable unit. Style it
  /// with [TRText]; the radio does not impose a text style.
  final Widget? label;

  final bool disabled;
  final bool readOnly;
  final bool invalid;

  /// Overrides the size supplied by [TRUiDensityScope].
  final TRUiSize? uiSize;

  /// Aligns the glyph to a compound label's first body line by default.
  final TRRadioLabelAlignment labelAlignment;
  final FocusNode? focusNode;
  final bool autofocus;

  @override
  State<TRRadio> createState() => _TRRadioState();
}

class _TRRadioState extends State<TRRadio> with TRFocusSourceMixin {
  FocusNode? _internalFocusNode;
  bool _hovered = false;
  bool _focused = false;
  bool _spaceDown = false;

  /// An explicit [TRRadio.focusNode] always wins; a grouped radio otherwise
  /// borrows the node its [TRRadioGroup] manages for roving focus.
  FocusNode _resolveFocusNode(FocusNode? groupNode) =>
      widget.focusNode ?? groupNode ?? (_internalFocusNode ??= FocusNode());

  /// Native radios activate Space on key release, not key press.
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
    final uiSize = TRUiDensityScope.resolveSize(context, widget.uiSize);
    final colors = context.tinyrackTheme;
    final generated = Theme.of(context).brightness == Brightness.light
        ? TRGeneratedColors.light
        : TRGeneratedColors.dark;
    final scope = _TRRadioGroupScope.maybeOf(context);
    final itemScope = scope == null
        ? null
        : _TRRadioGroupItemScope.maybeOf(context);
    // Captured eagerly so the focus callback needs no null checks.
    final rovingScope = itemScope == null ? null : scope;
    final rovingIndex = itemScope?.index ?? -1;
    final focusNode = _resolveFocusNode(rovingScope?.focusNodeAt(rovingIndex));
    final checked = scope?.value == widget.value;
    final disabled = widget.disabled || (scope?.disabled ?? false);
    final readOnly = widget.readOnly || (scope?.readOnly ?? false);
    final interactive = !disabled && !readOnly;

    void select() {
      if (!interactive) return;
      scope?.onSelect(widget.value);
    }

    final showFocusRing = focusVisible(hasFocus: _focused);
    final borderColor = widget.invalid
        ? colors.dangerBorder
        : checked
        ? (_hovered && interactive ? generated.primaryHover : colors.primary)
        : generated.controlBorder;
    final background = checked || !interactive || !_hovered
        ? colors.surface
        : colors.surfaceHover;
    final size = switch (uiSize) {
      TRUiSize.sm => TRGeneratedSpacing.sm,
      TRUiSize.md => TRGeneratedSpacing.md,
      TRUiSize.lg => TRGeneratedSpacing.lg,
      TRUiSize.xl => TRGeneratedControlMetrics.xlIconSize,
    };
    final indicatorSize = switch (uiSize) {
      TRUiSize.sm => TRGeneratedSpacing.size3xs * 2,
      TRUiSize.md => TRGeneratedSpacing.xs,
      TRUiSize.lg => TRGeneratedSpacing.sm,
      TRUiSize.xl => TRGeneratedSpacing.md,
    };
    final motionDuration = MediaQuery.disableAnimationsOf(context)
        ? Duration.zero
        : TRMotion.fast;

    final glyph = CustomPaint(
      foregroundPainter: _TRRadioFocusRingPainter(
        color: colors.focus,
        visible: showFocusRing,
      ),
      child: AnimatedContainer(
        curve: TRMotion.standard,
        duration: motionDuration,
        height: size,
        width: size,
        decoration: BoxDecoration(
          shape: BoxShape.circle,
          border: Border.all(
            color: borderColor,
            width: TRGeneratedBorders.strongWidth,
          ),
          color: background,
        ),
        child: checked
            ? Center(
                child: Container(
                  height: indicatorSize,
                  width: indicatorSize,
                  decoration: BoxDecoration(
                    color: colors.primary,
                    shape: BoxShape.circle,
                  ),
                ),
              )
            : null,
      ),
    );
    final label = widget.label;
    final lineExtent =
        MediaQuery.textScalerOf(
          context,
        ).scale(TRGeneratedTextStyles.body.fontSize!) *
        TRGeneratedTextStyles.body.height!;
    final firstLine = widget.labelAlignment == TRRadioLabelAlignment.firstLine;
    final glyphInset = firstLine && lineExtent > size
        ? (lineExtent - size) / 2
        : 0.0;

    return MouseRegion(
      cursor: interactive ? SystemMouseCursors.click : MouseCursor.defer,
      onEnter: (_) => setState(() => _hovered = true),
      onExit: (_) => setState(() => _hovered = false),
      child: Focus(
        autofocus: widget.autofocus,
        focusNode: focusNode,
        // Grouped radios share one tab stop: Tab reaches the active item and
        // the arrow keys move between the rest.
        canRequestFocus: !(rovingScope != null && disabled),
        skipTraversal:
            rovingScope != null &&
            (disabled || rovingScope.activeIndex != rovingIndex),
        onFocusChange: (focused) {
          setState(() => _focused = focused);
          if (focused) rovingScope?.onFocusItem(rovingIndex);
        },
        onKeyEvent: interactive
            ? (node, event) => _handleSpace(event, select)
            : null,
        child: GestureDetector(
          behavior: HitTestBehavior.opaque,
          onTap: interactive ? select : null,
          child: MergeSemantics(
            child: Semantics(
              checked: checked,
              enabled: !disabled,
              inMutuallyExclusiveGroup: true,
              child: AnimatedOpacity(
                curve: TRMotion.standard,
                duration: motionDuration,
                opacity: disabled ? TRGeneratedOpacity.disabled : 1,
                child: label == null
                    ? glyph
                    : Row(
                        mainAxisSize: MainAxisSize.min,
                        crossAxisAlignment: firstLine
                            ? CrossAxisAlignment.start
                            : CrossAxisAlignment.center,
                        spacing: TRGeneratedSpacing.sm,
                        children: [
                          Padding(
                            padding: EdgeInsets.only(top: glyphInset),
                            child: glyph,
                          ),
                          label,
                        ],
                      ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class _TRRadioFocusRingPainter extends CustomPainter {
  const _TRRadioFocusRingPainter({required this.color, required this.visible});

  final Color color;
  final bool visible;

  @override
  void paint(Canvas canvas, Size size) {
    if (!visible) return;
    const width = TRGeneratedBorders.focusWidth;
    const offset = TRGeneratedBorders.focusOffset;
    final rect = (Offset.zero & size).inflate(offset + width / 2);
    canvas.drawOval(
      rect,
      Paint()
        ..color = color
        ..style = PaintingStyle.stroke
        ..strokeWidth = width,
    );
  }

  @override
  bool shouldRepaint(_TRRadioFocusRingPainter oldDelegate) =>
      color != oldDelegate.color || visible != oldDelegate.visible;
}

// @tinyrack-preview radio-group
/// Coordinates the mutually exclusive selection of [TRRadio] children.
class TRRadioGroup extends StatefulWidget {
  const TRRadioGroup({
    required this.children,
    this.value,
    this.defaultValue,
    this.onValueChange,
    this.disabled = false,
    this.name,
    this.readOnly = false,
    super.key,
  });

  final List<TRRadio> children;
  final String? value;
  final String? defaultValue;
  final ValueChanged<String>? onValueChange;
  final bool disabled;
  final String? name;
  final bool readOnly;

  @override
  State<TRRadioGroup> createState() => _TRRadioGroupState();
}

class _TRRadioGroupState extends State<TRRadioGroup> {
  late String? _uncontrolledValue = widget.defaultValue;
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

  /// Arrow keys move selection with focus, so a read-only radio or group is
  /// still reachable but keeps its value.
  bool _selectableAt(int index) =>
      _enabledAt(index) && !widget.readOnly && !widget.children[index].readOnly;

  /// Grows the node pool to cover the current children. Extra nodes from a
  /// shorter child list are kept until dispose so a node is never released
  /// while the [Focus] that still holds it unmounts.
  void _syncFocusNodes() {
    while (_focusNodes.length < widget.children.length) {
      _focusNodes.add(
        FocusNode(debugLabel: 'TRRadioGroup item ${_focusNodes.length}'),
      );
    }
  }

  /// The single item Tab reaches: the last focused item when it is still
  /// enabled, then the enabled selected item, then the first enabled one.
  int _resolveActiveIndex(String? selected) {
    final focused = _focusedIndex;
    if (focused != null && focused < widget.children.length) {
      if (_enabledAt(focused)) return focused;
    }
    for (var index = 0; index < widget.children.length; index++) {
      if (_enabledAt(index) && widget.children[index].value == selected) {
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
  /// [TRRadio.focusNode] when one was provided, and selects it the way a
  /// native radio group does.
  void _requestFocus(int index) {
    _focusItem(index);
    (widget.children[index].focusNode ?? _focusNodes[index]).requestFocus();
    if (_selectableAt(index)) _select(widget.children[index].value);
  }

  /// Steps by [delta] to the next enabled item, wrapping at either end.
  bool _moveFocus(int from, int delta) {
    final count = widget.children.length;
    var index = from;
    for (var step = 0; step < count; step++) {
      index += delta;
      if (index < 0 || index >= count) index = index < 0 ? count - 1 : 0;
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

  /// A vertical group still answers both axes, matching the web radio group.
  KeyEventResult _handleKey(KeyEvent event, int activeIndex) {
    if (event is! KeyDownEvent || widget.disabled) {
      return KeyEventResult.ignored;
    }
    final key = event.logicalKey;
    if (key == LogicalKeyboardKey.arrowUp ||
        key == LogicalKeyboardKey.arrowLeft) {
      _moveFocus(activeIndex, -1);
      return KeyEventResult.handled;
    }
    if (key == LogicalKeyboardKey.arrowDown ||
        key == LogicalKeyboardKey.arrowRight) {
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

  void _select(String value) {
    if (widget.value == null) setState(() => _uncontrolledValue = value);
    widget.onValueChange?.call(value);
  }

  @override
  Widget build(BuildContext context) {
    final selected = widget.value ?? _uncontrolledValue;
    _syncFocusNodes();
    final activeIndex = _resolveActiveIndex(selected);
    return TRFormRegistration(
      name: widget.name,
      value: () => selected,
      enabled: !widget.disabled,
      readOnly: widget.readOnly,
      child: Semantics(
        container: true,
        child: _TRRadioGroupScope(
          activeIndex: activeIndex,
          disabled: widget.disabled,
          focusNodes: _focusNodes,
          onFocusItem: _focusItem,
          onSelect: _select,
          readOnly: widget.readOnly,
          value: selected,
          child: Focus(
            canRequestFocus: false,
            skipTraversal: true,
            onKeyEvent: (node, event) => _handleKey(event, activeIndex),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              spacing: TRGeneratedSpacing.sm,
              children: [
                for (final (index, child) in widget.children.indexed)
                  _TRRadioGroupItemScope(index: index, child: child),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _TRRadioGroupScope extends InheritedWidget {
  const _TRRadioGroupScope({
    required this.activeIndex,
    required this.disabled,
    required this.focusNodes,
    required this.onFocusItem,
    required this.onSelect,
    required this.readOnly,
    required this.value,
    required super.child,
  });

  final int activeIndex;
  final bool disabled;
  final List<FocusNode> focusNodes;
  final ValueChanged<int> onFocusItem;
  final ValueChanged<String> onSelect;
  final bool readOnly;
  final String? value;

  FocusNode? focusNodeAt(int index) =>
      index >= 0 && index < focusNodes.length ? focusNodes[index] : null;

  static _TRRadioGroupScope? maybeOf(BuildContext context) =>
      context.dependOnInheritedWidgetOfExactType<_TRRadioGroupScope>();

  @override
  bool updateShouldNotify(_TRRadioGroupScope oldWidget) =>
      activeIndex != oldWidget.activeIndex ||
      disabled != oldWidget.disabled ||
      onFocusItem != oldWidget.onFocusItem ||
      onSelect != oldWidget.onSelect ||
      readOnly != oldWidget.readOnly ||
      value != oldWidget.value;
}

/// Tells a grouped [TRRadio] which slot it occupies in its [TRRadioGroup].
class _TRRadioGroupItemScope extends InheritedWidget {
  const _TRRadioGroupItemScope({required this.index, required super.child});

  final int index;

  static _TRRadioGroupItemScope? maybeOf(BuildContext context) =>
      context.dependOnInheritedWidgetOfExactType<_TRRadioGroupItemScope>();

  @override
  bool updateShouldNotify(_TRRadioGroupItemScope oldWidget) =>
      index != oldWidget.index;
}
