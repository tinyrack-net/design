import 'package:flutter/material.dart';

import 'generated/tokens.g.dart';
import 'page_transitions.dart';
import 'types.dart';

/// Semantic colors available through the active [ThemeData].
@immutable
final class TinyrackThemeData extends ThemeExtension<TinyrackThemeData> {
  const TinyrackThemeData({
    required this.surface,
    required this.surfaceMuted,
    required this.surfaceHover,
    required this.surfaceSelected,
    required this.surfacePressed,
    required this.scrim,
    required this.text,
    required this.textMuted,
    required this.textPlaceholder,
    required this.textInverse,
    required this.border,
    required this.borderStrong,
    required this.infoBorder,
    required this.successBorder,
    required this.warningBorder,
    required this.dangerBorder,
    required this.focus,
    required this.primary,
    required this.onPrimary,
    required this.info,
    required this.infoSurface,
    required this.success,
    required this.successSurface,
    required this.warning,
    required this.warningSurface,
    required this.danger,
    required this.dangerSurface,
  });

  factory TinyrackThemeData._generated(TRGeneratedColorTheme colors) {
    return TinyrackThemeData(
      surface: colors.surface,
      surfaceMuted: colors.surfaceMuted,
      surfaceHover: colors.surfaceHover,
      surfaceSelected: colors.surfaceSelected,
      surfacePressed: colors.surfacePressed,
      scrim: colors.scrim,
      text: colors.text,
      textMuted: colors.textMuted,
      textPlaceholder: colors.textPlaceholder,
      textInverse: colors.textInverse,
      border: colors.border,
      borderStrong: colors.borderStrong,
      infoBorder: colors.infoBorder,
      successBorder: colors.successBorder,
      warningBorder: colors.warningBorder,
      dangerBorder: colors.dangerBorder,
      focus: colors.focus,
      primary: colors.primary,
      onPrimary: colors.onPrimary,
      info: colors.info,
      infoSurface: colors.infoSurfaceSubtle,
      success: colors.success,
      successSurface: colors.successSurfaceSubtle,
      warning: colors.warning,
      warningSurface: colors.warningSurfaceSubtle,
      danger: colors.danger,
      dangerSurface: colors.dangerSurfaceSubtle,
    );
  }

  final Color surface;
  final Color surfaceMuted;
  final Color surfaceHover;
  final Color surfaceSelected;
  final Color surfacePressed;
  final Color scrim;
  final Color text;
  final Color textMuted;
  final Color textPlaceholder;
  final Color textInverse;
  final Color border;
  final Color borderStrong;
  final Color infoBorder;
  final Color successBorder;
  final Color warningBorder;
  final Color dangerBorder;
  final Color focus;
  final Color primary;
  final Color onPrimary;
  final Color info;
  final Color infoSurface;
  final Color success;
  final Color successSurface;
  final Color warning;
  final Color warningSurface;
  final Color danger;
  final Color dangerSurface;

  /// Returns the foreground color for [intent].
  Color foregroundFor(TRIntent intent) => switch (intent) {
    TRIntent.neutral => text,
    TRIntent.primary => primary,
    TRIntent.info => info,
    TRIntent.success => success,
    TRIntent.warning => warning,
    TRIntent.danger => danger,
  };

  /// Returns the subtle surface color for [intent].
  Color surfaceFor(TRIntent intent) => switch (intent) {
    TRIntent.neutral => surfaceMuted,
    TRIntent.primary => surfaceMuted,
    TRIntent.info => infoSurface,
    TRIntent.success => successSurface,
    TRIntent.warning => warningSurface,
    TRIntent.danger => dangerSurface,
  };

  /// Returns the foreground color for a status [variant].
  Color foregroundForStatus(TRStatusVariant variant) => switch (variant) {
    TRStatusVariant.neutral => text,
    TRStatusVariant.info => info,
    TRStatusVariant.success => success,
    TRStatusVariant.warning => warning,
    TRStatusVariant.danger => danger,
  };

  /// Returns the status surface color for [variant].
  Color surfaceForStatus(TRStatusVariant variant, {bool subtle = false}) {
    if (subtle || variant == TRStatusVariant.neutral) {
      return switch (variant) {
        TRStatusVariant.neutral => surfaceMuted,
        TRStatusVariant.info => infoSurface,
        TRStatusVariant.success => successSurface,
        TRStatusVariant.warning => warningSurface,
        TRStatusVariant.danger => dangerSurface,
      };
    }
    final generated = surface == TRGeneratedColors.dark.surface
        ? TRGeneratedColors.dark
        : TRGeneratedColors.light;
    return switch (variant) {
      TRStatusVariant.neutral => surfaceMuted,
      TRStatusVariant.info => generated.infoSurface,
      TRStatusVariant.success => generated.successSurface,
      TRStatusVariant.warning => generated.warningSurface,
      TRStatusVariant.danger => generated.dangerSurface,
    };
  }

