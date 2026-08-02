import 'package:flutter/material.dart';

import 'generated/tokens.g.dart';

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

/// Platform-resolved measurements used by Tinyrack surfaces and overlays.
abstract final class TRMeasurements {
  static const measureMd = TRGeneratedMeasurements.measureMd;
  static const measureXl = TRGeneratedMeasurements.measureXl;
  static const overlayWidthSm = TRGeneratedMeasurements.overlayWidthSm;
  static const overlayWidthMd = TRGeneratedMeasurements.overlayWidthMd;
  static const overlayInlineInset = TRGeneratedMeasurements.overlayInlineInset;
  static const overlayClosedScale = TRGeneratedMeasurements.overlayClosedScale;
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
