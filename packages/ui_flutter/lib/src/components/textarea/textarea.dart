import 'package:material_ui/material_ui.dart';

import '../../ui_density.dart';
import '../../generated/tokens.g.dart';
import '../../internal/field_chrome.dart';
import '../../internal/focus_source.dart';
import '../../internal/form_registry.dart';
import '../../theme.dart';
import '../../tokens.dart';
import '../../types.dart';

// @tinyrack-preview textarea
/// A themed multi-line text input.
class TRTextarea extends StatefulWidget {
  const TRTextarea({
    this.appearance = TRFieldAppearance.solid,
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
    this.uiSize,
    super.key,
  }) : assert(
         controller == null || initialValue == null,
         'controller and initialValue cannot both be provided.',
       );

  /// Whether the textarea paints a resting border and fill.
  ///
  /// [TRFieldAppearance.ghost] drops both so a host surface can frame the
  /// textarea. Unlike a bare surface, the textarea still paints its own hover,
  /// focus, and invalid emphasis.
  final TRFieldAppearance appearance;

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

  /// Overrides the size supplied by [TRUiDensityScope].
  final TRUiSize? uiSize;

  @override
  State<TRTextarea> createState() => _TRTextareaState();
}

class _TRTextareaState extends State<TRTextarea> with TRFocusSourceMixin {
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
    initFocusSource();
    _focusNode.addListener(_handleFocusChange);
  }

  void _handleFocusChange() => setState(() => _focused = _focusNode.hasFocus);

  @override
  void dispose() {
    disposeFocusSource();
    _focusNode.removeListener(_handleFocusChange);
    _internalController?.dispose();
    _internalFocusNode?.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final uiSize = TRUiDensityScope.resolveSize(context, widget.uiSize);
    final colors = context.tinyrackTheme;
    final generated = Theme.of(context).brightness == Brightness.light
        ? TRGeneratedColors.light
        : TRGeneratedColors.dark;
    final controlHeight = switch (uiSize) {
      TRUiSize.sm => TRGeneratedControlMetrics.smHeight,
      TRUiSize.md => TRGeneratedControlMetrics.mdHeight,
      TRUiSize.lg => TRGeneratedControlMetrics.lgHeight,
      TRUiSize.xl => TRGeneratedControlMetrics.xlHeight,
    };
    final horizontalPadding = switch (uiSize) {
      TRUiSize.sm => TRGeneratedControlMetrics.smPaddingInline,
      TRUiSize.md => TRGeneratedControlMetrics.mdPaddingInline,
      TRUiSize.lg => TRGeneratedControlMetrics.lgPaddingInline,
      TRUiSize.xl => TRGeneratedControlMetrics.xlPaddingInline,
    };
    final fontSize = switch (uiSize) {
      TRUiSize.sm => TRGeneratedControlMetrics.smFontSize,
      TRUiSize.md => TRGeneratedControlMetrics.mdFontSize,
      TRUiSize.lg => TRGeneratedControlMetrics.lgFontSize,
      TRUiSize.xl => TRGeneratedControlMetrics.xlFontSize,
    };
    final interactive = widget.enabled && !widget.readOnly;
    // A field focused by a click paints no emphasis: `resolveFieldChrome` takes
    // the focus-visible state, not raw focus ownership.
    final focused = focusVisible(hasFocus: _focused);
    final chrome = resolveFieldChrome(
      appearance: widget.appearance,
      colors: colors,
      solidFill: widget.readOnly || !widget.enabled
          ? colors.surfaceMuted
          : colors.surface,
      solidBorderColor: focused
          ? colors.focus
          : _hovered && interactive
          ? generated.borderStrong
          : generated.controlBorder,
      solidBorderWidth: focused
          ? TRGeneratedBorders.focusWidth
          : TRGeneratedBorders.defaultWidth,
      enabled: widget.enabled,
      focused: focused,
      hovered: _hovered,
      readOnly: widget.readOnly,
    );
    final motionDuration = MediaQuery.disableAnimationsOf(context)
        ? Duration.zero
        : TRMotion.fast;

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
              decoration: BoxDecoration(
                color: chrome.fill,
                border: Border.all(
                  color: chrome.borderColor,
                  width: chrome.borderWidth,
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
