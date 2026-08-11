## 0.55.0

- Adds optional leading content to `TRSelect` and `TRSelectFormField` triggers.
- Adds stable keys to `TRSelectItem` option rows on both dropdown and sheet
  surfaces.
- Keeps hover, open, highlighted, and selected option states fill-only across
  Select, Autocomplete, Combobox, and InlineSuggestions. Select triggers and
  options now paint the focus border only for keyboard-origin focus, matching
  TextField while preserving invalid danger borders.
## 0.54.0

- Adds `secondaryLabel` to `TRChatToolDisclosure` for a concise description of
  the active work.
- Replaces running chat spinners and trailing status text with a directional
  text shimmer. Reduced-motion environments keep the same labels static.
## 0.53.0

- Adds `TRDrawer.maxExtent`, which caps a drawer on its opening axis as a
  fraction of the viewport. Content-sized top and bottom drawers keep their
  intrinsic size below the cap and scroll within it when their content is
  taller; the default remains the full viewport. Fixed and draggable
  `snapPoints` must stay within the same maximum.

## 0.52.1

- Keeps dialog body padding while placing its scrollbar against the modal
  surface edge. Dialog and AlertDialog now own long-body scrolling while their
  titles, descriptions, and actions remain fixed.

## 0.52.0

- Replaces the control-only density scope with `TRUiDensityScope`, which lets
  a product opt a subtree into coordinated control, typography, card, and
  status-indicator sizing.
- Adds the Flutter-only `TRUiSize.xl` recipe with a 48-pixel control height,
  16-pixel labels, and 20-pixel icons. Comfortable density now selects this
  recipe while explicit component sizes and card padding still win.

## 0.51.0

- Adds an optional `key` to `TRTreeNavGroup` and `TRTreeNavLeaf`. The key is
  attached to the rendered row, so products can distinguish destinations with
  the same label and Flutter preserves row state when keyed nodes reorder.

## 0.50.1

- Animates a dragged `TRDrawer` from its released extent to the nearest snap
  point instead of jumping there. Reduced-motion environments still settle the
  drawer immediately, and dismissal thresholds are unchanged.

## 0.50.0

- Adds the `tinyrack_ui_check` command and programmatic check API for enforcing
  public Tinyrack tokens, components, imports, and light/dark theme setup in
  Flutter application source.
- Supports analyzer 12 as well as analyzer 13 so applications pinned by the
  Flutter SDK can install the compliance checker.
- Runs against both analyzer AST contracts and accepts normalized relative
  project roots such as `--root .`.

## 0.49.0

- Adds `TRControlDensityScope`, which lets a product choose `standard` or
  `comfortable` default geometry for a subtree without teaching the design
  system where its responsive breakpoint belongs. Interactive controls that
  omit `uiSize` now resolve to `md` or `lg` from that scope, while an explicit
  `sm`, `md`, or `lg` remains fixed. Status and display components keep their
  existing size defaults.
- Adds `uiSize` to `TRSwitch`. Its existing 40 by 24 geometry remains the
  medium default, and the comfortable large recipe renders a 48 by 32 switch.
- Makes the large slider recipe reserve the shared 40-pixel large control
  height instead of shrinking below the medium recipe, so comfortable density
  increases both its target and thumb clearance.

## 0.48.1

- Keeps `TRDrawer` content clear of every system safe area while its surface
  still reaches the viewport edge. Top and bottom sheets previously disabled
  the inset on the edge they were attached to, placing controls under a status
  bar, home indicator, or system navigation bar.

## 0.48.0

- Lets a selection reach the end of a long line in a `TRCodeBlock`. A block that
  does not wrap is wider than its viewport, and the pointer cannot travel past
  the clip: a drag could only ever select the part of the line that happened to
  be visible when it started, and nothing outside the block scrolls that axis.
  Holding a drag past the code now pans the block at about the rate the line can
  be read, and a reader who has turned motion off gets the whole line at once.
- Adds `TRCodeBlock.trailing`, an action pinned to the block's top-trailing
  corner and clear of the code, so a copy affordance no longer requires
  recreating the surface around it.

## 0.47.4

