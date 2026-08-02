part of 'app_shell_widget.dart';

/// Main content surface for [TRAppShell].
class TRAppShellMain extends StatelessWidget {
  const TRAppShellMain({
    required this.child,
    this.padding = EdgeInsets.zero,
    this.scroll = false,
    this.scrollController,
    this.viewportLabel = 'Page content',
    super.key,
  });

  final Widget child;
  final EdgeInsetsGeometry padding;
  final bool scroll;
  final ScrollController? scrollController;
  final String viewportLabel;

  @override
  Widget build(BuildContext context) {
    final scope = _TRAppShellScope.of(context, 'Main');
    Widget content = Semantics(
      container: true,
      label: scroll && scope.pageScroll == TRAppShellPageScroll.container
          ? viewportLabel
          : null,
      child: Padding(padding: padding, child: child),
    );
    if (scroll) {
      if (scope.pageScroll == TRAppShellPageScroll.container) {
        content = NotificationListener<ScrollNotification>(
          onNotification: (notification) {
            if (notification.depth == 0) {
              scope.onMainScroll(notification.metrics.pixels);
            }
            return false;
          },
          child: TRScrollArea(
            semanticLabel: viewportLabel,
            thumbVisibility: false,
            verticalController: scrollController ?? scope.mainScrollController,
            child: Padding(padding: padding, child: child),
          ),
        );
      } else {
        content = SingleChildScrollView(
          primary: true,
          padding: padding,
          child: child,
        );
      }
    }
    return Semantics(
      container: true,
      label: 'Main',
      liveRegion: scope.isPending,
      child: content,
    );
  }
}

/// Optional docs outline shown with [TRAppShellMain].
class TRAppShellOutline extends StatelessWidget {
  const TRAppShellOutline({
    required this.child,
    this.padding = const EdgeInsets.all(TRGeneratedSpacing.xl),
    this.semanticLabel,
    this.width = TRGeneratedMeasurements.measureLg,
    super.key,
  });

  final Widget child;
  final EdgeInsetsGeometry padding;
  final String? semanticLabel;
  final double width;

  @override
  Widget build(BuildContext context) {
    _TRAppShellScope.of(context, 'Outline');
    return Semantics(
      container: true,
      label: semanticLabel,
      child: SizedBox(
        width: width,
        child: Padding(padding: padding, child: child),
      ),
    );
  }
}
