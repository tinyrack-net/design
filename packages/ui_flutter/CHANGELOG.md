## 0.9.0

- Adds `TRTextInputVariant` and a `variant` property on `TRTextField` and
  `TRTextarea`. The new `plain` variant drops the input's own border and fill so
  an enclosing surface can frame the input; that surface then owns focus
  visibility and invalid emphasis.
- Adds a `focused` property on `TRCard` so a card framing a focusable group,
  such as a composer built around a plain input, can paint the focus ring. The
  ring paints over the card, so it does not change the card size.

## 0.8.1

- Fixes an anchored layer that never requested focus, such as a `TRTooltip`
  opened by focusing its trigger, restoring focus to that trigger when it
  closes. The restored focus dismissed whatever had gained focus meanwhile, so
  opening a `TRMenubar` menu while a focus tooltip was showing closed the menu
  immediately.

## 0.8.0

- Adds default and muted separator variants so content dividers can use the
  standard control border or the lower-emphasis semantic border color.

## 0.7.0

**Breaking:** simplifies the shared control size scale to two steps. This
shipped unlabelled in 0.6.1, which is retracted; 0.7.0 restates it correctly.

- Removes `TRUiSize.sm` and shifts the scale down one step. The former `sm`
  metrics are now `md`, and the former `md` metrics are now `lg`; the former
  `lg` step is gone. Migrate `TRUiSize.sm` to `TRUiSize.md` and `TRUiSize.md`
  to `TRUiSize.lg` to keep the rendered size unchanged. Callers of the former
  `TRUiSize.lg` must choose one of the two remaining steps.
- Fixes `TRMenubarMenu` popup panels rendering Material default vertical
  padding and background around their Tinyrack layer surface.

## 0.6.1

Retracted. Published as a patch but contains the breaking control size scale
change above. Use 0.7.0 instead.

- Fixes `TRMenubarMenu` popup panels rendering Material default vertical
  padding and background around their Tinyrack layer surface.

## 0.6.0

- Adds optional secondary descriptions to `TRTreeNavGroup` and
  `TRTreeNavLeaf` rows.
- Adds an expand-and-collapse Lucide glyph style for typed native window
  caption actions.

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