- Keeps a `TRSplitView` divider under the pointer while it is dragged. Each
  drag update was applied to the ratio the last frame had rendered, so when a
  fast pointer delivered several moves before the next build, only the final
  move of the frame survived and the divider fell further behind the cursor
  the faster it was dragged. Updates now accumulate on the live drag value.
  The drag value is also kept unclamped, so travel spent pushing past a pane's
  minimum extent is owed back before the divider follows the pointer again,
  instead of the divider reversing while the pointer is still beyond the
  bound.

## 0.47.3

- Gives a toast the height of what it says. The card carried a floor tall
  enough for a title, a description, and an action, so a one-line report — the
  common case — sat in nearly twice the space it needed. The floor is gone
  along with the `toastMinHeight` metric behind it; the card is still a fixed
  width so a stack reads as one column.
- Stops a toast from painting its text with Flutter's fallback style. A region
  mounted above the navigator, which is where a report has to live to outlast
  the route that asked for it, stands outside every `Scaffold`, and the cards
  draw their own surface rather than standing on one. Text there inherited the
  yellow double underline `MaterialApp` marks unstyled text with. The stack now
  carries a transparent `Material`, which also gives its controls the ink
  surface they splash onto.
- Reports an action asked for a second time. Showing a toast under an id that
  is already queued replaces it rather than stacking a second card, but the
  replacement was silent: the card sat exactly where it was, saying exactly
  what it said, which read as the second attempt having been ignored. A repeat
  now plays its entry again, moves to the newest place in the stack, and builds
  a fresh live region so a screen reader announces it too.

## 0.47.2

- Emphasises a keyboard-focused `TRSelect` trigger with the selection fill
  instead of the accent focus outline. The blue border read as an error or a
  validation state on a control that was merely focused, and it thickened the
  trigger's border, so the box shifted as focus arrived. Focus now carries the
  same fill an open trigger already had, in both the solid and the ghost
  appearance, and it outranks hover. An invalid trigger keeps its danger
  outline, which is the one state the fill on its own cannot say, and the
  highlight inside the option list is unchanged. `@tinyrack/ui` moves with it,
  so the two packages keep the same focus treatment.

## 0.47.1

- Selects a draggable tab on an ordinary click again. `Draggable` claims the
  gesture as soon as the pointer passes its device hit slop, which is a single
  logical pixel for a mouse, so a click that drifted while the button was down
  started a drag and the strip reported nothing. A tab now waits for
  `TRMeasurements.dragStartDistance` before the drag takes over, and keeps the
  platform slop on touch. A strip built with `dragConfiguration` needed several
  clicks to switch tabs.
- Selects from the whole tab, not only from its label. The tap surface sat
  inside the tab's padding, so a click on the padding, the strip rule, or the
  band above and below the label landed on nothing while the hover surface
  still reacted to it. The close control keeps its own tap target and its own
  node in the semantics tree, and a tab now reports its label and a tap action
  to assistive technology instead of leaving activation to the keyboard.
- Adds `TRMeasurements.dragStartDistance`, the distance a pointer travels
  before a press on a draggable surface turns into a drag.

## 0.47.0

- Adds `TRSelect.searchable`, which opens a filter field above the options and
  gives it focus. It matches the item label case-insensitively unless
  `filter` supplies a predicate, explains an empty result with
  `noResultsText`, moves focus to the first enabled match on arrow down, and
  commits on Enter once one match is left. A select without it keeps the
  existing prefix typeahead; a searchable one spends those keystrokes on the
  query instead, because jumping between rows is what the query already does.
- Opens the options in a bottom sheet on a viewport narrower than
  `TRBreakpoints.small`, and in the anchored dropdown at or above it. A
  dropdown on a phone had to share the viewport with the trigger and the
  keyboard, which left a long list a few rows tall. **This changes every
  existing select on a narrow viewport**, searchable or not. `TRSelect.surface`
  pins one of the two when a layout needs to decide for itself. The surface is
  resolved when the select opens, so a resize cannot swap it out from under an
  open list.
- Scrolls the dropdown's options at `TRMeasurements.measureXl` instead of
  letting them grow past the viewport. A select with more options than fit had
  no way to reach the ones below the fold.

