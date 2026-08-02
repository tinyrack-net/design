import 'dart:async';

import 'package:flutter/material.dart';

import '../../generated/tokens.g.dart';
import '../../internal/layer.dart';
import '../../types.dart';
import '../text_field/text_field.dart';

/// Layout used by a combobox options popup.
enum TRComboboxLayout { list, grid }

/// A typed option displayed by a Tinyrack combobox.
@immutable
class TRComboboxItem<T extends Object> {
  const TRComboboxItem({
    required this.value,
    required this.label,
    this.enabled = true,
    this.leading,
    this.trailing,
  });

  final T value;
  final String label;
  final bool enabled;
  final Widget? leading;
  final Widget? trailing;
}

typedef TRComboboxOptionsBuilder<T extends Object> =
    FutureOr<Iterable<TRComboboxItem<T>>> Function(String query);

/// Owns a single combobox value and its query field.
class TRComboboxController<T extends Object> extends ChangeNotifier {
  factory TRComboboxController({T? value, String query = ''}) =>
      TRComboboxController._(value, query);

  TRComboboxController._(this._value, String query)
    : textEditingController = TextEditingController(text: query),
      focusNode = FocusNode();

  T? _value;
  final TextEditingController textEditingController;
  final FocusNode focusNode;

  T? get value => _value;

  void select(T? value) {
    if (_value == value) return;
    _value = value;
    notifyListeners();
  }

  void clear() {
    _value = null;
    textEditingController.clear();
    notifyListeners();
  }

  @override
  void dispose() {
    textEditingController.dispose();
    focusNode.dispose();
    super.dispose();
  }
}

/// Owns multiple combobox values and their shared query field.
class TRMultiComboboxController<T extends Object> extends ChangeNotifier {
  factory TRMultiComboboxController({Iterable<T> values = const []}) =>
      TRMultiComboboxController._(List<T>.of(values));

  TRMultiComboboxController._(this._values)
    : textEditingController = TextEditingController(),
      focusNode = FocusNode();

  List<T> _values;
  final TextEditingController textEditingController;
  final FocusNode focusNode;

  List<T> get values => List.unmodifiable(_values);

  void replace(Iterable<T> values) {
    final next = List<T>.of(values);
    if (_listEquals(_values, next)) return;
    _values = next;
    notifyListeners();
  }

  void toggle(T value) {
    final next = List<T>.of(_values);
    next.contains(value) ? next.remove(value) : next.add(value);
    replace(next);
  }

  void clear() {
    if (_values.isEmpty) return;
    _values = [];
    notifyListeners();
  }

  @override
  void dispose() {
    textEditingController.dispose();
    focusNode.dispose();
    super.dispose();
  }
}

// @tinyrack-preview combobox
/// A searchable, typed single-selection field.
class TRCombobox<T extends Object> extends StatefulWidget {
  const TRCombobox({
    this.items = const [],
    this.optionsBuilder,
    this.controller,
    this.defaultValue,
    this.enabled = true,
    this.errorText,
    this.helperText,
    this.label,
    this.layout = TRComboboxLayout.list,
    this.onQueryChange,
    this.onValueChange,
    this.placeholder,
    this.readOnly = false,
    this.uiSize = TRUiSize.md,
    this.width,
    super.key,
  }) : value = null,
       _controlled = false,
       assert(items.length > 0 || optionsBuilder != null);

  const TRCombobox.controlled({
    required this.value,
    this.items = const [],
    this.optionsBuilder,
    this.controller,
    this.enabled = true,
    this.errorText,
    this.helperText,
    this.label,
    this.layout = TRComboboxLayout.list,
    this.onQueryChange,
    this.onValueChange,
    this.placeholder,
    this.readOnly = false,
    this.uiSize = TRUiSize.md,
    this.width,
    super.key,
  }) : defaultValue = null,
       _controlled = true,
       assert(items.length > 0 || optionsBuilder != null);

  final List<TRComboboxItem<T>> items;
  final TRComboboxOptionsBuilder<T>? optionsBuilder;
  final TRComboboxController<T>? controller;
  final T? defaultValue;
  final T? value;
  final bool enabled;
  final String? errorText;
  final String? helperText;
  final String? label;
  final TRComboboxLayout layout;
  final ValueChanged<String>? onQueryChange;
  final ValueChanged<T?>? onValueChange;
  final String? placeholder;
  final bool readOnly;
  final TRUiSize uiSize;
  final double? width;
  final bool _controlled;

  @override
  State<TRCombobox<T>> createState() => _TRComboboxState<T>();
}

