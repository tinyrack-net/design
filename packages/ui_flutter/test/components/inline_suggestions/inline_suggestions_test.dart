import 'package:material_ui/material_ui.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:tinyrack_ui/tinyrack_ui.dart';

const _paths = [
  TRInlineSuggestionItem(value: 'lib/app.dart', label: 'lib/app.dart'),
  TRInlineSuggestionItem(value: 'lib/main.dart', label: 'lib/main.dart'),
  TRInlineSuggestionItem(value: 'README.md', label: 'README.md'),
];

const _scrollingPaths = [
  TRInlineSuggestionItem(value: 'one', label: 'one'),
  TRInlineSuggestionItem(value: 'two', label: 'two'),
  TRInlineSuggestionItem(value: 'three', label: 'three'),
  TRInlineSuggestionItem(value: 'four', label: 'four'),
  TRInlineSuggestionItem(value: 'five', label: 'five'),
];

/// A host that owns its field exactly the way a real caller does.
class _Host extends StatefulWidget {
  const _Host({
    this.items = _paths,
    this.open = true,
    this.status = TRInlineSuggestionsStatus.ready,
    this.sessionKey,
    this.autoHighlight = true,
    this.acceptOnEnter = true,
    this.acceptOnTab = true,
    this.controller,
    this.onSelected,
    this.onDismissed,
    this.onHighlightChange,
    this.maxVisibleItems = 8,
    this.width = 320,
  });

  final List<TRInlineSuggestionItem<String>> items;
  final bool open;
  final TRInlineSuggestionsStatus status;
  final Object? sessionKey;
  final bool autoHighlight;
  final bool acceptOnEnter;
  final bool acceptOnTab;
  final TRInlineSuggestionsController<String>? controller;
  final ValueChanged<TRInlineSuggestionItem<String>>? onSelected;
  final VoidCallback? onDismissed;
  final ValueChanged<int>? onHighlightChange;
  final int maxVisibleItems;
  final double width;

  @override
  State<_Host> createState() => _HostState();
}

class _HostState extends State<_Host> {
  late final TRInlineSuggestionsController<String> _suggestions =
      widget.controller ?? TRInlineSuggestionsController<String>();
  final TextEditingController _text = TextEditingController();
  final FocusNode _focus = FocusNode();

  /// Keys the overlay did not consume, in order, so a test can prove that a
  /// host's own Enter-to-send still runs.
  final List<LogicalKeyboardKey> fellThrough = <LogicalKeyboardKey>[];

  @override
  void dispose() {
    if (widget.controller == null) _suggestions.dispose();
    _text.dispose();
    _focus.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) => TRInlineSuggestions<String>(
    items: widget.items,
    open: widget.open,
    status: widget.status,
    sessionKey: widget.sessionKey,
    controller: _suggestions,
    autoHighlight: widget.autoHighlight,
    acceptOnEnter: widget.acceptOnEnter,
    acceptOnTab: widget.acceptOnTab,
    maxVisibleItems: widget.maxVisibleItems,
    onSelected: widget.onSelected ?? (_) {},
    onDismissed: widget.onDismissed,
    onHighlightChange: widget.onHighlightChange,
    child: Focus(
      onKeyEvent: (node, event) {
        if (_suggestions.handleKeyEvent(event) == KeyEventResult.handled) {
          return KeyEventResult.handled;
        }
        if (event is KeyDownEvent) fellThrough.add(event.logicalKey);
        return KeyEventResult.ignored;
      },
      child: SizedBox(
        width: widget.width,
        child: TRTextField(
          controller: _text,
          focusNode: _focus,
          minLines: 1,
          maxLines: 8,
          appearance: TRFieldAppearance.ghost,
        ),
      ),
    ),
  );
}

Widget _app(Widget child) => MaterialApp(
  theme: TinyrackTheme.light(),
  home: Scaffold(body: Center(child: child)),
);

