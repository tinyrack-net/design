import 'package:material_ui/material_ui.dart';
import 'package:flutter/services.dart';
import '../../internal/focus_source.dart';

import '../../generated/tokens.g.dart';
import '../../theme.dart';
import '../../tokens.dart';

/// A single disclosure item within [TRAccordion].
class TRAccordionItem {
  const TRAccordionItem({
    required this.value,
    required this.trigger,
    required this.content,
    this.disabled = false,
  });

  final String value;
  final Widget trigger;
  final Widget content;
  final bool disabled;
}

// @tinyrack-preview accordion
/// A bordered stack of disclosure items with coordinated open state.
class TRAccordion extends StatefulWidget {
  const TRAccordion({
    required this.items,
    this.value,
    this.defaultValue = const [],
    this.multiple = false,
    this.onValueChange,
    super.key,
  });

  final List<TRAccordionItem> items;
  final List<String>? value;
  final List<String> defaultValue;
  final bool multiple;
  final ValueChanged<List<String>>? onValueChange;

  @override
  State<TRAccordion> createState() => _TRAccordionState();
}

class _TRAccordionState extends State<TRAccordion> {
  late Set<String> _uncontrolledValue = widget.defaultValue.toSet();

  void _toggle(String value) {
    final current = widget.value?.toSet() ?? _uncontrolledValue;
    final next = <String>{...current};
    if (widget.multiple) {
      if (!next.add(value)) next.remove(value);
    } else {
      next
        ..clear()
        ..addAll(current.contains(value) ? const <String>{} : {value});
    }
    if (widget.value == null) setState(() => _uncontrolledValue = next);
    widget.onValueChange?.call(next.toList(growable: false));
  }

  @override
  Widget build(BuildContext context) {
    final generated = Theme.of(context).brightness == Brightness.light
        ? TRGeneratedColors.light
        : TRGeneratedColors.dark;
    final open = widget.value?.toSet() ?? _uncontrolledValue;
    final colors = context.tinyrackTheme;

    return DecoratedBox(
      decoration: BoxDecoration(
        color: colors.surface,
        border: Border.all(
          color: generated.controlBorder,
          width: TRGeneratedBorders.defaultWidth,
        ),
        borderRadius: BorderRadius.circular(TRGeneratedRadii.md),
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(TRGeneratedRadii.md),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          mainAxisSize: MainAxisSize.min,
          children: [
            for (var index = 0; index < widget.items.length; index += 1)
              _TRAccordionItemView(
                item: widget.items[index],
                open: open.contains(widget.items[index].value),
                showTopBorder: index > 0,
                isLast: index == widget.items.length - 1,
                onToggle: () => _toggle(widget.items[index].value),
              ),
          ],
        ),
      ),
    );
  }
}

class _TRAccordionItemView extends StatefulWidget {
  const _TRAccordionItemView({
    required this.item,
    required this.open,
    required this.showTopBorder,
    required this.isLast,
    required this.onToggle,
  });

  final TRAccordionItem item;
  final bool open;
  final bool showTopBorder;
  final bool isLast;
  final VoidCallback onToggle;

  @override
  State<_TRAccordionItemView> createState() => _TRAccordionItemViewState();
}