class _TRComboboxState<T extends Object> extends State<TRCombobox<T>> {
  TRComboboxController<T>? _internalController;

  TRComboboxController<T> get _controller =>
      widget.controller ??
      (_internalController ??= TRComboboxController<T>(
        value: widget.defaultValue,
      ));

  T? get _value => widget._controlled ? widget.value : _controller.value;

  @override
  void initState() {
    super.initState();
    _controller.addListener(_handleControllerChange);
    _syncLabel();
  }

  @override
  void didUpdateWidget(TRCombobox<T> oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.controller != widget.controller) {
      (oldWidget.controller ?? _internalController)?.removeListener(
        _handleControllerChange,
      );
      if (widget.controller != null) {
        _internalController?.dispose();
        _internalController = null;
      }
      _controller.addListener(_handleControllerChange);
    }
    _syncLabel();
  }

  @override
  void dispose() {
    _controller.removeListener(_handleControllerChange);
    _internalController?.dispose();
    super.dispose();
  }

  void _handleControllerChange() {
    _syncLabel();
    if (mounted) setState(() {});
  }

  void _syncLabel() {
    final value = _value;
    if (value == null) return;
    for (final item in widget.items) {
      if (item.value == value &&
          _controller.textEditingController.text != item.label) {
        _controller.textEditingController.value = TextEditingValue(
          text: item.label,
          selection: TextSelection.collapsed(offset: item.label.length),
        );
        return;
      }
    }
  }

  void _select(T value) {
    if (!widget._controlled) _controller.select(value);
    widget.onValueChange?.call(value);
  }

  @override
  Widget build(BuildContext context) => _TRComboboxInput<T>(
    controller: _controller.textEditingController,
    focusNode: _controller.focusNode,
    enabled: widget.enabled,
    errorText: widget.errorText,
    helperText: widget.helperText,
    items: widget.items,
    label: widget.label,
    layout: widget.layout,
    onQueryChange: widget.onQueryChange,
    onSelected: _select,
    optionsBuilder: widget.optionsBuilder,
    placeholder: widget.placeholder,
    readOnly: widget.readOnly,
    selected: _value == null ? const {} : {_value as T},
    uiSize: widget.uiSize,
    width: widget.width,
  );
}

/// A searchable multiple-selection field with removable chips.
class TRMultiCombobox<T extends Object> extends StatefulWidget {
  const TRMultiCombobox({
    this.items = const [],
    this.optionsBuilder,
    this.controller,
    this.defaultValue = const [],
    this.enabled = true,
    this.errorText,
    this.helperText,
    this.label,
    this.layout = TRComboboxLayout.list,
    this.onQueryChange,
    this.onValueChange,
    this.placeholder,
    this.readOnly = false,
    this.uiSize = TRUiSize.md,
    this.width,
    super.key,
  }) : value = null,
       assert(items.length > 0 || optionsBuilder != null);

  const TRMultiCombobox.controlled({
    required this.value,
    this.items = const [],
    this.optionsBuilder,
    this.controller,
    this.enabled = true,
    this.errorText,
    this.helperText,
    this.label,
    this.layout = TRComboboxLayout.list,
    this.onQueryChange,
    this.onValueChange,
    this.placeholder,
    this.readOnly = false,
    this.uiSize = TRUiSize.md,
    this.width,
    super.key,
  }) : defaultValue = const [],
       assert(items.length > 0 || optionsBuilder != null);

  final List<TRComboboxItem<T>> items;
  final TRComboboxOptionsBuilder<T>? optionsBuilder;
  final TRMultiComboboxController<T>? controller;
  final List<T> defaultValue;
  final List<T>? value;
  final bool enabled;
  final String? errorText;
  final String? helperText;
  final String? label;
  final TRComboboxLayout layout;
  final ValueChanged<String>? onQueryChange;
  final ValueChanged<List<T>>? onValueChange;
  final String? placeholder;
  final bool readOnly;
  final TRUiSize uiSize;
  final double? width;

  @override
  State<TRMultiCombobox<T>> createState() => _TRMultiComboboxState<T>();
}

