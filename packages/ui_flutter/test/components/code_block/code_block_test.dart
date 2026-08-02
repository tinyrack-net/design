import 'dart:async';

import 'package:flutter/material.dart';
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