## 0.46.0

- Renders `TRNumberField`'s label and supporting text around the whole control
  instead of inside its numeric input. The input sits in a fixed
  `TRMeasurements.measureSm` box between the two step buttons, so a
  `helperText` or `errorText` handed to it wrapped at that width and grew a
  column tall enough to drag the centered `−` and `+` buttons off the input's
  row and down beside the wrapped text. Every consumer that explained its
  number field got that layout; the field now reads as one row with its
  message beneath, and the message is free to use the control's full width.
- Adds `TRTextField.invalid`, which paints the field's invalid emphasis
  without giving it a message to render. `errorText` still implies it. This is
  what lets a component that owns the message — `TRNumberField` above — keep
  the frame and the explanation from having to share one width.

## 0.45.1

- Reports an unavailable `TRSwitch` by fading the whole control at
  `TRGeneratedOpacity.disabled`, the way `TRCheckbox` already does, instead of
  swapping the palette. A disabled switch that was on used to paint a
  `surfaceSelected` track with a full-opacity `primary` thumb, which inverted
  the enabled on state and read as a different control rather than as the same
  switch the reader had just lost access to.
- Keeps a disabled or read-only `TRSwitch` at its resting colors while the
  pointer is over it. Hover was still repainting the track, which the Web
  package has always excluded.

## 0.45.0

- Fixes `TRToastRegion` painting: the card drew a rounded rectangle over a
  border whose leading side carried the variant colour at a heavier width, which
  Flutter cannot stroke. Every paint threw in a debug build, and a release build
  dropped the corner radius instead. The variant now reads as a leading bar
  inside a uniformly bordered card, so the radius survives.
- Clamps a toast title to two lines and a description to three. A caller
  forwarding a caught exception could otherwise grow one card past the height of
  the viewport and overflow the stack.
- Animates a toast out instead of removing it between frames, so dismissing one
  from the middle of the stack no longer makes its neighbours jump. Cards are
  keyed by their own identity, and an id shown again while it is still leaving
  reclaims its card rather than stacking a second one.
- Holds the auto-dismiss countdown while a pointer rests on the stack or focus
  is inside it, and adds `TRToastController.pauseAutoDismiss`,
  `resumeAutoDismiss`, and `isPaused` for callers that need the same control.
- Scopes the toast region's escape shortcut to the stack. A region with nothing
  to dismiss previously consumed escape anywhere in the application.
- Keeps `TRToastController.track` sticky while its future is in flight. The
  loading toast had been pinned to a finite duration far past the 32-bit
  millisecond argument a browser timer accepts, which dismissed it immediately
  on the web.
- Mirrors the toast dismiss button's inset under right-to-left text, where a
  fixed offset had pushed it into the leading border.
- Announces each toast as its own live region; the surrounding container's label
  never changes, so a screen reader had nothing to report on arrival.
- Adds `TRMotion.toast`, the dwell time a toast uses before dismissing itself.
- **Breaking:** removes `TRToastAnchor`, which wrapped its child in a
  `KeyedSubtree` and did nothing else.

## 0.44.1

- Keeps the running spinner in `TRChatStatusRow` square inside its fixed
  leading rail.

## 0.44.0

- Adds typed first-line and center alignment to `TRChatMessageRow`, keeping
  leading icons aligned with prose at every text scale while allowing compound
  surfaces such as attachment cards to opt into full-height centering.
- Aligns `TRRadio` glyphs with the first line of compound labels by default and
  adds an explicit centered option for non-text label content.
## 0.43.1

- Keeps the native context menu from freezing the window: the Linux popup no
  longer borrows a stale press timestamp, tears itself down when it never maps
  or leaves the screen without deactivating, and a wedged popup is superseded
  by the next request instead of swallowing it.
- Reports the Flutter fallback menu's open and close through the native
  presenter's callbacks, so a caller that restores keyboard focus on close
  hears about the fallback dismissal too.
- Resets the native presenter and surfaces the error when the platform fails
  unexpectedly, instead of leaking an unhandled asynchronous error and
  ignoring every later request.
