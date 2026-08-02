import 'package:flutter/material.dart';

/// Input passed to a [TRCodeHighlighter].
@immutable
final class TRCodeHighlightRequest {
  const TRCodeHighlightRequest({
    required this.brightness,
    required this.code,
    required this.language,
  });

  final Brightness brightness;
  final String code;
  final String language;
}

/// Highlighted code returned by a [TRCodeHighlighter].
@immutable
final class TRCodeHighlightResult {
  const TRCodeHighlightResult({
    required this.span,
    this.backgroundColor,
    this.foregroundColor,
  });

  final Color? backgroundColor;
  final Color? foregroundColor;
  final TextSpan span;
}

/// Highlights code or returns `null` when the language is unsupported.
typedef TRCodeHighlighter =
    Future<TRCodeHighlightResult?> Function(TRCodeHighlightRequest request);

enum TRCodeHighlightFailureReason {
  highlightFailed,
  noHighlighter,
  unsupportedLanguage,
}

/// Details reported when a code block falls back to plain text.
@immutable
final class TRCodeHighlightFailure {
  const TRCodeHighlightFailure({
    required this.code,
    required this.language,
    required this.reason,
    this.error,
    this.stackTrace,
  });

  final String code;
  final Object? error;
  final String language;
  final TRCodeHighlightFailureReason reason;
  final StackTrace? stackTrace;
}
