import 'dart:async';
import 'dart:math' as math;

import 'package:material_ui/material_ui.dart';
import 'package:flutter/semantics.dart';

import '../../generated/tokens.g.dart';
import '../../internal/drawer_scroll_region.dart';
import '../../internal/layer.dart';
import '../../theme.dart';
import '../../tokens.dart';

/// Logical edge from which a drawer enters.
enum TRDrawerPlacement { top, bottom, start, end }

/// Region that owns drag-to-snap and drag-to-dismiss gestures.
enum TRDrawerDragBehavior {
  /// The complete drawer surface participates in drawer dragging.
  ///
  /// A registered content scroll region coordinates its offset with the
  /// drawer extent.
  surface,

  /// Only the visible handle participates in drawer dragging.
  ///
  /// Use this when content contains a dedicated scroll viewport whose gestures
  /// must never resize the drawer. Side drawers have no handle and continue to
  /// use their complete surface.
  handleOnly,
}

/// Controls a [TRDrawerScaffold].
class TRDrawerController extends ChangeNotifier {
  TRDrawerController({bool open = false}) : _isOpen = open;

  bool _isOpen;

  bool get isOpen => _isOpen;

  void open() => _setOpen(true);
  void close() => _setOpen(false);
  void toggle() => _setOpen(!_isOpen);

  void _setOpen(bool value) {
    if (_isOpen == value) return;
    _isOpen = value;
    notifyListeners();
  }
}

// @tinyrack-preview drawer
/// A swipeable sheet surface for use in a route or [TRDrawerScaffold].
class TRDrawer extends StatefulWidget {
  const TRDrawer({
    required this.content,
    this.actions,
    this.description,
    this.dragBehavior = TRDrawerDragBehavior.surface,
    this.initialSnapIndex = 0,
    this.maxExtent = 1,
    this.modal = true,
    this.onDismiss,
    this.onSnapChanged,
    this.placement = TRDrawerPlacement.bottom,
    this.semanticLabel,
    this.showDragHandle = true,
    this.snapPoints,
    this.scrollContent = true,
    this.title,
    super.key,
  }) : assert(maxExtent > 0 && maxExtent <= 1),
       assert(snapPoints == null || snapPoints.length > 0),
       assert(
         initialSnapIndex >= 0 &&
             (snapPoints == null
                 ? initialSnapIndex == 0
                 : initialSnapIndex < snapPoints.length),
       );

  final Widget content;
  final Widget? actions;
  final Widget? description;
  final TRDrawerDragBehavior dragBehavior;
  final int initialSnapIndex;

  /// Largest fraction of the viewport the drawer may occupy on its opening axis.
  ///
  /// Content-sized top and bottom drawers grow only until this extent, then
  /// scroll their content. Snap points must not exceed it. The default permits
  /// the full viewport.
  final double maxExtent;

  final bool modal;
  final VoidCallback? onDismiss;
  final ValueChanged<int>? onSnapChanged;
  final TRDrawerPlacement placement;
  final String? semanticLabel;

  /// Whether top and bottom sheets display their drag-to-dismiss handle.
  ///
  /// Side drawers never display a handle. Hiding the handle also disables sheet
  /// dragging while preserving content scrolling, so the affordance and
  /// behavior agree.
  final bool showDragHandle;

  /// Whether the drawer owns scrolling for its complete [content] region.
  ///
  /// Set this to false when [content] contains a fixed header and owns a
  /// nested scrolling region itself.
  final bool scrollContent;

  /// Fractions of the viewport at which the drawer snaps.
  ///
  /// A top or bottom drawer fits its content when this is omitted. Start and
  /// end drawers retain their standard width. Supplying snap points opts into
  /// viewport-relative sizing and drag-to-snap behavior. A drag expands the
  /// drawer before scrolling overflow content, and reverses that order when
  /// collapsing.
  final List<double>? snapPoints;
  final Widget? title;

  @override
  State<TRDrawer> createState() => _TRDrawerState();
}

