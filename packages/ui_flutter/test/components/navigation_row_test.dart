import 'package:material_ui/material_ui.dart';
import 'package:flutter/gestures.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:lucide_flutter/lucide_flutter.dart';
import 'package:tinyrack_ui/tinyrack_ui.dart';

Widget _app(
  Widget child, {
  TextDirection textDirection = TextDirection.ltr,
  TextScaler textScaler = TextScaler.noScaling,
}) => MaterialApp(
  theme: TinyrackTheme.light(),
  home: MediaQuery(
    data: MediaQueryData(disableAnimations: true, textScaler: textScaler),
    child: Directionality(
      textDirection: textDirection,
      child: Scaffold(
        body: Align(
          alignment: Alignment.topLeft,
          child: SizedBox(width: 320, child: child),
        ),
      ),
    ),
  ),
);

AnimatedContainer _row(WidgetTester tester, String label) =>
    tester.widget<AnimatedContainer>(
      find
          .ancestor(
            of: find.text(label),
            matching: find.byType(AnimatedContainer),
          )
          .first,
    );

Color? _background(WidgetTester tester, String label) =>
    (_row(tester, label).decoration as BoxDecoration?)?.color;

void main() {
  testWidgets('uses token padding and preserves one-line minimum height', (
    tester,
  ) async {
    await tester.pumpWidget(
      _app(
        const Column(
          children: [
            TRNavigationRow(label: Text('One line'), onPressed: _noop),
            TRNavigationRow(
              label: Text('Two lines'),
              description: Text('Supporting copy'),
              onPressed: _noop,
            ),
          ],
        ),
      ),
    );

    for (final label in ['One line', 'Two lines']) {
      expect(
        _row(tester, label).padding,
        const EdgeInsets.symmetric(
          horizontal: TRSpacing.medium,
          vertical: TRSpacing.small,
        ),
      );
    }
    expect(tester.getSize(find.text('One line')).height, lessThanOrEqualTo(21));
    expect(tester.getSize(find.text('One line')).height, lessThan(40));
    expect(
      tester
          .getSize(
            find
                .ancestor(
                  of: find.text('One line'),
                  matching: find.byType(AnimatedContainer),
                )
                .first,
          )
          .height,
      40,
    );
    expect(
      tester
          .getSize(
            find
                .ancestor(
                  of: find.text('Two lines'),
                  matching: find.byType(AnimatedContainer),
                )
                .first,
          )
          .height,
      51,
    );
  });

  testWidgets('uses 8px vertical padding at every explicit size', (
    tester,
  ) async {
    for (final uiSize in TRUiSize.values) {
      await tester.pumpWidget(
        _app(
          TRNavigationRow(
            label: Text(uiSize.name),
            description: const Text('Supporting copy'),
            onPressed: _noop,
            uiSize: uiSize,
          ),
        ),
      );
      expect(
        _row(tester, uiSize.name).padding,
        const EdgeInsets.symmetric(
          horizontal: TRSpacing.medium,
          vertical: TRSpacing.small,
        ),
      );
    }
  });

  testWidgets('shows a direction-aware indicator only when actionable', (
    tester,
  ) async {
    await tester.pumpWidget(
      _app(const TRNavigationRow(label: Text('Forward'), onPressed: _noop)),
    );
    expect(
      tester.widget<Icon>(find.byType(Icon).last).icon,
      LucideIcons.chevronRight,
    );

    await tester.pumpWidget(
      _app(
        const TRNavigationRow(label: Text('Forward'), onPressed: _noop),
        textDirection: TextDirection.rtl,
      ),
    );
    expect(
      tester.widget<Icon>(find.byType(Icon).last).icon,
      LucideIcons.chevronLeft,
    );

    await tester.pumpWidget(
      _app(const TRNavigationRow(label: Text('Unavailable'))),
    );
    expect(find.byType(Icon), findsNothing);

    await tester.pumpWidget(
      _app(
        const TRNavigationRow(
          label: Text('Disabled'),
          enabled: false,
          onPressed: _noop,
        ),
      ),
    );
    expect(find.byType(Icon), findsNothing);
  });

  testWidgets('reports selected, actionable, and disabled semantics', (
    tester,
  ) async {
    final semantics = tester.ensureSemantics();
    await tester.pumpWidget(
      _app(
        const TRNavigationRow(
          label: Text('Selected destination'),
          selected: true,
          onPressed: _noop,
        ),
      ),
    );
    expect(
      tester.getSemantics(find.text('Selected destination')),
      matchesSemantics(
        label: 'Selected destination',
        isButton: true,
        isEnabled: true,
        hasEnabledState: true,
        isSelected: true,
        hasSelectedState: true,
        isFocusable: true,
        hasTapAction: true,
        hasFocusAction: true,
      ),
    );

    await tester.pumpWidget(
      _app(
        const TRNavigationRow(
          label: Text('Disabled destination'),
          enabled: false,
          onPressed: _noop,
        ),
      ),
    );
    expect(
      tester.getSemantics(find.text('Disabled destination')),
      matchesSemantics(
        label: 'Disabled destination',
        isButton: true,
        hasEnabledState: true,
        hasSelectedState: true,
        isFocusable: true,
        hasFocusAction: true,
      ),
    );
    semantics.dispose();
  });

  testWidgets(
    'supports selection, hover, press, focus, and keyboard activation',
    (tester) async {
      var activations = 0;
      await tester.pumpWidget(
        _app(
          TRNavigationRow(
            label: const Text('Destination'),
            selected: true,
            onPressed: () => activations += 1,
          ),
        ),
      );
      final theme = Theme.of(
        tester.element(find.byType(TRNavigationRow)),
      ).extension<TinyrackThemeData>()!;
      expect(_background(tester, 'Destination'), theme.surfaceHover);

      final mouse = await tester.createGesture(kind: PointerDeviceKind.mouse);
      await mouse.addPointer(location: Offset.zero);
      addTearDown(mouse.removePointer);
      await mouse.moveTo(tester.getCenter(find.text('Destination')));
      await tester.pump();
      expect(_background(tester, 'Destination'), theme.surfaceHover);
      await mouse.down(tester.getCenter(find.text('Destination')));
      await tester.pump();
      expect(_background(tester, 'Destination'), theme.surfacePressed);
      await mouse.up();
      await tester.pump();
      expect(activations, 1);

      await tester.sendKeyEvent(LogicalKeyboardKey.tab);
      await tester.sendKeyEvent(LogicalKeyboardKey.enter);
      expect(activations, 2);
    },
  );

  testWidgets(
    'a trailing control handles its press without activating the row',
    (tester) async {
      var rowActivations = 0;
      var trailingActivations = 0;
      await tester.pumpWidget(
        _app(
          TRNavigationRow(
            label: const Text('Destination'),
            trailing: TRIconButton(
              key: const ValueKey('trailing'),
              icon: const Icon(LucideIcons.ellipsis),
              label: 'More',
              onPressed: () => trailingActivations += 1,
            ),
            onPressed: () => rowActivations += 1,
          ),
        ),
      );

      await tester.tap(find.byKey(const ValueKey('trailing')));
      await tester.pump();
      expect(trailingActivations, 1);
      expect(rowActivations, 0);
    },
  );

  testWidgets('scaled two-line content remains readable without overflow', (
    tester,
  ) async {
    await tester.pumpWidget(
      _app(
        const TRNavigationRow(
          label: Text('A long navigation destination that wraps'),
          description: Text('A supporting description'),
          leading: Icon(LucideIcons.folder),
          trailing: Text('⌘1'),
          onPressed: _noop,
        ),
        textScaler: const TextScaler.linear(2),
      ),
    );

    expect(tester.takeException(), isNull);
  });
}

void _noop() {}