## 0.43.0

- Adds `TRTabsWidth` and `TRTabs.tabWidth` so document-style strips can keep
  each tab at `TRMeasurements.measureSm` while the default continues to fill
  the available width.
- Extends a hovered tab's surface through the border seam below the strip.

## 0.42.2

- Uses a static running-status icon in chat rows when reduced motion is
  requested, allowing the UI and widget test frame queues to settle.

## 0.42.1

- Keeps `TRSplitView` divider lines expanded across the panes while their wider
  resize targets remain overlaid on the boundary.

## 0.42.0

- **Breaking:** removes the separate `TRTabs.bar` constructor. Use `TRTabs`
  for every tab strip, omit `panelBuilder` when the application owns the
  active body, and opt into leading controls, actions, closing, and dragging
  through their existing optional properties.
- Gives every tab strip one full-width visual contract: tabs divide the
  available width until they reach their minimum scrollable extent, touch the
  strip edges without a ghost inset, and mark selection with a primary top
  rule instead of a rounded selected fill.
- Keeps optional panels on the same strip anatomy while preserving controlled
  and uncontrolled selection, keyboard focus, assistive semantics, disabled
  tabs, close controls, and same- or cross-group drag insertion.
## 0.41.0

- Adds `TRChatMessageRow`, `TRChatUserBubble`, `TRChatToolDisclosure`, and
  `TRChatStatusRow` for consistently aligned chat transcripts with accessible
  tool detail disclosure and typed activity states.
- Adds English, Korean, and Japanese Chat documentation with interactive and
  composed transcript examples.
## 0.40.1

- Draws `TRSplitView` boundaries at the shared border width without turning the
  resize hit target into an empty gutter between panes.
## 0.40.0

- Adds `TRRadialMeter`, a token-sized circular measurement with status colors,
  range clamping, reduced-motion support, and a required assistive label.
- Lets `TRIconButton` accept externally owned focus and autofocus so composite
  controls can coordinate keyboard-triggered overlays without private wrappers.
- Keeps `TRPreviewCard` focus on its trigger while showing non-modal details.
- Adds `TRQrCode`, an accessible token-sized QR image for short-lived links and
  identifiers.

## 0.39.0

- Adds `TRFocusRing` for product-specific composite controls. It accepts raw
  focus ownership but paints the shared ring only when focus arrived through
  keyboard navigation, without changing the child's layout.
- Makes `TRCard.focused` follow the same keyboard-only focus-visible contract.
  Pointer-focused composer surfaces no longer receive a thick focus border.
- Keeps a pointer-open ghost `TRSelect` selected with its background instead
  of a focus border while preserving the border for keyboard navigation.
- Adds `TRDropOverlay` and `TROpacity.dropOverlay` for accessible pane-wide
  file-drop feedback with reduced-motion support and pointer passthrough.

## 0.38.0

- **Breaking:** removes `TRSpacing.fiveExtraLarge`,
  `TRBreakpoints.extraSmall`, `medium`, and `large`, and the brand-mark, pane,
  and reading-width members of `TRMeasurements`. These values had no product
  code consumers. Use the retained `TRSpacing`, `TRMeasurements.measure*`,
  `TRBreakpoints.small` or `extraLarge` values when they express the same
  decision; keep product-specific layout widths in the product.
- Releases the Linux native context menu and its GTK input grab before
  reporting selection or dismissal to Flutter, so restoring terminal focus
  cannot leave the application unresponsive after the menu closes.

## 0.37.1

- Keeps the highlighted `TRInlineSuggestions` row visible while keyboard or
  controller navigation moves through a scrollable suggestion list.

## 0.37.0

- Adds `TRSplitView`, a controlled horizontal or vertical two-pane layout with
  pointer, keyboard, and assistive-technology resizing, minimum extents, and
  separate live and completed ratio callbacks.
- Adds optional document-tab dragging to `TRTabs.bar` through
  `TRTabsDragConfiguration` and `TRTabDropDetails`. A drop reports the source
  strip, destination strip, tab value, and insertion index while preserving
  the existing selection, close, and scrolling contracts.
