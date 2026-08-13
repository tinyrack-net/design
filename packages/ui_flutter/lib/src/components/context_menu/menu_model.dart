import 'package:material_ui/material_ui.dart';

/// One entry of a context menu, described as data rather than as widgets.
///
/// A menu the operating system draws cannot host a Flutter widget, so a menu
/// that may be presented natively is declared through this model instead of
/// through `TRMenuItem` and its siblings. `TRContextMenu.items` renders the
/// same model with those components whenever Flutter presents the menu, so the
/// two presentations stay one description.
sealed class TRMenuElement {
  const TRMenuElement();
}

/// A command in a context menu.
///
/// [icon] is honored only when Flutter presents the menu. A system menu takes a
/// platform bitmap rather than an [IconData], so the native presentation shows
/// the title, the shortcut, and the check mark.
final class TRMenuActionElement extends TRMenuElement {
  const TRMenuActionElement({
    required this.id,
    required this.title,
    required this.onPressed,
    this.icon,
    this.shortcut,
    this.enabled = true,
    this.checked,
  });

  /// Identifies this command inside one menu.
  ///
  /// A system menu reports the chosen entry rather than invoking a Dart
  /// closure, so the presenter needs a stable name to route the selection back
  /// to [onPressed].
  final String id;

  final String title;
  final VoidCallback onPressed;
  final IconData? icon;
  final MenuSerializableShortcut? shortcut;
  final bool enabled;

  /// Whether to draw a check mark, or `null` for a plain command.
  final bool? checked;
}

/// A rule between two groups of commands.
final class TRMenuSeparatorElement extends TRMenuElement {
  const TRMenuSeparatorElement();
}

/// A nested menu opened from a parent entry.
final class TRMenuSubmenuElement extends TRMenuElement {
  const TRMenuSubmenuElement({
    required this.title,
    required this.children,
    this.icon,
  });

  final String title;
  final List<TRMenuElement> children;
  final IconData? icon;
}
