import 'package:flutter/material.dart';

import '../generated/tokens.g.dart';
import '../internal/form_registry.dart';
import '../theme.dart';
import '../tokens.dart';
import '../types.dart';

// @tinyrack-preview text-field
/// A themed text input that preserves Flutter form and editing contracts.
class TRTextField extends StatelessWidget {
  const TRTextField({
    this.autovalidateMode,
    this.autofillHints,
    this.autofocus = false,
    this.controller,
    this.enabled,
    this.errorText,
    this.focusNode,
    this.helperText,
    this.initialValue,
    this.keyboardType,
    this.label,
    this.maxLines = 1,
    this.name,
    this.onChanged,
    this.onReset,
    this.onSaved,
    this.onSubmitted,
    this.placeholder,
    this.readOnly = false,
    this.restorationId,
    this.textInputAction,
    this.uiSize = TRUiSize.md,
    this.validator,
    super.key,
  }) : assert(
         controller == null || initialValue == null,
         'controller and initialValue cannot both be provided.',
       );

  final AutovalidateMode? autovalidateMode;
  final Iterable<String>? autofillHints;
  final bool autofocus;
  final TextEditingController? controller;
  final bool? enabled;
  final String? errorText;
  final FocusNode? focusNode;
  final String? helperText;
  final String? initialValue;
  final TextInputType? keyboardType;
  final String? label;
  final int? maxLines;
  final String? name;
  final ValueChanged<String>? onChanged;
  final VoidCallback? onReset;
  final FormFieldSetter<String>? onSaved;
  final ValueChanged<String>? onSubmitted;
  final String? placeholder;
  final bool readOnly;
  final String? restorationId;
  final TextInputAction? textInputAction;
  final TRUiSize uiSize;
  final FormFieldValidator<String>? validator;

  @override
  Widget build(BuildContext context) {
    var registeredValue = controller?.text ?? initialValue ?? '';
    final controlHeight = switch (uiSize) {
      TRUiSize.sm => TRGeneratedControlMetrics.smHeight,
      TRUiSize.md => TRGeneratedControlMetrics.mdHeight,
      TRUiSize.lg => TRGeneratedControlMetrics.lgHeight,
    };
    final horizontalPadding =
        switch (uiSize) {
          TRUiSize.sm => TRGeneratedControlMetrics.smPaddingInline,
          TRUiSize.md => TRGeneratedControlMetrics.mdPaddingInline,
          TRUiSize.lg => TRGeneratedControlMetrics.lgPaddingInline,
        } -
        TRGeneratedFlutterRendering.textFieldPaddingInlineCorrection;
    final fontSize = switch (uiSize) {
      TRUiSize.sm => TRGeneratedControlMetrics.smFontSize,
      TRUiSize.md => TRGeneratedControlMetrics.mdFontSize,
      TRUiSize.lg => TRGeneratedControlMetrics.lgFontSize,
    };
    final verticalPadding =
        (controlHeight - fontSize * TRGeneratedTypographyLineHeights.sm) / 2 +
        TRGeneratedFlutterRendering.textFieldPaddingBlockCorrection;
    final fillColor = readOnly || enabled == false
        ? context.tinyrackTheme.surfaceMuted
        : context.tinyrackTheme.surface;
    final textField = _TRTextFieldInteractionFrame(
      enabled: enabled != false,
      error: errorText != null,
      fillColor: fillColor,
      focusNode: focusNode,
      childBuilder: (resolvedFocusNode) => TextFormField(
        autovalidateMode: autovalidateMode,
        autofillHints: autofillHints,
        autofocus: autofocus,
        controller: controller,
        decoration: InputDecoration(
          border: InputBorder.none,
          constraints: BoxConstraints(minHeight: controlHeight),
          contentPadding: EdgeInsets.symmetric(
            horizontal: horizontalPadding,
            vertical: verticalPadding,
          ),
          disabledBorder: InputBorder.none,
          enabledBorder: InputBorder.none,
          errorBorder: InputBorder.none,
          filled: false,
          focusedBorder: InputBorder.none,
          focusedErrorBorder: InputBorder.none,
          hintStyle: TextStyle(color: context.tinyrackTheme.textPlaceholder),
          hintText: placeholder,
          hoverColor: Colors.transparent,
          isCollapsed: true,
        ),
        enabled: enabled,
        focusNode: resolvedFocusNode,
        initialValue: initialValue,
        keyboardType: keyboardType,
        maxLines: maxLines,
        onChanged: (value) {
          registeredValue = value;
          onChanged?.call(value);
        },
        onSaved: onSaved,
        onFieldSubmitted: onSubmitted,
        readOnly: readOnly,
        restorationId: restorationId,
        textInputAction: textInputAction,
        style: TextStyle(
          fontFamily: TRGeneratedFontFamilies.body,
          fontSize: fontSize,
          height: TRGeneratedTypographyLineHeights.sm,
          letterSpacing: TRGeneratedTypographyTracking.none,
        ),
        validator: validator,
      ),
    );
    Widget control = textField;

    if (onReset != null) {
      // TextFormField does not expose FormField.onReset. This transparent
      // FormField participates in the same Form lifecycle without replacing
      // Flutter's text editing, validation, or restoration implementation.
      final resetControl = control;
      control = FormField<void>(onReset: onReset, builder: (_) => resetControl);
    }

    final supportingText = errorText ?? helperText;
    final result = label == null && supportingText == null
        ? control
        : Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisSize: MainAxisSize.min,
            spacing: TRGeneratedControlMetrics.smGap,
            children: [
              if (label case final label?)
                Text(
                  label.toUpperCase(),
                  strutStyle: const StrutStyle(
                    fontFamily: TRGeneratedFontFamilies.body,
                    fontSize: TRGeneratedTypographySizes.xs,
                    fontWeight: TRGeneratedFontWeights.strong,
                    forceStrutHeight: true,
                    height: TRGeneratedTypographyLineHeights.xs,
                  ),
                  style: TextStyle(
                    color: enabled == false
                        ? context.tinyrackTheme.textMuted
                        : context.tinyrackTheme.text,
                    fontFamily: TRGeneratedFontFamilies.body,
                    fontSize: TRGeneratedTypographySizes.xs,
                    fontWeight: TRGeneratedFontWeights.strong,
                    height: TRGeneratedTypographyLineHeights.xs,
                    letterSpacing:
                        TRGeneratedTypographyTracking.lg *
                        TRGeneratedTypographySizes.xs,
                  ),
                ),
              control,
              if (supportingText case final supportingText?)
                Text(
                  supportingText,
                  strutStyle: const StrutStyle(
                    fontFamily: TRGeneratedFontFamilies.body,
                    fontSize: TRGeneratedTypographySizes.xs,
                    forceStrutHeight: true,
                    height: TRGeneratedTypographyLineHeights.md,
                  ),
                  style: TextStyle(
                    color: errorText == null
                        ? context.tinyrackTheme.textMuted
                        : context.tinyrackTheme.danger,
                    fontFamily: TRGeneratedFontFamilies.body,
                    fontSize: TRGeneratedTypographySizes.xs,
                    height: TRGeneratedTypographyLineHeights.md,
                  ),
                ),
            ],
          );
    return TRFormRegistration(
      name: name,
      value: () => controller?.text ?? registeredValue,
      enabled: enabled != false,
      readOnly: readOnly,
      listenable: controller,
      child: result,
    );
  }
}

