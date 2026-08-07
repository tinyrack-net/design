import 'package:flutter/material.dart';

import '../../generated/tokens.g.dart';
import '../../internal/layer.dart';
import '../../theme.dart';
import '../../tokens.dart';
import '../../types.dart';

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
    this.uiSize,
    super.key,
  });

  final Widget trigger;
  final List<Widget> menuChildren;
  final MenuController? controller;
  final bool enabled;
  final FocusNode? focusNode;
  final VoidCallback? onClose;
  final VoidCallback? onOpen;

  /// Overrides the size the enclosing [TRMenubar] resolves for this trigger.
  final TRUiSize? uiSize;

  @override
  Widget build(BuildContext context) {
    final size =
        uiSize ?? _TRMenubarScope.maybeOf(context)?.uiSize ?? TRUiSize.md;
    final height = TRControlMetrics.heightOf(size);
    return SubmenuButton(
      // The bar insets its triggers, so shift the panel down by that inset to
      // attach it to the bar's bottom edge instead of the trigger's.
      alignmentOffset: const Offset(0, TRGeneratedSpacing.xs),
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
                    // Matches the web popup's row gap.
                    spacing: TRGeneratedRadii.xs,
                    children: menuChildren,
                  ),
                ),
              ),
            ]
          : const [],
      menuStyle: TRLayerStyles.menu(context),
      onClose: enabled ? onClose : null,
      onOpen: enabled ? onOpen : null,
      style: ButtonStyle(
        alignment: Alignment.center,
        backgroundColor: WidgetStateProperty.resolveWith((states) {
          final colors = context.tinyrackTheme;
          if (states.contains(WidgetState.pressed)) {
            return colors.surfacePressed;
          }
          if (states.contains(WidgetState.focused) ||
              states.contains(WidgetState.hovered)) {
            return colors.surfaceHover;
          }
          return Colors.transparent;
        }),
        fixedSize: WidgetStatePropertyAll(Size.fromHeight(height)),
        // The web trigger paints surface-hover exactly; Material would blend
        // its default onSurface overlay on top while focused or hovered, which
        // lightens the open trigger's tint. Buttons and select suppress the
        // same overlay.
        overlayColor: const WidgetStatePropertyAll(Colors.transparent),
        minimumSize: WidgetStatePropertyAll(Size(0, height)),
        maximumSize: WidgetStatePropertyAll(Size(double.infinity, height)),
        padding: WidgetStatePropertyAll(
          EdgeInsets.symmetric(
            horizontal: TRControlMetrics.inlinePaddingOf(size),
          ),
        ),
        shape: WidgetStatePropertyAll(
          RoundedRectangleBorder(
            // The same corner the standalone menu trigger uses on both
            // platforms; md here rounded the open trigger's tint differently
            // from the web, which only showed once the tint had contrast.
            borderRadius: BorderRadius.circular(TRGeneratedRadii.sm),
          ),
        ),
        // The menubar trigger keeps WidgetState.focused while its menu is open,
        // so a focus ring here paints on the open trigger -- which the web does
        // not do, because focus has moved into the popup. The trigger stays
        // ringless to match, in line with the suite's no-layer-ring model.
        side: const WidgetStatePropertyAll(
          BorderSide(
            color: Colors.transparent,
            width: TRGeneratedBorders.defaultWidth,
          ),
        ),
        tapTargetSize: MaterialTapTargetSize.shrinkWrap,
        textStyle: WidgetStatePropertyAll(
          TRGeneratedTextStyles.bodySm.copyWith(
            fontFamilyFallback: TRGeneratedFontFamilies.fallback,
            fontSize: TRControlMetrics.fontSizeOf(size),
          ),
        ),
        visualDensity: VisualDensity.standard,
      ),
      child: trigger,
    );
  }
}

// @tinyrack-preview menubar
/// A horizontal group of menus with Material arrow-key coordination.
class TRMenubar extends StatelessWidget {
  const TRMenubar({
    required this.menus,
    this.semanticLabel,
    this.uiSize = TRUiSize.md,
    super.key,
  });

  final List<TRMenubarMenu> menus;
  final String? semanticLabel;

  /// Control size every [TRMenubarMenu] in this bar resolves by default.
  final TRUiSize uiSize;

  @override
  Widget build(BuildContext context) {
    final colors = context.tinyrackTheme;
    return Semantics(
      container: true,
      label: semanticLabel,
      child: _TRMenubarScope(
        uiSize: uiSize,
        child: SizedBox(
          height: TRControlMetrics.heightOf(uiSize) + TRGeneratedSpacing.xs * 2,
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
                ),
              ),
            ),
            children: menus,
          ),
        ),
      ),
    );
  }
}

class _TRMenubarScope extends InheritedWidget {
  const _TRMenubarScope({required this.uiSize, required super.child});

  final TRUiSize uiSize;

  static _TRMenubarScope? maybeOf(BuildContext context) =>
      context.dependOnInheritedWidgetOfExactType<_TRMenubarScope>();

  @override
  bool updateShouldNotify(_TRMenubarScope oldWidget) =>
      uiSize != oldWidget.uiSize;
}