class _TRMultiComboboxState<T extends Object>
    extends State<TRMultiCombobox<T>> {
  TRMultiComboboxController<T>? _internalController;

  TRMultiComboboxController<T> get _controller =>
      widget.controller ??
      (_internalController ??= TRMultiComboboxController<T>(
        values: widget.defaultValue,
      ));

  List<T> get _values => widget.value ?? _controller.values;

  @override
  void initState() {
    super.initState();
    _controller.addListener(_handleControllerChange);
  }

  @override
  void didUpdateWidget(TRMultiCombobox<T> oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.controller == widget.controller) return;
    (oldWidget.controller ?? _internalController)?.removeListener(
      _handleControllerChange,
    );
    if (widget.controller != null) {
      _internalController?.dispose();
      _internalController = null;
    }
    _controller.addListener(_handleControllerChange);
  }

  @override
  void dispose() {
    _controller.removeListener(_handleControllerChange);
    _internalController?.dispose();
    super.dispose();
  }

  void _handleControllerChange() {
    if (mounted) setState(() {});
  }

  void _toggle(T value) {
    final next = List<T>.of(_values);
    next.contains(value) ? next.remove(value) : next.add(value);
    if (widget.value == null) _controller.replace(next);
    widget.onValueChange?.call(List.unmodifiable(next));
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (!mounted) return;
      _controller.textEditingController.clear();
      _controller.focusNode.requestFocus();
    });
  }

  @override
  Widget build(BuildContext context) => Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    mainAxisSize: MainAxisSize.min,
    spacing: TRGeneratedSpacing.xs,
    children: [
      if (_values.isNotEmpty)
        Wrap(
          spacing: TRGeneratedSpacing.xs,
          runSpacing: TRGeneratedSpacing.xs,
          children: [
            for (final value in _values)
              InputChip(
                label: Text(_labelFor(value)),
                onDeleted: widget.enabled && !widget.readOnly
                    ? () => _toggle(value)
                    : null,
              ),
          ],
        ),
      _TRComboboxInput<T>(
        controller: _controller.textEditingController,
        focusNode: _controller.focusNode,
        enabled: widget.enabled,
        errorText: widget.errorText,
        helperText: widget.helperText,
        items: widget.items,
        label: widget.label,
        layout: widget.layout,
        onQueryChange: widget.onQueryChange,
        onSelected: _toggle,
        optionsBuilder: widget.optionsBuilder,
        placeholder: widget.placeholder,
        readOnly: widget.readOnly,
        selected: _values.toSet(),
        uiSize: widget.uiSize,
        width: widget.width,
      ),
    ],
  );

  String _labelFor(T value) {
    for (final item in widget.items) {
      if (item.value == value) return item.label;
    }
    return value.toString();
  }
}

class _TRComboboxInput<T extends Object> extends StatelessWidget {
  const _TRComboboxInput({
    required this.controller,
    required this.focusNode,
    required this.enabled,
    required this.errorText,
    required this.helperText,
    required this.items,
    required this.label,
    required this.layout,
    required this.onQueryChange,
    required this.onSelected,
    required this.optionsBuilder,
    required this.placeholder,
    required this.readOnly,
    required this.selected,
    required this.uiSize,
    required this.width,
  });

  final TextEditingController controller;
  final FocusNode focusNode;
  final bool enabled;
  final String? errorText;
  final String? helperText;
  final List<TRComboboxItem<T>> items;
  final String? label;
  final TRComboboxLayout layout;
  final ValueChanged<String>? onQueryChange;
  final ValueChanged<T> onSelected;
  final TRComboboxOptionsBuilder<T>? optionsBuilder;
  final String? placeholder;
  final bool readOnly;
  final Set<T> selected;
  final TRUiSize uiSize;
  final double? width;

  FutureOr<Iterable<TRComboboxItem<T>>> _options(
    TextEditingValue editing,
  ) async {
    final query = editing.text.trim();
    final source = optionsBuilder == null
        ? items
        : await optionsBuilder!(query);
    final selectedLabel = selected.length == 1
        ? items
              .where((item) => item.value == selected.single)
              .map((item) => item.label.trim().toLowerCase())
              .firstOrNull
        : null;
    final normalized = query.toLowerCase() == selectedLabel
        ? ''
        : query.toLowerCase();
    return source.where(
      (item) =>
          item.enabled &&
          (normalized.isEmpty || item.label.toLowerCase().contains(normalized)),
    );
  }

