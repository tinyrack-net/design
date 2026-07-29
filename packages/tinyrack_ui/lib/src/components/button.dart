import 'package:flutter/material.dart';

import '../generated/tokens.g.dart';
import '../theme.dart';
import '../types.dart';
import 'spinner.dart';

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
      TRUiSize.sm => const Size(0, 32),
      TRUiSize.md => const Size(0, 40),
      TRUiSize.lg => const Size(0, 48),
    };
    final padding = switch (uiSize) {
      TRUiSize.sm => const EdgeInsets.symmetric(horizontal: 13),
      TRUiSize.md => const EdgeInsets.symmetric(horizontal: 17),
      TRUiSize.lg => const EdgeInsets.symmetric(horizontal: 21),
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
        : foreground;
    Color fill({required bool hovered, required bool pressed}) {
      if (appearance != TRAppearance.solid) {
        if (!hovered && !pressed) return Colors.transparent;
        if (intent == TRIntent.neutral || intent == TRIntent.primary) {
          return pressed ? generated.surfaceSelected : generated.surfaceHover;
        }
        return switch (intent) {
          TRIntent.info =>
            pressed ? generated.infoSurfacePressed : generated.infoSurfaceHover,
          TRIntent.success =>
            pressed
                ? generated.successSurfacePressed
                : generated.successSurfaceHover,
          TRIntent.warning =>
            pressed
                ? generated.warningSurfacePressed
                : generated.warningSurfaceHover,
          TRIntent.danger =>
            pressed
                ? generated.dangerSurfacePressed
                : generated.dangerSurfaceHover,
          _ => Colors.transparent,
        };
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
    final style = ButtonStyle(
      animationDuration: Duration.zero,
      backgroundColor: WidgetStateProperty.resolveWith(
        (states) => fill(
          hovered: states.contains(WidgetState.hovered),
          pressed: states.contains(WidgetState.pressed),
        ),
      ),
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
          fontFamily: 'packages/tinyrack_ui/IBMPlexSans',
          fontSize: switch (uiSize) {
            TRUiSize.sm => TRGeneratedTypographySizes.sm,
            TRUiSize.md => TRGeneratedTypographySizes.sm,
            TRUiSize.lg => TRGeneratedTypographySizes.md,
          },
          fontWeight: FontWeight.w600,
          height: 1.2,
          letterSpacing: 0,
        ),
      ),
      side: WidgetStatePropertyAll(
        appearance != TRAppearance.ghost
            ? BorderSide(color: borderColor)
            : BorderSide.none,
      ),
      shape: const WidgetStatePropertyAll(
        RoundedRectangleBorder(
          borderRadius: BorderRadius.all(Radius.circular(6)),
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
    return Opacity(
      opacity: disabled ? TRGeneratedOpacity.disabled : 1,
      child: _TRButtonFocusRing(
        color: colors.focus,
        focusNode: focusNode,
        builder: (effectiveFocusNode) => Semantics(
          enabled: !disabled,
          label: loading ? loadingLabel : _semanticLabel,
          value: loading ? loadingLabel : null,
          child: switch (appearance) {
            TRAppearance.solid => FilledButton(
              autofocus: autofocus,
              focusNode: effectiveFocusNode,
              onPressed: disabled ? null : onPressed,
              style: style,
              child: content,
            ),
            TRAppearance.outline => OutlinedButton(
              autofocus: autofocus,
              focusNode: effectiveFocusNode,
              onPressed: disabled ? null : onPressed,
              style: style,
              child: content,
            ),
            TRAppearance.ghost => TextButton(
              autofocus: autofocus,
              focusNode: effectiveFocusNode,
              onPressed: disabled ? null : onPressed,
              style: style,
              child: content,
            ),
          },
        ),
      ),
    );
  }
}

class _TRButtonFocusRing extends StatefulWidget {
  const _TRButtonFocusRing({
    required this.builder,
    required this.color,
    this.focusNode,
  });

  final Widget Function(FocusNode focusNode) builder;
  final Color color;
  final FocusNode? focusNode;

  @override
  State<_TRButtonFocusRing> createState() => _TRButtonFocusRingState();
}

class _TRButtonFocusRingState extends State<_TRButtonFocusRing> {
  FocusNode? _internalFocusNode;

  FocusNode get _focusNode =>
      widget.focusNode ?? (_internalFocusNode ??= FocusNode());

  bool get _showRing =>
      _focusNode.hasFocus &&
      FocusManager.instance.highlightMode == FocusHighlightMode.traditional;

  @override
  void initState() {
    super.initState();
    _focusNode.addListener(_handleFocusChange);
    FocusManager.instance.addHighlightModeListener(_handleHighlightModeChange);
  }

  @override
  void didUpdateWidget(_TRButtonFocusRing oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.focusNode == widget.focusNode) return;
    (oldWidget.focusNode ?? _internalFocusNode)?.removeListener(
      _handleFocusChange,
    );
    _internalFocusNode?.dispose();
    _internalFocusNode = null;
    _focusNode.addListener(_handleFocusChange);
  }

  @override
  void dispose() {
    _focusNode.removeListener(_handleFocusChange);
    FocusManager.instance.removeHighlightModeListener(
      _handleHighlightModeChange,
    );
    _internalFocusNode?.dispose();
    super.dispose();
  }

  void _handleFocusChange() {
    if (mounted) setState(() {});
  }

  void _handleHighlightModeChange(FocusHighlightMode _) {
    _handleFocusChange();
  }

  @override
  Widget build(BuildContext context) {
    return CustomPaint(
      foregroundPainter: _TRFocusRingPainter(
        color: widget.color,
        visible: _showRing,
      ),
      child: widget.builder(_focusNode),
    );
  }
}

class _TRFocusRingPainter extends CustomPainter {
  const _TRFocusRingPainter({required this.color, required this.visible});

  final Color color;
  final bool visible;

  @override
  void paint(Canvas canvas, Size size) {
    if (!visible) return;
    const width = 2.0;
    const offset = 2.0;
    final rect = (Offset.zero & size).inflate(offset + width / 2);
    canvas.drawRRect(
      RRect.fromRectAndRadius(rect, const Radius.circular(9)),
      Paint()
        ..color = color
        ..style = PaintingStyle.stroke
        ..strokeWidth = width,
    );
  }

  @override
  bool shouldRepaint(_TRFocusRingPainter oldDelegate) =>
      color != oldDelegate.color || visible != oldDelegate.visible;
}

/// An icon-only Tinyrack action with a required accessible label.
class TRIconButton extends StatelessWidget {
  const TRIconButton({
    required this.icon,
    required this.label,
    required this.onPressed,
    this.appearance = TRAppearance.solid,
    this.intent = TRIntent.neutral,
    this.loading = false,
    this.loadingLabel,
    this.uiSize = TRUiSize.md,
    super.key,
  });

  final Widget icon;
  final String label;
  final VoidCallback? onPressed;
  final TRAppearance appearance;
  final TRIntent intent;
  final bool loading;
  final String? loadingLabel;
  final TRUiSize uiSize;

  @override
  Widget build(BuildContext context) {
    final size = switch (uiSize) {
      TRUiSize.sm => 32.0,
      TRUiSize.md => 40.0,
      TRUiSize.lg => 48.0,
    };
    final iconSize = uiSize == TRUiSize.lg ? 24.0 : 16.0;
    return SizedBox.square(
      dimension: size,
      child: TRButton._(
        true,
        EdgeInsets.zero,
        label,
        appearance: appearance,
        intent: intent,
        loading: loading,
        loadingLabel: loadingLabel ?? label,
        onPressed: onPressed,
        uiSize: uiSize,
        child: IconTheme.merge(
          data: IconThemeData(size: iconSize),
          child: icon,
        ),
      ),
    );
  }
}
