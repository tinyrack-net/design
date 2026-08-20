# Tinyrack UI for Flutter

Tinyrack UI provides Material 3 themes, shared design tokens, and accessible
Flutter widgets for Android, iOS, Linux, macOS, web, and Windows.

Component-owned glyphs use Lucide. Application-supplied icons should use the
same `lucide_flutter` package so stroke weight and geometry stay consistent.

Applications that use the Material app and widget APIs shown below must add the
standalone package directly:

```sh
flutter pub add material_ui
```

```dart
import 'package:material_ui/material_ui.dart';
import 'package:tinyrack_ui/tinyrack_ui.dart';

MaterialApp(
  theme: TinyrackTheme.light(),
  darkTheme: TinyrackTheme.dark(),
  home: Scaffold(
    body: Center(
      child: TRButton(
        intent: TRIntent.primary,
        onPressed: deploy,
        child: const Text('Deploy'),
      ),
    ),
  ),
);
```

Products can choose a more readable interface scale for narrow or touch-first
surfaces. Decide the responsive condition in the product, then wrap the
affected subtree:

```dart
TRUiDensityScope(
  density: narrow
      ? TRUiDensity.comfortable
      : TRUiDensity.standard,
  child: const App(),
)
```

Comfortable density uses 48-pixel `xl` controls, advances typography by one
semantic step, and enlarges default card padding and status indicators.
Explicit `uiSize` and card padding always win, so compact title-bar actions can
remain `TRUiSize.sm` inside a comfortable subtree.

Flutter-rendered popup rows follow the same scope independently from their
anchor: standard density uses `TRUiSize.sm` row metrics (28-pixel height and
12-pixel labels), while comfortable density uses `TRUiSize.lg` row metrics
(40-pixel height and 14-pixel labels). This applies to menus and submenus,
menubars, Flutter context menus, selects, autocompletes, comboboxes, and inline
suggestions, including root-overlay layers. `TRMenu.uiSize` still sizes only the
trigger. Wrap a specific popup anchor in a nested standard scope when its rows
must remain compact.

`TRSelect` leaves the responsive presentation decision to the product. Pass a
typed layer or sheet presentation, and resolve that value from the same
application-owned width policy used by the surrounding layout:

```dart
final widthClass = TRAdaptiveWidthClass.fromWidth(
  MediaQuery.sizeOf(context).width,
);
final presentation = widthClass == TRAdaptiveWidthClass.compact
    ? const TRSelectPresentation.sheet(maxExtent: 0.7)
    : const TRSelectPresentation.layer(
        width: TRLayerWidth.atLeastAnchor(
          max: TRMeasurements.overlayWidthSm,
        ),
      );

TRSelect<String>(
  items: channels,
  presentation: presentation,
);
```

A Select can also stand in for a value inside a row that already supplies its
own inline inset, such as a settings list or a toolbar. Pair
`TRFieldAppearance.ghost` with `TRFieldPadding.none` and leave `width` unset:
the trigger then shrinks to the value it shows and draws that value and its
chevron against its own edges, so it lines up with a switch or a badge in a
neighbouring row instead of stopping an inset short of them. It keeps the
height its size scale defines, so the hit target is unchanged.

```dart
TRSelect<ThemeMode>.controlled(
  items: modes,
  value: mode,
  appearance: TRFieldAppearance.ghost,
  padding: TRFieldPadding.none,
  onValueChange: onModeChanged,
);
```

The presentation is captured when the Select opens, so resizing cannot replace
an active layer with a sheet. Searchable anchored layers capture their full,
unfiltered intrinsic size, while sheets capture their full-list height and keep
tracking the viewport width. Those values stay stable until close; an explicit
fixed width or height remains authoritative. The search field and separator stay
outside the single scrollable options viewport; wheel, trackpad, and drag input
over the search field does not move the list or the sheet. Sheet option padding,
typography, and icons still follow the resolved density, and touch targets
remain at least 48 logical pixels tall.

Use `TRLayerSize` for caller-sized anchored layers. Width can follow content,
use a fixed value, match the anchor, or stay at least as wide as the anchor.
Height can follow content or use a fixed value. Content policies accept minimum
and maximum bounds. The policy describes the complete layer, including its
border and padding, and the safe viewport remains the final hard cap for every
mode:

