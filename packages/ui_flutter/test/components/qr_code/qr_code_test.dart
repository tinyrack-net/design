import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:tinyrack_ui/tinyrack_ui.dart';

void main() {
  testWidgets('renders accessible exact-size QR variants', (tester) async {
    final semantics = tester.ensureSemantics();
    await tester.pumpWidget(
      MaterialApp(
        theme: TinyrackTheme.light(),
        home: const Scaffold(
          body: TRQrCode(
            data: 'https://coder.tinyrack.net/pair#offer=test',
            semanticLabel: 'Pair this daemon',
            uiSize: TRUiSize.sm,
          ),
        ),
      ),
    );

    expect(find.bySemanticsLabel('Pair this daemon'), findsOneWidget);
    expect(tester.getSize(find.byType(TRQrCode)), const Size.square(128));
    semantics.dispose();
  });

  testWidgets('supports large high-contrast presentation', (tester) async {
    await tester.pumpWidget(
      MediaQuery(
        data: const MediaQueryData(highContrast: true),
        child: MaterialApp(
          theme: TinyrackTheme.dark(),
          home: const Scaffold(
            body: TRQrCode(
              data: 'pairing-data',
              semanticLabel: 'Pairing code',
              uiSize: TRUiSize.lg,
            ),
          ),
        ),
      ),
    );

    expect(tester.getSize(find.byType(TRQrCode)), const Size.square(256));
    expect(find.byType(CustomPaint), findsWidgets);
  });
}
