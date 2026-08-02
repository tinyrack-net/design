import 'dart:math' as math;

import 'package:flutter/material.dart';
import 'package:flutter/semantics.dart';

import '../../generated/tokens.g.dart';
import '../../internal/layer.dart';
import '../../theme.dart';
import '../../tokens.dart';

/// Logical dialog placement that follows the ambient text direction.
enum TRDialogPlacement { middle, top, bottom, start, end }

// @tinyrack-preview dialog
/// A structured Tinyrack dialog surface for use with [showTRDialog].
class TRDialog extends StatelessWidget {
  const TRDialog({
    this.title,
    this.description,
    this.content,
    this.actions,
    this.placement = TRDialogPlacement.middle,
    this.semanticLabel,
    super.key,
  }) : assert(
         title != null ||
             description != null ||
             content != null ||
             actions != null,
         'A dialog must contain at least one slot.',
       );

  final Widget? title;
  final Widget? description;
  final Widget? content;
  final Widget? actions;
  final TRDialogPlacement placement;
  final String? semanticLabel;

  @override
  Widget build(BuildContext context) {
    final colors = context.tinyrackTheme;
    final media = MediaQuery.of(context);
    final languageCode = Localizations.localeOf(context).languageCode;
    final descriptionHeightFactor = languageCode == 'ko' || languageCode == 'ja'
        ? (TRGeneratedTypographySizes.sm *
                  TRGeneratedTypographyLineHeights.md) /
              (TRGeneratedTypographySizes.sm *
                      TRGeneratedTypographyLineHeights.md +
                  1)
        : 1.0;
    final maxHeight =
        media.size.height - TRGeneratedSpacing.size4xl - TRGeneratedSpacing.lg;
    final alignment = switch (placement) {
      TRDialogPlacement.middle => AlignmentDirectional.center,
      TRDialogPlacement.top => AlignmentDirectional.topCenter,
      TRDialogPlacement.bottom => AlignmentDirectional.bottomCenter,
      TRDialogPlacement.start => AlignmentDirectional.centerStart,
      TRDialogPlacement.end => AlignmentDirectional.centerEnd,
    };
    final isHorizontalSheet =
        placement == TRDialogPlacement.top ||
        placement == TRDialogPlacement.bottom;
    final isVerticalSheet =
        placement == TRDialogPlacement.start ||
        placement == TRDialogPlacement.end;
    final radius = switch (placement) {
      TRDialogPlacement.middle => const BorderRadius.all(
        Radius.circular(TRGeneratedRadii.xl),
      ),
      TRDialogPlacement.top => const BorderRadius.vertical(
        bottom: Radius.circular(TRGeneratedRadii.xl),
      ),
      TRDialogPlacement.bottom => const BorderRadius.vertical(
        top: Radius.circular(TRGeneratedRadii.xl),
      ),
      TRDialogPlacement.start => const BorderRadiusDirectional.horizontal(
        end: Radius.circular(TRGeneratedRadii.xl),
      ),
      TRDialogPlacement.end => const BorderRadiusDirectional.horizontal(
        start: Radius.circular(TRGeneratedRadii.xl),
      ),
    };
    final inset = placement == TRDialogPlacement.middle
        ? const EdgeInsets.all(TRGeneratedSpacing.md)
        : EdgeInsets.zero;
    final sheetWidth = math.max(
      0.0,
      math.min(
        media.size.width - TRGeneratedSpacing.xl,
        TRGeneratedMeasurements.overlayWidthMd,
      ),
    );
    final baseConstraints = BoxConstraints(
      maxHeight: isVerticalSheet ? media.size.height : maxHeight,
      maxWidth: isHorizontalSheet
          ? media.size.width
          : isVerticalSheet
          ? sheetWidth
          : TRGeneratedMeasurements.overlayWidthMd,
      minWidth: isHorizontalSheet ? media.size.width : sheetWidth,
    );
    final dialogConstraints = isVerticalSheet
        ? baseConstraints.copyWith(minHeight: media.size.height)
        : baseConstraints;

    final shape = RoundedRectangleBorder(
      borderRadius: radius,
      side: BorderSide(
        color: colors.border,
        width: TRGeneratedBorders.defaultWidth,
      ),
    );

    return Align(
      alignment: alignment,
      child: Padding(
        padding: inset,
        child: ConstrainedBox(
          constraints: dialogConstraints,
          child: TRLayerBoundary(
            kind: TRLayerBoundaryKind.dialog,
            child: Material(
              clipBehavior: Clip.antiAlias,
              color: colors.surface,
              elevation: 0,
              shadowColor: Colors.transparent,
              shape: shape,
              surfaceTintColor: Colors.transparent,
              type: MaterialType.card,
              child: Semantics(
                container: true,
                explicitChildNodes: true,
                label: semanticLabel,
                role: SemanticsRole.dialog,
                child: Padding(
                  padding: const EdgeInsets.all(
                    TRGeneratedBorders.defaultWidth,
                  ),
                  child: Padding(
                    padding: const EdgeInsets.all(TRGeneratedSpacing.xl),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      mainAxisSize: isVerticalSheet
                          ? MainAxisSize.max
                          : MainAxisSize.min,
                      children: [
                        if (title case final title?)
                          Transform.translate(
                            offset: const Offset(
                              0,
                              -TRGeneratedBorders.defaultWidth,
                            ),
                            child: TRLayerPartBoundary(
                              name: 'title',
                              child: DefaultTextStyle.merge(
                                style: TextStyle(
                                  color: colors.text,
                                  fontFamily: TRGeneratedFontFamilies.body,
                                  fontFamilyFallback:
                                      TRGeneratedFontFamilies.fallback,
                                  fontSize: TRGeneratedTypographySizes.lg,
                                  fontWeight: TRGeneratedFontWeights.bold,
                                  height: TRGeneratedTypographyLineHeights.sm,
                                ),
                                child: title,
                              ),
                            ),
                          ),
                        if (description case final description?)
                          Padding(
                            padding: const EdgeInsets.only(
                              top: TRGeneratedSpacing.sm,
                            ),
                            child: Align(
                              alignment: AlignmentDirectional.topStart,
                              heightFactor: descriptionHeightFactor,
                              child: TRLayerPartBoundary(
                                name: 'description',
                                child: SizedBox(
                                  width: double.infinity,
                                  child: DefaultTextStyle.merge(
                                    style: TRGeneratedTextStyles.bodySm
                                        .copyWith(
                                          color: colors.textMuted,
                                          fontFamilyFallback:
                                              TRGeneratedFontFamilies.fallback,
                                        ),
                                    child: description,
                                  ),
                                ),
                              ),
                            ),
                          ),
                        if (content case final content?)
                          Flexible(
                            fit: isVerticalSheet
                                ? FlexFit.tight
                                : FlexFit.loose,
                            child: Padding(
                              padding: const EdgeInsets.symmetric(
                                vertical: TRGeneratedSpacing.lg,
                              ),
                              child: TRLayerPartBoundary(
                                name: 'body',
                                child: SingleChildScrollView(
                                  child: DefaultTextStyle.merge(
                                    style: TRGeneratedTextStyles.bodySm
                                        .copyWith(
                                          color: colors.text,
                                          fontFamilyFallback:
                                              TRGeneratedFontFamilies.fallback,
                                        ),
                                    child: content,
                                  ),
                                ),
                              ),
                            ),
                          ),
                        if (actions case final actions?)
                          Padding(
                            padding: const EdgeInsets.only(
                              top: TRGeneratedSpacing.sm,
                            ),
                            child: Align(
                              alignment: AlignmentDirectional.centerEnd,
                              child: actions,
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
    );
  }
}

/// Shows a modal Tinyrack dialog and resolves with the value passed to pop.
Future<T?> showTRDialog<T>({
  required BuildContext context,
  required WidgetBuilder builder,
  bool barrierDismissible = true,
  String? barrierLabel,
  bool useRootNavigator = true,
  bool useSafeArea = true,
  RouteSettings? routeSettings,
  Offset? anchorPoint,
  bool? requestFocus,
}) {
  assert(debugCheckHasMaterialLocalizations(context));
  final navigator = Navigator.of(context, rootNavigator: useRootNavigator);
  final themes = InheritedTheme.capture(from: context, to: navigator.context);
  final colors = context.tinyrackTheme;
  final disableAnimations = MediaQuery.disableAnimationsOf(context);
  final resolvedBarrierLabel =
      barrierLabel ??
      MaterialLocalizations.of(context).modalBarrierDismissLabel;

  return navigator.push<T>(
    RawDialogRoute<T>(
      anchorPoint: anchorPoint,
      barrierColor: colors.scrim,
      barrierDismissible: barrierDismissible,
      barrierLabel: resolvedBarrierLabel,
      pageBuilder: (routeContext, animation, secondaryAnimation) {
        Widget page = Builder(builder: builder);
        if (useSafeArea) page = SafeArea(child: page);
        return themes.wrap(page);
      },
      requestFocus: requestFocus,
      settings: routeSettings,
      transitionBuilder: (context, animation, secondaryAnimation, child) {
        if (disableAnimations) return child;
        final curved = CurvedAnimation(
          parent: animation,
          curve: TRMotion.easeOut,
          reverseCurve: TRMotion.standard,
        );
        return FadeTransition(
          opacity: curved,
          child: ScaleTransition(
            scale: Tween<double>(
              begin: TRGeneratedMeasurements.overlayClosedScale,
              end: 1,
            ).animate(curved),
            child: child,
          ),
        );
      },
      transitionDuration: disableAnimations ? Duration.zero : TRMotion.slow,
      traversalEdgeBehavior: TraversalEdgeBehavior.closedLoop,
    ),
  );
}