```dart
const contentSized = TRLayerSize(
  width: TRLayerWidth.content(
    min: TRMeasurements.measureMd,
    max: TRMeasurements.overlayWidthSm,
  ),
  height: TRLayerHeight.content(max: TRMeasurements.measureXl),
);
const fixed = TRLayerSize(
  width: TRLayerWidth.fixed(TRMeasurements.measureLg),
  height: TRLayerHeight.fixed(TRMeasurements.measureSm),
);
const anchorMatched = TRLayerSize(
  width: TRLayerWidth.matchAnchor(
    min: TRMeasurements.measureMd,
    max: TRMeasurements.overlayWidthSm,
  ),
);
const anchorMinimum = TRLayerSize(
  width: TRLayerWidth.atLeastAnchor(
    min: TRMeasurements.measureMd,
    max: TRMeasurements.overlayWidthSm,
  ),
);
```

`atLeastAnchor` lets content grow from the anchor width. If the anchor itself
is wider than `max`, the anchor still wins unless the safe viewport is smaller.

`TRSelectPresentation.layer` takes the two axes as separate `width` and `height`
arguments rather than one `TRLayerSize`, each defaulting on its own. Stating a
fixed popup width therefore keeps the height cap, instead of silently letting
the option list grow to the viewport. Read the pair back as one policy through
`TRSelectLayerPresentation.layerSize`.

The shared policy is available on these anchored surfaces:

| Component | Default layer size |
| --- | --- |
| `TRSelectPresentation.layer` | At least the anchor and `TRMeasurements.measureMd`; content may grow through `TRMeasurements.overlayWidthSm`, while a wider anchor still wins; content height up to `TRMeasurements.measureXl` |
| `TRAutocomplete`, `TRAutocompleteFormField` | Match the anchor; content height up to `TRMeasurements.measureXl` |
| `TRCombobox`, `TRMultiCombobox`, and their FormField variants | Match the anchor; content height up to `TRMeasurements.measureXl` |
| `TRInlineSuggestions` | Match the anchor; content height up to `TRMeasurements.measureXl` |
| `TRMenu`, `TRMenuSubmenu` | Content width from `TRMeasurements.measureMd` through `TRMeasurements.overlayWidthSm + TRSpacing.twoExtraLarge`; content height up to `TRMeasurements.measureXl` |
| `TRNavigationMenu` | Fixed navigation-panel width token; content height |
| `TRPopover`, `TRPreviewCard` | Fixed `TRMeasurements.overlayWidthSm`; content height |

Top and bottom `TRDrawer` surfaces show a drag-to-dismiss handle by default.
Set `showDragHandle: false` when a sheet must not advertise or accept that drag
gesture. Side drawers never show the handle.

`TRDrawerDragBehavior.surface` is the default. A top or bottom drawer without
`snapPoints` keeps its intrinsic height. Upward drags scroll overflow content
without lifting the sheet, while downward drags return the content to its
leading edge before dismissing the sheet. Supplying `snapPoints` opts into
viewport-relative expansion: the sheet expands first, then scrolls its content
at the largest snap point. The reverse drag scrolls back to the leading edge
before collapsing the sheet. These transitions happen within one continuous
gesture from the header or content region.

Use `TRDrawerDragBehavior.handleOnly` when the drawer content owns a dedicated
scroll viewport. Only the visible handle then resizes, snaps, or dismisses the
drawer; gestures that start on the content stay with the content. Pair it with
`scrollContent: false` when the content contains a fixed header and its own
scrolling region. Side drawers have no handle and continue to use their complete
surface.

Use `TRSplitView` when two application-owned surfaces need a controlled,
resizable boundary. The caller owns the ratio and decides when a responsive
layout should render the split:

```dart
TRSplitView(
  axis: Axis.horizontal,
  ratio: ratio,
  separatorLabel: 'Resize editor panes',
  onRatioChanged: (value) => setState(() => ratio = value),
  onRatioChangeEnd: saveRatio,
  first: const EditorPane(),
  second: const PreviewPane(),
)
```

Compose `TRAdaptiveNavigationLayout` and `TRAdaptiveListDetailLayout` around a
routed application surface. Their width classes use the canonical 600, 840,
1200, and 1600 logical-pixel boundaries. Compact windows show only content,
medium and expanded windows keep navigation beside one content surface, and
large windows keep navigation and collection fixed beside detail:

