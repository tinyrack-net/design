part of 'app_shell_widget.dart';

const _appShellOrigin = 0.0;

/// Viewport boundary used by [TRAppShell].
enum TRAppShellBreakpoint { sm, lg }

/// Content posture used by [TRAppShell].
enum TRAppShellChrome { app, docs, splash, standalone }

/// Whether the header or sidebar spans the leading corner.
enum TRAppShellLayout { headerFirst, sidebarFirst }

/// Mobile navigation presentation.
enum TRAppShellMobileSidebar { drawer, rail }

/// Logical side used by the modal mobile drawer.
enum TRAppShellMobileDrawerSide { start, end }

/// Desktop sidebar presentation.
enum TRAppShellSidebarMode { expanded, rail }

/// Owner of page scrolling.
enum TRAppShellPageScroll { container, primary }

/// Navigation operation used to restore page position.
enum TRAppShellNavigationKind { pop, push, replace }

/// Owns mutable navigation state for an application shell.
class TRAppShellController extends ChangeNotifier {
  factory TRAppShellController({
    TRAppShellSidebarMode sidebarMode = TRAppShellSidebarMode.expanded,
    bool mobileOpen = false,
  }) => TRAppShellController._(sidebarMode, mobileOpen);

  TRAppShellController._(this._sidebarMode, this._mobileOpen);

  TRAppShellSidebarMode _sidebarMode;
  bool _mobileOpen;

  TRAppShellSidebarMode get sidebarMode => _sidebarMode;
  bool get mobileOpen => _mobileOpen;

  void setSidebarMode(TRAppShellSidebarMode value) {
    if (_sidebarMode == value) return;
    _sidebarMode = value;
    notifyListeners();
  }

  void toggleSidebar() => setSidebarMode(
    _sidebarMode == TRAppShellSidebarMode.expanded
        ? TRAppShellSidebarMode.rail
        : TRAppShellSidebarMode.expanded,
  );

  void setMobileOpen(bool value) {
    if (_mobileOpen == value) return;
    _mobileOpen = value;
    notifyListeners();
  }

  void openMobileNavigation() => setMobileOpen(true);
  void closeMobileNavigation() => setMobileOpen(false);
  void toggleMobileNavigation() => setMobileOpen(!_mobileOpen);
}