  /// Returns the semantic border color for a status [variant].
  Color borderForStatus(TRStatusVariant variant) => switch (variant) {
    TRStatusVariant.neutral => border,
    TRStatusVariant.info => infoBorder,
    TRStatusVariant.success => successBorder,
    TRStatusVariant.warning => warningBorder,
    TRStatusVariant.danger => dangerBorder,
  };

  @override
  TinyrackThemeData copyWith({
    Color? surface,
    Color? surfaceMuted,
    Color? surfaceHover,
    Color? surfaceSelected,
    Color? surfacePressed,
    Color? scrim,
    Color? text,
    Color? textMuted,
    Color? textPlaceholder,
    Color? textInverse,
    Color? border,
    Color? borderStrong,
    Color? infoBorder,
    Color? successBorder,
    Color? warningBorder,
    Color? dangerBorder,
    Color? focus,
    Color? primary,
    Color? onPrimary,
    Color? info,
    Color? infoSurface,
    Color? success,
    Color? successSurface,
    Color? warning,
    Color? warningSurface,
    Color? danger,
    Color? dangerSurface,
  }) {
    return TinyrackThemeData(
      surface: surface ?? this.surface,
      surfaceMuted: surfaceMuted ?? this.surfaceMuted,
      surfaceHover: surfaceHover ?? this.surfaceHover,
      surfaceSelected: surfaceSelected ?? this.surfaceSelected,
      surfacePressed: surfacePressed ?? this.surfacePressed,
      scrim: scrim ?? this.scrim,
      text: text ?? this.text,
      textMuted: textMuted ?? this.textMuted,
      textPlaceholder: textPlaceholder ?? this.textPlaceholder,
      textInverse: textInverse ?? this.textInverse,
      border: border ?? this.border,
      borderStrong: borderStrong ?? this.borderStrong,
      infoBorder: infoBorder ?? this.infoBorder,
      successBorder: successBorder ?? this.successBorder,
      warningBorder: warningBorder ?? this.warningBorder,
      dangerBorder: dangerBorder ?? this.dangerBorder,
      focus: focus ?? this.focus,
      primary: primary ?? this.primary,
      onPrimary: onPrimary ?? this.onPrimary,
      info: info ?? this.info,
      infoSurface: infoSurface ?? this.infoSurface,
      success: success ?? this.success,
      successSurface: successSurface ?? this.successSurface,
      warning: warning ?? this.warning,
      warningSurface: warningSurface ?? this.warningSurface,
      danger: danger ?? this.danger,
      dangerSurface: dangerSurface ?? this.dangerSurface,
    );
  }

  @override
  TinyrackThemeData lerp(covariant TinyrackThemeData? other, double t) {
    if (other == null) return this;
    return TinyrackThemeData(
      surface: Color.lerp(surface, other.surface, t)!,
      surfaceMuted: Color.lerp(surfaceMuted, other.surfaceMuted, t)!,
      surfaceHover: Color.lerp(surfaceHover, other.surfaceHover, t)!,
      surfaceSelected: Color.lerp(surfaceSelected, other.surfaceSelected, t)!,
      surfacePressed: Color.lerp(surfacePressed, other.surfacePressed, t)!,
      scrim: Color.lerp(scrim, other.scrim, t)!,
      text: Color.lerp(text, other.text, t)!,
      textMuted: Color.lerp(textMuted, other.textMuted, t)!,
      textPlaceholder: Color.lerp(textPlaceholder, other.textPlaceholder, t)!,
      textInverse: Color.lerp(textInverse, other.textInverse, t)!,
      border: Color.lerp(border, other.border, t)!,
      borderStrong: Color.lerp(borderStrong, other.borderStrong, t)!,
      infoBorder: Color.lerp(infoBorder, other.infoBorder, t)!,
      successBorder: Color.lerp(successBorder, other.successBorder, t)!,
      warningBorder: Color.lerp(warningBorder, other.warningBorder, t)!,
      dangerBorder: Color.lerp(dangerBorder, other.dangerBorder, t)!,
      focus: Color.lerp(focus, other.focus, t)!,
      primary: Color.lerp(primary, other.primary, t)!,
      onPrimary: Color.lerp(onPrimary, other.onPrimary, t)!,
      info: Color.lerp(info, other.info, t)!,
      infoSurface: Color.lerp(infoSurface, other.infoSurface, t)!,
      success: Color.lerp(success, other.success, t)!,
      successSurface: Color.lerp(successSurface, other.successSurface, t)!,
      warning: Color.lerp(warning, other.warning, t)!,
      warningSurface: Color.lerp(warningSurface, other.warningSurface, t)!,
      danger: Color.lerp(danger, other.danger, t)!,
      dangerSurface: Color.lerp(dangerSurface, other.dangerSurface, t)!,
    );
  }
}