- Adds `TRMeasurements.splitPaneMinExtent` for products that decide whether a
  container has enough room to create another usable pane.

## 0.36.0

- **Breaking:** removes `TRTerminalView`, `TRTerminalController`, and
  `TRTerminalSize`, together with the `xterm` dependency. Terminal emulation is
  now owned by the style-neutral `termworld` Flutter package. Depend directly
  on `tinyrack-net/flutter-packages/packages/termworld`, create a
  `TerminalEmulator` and `TerminalViewController`, and inject Tinyrack colors,
  typography, spacing, focus, cursor, and selection tokens into `TerminalView`
  from the product composite. No compatibility adapter remains in
  `tinyrack_ui`.

## 0.35.1

- Draws `TRTerminalView` selections as a 50% `surfaceSelected` overlay so the
  selected glyphs and ANSI colors remain visible beneath the highlight.

## 0.35.0

- Makes top and bottom `TRDrawer` surfaces fit their content by default instead
  of reserving half the viewport and leaving growing empty space below short
  content. A drawer now grows only until it reaches the available viewport,
  then scrolls its content while keeping its header and actions visible.
- Passing `snapPoints` opts back into viewport-relative sizing and drag-to-snap
  behavior. Start and end drawers retain their existing side-panel dimensions
  when `snapPoints` is omitted.

## 0.34.0

- Draws a surface and the control sitting on it at one border weight. `border`
  and `controlBorder` were different greys — a card closed at `#d4d4d4` while
  the field inside it closed at `#737373` — so a single screen showed two
  border weights with nothing to explain the difference. `border` now rises to
  meet `controlBorder`: `neutral.500` in light, `neutral.400` in dark. Each
  theme has one resting border; the two themes still differ from each other.
- `controlBorder` is unchanged, so the 3:1 non-text contrast it is held to by
  `status-contrast.test.ts` is untouched. Unifying downward would have meant
  dropping control boundaries to roughly 1.5:1 and deleting that contract.
- Moves the resting borders that had reached for `borderStrong` onto
  `controlBorder`: `TRTextField`, `TRCheckbox`, `TROtpField`, a disabled
  `TRSwitch`, `TRAlertDialog`, `TRToast`, the neutral status border, and the
  Material `InputDecoration` borders. `controlBorder` and `borderStrong` held
  the same value, so a component reaching for the wrong one was
  pixel-identical to one reaching for the right one and the drift went
  unnoticed: `TRTextField` rested on `borderStrong` while the web input rested
  on `controlBorder`, and a disabled `TRSwitch` was drawn stronger than an
  enabled one.
- Separates `borderStrong` from the resting weight so a hover state stays
  distinguishable: `neutral.600` in light, `neutral.300` in dark. It had been
  the same grey the resting border now uses.
- Surfaces are louder as a result — cards, dividers, and popup layers all close
  at the control weight. That walks back part of the layer quieting in 0.33.0:
  a layer now closes at the same weight as everything else rather than at its
  own.
- `ColorScheme.outline` still resolves to `borderStrong`. Material models two
  outline levels and `outlineVariant` already carries the resting border.

## 0.33.0

- Quiets the border every popup layer draws. A menu, select popup, context
  menu, popover, tooltip, or preview card framed itself with `borderStrong`,
  the same weight a resting control uses to claim space in the page. A layer
  already separates itself with a shadow, so the strong edge read as a second
  frame around content that was only two shades away from it. Every layer now
  closes its shape with `border`, and `TRLayerSurface` no longer takes a strong
  variant.
- Lowers layer rows to the `sm` control height. A menu row carried an extra
  `spacing.xs` that an option row did not, so the two densities disagreed by
  4px inside the same product and a menu of six commands stood 24px taller than
  it had to. `layerComponents.menuItemHeight` and `optionItemHeight` are both
  `1.75rem` now, and the components that had copied their own arithmetic —
  the autocomplete scroll estimate, the inline-suggestion row extent, the
  combobox option grid — read those tokens instead.
- Gives `TRMenuSeparator` a `spacing.sm` gap. At `spacing.xs` the rule sat as
  close to its neighbours as two rows of one group sit to each other, so it
  divided nothing.
