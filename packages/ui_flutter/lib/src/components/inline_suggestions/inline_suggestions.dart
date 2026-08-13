import 'dart:math' as math;

import 'package:material_ui/material_ui.dart';
import 'package:flutter/services.dart';

import '../../generated/tokens.g.dart';
import '../../internal/layer.dart';
import '../../theme.dart';
import '../../tokens.dart';
import '../../types.dart';
import '../scroll_area/scroll_area.dart';
import '../spinner/spinner.dart';

/// Whether a suggestion list is settled, still loading, or failed.
///
/// Emptiness is derived from a ready list with no items rather than being a
/// fourth case, so a caller cannot describe a state that contradicts itself.
enum TRInlineSuggestionsStatus { loading, ready, error }

/// One row offered by [TRInlineSuggestions].
@immutable
class TRInlineSuggestionItem<T extends Object> {
  const TRInlineSuggestionItem({
    required this.value,
    required this.label,
    this.description,
    this.hint,
    this.leading,
    this.tag,
    this.matchedIndices = const <int>[],
    this.enabled = true,
  });

  /// Payload handed back on selection.
  final T value;

  /// Primary row text; [matchedIndices] addresses this string.
  final String label;

  /// Muted second line.
  final String? description;

  /// Trailing affordance, such as the arguments a row expects.
  final String? hint;

  /// Leading adornment, such as an icon or avatar.
  final Widget? leading;

  /// Short category chip rendered after the label.
  final String? tag;

  /// Characters of [label] to emphasise.
  ///
  /// The caller owns the matcher; the design system owns the emphasis, so a
  /// consumer never has to name a color to highlight a match.
  final List<int> matchedIndices;

  /// A disabled row is skipped by keyboard navigation and cannot be committed.
  final bool enabled;
}

/// Owns the open state and highlight of a [TRInlineSuggestions] list.
class TRInlineSuggestionsController<T extends Object> extends ChangeNotifier {
  TRInlineSuggestionsController();

  List<TRInlineSuggestionItem<T>> _items = <TRInlineSuggestionItem<T>>[];
  bool _visible = false;
  bool _dismissed = false;
  bool _acceptOnEnter = true;
  bool _acceptOnTab = true;
  int _highlightIndex = -1;
  void Function(TRInlineSuggestionItem<T> item)? _onSelected;
  ValueChanged<int>? _onHighlightChange;
  VoidCallback? _onDismissed;

  /// Whether the list is currently on screen.
  bool get isOpen => _visible && !_dismissed;

  /// Index of the highlighted row, or -1 when nothing is armed.
  int get highlightIndex => isOpen ? _highlightIndex : -1;

  /// The highlighted row, or null when nothing is armed.
  TRInlineSuggestionItem<T>? get highlightedItem {
    final index = highlightIndex;
    if (index < 0 || index >= _items.length) return null;
    return _items[index];
  }

  /// Moves to the next selectable row, wrapping at the end.
  void highlightNext() => _step(1);

  /// Moves to the previous selectable row, wrapping at the start.
  void highlightPrevious() => _step(-1);

  /// Moves to the first selectable row.
  void highlightFirst() => _setHighlight(_firstEnabled(0, 1));

  /// Moves to the last selectable row.
  void highlightLast() => _setHighlight(_firstEnabled(_items.length - 1, -1));

  /// Commits the highlighted row, reporting whether anything was committed.
  bool commitHighlighted() {
    final item = highlightedItem;
    if (item == null || !item.enabled) return false;
    _onSelected?.call(item);
    return true;
  }

  /// Hides the list until a new session begins.
  void dismiss() {
    if (_dismissed) return;
    _dismissed = true;
    _onDismissed?.call();
    notifyListeners();
  }

