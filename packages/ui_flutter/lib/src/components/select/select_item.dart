part of 'select_widget.dart';

/// A typed option displayed by [TRSelect].
@immutable
class TRSelectItem<T> {
  const TRSelectItem({
    this.key,
    required this.value,
    required this.label,
    this.description,
    this.enabled = true,
    this.leading,
    this.trailing,
  });

  /// Stable identity attached to this option's interactive row.
  final Key? key;

  final T value;
  final String label;

  /// Optional supporting text shown beneath [label] in the option row.
  ///
  /// The selected trigger continues to display only [label]. Search matches
  /// both strings unless the enclosing [TRSelect] supplies a custom filter.
  final String? description;

  final bool enabled;
  final Widget? leading;
  final Widget? trailing;
}
