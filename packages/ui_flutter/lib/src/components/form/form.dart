import 'dart:collection';

import 'package:flutter/material.dart';

import '../../internal/form_registry.dart';

/// Immutable snapshot of named Tinyrack form values.
@immutable
class TRFormValues {
  TRFormValues(Map<String, Object?> values)
    : _values = UnmodifiableMapView(Map.of(values));

  final Map<String, Object?> _values;

  Object? operator [](String name) => _values[name];
  bool contains(String name) => _values.containsKey(name);
  Iterable<MapEntry<String, Object?>> get entries => _values.entries;
  Map<String, Object?> toMap() => Map.of(_values);
}

// @tinyrack-preview form
/// A Flutter [Form] that also exposes named values across Tinyrack fields.
class TRForm extends StatefulWidget {
  const TRForm({
    required this.child,
    this.autovalidateMode,
    this.canPop,
    this.onChanged,
    this.onPopInvokedWithResult,
    super.key,
  });

  final Widget child;
  final AutovalidateMode? autovalidateMode;
  final bool? canPop;
  final ValueChanged<TRFormValues>? onChanged;
  final PopInvokedWithResultCallback<Object?>? onPopInvokedWithResult;

  static TRFormState? maybeOf(BuildContext context) =>
      context.findAncestorStateOfType<TRFormState>();

  @override
  State<TRForm> createState() => TRFormState();
}

/// State and submit lifecycle for [TRForm].
class TRFormState extends State<TRForm> implements TRFormRegistry {
  final GlobalKey<FormState> _formKey = GlobalKey<FormState>();
  final Map<Object, _TRRegisteredField> _fields = {};

  TRFormValues get values {
    final values = <String, Object?>{};
    for (final field in _fields.values) {
      if (!field.enabled()) continue;
      values[field.name] = field.value();
    }
    return TRFormValues(values);
  }

  bool validate() => _formKey.currentState?.validate() ?? true;

  bool validateGranularly() =>
      (_formKey.currentState?.validateGranularly() ?? const {}).isEmpty;

  TRFormValues save() {
    _formKey.currentState?.save();
    return values;
  }

  void reset() {
    _formKey.currentState?.reset();
    fieldChanged();
  }

  @override
  void register(
    Object token, {
    required String name,
    required Object? Function() value,
    required bool Function() enabled,
    required bool Function() readOnly,
  }) {
    _fields[token] = _TRRegisteredField(
      name: name,
      value: value,
      enabled: enabled,
      readOnly: readOnly,
    );
  }

  @override
  void unregister(Object token) => _fields.remove(token);

  @override
  void fieldChanged() => widget.onChanged?.call(values);

  @override
  Widget build(BuildContext context) => TRFormRegistryScope(
    registry: this,
    child: Form(
      key: _formKey,
      autovalidateMode: widget.autovalidateMode,
      canPop: widget.canPop,
      onChanged: fieldChanged,
      onPopInvokedWithResult: widget.onPopInvokedWithResult,
      child: widget.child,
    ),
  );
}

class _TRRegisteredField {
  const _TRRegisteredField({
    required this.name,
    required this.value,
    required this.enabled,
    required this.readOnly,
  });

  final String name;
  final Object? Function() value;
  final bool Function() enabled;
  final bool Function() readOnly;
}
