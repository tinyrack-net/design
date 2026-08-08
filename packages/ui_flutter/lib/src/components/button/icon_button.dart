part of 'button_widget.dart';

/// An icon-only Tinyrack action with a required accessible label.
class TRIconButton extends StatelessWidget {
  const TRIconButton({
    required this.icon,
    required this.label,
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

  final Widget icon;
  final String label;
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
    final size = switch (uiSize) {
      TRUiSize.sm => TRGeneratedControlMetrics.smHeight,
      TRUiSize.md => TRGeneratedControlMetrics.mdHeight,
      TRUiSize.lg => TRGeneratedControlMetrics.lgHeight,
    };
    final iconSize = switch (uiSize) {
      TRUiSize.sm => TRGeneratedControlMetrics.smIconSize,
      TRUiSize.md => TRGeneratedControlMetrics.mdIconSize,
      TRUiSize.lg => TRGeneratedControlMetrics.lgIconSize,
    };
    return SizedBox.square(
      dimension: size,
      child: TRButton._(
        true,
        EdgeInsets.zero,
        label,
        appearance: appearance,
        autofocus: autofocus,
        focusNode: focusNode,
        intent: intent,
        loading: loading,
        loadingLabel: loadingLabel ?? label,
        onPressed: onPressed,
        uiSize: uiSize,
        child: IconTheme.merge(
          data: IconThemeData(size: iconSize),
          child: icon,
        ),
      ),
    );
  }
}
