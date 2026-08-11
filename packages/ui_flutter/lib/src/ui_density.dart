import 'package:flutter/widgets.dart';

import 'types.dart';

/// Supplies semantic control, typography, indicator, and surface defaults to a
/// subtree.
///
/// Products choose where a density applies. Components keep their standard
/// geometry unless the product opts a subtree into comfortable density.
class TRUiDensityScope extends InheritedWidget {
  /// Creates a UI-density scope.
  const TRUiDensityScope({
    required this.density,
    required super.child,
    super.key,
  });

  /// The semantic UI density for this subtree.
  final TRUiDensity density;

  /// Returns the nearest density, defaulting to [TRUiDensity.standard].
  static TRUiDensity of(BuildContext context) =>
      context.dependOnInheritedWidgetOfExactType<TRUiDensityScope>()?.density ??
      TRUiDensity.standard;

  /// Resolves an optional component size against the nearest density.
  static TRUiSize resolveSize(BuildContext context, TRUiSize? explicitSize) =>
      explicitSize ??
      switch (of(context)) {
        TRUiDensity.standard => TRUiSize.md,
        TRUiDensity.comfortable => TRUiSize.xl,
      };

  /// Resolves optional card padding against the nearest density.
  static TRCardPadding resolveCardPadding(
    BuildContext context,
    TRCardPadding? explicitPadding,
  ) =>
      explicitPadding ??
      switch (of(context)) {
        TRUiDensity.standard => TRCardPadding.md,
        TRUiDensity.comfortable => TRCardPadding.lg,
      };

  @override
  bool updateShouldNotify(TRUiDensityScope oldWidget) =>
      density != oldWidget.density;
}
