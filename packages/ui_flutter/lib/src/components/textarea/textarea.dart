import 'package:flutter/material.dart';

import '../../generated/tokens.g.dart';
import '../../internal/form_registry.dart';
import '../../theme.dart';
import '../../tokens.dart';
import '../../types.dart';

// @tinyrack-preview textarea
/// A themed multi-line text input.
class TRTextarea extends StatefulWidget {
  const TRTextarea({
    this.autofocus = false,
    this.controller,
    this.enabled = true,
    this.focusNode,
    this.initialValue,
    this.minLines = 2,
    this.name,
    this.onChanged,
    this.placeholder,
    this.readOnly = false,
    this.uiSize = TRUiSize.md,
    this.variant = TRTextInputVariant.defaultVariant,
    super.key,
  }) : assert(
         controller == null || initialValue == null,
         'controller and initialValue cannot both be provided.',
       );

  final bool autofocus;
  final TextEditingController? controller;
  final bool enabled;
  final FocusNode? focusNode;
  final String? initialValue;
  final int minLines;
  final String? name;
  final ValueChanged<String>? onChanged;
  final String? placeholder;
  final bool readOnly;
  final TRUiSize uiSize;

  /// Whether the textarea paints its own border and fill.
  ///
  /// [TRTextInputVariant.plain] drops both so a host surface can frame the
  /// textarea. The host then owns focus visibility; pass a [focusNode] to
  /// observe focus for that purpose.
  final TRTextInputVariant variant;

  @override
  State<TRTextarea> createState() => _TRTextareaState();
}

class _TRTextareaState extends State<TRTextarea> {
  TextEditingController? _internalController;
  FocusNode? _internalFocusNode;
  bool _hovered = false;
  bool _focused = false;

  TextEditingController get _controller =>
      widget.controller ??
      (_internalController ??= TextEditingController(
        text: widget.initialValue,
      ));

  FocusNode get _focusNode =>
      widget.focusNode ?? (_internalFocusNode ??= FocusNode());

  @override
  void initState() {
    super.initState();
    _focusNode.addListener(_handleFocusChange);
  }

  void _handleFocusChange() => setState(() => _focused = _focusNode.hasFocus);

  @override
  void dispose() {
    _focusNode.removeListener(_handleFocusChange);
    _internalController?.dispose();
    _internalFocusNode?.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final colors = context.tinyrackTheme;
    final generated = Theme.of(context).brightness == Brightness.light
        ? TRGeneratedColors.light
        : TRGeneratedColors.dark;
    final controlHeight = switch (widget.uiSize) {
      TRUiSize.md => TRGeneratedControlMetrics.mdHeight,
      TRUiSize.lg => TRGeneratedControlMetrics.lgHeight,
    };
    final horizontalPadding = switch (widget.uiSize) {
      TRUiSize.md => TRGeneratedControlMetrics.mdPaddingInline,
      TRUiSize.lg => TRGeneratedControlMetrics.lgPaddingInline,
    };
    final fontSize = switch (widget.uiSize) {
      TRUiSize.md => TRGeneratedControlMetrics.mdFontSize,
      TRUiSize.lg => TRGeneratedControlMetrics.lgFontSize,
    };
    final interactive = widget.enabled && !widget.readOnly;
    final borderColor = _focused
        ? colors.focus
        : _hovered && interactive
        ? colors.borderStrong
        : generated.controlBorder;
    final fillColor = widget.readOnly || !widget.enabled
        ? colors.surfaceMuted
        : colors.surface;
    final motionDuration = MediaQuery.disableAnimationsOf(context)
        ? Duration.zero
        : TRMotion.fast;
    // A plain textarea renders no chrome of its own so the host surface can
    // frame it; the fill would otherwise cover that surface.
    final plain = widget.variant == TRTextInputVariant.plain;

    return TRFormRegistration(
      name: widget.name,
      value: () => _controller.text,
      enabled: widget.enabled,
      readOnly: widget.readOnly,
      listenable: _controller,
      child: MouseRegion(
        onEnter: interactive ? (_) => setState(() => _hovered = true) : null,
        onExit: interactive ? (_) => setState(() => _hovered = false) : null,
        child: AnimatedOpacity(
          curve: TRMotion.standard,
          duration: motionDuration,
          opacity: widget.enabled ? 1 : TRGeneratedOpacity.disabled,
          // The border-box minimum matches the web `min-block-size`.
          child: ConstrainedBox(
            constraints: BoxConstraints(minHeight: controlHeight * 2),
            child: AnimatedContainer(
              curve: TRMotion.standard,
              duration: motionDuration,
              decoration: plain
                  ? null
                  : BoxDecoration(
                      color: fillColor,
                      border: Border.all(
                        color: borderColor,
                        width: _focused
                            ? TRGeneratedBorders.focusWidth
                            : TRGeneratedBorders.defaultWidth,
                      ),
                      borderRadius: BorderRadius.circular(TRGeneratedRadii.md),
                    ),
              padding: EdgeInsets.symmetric(
                horizontal: horizontalPadding,
                vertical: TRGeneratedSpacing.sm,
              ),
              child: TextField(
                controller: _controller,
                decoration: InputDecoration(
                  border: InputBorder.none,
                  disabledBorder: InputBorder.none,
                  enabledBorder: InputBorder.none,
                  filled: false,
                  focusedBorder: InputBorder.none,
                  hintStyle: TextStyle(color: colors.textPlaceholder),
                  hintText: widget.placeholder,
                  hoverColor: Colors.transparent,
                  isCollapsed: true,
                ),
                enabled: widget.enabled,
                focusNode: _focusNode,
                maxLines: null,
                minLines: widget.minLines,
                onChanged: widget.onChanged,
                readOnly: widget.readOnly,
                style: TextStyle(
                  fontFamily: TRGeneratedFontFamilies.body,
                  fontSize: fontSize,
                  height: TRGeneratedTypographyLineHeights.sm,
                  letterSpacing: TRGeneratedTypographyTracking.none,
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