class _TRTextFieldInteractionFrame extends StatefulWidget {
  const _TRTextFieldInteractionFrame({
    required this.childBuilder,
    required this.enabled,
    required this.error,
    required this.fillColor,
    this.focusNode,
  });

  final Widget Function(FocusNode focusNode) childBuilder;
  final bool enabled;
  final bool error;
  final Color fillColor;
  final FocusNode? focusNode;

  @override
  State<_TRTextFieldInteractionFrame> createState() =>
      _TRTextFieldInteractionFrameState();
}

class _TRTextFieldInteractionFrameState
    extends State<_TRTextFieldInteractionFrame> {
  FocusNode? _internalFocusNode;
  bool _hovered = false;

  FocusNode get _focusNode =>
      widget.focusNode ?? (_internalFocusNode ??= FocusNode());

  @override
  void initState() {
    super.initState();
    _focusNode.addListener(_handleFocusChange);
  }

  @override
  void didUpdateWidget(_TRTextFieldInteractionFrame oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.focusNode == widget.focusNode) return;
    (oldWidget.focusNode ?? _internalFocusNode)?.removeListener(
      _handleFocusChange,
    );
    if (widget.focusNode != null) {
      _internalFocusNode?.dispose();
      _internalFocusNode = null;
    }
    _focusNode.addListener(_handleFocusChange);
  }

  @override
  void dispose() {
    _focusNode.removeListener(_handleFocusChange);
    _internalFocusNode?.dispose();
    super.dispose();
  }

  void _handleFocusChange() => setState(() {});

  @override
  Widget build(BuildContext context) {
    final theme = context.tinyrackTheme;
    final focused = widget.enabled && _focusNode.hasFocus;
    final borderColor = focused
        ? widget.error
              ? theme.dangerBorder
              : theme.focus
        : _hovered && widget.enabled
        ? theme.borderStrong
        : widget.error
        ? theme.dangerBorder
        : theme.borderStrong;
    final duration = MediaQuery.disableAnimationsOf(context)
        ? Duration.zero
        : TRMotion.fast;

    return MouseRegion(
      onEnter: widget.enabled ? (_) => setState(() => _hovered = true) : null,
      onExit: widget.enabled ? (_) => setState(() => _hovered = false) : null,
      child: AnimatedOpacity(
        curve: TRMotion.standard,
        duration: duration,
        opacity: widget.enabled ? 1 : TRGeneratedOpacity.disabled,
        child: AnimatedContainer(
          curve: TRMotion.standard,
          duration: duration,
          color: widget.fillColor,
          foregroundDecoration: BoxDecoration(
            border: Border.all(
              color: borderColor,
              width: focused
                  ? TRGeneratedBorders.focusWidth
                  : TRGeneratedBorders.defaultWidth,
            ),
            borderRadius: BorderRadius.circular(TRGeneratedRadii.md),
          ),
          child: widget.childBuilder(_focusNode),
        ),
      ),
    );
  }
}
