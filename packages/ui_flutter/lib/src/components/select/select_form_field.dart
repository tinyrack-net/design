part of 'select_widget.dart';

/// A [Form] participant backed by the controlled [TRSelect] contract.
class TRSelectFormField<T> extends FormField<T> {
  TRSelectFormField({
    required this.items,
    super.initialValue,
    String? label,
    String? placeholder,
    String? helperText,
    String? name,
    TRFieldAppearance appearance = TRFieldAppearance.solid,
    TRUiSize? uiSize,
    super.enabled = true,
    bool readOnly = false,
    FocusNode? focusNode,
    bool autofocus = false,
    MenuController? menuController,
    VoidCallback? onOpen,
    VoidCallback? onClose,
    ValueChanged<T?>? onValueChange,
    double? width,
    bool searchable = false,
    String searchPlaceholder = 'Search',
    String noResultsText = 'No results',
    TRSelectFilter<T>? filter,
    TRSelectSurface surface = TRSelectSurface.auto,
    super.onSaved,
    super.validator,
    super.autovalidateMode,
    super.restorationId,
    super.key,
  }) : super(
         builder: (field) => TRFormRegistration(
           name: name,
           value: () => field.value,
           enabled: enabled,
           readOnly: readOnly,
           child: TRSelect<T>.controlled(
             items: items,
             value: field.value,
             label: label,
             placeholder: placeholder,
             helperText: helperText,
             errorText: field.errorText,
             appearance: appearance,
             uiSize: uiSize,
             enabled: enabled,
             readOnly: readOnly,
             focusNode: focusNode,
             autofocus: autofocus,
             menuController: menuController,
             onOpen: onOpen,
             onClose: onClose,
             onValueChange: (value) {
               field.didChange(value);
               onValueChange?.call(value);
             },
             width: width,
             searchable: searchable,
             searchPlaceholder: searchPlaceholder,
             noResultsText: noResultsText,
             filter: filter,
             surface: surface,
           ),
         ),
       );

  final List<TRSelectItem<T>> items;

  @override
  FormFieldState<T> createState() => _TRSelectFormFieldState<T>();
}

class _TRSelectFormFieldState<T> extends FormFieldState<T> {
  RestorableTextEditingController? _restorableController;

  TRSelectFormField<T> get _selectField => widget as TRSelectFormField<T>;

  @override
  void initState() {
    super.initState();
    _restorableController = RestorableTextEditingController.fromValue(
      TextEditingValue(text: _labelFor(widget.initialValue)),
    );
    if (!restorePending) _registerController();
  }

  @override
  void didChange(T? value) {
    super.didChange(value);
    _updateController(value);
  }

  @override
  void reset() {
    super.reset();
    _updateController(widget.initialValue);
  }

  @override
  void restoreState(RestorationBucket? oldBucket, bool initialRestore) {
    super.restoreState(oldBucket, initialRestore);
    _registerController();
    for (final item in _selectField.items) {
      if (item.label == _restorableController!.value.text) {
        setValue(item.value);
        break;
      }
    }
  }

  @override
  void dispose() {
    _restorableController?.dispose();
    super.dispose();
  }

  void _registerController() {
    registerForRestoration(_restorableController!, 'controller');
  }

  void _updateController(T? value) {
    final label = _labelFor(value);
    _restorableController?.value.value = TextEditingValue(
      text: label,
      selection: TextSelection.collapsed(offset: label.length),
    );
  }

  String _labelFor(T? value) {
    for (final item in _selectField.items) {
      if (item.value == value) return item.label;
    }
    return '';
  }
}