  /// Handles one key on behalf of a host that owns the text field.
  ///
  /// A multiline editor consumes the arrow and enter keys itself, so a host
  /// calls this first inside its own handler and only falls through to its own
  /// behaviour, such as submitting, when the result is
  /// [KeyEventResult.ignored].
  KeyEventResult handleKeyEvent(KeyEvent event) {
    if (event is! KeyDownEvent || !isOpen) return KeyEventResult.ignored;
    // A held modifier makes the key a different command: Shift+Enter opens a
    // line and Control+Enter submits in the hosts this exists for, and neither
    // is the list's to take.
    if (_hasModifier) return KeyEventResult.ignored;
    switch (event.logicalKey) {
      case LogicalKeyboardKey.arrowDown:
        highlightNext();
        return KeyEventResult.handled;
      case LogicalKeyboardKey.arrowUp:
        highlightPrevious();
        return KeyEventResult.handled;
      case LogicalKeyboardKey.home:
        highlightFirst();
        return KeyEventResult.handled;
      case LogicalKeyboardKey.end:
        highlightLast();
        return KeyEventResult.handled;
      case LogicalKeyboardKey.escape:
        dismiss();
        return KeyEventResult.handled;
      case LogicalKeyboardKey.enter:
      case LogicalKeyboardKey.numpadEnter:
        if (!_acceptOnEnter) return KeyEventResult.ignored;
        // Nothing armed means the host still owns Enter, so an empty result
        // set never swallows a submission.
        return commitHighlighted()
            ? KeyEventResult.handled
            : KeyEventResult.ignored;
      case LogicalKeyboardKey.tab:
        if (!_acceptOnTab) return KeyEventResult.ignored;
        return commitHighlighted()
            ? KeyEventResult.handled
            : KeyEventResult.ignored;
      default:
        return KeyEventResult.ignored;
    }
  }

  static bool get _hasModifier {
    final pressed = HardwareKeyboard.instance.logicalKeysPressed;
    return pressed.contains(LogicalKeyboardKey.shiftLeft) ||
        pressed.contains(LogicalKeyboardKey.shiftRight) ||
        pressed.contains(LogicalKeyboardKey.controlLeft) ||
        pressed.contains(LogicalKeyboardKey.controlRight) ||
        pressed.contains(LogicalKeyboardKey.altLeft) ||
        pressed.contains(LogicalKeyboardKey.altRight) ||
        pressed.contains(LogicalKeyboardKey.metaLeft) ||
        pressed.contains(LogicalKeyboardKey.metaRight);
  }

  void _step(int direction) {
    if (_items.isEmpty) return;
    final start = _highlightIndex < 0
        ? (direction > 0 ? -1 : 0)
        : _highlightIndex;
    for (var offset = 1; offset <= _items.length; offset += 1) {
      final index =
          (start + direction * offset + _items.length * offset) % _items.length;
      if (_items[index].enabled) {
        _setHighlight(index);
        return;
      }
    }
  }

  int _firstEnabled(int from, int direction) {
    for (
      var index = from;
      index >= 0 && index < _items.length;
      index += direction
    ) {
      if (_items[index].enabled) return index;
    }
    return -1;
  }

  void _setHighlight(int index) {
    if (_highlightIndex == index) return;
    _highlightIndex = index;
    _onHighlightChange?.call(index);
    notifyListeners();
  }

  /// Reconciles controller state with the widget that owns it.
  void _sync({
    required List<TRInlineSuggestionItem<T>> items,
    required bool visible,
    required bool autoHighlight,
    required bool acceptOnEnter,
    required bool acceptOnTab,
    required bool newSession,
    required void Function(TRInlineSuggestionItem<T> item) onSelected,
    required ValueChanged<int>? onHighlightChange,
    required VoidCallback? onDismissed,
  }) {
    final previous = highlightedItem;
    _items = items;
    _visible = visible;
    _acceptOnEnter = acceptOnEnter;
    _acceptOnTab = acceptOnTab;
    _onSelected = onSelected;
    _onHighlightChange = onHighlightChange;
    _onDismissed = onDismissed;
    if (newSession) _dismissed = false;

    if (items.isEmpty) {
      _highlightIndex = -1;
      return;
    }
    if (newSession) {
      _highlightIndex = autoHighlight ? _firstEnabled(0, 1) : -1;
      return;
    }
    // Results that arrive late for the same token must not move the row the
    // user already chose, so the highlight follows the value, not the index.
    if (previous != null) {
      final moved = items.indexWhere((item) => item.value == previous.value);
      _highlightIndex = moved >= 0 ? moved : _firstEnabled(0, 1);
      return;
    }
    if (_highlightIndex < 0 && autoHighlight) {
      _highlightIndex = _firstEnabled(0, 1);
    } else if (_highlightIndex >= items.length) {
      _highlightIndex = _firstEnabled(items.length - 1, -1);
    }
  }
}