Future<void> _press(WidgetTester tester, LogicalKeyboardKey key) async {
  await tester.sendKeyEvent(key);
  await tester.pumpAndSettle();
}

Future<_HostState> _pump(WidgetTester tester, _Host host) async {
  await tester.pumpWidget(_app(host));
  await tester.pumpAndSettle();
  final state = tester.state<_HostState>(find.byType(_Host));
  await tester.tap(find.byType(TRTextField));
  await tester.pumpAndSettle();
  return state;
}

Finder _scrollArea() => find.descendant(
  of: find.byType(TRInlineSuggestions<String>),
  matching: find.byType(TRScrollArea),
);

Finder _row(String label) => find.descendant(
  of: find.byType(TRInlineSuggestions<String>),
  matching: find.text(label),
);

void main() {
  testWidgets('rows inherit comfortable density from the anchored field', (
    tester,
  ) async {
    await tester.pumpWidget(
      _app(
        const TRUiDensityScope(
          density: TRUiDensity.comfortable,
          child: _Host(),
        ),
      ),
    );
    await tester.pumpAndSettle();
    await tester.tap(find.byType(TRTextField));
    await tester.pumpAndSettle();

    final row = find.ancestor(
      of: _row('lib/app.dart'),
      matching: find.byType(MenuItemButton),
    );
    expect(tester.getSize(row).height, TRControlMetrics.heightOf(TRUiSize.lg));
    expect(
      tester
          .widget<MenuItemButton>(row)
          .style
          ?.textStyle
          ?.resolve({})
          ?.fontSize,
      TRControlMetrics.fontSizeOf(TRUiSize.lg),
    );
  });

  testWidgets('renders the host field and nothing else while closed', (
    tester,
  ) async {
    await _pump(tester, const _Host(open: false));

    expect(find.byType(TRTextField), findsOneWidget);
    expect(_row('lib/app.dart'), findsNothing);
  });

  testWidgets('lists every item once open', (tester) async {
    await _pump(tester, const _Host());

    for (final item in _paths) {
      expect(_row(item.label), findsOneWidget);
    }
  });

  testWidgets('keeps focus in the host field', (tester) async {
    final state = await _pump(tester, const _Host());

    expect(state._focus.hasFocus, isTrue);
  });

  testWidgets('arms the first item so Enter commits without arrowing', (
    tester,
  ) async {
    final selected = <String>[];
    await _pump(tester, _Host(onSelected: (item) => selected.add(item.value)));

    await _press(tester, LogicalKeyboardKey.enter);

    expect(selected, <String>['lib/app.dart']);
  });

  testWidgets('arrow keys move the highlight and wrap', (tester) async {
    final highlights = <int>[];
    await _pump(tester, _Host(onHighlightChange: highlights.add));

    await _press(tester, LogicalKeyboardKey.arrowDown);
    await _press(tester, LogicalKeyboardKey.arrowDown);
    await _press(tester, LogicalKeyboardKey.arrowDown);

    expect(highlights.last, 0);

    await _press(tester, LogicalKeyboardKey.arrowUp);

    expect(highlights.last, _paths.length - 1);
  });

  testWidgets('keyboard and controller highlights scroll into view', (
    tester,
  ) async {
    final controller = TRInlineSuggestionsController<String>();
    addTearDown(controller.dispose);
    await _pump(
      tester,
      _Host(items: _scrollingPaths, maxVisibleItems: 2, controller: controller),
    );

    Rect viewport() => tester.getRect(_scrollArea());
    Rect row(String label) => tester.getRect(_row(label));
    bool isVisible(String label) {
      final bounds = row(label);
      final visibleBounds = viewport();
      return bounds.top >= visibleBounds.top &&
          bounds.bottom <= visibleBounds.bottom;
    }

    expect(isVisible('one'), isTrue);
    expect(isVisible('five'), isFalse);

    await _press(tester, LogicalKeyboardKey.end);
    expect(controller.highlightedItem?.value, 'five');
    expect(isVisible('five'), isTrue);

    controller.highlightFirst();
    await tester.pumpAndSettle();
    expect(isVisible('one'), isTrue);

    await _press(tester, LogicalKeyboardKey.arrowUp);
    expect(controller.highlightedItem?.value, 'five');
    expect(isVisible('five'), isTrue);
  });

  testWidgets('session resets and reordered results scroll into view', (
    tester,
  ) async {
    final controller = TRInlineSuggestionsController<String>();
    addTearDown(controller.dispose);
    await tester.pumpWidget(
      _app(
        _Host(
          items: _scrollingPaths,
          maxVisibleItems: 2,
          sessionKey: 'first',
          controller: controller,
        ),
      ),
    );
    await tester.pumpAndSettle();
    await tester.tap(find.byType(TRTextField));
    await tester.pumpAndSettle();

    Rect viewport() => tester.getRect(_scrollArea());
    bool isVisible(String label) {
      final bounds = tester.getRect(_row(label));
      final visibleBounds = viewport();
      return bounds.top >= visibleBounds.top &&
          bounds.bottom <= visibleBounds.bottom;
    }

    controller.highlightLast();
    await tester.pumpAndSettle();
    expect(isVisible('five'), isTrue);

    await tester.pumpWidget(
      _app(
        _Host(
          items: const <TRInlineSuggestionItem<String>>[
            TRInlineSuggestionItem(value: 'five', label: 'five'),
            TRInlineSuggestionItem(value: 'one', label: 'one'),
            TRInlineSuggestionItem(value: 'two', label: 'two'),
            TRInlineSuggestionItem(value: 'three', label: 'three'),
            TRInlineSuggestionItem(value: 'four', label: 'four'),
          ],
          maxVisibleItems: 2,
          sessionKey: 'first',
          controller: controller,
        ),
      ),
    );
    await tester.pumpAndSettle();
    expect(controller.highlightedItem?.value, 'five');
    expect(isVisible('five'), isTrue);

    controller.highlightLast();
    await tester.pumpAndSettle();
    await tester.pumpWidget(
      _app(
        _Host(
          items: _scrollingPaths,
          maxVisibleItems: 2,
          sessionKey: 'second',
          controller: controller,
        ),
      ),
    );
    await tester.pumpAndSettle();
    expect(controller.highlightedItem?.value, 'one');
    expect(isVisible('one'), isTrue);
  });

  testWidgets('Tab commits the highlighted item', (tester) async {
    final selected = <String>[];
    await _pump(tester, _Host(onSelected: (item) => selected.add(item.value)));

    await _press(tester, LogicalKeyboardKey.arrowDown);
    await _press(tester, LogicalKeyboardKey.tab);

    expect(selected, <String>['lib/main.dart']);
  });

  testWidgets('a tap commits the item it names', (tester) async {
    final selected = <String>[];
    await _pump(tester, _Host(onSelected: (item) => selected.add(item.value)));

    await tester.tap(_row('README.md'));
    await tester.pumpAndSettle();

    expect(selected, <String>['README.md']);
  });

  testWidgets('Escape dismisses and reports it to the host', (tester) async {
    var dismissed = 0;
    final state = await _pump(tester, _Host(onDismissed: () => dismissed += 1));

    await _press(tester, LogicalKeyboardKey.escape);

    expect(dismissed, 1);
    expect(state._suggestions.isOpen, isFalse);
    expect(_row('lib/app.dart'), findsNothing);
  });

  testWidgets('a dismissed list stays closed until the session changes', (
    tester,
  ) async {
    await tester.pumpWidget(_app(const _Host(sessionKey: 'first')));
    await tester.pumpAndSettle();
    await tester.tap(find.byType(TRTextField));
    await tester.pumpAndSettle();
    await _press(tester, LogicalKeyboardKey.escape);

    expect(_row('lib/app.dart'), findsNothing);

    await tester.pumpWidget(_app(const _Host(sessionKey: 'second')));
    await tester.pumpAndSettle();

    expect(_row('lib/app.dart'), findsOneWidget);
  });

  testWidgets('keys the overlay ignores fall through to the host', (
    tester,
  ) async {
    final state = await _pump(tester, const _Host(open: false));

    await _press(tester, LogicalKeyboardKey.enter);

    expect(state.fellThrough, contains(LogicalKeyboardKey.enter));
  });

  testWidgets('Enter falls through when nothing is armed', (tester) async {
    final state = await _pump(tester, const _Host(autoHighlight: false));

    await _press(tester, LogicalKeyboardKey.enter);

    expect(state.fellThrough, contains(LogicalKeyboardKey.enter));
  });

  testWidgets('a held modifier leaves the key to the host', (tester) async {
    final selected = <String>[];
    final state = await _pump(
      tester,
      _Host(onSelected: (item) => selected.add(item.value)),
    );

    // Shift+Enter opens a line and Control+Enter submits in the hosts this
    // exists for; neither may be taken as a commit.
    for (final modifier in <LogicalKeyboardKey>[
      LogicalKeyboardKey.shiftLeft,
      LogicalKeyboardKey.controlLeft,
      LogicalKeyboardKey.altLeft,
      LogicalKeyboardKey.metaLeft,
    ]) {
      await tester.sendKeyDownEvent(modifier);
      await tester.sendKeyEvent(LogicalKeyboardKey.enter);
      await tester.sendKeyUpEvent(modifier);
      await tester.pumpAndSettle();
    }

    expect(selected, isEmpty);
    expect(
      state.fellThrough.where((key) => key == LogicalKeyboardKey.enter),
      hasLength(4),
    );
  });

  testWidgets('Shift+Tab is left to the host as well', (tester) async {
    final selected = <String>[];
    final state = await _pump(
      tester,
      _Host(onSelected: (item) => selected.add(item.value)),
    );

    await tester.sendKeyDownEvent(LogicalKeyboardKey.shiftLeft);
    await tester.sendKeyEvent(LogicalKeyboardKey.tab);
    await tester.sendKeyUpEvent(LogicalKeyboardKey.shiftLeft);
    await tester.pumpAndSettle();

    expect(selected, isEmpty);
    expect(state.fellThrough, contains(LogicalKeyboardKey.tab));
  });

  testWidgets('Shift+arrow leaves the text selection alone', (tester) async {
    final highlights = <int>[];
    await _pump(tester, _Host(onHighlightChange: highlights.add));

    await tester.sendKeyDownEvent(LogicalKeyboardKey.shiftLeft);
    await tester.sendKeyEvent(LogicalKeyboardKey.arrowDown);
    await tester.sendKeyUpEvent(LogicalKeyboardKey.shiftLeft);
    await tester.pumpAndSettle();

    expect(highlights, isEmpty);
  });

  testWidgets('acceptOnEnter false leaves Enter to the host', (tester) async {
    final selected = <String>[];
    final state = await _pump(
      tester,
      _Host(
        acceptOnEnter: false,
        onSelected: (item) => selected.add(item.value),
      ),
    );

    await _press(tester, LogicalKeyboardKey.enter);

    expect(selected, isEmpty);
    expect(state.fellThrough, contains(LogicalKeyboardKey.enter));
  });

  testWidgets('acceptOnTab false leaves Tab to the host', (tester) async {
    final selected = <String>[];
    await _pump(
      tester,
      _Host(acceptOnTab: false, onSelected: (item) => selected.add(item.value)),
    );

    await _press(tester, LogicalKeyboardKey.tab);

    expect(selected, isEmpty);
  });

  testWidgets('navigation skips a disabled item', (tester) async {
    final selected = <String>[];
    await _pump(
      tester,
      _Host(
        items: const [
          TRInlineSuggestionItem(value: 'first', label: 'First'),
          TRInlineSuggestionItem(
            value: 'blocked',
            label: 'Blocked',
            enabled: false,
          ),
          TRInlineSuggestionItem(value: 'third', label: 'Third'),
        ],
        onSelected: (item) => selected.add(item.value),
      ),
    );

    await _press(tester, LogicalKeyboardKey.arrowDown);
    await _press(tester, LogicalKeyboardKey.enter);

    expect(selected, <String>['third']);
  });

  testWidgets('an all-disabled list commits nothing', (tester) async {
    final selected = <String>[];
    final state = await _pump(
      tester,
      _Host(
        items: const [
          TRInlineSuggestionItem(
            value: 'blocked',
            label: 'Blocked',
            enabled: false,
          ),
        ],
        onSelected: (item) => selected.add(item.value),
      ),
    );

    await _press(tester, LogicalKeyboardKey.enter);

    expect(selected, isEmpty);
    expect(state.fellThrough, contains(LogicalKeyboardKey.enter));
  });

  testWidgets('shows a description, hint, and tag on a row', (tester) async {
    await _pump(
      tester,
      const _Host(
        items: [
          TRInlineSuggestionItem(
            value: 'review',
            label: 'review',
            description: 'Reviews the working diff.',
            hint: '<path>',
            tag: 'project',
          ),
        ],
      ),
    );

    expect(_row('review'), findsOneWidget);
    expect(_row('Reviews the working diff.'), findsOneWidget);
    expect(_row('<path>'), findsOneWidget);
    expect(_row('project'), findsOneWidget);
  });

  testWidgets('an empty ready list shows the empty label', (tester) async {
    await _pump(tester, const _Host(items: <TRInlineSuggestionItem<String>>[]));

    expect(_row('No matches'), findsOneWidget);
  });

  testWidgets('a loading list with no results shows the loading label', (
    tester,
  ) async {
    await tester.pumpWidget(
      _app(
        const _Host(
          items: <TRInlineSuggestionItem<String>>[],
          status: TRInlineSuggestionsStatus.loading,
        ),
      ),
    );
    await tester.pump();

    expect(_row('Loading'), findsOneWidget);
  });

  testWidgets('a loading list keeps the results it already has', (
    tester,
  ) async {
    await tester.pumpWidget(
      _app(const _Host(status: TRInlineSuggestionsStatus.loading)),
    );
    await tester.pump();

    expect(_row('lib/app.dart'), findsOneWidget);
    expect(_row('Loading'), findsOneWidget);
  });

  testWidgets('an error shows the error label', (tester) async {
    await _pump(
      tester,
      const _Host(
        items: <TRInlineSuggestionItem<String>>[],
        status: TRInlineSuggestionsStatus.error,
      ),
    );

    expect(_row('Could not load suggestions'), findsOneWidget);
  });

  testWidgets('a new session resets the highlight to the first item', (
    tester,
  ) async {
    final controller = TRInlineSuggestionsController<String>();
    addTearDown(controller.dispose);
    await tester.pumpWidget(
      _app(_Host(controller: controller, sessionKey: 'first')),
    );
    await tester.pumpAndSettle();
    await tester.tap(find.byType(TRTextField));
    await tester.pumpAndSettle();
    await _press(tester, LogicalKeyboardKey.arrowDown);

    expect(controller.highlightIndex, 1);

    await tester.pumpWidget(
      _app(_Host(controller: controller, sessionKey: 'second')),
    );
    await tester.pumpAndSettle();

    expect(controller.highlightIndex, 0);
  });

  testWidgets('late results for the same session keep the highlighted value', (
    tester,
  ) async {
    final controller = TRInlineSuggestionsController<String>();
    addTearDown(controller.dispose);
    await tester.pumpWidget(
      _app(_Host(controller: controller, sessionKey: 'same')),
    );
    await tester.pumpAndSettle();
    await tester.tap(find.byType(TRTextField));
    await tester.pumpAndSettle();
    await _press(tester, LogicalKeyboardKey.arrowDown);

    expect(controller.highlightedItem?.value, 'lib/main.dart');

    // A slower search returns the same file at a different position.
    await tester.pumpWidget(
      _app(
        _Host(
          controller: controller,
          sessionKey: 'same',
          items: const [
            TRInlineSuggestionItem(value: 'docs/guide.md', label: 'guide'),
            TRInlineSuggestionItem(value: 'README.md', label: 'README.md'),
            TRInlineSuggestionItem(value: 'lib/main.dart', label: 'main'),
          ],
        ),
      ),
    );
    await tester.pumpAndSettle();

    expect(controller.highlightedItem?.value, 'lib/main.dart');
    expect(controller.highlightIndex, 2);
  });

  testWidgets('a value that disappeared falls back to the first item', (
    tester,
  ) async {
    final controller = TRInlineSuggestionsController<String>();
    addTearDown(controller.dispose);
    await tester.pumpWidget(
      _app(_Host(controller: controller, sessionKey: 'same')),
    );
    await tester.pumpAndSettle();
    await tester.tap(find.byType(TRTextField));
    await tester.pumpAndSettle();
    await _press(tester, LogicalKeyboardKey.arrowDown);

    await tester.pumpWidget(
      _app(
        _Host(
          controller: controller,
          sessionKey: 'same',
          items: const [
            TRInlineSuggestionItem(value: 'other.dart', label: 'other.dart'),
          ],
        ),
      ),
    );
    await tester.pumpAndSettle();

    expect(controller.highlightIndex, 0);
  });

  testWidgets('the surface follows the anchor width by default', (
    tester,
  ) async {
    await _pump(tester, const _Host(width: 420));
    final wide = tester.getSize(_scrollArea()).width;

    await tester.pumpWidget(_app(const _Host(width: 240)));
    await tester.pumpAndSettle();
    final narrow = tester.getSize(_scrollArea()).width;

    expect(wide, greaterThan(narrow));
    expect(wide, lessThanOrEqualTo(420));
    expect(narrow, greaterThan(240 / 2));
  });

  testWidgets('names the popup for assistive technology', (tester) async {
    final handle = tester.ensureSemantics();
    await _pump(tester, const _Host());

    expect(find.bySemanticsLabel('Suggestions'), findsOneWidget);
    handle.dispose();
  });

  testWidgets('reads correctly in dark mode', (tester) async {
    await tester.pumpWidget(
      MaterialApp(
        theme: TinyrackTheme.dark(),
        home: const Scaffold(body: Center(child: _Host())),
      ),
    );
    await tester.pumpAndSettle();

    expect(_row('lib/app.dart'), findsOneWidget);
  });

  testWidgets('survives a large text scale without overflowing', (
    tester,
  ) async {
    await tester.pumpWidget(
      MaterialApp(
        theme: TinyrackTheme.light(),
        home: const MediaQuery(
          data: MediaQueryData(textScaler: TextScaler.linear(2)),
          child: Scaffold(body: Center(child: _Host())),
        ),
      ),
    );
    await tester.pumpAndSettle();

    expect(tester.takeException(), isNull);
    expect(_row('lib/app.dart'), findsOneWidget);
  });

  testWidgets('a controller reports and drives the highlight directly', (
    tester,
  ) async {
    final controller = TRInlineSuggestionsController<String>();
    addTearDown(controller.dispose);
    await _pump(tester, _Host(controller: controller));

    expect(controller.isOpen, isTrue);
    expect(controller.highlightedItem?.value, 'lib/app.dart');

    controller.highlightLast();
    await tester.pumpAndSettle();
    expect(controller.highlightedItem?.value, 'README.md');

    controller.highlightFirst();
    await tester.pumpAndSettle();
    expect(controller.highlightIndex, 0);

    expect(controller.commitHighlighted(), isTrue);
  });
}
