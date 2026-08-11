part of 'select_widget.dart';

/// A typed option displayed by [TRSelect].
@immutable
class TRSelectItem<T> {
  const TRSelectItem({
    this.key,
    required this.value,
    required this.label,
    this.enabled = true,
    this.leading,
    this.trailing,
  });

  /// Stable identity attached to this option's interactive row.
  final Key? key;

  final T value;
  final String label;
  final bool enabled;
  final Widget? leading;
  final Widget? trailing;
}
