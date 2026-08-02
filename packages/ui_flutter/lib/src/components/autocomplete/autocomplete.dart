import 'dart:async';

import 'package:flutter/material.dart';

import '../../generated/tokens.g.dart';
import '../../internal/layer.dart';
import '../../types.dart';
import '../text_field/text_field.dart';

/// How an autocomplete query is completed.
enum TRAutocompleteCompletionMode { manual, list, inline, both }

/// A typed suggestion displayed by [TRAutocomplete].
@immutable
class TRAutocompleteItem<T extends Object> {
  const TRAutocompleteItem({
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

typedef TRAutocompleteOptionsBuilder<T extends Object> =
    FutureOr<Iterable<TRAutocompleteItem<T>>> Function(String query);

/// Owns the query, focus, and selected value of an autocomplete.
class TRAutocompleteController<T extends Object> extends ChangeNotifier {
  factory TRAutocompleteController({String query = '', T? value}) =>
      TRAutocompleteController._(query, value);

  TRAutocompleteController._(String query, this._value)
    : textEditingController = TextEditingController(text: query),
      focusNode = FocusNode(),
      super();

  final TextEditingController textEditingController;
  final FocusNode focusNode;
  T? _value;

  String get query => textEditingController.text;
  T? get value => _value;

  void clear() {
    _value = null;
    textEditingController.clear();
    notifyListeners();
  }

  void select(T? value) {
    if (_value == value) return;
    _value = value;
    notifyListeners();
  }

  @override
  void dispose() {
    textEditingController.dispose();
    focusNode.dispose();
    super.dispose();
  }
}

// @tinyrack-preview autocomplete
/// A free-text field with typed static or asynchronous suggestions.
class TRAutocomplete<T extends Object> extends StatefulWidget {
  const TRAutocomplete({
    this.items = const [],
    this.optionsBuilder,
    this.controller,
    this.completionMode = TRAutocompleteCompletionMode.list,
    this.enabled = true,
    this.errorText,
    this.helperText,
    this.label,
    this.onQueryChange,
    this.onSelected,
    this.placeholder,
    this.readOnly = false,
    this.uiSize = TRUiSize.md,
    this.width,
    super.key,
  }) : assert(
         items.length > 0 || optionsBuilder != null,
         'Provide items or optionsBuilder.',
       );

  final List<TRAutocompleteItem<T>> items;
  final TRAutocompleteOptionsBuilder<T>? optionsBuilder;
  final TRAutocompleteController<T>? controller;
  final TRAutocompleteCompletionMode completionMode;
  final bool enabled;
  final String? errorText;
  final String? helperText;
  final String? label;
  final ValueChanged<String>? onQueryChange;
  final ValueChanged<T>? onSelected;
  final String? placeholder;
  final bool readOnly;
  final TRUiSize uiSize;
  final double? width;

  @override
  State<TRAutocomplete<T>> createState() => _TRAutocompleteState<T>();
}

class _TRAutocompleteState<T extends Object> extends State<TRAutocomplete<T>> {
  TRAutocompleteController<T>? _internalController;

  TRAutocompleteController<T> get _controller =>
      widget.controller ??
      (_internalController ??= TRAutocompleteController<T>());

  @override
  void dispose() {
    _internalController?.dispose();
    super.dispose();
  }

  FutureOr<Iterable<TRAutocompleteItem<T>>> _options(
    TextEditingValue editing,
  ) async {
    final query = editing.text.trim();
    if (widget.completionMode == TRAutocompleteCompletionMode.manual &&
        query.isEmpty) {
      return const [];
    }
    final source = widget.optionsBuilder == null
        ? widget.items
        : await widget.optionsBuilder!(query);
    if (widget.optionsBuilder != null) {
      return source.where((item) => item.enabled);
    }
    final normalized = query.toLowerCase();
    return source.where(
      (item) =>
          item.enabled &&
          (normalized.isEmpty || item.label.toLowerCase().contains(normalized)),
    );
  }

  void _handleQuery(String query) {
    widget.onQueryChange?.call(query);
    if (query.isEmpty ||
        (widget.completionMode != TRAutocompleteCompletionMode.inline &&
            widget.completionMode != TRAutocompleteCompletionMode.both)) {
      return;
    }
    final match = widget.items.cast<TRAutocompleteItem<T>?>().firstWhere(
      (item) =>
          item!.enabled &&
          item.label.toLowerCase().startsWith(query.toLowerCase()) &&
          item.label.length > query.length,
      orElse: () => null,
    );
    if (match == null) return;
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (!mounted || _controller.textEditingController.text != query) return;
      _controller.textEditingController.value = TextEditingValue(
        text: match.label,
        selection: TextSelection(
          baseOffset: query.length,
          extentOffset: match.label.length,
        ),
      );
    });
  }

  @override
  Widget build(BuildContext context) {
    final fieldWidth = widget.width ?? TRGeneratedMeasurements.overlayWidthSm;
    return SizedBox(
      width: widget.width,
      child: RawAutocomplete<TRAutocompleteItem<T>>(
        displayStringForOption: (item) => item.label,
        focusNode: _controller.focusNode,
        textEditingController: _controller.textEditingController,
        optionsBuilder: _options,
        onSelected: (item) {
          _controller.select(item.value);
          widget.onSelected?.call(item.value);
        },
        fieldViewBuilder: (context, textController, focusNode, onSubmitted) =>
            TRTextField(
              controller: textController,
              enabled: widget.enabled,
              errorText: widget.errorText,
              focusNode: focusNode,
              helperText: widget.helperText,
              label: widget.label,
              onChanged: _handleQuery,
              onSubmitted: (_) => onSubmitted(),
              placeholder: widget.placeholder,
              readOnly: widget.readOnly,
              uiSize: widget.uiSize,
            ),
        optionsViewBuilder: (context, onSelected, options) =>
            _TRAutocompleteOptionsView<T>(
              highlightedIndex: AutocompleteHighlightedOption.of(context),
              onSelected: onSelected,
              options: options.toList(growable: false),
              width: fieldWidth,
            ),
      ),
    );
  }
}

class _TRAutocompleteOptionsView<T extends Object> extends StatefulWidget {
  const _TRAutocompleteOptionsView({
    required this.highlightedIndex,
    required this.onSelected,
    required this.options,
    required this.width,
  });

