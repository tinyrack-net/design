import 'package:flutter/material.dart';

import '../../generated/tokens.g.dart';
import '../../theme.dart';

// @tinyrack-preview scroll-area
/// A themed viewport with optional horizontal and vertical scrollbars.
class TRScrollArea extends StatefulWidget {
  const TRScrollArea({
    required this.child,
    this.axis = Axis.vertical,
    this.autoHide = false,
    this.horizontalController,
    this.padding = EdgeInsets.zero,
    this.primary,
    this.semanticLabel,
    this.thumbVisibility = true,
    this.trackVisibility = false,
    this.verticalController,
    super.key,
  }) : hostsScrollable = false;

  /// A themed scrollbar over a scrollable the caller already owns.
  ///
  /// The default constructor supplies its own viewport, which is wrong for a
  /// lazy or reversed list: nesting one would unbound the list's height and
  /// defeat its lazy building. Use this when [child] is itself the scrollable.
  const TRScrollArea.forScrollable({
    required this.child,
    this.axis = Axis.vertical,
    this.autoHide = false,
    this.semanticLabel,
    // Without a controller the scrollbar attaches through scroll
    // notifications, which cannot satisfy an always-visible thumb. Leaving
    // this null lets it appear on scroll instead.
    this.thumbVisibility,
    this.trackVisibility = false,
    ScrollController? controller,
    super.key,
  }) : hostsScrollable = true,
       horizontalController = controller,
       verticalController = controller,
       padding = EdgeInsets.zero,
       primary = null;

  final Widget child;

  /// Whether [child] is the scrollable, rather than its content.
  final bool hostsScrollable;
  final Axis axis;
  final bool autoHide;
  final ScrollController? horizontalController;
  final EdgeInsetsGeometry padding;
  final bool? primary;
  final String? semanticLabel;
  final bool? thumbVisibility;
  final bool trackVisibility;
  final ScrollController? verticalController;

  @override
  State<TRScrollArea> createState() => _TRScrollAreaState();
}

class _TRScrollAreaState extends State<TRScrollArea> {
  ScrollController? _internalHorizontalController;
  ScrollController? _internalVerticalController;
  bool _hovered = false;

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
    if (widget.hostsScrollable) {
      // The child owns the scroll position. Only pass a controller the caller
      // supplied; an internal one would never be attached to anything.
      viewport = _scrollbar(
        controller: widget.verticalController,
        notificationPredicate: (notification) => notification.depth == 0,
        thumbVisibility: widget.thumbVisibility,
        trackVisibility: widget.trackVisibility,
        child: widget.child,
      );
    } else if (widget.axis == Axis.horizontal) {
      viewport = _scrollbar(
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
      viewport = _scrollbar(
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
    return MouseRegion(
      onEnter: (_) => setState(() => _hovered = true),
      onExit: (_) => setState(() => _hovered = false),
      child: Semantics(
        container: true,
        label: widget.semanticLabel,
        child: ScrollbarTheme(data: scrollbarTheme, child: viewport),
      ),
    );
  }

  Widget _scrollbar({
    required ScrollController? controller,
    required Widget child,
    required ScrollNotificationPredicate notificationPredicate,
    required bool? thumbVisibility,
    required bool trackVisibility,
  }) {
    if (!widget.autoHide) {
      return Scrollbar(
        controller: controller,
        notificationPredicate: notificationPredicate,
        thumbVisibility: thumbVisibility,
        trackVisibility: trackVisibility,
        child: child,
      );
    }
    final colors = context.tinyrackTheme;
    return RawScrollbar(
      controller: controller,
      notificationPredicate: notificationPredicate,
      thumbVisibility: _hovered,
      trackVisibility: _hovered,
      fadeDuration: MediaQuery.disableAnimationsOf(context)
          ? Duration.zero
          : TRGeneratedMotion.fast,
      timeToFade: Duration.zero,
      thickness: TRGeneratedSpacing.xs,
      radius: const Radius.circular(TRGeneratedRadii.full),
      thumbColor: colors.border,
      trackColor: colors.surfaceMuted,
      child: child,
    );
  }
}
