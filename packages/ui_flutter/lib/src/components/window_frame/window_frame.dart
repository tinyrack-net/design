import 'package:flutter/material.dart';
import 'package:lucide_flutter/lucide_flutter.dart';

import '../../generated/tokens.g.dart';
import '../../theme.dart';
import '../../types.dart';
import '../button/button.dart';

enum TRWindowFrameVariant { macos, browser }

enum TRWindowFramePadding { none, sm, md, lg }

enum TRWindowFrameControlTone { close, minimize, maximize }

/// Native window command represented by a caption button.
enum TRWindowCaptionAction { minimize, maximize, restore, close }

/// Lucide glyph family used by native window caption actions.
enum TRWindowCaptionGlyphStyle { standard, expandCollapse }

// @tinyrack-preview window-frame
/// Decorative desktop or browser chrome around application content.
class TRWindowFrame extends StatelessWidget {
  const TRWindowFrame({
    required this.body,
    this.title,
    this.address,
    this.variant = TRWindowFrameVariant.macos,
    this.padding = TRWindowFramePadding.md,
    this.bodyBackground,
    this.bodyForeground,
    this.bodyTextStyle,
    super.key,
  });

  final Widget body;
  final Widget? title;
  final Widget? address;
  final TRWindowFrameVariant variant;
  final TRWindowFramePadding padding;
  final Color? bodyBackground;
  final Color? bodyForeground;
  final TextStyle? bodyTextStyle;

  @override
  Widget build(BuildContext context) {
    final colors = context.tinyrackTheme;
    final inset = switch (padding) {
      TRWindowFramePadding.none => 0.0,
      TRWindowFramePadding.sm => TRGeneratedSpacing.sm,
      TRWindowFramePadding.md => TRGeneratedSpacing.md,
      TRWindowFramePadding.lg => TRGeneratedSpacing.lg,
    };
    return DecoratedBox(
      decoration: BoxDecoration(
        border: Border.all(color: colors.border),
        borderRadius: BorderRadius.circular(TRGeneratedRadii.lg),
        color: colors.surface,
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(TRGeneratedRadii.lg),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TRWindowFrameTitleBar(
              height: variant == TRWindowFrameVariant.browser
                  ? TRGeneratedFlutterRendering.windowFrameBrowserTitleBarHeight
                  : null,
              controls: const TRWindowFrameControls(),
              child: variant == TRWindowFrameVariant.browser
                  ? TRWindowFrameAddressBar(
                      child: address ?? const SizedBox.shrink(),
                    )
                  : TRWindowFrameTitle(child: title ?? const SizedBox.shrink()),
            ),
            TRWindowFrameBody(
              padding: inset,
              background: bodyBackground,
              foreground: bodyForeground,
              textStyle: bodyTextStyle,
              child: body,
            ),
          ],
        ),
      ),
    );
  }
}

class TRWindowFrameTitleBar extends StatelessWidget {
  const TRWindowFrameTitleBar({
    required this.child,
    this.controls,
    this.leading,
    this.actions,
    this.height,
    super.key,
  });
  final Widget child;
  final Widget? controls;
  final Widget? leading;
  final Widget? actions;
  final double? height;
  @override
  Widget build(BuildContext context) => Container(
    height:
        height ?? TRGeneratedControlMetrics.mdHeight + TRGeneratedSpacing.xs,
    padding: const EdgeInsets.symmetric(horizontal: TRGeneratedSpacing.md),
    decoration: BoxDecoration(
      color: context.tinyrackTheme.surfaceMuted,
      border: Border(bottom: BorderSide(color: context.tinyrackTheme.border)),
    ),
    child: Stack(
      alignment: Alignment.center,
      children: [
        if (leading ?? controls case final leading?)
          Align(alignment: Alignment.centerLeft, child: leading),
        if (actions case final actions?)
          Align(alignment: Alignment.centerRight, child: actions),
        child,
      ],
    ),
  );
}

/// Compact, accessible action for Flutter-owned desktop window chrome.
class TRWindowCaptionButton extends StatelessWidget {
  const TRWindowCaptionButton({
    required this.action,
    required this.label,
    required this.onPressed,
    this.glyphStyle = TRWindowCaptionGlyphStyle.standard,
    this.uiSize = TRUiSize.md,
    super.key,
  });

  final TRWindowCaptionAction action;
  final TRWindowCaptionGlyphStyle glyphStyle;
  final String label;
  final VoidCallback? onPressed;

  /// Control size the caption glyph and its hit target are built at.
  final TRUiSize uiSize;

