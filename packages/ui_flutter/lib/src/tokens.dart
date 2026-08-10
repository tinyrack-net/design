import 'package:flutter/material.dart';

import 'generated/tokens.g.dart';
import 'types.dart';

/// Platform-resolved spacing values in logical pixels.
abstract final class TRSpacing {
  static const threeExtraSmall = TRGeneratedSpacing.size3xs;
  static const extraSmall = TRGeneratedSpacing.xs;
  static const small = TRGeneratedSpacing.sm;
  static const medium = TRGeneratedSpacing.md;
  static const large = TRGeneratedSpacing.lg;
  static const extraLarge = TRGeneratedSpacing.xl;
  static const twoExtraLarge = TRGeneratedSpacing.size2xl;
  static const threeExtraLarge = TRGeneratedSpacing.size3xl;
  static const fourExtraLarge = TRGeneratedSpacing.size4xl;
}

/// Platform-resolved corner radii in logical pixels.
abstract final class TRRadii {
  static const extraSmall = Radius.circular(TRGeneratedRadii.xs);
  static const small = Radius.circular(TRGeneratedRadii.sm);
  static const medium = Radius.circular(TRGeneratedRadii.md);
  static const large = Radius.circular(TRGeneratedRadii.lg);
  static const extraLarge = Radius.circular(TRGeneratedRadii.xl);
  static const full = Radius.circular(TRGeneratedRadii.full);
}

/// Shared animation durations and curves.
abstract final class TRMotion {
  static const fast = TRGeneratedMotion.fast;
  static const normal = TRGeneratedMotion.normal;
  static const slow = TRGeneratedMotion.slow;
  static const number = TRGeneratedMotion.number;
  static const loading = TRGeneratedMotion.loading;

  /// How long a toast stays on screen before it dismisses itself.
  ///
  /// A test that waits out a toast, or a surface that schedules work alongside
  /// one, needs the same dwell time the component uses.
  static const toast = TRGeneratedMotion.toast;
  static const standard = TRGeneratedMotion.standard;
  static const easeOut = TRGeneratedMotion.easeOut;
  static const linear = TRGeneratedMotion.linear;
}

/// Platform-resolved opacity values for product-owned effects.
abstract final class TROpacity {
  /// Opacity of the surface covering an active file-drop target.
  static const dropOverlay = TRGeneratedOpacity.dropOverlay;
}

/// Platform-resolved elevation shadows.
abstract final class TRShadows {
  static const raised = TRGeneratedShadows.raised;
  static const overlay = TRGeneratedShadows.overlay;
}

/// Viewport widths at which a responsive layout changes shape.
///
/// A layout deciding between a stacked and a side-by-side arrangement needs a
/// threshold. Reading it here keeps every surface reflowing at the same width
/// instead of at whichever literal each one happened to pick.
abstract final class TRBreakpoints {
  static const small = TRGeneratedBreakpoints.sm;
  static const extraLarge = TRGeneratedBreakpoints.xl;
}

/// Platform-resolved measurements used by Tinyrack surfaces and overlays.
abstract final class TRMeasurements {
  static const measureXs = TRGeneratedMeasurements.measureXs;
  static const measureSm = TRGeneratedMeasurements.measureSm;
  static const measureMd = TRGeneratedMeasurements.measureMd;
  static const measureLg = TRGeneratedMeasurements.measureLg;
  static const measureXl = TRGeneratedMeasurements.measureXl;

  /// Minimum usable extent of one child in a resizable split surface.
  static const splitPaneMinExtent = TRGeneratedMeasurements.splitPaneMinExtent;

  /// Distance a pointer travels before a press turns into a drag.
  ///
  /// Flutter starts a drag once a pointer passes its device hit slop, which is
  /// a single logical pixel for a mouse. A draggable control would then lose
  /// an ordinary click to the drag whenever the pointer drifted while the
  /// button was down, so a draggable surface raises the start distance to this
  /// value for precise pointers.
  static const dragStartDistance = TRGeneratedMeasurements.dragStartDistance;

  static const overlayWidthSm = TRGeneratedMeasurements.overlayWidthSm;
  static const overlayWidthMd = TRGeneratedMeasurements.overlayWidthMd;
  static const overlayInlineInset = TRGeneratedMeasurements.overlayInlineInset;
  static const overlayClosedScale = TRGeneratedMeasurements.overlayClosedScale;
}

