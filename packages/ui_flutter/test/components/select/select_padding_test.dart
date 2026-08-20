import 'package:flutter_test/flutter_test.dart';
import 'package:material_ui/material_ui.dart';
import 'package:tinyrack_ui/tinyrack_ui.dart';

const _items = <TRSelectItem<String>>[
  TRSelectItem<String>(value: 'dark', label: 'Dark'),
];

Widget _app(Widget child) => MaterialApp(
  theme: TinyrackTheme.light(),
  home: Scaffold(
    body: MediaQuery(
      data: const MediaQueryData(disableAnimations: true),
      child: Align(alignment: Alignment.topLeft, child: child),
    ),
  ),
);

Widget _select({
  TRFieldPadding padding = TRFieldPadding.standard,
  TRUiSize uiSize = TRUiSize.md,
}) => _app(
  TRSelect<String>.controlled(
    items: _items,
    value: 'dark',
    appearance: TRFieldAppearance.ghost,
    padding: padding,
    uiSize: uiSize,
    onValueChange: (_) {},
  ),
);

Rect _trigger(WidgetTester tester) => tester.getRect(find.byType(TextButton));

void main() {
  group('TRSelect padding', () {
    testWidgets('standard keeps the field inline inset on both sides', (
      tester,
    ) async {
      await tester.pumpWidget(_select());

      final trigger = _trigger(tester);
      final label = tester.getRect(find.text('Dark'));
      expect(
        label.left - trigger.left,
        moreOrLessEquals(
          TRControlMetrics.inlinePaddingOf(TRUiSize.md) +
              TRControlMetrics.borderWidth,
          epsilon: 0.5,
        ),
      );
    });

    testWidgets('none draws the value and its chevron against the trigger '
        'edges', (tester) async {
      await tester.pumpWidget(_select(padding: TRFieldPadding.none));

      final trigger = _trigger(tester);
      final label = tester.getRect(find.text('Dark'));
      // A select standing in for a row's value has the row's own inset to sit
      // in, so its content starts and ends where the trigger does.
      expect(label.left, moreOrLessEquals(trigger.left, epsilon: 0.5));
      expect(
        trigger.right - label.right,
        moreOrLessEquals(
          TRControlMetrics.gapOf(TRUiSize.md) + TRSpacing.large,
          epsilon: 0.5,
        ),
      );
    });

    testWidgets('none keeps the size scale hit target', (tester) async {
      for (final size in TRUiSize.values) {
        await tester.pumpWidget(
          _select(padding: TRFieldPadding.none, uiSize: size),
        );
        // Dropping the inset must not shrink what a finger has to hit, so the
        // trigger keeps the height its size scale defines.
        expect(
          _trigger(tester).height,
          moreOrLessEquals(TRControlMetrics.heightOf(size), epsilon: 0.5),
          reason: '$size',
        );
      }
    });

    testWidgets('none still opens and reports its value', (tester) async {
      var selected = 'dark';
      await tester.pumpWidget(
        _app(
          TRSelect<String>.controlled(
            items: const <TRSelectItem<String>>[
              TRSelectItem<String>(value: 'dark', label: 'Dark'),
              TRSelectItem<String>(value: 'light', label: 'Light'),
            ],
            value: selected,
            appearance: TRFieldAppearance.ghost,
            padding: TRFieldPadding.none,
            onValueChange: (value) => selected = value ?? selected,
          ),
        ),
      );

      await tester.tap(find.byType(TextButton));
      await tester.pumpAndSettle();
      await tester.tap(find.text('Light').last);
      await tester.pumpAndSettle();

      expect(selected, 'light');
    });
  });
}