class _TRDrawerState extends State<TRDrawer>
    with SingleTickerProviderStateMixin {
  late final AnimationController _extentController;
  late final ScrollController _contentScrollController = ScrollController();

  List<double> get _resolvedSnapPoints {
    assert(
      widget.snapPoints == null ||
          widget.snapPoints!.every(
            (point) => point > 0 && point <= widget.maxExtent,
          ),
      'Every snap point must be greater than zero and no larger than maxExtent.',
    );
    return (widget.snapPoints ??
            <double>[math.min(0.5, widget.maxExtent), widget.maxExtent])
        .map(
          (point) => point
              .clamp(math.min(0.1, widget.maxExtent), widget.maxExtent)
              .toDouble(),
        )
        .toList(growable: false);
  }

  bool get _horizontal =>
      widget.placement == TRDrawerPlacement.top ||
      widget.placement == TRDrawerPlacement.bottom;

  bool get _fitsContent => _horizontal && widget.snapPoints == null;

  bool get _draggable => !_horizontal || widget.showDragHandle;

  @override
  void initState() {
    super.initState();
    _extentController = AnimationController.unbounded(
      value: _resolvedSnapPoints[widget.initialSnapIndex],
      vsync: this,
    )..addListener(_extentChanged);
  }

  @override
  void dispose() {
    _contentScrollController.dispose();
    _extentController.dispose();
    super.dispose();
  }

  void _extentChanged() => setState(() {});

  void _drag(DragUpdateDetails details) => _dragBy(details.delta.dy);

  void _dragHorizontal(DragUpdateDetails details) => _dragBy(details.delta.dx);

  double _dragBy(double primaryDelta) {
    final media = MediaQuery.sizeOf(context);
    final direction = Directionality.of(context);
    final delta = switch (widget.placement) {
      TRDrawerPlacement.bottom => -primaryDelta,
      TRDrawerPlacement.top => primaryDelta,
      TRDrawerPlacement.start =>
        direction == TextDirection.ltr ? primaryDelta : -primaryDelta,
      TRDrawerPlacement.end =>
        direction == TextDirection.ltr ? -primaryDelta : primaryDelta,
    };
    final available = _horizontal ? media.height : media.width;
    final previous = _extentController.value;
    final maximum = _fitsContent
        ? _resolvedSnapPoints[widget.initialSnapIndex]
        : widget.maxExtent;
    _extentController
      ..stop()
      ..value = (previous + delta / available).clamp(
        math.min(0.05, widget.maxExtent),
        maximum,
      );
    final consumedLogical = (_extentController.value - previous) * available;
    final consumedPhysical = switch (widget.placement) {
      TRDrawerPlacement.bottom => -consumedLogical,
      TRDrawerPlacement.top => consumedLogical,
      TRDrawerPlacement.start =>
        direction == TextDirection.ltr ? consumedLogical : -consumedLogical,
      TRDrawerPlacement.end =>
        direction == TextDirection.ltr ? -consumedLogical : consumedLogical,
    };
    return primaryDelta - consumedPhysical;
  }

  bool _dragBeforeScroll(double primaryDelta) {
    if (_fitsContent) return false;
    final expanding = switch (widget.placement) {
      TRDrawerPlacement.bottom => primaryDelta < 0,
      TRDrawerPlacement.top => primaryDelta > 0,
      _ => false,
    };
    return expanding && _extentController.value < widget.maxExtent;
  }

  void _endDrag(DragEndDetails details) {
    final direction = Directionality.of(context);
    final velocity = switch (widget.placement) {
      TRDrawerPlacement.bottom => -details.velocity.pixelsPerSecond.dy,
      TRDrawerPlacement.top => details.velocity.pixelsPerSecond.dy,
      TRDrawerPlacement.start =>
        direction == TextDirection.ltr
            ? details.velocity.pixelsPerSecond.dx
            : -details.velocity.pixelsPerSecond.dx,
      TRDrawerPlacement.end =>
        direction == TextDirection.ltr
            ? -details.velocity.pixelsPerSecond.dx
            : details.velocity.pixelsPerSecond.dx,
    };
    if (velocity < -800 ||
        _extentController.value < _resolvedSnapPoints.first / 2) {
      widget.onDismiss?.call();
      Navigator.maybeOf(context)?.maybePop();
      return;
    }
    var nearest = 0;
    for (var index = 1; index < _resolvedSnapPoints.length; index += 1) {
      if ((_resolvedSnapPoints[index] - _extentController.value).abs() <
          (_resolvedSnapPoints[nearest] - _extentController.value).abs()) {
        nearest = index;
      }
    }
    final target = _resolvedSnapPoints[nearest];
    if (MediaQuery.disableAnimationsOf(context)) {
      _extentController.value = target;
    } else {
      unawaited(
        _extentController.animateTo(
          target,
          duration: TRMotion.normal,
          curve: TRMotion.easeOut,
        ),
      );
    }
    widget.onSnapChanged?.call(nearest);
  }

  @override
  Widget build(BuildContext context) {
    final colors = context.tinyrackTheme;
    // The web drawer frames itself with `--tinyrack-control-border`, which #444
    // separated from the surface `border` weight (dark: #a3a3a3 vs #404040).
    final generated = Theme.of(context).brightness == Brightness.light
        ? TRGeneratedColors.light
        : TRGeneratedColors.dark;
    final media = MediaQuery.of(context);
    final direction = Directionality.of(context);
    final physicalStart = direction == TextDirection.ltr
        ? TRDrawerPlacement.start
        : TRDrawerPlacement.end;
    final radius = switch (widget.placement) {
      TRDrawerPlacement.top => const BorderRadius.vertical(
        bottom: Radius.circular(TRGeneratedRadii.xl),
      ),
      TRDrawerPlacement.bottom => const BorderRadius.vertical(
        top: Radius.circular(TRGeneratedRadii.xl),
      ),
      _ when widget.placement == physicalStart => const BorderRadius.horizontal(
        right: Radius.circular(TRGeneratedRadii.xl),
      ),
      _ => const BorderRadius.horizontal(
        left: Radius.circular(TRGeneratedRadii.xl),
      ),
    };
    final size = _horizontal
        ? Size(media.size.width, media.size.height * _extentController.value)
        : Size(
            math.min(
              media.size.width * _extentController.value,
              TRGeneratedLayerMetrics.drawerWidth,
            ),
            media.size.height,
          );
    // A side drawer has no border on the web -- `.tr-drawer-popup` drops it for
    // the left and right swipe directions, because the panel is flush against
    // the viewport edge and a full-height outline there reads as a seam. Only
    // the top and bottom sheets keep one.
    final borderWidth = _horizontal ? TRGeneratedBorders.defaultWidth : 0.0;
    final showDragHandle = _horizontal && widget.showDragHandle;
    Widget? dragHandle;
    if (showDragHandle) {
      dragHandle = Align(
        alignment: Alignment.topCenter,
        child: ExcludeSemantics(
          child: Container(
            key: const ValueKey('tr-drawer-drag-handle'),
            width: TRGeneratedSpacing.size2xl,
            height: TRGeneratedSpacing.xs,
            decoration: BoxDecoration(
              color: colors.borderStrong,
              borderRadius: BorderRadius.circular(TRGeneratedRadii.full),
            ),
          ),
        ),
      );
      if (widget.dragBehavior == TRDrawerDragBehavior.handleOnly) {
        dragHandle = GestureDetector(
          key: const ValueKey('tr-drawer-drag-region'),
          behavior: HitTestBehavior.opaque,
          onVerticalDragEnd: _endDrag,
          onVerticalDragUpdate: _drag,
          child: SizedBox(
            height: TRGeneratedSpacing.size2xl,
            child: dragHandle,
          ),
        );
      }
    }
    final body = Material(
      color: colors.surface,
      elevation: 0,
      shape: RoundedRectangleBorder(
        borderRadius: radius,
        side: borderWidth == 0
            ? BorderSide.none
            : BorderSide(color: generated.controlBorder, width: borderWidth),
      ),
      clipBehavior: Clip.antiAlias,
      child: Semantics(
        container: true,
        explicitChildNodes: true,
        label: widget.semanticLabel,
        role: widget.modal ? SemanticsRole.dialog : null,
        child: SafeArea(
          // A bottom sheet already sits below the status-bar edge unless it
          // grows to fill the viewport. Applying the viewport's top inset to
          // every content-sized sheet creates a second, unrelated gap above
          // its drag handle. Keep the attached bottom edge and both horizontal
          // edges safe; callers that deliberately present a full-screen route
          // can still inset the route with showTRDrawer(useSafeArea: true).
          top: widget.placement != TRDrawerPlacement.bottom,
          // The border comes from the Material shape, which paints over the box
          // without reserving room inside it. The web panel is `box-sizing:
          // border-box`, so its content starts one border width further in.
          // Adding it here is what `TRDialog` does for the same reason.
          child: Padding(
            padding: EdgeInsets.fromLTRB(
              TRGeneratedSpacing.md + borderWidth,
              TRGeneratedSpacing.md + borderWidth,
              TRGeneratedSpacing.md + borderWidth,
              TRGeneratedSpacing.md + borderWidth + media.viewInsets.bottom,
            ),
            child: Column(
              mainAxisSize: _fitsContent ? MainAxisSize.min : MainAxisSize.max,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                if (showDragHandle) ...[
                  dragHandle!,
                  if (widget.dragBehavior == TRDrawerDragBehavior.surface)
                    const SizedBox(height: TRGeneratedSpacing.sm),
                ],
                if (widget.title case final title?)
                  TRLayerPartBoundary(
                    name: 'title',
                    child: DefaultTextStyle.merge(
                      style: TextStyle(
                        color: colors.text,
                        fontFamily: TRGeneratedFontFamilies.body,
                        fontFamilyFallback: TRGeneratedFontFamilies.fallback,
                        fontSize: TRGeneratedTypographySizes.lg,
                        fontWeight: TRGeneratedFontWeights.medium,
                        // `.tr-drawer-title` sets no line-height, so the web
                        // uses `normal` and the font's own metrics decide. The
                        // control line height is a different thing entirely --
                        // it belongs to buttons and inputs, and at lg it is 20
                        // against the 23 the browser actually lays out.
                        height:
                            TRGeneratedFlutterRendering.normalLineLg /
                            TRGeneratedTypographySizes.lg,
                      ),
                      child: title,
                    ),
                  ),
                if (widget.description case final description?) ...[
                  const SizedBox(height: TRGeneratedSpacing.md),
                  TRLayerPartBoundary(
                    name: 'description',
                    child: DefaultTextStyle.merge(
                      style: TRGeneratedTextStyles.bodySm.copyWith(
                        color: colors.textMuted,
                        fontFamilyFallback: TRGeneratedFontFamilies.fallback,
                      ),
                      child: description,
                    ),
                  ),
                ],
                if (widget.title != null || widget.description != null)
                  const SizedBox(height: TRGeneratedSpacing.md),
                Flexible(
                  fit: _fitsContent ? FlexFit.loose : FlexFit.tight,
                  child: DefaultTextStyle.merge(
                    style: TextStyle(
                      color: colors.text,
                      fontFamily: TRGeneratedFontFamilies.body,
                      fontFamilyFallback: TRGeneratedFontFamilies.fallback,
                      fontSize: TRGeneratedTypographySizes.md,
                      height:
                          TRGeneratedFlutterRendering.normalLineMd /
                          TRGeneratedTypographySizes.md,
                    ),
                    child: widget.scrollContent
                        ? TRInternalDrawerScrollRegion(
                            controller: _contentScrollController,
                            child: SingleChildScrollView(
                              controller: _contentScrollController,
                              child: TRLayerPartBoundary(
                                name: 'content',
                                child: widget.content,
                              ),
                            ),
                          )
                        : TRLayerPartBoundary(
                            name: 'content',
                            child: widget.content,
                          ),
                  ),
                ),
                if (widget.actions case final actions?)
                  Align(
                    alignment: AlignmentDirectional.centerEnd,
                    child: actions,
                  ),
              ],
            ),
          ),
        ),
      ),
    );
    Widget interactiveBody = _horizontal
        ? _draggable && widget.dragBehavior == TRDrawerDragBehavior.surface
              ? TRInternalDrawerDragScope(
                  onDragEnd: _endDrag,
                  onDragUpdate: _dragBy,
                  shouldDragBeforeScroll: _dragBeforeScroll,
                  child: GestureDetector(
                    behavior: HitTestBehavior.opaque,
                    onVerticalDragEnd: _endDrag,
                    onVerticalDragUpdate: _drag,
                    child: body,
                  ),
                )
              : body
        : GestureDetector(
            behavior: HitTestBehavior.opaque,
            onHorizontalDragEnd: !_draggable ? null : _endDrag,
            onHorizontalDragUpdate: !_draggable ? null : _dragHorizontal,
            child: body,
          );
    if (_fitsContent && showDragHandle) {
      final restingExtent = _resolvedSnapPoints[widget.initialSnapIndex];
      final dragDistance =
          (restingExtent - _extentController.value) * media.size.height;
      interactiveBody = Transform.translate(
        offset: Offset(
          0,
          widget.placement == TRDrawerPlacement.bottom
              ? dragDistance
              : -dragDistance,
        ),
        child: interactiveBody,
      );
    }
    return TRLayerBoundary(
      kind: TRLayerBoundaryKind.drawer,
      child: _fitsContent
          ? ConstrainedBox(
              constraints: BoxConstraints(
                maxHeight: media.size.height * widget.maxExtent,
              ),
              child: SizedBox(width: media.size.width, child: interactiveBody),
            )
          : SizedBox.fromSize(size: size, child: interactiveBody),
    );
  }
}

