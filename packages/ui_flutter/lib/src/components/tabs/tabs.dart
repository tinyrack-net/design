import 'dart:math' as math;

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:lucide_flutter/lucide_flutter.dart';

import '../../generated/tokens.g.dart';
import '../../internal/focus_source.dart';
import '../../theme.dart';
import '../../types.dart';
import '../button/button.dart';
import '../scroll_area/scroll_area.dart';

/// Configures tab dragging for one [TRTabs] strip.
class TRTabsDragConfiguration {
  const TRTabsDragConfiguration({
    required this.groupId,
    required this.onDrop,
    this.canAccept,
  });

  /// Stable identity of the strip that owns the tabs.
  final String groupId;

  /// Reports an accepted drop, including its destination index.
  final ValueChanged<TRTabDropDetails> onDrop;

  /// Optionally rejects a tab before it enters this strip.
  final bool Function(String sourceGroupId, String value)? canAccept;
}

/// One accepted tab movement between tab strips.
class TRTabDropDetails {
  const TRTabDropDetails({
    required this.value,
    required this.sourceGroupId,
    required this.targetGroupId,
    required this.targetIndex,
  });

  final String value;
  final String sourceGroupId;
  final String targetGroupId;
  final int targetIndex;
}

final class _TRTabDragData {
  const _TRTabDragData({required this.groupId, required this.value});

  final String groupId;
  final String value;
}

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
  final Widget? leading;

  /// Closes this tab when provided.
  final VoidCallback? onClose;

  /// Names the close control for assistive technology.
  final String? closeLabel;

  final bool disabled;
}

// @tinyrack-preview tabs
/// A full-width tab strip with optional panels, controls, closing, and dragging.
class TRTabs extends StatefulWidget {
  const TRTabs({
    required this.tabs,
    this.panelBuilder,
    this.value,
    this.defaultValue,
    this.onValueChange,
    this.leading,
    this.actions = const <Widget>[],
    this.semanticLabel,
    this.scrollController,
    this.dragConfiguration,
    this.uiSize = TRUiSize.md,
    super.key,
  });

  final List<TRTabsTab> tabs;

  /// Builds the active panel below the strip when provided.
  ///
  /// Omit this when the application owns the active content separately.
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

  /// Enables reordering and cross-strip movement.
  final TRTabsDragConfiguration? dragConfiguration;

  final TRUiSize uiSize;

  @override
  State<TRTabs> createState() => _TRTabsState();
}

class _TRTabsState extends State<TRTabs> {
  late String? _uncontrolledValue = widget.defaultValue;
  ScrollController? _internalScrollController;
  final _dropTargetKey = GlobalKey();
  int? _dropIndex;

  /// The scrollbar and the list it decorates must share one controller, so a
  /// caller that does not supply one still gets a working scrollbar.
  ScrollController get _scrollController =>
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
    final strip = _buildStrip(colors, active, tabHeight);
    final panelBuilder = widget.panelBuilder;
    if (panelBuilder == null) return strip;

