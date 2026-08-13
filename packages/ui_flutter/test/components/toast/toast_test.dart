import 'dart:async';
import 'dart:ui';

import 'package:material_ui/material_ui.dart';
import 'package:flutter/rendering.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:tinyrack_ui/tinyrack_ui.dart';

/// A daemon failure of the length a caller forwards from a caught exception.
const _longDescription =
    'Connection to 127.0.0.1:52413 was reset while writing the frame for '
    'updateServer (attempt 3 of 3). The host reported exit code 70 with '
    'stderr: "database is locked, locking protocol; retry after the current '
    'write transaction commits". Check that nothing else owns the same home '
    'directory before trying again.';

Widget _app(
  Widget child, {
  TextDirection direction = TextDirection.ltr,
  double textScale = 1,
}) => MaterialApp(
  debugShowCheckedModeBanner: false,
  theme: TinyrackTheme.light(),
  home: Builder(
    builder: (context) => MediaQuery(
      data: MediaQuery.of(
        context,
      ).copyWith(textScaler: TextScaler.linear(textScale)),
      child: Directionality(
        textDirection: direction,
        child: Scaffold(body: child),
      ),
    ),
  ),
);

/// Mounts a region the way an application shell does, above the navigator.
///
/// [_app] puts the region inside a [Scaffold], which hands every descendant a
/// [DefaultTextStyle] of its own. A shell that wants a report to outlive the
/// route that produced it has to mount the region above the navigator instead,
/// where the only ambient style left is the one [MaterialApp] paints unstyled
/// text with. Only this placement can show whether the toast styles its own
/// text completely.
Widget _shellApp(Widget Function(Widget child) region) => MaterialApp(
  debugShowCheckedModeBanner: false,
  theme: TinyrackTheme.light(),
  builder: (context, child) => region(child ?? const SizedBox.shrink()),
  home: const Center(child: Text('Page')),
);

/// Mounts a full-size region and returns the controller driving it.
///
/// The controller is returned rather than torn down here because the binding
/// checks for pending timers before `addTearDown` callbacks run, so a toast left
/// on screen has to be disposed from inside the test body.
Future<TRToastController> _mount(
  WidgetTester tester, {
  Size size = const Size(900, 640),
  TextDirection direction = TextDirection.ltr,
  double textScale = 1,
  TRToastController? controller,
}) async {
  await tester.binding.setSurfaceSize(size);
  addTearDown(() => tester.binding.setSurfaceSize(null));
  final resolved = controller ?? TRToastController();
  await tester.pumpWidget(
    _app(
      TRToastRegion(
        controller: resolved,
        child: const Center(child: Text('Page')),
      ),
      direction: direction,
      textScale: textScale,
    ),
  );
  return resolved;
}

double _cardHeight(WidgetTester tester) =>
    tester.getSize(find.byType(Dismissible).first).height;

/// How far through its entry animation the newest card has travelled.
double _entryProgress(WidgetTester tester) => tester
    .widgetList<Opacity>(
      find.descendant(
        of: find.byType(TRToastRegion),
        matching: find.byType(Opacity),
      ),
    )
    .first
    .opacity;

