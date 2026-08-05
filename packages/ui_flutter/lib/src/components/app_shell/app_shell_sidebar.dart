part of 'app_shell_widget.dart';

/// Scrollable navigation surface for [TRAppShell].
///
/// The sidebar owns its own inline size and animates every change to it, so a
/// host must not impose a tight width on it. Set [width] to override the shell
/// width for this surface, and [collapsed] to animate it away.
class TRAppShellSidebar extends StatelessWidget {
  const TRAppShellSidebar({
    required this.child,
    this.collapsed = false,
    this.padding = EdgeInsets.zero,
    this.scroll = true,
    this.semanticLabel,
    this.scrollController,
    this.width,
    super.key,
  });

  final Widget child;

  /// Whether the sidebar is animated away and taken out of interaction.
  final bool collapsed;

  final EdgeInsetsGeometry padding;
  final bool scroll;
  final String? semanticLabel;
  final ScrollController? scrollController;

  /// Expanded inline size; defaults to the shell width for the current mode.
  final double? width;

  @override
  Widget build(BuildContext context) {
    final scope = _TRAppShellScope.of(context, 'Sidebar');
    final surface = _buildSurface(context, scope);
    // The drawer route owns the surface size and runs its own transition.
    if (scope.isDrawerSurface) return surface;

    final contentWidth =
        width ??
        (scope.sidebarMode == TRAppShellSidebarMode.expanded
            ? scope.sidebarWidth
            : scope.railWidth);
    const collapsedWidth = TRGeneratedLayerMetrics.appShellCollapsedWidth;
    return TweenAnimationBuilder<double>(
      curve: TRMotion.standard,
      duration: MediaQuery.disableAnimationsOf(context)
          ? Duration.zero
          : TRMotion.normal,
      tween: Tween<double>(end: collapsed ? collapsedWidth : contentWidth),
      builder: (context, animatedWidth, child) {
        // Once no width is left there is nothing to reveal, so the content
        // leaves the tree, the focus order, and the semantics tree with it.
        final hidden = collapsed && animatedWidth <= collapsedWidth;
        return SizedBox(
          width: animatedWidth,
          child: hidden
              ? null
              : ClipRect(
                  child: OverflowBox(
                    alignment: AlignmentDirectional.centerStart,
                    // Laying the content out at its resolved width keeps it
                    // from reflowing on every frame while the surface slides.
                    maxWidth: contentWidth,
                    minWidth: contentWidth,
                    child: child,
                  ),
                ),
        );
      },
      // Collapsing hands interaction back before the animation ends, so a
      // focused control cannot keep receiving keys on the way out.
      child: ExcludeFocus(
        excluding: collapsed,
        child: ExcludeSemantics(
          excluding: collapsed,
          child: IgnorePointer(ignoring: collapsed, child: surface),
        ),
      ),
    );
  }

  Widget _buildSurface(BuildContext context, _TRAppShellScope scope) {
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
