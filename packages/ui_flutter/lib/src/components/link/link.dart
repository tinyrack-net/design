import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../../internal/focus_source.dart';

import '../../generated/tokens.g.dart';
import '../../theme.dart';
import '../../tokens.dart';
import '../../types.dart';

// @tinyrack-preview link
/// An inline, navigable Tinyrack text action.
class TRLink extends StatefulWidget {
  const TRLink({
    required this.child,
    this.onTap,
    this.disabled = false,
    this.underline = TRLinkUnderline.hover,
    this.variant = TRLinkVariant.defaultVariant,
    this.focusNode,
    super.key,
  });

  final Widget child;
  final VoidCallback? onTap;
  final bool disabled;
  final TRLinkUnderline underline;
  final TRLinkVariant variant;
  final FocusNode? focusNode;

  @override
  State<TRLink> createState() => _TRLinkState();
}

class _TRLinkState extends State<TRLink> with TRFocusSourceMixin {
  FocusNode? _internalFocusNode;
  bool _hovered = false;
  bool _focused = false;

  FocusNode get _focusNode =>
      widget.focusNode ?? (_internalFocusNode ??= FocusNode());

  @override
  void initState() {
    super.initState();
    initFocusSource();
  }

  @override
  void dispose() {
    disposeFocusSource();
    _internalFocusNode?.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final colors = context.tinyrackTheme;
    final disabled = widget.disabled || widget.onTap == null;
    final color = switch (widget.variant) {
      TRLinkVariant.defaultVariant => colors.text,
      TRLinkVariant.muted => colors.textMuted,
      TRLinkVariant.danger => colors.danger,
    };
    final underlineVisible = switch (widget.underline) {
      TRLinkUnderline.always => true,
      TRLinkUnderline.none => false,
      TRLinkUnderline.hover => _hovered,
    };
    final opacity = disabled
        ? TRGeneratedOpacity.disabled
        : _hovered
        ? TRGeneratedOpacity.hover
        : 1.0;
    final showFocusRing = focusVisible(hasFocus: _focused);
    final motionDuration = MediaQuery.disableAnimationsOf(context)
        ? Duration.zero
        : TRMotion.fast;

    return CallbackShortcuts(
      bindings: disabled
          ? const {}
          : {
              const SingleActivator(LogicalKeyboardKey.enter): () =>
                  widget.onTap?.call(),
            },
      child: MouseRegion(
        cursor: disabled ? MouseCursor.defer : SystemMouseCursors.click,
        onEnter: (_) => setState(() => _hovered = true),
        onExit: (_) => setState(() => _hovered = false),
        child: Focus(
          focusNode: _focusNode,
          onFocusChange: (focused) => setState(() => _focused = focused),
          // Native anchors ignore Space entirely; consuming it here keeps
          // Space from reading as a press.
          onKeyEvent: (node, event) =>
              event.logicalKey == LogicalKeyboardKey.space
              ? KeyEventResult.handled
              : KeyEventResult.ignored,
          child: GestureDetector(
            behavior: HitTestBehavior.opaque,
            onTap: disabled ? null : widget.onTap,
            child: Semantics(
              enabled: !disabled,
              link: true,
              // The web hover fade applies to the anchor's outline too, so
              // the focus ring paints inside the faded layer.
              child: AnimatedOpacity(
                curve: TRMotion.standard,
                duration: motionDuration,
                opacity: opacity,
                child: CustomPaint(
                  foregroundPainter: _TRLinkFocusRingPainter(
                    color: colors.focus,
                    visible: showFocusRing,
                  ),
                  child: AnimatedDefaultTextStyle(
                    curve: TRMotion.standard,
                    duration: motionDuration,
                    style: DefaultTextStyle.of(context).style.merge(
                      TextStyle(
                        color: color,
                        fontWeight: TRGeneratedFontWeights.medium,
                        decoration: underlineVisible
                            ? TextDecoration.underline
                            : TextDecoration.none,
                        decorationColor: color,
                      ),
                    ),
                    child: widget.child,
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class _TRLinkFocusRingPainter extends CustomPainter {
  const _TRLinkFocusRingPainter({required this.color, required this.visible});

  final Color color;
  final bool visible;

  @override
  void paint(Canvas canvas, Size size) {
    if (!visible) return;
    const width = TRGeneratedBorders.focusWidth;
    const offset = TRGeneratedBorders.focusOffset;
    final rect = (Offset.zero & size).inflate(offset + width / 2);
    canvas.drawRRect(
      RRect.fromRectAndRadius(
        rect,
        const Radius.circular(
          TRGeneratedRadii.xs + TRGeneratedBorders.focusOffset + width / 2,
        ),
      ),
      Paint()
        ..color = color
        ..style = PaintingStyle.stroke
        ..strokeWidth = width,
    );
  }

  @override
  bool shouldRepaint(_TRLinkFocusRingPainter oldDelegate) =>
      color != oldDelegate.color || visible != oldDelegate.visible;
}
