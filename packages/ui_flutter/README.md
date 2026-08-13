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

`TRSelectSurface.auto` follows the same semantic density: standard density
opens an anchored dropdown and comfortable density opens a bottom sheet. A
select outside `TRUiDensityScope` falls back to `TRBreakpoints.small`, preserving
the viewport-responsive default for standalone consumers. Searchable dropdowns
can grow wider than a narrow trigger, while adaptive sheets fit short option
lists and keep only long option regions scrollable. Sheet option padding,
typography, and icons follow the resolved density. Their touch targets remain
at least 48 logical pixels tall even when the trigger uses compact metrics.
Trackpad and wheel input over a fixed sheet search field continues scrolling
the options. A downward drag returns to the drawer only after the option list
reaches its leading edge.

Top and bottom `TRDrawer` surfaces show a drag-to-dismiss handle by default.
Set `showDragHandle: false` when a sheet must not advertise or accept that drag
gesture. Side drawers never show the handle.

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

Use `TRNavigableThreePaneScaffold` for a hierarchical navigation surface that
must adapt across phones, tablets, and desktop windows. Its width classes use
the canonical 600, 840, 1200, and 1600 logical-pixel boundaries. Compact
windows show the active destination, medium and expanded windows keep
navigation beside the active destination, and large windows can show all three
roles:

```dart
final navigator = TRThreePaneNavigator<String>(
  initialDestination: const TRPaneDestination(
    role: TRPaneRole.navigation,
    value: 'navigation',
  ),
);

TRNavigableThreePaneScaffold<String>(
  navigator: navigator,
  navigationPane: const WorkspaceNavigation(),
  primaryPane: const WorkspaceCollection(),
  secondaryPane: const WorkspaceDetail(),
)
```

`TRThreePaneNavigator.lastChange` distinguishes `push`, `replace`, `pop`, and
`reset`. Push and pop move in opposite logical directions, replace crossfades
content in the current pane role, and reset settles without entry motion. The
scaffold handles Android predictive Back when an earlier destination changes
what the current width class displays. Use
`popUntilScaffoldValueChange` for a visible Back button so touch, keyboard, and
system Back share the same rule. On a three-pane desktop layout, every available
role is already visible and Back continues to the enclosing route.

Compose navigation content with `TRNavigationPane` and
`TRNavigationSection`; use `TRTreeNav` inside each section so selection,
hover, press, keyboard, and semantics behavior remains shared. Their default
block rhythm follows `TRUiDensityScope`, while an explicit navigation-pane
padding still wins. Use `TRPaneHeader` to keep pane titles, descriptions,
leading navigation, actions, and the body divider aligned. When a pane body
uses a centred readable-width cap, pass the same `contentMaxWidth` to keep the
header identity and actions on that rail while its divider stays full width.
Pane contents can
read the scaffold decision from `TRAdaptivePaneScope` without classifying their
own local width:

```dart
Builder(
  builder: (context) {
    final pane = TRAdaptivePaneScope.of(context);
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
            showSelection: pane.visibleRoles.contains(TRPaneRole.secondary),
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
