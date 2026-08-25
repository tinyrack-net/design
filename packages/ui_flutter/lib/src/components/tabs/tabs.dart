import 'dart:math' as math;

import 'package:flutter/gestures.dart';
import 'package:material_ui/material_ui.dart';
import 'package:flutter/services.dart';

import '../../ui_density.dart';
import 'package:lucide_flutter/lucide_flutter.dart';

import '../../generated/tokens.g.dart';
import '../../internal/focus_source.dart';
import '../../internal/press_interaction.dart';
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

/// Claims a tab only once the pointer has travelled a deliberate distance.
///
/// A plain [Draggable] wins the gesture arena as soon as the pointer passes
/// its device hit slop, which is a single logical pixel for a mouse. A click
/// that drifts by a pixel would then start a drag and the tab would never
/// report a selection, so the press has to travel the drag start distance
/// before the drag takes over. Touch keeps the platform slop, which is already
/// coarse enough to click through.
class _TRTabDragPointerState extends MultiDragPointerState {
  _TRTabDragPointerState(
    super.initialPosition,
    super.kind,
    super.gestureSettings,
  );

  @override
  void checkForResolutionAfterMove() {
    final delta = pendingDelta;
    if (delta == null) return;
    final slop = math.max(
      computeHitSlop(kind, gestureSettings),
      TRGeneratedMeasurements.dragStartDistance,
    );
    if (delta.distance > slop) resolve(GestureDisposition.accepted);
  }

  @override
  void accepted(GestureMultiDragStartCallback starter) =>
      starter(initialPosition);
}

class _TRTabDragGestureRecognizer extends MultiDragGestureRecognizer {
  _TRTabDragGestureRecognizer({super.debugOwner, super.allowedButtonsFilter});

  @override
  MultiDragPointerState createNewPointerState(PointerDownEvent event) =>
      _TRTabDragPointerState(event.position, event.kind, gestureSettings);

  @override
  String get debugDescription => 'tab drag';
}

class _TRTabDraggable extends Draggable<_TRTabDragData> {
  const _TRTabDraggable({
    required super.data,
    required super.feedback,
    required super.child,
    super.childWhenDragging,
  });

  @override
  MultiDragGestureRecognizer createRecognizer(
    GestureMultiDragStartCallback onStart,
  ) => _TRTabDragGestureRecognizer(
    debugOwner: this,
    allowedButtonsFilter: allowedButtonsFilter,
  )..onStart = onStart;
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
    this.tabWidth = TRTabsWidth.fill,
    this.uiSize,
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

  /// Controls whether tabs divide the available width or use a fixed width.
  ///
  /// [TRTabsWidth.fixed] gives every tab `TRMeasurements.measureSm` logical
  /// pixels and lets the strip scroll when the tabs do not fit.
  final TRTabsWidth tabWidth;

  final TRUiSize? uiSize;

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
    final uiSize = TRUiDensityScope.resolveSize(context, widget.uiSize);
    final colors = context.tinyrackTheme;
    final active =
        widget.value ??
        _uncontrolledValue ??
        (widget.tabs.isEmpty ? '' : widget.tabs.first.value);
    final tabHeight = switch (uiSize) {
      TRUiSize.sm => TRGeneratedControlMetrics.smHeight,
      TRUiSize.md => TRGeneratedControlMetrics.mdHeight,
      TRUiSize.lg => TRGeneratedControlMetrics.lgHeight,
      TRUiSize.xl => TRGeneratedControlMetrics.xlHeight,
    };
    final stripHeight = tabHeight + TRGeneratedBorders.defaultWidth;
    final strip = _buildStrip(colors, active, tabHeight, stripHeight);
    final panelBuilder = widget.panelBuilder;
    if (panelBuilder == null) return strip;

    final panelPadding = switch (uiSize) {
      TRUiSize.sm => TRGeneratedSpacing.sm,
      TRUiSize.md => TRGeneratedSpacing.md,
      TRUiSize.lg => TRGeneratedSpacing.lg,
      TRUiSize.xl => TRGeneratedControlMetrics.xlPaddingInline,
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
    double stripHeight,
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
              final tabExtent = switch (widget.tabWidth) {
                TRTabsWidth.fixed => TRGeneratedMeasurements.measureSm,
                TRTabsWidth.fill =>
                  widget.tabs.isEmpty
                      ? TRGeneratedMeasurements.measureSm
                      : math.max(
                          TRGeneratedMeasurements.measureSm,
                          availableWidth / widget.tabs.length,
                        ),
              };
              return _buildTabViewport(
                colors,
                active,
                tabHeight,
                stripHeight,
                tabExtent,
              );
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
    return SizedBox(
      height: stripHeight,
      child: Stack(
        children: <Widget>[
          PositionedDirectional(
            top: tabHeight,
            start: 0,
            end: 0,
            child: SizedBox(
              height: TRGeneratedBorders.defaultWidth,
              child: ColoredBox(
                key: const ValueKey<String>('tr-tabs-rule'),
                color: colors.border,
              ),
            ),
          ),
          Positioned.fill(child: accessibleStrip),
        ],
      ),
    );
  }