// @tinyrack-preview inline-suggestions
/// Suggestions anchored to a trigger token inside a caller-owned text field.
///
/// Unlike an autocomplete or combobox, this component never builds or reads the
/// field. The caller keeps its own controller, decides which token is being
/// completed, and splices the result; this widget owns only the surface, the
/// highlight, keyboard navigation, and the popup's accessibility contract.
class TRInlineSuggestions<T extends Object> extends StatefulWidget {
  const TRInlineSuggestions({
    required this.child,
    required this.items,
    required this.onSelected,
    required this.open,
    this.sessionKey,
    this.controller,
    this.status = TRInlineSuggestionsStatus.ready,
    this.emptyLabel = 'No matches',
    this.loadingLabel = 'Loading',
    this.errorLabel = 'Could not load suggestions',
    this.semanticLabel = 'Suggestions',
    this.placement = TRLayerPlacement.topStart,
    this.matchAnchorWidth = true,
    this.width,
    this.maxVisibleItems = 8,
    this.autoHighlight = true,
    this.acceptOnEnter = true,
    this.acceptOnTab = true,
    this.onHighlightChange,
    this.onDismissed,
    this.useRootOverlay = true,
    super.key,
  }) : assert(maxVisibleItems > 0, 'Show at least one row.');

  /// The caller's field, used verbatim as the trigger and position anchor.
  final Widget child;

  /// Rows to offer, already filtered and ordered by the caller.
  final List<TRInlineSuggestionItem<T>> items;

  /// Called with the committed row; the caller performs any text edit.
  final ValueChanged<TRInlineSuggestionItem<T>> onSelected;

  /// Whether a token is currently being completed.
  ///
  /// There is no uncontrolled variant because the condition depends on caret
  /// state this widget cannot observe.
  final bool open;

  /// Identity of the token being completed.
  ///
  /// Changing it resets the highlight and clears an earlier dismissal, so
  /// Escape hides the current token's list while a freshly typed one reopens.
  final Object? sessionKey;

  /// Optional external controller; one is created when omitted.
  final TRInlineSuggestionsController<T>? controller;

  /// Whether the list is settled, still loading, or failed.
  final TRInlineSuggestionsStatus status;

  /// Shown when a settled list has no rows.
  final String emptyLabel;

  /// Shown while a list is still loading.
  final String loadingLabel;

  /// Shown when a list could not be produced.
  final String errorLabel;

  /// Accessible name of the popup.
  final String semanticLabel;

  /// Where the list sits relative to the field; it flips when space runs out.
  final TRLayerPlacement placement;

  /// Whether the list spans the field's width instead of its own.
  final bool matchAnchorWidth;

  /// Explicit width; overrides [matchAnchorWidth] when set.
  final double? width;

  /// Rows shown before the list scrolls, counted rather than measured so the
  /// height follows the reader's text size.
  final int maxVisibleItems;

  /// Whether the first row is armed so Enter commits without arrowing.
  final bool autoHighlight;

  /// Whether Enter commits the highlighted row.
  final bool acceptOnEnter;

  /// Whether Tab commits the highlighted row.
  final bool acceptOnTab;

  /// Reports highlight movement so a caller can mirror it elsewhere.
  final ValueChanged<int>? onHighlightChange;

