import 'dart:math' as math;

import 'package:flutter/material.dart';
import 'package:flutter/semantics.dart';
import 'package:flutter/services.dart';

import '../../generated/tokens.g.dart';
import '../../internal/layer.dart';
import '../../theme.dart';
import '../../tokens.dart';
import '../button/button.dart';
import '../dialog/dialog.dart';

// @tinyrack-preview alert-dialog
/// A decision dialog whose backdrop cannot dismiss the pending choice.
class TRAlertDialog extends StatelessWidget {
  const TRAlertDialog({
    required this.title,
    this.actions = const [],
    this.content,
    this.description,
    this.placement = TRDialogPlacement.middle,
    this.semanticLabel,
    super.key,
  });

  final Widget title;

  /// Tinyrack buttons ordered from the safest action to the most destructive.
  final List<TRButton> actions;
  final Widget? content;
  final Widget? description;
  final TRDialogPlacement placement;
  final String? semanticLabel;

  @override
  Widget build(BuildContext context) {
    final colors = context.tinyrackTheme;
    final locale = Localizations.localeOf(context).languageCode;
    final dialogWidth = math.max(
      0.0,
      math.min(
        MediaQuery.sizeOf(context).width -
            TRGeneratedMeasurements.overlayInlineInset * 2,
        TRGeneratedMeasurements.overlayWidthMd,
      ),
    );
    final alignment = switch (placement) {
      TRDialogPlacement.middle => AlignmentDirectional.center,
      TRDialogPlacement.top => AlignmentDirectional.topCenter,
      TRDialogPlacement.bottom => AlignmentDirectional.bottomCenter,
      TRDialogPlacement.start => AlignmentDirectional.centerStart,
      TRDialogPlacement.end => AlignmentDirectional.centerEnd,
    };
    return Align(
      alignment: alignment,
      child: ConstrainedBox(
        constraints: const BoxConstraints(
          maxWidth: TRGeneratedMeasurements.overlayWidthMd,
        ),
        child: SizedBox(
          width: dialogWidth,
          child: TRLayerBoundary(
            kind: TRLayerBoundaryKind.alertDialog,
            child: Material(
              clipBehavior: Clip.antiAlias,
              color: colors.surface,
              elevation: 0,
              shadowColor: Colors.transparent,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(TRGeneratedRadii.lg),
                side: BorderSide(color: colors.borderStrong),
              ),
              surfaceTintColor: Colors.transparent,
              type: MaterialType.card,
              child: Semantics(
                container: true,
                explicitChildNodes: true,
                label: semanticLabel,
                role: SemanticsRole.dialog,
                child: Padding(
                  padding: const EdgeInsets.all(
                    TRGeneratedSpacing.xl + TRGeneratedBorders.defaultWidth,
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisSize: MainAxisSize.min,
                    spacing: TRGeneratedSpacing.md,
                    children: [
                      TRLayerPartBoundary(
                        name: 'title',
                        child: DefaultTextStyle.merge(
                          style: TextStyle(
                            color: colors.text,
                            fontFamily: TRGeneratedFontFamilies.body,
                            fontFamilyFallback:
                                TRGeneratedFontFamilies.fallback,
                            fontSize: TRGeneratedTypographySizes.lg,
                            fontWeight: TRGeneratedFontWeights.medium,
                            height: switch (locale) {
                              'ko' =>
                                (TRGeneratedTypographySizes.lg +
                                        TRGeneratedSpacing.sm -
                                        TRGeneratedBorders.defaultWidth) /
                                    TRGeneratedTypographySizes.lg,
                              'ja' =>
                                (TRGeneratedTypographySizes.lg +
                                        TRGeneratedSpacing.lg) /
                                    TRGeneratedTypographySizes.lg,
                              _ =>
                                (TRGeneratedTypographySizes.lg +
                                        TRGeneratedSpacing.xs +
                                        TRGeneratedBorders.defaultWidth / 2) /
                                    TRGeneratedTypographySizes.lg,
                            },
                          ),
                          child: title,
                        ),
                      ),
                      if (description case final description?)
                        Transform.translate(
                          offset: locale == 'ja' || locale == 'ko'
                              ? const Offset(
                                  0,
                                  TRGeneratedBorders.defaultWidth / 2,
                                )
                              : Offset.zero,
                          child: TRLayerPartBoundary(
                            name: 'description',
                            child: DefaultTextStyle.merge(
                              style: TRGeneratedTextStyles.bodySm.copyWith(
                                color: colors.textMuted,
                                fontFamilyFallback:
                                    TRGeneratedFontFamilies.fallback,
                              ),
                              child: description,
                            ),
                          ),
                        ),
                      ?content,
                      if (actions.isNotEmpty)
                        Transform.translate(
                          offset: switch (locale) {
                            'ko' => const Offset(
                              TRGeneratedBorders.defaultWidth * 2,
                              -TRGeneratedBorders.defaultWidth,
                            ),
                            'ja' => const Offset(
                              0,
                              -TRGeneratedBorders.defaultWidth,
                            ),
                            _ => const Offset(
                              -TRGeneratedBorders.defaultWidth / 2,
                              -TRGeneratedBorders.defaultWidth * 1.5,
                            ),
                          },
                          child: Align(
                            alignment: AlignmentDirectional.centerEnd,
                            child: Wrap(
                              alignment: WrapAlignment.end,
                              runAlignment: WrapAlignment.end,
                              spacing: TRGeneratedSpacing.sm,
                              runSpacing: TRGeneratedSpacing.sm,
                              children: actions,
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
    );
  }
}

/// Shows an alert dialog that ignores backdrop taps but supports Escape and back.
Future<T?> showTRAlertDialog<T>({
  required BuildContext context,
  required WidgetBuilder builder,
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
      barrierDismissible: false,
      barrierLabel: resolvedBarrierLabel,
      pageBuilder: (routeContext, animation, secondaryAnimation) {
        Widget page = Shortcuts(
          shortcuts: const {
            SingleActivator(LogicalKeyboardKey.escape): DismissIntent(),
          },
          child: Actions(
            actions: {
              DismissIntent: CallbackAction<DismissIntent>(
                onInvoke: (_) {
                  Navigator.of(routeContext).maybePop();
                  return null;
                },
              ),
            },
            child: Focus(autofocus: true, child: Builder(builder: builder)),
          ),
        );
        if (useSafeArea) page = SafeArea(child: page);
        return themes.wrap(page);
      },
      requestFocus: requestFocus ?? true,
      settings: routeSettings,
      transitionBuilder: (context, animation, secondaryAnimation, child) {
        if (disableAnimations) return child;
        final curved = CurvedAnimation(
          parent: animation,
          curve: TRMotion.easeOut,
          reverseCurve: TRMotion.standard,
        );
        return FadeTransition(opacity: curved, child: child);
      },
      transitionDuration: disableAnimations ? Duration.zero : TRMotion.slow,
      traversalEdgeBehavior: TraversalEdgeBehavior.closedLoop,
    ),
  );
}
