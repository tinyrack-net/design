import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../../generated/tokens.g.dart';
import '../../theme.dart';
import '../../tokens.dart';
import '../../types.dart';
import '../spinner/spinner.dart';

part 'button_interaction.dart';
part 'icon_button.dart';

// @tinyrack-preview button
// @tinyrack-preview icon-button
/// A Tinyrack command or form action.
class TRButton extends StatelessWidget {
  const TRButton({
    required this.child,
    required this.onPressed,
    this.appearance = TRAppearance.solid,
    this.autofocus = false,
    this.focusNode,
    this.intent = TRIntent.neutral,
    this.loading = false,
    this.loadingLabel,
    this.uiSize = TRUiSize.md,
    super.key,
  }) : _hideChildWhenLoading = false,
       _paddingOverride = null,
       _semanticLabel = null;

  const TRButton._(
    this._hideChildWhenLoading,
    this._paddingOverride,
    this._semanticLabel, {
    required this.child,
    required this.onPressed,
    required this.appearance,
    required this.intent,
    required this.loading,
    required this.loadingLabel,
    required this.uiSize,
  }) : autofocus = false,
       focusNode = null;

  final Widget child;
  final VoidCallback? onPressed;
  final TRAppearance appearance;
  final bool autofocus;
  final FocusNode? focusNode;
  final TRIntent intent;
  final bool loading;
  final String? loadingLabel;
  final TRUiSize uiSize;
  final bool _hideChildWhenLoading;
  final EdgeInsetsGeometry? _paddingOverride;
  final String? _semanticLabel;

