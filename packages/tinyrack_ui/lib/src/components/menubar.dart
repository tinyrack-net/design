import 'package:flutter/material.dart';

import '../generated/tokens.g.dart';
import '../internal/layer.dart';
import '../theme.dart';

/// One top-level menu in a [TRMenubar].
class TRMenubarMenu extends StatelessWidget {
  const TRMenubarMenu({
    required this.trigger,
    required this.menuChildren,
    this.controller,
    this.enabled = true,
    this.focusNode,
    this.onClose,
    this.onOpen,
    super.key,
  });

  final Widget trigger;
  final List<Widget> menuChildren;
  final MenuController? controller;
  final bool enabled;
  final FocusNode? focusNode;
  final VoidCallback? onClose;
  final VoidCallback? onOpen;

  @override
  Widget build(BuildContext context) => SubmenuButton(
    controller: controller,
    focusNode: focusNode,
    menuChildren: enabled
        ? [
            TRLayerSurface(
              kind: TRLayerBoundaryKind.menubar,
              child: SingleChildScrollView(
                primary: false,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  mainAxisSize: MainAxisSize.min,
                  children: menuChildren,
                ),
              ),
            ),
          ]
        : const [],
    onClose: enabled ? onClose : null,
    onOpen: enabled ? onOpen : null,
    style: ButtonStyle(
      alignment: Alignment.center,
      backgroundColor: WidgetStateProperty.resolveWith((states) {
        final colors = context.tinyrackTheme;
        if (states.contains(WidgetState.pressed)) return colors.surfacePressed;
        if (states.contains(WidgetState.focused) ||
            states.contains(WidgetState.hovered)) {
          return colors.surfaceHover;
        }
        return Colors.transparent;
      }),
      fixedSize: const WidgetStatePropertyAll(
        Size.fromHeight(TRGeneratedControlMetrics.smHeight),
      ),
      minimumSize: const WidgetStatePropertyAll(
        Size(0, TRGeneratedControlMetrics.smHeight),
      ),
      maximumSize: const WidgetStatePropertyAll(
        Size(double.infinity, TRGeneratedControlMetrics.smHeight),
      ),
      padding: const WidgetStatePropertyAll(
        EdgeInsets.symmetric(
          horizontal: TRGeneratedControlMetrics.smPaddingInline,
        ),
      ),
      shape: WidgetStatePropertyAll(
        RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(TRGeneratedRadii.md),
        ),
      ),
      side: const WidgetStatePropertyAll(BorderSide(color: Colors.transparent)),
      tapTargetSize: MaterialTapTargetSize.shrinkWrap,
      textStyle: WidgetStatePropertyAll(
        TRGeneratedTextStyles.bodySm.copyWith(
          fontFamilyFallback: TRGeneratedFontFamilies.fallback,
        ),
      ),
      visualDensity: VisualDensity.standard,
    ),
    child: trigger,
  );
}

// @tinyrack-preview menubar
/// A horizontal group of menus with Material arrow-key coordination.
class TRMenubar extends StatelessWidget {
  const TRMenubar({required this.menus, this.semanticLabel, super.key});

  final List<TRMenubarMenu> menus;
  final String? semanticLabel;

  @override
  Widget build(BuildContext context) {
    final colors = context.tinyrackTheme;
    return Semantics(
      container: true,
      label: semanticLabel,
      child: SizedBox(
        height:
            TRGeneratedControlMetrics.smHeight +
            TRGeneratedSpacing.xs * 2 +
            TRGeneratedBorders.defaultWidth * 2,
        child: MenuBar(
          style: MenuStyle(
            backgroundColor: WidgetStatePropertyAll(colors.surface),
            elevation: const WidgetStatePropertyAll(0),
            padding: const WidgetStatePropertyAll(
              EdgeInsets.all(TRGeneratedSpacing.xs),
            ),
            shape: WidgetStatePropertyAll(
              RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(TRGeneratedRadii.lg),
                side: BorderSide(color: colors.border),
              ),
            ),
          ),
          children: menus,
        ),
      ),
    );
  }
}
