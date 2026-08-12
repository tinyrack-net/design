part of 'select_widget.dart';

/// The option rows a [TRSelect] renders, shared by both of its surfaces.
///
/// The dropdown and the sheet differ in how they are presented, not in what a
/// row is, so the check indicator, densities, part-boundary names, and
/// disabled handling are defined once here rather than twice.
class _TRSelectOptions<T> extends StatelessWidget {
  const _TRSelectOptions({
    required this.items,
    required this.selectedValue,
    required this.interactive,
    required this.noResultsText,
    required this.onSelected,
    this.focusNodes,
    this.onRowKeyEvent,
  });

  /// Rows to render, already filtered by the enclosing select.
  final List<TRSelectItem<T>> items;
  final T? selectedValue;
  final bool interactive;

  final String noResultsText;
  final ValueChanged<T?> onSelected;

  /// One node per entry in [items], or null when the surface does not move
  /// focus between rows itself.
  final List<FocusNode>? focusNodes;
  final KeyEventResult Function(KeyEvent event)? onRowKeyEvent;

  @override
  Widget build(BuildContext context) {
    final colors = context.tinyrackTheme;
    if (items.isEmpty) {
      return Padding(
        padding: const EdgeInsets.symmetric(
          horizontal: TRGeneratedSpacing.sm,
          vertical: TRGeneratedSpacing.xs,
        ),
        child: Text(
          noResultsText,
          style: TextStyle(
            color: colors.textMuted,
            fontFamily: TRGeneratedFontFamilies.body,
            fontFamilyFallback: TRGeneratedFontFamilies.fallback,
            fontSize: TRGeneratedTypographySizes.xs,
            height: TRGeneratedTypographyLineHeights.md,
          ),
        ),
      );
    }
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      mainAxisSize: MainAxisSize.min,
      spacing: TRGeneratedSpacing.xs,
      children: [
        for (var index = 0; index < items.length; index += 1)
          _row(context, index),
      ],
    );
  }

  Widget _row(BuildContext context, int index) {
    final item = items[index];
    final button = MenuItemButton(
      key: item.key,
      // Only the dropdown lives inside a menu. The sheet closes itself with the
      // value it popped, so asking a menu to close would be a no-op at best.
      closeOnActivate: focusNodes != null,
      focusNode: focusNodes?[index],
      leadingIcon: item.leading,
      onPressed: interactive && item.enabled
          ? () => onSelected(item.value)
          : null,
      style: _style(
        context,
        selected: item.value == selectedValue,
        described: item.description != null,
      ),
      trailingIcon: item.trailing == null
          ? null
          : TRLayerPartBoundary(
              name: 'item${index}Indicator',
              child: item.trailing!,
            ),
      child: item.description == null
          ? TRLayerPartBoundary(
              name: 'item${index}Label',
              child: Text(item.label),
            )
          : ConstrainedBox(
              constraints: const BoxConstraints(
                maxWidth: TRGeneratedMeasurements.measureLg,
              ),
              child: TRLayerPartBoundary(
                name: 'item${index}Label',
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text(item.label, overflow: TextOverflow.ellipsis),
                    const SizedBox(height: TRGeneratedSpacing.xs),
                    Text(
                      item.description!,
                      overflow: TextOverflow.ellipsis,
                      style: TextStyle(
                        color: context.tinyrackTheme.textMuted,
                        fontFamily: TRGeneratedFontFamilies.body,
                        fontFamilyFallback: TRGeneratedFontFamilies.fallback,
                        fontSize: TRGeneratedTypographySizes.xs,
                        height: TRGeneratedTypographyLineHeights.md,
                      ),
                    ),
                  ],
                ),
              ),
            ),
    );
    final onRowKeyEvent = this.onRowKeyEvent;
    if (onRowKeyEvent == null) return button;
    return Focus(onKeyEvent: (_, event) => onRowKeyEvent(event), child: button);
  }

  ButtonStyle _style(
    BuildContext context, {
    required bool selected,
    required bool described,
  }) {
    final colors = context.tinyrackTheme;
    return ButtonStyle(
      alignment: AlignmentDirectional.centerStart,
      backgroundColor: WidgetStateProperty.resolveWith((states) {
        // Highlight before selection, matching the web and TRLayerStyles.option:
        // the check indicator says which row is selected, the background says
        // which row the keyboard or pointer is on.
        if (states.contains(WidgetState.focused) ||
            states.contains(WidgetState.hovered)) {
          return colors.surfaceHover;
        }
        if (selected) return colors.surfaceSelected;
        return Colors.transparent;
      }),
      foregroundColor: WidgetStateProperty.resolveWith(
        (states) => states.contains(WidgetState.disabled)
            ? colors.textMuted
            : colors.text,
      ),
      iconSize: WidgetStatePropertyAll(
        TRControlMetrics.iconSizeOf(TRLayerStyles.rowSize),
      ),
      minimumSize: WidgetStatePropertyAll(
        Size(0, TRControlMetrics.heightOf(TRLayerStyles.rowSize)),
      ),
      maximumSize: WidgetStatePropertyAll(
        described
            ? Size.infinite
            : Size(
                double.infinity,
                TRControlMetrics.heightOf(TRLayerStyles.rowSize),
              ),
      ),
      overlayColor: const WidgetStatePropertyAll(Colors.transparent),
      padding: WidgetStatePropertyAll(
        EdgeInsets.symmetric(
          horizontal: TRControlMetrics.inlinePaddingOf(TRLayerStyles.rowSize),
        ),
      ),
      shape: WidgetStatePropertyAll(
        RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(TRGeneratedRadii.sm),
        ),
      ),
      side: WidgetStateProperty.resolveWith((states) {
        final focused =
            states.contains(WidgetState.focused) &&
            TRFocusSource.instance.isKeyboardFocus;
        return BorderSide(
          color: focused ? colors.focus : Colors.transparent,
          width: focused
              ? TRGeneratedBorders.focusWidth
              : TRGeneratedBorders.defaultWidth,
        );
      }),
      tapTargetSize: MaterialTapTargetSize.shrinkWrap,
      textStyle: WidgetStatePropertyAll(
        TRControlMetrics.labelStyleOf(TRLayerStyles.rowSize),
      ),
      visualDensity: VisualDensity.standard,
    );
  }
}
