## 0.27.0

- Renders every popup layer row at `sm` instead of `md`. A menu item, a select
  option, an autocomplete or combobox suggestion, and a toolbar link all sat at
  the same height as the control that opened them, so an open menu of five
  commands was as tall as five buttons stacked on the page. A row inside an
  already-open surface is not a control the page has to make room for, and
  reading it at the trigger's size made short command lists feel oversized.
- Menu rows are now 32px instead of 36, select and combobox options 28 instead
  of 32, inline padding 8 instead of 12, and row text is the `sm` control label
  style instead of `bodySm`, which also brings a menu item's type in line with a
  `TRButton` of the same size. Row icons are now sized explicitly at the `sm`
  icon size; they previously inherited the ambient 16px icon theme and stayed
  large while everything around them shrank.
- The context menu surface follows: its minimum width is five `sm` rows instead
  of five `md` ones and its padding is the `sm` gap. Popup widths are otherwise
  unchanged, because `measure-md` is a layout scale shared with things that are
  not controls.
- No token values changed. The `sm` control metrics already existed; the layer
  chrome simply reads them now, from one named constant so the Flutter and web
  packages cannot drift apart again.

## 0.26.1

- Stops `TRTerminalView` repeating a whole committed word once more when a
  sticky input method — Hangul or Kana, for instance — ends its composition
  session by reporting the unchanged buffer again. An identical
  single-character report is still sent, because a platform that resets the
  buffer reports one keystroke at a time. A continuation report is also no
  longer split in the middle of a surrogate pair, which used to put a lone
  surrogate on the wire as invalid bytes.
- Makes `TRContextMenu` dismissable and intentional. The menu now closes when
  a pointer presses its own child — the anchor shares the menu's tap region,
  so that press never counted as an outside tap — and on Escape wherever
  focus is; a terminal closes it before Escape can reach the program. A held
  primary mouse button no longer opens it, because a long press means
  "context menu" only for touch and stylus pointers, and Enter or Space on a
  focused child no longer opens it either, because the keyboard trigger now
  listens only for the context-menu key and Shift+F10.

## 0.26.0

- Adds `TRMenu.icon`, for a menu that opens from a glyph. The trigger was
  always laid out as a text control, so it carried `inlinePaddingOf` on both
  sides: an `md` menu holding a 16px icon came out roughly 42x32. Standing in a
  tab strip or toolbar beside `TRIconButton`s, the menu was the one wide
  control in a row of squares, and there was no way to narrow it. The named
  constructor takes the geometry `TRIconButton` already uses — a square the
  side of the control height, with the inline padding dropped and the glyph
  sized by `iconSizeOf`.
- `TRMenu.icon` requires a `label`, exactly as `TRIconButton` does, because a
  glyph alone leaves the trigger with no accessible name. Hover, pressed,
  focus, radius, and the expanded state are unchanged from the text trigger.

## 0.25.0

- Adds `TRCollapsible.attachedEdge` with `TRCollapsibleAttachedEdge`. A
  collapsible sitting directly on another surface — a drawer docked on top of
  a card, for instance — previously painted a full rounded border, so the two
  surfaces could not read as one; the only workarounds were forbidden local
  repaints. `bottom` and `top` square that edge's corners, drop its border
  side, and keep the content box identical by no longer widening the inset the
  removed border used to overlap. The default `none` is pixel-identical to the
  previous rendering.

## 0.24.0

- Adds `TRFieldAppearance.plain`, for a field inside a surface that frames the
  whole group and shows the group's focus itself. `ghost` still paints hover and
  focus from the field, which is right for a lone field on a toolbar but wrong
  inside a `TRCard` that sets `focused`: the caret then draws one ring around the
  text and another around the card. A composer whose card holds the input, a
  toolbar, and a send button had to choose between ringing only the text or
  ringing it twice.
- `plain` keeps the invalid emphasis, which is the one state the framing surface
  cannot know about, and keeps the border box at its normal width like the other
  appearances, so switching to it never moves the field. The web package
  expresses the same rule structurally: an input inside `.tr-input-group` drops
  its border and outline and the group paints `:focus-within`. Flutter has no
  such nesting selector, so the field is told directly.
- Adds `uiSize` to `TRMenu`. Its trigger had `md` geometry welded in, so a menu
  standing in a row of `sm` buttons and fields was four pixels taller than every
  control beside it and there was no way to align them. `TRButton`,
  `TRIconButton`, `TRSelect`, and `TRMenubar` already took the size; the menu is
  now the same, defaulting to `md`.

## 0.23.0

