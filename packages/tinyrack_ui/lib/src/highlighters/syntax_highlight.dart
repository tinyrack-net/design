export 'package:syntax_highlight/syntax_highlight.dart' show HighlighterTheme;

import 'package:flutter/material.dart';
import 'package:syntax_highlight/syntax_highlight.dart';

import '../components/code_block_highlighter.dart';

const _defaultAliases = <String, String>{
  'js': 'javascript',
  'ts': 'typescript',
};

/// Creates a Tinyrack highlighter backed by `package:syntax_highlight`.
///
/// Only [languages] are initialized. A request for any other language resolves
/// to `null`, allowing [TRCodeBlock] to retain its plain-text fallback.
Future<TRCodeHighlighter> createTRSyntaxHighlighter({
  required Iterable<String> languages,
  Map<String, String> aliases = _defaultAliases,
  HighlighterTheme? darkTheme,
  HighlighterTheme? lightTheme,
}) async {
  final normalizedAliases = Map<String, String>.unmodifiable(aliases);
  final normalizedLanguages = languages
      .map((language) => normalizedAliases[language] ?? language)
      .toSet();

  await Highlighter.initialize(normalizedLanguages.toList());
  final resolvedThemes = await Future.wait([
    lightTheme == null
        ? HighlighterTheme.loadLightTheme()
        : Future.value(lightTheme),
    darkTheme == null
        ? HighlighterTheme.loadDarkTheme()
        : Future.value(darkTheme),
  ]);
  final themes = <Brightness, HighlighterTheme>{
    Brightness.light: resolvedThemes[0],
    Brightness.dark: resolvedThemes[1],
  };
  final highlighters = <(String, Brightness), Highlighter>{};

  return (request) async {
    final language = normalizedAliases[request.language] ?? request.language;
    if (!normalizedLanguages.contains(language)) return null;

    final (String, Brightness) key = (language, request.brightness);
    final highlighter = highlighters.putIfAbsent(
      key,
      () => Highlighter(language: language, theme: themes[request.brightness]!),
    );
    return TRCodeHighlightResult(span: highlighter.highlight(request.code));
  };
}
