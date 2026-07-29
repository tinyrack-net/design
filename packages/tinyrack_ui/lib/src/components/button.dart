import 'package:flutter/material.dart';

import '../theme.dart';
import '../types.dart';
import 'spinner.dart';

// @tinyrack-preview button
// @tinyrack-preview icon-button
/// A Tinyrack command or form action.
class TRButton extends StatelessWidget {
  const TRButton({
    required this.child,
    required this.onPressed,
    this.appearance = TRAppearance.solid,
    this.autofocus = false,
    this.focusNode,
    this.intent = TRIntent.neutral,
    this.loading = false,
    this.loadingLabel,
    this.uiSize = TRUiSize.md,
    super.key,
  });

  final Widget child;
  final VoidCallback? onPressed;
  final TRAppearance appearance;
  final bool autofocus;
  final FocusNode? focusNode;
  final TRIntent intent;
  final bool loading;
  final String? loadingLabel;
  final TRUiSize uiSize;

  @override
  Widget build(BuildContext context) {
    final colors = context.tinyrackTheme;
    final foreground = colors.foregroundFor(intent);
    final disabled = onPressed == null || loading;
    final size = switch (uiSize) {
      TRUiSize.sm => const Size(0, 32),
      TRUiSize.md => const Size(0, 40),
      TRUiSize.lg => const Size(0, 48),
    };
    final padding = switch (uiSize) {
      TRUiSize.sm => const EdgeInsets.symmetric(horizontal: 12),
      TRUiSize.md => const EdgeInsets.symmetric(horizontal: 16),
      TRUiSize.lg => const EdgeInsets.symmetric(horizontal: 20),
    };
    final style = ButtonStyle(
      backgroundColor: WidgetStatePropertyAll(switch (appearance) {
        TRAppearance.solid => foreground,
        TRAppearance.outline || TRAppearance.ghost => Colors.transparent,
      }),
      foregroundColor: WidgetStatePropertyAll(
        appearance == TRAppearance.solid
            ? (intent == TRIntent.primary ? colors.onPrimary : colors.surface)
            : foreground,
      ),
      minimumSize: WidgetStatePropertyAll(size),
      padding: WidgetStatePropertyAll(padding),
      side: WidgetStatePropertyAll(
        appearance == TRAppearance.outline
            ? BorderSide(color: foreground)
            : BorderSide.none,
      ),
      shape: const WidgetStatePropertyAll(
        RoundedRectangleBorder(
          borderRadius: BorderRadius.all(Radius.circular(6)),
        ),
      ),
    );
    final content = AnimatedSwitcher(
      duration: const Duration(milliseconds: 120),
      child: loading
          ? Row(
              key: const ValueKey('loading'),
              mainAxisSize: MainAxisSize.min,
              children: [
                const TRSpinner(uiSize: TRUiSize.sm),
                const SizedBox(width: 8),
                child,
              ],
            )
          : KeyedSubtree(key: const ValueKey('idle'), child: child),
    );
    final button = switch (appearance) {
      TRAppearance.solid => FilledButton(
        autofocus: autofocus,
        focusNode: focusNode,
        onPressed: disabled ? null : onPressed,
        style: style,
        child: content,
      ),
      TRAppearance.outline => OutlinedButton(
        autofocus: autofocus,
        focusNode: focusNode,
        onPressed: disabled ? null : onPressed,
        style: style,
        child: content,
      ),
      TRAppearance.ghost => TextButton(
        autofocus: autofocus,
        focusNode: focusNode,
        onPressed: disabled ? null : onPressed,
        style: style,
        child: content,
      ),
    };

    return Semantics(
      enabled: !disabled,
      label: loading ? loadingLabel : null,
      value: loading ? loadingLabel : null,
      child: button,
    );
  }
}

/// An icon-only Tinyrack action with a required accessible label.
class TRIconButton extends StatelessWidget {
  const TRIconButton({
    required this.icon,
    required this.label,
    required this.onPressed,
    this.intent = TRIntent.neutral,
    this.uiSize = TRUiSize.md,
    super.key,
  });

  final Widget icon;
  final String label;
  final VoidCallback? onPressed;
  final TRIntent intent;
  final TRUiSize uiSize;

  @override
  Widget build(BuildContext context) {
    final size = switch (uiSize) {
      TRUiSize.sm => 32.0,
      TRUiSize.md => 40.0,
      TRUiSize.lg => 48.0,
    };
    return IconButton(
      color: context.tinyrackTheme.foregroundFor(intent),
      constraints: BoxConstraints.tightFor(width: size, height: size),
      icon: icon,
      onPressed: onPressed,
      tooltip: label,
    );
  }
}
