import 'dart:math' as math;

import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';

import '../generated/tokens.g.dart';
import '../theme.dart';

/// Internal render-tree marker used by the preview parity harness.
///
/// The type is intentionally not exported from the package library.
enum TRLayerBoundaryKind { menu, select, dialog }

class TRLayerBoundary extends SingleChildRenderObjectWidget {
  const TRLayerBoundary({required this.kind, required super.child, super.key});

  final TRLayerBoundaryKind kind;

  @override
  RenderTRLayerBoundary createRenderObject(BuildContext context) =>
      RenderTRLayerBoundary(kind);

  @override
  void updateRenderObject(
    BuildContext context,
    RenderTRLayerBoundary renderObject,
  ) {
    renderObject.kind = kind;
  }
}

class RenderTRLayerBoundary extends RenderProxyBox {
  RenderTRLayerBoundary(this._kind);

  TRLayerBoundaryKind _kind;

  TRLayerBoundaryKind get kind => _kind;

  set kind(TRLayerBoundaryKind value) {
    if (_kind == value) return;
    _kind = value;
    markNeedsPaint();
  }
}

/// Internal render marker for text and icon regions measured by parity tests.
class TRLayerPartBoundary extends SingleChildRenderObjectWidget {
  const TRLayerPartBoundary({
    required this.name,
    required super.child,
    super.key,
  });

  final String name;

  @override
  RenderTRLayerPartBoundary createRenderObject(BuildContext context) =>
      RenderTRLayerPartBoundary(name);

  @override
  void updateRenderObject(
    BuildContext context,
    RenderTRLayerPartBoundary renderObject,
  ) {
    renderObject.name = name;
  }
}

class RenderTRLayerPartBoundary extends RenderProxyBox {
  RenderTRLayerPartBoundary(this._name);

  String _name;

  String get name => _name;

  set name(String value) {
    if (_name == value) return;
    _name = value;
    markNeedsPaint();
  }
}

/// Shared layer chrome for package components. This file is intentionally not
/// exported from the public package library.
abstract final class TRLayerStyles {
  static MenuStyle menu(
    BuildContext context, {
    AlignmentGeometry alignment = AlignmentDirectional.topStart,
    double minWidth = TRGeneratedMeasurements.measureMd,
    double maxWidth =
        TRGeneratedMeasurements.overlayWidthSm + TRGeneratedSpacing.size2xl,
  }) {
    final media = MediaQuery.of(context);
    final availableWidth = math.max(
      0.0,
      media.size.width -
          media.padding.horizontal -
          TRGeneratedMeasurements.overlayInlineInset,
    );
    final availableHeight = math.max(
      0.0,
      media.size.height -
          media.padding.vertical -
          TRGeneratedMeasurements.overlayInlineInset,
    );
    return MenuStyle(
      alignment: alignment,
      backgroundColor: const WidgetStatePropertyAll(Colors.transparent),
      elevation: const WidgetStatePropertyAll(0),
      maximumSize: WidgetStatePropertyAll(
        Size(
          math.min(maxWidth, availableWidth),
          math.min(TRGeneratedMeasurements.measureXl, availableHeight),
        ),
      ),
      minimumSize: WidgetStatePropertyAll(
        Size(math.min(minWidth, availableWidth), 0),
      ),
      padding: const WidgetStatePropertyAll(EdgeInsets.zero),
      shadowColor: const WidgetStatePropertyAll(Colors.transparent),
      surfaceTintColor: const WidgetStatePropertyAll(Colors.transparent),
      visualDensity: VisualDensity.standard,
    );
  }

  static ButtonStyle item(BuildContext context, {bool selected = false}) {
    final colors = context.tinyrackTheme;
    return ButtonStyle(
      alignment: AlignmentDirectional.centerStart,
      backgroundColor: WidgetStateProperty.resolveWith((states) {
        if (states.contains(WidgetState.pressed)) return colors.surfacePressed;
        if (states.contains(WidgetState.focused) ||
            states.contains(WidgetState.hovered)) {
          return colors.surfaceHover;
        }
        return selected ? colors.surfaceSelected : Colors.transparent;
      }),
      foregroundColor: WidgetStateProperty.resolveWith(
        (states) => states.contains(WidgetState.disabled)
            ? colors.textMuted
            : colors.text,
      ),
      iconColor: WidgetStateProperty.resolveWith(
        (states) => states.contains(WidgetState.disabled)
            ? colors.textMuted
            : colors.text,
      ),
      minimumSize: const WidgetStatePropertyAll(
        Size(0, TRGeneratedControlMetrics.smHeight + TRGeneratedSpacing.xs),
      ),
      maximumSize: const WidgetStatePropertyAll(
        Size(
          double.infinity,
          TRGeneratedControlMetrics.smHeight + TRGeneratedSpacing.xs,
        ),
      ),
      padding: const WidgetStatePropertyAll(
        EdgeInsets.symmetric(
          horizontal: TRGeneratedControlMetrics.smPaddingInline,
        ),
      ),
      shape: WidgetStatePropertyAll(
        RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(TRGeneratedRadii.sm),
        ),
      ),
      side: WidgetStateProperty.resolveWith(
        (states) => BorderSide(
          color: states.contains(WidgetState.focused)
              ? colors.focus
              : Colors.transparent,
          width: states.contains(WidgetState.focused)
              ? TRGeneratedBorders.focusWidth
              : TRGeneratedBorders.defaultWidth,
        ),
      ),
      tapTargetSize: MaterialTapTargetSize.shrinkWrap,
      textStyle: WidgetStatePropertyAll(
        TRGeneratedTextStyles.bodySm.copyWith(
          fontFamilyFallback: TRGeneratedFontFamilies.fallback,
        ),
      ),
      visualDensity: VisualDensity.standard,
    );
  }
}

/// A clipped Tinyrack popup surface with shared overlay geometry.
class TRLayerSurface extends StatelessWidget {
  const TRLayerSurface({
    required this.child,
    this.kind = TRLayerBoundaryKind.menu,
    this.maxWidth =
        TRGeneratedMeasurements.overlayWidthSm + TRGeneratedSpacing.size2xl,
    this.minWidth = TRGeneratedMeasurements.measureMd,
    this.padding = const EdgeInsets.all(TRGeneratedSpacing.xs),
    super.key,
  });

  final Widget child;
  final TRLayerBoundaryKind kind;
  final double maxWidth;
  final double minWidth;
  final EdgeInsetsGeometry padding;

  @override
  Widget build(BuildContext context) {
    final colors = context.tinyrackTheme;
    return TRLayerBoundary(
      kind: kind,
      child: Container(
        constraints: BoxConstraints(minWidth: minWidth, maxWidth: maxWidth),
        decoration: BoxDecoration(
          color: colors.surface,
          border: Border.all(
            color: colors.border,
            width: TRGeneratedBorders.defaultWidth,
          ),
          borderRadius: BorderRadius.circular(TRGeneratedRadii.md),
          boxShadow: const [TRGeneratedShadows.overlay],
        ),
        child: ClipRRect(
          borderRadius: BorderRadius.circular(
            TRGeneratedRadii.md - TRGeneratedBorders.defaultWidth,
          ),
          child: Padding(padding: padding, child: child),
        ),
      ),
    );
  }
}