  Widget _buildTabViewport(
    TinyrackThemeData colors,
    String active,
    double tabHeight,
    double stripHeight,
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
          final uiSize = TRUiDensityScope.resolveSize(context, widget.uiSize);
          final tab = widget.tabs[index];
          return _TRTabItem(
            key: ValueKey<String>('tr-tabs-tab-${tab.value}'),
            tab: tab,
            selected: tab.value == active,
            uiSize: uiSize,
            height: tabHeight,
            stripHeight: stripHeight,
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
                    height: stripHeight,
                    width: TRGeneratedBorders.strongWidth,
                    child: ColoredBox(color: colors.primaryForeground),
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
    required this.stripHeight,
    required this.width,
    required this.onSelect,
    this.dragConfiguration,
    super.key,
  });

  final TRTabsTab tab;
  final bool selected;
  final TRUiSize uiSize;
  final double height;
  final double stripHeight;
  final double width;
  final VoidCallback onSelect;
  final TRTabsDragConfiguration? dragConfiguration;

  @override
  State<_TRTabItem> createState() => _TRTabItemState();
}

class _TRTabItemState extends State<_TRTabItem>
    with TRFocusSourceMixin, TRTouchPressStateMixin<_TRTabItem> {
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
      TRUiSize.xl => TRGeneratedControlMetrics.xlFontSize,
    };
    final lineHeight = switch (widget.uiSize) {
      TRUiSize.sm => TRGeneratedControlMetrics.smLineHeight,
      TRUiSize.md => TRGeneratedControlMetrics.mdLineHeight,
      TRUiSize.lg => TRGeneratedControlMetrics.lgLineHeight,
      TRUiSize.xl => TRGeneratedControlMetrics.xlLineHeight,
    };
    final closeSize = switch (widget.uiSize) {
      TRUiSize.sm => TRUiSize.sm,
      TRUiSize.md => TRUiSize.sm,
      TRUiSize.lg => TRUiSize.md,
      TRUiSize.xl => TRUiSize.lg,
    };
    final showFocusRing = focusVisible(hasFocus: _focused);
    final motionDuration = touchPressed
        ? trPressedMotionDuration(context, pressed: true)
        : MediaQuery.disableAnimationsOf(context)
        ? Duration.zero
        : TRGeneratedMotion.fast;
    final motionCurve = touchPressed
        ? trPressedMotionCurve(pressed: true)
        : TRGeneratedMotion.standard;

    final label = Row(
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
    );

    final tabContent = SizedBox(
      height: widget.stripHeight,
      child: Stack(
        children: <Widget>[
          AnimatedContainer(
            curve: motionCurve,
            duration: motionDuration,
            height: widget.stripHeight,
            decoration: BoxDecoration(
              color: touchPressed && interactive
                  ? colors.surfacePressed
                  : _hovered && interactive
                  ? colors.surfaceHover
                  : null,
              border: BorderDirectional(end: BorderSide(color: colors.border)),
            ),
            padding: const EdgeInsets.symmetric(
              horizontal: TRGeneratedSpacing.sm,
            ),
            child: SizedBox(
              height: widget.height,
              child: Row(
                children: <Widget>[
                  Expanded(child: label),
                  if (widget.tab.onClose case final onClose?) ...<Widget>[
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
          ),
          if (widget.selected)
            PositionedDirectional(
              start: 0,
              end: 0,
              child: SizedBox(
                key: ValueKey<String>('tr-tabs-indicator-${widget.tab.value}'),
                height: TRGeneratedBorders.strongWidth,
                child: ColoredBox(color: colors.primaryForeground),
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

    // The whole cell selects, including its padding and the strip rule beneath
    // it, so a click anywhere the hover surface reacts to also switches tabs.
    // The close control sits deeper in the tree and still wins the arena.
    // The pointer surface stays out of the semantics tree so it cannot absorb
    // the close control's node; the tab reports its own tap action below.
    final selection = Listener(
      onPointerDown: interactive ? beginTouchPress : null,
      onPointerUp: interactive ? endTouchPress : null,
      onPointerCancel: interactive ? endTouchPress : null,
      child: GestureDetector(
        behavior: HitTestBehavior.opaque,
        excludeFromSemantics: true,
        onTapCancel: interactive ? cancelTouchPress : null,
        onTap: interactive ? widget.onSelect : null,
        child: tabContent,
      ),
    );
    final tabSurface = widget.dragConfiguration == null || !interactive
        ? selection
        : _TRTabDraggable(
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
                  height: widget.stripHeight,
                  child: ColoredBox(
                    color: colors.surfaceSelected,
                    child: Center(child: Text(widget.tab.label)),
                  ),
                ),
              ),
            ),
            childWhenDragging: Opacity(
              opacity: TRGeneratedOpacity.disabled,
              child: tabContent,
            ),
            child: selection,
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
            onTap: interactive ? widget.onSelect : null,
            child: widget.tab.disabled
                ? Opacity(
                    opacity: TRGeneratedOpacity.disabled,
                    child: tabSurface,
                  )
                : tabSurface,
          ),
        ),
      ),
    );
  }
}
