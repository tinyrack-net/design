part of 'app_shell_widget.dart';

class _TRAppShellScope extends InheritedWidget {
  const _TRAppShellScope({
    required this.controller,
    required this.drawerActive,
    required this.isDrawerSurface,
    required this.isPending,
    required this.mainScrollController,
    required this.mobile,
    required this.mobileDrawerSide,
    required this.onMainScroll,
    required this.pageScroll,
    required this.sidebarMode,
    required this.shellChrome,
    required super.child,
  });

  final TRAppShellController controller;
  final bool drawerActive;
  final bool isDrawerSurface;
  final bool isPending;
  final ScrollController? mainScrollController;
  final bool mobile;
  final TRAppShellMobileDrawerSide mobileDrawerSide;
  final ValueChanged<double> onMainScroll;
  final TRAppShellPageScroll pageScroll;
  final TRAppShellSidebarMode sidebarMode;
  final TRAppShellChrome shellChrome;

  static _TRAppShellScope of(BuildContext context, String part) {
    final scope = context
        .dependOnInheritedWidgetOfExactType<_TRAppShellScope>();
    if (scope == null) {
      throw FlutterError('TRAppShell$part must be used inside TRAppShell.');
    }
    return scope;
  }

  @override
  bool updateShouldNotify(_TRAppShellScope oldWidget) =>
      controller != oldWidget.controller ||
      drawerActive != oldWidget.drawerActive ||
      isDrawerSurface != oldWidget.isDrawerSurface ||
      isPending != oldWidget.isPending ||
      mainScrollController != oldWidget.mainScrollController ||
      mobile != oldWidget.mobile ||
      mobileDrawerSide != oldWidget.mobileDrawerSide ||
      pageScroll != oldWidget.pageScroll ||
      sidebarMode != oldWidget.sidebarMode ||
      shellChrome != oldWidget.shellChrome;
}
