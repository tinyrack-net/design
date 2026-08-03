import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:tinyrack_ui/src/generated/tokens.g.dart';
import 'package:tinyrack_ui/tinyrack_ui.dart';

Widget _wrapNarrow(Widget child, {double width = 240}) => MaterialApp(
  theme: TinyrackTheme.light(),
  home: Scaffold(
    body: Align(
      alignment: Alignment.topLeft,
      child: ConstrainedBox(
        constraints: BoxConstraints(maxWidth: width),
        child: child,
      ),
    ),
  ),
);

void main() {
  test('light and dark themes expose semantic extensions', () {
    final light = TinyrackTheme.light().extension<TinyrackThemeData>()!;
    final dark = TinyrackTheme.dark().extension<TinyrackThemeData>()!;

    expect(light.surface, isNot(dark.surface));
    expect(light.foregroundFor(TRIntent.danger), light.danger);
    expect(dark.surfaceFor(TRIntent.info), dark.infoSurface);
    expect(
      TinyrackTheme.light().textTheme.bodyMedium?.fontFamily,
      'packages/tinyrack_ui/IBMPlexSans',
    );
    expect(
      TinyrackTheme.light().textTheme.bodyMedium?.fontFamily,
      isNot(contains('packages/tinyrack_ui/packages/tinyrack_ui')),
    );
  });

  testWidgets('button reports loading semantics and prevents activation', (
    tester,
  ) async {
    var presses = 0;
    await tester.pumpWidget(
      MaterialApp(
        theme: TinyrackTheme.light(),
        home: Scaffold(
          body: TRButton(
            loading: true,
            loadingLabel: 'Deploying',
            onPressed: () => presses += 1,
            child: const Text('Deploy'),
          ),
        ),
      ),
    );

    expect(find.bySemanticsLabel('Deploying'), findsOneWidget);
    final button = tester.widget<FilledButton>(find.byType(FilledButton));
    final enabledBackground = button.style?.backgroundColor?.resolve({});
    final disabledBackground = button.style?.backgroundColor?.resolve({
      WidgetState.disabled,
    });
    expect(disabledBackground, enabledBackground);
    expect(find.byType(TRSpinner), findsOneWidget);
    expect(
      tester
          .widget<AnimatedOpacity>(
            find.descendant(
              of: find.byType(TRButton),
              matching: find.byType(AnimatedOpacity),
            ),
          )
          .opacity,
      0.5,
    );
    await tester.tap(find.byType(TRButton));
    expect(presses, 0);
  });

  testWidgets('disabled outline and ghost buttons keep transparent fills', (
    tester,
  ) async {
    await tester.pumpWidget(
      MaterialApp(
        theme: TinyrackTheme.light(),
        home: const Scaffold(
          body: Column(
            children: [
              TRButton(
                appearance: TRAppearance.outline,
                onPressed: null,
                child: Text('Outline'),
              ),
              TRButton(
                appearance: TRAppearance.ghost,
                onPressed: null,
                child: Text('Ghost'),
              ),
            ],
          ),
        ),
      ),
    );

    for (final button in [
      tester.widget<OutlinedButton>(find.byType(OutlinedButton)),
      tester.widget<TextButton>(find.byType(TextButton)),
    ]) {
      expect(
        button.style?.backgroundColor?.resolve({WidgetState.disabled})?.a,
        0,
      );
    }
  });

  testWidgets('neutral outline and ghost buttons use muted foreground', (
    tester,
  ) async {
    final theme = TinyrackTheme.dark();
    final textMuted = theme.extension<TinyrackThemeData>()!.textMuted;
    await tester.pumpWidget(
      MaterialApp(
        theme: theme,
        home: Scaffold(
          body: Column(
            children: [
              TRButton(
                appearance: TRAppearance.outline,
                onPressed: () {},
                child: const Text('Outline'),
              ),
              TRButton(
                appearance: TRAppearance.ghost,
                onPressed: () {},
                child: const Text('Ghost'),
              ),
            ],
          ),
        ),
      ),
    );

    expect(
      tester
          .widget<OutlinedButton>(find.byType(OutlinedButton))
          .style
          ?.foregroundColor
          ?.resolve({}),
      textMuted,
    );
    expect(
      tester
          .widget<TextButton>(find.byType(TextButton))
          .style
          ?.foregroundColor
          ?.resolve({}),
      textMuted,
    );
  });

  testWidgets('button activates Space on key release', (tester) async {
    final focusNode = FocusNode();
    addTearDown(focusNode.dispose);
    var presses = 0;
    await tester.pumpWidget(
      MaterialApp(
        theme: TinyrackTheme.light(),
        home: Scaffold(
          body: TRButton(
            focusNode: focusNode,
            onPressed: () => presses += 1,
            child: const Text('Deploy'),
          ),
        ),
      ),
    );

    focusNode.requestFocus();
    await tester.pump();
    await tester.sendKeyDownEvent(LogicalKeyboardKey.space);
    await tester.pump();
    expect(presses, 0);
    final interactionTransforms = tester.widgetList<Transform>(
      find.descendant(
        of: find.byType(TRButton),
        matching: find.byType(Transform),
      ),
    );
    expect(
      interactionTransforms.any((widget) => widget.transform.storage[13] == 1),
      isTrue,
    );

    await tester.sendKeyUpEvent(LogicalKeyboardKey.space);
    await tester.pump();
    expect(presses, 1);
  });

  testWidgets('text field preserves editing callbacks', (tester) async {
    final controller = TextEditingController(text: 'Rack alpha');
    addTearDown(controller.dispose);
    var value = '';
    await tester.pumpWidget(
      MaterialApp(
        theme: TinyrackTheme.light(),
        home: Scaffold(
          body: TRTextField(
            controller: controller,
            label: 'Name',
            onChanged: (next) => value = next,
          ),
        ),
      ),
    );

    expect(find.text('Rack alpha'), findsOneWidget);
    await tester.enterText(find.byType(TextField), 'Rack beta');
    expect(value, 'Rack beta');
  });

  testWidgets('text field participates in form validation, save, and reset', (
    tester,
  ) async {
    final formKey = GlobalKey<FormState>();
    String? savedValue;
    var resets = 0;
    await tester.pumpWidget(
      MaterialApp(
        theme: TinyrackTheme.light(),
        home: Scaffold(
          body: Form(
            key: formKey,
            child: TRTextField(
              autovalidateMode: AutovalidateMode.disabled,
              initialValue: 'Rack alpha',
              onReset: () => resets += 1,
              onSaved: (value) => savedValue = value,
              restorationId: 'rack-name',
              validator: (value) =>
                  value == null || value.isEmpty ? 'Name is required' : null,
            ),
          ),
        ),
      ),
    );

    await tester.enterText(find.byType(TextField), '');
    expect(formKey.currentState!.validate(), isFalse);
    await tester.pump();
    expect(find.text('Name is required'), findsOneWidget);

    await tester.enterText(find.byType(TextField), 'Rack beta');
    expect(formKey.currentState!.validate(), isTrue);
    formKey.currentState!.save();
    expect(savedValue, 'Rack beta');

    formKey.currentState!.reset();
    await tester.pump();
    expect(resets, 1);
    expect(find.text('Rack alpha'), findsOneWidget);
  });

  test('text field rejects controller and initial value together', () {
    final controller = TextEditingController();
    addTearDown(controller.dispose);

    expect(
      () => TRTextField(controller: controller, initialValue: 'Rack alpha'),
      throwsAssertionError,
    );
  });

  testWidgets('alert announces non-neutral status', (tester) async {
    await tester.pumpWidget(
      MaterialApp(
        theme: TinyrackTheme.dark(),
        home: const Scaffold(
          body: TRAlert(
            variant: TRStatusVariant.success,
            title: Text('Saved'),
            description: Text('The rack was updated.'),
          ),
        ),
      ),
    );

    final semantics = tester.getSemantics(find.byType(TRAlert));
    expect(semantics.flagsCollection.isLiveRegion, isTrue);
  });

  testWidgets('status components expose only the React status variants', (
    tester,
  ) async {
    await tester.pumpWidget(
      MaterialApp(
        theme: TinyrackTheme.light(),
        home: const Scaffold(
          body: Column(
            children: [
              TRAlert(title: Text('Saved'), variant: TRStatusVariant.success),
              TRBadge(
                variant: TRStatusVariant.warning,
                child: Text('Attention'),
              ),
            ],
          ),
        ),
      ),
    );

    expect(TRStatusVariant.values.map((value) => value.name), [
      'neutral',
      'info',
      'success',
      'warning',
      'danger',
    ]);
    expect(find.byType(TRAlert), findsOneWidget);
    expect(find.byType(TRBadge), findsOneWidget);
  });

  testWidgets('card, spinner, icon button, and text expose parity variants', (
    tester,
  ) async {
    await tester.pumpWidget(
      MaterialApp(
        theme: TinyrackTheme.light(),
        home: Scaffold(
          body: Column(
            children: [
              const TRCard(
                padding: TRCardPadding.lg,
                variant: TRCardVariant.elevated,
                child: TRCardHeader(
                  children: [
                    TRCardTitle(child: Text('Rack alpha')),
                    TRCardDescription(child: Text('Healthy')),
                  ],
                ),
              ),
              const TRSpinner(variant: TRSpinnerVariant.primary),
              TRIconButton(
                appearance: TRAppearance.outline,
                icon: const Icon(Icons.add),
                label: 'Add rack',
                loading: true,
                onPressed: () {},
              ),
              const TRText(
                'Rack status',
                align: TRTextAlign.center,
                color: TRTextColor.muted,
                truncate: true,
                variant: TRTextVariant.headingMd,
                weight: TRTextWeight.strong,
              ),
            ],
          ),
        ),
      ),
    );

    expect(find.bySemanticsLabel('Add rack'), findsWidgets);
    expect(find.byType(TRSpinner), findsNWidgets(2));
    final text = tester.widget<Text>(find.text('Rack status'));
    expect(text.maxLines, 1);
    expect(text.overflow, TextOverflow.ellipsis);
    expect(text.textAlign, TextAlign.center);
  });

  testWidgets('horizontal separator spans the container width', (tester) async {
    await tester.pumpWidget(_wrapNarrow(const TRSeparator()));
    final size = tester.getSize(find.byType(TRSeparator));
    expect(size.width, 240);
    expect(size.height, 1);
  });

  testWidgets('vertical separator spans the given min length', (tester) async {
    await tester.pumpWidget(
      _wrapNarrow(
        const IntrinsicHeight(
          child: TRSeparator(
            orientation: TRSeparatorOrientation.vertical,
            minLength: 32,
          ),
        ),
      ),
    );
    final size = tester.getSize(find.byType(TRSeparator));
    expect(size.width, 1);
    expect(size.height, greaterThanOrEqualTo(32));
  });

  testWidgets('skeleton text shape fills the container width by default', (
    tester,
  ) async {
    await tester.pumpWidget(_wrapNarrow(const TRSkeleton()));
    final size = tester.getSize(find.byType(TRSkeleton));
    expect(size.width, 240);
    expect(size.height, 16);
  });

  testWidgets('skeleton rectangle shape uses the measure-xs block height', (
    tester,
  ) async {
    await tester.pumpWidget(
      _wrapNarrow(const TRSkeleton(shape: TRSkeletonShape.rectangle)),
    );
    final size = tester.getSize(find.byType(TRSkeleton));
    expect(size.width, 240);
    expect(size.height, 64);
  });

  testWidgets(
    'skeleton circle shape is square and ignores the width override',
    (tester) async {
      await tester.pumpWidget(
        _wrapNarrow(
          const TRSkeleton(shape: TRSkeletonShape.circle, width: 200),
        ),
      );
      final size = tester.getSize(find.byType(TRSkeleton));
      expect(size.width, size.height);
      expect(size.width, 48);
    },
  );

  testWidgets(
    'skeleton explicit width overrides the default fill for non-circle shapes',
    (tester) async {
      await tester.pumpWidget(_wrapNarrow(const TRSkeleton(width: 80)));
      final size = tester.getSize(find.byType(TRSkeleton));
      expect(size.width, 80);
    },
  );

  testWidgets('skeleton stops animating when animate is false', (tester) async {
    await tester.pumpWidget(_wrapNarrow(const TRSkeleton(animate: false)));
    await tester.pump(const Duration(seconds: 1));
    expect(find.byType(TRSkeleton), findsOneWidget);
  });

  testWidgets('skeleton honors reduced motion and keeps a stable frame', (
    tester,
  ) async {
    await tester.pumpWidget(
      _wrapNarrow(
        const MediaQuery(
          data: MediaQueryData(disableAnimations: true),
          child: TRSkeleton(),
        ),
      ),
    );
    await tester.pump(const Duration(seconds: 1));

    expect(tester.binding.hasScheduledFrame, isFalse);
    expect(
      find.descendant(
        of: find.byType(TRSkeleton),
        matching: find.byType(CustomPaint),
      ),
      findsOneWidget,
    );
  });

  testWidgets('link invokes onTap when enabled', (tester) async {
    var tapped = false;
    await tester.pumpWidget(
      _wrapNarrow(
        TRLink(onTap: () => tapped = true, child: const Text('Docs')),
      ),
    );
    await tester.tap(find.text('Docs'));
    expect(tapped, isTrue);
  });

  testWidgets('link does not invoke onTap when disabled', (tester) async {
    var tapped = false;
    await tester.pumpWidget(
      _wrapNarrow(
        TRLink(
          disabled: true,
          onTap: () => tapped = true,
          child: const Text('Docs'),
        ),
      ),
    );
    await tester.tap(find.text('Docs'));
    expect(tapped, isFalse);
  });

  testWidgets('link raises opacity toward the hover token on pointer enter', (
    tester,
  ) async {
    await tester.pumpWidget(
      _wrapNarrow(TRLink(onTap: () {}, child: const Text('Docs'))),
    );
    final restingOpacity = tester
        .widget<AnimatedOpacity>(find.byType(AnimatedOpacity))
        .opacity;
    expect(restingOpacity, 1.0);

    final gesture = await tester.createGesture(kind: PointerDeviceKind.mouse);
    addTearDown(gesture.removePointer);
    await gesture.addPointer(location: Offset.zero);
    await tester.pump();
    await gesture.moveTo(tester.getCenter(find.byType(TRLink)));
    await tester.pump();

    final hoveredOpacity = tester
        .widget<AnimatedOpacity>(find.byType(AnimatedOpacity))
        .opacity;
    expect(hoveredOpacity, lessThan(restingOpacity));
  });

  testWidgets('link activates on Enter but not Space while focused', (
    tester,
  ) async {
    var activations = 0;
    final focusNode = FocusNode();
    addTearDown(focusNode.dispose);
    await tester.pumpWidget(
      _wrapNarrow(
        TRLink(
          focusNode: focusNode,
          onTap: () => activations += 1,
          child: const Text('Docs'),
        ),
      ),
    );
    focusNode.requestFocus();
    await tester.pump();

    await tester.sendKeyEvent(LogicalKeyboardKey.enter);
    await tester.pump();
    expect(activations, 1);

    await tester.sendKeyEvent(LogicalKeyboardKey.space);
    await tester.pump();
    expect(activations, 1);
  });

  testWidgets('link does not activate on Enter while disabled', (tester) async {
    var activations = 0;
    final focusNode = FocusNode();
    addTearDown(focusNode.dispose);
    await tester.pumpWidget(
      _wrapNarrow(
        TRLink(
          disabled: true,
          focusNode: focusNode,
          onTap: () => activations += 1,
          child: const Text('Docs'),
        ),
      ),
    );
    focusNode.requestFocus();
    await tester.pump();

    await tester.sendKeyEvent(LogicalKeyboardKey.enter);
    await tester.pump();
    expect(activations, 0);
  });

  testWidgets('link focus ring does not change the link footprint', (
    tester,
  ) async {
    final focusNode = FocusNode();
    addTearDown(focusNode.dispose);
    await tester.pumpWidget(
      _wrapNarrow(
        TRLink(focusNode: focusNode, onTap: () {}, child: const Text('Docs')),
      ),
    );
    final unfocusedSize = tester.getSize(find.byType(TRLink));

    focusNode.requestFocus();
    await tester.pump();
    final focusedSize = tester.getSize(find.byType(TRLink));

    expect(focusedSize, unfocusedSize);
  });

  testWidgets('steps renders a numbered marker per item', (tester) async {
    await tester.pumpWidget(
      _wrapNarrow(
        TRStepsRoot(
          children: [
            TRStepsItem(child: const Text('Create account')),
            TRStepsItem(child: const Text('Verify email')),
          ],
        ),
      ),
    );
    expect(find.text('1'), findsOneWidget);
    expect(find.text('2'), findsOneWidget);
    expect(find.text('Create account'), findsOneWidget);
    expect(find.text('Verify email'), findsOneWidget);
  });

  testWidgets('breadcrumbs renders a link per item except the current page', (
    tester,
  ) async {
    var tapped = false;
    await tester.pumpWidget(
      _wrapNarrow(
        TRBreadcrumbs(
          items: [
            TRBreadcrumbsItem(label: 'Home', onTap: () => tapped = true),
            const TRBreadcrumbsItem(label: 'Components'),
            const TRBreadcrumbsItem(label: 'Breadcrumbs'),
          ],
        ),
      ),
    );
    expect(find.byType(TRLink), findsNWidgets(1));
    expect(find.text('/'), findsNWidgets(2));
    await tester.tap(find.text('Home'));
    expect(tapped, isTrue);
  });

  testWidgets('breadcrumbs renders nothing for an empty item list', (
    tester,
  ) async {
    await tester.pumpWidget(_wrapNarrow(const TRBreadcrumbs(items: [])));
    expect(find.byType(TRBreadcrumbs), findsOneWidget);
    expect(find.byType(TRLink), findsNothing);
  });

  testWidgets('toggle flips pressed state on tap and reports the change', (
    tester,
  ) async {
    var pressed = false;
    await tester.pumpWidget(
      _wrapNarrow(
        TRToggle(
          onPressedChange: (next) => pressed = next,
          child: const Text('Bold'),
        ),
      ),
    );
    await tester.tap(find.text('Bold'));
    await tester.pump();
    expect(pressed, isTrue);
  });

  testWidgets('toggle does not flip when disabled', (tester) async {
    var calls = 0;
    await tester.pumpWidget(
      _wrapNarrow(
        TRToggle(
          disabled: true,
          onPressedChange: (_) => calls += 1,
          child: const Text('Bold'),
        ),
      ),
    );
    await tester.tap(find.text('Bold'));
    await tester.pump();
    expect(calls, 0);
  });

  testWidgets('toggle activates on Enter and Space while focused', (
    tester,
  ) async {
    var activations = 0;
    final focusNode = FocusNode();
    addTearDown(focusNode.dispose);
    await tester.pumpWidget(
      _wrapNarrow(
        TRToggle(
          focusNode: focusNode,
          onPressedChange: (_) => activations += 1,
          child: const Text('Bold'),
        ),
      ),
    );
    focusNode.requestFocus();
    await tester.pump();

    await tester.sendKeyEvent(LogicalKeyboardKey.enter);
    await tester.pump();
    expect(activations, 1);

    await tester.sendKeyEvent(LogicalKeyboardKey.space);
    await tester.pump();
    expect(activations, 2);
  });

  testWidgets('toggle group enforces single selection by default', (
    tester,
  ) async {
    List<String>? lastValue;
    await tester.pumpWidget(
      _wrapNarrow(
        TRToggleGroup(
          defaultValue: const ['start'],
          onValueChange: (value) => lastValue = value,
          children: const [
            TRToggle(value: 'start', child: Text('Start')),
            TRToggle(value: 'end', child: Text('End')),
          ],
        ),
        width: 400,
      ),
    );

    await tester.tap(find.text('End'));
    await tester.pump();
    expect(lastValue, ['end']);

    await tester.tap(find.text('End'));
    await tester.pump();
    expect(lastValue, <String>[]);
  });

  testWidgets('toggle group accumulates multiple values when multiple', (
    tester,
  ) async {
    List<String>? lastValue;
    await tester.pumpWidget(
      _wrapNarrow(
        TRToggleGroup(
          defaultValue: const ['bold'],
          multiple: true,
          onValueChange: (value) => lastValue = value,
          children: const [
            TRToggle(value: 'bold', child: Text('Bold')),
            TRToggle(value: 'italic', child: Text('Italic')),
          ],
        ),
        width: 400,
      ),
    );

    await tester.tap(find.text('Italic'));
    await tester.pump();
    expect(lastValue, unorderedEquals(['bold', 'italic']));
  });

  testWidgets('toggle group moves focus with arrow keys and skips disabled', (
    tester,
  ) async {
    await tester.pumpWidget(
      _wrapNarrow(
        const TRToggleGroup(
          defaultValue: ['start'],
          children: [
            TRToggle(value: 'start', child: Text('Start')),
            TRToggle(disabled: true, value: 'center', child: Text('Center')),
            TRToggle(value: 'end', child: Text('End')),
          ],
        ),
        width: 400,
      ),
    );
    FocusNode nodeFor(String label) =>
        Focus.of(tester.element(find.text(label)));

    nodeFor('Start').requestFocus();
    await tester.pump();
    expect(nodeFor('Start').hasFocus, isTrue);

    await tester.sendKeyEvent(LogicalKeyboardKey.arrowRight);
    await tester.pump();
    expect(nodeFor('End').hasFocus, isTrue);

    // Focus loops past the last item by default.
    await tester.sendKeyEvent(LogicalKeyboardKey.arrowRight);
    await tester.pump();
    expect(nodeFor('Start').hasFocus, isTrue);

    await tester.sendKeyEvent(LogicalKeyboardKey.end);
    await tester.pump();
    expect(nodeFor('End').hasFocus, isTrue);

    await tester.sendKeyEvent(LogicalKeyboardKey.home);
    await tester.pump();
    expect(nodeFor('Start').hasFocus, isTrue);
  });

  testWidgets('vertical toggle group stops at the ends without loopFocus', (
    tester,
  ) async {
    await tester.pumpWidget(
      _wrapNarrow(
        const TRToggleGroup(
          defaultValue: ['top'],
          loopFocus: false,
          orientation: Axis.vertical,
          children: [
            TRToggle(value: 'top', child: Text('Top')),
            TRToggle(value: 'bottom', child: Text('Bottom')),
          ],
        ),
        width: 400,
      ),
    );
    FocusNode nodeFor(String label) =>
        Focus.of(tester.element(find.text(label)));

    nodeFor('Top').requestFocus();
    await tester.pump();

    // A horizontal arrow does not move focus in a vertical group.
    await tester.sendKeyEvent(LogicalKeyboardKey.arrowRight);
    await tester.pump();
    expect(nodeFor('Top').hasFocus, isTrue);

    await tester.sendKeyEvent(LogicalKeyboardKey.arrowDown);
    await tester.pump();
    expect(nodeFor('Bottom').hasFocus, isTrue);

    await tester.sendKeyEvent(LogicalKeyboardKey.arrowDown);
    await tester.pump();
    expect(nodeFor('Bottom').hasFocus, isTrue);
  });

  testWidgets('grouped toggle keeps an explicit focus node', (tester) async {
    final focusNode = FocusNode();
    addTearDown(focusNode.dispose);
    await tester.pumpWidget(
      _wrapNarrow(
        TRToggleGroup(
          defaultValue: const ['start'],
          children: [
            TRToggle(
              focusNode: focusNode,
              value: 'start',
              child: const Text('Start'),
            ),
            const TRToggle(value: 'end', child: Text('End')),
          ],
        ),
        width: 400,
      ),
    );

    focusNode.requestFocus();
    await tester.pump();
    expect(focusNode.hasFocus, isTrue);

    await tester.sendKeyEvent(LogicalKeyboardKey.arrowRight);
    await tester.pump();
    expect(focusNode.hasFocus, isFalse);
    expect(Focus.of(tester.element(find.text('End'))).hasFocus, isTrue);

    await tester.sendKeyEvent(LogicalKeyboardKey.arrowLeft);
    await tester.pump();
    expect(focusNode.hasFocus, isTrue);
  });

  testWidgets('checkbox toggles checked state and reports the change', (
    tester,
  ) async {
    var checked = false;
    await tester.pumpWidget(
      _wrapNarrow(TRCheckbox(onCheckedChange: (next) => checked = next)),
    );
    await tester.tap(find.byType(TRCheckbox));
    await tester.pump();
    expect(checked, isTrue);
  });

  testWidgets('checkbox does not toggle when read-only', (tester) async {
    var calls = 0;
    await tester.pumpWidget(
      _wrapNarrow(
        TRCheckbox(readOnly: true, onCheckedChange: (_) => calls += 1),
      ),
    );
    await tester.tap(find.byType(TRCheckbox));
    await tester.pump();
    expect(calls, 0);
  });

  testWidgets('checkbox renders an indeterminate glyph', (tester) async {
    await tester.pumpWidget(_wrapNarrow(const TRCheckbox(indeterminate: true)));
    expect(find.text('−'), findsOneWidget);
  });

  testWidgets('checkbox group accumulates checked values', (tester) async {
    List<String>? lastValue;
    await tester.pumpWidget(
      _wrapNarrow(
        TRCheckboxGroup(
          onValueChange: (value) => lastValue = value,
          children: const [
            TRCheckbox(value: 'terms'),
            TRCheckbox(value: 'newsletter'),
          ],
        ),
      ),
    );
    await tester.tap(find.byType(TRCheckbox).first);
    await tester.pump();
    expect(lastValue, ['terms']);
    await tester.tap(find.byType(TRCheckbox).last);
    await tester.pump();
    expect(lastValue, unorderedEquals(['terms', 'newsletter']));
  });

  testWidgets('radio group allows only one selected value at a time', (
    tester,
  ) async {
    String? lastValue;
    await tester.pumpWidget(
      _wrapNarrow(
        TRRadioGroup(
          defaultValue: 'start',
          onValueChange: (value) => lastValue = value,
          children: const [
            TRRadio(value: 'start'),
            TRRadio(value: 'end'),
          ],
        ),
      ),
    );
    await tester.tap(find.byType(TRRadio).last);
    await tester.pump();
    expect(lastValue, 'end');
  });

  testWidgets('radio group ignores taps while disabled', (tester) async {
    var calls = 0;
    await tester.pumpWidget(
      _wrapNarrow(
        TRRadioGroup(
          defaultValue: 'start',
          disabled: true,
          onValueChange: (_) => calls += 1,
          children: const [
            TRRadio(value: 'start'),
            TRRadio(value: 'end'),
          ],
        ),
      ),
    );
    await tester.tap(find.byType(TRRadio).last);
    await tester.pump();
    expect(calls, 0);
  });

  testWidgets('code renders text with the monospace font family', (
    tester,
  ) async {
    await tester.pumpWidget(_wrapNarrow(const TRCode('rack.deploy()')));
    final text = tester.widget<Text>(find.text('rack.deploy()'));
    expect(text.style?.fontFamily, 'packages/tinyrack_ui/IBMPlexMono');
  });

  testWidgets('switch flips checked state on tap and reports the change', (
    tester,
  ) async {
    var checked = false;
    await tester.pumpWidget(
      _wrapNarrow(TRSwitch(onCheckedChange: (next) => checked = next)),
    );
    await tester.tap(find.byType(TRSwitch));
    await tester.pump();
    expect(checked, isTrue);
  });

  testWidgets('switch does not flip while read-only', (tester) async {
    var calls = 0;
    await tester.pumpWidget(
      _wrapNarrow(TRSwitch(readOnly: true, onCheckedChange: (_) => calls += 1)),
    );
    await tester.tap(find.byType(TRSwitch));
    await tester.pump();
    expect(calls, 0);
  });

  testWidgets('switch names itself for assistive technology', (tester) async {
    await tester.pumpWidget(
      _wrapNarrow(const TRSwitch(semanticLabel: 'Automatic backups')),
    );
    expect(find.bySemanticsLabel('Automatic backups'), findsOneWidget);
  });

  testWidgets('switch activates on Space while focused', (tester) async {
    var activations = 0;
    final focusNode = FocusNode();
    addTearDown(focusNode.dispose);
    await tester.pumpWidget(
      _wrapNarrow(
        TRSwitch(
          focusNode: focusNode,
          onCheckedChange: (_) => activations += 1,
        ),
      ),
    );
    focusNode.requestFocus();
    await tester.pump();
    await tester.sendKeyEvent(LogicalKeyboardKey.space);
    await tester.pump();
    expect(activations, 1);
  });

  testWidgets('collapsible expands and collapses its content on tap', (
    tester,
  ) async {
    var open = false;
    await tester.pumpWidget(
      _wrapNarrow(
        TRCollapsible(
          onOpenChange: (next) => open = next,
          trigger: const Text('Details'),
          content: const Text('Panel body'),
        ),
      ),
    );
    expect(find.text('Panel body'), findsNothing);

    await tester.tap(find.text('Details'));
    await tester.pump();
    await tester.pumpAndSettle();
    expect(open, isTrue);
    expect(find.text('Panel body'), findsOneWidget);

    await tester.tap(find.text('Details'));
    await tester.pump();
    await tester.pumpAndSettle();
    expect(open, isFalse);
    expect(find.text('Panel body'), findsNothing);
  });

  testWidgets('collapsible does not toggle when disabled', (tester) async {
    var calls = 0;
    await tester.pumpWidget(
      _wrapNarrow(
        TRCollapsible(
          disabled: true,
          onOpenChange: (_) => calls += 1,
          trigger: const Text('Details'),
          content: const Text('Panel body'),
        ),
      ),
    );
    await tester.tap(find.text('Details'));
    await tester.pump();
    expect(calls, 0);
  });

  testWidgets('textarea preserves editing callbacks and min line height', (
    tester,
  ) async {
    var value = '';
    await tester.pumpWidget(
      _wrapNarrow(TRTextarea(onChanged: (next) => value = next)),
    );
    await tester.enterText(find.byType(TextField), 'Rack notes');
    expect(value, 'Rack notes');

    final size = tester.getSize(find.byType(TRTextarea));
    expect(
      size.height,
      greaterThanOrEqualTo(TRGeneratedControlMetrics.mdHeight * 2),
    );
  });

  testWidgets('textarea does not accept input when read-only', (tester) async {
    final controller = TextEditingController(text: 'Existing');
    addTearDown(controller.dispose);
    await tester.pumpWidget(
      _wrapNarrow(TRTextarea(controller: controller, readOnly: true)),
    );
    await tester.enterText(find.byType(TextField), 'Changed');
    expect(controller.text, 'Existing');
  });

  testWidgets('fieldset renders its legend above its children', (tester) async {
    await tester.pumpWidget(
      _wrapNarrow(
        const TRFieldset(
          legend: 'Contact',
          children: [Text('Email'), Text('Phone')],
        ),
      ),
    );
    expect(find.text('Contact'), findsOneWidget);
    expect(find.text('Email'), findsOneWidget);
    expect(find.text('Phone'), findsOneWidget);
  });

  testWidgets('field renders label, control, and error text', (tester) async {
    await tester.pumpWidget(
      _wrapNarrow(
        const TRField(
          control: TextField(),
          errorText: 'Name is required',
          label: 'Name',
        ),
      ),
    );
    expect(find.text('NAME'), findsOneWidget);
    expect(find.text('Name is required'), findsOneWidget);
    expect(find.byType(TextField), findsOneWidget);
  });

  testWidgets('tabs switches the visible panel on tap', (tester) async {
    String? lastValue;
    await tester.pumpWidget(
      _wrapNarrow(
        TRTabs(
          defaultValue: 'overview',
          onValueChange: (value) => lastValue = value,
          panelBuilder: (value) => Text('Panel: $value'),
          tabs: const [
            TRTabsTab(value: 'overview', label: 'Overview'),
            TRTabsTab(value: 'settings', label: 'Settings'),
          ],
        ),
        width: 400,
      ),
    );
    expect(find.text('Panel: overview'), findsOneWidget);

    await tester.tap(find.text('Settings'));
    await tester.pumpAndSettle();
    expect(lastValue, 'settings');
    expect(find.text('Panel: settings'), findsOneWidget);
  });

  testWidgets('accordion enforces single open item by default', (tester) async {
    List<String>? lastValue;
    await tester.pumpWidget(
      _wrapNarrow(
        TRAccordion(
          defaultValue: const ['install'],
          onValueChange: (value) => lastValue = value,
          items: const [
            TRAccordionItem(
              value: 'install',
              trigger: Text('Install'),
              content: Text('Run the installer.'),
            ),
            TRAccordionItem(
              value: 'configure',
              trigger: Text('Configure'),
              content: Text('Edit the config file.'),
            ),
          ],
        ),
      ),
    );
    expect(find.text('Run the installer.'), findsOneWidget);
    expect(find.text('Edit the config file.'), findsNothing);

    await tester.tap(find.text('Configure'));
    await tester.pump();
    await tester.pumpAndSettle();
    expect(lastValue, ['configure']);
    expect(find.text('Edit the config file.'), findsOneWidget);
    expect(find.text('Run the installer.'), findsNothing);
  });

  testWidgets('accordion accumulates open items when multiple', (tester) async {
    List<String>? lastValue;
    await tester.pumpWidget(
      _wrapNarrow(
        TRAccordion(
          defaultValue: const ['install'],
          multiple: true,
          onValueChange: (value) => lastValue = value,
          items: const [
            TRAccordionItem(
              value: 'install',
              trigger: Text('Install'),
              content: Text('Run the installer.'),
            ),
            TRAccordionItem(
              value: 'configure',
              trigger: Text('Configure'),
              content: Text('Edit the config file.'),
            ),
          ],
        ),
      ),
    );

    await tester.tap(find.text('Configure'));
    await tester.pump();
    await tester.pumpAndSettle();
    expect(lastValue, unorderedEquals(['install', 'configure']));
    expect(find.text('Run the installer.'), findsOneWidget);
    expect(find.text('Edit the config file.'), findsOneWidget);
  });

  testWidgets('accordion does not activate a disabled item', (tester) async {
    final reported = <List<String>>[];
    await tester.pumpWidget(
      _wrapNarrow(
        TRAccordion(
          onValueChange: reported.add,
          items: const [
            TRAccordionItem(
              value: 'install',
              trigger: Text('Install'),
              content: Text('Run the installer.'),
            ),
            TRAccordionItem(
              value: 'configure',
              disabled: true,
              trigger: Text('Configure'),
              content: Text('Edit the config file.'),
            ),
          ],
        ),
      ),
    );

    await tester.tap(find.text('Configure'));
    await tester.pumpAndSettle();
    expect(reported, isEmpty);
    expect(find.text('Edit the config file.'), findsNothing);
  });

  testWidgets('progress reports its rounded percentage value', (tester) async {
    await tester.pumpWidget(_wrapNarrow(const TRProgress(value: 42)));
    final semantics = tester.getSemantics(find.byType(TRProgress));
    expect(semantics.value, '42%');
  });

  testWidgets('progress renders indeterminate when value is null', (
    tester,
  ) async {
    await tester.pumpWidget(_wrapNarrow(const TRProgress()));
    expect(
      find.descendant(
        of: find.byType(TRProgress),
        matching: find.byType(CustomPaint),
      ),
      findsOneWidget,
    );
    expect(find.byType(LinearProgressIndicator), findsNothing);
    expect(tester.getSemantics(find.byType(TRProgress)).value, isEmpty);
  });

  testWidgets('meter reports its rounded percentage value', (tester) async {
    await tester.pumpWidget(_wrapNarrow(const TRMeter(value: 30, max: 40)));
    final semantics = tester.getSemantics(find.byType(TRMeter));
    expect(semantics.value, '75%');
  });

  testWidgets('avatar renders fallback initials without an image', (
    tester,
  ) async {
    await tester.pumpWidget(_wrapNarrow(const TRAvatar(fallback: 'AB')));
    expect(find.text('AB'), findsOneWidget);
  });

  testWidgets('avatar is square-sized to the sm control height', (
    tester,
  ) async {
    await tester.pumpWidget(
      _wrapNarrow(const TRAvatar(fallback: 'AB', uiSize: TRUiSize.sm)),
    );
    final size = tester.getSize(find.byType(TRAvatar));
    expect(size.width, TRGeneratedControlMetrics.smHeight);
    expect(size.height, TRGeneratedControlMetrics.smHeight);
  });

  testWidgets('code block renders its code as monospace text', (tester) async {
    await tester.pumpWidget(
      _wrapNarrow(const TRCodeBlock(code: 'tinyrack deploy --env prod')),
    );
    final text = tester.widget<Text>(find.text('tinyrack deploy --env prod'));
    expect(text.style?.fontFamily, 'packages/tinyrack_ui/IBMPlexMono');
  });

  testWidgets('animated number renders the formatted target value', (
    tester,
  ) async {
    await tester.pumpWidget(_wrapNarrow(const TRAnimatedNumber(value: 12345)));
    await tester.pumpAndSettle();
    expect(find.text('12,345'), findsOneWidget);
  });

  test('formatAnimatedNumber groups thousands and keeps fraction digits', () {
    expect(formatAnimatedNumber(1234567), '1,234,567');
    expect(formatAnimatedNumber(-1234.5, fractionDigits: 1), '-1,234.5');
    expect(formatAnimatedNumber(42), '42');
  });

  testWidgets('copy button copies the value and reports status changes', (
    tester,
  ) async {
    TestDefaultBinaryMessengerBinding.instance.defaultBinaryMessenger
        .setMockMethodCallHandler(SystemChannels.platform, (call) async {
          if (call.method == 'Clipboard.setData') return null;
          return null;
        });
    addTearDown(
      () => TestDefaultBinaryMessengerBinding.instance.defaultBinaryMessenger
          .setMockMethodCallHandler(SystemChannels.platform, null),
    );
    final statuses = <TRCopyButtonStatus>[];
    await tester.pumpWidget(
      _wrapNarrow(
        TRCopyButton(
          onStatusChange: statuses.add,
          resetDelay: const Duration(milliseconds: 50),
          value: 'tinyrack.net',
        ),
      ),
    );
    expect(find.text('Copy'), findsOneWidget);

    await tester.tap(find.text('Copy'));
    await tester.pump();
    await tester.pump();
    expect(find.text('Copied'), findsOneWidget);
    expect(statuses, [TRCopyButtonStatus.copied]);

    await tester.pump(const Duration(milliseconds: 60));
    expect(find.text('Copy'), findsOneWidget);
    expect(statuses, [TRCopyButtonStatus.copied, TRCopyButtonStatus.idle]);
  });

  testWidgets('copy button stays idle when the clipboard write fails', (
    tester,
  ) async {
    TestDefaultBinaryMessengerBinding.instance.defaultBinaryMessenger
        .setMockMethodCallHandler(SystemChannels.platform, (call) async {
          if (call.method == 'Clipboard.setData') {
            throw PlatformException(code: 'copy_fail');
          }
          return null;
        });
    addTearDown(
      () => TestDefaultBinaryMessengerBinding.instance.defaultBinaryMessenger
          .setMockMethodCallHandler(SystemChannels.platform, null),
    );
    final statuses = <TRCopyButtonStatus>[];
    await tester.pumpWidget(
      _wrapNarrow(
        TRCopyButton(onStatusChange: statuses.add, value: 'tinyrack.net'),
      ),
    );

    await tester.tap(find.text('Copy'));
    await tester.pump();
    await tester.pump();

    expect(tester.takeException(), isNull);
    expect(find.text('Copy'), findsOneWidget);
    expect(statuses, isEmpty);
  });

  testWidgets('copy button keeps its width across status changes', (
    tester,
  ) async {
    TestDefaultBinaryMessengerBinding.instance.defaultBinaryMessenger
        .setMockMethodCallHandler(
          SystemChannels.platform,
          (call) async => null,
        );
    addTearDown(
      () => TestDefaultBinaryMessengerBinding.instance.defaultBinaryMessenger
          .setMockMethodCallHandler(SystemChannels.platform, null),
    );
    await tester.pumpWidget(
      _wrapNarrow(const TRCopyButton(value: 'tinyrack.net')),
    );
    final idleWidth = tester.getSize(find.byType(TRCopyButton)).width;

    await tester.tap(find.text('Copy'));
    await tester.pump();
    await tester.pump();
    expect(find.text('Copied'), findsOneWidget);
    expect(tester.getSize(find.byType(TRCopyButton)).width, idleWidth);
    await tester.pump(const Duration(seconds: 3));
  });

  testWidgets('toggle keeps a controlled pressed value fixed', (tester) async {
    final reported = <bool>[];
    await tester.pumpWidget(
      _wrapNarrow(
        TRToggle(
          onPressedChange: reported.add,
          pressed: false,
          child: const Text('Bold'),
        ),
      ),
    );
    await tester.tap(find.text('Bold'));
    await tester.pump();
    await tester.tap(find.text('Bold'));
    await tester.pump();
    // Uncontrolled state would alternate; controlled stays unpressed.
    expect(reported, [true, true]);
  });

  testWidgets('checkbox keeps a controlled checked value fixed', (
    tester,
  ) async {
    final reported = <bool>[];
    await tester.pumpWidget(
      _wrapNarrow(TRCheckbox(checked: false, onCheckedChange: reported.add)),
    );
    await tester.tap(find.byType(TRCheckbox));
    await tester.pump();
    await tester.tap(find.byType(TRCheckbox));
    await tester.pump();
    expect(reported, [true, true]);
  });

  testWidgets('switch keeps a controlled checked value fixed', (tester) async {
    final reported = <bool>[];
    await tester.pumpWidget(
      _wrapNarrow(TRSwitch(checked: false, onCheckedChange: reported.add)),
    );
    await tester.tap(find.byType(TRSwitch));
    await tester.pumpAndSettle();
    await tester.tap(find.byType(TRSwitch));
    await tester.pumpAndSettle();
    expect(reported, [true, true]);
  });

  testWidgets('toggle group keeps a controlled value fixed', (tester) async {
    final reported = <List<String>>[];
    await tester.pumpWidget(
      _wrapNarrow(
        TRToggleGroup(
          onValueChange: reported.add,
          value: const ['start'],
          children: const [
            TRToggle(value: 'start', child: Text('Start')),
            TRToggle(value: 'end', child: Text('End')),
          ],
        ),
        width: 400,
      ),
    );
    await tester.tap(find.text('Start'));
    await tester.pump();
    await tester.tap(find.text('Start'));
    await tester.pump();
    // Uncontrolled state would alternate between [] and ['start'].
    expect(reported, [<String>[], <String>[]]);
  });

  testWidgets('checkbox group keeps a controlled value fixed', (tester) async {
    final reported = <List<String>>[];
    await tester.pumpWidget(
      _wrapNarrow(
        TRCheckboxGroup(
          onValueChange: reported.add,
          value: const ['terms'],
          children: const [
            TRCheckbox(value: 'terms'),
            TRCheckbox(value: 'newsletter'),
          ],
        ),
      ),
    );
    await tester.tap(find.byType(TRCheckbox).first);
    await tester.pump();
    await tester.tap(find.byType(TRCheckbox).first);
    await tester.pump();
    expect(reported, [<String>[], <String>[]]);
  });

  testWidgets('toggle group blocks child activation while disabled', (
    tester,
  ) async {
    var calls = 0;
    await tester.pumpWidget(
      _wrapNarrow(
        TRToggleGroup(
          disabled: true,
          onValueChange: (_) => calls += 1,
          children: const [
            TRToggle(value: 'start', child: Text('Start')),
            TRToggle(value: 'end', child: Text('End')),
          ],
        ),
        width: 400,
      ),
    );
    await tester.tap(find.text('Start'));
    await tester.pump();
    expect(calls, 0);
  });

  testWidgets('checkbox group blocks child activation while disabled', (
    tester,
  ) async {
    var calls = 0;
    await tester.pumpWidget(
      _wrapNarrow(
        TRCheckboxGroup(
          disabled: true,
          onValueChange: (_) => calls += 1,
          children: const [
            TRCheckbox(value: 'terms'),
            TRCheckbox(value: 'newsletter'),
          ],
        ),
      ),
    );
    await tester.tap(find.byType(TRCheckbox).first);
    await tester.pump();
    expect(calls, 0);
  });

  testWidgets('collapsible keeps a controlled open value fixed', (
    tester,
  ) async {
    final reported = <bool>[];
    await tester.pumpWidget(
      _wrapNarrow(
        TRCollapsible(
          onOpenChange: reported.add,
          open: false,
          trigger: const Text('Details'),
          content: const Text('Panel body'),
        ),
      ),
    );
    await tester.tap(find.text('Details'));
    await tester.pumpAndSettle();
    expect(find.text('Panel body'), findsNothing);
    await tester.tap(find.text('Details'));
    await tester.pumpAndSettle();
    expect(reported, [true, true]);
  });

  testWidgets('collapsible activates on Enter and on Space release', (
    tester,
  ) async {
    var calls = 0;
    await tester.pumpWidget(
      _wrapNarrow(
        TRCollapsible(
          onOpenChange: (_) => calls += 1,
          trigger: const Text('Details'),
          content: const Text('Panel body'),
        ),
      ),
    );
    await tester.sendKeyEvent(LogicalKeyboardKey.tab);
    await tester.pump();

    await tester.sendKeyEvent(LogicalKeyboardKey.enter);
    await tester.pumpAndSettle();
    expect(calls, 1);

    // Native disclosure buttons fire on Space release, not on press.
    await tester.sendKeyDownEvent(LogicalKeyboardKey.space);
    await tester.pump();
    expect(calls, 1);
    await tester.sendKeyUpEvent(LogicalKeyboardKey.space);
    await tester.pumpAndSettle();
    expect(calls, 2);
  });

  testWidgets('accordion keeps a controlled value fixed', (tester) async {
    final reported = <List<String>>[];
    await tester.pumpWidget(
      _wrapNarrow(
        TRAccordion(
          onValueChange: reported.add,
          value: const ['install'],
          items: const [
            TRAccordionItem(
              value: 'install',
              trigger: Text('Install'),
              content: Text('Run the installer.'),
            ),
            TRAccordionItem(
              value: 'configure',
              trigger: Text('Configure'),
              content: Text('Edit the config file.'),
            ),
          ],
        ),
      ),
    );
    await tester.tap(find.text('Install'));
    await tester.pumpAndSettle();
    expect(find.text('Run the installer.'), findsOneWidget);
    await tester.tap(find.text('Install'));
    await tester.pumpAndSettle();
    // Uncontrolled state would alternate between [] and ['install'].
    expect(reported, [<String>[], <String>[]]);
  });

  testWidgets('accordion activates on Enter and on Space release', (
    tester,
  ) async {
    final reported = <List<String>>[];
    await tester.pumpWidget(
      _wrapNarrow(
        TRAccordion(
          onValueChange: reported.add,
          items: const [
            TRAccordionItem(
              value: 'install',
              trigger: Text('Install'),
              content: Text('Run the installer.'),
            ),
          ],
        ),
      ),
    );
    await tester.sendKeyEvent(LogicalKeyboardKey.tab);
    await tester.pump();

    await tester.sendKeyEvent(LogicalKeyboardKey.enter);
    await tester.pumpAndSettle();
    expect(reported, [
      ['install'],
    ]);

    await tester.sendKeyDownEvent(LogicalKeyboardKey.space);
    await tester.pump();
    expect(reported, hasLength(1));
    await tester.sendKeyUpEvent(LogicalKeyboardKey.space);
    await tester.pumpAndSettle();
    expect(reported, [
      ['install'],
      <String>[],
    ]);
  });

  testWidgets('tabs keep a controlled value fixed', (tester) async {
    final reported = <String>[];
    await tester.pumpWidget(
      _wrapNarrow(
        TRTabs(
          onValueChange: reported.add,
          panelBuilder: (value) => Text('Panel: $value'),
          value: 'overview',
          tabs: const [
            TRTabsTab(value: 'overview', label: 'Overview'),
            TRTabsTab(value: 'settings', label: 'Settings'),
          ],
        ),
        width: 400,
      ),
    );
    await tester.tap(find.text('Settings'));
    await tester.pumpAndSettle();
    expect(find.text('Panel: overview'), findsOneWidget);
    expect(find.text('Panel: settings'), findsNothing);
    expect(reported, ['settings']);
  });

  testWidgets('tabs activate on Enter and on Space release', (tester) async {
    final reported = <String>[];
    await tester.pumpWidget(
      _wrapNarrow(
        TRTabs(
          defaultValue: 'settings',
          onValueChange: reported.add,
          panelBuilder: (value) => Text('Panel: $value'),
          tabs: const [
            TRTabsTab(value: 'overview', label: 'Overview'),
            TRTabsTab(value: 'settings', label: 'Settings'),
          ],
        ),
        width: 400,
      ),
    );
    await tester.sendKeyEvent(LogicalKeyboardKey.tab);
    await tester.pump();

    await tester.sendKeyEvent(LogicalKeyboardKey.enter);
    await tester.pumpAndSettle();
    expect(reported, ['overview']);

    await tester.sendKeyDownEvent(LogicalKeyboardKey.space);
    await tester.pump();
    expect(reported, hasLength(1));
    await tester.sendKeyUpEvent(LogicalKeyboardKey.space);
    await tester.pumpAndSettle();
    expect(reported, ['overview', 'overview']);
  });

  testWidgets('tabs ignore taps on a disabled tab', (tester) async {
    var calls = 0;
    await tester.pumpWidget(
      _wrapNarrow(
        TRTabs(
          defaultValue: 'overview',
          onValueChange: (_) => calls += 1,
          panelBuilder: (value) => Text('Panel: $value'),
          tabs: const [
            TRTabsTab(value: 'overview', label: 'Overview'),
            TRTabsTab(value: 'settings', label: 'Settings', disabled: true),
          ],
        ),
        width: 400,
      ),
    );
    await tester.tap(find.text('Settings'));
    await tester.pumpAndSettle();
    expect(calls, 0);
    expect(find.text('Panel: overview'), findsOneWidget);
  });

  testWidgets('progress clamps values beyond its range', (tester) async {
    await tester.pumpWidget(_wrapNarrow(const TRProgress(value: 150)));
    expect(tester.getSemantics(find.byType(TRProgress)).value, '100%');

    await tester.pumpWidget(_wrapNarrow(const TRProgress(value: -10)));
    expect(tester.getSemantics(find.byType(TRProgress)).value, '0%');
  });

  testWidgets('meter clamps values beyond its range', (tester) async {
    await tester.pumpWidget(_wrapNarrow(const TRMeter(value: 120)));
    expect(tester.getSemantics(find.byType(TRMeter)).value, '100%');
  });
}