void main() {
  group('painting', () {
    testWidgets('every variant paints its accent without asserting', (
      tester,
    ) async {
      for (final variant in TRStatusVariant.values) {
        final controller = await _mount(tester);
        controller.show(
          TRToastData(title: const Text('Saved'), variant: variant),
        );
        // The card is transparent on its first frame, so only a settled entry
        // animation actually paints the decoration.
        await tester.pumpAndSettle();
        expect(
          tester.takeException(),
          isNull,
          reason: 'painting a $variant toast must not throw',
        );
        controller.dismissAll();
        await tester.pumpAndSettle();
        controller.dispose();
      }
    });

    testWidgets('the variant bar spans the leading edge of the card', (
      tester,
    ) async {
      final controller = await _mount(tester);
      controller.show(
        const TRToastData(
          title: Text('Could not save'),
          description: Text(_longDescription),
          variant: TRStatusVariant.danger,
        ),
      );
      await tester.pumpAndSettle();

      final card = tester.getRect(find.byType(Dismissible).first);
      final bar = tester.getRect(
        find
            .descendant(
              of: find.byType(TRToastRegion),
              matching: find.byType(ColoredBox),
            )
            .first,
      );

      expect(bar.width, TRControlMetrics.borderWidth * 2);
      expect(
        bar.height,
        closeTo(card.height - TRControlMetrics.borderWidth * 2, 1),
        reason: 'the bar runs the full inner height however tall the card is',
      );
      expect(bar.left, closeTo(card.left + TRControlMetrics.borderWidth, 1));

      controller.dismissAll();
      await tester.pumpAndSettle();
      controller.dispose();
    });

    testWidgets('a card above the navigator still styles its own text', (
      tester,
    ) async {
      final controller = TRToastController();
      await tester.binding.setSurfaceSize(const Size(900, 640));
      addTearDown(() => tester.binding.setSurfaceSize(null));
      await tester.pumpWidget(
        _shellApp(
          (child) => TRToastRegion(controller: controller, child: child),
        ),
      );
      controller.show(
        const TRToastData(
          title: Text('Saved'),
          description: Text('The workspace was written to disk.'),
        ),
      );
      await tester.pumpAndSettle();

      // Text with no [Material] over it inherits the fallback style MaterialApp
      // paints unstyled text with, which carries a yellow double underline. The
      // card's own merge sets colour and metrics but never clears a decoration,
      // so the card has to bring the surface that style belongs to.
      for (final label in <String>[
        'Saved',
        'The workspace was written to disk.',
      ]) {
        final painted = tester
            .renderObject<RenderParagraph>(find.text(label))
            .text
            .style;
        expect(
          painted?.decoration ?? TextDecoration.none,
          TextDecoration.none,
          reason: '"$label" must not be painted with the fallback style',
        );
      }

      controller.dismissAll();
      await tester.pumpAndSettle();
      controller.dispose();
    });

    testWidgets('a rounded card keeps its border uniform', (tester) async {
      final controller = await _mount(tester);
      controller.show(const TRToastData(title: Text('Saved')));
      await tester.pumpAndSettle();

      // Flutter can only stroke a rounded rectangle when every side matches, so
      // a decoration carrying a radius must not also carry an accent side.
      final rounded = tester
          .widgetList<Container>(
            find.descendant(
              of: find.byType(TRToastRegion),
              matching: find.byType(Container),
            ),
          )
          .map((container) => container.decoration)
          .whereType<BoxDecoration>()
          .where((decoration) => decoration.borderRadius != null);

      expect(rounded, isNotEmpty, reason: 'the card is a rounded surface');
      for (final decoration in rounded) {
        expect(decoration.border?.isUniform ?? true, isTrue);
      }

      controller.dismissAll();
      await tester.pumpAndSettle();
      controller.dispose();
    });
  });

  group('size', () {
    testWidgets('a card with one line of title is only as tall as it needs', (
      tester,
    ) async {
      final controller = await _mount(tester);
      controller.show(const TRToastData(title: Text('Saved')));
      await tester.pumpAndSettle();

      // The dismiss button is the tallest thing in the row, so a report of a
      // single line is exactly that button between the card's own padding.
      // Anything more is dead space the reader has to look past.
      expect(
        _cardHeight(tester),
        closeTo(
          TRControlMetrics.heightOf(TRUiSize.md) +
              TRSpacing.medium * 2 +
              TRControlMetrics.borderWidth * 2,
          1,
        ),
      );

      controller.dismissAll();
      await tester.pumpAndSettle();
      controller.dispose();
    });

    testWidgets('a long description cannot grow the card without bound', (
      tester,
    ) async {
      final controller = await _mount(tester);
      controller.show(const TRToastData(title: Text('Short')));
      await tester.pumpAndSettle();
      final short = _cardHeight(tester);

      controller.dismissAll();
      await tester.pumpAndSettle();
      controller.show(
        const TRToastData(
          title: Text('Could not save the server'),
          description: Text(_longDescription),
          variant: TRStatusVariant.danger,
        ),
      );
      await tester.pumpAndSettle();
      final long = _cardHeight(tester);

      expect(long, greaterThan(short), reason: 'the description is shown');
      expect(
        long,
        lessThan(240),
        reason: 'a clamped description keeps the card readable',
      );

      controller.dismissAll();
      await tester.pumpAndSettle();
      controller.dispose();
    });

    testWidgets('a full queue of long messages stays inside the viewport', (
      tester,
    ) async {
      const viewport = Size(900, 640);
      final controller = await _mount(tester, size: viewport);
      for (var index = 0; index < controller.maxVisible; index += 1) {
        controller.show(
          TRToastData(
            title: Text('Failure $index'),
            description: const Text(_longDescription),
            variant: TRStatusVariant.danger,
          ),
        );
      }
      await tester.pumpAndSettle();

      expect(tester.takeException(), isNull, reason: 'nothing overflowed');
      final stack = tester.getSize(
        find
            .ancestor(
              of: find.byType(Dismissible).first,
              matching: find.byType(Column),
            )
            .first,
      );
      expect(stack.height, lessThan(viewport.height));

      controller.dismissAll();
      await tester.pumpAndSettle();
      controller.dispose();
    });

    testWidgets('a narrow viewport at double text scale still fits', (
      tester,
    ) async {
      const viewport = Size(390, 760);
      final controller = await _mount(tester, size: viewport, textScale: 2);
      controller.show(
        const TRToastData(
          title: Text('Could not disconnect'),
          description: Text(_longDescription),
          variant: TRStatusVariant.danger,
        ),
      );
      await tester.pumpAndSettle();

      expect(tester.takeException(), isNull);
      expect(_cardHeight(tester), lessThan(viewport.height));

      controller.dismissAll();
      await tester.pumpAndSettle();
      controller.dispose();
    });
  });

  group('lifecycle', () {
    testWidgets('a dismissed card animates out instead of vanishing', (
      tester,
    ) async {
      final controller = await _mount(tester);
      controller.show(const TRToastData(id: 'a', title: Text('Alpha')));
      controller.show(const TRToastData(id: 'b', title: Text('Bravo')));
      await tester.pumpAndSettle();

      controller.dismiss('a');
      await tester.pump();
      expect(
        find.text('Alpha'),
        findsOneWidget,
        reason: 'the card holds its place while it plays its exit',
      );

      await tester.pumpAndSettle();
      expect(find.text('Alpha'), findsNothing, reason: 'and then it retires');

      controller.dismissAll();
      await tester.pumpAndSettle();
      controller.dispose();
    });

    testWidgets('removing a card does not move the ones left behind', (
      tester,
    ) async {
      final controller = await _mount(tester);
      controller.show(const TRToastData(id: 'a', title: Text('Alpha')));
      controller.show(const TRToastData(id: 'b', title: Text('Bravo')));
      controller.show(const TRToastData(id: 'c', title: Text('Charlie')));
      await tester.pumpAndSettle();

      final before = tester.getRect(find.text('Charlie'));
      controller.dismiss('b');
      await tester.pump();
      expect(tester.getRect(find.text('Charlie')), before);

      controller.dismissAll();
      await tester.pumpAndSettle();
      controller.dispose();
    });

    testWidgets('an id shown again while leaving reclaims its own card', (
      tester,
    ) async {
      final controller = await _mount(tester);
      controller.show(const TRToastData(id: 'save', title: Text('Saved')));
      await tester.pumpAndSettle();

      controller.dismiss('save');
      await tester.pump();
      controller.show(const TRToastData(id: 'save', title: Text('Saved')));
      await tester.pumpAndSettle();

      expect(tester.takeException(), isNull, reason: 'no duplicate keys');
      expect(find.text('Saved'), findsOneWidget);

      controller.dismissAll();
      await tester.pumpAndSettle();
      controller.dispose();
    });

    testWidgets('track holds the loading toast until its future settles', (
      tester,
    ) async {
      final controller = await _mount(tester);
      final completer = Completer<void>();
      controller.track<void>(
        completer.future,
        loading: const TRToastData(title: Text('Deploying')),
        success: (_) => const TRToastData(
          title: Text('Deployed'),
          variant: TRStatusVariant.success,
        ),
        error: (_, _) => const TRToastData(
          title: Text('Failed'),
          variant: TRStatusVariant.danger,
        ),
      );
      await tester.pumpAndSettle();

      // Sticky rather than merely long-lived: a finite duration large enough to
      // outlast a request overflows a browser timer's 32-bit millisecond
      // argument and fires at once.
      await tester.pump(TRMotion.toast * 3);
      await tester.pumpAndSettle();
      expect(find.text('Deploying'), findsOneWidget);

      completer.complete();
      await tester.pumpAndSettle();
      expect(find.text('Deployed'), findsOneWidget);

      await tester.pump(TRMotion.toast);
      await tester.pumpAndSettle();
      expect(find.text('Deployed'), findsNothing);

      controller.dispose();
    });
  });

  group('repeat', () {
    testWidgets('an id shown again plays its entry over rather than sitting', (
      tester,
    ) async {
      final controller = await _mount(tester);
      controller.show(const TRToastData(id: 'save', title: Text('Saved')));
      await tester.pumpAndSettle();
      expect(_entryProgress(tester), 1, reason: 'the first report has settled');

      controller.show(const TRToastData(id: 'save', title: Text('Saved')));
      await tester.pump();
      await tester.pump(TRMotion.fast ~/ 2);
      // Replacing a report in place looks exactly like ignoring the action that
      // asked for it, so the card has to arrive again for the second attempt to
      // read as an answer at all.
      expect(_entryProgress(tester), lessThan(1));
      expect(find.text('Saved'), findsOneWidget);

      await tester.pumpAndSettle();
      expect(_entryProgress(tester), 1);

      controller.dismissAll();
      await tester.pumpAndSettle();
      controller.dispose();
    });

    testWidgets('an id shown again takes the newest place in the stack', (
      tester,
    ) async {
      final controller = await _mount(tester);
      controller.show(const TRToastData(id: 'a', title: Text('Alpha')));
      controller.show(const TRToastData(id: 'b', title: Text('Bravo')));
      await tester.pumpAndSettle();

      controller.show(const TRToastData(id: 'a', title: Text('Alpha again')));
      await tester.pumpAndSettle();

      expect(controller.toasts.map((toast) => toast.id), <String>['b', 'a']);
      expect(find.text('Alpha again'), findsOneWidget);
      // The newest report leads a bottom-anchored stack, so a refreshed one has
      // to travel there rather than keeping the place it first took.
      expect(
        tester.getCenter(find.text('Alpha again')).dy,
        lessThan(tester.getCenter(find.text('Bravo')).dy),
      );

      controller.dismissAll();
      await tester.pumpAndSettle();
      controller.dispose();
    });

    testWidgets('an id shown again is announced and given its dwell back', (
      tester,
    ) async {
      final semantics = tester.ensureSemantics();
      final controller = await _mount(tester);
      controller.show(const TRToastData(id: 'save', title: Text('Saved')));
      await tester.pumpAndSettle();
      final announced = tester.getSemantics(find.text('Saved')).id;

      await tester.pump(TRMotion.toast ~/ 2);
      controller.show(const TRToastData(id: 'save', title: Text('Saved')));
      await tester.pumpAndSettle();

      // A live region only reports a label that changed, and a repeat says the
      // same thing twice, so the node itself has to be new for a reader to hear
      // the second answer at all.
      expect(tester.getSemantics(find.text('Saved')).id, isNot(announced));

      await tester.pump(TRMotion.toast ~/ 2);
      await tester.pumpAndSettle();
      expect(
        find.text('Saved'),
        findsOneWidget,
        reason: 'the countdown started over with the second report',
      );

      controller.dismissAll();
      await tester.pumpAndSettle();
      controller.dispose();
      semantics.dispose();
    });
  });

  group('dwell', () {
    testWidgets('a resting pointer holds the toast open, leaving resumes it', (
      tester,
    ) async {
      final controller = await _mount(tester);
      controller.show(const TRToastData(title: Text('Read me')));
      await tester.pumpAndSettle();

      final gesture = await tester.createGesture(kind: PointerDeviceKind.mouse);
      await gesture.addPointer(location: Offset.zero);
      addTearDown(gesture.removePointer);
      await gesture.moveTo(tester.getCenter(find.text('Read me')));
      await tester.pump();

      await tester.pump(TRMotion.toast * 2);
      await tester.pumpAndSettle();
      expect(find.text('Read me'), findsOneWidget);
      expect(controller.isPaused, isTrue);

      await gesture.moveTo(Offset.zero);
      await tester.pump();
      expect(controller.isPaused, isFalse);

      await tester.pump(TRMotion.toast);
      await tester.pumpAndSettle();
      expect(find.text('Read me'), findsNothing);

      controller.dispose();
    });
  });

  group('keyboard', () {
    testWidgets('escape outside the region is left for the page', (
      tester,
    ) async {
      var pageSawEscape = false;
      final controller = TRToastController();
      await tester.binding.setSurfaceSize(const Size(900, 640));
      addTearDown(() => tester.binding.setSurfaceSize(null));
      await tester.pumpWidget(
        _app(
          Focus(
            onKeyEvent: (node, event) {
              if (event is KeyDownEvent &&
                  event.logicalKey == LogicalKeyboardKey.escape) {
                pageSawEscape = true;
                return KeyEventResult.handled;
              }
              return KeyEventResult.ignored;
            },
            child: TRToastRegion(
              controller: controller,
              child: const Focus(
                autofocus: true,
                child: Center(child: Text('Page')),
              ),
            ),
          ),
        ),
      );
      await tester.pumpAndSettle();

      await tester.sendKeyEvent(LogicalKeyboardKey.escape);
      await tester.pump();
      expect(
        pageSawEscape,
        isTrue,
        reason: 'a region with nothing to dismiss must not swallow escape',
      );

      controller.dispose();
    });

    testWidgets('f6 focuses the stack and escape then dismisses it', (
      tester,
    ) async {
      final controller = TRToastController();
      await tester.binding.setSurfaceSize(const Size(900, 640));
      addTearDown(() => tester.binding.setSurfaceSize(null));
      await tester.pumpWidget(
        _app(
          TRToastRegion(
            controller: controller,
            // Shortcuts only see a key event that travels up from the focused
            // node, so the page has to hold focus for the region to reach it.
            child: const Focus(
              autofocus: true,
              child: Center(child: Text('Page')),
            ),
          ),
        ),
      );
      controller.show(const TRToastData(title: Text('Saved')));
      await tester.pumpAndSettle();

      await tester.sendKeyEvent(LogicalKeyboardKey.f6);
      await tester.pumpAndSettle();
      await tester.sendKeyEvent(LogicalKeyboardKey.escape);
      await tester.pumpAndSettle();

      expect(find.text('Saved'), findsNothing);
      controller.dispose();
    });
  });

  group('direction', () {
    testWidgets('the dismiss button sits the same way in either script', (
      tester,
    ) async {
      final insets = <TextDirection, double>{};
      for (final direction in TextDirection.values) {
        final controller = await _mount(tester, direction: direction);
        controller.show(const TRToastData(title: Text('Saved')));
        await tester.pumpAndSettle();

        final card = tester.getRect(find.byType(Dismissible).first);
        final button = tester.getRect(find.byType(TRIconButton).first);
        insets[direction] = direction == TextDirection.ltr
            ? card.right - button.right
            : button.left - card.left;

        controller.dismissAll();
        await tester.pumpAndSettle();
        controller.dispose();
      }

      expect(insets[TextDirection.rtl], insets[TextDirection.ltr]);
    });
  });

  group('semantics', () {
    testWidgets('each toast announces itself as a live region', (tester) async {
      final semantics = tester.ensureSemantics();
      final controller = await _mount(tester);
      controller.show(const TRToastData(title: Text('Saved')));
      await tester.pumpAndSettle();

      // The region's own label never changes, so a reader watching only the
      // container would have nothing to announce when a toast arrives.
      expect(
        tester
            .getSemantics(find.text('Saved'))
            .getSemanticsData()
            .flagsCollection
            .isLiveRegion,
        isTrue,
      );

      controller.dismissAll();
      await tester.pumpAndSettle();
      controller.dispose();
      semantics.dispose();
    });
  });
}
