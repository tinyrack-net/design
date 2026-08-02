import 'package:flutter/widgets.dart';

import '../components/code_block_highlighter.dart';

/// Supplies syntax highlighting to code blocks in a subtree.
class TRCodeHighlighterProvider extends InheritedWidget {
  const TRCodeHighlighterProvider({
    required super.child,
    required this.highlighter,
    this.onHighlightFailure,
    super.key,
  });

  final TRCodeHighlighter highlighter;
  final ValueChanged<TRCodeHighlightFailure>? onHighlightFailure;

  static TRCodeHighlighterProvider? maybeOf(BuildContext context) =>
      context.dependOnInheritedWidgetOfExactType<TRCodeHighlighterProvider>();

  @override
  bool updateShouldNotify(TRCodeHighlighterProvider oldWidget) =>
      highlighter != oldWidget.highlighter ||
      onHighlightFailure != oldWidget.onHighlightFailure;
}
