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

The package bundles 11 IBM Plex Sans, Mono, Korean, and Japanese font files.
They total about 16.4 MB before platform packaging and are included in a
consumer application's Flutter asset bundle, so no runtime font download is
required. The fonts are distributed under the SIL Open Font License. See
`assets/fonts/OFL.txt`.

Terminal emulation lives in the style-neutral `termworld` package at
`tinyrack-net/flutter-packages/packages/termworld`. Products compose its
`TerminalView` with public Tinyrack tokens and components; `tinyrack_ui` does
not ship a terminal engine or compatibility adapter.

## React parity migration

The Flutter component variants use the same names and value sets as the
canonical React components.

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

From the repository root, verify every shared variant in light and dark themes
and English, Korean, and Japanese with:

```sh
pnpm --filter @tinyrack/homepage test:visual-parity
```

The command builds isolated 480 × 320 React and Flutter fixtures, requires
every measured edge, baseline, and internal spacing delta to stay below one CSS
pixel, and exercises hover, pointer press and release, keyboard focus and
activation, disabled, loading, readonly, and invalid states. Motion checks
sample the shared 120 ms transition at 0, 30, 60, 90, 120, and 140 ms. Failures
write React, Flutter, diff, full-screen, interaction telemetry, and geometry
artifacts under `packages/homepage/test-results/visual-parity`.
