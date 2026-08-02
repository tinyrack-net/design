import 'package:flutter/material.dart';

import '../generated/tokens.g.dart';
import '../internal/layer.dart';
import '../theme.dart';
import '../types.dart';
import 'text_field.dart';

// @tinyrack-preview toolbar
/// A keyboard-navigable row of related application controls.
class TRToolbar extends StatelessWidget {
  const TRToolbar({
    required this.children,
    this.semanticLabel,
    this.wrap = false,
    super.key,
  });

  final List<Widget> children;
  final String? semanticLabel;
  final bool wrap;

  @override
  Widget build(BuildContext context) {
    final colors = context.tinyrackTheme;
    final content = wrap
        ? Wrap(
            crossAxisAlignment: WrapCrossAlignment.center,
            spacing: TRGeneratedSpacing.xs,
            runSpacing: TRGeneratedSpacing.xs,
            children: children,
          )
        : Row(
            mainAxisSize: MainAxisSize.min,
            spacing: TRGeneratedSpacing.xs,
            children: children,
          );
    return Semantics(
      container: true,
      label: semanticLabel,
      child: FocusTraversalGroup(
        policy: ReadingOrderTraversalPolicy(),
        child: Container(
          constraints: const BoxConstraints(
            minHeight: TRGeneratedLayerMetrics.toolbarHeight,
          ),
          decoration: BoxDecoration(
            color: colors.surface,
            border: Border.all(color: colors.border),
            borderRadius: BorderRadius.circular(TRGeneratedRadii.md),
          ),
          padding: const EdgeInsets.all(TRGeneratedSpacing.xs),
          child: content,
        ),
      ),
    );
  }
}

/// A visually adjacent subset of toolbar controls.
class TRToolbarGroup extends StatelessWidget {
  const TRToolbarGroup({required this.children, this.semanticLabel, super.key});

  final List<Widget> children;
  final String? semanticLabel;

  @override
  Widget build(BuildContext context) => Semantics(
    container: true,
    label: semanticLabel,
    child: Row(mainAxisSize: MainAxisSize.min, children: children),
  );
}

/// A compact toolbar command.
class TRToolbarButton extends StatelessWidget {
  const TRToolbarButton({
    required this.child,
    required this.onPressed,
    this.focusNode,
    this.selected = false,
    this.tooltip,
    super.key,
  });

  final Widget child;
  final VoidCallback? onPressed;
  final FocusNode? focusNode;
  final bool selected;
  final String? tooltip;

  @override
  Widget build(BuildContext context) {
    final colors = context.tinyrackTheme;
    final button = SizedBox.square(
      dimension: TRGeneratedControlMetrics.smHeight,
      child: TextButton(
        focusNode: focusNode,
        onPressed: onPressed,
        style: ButtonStyle(
          alignment: Alignment.center,
          backgroundColor: WidgetStateProperty.resolveWith((states) {
            if (states.contains(WidgetState.pressed)) {
              return colors.surfacePressed;
            }
            if (states.contains(WidgetState.focused) ||
                states.contains(WidgetState.hovered)) {
              return colors.surfaceHover;
            }
            return selected ? colors.surfaceSelected : Colors.transparent;
          }),
          fixedSize: const WidgetStatePropertyAll(
            Size.square(TRGeneratedControlMetrics.smHeight),
          ),
          padding: const WidgetStatePropertyAll(EdgeInsets.zero),
          shape: WidgetStatePropertyAll(
            RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(TRGeneratedRadii.md),
            ),
          ),
          side: const WidgetStatePropertyAll(
            BorderSide(color: Colors.transparent),
          ),
          tapTargetSize: MaterialTapTargetSize.shrinkWrap,
          visualDensity: VisualDensity.standard,
        ),
        child: child,
      ),
    );
    return tooltip == null ? button : Tooltip(message: tooltip, child: button);
  }
}

/// A toolbar navigation action.
class TRToolbarLink extends StatelessWidget {
  const TRToolbarLink({
    required this.child,
    required this.onTap,
    this.semanticLabel,
    super.key,
  });

  final Widget child;
  final VoidCallback? onTap;
  final String? semanticLabel;

  @override
  Widget build(BuildContext context) => Semantics(
    button: false,
    link: true,
    label: semanticLabel,
    child: TextButton(
      onPressed: onTap,
      style: TRLayerStyles.item(context),
      child: child,
    ),
  );
}

/// A compact text input embedded in a toolbar.
class TRToolbarInput extends StatelessWidget {
  const TRToolbarInput({
    this.controller,
    this.focusNode,
    this.onChanged,
    this.placeholder,
    this.semanticLabel,
    this.width = TRGeneratedMeasurements.measureSm,
    super.key,
  });

  final TextEditingController? controller;
  final FocusNode? focusNode;
  final ValueChanged<String>? onChanged;
  final String? placeholder;
  final String? semanticLabel;
  final double width;

  @override
  Widget build(BuildContext context) => Semantics(
    label: semanticLabel,
    textField: true,
    child: SizedBox(
      width: width,
      child: TRTextField(
        controller: controller,
        focusNode: focusNode,
        onChanged: onChanged,
        placeholder: placeholder,
        uiSize: TRUiSize.md,
      ),
    ),
  );
}

/// A vertical separator between toolbar groups.
class TRToolbarSeparator extends StatelessWidget {
  const TRToolbarSeparator({super.key});

  @override
  Widget build(BuildContext context) => Container(
    width: TRGeneratedBorders.defaultWidth,
    height: TRGeneratedControlMetrics.smLineHeight,
    color: context.tinyrackTheme.border,
  );
}
