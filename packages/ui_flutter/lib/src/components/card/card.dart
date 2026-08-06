import 'package:flutter/material.dart';

import '../../generated/tokens.g.dart';
import '../../theme.dart';
import '../../types.dart';

// @tinyrack-preview card
/// A structured Tinyrack content surface.
class TRCard extends StatelessWidget {
  const TRCard({
    required this.child,
    this.focused = false,
    this.padding = TRCardPadding.md,
    this.semanticContainer = true,
    this.variant = TRCardVariant.defaultVariant,
    super.key,
  });

  final Widget child;

  /// Whether the card paints the focus ring for the group it hosts.
  ///
  /// A card that frames several focusable children sets this while one of them
  /// holds focus so the group reads as one control. Give a field inside such a
  /// group [TRFieldAppearance.plain] so the ring is painted once, around the
  /// group, rather than twice. A field using [TRFieldAppearance.ghost] paints
  /// its own focus emphasis, so a card wrapping only that field should leave
  /// this off instead.
  /// The ring is painted over the card rather than around it, so turning it on
  /// never changes the card's size or layout.
  final bool focused;

  final TRCardPadding padding;
  final bool semanticContainer;
  final TRCardVariant variant;

  @override
  Widget build(BuildContext context) {
    final colors = context.tinyrackTheme;
    final inset = switch (padding) {
      TRCardPadding.none => 0.0,
      TRCardPadding.sm => TRGeneratedSpacing.sm,
      TRCardPadding.md => TRGeneratedSpacing.md,
      TRCardPadding.lg => TRGeneratedSpacing.lg,
    };
    final decoration = BoxDecoration(
      color: switch (variant) {
        TRCardVariant.defaultVariant => colors.surface,
        TRCardVariant.outlined => Colors.transparent,
        TRCardVariant.elevated => colors.surfaceMuted,
      },
      border: Border.all(
        color: variant == TRCardVariant.elevated
            ? Colors.transparent
            : colors.border,
        width: TRGeneratedBorders.defaultWidth,
      ),
      borderRadius: const BorderRadius.all(
        Radius.circular(TRGeneratedRadii.lg),
      ),
      boxShadow: variant == TRCardVariant.elevated
          ? const [TRGeneratedShadows.raised]
          : null,
    );
    return Semantics(
      container: semanticContainer,
      child: DecoratedBox(
        decoration: decoration,
        child: DecoratedBox(
          position: DecorationPosition.foreground,
          decoration: BoxDecoration(
            border: focused
                ? Border.all(
                    color: colors.focus,
                    width: TRGeneratedBorders.focusWidth,
                  )
                : null,
            borderRadius: const BorderRadius.all(
              Radius.circular(TRGeneratedRadii.lg),
            ),
          ),
          child: Padding(
            padding: EdgeInsets.symmetric(
              horizontal: inset + TRGeneratedBorders.defaultWidth,
              // CSS line boxes retain their 1/64 px layout precision. Split
              // the residual block-size fraction across both card edges.
              vertical:
                  inset +
                  TRGeneratedBorders.defaultWidth +
                  TRGeneratedFlutterRendering.cardBlockInsetCorrection,
            ),
            child: child,
          ),
        ),
      ),
    );
  }
}

/// Groups a card title and description with the canonical small gap.
class TRCardHeader extends StatelessWidget {
  const TRCardHeader({required this.children, super.key});

  final List<Widget> children;

  @override
  Widget build(BuildContext context) => Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    mainAxisSize: MainAxisSize.min,
    spacing: TRGeneratedSpacing.xs,
    children: children,
  );
}

/// A card heading using the canonical heading-small typography.
class TRCardTitle extends StatelessWidget {
  const TRCardTitle({required this.child, super.key});

  final Widget child;

  @override
  Widget build(BuildContext context) => DefaultTextStyle.merge(
    style: Theme.of(context).textTheme.titleSmall,
    child: child,
  );
}

/// Supporting card text using the canonical muted body-small typography.
class TRCardDescription extends StatelessWidget {
  const TRCardDescription({required this.child, super.key});

  final Widget child;

  @override
  Widget build(BuildContext context) => DefaultTextStyle.merge(
    style: Theme.of(
      context,
    ).textTheme.bodySmall?.copyWith(color: context.tinyrackTheme.textMuted),
    child: child,
  );
}

/// The main content region of a card.
class TRCardContent extends StatelessWidget {
  const TRCardContent({required this.child, super.key});

  final Widget child;

  @override
  Widget build(BuildContext context) => child;
}

/// A wrapping row for card actions.
class TRCardFooter extends StatelessWidget {
  const TRCardFooter({required this.children, super.key});

  final List<Widget> children;

  @override
  Widget build(BuildContext context) => Wrap(
    spacing: TRGeneratedSpacing.sm,
    runSpacing: TRGeneratedSpacing.sm,
    children: children,
  );
}