- Fixes a `TRMenubar` trigger drawing no focus ring. Its border side was a
  fixed transparent line rather than a state-resolved one, so keyboard focus
  moved along the bar invisibly.
- Fixes the `TRTooltip` border taking Flutter's default width instead of
  `borders.width.default`.

## 0.32.0

- `TRDialog`, `TRAlertDialog`, and `TRDrawer` now inset their slots by
  `TRSpacing.medium` instead of `TRSpacing.extraLarge`, so an overlay box is
  padded 12 logical pixels rather than 24. A dialog is a focused surface holding
  one short decision, and a quarter of its width was going to chrome; the delete
  confirmations and pickers that make up most overlay traffic read as oversized
  boxes around two lines of text. `TRDialog`'s content block drops from
  `TRSpacing.large` to `TRSpacing.small`, and `TRAlertDialog` stacks its slots at
  `TRSpacing.small` instead of `TRSpacing.medium`, so the interior rhythm shrinks
  with the box rather than leaving the content block looking detached. The
  matching React surfaces changed with it, so visual parity is unaffected. No
  token values changed. A consumer that sized overlay content against the old
  24px inset — a fixed `maxWidth` on content meant to fill the box, say — gets
  24 logical pixels more room than it asked for.

## 0.31.1

- Completes the `TRTreeNav` keyboard-trap fix. 0.30.1 made the focus ring
  colour-only on leaf rows but left the group row still swapping
  `foregroundDecoration` against null, so a group with a trailing control —
  a workspace header with an overflow menu, say — kept re-inflating itself and
  kept trapping Tab. Both row kinds now hold a stable subtree across focus
  changes.

## 0.31.0

- Adds `TRBreakpoints`, which publishes the viewport widths a responsive layout
  changes shape at. The values were already generated from the shared token
  source but were reachable only through the generated class, so a consumer
  deciding between a stacked and a side-by-side arrangement had to name its own
  threshold and two surfaces in one app could reflow at different widths.
- Adds `TRMeasurements.paneSm` and `TRMeasurements.paneMd`, the inline size of a
  structural pane such as a navigation rail or the list side of a list-detail
  layout. A pane holds rows of other content, so sizing it from the `measure`
  scale or from `TRControlMetrics` stated the wrong intent.
- Adds `TRMeasurements.readingWidthSm`, `readingWidthMd`, and `readingWidthLg`,
  the maximum inline size of a readable content column. An unbounded column
  pushes a label and its control to opposite edges of a wide window.
- Adds `TRControlMetrics.focusWidth` and `TRControlMetrics.focusOffset`. Only
  `borderWidth` was published, so a composite drawing its own focus ring had to
  guess the width and could disagree by a pixel with the controls beside it.

## 0.30.1

- Fixes `TRTreeNav` trapping the keyboard. A row's focus ring was added and
  removed by swapping `foregroundDecoration` against null, which adds and
  removes a foreground layer and so re-inflates the row. Once a row stopped
  taking the ring for a control inside it, stepping from the row onto its own
  trailing button or menu trigger toggled the ring off mid-traversal, and the
  rebuild destroyed the focus node traversal was moving to. Tab then never left
  the tree. The ring is now always present and only changes colour.
- Fixes a system context menu on Linux closing itself moments after it opened,
  which under Wayland left right-clicking looking as though it did nothing at
  all. GTK measures a menu's life from the time of the event that asked for it,
  and the plugin described the request with a fabricated event stamped
  `GDK_CURRENT_TIME`, which is zero. To GTK that menu had been waiting since the
  beginning of the session, so the button release that followed the right-click,
  or the popup grab itself, dismissed it immediately. The plugin now watches the
  pointer presses the window really receives and stamps the request with the
  time of the press that asked for the menu. Measured under Wayland with GTK
  3.24: a menu popped up with a zero stamp took itself down within a second
  every time, with no input at all; the same menu with a real stamp stayed.
