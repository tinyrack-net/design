import 'package:flutter/material.dart';

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
    final verticalPadding = switch (uiSize) {
      TRUiSize.sm => 8.0,
      TRUiSize.md => 12.0,
      TRUiSize.lg => 16.0,
    };
    final textField = TextFormField(
      autovalidateMode: autovalidateMode,
      autofillHints: autofillHints,
      autofocus: autofocus,
      controller: controller,
      decoration: InputDecoration(
        contentPadding: EdgeInsets.symmetric(
          horizontal: 12,
          vertical: verticalPadding,
        ),
        errorText: errorText,
        helperText: helperText,
        hintText: placeholder,
        labelText: label,
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
      validator: validator,
    );
    if (onReset == null) return textField;

    // TextFormField does not expose FormField.onReset. This transparent
    // FormField participates in the same Form lifecycle without replacing
    // Flutter's text editing, validation, or restoration implementation.
    return FormField<void>(onReset: onReset, builder: (_) => textField);
  }
}
