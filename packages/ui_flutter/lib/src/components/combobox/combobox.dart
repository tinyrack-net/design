import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:lucide_flutter/lucide_flutter.dart';

import '../../generated/tokens.g.dart';
import '../../internal/layer.dart';
import '../../types.dart';
import '../button/button.dart';
import '../text_field/text_field.dart';

/// Layout used by a combobox options popup.
enum TRComboboxLayout { list, grid }

/// How a combobox narrows its option source against the current query.
///
/// [TRComboboxFilterMode.none] leaves narrowing entirely to the option source,
/// which is what an asynchronous or remote `optionsBuilder` usually wants.
enum TRComboboxFilterMode { contains, startsWith, none }

/// Decides whether an option survives the current query.
///
/// A filter passed to a combobox takes precedence over its
/// [TRComboboxFilterMode]. The query is already trimmed and lower-cased.
typedef TRComboboxFilter<T extends Object> =
    bool Function(TRComboboxItem<T> item, String query);

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
    this.appearance = TRFieldAppearance.solid,
    this.autoHighlight = true,
    this.clearable = false,
    this.clearSemanticLabel = 'Clear',
    this.controller,
    this.defaultValue,
    this.enabled = true,
    this.errorText,
    this.filter,
    this.filterMode = TRComboboxFilterMode.contains,
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
    this.appearance = TRFieldAppearance.solid,
    this.autoHighlight = true,
    this.clearable = false,
    this.clearSemanticLabel = 'Clear',
    this.controller,
    this.enabled = true,
    this.errorText,
    this.filter,
    this.filterMode = TRComboboxFilterMode.contains,
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

  /// Whether the field paints a resting border and fill.
  ///
  /// [TRFieldAppearance.ghost] drops both so a host surface can frame the
  /// combobox. Unlike a bare surface, the field still paints its own hover,
  /// focus, and invalid emphasis.
  final TRFieldAppearance appearance;

  /// Arms the first option so Enter commits it without an arrow key first.
  final bool autoHighlight;

  /// Renders a clear button once the field holds a query or a selection.
  final bool clearable;

  /// Accessible name of the clear button.
  final String clearSemanticLabel;
  final TRComboboxController<T>? controller;
  final T? defaultValue;
  final T? value;
  final bool enabled;
  final String? errorText;

  /// Overrides [filterMode] with a custom predicate.
  final TRComboboxFilter<T>? filter;
  final TRComboboxFilterMode filterMode;
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

  void _clear() {
    // The controlled variant owns its value, so only the query is reset here
    // and the owner decides what happens to the selection.
    widget._controlled
        ? _controller.textEditingController.clear()
        : _controller.clear();
    widget.onValueChange?.call(null);
    widget.onQueryChange?.call('');
    _controller.focusNode.requestFocus();
    if (mounted) setState(() {});
  }

  @override
  Widget build(BuildContext context) => _TRComboboxInput<T>(
    appearance: widget.appearance,
    controller: _controller.textEditingController,
    focusNode: _controller.focusNode,
    autoHighlight: widget.autoHighlight,
    clearSemanticLabel: widget.clearSemanticLabel,
    enabled: widget.enabled,
    errorText: widget.errorText,
    filter: widget.filter,
    filterMode: widget.filterMode,
    helperText: widget.helperText,
    items: widget.items,
    label: widget.label,
    layout: widget.layout,
    onClear: widget.clearable ? _clear : null,
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
    this.appearance = TRFieldAppearance.solid,
    this.autoHighlight = true,
    this.clearable = false,
    this.clearSemanticLabel = 'Clear',
    this.controller,
    this.defaultValue = const [],
    this.enabled = true,
    this.errorText,
    this.filter,
    this.filterMode = TRComboboxFilterMode.contains,
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
    this.appearance = TRFieldAppearance.solid,
    this.autoHighlight = true,
    this.clearable = false,
    this.clearSemanticLabel = 'Clear',
    this.controller,
    this.enabled = true,
    this.errorText,
    this.filter,
    this.filterMode = TRComboboxFilterMode.contains,
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

  /// Whether the field paints a resting border and fill.
  ///
  /// [TRFieldAppearance.ghost] drops both so a host surface can frame the
  /// combobox. Unlike a bare surface, the field still paints its own hover,
  /// focus, and invalid emphasis.
  final TRFieldAppearance appearance;

  /// Arms the first option so Enter commits it without an arrow key first.
  final bool autoHighlight;

  /// Renders a clear button once the field holds a query or any selection.
  final bool clearable;

  /// Accessible name of the clear button.
  final String clearSemanticLabel;
  final TRMultiComboboxController<T>? controller;
  final List<T> defaultValue;
  final List<T>? value;
  final bool enabled;
  final String? errorText;

  /// Overrides [filterMode] with a custom predicate.
  final TRComboboxFilter<T>? filter;
  final TRComboboxFilterMode filterMode;
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

  void _clear() {
    // TRMultiComboboxController.clear only resets the values, so the query is
    // cleared here instead of changing that controller contract.
    if (widget.value == null) _controller.clear();
    _controller.textEditingController.clear();
    widget.onValueChange?.call(const []);
    widget.onQueryChange?.call('');
    _controller.focusNode.requestFocus();
    if (mounted) setState(() {});
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
        appearance: widget.appearance,
        controller: _controller.textEditingController,
        focusNode: _controller.focusNode,
        autoHighlight: widget.autoHighlight,
        clearSemanticLabel: widget.clearSemanticLabel,
        enabled: widget.enabled,
        errorText: widget.errorText,
        filter: widget.filter,
        filterMode: widget.filterMode,
        helperText: widget.helperText,
        items: widget.items,
        label: widget.label,
        layout: widget.layout,
        onClear: widget.clearable ? _clear : null,
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

class _TRComboboxInput<T extends Object> extends StatefulWidget {
  const _TRComboboxInput({
    required this.appearance,
    required this.controller,
    required this.focusNode,
    required this.autoHighlight,
    required this.clearSemanticLabel,
    required this.enabled,
    required this.errorText,
    required this.filter,
    required this.filterMode,
    required this.helperText,
    required this.items,
    required this.label,
    required this.layout,
    required this.onClear,
    required this.onQueryChange,
    required this.onSelected,
    required this.optionsBuilder,
    required this.placeholder,
    required this.readOnly,
    required this.selected,
    required this.uiSize,
    required this.width,
  });

  final TRFieldAppearance appearance;
  final TextEditingController controller;
  final FocusNode focusNode;
  final bool autoHighlight;
  final String clearSemanticLabel;
  final bool enabled;
  final String? errorText;
  final TRComboboxFilter<T>? filter;
  final TRComboboxFilterMode filterMode;
  final String? helperText;
  final List<TRComboboxItem<T>> items;
  final String? label;
  final TRComboboxLayout layout;
  final VoidCallback? onClear;
  final ValueChanged<String>? onQueryChange;
  final ValueChanged<T> onSelected;
  final TRComboboxOptionsBuilder<T>? optionsBuilder;
  final String? placeholder;
  final bool readOnly;
  final Set<T> selected;
  final TRUiSize uiSize;
  final double? width;

  @override
  State<_TRComboboxInput<T>> createState() => _TRComboboxInputState<T>();
}

class _TRComboboxInputState<T extends Object>
    extends State<_TRComboboxInput<T>> {
  static final _navigationKeys = {
    LogicalKeyboardKey.arrowDown,
    LogicalKeyboardKey.arrowUp,
    LogicalKeyboardKey.pageDown,
    LogicalKeyboardKey.pageUp,
    LogicalKeyboardKey.home,
    LogicalKeyboardKey.end,
  };
  static final _forwardKeys = {
    LogicalKeyboardKey.arrowDown,
    LogicalKeyboardKey.pageDown,
    LogicalKeyboardKey.end,
  };

  late bool _highlightArmed = widget.autoHighlight;
  List<TRComboboxItem<T>> _lastOptions = const [];
  int _highlightIndex = 0;
  bool _movingForward = true;
  int _skipBudget = 0;
  BuildContext? _fieldContext;

  @override
  void didUpdateWidget(_TRComboboxInput<T> oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.autoHighlight != widget.autoHighlight) {
      _highlightArmed = widget.autoHighlight;
    }
  }

  bool _matches(TRComboboxItem<T> item, String query) {
    if (query.isEmpty) return true;
    if (widget.filter case final filter?) return filter(item, query);
    final label = item.label.toLowerCase();
    return switch (widget.filterMode) {
      TRComboboxFilterMode.contains => label.contains(query),
      TRComboboxFilterMode.startsWith => label.startsWith(query),
      TRComboboxFilterMode.none => true,
    };
  }

  FutureOr<Iterable<TRComboboxItem<T>>> _options(
    TextEditingValue editing,
  ) async {
    final query = editing.text.trim();
    final source = widget.optionsBuilder == null
        ? widget.items
        : await widget.optionsBuilder!(query);
    // Committing a selection writes its label into the field, and that label
    // must not read as a query that hides every other option.
    final selectedLabel = widget.selected.length == 1
        ? widget.items
              .where((item) => item.value == widget.selected.single)
              .map((item) => item.label.trim().toLowerCase())
              .firstOrNull
        : null;
    final normalized = query.toLowerCase() == selectedLabel
        ? ''
        : query.toLowerCase();
    final options = source
        .where((item) => _matches(item, normalized))
        .toList(growable: false);
    _lastOptions = options;
    return options;
  }

  KeyEventResult _handleKey(FocusNode node, KeyEvent event) {
    if (event is KeyUpEvent) return KeyEventResult.ignored;
    if (!_navigationKeys.contains(event.logicalKey)) {
      return KeyEventResult.ignored;
    }
    // RawAutocomplete owns the shortcuts that actually move the highlight, so
    // this only records that the highlight is now armed by the user.
    final wasArmed = _highlightArmed;
    _movingForward = _forwardKeys.contains(event.logicalKey);
    _skipBudget = _lastOptions.length;
    if (wasArmed) {
      _highlightArmed = true;
      return KeyEventResult.ignored;
    }
    setState(() => _highlightArmed = true);
    // RawAutocomplete always keeps index 0 highlighted, so the first Down press
    // reveals that option instead of stepping past it.
    return event.logicalKey == LogicalKeyboardKey.arrowDown
        ? KeyEventResult.handled
        : KeyEventResult.ignored;
  }

  void _publishHighlight(int index) {
    if (_highlightIndex == index) return;
    _highlightIndex = index;
    final item = _lastOptions.elementAtOrNull(index);
    if (item == null || item.enabled || _skipBudget <= 0) return;
    // Step past a disabled row in the direction the user was already moving.
    _skipBudget -= 1;
    final fieldContext = _fieldContext;
    if (fieldContext == null) return;
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (!mounted || !fieldContext.mounted) return;
      Actions.invoke(
        fieldContext,
        _movingForward
            ? const AutocompleteNextOptionIntent()
            : const AutocompletePreviousOptionIntent(),
      );
    });
  }

  void _handleQueryChange(String query) {
    _skipBudget = 0;
    if (_highlightArmed != widget.autoHighlight && mounted) {
      setState(() => _highlightArmed = widget.autoHighlight);
    }
    widget.onQueryChange?.call(query);
  }

  Widget? _clearButton() {
    final onClear = widget.onClear;
    if (onClear == null || !widget.enabled || widget.readOnly) return null;
    final empty = widget.controller.text.isEmpty && widget.selected.isEmpty;
    if (empty) return null;
    return TRIconButton(
      icon: const Icon(LucideIcons.x),
      label: widget.clearSemanticLabel,
      onPressed: onClear,
      appearance: TRAppearance.ghost,
      uiSize: TRUiSize.md,
    );
  }

  @override
  Widget build(BuildContext context) {
    final popupWidth = widget.width ?? TRGeneratedMeasurements.overlayWidthSm;
    return SizedBox(
      width: widget.width,
      child: RawAutocomplete<TRComboboxItem<T>>(
        displayStringForOption: (item) => item.label,
        focusNode: widget.focusNode,
        textEditingController: widget.controller,
        optionsBuilder: _options,
        onSelected: (item) {
          if (!item.enabled) return;
          widget.onSelected(item.value);
        },
        fieldViewBuilder: (context, controller, focusNode, onSubmitted) => Focus(
          canRequestFocus: false,
          skipTraversal: true,
          onKeyEvent: _handleKey,
          // The builder context handed to fieldViewBuilder sits above the
          // Actions that own the highlight intents, so a descendant context is
          // captured here instead.
          child: Builder(
            builder: (context) {
              _fieldContext = context;
              return _buildField(controller, focusNode, onSubmitted);
            },
          ),
        ),
        optionsViewBuilder: (context, select, options) {
          _publishHighlight(AutocompleteHighlightedOption.of(context));
          return Align(
            alignment: AlignmentDirectional.topStart,
            child: Transform.translate(
              offset: const Offset(0, TRGeneratedSpacing.sm),
              child: TRLayerSurface(
                kind: TRLayerBoundaryKind.combobox,
                minWidth: popupWidth,
                maxWidth: popupWidth,
                padding: const EdgeInsets.all(TRGeneratedSpacing.xs),
                // Keyboard focus stays on the query field so arrow keys reach
                // the highlight shortcuts instead of the option buttons.
                child: ExcludeFocus(
                  child: ConstrainedBox(
                    constraints: const BoxConstraints(
                      maxHeight: TRGeneratedMeasurements.measureXl,
                    ),
                    child: widget.layout == TRComboboxLayout.grid
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
          );
        },
      ),
    );
  }

  Widget _buildField(
    TextEditingController controller,
    FocusNode focusNode,
    VoidCallback onSubmitted,
  ) {
    TRTextField field(Widget? suffix) => TRTextField(
      appearance: widget.appearance,
      controller: controller,
      enabled: widget.enabled,
      errorText: widget.errorText,
      focusNode: focusNode,
      helperText: widget.helperText,
      label: widget.label,
      onChanged: _handleQueryChange,
      onSubmitted: (_) {
        // Enter must not commit an option the user never highlighted, and it
        // must never commit a disabled one.
        if (!_highlightArmed) return;
        final item = _lastOptions.elementAtOrNull(_highlightIndex);
        if (item == null || !item.enabled) return;
        onSubmitted();
      },
      placeholder: widget.placeholder,
      readOnly: widget.readOnly,
      suffix: suffix,
      uiSize: widget.uiSize,
    );

    if (widget.onClear == null) return field(null);
    return ValueListenableBuilder<TextEditingValue>(
      valueListenable: controller,
      builder: (context, _, _) => field(_clearButton()),
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
      onPressed: item.enabled ? () => select(item) : null,
      requestFocusOnHover: false,
      style: TRLayerStyles.option(
        context,
        highlighted:
            item.enabled &&
            _highlightArmed &&
            AutocompleteHighlightedOption.of(context) == index,
        selected: widget.selected.contains(item.value),
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
    TRFieldAppearance appearance = TRFieldAppearance.solid,
    bool autoHighlight = true,
    bool clearable = false,
    String clearSemanticLabel = 'Clear',
    super.initialValue,
    super.autovalidateMode,
    super.enabled = true,
    TRComboboxFilter<T>? filter,
    TRComboboxFilterMode filterMode = TRComboboxFilterMode.contains,
    String? helperText,
    String? label,
    TRComboboxLayout layout = TRComboboxLayout.list,
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
           appearance: appearance,
           autoHighlight: autoHighlight,
           clearable: clearable,
           clearSemanticLabel: clearSemanticLabel,
           enabled: enabled,
           errorText: field.errorText,
           filter: filter,
           filterMode: filterMode,
           helperText: helperText,
           label: label,
           layout: layout,
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
    TRFieldAppearance appearance = TRFieldAppearance.solid,
    bool autoHighlight = true,
    bool clearable = false,
    String clearSemanticLabel = 'Clear',
    List<T> initialValue = const [],
    super.autovalidateMode,
    super.enabled = true,
    TRComboboxFilter<T>? filter,
    TRComboboxFilterMode filterMode = TRComboboxFilterMode.contains,
    String? helperText,
    String? label,
    TRComboboxLayout layout = TRComboboxLayout.list,
    ValueChanged<List<T>>? onValueChange,
    super.onSaved,
    super.validator,
    String? placeholder,
    TRUiSize uiSize = TRUiSize.md,
    super.key,
  }) : super(
         initialValue: initialValue,
         builder: (field) => TRMultiCombobox<T>.controlled(
           value: field.value ?? const [],
           items: items,
           optionsBuilder: optionsBuilder,
           appearance: appearance,
           autoHighlight: autoHighlight,
           clearable: clearable,
           clearSemanticLabel: clearSemanticLabel,
           enabled: enabled,
           errorText: field.errorText,
           filter: filter,
           filterMode: filterMode,
           helperText: helperText,
           label: label,
           layout: layout,
           onValueChange: (value) {
             field.didChange(value);
             onValueChange?.call(value);
           },
           placeholder: placeholder,
           uiSize: uiSize,
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
