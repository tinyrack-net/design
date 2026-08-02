import 'package:flutter/material.dart';
import 'package:flutter/semantics.dart';
import 'package:flutter/services.dart';

import '../generated/tokens.g.dart';
import '../internal/layer.dart';
import '../theme.dart';
import '../tokens.dart';
import 'dialog.dart';

// @tinyrack-preview alert-dialog
/// A decision dialog whose backdrop cannot dismiss the pending choice.
class TRAlertDialog extends StatelessWidget {
  const TRAlertDialog({
    required this.title,
    this.actions,
    this.content,
    this.description,
    this.placement = TRDialogPlacement.middle,
    this.semanticLabel,
    super.key,
  });

  final Widget title;
  final Widget? actions;
  final Widget? content;
  final Widget? description;
  final TRDialogPlacement placement;
  final String? semanticLabel;

  @override
  Widget build(BuildContext context) {
    final colors = context.tinyrackTheme;
    final alignment = switch (placement) {
      TRDialogPlacement.middle => AlignmentDirectional.center,
      TRDialogPlacement.top => AlignmentDirectional.topCenter,
      TRDialogPlacement.bottom => AlignmentDirectional.bottomCenter,
      TRDialogPlacement.start => AlignmentDirectional.centerStart,
      TRDialogPlacement.end => AlignmentDirectional.centerEnd,
    };
    return Align(
      alignment: alignment,
      child: IntrinsicWidth(
        child: ConstrainedBox(
          constraints: const BoxConstraints(
            maxWidth: TRGeneratedMeasurements.overlayWidthMd,
          ),
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
                  padding: const EdgeInsets.symmetric(
                    horizontal: TRGeneratedSpacing.xl,
                    vertical: TRGeneratedSpacing.xl - 1,
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisSize: MainAxisSize.min,
                    spacing: TRGeneratedSpacing.md,
                    children: [
                      TRLayerPartBoundary(
                        name: 'title',
                        child: Transform.translate(
                          offset: const Offset(1, 2),
                          child: DefaultTextStyle.merge(
                            style: TextStyle(
                              color: colors.text,
                              fontFamily: TRGeneratedFontFamilies.body,
                              fontFamilyFallback:
                                  TRGeneratedFontFamilies.fallback,
                              fontSize: TRGeneratedTypographySizes.lg,
                              fontWeight: TRGeneratedFontWeights.medium,
                            ),
                            child: title,
                          ),
                        ),
                      ),
                      if (description case final description?)
                        TRLayerPartBoundary(
                          name: 'description',
                          child: Transform.translate(
                            offset: const Offset(1, -2),
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
                      if (actions case final actions?)
                        Align(
                          alignment: AlignmentDirectional.centerEnd,
                          child: actions,
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
            child: Builder(builder: builder),
          ),
        );
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
