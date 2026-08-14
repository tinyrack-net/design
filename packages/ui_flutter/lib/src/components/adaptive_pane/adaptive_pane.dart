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

/// Stable semantic roles in a navigation, collection, and detail hierarchy.
enum TRPaneRole { navigation, primary, secondary }

/// Exposes the width class resolved from the complete adaptive viewport.
///
/// Nested layouts read this scope instead of classifying the smaller space left
/// after a navigation pane has been placed.
class TRAdaptiveLayoutScope extends InheritedWidget {
  const TRAdaptiveLayoutScope({
    required this.widthClass,
    required super.child,
    super.key,
  });

  /// The width class resolved from the complete layout constraint.
  final TRAdaptiveWidthClass widthClass;

  /// Returns the nearest adaptive layout scope.
  static TRAdaptiveLayoutScope of(BuildContext context) {
    final scope = maybeOf(context);
    if (scope == null) {
      throw FlutterError(
        'TRAdaptiveLayoutScope.of() was called outside an adaptive layout.',
      );
    }
    return scope;
  }

  /// Returns the nearest adaptive layout scope, if one is available.
  static TRAdaptiveLayoutScope? maybeOf(BuildContext context) =>
      context.dependOnInheritedWidgetOfExactType<TRAdaptiveLayoutScope>();

  @override
  bool updateShouldNotify(TRAdaptiveLayoutScope oldWidget) =>
      widthClass != oldWidget.widthClass;
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

/// Places application navigation beside content when the viewport permits it.
///
/// This widget owns no destination, history, Back handling, or transition. A
/// routed application keeps those responsibilities in its [Navigator] and
/// passes the resulting content as [contentPane].
class TRAdaptiveNavigationLayout extends StatelessWidget {
  const TRAdaptiveNavigationLayout({
    required this.navigationPane,
    required this.contentPane,
    this.navigationPaneWidth = TRGeneratedLayerMetrics.appShellSidebarWidth,
    super.key,
  });

  /// The navigation surface shown at medium widths and wider.
  final Widget navigationPane;

  /// The routed content surface.
  final Widget contentPane;

  /// Width reserved for [navigationPane].
  final double navigationPaneWidth;

  @override
  Widget build(BuildContext context) => LayoutBuilder(
    builder: (context, constraints) {
      final widthClass = TRAdaptiveWidthClass.fromWidth(constraints.maxWidth);
      return TRAdaptiveLayoutScope(
        widthClass: widthClass,
        child: switch (widthClass) {
          TRAdaptiveWidthClass.compact => contentPane,
          TRAdaptiveWidthClass.medium ||
          TRAdaptiveWidthClass.expanded ||
          TRAdaptiveWidthClass.large ||
          TRAdaptiveWidthClass.extraLarge => Row(
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
              Expanded(
                child: Semantics(
                  // A current Material route inserts BlockSemantics. Keep
                  // that boundary inside routed content so it cannot suppress
                  // the adjacent navigation pane from the accessibility tree.
                  container: true,
                  explicitChildNodes: true,
                  child: contentPane,
                ),
              ),
            ],
          ),
        },
      );
    },
  );
}

/// Places collection and detail panes side by side on large viewports.
///
/// Below the large width class, [singlePane] receives the complete content
/// region. Applications normally pass a keyed nested [Navigator] there and as
/// [detailPane], allowing Flutter's Page lifecycle to survive a breakpoint
/// change while only the routed detail surface transitions.
class TRAdaptiveListDetailLayout extends StatelessWidget {
  const TRAdaptiveListDetailLayout({
    required this.singlePane,
    required this.collectionPane,
    required this.detailPane,
    this.collectionPaneWidth = TRGeneratedLayerMetrics.appShellSidebarWidth,
    super.key,
  });

  /// Content rendered below the large width class.
  final Widget singlePane;

  /// The fixed collection surface rendered at large widths and wider.
  final Widget collectionPane;

  /// The detail surface rendered beside [collectionPane].
  final Widget detailPane;

  /// Width reserved for [collectionPane].
  final double collectionPaneWidth;

  @override
  Widget build(BuildContext context) {
    final scope = TRAdaptiveLayoutScope.maybeOf(context);
    if (scope != null) return _buildFor(scope.widthClass);
    return LayoutBuilder(
      builder: (context, constraints) {
        final widthClass = TRAdaptiveWidthClass.fromWidth(constraints.maxWidth);
        return TRAdaptiveLayoutScope(
          widthClass: widthClass,
          child: _buildFor(widthClass),
        );
      },
    );
  }

  Widget _buildFor(TRAdaptiveWidthClass widthClass) => switch (widthClass) {
    TRAdaptiveWidthClass.compact ||
    TRAdaptiveWidthClass.medium ||
    TRAdaptiveWidthClass.expanded => TRAdaptivePane(
      role: TRPaneRole.secondary,
      child: singlePane,
    ),
    TRAdaptiveWidthClass.large || TRAdaptiveWidthClass.extraLarge => Row(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: <Widget>[
        SizedBox(
          width: collectionPaneWidth,
          child: TRAdaptivePane(
            role: TRPaneRole.primary,
            child: collectionPane,
          ),
        ),
        const TRSeparator(
          orientation: TRSeparatorOrientation.vertical,
          variant: TRSeparatorVariant.muted,
        ),
        Expanded(
          child: TRAdaptivePane(role: TRPaneRole.secondary, child: detailPane),
        ),
      ],
    ),
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
