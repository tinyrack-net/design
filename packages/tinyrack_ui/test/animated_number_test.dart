import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:intl/intl.dart';
import 'package:tinyrack_ui/tinyrack_ui.dart';

void main() {
  Widget app(Widget child, {bool disableAnimations = false}) => MaterialApp(
    locale: const Locale('en', 'US'),
    theme: TinyrackTheme.light(),
    home: MediaQuery(
      data: MediaQueryData(disableAnimations: disableAnimations),
      child: Center(child: child),
    ),
  );

  testWidgets('renders the first value statically and keeps fractionDigits', (
    tester,
  ) async {
    await tester.pumpWidget(
      app(const TRAnimatedNumber(value: 1234.5, fractionDigits: 1)),
    );
    expect(find.text('1,234.5'), findsOneWidget);
    expect(find.byType(Transform), findsNothing);
  });

  testWidgets(
    'count interpolates, settles, and retargets from its visual value',
    (tester) async {
      Widget number(double value) => app(
        TRAnimatedNumber(
          animation: TRAnimatedNumberAnimation.count,
          duration: const Duration(seconds: 1),
          value: value,
        ),
      );
      await tester.pumpWidget(number(0));
      await tester.pumpWidget(number(100));
      await tester.pump(const Duration(milliseconds: 500));
      final halfway = tester.widget<Text>(find.byType(Text).last).data;
      expect(halfway, isNot(anyOf('0', '100')));

      await tester.pumpWidget(number(200));
      await tester.pump(const Duration(milliseconds: 100));
      final retargeted = tester.widget<Text>(find.byType(Text).last).data;
      expect(retargeted, isNot(anyOf('0', '100', '200')));
      await tester.pumpAndSettle();
      expect(find.text('200'), findsOneWidget);
    },
  );

  testWidgets('roll honors automatic and forced directions', (tester) async {
    Future<double> outgoingOffset(
      TRAnimatedNumberRollDirection direction,
      double from,
      double to,
    ) async {
      await tester.pumpWidget(const SizedBox.shrink());
      Widget number(double value) => app(
        TRAnimatedNumber(
          duration: const Duration(seconds: 1),
          rollDirection: direction,
          value: value,
        ),
      );
      await tester.pumpWidget(number(from));
      await tester.pumpWidget(number(to));
      await tester.pump(const Duration(milliseconds: 500));
      final outgoing = find.ancestor(
        of: find.text(formatAnimatedNumber(from)),
        matching: find.byType(Transform),
      );
      return tester.widget<Transform>(outgoing.first).transform.storage[13];
    }

    expect(
      await outgoingOffset(TRAnimatedNumberRollDirection.auto, 1, 2),
      lessThan(0),
    );
    await tester.pumpAndSettle();
    expect(
      await outgoingOffset(TRAnimatedNumberRollDirection.auto, 2, 1),
      greaterThan(0),
    );
    await tester.pumpAndSettle();
    expect(
      await outgoingOffset(TRAnimatedNumberRollDirection.up, 2, 1),
      lessThan(0),
    );
  });

  testWidgets('supports NumberFormat, formatter, locale, and style', (
    tester,
  ) async {
    await tester.pumpWidget(
      app(
        Column(
          children: [
            TRAnimatedNumber(
              numberFormat: NumberFormat.simpleCurrency(
                locale: 'en_US',
                name: 'USD',
              ),
              value: 42,
            ),
            TRAnimatedNumber(
              formatter: (value) => '${value.toInt()} GB',
              style: const TextStyle(fontSize: 32),
              value: 128,
            ),
            TRAnimatedNumber(
              numberFormat: NumberFormat.percentPattern('en_US'),
              value: 0.42,
            ),
          ],
        ),
      ),
    );
    expect(find.text(r'$42.00'), findsOneWidget);
    final unit = tester.widget<Text>(find.text('128 GB'));
    expect(unit.style?.fontSize, 32);
    expect(find.text('42%'), findsOneWidget);
    expect(formatAnimatedNumber(1234, locale: 'de_DE'), '1.234');
  });

  testWidgets('roll settles after sign, grouping, and fraction changes', (
    tester,
  ) async {
    Widget number(double value) => app(
      TRAnimatedNumber(
        duration: const Duration(milliseconds: 200),
        fractionDigits: 1,
        value: value,
      ),
    );
    await tester.pumpWidget(number(99));
    await tester.pumpWidget(number(-1234.5));
    await tester.pumpAndSettle();
    expect(find.text('-1,234.5'), findsOneWidget);
  });

  testWidgets('zero duration and reduced motion settle immediately', (
    tester,
  ) async {
    Widget number(double value, {bool reduced = false}) => app(
      TRAnimatedNumber(duration: Duration.zero, value: value),
      disableAnimations: reduced,
    );
    await tester.pumpWidget(number(10));
    await tester.pumpWidget(number(20));
    expect(find.text('20'), findsOneWidget);
    expect(find.byType(Transform), findsNothing);

    await tester.pumpWidget(
      app(const TRAnimatedNumber(value: 30), disableAnimations: true),
    );
    await tester.pumpWidget(
      app(const TRAnimatedNumber(value: 40), disableAnimations: true),
    );
    expect(find.text('40'), findsOneWidget);
  });

  testWidgets('exposes only the formatted target through semantics', (
    tester,
  ) async {
    final semantics = tester.ensureSemantics();
    await tester.pumpWidget(
      app(
        const TRAnimatedNumber(
          animation: TRAnimatedNumberAnimation.count,
          duration: Duration(seconds: 1),
          value: 10,
        ),
      ),
    );
    await tester.pumpWidget(
      app(
        const TRAnimatedNumber(
          animation: TRAnimatedNumberAnimation.count,
          duration: Duration(seconds: 1),
          value: 90,
        ),
      ),
    );
    await tester.pump(const Duration(milliseconds: 200));
    expect(tester.getSemantics(find.byType(TRAnimatedNumber)).label, '90');
    semantics.dispose();
  });
}