  /// Reports a dismissal so a caller can drop its own token state.
  final VoidCallback? onDismissed;

  /// Whether the surface mounts in the root overlay.
  final bool useRootOverlay;

  @override
  State<TRInlineSuggestions<T>> createState() => _TRInlineSuggestionsState<T>();
}

class _TRInlineSuggestionsState<T extends Object>
    extends State<TRInlineSuggestions<T>> {
  TRInlineSuggestionsController<T>? _internalController;
  final ScrollController _scrollController = ScrollController();
  List<GlobalKey> _rowKeys = const <GlobalKey>[];
  Object? _session;
  bool _sessionSeen = false;
  Object? _lastScrollSession;
  bool? _lastScrollOpen;
  int? _lastScrollIndex;

  TRInlineSuggestionsController<T> get _controller =>
      widget.controller ??
      (_internalController ??= TRInlineSuggestionsController<T>());

  @override
  void dispose() {
    _internalController?.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  void _sync() {
    final newSession = !_sessionSeen || _session != widget.sessionKey;
    _session = widget.sessionKey;
    _sessionSeen = true;
    _controller._sync(
      items: widget.items,
      visible: widget.open,
      autoHighlight: widget.autoHighlight,
      acceptOnEnter: widget.acceptOnEnter,
      acceptOnTab: widget.acceptOnTab,
      newSession: newSession,
      onSelected: widget.onSelected,
      onHighlightChange: widget.onHighlightChange,
      onDismissed: widget.onDismissed,
    );
    if (_rowKeys.length != widget.items.length) {
      _rowKeys = List<GlobalKey>.generate(
        widget.items.length,
        (index) => GlobalKey(debugLabel: 'tr-inline-suggestion-$index'),
      );
    }
  }

  void _scrollToHighlight() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (!mounted) return;
      final index = _controller.highlightIndex;
      if (index < 0 || index >= _rowKeys.length) return;
      final target = _rowKeys[index].currentContext;
      if (target != null) Scrollable.ensureVisible(target, alignment: 0.5);
    });
  }

  void _scrollToHighlightIfNeeded() {
    final open = _controller.isOpen;
    final index = _controller.highlightIndex;
    if (_lastScrollSession == _session &&
        _lastScrollOpen == open &&
        _lastScrollIndex == index) {
      return;
    }
    _lastScrollSession = _session;
    _lastScrollOpen = open;
    _lastScrollIndex = index;
    if (index >= 0) _scrollToHighlight();
  }

  @override
  Widget build(BuildContext context) {
    _sync();
    return ListenableBuilder(
      listenable: _controller,
      builder: (context, _) {
        _sync();
        _scrollToHighlightIfNeeded();
        return TRAnchoredLayer(
          open: _controller.isOpen,
          onOpenChange: (open) {
            if (!open) _controller.dismiss();
          },
          placement: widget.placement,
          useRootOverlay: widget.useRootOverlay,
          matchAnchorWidth: widget.width == null && widget.matchAnchorWidth,
          // Focus must stay in the caller's field; the caller forwards keys.
          requestFocus: false,
          triggerBuilder: (context, open, openLayer, closeLayer, toggleLayer) =>
              widget.child,
          layerBuilder: (context) => _surface(context),
        );
      },
    );
  }

  Widget _surface(BuildContext context) {
    final width = widget.width;
    final surface = TRLayerSurface(
      kind: TRLayerBoundaryKind.inlineSuggestions,
      // Left at the shared defaults when no width is named, so the anchor
      // constraint decides and the surface still has bounds without one.
      minWidth: width ?? TRGeneratedMeasurements.measureMd,
      maxWidth:
          width ??
          TRGeneratedMeasurements.overlayWidthSm + TRGeneratedSpacing.size2xl,
      child: ExcludeFocus(child: _rows(context)),
    );
    return Semantics(
      container: true,
      explicitChildNodes: true,
      label: widget.semanticLabel,
      child: surface,
    );
  }

  Widget _rows(BuildContext context) {
    final rowSize = TRLayerStyles.rowSizeOf(context);
    final rowExtent = TRControlMetrics.heightOf(rowSize);
    final maxHeight =
        MediaQuery.textScalerOf(context).scale(rowExtent) *
        widget.maxVisibleItems;

    final loading = widget.status == TRInlineSuggestionsStatus.loading;
    return ConstrainedBox(
      constraints: BoxConstraints(maxHeight: maxHeight),
      child: TRScrollArea(
        verticalController: _scrollController,
        // A menu item shrink-wraps its label whatever the surface does, so the
        // row is handed the width the surface actually resolved to.
        child: LayoutBuilder(
          builder: (context, constraints) => _list(
            context,
            loading: loading,
            contentWidth: math.max(
              0,
              constraints.maxWidth -
                  TRControlMetrics.inlinePaddingOf(rowSize) * 2,
            ),
          ),
        ),
      ),
    );
  }

  Widget _list(
    BuildContext context, {
    required bool loading,
    required double contentWidth,
  }) {
    final children = <Widget>[
      for (var index = 0; index < widget.items.length; index += 1)
        _TRInlineSuggestionRow<T>(
          key: _rowKeys[index],
          item: widget.items[index],
          highlighted: index == _controller.highlightIndex,
          onPressed: widget.items[index].enabled
              ? () => widget.onSelected(widget.items[index])
              : null,
          index: index,
          contentWidth: contentWidth,
        ),
      // A spinner below stale rows keeps the previous answer readable instead
      // of blanking the list on every keystroke.
      if (loading)
        _TRInlineSuggestionsNotice(label: widget.loadingLabel, spinner: true),
      if (!loading && widget.items.isEmpty)
        _TRInlineSuggestionsNotice(
          label: widget.status == TRInlineSuggestionsStatus.error
              ? widget.errorLabel
              : widget.emptyLabel,
          danger: widget.status == TRInlineSuggestionsStatus.error,
        ),
    ];

    return Column(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: children,
    );
  }
}

