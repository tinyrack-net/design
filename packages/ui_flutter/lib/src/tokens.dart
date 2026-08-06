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
  static const fiveExtraLarge = TRGeneratedSpacing.size5xl;
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
  static const standard = TRGeneratedMotion.standard;
  static const easeOut = TRGeneratedMotion.easeOut;
  static const linear = TRGeneratedMotion.linear;
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
  static const extraSmall = TRGeneratedBreakpoints.xs;
  static const small = TRGeneratedBreakpoints.sm;
  static const medium = TRGeneratedBreakpoints.md;
  static const large = TRGeneratedBreakpoints.lg;
  static const extraLarge = TRGeneratedBreakpoints.xl;
}

/// Platform-resolved measurements used by Tinyrack surfaces and overlays.
abstract final class TRMeasurements {
  /// Square size of a brand mark, such as the one a boot splash centers.
  ///
  /// Separate from the `measure` scale, which constrains the inline size of a
  /// content region, and from [TRControlMetrics.iconSizeOf], which sizes the
  /// glyph inside a control.
  static const brandMarkSm = TRGeneratedMeasurements.brandMarkSm;
  static const brandMarkMd = TRGeneratedMeasurements.brandMarkMd;
  static const brandMarkLg = TRGeneratedMeasurements.brandMarkLg;
  static const measureXs = TRGeneratedMeasurements.measureXs;
  static const measureSm = TRGeneratedMeasurements.measureSm;
  static const measureMd = TRGeneratedMeasurements.measureMd;
  static const measureLg = TRGeneratedMeasurements.measureLg;
  static const measureXl = TRGeneratedMeasurements.measureXl;

  /// Inline size of a structural pane, such as a navigation rail or the list
  /// side of a list-detail layout.
  ///
  /// Separate from the `measure` scale, which sizes a region of text, and from
  /// [TRControlMetrics], which sizes one control. A pane holds rows of other
  /// content, so sizing it from either of those states the wrong intent and
  /// lets two panes drift apart across surfaces.
  static const paneSm = TRGeneratedMeasurements.paneSm;
  static const paneMd = TRGeneratedMeasurements.paneMd;

  /// Maximum inline size of a readable content column.
  ///
  /// Wider than the `measure` scale, which constrains a single text region.
  /// A column left unbounded pushes a label and its control to opposite edges
  /// of a wide window, which is what this scale exists to prevent.
  static const readingWidthSm = TRGeneratedMeasurements.readingWidthSm;
  static const readingWidthMd = TRGeneratedMeasurements.readingWidthMd;
  static const readingWidthLg = TRGeneratedMeasurements.readingWidthLg;
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