/// Places a non-route drawer over or beside application content.
class TRDrawerScaffold extends StatefulWidget {
  const TRDrawerScaffold({
    required this.body,
    required this.drawer,
    this.controller,
    this.modal = true,
    this.placement = TRDrawerPlacement.start,
    super.key,
  });

  final Widget body;
  final Widget drawer;
  final TRDrawerController? controller;
  final bool modal;
  final TRDrawerPlacement placement;

  @override
  State<TRDrawerScaffold> createState() => _TRDrawerScaffoldState();
}

class _TRDrawerScaffoldState extends State<TRDrawerScaffold> {
  TRDrawerController? _internalController;

  TRDrawerController get _controller =>
      widget.controller ?? (_internalController ??= TRDrawerController());

  @override
  void initState() {
    super.initState();
    _controller.addListener(_changed);
  }

  @override
  void didUpdateWidget(TRDrawerScaffold oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.controller == widget.controller) return;
    (oldWidget.controller ?? _internalController)?.removeListener(_changed);
    if (widget.controller != null) {
      _internalController?.dispose();
      _internalController = null;
    }
    _controller.addListener(_changed);
  }

  @override
  void dispose() {
    _controller.removeListener(_changed);
    _internalController?.dispose();
    super.dispose();
  }

  void _changed() => setState(() {});

  @override
  Widget build(BuildContext context) {
    final alignment = _drawerAlignment(widget.placement);
    return Stack(
      fit: StackFit.expand,
      children: [
        widget.body,
        if (_controller.isOpen && widget.modal)
          GestureDetector(
            onTap: _controller.close,
            child: ColoredBox(color: context.tinyrackTheme.scrim),
          ),
        if (_controller.isOpen)
          Align(alignment: alignment, child: widget.drawer),
      ],
    );
  }
}