  @override
  Widget build(BuildContext context) => TRIconButton(
    icon: Icon(switch ((glyphStyle, action)) {
      (_, TRWindowCaptionAction.close) => LucideIcons.x,
      (TRWindowCaptionGlyphStyle.standard, TRWindowCaptionAction.minimize) =>
        LucideIcons.minus,
      (TRWindowCaptionGlyphStyle.standard, TRWindowCaptionAction.maximize) =>
        LucideIcons.square,
      (TRWindowCaptionGlyphStyle.standard, TRWindowCaptionAction.restore) =>
        LucideIcons.copy,
      (
        TRWindowCaptionGlyphStyle.expandCollapse,
        TRWindowCaptionAction.minimize,
      ) =>
        LucideIcons.minimize,
      (
        TRWindowCaptionGlyphStyle.expandCollapse,
        TRWindowCaptionAction.maximize,
      ) =>
        LucideIcons.maximize,
      (
        TRWindowCaptionGlyphStyle.expandCollapse,
        TRWindowCaptionAction.restore,
      ) =>
        LucideIcons.minimize2,
    }),
    label: label,
    onPressed: onPressed,
    appearance: TRAppearance.ghost,
    intent: action == TRWindowCaptionAction.close
        ? TRIntent.danger
        : TRIntent.neutral,
    uiSize: uiSize,
  );
}

class TRWindowFrameControls extends StatelessWidget {
  const TRWindowFrameControls({super.key});
  @override
  Widget build(BuildContext context) => const ExcludeSemantics(
    child: Row(
      mainAxisSize: MainAxisSize.min,
      spacing: TRGeneratedSpacing.xs,
      children: [
        TRWindowFrameControl(tone: TRWindowFrameControlTone.close),
        TRWindowFrameControl(tone: TRWindowFrameControlTone.minimize),
        TRWindowFrameControl(tone: TRWindowFrameControlTone.maximize),
      ],
    ),
  );
}

class TRWindowFrameControl extends StatelessWidget {
  const TRWindowFrameControl({required this.tone, this.color, super.key});
  final TRWindowFrameControlTone tone;
  final Color? color;
  @override
  Widget build(BuildContext context) => DecoratedBox(
    decoration: BoxDecoration(
      shape: BoxShape.circle,
      color:
          color ??
          switch (tone) {
            TRWindowFrameControlTone.close =>
              TRGeneratedFlutterRendering.windowFrameControlClose,
            TRWindowFrameControlTone.minimize =>
              TRGeneratedFlutterRendering.windowFrameControlMinimize,
            TRWindowFrameControlTone.maximize =>
              TRGeneratedFlutterRendering.windowFrameControlMaximize,
          },
    ),
    child: const SizedBox.square(dimension: TRGeneratedSpacing.md),
  );
}

class TRWindowFrameTitle extends StatelessWidget {
  const TRWindowFrameTitle({required this.child, super.key});
  final Widget child;
  @override
  Widget build(BuildContext context) => DefaultTextStyle.merge(
    style: Theme.of(context).textTheme.labelMedium,
    child: child,
  );
}

class TRWindowFrameAddressBar extends StatelessWidget {
  const TRWindowFrameAddressBar({required this.child, super.key});
  final Widget child;
  @override
  Widget build(BuildContext context) => Container(
    constraints: const BoxConstraints(maxWidth: 320),
    padding: const EdgeInsets.symmetric(
      horizontal: TRGeneratedSpacing.md,
      vertical: TRGeneratedSpacing.xs,
    ),
    decoration: BoxDecoration(
      color: context.tinyrackTheme.surface,
      borderRadius: BorderRadius.circular(TRGeneratedRadii.md),
    ),
    child: DefaultTextStyle.merge(
      maxLines: 1,
      overflow: TextOverflow.ellipsis,
      style: Theme.of(context).textTheme.bodySmall,
      child: child,
    ),
  );
}

class TRWindowFrameBody extends StatelessWidget {
  const TRWindowFrameBody({
    required this.child,
    this.padding = 0,
    this.background,
    this.foreground,
    this.textStyle,
    super.key,
  });
  final Widget child;
  final double padding;
  final Color? background;
  final Color? foreground;
  final TextStyle? textStyle;
  @override
  Widget build(BuildContext context) => Container(
    width: double.infinity,
    color: background ?? context.tinyrackTheme.surface,
    padding: EdgeInsets.all(padding),
    child: DefaultTextStyle.merge(
      style:
          (textStyle ??
                  Theme.of(context).textTheme.bodyMedium ??
                  const TextStyle())
              .copyWith(
                color: foreground,
                height:
                    TRGeneratedFlutterRendering.windowFrameBodyLineHeight /
                    TRGeneratedTypographySizes.md,
              ),
      child: child,
    ),
  );
}
