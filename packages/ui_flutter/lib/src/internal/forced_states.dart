import 'package:flutter/widgets.dart';

import 'focus_source.dart';

/// The interaction states a scenario declares, in place of driving real input.
///
/// The visual parity suite compares how `@tinyrack/ui` and `tinyrack_ui` look
/// under the same declared condition. Reaching that condition by driving a real
/// pointer or a real key on two runtimes makes the comparison a test of two
/// event pipelines as much as of two paint outputs, and Chromium's input
/// dispatch and CanvasKit's frame scheduler do not settle together. Declaring
/// the condition removes the race; the pipelines are covered by widget tests.
@immutable
class TRForcedStateSet {
  const TRForcedStateSet({
    this.hovered = false,
    this.pressed = false,
    this.keyboardPressed = false,
    this.focused = false,
    this.focusVisible = false,
  });

  /// Nothing is declared: every resolver falls through to the real state.
  static const none = TRForcedStateSet();

  final bool hovered;

  /// A held pointer, which animates into the pressed offset.
  final bool pressed;

  /// A held Space, which takes the pressed offset without animating. The two
  /// are separate paths in the button frame, so a scenario names which it
  /// means.
  final bool keyboardPressed;

  /// The control owns focus. On its own this is pointer focus: no emphasis.
  final bool focused;

  /// The control owns focus the keyboard granted, which is the focus that
  /// paints a ring or a focus-coloured border.
  final bool focusVisible;

  /// Whether focus was declared at all.
  ///
  /// When it was, the sampled input modality is bypassed rather than combined
  /// with the declaration -- see [TRForcedStatesMixin.resolveFocusVisible].
  bool get declaresFocus => focused || focusVisible;

  bool get isEmpty =>
      !hovered && !pressed && !keyboardPressed && !focused && !focusVisible;

  @override
  bool operator ==(Object other) =>
      other is TRForcedStateSet &&
      other.hovered == hovered &&
      other.pressed == pressed &&
      other.keyboardPressed == keyboardPressed &&
      other.focused == focused &&
      other.focusVisible == focusVisible;

  @override
  int get hashCode =>
      Object.hash(hovered, pressed, keyboardPressed, focused, focusVisible);
}

/// Declares interaction states for the controls below it.
///
/// Internal, and installed only by the parity preview and by this package's
/// tests. `package:tinyrack_ui/tinyrack_ui.dart` exports nothing from
/// `src/internal`, and no widget in `lib/src/components` builds one, so a
/// production tree never has this ancestor and every resolver below returns the
/// real state unchanged.
///
/// An inherited scope rather than a controller parameter, because the controls
/// that most need forcing are the least reachable: tab items and slider thumbs
/// are built by their parent, their State classes are private, and their focus
/// nodes are created internally. A parameter would have meant opening
/// `focusNode` and `autofocus` on `TRTabs`, `TRTabsTab` and `TRSlider` purely
/// to serve a test harness. Inherited lookup walks the element tree and does
/// not care about any of that.
class TRForcedStates extends InheritedWidget {
  const TRForcedStates({
    required this.states,
    required super.child,
    this.target,
    super.key,
  });

  /// Which control the declaration applies to.
  ///
  /// Null applies it to every control in the subtree, which is what the
  /// single-control previews want. A non-null value applies it only where
  /// [TRForcedStatesMixin.forcedStateIdentity] matches, so a scenario can name
  /// one tab, one row, or one thumb among several.
  final Object? target;

  final TRForcedStateSet states;

  /// The states declared for the control identified by [identity].
  static TRForcedStateSet of(BuildContext context, {Object? identity}) {
    final scope = context.dependOnInheritedWidgetOfExactType<TRForcedStates>();
    if (scope == null) return TRForcedStateSet.none;
    if (scope.target != null && scope.target != identity) {
      return TRForcedStateSet.none;
    }
    return scope.states;
  }

  @override
  bool updateShouldNotify(TRForcedStates oldWidget) =>
      states != oldWidget.states || target != oldWidget.target;
}

/// Folds declared states into the real ones a control tracks itself.
///
/// The superclass constraint is deliberate: focus emphasis has exactly one
/// decision point, [TRFocusSourceMixin.focusVisible], and this keeps the
/// declared answer on the same line rather than adding a second one.
mixin TRForcedStatesMixin<T extends StatefulWidget>
    on State<T>, TRFocusSourceMixin<T> {
  /// Override in a State that builds one of several like controls.
  Object? get forcedStateIdentity => null;

  TRForcedStateSet forcedStates(BuildContext context) =>
      TRForcedStates.of(context, identity: forcedStateIdentity);

  bool resolveHovered(BuildContext context, {required bool hovered}) =>
      hovered || forcedStates(context).hovered;

  bool resolvePressed(BuildContext context, {required bool pressed}) =>
      pressed || forcedStates(context).pressed;

  bool resolveKeyboardPressed(
    BuildContext context, {
    required bool keyboardPressed,
  }) => keyboardPressed || forcedStates(context).keyboardPressed;

  bool resolveFocused(BuildContext context, {required bool hasFocus}) =>
      hasFocus || forcedStates(context).declaresFocus;

  /// Whether the control should paint focus emphasis.
  ///
  /// A declaration replaces the modality lookup rather than adding to it. A
  /// scenario that declares pointer focus must not light up because the process
  /// happened to see a key press since it started, so this is a bypass and not
  /// an OR. Turning it into an OR would make every pointer-focused scenario
  /// paint a ring.
  bool resolveFocusVisible(BuildContext context, {required bool hasFocus}) {
    final forced = forcedStates(context);
    if (forced.declaresFocus) return forced.focusVisible;
    return focusVisible(hasFocus: hasFocus);
  }
}
