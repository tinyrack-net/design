# Tinyrack UI for Flutter

Tinyrack UI provides Material 3 themes, shared design tokens, and accessible
Flutter widgets for Android, iOS, Linux, macOS, web, and Windows.

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
`TRTextField`.

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
