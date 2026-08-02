import 'dart:math' as math;

import 'package:flutter/material.dart';

import '../generated/tokens.g.dart';
import '../theme.dart';
import '../tokens.dart';
import '../types.dart';
import '../internal/layer.dart';
import 'button.dart';
import 'scroll_area.dart';

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

// @tinyrack-preview app-shell
/// Responsive application chrome composed from typed Tinyrack shell parts.
class TRAppShell extends StatefulWidget {
  const TRAppShell({
    required this.main,
    this.anchorTargets = const {},
    this.breakpoint = TRAppShellBreakpoint.lg,
    this.chrome = TRAppShellChrome.app,
    this.controller,
    this.currentPath,
    this.defaultMobileOpen = false,
    this.defaultSidebarMode = TRAppShellSidebarMode.expanded,
    this.hash = '',
    this.header,
    this.layout = TRAppShellLayout.headerFirst,
    this.loadingLabel = 'Loading page',
    this.locationKey,
    this.mobileDrawerSide = TRAppShellMobileDrawerSide.start,
    this.mobileSidebar = TRAppShellMobileSidebar.drawer,
    this.navigationKind = TRAppShellNavigationKind.push,
    this.onMobileOpenChanged,
    this.onSidebarModeChanged,
    this.outline,
    this.pageScroll = TRAppShellPageScroll.container,
    this.pendingPath,
    this.railWidth = TRGeneratedLayerMetrics.appShellRailWidth,
    this.sidebar,
    this.sidebarWidth = TRGeneratedLayerMetrics.appShellSidebarWidth,
    this.useRootNavigator = true,
    super.key,
  });

  final Map<String, GlobalKey> anchorTargets;
  final TRAppShellBreakpoint breakpoint;
  final TRAppShellChrome chrome;
  final TRAppShellController? controller;
  final String? currentPath;
  final bool defaultMobileOpen;
  final TRAppShellSidebarMode defaultSidebarMode;
  final String hash;
  final TRAppShellHeader? header;
  final TRAppShellLayout layout;
  final String loadingLabel;
  final String? locationKey;
  final TRAppShellMain main;
  final TRAppShellMobileDrawerSide mobileDrawerSide;
  final TRAppShellMobileSidebar mobileSidebar;
  final TRAppShellNavigationKind navigationKind;
  final ValueChanged<bool>? onMobileOpenChanged;
  final ValueChanged<TRAppShellSidebarMode>? onSidebarModeChanged;
  final TRAppShellOutline? outline;
  final TRAppShellPageScroll pageScroll;
  final String? pendingPath;
  final double railWidth;
  final TRAppShellSidebar? sidebar;
  final double sidebarWidth;
  final bool useRootNavigator;

  @override
  State<TRAppShell> createState() => _TRAppShellState();
}

class _TRAppShellState extends State<TRAppShell> {
  TRAppShellController? _internalController;
  final ScrollController _mainScrollController = ScrollController();
  final Map<String, double> _scrollPositions = {};
  RawDialogRoute<void>? _drawerRoute;
  bool _drawerCloseUpdatesController = true;
  late bool _lastMobileOpen;
  late TRAppShellSidebarMode _lastSidebarMode;

  TRAppShellController get _controller =>
      widget.controller ??
      (_internalController ??= TRAppShellController(
        mobileOpen: widget.defaultMobileOpen,
        sidebarMode: widget.defaultSidebarMode,
      ));

  String get _scrollKey => widget.locationKey ?? widget.currentPath ?? '';

  bool get _isPending =>
      widget.pendingPath != null &&
      widget.currentPath != null &&
      widget.pendingPath != widget.currentPath;

  @override
  void initState() {
    super.initState();
    _lastMobileOpen = _controller.mobileOpen;
    _lastSidebarMode = _controller.sidebarMode;
    _controller.addListener(_handleControllerChanged);
    WidgetsBinding.instance.addPostFrameCallback((_) => _restoreScroll());
  }