/// Platform-resolved geometry of a Tinyrack control at each [TRUiSize].
///
/// A layout that has to decide how many controls fit a width, or align its own
/// content to a control, needs the same numbers the controls are built from.
/// Reading them here keeps that arithmetic on the design system instead of on
/// a measurement or a copied literal.
abstract final class TRControlMetrics {
  /// Outer height, and the side of a square icon control.
  static double heightOf(TRUiSize size) => switch (size) {
    TRUiSize.sm => TRGeneratedControlMetrics.smHeight,
    TRUiSize.md => TRGeneratedControlMetrics.mdHeight,
    TRUiSize.lg => TRGeneratedControlMetrics.lgHeight,
  };

  /// Inset between the control edge and its content, excluding the border.
  static double inlinePaddingOf(TRUiSize size) => switch (size) {
    TRUiSize.sm => TRGeneratedControlMetrics.smPaddingInline,
    TRUiSize.md => TRGeneratedControlMetrics.mdPaddingInline,
    TRUiSize.lg => TRGeneratedControlMetrics.lgPaddingInline,
  };

  /// Space between adjacent pieces of content inside one control.
  static double gapOf(TRUiSize size) => switch (size) {
    TRUiSize.sm => TRGeneratedControlMetrics.smGap,
    TRUiSize.md => TRGeneratedControlMetrics.mdGap,
    TRUiSize.lg => TRGeneratedControlMetrics.lgGap,
  };

  /// Size of an icon rendered inside a control.
  static double iconSizeOf(TRUiSize size) => switch (size) {
    TRUiSize.sm => TRGeneratedControlMetrics.smIconSize,
    TRUiSize.md => TRGeneratedControlMetrics.mdIconSize,
    TRUiSize.lg => TRGeneratedControlMetrics.lgIconSize,
  };

  /// Font size of the label of a control.
  static double fontSizeOf(TRUiSize size) => switch (size) {
    TRUiSize.sm => TRGeneratedControlMetrics.smFontSize,
    TRUiSize.md => TRGeneratedControlMetrics.mdFontSize,
    TRUiSize.lg => TRGeneratedControlMetrics.lgFontSize,
  };

  /// Line height of the label of a control.
  static double lineHeightOf(TRUiSize size) => switch (size) {
    TRUiSize.sm => TRGeneratedControlMetrics.smLineHeight,
    TRUiSize.md => TRGeneratedControlMetrics.mdLineHeight,
    TRUiSize.lg => TRGeneratedControlMetrics.lgLineHeight,
  };

  /// Width of the border a control draws, which adds to its outer width.
  static const borderWidth = TRGeneratedBorders.defaultWidth;

  /// Width of the ring drawn around a focused control.
  ///
  /// Thicker than [borderWidth], so a focused control reads as focused rather
  /// than as merely outlined. A composite drawing its own focus ring needs
  /// this to match the ring the controls beside it draw.
  static const focusWidth = TRGeneratedBorders.focusWidth;

  /// Gap between a control's edge and its focus ring.
  static const focusOffset = TRGeneratedBorders.focusOffset;

  /// Text style a control renders its label in.
  ///
  /// Measuring a label with anything else misreports its width, because the
  /// weight and tracking a control uses are not the ambient ones.
  static TextStyle labelStyleOf(TRUiSize size) => TextStyle(
    fontFamily: TRGeneratedFontFamilies.body,
    fontFamilyFallback: TRGeneratedFontFamilies.fallback,
    fontSize: fontSizeOf(size),
    fontWeight: TRGeneratedFontWeights.medium,
    height: TRGeneratedTypographyLineHeights.sm,
    letterSpacing: TRGeneratedTypographyTracking.none,
  );
}

/// Platform-resolved typography roles without semantic foreground colors.
abstract final class TRTypography {
  static const caption = TRGeneratedTextStyles.caption;
  static const label = TRGeneratedTextStyles.label;
  static const body = TRGeneratedTextStyles.body;
  static const bodySm = TRGeneratedTextStyles.bodySm;
  static const code = TRGeneratedTextStyles.code;
  static const headingSm = TRGeneratedTextStyles.headingSm;
  static const headingMd = TRGeneratedTextStyles.headingMd;
  static const headingLg = TRGeneratedTextStyles.headingLg;
  static const display = TRGeneratedTextStyles.display;
  static const displayLg = TRGeneratedTextStyles.displayLg;
}