class _TRInlineSuggestionRow<T extends Object> extends StatelessWidget {
  const _TRInlineSuggestionRow({
    required this.item,
    required this.highlighted,
    required this.onPressed,
    required this.index,
    required this.contentWidth,
    super.key,
  });

  final TRInlineSuggestionItem<T> item;
  final bool highlighted;
  final VoidCallback? onPressed;
  final int index;
  final double contentWidth;

  @override
  Widget build(BuildContext context) {
    final colors = context.tinyrackTheme;
    final enabled = item.enabled;
    final rowSize = TRLayerStyles.rowSizeOf(context);
    final rowHeight = TRControlMetrics.heightOf(rowSize);
    final label = Text.rich(
      _highlightedLabel(context, enabled: enabled),
      maxLines: 1,
      overflow: TextOverflow.ellipsis,
    );

    return Semantics(
      selected: highlighted,
      enabled: enabled,
      button: true,
      child: TRLayerPartBoundary(
        name: 'option$index',
        child: MenuItemButton(
          onPressed: onPressed,
          requestFocusOnHover: false,
          leadingIcon: item.leading,
          style: TRLayerStyles.option(context, highlighted: highlighted)
              .copyWith(
                minimumSize: WidgetStatePropertyAll(Size(0, rowHeight)),
                maximumSize: const WidgetStatePropertyAll(Size.infinite),
                padding: WidgetStatePropertyAll(
                  EdgeInsets.symmetric(
                    horizontal: TRControlMetrics.inlinePaddingOf(rowSize),
                    vertical: item.description == null
                        ? 0
                        : TRControlMetrics.gapOf(rowSize),
                  ),
                ),
              ),
          child: SizedBox(
            width: contentWidth,
            child: Row(
              children: [
                Expanded(
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Flexible(child: label),
                          if (item.tag != null) ...[
                            const SizedBox(width: TRGeneratedSpacing.xs),
                            _TRInlineSuggestionTag(label: item.tag!),
                          ],
                        ],
                      ),
                      if (item.description != null &&
                          item.description!.isNotEmpty)
                        Text(
                          item.description!,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: TRGeneratedTextStyles.caption.copyWith(
                            color: colors.textMuted,
                            fontFamilyFallback:
                                TRGeneratedFontFamilies.fallback,
                          ),
                        ),
                    ],
                  ),
                ),
                if (item.hint != null) ...[
                  const SizedBox(width: TRGeneratedSpacing.sm),
                  Text(
                    item.hint!,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: TRGeneratedTextStyles.caption.copyWith(
                      color: colors.textPlaceholder,
                      fontFamilyFallback: TRGeneratedFontFamilies.fallback,
                    ),
                  ),
                ],
              ],
            ),
          ),
        ),
      ),
    );
  }

  /// Emphasises the matched characters with weight rather than color, so the
  /// cue survives every theme and contrast setting.
  TextSpan _highlightedLabel(BuildContext context, {required bool enabled}) {
    final colors = context.tinyrackTheme;
    final base = TRGeneratedTextStyles.bodySm.copyWith(
      color: enabled ? colors.text : colors.textMuted,
      fontFamilyFallback: TRGeneratedFontFamilies.fallback,
    );
    final matched = <int>{
      for (final index in item.matchedIndices)
        if (index >= 0 && index < item.label.length) index,
    };
    if (matched.isEmpty) {
      return TextSpan(text: item.label, style: base);
    }

    final emphasis = base.copyWith(fontWeight: TRGeneratedFontWeights.medium);
    final spans = <TextSpan>[];
    final buffer = StringBuffer();
    var run = matched.contains(0);
    for (var index = 0; index < item.label.length; index += 1) {
      final isMatch = matched.contains(index);
      if (isMatch != run) {
        spans.add(
          TextSpan(text: buffer.toString(), style: run ? emphasis : base),
        );
        buffer.clear();
        run = isMatch;
      }
      buffer.write(item.label[index]);
    }
    spans.add(TextSpan(text: buffer.toString(), style: run ? emphasis : base));
    return TextSpan(children: spans);
  }
}

