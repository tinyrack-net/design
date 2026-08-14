import 'package:material_ui/material_ui.dart';
import 'package:flutter/services.dart';
import '../../internal/focus_source.dart';
import '../../internal/press_interaction.dart';

import '../../generated/tokens.g.dart';
import '../../theme.dart';
import '../../tokens.dart';

/// The edge of an adjacent surface a [TRCollapsible] visually attaches to.
///
/// An attached edge squares its corners and drops its border side, so the
/// collapsible reads as one surface with the neighbor that provides that
/// border — a drawer sitting on top of a card, for instance.
enum TRCollapsibleAttachedEdge {
  /// Free-standing: all four corners rounded, border on every side.
  none,

  /// Flush against a surface above: square top corners, no top border.
  top,

  /// Flush against a surface below: square bottom corners, no bottom border.
  bottom,
}

// @tinyrack-preview collapsible
/// A single disclosure panel that expands to reveal its content.
class TRCollapsible extends StatefulWidget {
  const TRCollapsible({
    required this.trigger,
    required this.content,
    this.open,
    this.defaultOpen = false,
    this.onOpenChange,
    this.disabled = false,
    this.attachedEdge = TRCollapsibleAttachedEdge.none,
    super.key,
  });

  final Widget trigger;
  final Widget content;
  final bool? open;
  final bool defaultOpen;
  final ValueChanged<bool>? onOpenChange;
  final bool disabled;

  /// The adjacent-surface edge this panel sits flush against.
  final TRCollapsibleAttachedEdge attachedEdge;

  @override
  State<TRCollapsible> createState() => _TRCollapsibleState();
}

