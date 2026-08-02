import 'dart:math' as math;

import 'package:flutter/material.dart';

import '../generated/tokens.g.dart';
import '../theme.dart';

/// Desktop sidebar presentation used by [TRAppShell].
enum TRAppShellSidebarMode { expanded, rail, hidden }

/// Owns responsive navigation state for an application shell.
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

  void openMobileNavigation() => _setMobileOpen(true);
  void closeMobileNavigation() => _setMobileOpen(false);
  void toggleMobileNavigation() => _setMobileOpen(!_mobileOpen);

  void _setMobileOpen(bool value) {
    if (_mobileOpen == value) return;
    _mobileOpen = value;
    notifyListeners();
  }
}

// @tinyrack-preview app-shell
/// Responsive header, sidebar, rail, and mobile navigation composition.
class TRAppShell extends StatefulWidget {
  const TRAppShell({
    required this.body,
    this.breakpoint = TRGeneratedLayerMetrics.appShellBreakpoint,
    this.controller,
    this.header,
    this.mobileDrawer,
    this.onSidebarModeChange,
    this.pageStorageId = 'tinyrack-app-shell',
    this.rail,
    this.railWidth = TRGeneratedMeasurements.measureXs,
    this.sidebar,
    this.sidebarWidth = TRGeneratedMeasurements.measureLg,
    super.key,
  });

  final Widget body;
  final double breakpoint;
  final TRAppShellController? controller;
  final Widget? header;
  final Widget? mobileDrawer;
  final ValueChanged<TRAppShellSidebarMode>? onSidebarModeChange;
  final Object? pageStorageId;
  final Widget? rail;
  final double railWidth;
  final Widget? sidebar;
  final double sidebarWidth;

  @override
  State<TRAppShell> createState() => _TRAppShellState();
}

class _TRAppShellState extends State<TRAppShell> {
  TRAppShellController? _internalController;
  bool _restored = false;

  TRAppShellController get _controller =>
      widget.controller ?? (_internalController ??= TRAppShellController());

  @override
  void initState() {
    super.initState();
    _controller.addListener(_changed);
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if (_restored || widget.pageStorageId == null) return;
    _restored = true;
    final stored = PageStorage.maybeOf(
      context,
    )?.readState(context, identifier: widget.pageStorageId);
    if (stored is int &&
        stored >= 0 &&
        stored < TRAppShellSidebarMode.values.length) {
      _controller.setSidebarMode(TRAppShellSidebarMode.values[stored]);
    }
  }

  @override
  void didUpdateWidget(TRAppShell oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.controller != widget.controller) {
      (oldWidget.controller ?? _internalController)?.removeListener(_changed);
      if (widget.controller != null) {
        _internalController?.dispose();
        _internalController = null;
      }
      _controller.addListener(_changed);
    }
    if (oldWidget.pageStorageId != widget.pageStorageId) _restored = false;
  }

  @override
  void dispose() {
    _controller.removeListener(_changed);
    _internalController?.dispose();
    super.dispose();
  }

  void _changed() {
    if (widget.pageStorageId != null) {
      PageStorage.maybeOf(context)?.writeState(
        context,
        _controller.sidebarMode.index,
        identifier: widget.pageStorageId,
      );
    }
    widget.onSidebarModeChange?.call(_controller.sidebarMode);
    if (mounted) setState(() {});
  }

  @override
  Widget build(BuildContext context) => LayoutBuilder(
    builder: (context, constraints) {
      final desktop = constraints.maxWidth >= widget.breakpoint;
      return ColoredBox(
        color: context.tinyrackTheme.surface,
        child: desktop
            ? Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  ?widget.header,
                  Expanded(child: _desktop(context)),
                ],
              )
            : _mobile(context),
      );
    },
  );

  Widget _desktop(BuildContext context) {
    final colors = context.tinyrackTheme;
    final mode = _controller.sidebarMode;
    final navigation = switch (mode) {
      TRAppShellSidebarMode.expanded => widget.sidebar,
      TRAppShellSidebarMode.rail => widget.rail ?? widget.sidebar,
      TRAppShellSidebarMode.hidden => null,
    };
    final width = mode == TRAppShellSidebarMode.expanded
        ? widget.sidebarWidth
        : widget.railWidth;
    return Row(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        if (navigation != null)
          AnimatedContainer(
            duration: MediaQuery.disableAnimationsOf(context)
                ? Duration.zero
                : TRGeneratedMotion.normal,
            width: width,
            decoration: BoxDecoration(
              color: colors.surfaceMuted,
              border: BorderDirectional(end: BorderSide(color: colors.border)),
            ),
            child: navigation,
          ),
        Expanded(child: widget.body),
      ],
    );
  }

  Widget _mobile(BuildContext context) {
    final colors = context.tinyrackTheme;
    final drawer = widget.mobileDrawer ?? widget.sidebar;
    return Stack(
      fit: StackFit.expand,
      children: [
        Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            ?widget.header,
            Expanded(child: widget.body),
          ],
        ),
        if (_controller.mobileOpen && drawer != null) ...[
          GestureDetector(
            onTap: _controller.closeMobileNavigation,
            child: ColoredBox(color: colors.scrim),
          ),
          Align(
            alignment: AlignmentDirectional.centerStart,
            child: Material(
              color: colors.surface,
              elevation: 0,
              shape: RoundedRectangleBorder(
                side: BorderSide(color: colors.border),
                borderRadius: const BorderRadiusDirectional.horizontal(
                  end: Radius.circular(TRGeneratedRadii.xl),
                ),
              ),
              child: SizedBox(
                width: math.min(
                  widget.sidebarWidth,
                  MediaQuery.sizeOf(context).width,
                ),
                height: double.infinity,
                child: drawer,
              ),
            ),
          ),
        ],
      ],
    );
  }
}
