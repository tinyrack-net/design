import 'package:flutter/foundation.dart'
    show TargetPlatform, defaultTargetPlatform, setEquals;
import 'package:flutter/services.dart' show PredictiveBackEvent;
import 'package:material_ui/material_ui.dart';

import '../../generated/tokens.g.dart';
import '../../theme.dart';
import '../../tokens.dart';
import '../../types.dart';
import '../../ui_density.dart';
import '../separator/separator.dart';

/// Canonical width classes for high-level adaptive application layouts.
enum TRAdaptiveWidthClass {
  compact,
  medium,
  expanded,
  large,
  extraLarge;

  /// Classifies a logical viewport [width].
  static TRAdaptiveWidthClass fromWidth(double width) {
    if (width < TRGeneratedBreakpoints.adaptiveCompact) return compact;
    if (width < TRGeneratedBreakpoints.adaptiveMedium) return medium;
    if (width < TRGeneratedBreakpoints.adaptiveLarge) return expanded;
    if (width < TRGeneratedBreakpoints.adaptiveExtraLarge) return large;
    return extraLarge;
  }
}

/// Stable roles in a canonical navigation, primary, and secondary hierarchy.
enum TRPaneRole { navigation, primary, secondary }

/// The mutation that most recently changed a [TRThreePaneNavigator].
enum TRPaneNavigationOperation { push, replace, pop, reset }

/// Exposes the adaptive decisions made by a
/// [TRNavigableThreePaneScaffold] to its pane contents.
class TRAdaptivePaneScope extends InheritedWidget {
  TRAdaptivePaneScope({
    required this.widthClass,
    required Set<TRPaneRole> visibleRoles,
    required this.activeRole,
    required super.child,
    super.key,
  }) : visibleRoles = Set<TRPaneRole>.unmodifiable(visibleRoles);

  /// The width class resolved from the scaffold's logical constraints.
  final TRAdaptiveWidthClass widthClass;

  /// The pane roles currently represented in the scaffold.
  final Set<TRPaneRole> visibleRoles;

  /// The role of the current destination, even when a wider layout also keeps
  /// its parent roles visible.
  final TRPaneRole activeRole;

  /// Returns the nearest adaptive pane scope.
  static TRAdaptivePaneScope of(BuildContext context) {
    final scope = maybeOf(context);
    if (scope == null) {
      throw FlutterError(
        'TRAdaptivePaneScope.of() was called outside a '
        'TRNavigableThreePaneScaffold.',
      );
    }
    return scope;
  }

  /// Returns the nearest adaptive pane scope, if one is available.
  static TRAdaptivePaneScope? maybeOf(BuildContext context) =>
      context.dependOnInheritedWidgetOfExactType<TRAdaptivePaneScope>();

  @override
  bool updateShouldNotify(TRAdaptivePaneScope oldWidget) =>
      widthClass != oldWidget.widthClass ||
      activeRole != oldWidget.activeRole ||
      !setEquals(visibleRoles, oldWidget.visibleRoles);
}

/// One typed destination in a three-pane navigation history.
final class TRPaneDestination<T extends Object> {
  const TRPaneDestination({required this.role, required this.value});

  final TRPaneRole role;
  final T value;
}

/// One observable, typed change to a three-pane navigation history.
final class TRPaneNavigationChange<T extends Object> {
  const TRPaneNavigationChange({
    required this.previous,
    required this.current,
    required this.operation,
  });

  /// The destination visible before the change.
  final TRPaneDestination<T> previous;

  /// The destination visible after the change.
  final TRPaneDestination<T> current;

  /// The history operation that produced the change.
  final TRPaneNavigationOperation operation;

  /// Whether this change advances deeper into the pane hierarchy.
  bool get isForward => operation == TRPaneNavigationOperation.push;
}

/// Owns the destination history rendered by [TRNavigableThreePaneScaffold].
class TRThreePaneNavigator<T extends Object> extends ChangeNotifier {
  TRThreePaneNavigator({required TRPaneDestination<T> initialDestination})
    : _history = <TRPaneDestination<T>>[initialDestination];

  final List<TRPaneDestination<T>> _history;
  TRPaneNavigationChange<T>? _lastChange;

  List<TRPaneDestination<T>> get history => List.unmodifiable(_history);
  TRPaneDestination<T> get currentDestination => _history.last;
  TRPaneNavigationChange<T>? get lastChange => _lastChange;
  bool get canPop => _history.length > 1;