```dart
final contentNavigator = Navigator(
  key: contentNavigatorKey,
  pages: contentPages,
  onDidRemovePage: handleRemovedPage,
);

TRAdaptiveNavigationLayout(
  navigationPane: const WorkspaceNavigation(),
  contentPane: TRAdaptiveListDetailLayout(
    singlePane: contentNavigator,
    collectionPane: const WorkspaceCollection(),
    detailPane: contentNavigator,
  ),
)
```

Both layouts are state-free. Keep destination history in `Navigator` and
`Page`, where system Back, Android predictive Back, interrupted transitions,
and reduced motion use Flutter's Material route lifecycle. Pass the same keyed
content Navigator as `singlePane` and `detailPane` when its state must survive a
breakpoint change. Use `TRPageTransitionsBuilder.none()` on a fixed routed
region that needs Page identity without entry or exit motion.

Compose navigation content with `TRNavigationPane` and
`TRNavigationSection`; use `TRTreeNav` inside each section so selection,
hover, press, keyboard, and semantics behavior remains shared. Their default
block rhythm follows `TRUiDensityScope`, while an explicit navigation-pane
padding still wins. Use `TRPaneHeader` to keep pane titles, descriptions,
leading navigation, actions, and the body divider aligned. It rests at
`TRMeasurements.headerHeight`, the same height `TRAppShellHeader` uses, so a
header stacked above another and two headers sitting side by side line up
whether or not either carries an action. Both take one `TRSpacing.large` step
under comfortable density, where a control is exactly the standard resting
height and would otherwise fill the bar edge to edge. The height is a floor
rather than a fixed box: a description, a wrapped title, or an enlarged text
scale grows the header instead of being clipped. When a pane body uses a
centred readable-width cap, pass the same `contentMaxWidth` to keep the header
identity and actions on that rail while its divider stays full width.
Pane contents can read the complete viewport decision from
`TRAdaptiveLayoutScope` without classifying the smaller width left after fixed
panes are placed:

```dart
Builder(
  builder: (context) {
    final layout = TRAdaptiveLayoutScope.of(context);
    return Column(
      children: [
        TRPaneHeader(
          contentMaxWidth: 640,
          leading: backButton,
          title: const Text('Projects'),
          description: Text('${projects.length} projects'),
          actions: [createButton],
        ),
        Expanded(
          child: ProjectCollection(
          showSelection: switch (layout.widthClass) {
            TRAdaptiveWidthClass.large ||
            TRAdaptiveWidthClass.extraLarge => true,
            _ => false,
          },
          ),
        ),
      ],
    );
  },
)
```

Use `TRVirtualList` for a large bounded linear collection whose items can be
inserted, removed, reordered, or resized. Stable keys keep one visible item at
the same viewport-relative coordinate. A trailing-follow list stays pinned only
while the reader is already at the trailing edge, so streaming content does not
move a scrolled-up viewport:

```dart
TRVirtualList<Message, String>(
  items: messages,
  itemKey: (message) => message.id,
  estimatedItemExtent: (message, index) => TRMeasurements.measureSm,
  initialPosition: const TRVirtualListInitialPosition.trailing(),
  follow: TRVirtualListFollow.trailing,
  itemBuilder: (context, message, index) => MessageRow(message),
)
```

The list owns its bounded viewport and lazily mounts only the visible and cached
range. Use `TRScrollArea` for ordinary non-virtual content, and use non-virtual
rendering when full-document search, print, selection, or assistive virtual-
cursor access must include every offscreen item.

`TRTabs` composes one full-width tab strip from optional capabilities. Provide
`panelBuilder` when the component should draw the active panel, add `onClose`
to individual tabs when they can close, and pass `TRTabsDragConfiguration` to
move tabs within or between application-owned groups. The drop callback
receives both strip identities and the destination insertion index; tab
ownership and persistence remain application state.

Use `tabWidth: TRTabsWidth.fixed` when each document tab should keep the
`TRMeasurements.measureSm` width and the strip should scroll once the tabs no
longer fit. The default `TRTabsWidth.fill` policy divides the available strip
between its tabs.