class _TRInlineSuggestionTag extends StatelessWidget {
  const _TRInlineSuggestionTag({required this.label});

  final String label;

  @override
  Widget build(BuildContext context) {
    final colors = context.tinyrackTheme;
    return Container(
      padding: const EdgeInsets.symmetric(
        horizontal: TRGeneratedSpacing.xs,
        vertical: TRGeneratedSpacing.size3xs,
      ),
      decoration: BoxDecoration(
        color: colors.surfaceMuted,
        borderRadius: BorderRadius.circular(TRGeneratedRadii.xs),
      ),
      child: Text(
        label,
        maxLines: 1,
        overflow: TextOverflow.ellipsis,
        style: TRGeneratedTextStyles.caption.copyWith(
          color: colors.textMuted,
          fontFamilyFallback: TRGeneratedFontFamilies.fallback,
        ),
      ),
    );
  }
}

/// A non-interactive row that keeps the surface from collapsing.
class _TRInlineSuggestionsNotice extends StatelessWidget {
  const _TRInlineSuggestionsNotice({
    required this.label,
    this.danger = false,
    this.spinner = false,
  });

  final String label;
  final bool danger;
  final bool spinner;

  @override
  Widget build(BuildContext context) {
    final colors = context.tinyrackTheme;
    return Padding(
      padding: const EdgeInsets.symmetric(
        horizontal: TRGeneratedControlMetrics.mdPaddingInline,
        vertical: TRGeneratedSpacing.xs,
      ),
      child: Row(
        children: [
          if (spinner) ...[
            const TRSpinner(),
            const SizedBox(width: TRGeneratedSpacing.xs),
          ],
          Flexible(
            child: Text(
              label,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: TRGeneratedTextStyles.caption.copyWith(
                color: danger ? colors.danger : colors.textMuted,
                fontFamilyFallback: TRGeneratedFontFamilies.fallback,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
