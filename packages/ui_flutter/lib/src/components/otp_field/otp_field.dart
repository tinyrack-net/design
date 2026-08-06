import 'dart:math' as math;

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../../generated/tokens.g.dart';
import '../../internal/field_chrome.dart';
import '../../theme.dart';
import '../../types.dart';

typedef TROtpSeparatorBuilder =
    Widget Function(BuildContext context, int index);

/// Owns the text entered into a [TROtpField].
class TROtpFieldController extends ChangeNotifier {
  factory TROtpFieldController({String value = ''}) =>
      TROtpFieldController._(value);

  TROtpFieldController._(this._value);

  String _value;

  String get value => _value;

  set value(String value) {
    if (_value == value) return;
    _value = value;
    notifyListeners();
  }

  void clear() => value = '';
}

// @tinyrack-preview otp-field
/// A single accessible editing field rendered as a row of verification slots.
class TROtpField extends StatefulWidget {
  const TROtpField({
    this.allowedPattern,
    this.appearance = TRFieldAppearance.solid,
    this.autofocus = false,
    this.controller,
    this.defaultValue = '',
    this.enabled = true,
    this.errorText,
    this.helperText,
    this.label,
    this.length = 6,
    this.obscureText = false,
    this.onCompleted,
    this.onValueChange,
    this.readOnly = false,
    this.semanticLabel,
    this.separatorBuilder,
    this.uiSize = TRUiSize.md,
    super.key,
  }) : value = null,
       assert(length > 0);

  const TROtpField.controlled({
    required this.value,
    this.allowedPattern,
    this.appearance = TRFieldAppearance.solid,
    this.autofocus = false,
    this.controller,
    this.enabled = true,
    this.errorText,
    this.helperText,
    this.label,
    this.length = 6,
    this.obscureText = false,
    this.onCompleted,
    this.onValueChange,
    this.readOnly = false,
    this.semanticLabel,
    this.separatorBuilder,
    this.uiSize = TRUiSize.md,
    super.key,
  }) : defaultValue = '',
       assert(length > 0);

  static final RegExp _digits = RegExp('[0-9]');

  final Pattern? allowedPattern;

  /// Whether each slot paints a resting border and fill.
  ///
  /// [TRFieldAppearance.ghost] drops both so a host surface can frame the
  /// field. Unlike a bare surface, the active slot still paints its own focus
  /// and invalid emphasis.
  final TRFieldAppearance appearance;

  final bool autofocus;
  final TROtpFieldController? controller;
  final String defaultValue;
  final String? value;
  final bool enabled;
  final String? errorText;
  final String? helperText;
  final String? label;
  final int length;
  final bool obscureText;
  final ValueChanged<String>? onCompleted;
  final ValueChanged<String>? onValueChange;
  final bool readOnly;
  final String? semanticLabel;
  final TROtpSeparatorBuilder? separatorBuilder;
  final TRUiSize uiSize;

  @override
  State<TROtpField> createState() => _TROtpFieldState();
}

class _TROtpFieldState extends State<TROtpField> {
  TROtpFieldController? _internalController;
  late final TextEditingController _textController;
  late final FocusNode _focusNode;
  bool _focused = false;

  TROtpFieldController get _controller =>
      widget.controller ??
      (_internalController ??= TROtpFieldController(
        value: widget.defaultValue,
      ));

  String get _value => widget.value ?? _controller.value;

  @override
  void initState() {
    super.initState();
    _textController = TextEditingController(text: _value);
    _focusNode = FocusNode()..addListener(_handleFocusChange);
    _controller.addListener(_handleControllerChange);
  }

