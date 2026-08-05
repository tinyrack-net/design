part of 'app_shell_widget.dart';

/// Scrollable navigation surface for [TRAppShell].
class TRAppShellSidebar extends StatelessWidget {
  const TRAppShellSidebar({
    required this.child,
    this.padding = EdgeInsets.zero,
    this.scroll = true,
    this.semanticLabel,
    this.scrollController,
    super.key,
  });

  final Widget child;
  final EdgeInsetsGeometry padding;
  final bool scroll;
  final String? semanticLabel;
  final ScrollController? scrollController;

  @override
  Widget build(BuildContext context) {
    final scope = _TRAppShellScope.of(context, 'Sidebar');
    final border = BorderSide(color: context.tinyrackTheme.border);
    final borderDecoration = scope.isDrawerSurface
        ? BoxDecoration(
            color: context.tinyrackTheme.surface,
            border: scope.mobileDrawerSide == TRAppShellMobileDrawerSide.start
                ? BorderDirectional(end: border)
                : BorderDirectional(start: border),
          )
        : BoxDecoration(
            color: context.tinyrackTheme.surface,
            border: BorderDirectional(end: border),
          );
    final content = Padding(padding: padding, child: child);
    final borderInset = EdgeInsetsDirectional.only(
      start:
          scope.isDrawerSurface &&
              scope.mobileDrawerSide == TRAppShellMobileDrawerSide.end
          ? TRGeneratedBorders.defaultWidth
          : 0,
      end:
          !scope.isDrawerSurface ||
              scope.mobileDrawerSide == TRAppShellMobileDrawerSide.start
          ? TRGeneratedBorders.defaultWidth
          : 0,
    );
    return DecoratedBox(
      decoration: borderDecoration,
      child: Padding(
        padding: borderInset,
        child: scroll
            ? TRScrollArea(
                semanticLabel: semanticLabel,
                thumbVisibility: false,
                verticalController: scrollController,
                child: content,
              )
            : Semantics(container: true, label: semanticLabel, child: content),
      ),
    );
  }
}

/// Sidebar label that remains available to semantics in rail mode.
class TRAppShellSidebarLabel extends StatelessWidget {
  const TRAppShellSidebarLabel({required this.child, super.key});

  final Widget child;

  @override
  Widget build(BuildContext context) {
    final scope = _TRAppShellScope.of(context, 'SidebarLabel');
    if (scope.sidebarMode == TRAppShellSidebarMode.expanded ||
        scope.isDrawerSurface) {
      return child;
    }
    return SizedBox(
      height: TRGeneratedBorders.defaultWidth,
      child: Align(
        alignment: AlignmentDirectional.centerStart,
        child: SizedBox.square(
          dimension: TRGeneratedBorders.defaultWidth,
          child: ClipRect(
            child: Opacity(
              opacity: TRGeneratedLayerMetrics.visuallyHiddenOpacity,
              alwaysIncludeSemantics: true,
              child: OverflowBox(
                alignment: Alignment.centerLeft,
                maxWidth: double.infinity,
                child: child,
              ),
            ),
          ),
        ),
      ),
    );
  }
}

/// Toggles expanded and rail sidebar modes on desktop.
class TRAppShellSidebarToggle extends StatelessWidget {
  const TRAppShellSidebarToggle({
    required this.icon,
    required this.label,
    this.appearance = TRAppearance.ghost,
    this.onPressed,
    super.key,
  });

  final Widget icon;
  final String label;
  final TRAppearance appearance;
  final VoidCallback? onPressed;

  @override
  Widget build(BuildContext context) {
    final scope = _TRAppShellScope.of(context, 'SidebarToggle');
    if (scope.mobile) return const SizedBox.shrink();
    return Semantics(
      expanded: scope.sidebarMode == TRAppShellSidebarMode.expanded,
      child: TRIconButton(
        appearance: appearance,
        icon: icon,
        label: label,
        onPressed: () {
          onPressed?.call();
          scope.controller.toggleSidebar();
        },
        uiSize: TRUiSize.md,
      ),
    );
  }
}