/// Accesses Tinyrack semantic colors from a build context.
extension TinyrackThemeContext on BuildContext {
  TinyrackThemeData get tinyrackTheme =>
      Theme.of(this).extension<TinyrackThemeData>()!;
}

/// Creates complete Material 3 themes backed by Tinyrack tokens.
abstract final class TinyrackTheme {
  static ThemeData light() => _theme(Brightness.light);
  static ThemeData dark() => _theme(Brightness.dark);

  static ThemeData _theme(Brightness brightness) {
    final isLight = brightness == Brightness.light;
    final generated = isLight
        ? TRGeneratedColors.light
        : TRGeneratedColors.dark;
    // The opposite mode's palette. `inverseSurface` is the other mode's
    // background, so the other mode's accent is the only one legible on it.
    final inverted = isLight ? TRGeneratedColors.dark : TRGeneratedColors.light;
    final colors = TinyrackThemeData._generated(generated);
    final textTheme = _textTheme(colors);
    // Every role Material reads must resolve to a token. An omitted role falls
    // back through `onBackground` to `onSurface` or to `surface`, which paints
    // dividers, muted metadata, and raised containers in the wrong token.
    final colorScheme = ColorScheme(
      brightness: brightness,
      primary: generated.primary,
      onPrimary: generated.onPrimary,
      // Tinyrack has no primary-tinted surface; `info` is the same blue scale.
      primaryContainer: generated.infoSurface,
      onPrimaryContainer: generated.primary,
      secondary: generated.textMuted,
      onSecondary: generated.surface,
      secondaryContainer: generated.surfaceMuted,
      onSecondaryContainer: generated.text,
      error: generated.danger,
      onError: generated.onDanger,
      // `TinyrackThemeData.dangerSurface` aliases the subtle tier, which is too
      // washed out to read as an error container. Take the full-strength token.
      errorContainer: generated.dangerSurface,
      onErrorContainer: generated.danger,
      surface: generated.surface,
      onSurface: generated.text,
      // Tinyrack has two neutral surfaces, so the five Material elevation tiers
      // collapse onto them. The direction holds in both modes: emphasis moves
      // light surfaces darker and dark surfaces lighter.
      surfaceContainerLowest: generated.surface,
      surfaceContainerLow: generated.surface,
      surfaceContainer: generated.surfaceMuted,
      surfaceContainerHigh: generated.surfaceMuted,
      surfaceContainerHighest: generated.surfaceMuted,
      // Unlike the tiers above, these two are defined as the darkest and
      // lightest surface regardless of mode, so they invert with brightness.
      surfaceDim: isLight ? generated.surfaceMuted : generated.surface,
      surfaceBright: isLight ? generated.surface : generated.surfaceMuted,
      onSurfaceVariant: generated.textMuted,
      // Material 3 reserves `outline` for boundaries that carry emphasis and
      // `outlineVariant` for decorative ones such as dividers, which is exactly
      // the split between the two Tinyrack border tiers.
      outline: generated.borderStrong,
      outlineVariant: generated.border,
      scrim: generated.scrim,
      inverseSurface: generated.surfaceInverse,
      onInverseSurface: generated.textInverse,
      inversePrimary: inverted.primary,
      // Tinyrack is a flat system: no surface carries an elevation tint, so a
      // consumer's plain Material must not pick up the primary-tinted default.
      surfaceTint: Colors.transparent,
      // `shadow` stays unset on purpose. Its opaque-black fallback is the
      // correct shadow color for both modes and matches the token shadows.
    );

    return ThemeData(
      brightness: brightness,
      canvasColor: colors.surface,
      colorScheme: colorScheme,
      // `ThemeData` derives this from `colorScheme.outline`, which would give
      // the legacy divider path a heavier tone than the Material 3 `Divider`.
      // Pin both to the same token `TRSeparator` uses.
      dividerColor: generated.border,
      extensions: [colors],
      fontFamily: TRGeneratedFontFamilies.body,
      fontFamilyFallback: TRGeneratedFontFamilies.fallback,
      scaffoldBackgroundColor: colors.surface,
      textTheme: textTheme,
      useMaterial3: true,
      // Material picks the ink sparkle on Android and the ripple everywhere
      // else, so the same press animates differently per platform and the
      // sparkle pulls in a fragment shader that a headless test environment
      // cannot always compile. Pin the ripple for the same reason the page
      // transitions are pinned below.
      splashFactory: InkRipple.splashFactory,
      // Every platform gets the same builder. Inheriting Material's per-platform
      // defaults would make a Tinyrack app animate differently on Android,
      // macOS, and Linux, and would leave the motion outside the token set.
      pageTransitionsTheme: const PageTransitionsTheme(
        builders: <TargetPlatform, PageTransitionsBuilder>{
          TargetPlatform.android: TRPageTransitionsBuilder(),
          TargetPlatform.fuchsia: TRPageTransitionsBuilder(),
          TargetPlatform.iOS: TRPageTransitionsBuilder(),
          TargetPlatform.linux: TRPageTransitionsBuilder(),
          TargetPlatform.macOS: TRPageTransitionsBuilder(),
          TargetPlatform.windows: TRPageTransitionsBuilder(),
        },
      ),
      // Material sizes a bare icon at 24, which is not a Tinyrack measurement.
      // Without this every icon outside a component that installs its own icon
      // theme renders off the scale, and consumers compensate with literals.
      iconTheme: IconThemeData(
        color: colors.text,
        size: TRGeneratedControlMetrics.mdIconSize,
      ),
      // Selection is otherwise drawn with Material's default accent, which is
      // outside the token set. The highlight paints behind the glyphs, so the
      // opaque selected-surface token is the right fill for it.
      textSelectionTheme: TextSelectionThemeData(
        cursorColor: colors.text,
        selectionColor: colors.surfaceSelected,
        selectionHandleColor: colors.focus,
      ),
      inputDecorationTheme: InputDecorationThemeData(
        filled: true,
        fillColor: colors.surface,
        border: OutlineInputBorder(
          borderRadius: const BorderRadius.all(
            Radius.circular(TRGeneratedRadii.md),
          ),
          borderSide: BorderSide(
            color: generated.controlBorder,
            width: TRGeneratedBorders.defaultWidth,
          ),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: const BorderRadius.all(
            Radius.circular(TRGeneratedRadii.md),
          ),
          borderSide: BorderSide(
            color: generated.controlBorder,
            width: TRGeneratedBorders.defaultWidth,
          ),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: const BorderRadius.all(
            Radius.circular(TRGeneratedRadii.md),
          ),
          borderSide: BorderSide(
            color: colors.focus,
            width: TRGeneratedBorders.focusWidth,
          ),
        ),
      ),
    );
  }

