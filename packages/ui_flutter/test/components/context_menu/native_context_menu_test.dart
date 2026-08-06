import 'package:flutter/foundation.dart';
import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:tinyrack_ui/tinyrack_ui.dart';

/// Stands in for the desktop embedder, recording the menu it was handed and
/// answering with the entry the user would have chosen.
final class _FakeSystemMenu {
  _FakeSystemMenu(this.channel, {this.choose, this.missing = false}) {
    TestDefaultBinaryMessengerBinding.instance.defaultBinaryMessenger
        .setMockMethodCallHandler(channel, (call) async {
          if (missing) throw MissingPluginException(call.method);
          calls.add(call);
          return choose;
        });
  }

  final MethodChannel channel;

  /// The entry id the fake system menu reports, or `null` for a dismissal.
  final String? choose;

  /// Whether to behave like a build that never registered the plugin.
  final bool missing;

  final calls = <MethodCall>[];

  Map<Object?, Object?> get arguments =>
      calls.single.arguments as Map<Object?, Object?>;

  List<Object?> get items => arguments['items']! as List<Object?>;

  void dispose() => TestDefaultBinaryMessengerBinding
      .instance
      .defaultBinaryMessenger
      .setMockMethodCallHandler(channel, null);
}

const _channel = MethodChannel('net.tinyrack.ui/native_menu.test');

Future<void> _pumpMenu(
  WidgetTester tester, {
  required List<TRMenuElement> items,
  MethodChannel channel = _channel,
}) => tester.pumpWidget(
  MaterialApp(
    theme: TinyrackTheme.light(),
    home: Scaffold(
      body: TRContextMenuPresenterScope(
        presenter: TRNativeContextMenuPresenter(channel: channel),
        child: TRContextMenu.items(
          items: items,
          child: const SizedBox(width: 100, height: 40, child: Text('Target')),
        ),
      ),
    ),
  ),
);

/// Runs [body] as [platform].
///
/// The override has to be restored inside the test body, because the binding
/// checks it before any `tearDown` runs.
void _testOnPlatform(
  String description,
  TargetPlatform platform,
  Future<void> Function(WidgetTester tester) body,
) => testWidgets(description, (tester) async {
  debugDefaultTargetPlatformOverride = platform;
  try {
    await body(tester);
  } finally {
    debugDefaultTargetPlatformOverride = null;
  }
});

Future<void> _secondaryTap(WidgetTester tester) async {
  await tester.tapAt(
    tester.getCenter(find.text('Target')),
    buttons: kSecondaryMouseButton,
  );
  await tester.pumpAndSettle();
}

