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

Products can choose a larger default for interactive controls without scaling
typography or display components. Decide the responsive condition in the
product, then wrap the affected subtree:

```dart
TRControlDensityScope(
  density: narrow
      ? TRControlDensity.comfortable
      : TRControlDensity.standard,
  child: const App(),
)
```

Controls that omit `uiSize` use `md` in standard density and `lg` in
comfortable density. An explicit `uiSize` always wins, so compact title-bar
actions can remain `TRUiSize.sm` inside a comfortable subtree.

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
muted secondary line. `TRWindowFrameTitleBar` takes any widget in its `leading`
and `actions` slots, so window commands are composed from `TRIconButton`.

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
