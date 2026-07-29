import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:tinyrack_ui/tinyrack_ui.dart';

void main() {
  testWidgets('core components preserve their light theme appearance', (
    tester,
  ) async {
    await tester.binding.setSurfaceSize(const Size(480, 320));
    addTearDown(() => tester.binding.setSurfaceSize(null));

    await tester.pumpWidget(
      MaterialApp(
        debugShowCheckedModeBanner: false,
        theme: TinyrackTheme.light(),
        home: const Scaffold(
          body: Padding(
            padding: EdgeInsets.all(24),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                TRText('Rack status', role: TRTextStyle.headingMd),
                SizedBox(height: 16),
                TRAlert(
                  intent: TRIntent.success,
                  title: Text('Changes saved'),
                  description: Text('The rack configuration is up to date.'),
                ),
                SizedBox(height: 16),
                Row(
                  children: [
                    TRBadge(intent: TRIntent.success, child: Text('Healthy')),
                    SizedBox(width: 12),
                    TRButton(onPressed: null, child: Text('Deploy')),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );

    await expectLater(
      find.byType(MaterialApp),
      matchesGoldenFile('goldens/core-components-light.png'),
    );
  });
}
