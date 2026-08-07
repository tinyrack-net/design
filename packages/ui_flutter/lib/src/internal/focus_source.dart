import 'package:flutter/gestures.dart';
import 'package:flutter/services.dart';
import 'package:flutter/widgets.dart';

/// Tracks whether the focus a control currently holds arrived by pointer or by
/// keyboard, so controls can paint focus emphasis only for the keyboard.
///
/// [FocusHighlightMode] cannot answer this. `FocusManager` only switches to
/// [FocusHighlightMode.touch] for touch and stylus input, and every desktop
/// platform defaults to [FocusHighlightMode.traditional], so a mouse click and
/// a Tab press are indistinguishable through it.
///
/// The modality is sampled when the primary focus moves rather than read live.
/// A control focused by a click must keep its emphasis off while the user types
/// into it, and a popup that restores focus to its trigger after a mouse-driven
/// close must not light that trigger up. Both fall out of snapshotting at the
/// moment focus changes.
///
/// This mirrors what `@tinyrack/ui` publishes on the web as
/// `data-tr-focus-modality`, and the two have to agree: the visual parity suite
/// compares the two renderings pixel for pixel.
class TRFocusSource extends ChangeNotifier {
  TRFocusSource._();

  static final TRFocusSource instance = TRFocusSource._();

  bool _installed = false;
  // Fail toward showing emphasis: until a pointer gesture proves otherwise,
  // focus is treated as keyboard focus.
  bool _keyboardModality = true;
  bool _snapshot = true;
  bool? _modalityOverride;
  FocusNode? _lastPrimaryFocus;
  FocusManager? _observedFocusManager;

  /// Whether the focus held right now should paint emphasis.
  bool get isKeyboardFocus => _modalityOverride ?? _snapshot;

  /// Starts observing input, if it is not observing already.
  ///
  /// Controls install from `initState` rather than on first read: the state
  /// properties that read [isKeyboardFocus] resolve lazily, so waiting for a
  /// read would miss the very pointer press that decides the answer.
  void install() {
    if (!_installed) {
      _installed = true;
      GestureBinding.instance.pointerRouter.addGlobalRoute(_handlePointerEvent);
      HardwareKeyboard.instance.addHandler(_handleKeyEvent);
    }
    _observeFocusManager();
  }

  void _observeFocusManager() {
    final manager = FocusManager.instance;
    if (identical(manager, _observedFocusManager)) return;
    _observedFocusManager?.removeListener(_handleFocusChange);
    _observedFocusManager = manager;
    manager.addListener(_handleFocusChange);
    // A different focus manager means a different binding, so this is a fresh
    // app rather than a continuation. Start from the safe default instead of
    // inheriting the previous one's modality. In production there is one
    // manager for the life of the process, so this runs exactly once.
    _keyboardModality = true;
    _snapshot = true;
    _lastPrimaryFocus = manager.primaryFocus;
  }

  void _handlePointerEvent(PointerEvent event) {
    if (event is PointerDownEvent) _keyboardModality = false;
  }

  bool _handleKeyEvent(KeyEvent event) {
    if (event is! KeyDownEvent) return false;
    // A modifier on its own is not navigation, and neither is the combo it is
    // about to form, which is usually an application or platform shortcut.
    if (!HardwareKeyboard.instance.logicalKeysPressed.every(_isNavigable)) {
      return false;
    }
    _keyboardModality = true;
    return false;
  }

  static bool _isNavigable(LogicalKeyboardKey key) =>
      !_modifiers.contains(key.keyId);

  static final Set<int> _modifiers = {
    for (final key in <LogicalKeyboardKey>[
      LogicalKeyboardKey.control,
      LogicalKeyboardKey.controlLeft,
      LogicalKeyboardKey.controlRight,
      LogicalKeyboardKey.meta,
      LogicalKeyboardKey.metaLeft,
      LogicalKeyboardKey.metaRight,
      LogicalKeyboardKey.alt,
      LogicalKeyboardKey.altLeft,
      LogicalKeyboardKey.altRight,
    ])
      key.keyId,
  };

  /// Pins the modality a test or a preview scenario declares, or restores
  /// sampling when given null.
  ///
  /// Sampling answers "how did the user reach this control", which a declared
  /// render condition already states. Two places need to say it outright: a
  /// popup that focuses one of its own rows decides that row's emphasis from
  /// the sampled value, and widget tests share one process and one singleton,
  /// so without this one test's mouse press decides the next test's ring.
  ///
  /// Deliberately not `assert`-guarded. The parity preview is a release web
  /// build, where asserts are stripped, so a guard would remove the override
  /// exactly where the suite depends on it. It stays honest instead by being
  /// unexported from `package:tinyrack_ui/tinyrack_ui.dart` and uncalled from
  /// `lib/src/components`, both of which are asserted by tests.
  @visibleForTesting
  void debugSetKeyboardModality(bool? keyboard) {
    if (_modalityOverride == keyboard) return;
    _modalityOverride = keyboard;
    notifyListeners();
  }

  /// Drops the override and the sampled modality.
  @visibleForTesting
  void debugReset() {
    _modalityOverride = null;
    _keyboardModality = true;
    _snapshot = true;
    _lastPrimaryFocus = FocusManager.instance.primaryFocus;
    notifyListeners();
  }

  void _handleFocusChange() {
    final primary = FocusManager.instance.primaryFocus;
    if (identical(primary, _lastPrimaryFocus)) return;
    _lastPrimaryFocus = primary;
    if (_snapshot == _keyboardModality) return;
    _snapshot = _keyboardModality;
    notifyListeners();
  }
}

/// Rebuilds a control when the focus source changes, and answers whether it
/// should paint focus emphasis.
mixin TRFocusSourceMixin<T extends StatefulWidget> on State<T> {
  /// Call from [State.initState].
  void initFocusSource() {
    TRFocusSource.instance
      ..install()
      ..addListener(_handleFocusSourceChange);
  }

  /// Call from [State.dispose].
  void disposeFocusSource() {
    TRFocusSource.instance.removeListener(_handleFocusSourceChange);
  }

  /// True when [hasFocus] is focus the keyboard granted, which is the only
  /// focus that gets a ring or a focus-coloured border.
  bool focusVisible({required bool hasFocus}) =>
      hasFocus && TRFocusSource.instance.isKeyboardFocus;

  void _handleFocusSourceChange() {
    if (mounted) setState(() {});
  }
}
