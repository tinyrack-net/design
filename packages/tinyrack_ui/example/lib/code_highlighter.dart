import 'package:flutter/material.dart';
import 'package:tinyrack_ui/tinyrack_ui.dart';

final TRCodeHighlighter previewCodeHighlighter =
    _createPreviewCodeHighlighter();

final TRCodeHighlighter previewAlternateCodeHighlighter =
    _createPreviewCodeHighlighter(alternate: true);

const _dartKeywords = <String>{
  'abstract',
  'as',
  'async',
  'await',
  'break',
  'case',
  'catch',
  'class',
  'const',
  'continue',
  'default',
  'do',
  'else',
  'enum',
  'extends',
  'false',
  'final',
  'finally',
  'for',
  'if',
  'implements',
  'import',
  'in',
  'is',
  'mixin',
  'new',
  'null',
  'on',
  'rethrow',
  'return',
  'sealed',
  'static',
  'super',
  'switch',
  'this',
  'throw',
  'true',
  'try',
  'typedef',
  'var',
  'void',
  'when',
  'while',
  'with',
  'yield',
};

final _dartTokens = RegExp(
  r'''//[^\n]*|/\*[\s\S]*?\*/|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\b[A-Za-z_]\w*\b|\b\d+(?:\.\d+)?\b''',
  multiLine: true,
);

final _jsonTokens = RegExp(
  r'''"(?:\\.|[^"\\])*"|-?\b\d+(?:\.\d+)?(?:[eE][+-]?\d+)?\b|\b(?:true|false|null)\b''',
);

TRCodeHighlighter _createPreviewCodeHighlighter({bool alternate = false}) {
  return (request) async {
    final palette = _paletteFor(request.brightness, alternate: alternate);
    return switch (request.language) {
      'dart' => TRCodeHighlightResult(
        span: _highlightDart(request.code, palette),
      ),
      'json' => TRCodeHighlightResult(
        span: _highlightJson(request.code, palette),
      ),
      _ => null,
    };
  };
}

TextSpan _highlightDart(String code, _PreviewCodePalette palette) {
  return _renderMatches(code, _dartTokens, (match) {
    final token = match.group(0)!;
    final color = switch (token) {
      _ when token.startsWith('//') || token.startsWith('/*') =>
        palette.comment,
      _ when token.startsWith("'") || token.startsWith('"') => palette.string,
      _ when _dartKeywords.contains(token) => palette.keyword,
      _ when int.tryParse(token) != null || double.tryParse(token) != null =>
        palette.number,
      _ => null,
    };
    return color == null ? null : TextStyle(color: color);
  });
}

TextSpan _highlightJson(String code, _PreviewCodePalette palette) {
  return _renderMatches(code, _jsonTokens, (match) {
    final token = match.group(0)!;
    if (token.startsWith('"')) {
      final trailing = code.substring(match.end).trimLeft();
      return TextStyle(
        color: trailing.startsWith(':') ? palette.key : palette.string,
      );
    }
    return TextStyle(
      color: token == 'true' || token == 'false' || token == 'null'
          ? palette.keyword
          : palette.number,
    );
  });
}

TextSpan _renderMatches(
  String source,
  RegExp pattern,
  TextStyle? Function(RegExpMatch match) styleFor,
) {
  final children = <TextSpan>[];
  var offset = 0;
  for (final match in pattern.allMatches(source)) {
    if (match.start > offset) {
      children.add(TextSpan(text: source.substring(offset, match.start)));
    }
    children.add(TextSpan(text: match.group(0), style: styleFor(match)));
    offset = match.end;
  }
  if (offset < source.length) {
    children.add(TextSpan(text: source.substring(offset)));
  }
  return TextSpan(children: children);
}

_PreviewCodePalette _paletteFor(
  Brightness brightness, {
  required bool alternate,
}) {
  if (alternate) {
    return brightness == Brightness.dark
        ? const _PreviewCodePalette(
            comment: Color(0xFFB0A4C0),
            key: Color(0xFFFF9CEE),
            keyword: Color(0xFFD2A8FF),
            number: Color(0xFFFFB86C),
            string: Color(0xFFFFD580),
          )
        : const _PreviewCodePalette(
            comment: Color(0xFF75657F),
            key: Color(0xFF9C2C8D),
            keyword: Color(0xFF7E3AAF),
            number: Color(0xFFB24C00),
            string: Color(0xFF8A6100),
          );
  }
  return brightness == Brightness.dark
      ? const _PreviewCodePalette(
          comment: Color(0xFF959DA5),
          key: Color(0xFFB392F0),
          keyword: Color(0xFF79B8FF),
          number: Color(0xFFF97583),
          string: Color(0xFF85E89D),
        )
      : const _PreviewCodePalette(
          comment: Color(0xFF6A737D),
          key: Color(0xFF6F42C1),
          keyword: Color(0xFF005CC5),
          number: Color(0xFFB31D28),
          string: Color(0xFF22863A),
        );
}

final class _PreviewCodePalette {
  const _PreviewCodePalette({
    required this.comment,
    required this.key,
    required this.keyword,
    required this.number,
    required this.string,
  });

  final Color comment;
  final Color key;
  final Color keyword;
  final Color number;
  final Color string;
}
