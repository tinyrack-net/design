import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:tinyrack_ui/src/generated/tokens.g.dart';
import 'package:tinyrack_ui/tinyrack_ui.dart';

Widget _host(Widget child, {TextStyle? ambient, TextAlign? ambientAlign}) =>
    MaterialApp(
      theme: TinyrackTheme.light(),
      home: Scaffold(
        body: ambient == null
            ? child
            : DefaultTextStyle(
                style: ambient,
                textAlign: ambientAlign,
                child: child,
              ),
      ),
    );

Text _renderedText(WidgetTester tester) =>
    tester.widget<Text>(find.byType(Text));

void main() {
  group('TRText typography roles', () {
    testWidgets('a variant replaces the ambient style outright', (
      tester,
    ) async {
      await tester.pumpWidget(
        _host(
          const TRText('rack', variant: TRTextVariant.headingMd),
          ambient: const TextStyle(fontSize: 99, color: Color(0xff00ff00)),
        ),
      );

      final rendered = _renderedText(tester);
      expect(
        rendered.style!.fontSize,
        TRGeneratedTextStyles.headingMd.fontSize,
      );
      expect(rendered.strutStyle, isNotNull, reason: 'a role pins its metrics');
    });
  });

  group('TRText.inherit', () {
    testWidgets('keeps the ambient style so component slots stay styled', (
      tester,
    ) async {
      const ambient = TextStyle(fontSize: 21, color: Color(0xff123456));
      await tester.pumpWidget(
        _host(const TRText.inherit('rack'), ambient: ambient),
      );

      final rendered = _renderedText(tester);
      expect(rendered.style, isNull);
      expect(rendered.strutStyle, isNull);
      expect(
        tester.renderObject<RenderParagraph>(find.byType(Text)).text.style,
        ambient,
      );
    });

    testWidgets('overrides only the color and weight it is given', (
      tester,
    ) async {
      const ambient = TextStyle(fontSize: 21, color: Color(0xff123456));
      await tester.pumpWidget(
        _host(
          const TRText.inherit(
            'rack',
            color: TRTextColor.danger,
            weight: TRTextWeight.bold,
          ),
          ambient: ambient,
        ),
      );

      final resolved = tester
          .renderObject<RenderParagraph>(find.byType(Text))
          .text
          .style!;
      expect(resolved.fontSize, 21, reason: 'the ambient size survives');
      expect(resolved.color, TRGeneratedColors.light.danger);
      expect(resolved.fontWeight, TRGeneratedFontWeights.bold);
    });

    testWidgets('inherits the ambient alignment when none is given', (
      tester,
    ) async {
      await tester.pumpWidget(
        _host(
          const TRText.inherit('rack'),
          ambient: const TextStyle(fontSize: 21),
          ambientAlign: TextAlign.center,
        ),
      );

      expect(_renderedText(tester).textAlign, isNull);
      expect(
        tester.renderObject<RenderParagraph>(find.byType(Text)).textAlign,
        TextAlign.center,
      );
    });

    testWidgets('an explicit alignment still wins over the ambient one', (
      tester,
    ) async {
      await tester.pumpWidget(
        _host(
          const TRText.inherit('rack', align: TRTextAlign.end),
          ambient: const TextStyle(fontSize: 21),
          ambientAlign: TextAlign.center,
        ),
      );

      expect(_renderedText(tester).textAlign, TextAlign.end);
    });
  });

  group('TRText overflow', () {
    testWidgets('truncate still clips to a single ellipsized line', (
      tester,
    ) async {
      await tester.pumpWidget(_host(const TRText('rack', truncate: true)));

      final rendered = _renderedText(tester);
      expect(rendered.maxLines, 1);
      expect(rendered.overflow, TextOverflow.ellipsis);
      expect(rendered.softWrap, isFalse);
    });

    testWidgets('truncate ellipsizes at an explicit multi-line cap', (
      tester,
    ) async {
      await tester.pumpWidget(
        _host(const TRText('rack', truncate: true, maxLines: 2)),
      );

      final rendered = _renderedText(tester);
      expect(rendered.maxLines, 2);
      expect(rendered.overflow, TextOverflow.ellipsis);
      expect(
        rendered.softWrap,
        isNot(isFalse),
        reason: 'a multi-line cap must still wrap',
      );
    });

    testWidgets('overflow and softWrap are settable without truncate', (
      tester,
    ) async {
      await tester.pumpWidget(
        _host(
          const TRText(
            'rack',
            maxLines: 3,
            overflow: TextOverflow.fade,
            softWrap: false,
          ),
        ),
      );

      final rendered = _renderedText(tester);
      expect(rendered.maxLines, 3);
      expect(rendered.overflow, TextOverflow.fade);
      expect(rendered.softWrap, isFalse);
    });

    testWidgets('an explicit overflow wins over truncate', (tester) async {
      await tester.pumpWidget(
        _host(
          const TRText('rack', truncate: true, overflow: TextOverflow.clip),
        ),
      );

      expect(_renderedText(tester).overflow, TextOverflow.clip);
    });
  });
}
