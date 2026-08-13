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
      scrollContent: false,
      content: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        mainAxisSize: MainAxisSize.min,
        spacing: TRGeneratedSpacing.sm,
        children: [
          if (widget.searchable)
            Padding(
              padding: const EdgeInsets.only(bottom: TRGeneratedSpacing.xs),
              child: TRTextField(
                autofocus: true,
                controller: _searchController,
                onChanged: (query) => setState(() => _query = query),
                onSubmitted: (_) => _commitSoleMatch(),
                placeholder: widget.searchPlaceholder,
                uiSize: widget.uiSize,
              ),
            ),
          if (widget.searchable)
            SizedBox(
              height: TRGeneratedBorders.defaultWidth,
              child: OverflowBox(
                minWidth: MediaQuery.sizeOf(context).width,
                maxWidth: MediaQuery.sizeOf(context).width,
                minHeight: TRGeneratedBorders.defaultWidth,
                maxHeight: TRGeneratedBorders.defaultWidth,
                child: const TRSeparator(variant: TRSeparatorVariant.muted),
              ),
            ),
          Flexible(
            fit: FlexFit.loose,
            child: SingleChildScrollView(
              child: _TRSelectOptions<T>(
                items: _visibleItems,
                selectedValue: widget.selectedValue,
                interactive: true,
                noResultsText: widget.noResultsText,
                onSelected: _commit,
                uiSize: widget.uiSize,
              ),
            ),
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