  @override
  void didUpdateWidget(TRAppShell oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.controller != widget.controller) {
      (oldWidget.controller ?? _internalController)?.removeListener(
        _handleControllerChanged,
      );
      if (widget.controller != null) {
        _internalController?.dispose();
        _internalController = null;
      }
      _lastMobileOpen = _controller.mobileOpen;
      _lastSidebarMode = _controller.sidebarMode;
      _controller.addListener(_handleControllerChanged);
    }
    final oldScrollKey = oldWidget.locationKey ?? oldWidget.currentPath ?? '';
    if (oldScrollKey != _scrollKey ||
        oldWidget.hash != widget.hash ||
        oldWidget.navigationKind != widget.navigationKind) {
      final controller = _activeScrollController;
      if (controller?.hasClients ?? false) {
        _scrollPositions[oldScrollKey] = controller!.offset;
      }
      WidgetsBinding.instance.addPostFrameCallback((_) => _restoreScroll());
    }
  }

  @override
  void dispose() {
    _controller.removeListener(_handleControllerChanged);
    _internalController?.dispose();
    _mainScrollController.dispose();
    final route = _drawerRoute;
    if (route != null && route.isActive) route.navigator?.removeRoute(route);
    super.dispose();
  }

  ScrollController? get _activeScrollController {
    if (widget.pageScroll == TRAppShellPageScroll.primary) {
      return PrimaryScrollController.maybeOf(context);
    }
    return widget.main.scrollController ?? _mainScrollController;
  }

  void _handleControllerChanged() {
    final mobileOpen = _controller.mobileOpen;
    final sidebarMode = _controller.sidebarMode;
    if (mobileOpen != _lastMobileOpen) {
      _lastMobileOpen = mobileOpen;
      widget.onMobileOpenChanged?.call(mobileOpen);
    }
    if (sidebarMode != _lastSidebarMode) {
      _lastSidebarMode = sidebarMode;
      widget.onSidebarModeChanged?.call(sidebarMode);
    }
    if (mounted) setState(() {});
  }

  void _recordScroll(double offset) {
    _scrollPositions[_scrollKey] = offset;
  }

  void _restoreScroll() {
    if (!mounted) return;
    final hash = widget.hash.replaceFirst(RegExp(r'^#'), '');
    if (hash.isNotEmpty) {
      String decoded;
      try {
        decoded = Uri.decodeComponent(hash);
      } on FormatException {
        decoded = hash;
      }
      final target = widget.anchorTargets[decoded]?.currentContext;
      if (target != null) {
        Scrollable.ensureVisible(target, alignment: 0);
        return;
      }
    }
    final controller = _activeScrollController;
    if (controller == null || !controller.hasClients) return;
    final target = widget.navigationKind == TRAppShellNavigationKind.pop
        ? (_scrollPositions[_scrollKey] ?? 0)
        : 0.0;
    controller.jumpTo(target.clamp(0, controller.position.maxScrollExtent));
  }

  double get _breakpointWidth => switch (widget.breakpoint) {
    TRAppShellBreakpoint.sm => TRGeneratedLayerMetrics.appShellSmBreakpoint,
    TRAppShellBreakpoint.lg => TRGeneratedLayerMetrics.appShellLgBreakpoint,
  };

  @override
  Widget build(BuildContext context) {
    final viewportWidth = MediaQuery.sizeOf(context).width;
    final mobile = viewportWidth < _breakpointWidth;
    final drawerActive =
        mobile &&
        widget.mobileSidebar == TRAppShellMobileSidebar.drawer &&
        widget.sidebar != null &&
        widget.chrome != TRAppShellChrome.splash &&
        widget.chrome != TRAppShellChrome.standalone;
    _scheduleDrawerSync(drawerActive);

    final effectiveSidebarMode =
        mobile && widget.mobileSidebar == TRAppShellMobileSidebar.rail
        ? TRAppShellSidebarMode.rail
        : _controller.sidebarMode;
    final scope = _TRAppShellScope(
      controller: _controller,
      drawerActive: drawerActive,
      isDrawerSurface: false,
      isPending: _isPending,
      mainScrollController: widget.pageScroll == TRAppShellPageScroll.container
          ? (widget.main.scrollController ?? _mainScrollController)
          : null,
      mobile: mobile,
      mobileDrawerSide: widget.mobileDrawerSide,
      onMainScroll: _recordScroll,
      pageScroll: widget.pageScroll,
      sidebarMode: effectiveSidebarMode,
      shellChrome: widget.chrome,
      child: ColoredBox(
        color: context.tinyrackTheme.surface,
        child: Stack(
          fit: StackFit.expand,
          children: [
            _buildLayout(mobile: mobile, sidebarMode: effectiveSidebarMode),
            if (_isPending)
              PositionedDirectional(
                start: 0,
                end: 0,
                top: _appShellOrigin,
                child: Semantics(
                  label: widget.loadingLabel,
                  liveRegion: true,
                  child: SizedBox(
                    height: TRGeneratedSpacing.xs,
                    child: LinearProgressIndicator(
                      backgroundColor: Colors.transparent,
                      color: context.tinyrackTheme.primary,
                    ),
                  ),
                ),
              ),
          ],
        ),
      ),
    );
    return scope;
  }

  Widget _buildLayout({
    required bool mobile,
    required TRAppShellSidebarMode sidebarMode,
  }) {
    if (widget.chrome == TRAppShellChrome.standalone) return widget.main;

    final showSidebar =
        widget.sidebar != null &&
        widget.chrome != TRAppShellChrome.splash &&
        (!mobile || widget.mobileSidebar == TRAppShellMobileSidebar.rail);
    final sidebarWidth = sidebarMode == TRAppShellSidebarMode.expanded
        ? widget.sidebarWidth
        : widget.railWidth;
    final main = _mainWithOutline();
    final header = widget.header;

    if (!showSidebar) {
      return Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          ?header,
          Expanded(child: main),
        ],
      );
    }

    final sidebar = SizedBox(width: sidebarWidth, child: widget.sidebar);
    if (widget.layout == TRAppShellLayout.sidebarFirst) {
      return Row(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          sidebar,
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                ?header,
                Expanded(child: main),
              ],
            ),
          ),
        ],
      );
    }
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        ?header,
        Expanded(
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              sidebar,
              Expanded(child: main),
            ],
          ),
        ),
      ],
    );
  }

  Widget _mainWithOutline() {
    final outline = widget.outline;
    if (outline == null || widget.chrome != TRAppShellChrome.docs) {
      return widget.main;
    }
    if (MediaQuery.sizeOf(context).width >= TRGeneratedBreakpoints.xl) {
      return Row(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Expanded(child: widget.main),
          outline,
        ],
      );
    }
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        Align(alignment: Alignment.topLeft, child: outline),
        Expanded(child: widget.main),
      ],
    );
  }

  void _scheduleDrawerSync(bool drawerActive) {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (mounted) _syncDrawer(drawerActive);
    });
  }

  void _syncDrawer(bool drawerActive) {
    final shouldOpen = drawerActive && _controller.mobileOpen;
    if (shouldOpen && _drawerRoute == null) {
      _openDrawerRoute();
      return;
    }
    if (!shouldOpen && _drawerRoute != null) {
      _closeDrawerRoute(updateController: drawerActive);
    }
  }

  void _openDrawerRoute() {
    final sidebar = widget.sidebar;
    if (sidebar == null || _drawerRoute != null) return;
    final navigator = Navigator.of(
      context,
      rootNavigator: widget.useRootNavigator,
    );
    final themes = InheritedTheme.capture(from: context, to: navigator.context);
    final direction = Directionality.of(context);
    final disableAnimations = MediaQuery.disableAnimationsOf(context);
    final colors = context.tinyrackTheme;
    late final RawDialogRoute<void> route;
    route = RawDialogRoute<void>(
      barrierColor: colors.scrim,
      barrierDismissible: true,
      barrierLabel: MaterialLocalizations.of(context).modalBarrierDismissLabel,
      pageBuilder: (routeContext, animation, secondaryAnimation) {
        final page = Directionality(
          textDirection: direction,
          child: _TRAppShellScope(
            controller: _controller,
            drawerActive: true,
            isDrawerSurface: true,
            isPending: _isPending,
            mainScrollController: null,
            mobile: true,
            mobileDrawerSide: widget.mobileDrawerSide,
            onMainScroll: _recordScroll,
            pageScroll: widget.pageScroll,
            sidebarMode: TRAppShellSidebarMode.expanded,
            shellChrome: widget.chrome,
            child: Align(
              alignment:
                  widget.mobileDrawerSide == TRAppShellMobileDrawerSide.start
                  ? AlignmentDirectional.centerStart
                  : AlignmentDirectional.centerEnd,
              child: Material(
                color: colors.surface,
                elevation: 0,
                child: TRLayerPartBoundary(
                  name: 'drawerSurface',
                  child: SizedBox(
                    width: math.min(
                      widget.sidebarWidth,
                      MediaQuery.sizeOf(routeContext).width,
                    ),
                    height: MediaQuery.sizeOf(routeContext).height,
                    child: sidebar,
                  ),
                ),
              ),
            ),
          ),
        );
        return themes.wrap(page);
      },
      transitionBuilder: (context, animation, secondaryAnimation, child) {
        if (disableAnimations) return child;
        final logicalStart =
            widget.mobileDrawerSide == TRAppShellMobileDrawerSide.start;
        final fromLeft = direction == TextDirection.ltr
            ? logicalStart
            : !logicalStart;
        final curved = CurvedAnimation(
          parent: animation,
          curve: TRMotion.easeOut,
          reverseCurve: TRMotion.standard,
        );
        return SlideTransition(
          position: Tween<Offset>(
            begin: Offset(fromLeft ? -1 : 1, 0),
            end: Offset.zero,
          ).animate(curved),
          child: child,
        );
      },
      transitionDuration: disableAnimations ? Duration.zero : TRMotion.slow,
      traversalEdgeBehavior: TraversalEdgeBehavior.closedLoop,
    );
    _drawerRoute = route;
    _drawerCloseUpdatesController = true;
    navigator.push<void>(route).whenComplete(() {
      if (!mounted || !identical(_drawerRoute, route)) return;
      _drawerRoute = null;
      if (_drawerCloseUpdatesController && _controller.mobileOpen) {
        _controller.closeMobileNavigation();
      }
      _drawerCloseUpdatesController = true;
    });
  }

  void _closeDrawerRoute({required bool updateController}) {
    final route = _drawerRoute;
    if (route == null) return;
    _drawerCloseUpdatesController = updateController;
    if (route.isCurrent) {
      route.navigator?.pop();
    } else if (route.isActive) {
      route.navigator?.removeRoute(route);
    }
  }
}

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
      uiSize: TRUiSize.sm,
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
      uiSize: TRUiSize.sm,
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
        uiSize: TRUiSize.sm,
      ),
    );
  }
}
