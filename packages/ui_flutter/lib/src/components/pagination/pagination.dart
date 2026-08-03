import 'dart:math' as math;

import 'package:flutter/material.dart';

import '../../generated/tokens.g.dart';
import '../../theme.dart';

/// A page number, or `null` for a collapsed gap.
typedef TRPaginationRangeItem = int?;

/// Returns the visible page sequence for a pagination control.
List<TRPaginationRangeItem> getTRPaginationRange({
  required int currentPage,
  required int totalPages,
  int boundaryCount = 1,
  int siblingCount = 1,
}) {
  assert(boundaryCount >= 0);
  assert(siblingCount >= 0);
  if (totalPages <= 0) return const [];
  final pages = totalPages;
  final boundary = boundaryCount;
  final siblings = siblingCount;
  final current = currentPage.clamp(1, pages);
  List<int> range(int start, int end) => [
    for (var page = start; page <= end; page += 1) page,
  ];
  final startPages = range(1, math.min(boundary, pages));
  final endPages = range(math.max(pages - boundary + 1, boundary + 1), pages);
  final siblingsStart = math.max(
    math.min(current - siblings, pages - boundary - siblings * 2 - 1),
    boundary + 2,
  );
  final siblingsEnd = math.min(
    math.max(current + siblings, boundary + siblings * 2 + 2),
    endPages.isNotEmpty ? endPages.first - 2 : pages - 1,
  );
  final result = <TRPaginationRangeItem>[];
  result.addAll(startPages);
  if (siblingsStart > boundary + 2) {
    result.add(null);
  } else if (boundary + 1 < pages - boundary) {
    result.add(boundary + 1);
  }
  result.addAll(range(siblingsStart, siblingsEnd));
  if (siblingsEnd < pages - boundary - 1) {
    result.add(null);
  } else if (pages - boundary > boundary) {
    result.add(pages - boundary);
  }
  result.addAll(endPages);
  return List.unmodifiable(result);
}

// @tinyrack-preview pagination
/// A numbered page navigator for statically divided content.
class TRPagination extends StatelessWidget {
  const TRPagination({
    required this.currentPage,
    required this.totalPages,
    required this.onPageChanged,
    this.boundaryCount = 1,
    this.siblingCount = 1,
    this.label = 'Pagination',
    this.previousLabel = 'Previous',
    this.nextLabel = 'Next',
    this.pageLabel,
    super.key,
  });

  final int currentPage;
  final int totalPages;
  final ValueChanged<int> onPageChanged;
  final int boundaryCount;
  final int siblingCount;
  final String label;
  final String previousLabel;
  final String nextLabel;
  final String Function(int page)? pageLabel;

  @override
  Widget build(BuildContext context) {
    if (totalPages <= 1) return const SizedBox.shrink();
    final current = currentPage.clamp(1, totalPages);
    final range = getTRPaginationRange(
      currentPage: current,
      totalPages: totalPages,
      boundaryCount: boundaryCount,
      siblingCount: siblingCount,
    );
    return Semantics(
      container: true,
      label: label,
      child: Wrap(
        crossAxisAlignment: WrapCrossAlignment.center,
        spacing: TRGeneratedSpacing.xs,
        runSpacing: TRGeneratedSpacing.xs,
        children: [
          _TRPaginationButton(
            label: previousLabel,
            enabled: current > 1,
            onPressed: () => onPageChanged(current - 1),
          ),
          for (final item in range)
            item == null
                ? const ExcludeSemantics(
                    child: SizedBox(
                      width: TRGeneratedControlMetrics.smHeight,
                      height:
                          TRGeneratedControlMetrics.smHeight +
                          TRGeneratedBorders.defaultWidth * 2,
                      child: Center(child: Text('…')),
                    ),
                  )
                : _TRPaginationButton(
                    label: pageLabel?.call(item) ?? 'Page $item',
                    selected: item == current,
                    onPressed: () => onPageChanged(item),
                    child: Text('$item'),
                  ),
          _TRPaginationButton(
            label: nextLabel,
            enabled: current < totalPages,
            onPressed: () => onPageChanged(current + 1),
          ),
        ],
      ),
    );
  }
}

class _TRPaginationButton extends StatelessWidget {
  const _TRPaginationButton({
    required this.label,
    required this.onPressed,
    this.child,
    this.enabled = true,
    this.selected = false,
  });

  final String label;
  final VoidCallback onPressed;
  final Widget? child;
  final bool enabled;
  final bool selected;

  @override
  Widget build(BuildContext context) {
    final colors = context.tinyrackTheme;
    final step = child == null;
    final dimension =
        TRGeneratedControlMetrics.smHeight +
        TRGeneratedBorders.defaultWidth * 2;
    final cellWidth = dimension + TRGeneratedSpacing.sm;
    final content =
        child ??
        Row(
          mainAxisSize: MainAxisSize.min,
          spacing: TRGeneratedSpacing.xs,
          children: [
            if (label == 'Previous') const Text('←'),
            if (MediaQuery.sizeOf(context).width >= TRGeneratedBreakpoints.sm)
              Text(label),
            if (label != 'Previous') const Text('→'),
          ],
        );
    final button = TextButton(
      onPressed: enabled && !selected ? onPressed : null,
      style:
          TextButton.styleFrom(
            animationDuration: MediaQuery.disableAnimationsOf(context)
                ? Duration.zero
                : TRGeneratedMotion.fast,
            padding: EdgeInsets.symmetric(
              horizontal: step ? TRGeneratedSpacing.sm : TRGeneratedSpacing.xs,
            ),
            minimumSize: const Size(
              TRGeneratedControlMetrics.smHeight +
                  TRGeneratedBorders.defaultWidth * 2,
              TRGeneratedControlMetrics.smHeight +
                  TRGeneratedBorders.defaultWidth * 2,
            ),
            foregroundColor: selected ? colors.onPrimary : colors.text,
            disabledForegroundColor: selected
                ? colors.onPrimary
                : colors.textMuted,
            backgroundColor: selected ? colors.primary : Colors.transparent,
            textStyle: const TextStyle(
              fontFamily: TRGeneratedFontFamilies.body,
              fontSize: TRGeneratedTypographySizes.sm,
              fontWeight: TRGeneratedFontWeights.medium,
            ),
            shape: RoundedRectangleBorder(
              side: BorderSide(
                color: selected ? colors.primary : colors.border,
              ),
              borderRadius: BorderRadius.circular(TRGeneratedRadii.md),
            ),
          ).copyWith(
            backgroundColor: WidgetStateProperty.resolveWith((states) {
              if (selected) return colors.primary;
              return states.contains(WidgetState.hovered)
                  ? colors.surfaceHover
                  : Colors.transparent;
            }),
            shape: WidgetStateProperty.resolveWith((states) {
              return RoundedRectangleBorder(
                side: BorderSide(
                  color: selected
                      ? colors.primary
                      : states.contains(WidgetState.hovered)
                      ? colors.borderStrong
                      : colors.border,
                ),
                borderRadius: BorderRadius.circular(TRGeneratedRadii.md),
              );
            }),
          ),
      child: content,
    );
    return Semantics(
      button: !selected,
      selected: selected,
      label: label,
      enabled: enabled,
      child: step
          ? SizedBox(
              width:
                  MediaQuery.sizeOf(context).width < TRGeneratedBreakpoints.sm
                  ? cellWidth + TRGeneratedSpacing.sm
                  : null,
              height: dimension,
              child: button,
            )
          : SizedBox(width: cellWidth, height: dimension, child: button),
    );
  }
}