  void push(TRPaneDestination<T> destination) {
    final previous = currentDestination;
    _history.add(destination);
    _lastChange = TRPaneNavigationChange<T>(
      previous: previous,
      current: destination,
      operation: TRPaneNavigationOperation.push,
    );
    notifyListeners();
  }

  void replace(TRPaneDestination<T> destination) {
    final previous = currentDestination;
    _history[_history.length - 1] = destination;
    _lastChange = TRPaneNavigationChange<T>(
      previous: previous,
      current: destination,
      operation: TRPaneNavigationOperation.replace,
    );
    notifyListeners();
  }

  bool pop() {
    if (!canPop) return false;
    final previous = currentDestination;
    _history.removeLast();
    _lastChange = TRPaneNavigationChange<T>(
      previous: previous,
      current: currentDestination,
      operation: TRPaneNavigationOperation.pop,
    );
    notifyListeners();
    return true;
  }

  void reset(TRPaneDestination<T> destination) {
    final previous = currentDestination;
    _history
      ..clear()
      ..add(destination);
    _lastChange = TRPaneNavigationChange<T>(
      previous: previous,
      current: destination,
      operation: TRPaneNavigationOperation.reset,
    );
    notifyListeners();
  }

  /// Whether Back can reach a destination that changes the visible scaffold.
  bool canPopUntilScaffoldValueChange(
    TRAdaptiveWidthClass widthClass, {
    required bool hasSecondaryPane,
  }) =>
      destinationBeforeScaffoldValueChange(
        widthClass,
        hasSecondaryPane: hasSecondaryPane,
      ) !=
      null;

  /// The nearest earlier destination whose visible scaffold value differs.
  TRPaneDestination<T>? destinationBeforeScaffoldValueChange(
    TRAdaptiveWidthClass widthClass, {
    required bool hasSecondaryPane,
  }) {
    if (!canPop) return null;
    final currentValue = _scaffoldValue(
      currentDestination,
      widthClass,
      hasSecondaryPane: hasSecondaryPane,
    );
    for (var index = _history.length - 2; index >= 0; index -= 1) {
      final candidate = _history[index];
      if (_scaffoldValue(
            candidate,
            widthClass,
            hasSecondaryPane: hasSecondaryPane,
          ) !=
          currentValue) {
        return candidate;
      }
    }
    return null;
  }

  /// Pops hidden history until the visible scaffold value changes.
  bool popUntilScaffoldValueChange(
    TRAdaptiveWidthClass widthClass, {
    required bool hasSecondaryPane,
  }) {
    final target = destinationBeforeScaffoldValueChange(
      widthClass,
      hasSecondaryPane: hasSecondaryPane,
    );
    if (target == null) return false;
    final previous = currentDestination;
    while (!identical(_history.last, target)) {
      _history.removeLast();
    }
    _lastChange = TRPaneNavigationChange<T>(
      previous: previous,
      current: target,
      operation: TRPaneNavigationOperation.pop,
    );
    notifyListeners();
    return true;
  }

  Object _scaffoldValue(
    TRPaneDestination<T> destination,
    TRAdaptiveWidthClass widthClass, {
    required bool hasSecondaryPane,
  }) => switch (widthClass) {
    TRAdaptiveWidthClass.compact => destination.value,
    TRAdaptiveWidthClass.medium || TRAdaptiveWidthClass.expanded =>
      destination.role == TRPaneRole.secondary && hasSecondaryPane
          ? TRPaneRole.secondary
          : TRPaneRole.primary,
    TRAdaptiveWidthClass.large ||
    TRAdaptiveWidthClass.extraLarge => TRAdaptiveWidthClass.large,
  };
}

/// Marker and semantic boundary for one adaptive pane.
class TRAdaptivePane extends StatelessWidget {
  const TRAdaptivePane({required this.role, required this.child, super.key});

  final TRPaneRole role;
  final Widget child;

  @override
  Widget build(BuildContext context) => Semantics(
    container: true,
    explicitChildNodes: true,
    child: KeyedSubtree(key: ValueKey<TRPaneRole>(role), child: child),
  );
}

