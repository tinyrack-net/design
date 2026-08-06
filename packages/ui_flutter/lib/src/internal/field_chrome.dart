import 'package:flutter/material.dart';

import '../generated/tokens.g.dart';
import '../theme.dart';
import '../types.dart';

/// The fill and border a field paints for one interaction state.
@immutable
class TRFieldChrome {
  const TRFieldChrome({
    required this.fill,
    required this.borderColor,
    required this.borderWidth,
  });

  final Color fill;
  final Color borderColor;
  final double borderWidth;
}

/// Resolves the chrome a field paints for the current interaction state.
///
/// Each control computes its own [solidFill], [solidBorderColor], and
/// [solidBorderWidth]; those are returned unchanged for
/// [TRFieldAppearance.solid] so every control keeps the state mapping it
/// already had. [TRFieldAppearance.ghost] ignores them and resolves from shared
/// tokens instead, dropping only the resting fill and border while keeping
/// hover, focus, and invalid emphasis. [TRFieldAppearance.plain] keeps only the
/// invalid emphasis, because the surface framing the group paints its fill,
/// hover, and focus for it.
///
/// Every appearance returns a border at a real width, transparent when it
/// should not be seen, so switching appearance never changes a field's
/// metrics.
TRFieldChrome resolveFieldChrome({
  required TRFieldAppearance appearance,
  required TinyrackThemeData colors,
  required Color solidFill,
  required Color solidBorderColor,
  required double solidBorderWidth,
  bool enabled = true,
  bool error = false,
  bool focused = false,
  bool hovered = false,
  bool open = false,
  bool readOnly = false,
}) {
  if (appearance == TRFieldAppearance.solid) {
    return TRFieldChrome(
      fill: solidFill,
      borderColor: solidBorderColor,
      borderWidth: solidBorderWidth,
    );
  }
  if (appearance == TRFieldAppearance.plain) {
    // The framing surface answers hover and focus for the whole group, so the
    // field adds nothing there. It keeps invalid emphasis, which is the one
    // state the surface cannot know about.
    if (error) {
      return TRFieldChrome(
        fill: Colors.transparent,
        borderColor: focused ? colors.danger : colors.dangerBorder,
        borderWidth: focused
            ? TRGeneratedBorders.focusWidth
            : TRGeneratedBorders.defaultWidth,
      );
    }
    return const TRFieldChrome(
      fill: Colors.transparent,
      borderColor: Colors.transparent,
      borderWidth: TRGeneratedBorders.defaultWidth,
    );
  }
  if (error && focused) {
    return TRFieldChrome(
      fill: colors.surface,
      borderColor: colors.danger,
      borderWidth: TRGeneratedBorders.focusWidth,
    );
  }
  if (focused) {
    return TRFieldChrome(
      fill: colors.surface,
      borderColor: colors.focus,
      borderWidth: TRGeneratedBorders.focusWidth,
    );
  }
  if (open) {
    return TRFieldChrome(
      fill: colors.surfaceSelected,
      borderColor: colors.focus,
      borderWidth: TRGeneratedBorders.focusWidth,
    );
  }
  if (error) {
    return TRFieldChrome(
      fill: Colors.transparent,
      borderColor: colors.dangerBorder,
      borderWidth: TRGeneratedBorders.defaultWidth,
    );
  }
  // A disabled or read-only ghost field stays flat; the caller still applies
  // the shared disabled opacity.
  if (!enabled || readOnly) {
    return const TRFieldChrome(
      fill: Colors.transparent,
      borderColor: Colors.transparent,
      borderWidth: TRGeneratedBorders.defaultWidth,
    );
  }
  if (hovered) {
    return TRFieldChrome(
      fill: colors.surfaceHover,
      borderColor: Colors.transparent,
      borderWidth: TRGeneratedBorders.defaultWidth,
    );
  }
  return const TRFieldChrome(
    fill: Colors.transparent,
    borderColor: Colors.transparent,
    borderWidth: TRGeneratedBorders.defaultWidth,
  );
}
