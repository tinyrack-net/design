import 'package:flutter/material.dart';

import '../generated/tokens.g.dart';
import '../theme.dart';
import '../types.dart';

const double _edgeInset = 0;

/// A single tab within [TRTabs].
class TRTabsTab {
  const TRTabsTab({
    required this.value,
    required this.label,
    this.disabled = false,
  });

  final String value;
  final String label;
  final bool disabled;
}

// @tinyrack-preview tabs
/// Card-style tabs whose active tab joins the bordered content panel.
class TRTabs extends StatefulWidget {
  const TRTabs({
    required this.tabs,
    required this.panelBuilder,
    this.value,
    this.defaultValue,
    this.onValueChange,
    this.uiSize = TRUiSize.md,
    super.key,
  });

  final List<TRTabsTab> tabs;
  final Widget Function(String value) panelBuilder;
  final String? value;
  final String? defaultValue;
  final ValueChanged<String>? onValueChange;
  final TRUiSize uiSize;

  @override
  State<TRTabs> createState() => _TRTabsState();
}

class _TRTabsState extends State<TRTabs> {
  late String? _uncontrolledValue = widget.defaultValue;

  void _select(String value) {
    if (widget.value == null) setState(() => _uncontrolledValue = value);
    widget.onValueChange?.call(value);
  }

  @override
  Widget build(BuildContext context) {
    final colors = context.tinyrackTheme;
    final active =
        widget.value ??
        _uncontrolledValue ??
        (widget.tabs.isEmpty ? '' : widget.tabs.first.value);
    final tabHeight = switch (widget.uiSize) {
      TRUiSize.sm => TRGeneratedControlMetrics.smHeight,
      TRUiSize.md => TRGeneratedControlMetrics.mdHeight,
      TRUiSize.lg => TRGeneratedControlMetrics.lgHeight,
    };
    final panelPadding = switch (widget.uiSize) {
      TRUiSize.sm => TRGeneratedSpacing.md,
      TRUiSize.md => TRGeneratedSpacing.lg,
      TRUiSize.lg => TRGeneratedControlMetrics.lgPaddingInline,
    };

    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      mainAxisSize: MainAxisSize.min,
      children: [
        SizedBox(
          height: tabHeight,
          child: Stack(
            children: [
              Positioned(
                bottom: _edgeInset,
                left: _edgeInset,
                right: _edgeInset,
                child: SizedBox(
                  height: TRGeneratedBorders.defaultWidth,
                  child: ColoredBox(color: colors.border),
                ),
              ),
              Row(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  for (final tab in widget.tabs)
                    _TRTabItem(
                      label: tab.label,
                      disabled: tab.disabled,
                      selected: tab.value == active,
                      uiSize: widget.uiSize,
                      onSelect: () => _select(tab.value),
                    ),
                ],
              ),
            ],
          ),
        ),
        DecoratedBox(
          decoration: BoxDecoration(
            color: colors.surface,
            border: Border(
              left: BorderSide(color: colors.border),
              right: BorderSide(color: colors.border),
              bottom: BorderSide(color: colors.border),
            ),
            borderRadius: const BorderRadius.only(
              bottomLeft: Radius.circular(TRGeneratedRadii.md),
              bottomRight: Radius.circular(TRGeneratedRadii.md),
            ),
          ),
          child: Padding(
            padding: EdgeInsets.all(
              panelPadding + TRGeneratedBorders.defaultWidth,
            ),
            child: DefaultTextStyle.merge(
              style: TextStyle(
                color: colors.text,
                fontFamily: TRGeneratedFontFamilies.body,
                fontSize: TRGeneratedTypographySizes.sm,
                height: TRGeneratedTypographyLineHeights.md,
              ),
              child: widget.panelBuilder(active),
            ),
          ),
        ),
      ],
    );
  }
}

class _TRTabItem extends StatefulWidget {
  const _TRTabItem({
    required this.label,
    required this.disabled,
    required this.selected,
    required this.uiSize,
    required this.onSelect,
  });

  final String label;
  final bool disabled;
  final bool selected;
  final TRUiSize uiSize;
  final VoidCallback onSelect;

  @override
  State<_TRTabItem> createState() => _TRTabItemState();
}

