import 'package:flutter/material.dart';

import '../../generated/tokens.g.dart';
import '../../theme.dart';

enum TRTableDensity { compact, comfortable, spacious }

class TRTableColumn {
  const TRTableColumn({
    required this.label,
    this.alignment = Alignment.centerLeft,
  });
  final Widget label;
  final Alignment alignment;
}

class TRTableRow {
  const TRTableRow({required this.cells});
  final List<Widget> cells;
}

class TRTableFooter {
  const TRTableFooter({required this.cells});
  final List<Widget> cells;
}

// @tinyrack-preview table
/// A semantic data table with density, striping, and horizontal overflow.
class TRTable extends StatelessWidget {
  const TRTable({
    required this.columns,
    required this.rows,
    this.caption,
    this.footer,
    this.density = TRTableDensity.comfortable,
    this.striped = false,
    this.scrollLabel,
    super.key,
  });

  final List<TRTableColumn> columns;
  final List<TRTableRow> rows;
  final Widget? caption;
  final TRTableFooter? footer;
  final TRTableDensity density;
  final bool striped;
  final String? scrollLabel;

  @override
  Widget build(BuildContext context) {
    final colors = context.tinyrackTheme;
    // Derived from the same cell model as `@tinyrack/ui`: a row is its vertical
    // padding twice, plus the line box, plus the bottom border. These used to be
    // hand-fitted constants, which drifted from the web at every density except
    // compact.
    final paddingY = switch (density) {
      TRTableDensity.compact => TRGeneratedControlMetrics.mdGap,
      TRTableDensity.comfortable => TRGeneratedSpacing.lg,
      TRTableDensity.spacious =>
        TRGeneratedSpacing.sm + TRGeneratedControlMetrics.mdGap,
    };
    final lineHeight = switch (density) {
      TRTableDensity.compact => TRGeneratedControlMetrics.mdLineHeight,
      TRTableDensity.comfortable =>
        TRGeneratedControlMetrics.mdLineHeight + TRGeneratedSpacing.size3xs * 2,
      TRTableDensity.spacious => TRGeneratedSpacing.xl,
    };
    final paddingX = switch (density) {
      TRTableDensity.compact => TRGeneratedSpacing.md,
      TRTableDensity.comfortable => TRGeneratedSpacing.lg,
      TRTableDensity.spacious => TRGeneratedSpacing.xl,
    };
    // `border-collapse: collapse` keeps the row box at padding + line box; the
    // shared border sits between rows, which is what `horizontalInside` draws.
    final rowHeight = paddingY * 2 + lineHeight;
    // CSS puts the inline padding on every cell, so neighbouring cells add up to
    // twice it between columns while the outer edge only gets it once.
    final horizontalMargin = paddingX;
    final columnSpacing = paddingX * 2;
    final dataRows = rows.indexed.map((entry) {
      final (index, row) = entry;
      return DataRow(
        color: WidgetStateProperty.resolveWith(
          (states) => states.contains(WidgetState.hovered)
              ? colors.surfaceHover
              : striped && index.isOdd
              ? colors.surfaceMuted
              : Colors.transparent,
        ),
        cells: [for (final cell in row.cells) DataCell(cell)],
      );
    }).toList();
    if (footer != null) {
      dataRows.add(
        DataRow(cells: [for (final cell in footer!.cells) DataCell(cell)]),
      );
    }
    final table = DataTable(
      headingRowColor: WidgetStatePropertyAll(colors.surfaceMuted),
      // Without these, Material's 14px defaults apply to both rows, so heading
      // text measured wider than the web's 12px and pushed every column out.
      headingTextStyle: TextStyle(
        color: colors.textMuted,
        fontFamily: TRGeneratedFontFamilies.body,
        fontFamilyFallback: TRGeneratedFontFamilies.fallback,
        fontSize: TRGeneratedTypographySizes.xs,
        fontWeight: TRGeneratedFontWeights.strong,
        letterSpacing:
            TRGeneratedTypographyTracking.md * TRGeneratedTypographySizes.xs,
      ),
      dataTextStyle: TextStyle(
        color: colors.text,
        fontFamily: TRGeneratedFontFamilies.body,
        fontFamilyFallback: TRGeneratedFontFamilies.fallback,
        fontSize: TRGeneratedTypographySizes.sm,
      ),
      // `dividerThickness` is the Material-native row rule and, unlike a
      // TableBorder, it takes part in layout the way the collapsed CSS border
      // between rows does.
      dividerThickness: TRGeneratedBorders.defaultWidth,
      // `dividerThickness` paints the rule but does not reserve space for it, so
      // each data row carries the collapsed border that sits above it. Heading +
      // N data rows then measures the same as the web's N+1 collapsed rows.
      dataRowMinHeight: rowHeight + TRGeneratedBorders.defaultWidth,
      dataRowMaxHeight: double.infinity,
      headingRowHeight: rowHeight,
      horizontalMargin: horizontalMargin,
      columnSpacing: columnSpacing,
      columns: [
        for (final column in columns)
          DataColumn(
            label: Align(alignment: column.alignment, child: column.label),
            headingRowAlignment: column.alignment.x > 0
                ? MainAxisAlignment.end
                : MainAxisAlignment.start,
          ),
      ],
      rows: dataRows,
    );
    return Semantics(
      container: true,
      label: scrollLabel,
      // Mirrors `.tr-table-container`: the web frames the caption and the rows
      // together in a bordered, rounded surface.
      child: Container(
        decoration: BoxDecoration(
          border: Border.all(color: colors.border),
          borderRadius: BorderRadius.circular(TRGeneratedRadii.md),
          color: colors.surface,
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisSize: MainAxisSize.min,
          children: [
            if (caption != null)
              Padding(
                // The web caption is padded on both sides and rides the same line
                // box as a control label; Material's titleSmall is neither.
                padding: EdgeInsets.symmetric(
                  horizontal: paddingX,
                  vertical: TRGeneratedSpacing.sm,
                ),
                child: DefaultTextStyle.merge(
                  style: TextStyle(
                    color: colors.textMuted,
                    fontFamily: TRGeneratedFontFamilies.body,
                    fontFamilyFallback: TRGeneratedFontFamilies.fallback,
                    fontSize: TRGeneratedTypographySizes.sm,
                    height:
                        TRGeneratedControlMetrics.mdLineHeight /
                        TRGeneratedTypographySizes.sm,
                  ),
                  child: caption!,
                ),
              ),
            SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              child: table,
            ),
          ],
        ),
      ),
    );
  }
}