- Reports a menu the platform accepted but could not put on screen as a
  `menu-not-shown` platform error instead of as an empty selection, and falls
  back to the Tinyrack presentation when that happens. A dismissal and a menu
  that never appeared were indistinguishable before, so a platform failure
  silently looked like the person changing their mind. The new code is exported
  as `trNativeContextMenuNotShown`.

## 0.30.0

- `TRTabs.bar` renders a document-style tab bar: a horizontally scrolling strip
  of closable tabs that leaves the body to its caller. The card tabs own their
  panel through `panelBuilder`, which an application cannot use when it already
  draws the active document from its own routing state, and they had no way to
  express a per-tab close control, a status glyph, an overflowing strip, or the
  new-tab commands that sit beside the tabs. Every such window had to rebuild
  the strip from list rows and separators, which put the tab height, the inset,
  and the tone of the rule below it back in product code. The bar owns all
  three.
- `TRTabsTab` takes `leading`, `onClose`, and `closeLabel`. Only `TRTabs.bar`
  renders them, and `closeLabel` is required alongside `onClose` so the close
  control is always named for assistive technology.

## 0.29.1

- Fixes `TRTreeNav` treating a focused control inside a row as a focused row. A
  row read `Focus.onFocusChange`, which reports `hasFocus`, so a trailing button
  or `TRMenu` trigger lit the whole row's focus ring and hover surface. Adding
  that ring inserted a foreground `DecoratedBox` into the row, which re-inflated
  the row's subtree and discarded the gesture recognizer of the control being
  pressed, so the first press on a trailing menu trigger was swallowed and the
  menu only opened on the second press. A row now takes the focus surface only
  while it holds the primary focus itself.

## 0.29.0

- Adds `TRContextMenu.items` and `TRContextMenu.itemsBuilder`, which describe a
  context menu as `TRMenuElement`s — `TRMenuActionElement`,
  `TRMenuSeparatorElement`, and `TRMenuSubmenuElement` — rather than as widgets.
  An operating-system menu cannot host a Flutter widget, so a menu that may be
  drawn by the platform has to be data. The Flutter presentation renders the
  same model with `TRMenuItem`, `TRMenuSeparator`, `TRMenuCheckboxItem`, and
  `TRMenuSubmenu`, and is pixel-identical to the previous rendering. The widget
  constructor is unchanged.
- Adds `TRContextMenuPresenter`, `TRContextMenuPresenterScope`,
  `TRFlutterContextMenuPresenter`, `TRContextMenuController`, and
  `TRContextMenuHost`. `TRContextMenu` keeps ownership of the gesture contract —
  secondary tap, touch or stylus long press, the context-menu key, and
  `Shift+F10` — and the installed presenter decides how the menu appears.
  Nothing installed means the Flutter presentation, exactly as before, including
  its Escape and press-on-child dismissal.
- Adds `TRNativeContextMenuPresenter`, which hands a described menu to GTK on
  Linux, Win32 on Windows, and AppKit on macOS through the new
  `net.tinyrack.ui/native_menu` channel. The menu then carries the platform's
  own appearance, keyboard navigation, and accessibility, and can paint outside
  the window. `tinyrack_ui` is a Flutter plugin on those three desktop
  platforms as a result; mobile and web declare no platform entry and build
  nothing. A system menu takes a platform bitmap rather than an `IconData`, so
  `TRMenuActionElement.icon` is dropped there, and the system owns dismissal, so
  `TRContextMenuController.close` does nothing once a native menu is up.
  Anything the platform cannot present falls back to the Flutter presentation,
  including a desktop build whose embedder never registered the plugin.
- Adds `TRTerminalView.contextMenuItems`, the described counterpart of
  `contextMenuBuilder`. The terminal consumes secondary taps itself, so it keeps
  opening the menu through a controller; that controller is now a
  `TRContextMenuController`, which reaches whichever presentation is installed.

## 0.28.0

- Publishes `TRMenu.label`, the accessible name given to an icon trigger. It
  was private, so a caller that rendered one could not identify it by the name
  it had just supplied — the asymmetry with `TRIconButton.label` pushed
  consumers into reading the rendered semantics tree instead, which also
  matches every `TRIconButton`, because those name themselves the same way. The
  field is null for a text trigger, which names itself.

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
