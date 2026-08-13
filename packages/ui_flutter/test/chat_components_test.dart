import 'dart:ui' show Tristate;

import 'package:material_ui/material_ui.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:lucide_flutter/lucide_flutter.dart';
import 'package:tinyrack_ui/src/internal/motion_boundary.dart';
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
            secondaryLabel: 'flutter test',
            status: TRChatToolStatus.running,
            statusLabel: 'Running',
            open: open,
            onOpenChange: (value) => setState(() => open = value),
            details: const Text('flutter test'),
          ),
        ),
      ),
    );

    expect(find.text('Run command flutter test'), findsOneWidget);
    expect(find.text('Running'), findsNothing);
    expect(find.byType(TRSpinner), findsNothing);
    expect(find.byType(ShaderMask), findsOneWidget);
    final semantics = tester.getSemantics(find.byType(TRChatToolDisclosure));
    expect(semantics.flagsCollection.isButton, isTrue);
    expect(semantics.flagsCollection.isExpanded, Tristate.isFalse);
    expect(semantics.label, 'Run command, flutter test, Running');

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
    expect(find.byType(TRSpinner), findsNothing);
    expect(find.byType(ShaderMask), findsOneWidget);
    expect(find.bySemanticsLabel('Running'), findsOneWidget);
  });

  testWidgets('running shimmer advances and starts after an idle mount', (
    tester,
  ) async {
    var status = TRChatToolStatus.succeeded;
    await tester.pumpWidget(
      _app(
        StatefulBuilder(
          builder: (context, setState) => Column(
            children: [
              TRChatToolDisclosure(
                icon: LucideIcons.terminal,
                label: 'Shell',
                secondaryLabel: 'gh pr checks 216 --watch --interval 10',
                status: status,
                statusLabel: status == TRChatToolStatus.running
                    ? 'Running'
                    : 'Done',
                details: const SizedBox.shrink(),
              ),
              TextButton(
                onPressed: () => setState(
                  () => status = status == TRChatToolStatus.running
                      ? TRChatToolStatus.succeeded
                      : TRChatToolStatus.running,
                ),
                child: const Text('Toggle'),
              ),
            ],
          ),
        ),
      ),
    );

    expect(find.byType(ShaderMask), findsNothing);

    await tester.tap(find.text('Toggle'));
    await tester.pump();
    final boundary = find.descendant(
      of: find.byType(TRChatToolDisclosure),
      matching: find.byType(TRMotionBoundary),
    );
    expect(boundary, findsOneWidget);
    final first = tester
        .renderObject<RenderTRMotionBoundary>(boundary)
        .progress;

    await tester.pump(TRMotion.fast);
    final second = tester
        .renderObject<RenderTRMotionBoundary>(boundary)
        .progress;
    expect(second, isNot(first));

    await tester.tap(find.text('Toggle'));
    await tester.pump();
    expect(find.byType(ShaderMask), findsNothing);
    expect(find.text('Done'), findsOneWidget);
  });

  testWidgets('running rows settle to static text with reduced motion', (
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
    expect(find.byType(ShaderMask), findsNothing);
    expect(find.byIcon(LucideIcons.loaderCircle), findsOneWidget);
    expect(find.text('Running'), findsOneWidget);
  });

  testWidgets('running labels truncate safely at scale in both directions', (
    tester,
  ) async {
    for (final direction in TextDirection.values) {
      await tester.pumpWidget(
        _app(
          MediaQuery(
            data: const MediaQueryData(textScaler: TextScaler.linear(2)),
            child: Directionality(
              textDirection: direction,
              child: const SizedBox(
                width: TRMeasurements.measureXs,
                child: TRChatToolDisclosure(
                  icon: LucideIcons.terminal,
                  label: 'Shell',
                  secondaryLabel:
                      'gh pr checks 216 --watch --interval 10 and more arguments',
                  status: TRChatToolStatus.running,
                  statusLabel: 'Running',
                  details: SizedBox.shrink(),
                ),
              ),
            ),
          ),
        ),
      );
      await tester.pump();

      expect(tester.takeException(), isNull);
      expect(find.byType(ShaderMask), findsOneWidget);
    }
  });
}

Widget _app(Widget child) => MaterialApp(
  theme: TinyrackTheme.light(),
  home: Scaffold(body: Center(child: child)),
);
