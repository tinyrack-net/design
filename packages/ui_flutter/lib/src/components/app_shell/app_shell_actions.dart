part of 'app_shell_widget.dart';

/// Inline brand content for [TRAppShellHeader].
class TRAppShellBrand extends StatelessWidget {
  const TRAppShellBrand({required this.child, super.key});

  final Widget child;

  @override
  Widget build(BuildContext context) {
    _TRAppShellScope.of(context, 'Brand');
    return Row(mainAxisSize: MainAxisSize.min, children: [child]);
  }
}

/// Trailing actions for [TRAppShellHeader].
class TRAppShellActions extends StatelessWidget {
  const TRAppShellActions({required this.children, super.key});

  final List<Widget> children;

  @override
  Widget build(BuildContext context) {
    _TRAppShellScope.of(context, 'Actions');
    return Row(
      mainAxisSize: MainAxisSize.min,
      spacing: TRGeneratedSpacing.sm,
      children: children,
    );
  }
}

/// Opens the modal mobile sidebar. Hidden in desktop and mobile rail postures.
class TRAppShellTrigger extends StatelessWidget {
  const TRAppShellTrigger({
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
    final scope = _TRAppShellScope.of(context, 'Trigger');
    if (!scope.mobile || !scope.drawerActive) return const SizedBox.shrink();
    return TRIconButton(
      appearance: appearance,
      icon: icon,
      label: label,
      onPressed: () {
        onPressed?.call();
        scope.controller.openMobileNavigation();
      },
      uiSize: TRUiSize.md,
    );
  }
}

/// Closes the modal mobile sidebar.
class TRAppShellClose extends StatelessWidget {
  const TRAppShellClose({
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
    final scope = _TRAppShellScope.of(context, 'Close');
    if (!scope.isDrawerSurface) return const SizedBox.shrink();
    return TRIconButton(
      appearance: appearance,
      icon: icon,
      label: label,
      onPressed: () {
        onPressed?.call();
        scope.controller.closeMobileNavigation();
      },
      uiSize: TRUiSize.md,
    );
  }
}
