import 'package:flutter_test/flutter_test.dart';
import 'package:material_ui/material_ui.dart';
import 'package:tinyrack_ui/tinyrack_ui.dart';

void main() {
  testWidgets('small text fields keep the full inline control padding', (
    tester,
  ) async {
    await tester.pumpWidget(
      MaterialApp(
        theme: TinyrackTheme.light(),
        home: const Scaffold(body: TRTextField(uiSize: TRUiSize.sm)),
      ),
    );

    final decorator = tester.widget<InputDecorator>(
      find.byType(InputDecorator),
    );
    final padding = decorator.decoration.contentPadding! as EdgeInsets;
    expect(padding.left, TRSpacing.small);
    expect(padding.right, TRSpacing.small);
  });
}
