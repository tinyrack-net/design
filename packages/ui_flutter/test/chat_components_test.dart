import 'dart:ui' show Tristate;

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:lucide_flutter/lucide_flutter.dart';
import 'package:tinyrack_ui/tinyrack_ui.dart';

void main() {
  testWidgets('chat rows share one leading rail and first-line alignment', (
    tester,
  ) async {
    await tester.pumpWidget(
      _app(
        const Column(
          children: [
            TRChatMessageRow(
              icon: LucideIcons.bot,
              child: Text('First line\nSecond line'),
            ),
            TRChatMessageRow(
              icon: LucideIcons.wrench,
              child: Text('Tool activity'),
            ),
          ],
        ),
      ),
    );

    final icons = tester.widgetList<Icon>(find.byType(Icon)).toList();
    expect(icons, hasLength(2));
    expect(icons[0].size, icons[1].size);
    expect(
      tester.getTopLeft(find.text('First line\nSecond line')).dx,
      tester.getTopLeft(find.text('Tool activity')).dx,
    );
    final firstIcon = tester.getRect(find.byType(Icon).first);
    final firstText = tester.getRect(find.text('First line\nSecond line'));
    final firstLineHeight =
        TRTypography.body.fontSize! * TRTypography.body.height!;
    expect(
      firstIcon.center.dy,
      moreOrLessEquals(firstText.top + firstLineHeight / 2, epsilon: 0.5),
    );
  });

  testWidgets('message leading stays on the first line at large text scale', (
    tester,
  ) async {
    await tester.pumpWidget(
      _app(
        const MediaQuery(
          data: MediaQueryData(textScaler: TextScaler.linear(2)),
          child: TRChatMessageRow(
            icon: LucideIcons.bot,
            child: Text('이미지를 보냈어요! 🖼️\n두 번째 줄'),
          ),
        ),
      ),
    );

    final icon = tester.getRect(find.byType(Icon));
    final text = tester.getRect(find.text('이미지를 보냈어요! 🖼️\n두 번째 줄'));
    final firstLineHeight =
        TRTypography.body.fontSize! * 2 * TRTypography.body.height!;
    expect(
      icon.center.dy,
      moreOrLessEquals(text.top + firstLineHeight / 2, epsilon: 0.5),
    );
  });

  testWidgets('message leading can center on a compound surface', (
    tester,
  ) async {
    await tester.pumpWidget(
      _app(
        const TRChatMessageRow(
          icon: LucideIcons.image,
          alignment: TRChatMessageAlignment.center,
          child: SizedBox(
            key: ValueKey('compound-surface'),
            height: TRSpacing.fourExtraLarge,
          ),
        ),
      ),
    );

    expect(
      tester.getRect(find.byType(Icon)).center.dy,
      moreOrLessEquals(
        tester
            .getRect(find.byKey(const ValueKey('compound-surface')))
            .center
            .dy,
        epsilon: 0.5,
      ),
    );
  });

  testWidgets('message rail follows RTL while keeping first-line alignment', (
    tester,
  ) async {
    await tester.pumpWidget(
      _app(
        const Directionality(
          textDirection: TextDirection.rtl,
          child: TRChatMessageRow(
            icon: LucideIcons.bot,
            child: Text('画像を送りました。\n次の行'),
          ),
        ),
      ),
    );

    final icon = tester.getRect(find.byType(Icon));
    final text = tester.getRect(find.text('画像を送りました。\n次の行'));
    expect(icon.left, greaterThan(text.right));
    final firstLineHeight =
        TRTypography.body.fontSize! * TRTypography.body.height!;
    expect(
      icon.center.dy,
      moreOrLessEquals(text.top + firstLineHeight / 2, epsilon: 0.5),
    );
  });

  testWidgets('user bubble aligns to the inline end and constrains long text', (
    tester,
  ) async {
    await tester.pumpWidget(
      _app(
        const SizedBox(
          key: ValueKey('chat-host'),
          width: TRMeasurements.measureXl,
          child: TRChatUserBubble(
            child: Text('A user-authored message that can wrap safely.'),
          ),
        ),
      ),
    );

    final host = tester.getRect(find.byKey(const ValueKey('chat-host')));
    final bubble = tester.getRect(
      find.descendant(
        of: find.byType(TRChatUserBubble),
        matching: find.byType(DecoratedBox),
      ),
    );
    expect(bubble.right, host.right);
    expect(bubble.width, lessThan(host.width));
  });

  testWidgets('tool disclosure keeps technical detail hidden until opened', (
    tester,
  ) async {
    await tester.pumpWidget(
      _app(
        const TRChatToolDisclosure(
          icon: LucideIcons.fileText,
          label: 'Read file',
          status: TRChatToolStatus.succeeded,
          statusLabel: 'Done',
          details: Text('uid-123 /workspace/private.dart'),
        ),
      ),
    );

    expect(find.text('Read file'), findsOneWidget);
    expect(find.text('Done'), findsOneWidget);
    expect(find.textContaining('uid-123'), findsNothing);

    await tester.tap(find.byType(TRChatToolDisclosure));
    await tester.pump();
    expect(find.textContaining('uid-123'), findsOneWidget);

    await tester.sendKeyEvent(LogicalKeyboardKey.tab);
    await tester.sendKeyEvent(LogicalKeyboardKey.space);
    await tester.pumpAndSettle();
    expect(find.textContaining('uid-123'), findsNothing);
  });

  testWidgets('controlled disclosure reports state and running semantics', (
    tester,
  ) async {
    var open = false;
    await tester.pumpWidget(
      _app(
        StatefulBuilder(
          builder: (context, setState) => TRChatToolDisclosure(
            icon: LucideIcons.terminal,
            label: 'Run command',
            status: TRChatToolStatus.running,
            statusLabel: 'Running',
            open: open,
            onOpenChange: (value) => setState(() => open = value),
            details: const Text('flutter test'),
          ),
        ),
      ),
    );

    expect(find.byType(TRSpinner), findsOneWidget);
    final semantics = tester.getSemantics(find.byType(TRChatToolDisclosure));
    expect(semantics.flagsCollection.isButton, isTrue);
    expect(semantics.flagsCollection.isExpanded, Tristate.isFalse);

    await tester.tap(find.byType(TRChatToolDisclosure));
    await tester.pump();
    expect(open, isTrue);
    expect(find.text('flutter test'), findsOneWidget);
  });

  testWidgets('status row exposes a single accessible running label', (
    tester,
  ) async {
    await tester.pumpWidget(
      _app(
        const TRChatStatusRow(
          label: 'Running',
          status: TRChatToolStatus.running,
        ),
      ),
    );

    expect(find.text('Running'), findsOneWidget);
    expect(find.byType(TRSpinner), findsOneWidget);
    expect(find.bySemanticsLabel('Running'), findsOneWidget);
  });

  testWidgets('status row keeps a running spinner square', (tester) async {
    await tester.pumpWidget(
      _app(
        const TRChatStatusRow(
          label: 'Running',
          status: TRChatToolStatus.running,
        ),
      ),
    );

    final spinner = find.descendant(
      of: find.byType(TRChatStatusRow),
      matching: find.byType(TRSpinner),
    );
    final size = tester.getSize(spinner);
    expect(size.width, closeTo(size.height, 0.001));
  });

  testWidgets('running rows settle to a static icon with reduced motion', (
    tester,
  ) async {
    await tester.pumpWidget(
      _app(
        const MediaQuery(
          data: MediaQueryData(disableAnimations: true),
          child: TRChatStatusRow(
            label: 'Running',
            status: TRChatToolStatus.running,
          ),
        ),
      ),
    );

    await tester.pumpAndSettle();
    expect(find.byType(TRSpinner), findsNothing);
    expect(find.byIcon(LucideIcons.loaderCircle), findsOneWidget);
  });
}

Widget _app(Widget child) => MaterialApp(
  theme: TinyrackTheme.light(),
  home: Scaffold(body: Center(child: child)),
);
