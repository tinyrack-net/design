import 'dart:async';

import 'package:flutter/gestures.dart';
import 'package:material_ui/material_ui.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:tinyrack_ui/tinyrack_ui.dart';

// The preview highlighter stays outside the published package by design.
// ignore: avoid_relative_lib_imports
import '../../../example/lib/code_highlighter.dart';

Widget _app(Widget child, {ThemeMode themeMode = ThemeMode.light}) {
  return MaterialApp(
    theme: TinyrackTheme.light(),
    darkTheme: TinyrackTheme.dark(),
    themeMode: themeMode,
    home: Scaffold(body: child),
  );
}

TRCodeHighlightResult _highlighted(String value, {Color? color}) {
  return TRCodeHighlightResult(
    span: TextSpan(
      text: 'highlighted:$value',
      style: TextStyle(color: color),
    ),
  );
}

void main() {
  testWidgets('plain code does not consult a highlighter', (tester) async {
    var calls = 0;
    await tester.pumpWidget(
      _app(
        TRCodeBlock(
          code: 'plain text',
          highlighter: (request) async {
            calls += 1;
            return _highlighted(request.code);
          },
        ),
      ),
    );
    await tester.pump();

    expect(find.text('plain text'), findsOneWidget);
    expect(calls, 0);
  });

  testWidgets('provider highlights and a block highlighter overrides it', (
    tester,
  ) async {
    final calls = <String>[];
    Future<TRCodeHighlightResult?> provider(
      TRCodeHighlightRequest request,
    ) async {
      calls.add('provider:${request.code}');
      return _highlighted('provider');
    }

    Future<TRCodeHighlightResult?> override(
      TRCodeHighlightRequest request,
    ) async {
      calls.add('override:${request.code}');
      return _highlighted('override');
    }

    await tester.pumpWidget(
      _app(
        TRCodeHighlighterProvider(
          highlighter: provider,
          child: Column(
            children: [
              const TRCodeBlock(code: 'first', language: 'dart'),
              TRCodeBlock(
                code: 'second',
                highlighter: override,
                language: 'dart',
              ),
            ],
          ),
        ),
      ),
    );
    await tester.pumpAndSettle();

    expect(calls, ['provider:first', 'override:second']);
    expect(find.text('highlighted:provider'), findsOneWidget);
    expect(find.text('highlighted:override'), findsOneWidget);
  });

  testWidgets('reports every fallback reason and retains plain source', (
    tester,
  ) async {
    final failures = <TRCodeHighlightFailure>[];
    final error = StateError('grammar failed');

    await tester.pumpWidget(
      _app(
        Column(
          children: [
            TRCodeBlock(
              code: 'missing',
              language: 'dart',
              onHighlightFailure: failures.add,
            ),
            TRCodeBlock(
              code: 'unsupported',
              highlighter: (_) async => null,
              language: 'unknown',
              onHighlightFailure: failures.add,
            ),
            TRCodeBlock(
              code: 'failed',
              highlighter: (_) async => throw error,
              language: 'dart',
              onHighlightFailure: failures.add,
            ),
          ],
        ),
      ),
    );
    await tester.pumpAndSettle();

    expect(
      failures.map((failure) => failure.reason),
      unorderedEquals([
        TRCodeHighlightFailureReason.noHighlighter,
        TRCodeHighlightFailureReason.unsupportedLanguage,
        TRCodeHighlightFailureReason.highlightFailed,
      ]),
    );
    expect(failures.where((failure) => failure.error == error), hasLength(1));
    expect(find.text('missing'), findsOneWidget);
    expect(find.text('unsupported'), findsOneWidget);
    expect(find.text('failed'), findsOneWidget);
  });

  testWidgets('keeps the latest request when older highlighting finishes', (
    tester,
  ) async {
    final first = Completer<TRCodeHighlightResult?>();
    final second = Completer<TRCodeHighlightResult?>();

    Future<TRCodeHighlightResult?> highlighter(
      TRCodeHighlightRequest request,
    ) => request.code == 'first' ? first.future : second.future;

    await tester.pumpWidget(
      _app(
        TRCodeBlock(code: 'first', highlighter: highlighter, language: 'dart'),
      ),
    );
    await tester.pump();
    await tester.pumpWidget(
      _app(
        TRCodeBlock(code: 'second', highlighter: highlighter, language: 'dart'),
      ),
    );
    await tester.pump();

    first.complete(_highlighted('first'));
    await tester.pump();
    expect(find.text('second'), findsOneWidget);
    expect(find.text('highlighted:first'), findsNothing);

    second.complete(_highlighted('second'));
    await tester.pumpAndSettle();
    expect(find.text('highlighted:second'), findsOneWidget);
  });

  testWidgets('re-highlights when brightness changes', (tester) async {
    final requests = <Brightness>[];
    Future<TRCodeHighlightResult?> highlighter(
      TRCodeHighlightRequest request,
    ) async {
      requests.add(request.brightness);
      return _highlighted(request.brightness.name);
    }

    await tester.pumpWidget(
      _app(
        TRCodeBlock(code: 'source', highlighter: highlighter, language: 'dart'),
      ),
    );
    await tester.pumpAndSettle();
    expect(find.text('highlighted:light'), findsOneWidget);

    await tester.pumpWidget(
      _app(
        TRCodeBlock(code: 'source', highlighter: highlighter, language: 'dart'),
        themeMode: ThemeMode.dark,
      ),
    );
    await tester.pumpAndSettle();

    expect(requests, [Brightness.light, Brightness.dark]);
    expect(find.text('highlighted:dark'), findsOneWidget);
  });

  testWidgets('unwrapped code scrolls while wrapped code does not', (
    tester,
  ) async {
    await tester.pumpWidget(
      _app(
        const SizedBox(
          width: 120,
          child: TRCodeBlock(
            code: 'a deliberately long line that needs horizontal space',
          ),
        ),
      ),
    );
    expect(find.byType(SingleChildScrollView), findsOneWidget);

    await tester.pumpWidget(
      _app(
        const SizedBox(
          width: 120,
          child: TRCodeBlock(
            code: 'a deliberately long line that wraps',
            wrap: true,
          ),
        ),
      ),
    );
    expect(find.byType(SingleChildScrollView), findsNothing);
  });

  testWidgets('a selection drag pans to code past the horizontal clip', (
    tester,
  ) async {
    final copied = <String>[];
    tester.binding.defaultBinaryMessenger.setMockMethodCallHandler(
      SystemChannels.platform,
      (call) async {
        if (call.method == 'Clipboard.setData') {
          copied.add(
            ((call.arguments as Map<Object?, Object?>)['text'] as String?) ??
                '',
          );
        }
        return null;
      },
    );
    addTearDown(
      () => tester.binding.defaultBinaryMessenger.setMockMethodCallHandler(
        SystemChannels.platform,
        null,
      ),
    );

    const code = 'aaaa bbbb cccc dddd eeee ffff gggg hhhh iiii jjjj kkkk llll';
    await tester.pumpWidget(
      _app(
        const Align(
          alignment: Alignment.topLeft,
          child: SelectionArea(
            child: SizedBox(width: 200, child: TRCodeBlock(code: code)),
          ),
        ),
      ),
    );
    await tester.pumpAndSettle();

    final text = find.text(code);
    // Far wider than its viewport, so the tail is only reachable by scrolling.
    expect(tester.getSize(text).width, greaterThan(400));

    final gesture = await tester.startGesture(
      tester.getTopLeft(text) + const Offset(1, 1),
      kind: PointerDeviceKind.mouse,
    );
    await tester.pump(const Duration(milliseconds: 200));
    // Held against the trailing edge: the block has to bring the rest of the
    // line to the pointer, because nothing outside it scrolls this axis.
    await gesture.moveTo(const Offset(199, 20));
    for (var frame = 0; frame < 120; frame += 1) {
      await tester.pump(const Duration(milliseconds: 50));
    }
    await gesture.up();
    await tester.pumpAndSettle();

    await tester.sendKeyDownEvent(LogicalKeyboardKey.controlLeft);
    await tester.sendKeyEvent(LogicalKeyboardKey.keyC);
    await tester.sendKeyUpEvent(LogicalKeyboardKey.controlLeft);
    await tester.pumpAndSettle();

    // Only 'aaaa bbbb ccc' fits the viewport, so the tail of the line proves
    // the selection followed the pan rather than stopping at the clip.
    expect(copied.single, contains('llll'));
  });

  testWidgets('reduced motion brings the whole line at once', (tester) async {
    final copied = <String>[];
    tester.binding.defaultBinaryMessenger.setMockMethodCallHandler(
      SystemChannels.platform,
      (call) async {
        if (call.method == 'Clipboard.setData') {
          copied.add(
            ((call.arguments as Map<Object?, Object?>)['text'] as String?) ??
                '',
          );
        }
        return null;
      },
    );
    addTearDown(
      () => tester.binding.defaultBinaryMessenger.setMockMethodCallHandler(
        SystemChannels.platform,
        null,
      ),
    );

    const code = 'aaaa bbbb cccc dddd eeee ffff gggg hhhh iiii jjjj kkkk llll';
    await tester.pumpWidget(
      _app(
        const MediaQuery(
          data: MediaQueryData(disableAnimations: true),
          child: Align(
            alignment: Alignment.topLeft,
            child: SelectionArea(
              child: SizedBox(width: 200, child: TRCodeBlock(code: code)),
            ),
          ),
        ),
      ),
    );
    await tester.pumpAndSettle();

    final gesture = await tester.startGesture(
      tester.getTopLeft(find.text(code)) + const Offset(1, 1),
      kind: PointerDeviceKind.mouse,
    );
    await tester.pump(const Duration(milliseconds: 200));
    await gesture.moveTo(const Offset(199, 20));
    // A reader who has turned motion off still has to reach the tail, so one
    // frame covers the whole line instead of gliding to it.
    await tester.pump(const Duration(milliseconds: 50));
    await tester.pump(const Duration(milliseconds: 50));
    await gesture.up();
    await tester.pumpAndSettle();

    await tester.sendKeyDownEvent(LogicalKeyboardKey.controlLeft);
    await tester.sendKeyEvent(LogicalKeyboardKey.keyC);
    await tester.sendKeyUpEvent(LogicalKeyboardKey.controlLeft);
    await tester.pumpAndSettle();

    expect(copied.single, contains('llll'));
  });

  testWidgets('a wrapped block never auto-scrolls, having no hidden code', (
    tester,
  ) async {
    await tester.pumpWidget(
      _app(
        const Align(
          alignment: Alignment.topLeft,
          child: SelectionArea(
            child: SizedBox(
              width: 200,
              child: TRCodeBlock(
                code: 'aaaa bbbb cccc dddd eeee ffff gggg',
                wrap: true,
              ),
            ),
          ),
        ),
      ),
    );
    await tester.pumpAndSettle();

    final gesture = await tester.startGesture(
      const Offset(20, 20),
      kind: PointerDeviceKind.mouse,
    );
    await tester.pump(const Duration(milliseconds: 200));
    await gesture.moveTo(const Offset(199, 20));
    await tester.pump(const Duration(seconds: 2));
    await gesture.up();
    await tester.pumpAndSettle();

    expect(find.byType(Scrollable), findsNothing);
  });

  testWidgets('a trailing action sits in the top-trailing corner', (
    tester,
  ) async {
    await tester.pumpWidget(
      _app(
        const Align(
          alignment: Alignment.topLeft,
          child: SizedBox(
            width: 320,
            child: TRCodeBlock(
              code: 'tinyrack deploy --env prod',
              trailing: TRCopyButton(value: 'tinyrack deploy --env prod'),
            ),
          ),
        ),
      ),
    );
    await tester.pumpAndSettle();

    final block = tester.getRect(find.byType(TRCodeBlock));
    final action = tester.getRect(find.byType(TRCopyButton));
    final viewport = tester.getRect(find.byType(SingleChildScrollView));
    expect(find.byType(TRCopyButton), findsOneWidget);
    // Trailing and top, and clear of the code rather than floating over it.
    expect(action.right, lessThanOrEqualTo(block.right));
    expect(action.left, greaterThanOrEqualTo(viewport.right));
    expect(action.top, lessThan(block.center.dy));
  });

  test(
    'preview highlighter styles Dart and JSON without native plugins',
    () async {
      const dartCode = "// status\nfinal count = 42;\nconst label = 'healthy';";
      const jsonCode = '{"status": "healthy", "count": 42, "ready": true}';
      final lightDart = await previewCodeHighlighter(
        const TRCodeHighlightRequest(
          brightness: Brightness.light,
          code: dartCode,
          language: 'dart',
        ),
      );
      final darkDart = await previewCodeHighlighter(
        const TRCodeHighlightRequest(
          brightness: Brightness.dark,
          code: dartCode,
          language: 'dart',
        ),
      );
      final json = await previewCodeHighlighter(
        const TRCodeHighlightRequest(
          brightness: Brightness.light,
          code: jsonCode,
          language: 'json',
        ),
      );
      final alternate = await previewAlternateCodeHighlighter(
        const TRCodeHighlightRequest(
          brightness: Brightness.light,
          code: dartCode,
          language: 'dart',
        ),
      );
      final unsupported = await previewCodeHighlighter(
        const TRCodeHighlightRequest(
          brightness: Brightness.light,
          code: 'puts "healthy"',
          language: 'ruby',
        ),
      );

      expect(lightDart?.span.toPlainText(), dartCode);
      expect(darkDart?.span.toPlainText(), dartCode);
      expect(json?.span.toPlainText(), jsonCode);
      expect(_tokenColors(lightDart), hasLength(greaterThanOrEqualTo(4)));
      expect(_tokenColors(json), hasLength(greaterThanOrEqualTo(4)));
      expect(_tokenColors(darkDart), isNot(_tokenColors(lightDart)));
      expect(_tokenColors(alternate), isNot(_tokenColors(lightDart)));
      expect(unsupported, isNull);
    },
  );
}

Set<Color?> _tokenColors(TRCodeHighlightResult? result) =>
    result?.span.children
        ?.whereType<TextSpan>()
        .map((span) => span.style?.color)
        .where((color) => color != null)
        .toSet() ??
    const {};