  @override
  Widget build(BuildContext context) {
    final popupWidth = width ?? TRGeneratedMeasurements.overlayWidthSm;
    return SizedBox(
      width: width,
      child: RawAutocomplete<TRComboboxItem<T>>(
        displayStringForOption: (item) => item.label,
        focusNode: focusNode,
        textEditingController: controller,
        optionsBuilder: _options,
        onSelected: (item) => onSelected(item.value),
        fieldViewBuilder: (context, controller, focusNode, onSubmitted) =>
            TRTextField(
              controller: controller,
              enabled: enabled,
              errorText: errorText,
              focusNode: focusNode,
              helperText: helperText,
              label: label,
              onChanged: onQueryChange,
              onSubmitted: (_) => onSubmitted(),
              placeholder: placeholder,
              readOnly: readOnly,
              uiSize: uiSize,
            ),
        optionsViewBuilder: (context, select, options) => Align(
          alignment: AlignmentDirectional.topStart,
          child: Transform.translate(
            offset: const Offset(0, TRGeneratedSpacing.sm),
            child: TRLayerSurface(
              kind: TRLayerBoundaryKind.combobox,
              minWidth: popupWidth,
              maxWidth: popupWidth,
              padding: const EdgeInsets.all(TRGeneratedSpacing.xs),
              child: ConstrainedBox(
                constraints: const BoxConstraints(
                  maxHeight: TRGeneratedMeasurements.measureXl,
                ),
                child: layout == TRComboboxLayout.grid
                    ? GridView.builder(
                        padding: EdgeInsets.zero,
                        shrinkWrap: true,
                        gridDelegate:
                            const SliverGridDelegateWithFixedCrossAxisCount(
                              crossAxisCount: 2,
                              mainAxisExtent:
                                  TRGeneratedLayerMetrics.menuItemHeight,
                              crossAxisSpacing: TRGeneratedSpacing.xs,
                              mainAxisSpacing: TRGeneratedSpacing.xs,
                            ),
                        itemCount: options.length,
                        itemBuilder: (context, index) => _option(
                          context,
                          options.elementAt(index),
                          index,
                          select,
                        ),
                      )
                    : ListView.separated(
                        padding: EdgeInsets.zero,
                        shrinkWrap: true,
                        itemCount: options.length,
                        separatorBuilder: (context, index) =>
                            const SizedBox(height: TRGeneratedSpacing.xs),
                        itemBuilder: (context, index) => _option(
                          context,
                          options.elementAt(index),
                          index,
                          select,
                        ),
                      ),
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _option(
    BuildContext context,
    TRComboboxItem<T> item,
    int index,
    AutocompleteOnSelected<TRComboboxItem<T>> select,
  ) => SizedBox(
    width: double.infinity,
    child: MenuItemButton(
      leadingIcon: item.leading,
      onPressed: () => select(item),
      style: TRLayerStyles.option(
        context,
        selected:
            selected.contains(item.value) ||
            AutocompleteHighlightedOption.of(context) == index,
      ),
      trailingIcon: item.trailing,
      child: TRLayerPartBoundary(name: 'option$index', child: Text(item.label)),
    ),
  );
}

/// Form-integrated single combobox.
class TRComboboxFormField<T extends Object> extends FormField<T> {
  TRComboboxFormField({
    required List<TRComboboxItem<T>> items,
    TRComboboxOptionsBuilder<T>? optionsBuilder,
    super.initialValue,
    super.autovalidateMode,
    super.enabled = true,
    String? helperText,
    String? label,
    ValueChanged<T?>? onValueChange,
    super.onSaved,
    super.validator,
    String? placeholder,
    TRUiSize uiSize = TRUiSize.md,
    super.key,
  }) : super(
         builder: (field) => TRCombobox<T>.controlled(
           value: field.value,
           items: items,
           optionsBuilder: optionsBuilder,
           enabled: enabled,
           errorText: field.errorText,
           helperText: helperText,
           label: label,
           onValueChange: (value) {
             field.didChange(value);
             onValueChange?.call(value);
           },
           placeholder: placeholder,
           uiSize: uiSize,
         ),
       );
}

/// Form-integrated multiple combobox.
class TRMultiComboboxFormField<T extends Object> extends FormField<List<T>> {
  TRMultiComboboxFormField({
    required List<TRComboboxItem<T>> items,
    TRComboboxOptionsBuilder<T>? optionsBuilder,
    List<T> initialValue = const [],
    super.autovalidateMode,
    super.enabled = true,
    String? helperText,
    String? label,
    ValueChanged<List<T>>? onValueChange,
    super.onSaved,
    super.validator,
    String? placeholder,
    super.key,
  }) : super(
         initialValue: initialValue,
         builder: (field) => TRMultiCombobox<T>.controlled(
           value: field.value ?? const [],
           items: items,
           optionsBuilder: optionsBuilder,
           enabled: enabled,
           errorText: field.errorText,
           helperText: helperText,
           label: label,
           onValueChange: (value) {
             field.didChange(value);
             onValueChange?.call(value);
           },
           placeholder: placeholder,
         ),
       );
}

bool _listEquals<T>(List<T> left, List<T> right) {
  if (identical(left, right)) return true;
  if (left.length != right.length) return false;
  for (var index = 0; index < left.length; index += 1) {
    if (left[index] != right[index]) return false;
  }
  return true;
}