  static TextTheme _textTheme(TinyrackThemeData colors) {
    TextStyle style(TextStyle generated) => generated.copyWith(
      color: colors.text,
      fontFamilyFallback: TRGeneratedFontFamilies.fallback,
    );

    return TextTheme(
      bodySmall: style(TRGeneratedTextStyles.bodySm),
      bodyMedium: style(TRGeneratedTextStyles.body),
      bodyLarge: style(
        TRGeneratedTextStyles.body,
      ).copyWith(fontSize: TRGeneratedTypographySizes.lg),
      labelSmall: style(TRGeneratedTextStyles.label),
      labelMedium: style(
        TRGeneratedTextStyles.label,
      ).copyWith(fontSize: TRGeneratedTypographySizes.sm),
      labelLarge: style(
        TRGeneratedTextStyles.label,
      ).copyWith(fontSize: TRGeneratedTypographySizes.md),
      titleSmall: style(TRGeneratedTextStyles.headingSm),
      titleMedium: style(TRGeneratedTextStyles.headingMd),
      titleLarge: style(TRGeneratedTextStyles.headingLg),
      // Material's headline tier sits between `titleLarge` and `displaySmall`,
      // which Tinyrack already renders with the same style. Leaving these unset
      // gave them null metrics, so text sized by them fell back to the ambient
      // default instead of a token.
      headlineSmall: style(TRGeneratedTextStyles.headingLg),
      headlineMedium: style(TRGeneratedTextStyles.headingLg),
      headlineLarge: style(TRGeneratedTextStyles.headingLg),
      displaySmall: style(TRGeneratedTextStyles.headingLg),
      displayMedium: style(TRGeneratedTextStyles.display),
      displayLarge: style(TRGeneratedTextStyles.displayLg),
    );
  }
}
