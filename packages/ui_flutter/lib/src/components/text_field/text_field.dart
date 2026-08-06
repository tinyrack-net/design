import 'package:flutter/material.dart';

import '../../generated/tokens.g.dart';
import '../../internal/field_chrome.dart';
import '../../internal/form_registry.dart';
import '../../theme.dart';
import '../../tokens.dart';
import '../../types.dart';

// @tinyrack-preview text-field
/// A themed text input that preserves Flutter form and editing contracts.
class TRTextField extends StatelessWidget {
  const TRTextField({
    this.appearance = TRFieldAppearance.solid,
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
    this.minLines,
    this.name,
    this.obscureText = false,
    this.onChanged,
    this.onReset,
    this.onSaved,
    this.onSubmitted,
    this.placeholder,
    this.readOnly = false,
    this.restorationId,
    this.suffix,
    this.textInputAction,
    this.uiSize = TRUiSize.md,
    this.validator,
    super.key,
  }) : assert(
         controller == null || initialValue == null,
         'controller and initialValue cannot both be provided.',
       ),
       assert(
         minLines == null || maxLines == null || minLines <= maxLines,
         'minLines must not exceed maxLines.',
       ),
       assert(
         !obscureText || maxLines == 1,
         'obscured fields must use exactly one line.',
       );

  /// Whether the field paints a resting border and fill.
  ///
  /// [TRFieldAppearance.ghost] drops both so a host surface can frame the
  /// field. Unlike a bare surface, the field still paints its own hover,
  /// focus, and invalid emphasis.
  final TRFieldAppearance appearance;

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
  final int? minLines;
  final String? name;
  final bool obscureText;
  final ValueChanged<String>? onChanged;
  final VoidCallback? onReset;
  final FormFieldSetter<String>? onSaved;
  final ValueChanged<String>? onSubmitted;
  final String? placeholder;
  final bool readOnly;
  final String? restorationId;

  /// Trailing affordance rendered inside the field frame, such as a clear
  /// button. The decoration is unchanged when this is null.
  final Widget? suffix;
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
      appearance: appearance,
      enabled: enabled != false,
      error: errorText != null,
      fillColor: fillColor,
      focusNode: focusNode,
      readOnly: readOnly,
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
          // The default 48x48 minimum would inflate the control past its
          // token height, so the suffix keeps its intrinsic size.
          suffixIcon: suffix == null
              ? null
              : Padding(
                  padding: const EdgeInsetsDirectional.only(
                    end: TRGeneratedSpacing.xs,
                  ),
                  child: suffix,
                ),
          suffixIconConstraints: const BoxConstraints(),
        ),
        enabled: enabled,
        focusNode: resolvedFocusNode,
        initialValue: initialValue,
        keyboardType: keyboardType,
        maxLines: maxLines,
        minLines: minLines,
        obscureText: obscureText,
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
            spacing: TRGeneratedControlMetrics.mdGap,
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
    required this.appearance,
    required this.childBuilder,
    required this.enabled,
    required this.error,
    required this.fillColor,
    required this.readOnly,
    this.focusNode,
  });

  final TRFieldAppearance appearance;
  final Widget Function(FocusNode focusNode) childBuilder;
  final bool enabled;
  final bool error;
  final Color fillColor;
  final FocusNode? focusNode;
  final bool readOnly;

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
    final generated = Theme.of(context).brightness == Brightness.light
        ? TRGeneratedColors.light
        : TRGeneratedColors.dark;
    final focused = widget.enabled && _focusNode.hasFocus;
    final interactive = widget.enabled && !widget.readOnly;
    final chrome = resolveFieldChrome(
      appearance: widget.appearance,
      colors: theme,
      solidFill: widget.fillColor,
      solidBorderColor: widget.error
          ? theme.dangerBorder
          : focused
          ? theme.focus
          : generated.controlBorder,
      solidBorderWidth: focused
          ? TRGeneratedBorders.focusWidth
          : TRGeneratedBorders.defaultWidth,
      enabled: widget.enabled,
      error: widget.error,
      focused: focused,
      hovered: _hovered,
      readOnly: widget.readOnly,
    );
    final duration = MediaQuery.disableAnimationsOf(context)
        ? Duration.zero
        : TRMotion.fast;

    return MouseRegion(
      onEnter: interactive ? (_) => setState(() => _hovered = true) : null,
      onExit: interactive ? (_) => setState(() => _hovered = false) : null,
      child: AnimatedOpacity(
        curve: TRMotion.standard,
        duration: duration,
        opacity: widget.enabled ? 1 : TRGeneratedOpacity.disabled,
        child: AnimatedContainer(
          curve: TRMotion.standard,
          duration: duration,
          color: chrome.fill,
          // The border is painted in front so it never insets the field's
          // content, keeping both appearances on the same metrics.
          foregroundDecoration: BoxDecoration(
            border: Border.all(
              color: chrome.borderColor,
              width: chrome.borderWidth,
            ),
            borderRadius: BorderRadius.circular(TRGeneratedRadii.md),
          ),
          child: widget.childBuilder(_focusNode),
        ),
      ),
    );
  }
}
