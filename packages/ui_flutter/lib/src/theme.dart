import 'package:flutter/material.dart';

import 'generated/tokens.g.dart';
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
    TRStatusVariant.neutral => borderStrong,
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
    final generated = brightness == Brightness.light
        ? TRGeneratedColors.light
        : TRGeneratedColors.dark;
    final colors = TinyrackThemeData._generated(generated);
    final textTheme = _textTheme(colors);
    final colorScheme = ColorScheme(
      brightness: brightness,
      primary: colors.primary,
      onPrimary: colors.onPrimary,
      secondary: colors.textMuted,
      onSecondary: colors.surface,
      error: colors.danger,
      onError: generated.onDanger,
      surface: colors.surface,
      onSurface: colors.text,
    );

    return ThemeData(
      brightness: brightness,
      colorScheme: colorScheme,
      extensions: [colors],
      fontFamily: TRGeneratedFontFamilies.body,
      fontFamilyFallback: TRGeneratedFontFamilies.fallback,
      scaffoldBackgroundColor: colors.surface,
      textTheme: textTheme,
      useMaterial3: true,
      inputDecorationTheme: InputDecorationThemeData(
        filled: true,
        fillColor: colors.surface,
        border: OutlineInputBorder(
          borderRadius: const BorderRadius.all(
            Radius.circular(TRGeneratedRadii.md),
          ),
          borderSide: BorderSide(
            color: colors.borderStrong,
            width: TRGeneratedBorders.defaultWidth,
          ),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: const BorderRadius.all(
            Radius.circular(TRGeneratedRadii.md),
          ),
          borderSide: BorderSide(
            color: colors.borderStrong,
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
      displaySmall: style(TRGeneratedTextStyles.headingLg),
      displayMedium: style(TRGeneratedTextStyles.display),
      displayLarge: style(TRGeneratedTextStyles.displayLg),
    );
  }
}