/// Shows a modal drawer route and returns the value passed to Navigator.pop.
Future<T?> showTRDrawer<T>({
  required BuildContext context,
  required WidgetBuilder builder,
  TRDrawerPlacement placement = TRDrawerPlacement.bottom,
  bool barrierDismissible = true,
  String? barrierLabel,
  bool useRootNavigator = true,
  bool useSafeArea = false,
  RouteSettings? routeSettings,
  bool? requestFocus,
}) {
  final navigator = Navigator.of(context, rootNavigator: useRootNavigator);
  final themes = InheritedTheme.capture(from: context, to: navigator.context);
  final colors = context.tinyrackTheme;
  final disableAnimations = MediaQuery.disableAnimationsOf(context);
  return navigator.push<T>(
    RawDialogRoute<T>(
      barrierColor: colors.scrim,
      barrierDismissible: barrierDismissible,
      barrierLabel:
          barrierLabel ??
          MaterialLocalizations.of(context).modalBarrierDismissLabel,
      pageBuilder: (context, animation, secondaryAnimation) {
        Widget page = Align(
          alignment: _drawerAlignment(placement),
          child: Builder(builder: builder),
        );
        if (useSafeArea) page = SafeArea(child: page);
        return themes.wrap(page);
      },
      requestFocus: requestFocus,
      settings: routeSettings,
      transitionBuilder: (context, animation, secondaryAnimation, child) {
        if (disableAnimations) return child;
        final curved = CurvedAnimation(
          parent: animation,
          curve: TRMotion.easeOut,
          reverseCurve: TRMotion.standard,
        );
        return SlideTransition(
          position: Tween<Offset>(
            begin: switch (placement) {
              TRDrawerPlacement.top => const Offset(0, -1),
              TRDrawerPlacement.bottom => const Offset(0, 1),
              TRDrawerPlacement.start => const Offset(-1, 0),
              TRDrawerPlacement.end => const Offset(1, 0),
            },
            end: Offset.zero,
          ).animate(curved),
          child: child,
        );
      },
      transitionDuration: disableAnimations ? Duration.zero : TRMotion.slow,
      traversalEdgeBehavior: TraversalEdgeBehavior.closedLoop,
    ),
  );
}

AlignmentGeometry _drawerAlignment(TRDrawerPlacement placement) =>
    switch (placement) {
      TRDrawerPlacement.top => AlignmentDirectional.topCenter,
      TRDrawerPlacement.bottom => AlignmentDirectional.bottomCenter,
      TRDrawerPlacement.start => AlignmentDirectional.centerStart,
      TRDrawerPlacement.end => AlignmentDirectional.centerEnd,
    };
