import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:lucide_flutter/lucide_flutter.dart';
import '../../internal/focus_source.dart';
import '../../internal/forced_states.dart';

import '../../generated/tokens.g.dart';
import '../../theme.dart';
import '../../types.dart';
import '../button/button.dart';
import '../scroll_area/scroll_area.dart';

const double _edgeInset = 0;

/// A single tab within [TRTabs].
class TRTabsTab {
  const TRTabsTab({
    required this.value,
    required this.label,
    this.leading,
    this.onClose,
    this.closeLabel,
    this.disabled = false,
  }) : assert(
         onClose == null || closeLabel != null,
         'A closable tab needs closeLabel to name its close control.',
       );

  final String value;
  final String label;

  /// Optional status or type glyph shown before the label.
  ///
  /// Only [TRTabs.bar] renders it; the card tabs are label-only.
  final Widget? leading;

  /// Closes this tab.
  ///
  /// Only [TRTabs.bar] renders a close control, and only when this is set.
  final VoidCallback? onClose;

  /// Names the close control for assistive technology.
  final String? closeLabel;

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
  }) : leading = null,
       actions = const <Widget>[],
       semanticLabel = null,
       scrollController = null,
       _bar = false;

  /// A document-style tab bar: a scrollable strip of closable tabs.
  ///
  /// Unlike the card tabs, this leaves the body to its caller, so an
  /// application that already draws the active document from its own routing
  /// state does not have to hand that body back through [panelBuilder]. The
  /// strip owns its inset, its one-control height, and the hairline rule that
  /// separates it from whatever the caller draws below.
  const TRTabs.bar({
    required this.tabs,
    this.value,
    this.defaultValue,
    this.onValueChange,
    this.leading,
    this.actions = const <Widget>[],
    this.semanticLabel,
    this.scrollController,
    this.uiSize = TRUiSize.md,
    super.key,
  }) : panelBuilder = null,
       _bar = true;

  final List<TRTabsTab> tabs;

  /// Builds the panel below the tabs. Always null for [TRTabs.bar].
  final Widget Function(String value)? panelBuilder;
  final String? value;
  final String? defaultValue;
  final ValueChanged<String>? onValueChange;

  /// Control seated before the tabs, such as a back button.
  final Widget? leading;

  /// Controls seated after the tabs, such as a new-tab menu.
  final List<Widget> actions;

  /// Names the strip for assistive technology.
  final String? semanticLabel;

  /// Drives the horizontal scroll position of the strip.
  final ScrollController? scrollController;

  final TRUiSize uiSize;

  final bool _bar;

  @override
  State<TRTabs> createState() => _TRTabsState();
}

class _TRTabsState extends State<TRTabs> {
  late String? _uncontrolledValue = widget.defaultValue;
  ScrollController? _internalScrollController;

  /// The scrollbar and the list it decorates must share one controller, so a
  /// caller that does not supply one still gets a working scrollbar.
  ScrollController get _barScrollController =>
      widget.scrollController ??
      (_internalScrollController ??= ScrollController());

