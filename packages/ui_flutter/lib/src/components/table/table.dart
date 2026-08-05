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
    final vertical = switch (density) {
      TRTableDensity.compact => TRGeneratedSpacing.xs,
      TRTableDensity.comfortable => TRGeneratedSpacing.sm,
      TRTableDensity.spacious => TRGeneratedSpacing.md,
    };
    final rowHeight = switch (density) {
      TRTableDensity.compact =>
        TRGeneratedControlMetrics.mdHeight -
            TRGeneratedBorders.defaultWidth * 2,
      TRTableDensity.comfortable => TRGeneratedControlMetrics.lgHeight,
      TRTableDensity.spacious => TRGeneratedSpacing.size3xl,
    };
    final horizontalMargin = switch (density) {
      TRTableDensity.compact => TRGeneratedSpacing.md,
      TRTableDensity.comfortable =>
        TRGeneratedSpacing.lg + TRGeneratedSpacing.xs,
      TRTableDensity.spacious => TRGeneratedSpacing.xl + TRGeneratedSpacing.xs,
    };
    final headingCorrection = switch (density) {
      TRTableDensity.compact => TRGeneratedTypographyTracking.none,
      TRTableDensity.comfortable => TRGeneratedBorders.strongWidth,
      TRTableDensity.spacious => TRGeneratedSpacing.sm,
    };
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
      border: TableBorder(horizontalInside: BorderSide(color: colors.border)),
      dataRowMinHeight: rowHeight,
      dataRowMaxHeight: double.infinity,
      headingRowHeight:
          TRGeneratedControlMetrics.lgHeight -
          TRGeneratedBorders.strongWidth +
          vertical * 2 +
          headingCorrection,
      horizontalMargin: horizontalMargin,
      columnSpacing: TRGeneratedSpacing.sm + TRGeneratedBorders.defaultWidth,
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
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        children: [
          if (caption != null)
            Padding(
              padding: const EdgeInsets.only(bottom: TRGeneratedSpacing.sm),
              child: DefaultTextStyle.merge(
                style: Theme.of(context).textTheme.titleSmall,
                child: caption!,
              ),
            ),
          SingleChildScrollView(scrollDirection: Axis.horizontal, child: table),
        ],
      ),
    );
  }
}
