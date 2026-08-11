import 'package:flutter/widgets.dart';

import 'types.dart';

/// Supplies a semantic default size to interactive Tinyrack controls.
///
/// Products choose where a density applies. A control that omits `uiSize`
/// resolves to [TRUiSize.md] in [TRControlDensity.standard] and [TRUiSize.lg]
/// in [TRControlDensity.comfortable]. An explicit size always wins.
class TRControlDensityScope extends InheritedWidget {
  /// Creates a control-density scope.
  const TRControlDensityScope({
    required this.density,
    required super.child,
    super.key,
  });

  /// The semantic control density for this subtree.
  final TRControlDensity density;

  /// Returns the nearest density, defaulting to [TRControlDensity.standard].
  static TRControlDensity of(BuildContext context) =>
      context
          .dependOnInheritedWidgetOfExactType<TRControlDensityScope>()
          ?.density ??
      TRControlDensity.standard;

  /// Resolves an optional component size against the nearest density.
  static TRUiSize resolve(BuildContext context, TRUiSize? explicitSize) =>
      explicitSize ??
      switch (of(context)) {
        TRControlDensity.standard => TRUiSize.md,
        TRControlDensity.comfortable => TRUiSize.lg,
      };

  @override
  bool updateShouldNotify(TRControlDensityScope oldWidget) =>
      density != oldWidget.density;
}
