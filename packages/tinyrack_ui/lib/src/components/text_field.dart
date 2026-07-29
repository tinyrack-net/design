import 'package:flutter/material.dart';

import '../generated/tokens.g.dart';
import '../theme.dart';
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
        4;
    final fontSize = switch (uiSize) {
      TRUiSize.sm || TRUiSize.md => TRGeneratedTypographySizes.sm,
      TRUiSize.lg => TRGeneratedTypographySizes.md,
    };
    final verticalPadding = (controlHeight - fontSize * 1.2) / 2 + 3;
    final textField = TextFormField(
      autovalidateMode: autovalidateMode,
      autofillHints: autofillHints,
      autofocus: autofocus,
      controller: controller,
      decoration: InputDecoration(
        constraints: BoxConstraints(minHeight: controlHeight),
        contentPadding: EdgeInsets.symmetric(
          horizontal: horizontalPadding,
          vertical: verticalPadding,
        ),
        fillColor: readOnly ? context.tinyrackTheme.surfaceMuted : null,
        hintStyle: TextStyle(color: context.tinyrackTheme.textPlaceholder),
        hintText: placeholder,
        isCollapsed: true,
      ),
      enabled: enabled,
      focusNode: focusNode,
      initialValue: initialValue,
      keyboardType: keyboardType,
      maxLines: maxLines,
      onChanged: onChanged,
      onSaved: onSaved,
      onFieldSubmitted: onSubmitted,
      readOnly: readOnly,
      restorationId: restorationId,
      textInputAction: textInputAction,
      style: TextStyle(
        fontFamily: 'packages/tinyrack_ui/IBMPlexSans',
        fontSize: fontSize,
        height: 1.2,
        letterSpacing: 0,
      ),
      validator: validator,
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
    if (label == null && supportingText == null) return control;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisSize: MainAxisSize.min,
      spacing: TRGeneratedControlMetrics.smGap,
      children: [
        if (label case final label?)
          Text(
            label.toUpperCase(),
            strutStyle: const StrutStyle(
              fontFamily: 'packages/tinyrack_ui/IBMPlexSans',
              fontSize: TRGeneratedTypographySizes.xs,
              fontWeight: FontWeight.w700,
              forceStrutHeight: true,
              height: 1,
            ),
            style: TextStyle(
              color: enabled == false
                  ? context.tinyrackTheme.textMuted
                  : context.tinyrackTheme.text,
              fontFamily: 'packages/tinyrack_ui/IBMPlexSans',
              fontSize: TRGeneratedTypographySizes.xs,
              fontWeight: FontWeight.w700,
              height: 1,
              letterSpacing: 0.96,
            ),
          ),
        control,
        if (supportingText case final supportingText?)
          Text(
            supportingText,
            strutStyle: const StrutStyle(
              fontFamily: 'packages/tinyrack_ui/IBMPlexSans',
              fontSize: TRGeneratedTypographySizes.xs,
              forceStrutHeight: true,
              height: 1.5,
            ),
            style: TextStyle(
              color: errorText == null
                  ? context.tinyrackTheme.textMuted
                  : context.tinyrackTheme.danger,
              fontFamily: 'packages/tinyrack_ui/IBMPlexSans',
              fontSize: TRGeneratedTypographySizes.xs,
              height: 1.5,
            ),
          ),
      ],
    );
  }
}