class _TRAccordionItemViewState extends State<_TRAccordionItemView>
    with TRFocusSourceMixin {
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
    final interactive = !widget.item.disabled;
    final showFocusRing = focusVisible(hasFocus: _focused);
    final disableAnimations = MediaQuery.disableAnimationsOf(context);
    final motionDuration = disableAnimations ? Duration.zero : TRMotion.fast;
    final sizeDuration = disableAnimations ? Duration.zero : TRMotion.normal;

    return DecoratedBox(
      decoration: BoxDecoration(
        color: widget.item.disabled ? colors.surfaceMuted : null,
        border: widget.showTopBorder
            ? Border(
                top: BorderSide(
                  color: generated.controlBorder,
                  width: TRGeneratedBorders.defaultWidth,
                ),
              )
            : null,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        mainAxisSize: MainAxisSize.min,
        children: [
          // The web accordion header is an <h3> whose user-agent block
          // margins stay part of the rendered layout; the borders painted
          // inside this box widen the margins they overlap.
          Padding(
            padding: EdgeInsets.only(
              top:
                  TRGeneratedFlutterRendering.accordionHeaderMarginBlock +
                  TRGeneratedBorders.defaultWidth,
              bottom:
                  TRGeneratedFlutterRendering.accordionHeaderMarginBlock +
                  (!widget.open && widget.isLast
                      ? TRGeneratedBorders.defaultWidth
                      : 0),
            ),
            child: CallbackShortcuts(
              bindings: interactive
                  ? {
                      const SingleActivator(LogicalKeyboardKey.enter):
                          widget.onToggle,
                    }
                  : const {},
              child: MouseRegion(
                cursor: interactive
                    ? SystemMouseCursors.click
                    : MouseCursor.defer,
                child: Focus(
                  focusNode: _focusNode,
                  onFocusChange: (focused) =>
                      setState(() => _focused = focused),
                  onKeyEvent: interactive
                      ? (node, event) => _handleSpace(event, widget.onToggle)
                      : null,
                  child: GestureDetector(
                    behavior: HitTestBehavior.opaque,
                    onTap: interactive ? widget.onToggle : null,
                    child: Semantics(
                      button: true,
                      enabled: interactive,
                      expanded: widget.open,
                      child: AnimatedOpacity(
                        curve: TRMotion.standard,
                        duration: motionDuration,
                        opacity: widget.item.disabled
                            ? TRGeneratedOpacity.disabled
                            : 1,
                        child: CustomPaint(
                          foregroundPainter: _TRAccordionFocusRingPainter(
                            color: colors.focus,
                            visible: showFocusRing,
                          ),
                          child: ConstrainedBox(
                            constraints: const BoxConstraints(
                              minHeight: TRGeneratedControlMetrics.mdHeight,
                            ),
                            child: Padding(
                              // Borders paint inside; widen the insets they
                              // overlap like CSS content-box sizing.
                              padding: const EdgeInsets.symmetric(
                                horizontal:
                                    TRGeneratedSpacing.lg +
                                    TRGeneratedBorders.defaultWidth,
                                vertical: TRGeneratedSpacing.md,
                              ),
                              child: Row(
                                children: [
                                  Expanded(
                                    child: DefaultTextStyle.merge(
                                      style: TextStyle(
                                        color: colors.text,
                                        fontFamily:
                                            TRGeneratedFontFamilies.body,
                                        fontSize: TRGeneratedTypographySizes.sm,
                                        fontWeight:
                                            TRGeneratedFontWeights.medium,
                                        height: kTextHeightNone,
                                      ),
                                      child: widget.item.trigger,
                                    ),
                                  ),
                                  SizedBox(
                                    width: TRGeneratedControlMetrics.mdGap,
                                  ),
                                  AnimatedRotation(
                                    curve: TRMotion.standard,
                                    duration: motionDuration,
                                    turns: widget.open ? 0.625 : 0.125,
                                    child: Container(
                                      height: TRGeneratedSpacing.sm,
                                      width: TRGeneratedSpacing.sm,
                                      decoration: BoxDecoration(
                                        border: Border(
                                          bottom: BorderSide(
                                            color: colors.text,
                                            width:
                                                TRGeneratedBorders.strongWidth,
                                          ),
                                          right: BorderSide(
                                            color: colors.text,
                                            width:
                                                TRGeneratedBorders.strongWidth,
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
          AnimatedSize(
            curve: TRMotion.easeOut,
            duration: sizeDuration,
            child: widget.open
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
                      padding: EdgeInsets.fromLTRB(
                        TRGeneratedSpacing.lg + TRGeneratedBorders.defaultWidth,
                        TRGeneratedSpacing.lg + TRGeneratedBorders.defaultWidth,
                        TRGeneratedSpacing.lg + TRGeneratedBorders.defaultWidth,
                        widget.isLast
                            ? TRGeneratedSpacing.lg +
                                  TRGeneratedBorders.defaultWidth
                            : TRGeneratedSpacing.lg,
                      ),
                      child: widget.item.content,
                    ),
                  )
                : const SizedBox(width: double.infinity),
          ),
        ],
      ),
    );
  }
}

class _TRAccordionFocusRingPainter extends CustomPainter {
  const _TRAccordionFocusRingPainter({
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
  bool shouldRepaint(_TRAccordionFocusRingPainter oldDelegate) =>
      color != oldDelegate.color || visible != oldDelegate.visible;
}
