import 'dart:async';

import 'package:flutter/material.dart';

import '../generated/tokens.g.dart';
import '../providers/code_highlighter.dart';
import '../theme.dart';
import 'code_block_highlighter.dart';

// @tinyrack-preview code-block
/// A multi-line, scrollable monospace code surface.
class TRCodeBlock extends StatefulWidget {
  const TRCodeBlock({
    required this.code,
    this.highlighter,
    this.language,
    this.onHighlightFailure,
    this.wrap = false,
    super.key,
  });

  final String code;
  final TRCodeHighlighter? highlighter;
  final String? language;
  final ValueChanged<TRCodeHighlightFailure>? onHighlightFailure;
  final bool wrap;

  @override
  State<TRCodeBlock> createState() => _TRCodeBlockState();
}

final class _TRCodeBlockState extends State<TRCodeBlock> {
  _TRCodeBlockRequest? _activeRequest;
  ValueChanged<TRCodeHighlightFailure>? _failureHandler;
  TRCodeHighlightResult? _result;
  int _requestGeneration = 0;

  void _synchronizeHighlight(
    TRCodeHighlighterProvider? provider,
    Brightness brightness,
  ) {
    _failureHandler = widget.onHighlightFailure ?? provider?.onHighlightFailure;
    final request = _TRCodeBlockRequest(
      brightness: brightness,
      code: widget.code,
      highlighter: widget.highlighter ?? provider?.highlighter,
      language: widget.language,
    );
    if (request.matches(_activeRequest)) return;

    _activeRequest = request;
    _result = null;
    _requestGeneration += 1;
    if (request.language == null) return;
    final generation = _requestGeneration;
    scheduleMicrotask(() => _runHighlight(request, generation));
  }

  Future<void> _runHighlight(
    _TRCodeBlockRequest request,
    int generation,
  ) async {
    if (!mounted || generation != _requestGeneration) return;
    final language = request.language;
    if (language == null) return;

    final highlighter = request.highlighter;
    if (highlighter == null) {
      _reportFailure(
        request,
        const _TRCodeBlockFailure(TRCodeHighlightFailureReason.noHighlighter),
        generation,
      );
      return;
    }

    try {
      final result = await highlighter(
        TRCodeHighlightRequest(
          brightness: request.brightness,
          code: request.code,
          language: language,
        ),
      );
      if (!mounted || generation != _requestGeneration) return;
      if (result == null) {
        _reportFailure(
          request,
          const _TRCodeBlockFailure(
            TRCodeHighlightFailureReason.unsupportedLanguage,
          ),
          generation,
        );
        return;
      }
      setState(() => _result = result);
    } catch (error, stackTrace) {
      _reportFailure(
        request,
        _TRCodeBlockFailure(
          TRCodeHighlightFailureReason.highlightFailed,
          error: error,
          stackTrace: stackTrace,
        ),
        generation,
      );
    }
  }

  void _reportFailure(
    _TRCodeBlockRequest request,
    _TRCodeBlockFailure details,
    int generation,
  ) {
    if (!mounted || generation != _requestGeneration) return;
    final failure = TRCodeHighlightFailure(
      code: request.code,
      error: details.error,
      language: request.language!,
      reason: details.reason,
      stackTrace: details.stackTrace,
    );
    final handler = _failureHandler;
    if (handler != null) {
      handler(failure);
      return;
    }
    if (details.reason == TRCodeHighlightFailureReason.highlightFailed) {
      FlutterError.reportError(
        FlutterErrorDetails(
          exception: details.error!,
          stack: details.stackTrace,
          library: 'tinyrack_ui',
          context: ErrorDescription(
            'while highlighting ${request.language} code in TRCodeBlock',
          ),
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final colors = context.tinyrackTheme;
    final brightness = Theme.of(context).brightness;
    final provider = TRCodeHighlighterProvider.maybeOf(context);
    _synchronizeHighlight(provider, brightness);
    final generated = brightness == Brightness.light
        ? TRGeneratedColors.light
        : TRGeneratedColors.dark;
    final result = _result;
    final content = Text.rich(
      result?.span ?? TextSpan(text: widget.code),
      style: TRGeneratedTextStyles.code.copyWith(
        color: result?.foregroundColor ?? colors.text,
      ),
    );

    return DecoratedBox(
      decoration: BoxDecoration(
        color: result?.backgroundColor ?? colors.surfaceMuted,
        border: Border.all(
          color: generated.border,
          width: TRGeneratedBorders.defaultWidth,
        ),
        borderRadius: BorderRadius.circular(TRGeneratedRadii.lg),
      ),
      child: Padding(
        // CSS border-box sizing adds the border outside the padding; the
        // decoration border here paints inside, so widen the inset by it.
        padding: const EdgeInsets.symmetric(
          horizontal: TRGeneratedSpacing.lg + TRGeneratedBorders.defaultWidth,
          vertical: TRGeneratedSpacing.md + TRGeneratedBorders.defaultWidth,
        ),
        child: widget.wrap
            ? content
            : SingleChildScrollView(
                scrollDirection: Axis.horizontal,
                child: content,
              ),
      ),
    );
  }
}

final class _TRCodeBlockRequest {
  const _TRCodeBlockRequest({
    required this.brightness,
    required this.code,
    required this.highlighter,
    required this.language,
  });

  final Brightness brightness;
  final String code;
  final TRCodeHighlighter? highlighter;
  final String? language;

  bool matches(_TRCodeBlockRequest? other) =>
      other != null &&
      brightness == other.brightness &&
      code == other.code &&
      identical(highlighter, other.highlighter) &&
      language == other.language;
}

final class _TRCodeBlockFailure {
  const _TRCodeBlockFailure(this.reason, {this.error, this.stackTrace});

  final Object? error;
  final TRCodeHighlightFailureReason reason;
  final StackTrace? stackTrace;
}
