import 'package:material_ui/material_ui.dart';

import '../../generated/tokens.g.dart';
import '../../normal_line.dart';
import '../../theme.dart';
import '../../tokens.dart';

// @tinyrack-preview fieldset
/// A bordered group of related form controls.
///
/// Mirrors the web fieldset: the legend sits on the top border line, which is
/// drawn through the legend's vertical center.
class TRFieldset extends StatelessWidget {
  const TRFieldset({
    required this.children,
    this.legend,
    this.disabled = false,
    super.key,
  });

  final List<Widget> children;
  final String? legend;
  final bool disabled;

  @override
  Widget build(BuildContext context) {
    final colors = context.tinyrackTheme;
    final generated = Theme.of(context).brightness == Brightness.light
        ? TRGeneratedColors.light
        : TRGeneratedColors.dark;
    final legendStyle = TextStyle(
      color: colors.text,
      fontFamily: TRGeneratedFontFamilies.body,
      fontFamilyFallback: TRGeneratedFontFamilies.fallback,
      fontSize: TRGeneratedTypographySizes.md,
      fontWeight: TRGeneratedFontWeights.medium,
      // The web legend inherits `line-height: normal`.
      height: normalLineHeightFor(
        legend ?? '',
        TRGeneratedTypographySizes.md,
        TRGeneratedFlutterRendering.normalLineMd,
      ),
    );
    var legendHeight = 0.0;
    if (legend case final legend?) {
      final painter = TextPainter(
        text: TextSpan(text: legend, style: legendStyle),
        textDirection: Directionality.of(context),
        textScaler: MediaQuery.textScalerOf(context),
      )..layout();
      legendHeight = painter.height;
      painter.dispose();
    }
    final legendOverlap = legendHeight / 2;
    const legendInsetBlockStart = 0.0;

    return Semantics(
      container: true,
      enabled: !disabled,
      child: AnimatedOpacity(
        curve: TRMotion.standard,
        duration: TRMotion.fast,
        opacity: disabled ? TRGeneratedOpacity.disabled : 1,
        child: Stack(
          children: [
            Padding(
              padding: EdgeInsets.only(top: legendOverlap),
              child: DecoratedBox(
                decoration: BoxDecoration(
                  border: Border.all(
                    color: generated.controlBorder,
                    width: TRGeneratedBorders.defaultWidth,
                  ),
                  borderRadius: BorderRadius.circular(TRGeneratedRadii.lg),
                ),
                child: Padding(
                  padding: EdgeInsets.fromLTRB(
                    TRGeneratedSpacing.lg + TRGeneratedBorders.defaultWidth,
                    TRGeneratedSpacing.lg + legendOverlap,
                    TRGeneratedSpacing.lg + TRGeneratedBorders.defaultWidth,
                    TRGeneratedSpacing.lg + TRGeneratedBorders.defaultWidth,
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    mainAxisSize: MainAxisSize.min,
                    spacing: TRGeneratedSpacing.md,
                    children: children,
                  ),
                ),
              ),
            ),
            if (legend case final legend?)
              Positioned(
                left: TRGeneratedSpacing.lg + TRGeneratedBorders.defaultWidth,
                top: legendInsetBlockStart,
                child: ColoredBox(
                  color: colors.surface,
                  child: Padding(
                    padding: const EdgeInsets.symmetric(
                      horizontal: TRGeneratedSpacing.xs,
                    ),
                    child: Text(legend, style: legendStyle),
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }
}