  @override
  void dispose() {
    _internalScrollController?.dispose();
    super.dispose();
  }

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
    if (widget._bar) return _buildBar(colors, active, tabHeight);
    final panelPadding = switch (widget.uiSize) {
      TRUiSize.sm => TRGeneratedSpacing.sm,
      TRUiSize.md => TRGeneratedSpacing.md,
      TRUiSize.lg => TRGeneratedSpacing.lg,
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
              child: widget.panelBuilder!(active),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildBar(TinyrackThemeData colors, String active, double tabHeight) {
    final strip = Row(
      children: [
        ?widget.leading,
        Expanded(
          child: TRScrollArea.forScrollable(
            axis: Axis.horizontal,
            autoHide: true,
            controller: _barScrollController,
            child: ListView(
              controller: _barScrollController,
              scrollDirection: Axis.horizontal,
              children: [
                for (final tab in widget.tabs)
                  _TRTabBarItem(
                    key: ValueKey<String>('tr-tabs-tab-${tab.value}'),
                    tab: tab,
                    selected: tab.value == active,
                    uiSize: widget.uiSize,
                    height: tabHeight,
                    onSelect: () => _select(tab.value),
                  ),
              ],
            ),
          ),
        ),
        ...widget.actions,
      ],
    );

    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      mainAxisSize: MainAxisSize.min,
      children: [
        SizedBox(
          height: tabHeight + TRGeneratedSpacing.sm * 2,
          child: Padding(
            padding: const EdgeInsets.symmetric(
              horizontal: TRGeneratedSpacing.md,
              vertical: TRGeneratedSpacing.sm,
            ),
            // The strip mixes tabs, their close buttons, and the caller's own
            // controls, so reading order is the only traversal that matches
            // what a sighted user sees.
            child: FocusTraversalGroup(
              policy: ReadingOrderTraversalPolicy(),
              child: widget.semanticLabel == null
                  ? strip
                  : Semantics(
                      container: true,
                      label: widget.semanticLabel,
                      child: strip,
                    ),
            ),
          ),
        ),
        SizedBox(
          height: TRGeneratedBorders.defaultWidth,
          child: ColoredBox(
            key: const ValueKey<String>('tr-tabs-bar-rule'),
            color: colors.border,
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

class _TRTabItemState extends State<_TRTabItem>
    with TRFocusSourceMixin, TRForcedStatesMixin {
  bool _hovered = false;
  bool _focused = false;
  bool _spaceDown = false;
  final _focusNode = FocusNode();

  /// Native tab buttons activate Space on key release.
  KeyEventResult _handleSpace(KeyEvent event, VoidCallback activate) {
    if (event.logicalKey != LogicalKeyboardKey.space) {
      return KeyEventResult.ignored;
    }
    if (event is KeyDownEvent) {
      _spaceDown = true;
    } else if (event is KeyUpEvent && _spaceDown) {
      _spaceDown = false;
      activate();
    }
    return KeyEventResult.handled;
  }

  @override
  void initState() {
    super.initState();
    initFocusSource();
  }

  @override
  void dispose() {
    disposeFocusSource();
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
    final showFocusRing = resolveFocusVisible(context, hasFocus: _focused);
    final motionDuration = MediaQuery.disableAnimationsOf(context)
        ? Duration.zero
        : TRGeneratedMotion.fast;

    return CallbackShortcuts(
      bindings: interactive
          ? {const SingleActivator(LogicalKeyboardKey.enter): widget.onSelect}
          : const {},
      child: MouseRegion(
        cursor: interactive ? SystemMouseCursors.click : MouseCursor.defer,
        onEnter: (_) => setState(() => _hovered = true),
        onExit: (_) => setState(() => _hovered = false),
        child: Focus(
          focusNode: _focusNode,
          onFocusChange: (focused) => setState(() => _focused = focused),
          onKeyEvent: interactive
              ? (node, event) => _handleSpace(event, widget.onSelect)
              : null,
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
                    AnimatedContainer(
                      curve: TRGeneratedMotion.standard,
                      duration: motionDuration,
                      decoration: BoxDecoration(
                        color: widget.selected
                            ? colors.surface
                            : resolveHovered(context, hovered: _hovered) &&
                                  interactive
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
                        padding: EdgeInsets.symmetric(
                          horizontal: paddingInline,
                        ),
                        child: Center(
                          widthFactor: 1,
                          child: AnimatedDefaultTextStyle(
                            curve: TRGeneratedMotion.standard,
                            duration: motionDuration,
                            style: TextStyle(
                              color: widget.selected
                                  ? colors.text
                                  : resolveHovered(
                                          context,
                                          hovered: _hovered,
                                        ) &&
                                        interactive
                                  ? colors.text
                                  : colors.textMuted,
                              fontFamily: TRGeneratedFontFamilies.body,
                              fontSize: fontSize,
                              fontWeight: widget.selected
                                  ? TRGeneratedFontWeights.bold
                                  : TRGeneratedFontWeights.medium,
                              height: lineHeight / fontSize,
                            ),
                            child: Text(widget.label),
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
      ),
    );
  }
}

/// One tab within [TRTabs.bar].
///
/// Shares the card tab's interaction contract — hover, traditional-only focus
/// ring, Enter, and Space on release — and differs only in what it paints and
/// in carrying a leading glyph and a close control.
class _TRTabBarItem extends StatefulWidget {
  const _TRTabBarItem({
    required this.tab,
    required this.selected,
    required this.uiSize,
    required this.height,
    required this.onSelect,
    super.key,
  });

  final TRTabsTab tab;
  final bool selected;
  final TRUiSize uiSize;
  final double height;
  final VoidCallback onSelect;

  @override
  State<_TRTabBarItem> createState() => _TRTabBarItemState();
}

class _TRTabBarItemState extends State<_TRTabBarItem>
    with TRFocusSourceMixin, TRForcedStatesMixin {
  bool _hovered = false;
  bool _focused = false;
  bool _spaceDown = false;
  final _focusNode = FocusNode();

  /// Native tab buttons activate Space on key release.
  KeyEventResult _handleSpace(KeyEvent event, VoidCallback activate) {
    if (event.logicalKey != LogicalKeyboardKey.space) {
      return KeyEventResult.ignored;
    }
    if (event is KeyDownEvent) {
      _spaceDown = true;
    } else if (event is KeyUpEvent && _spaceDown) {
      _spaceDown = false;
      activate();
    }
    return KeyEventResult.handled;
  }

  @override
  void initState() {
    super.initState();
    initFocusSource();
  }

  @override
  void dispose() {
    disposeFocusSource();
    _focusNode.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final colors = context.tinyrackTheme;
    final interactive = !widget.tab.disabled;
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
    final closeSize = switch (widget.uiSize) {
      TRUiSize.sm => TRUiSize.sm,
      TRUiSize.md => TRUiSize.sm,
      TRUiSize.lg => TRUiSize.md,
    };
    final showFocusRing = resolveFocusVisible(context, hasFocus: _focused);
    final motionDuration = MediaQuery.disableAnimationsOf(context)
        ? Duration.zero
        : TRGeneratedMotion.fast;

    return CallbackShortcuts(
      bindings: interactive
          ? {const SingleActivator(LogicalKeyboardKey.enter): widget.onSelect}
          : const {},
      child: MouseRegion(
        cursor: interactive ? SystemMouseCursors.click : MouseCursor.defer,
        onEnter: (_) => setState(() => _hovered = true),
        onExit: (_) => setState(() => _hovered = false),
        child: Focus(
          focusNode: _focusNode,
          onFocusChange: (focused) => setState(() => _focused = focused),
          onKeyEvent: interactive
              ? (node, event) => _handleSpace(event, widget.onSelect)
              : null,
          child: Semantics(
            button: true,
            enabled: interactive,
            selected: widget.selected,
            child: Opacity(
              opacity: widget.tab.disabled ? TRGeneratedOpacity.disabled : 1,
              child: SizedBox(
                width: TRGeneratedMeasurements.measureSm,
                height: widget.height,
                child: Stack(
                  children: [
                    AnimatedContainer(
                      curve: TRGeneratedMotion.standard,
                      duration: motionDuration,
                      decoration: BoxDecoration(
                        color: widget.selected
                            ? colors.surfaceSelected
                            : resolveHovered(context, hovered: _hovered) &&
                                  interactive
                            ? colors.surfaceHover
                            : null,
                        borderRadius: const BorderRadius.all(
                          Radius.circular(TRGeneratedRadii.md),
                        ),
                      ),
                      padding: const EdgeInsets.symmetric(
                        horizontal: TRGeneratedSpacing.sm,
                      ),
                      child: Row(
                        children: [
                          // Selecting covers the glyph and the label only. A
                          // close button under the same gesture would both
                          // swallow its own tap target and merge its name into
                          // the tab's for assistive technology.
                          Expanded(
                            child: GestureDetector(
                              behavior: HitTestBehavior.opaque,
                              onTap: interactive ? widget.onSelect : null,
                              child: Row(
                                children: [
                                  if (widget.tab.leading
                                      case final leading?) ...[
                                    IconTheme.merge(
                                      data: IconThemeData(
                                        color: colors.textMuted,
                                      ),
                                      child: leading,
                                    ),
                                    const SizedBox(
                                      width: TRGeneratedSpacing.sm,
                                    ),
                                  ],
                                  Expanded(
                                    child: AnimatedDefaultTextStyle(
                                      curve: TRGeneratedMotion.standard,
                                      duration: motionDuration,
                                      overflow: TextOverflow.ellipsis,
                                      maxLines: 1,
                                      style: TextStyle(
                                        color:
                                            widget.selected ||
                                                resolveHovered(
                                                  context,
                                                  hovered: _hovered,
                                                )
                                            ? colors.text
                                            : colors.textMuted,
                                        fontFamily:
                                            TRGeneratedFontFamilies.body,
                                        fontSize: fontSize,
                                        fontWeight: widget.selected
                                            ? TRGeneratedFontWeights.bold
                                            : TRGeneratedFontWeights.medium,
                                        height: lineHeight / fontSize,
                                      ),
                                      child: Text(widget.tab.label),
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ),
                          // The close button sits beside the label rather than
                          // over it, so a long label ellipsizes before it
                          // reaches the glyph instead of running under it.
                          if (widget.tab.onClose case final onClose?) ...[
                            const SizedBox(width: TRGeneratedSpacing.xs),
                            TRIconButton(
                              key: ValueKey<String>(
                                'tr-tabs-close-${widget.tab.value}',
                              ),
                              appearance: TRAppearance.ghost,
                              uiSize: closeSize,
                              label: widget.tab.closeLabel!,
                              onPressed: interactive ? onClose : null,
                              icon: const Icon(LucideIcons.x),
                            ),
                          ],
                        ],
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
                              borderRadius: const BorderRadius.all(
                                Radius.circular(TRGeneratedRadii.md),
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
      ),
    );
  }
}