  final int highlightedIndex;
  final AutocompleteOnSelected<TRAutocompleteItem<T>> onSelected;
  final List<TRAutocompleteItem<T>> options;
  final double width;

  @override
  State<_TRAutocompleteOptionsView<T>> createState() =>
      _TRAutocompleteOptionsViewState<T>();
}

class _TRAutocompleteOptionsViewState<T extends Object>
    extends State<_TRAutocompleteOptionsView<T>> {
  final ScrollController _scrollController = ScrollController();
  late List<GlobalKey> _optionKeys = _createKeys(widget.options.length);

  static List<GlobalKey> _createKeys(int length) => List.generate(
    length,
    (index) => GlobalKey(debugLabel: 'autocomplete-option-$index'),
  );

  @override
  void didUpdateWidget(_TRAutocompleteOptionsView<T> oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.options.length != widget.options.length) {
      _optionKeys = _createKeys(widget.options.length);
    }
    if (oldWidget.highlightedIndex != widget.highlightedIndex) {
      _scrollHighlightedOptionIntoView();
    }
  }

  void _scrollHighlightedOptionIntoView() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (!mounted || widget.options.isEmpty) return;
      final index = widget.highlightedIndex.clamp(0, widget.options.length - 1);
      final optionContext = _optionKeys[index].currentContext;
      if (optionContext != null) {
        Scrollable.ensureVisible(optionContext, alignment: 0.5);
        return;
      }
      if (!_scrollController.hasClients) return;
      final estimatedOffset =
          index * (TRGeneratedControlMetrics.smHeight + TRGeneratedSpacing.xs);
      _scrollController.jumpTo(
        estimatedOffset.clamp(
          _scrollController.position.minScrollExtent,
          _scrollController.position.maxScrollExtent,
        ),
      );
      WidgetsBinding.instance.addPostFrameCallback((_) {
        if (!mounted) return;
        final rebuiltContext = _optionKeys[index].currentContext;
        if (rebuiltContext != null) {
          Scrollable.ensureVisible(rebuiltContext, alignment: 0.5);
        }
      });
    });
  }

  @override
  void dispose() {
    _scrollController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) => Align(
    alignment: AlignmentDirectional.topStart,
    child: Transform.translate(
      offset: const Offset(0, TRGeneratedSpacing.sm),
      child: TRLayerSurface(
        kind: TRLayerBoundaryKind.autocomplete,
        minWidth: widget.width,
        maxWidth: widget.width,
        padding: const EdgeInsets.all(TRGeneratedSpacing.xs),
        child: ExcludeFocus(
          child: ConstrainedBox(
            constraints: const BoxConstraints(
              maxHeight: TRGeneratedMeasurements.measureXl,
            ),
            child: ListView.separated(
              controller: _scrollController,
              padding: EdgeInsets.zero,
              shrinkWrap: true,
              itemCount: widget.options.length,
              separatorBuilder: (context, index) =>
                  const SizedBox(height: TRGeneratedSpacing.xs),
              itemBuilder: (context, index) {
                final item = widget.options[index];
                return SizedBox(
                  key: _optionKeys[index],
                  width: double.infinity,
                  child: MenuItemButton(
                    leadingIcon: item.leading,
                    onPressed: () => widget.onSelected(item),
                    requestFocusOnHover: false,
                    style: TRLayerStyles.option(
                      context,
                      highlighted: widget.highlightedIndex == index,
                    ),
                    trailingIcon: item.trailing,
                    child: TRLayerPartBoundary(
                      name: 'option$index',
                      child: Text(item.label),
                    ),
                  ),
                );
              },
            ),
          ),
        ),
      ),
    ),
  );
}

/// Form-integrated [TRAutocomplete].
class TRAutocompleteFormField<T extends Object> extends FormField<T> {
  TRAutocompleteFormField({
    required List<TRAutocompleteItem<T>> items,
    TRAutocompleteOptionsBuilder<T>? optionsBuilder,
    super.initialValue,
    super.autovalidateMode,
    super.enabled = true,
    String? helperText,
    String? label,
    ValueChanged<T>? onSelected,
    super.onSaved,
    super.validator,
    String? placeholder,
    TRUiSize uiSize = TRUiSize.md,
    super.key,
  }) : super(
         builder: (field) => TRAutocomplete<T>(
           items: items,
           optionsBuilder: optionsBuilder,
           enabled: enabled,
           errorText: field.errorText,
           helperText: helperText,
           label: label,
           onSelected: (value) {
             field.didChange(value);
             onSelected?.call(value);
           },
           placeholder: placeholder,
           uiSize: uiSize,
         ),
       );
}
