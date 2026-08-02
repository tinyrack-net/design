import 'package:flutter/material.dart';

import '../../generated/tokens.g.dart';
import '../../theme.dart';

// @tinyrack-preview steps
/// A numbered sequence of stages, connected by a rail.
class TRStepsRoot extends StatelessWidget {
  const TRStepsRoot({required this.children, super.key});

  final List<TRStepsItem> children;

  @override
  Widget build(BuildContext context) {
    final colors = context.tinyrackTheme;
    const markerSize = TRGeneratedSpacing.xl;
    const markerInsetBlockStart = 0.0;

    return Semantics(
      container: true,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        children: [
          for (var index = 0; index < children.length; index += 1) ...[
            if (index > 0) const SizedBox(height: TRGeneratedSpacing.xl),
            Semantics(
              label: 'Step ${index + 1}',
              child: ConstrainedBox(
                constraints: const BoxConstraints(minHeight: markerSize),
                child: DecoratedBox(
                  decoration: BoxDecoration(
                    border: Border(
                      left: BorderSide(
                        color: colors.border,
                        width: TRGeneratedBorders.defaultWidth,
                      ),
                    ),
                  ),
                  child: Stack(
                    clipBehavior: Clip.none,
                    children: [
                      Positioned(
                        left: -(markerSize / 2),
                        top: markerInsetBlockStart,
                        child: SizedBox.square(
                          dimension: markerSize,
                          child: DecoratedBox(
                            decoration: BoxDecoration(
                              color: colors.primary,
                              shape: BoxShape.circle,
                            ),
                            child: Center(
                              child: Text(
                                '${index + 1}',
                                style: TextStyle(
                                  color: colors.onPrimary,
                                  fontFamily: TRGeneratedFontFamilies.body,
                                  fontSize: TRGeneratedTypographySizes.sm,
                                  fontWeight: TRGeneratedFontWeights.strong,
                                  height: TRGeneratedTypographyLineHeights.xs,
                                ),
                              ),
                            ),
                          ),
                        ),
                      ),
                      Padding(
                        padding: const EdgeInsets.only(
                          left: markerSize + TRGeneratedSpacing.md,
                        ),
                        child: children[index],
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ],
        ],
      ),
    );
  }
}

/// A single stage rendered within [TRStepsRoot].
class TRStepsItem extends StatelessWidget {
  const TRStepsItem({required this.child, super.key});

  final Widget child;

  @override
  Widget build(BuildContext context) => child;
}
