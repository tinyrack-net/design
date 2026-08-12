# Tinyrack UI for Flutter

Tinyrack UI provides Material 3 themes, shared design tokens, and accessible
Flutter widgets for Android, iOS, Linux, macOS, web, and Windows.

Component-owned glyphs use Lucide. Application-supplied icons should use the
same `lucide_flutter` package so stroke weight and geometry stay consistent.

```dart
import 'package:flutter/material.dart';
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

Compose navigation content with `TRNavigationPane` and
`TRNavigationSection`; use `TRTreeNav` inside each section so selection,
hover, press, keyboard, and semantics behavior remains shared.

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
