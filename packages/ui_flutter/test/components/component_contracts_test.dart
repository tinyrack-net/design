import 'package:material_ui/material_ui.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:tinyrack_ui/tinyrack_ui.dart';

Widget _app(Widget child) => MaterialApp(
  theme: TinyrackTheme.light(),
  home: Scaffold(body: Center(child: child)),
);

void main() {
  test('pagination range clamps pages and collapses wide gaps', () {
    expect(getTRPaginationRange(currentPage: 6, totalPages: 12), [
      1,
      null,
      5,
      6,
      7,
      null,
      12,
    ]);
    expect(getTRPaginationRange(currentPage: -2, totalPages: 3), [1, 2, 3]);
  });

  testWidgets('pagination reports selection and activates page changes', (
    tester,
  ) async {
    int? changed;
    await tester.pumpWidget(
      _app(
        TRPagination(
          currentPage: 2,
          totalPages: 5,
          onPageChanged: (page) => changed = page,
        ),
      ),
    );
    expect(find.bySemanticsLabel('Page 2'), findsOneWidget);
    await tester.tap(find.bySemanticsLabel('Page 3'));
    expect(changed, 3);
  });

  testWidgets('table renders caption, headers, rows, and footer', (
    tester,
  ) async {
    await tester.pumpWidget(
      _app(
        const TRTable(
          caption: Text('Rack status'),
          columns: [TRTableColumn(label: Text('Rack'))],
          rows: [
            TRTableRow(cells: [Text('Rack A')]),
          ],
          footer: TRTableFooter(cells: [Text('Total')]),
        ),
      ),
    );
    expect(find.text('Rack status'), findsOneWidget);
    expect(find.text('Rack'), findsOneWidget);
    expect(find.text('Rack A'), findsOneWidget);
    expect(find.text('Total'), findsOneWidget);
  });

  testWidgets('window frame controls are excluded from semantics', (
    tester,
  ) async {
    await tester.pumpWidget(
      _app(const TRWindowFrame(title: Text('Terminal'), body: Text('Ready'))),
    );
    expect(find.text('Terminal'), findsOneWidget);
    expect(find.byType(TRWindowFrameControl), findsNWidgets(3));
    final semantics = tester.getSemantics(find.byType(TRWindowFrameControls));
    expect(semantics.label, isEmpty);
  });

  testWidgets('window title bar exposes application and caption slots', (
    tester,
  ) async {
    await tester.pumpWidget(
      _app(
        const SizedBox(
          width: 480,
          child: TRWindowFrameTitleBar(
            leading: Text('File'),
            actions: Text('Close'),
            child: Text('Drag region'),
          ),
        ),
      ),
    );

    final leading = tester.getCenter(find.text('File'));
    final center = tester.getCenter(find.text('Drag region'));
    final actions = tester.getCenter(find.text('Close'));
    expect(leading.dx, lessThan(center.dx));
    expect(center.dx, lessThan(actions.dx));
  });
}
