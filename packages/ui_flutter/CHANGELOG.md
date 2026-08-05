## 0.5.0

- Adds `TRTerminalView`, `TRTerminalController`, and `TRTerminalSize` for
  token-backed interactive terminal emulator surfaces on mobile and desktop.

## 0.4.6

- Prevents reduced-motion collapsibles from throwing a Flutter layout
  assertion when their open content changes size.

## 0.4.5

- Prevents pointer-acquired focus from reopening a tooltip after its trigger
  opens a menu or another overlay.

## 0.4.4

- Dismisses open tooltips immediately when their trigger is activated by a
  pointer or the Enter and Space keys, preventing stale tooltips over menus and
  dialogs.

## 0.4.3

- Preserves explicit null-valued select options in controlled display,
  selection, and restored form state.

## 0.4.2

- Defers controlled anchored-layer closure until after the current frame so
  tooltips and other overlays can close safely during widget updates.

## 0.4.1

- Makes `TRAppShell` the Material surface for its composed controls, so apps
  can use Tinyrack fields, collapsibles, and other interactive components
  without retaining a `Scaffold` wrapper.

## 0.4.0

- Adds secure single-line and bounded multiline editing contracts to
  `TRTextField` through `obscureText` and `minLines`.

## 0.3.0

- Uses Lucide icons for every icon owned by a Tinyrack Flutter component.
- Adds leading and action slots to `TRWindowFrameTitleBar`.
- Adds typed, accessible `TRWindowCaptionButton` actions for Flutter-owned
  desktop window chrome.

## 0.2.0

- Adds `filterMode`, `filter`, `autoHighlight`, and `clearable` to `TRCombobox`,
  `TRMultiCombobox`, and their form fields.
- Renders disabled combobox options as muted and unselectable instead of
  removing them from the popup, and steps arrow navigation past them.
- Adds `TRTextField.suffix` for trailing in-field affordances.

## 0.1.0

- Adds shared Tinyrack themes and generated design tokens.
- Adds Text, Button, IconButton, TextField, Card, Alert, Badge, and Spinner.
- Adds the interactive Flutter Web documentation preview.
