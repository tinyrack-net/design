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
      child: content,
    );
  }
}