  @override
  Widget build(BuildContext context) {
    final colors = context.tinyrackTheme;
    final foreground = colors.foregroundFor(intent);
    final generated = Theme.of(context).brightness == Brightness.light
        ? TRGeneratedColors.light
        : TRGeneratedColors.dark;
    final disabled = onPressed == null || loading;
    final size = switch (uiSize) {
      TRUiSize.sm => const Size(0, TRGeneratedControlMetrics.smHeight),
      TRUiSize.md => const Size(0, TRGeneratedControlMetrics.mdHeight),
      TRUiSize.lg => const Size(0, TRGeneratedControlMetrics.lgHeight),
    };
    final padding = switch (uiSize) {
      TRUiSize.sm => const EdgeInsets.symmetric(
        horizontal:
            TRGeneratedControlMetrics.smPaddingInline +
            TRGeneratedBorders.defaultWidth,
      ),
      TRUiSize.md => const EdgeInsets.symmetric(
        horizontal:
            TRGeneratedControlMetrics.mdPaddingInline +
            TRGeneratedBorders.defaultWidth,
      ),
      TRUiSize.lg => const EdgeInsets.symmetric(
        horizontal:
            TRGeneratedControlMetrics.lgPaddingInline +
            TRGeneratedBorders.defaultWidth,
      ),
    };
    final gap = switch (uiSize) {
      TRUiSize.sm => TRGeneratedControlMetrics.smGap,
      TRUiSize.md => TRGeneratedControlMetrics.mdGap,
      TRUiSize.lg => TRGeneratedControlMetrics.lgGap,
    };
    final buttonForeground = appearance == TRAppearance.solid
        ? switch (intent) {
            TRIntent.neutral => colors.text,
            TRIntent.primary => colors.onPrimary,
            TRIntent.info => generated.onInfo,
            TRIntent.success => generated.onSuccess,
            TRIntent.warning => generated.onWarning,
            TRIntent.danger => generated.onDanger,
          }
        : intent == TRIntent.neutral
        ? colors.textMuted
        : foreground;
    Color fill({required bool hovered, required bool pressed}) {
      if (appearance != TRAppearance.solid) {
        final hoverColor = switch (intent) {
          TRIntent.neutral || TRIntent.primary => generated.surfaceHover,
          TRIntent.info => generated.infoSurfaceHover,
          TRIntent.success => generated.successSurfaceHover,
          TRIntent.warning => generated.warningSurfaceHover,
          TRIntent.danger => generated.dangerSurfaceHover,
        };
        final pressedColor = switch (intent) {
          TRIntent.neutral || TRIntent.primary => generated.surfaceSelected,
          TRIntent.info => generated.infoSurfacePressed,
          TRIntent.success => generated.successSurfacePressed,
          TRIntent.warning => generated.warningSurfacePressed,
          TRIntent.danger => generated.dangerSurfacePressed,
        };
        if (pressed) return pressedColor;
        if (hovered) return hoverColor;
        return hoverColor.withValues(alpha: 0);
      }
      return switch (intent) {
        TRIntent.neutral =>
          pressed
              ? generated.surfaceSelected
              : hovered
              ? generated.surfaceHover
              : generated.surfaceMuted,
        TRIntent.primary =>
          pressed
              ? generated.primaryPressed
              : hovered
              ? generated.primaryHover
              : colors.primary,
        TRIntent.info =>
          pressed
              ? generated.infoPressed
              : hovered
              ? generated.infoHover
              : colors.info,
        TRIntent.success =>
          pressed
              ? generated.successPressed
              : hovered
              ? generated.successHover
              : colors.success,
        TRIntent.warning =>
          pressed
              ? generated.warningPressed
              : hovered
              ? generated.warningHover
              : colors.warning,
        TRIntent.danger =>
          pressed
              ? generated.dangerPressed
              : hovered
              ? generated.dangerHover
              : colors.danger,
      };
    }

    final borderColor = switch (intent) {
      TRIntent.neutral => generated.controlBorder,
      TRIntent.primary => colors.primary,
      TRIntent.info => generated.infoBorder,
      TRIntent.success => generated.successBorder,
      TRIntent.warning => generated.warningBorder,
      TRIntent.danger => generated.dangerBorder,
    };
    final motionDuration = MediaQuery.disableAnimationsOf(context)
        ? Duration.zero
        : TRMotion.fast;
    final style = ButtonStyle(
      animationDuration: Duration.zero,
      backgroundColor: const WidgetStatePropertyAll(Colors.transparent),
      elevation: const WidgetStatePropertyAll(0),
      foregroundColor: WidgetStatePropertyAll(buttonForeground),
      fixedSize: WidgetStatePropertyAll(Size.fromHeight(size.height)),
      minimumSize: WidgetStatePropertyAll(size),
      maximumSize: WidgetStatePropertyAll(Size(double.infinity, size.height)),
      overlayColor: const WidgetStatePropertyAll(Colors.transparent),
      padding: WidgetStatePropertyAll(_paddingOverride ?? padding),
      tapTargetSize: MaterialTapTargetSize.shrinkWrap,
      textStyle: WidgetStatePropertyAll(
        TextStyle(
          fontFamily: TRGeneratedFontFamilies.body,
          fontFamilyFallback: TRGeneratedFontFamilies.fallback,
          fontSize: switch (uiSize) {
            TRUiSize.sm => TRGeneratedControlMetrics.smFontSize,
            TRUiSize.md => TRGeneratedControlMetrics.mdFontSize,
            TRUiSize.lg => TRGeneratedControlMetrics.lgFontSize,
          },
          fontWeight: TRGeneratedFontWeights.medium,
          height: TRGeneratedTypographyLineHeights.sm,
          letterSpacing: TRGeneratedTypographyTracking.none,
        ),
      ),
      side: WidgetStatePropertyAll(
        appearance != TRAppearance.ghost
            ? BorderSide(
                color: borderColor,
                width: TRGeneratedBorders.defaultWidth,
              )
            : BorderSide.none,
      ),
      shape: const WidgetStatePropertyAll(
        RoundedRectangleBorder(
          borderRadius: BorderRadius.all(Radius.circular(TRGeneratedRadii.md)),
        ),
      ),
    );
    final content = loading
        ? Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              ProgressIndicatorTheme(
                data: ProgressIndicatorThemeData(color: buttonForeground),
                child: const TRSpinner(uiSize: TRUiSize.sm),
              ),
              if (!_hideChildWhenLoading) ...[SizedBox(width: gap), child],
            ],
          )
        : child;
    return _TRButtonInteractionFrame(
      color: colors.focus,
      disabled: disabled,
      fill: fill,
      focusNode: focusNode,
      motionDuration: motionDuration,
      onActivate: onPressed,
      opacity: disabled ? TRGeneratedOpacity.disabled : 1,
      builder: (effectiveFocusNode, statesController) => Semantics(
        enabled: !disabled,
        label: loading ? loadingLabel : _semanticLabel,
        value: loading ? loadingLabel : null,
        child: switch (appearance) {
          TRAppearance.solid => FilledButton(
            autofocus: autofocus,
            focusNode: effectiveFocusNode,
            onPressed: disabled ? null : onPressed,
            statesController: statesController,
            style: style,
            child: content,
          ),
          TRAppearance.outline => OutlinedButton(
            autofocus: autofocus,
            focusNode: effectiveFocusNode,
            onPressed: disabled ? null : onPressed,
            statesController: statesController,
            style: style,
            child: content,
          ),
          TRAppearance.ghost => TextButton(
            autofocus: autofocus,
            focusNode: effectiveFocusNode,
            onPressed: disabled ? null : onPressed,
            statesController: statesController,
            style: style,
            child: content,
          ),
        },
      ),
    );
  }
}