void main() {
  group('on a platform with a system menu', () {
    _testOnPlatform(
      'hands the described menu to the platform',
      TargetPlatform.linux,
      (tester) async {
        final system = _FakeSystemMenu(_channel);
        addTearDown(system.dispose);

        await _pumpMenu(
          tester,
          items: const <TRMenuElement>[
            TRMenuActionElement(
              id: 'copy',
              title: 'Copy',
              shortcut: SingleActivator(
                LogicalKeyboardKey.keyC,
                control: true,
                shift: true,
              ),
              onPressed: _noop,
            ),
            TRMenuSeparatorElement(),
            TRMenuActionElement(
              id: 'paste',
              title: 'Paste',
              enabled: false,
              onPressed: _noop,
            ),
            TRMenuActionElement(
              id: 'wrap',
              title: 'Wrap lines',
              checked: true,
              onPressed: _noop,
            ),
            TRMenuSubmenuElement(
              title: 'More',
              children: <TRMenuElement>[
                TRMenuActionElement(
                  id: 'clear',
                  title: 'Clear',
                  onPressed: _noop,
                ),
              ],
            ),
          ],
        );
        final target = tester.getCenter(find.text('Target'));
        await _secondaryTap(tester);

        expect(system.calls.single.method, 'showContextMenu');
        expect(system.arguments['x'], target.dx);
        expect(system.arguments['y'], target.dy);
        expect(system.arguments['devicePixelRatio'], isA<double>());
        expect(system.items, hasLength(5));

        final copy = system.items.first! as Map<Object?, Object?>;
        expect(copy['type'], 'action');
        expect(copy['id'], 'copy');
        expect(copy['title'], 'Copy');
        expect(copy['enabled'], isTrue);
        expect(copy['checked'], isNull);
        expect(copy['shortcut'], <String, Object?>{
          'character': 'C',
          'control': true,
          'shift': true,
          'alt': false,
          'meta': false,
        });

        expect(
          (system.items[1]! as Map<Object?, Object?>)['type'],
          'separator',
        );
        expect(
          (system.items[2]! as Map<Object?, Object?>)['enabled'],
          isFalse,
          reason: 'the platform draws the disabled state itself',
        );
        expect((system.items[3]! as Map<Object?, Object?>)['checked'], isTrue);

        final submenu = system.items.last! as Map<Object?, Object?>;
        expect(submenu['type'], 'submenu');
        expect(submenu['title'], 'More');
        expect(submenu['children'], hasLength(1));

        expect(
          find.byType(TRMenuItem),
          findsNothing,
          reason: 'the system drew the menu, so Flutter drew none',
        );
      },
    );

    _testOnPlatform(
      'invokes the entry the platform reports, including a '
      'nested one',
      TargetPlatform.linux,
      (tester) async {
        final system = _FakeSystemMenu(_channel, choose: 'clear');
        addTearDown(system.dispose);
        var cleared = 0;

        await _pumpMenu(
          tester,
          items: <TRMenuElement>[
            const TRMenuActionElement(
              id: 'copy',
              title: 'Copy',
              onPressed: _noop,
            ),
            TRMenuSubmenuElement(
              title: 'More',
              children: <TRMenuElement>[
                TRMenuActionElement(
                  id: 'clear',
                  title: 'Clear',
                  onPressed: () => cleared += 1,
                ),
              ],
            ),
          ],
        );
        await _secondaryTap(tester);

        expect(cleared, 1);
      },
    );

    _testOnPlatform(
      'invokes nothing when the platform reports a dismissal',
      TargetPlatform.linux,
      (tester) async {
        final system = _FakeSystemMenu(_channel);
        addTearDown(system.dispose);
        var pressed = 0;

        await _pumpMenu(
          tester,
          items: <TRMenuElement>[
            TRMenuActionElement(
              id: 'copy',
              title: 'Copy',
              onPressed: () => pressed += 1,
            ),
          ],
        );
        await _secondaryTap(tester);

        expect(pressed, 0);
      },
    );

    _testOnPlatform(
      'never invokes a disabled entry the platform reported '
      'anyway',
      TargetPlatform.linux,
      (tester) async {
        final system = _FakeSystemMenu(_channel, choose: 'paste');
        addTearDown(system.dispose);
        var pressed = 0;

        await _pumpMenu(
          tester,
          items: <TRMenuElement>[
            TRMenuActionElement(
              id: 'paste',
              title: 'Paste',
              enabled: false,
              onPressed: () => pressed += 1,
            ),
          ],
        );
        await _secondaryTap(tester);

        expect(pressed, 0);
      },
    );

    _testOnPlatform(
      'draws the Tinyrack menu when the plugin is not registered',
      TargetPlatform.linux,
      (tester) async {
        final system = _FakeSystemMenu(_channel, missing: true);
        addTearDown(system.dispose);

        await _pumpMenu(
          tester,
          items: const <TRMenuElement>[
            TRMenuActionElement(id: 'copy', title: 'Copy', onPressed: _noop),
          ],
        );
        await _secondaryTap(tester);

        expect(find.text('Copy'), findsOneWidget);
        expect(find.byType(TRMenuItem), findsOneWidget);
      },
    );
  });

  group('on a platform without a system menu', () {
    _testOnPlatform(
      'draws the Tinyrack menu without calling the platform',
      TargetPlatform.android,
      (tester) async {
        final system = _FakeSystemMenu(_channel);
        addTearDown(system.dispose);

        await _pumpMenu(
          tester,
          items: const <TRMenuElement>[
            TRMenuActionElement(id: 'copy', title: 'Copy', onPressed: _noop),
          ],
        );
        await tester.longPress(find.text('Target'));
        await tester.pumpAndSettle();

        expect(system.calls, isEmpty);
        expect(find.byType(TRMenuItem), findsOneWidget);
      },
    );
  });

  test('the presenter defaults to the published channel', () {
    expect(
      const TRNativeContextMenuPresenter().channel.name,
      'net.tinyrack.ui/native_menu',
    );
  });
}

void _noop() {}
