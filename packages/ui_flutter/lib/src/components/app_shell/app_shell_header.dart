part of 'app_shell_widget.dart';

/// Top chrome for [TRAppShell].
class TRAppShellHeader extends StatelessWidget {
  const TRAppShellHeader({
    this.borderBottom = false,
    this.children = const [],
    this.height,
    this.padding,
    super.key,
  });

  final bool borderBottom;
  final List<Widget> children;
  final double? height;
  final EdgeInsetsGeometry? padding;

  @override
  Widget build(BuildContext context) {
    final scope = _TRAppShellScope.of(context, 'Header');
    final docsChrome = scope.shellChrome != TRAppShellChrome.app;
    final resolvedChildren = <Widget>[];
    for (final child in children) {
      if (child is TRAppShellActions && resolvedChildren.isNotEmpty) {
        resolvedChildren.add(const Spacer());
      }
      resolvedChildren.add(child);
    }
    final content = Padding(
      padding:
          padding ??
          (docsChrome
              ? const EdgeInsets.symmetric(horizontal: TRGeneratedSpacing.lg)
              : EdgeInsets.zero),
      child: Row(spacing: TRGeneratedSpacing.sm, children: resolvedChildren),
    );
    // Application chrome rests at the height [TRPaneHeader] stands at, so a
    // bar and a pane header below it agree on where their rules sit. Sized by
    // its contents alone the bar was a line of text tall with no actions and a
    // control tall with them, and a comfortable control is exactly the standard
    // resting height, so an action filled the bar edge to edge and its tap
    // target met the content beneath it.
    //
    // A resting height rather than a fixed one: the constraint sits on the
    // content so a title that wraps at an enlarged text scale grows the bar
    // instead of being clipped, and so [borderBottom] stays outside the height
    // the bar rests at. Docs chrome keeps the fixed height its own layout
    // measures against, and an explicit [height] still wins outright.
    final restingHeight = docsChrome || height != null
        ? null
        : TRUiDensityScope.of(context) == TRUiDensity.comfortable
        ? TRMeasurements.headerHeight + TRSpacing.large
        : TRMeasurements.headerHeight;
    return Container(
      height:
          height ??
          (docsChrome ? TRGeneratedLayerMetrics.appShellHeaderHeight : null),
      decoration: docsChrome || borderBottom
          ? BoxDecoration(
              color: context.tinyrackTheme.surface,
              border: Border(
                bottom: BorderSide(color: context.tinyrackTheme.border),
              ),
            )
          : null,
      child: restingHeight == null
          ? content
          : ConstrainedBox(
              constraints: BoxConstraints(minHeight: restingHeight),
              child: content,
            ),
    );
  }
}