- Adds `TRInlineSuggestions`, a suggestion layer anchored to a text field the
  caller keeps. `TRAutocomplete` and `TRCombobox` both build their own field
  and match against its entire contents, so neither can complete one token of a
  longer message: a mention or a command typed inside a multiline composer had
  no component at all, and every consumer that wanted one had to hand-roll an
  overlay along with its highlight, wrapping keyboard navigation, scroll-into-
  view, and popup semantics.
- The component never builds or reads the field. It takes the caller's subtree
  as `child`, receives rows the caller already filtered and ordered, and reports
  the committed row through `onSelected` so the caller performs the text edit
  with the offsets only it knows. `sessionKey` names the token being completed:
  changing it resets the highlight and clears an earlier dismissal, so Escape
  hides the current token's list while a freshly typed one reopens.
- `TRInlineSuggestionsController.handleKeyEvent` is the integration point. A
  multiline editor consumes the arrow and enter keys itself, so a host calls it
  first inside its own `Focus(onKeyEvent:)` and falls through to its own
  behaviour on `KeyEventResult.ignored`. Enter with nothing armed is ignored,
  which keeps a host's Enter-to-send working over an empty result set.
- Results that arrive late for the same session keep the highlighted value
  rather than its index, and a loading list that still holds rows keeps them on
  screen with a spinner below. Together these stop the list reshuffling or
  blanking under the reader on every keystroke.
- A held modifier leaves the key to the host. Shift+Enter opens a line and
  Control+Enter submits in the editors this exists for, so a list that claimed
  every Enter would swallow both; the same rule keeps Shift+Tab and
  Shift+arrow with the field.
- `TRInlineSuggestionItem.matchedIndices` names the characters to emphasise, so
  a consumer highlights a fuzzy match without naming a color or a weight.
- An anchored layer placed above its trigger now grows from the edge nearest
  that trigger instead of always scaling from its top, so a layer opening
  upwards no longer appears to pull away from the control it belongs to.

## 0.22.0

- Pins `splashFactory` to `InkRipple.splashFactory`. Material picks the ink
  sparkle on Android and the ripple on every other platform, so the same press
  animated differently depending on where a Tinyrack app ran, for the same
  reason the page transitions are already pinned. The sparkle also compiles a
  fragment shader that a headless test environment cannot always provide, which
  surfaced in consumers as an intermittent `ink_sparkle.frag` failure rather
  than as a visible difference.

## 0.21.0

- Adds `TRMeasurements.brandMarkSm`, `brandMarkMd`, and `brandMarkLg` — a 64,
  96, and 128px square scale for a brand mark, such as the one a boot splash
  centers. A product had no token for this: the `measure` scale constrains the
  inline size of a content region, `TRSpacing` describes gaps, and
  `TRControlMetrics.iconSizeOf` is the 14-16px glyph inside a control, so
  sizing a mark with any of them read as a token while meaning something else.
  Also exposed to the web package as `--tinyrack-brand-mark-*`.

## 0.20.0

- Removes `TRWindowCaptionButton`, `TRWindowCaptionAction`, and
  `TRWindowCaptionGlyphStyle`. The widget was one `TRIconButton` call under a
  glyph table, and the two decisions it added — a `ghost` appearance and
  `TRIntent.danger` on close — could not be overridden, so the first consumer
  that wanted a caption group in one color had to abandon the widget rather
  than configure it. Nothing in the package used it: `TRWindowFrame` draws its
  own decorative controls, and there was no React counterpart.
- Build window commands from `TRIconButton` in the `leading` and `actions`
  slots of `TRWindowFrameTitleBar`, which is unchanged. The glyphs the widget
  used were `minus`, `square`, `copy`, and `x`; the neutral corner set was
  `minimize`, `maximize`, `minimize2`, and `x`.

## 0.19.0

- Replaces `TRTextInputVariant` with `TRFieldAppearance` and accepts an
  `appearance` argument on `TRTextField`, `TRTextarea`, `TRSelect`,
  `TRCombobox`, `TRMultiCombobox`, `TRAutocomplete`, `TRNumberField`, and
  `TROtpField`, together with their controlled and form-field variants. Only
  buttons and shell surfaces could drop their chrome before, so a select or a
  text field sitting inside a sidebar or a toolbar had no way to stop looking
  like a boxed control. Replace `variant: TRTextInputVariant.plain` with
  `appearance: TRFieldAppearance.ghost`, and
  `TRTextInputVariant.defaultVariant` with `TRFieldAppearance.solid`.
