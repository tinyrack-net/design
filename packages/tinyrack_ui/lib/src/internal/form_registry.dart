import 'package:flutter/widgets.dart';

abstract interface class TRFormRegistry {
  void register(
    Object token, {
    required String name,
    required Object? Function() value,
    required bool Function() enabled,
    required bool Function() readOnly,
  });

  void unregister(Object token);
  void fieldChanged();
}

class TRFormRegistryScope extends InheritedWidget {
  const TRFormRegistryScope({
    required this.registry,
    required super.child,
    super.key,
  });

  final TRFormRegistry registry;

  static TRFormRegistry? maybeOf(BuildContext context) => context
      .dependOnInheritedWidgetOfExactType<TRFormRegistryScope>()
      ?.registry;

  @override
  bool updateShouldNotify(TRFormRegistryScope oldWidget) =>
      registry != oldWidget.registry;
}

/// Internal bridge that registers a named value with the nearest TRForm.
class TRFormRegistration extends StatefulWidget {
  const TRFormRegistration({
    required this.name,
    required this.value,
    required this.child,
    this.enabled = true,
    this.readOnly = false,
    this.listenable,
    super.key,
  });

  final String? name;
  final Object? Function() value;
  final Widget child;
  final bool enabled;
  final bool readOnly;
  final Listenable? listenable;

  @override
  State<TRFormRegistration> createState() => _TRFormRegistrationState();
}

class _TRFormRegistrationState extends State<TRFormRegistration> {
  final Object _token = Object();
  TRFormRegistry? _registry;

  @override
  void initState() {
    super.initState();
    widget.listenable?.addListener(_changed);
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    final registry = TRFormRegistryScope.maybeOf(context);
    if (_registry != registry) {
      _registry?.unregister(_token);
      _registry = registry;
    }
    _register();
  }

  @override
  void didUpdateWidget(TRFormRegistration oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.listenable != widget.listenable) {
      oldWidget.listenable?.removeListener(_changed);
      widget.listenable?.addListener(_changed);
    }
    _register();
    _changed();
  }

  @override
  void dispose() {
    widget.listenable?.removeListener(_changed);
    _registry?.unregister(_token);
    super.dispose();
  }

  void _register() {
    final name = widget.name;
    if (name == null || name.isEmpty) {
      _registry?.unregister(_token);
      return;
    }
    _registry?.register(
      _token,
      name: name,
      value: widget.value,
      enabled: () => widget.enabled,
      readOnly: () => widget.readOnly,
    );
  }

  void _changed() => _registry?.fieldChanged();

  @override
  Widget build(BuildContext context) => widget.child;
}