  @override
  void didUpdateWidget(TROtpField oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.controller != widget.controller) {
      (oldWidget.controller ?? _internalController)?.removeListener(
        _handleControllerChange,
      );
      if (widget.controller != null) {
        _internalController?.dispose();
        _internalController = null;
      }
      _controller.addListener(_handleControllerChange);
    }
    _syncText();
  }

  @override
  void dispose() {
    _focusNode.removeListener(_handleFocusChange);
    _focusNode.dispose();
    _textController.dispose();
    _controller.removeListener(_handleControllerChange);
    _internalController?.dispose();
    super.dispose();
  }

  void _handleFocusChange() => setState(() => _focused = _focusNode.hasFocus);

  void _handleControllerChange() {
    _syncText();
    if (mounted) setState(() {});
  }

  void _syncText() {
    final next = _value.characters.take(widget.length).toString();
    if (_textController.text == next) return;
    _textController.value = TextEditingValue(
      text: next,
      selection: TextSelection.collapsed(offset: next.length),
    );
  }

  void _change(String value) {
    final next = value.characters.take(widget.length).toString();
    if (widget.value == null) _controller.value = next;
    widget.onValueChange?.call(next);
    if (next.characters.length == widget.length) widget.onCompleted?.call(next);
    if (mounted) setState(() {});
  }

  @override
  Widget build(BuildContext context) {
    final colors = context.tinyrackTheme;
    final generated = Theme.of(context).brightness == Brightness.light
        ? TRGeneratedColors.light
        : TRGeneratedColors.dark;
    final characters = _value.characters.toList(growable: false);
    final activeIndex = math.min(characters.length, widget.length - 1);
    // Square slots track the shared control height scale, so an OTP field lines
    // up with a neighboring TRTextField or TRButton of the same uiSize.
    final slotSize = switch (widget.uiSize) {
      TRUiSize.sm => TRGeneratedControlMetrics.smHeight,
      TRUiSize.md => TRGeneratedControlMetrics.mdHeight,
      TRUiSize.lg => TRGeneratedControlMetrics.lgHeight,
    };
    final slotGap = switch (widget.uiSize) {
      TRUiSize.sm => TRGeneratedControlMetrics.smGap,
      TRUiSize.md => TRGeneratedControlMetrics.mdGap,
      TRUiSize.lg => TRGeneratedControlMetrics.lgGap,
    };
    final slots = GestureDetector(
      behavior: HitTestBehavior.opaque,
      onTap: widget.enabled
          ? () {
              _focusNode.requestFocus();
              _textController.selection = TextSelection.collapsed(
                offset: _textController.text.length,
              );
            }
          : null,
      child: SizedBox(
        height: slotSize,
        child: Stack(
          children: [
            ExcludeSemantics(
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  for (var index = 0; index < widget.length; index += 1) ...[
                    if (index > 0)
                      widget.separatorBuilder?.call(context, index - 1) ??
                          SizedBox(width: slotGap),
                    AnimatedContainer(
                      duration: MediaQuery.disableAnimationsOf(context)
                          ? Duration.zero
                          : TRGeneratedMotion.fast,
                      width: slotSize,
                      height: slotSize,
                      alignment: Alignment.center,
                      decoration: () {
                        final active = _focused && index == activeIndex;
                        final chrome = resolveFieldChrome(
                          appearance: widget.appearance,
                          colors: colors,
                          solidFill: widget.enabled
                              ? colors.surface
                              : colors.surfaceMuted,
                          solidBorderColor: widget.errorText != null
                              ? colors.dangerBorder
                              : active
                              ? colors.focus
                              : generated.controlBorder,
                          solidBorderWidth: active
                              ? TRGeneratedBorders.focusWidth
                              : TRGeneratedBorders.defaultWidth,
                          enabled: widget.enabled,
                          error: widget.errorText != null,
                          focused: active,
                          readOnly: widget.readOnly,
                        );
                        return BoxDecoration(
                          color: chrome.fill,
                          border: Border.all(
                            color: chrome.borderColor,
                            width: chrome.borderWidth,
                          ),
                          borderRadius: BorderRadius.circular(
                            TRGeneratedRadii.md,
                          ),
                        );
                      }(),
                      child: Text(
                        index < characters.length
                            ? widget.obscureText
                                  ? '•'
                                  : characters[index]
                            : '',
                        style: TRGeneratedTextStyles.headingSm.copyWith(
                          color: colors.text,
                          fontFamilyFallback: TRGeneratedFontFamilies.fallback,
                        ),
                      ),
                    ),
                  ],
                ],
              ),
            ),
            Positioned.fill(
              child: Opacity(
                opacity: TRGeneratedLayerMetrics.visuallyHiddenOpacity,
                alwaysIncludeSemantics: true,
                child: TextField(
                  autofillHints: const [AutofillHints.oneTimeCode],
                  autofocus: widget.autofocus,
                  controller: _textController,
                  enabled: widget.enabled,
                  focusNode: _focusNode,
                  inputFormatters: [
                    FilteringTextInputFormatter.allow(
                      widget.allowedPattern ?? TROtpField._digits,
                    ),
                    LengthLimitingTextInputFormatter(widget.length),
                  ],
                  keyboardType: TextInputType.number,
                  maxLength: widget.length,
                  onChanged: _change,
                  readOnly: widget.readOnly,
                  decoration: const InputDecoration(counterText: ''),
                ),
              ),
            ),
          ],
        ),
      ),
    );
    return Semantics(
      label: widget.semanticLabel ?? widget.label,
      textField: true,
      value: widget.obscureText ? null : _value,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        spacing: TRGeneratedControlMetrics.mdGap,
        children: [
          if (widget.label case final label?)
            Text(
              label.toUpperCase(),
              style: TRGeneratedTextStyles.label.copyWith(
                color: widget.enabled ? colors.text : colors.textMuted,
                fontFamilyFallback: TRGeneratedFontFamilies.fallback,
              ),
            ),
          slots,
          if (widget.errorText ?? widget.helperText case final supporting?)
            Text(
              supporting,
              style: TRGeneratedTextStyles.caption.copyWith(
                color: widget.errorText == null
                    ? colors.textMuted
                    : colors.danger,
                fontFamilyFallback: TRGeneratedFontFamilies.fallback,
              ),
            ),
        ],
      ),
    );
  }
}

/// Form-integrated [TROtpField].
class TROtpFieldFormField extends FormField<String> {
  TROtpFieldFormField({
    TRFieldAppearance appearance = TRFieldAppearance.solid,
    super.initialValue = '',
    super.autovalidateMode,
    super.enabled = true,
    String? helperText,
    String? label,
    int length = 6,
    ValueChanged<String>? onCompleted,
    ValueChanged<String>? onValueChange,
    super.onSaved,
    super.validator,
    super.restorationId,
    TRUiSize uiSize = TRUiSize.md,
    super.key,
  }) : super(
         builder: (field) => TROtpField.controlled(
           value: field.value ?? '',
           appearance: appearance,
           enabled: enabled,
           errorText: field.errorText,
           helperText: helperText,
           label: label,
           length: length,
           uiSize: uiSize,
           onCompleted: onCompleted,
           onValueChange: (value) {
             field.didChange(value);
             onValueChange?.call(value);
           },
         ),
       );
}
