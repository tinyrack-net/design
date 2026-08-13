import 'package:flutter/foundation.dart' show setEquals;
import 'package:flutter/material.dart';

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

/// Owns the destination history rendered by [TRNavigableThreePaneScaffold].
class TRThreePaneNavigator<T extends Object> extends ChangeNotifier {
  TRThreePaneNavigator({required TRPaneDestination<T> initialDestination})
    : _history = <TRPaneDestination<T>>[initialDestination];

  final List<TRPaneDestination<T>> _history;

  List<TRPaneDestination<T>> get history => List.unmodifiable(_history);
  TRPaneDestination<T> get currentDestination => _history.last;
  bool get canPop => _history.length > 1;

  void push(TRPaneDestination<T> destination) {
    _history.add(destination);
    notifyListeners();
  }

  void replace(TRPaneDestination<T> destination) {
    _history[_history.length - 1] = destination;
    notifyListeners();
  }

  bool pop() {
    if (!canPop) return false;
    _history.removeLast();
    notifyListeners();
    return true;
  }

  void reset(TRPaneDestination<T> destination) {
    _history
      ..clear()
      ..add(destination);
    notifyListeners();
  }
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
class TRNavigableThreePaneScaffold<T extends Object> extends StatelessWidget {
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
  Widget build(BuildContext context) => AnimatedBuilder(
    animation: navigator,
    builder: (context, _) => LayoutBuilder(
      builder: (context, constraints) {
        final widthClass = TRAdaptiveWidthClass.fromWidth(constraints.maxWidth);
        final activeRole = navigator.currentDestination.role;
        final visibleRoles = _visibleRoles(widthClass, activeRole);
        final content = switch (widthClass) {
          TRAdaptiveWidthClass.compact => _singlePane(context),
          TRAdaptiveWidthClass.medium ||
          TRAdaptiveWidthClass.expanded => _twoPanes(context),
          TRAdaptiveWidthClass.large ||
          TRAdaptiveWidthClass.extraLarge => _threePanes(),
        };
        return TRAdaptivePaneScope(
          widthClass: widthClass,
          visibleRoles: visibleRoles,
          activeRole: activeRole,
          child: content,
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
      secondaryPane == null
          ? const <TRPaneRole>{TRPaneRole.navigation, TRPaneRole.primary}
          : const <TRPaneRole>{
              TRPaneRole.navigation,
              TRPaneRole.primary,
              TRPaneRole.secondary,
            },
  };

  Widget _singlePane(BuildContext context) => _animatedActivePane(context);

  Widget _twoPanes(BuildContext context) {
    final active = navigator.currentDestination.role;
    final activePane = active == TRPaneRole.navigation
        ? TRAdaptivePane(role: TRPaneRole.primary, child: primaryPane)
        : _animatedActivePane(context);
    return Row(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: <Widget>[
        SizedBox(
          width: navigationPaneWidth,
          child: TRAdaptivePane(
            role: TRPaneRole.navigation,
            child: navigationPane,
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
    final secondary = secondaryPane;
    return Row(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: <Widget>[
        SizedBox(
          width: navigationPaneWidth,
          child: TRAdaptivePane(
            role: TRPaneRole.navigation,
            child: navigationPane,
          ),
        ),
        const TRSeparator(
          orientation: TRSeparatorOrientation.vertical,
          variant: TRSeparatorVariant.muted,
        ),
        if (secondary == null)
          Expanded(
            child: TRAdaptivePane(role: TRPaneRole.primary, child: primaryPane),
          )
        else ...<Widget>[
          SizedBox(
            width: primaryPaneWidth,
            child: TRAdaptivePane(role: TRPaneRole.primary, child: primaryPane),
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
    final role = navigator.currentDestination.role;
    final child = switch (role) {
      TRPaneRole.navigation => navigationPane,
      TRPaneRole.primary => primaryPane,
      TRPaneRole.secondary => secondaryPane ?? primaryPane,
    };
    final pane = TRAdaptivePane(
      key: ValueKey<T>(navigator.currentDestination.value),
      role: role,
      child: child,
    );
    if (MediaQuery.disableAnimationsOf(context)) return pane;
    return AnimatedSwitcher(
      duration: TRMotion.slow,
      reverseDuration: TRMotion.slow,
      switchInCurve: TRMotion.easeOut,
      switchOutCurve: TRMotion.standard,
      transitionBuilder: (child, animation) => FadeTransition(
        opacity: animation,
        child: ScaleTransition(
          scale: Tween<double>(
            begin: TRGeneratedMeasurements.overlayClosedScale,
            end: 1,
          ).animate(animation),
          child: child,
        ),
      ),
      child: pane,
    );
  }
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
