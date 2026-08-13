import 'package:material_ui/material_ui.dart';

import 'tokens.dart';

/// The page transition every Tinyrack surface uses.
///
/// Tinyrack installs one public builder for every [TargetPlatform], then uses
/// the platform capability that matters for navigation: Android receives its
/// predictive Back transition and other platforms receive Material forward
/// fade motion.
///
/// Android delegates to Flutter's predictive Back transition so the routed
/// page follows the system gesture. Other platforms use the Material forward
/// fade. Overlay scale motion remains owned by dialogs and drawers.
class TRPageTransitionsBuilder extends PageTransitionsBuilder {
  /// Creates the shared Tinyrack page transition.
  const TRPageTransitionsBuilder();

  @override
  Duration get transitionDuration => TRMotion.slow;

  @override
  Widget buildTransitions<T>(
    PageRoute<T>? route,
    BuildContext? context,
    Animation<double> animation,
    Animation<double> secondaryAnimation,
    Widget child,
  ) {
    if (context != null && MediaQuery.disableAnimationsOf(context)) {
      return child;
    }
    if (context == null || route == null) return child;
    final builder = Theme.of(context).platform == TargetPlatform.android
        ? const PredictiveBackPageTransitionsBuilder()
        : const FadeForwardsPageTransitionsBuilder();
    return builder.buildTransitions<T>(
      route,
      context,
      animation,
      secondaryAnimation,
      child,
    );
  }
}
