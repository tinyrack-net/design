import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../generated/tokens.g.dart';
import '../theme.dart';
import '../tokens.dart';

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
    super.key,
  });

  final Widget trigger;
  final Widget content;
  final bool? open;
  final bool defaultOpen;
  final ValueChanged<bool>? onOpenChange;
  final bool disabled;

  @override
  State<TRCollapsible> createState() => _TRCollapsibleState();
}

class _TRCollapsibleState extends State<TRCollapsible> {
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
  void dispose() {
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

    final showFocusRing =
        _focused &&
        FocusManager.instance.highlightMode == FocusHighlightMode.traditional;
    final disableAnimations = MediaQuery.disableAnimationsOf(context);
    final motionDuration = disableAnimations ? Duration.zero : TRMotion.fast;
    final sizeDuration = disableAnimations ? Duration.zero : TRMotion.normal;

    return DecoratedBox(
      decoration: BoxDecoration(
        color: colors.surface,
        border: Border.all(
          color: generated.controlBorder,
          width: TRGeneratedBorders.defaultWidth,
        ),
        borderRadius: BorderRadius.circular(TRGeneratedRadii.md),
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
                child: GestureDetector(
                  behavior: HitTestBehavior.opaque,
                  onTap: interactive ? toggle : null,
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
                              TRGeneratedSpacing.md +
                                  TRGeneratedBorders.defaultWidth,
                              TRGeneratedSpacing.lg +
                                  TRGeneratedBorders.defaultWidth,
                              open
                                  ? TRGeneratedSpacing.md
                                  : TRGeneratedSpacing.md +
                                        TRGeneratedBorders.defaultWidth,
                            ),
                            child: Row(
                              children: [
                                Expanded(
                                  child: DefaultTextStyle.merge(
                                    style: TextStyle(
                                      color: colors.text,
                                      fontFamily: TRGeneratedFontFamilies.body,
                                      fontSize: TRGeneratedTypographySizes.sm,
                                      fontWeight: TRGeneratedFontWeights.medium,
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
                                          width: TRGeneratedBorders.strongWidth,
                                        ),
                                        right: BorderSide(
                                          color: colors.text,
                                          width: TRGeneratedBorders.strongWidth,
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
          AnimatedSize(
            curve: TRMotion.standard,
            duration: sizeDuration,
            child: open
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
                      // the insets they overlap.
                      padding: const EdgeInsets.fromLTRB(
                        TRGeneratedSpacing.lg + TRGeneratedBorders.defaultWidth,
                        TRGeneratedSpacing.lg + TRGeneratedBorders.defaultWidth,
                        TRGeneratedSpacing.lg + TRGeneratedBorders.defaultWidth,
                        TRGeneratedSpacing.lg + TRGeneratedBorders.defaultWidth,
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
                : const SizedBox(width: double.infinity),
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