    final panelPadding = switch (widget.uiSize) {
      TRUiSize.sm => TRGeneratedSpacing.sm,
      TRUiSize.md => TRGeneratedSpacing.md,
      TRUiSize.lg => TRGeneratedSpacing.lg,
    };
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      mainAxisSize: MainAxisSize.min,
      children: <Widget>[
        strip,
        ColoredBox(
          color: colors.surface,
          child: Padding(
            padding: EdgeInsets.all(panelPadding),
            child: DefaultTextStyle.merge(
              style: TextStyle(
                color: colors.text,
                fontFamily: TRGeneratedFontFamilies.body,
                fontSize: TRGeneratedTypographySizes.sm,
                height: TRGeneratedTypographyLineHeights.md,
              ),
              child: panelBuilder(active),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildStrip(
    TinyrackThemeData colors,
    String active,
    double tabHeight,
  ) {
    final strip = Row(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: <Widget>[
        if (widget.leading case final leading?)
          _TRTabAccessory(
            border: BorderDirectional(end: BorderSide(color: colors.border)),
            child: leading,
          ),
        Expanded(
          child: LayoutBuilder(
            builder: (context, constraints) {
              final availableWidth = constraints.maxWidth;
              final tabExtent = widget.tabs.isEmpty
                  ? TRGeneratedMeasurements.measureSm
                  : math.max(
                      TRGeneratedMeasurements.measureSm,
                      availableWidth / widget.tabs.length,
                    );
              return _buildTabViewport(colors, active, tabHeight, tabExtent);
            },
          ),
        ),
        for (final action in widget.actions)
          _TRTabAccessory(
            border: BorderDirectional(start: BorderSide(color: colors.border)),
            child: action,
          ),
      ],
    );

    final accessibleStrip = FocusTraversalGroup(
      policy: ReadingOrderTraversalPolicy(),
      child: widget.semanticLabel == null
          ? strip
          : Semantics(
              container: true,
              label: widget.semanticLabel,
              child: strip,
            ),
    );
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      mainAxisSize: MainAxisSize.min,
      children: <Widget>[
        SizedBox(height: tabHeight, child: accessibleStrip),
        SizedBox(
          height: TRGeneratedBorders.defaultWidth,
          child: ColoredBox(
            key: const ValueKey<String>('tr-tabs-rule'),
            color: colors.border,
          ),
        ),
      ],
    );
  }

  Widget _buildTabViewport(
    TinyrackThemeData colors,
    String active,
    double tabHeight,
    double tabExtent,
  ) {
    Widget tabStrip = TRScrollArea.forScrollable(
      axis: Axis.horizontal,
      autoHide: true,
      controller: _scrollController,
      child: ListView.builder(
        controller: _scrollController,
        scrollDirection: Axis.horizontal,
        itemCount: widget.tabs.length,
        itemExtent: tabExtent,
        itemBuilder: (context, index) {
          final tab = widget.tabs[index];
          return _TRTabItem(
            key: ValueKey<String>('tr-tabs-tab-${tab.value}'),
            tab: tab,
            selected: tab.value == active,
            uiSize: widget.uiSize,
            height: tabHeight,
            width: tabExtent,
            dragConfiguration: widget.dragConfiguration,
            onSelect: () => _select(tab.value),
          );
        },
      ),
    );
    if (widget.dragConfiguration case final configuration?) {
      final undraggableStrip = tabStrip;
      tabStrip = DragTarget<_TRTabDragData>(
        key: _dropTargetKey,
        onWillAcceptWithDetails: (details) =>
            configuration.canAccept?.call(
              details.data.groupId,
              details.data.value,
            ) ??
            true,
        onMove: (details) {
          final box =
              _dropTargetKey.currentContext!.findRenderObject()! as RenderBox;
          final local = box.globalToLocal(details.offset);
          final direction = Directionality.of(context);
          final position = direction == TextDirection.ltr
              ? local.dx
              : box.size.width - local.dx;
          final scrolled = _scrollController.hasClients
              ? _scrollController.offset
              : 0.0;
          final index = ((position + scrolled) / tabExtent).floor().clamp(
            0,
            widget.tabs.length,
          );
          if (_dropIndex != index) setState(() => _dropIndex = index);
        },
        onLeave: (_) => setState(() => _dropIndex = null),
        onAcceptWithDetails: (details) {
          final index = _dropIndex ?? widget.tabs.length;
          configuration.onDrop(
            TRTabDropDetails(
              value: details.data.value,
              sourceGroupId: details.data.groupId,
              targetGroupId: configuration.groupId,
              targetIndex: index,
            ),
          );
          setState(() => _dropIndex = null);
        },
        builder: (context, candidates, rejected) => Stack(
          children: <Widget>[
            Positioned.fill(child: undraggableStrip),
            if (_dropIndex case final index?)
              PositionedDirectional(
                start:
                    index * tabExtent -
                    (_scrollController.hasClients
                        ? _scrollController.offset
                        : 0),
                child: IgnorePointer(
                  child: SizedBox(
                    height: tabHeight,
                    width: TRGeneratedBorders.strongWidth,
                    child: ColoredBox(color: colors.primary),
                  ),
                ),
              ),
          ],
        ),
      );
    }
    return tabStrip;
  }
}

class _TRTabAccessory extends StatelessWidget {
  const _TRTabAccessory({required this.border, required this.child});

  final BoxBorder border;
  final Widget child;

  @override
  Widget build(BuildContext context) => DecoratedBox(
    decoration: BoxDecoration(border: border),
    child: Center(child: child),
  );
}

class _TRTabItem extends StatefulWidget {
  const _TRTabItem({
    required this.tab,
    required this.selected,
    required this.uiSize,
    required this.height,
    required this.width,
    required this.onSelect,
    this.dragConfiguration,
    super.key,
  });

  final TRTabsTab tab;
  final bool selected;
  final TRUiSize uiSize;
  final double height;
  final double width;
  final VoidCallback onSelect;
  final TRTabsDragConfiguration? dragConfiguration;

  @override
  State<_TRTabItem> createState() => _TRTabItemState();
}

class _TRTabItemState extends State<_TRTabItem> with TRFocusSourceMixin {
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
    final showFocusRing = focusVisible(hasFocus: _focused);
    final motionDuration = MediaQuery.disableAnimationsOf(context)
        ? Duration.zero
        : TRGeneratedMotion.fast;

    final selection = GestureDetector(
      behavior: HitTestBehavior.opaque,
      onTap: interactive ? widget.onSelect : null,
      child: Row(
        children: <Widget>[
          if (widget.tab.leading case final leading?) ...<Widget>[
            IconTheme.merge(
              data: IconThemeData(
                color: widget.selected || _hovered
                    ? colors.text
                    : colors.textMuted,
              ),
              child: leading,
            ),
            const SizedBox(width: TRGeneratedSpacing.sm),
          ],
          Expanded(
            child: AnimatedDefaultTextStyle(
              curve: TRGeneratedMotion.standard,
              duration: motionDuration,
              overflow: TextOverflow.ellipsis,
              maxLines: 1,
              style: TextStyle(
                color: widget.selected || _hovered
                    ? colors.text
                    : colors.textMuted,
                fontFamily: TRGeneratedFontFamilies.body,
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
    );
    final draggableSelection = widget.dragConfiguration == null || !interactive
        ? selection
        : Draggable<_TRTabDragData>(
            data: _TRTabDragData(
              groupId: widget.dragConfiguration!.groupId,
              value: widget.tab.value,
            ),
            feedback: InheritedTheme.captureAll(
              context,
              Opacity(
                opacity: TRGeneratedOpacity.hover,
                child: SizedBox(
                  width: widget.width,
                  height: widget.height,
                  child: ColoredBox(
                    color: colors.surfaceSelected,
                    child: Center(child: Text(widget.tab.label)),
                  ),
                ),
              ),
            ),
            childWhenDragging: Opacity(
              opacity: TRGeneratedOpacity.disabled,
              child: selection,
            ),
            child: selection,
          );

    final tabContent = SizedBox(
      height: widget.height,
      child: Stack(
        children: <Widget>[
          AnimatedContainer(
            curve: TRGeneratedMotion.standard,
            duration: motionDuration,
            decoration: BoxDecoration(
              color: _hovered && interactive ? colors.surfaceHover : null,
              border: BorderDirectional(end: BorderSide(color: colors.border)),
            ),
            padding: const EdgeInsets.symmetric(
              horizontal: TRGeneratedSpacing.sm,
            ),
            child: Row(
              children: <Widget>[
                Expanded(child: draggableSelection),
                if (widget.tab.onClose case final onClose?) ...<Widget>[
                  const SizedBox(width: TRGeneratedSpacing.xs),
                  TRIconButton(
                    key: ValueKey<String>('tr-tabs-close-${widget.tab.value}'),
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
          if (widget.selected)
            PositionedDirectional(
              start: 0,
              end: 0,
              child: SizedBox(
                key: ValueKey<String>('tr-tabs-indicator-${widget.tab.value}'),
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
    );

    return CallbackShortcuts(
      bindings: interactive
          ? <ShortcutActivator, VoidCallback>{
              const SingleActivator(LogicalKeyboardKey.enter): widget.onSelect,
            }
          : const <ShortcutActivator, VoidCallback>{},
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
            child: widget.tab.disabled
                ? Opacity(
                    opacity: TRGeneratedOpacity.disabled,
                    child: tabContent,
                  )
                : tabContent,
          ),
        ),
      ),
    );
  }
}
