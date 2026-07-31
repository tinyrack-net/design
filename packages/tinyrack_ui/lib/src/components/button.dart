import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../generated/tokens.g.dart';
import '../theme.dart';
import '../tokens.dart';
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

class _TRButtonInteractionFrame extends StatefulWidget {
  const _TRButtonInteractionFrame({
    required this.builder,
    required this.color,
    required this.disabled,
    required this.fill,
    required this.motionDuration,
    required this.onActivate,
    required this.opacity,
    this.focusNode,
  });

  final Widget Function(
    FocusNode focusNode,
    WidgetStatesController statesController,
  )
  builder;
  final Color color;
  final bool disabled;
  final Color Function({required bool hovered, required bool pressed}) fill;
  final FocusNode? focusNode;
  final Duration motionDuration;
  final VoidCallback? onActivate;
  final double opacity;

  @override
  State<_TRButtonInteractionFrame> createState() =>
      _TRButtonInteractionFrameState();
}

class _TRButtonInteractionFrameState extends State<_TRButtonInteractionFrame> {
  FocusNode? _internalFocusNode;
  late final WidgetStatesController _statesController;
  bool _pointerDown = false;
  bool _spaceDown = false;
  bool _syncingDisabled = false;

  FocusNode get _focusNode =>
      widget.focusNode ?? (_internalFocusNode ??= FocusNode());

  bool get _showRing =>
      _focusNode.hasFocus &&
      FocusManager.instance.highlightMode == FocusHighlightMode.traditional;

  @override
  void initState() {
    super.initState();
    _statesController = WidgetStatesController({
      if (widget.disabled) WidgetState.disabled,
    });
    _focusNode.addListener(_handleFocusChange);
    _statesController.addListener(_handleStatesChange);
    HardwareKeyboard.instance.addHandler(_handleKeyEvent);
    FocusManager.instance.addHighlightModeListener(_handleHighlightModeChange);
  }

  @override
  void didUpdateWidget(_TRButtonInteractionFrame oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.disabled != widget.disabled) {
      if (widget.disabled) _spaceDown = false;
      _syncingDisabled = true;
      _statesController.update(WidgetState.disabled, widget.disabled);
      _syncingDisabled = false;
    }
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
    _statesController
      ..removeListener(_handleStatesChange)
      ..dispose();
    HardwareKeyboard.instance.removeHandler(_handleKeyEvent);
    FocusManager.instance.removeHighlightModeListener(
      _handleHighlightModeChange,
    );
    _internalFocusNode?.dispose();
    super.dispose();
  }

  void _handleFocusChange() {
    if (!_focusNode.hasFocus) _spaceDown = false;
    if (mounted) setState(() {});
  }

  void _handleStatesChange() {
    if (mounted && !_syncingDisabled) setState(() {});
  }

  void _handleHighlightModeChange(FocusHighlightMode _) {
    _handleFocusChange();
  }

  bool _handleKeyEvent(KeyEvent event) {
    if (event.logicalKey != LogicalKeyboardKey.space ||
        widget.disabled ||
        !_focusNode.hasFocus) {
      return false;
    }
    if (event is KeyDownEvent) {
      if (!_spaceDown) setState(() => _spaceDown = true);
      return true;
    }
    if (event is KeyUpEvent) {
      final shouldActivate = _spaceDown && _focusNode.hasFocus;
      setState(() => _spaceDown = false);
      if (shouldActivate) widget.onActivate?.call();
      return true;
    }
    return true;
  }

  @override
  Widget build(BuildContext context) {
    final pressed =
        !widget.disabled &&
        (_spaceDown ||
            (_pointerDown &&
                _statesController.value.contains(WidgetState.pressed)));
    final hovered =
        !widget.disabled &&
        _statesController.value.contains(WidgetState.hovered);
    final background = widget.fill(hovered: hovered, pressed: pressed);
    return Shortcuts(
      shortcuts: const {
        SingleActivator(LogicalKeyboardKey.space): DoNothingIntent(),
      },
      child: Listener(
        onPointerCancel: (_) => setState(() => _pointerDown = false),
        onPointerDown: widget.disabled
            ? null
            : (_) => setState(() => _pointerDown = true),
        onPointerUp: (_) => setState(() => _pointerDown = false),
        child: AnimatedContainer(
          curve: TRMotion.standard,
          duration: widget.motionDuration,
          transform: Matrix4.translationValues(
            0,
            pressed ? TRGeneratedMeasurements.controlPressDistance : 0,
            0,
          ),
          child: AnimatedOpacity(
            curve: TRMotion.standard,
            duration: widget.motionDuration,
            opacity: widget.opacity,
            child: AnimatedContainer(
              curve: TRMotion.standard,
              duration: widget.motionDuration,
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(TRGeneratedRadii.md),
                color: background,
              ),
              child: CustomPaint(
                foregroundPainter: _TRFocusRingPainter(
                  color: widget.color,
                  visible: _showRing,
                ),
                child: widget.builder(_focusNode, _statesController),
              ),
            ),
          ),
        ),
      ),
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
    const width = TRGeneratedBorders.focusWidth;
    const offset = TRGeneratedBorders.focusOffset;
    final rect = (Offset.zero & size).inflate(offset + width / 2);
    canvas.drawRRect(
      RRect.fromRectAndRadius(
        rect,
        const Radius.circular(
          TRGeneratedRadii.md +
              TRGeneratedBorders.focusOffset +
              TRGeneratedBorders.focusWidth / 2,
        ),
      ),
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
      TRUiSize.sm => TRGeneratedControlMetrics.smHeight,
      TRUiSize.md => TRGeneratedControlMetrics.mdHeight,
      TRUiSize.lg => TRGeneratedControlMetrics.lgHeight,
    };
    final iconSize = switch (uiSize) {
      TRUiSize.sm => TRGeneratedControlMetrics.smIconSize,
      TRUiSize.md => TRGeneratedControlMetrics.mdIconSize,
      TRUiSize.lg => TRGeneratedControlMetrics.lgIconSize,
    };
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
