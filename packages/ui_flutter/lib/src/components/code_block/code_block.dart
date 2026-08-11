import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter/scheduler.dart';

import '../../generated/tokens.g.dart';
import '../../providers/code_highlighter.dart';
import '../../theme.dart';
import '../code_block_highlighter/code_block_highlighter.dart';

// @tinyrack-preview code-block
/// A multi-line, scrollable monospace code surface.
class TRCodeBlock extends StatefulWidget {
  const TRCodeBlock({
    required this.code,
    this.highlighter,
    this.language,
    this.onHighlightFailure,
    this.trailing,
    this.wrap = false,
    super.key,
  });

  final String code;
  final TRCodeHighlighter? highlighter;
  final String? language;
  final ValueChanged<TRCodeHighlightFailure>? onHighlightFailure;

  /// Action pinned to the block's top-trailing corner, clear of the code.
  final Widget? trailing;

  final bool wrap;

  @override
  State<TRCodeBlock> createState() => _TRCodeBlockState();
}

final class _TRCodeBlockState extends State<TRCodeBlock>
    with SingleTickerProviderStateMixin {
  _TRCodeBlockRequest? _activeRequest;
  ValueChanged<TRCodeHighlightFailure>? _failureHandler;
  TRCodeHighlightResult? _result;
  int _requestGeneration = 0;
  final ScrollController _scrollController = ScrollController();
  final GlobalKey _viewportKey = GlobalKey();
  Ticker? _panTicker;
  Offset? _panPointer;
  Duration _panElapsed = Duration.zero;

  @override
  void dispose() {
    _panTicker?.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  /// Pans an unwrapped block while a held pointer sits past its code.
  ///
  /// A block wider than its viewport hides the tail of every long line, and
  /// selecting text is the gesture that has to get there. The pointer cannot
  /// travel past the clip and no ancestor scrolls this axis, so without this a
  /// drag can only ever select what happened to be visible when it started. The
  /// block's own padding is the gutter: reaching it brings the rest over.
  void _dragTowards(Offset globalPosition) {
    if (widget.wrap) return;
    _panPointer = globalPosition;
    final ticker = _panTicker ??= createTicker(_pan);
    if (!ticker.isActive) {
      _panElapsed = Duration.zero;
      ticker.start();
    }
  }

  void _stopDragging() {
    _panTicker?.stop();
    _panPointer = null;
  }

  /// Advances the pan by one frame, or all the way when motion is off.
  ///
  /// The speed is one viewport per slow beat, so a long line arrives at about
  /// the rate it can be read rather than snapping past the selection.
  void _pan(Duration elapsed) {
    final frame = _panElapsed == Duration.zero
        ? Duration.zero
        : elapsed - _panElapsed;
    _panElapsed = elapsed;
    final pointer = _panPointer;
    final viewport = _viewportKey.currentContext?.findRenderObject();
    if (pointer == null || viewport is! RenderBox || !viewport.hasSize) {
      _stopDragging();
      return;
    }
    if (!_scrollController.hasClients) {
      _stopDragging();
      return;
    }
    final position = _scrollController.position;
    final origin = viewport.localToGlobal(Offset.zero).dx;
    final overshoot = switch (pointer.dx) {
      final x when x > origin + viewport.size.width =>
        x - origin - viewport.size.width,
      final x when x < origin => x - origin,
      _ => 0.0,
    };
    if (overshoot == 0) {
      _stopDragging();
      return;
    }
    final reduced = MediaQuery.disableAnimationsOf(context);
    final step = reduced
        ? position.maxScrollExtent
        : viewport.size.width *
              frame.inMicroseconds /
              TRGeneratedMotion.slow.inMicroseconds;
    final target = (position.pixels + (overshoot.isNegative ? -step : step))
        .clamp(position.minScrollExtent, position.maxScrollExtent);
    if (target == position.pixels) {
      _stopDragging();
      return;
    }
    position.jumpTo(target);
  }

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

    final code = widget.wrap
        ? content
        : Listener(
            // A move event carries a button, so this is a drag rather than a
            // hover; a selection is the only thing a drag here can mean.
            onPointerMove: (event) => _dragTowards(event.position),
            onPointerUp: (_) => _stopDragging(),
            onPointerCancel: (_) => _stopDragging(),
            child: MouseRegion(
              // Leaving the block ends the pull; whatever the pointer is doing
              // now, it is not asking for more of this line.
              onExit: (_) => _stopDragging(),
              child: SingleChildScrollView(
                key: _viewportKey,
                controller: _scrollController,
                scrollDirection: Axis.horizontal,
                child: content,
              ),
            ),
          );
    final trailing = widget.trailing;

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
        child: trailing == null
            ? code
            : Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Expanded(child: code),
                  const SizedBox(width: TRGeneratedSpacing.sm),
                  trailing,
                ],
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