class _TRTabItemState extends State<_TRTabItem> {
  bool _hovered = false;
  bool _focused = false;
  final _focusNode = FocusNode();

  @override
  void dispose() {
    _focusNode.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final colors = context.tinyrackTheme;
    final interactive = !widget.disabled;
    final fontSize = switch (widget.uiSize) {
      TRUiSize.sm => TRGeneratedControlMetrics.smFontSize,
      TRUiSize.md => TRGeneratedControlMetrics.mdFontSize,
      TRUiSize.lg => TRGeneratedControlMetrics.lgFontSize,
    };
    final lineHeight = switch (widget.uiSize) {
      TRUiSize.sm => TRGeneratedControlMetrics.smLineHeight,
      TRUiSize.md => TRGeneratedControlMetrics.mdLineHeight,
      TRUiSize.lg => TRGeneratedControlMetrics.lgLineHeight,
    };
    final paddingInline = switch (widget.uiSize) {
      TRUiSize.sm => TRGeneratedControlMetrics.smPaddingInline,
      TRUiSize.md => TRGeneratedControlMetrics.mdPaddingInline,
      TRUiSize.lg => TRGeneratedControlMetrics.lgPaddingInline,
    };
    final showFocusRing =
        _focused &&
        FocusManager.instance.highlightMode == FocusHighlightMode.traditional;

    return MouseRegion(
      cursor: interactive ? SystemMouseCursors.click : MouseCursor.defer,
      onEnter: (_) => setState(() => _hovered = true),
      onExit: (_) => setState(() => _hovered = false),
      child: Focus(
        focusNode: _focusNode,
        onFocusChange: (focused) => setState(() => _focused = focused),
        child: GestureDetector(
          behavior: HitTestBehavior.opaque,
          onTap: interactive ? widget.onSelect : null,
          child: Semantics(
            button: true,
            enabled: interactive,
            selected: widget.selected,
            child: Opacity(
              opacity: widget.disabled ? TRGeneratedOpacity.disabled : 1,
              child: Stack(
                children: [
                  DecoratedBox(
                    decoration: BoxDecoration(
                      color: widget.selected
                          ? colors.surface
                          : _hovered && interactive
                          ? colors.surfaceHover
                          : null,
                      border: Border(
                        top: BorderSide(
                          color: widget.selected
                              ? colors.border
                              : Colors.transparent,
                        ),
                        left: BorderSide(
                          color: widget.selected
                              ? colors.border
                              : Colors.transparent,
                        ),
                        right: BorderSide(
                          color: widget.selected
                              ? colors.border
                              : Colors.transparent,
                        ),
                      ),
                      borderRadius: const BorderRadius.only(
                        topLeft: Radius.circular(TRGeneratedRadii.md),
                        topRight: Radius.circular(TRGeneratedRadii.md),
                      ),
                    ),
                    child: Padding(
                      padding: EdgeInsets.symmetric(horizontal: paddingInline),
                      child: Center(
                        widthFactor: 1,
                        child: Text(
                          widget.label,
                          style: TextStyle(
                            color: widget.selected
                                ? colors.text
                                : _hovered && interactive
                                ? colors.text
                                : colors.textMuted,
                            fontFamily: TRGeneratedFontFamilies.body,
                            fontSize: fontSize,
                            fontWeight: widget.selected
                                ? TRGeneratedFontWeights.bold
                                : TRGeneratedFontWeights.medium,
                            height: lineHeight / fontSize,
                          ),
                        ),
                      ),
                    ),
                  ),
                  if (widget.selected)
                    Positioned(
                      bottom: _edgeInset,
                      left: _edgeInset,
                      right: _edgeInset,
                      child: SizedBox(
                        height: TRGeneratedBorders.strongWidth,
                        child: ColoredBox(color: colors.primary),
                      ),
                    ),
                  if (showFocusRing)
                    Positioned.fill(
                      child: IgnorePointer(
                        child: DecoratedBox(
                          decoration: BoxDecoration(
                            border: Border.all(
                              color: colors.focus,
                              width: TRGeneratedBorders.focusWidth,
                            ),
                          ),
                        ),
                      ),
                    ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