- `TRFieldAppearance.ghost` is not the old `plain`. `plain` removed the frame
  outright, including the focus ring, which left the host surface responsible
  for focus visibility and invalid emphasis and frequently unpainted. `ghost`
  drops only the resting border and fill; hover, focus, open, and invalid
  states are still painted by the field from the same tokens `solid` uses.
- A ghost field keeps its border box at the normal width and paints it
  transparent, so swapping appearance never moves a field's metrics. A
  `TRTextarea` migrating from `plain` therefore insets its content by one
  border width more than before, matching what `solid` has always done.

## 0.18.0

- `TRMeasurements` publishes the complete measure scale: `measureXs`,
  `measureSm`, and `measureLg` join the `measureMd` and `measureXl` steps it
  already exposed. The tokens behind them were already generated, but only two
  of the five were public, so a consumer sizing a surface to any other step —
  a boot splash brand mark, a constrained illustration — had to approximate it
  with a literal or misuse a `TRSpacing` gap token as a dimension.

## 0.17.0

- Raises the `sm` control height from 24px to 28px. 24px left four pixels of
  air around a 12px label, which reads as cramped rather than dense on the
  desktop title bar the step was added for. The rest of the recipe is
  unchanged.

## 0.16.0

- `TRTreeNav` and `TRTreeNav.controlled` take an `itemSpacing` parameter for
  the gap between top-level items. It defaults to `TRGeneratedSpacing.lg`,
  preserving prior behavior for a tree of unrelated top-level branches. A
  consumer rendering a flat list of adjacent destinations, such as a settings
  sidebar, previously had no way to shrink that gap without a private
  literal — it can now pass a smaller public `TRSpacing` token instead.

## 0.15.0

- Adds `TRUiSize.sm`, a compact step below `md` on the shared control scale, and
  the `controlMetrics.sm` tokens behind it — 24px height, 8px inline padding,
  4px gap, 14px icon, and 12px/16px label type. The scale previously started at
  `md`, so a dense surface such as a desktop title bar had no size to drop to
  and consumers reached for literals instead. Every control that switches on
  `TRUiSize` resolves the new step from the same token tier.
- `TRMenubar` and `TRMenubarMenu` take a `uiSize`. The bar was fixed to `md`, so
  its height could not follow the rest of a compact chrome row. The bar
  publishes its size to its menus through an internal scope, and a single
  `TRMenubarMenu` can still override it.
- `TRWindowCaptionButton` takes a `uiSize`. It was fixed to `md`, which pinned
  the minimize, maximize, and close glyphs to a 32px row even when the frame
  around them was smaller.

## 0.14.0

- Adds `TRControlMetrics.labelStyleOf`, the text style a control renders its
  label in. A consumer measuring a label to decide what fits had to guess the
  weight and tracking, because they are not the ambient ones; measuring with
  the ambient style under-reports the width. `TRButton` now takes its own label
  style from the same accessor, so the two cannot drift.

## 0.13.0

- Sizes and colors icons from tokens. `ThemeData.iconTheme` was unset, so every
  icon outside a component that installs its own icon theme fell back to
  Material's 24px default and to `colorScheme.onSurface`. 24 is not a Tinyrack
  measurement, so those icons rendered off the scale and consumers compensated
  with size literals. Icons now take `TRControlMetrics.iconSizeOf(TRUiSize.md)`
  and the `text` token.
- Adds `TRControlMetrics`, which publishes the geometry every Tinyrack control
  is built from — outer height, inline padding, content gap, icon size, font
  size, and line height per `TRUiSize`, plus the border width that adds to a
  control's outer size. A layout that has to decide how many controls fit an
  available width, or align its own content to a control, previously had to
  measure a rendered control or copy a literal, because these values were only
  reachable through the private generated tokens.

## 0.12.0

- `TRAppShellSidebar` now owns its own inline size and animates every change to
  it — collapsing, expanding, and switching between the expanded width and the
  rail — over `TRMotion.normal`, snapping instead when the platform asks for
  reduced motion. The new `collapsed` flag animates the surface away: it leaves
  focus, pointers, and semantics as soon as the collapse starts, its content
  stays laid out at the target width and clipped while the surface slides, and
  the content is removed from the tree once the animation ends. The new `width`
  overrides the shell width for one surface, which is what a sidebar composed
  inside `TRAppShellMain` needs. A caller that wrapped the sidebar in a fixed
  `SizedBox` should pass `width` instead, because an outer tight constraint
  still wins and suppresses the animation. The mobile drawer keeps its own
  route transition and ignores `collapsed`.

