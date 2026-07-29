import 'package:flutter/material.dart';

import 'generated/tokens.g.dart';
import 'types.dart';

const _fontPackage = 'tinyrack_ui';
const _fontFallback = <String>[
  'packages/tinyrack_ui/IBMPlexSansKR',
  'packages/tinyrack_ui/IBMPlexSansJP',
];

/// Semantic colors available through the active [ThemeData].
@immutable
final class TinyrackThemeData extends ThemeExtension<TinyrackThemeData> {
  const TinyrackThemeData({
    required this.surface,
    required this.surfaceMuted,
    required this.surfaceHover,
    required this.text,
    required this.textMuted,
    required this.border,
    required this.borderStrong,
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
      text: colors.text,
      textMuted: colors.textMuted,
      border: colors.border,
      borderStrong: colors.borderStrong,
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
  final Color text;
  final Color textMuted;
  final Color border;
  final Color borderStrong;
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

  @override
  TinyrackThemeData copyWith({
    Color? surface,
    Color? surfaceMuted,
    Color? surfaceHover,
    Color? text,
    Color? textMuted,
    Color? border,
    Color? borderStrong,
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
      text: text ?? this.text,
      textMuted: textMuted ?? this.textMuted,
      border: border ?? this.border,
      borderStrong: borderStrong ?? this.borderStrong,
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
      text: Color.lerp(text, other.text, t)!,
      textMuted: Color.lerp(textMuted, other.textMuted, t)!,
      border: Color.lerp(border, other.border, t)!,
      borderStrong: Color.lerp(borderStrong, other.borderStrong, t)!,
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
      fontFamily: 'IBMPlexSans',
      fontFamilyFallback: _fontFallback,
      package: _fontPackage,
      scaffoldBackgroundColor: colors.surface,
      textTheme: textTheme,
      useMaterial3: true,
      inputDecorationTheme: InputDecorationThemeData(
        filled: true,
        fillColor: colors.surface,
        border: OutlineInputBorder(
          borderRadius: const BorderRadius.all(Radius.circular(6)),
          borderSide: BorderSide(color: colors.borderStrong),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: const BorderRadius.all(Radius.circular(6)),
          borderSide: BorderSide(color: colors.borderStrong),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: const BorderRadius.all(Radius.circular(6)),
          borderSide: BorderSide(color: colors.focus, width: 2),
        ),
      ),
    );
  }

  static TextTheme _textTheme(TinyrackThemeData colors) {
    TextStyle style(TextStyle generated) => generated.copyWith(
      color: colors.text,
      fontFamilyFallback: _fontFallback,
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
