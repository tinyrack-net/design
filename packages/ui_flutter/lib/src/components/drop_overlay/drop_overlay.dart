import 'package:flutter/material.dart';
import 'package:lucide_flutter/lucide_flutter.dart';

import '../../generated/tokens.g.dart';
import '../../theme.dart';
import '../../tokens.dart';

// @tinyrack-preview drop-overlay
/// Covers a product-owned drop target while a supported drag is active.
///
/// The overlay fills the same bounds as [child], leaves pointer handling to the
/// drop target below it, and announces [label] only while visible. The product
/// remains responsible for deciding which payloads it accepts and for handling
/// the drop itself.
class TRDropOverlay extends StatelessWidget {
  const TRDropOverlay({
    required this.visible,
    required this.label,
    required this.child,
    super.key,
  });

  /// Whether the drop target is currently accepting a dragged payload.
  final bool visible;

  /// Localized instruction announced and rendered in the overlay.
  final String label;

  /// The product surface covered by the overlay.
  final Widget child;

  @override
  Widget build(BuildContext context) {
    final colors = context.tinyrackTheme;
    final duration = MediaQuery.disableAnimationsOf(context)
        ? Duration.zero
        : TRMotion.fast;
    return Stack(
      fit: StackFit.passthrough,
      children: <Widget>[
        child,
        Positioned.fill(
          child: IgnorePointer(
            child: AnimatedOpacity(
              curve: TRMotion.standard,
              duration: duration,
              opacity: visible ? 1 : 0,
              child: ExcludeSemantics(
                excluding: !visible,
                child: Semantics(
                  container: true,
                  liveRegion: true,
                  label: label,
                  child: Stack(
                    fit: StackFit.expand,
                    children: <Widget>[
                      ColoredBox(
                        color: colors.surface.withValues(
                          alpha: TROpacity.dropOverlay,
                        ),
                      ),
                      Center(
                        child: Column(
                          mainAxisSize: MainAxisSize.min,
                          children: <Widget>[
                            Icon(
                              LucideIcons.upload,
                              color: colors.primary,
                              size: TRGeneratedSpacing.size2xl,
                            ),
                            const SizedBox(height: TRGeneratedSpacing.sm),
                            Text(
                              label,
                              style: TRGeneratedTextStyles.label.copyWith(
                                color: colors.text,
                                fontFamilyFallback:
                                    TRGeneratedFontFamilies.fallback,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),
        ),
      ],
    );
  }
}