## 0.11.0

- Adds `TRText.inherit`, which keeps the ambient `DefaultTextStyle` instead of
  replacing it with a typography role. Tinyrack components style their slots by
  merging into the default text style, so a slot child built with the primary
  constructor discarded the size, color, and truncation its host applied — a
  `TRText` in a `TRTreeNav` description lost the muted label style, and one in a
  list row subtitle lost both the muted color and the ellipsis. The primary
  constructor is unchanged and remains correct wherever the text owns its role.
- Decouples `TRText`'s `overflow` and `softWrap` from `truncate` and adds them
  as parameters. `truncate` forced `maxLines` to 1, so a two-line ellipsized
  label was not expressible. It is now shorthand that any explicit `maxLines`,
  `overflow`, or `softWrap` overrides, and only a single-line clip stops
  wrapping. `TRText` also no longer forces `TextAlign.start` when no alignment
  is given, so it inherits the ambient alignment as `Text` does.
- Adds `TRScrollArea.forScrollable`, a themed scrollbar over a scrollable the
  caller already owns. The default constructor always supplies its own
  `SingleChildScrollView`, so hosting a lazy or reversed `ListView` nested two
  scrollables, unbounded the list's height, and defeated its lazy building.
- Fills in `headlineSmall`, `headlineMedium`, and `headlineLarge` on the theme's
  `TextTheme`. They were unset, so their size, line height, and weight were all
  null and text sized by them fell back to the ambient default rather than a
  token. All three take the same style as their `titleLarge` and `displaySmall`
  neighbours, which Tinyrack already renders identically.
- Themes text selection. `textSelectionTheme` was unset, so the selection
  highlight, caret, and drag handles were drawn with Material's default accent,
  which is outside the token set. Selection now uses `surfaceSelected`, the
  caret uses `text`, and the handles use `focus`.
- Fixes `TRTerminalView` repeating text that a multi-character input method
  composes. The terminal reports the whole platform editing buffer when a
  composition ends and relies on resetting that buffer afterwards; Hangul and
  Kana input methods keep their own buffer for the length of a composition
  session and ignore the reset, so typing `반갑다` sent `반반갑반갑다` to the
  program. The terminal now sends only what each report adds.
- Adds `TRTerminalController.selectedText`, `hasSelection`, `selectAll`,
  `clearSelection`, `paste`, and `selectionChanges` so a consumer can build
  clipboard actions against the selected region.
- Adds `TRTerminalView.contextMenuBuilder`, which opens a `TRContextMenu` at the
  secondary pointer button. The terminal owns this interaction because it
  consumes secondary taps itself, so an enclosing `TRContextMenu` never saw
  them. A program that asks the terminal to report mouse events still receives
  the secondary button instead.

## 0.10.0

- Maps every Material color role onto a Tinyrack token. `TinyrackTheme` set
  only nine of the `ColorScheme` roles, so the rest resolved through Flutter's
  fallback chain: `outline` and `outlineVariant` collapsed onto `onSurface`,
  which made a plain `Divider` or `VerticalDivider` paint in the full-contrast
  `text` token — a near-white hairline in dark mode. `onSurfaceVariant` had the
  same fallback, so muted metadata rendered at full contrast, and every
  `surfaceContainer*` tier collapsed onto `surface`, leaving raised surfaces
  invisible against the page. The boundary roles now use the two border tokens,
  the container tiers use `surfaceMuted`, `surfaceTint` is transparent to match
  the flat surface system, and `ThemeData.dividerColor` is pinned to `border` so
  the legacy and Material 3 divider paths agree. `shadow` deliberately keeps its
  opaque-black default, which already matches the token shadows.
- Adds `TRPageTransitionsBuilder` and installs it in `TinyrackTheme.light()` and
  `TinyrackTheme.dark()` for every `TargetPlatform`. A routed page previously
  inherited Material's per-platform default, so the same application animated
  one way on Android and another on macOS, Linux, and Windows, and the motion
  came from outside the token set. The arriving page now fades in while it
  scales up from the closed overlay scale, matching the dialog and drawer
  motion, and a pop plays that animation in reverse. The transition is skipped
  when the platform reports `disableAnimations`.

## 0.9.1

- Fixes a `TRMenubar` menu and a `TRMenu` panel that opened over their own
  trigger instead of below it. The shared menu layer style anchored the panel to
  the trigger's top edge, so an open menubar menu covered the bar. A menubar
  panel now attaches to the bar's bottom edge and a `TRMenu` panel keeps its
  `alignmentOffset` gap below its trigger.

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
