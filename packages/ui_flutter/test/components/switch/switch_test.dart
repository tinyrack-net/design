import 'package:flutter/gestures.dart';
import 'package:material_ui/material_ui.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:tinyrack_ui/src/generated/tokens.g.dart';
import 'package:tinyrack_ui/tinyrack_ui.dart';

const _thumbKey = ValueKey<String>('switch-thumb');

Widget _app(Widget child, {Brightness brightness = Brightness.light}) =>
    MaterialApp(
      theme: brightness == Brightness.light
          ? TinyrackTheme.light()
          : TinyrackTheme.dark(),
      home: Scaffold(body: Center(child: child)),
    );

BoxDecoration _track(WidgetTester tester) =>
    tester
            .widget<AnimatedContainer>(
              find
                  .descendant(
                    of: find.byType(TRSwitch),
                    matching: find.byType(AnimatedContainer),
                  )
                  .first,
            )
            .decoration!
        as BoxDecoration;

Color _thumbColor(WidgetTester tester) =>
    (tester.widget<AnimatedContainer>(find.byKey(_thumbKey)).decoration!
            as BoxDecoration)
        .color!;

double _opacity(WidgetTester tester) => tester
    .widget<AnimatedOpacity>(
      find.descendant(
        of: find.byType(TRSwitch),
        matching: find.byType(AnimatedOpacity),
      ),
    )
    .opacity;

({Color track, Color border, Color thumb, double opacity}) _appearance(
  WidgetTester tester,
) {
  final track = _track(tester);
  return (
    track: track.color!,
    border: (track.border! as Border).top.color,
    thumb: _thumbColor(tester),
    opacity: _opacity(tester),
  );
}

Future<({Color track, Color border, Color thumb, double opacity})> _render(
  WidgetTester tester, {
  required bool checked,
  required bool disabled,
  Brightness brightness = Brightness.light,
}) async {
  await tester.pumpWidget(
    _app(
      TRSwitch(checked: checked, disabled: disabled, thumbKey: _thumbKey),
      brightness: brightness,
    ),
  );
  await tester.pumpAndSettle();
  return _appearance(tester);
}

void main() {
  for (final brightness in Brightness.values) {
    testWidgets(
      'disabled switch keeps its ${brightness.name} colors and fades as a whole',
      (tester) async {
        for (final checked in <bool>[false, true]) {
          final enabled = await _render(
            tester,
            checked: checked,
            disabled: false,
            brightness: brightness,
          );
          final disabled = await _render(
            tester,
            checked: checked,
            disabled: true,
            brightness: brightness,
          );

          expect(enabled.opacity, 1);
          expect(
            disabled.opacity,
            TRGeneratedOpacity.disabled,
            reason: 'the whole control reports unavailability, not the thumb',
          );
          // A disabled switch is the same switch the reader just lost access
          // to, so on stays legible as on rather than swapping its palette.
          expect(disabled.track, enabled.track);
          expect(disabled.border, enabled.border);
          expect(disabled.thumb, enabled.thumb);
        }
      },
    );
  }

  testWidgets('checked and unchecked switches stay visually distinct', (
    tester,
  ) async {
    final on = await _render(tester, checked: true, disabled: true);
    final off = await _render(tester, checked: false, disabled: true);

    expect(on.track, isNot(off.track));
    expect(on.thumb, isNot(off.thumb));
  });

  testWidgets('hover answers only a switch the reader can toggle', (
    tester,
  ) async {
    var pointerId = 0;

    Future<({Color resting, Color hovered})> hover({
      required bool disabled,
      required bool readOnly,
    }) async {
      pointerId += 1;
      await tester.pumpWidget(
        _app(
          TRSwitch(
            checked: false,
            disabled: disabled,
            readOnly: readOnly,
            thumbKey: _thumbKey,
          ),
        ),
      );
      await tester.pumpAndSettle();
      final resting = _appearance(tester).track;

      final gesture = await tester.createGesture(
        kind: PointerDeviceKind.mouse,
        pointer: pointerId,
      );
      await gesture.addPointer(location: Offset.zero);
      await gesture.moveTo(tester.getCenter(find.byType(TRSwitch)));
      await tester.pumpAndSettle();
      final hovered = _appearance(tester).track;
      await gesture.removePointer();
      await tester.pumpAndSettle();

      return (resting: resting, hovered: hovered);
    }

    // Without this the rest of the test would pass on a pointer that never
    // reached the switch at all.
    final editable = await hover(disabled: false, readOnly: false);
    expect(editable.hovered, isNot(editable.resting));

    for (final unavailable in <({bool disabled, bool readOnly})>[
      (disabled: true, readOnly: false),
      (disabled: false, readOnly: true),
    ]) {
      final result = await hover(
        disabled: unavailable.disabled,
        readOnly: unavailable.readOnly,
      );
      expect(result.hovered, result.resting);
    }
  });
}