The package bundles 11 IBM Plex Sans, Mono, Korean, and Japanese font files.
They total about 16.4 MB before platform packaging and are included in a
consumer application's Flutter asset bundle, so no runtime font download is
required. The fonts are distributed under the SIL Open Font License. See
`assets/fonts/OFL.txt`.

Terminal emulation lives in the style-neutral `termworld` package at
`tinyrack-net/flutter-packages/packages/termworld`. Products compose its
`TerminalView` with public Tinyrack tokens and components; `tinyrack_ui` does
not ship a terminal engine or compatibility adapter.

## Enforce the design system in an application

Run the package-owned analyzer check from the application root:

```sh
dart run tinyrack_ui:tinyrack_ui_check --root .
```

The checker scans `lib/**` by default and rejects private `tinyrack_ui` imports,
Flutter Material or Cupertino APIs with public Tinyrack equivalents, framework
icons and theme values, visual expressions containing arbitrary literals, and
applications that omit either `TinyrackTheme.light()` or
`TinyrackTheme.dark()`. It follows resolved declarations, so import prefixes and
named constructors are covered while unrelated local symbols with the same name
are not.

Configure monorepo source roots with `tinyrack.check.json`:

```json
{
  "include": ["packages/app/lib/**"]
}
```

Structural values that cannot be expressed by a public token require a narrow,
reasoned suppression immediately above the expression:

```dart
// tinyrack-check-ignore-next-line tokens/no-literal -- viewport-owned split ratio
final width = constraints.maxWidth * 0.7;
```

## Cross-platform component contract

React and Flutter share semantic tokens and component purposes where both
platforms provide the same concept. They do not promise identical public APIs,
anatomy, interaction details, or rendered pixels. Platform-specific components
and adaptations are explicit repository contracts rather than parity exceptions.

| Before | Now |
| --- | --- |
| `TRAlert.intent`, `TRBadge.intent` | `variant: TRStatusVariant.*` |
| `TRIconButton` without visual or loading options | `appearance`, `loading`, and `loadingLabel` |
| Free-form `TRCard.padding` | `TRCardPadding` plus `TRCardVariant` |
| One-piece card content | `TRCardHeader`, `TRCardTitle`, `TRCardDescription`, `TRCardContent`, and `TRCardFooter` |
| Spinner inherited color only | `variant: TRSpinnerVariant.*` |
| `TRText.role`, `TRTextStyle`, and arbitrary `Color` | `variant: TRTextVariant.*` plus typed `color`, `align`, `weight`, and `truncate` |

Flutter-only editing and Form lifecycle properties remain available on
`TRTextField`, including secure single-line fields and bounded multiline
editors through `obscureText`, `minLines`, and `maxLines`.

`TRTreeNavGroup` and `TRTreeNavLeaf` accept an optional `description` for a
muted secondary line and an optional `key` that identifies the rendered row.
Set `TRTreeNavLeaf.showDisclosureIndicator` when a leaf opens a deeper surface;
existing leaves omit the indicator by default. Use `TRNavigationRow` for a
standalone destination instead of constructing a one-item tree. It adds a
direction-aware disclosure indicator whenever the row is actionable and keeps
trailing controls ahead of that indicator.

Navigation rows use `TRSpacing.small` above and below their content at every UI
size. `TRTreeNav.uiSize` and `TRNavigationRow.uiSize` override row scale; when
omitted, both follow `TRUiDensityScope`. Standard density preserves the 40
logical pixel minimum for one-line leaf rows, while two-line rows grow with the
shared vertical padding. Comfortable density provides larger labels,
descriptions, and inherited icons.
`TRWindowFrameTitleBar` takes any widget in its `leading` and `actions` slots,
so window commands are composed from `TRIconButton`.

`TRChatToolDisclosure` accepts an optional `secondaryLabel` for the concrete
activity after its action label. A running disclosure or `TRChatStatusRow`
shimmers its visible text while keeping the localized status in semantics;
reduced-motion environments render the same text without animation.

From the repository root, verify the cross-platform inventory and each
platform's own behavior and rendering baselines with:

```sh
pnpm scripts:check
pnpm --filter @tinyrack/ui test:e2e
pnpm flutter:test
```

The inventory check requires every public component to resolve to a shared
purpose, an explicit adaptation, or a platform-only capability. React browser
tests and Flutter widget and golden tests then enforce the behavior and visual
contract of their own rendering engines.
