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
