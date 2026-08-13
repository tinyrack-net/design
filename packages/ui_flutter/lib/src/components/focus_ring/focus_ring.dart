import 'package:material_ui/material_ui.dart';

import '../../generated/tokens.g.dart';
import '../../internal/focus_source.dart';
import '../../theme.dart';

// @tinyrack-preview focus-ring
/// The Tinyrack focus indicator for a product-specific composite control.
///
/// Pass the composite's raw focus ownership through [focused]. The ring is
/// shown only when the keyboard granted that focus, matching the focus-visible
/// contract of the built-in controls. The painter never changes [child]'s
/// size or layout.
class TRFocusRing extends StatefulWidget {
  const TRFocusRing({required this.focused, required this.child, super.key});

  /// Whether the composite currently owns focus.
  final bool focused;

  /// The product-specific composite control.
  final Widget child;

  @override
  State<TRFocusRing> createState() => _TRFocusRingState();
}

class _TRFocusRingState extends State<TRFocusRing> with TRFocusSourceMixin {
  @override
  void initState() {
    super.initState();
    initFocusSource();
  }

  @override
  void dispose() {
    disposeFocusSource();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) => CustomPaint(
    foregroundPainter: _TRCompositeFocusRingPainter(
      color: context.tinyrackTheme.focus,
      visible: focusVisible(hasFocus: widget.focused),
    ),
    child: widget.child,
  );
}

class _TRCompositeFocusRingPainter extends CustomPainter {
  const _TRCompositeFocusRingPainter({
    required this.color,
    required this.visible,
  });

  final Color color;
  final bool visible;

  @override
  void paint(Canvas canvas, Size size) {
    if (!visible) return;
    const width = TRGeneratedBorders.focusWidth;
    final rect = (Offset.zero & size).deflate(width / 2);
    canvas.drawRRect(
      RRect.fromRectAndRadius(rect, const Radius.circular(TRGeneratedRadii.md)),
      Paint()
        ..color = color
        ..style = PaintingStyle.stroke
        ..strokeWidth = width,
    );
  }

  @override
  bool shouldRepaint(_TRCompositeFocusRingPainter oldDelegate) =>
      color != oldDelegate.color || visible != oldDelegate.visible;
}
