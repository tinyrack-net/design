import 'package:flutter/material.dart';

import '../types.dart';

// @tinyrack-preview text-field
/// A themed text input that preserves Flutter form and editing contracts.
class TRTextField extends StatelessWidget {
  const TRTextField({
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
    this.onSubmitted,
    this.placeholder,
    this.readOnly = false,
    this.textInputAction,
    this.uiSize = TRUiSize.md,
    super.key,
  });

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
  final ValueChanged<String>? onSubmitted;
  final String? placeholder;
  final bool readOnly;
  final TextInputAction? textInputAction;
  final TRUiSize uiSize;

  @override
  Widget build(BuildContext context) {
    final verticalPadding = switch (uiSize) {
      TRUiSize.sm => 8.0,
      TRUiSize.md => 12.0,
      TRUiSize.lg => 16.0,
    };
    return TextFormField(
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
      onFieldSubmitted: onSubmitted,
      readOnly: readOnly,
      textInputAction: textInputAction,
    );
  }
}
