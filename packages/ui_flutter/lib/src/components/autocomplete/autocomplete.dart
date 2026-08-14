import 'dart:async';

import 'package:material_ui/material_ui.dart';

import '../../generated/tokens.g.dart';
import '../../internal/layer.dart';
import '../../internal/press_interaction.dart';
import '../../layer_size.dart';
import '../../tokens.dart';
import '../../types.dart';
import '../../ui_density.dart';
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
    this.appearance = TRFieldAppearance.solid,
    this.controller,
    this.completionMode = TRAutocompleteCompletionMode.list,
    this.enabled = true,
    this.errorText,
    this.helperText,
    this.label,
    this.layerSize = const TRLayerSize(
      width: TRLayerWidth.matchAnchor(),
      height: TRLayerHeight.content(max: TRGeneratedMeasurements.measureXl),
    ),
    this.onQueryChange,
    this.onSelected,
    this.placeholder,
    this.readOnly = false,
    this.uiSize,
    this.width,
    super.key,
  }) : assert(
         items.length > 0 || optionsBuilder != null,
         'Provide items or optionsBuilder.',
       );

  final List<TRAutocompleteItem<T>> items;
  final TRAutocompleteOptionsBuilder<T>? optionsBuilder;

  /// Whether the field paints a resting border and fill.
  ///
  /// [TRFieldAppearance.ghost] drops both so a host surface can frame the
  /// autocomplete. Unlike a bare surface, the field still paints its own
  /// hover, focus, and invalid emphasis.
  final TRFieldAppearance appearance;

  final TRAutocompleteController<T>? controller;
  final TRAutocompleteCompletionMode completionMode;
  final bool enabled;
  final String? errorText;
  final String? helperText;
  final String? label;
  final TRLayerSize layerSize;
  final ValueChanged<String>? onQueryChange;
  final ValueChanged<T>? onSelected;
  final String? placeholder;
  final bool readOnly;
  final TRUiSize? uiSize;
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
    final density = TRUiDensityScope.of(context);
    final rowSize = TRLayerStyles.rowSizeOf(context);
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
              appearance: widget.appearance,
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
              density: density,
              highlightedIndex: AutocompleteHighlightedOption.of(context),
              layerSize: widget.layerSize,
              onSelected: onSelected,
              options: options.toList(growable: false),
              rowSize: rowSize,
              onDismiss: _controller.focusNode.unfocus,
            ),
      ),
    );
  }
}

class _TRAutocompleteOptionsView<T extends Object> extends StatefulWidget {
  const _TRAutocompleteOptionsView({
    required this.density,
    required this.highlightedIndex,
    required this.layerSize,
    required this.onSelected,
    required this.options,
    required this.rowSize,
    required this.onDismiss,
  });

  final TRUiDensity density;
  final int highlightedIndex;
  final TRLayerSize layerSize;
  final AutocompleteOnSelected<TRAutocompleteItem<T>> onSelected;
  final List<TRAutocompleteItem<T>> options;
  final TRUiSize rowSize;
  final VoidCallback onDismiss;

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
      final estimatedOffset = index * TRControlMetrics.heightOf(widget.rowSize);
      _scrollController.jumpTo(
        estimatedOffset
            .clamp(
              _scrollController.position.minScrollExtent,
              _scrollController.position.maxScrollExtent,
            )
            .toDouble(),
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
  Widget build(BuildContext context) => TRUiDensityScope(
    density: widget.density,
    child: LayoutBuilder(
      builder: (context, constraints) => TRAnchoredLayer(
        open: true,
        onOpenChange: (open) {
          if (!open) widget.onDismiss();
        },
        // RawAutocomplete groups the real field and this options view in a
        // TextFieldTapRegion and owns visibility through the field focus. The
        // nested layer exists only to supply collision-aware geometry; letting
        // its surrogate anchor dismiss would treat a re-tap on the real field
        // as an outside tap and briefly unfocus it.
        dismissOnTapOutside: false,
        gap: TRGeneratedSpacing.sm,
        requestFocus: false,
        size: widget.layerSize,
        triggerBuilder: (context, open, openLayer, closeLayer, toggleLayer) =>
            SizedBox(width: constraints.maxWidth),
        layerBuilder: (context) => TRLayerSurface(
          kind: TRLayerBoundaryKind.autocomplete,
          minWidth: 0,
          maxWidth: double.infinity,
          padding: const EdgeInsets.all(TRGeneratedSpacing.xs),
          child: ExcludeFocus(
            // A viewport always expands to its maximum cross-axis extent,
            // which makes TRLayerWidth.content indistinguishable from a fixed
            // maximum. The options are already materialized by RawAutocomplete,
            // so a single-child viewport around an intrinsic column preserves
            // vertical scrolling while allowing the labels to choose width.
            child: IntrinsicWidth(
              child: SingleChildScrollView(
                controller: _scrollController,
                primary: false,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    for (
                      var index = 0;
                      index < widget.options.length;
                      index++
                    ) ...[
                      if (index > 0)
                        const SizedBox(height: TRGeneratedSpacing.xs),
                      _option(context, index),
                    ],
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    ),
  );

  Widget _option(BuildContext context, int index) {
    final item = widget.options[index];
    return KeyedSubtree(
      key: _optionKeys[index],
      child: TRMaterialPressable(
        enabled: true,
        builder: (context, states) => MenuItemButton(
          leadingIcon: item.leading,
          onPressed: () => widget.onSelected(item),
          overflowAxis: Axis.vertical,
          requestFocusOnHover: false,
          statesController: states,
          style: TRLayerStyles.option(
            context,
            highlighted: widget.highlightedIndex == index,
            uiSize: widget.rowSize,
          ),
          trailingIcon: item.trailing,
          child: TRLayerPartBoundary(
            name: 'option$index',
            child: Text(item.label, overflow: TextOverflow.ellipsis),
          ),
        ),
      ),
    );
  }
}

/// Form-integrated [TRAutocomplete].
class TRAutocompleteFormField<T extends Object> extends FormField<T> {
  TRAutocompleteFormField({
    required List<TRAutocompleteItem<T>> items,
    TRAutocompleteOptionsBuilder<T>? optionsBuilder,
    TRFieldAppearance appearance = TRFieldAppearance.solid,
    super.initialValue,
    super.autovalidateMode,
    super.enabled = true,
    String? helperText,
    String? label,
    TRLayerSize layerSize = const TRLayerSize(
      width: TRLayerWidth.matchAnchor(),
      height: TRLayerHeight.content(max: TRGeneratedMeasurements.measureXl),
    ),
    ValueChanged<T>? onSelected,
    super.onSaved,
    super.validator,
    String? placeholder,
    TRUiSize? uiSize,
    super.key,
  }) : super(
         builder: (field) => TRAutocomplete<T>(
           items: items,
           optionsBuilder: optionsBuilder,
           appearance: appearance,
           enabled: enabled,
           errorText: field.errorText,
           helperText: helperText,
           label: label,
           layerSize: layerSize,
           onSelected: (value) {
             field.didChange(value);
             onSelected?.call(value);
           },
           placeholder: placeholder,
           uiSize: uiSize,
         ),
       );
}
