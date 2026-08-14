part of 'select_widget.dart';

/// Search and options content shared by both Select presentations.
class _TRSelectPanel<T> extends StatelessWidget {
  const _TRSelectPanel({
    required this.items,
    required this.selectedValue,
    required this.interactive,
    required this.searchable,
    required this.searchController,
    required this.onQueryChanged,
    required this.onSubmitted,
    required this.searchPlaceholder,
    required this.noResultsText,
    required this.onSelected,
    required this.uiSize,
    required this.scrollController,
    this.searchFocusNode,
    this.searchAutofocus = false,
    this.fullWidthSeparator = false,
    this.gap = 0,
    this.optionsPadding = EdgeInsets.zero,
    this.searchPadding = const EdgeInsets.all(TRGeneratedSpacing.sm),
    this.minimumRowHeight,
    this.focusNodes,
    this.onRowKeyEvent,
  });

  final List<TRSelectItem<T>> items;
  final T? selectedValue;
  final bool interactive;
  final bool searchable;
  final TextEditingController searchController;
  final FocusNode? searchFocusNode;
  final bool searchAutofocus;
  final ValueChanged<String> onQueryChanged;
  final ValueChanged<String> onSubmitted;
  final String searchPlaceholder;
  final String noResultsText;
  final ValueChanged<T?> onSelected;
  final TRUiSize uiSize;
  final ScrollController scrollController;
  final bool fullWidthSeparator;
  final double gap;
  final EdgeInsetsGeometry optionsPadding;
  final EdgeInsetsGeometry searchPadding;
  final double? minimumRowHeight;
  final List<FocusNode>? focusNodes;
  final KeyEventResult Function(KeyEvent event)? onRowKeyEvent;

  @override
  Widget build(BuildContext context) {
    Widget options = SingleChildScrollView(
      controller: scrollController,
      primary: false,
      padding: optionsPadding,
      child: _TRSelectOptions<T>(
        items: items,
        selectedValue: selectedValue,
        interactive: interactive,
        noResultsText: noResultsText,
        onSelected: onSelected,
        uiSize: uiSize,
        minimumRowHeight: minimumRowHeight,
        focusNodes: focusNodes,
        onRowKeyEvent: onRowKeyEvent,
      ),
    );
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      mainAxisSize: MainAxisSize.min,
      children: [
        if (searchable)
          _TRSelectInputScrollBlocker(
            child: Padding(
              padding: searchPadding,
              child: TRTextField(
                autofocus: searchAutofocus,
                controller: searchController,
                focusNode: searchFocusNode,
                onChanged: onQueryChanged,
                onSubmitted: onSubmitted,
                placeholder: searchPlaceholder,
                uiSize: uiSize,
              ),
            ),
          ),
        if (searchable && gap > 0) SizedBox(height: gap),
        if (searchable)
          fullWidthSeparator
              ? SizedBox(
                  height: TRGeneratedBorders.defaultWidth,
                  child: OverflowBox(
                    minWidth: MediaQuery.sizeOf(context).width,
                    maxWidth: MediaQuery.sizeOf(context).width,
                    minHeight: TRGeneratedBorders.defaultWidth,
                    maxHeight: TRGeneratedBorders.defaultWidth,
                    child: const TRSeparator(variant: TRSeparatorVariant.muted),
                  ),
                )
              : const TRSeparator(variant: TRSeparatorVariant.muted),
        if (searchable && gap > 0) SizedBox(height: gap),
        Flexible(fit: FlexFit.loose, child: options),
      ],
    );
  }
}

/// Wins pointer scrolling and vertical drags above an input without acting.
class _TRSelectInputScrollBlocker extends StatelessWidget {
  const _TRSelectInputScrollBlocker({required this.child});

  final Widget child;

  @override
  Widget build(BuildContext context) => Listener(
    onPointerSignal: (event) {
      if (event is PointerScrollEvent) {
        GestureBinding.instance.pointerSignalResolver.register(event, (_) {});
      }
    },
    child: GestureDetector(
      behavior: HitTestBehavior.opaque,
      onVerticalDragStart: (_) {},
      onVerticalDragUpdate: (_) {},
      onVerticalDragEnd: (_) {},
      child: child,
    ),
  );
}

/// Captures the panel's first laid-out size and retains it for this open.
class _TRSelectFrozenSize extends StatefulWidget {
  const _TRSelectFrozenSize({
    required this.child,
    this.freezeWidth = true,
    this.onSizeFrozen,
    super.key,
  });

  final Widget child;
  final bool freezeWidth;
  final VoidCallback? onSizeFrozen;

  @override
  State<_TRSelectFrozenSize> createState() => _TRSelectFrozenSizeState();
}

class _TRSelectFrozenSizeState extends State<_TRSelectFrozenSize> {
  final GlobalKey _measureKey = GlobalKey();
  Size? _size;
  bool _measurementScheduled = false;

  @override
  Widget build(BuildContext context) {
    if (_size == null && !_measurementScheduled) {
      _measurementScheduled = true;
      WidgetsBinding.instance.addPostFrameCallback((_) {
        _measurementScheduled = false;
        if (!mounted || _size != null) return;
        final renderObject = _measureKey.currentContext?.findRenderObject();
        if (renderObject is! RenderBox || !renderObject.hasSize) return;
        setState(() => _size = renderObject.size);
        widget.onSizeFrozen?.call();
      });
    }
    return SizedBox(
      width: widget.freezeWidth ? _size?.width : null,
      height: _size?.height,
      child: KeyedSubtree(key: _measureKey, child: widget.child),
    );
  }
}
