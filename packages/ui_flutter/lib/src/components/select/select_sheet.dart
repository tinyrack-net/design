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
    required this.matches,
    required this.noResultsText,
    required this.searchPlaceholder,
    required this.uiSize,
    this.label,
  });

  final List<TRSelectItem<T>> items;
  final T? selectedValue;
  final bool searchable;
  final String initialQuery;
  final bool Function(TRSelectItem<T> item, String query) matches;
  final String noResultsText;
  final String searchPlaceholder;
  final TRUiSize uiSize;
  final String? label;

  @override
  State<_TRSelectSheet<T>> createState() => _TRSelectSheetState<T>();
}

class _TRSelectSheetState<T> extends State<_TRSelectSheet<T>> {
  late final TextEditingController _searchController = TextEditingController(
    text: widget.initialQuery,
  );
  late String _query = widget.initialQuery;

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  List<TRSelectItem<T>> get _visibleItems => widget.items
      .where((item) => _query.isEmpty || widget.matches(item, _query))
      .toList(growable: false);

  @override
  Widget build(BuildContext context) {
    final label = widget.label;
    return TRDrawer(
      title: label == null ? null : Text(label),
      // The sheet is a list, so it opens tall enough to show one without
      // covering the page entirely, and drags to full height from there.
      snapPoints: const <double>[0.8, 1],
      content: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        mainAxisSize: MainAxisSize.min,
        spacing: TRGeneratedSpacing.sm,
        children: [
          if (widget.searchable)
            TRTextField(
              autofocus: true,
              controller: _searchController,
              onChanged: (query) => setState(() => _query = query),
              onSubmitted: (_) => _commitSoleMatch(),
              placeholder: widget.searchPlaceholder,
              uiSize: widget.uiSize,
            ),
          _TRSelectOptions<T>(
            items: _visibleItems,
            selectedValue: widget.selectedValue,
            interactive: true,
            highlightSelected: true,
            noResultsText: widget.noResultsText,
            onSelected: _commit,
          ),
        ],
      ),
    );
  }

  void _commit(T? value) =>
      Navigator.of(context).pop(_TRSelectChoice<T>(value));

  void _commitSoleMatch() {
    final visible = _visibleItems;
    if (visible.length != 1) return;
    final item = visible.single;
    if (!item.enabled) return;
    _commit(item.value);
  }
}
