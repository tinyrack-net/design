import 'package:flutter/material.dart';

import '../../generated/tokens.g.dart';
import '../../theme.dart';

// @tinyrack-preview scroll-area
/// A themed viewport with optional horizontal and vertical scrollbars.
class TRScrollArea extends StatefulWidget {
  const TRScrollArea({
    required this.child,
    this.axis = Axis.vertical,
    this.horizontalController,
    this.padding = EdgeInsets.zero,
    this.primary,
    this.semanticLabel,
    this.thumbVisibility = true,
    this.trackVisibility = false,
    this.verticalController,
    super.key,
  });

  final Widget child;
  final Axis axis;
  final ScrollController? horizontalController;
  final EdgeInsetsGeometry padding;
  final bool? primary;
  final String? semanticLabel;
  final bool thumbVisibility;
  final bool trackVisibility;
  final ScrollController? verticalController;

  @override
  State<TRScrollArea> createState() => _TRScrollAreaState();
}

class _TRScrollAreaState extends State<TRScrollArea> {
  ScrollController? _internalHorizontalController;
  ScrollController? _internalVerticalController;

  ScrollController get _horizontalController =>
      widget.horizontalController ??
      (_internalHorizontalController ??= ScrollController());

  ScrollController get _verticalController =>
      widget.verticalController ??
      (_internalVerticalController ??= ScrollController());

  @override
  void dispose() {
    _internalHorizontalController?.dispose();
    _internalVerticalController?.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final colors = context.tinyrackTheme;
    final scrollbarTheme = ScrollbarThemeData(
      thumbColor: WidgetStateProperty.resolveWith(
        (states) => states.contains(WidgetState.dragged)
            ? colors.borderStrong
            : colors.border,
      ),
      trackColor: WidgetStatePropertyAll(colors.surfaceMuted),
      radius: const Radius.circular(TRGeneratedRadii.full),
      thickness: const WidgetStatePropertyAll(TRGeneratedSpacing.sm),
    );
    Widget viewport;
    if (widget.axis == Axis.horizontal) {
      viewport = Scrollbar(
        controller: _horizontalController,
        notificationPredicate: (notification) => notification.depth == 0,
        thumbVisibility: widget.thumbVisibility,
        trackVisibility: widget.trackVisibility,
        child: SingleChildScrollView(
          controller: _horizontalController,
          padding: widget.padding,
          scrollDirection: Axis.horizontal,
          child: widget.child,
        ),
      );
    } else {
      viewport = Scrollbar(
        controller: _verticalController,
        notificationPredicate: (notification) => notification.depth == 0,
        thumbVisibility: widget.thumbVisibility,
        trackVisibility: widget.trackVisibility,
        child: SingleChildScrollView(
          controller: _verticalController,
          padding: widget.padding,
          primary: widget.primary,
          child: widget.child,
        ),
      );
    }
    return Semantics(
      container: true,
      label: widget.semanticLabel,
      child: ScrollbarTheme(data: scrollbarTheme, child: viewport),
    );
  }
}