class _TRCollapsibleState extends State<TRCollapsible>
    with TRFocusSourceMixin, TRTouchPressStateMixin<TRCollapsible> {
  late bool _uncontrolledOpen = widget.defaultOpen;
  bool _focused = false;
  bool _spaceDown = false;
  final _focusNode = FocusNode();

  /// Native disclosure buttons activate Space on key release.
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
    final generated = Theme.of(context).brightness == Brightness.light
        ? TRGeneratedColors.light
        : TRGeneratedColors.dark;
    final open = widget.open ?? _uncontrolledOpen;
    final interactive = !widget.disabled;

    void toggle() {
      if (!interactive) return;
      final next = !open;
      if (widget.open == null) setState(() => _uncontrolledOpen = next);
      widget.onOpenChange?.call(next);
    }

    final showFocusRing = focusVisible(hasFocus: _focused);
    final disableAnimations = MediaQuery.disableAnimationsOf(context);
    final motionDuration = disableAnimations ? Duration.zero : TRMotion.fast;
    final content = open
        ? DecoratedBox(
            decoration: BoxDecoration(
              border: Border(
                top: BorderSide(
                  color: generated.controlBorder,
                  width: TRGeneratedBorders.defaultWidth,
                ),
              ),
            ),
            child: Padding(
              // The divider and the root border paint inside; widen
              // the insets they overlap. An attached edge has no border,
              // so its inset stays at the plain token.
              padding: EdgeInsets.fromLTRB(
                TRGeneratedSpacing.lg + TRGeneratedBorders.defaultWidth,
                TRGeneratedSpacing.lg,
                TRGeneratedSpacing.lg + TRGeneratedBorders.defaultWidth,
                widget.attachedEdge == TRCollapsibleAttachedEdge.bottom
                    ? TRGeneratedSpacing.lg
                    : TRGeneratedSpacing.lg + TRGeneratedBorders.defaultWidth,
              ),
              child: DefaultTextStyle.merge(
                style: TextStyle(
                  color: colors.textMuted,
                  fontFamily: TRGeneratedFontFamilies.body,
                  fontSize: TRGeneratedTypographySizes.sm,
                  height: TRGeneratedTypographyLineHeights.md,
                ),
                child: widget.content,
              ),
            ),
          )
        : const SizedBox(width: double.infinity);

    final borderSide = BorderSide(
      color: generated.controlBorder,
      width: TRGeneratedBorders.defaultWidth,
    );
    const cornerRadius = Radius.circular(TRGeneratedRadii.md);
    final attachedTop = widget.attachedEdge == TRCollapsibleAttachedEdge.top;
    final attachedBottom =
        widget.attachedEdge == TRCollapsibleAttachedEdge.bottom;
    return DecoratedBox(
      decoration: BoxDecoration(
        color: colors.surface,
        border: Border(
          top: attachedTop ? BorderSide.none : borderSide,
          left: borderSide,
          right: borderSide,
          bottom: attachedBottom ? BorderSide.none : borderSide,
        ),
        borderRadius: BorderRadius.vertical(
          top: attachedTop ? Radius.zero : cornerRadius,
          bottom: attachedBottom ? Radius.zero : cornerRadius,
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        mainAxisSize: MainAxisSize.min,
        children: [
          CallbackShortcuts(
            bindings: interactive
                ? {const SingleActivator(LogicalKeyboardKey.enter): toggle}
                : const {},
            child: MouseRegion(
              cursor: interactive
                  ? SystemMouseCursors.click
                  : MouseCursor.defer,
              child: Focus(
                focusNode: _focusNode,
                onFocusChange: (focused) => setState(() => _focused = focused),
                onKeyEvent: interactive
                    ? (node, event) => _handleSpace(event, toggle)
                    : null,
                child: Listener(
                  onPointerDown: interactive ? beginTouchPress : null,
                  onPointerUp: interactive ? endTouchPress : null,
                  onPointerCancel: interactive ? endTouchPress : null,
                  child: GestureDetector(
                    behavior: HitTestBehavior.opaque,
                    onTapCancel: interactive ? cancelTouchPress : null,
                    onTap: interactive ? toggle : null,
                    child: AnimatedContainer(
                      curve: trPressedMotionCurve(pressed: touchPressed),
                      duration: trPressedMotionDuration(
                        context,
                        pressed: touchPressed,
                      ),
                      color: touchPressed ? colors.surfacePressed : null,
                      child: Semantics(
                        button: true,
                        enabled: interactive,
                        expanded: open,
                        child: AnimatedOpacity(
                          curve: TRMotion.standard,
                          duration: motionDuration,
                          opacity: widget.disabled
                              ? TRGeneratedOpacity.disabled
                              : 1,
                          child: CustomPaint(
                            foregroundPainter: _TRCollapsibleFocusRingPainter(
                              color: colors.focus,
                              visible: showFocusRing,
                            ),
                            child: ConstrainedBox(
                              constraints: const BoxConstraints(
                                minHeight: TRGeneratedControlMetrics.mdHeight,
                              ),
                              child: Padding(
                                // The decoration border paints inside; widen the
                                // insets it overlaps like CSS content-box sizing.
                                padding: EdgeInsets.fromLTRB(
                                  TRGeneratedSpacing.lg +
                                      TRGeneratedBorders.defaultWidth,
                                  widget.attachedEdge ==
                                          TRCollapsibleAttachedEdge.top
                                      ? TRGeneratedSpacing.md
                                      : TRGeneratedSpacing.md +
                                            TRGeneratedBorders.defaultWidth,
                                  TRGeneratedSpacing.lg +
                                      TRGeneratedBorders.defaultWidth,
                                  open ||
                                          widget.attachedEdge !=
                                              TRCollapsibleAttachedEdge.bottom
                                      ? TRGeneratedSpacing.md +
                                            TRGeneratedBorders.defaultWidth
                                      : TRGeneratedSpacing.md,
                                ),
                                child: Row(
                                  children: [
                                    Expanded(
                                      child: DefaultTextStyle.merge(
                                        style: TextStyle(
                                          color: colors.text,
                                          fontFamily:
                                              TRGeneratedFontFamilies.body,
                                          fontSize:
                                              TRGeneratedTypographySizes.sm,
                                          fontWeight:
                                              TRGeneratedFontWeights.medium,
                                          // The web summary inherits normal line
                                          // metrics.
                                          height: kTextHeightNone,
                                        ),
                                        child: widget.trigger,
                                      ),
                                    ),
                                    SizedBox(
                                      width: TRGeneratedControlMetrics.mdGap,
                                    ),
                                    AnimatedRotation(
                                      curve: TRMotion.standard,
                                      duration: motionDuration,
                                      turns: open ? 0.625 : 0.125,
                                      child: Container(
                                        height: TRGeneratedSpacing.sm,
                                        width: TRGeneratedSpacing.sm,
                                        decoration: BoxDecoration(
                                          border: Border(
                                            bottom: BorderSide(
                                              color: colors.text,
                                              width: TRGeneratedBorders
                                                  .strongWidth,
                                            ),
                                            right: BorderSide(
                                              color: colors.text,
                                              width: TRGeneratedBorders
                                                  .strongWidth,
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
                    ),
                  ),
                ),
              ),
            ),
          ),
          if (disableAnimations)
            content
          else
            AnimatedSize(
              curve: TRMotion.standard,
              duration: TRMotion.normal,
              child: content,
            ),
        ],
      ),
    );
  }
}

class _TRCollapsibleFocusRingPainter extends CustomPainter {
  const _TRCollapsibleFocusRingPainter({
    required this.color,
    required this.visible,
  });

  final Color color;
  final bool visible;

  @override
  void paint(Canvas canvas, Size size) {
    if (!visible) return;
    const width = TRGeneratedBorders.focusWidth;
    const offset = TRGeneratedBorders.focusOffset;
    final rect = (Offset.zero & size).deflate(offset + width / 2);
    canvas.drawRect(
      rect,
      Paint()
        ..color = color
        ..style = PaintingStyle.stroke
        ..strokeWidth = width,
    );
  }

  @override
  bool shouldRepaint(_TRCollapsibleFocusRingPainter oldDelegate) =>
      color != oldDelegate.color || visible != oldDelegate.visible;
}