/// A canonical scaffold that shows one, two, or three destinations by width.
class TRNavigableThreePaneScaffold<T extends Object> extends StatefulWidget {
  const TRNavigableThreePaneScaffold({
    required this.navigator,
    required this.navigationPane,
    required this.primaryPane,
    this.secondaryPane,
    this.navigationPaneWidth = TRGeneratedLayerMetrics.appShellSidebarWidth,
    this.primaryPaneWidth = TRGeneratedLayerMetrics.appShellSidebarWidth,
    super.key,
  });

  final TRThreePaneNavigator<T> navigator;
  final Widget navigationPane;
  final Widget primaryPane;
  final Widget? secondaryPane;
  final double navigationPaneWidth;
  final double primaryPaneWidth;

  @override
  State<TRNavigableThreePaneScaffold<T>> createState() =>
      _TRNavigableThreePaneScaffoldState<T>();
}

class _TRNavigableThreePaneScaffoldState<T extends Object>
    extends State<TRNavigableThreePaneScaffold<T>>
    with WidgetsBindingObserver, SingleTickerProviderStateMixin {
  late final AnimationController _predictiveBack = AnimationController(
    vsync: this,
    duration: TRMotion.slow,
  )..addListener(_handlePredictiveProgress);
  TRAdaptiveWidthClass _widthClass = TRAdaptiveWidthClass.compact;
  TRPaneDestination<T>? _predictiveFrom;
  TRPaneDestination<T>? _predictiveTo;
  bool _skipNextTransition = false;

  bool get _hasSecondaryPane => widget.secondaryPane != null;

  bool get _canPopLocally => widget.navigator.canPopUntilScaffoldValueChange(
    _widthClass,
    hasSecondaryPane: _hasSecondaryPane,
  );

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addObserver(this);
  }

  @override
  void dispose() {
    WidgetsBinding.instance.removeObserver(this);
    _predictiveBack
      ..removeListener(_handlePredictiveProgress)
      ..dispose();
    super.dispose();
  }

  void _handlePredictiveProgress() {
    if (mounted) setState(() {});
  }

  @override
  bool handleStartBackGesture(PredictiveBackEvent backEvent) {
    if (defaultTargetPlatform != TargetPlatform.android ||
        ModalRoute.of(context)?.isCurrent != true ||
        !_canPopLocally) {
      return false;
    }
    _predictiveFrom = widget.navigator.currentDestination;
    _predictiveTo = widget.navigator.destinationBeforeScaffoldValueChange(
      _widthClass,
      hasSecondaryPane: _hasSecondaryPane,
    );
    _predictiveBack.value = backEvent.progress;
    setState(() {});
    return true;
  }

  @override
  void handleUpdateBackGestureProgress(PredictiveBackEvent backEvent) {
    if (_predictiveFrom == null) return;
    _predictiveBack.value = backEvent.progress;
  }

  @override
  void handleCancelBackGesture() {
    if (_predictiveFrom == null) return;
    _predictiveBack.reverse().whenComplete(_clearPredictiveBack);
  }

  @override
  void handleCommitBackGesture() {
    if (_predictiveFrom == null) return;
    _skipNextTransition = true;
    widget.navigator.popUntilScaffoldValueChange(
      _widthClass,
      hasSecondaryPane: _hasSecondaryPane,
    );
    _clearPredictiveBack();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (mounted) _skipNextTransition = false;
    });
  }

  void _clearPredictiveBack() {
    if (!mounted) return;
    setState(() {
      _predictiveFrom = null;
      _predictiveTo = null;
      _predictiveBack.value = 0;
    });
  }

  @override
  Widget build(BuildContext context) => AnimatedBuilder(
    animation: widget.navigator,
    builder: (context, _) => LayoutBuilder(
      builder: (context, constraints) {
        final widthClass = TRAdaptiveWidthClass.fromWidth(constraints.maxWidth);
        _widthClass = widthClass;
        final activeRole = widget.navigator.currentDestination.role;
        final visibleRoles = _visibleRoles(widthClass, activeRole);
        final content = switch (widthClass) {
          TRAdaptiveWidthClass.compact => _singlePane(context),
          TRAdaptiveWidthClass.medium ||
          TRAdaptiveWidthClass.expanded => _twoPanes(context),
          TRAdaptiveWidthClass.large ||
          TRAdaptiveWidthClass.extraLarge => _threePanes(),
        };
        final scoped = TRAdaptivePaneScope(
          widthClass: widthClass,
          visibleRoles: visibleRoles,
          activeRole: activeRole,
          child: content,
        );
        return PopScope<Object?>(
          canPop: !_canPopLocally,
          onPopInvokedWithResult: (didPop, _) {
            if (!didPop) {
              widget.navigator.popUntilScaffoldValueChange(
                _widthClass,
                hasSecondaryPane: _hasSecondaryPane,
              );
            }
          },
          child: scoped,
        );
      },
    ),
  );

  Set<TRPaneRole> _visibleRoles(
    TRAdaptiveWidthClass widthClass,
    TRPaneRole activeRole,
  ) => switch (widthClass) {
    TRAdaptiveWidthClass.compact => <TRPaneRole>{activeRole},
    TRAdaptiveWidthClass.medium || TRAdaptiveWidthClass.expanded =>
      activeRole == TRPaneRole.navigation
          ? const <TRPaneRole>{TRPaneRole.navigation, TRPaneRole.primary}
          : <TRPaneRole>{TRPaneRole.navigation, activeRole},
    TRAdaptiveWidthClass.large || TRAdaptiveWidthClass.extraLarge =>
      widget.secondaryPane == null
          ? const <TRPaneRole>{TRPaneRole.navigation, TRPaneRole.primary}
          : const <TRPaneRole>{
              TRPaneRole.navigation,
              TRPaneRole.primary,
              TRPaneRole.secondary,
            },
  };

  Widget _singlePane(BuildContext context) => _animatedActivePane(context);

  Widget _twoPanes(BuildContext context) {
    final active = widget.navigator.currentDestination.role;
    final activePane = active == TRPaneRole.navigation
        ? TRAdaptivePane(role: TRPaneRole.primary, child: widget.primaryPane)
        : _animatedActivePane(context);
    return Row(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: <Widget>[
        SizedBox(
          width: widget.navigationPaneWidth,
          child: TRAdaptivePane(
            role: TRPaneRole.navigation,
            child: widget.navigationPane,
          ),
        ),
        const TRSeparator(
          orientation: TRSeparatorOrientation.vertical,
          variant: TRSeparatorVariant.muted,
        ),
        Expanded(child: activePane),
      ],
    );
  }

  Widget _threePanes() {
    final secondary = widget.secondaryPane;
    return Row(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: <Widget>[
        SizedBox(
          width: widget.navigationPaneWidth,
          child: TRAdaptivePane(
            role: TRPaneRole.navigation,
            child: widget.navigationPane,
          ),
        ),
        const TRSeparator(
          orientation: TRSeparatorOrientation.vertical,
          variant: TRSeparatorVariant.muted,
        ),
        if (secondary == null)
          Expanded(
            child: TRAdaptivePane(
              role: TRPaneRole.primary,
              child: widget.primaryPane,
            ),
          )
        else ...<Widget>[
          SizedBox(
            width: widget.primaryPaneWidth,
            child: TRAdaptivePane(
              role: TRPaneRole.primary,
              child: widget.primaryPane,
            ),
          ),
          const TRSeparator(
            orientation: TRSeparatorOrientation.vertical,
            variant: TRSeparatorVariant.muted,
          ),
          Expanded(
            child: TRAdaptivePane(role: TRPaneRole.secondary, child: secondary),
          ),
        ],
      ],
    );
  }

  Widget _animatedActivePane(BuildContext context) {
    final destination = widget.navigator.currentDestination;
    if (_predictiveFrom != null && _predictiveTo != null) {
      return _predictiveActivePane(context);
    }
    final role = destination.role;
    final child = _paneChild(destination);
    final pane = TRAdaptivePane(
      key: ValueKey<T>(destination.value),
      role: role,
      child: child,
    );
    final operation = widget.navigator.lastChange?.operation;
    if (MediaQuery.disableAnimationsOf(context)) return pane;
    final suppressTransition =
        _skipNextTransition ||
        operation == null ||
        operation == TRPaneNavigationOperation.reset;
    final direction = Directionality.of(context) == TextDirection.ltr
        ? 1.0
        : -1.0;
    return AnimatedSwitcher(
      duration: suppressTransition ? Duration.zero : TRMotion.slow,
      reverseDuration: suppressTransition ? Duration.zero : TRMotion.slow,
      switchInCurve: TRMotion.easeOut,
      switchOutCurve: TRMotion.standard,
      layoutBuilder: (currentChild, previousChildren) => Stack(
        fit: StackFit.passthrough,
        children: <Widget>[
          if (previousChildren.isNotEmpty) previousChildren.last,
          ?currentChild,
        ],
      ),
      transitionBuilder: (transitionChild, animation) {
        return AnimatedBuilder(
          animation: widget.navigator,
          builder: (context, _) {
            final currentKey = ValueKey<T>(
              widget.navigator.currentDestination.value,
            );
            final current = transitionChild.key == currentKey;
            final departing = !current;
            final latestOperation = widget.navigator.lastChange?.operation;
            final latestForward =
                latestOperation == TRPaneNavigationOperation.push;
            final latestBackward =
                latestOperation == TRPaneNavigationOperation.pop;
            Widget result = transitionChild;
            if (latestForward || latestBackward) {
              final incomingSign = latestForward ? direction : -direction;
              final sign = current ? incomingSign : -incomingSign;
              result = SlideTransition(
                position: Tween<Offset>(
                  begin: Offset(sign, 0),
                  end: Offset.zero,
                ).animate(animation),
                child: result,
              );
            }
            result = FadeTransition(opacity: animation, child: result);
            if (departing) {
              result = IgnorePointer(child: ExcludeSemantics(child: result));
            }
            return result;
          },
        );
      },
      child: pane,
    );
  }

  Widget _predictiveActivePane(BuildContext context) {
    final from = _predictiveFrom!;
    final to = _predictiveTo!;
    final progress = _predictiveBack.value;
    final direction = Directionality.of(context) == TextDirection.ltr
        ? 1.0
        : -1.0;
    return ClipRect(
      child: Stack(
        fit: StackFit.expand,
        children: <Widget>[
          IgnorePointer(
            child: ExcludeSemantics(
              child: FractionalTranslation(
                translation: Offset(-direction * (1 - progress), 0),
                child: Opacity(
                  opacity: progress,
                  child: _paneForDestination(to),
                ),
              ),
            ),
          ),
          IgnorePointer(
            child: ExcludeSemantics(
              child: FractionalTranslation(
                translation: Offset(direction * progress, 0),
                child: _paneForDestination(from),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _paneForDestination(TRPaneDestination<T> destination) =>
      TRAdaptivePane(
        key: ValueKey<T>(destination.value),
        role: destination.role,
        child: _paneChild(destination),
      );

  Widget _paneChild(TRPaneDestination<T> destination) =>
      switch (destination.role) {
        TRPaneRole.navigation => widget.navigationPane,
        TRPaneRole.primary => widget.primaryPane,
        TRPaneRole.secondary => widget.secondaryPane ?? widget.primaryPane,
      };
}

/// Scrollable navigation content with standard pane insets and section rhythm.
class TRNavigationPane extends StatelessWidget {
  const TRNavigationPane({required this.children, this.padding, super.key});

  final List<Widget> children;

  /// Overrides the density-aware pane inset.
  final EdgeInsetsGeometry? padding;

  @override
  Widget build(BuildContext context) {
    final comfortable = TRUiDensityScope.of(context) == TRUiDensity.comfortable;
    final effectivePadding =
        padding ??
        EdgeInsets.symmetric(
          horizontal: TRSpacing.medium,
          vertical: comfortable ? TRSpacing.large : TRSpacing.medium,
        );
    final sectionGap = comfortable ? TRSpacing.extraLarge : TRSpacing.large;
    return ListView.separated(
      padding: effectivePadding,
      itemCount: children.length,
      itemBuilder: (context, index) => children[index],
      separatorBuilder: (context, index) => SizedBox(height: sectionGap),
    );
  }
}

/// A labelled group inside a [TRNavigationPane].
class TRNavigationSection extends StatelessWidget {
  const TRNavigationSection({
    required this.label,
    required this.child,
    super.key,
  });

  final Widget label;
  final Widget child;

  @override
  Widget build(BuildContext context) {
    final comfortable = TRUiDensityScope.of(context) == TRUiDensity.comfortable;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: <Widget>[
        Padding(
          padding: EdgeInsets.fromLTRB(
            TRSpacing.medium,
            comfortable ? TRSpacing.medium : TRSpacing.small,
            TRSpacing.medium,
            comfortable ? TRSpacing.large : TRSpacing.medium,
          ),
          child: DefaultTextStyle.merge(
            style: TRTypography.resolve(
              context,
              TRTextVariant.label,
            ).copyWith(color: context.tinyrackTheme.textMuted),
            child: label,
          ),
        ),
        child,
      ],
    );
  }
}
