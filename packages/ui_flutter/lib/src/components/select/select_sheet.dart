part of 'select_widget.dart';

/// What a [_TRSelectSheet] pops when the user commits a row.
///
/// A bare `T?` cannot say the difference between choosing an option whose
/// value is null and dismissing the sheet without choosing anything, and both
/// are ordinary outcomes for a select.
class _TRSelectChoice<T> {
  const _TRSelectChoice(this.value);

  final T? value;
}

/// The sheet surface of a [TRSelect].
///
/// It owns its own query because it lives in its own route: the select that
/// opened it is no longer an ancestor of these rows.
class _TRSelectSheet<T> extends StatefulWidget {
  const _TRSelectSheet({
    required this.items,
    required this.selectedValue,
    required this.searchable,
    required this.initialQuery,
    required this.deferInitialFilter,
    required this.matches,
    required this.noResultsText,
    required this.searchPlaceholder,
    required this.uiSize,
    required this.maxExtent,
    required this.snapPoints,
    required this.showDragHandle,
    this.label,
  });

  final List<TRSelectItem<T>> items;
  final T? selectedValue;
  final bool searchable;
  final String initialQuery;
  final bool deferInitialFilter;
  final bool Function(TRSelectItem<T> item, String query) matches;
  final String noResultsText;
  final String searchPlaceholder;
  final TRUiSize uiSize;
  final double maxExtent;
  final List<double> snapPoints;
  final bool showDragHandle;
  final String? label;

  @override
  State<_TRSelectSheet<T>> createState() => _TRSelectSheetState<T>();
}

class _TRSelectSheetState<T> extends State<_TRSelectSheet<T>> {
  late final ScrollController _optionsScrollController = ScrollController();
  late final List<FocusNode> _itemFocusNodes = List<FocusNode>.generate(
    widget.items.length,
    (_) => FocusNode(),
  );
  late final FocusNode _searchFocusNode = FocusNode(
    onKeyEvent: _handleSearchKey,
  );
  final FocusNode _panelFocusNode = FocusNode(
    debugLabel: 'TRSelect sheet panel',
  );
  late final TextEditingController _searchController = TextEditingController(
    text: widget.initialQuery,
  );
  late String _query = widget.initialQuery;
  late bool _deferInitialFilter = widget.deferInitialFilter;

  @override
  void initState() {
    super.initState();
    if (!widget.searchable) {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        if (!mounted) return;
        final visible = _visible;
        final selected = visible.items.indexWhere(
          (item) => item.enabled && item.value == widget.selectedValue,
        );
        if (selected >= 0) {
          final index = selected;
          _requestSelectOptionFocus(visible.focusNodes[index]);
        } else {
          _panelFocusNode.requestFocus();
        }
      });
    }
  }

  @override
  void dispose() {
    _optionsScrollController.dispose();
    for (final focusNode in _itemFocusNodes) {
      focusNode.dispose();
    }
    _searchFocusNode.dispose();
    _panelFocusNode.dispose();
    _searchController.dispose();
    super.dispose();
  }

  ({List<TRSelectItem<T>> items, List<FocusNode> focusNodes}) get _visible {
    final items = <TRSelectItem<T>>[];
    final focusNodes = <FocusNode>[];
    for (var index = 0; index < widget.items.length; index += 1) {
      final item = widget.items[index];
      if (!_deferInitialFilter &&
          _query.isNotEmpty &&
          !widget.matches(item, _query)) {
        continue;
      }
      items.add(item);
      focusNodes.add(_itemFocusNodes[index]);
    }
    return (items: items, focusNodes: focusNodes);
  }

  @override
  Widget build(BuildContext context) {
    final label = widget.label;
    final visible = _visible;
    return TRDrawer(
      title: label == null ? null : Text(label),
      dragBehavior: TRDrawerDragBehavior.handleOnly,
      scrollContent: false,
      maxExtent: widget.maxExtent,
      snapPoints: widget.snapPoints.isEmpty ? null : widget.snapPoints,
      showDragHandle: widget.showDragHandle,
      content: _TRSelectFrozenSize(
        freezeWidth: false,
        onSizeFrozen: _deferInitialFilter
            ? () {
                if (mounted) setState(() => _deferInitialFilter = false);
              }
            : null,
        child: Focus(
          focusNode: _panelFocusNode,
          onKeyEvent: (_, event) => _handleOptionKey(event),
          child: _TRSelectPanel<T>(
            items: visible.items,
            selectedValue: widget.selectedValue,
            interactive: true,
            searchable: widget.searchable,
            searchController: _searchController,
            searchFocusNode: _searchFocusNode,
            searchAutofocus: true,
            onQueryChanged: (query) => setState(() => _query = query),
            onSubmitted: (_) => _commitSoleMatch(),
            searchPlaceholder: widget.searchPlaceholder,
            noResultsText: widget.noResultsText,
            onSelected: _commit,
            uiSize: widget.uiSize,
            scrollController: _optionsScrollController,
            fullWidthSeparator: true,
            gap: TRGeneratedSpacing.sm,
            searchPadding: const EdgeInsets.only(bottom: TRGeneratedSpacing.xs),
            minimumRowHeight: TRControlMetrics.heightOf(TRUiSize.xl),
            focusNodes: visible.focusNodes,
            onRowKeyEvent: _handleOptionKey,
          ),
        ),
      ),
    );
  }

  KeyEventResult _handleSearchKey(FocusNode node, KeyEvent event) {
    if (event is! KeyDownEvent) return KeyEventResult.ignored;
    if (event.logicalKey == LogicalKeyboardKey.escape) {
      unawaited(Navigator.of(context).maybePop());
      return KeyEventResult.handled;
    }
    if (event.logicalKey != LogicalKeyboardKey.arrowDown) {
      return KeyEventResult.ignored;
    }
    final visible = _visible;
    final index = visible.items.indexWhere((item) => item.enabled);
    if (index < 0) return KeyEventResult.handled;
    _requestSelectOptionFocus(visible.focusNodes[index]);
    return KeyEventResult.handled;
  }

  KeyEventResult _handleOptionKey(KeyEvent event) {
    if (event is! KeyDownEvent) return KeyEventResult.ignored;
    final key = event.logicalKey;
    if (key == LogicalKeyboardKey.escape) {
      unawaited(Navigator.of(context).maybePop());
      return KeyEventResult.handled;
    }
    if (key != LogicalKeyboardKey.arrowDown &&
        key != LogicalKeyboardKey.arrowUp) {
      return KeyEventResult.ignored;
    }
    final visible = _visible;
    final current = visible.focusNodes.indexWhere((node) => node.hasFocus);
    final step = key == LogicalKeyboardKey.arrowDown ? 1 : -1;
    var index = current < 0
        ? (step > 0 ? 0 : visible.items.length - 1)
        : current + step;
    while (index >= 0 && index < visible.items.length) {
      if (visible.items[index].enabled) {
        _requestSelectOptionFocus(visible.focusNodes[index]);
        return KeyEventResult.handled;
      }
      index += step;
    }
    if (step < 0 && widget.searchable) _searchFocusNode.requestFocus();
    return KeyEventResult.handled;
  }

  void _commit(T? value) =>
      Navigator.of(context).pop(_TRSelectChoice<T>(value));

  void _commitSoleMatch() {
    final visible = _visible.items;
    if (visible.length != 1) return;
    final item = visible.single;
    if (!item.enabled) return;
    _commit(item.value);
  }
}
