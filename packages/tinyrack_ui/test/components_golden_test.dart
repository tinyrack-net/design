import 'dart:typed_data';

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:tinyrack_ui/tinyrack_ui.dart';

const _goldenPrecisionTolerance = 0.005;

void main() {
  test(
    'golden tolerance accepts platform drift but rejects visual changes',
    () {
      expect(
        _isWithinGoldenTolerance(
          diffPercent: 0.0042,
          precisionTolerance: _goldenPrecisionTolerance,
        ),
        isTrue,
      );
      expect(
        _isWithinGoldenTolerance(
          diffPercent: 0.0051,
          precisionTolerance: _goldenPrecisionTolerance,
        ),
        isFalse,
      );
    },
  );

  testWidgets('core components preserve their light theme appearance', (
    tester,
  ) async {
    final previousGoldenFileComparator = goldenFileComparator;
    goldenFileComparator = _TolerantGoldenFileComparator(
      Uri.parse('test/components_golden_test.dart'),
      precisionTolerance: _goldenPrecisionTolerance,
    );
    addTearDown(() => goldenFileComparator = previousGoldenFileComparator);

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
                TRText('Rack status', variant: TRTextVariant.headingMd),
                SizedBox(height: 16),
                TRAlert(
                  variant: TRStatusVariant.success,
                  title: Text('Changes saved'),
                  description: Text('The rack configuration is up to date.'),
                ),
                SizedBox(height: 16),
                Row(
                  children: [
                    TRBadge(
                      variant: TRStatusVariant.success,
                      child: Text('Healthy'),
                    ),
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

bool _isWithinGoldenTolerance({
  required double diffPercent,
  required double precisionTolerance,
}) => diffPercent <= precisionTolerance;

class _TolerantGoldenFileComparator extends LocalFileComparator {
  _TolerantGoldenFileComparator(
    super.testFile, {
    required double precisionTolerance,
  }) : assert(
         0 <= precisionTolerance && precisionTolerance <= 1,
         'precisionTolerance must be between 0 and 1',
       ),
       _precisionTolerance = precisionTolerance;

  final double _precisionTolerance;

  @override
  Future<bool> compare(Uint8List imageBytes, Uri golden) async {
    final result = await GoldenFileComparator.compareLists(
      imageBytes,
      await getGoldenBytes(golden),
    );

    final passed =
        result.passed ||
        _isWithinGoldenTolerance(
          diffPercent: result.diffPercent,
          precisionTolerance: _precisionTolerance,
        );
    if (passed) {
      result.dispose();
      return true;
    }

    final error = await generateFailureOutput(result, golden, basedir);
    result.dispose();
    throw FlutterError(error);
  }
}
