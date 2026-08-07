import 'dart:io';

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:tinyrack_ui/src/internal/focus_source.dart';
import 'package:tinyrack_ui/src/internal/forced_states.dart';

/// A control that reports what the resolvers answered for it.
class _Probe extends StatefulWidget {
  const _Probe({
    required this.onResolved,
    this.identity,
    this.hasFocus = false,
  });

  final Object? identity;
  final bool hasFocus;
  final void Function(TRForcedStateSet states, bool focusVisible) onResolved;

  @override
  State<_Probe> createState() => _ProbeState();
}

class _ProbeState extends State<_Probe>
    with TRFocusSourceMixin, TRForcedStatesMixin {
  @override
  Object? get forcedStateIdentity => widget.identity;

  @override
  void initState() {
    super.initState();
    initFocusSource();
  }

  @override
  void dispose() {
    disposeFocusSource();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    widget.onResolved(
      forcedStates(context),
      resolveFocusVisible(context, hasFocus: widget.hasFocus),
    );
    return const SizedBox.shrink();
  }
}

Widget _app(Widget child) => MaterialApp(home: Scaffold(body: child));

void main() {
  setUp(TRFocusSource.instance.debugReset);
  tearDown(TRFocusSource.instance.debugReset);

  testWidgets('with no scope every resolver falls through to the real state', (
    tester,
  ) async {
    late TRForcedStateSet states;
    await tester.pumpWidget(
      _app(_Probe(identity: 'a', onResolved: (value, _) => states = value)),
    );

    expect(states, TRForcedStateSet.none);
    expect(states.isEmpty, isTrue);
  });

  testWidgets('a targeted scope applies only to the named control', (
    tester,
  ) async {
    final resolved = <Object?, TRForcedStateSet>{};
    await tester.pumpWidget(
      _app(
        TRForcedStates(
          target: 'b',
          states: const TRForcedStateSet(hovered: true),
          child: Column(
            children: [
              _Probe(identity: 'a', onResolved: (v, _) => resolved['a'] = v),
              _Probe(identity: 'b', onResolved: (v, _) => resolved['b'] = v),
            ],
          ),
        ),
      ),
    );

    expect(resolved['a'], TRForcedStateSet.none);
    expect(resolved['b']?.hovered, isTrue);
  });

  testWidgets('an untargeted scope applies to every control below it', (
    tester,
  ) async {
    final resolved = <Object?, TRForcedStateSet>{};
    await tester.pumpWidget(
      _app(
        TRForcedStates(
          states: const TRForcedStateSet(hovered: true),
          child: Column(
            children: [
              _Probe(identity: 'a', onResolved: (v, _) => resolved['a'] = v),
              _Probe(identity: 'b', onResolved: (v, _) => resolved['b'] = v),
            ],
          ),
        ),
      ),
    );

    expect(resolved['a']?.hovered, isTrue);
    expect(resolved['b']?.hovered, isTrue);
  });

  testWidgets('declared focus bypasses the sampled modality, it does not OR', (
    tester,
  ) async {
    // The sampled answer says "paint the ring".
    TRFocusSource.instance.debugSetKeyboardModality(true);
    late bool focusVisible;
    await tester.pumpWidget(
      _app(
        TRForcedStates(
          // The declaration says "focused, but not by the keyboard".
          states: const TRForcedStateSet(focused: true),
          child: _Probe(
            hasFocus: true,
            onResolved: (_, value) => focusVisible = value,
          ),
        ),
      ),
    );

    expect(
      focusVisible,
      isFalse,
      reason:
          'an OR here would make every pointer-focused scenario paint a ring',
    );
  });

  testWidgets(
    'without a focus declaration the sampled modality still decides',
    (tester) async {
      TRFocusSource.instance.debugSetKeyboardModality(true);
      late bool focusVisible;
      await tester.pumpWidget(
        _app(
          TRForcedStates(
            states: const TRForcedStateSet(hovered: true),
            child: _Probe(
              hasFocus: true,
              onResolved: (_, value) => focusVisible = value,
            ),
          ),
        ),
      );

      expect(focusVisible, isTrue);
    },
  );

  test('updateShouldNotify tracks the states and the target', () {
    const child = SizedBox.shrink();
    const base = TRForcedStates(states: TRForcedStateSet.none, child: child);

    expect(
      base.updateShouldNotify(
        const TRForcedStates(states: TRForcedStateSet.none, child: child),
      ),
      isFalse,
    );
    expect(
      base.updateShouldNotify(
        const TRForcedStates(
          states: TRForcedStateSet(hovered: true),
          child: child,
        ),
      ),
      isTrue,
    );
    expect(
      base.updateShouldNotify(
        const TRForcedStates(
          target: 'a',
          states: TRForcedStateSet.none,
          child: child,
        ),
      ),
      isTrue,
    );
  });

  test('every state-tracking component reads the scope', () {
    // Components that track interaction state without needing a declaration,
    // each with the reason it does not need one.
    const exempt = <String, String>{
      'lib/src/components/scroll_area/scroll_area.dart':
          'Its hover only reveals the auto-hiding scrollbar, which the parity '
          'scenarios already declare through the autoHide arg, and it paints '
          'no focus emphasis at all.',
    };
    final offenders = <String>[];
    for (final entry in Directory(
      'lib/src/components',
    ).listSync(recursive: true)) {
      if (entry is! File || !entry.path.endsWith('.dart')) continue;
      final source = entry.readAsStringSync();
      final tracksState =
          source.contains('resolveFocusVisible(') ||
          source.contains('_hovered');
      if (exempt.containsKey(entry.path)) continue;
      if (tracksState && !source.contains('TRForcedStatesMixin')) {
        // A part file inherits the mixin from the class it declares, so it is
        // enough that the owning library wires it.
        if (source.startsWith('part of ')) continue;
        offenders.add(entry.path);
      }
    }

    expect(
      offenders,
      isEmpty,
      reason:
          'a component that tracks interaction state but ignores the scope '
          'renders its rest appearance for every declared state, and the parity '
          'suite reports that as a match',
    );
    for (final entry in exempt.entries) {
      expect(
        File(entry.key).existsSync(),
        isTrue,
        reason: 'a stale exemption hides a component that is no longer wired',
      );
      expect(entry.value.trim().length, greaterThan(40));
    }
  });

  test('the modality override stays out of the library and the public API', () {
    final offenders = <String>[];
    for (final entry in Directory('lib/src').listSync(recursive: true)) {
      if (entry is! File || !entry.path.endsWith('.dart')) continue;
      if (entry.path.endsWith('internal/focus_source.dart')) continue;
      final source = entry.readAsStringSync();
      if (source.contains('debugSetKeyboardModality') ||
          source.contains('debugReset')) {
        offenders.add(entry.path);
      }
    }

    expect(
      offenders,
      isEmpty,
      reason: 'the override is for tests and the parity preview only',
    );
    expect(
      File('lib/tinyrack_ui.dart').readAsStringSync(),
      isNot(contains('src/internal')),
      reason: 'nothing in src/internal is part of the published surface',
    );
  });
}
