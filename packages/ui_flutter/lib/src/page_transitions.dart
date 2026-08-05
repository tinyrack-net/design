import 'package:flutter/material.dart';

import 'generated/tokens.g.dart';
import 'tokens.dart';

/// The page transition every Tinyrack surface uses.
///
/// Material's default builders differ per platform, so the same application
/// animates one way on Android, another on macOS, and another again on Linux
/// and Windows. Tinyrack owns its motion, so the theme installs this builder
/// for every [TargetPlatform] and a routed page looks the same everywhere.
///
/// The motion matches the overlay transition shared by the Tinyrack dialog and
/// drawer: the arriving page fades in while it scales up from the closed
/// overlay scale. Popping plays the same animation in reverse, which is what
/// makes leaving a page read differently from entering one.
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
    // A settled page keeps no opacity layer or transform of its own, so the
    // transition costs nothing once it has played and leaves the page's own
    // render tree exactly as the page composed it.
    if (animation.isCompleted) return child;
    final curved = CurvedAnimation(
      parent: animation,
      curve: TRMotion.easeOut,
      reverseCurve: TRMotion.standard,
    );
    return FadeTransition(
      opacity: curved,
      child: ScaleTransition(
        scale: Tween<double>(
          begin: TRGeneratedMeasurements.overlayClosedScale,
          end: 1,
        ).animate(curved),
        child: child,
      ),
    );
  }
}
