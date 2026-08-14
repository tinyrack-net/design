import 'package:material_ui/material_ui.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:tinyrack_ui/tinyrack_ui.dart';

const _viewport = Size(400, 600);
const _safePadding = EdgeInsets.fromLTRB(20, 40, 10, 30);

Widget _app(TRDrawerPlacement placement) => MaterialApp(
  theme: TinyrackTheme.light(),
  builder: (context, child) => MediaQuery(
    data: MediaQuery.of(context).copyWith(
      disableAnimations: true,
      padding: _safePadding,
      viewPadding: _safePadding,
    ),
    child: child!,
  ),
  home: Scaffold(
    body: Builder(
      builder: (context) => TextButton(
        onPressed: () => showTRDrawer<void>(
          context: context,
          placement: placement,
          builder: (_) => TRDrawer(
            placement: placement,
            snapPoints: const <double>[1],
            actions: const SizedBox(
              key: Key('drawer-actions'),
              width: 50,
              height: 50,
            ),
            content: const SizedBox(
              key: Key('drawer-content'),
              width: 50,
              height: 50,
            ),
          ),
        ),
        child: const Text('Open drawer'),
      ),
    ),
  ),
);

Future<void> _openDrawer(
  WidgetTester tester,
  TRDrawerPlacement placement,
) async {
  await tester.binding.setSurfaceSize(_viewport);
  addTearDown(() => tester.binding.setSurfaceSize(null));
  await tester.pumpWidget(_app(placement));
  await tester.tap(find.text('Open drawer'));
  await tester.pump();
}

Widget _bottomSheetApp() => MaterialApp(
  theme: TinyrackTheme.light(),
  builder: (context, child) => MediaQuery(
    data: MediaQuery.of(context).copyWith(
      disableAnimations: true,
      padding: _safePadding,
      viewPadding: _safePadding,
    ),
    child: child!,
  ),
  home: Scaffold(
    body: Builder(
      builder: (context) => TextButton(
        onPressed: () => showTRDrawer<void>(
          context: context,
          builder: (_) => const TRDrawer(
            actions: SizedBox(
              key: Key('bottom-sheet-actions'),
              width: 50,
              height: 50,
            ),
            content: SizedBox(
              key: Key('bottom-sheet-content'),
              width: 50,
              height: 50,
            ),
          ),
        ),
        child: const Text('Open bottom sheet'),
      ),
    ),
  ),
);

void main() {
  testWidgets(
    'content-sized bottom sheet keeps its handle clear of the top inset',
    (tester) async {
      await tester.binding.setSurfaceSize(_viewport);
      addTearDown(() => tester.binding.setSurfaceSize(null));
      await tester.pumpWidget(_bottomSheetApp());
      await tester.tap(find.text('Open bottom sheet'));
      await tester.pump();

      final surface = tester.getRect(find.byType(TRDrawer));
      final handle = tester.getRect(
        find.byKey(const ValueKey('tr-drawer-drag-handle')),
      );
      final actions = tester.getRect(
        find.byKey(const Key('bottom-sheet-actions')),
      );

      expect(
        handle.top - surface.top,
        TRSpacing.medium + TRControlMetrics.borderWidth,
      );
      expect(
        actions.bottom,
        lessThanOrEqualTo(_viewport.height - _safePadding.bottom),
      );
    },
  );

  for (final placement in TRDrawerPlacement.values) {
    testWidgets('$placement keeps its surface edge-to-edge and content safe', (
      tester,
    ) async {
      await _openDrawer(tester, placement);

      final surface = tester.getRect(find.byType(TRDrawer));
      final content = tester.getRect(find.byKey(const Key('drawer-content')));
      final actions = tester.getRect(find.byKey(const Key('drawer-actions')));

      expect(surface, Offset.zero & _viewport);
      expect(content.left, greaterThanOrEqualTo(_safePadding.left));
      if (placement != TRDrawerPlacement.bottom) {
        expect(content.top, greaterThanOrEqualTo(_safePadding.top));
      }
      expect(
        content.right,
        lessThanOrEqualTo(_viewport.width - _safePadding.right),
      );
      expect(
        content.bottom,
        lessThanOrEqualTo(_viewport.height - _safePadding.bottom),
      );
      expect(actions.left, greaterThanOrEqualTo(_safePadding.left));
      if (placement != TRDrawerPlacement.bottom) {
        expect(actions.top, greaterThanOrEqualTo(_safePadding.top));
      }
      expect(
        actions.right,
        lessThanOrEqualTo(_viewport.width - _safePadding.right),
      );
      expect(
        actions.bottom,
        lessThanOrEqualTo(_viewport.height - _safePadding.bottom),
      );
    });
  }
}
