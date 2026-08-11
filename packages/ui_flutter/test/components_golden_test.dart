import 'dart:ui';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:lucide_flutter/lucide_flutter.dart';
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

  for (final themeCase in <(String, ThemeData)>[
    ('light', TinyrackTheme.light()),
    ('dark', TinyrackTheme.dark()),
  ]) {
    testWidgets('fixed tabs preserve their ${themeCase.$1} hovered seam', (
      tester,
    ) async {
      await _loadPackageFontAliases();
      _useTolerantGoldenComparator();
      await tester.binding.setSurfaceSize(const Size(520, 100));
      addTearDown(() => tester.binding.setSurfaceSize(null));

      await tester.pumpWidget(
        _goldenApp(
          theme: themeCase.$2,
          child: MediaQuery(
            data: const MediaQueryData(disableAnimations: true),
            child: SizedBox(
              width: 520,
              child: TRTabs(
                tabWidth: TRTabsWidth.fixed,
                tabs: const <TRTabsTab>[
                  TRTabsTab(value: 'overview', label: 'Overview'),
                  TRTabsTab(value: 'settings', label: 'Settings'),
                ],
              ),
            ),
          ),
        ),
      );

      final mouse = await tester.createGesture(kind: PointerDeviceKind.mouse);
      addTearDown(mouse.removePointer);
      await mouse.addPointer(location: Offset.zero);
      await mouse.moveTo(
        tester.getCenter(
          find.byKey(const ValueKey<String>('tr-tabs-tab-overview')),
        ),
      );
      await tester.pump();

      await expectLater(
        find.byType(MaterialApp),
        matchesGoldenFile('goldens/tabs-${themeCase.$1}-hover.png'),
      );
    });
  }

  for (final themeCase in <(String, ThemeData)>[
    ('light', TinyrackTheme.light()),
    ('dark', TinyrackTheme.dark()),
  ]) {
    for (final localeCase in _chatLocales.entries) {
      testWidgets(
        'chat primitives preserve ${themeCase.$1} ${localeCase.key} appearance',
        (tester) async {
          await _loadPackageFontAliases();
          _useTolerantGoldenComparator();
          await tester.binding.setSurfaceSize(const Size(480, 360));
          addTearDown(() => tester.binding.setSurfaceSize(null));
          final strings = localeCase.value;

          await tester.pumpWidget(
            MaterialApp(
              debugShowCheckedModeBanner: false,
              locale: Locale(localeCase.key),
              theme: themeCase.$2,
              home: Scaffold(
                body: Padding(
                  padding: const EdgeInsets.all(TRSpacing.large),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      TRChatUserBubble(child: Text(strings.user)),
                      TRChatMessageRow(
                        icon: LucideIcons.bot,
                        tone: TRChatMessageTone.primary,
                        child: Text(strings.assistant),
                      ),
                      TRChatToolDisclosure(
                        icon: LucideIcons.terminal,
                        label: strings.tool,
                        secondaryLabel: strings.detail,
                        status: TRChatToolStatus.running,
                        statusLabel: strings.running,
                        details: TRCodeBlock(code: strings.detail),
                      ),
                      TRChatStatusRow(
                        label: strings.running,
                        status: TRChatToolStatus.running,
                      ),
                    ],
                  ),
                ),
              ),
            ),
          );
          await tester.pump(TRMotion.loading * 0.5);
          await expectLater(
            find.byType(MaterialApp),
            matchesGoldenFile(
              'goldens/chat-${localeCase.key}-${themeCase.$1}.png',
            ),
          );
        },
      );
    }
  }

  for (final themeCase in <(String, ThemeData)>[
    ('light', TinyrackTheme.light()),
    ('dark', TinyrackTheme.dark()),
  ]) {
    for (final localeCase in _layerLocales.entries) {
      testWidgets(
        'open layers preserve ${themeCase.$1} ${localeCase.key} appearance',
        (tester) async {
          await _loadPackageFontAliases();
          _useTolerantGoldenComparator();
          await tester.binding.setSurfaceSize(const Size(520, 360));
          addTearDown(() => tester.binding.setSurfaceSize(null));

          final language = localeCase.key;
          final strings = localeCase.value;
          await tester.pumpWidget(
            _goldenApp(
              theme: themeCase.$2,
              child: Center(
                child: TRMenu(
                  trigger: Text(strings.menuTrigger),
                  menuChildren: [
                    TRMenuCheckboxItem(
                      value: true,
                      onChanged: (_) {},
                      child: Text(strings.menuChecked),
                    ),
                    TRMenuItem(
                      onPressed: () {},
                      child: Text(strings.menuCommand),
                    ),
                  ],
                ),
              ),
            ),
          );
          await tester.tap(find.text(strings.menuTrigger));
          await tester.pumpAndSettle();
          await expectLater(
            find.byType(MaterialApp),
            matchesGoldenFile(
              'goldens/layers-$language-${themeCase.$1}-menu-open.png',
            ),
          );

          await tester.pumpWidget(
            _goldenApp(
              theme: themeCase.$2,
              child: Center(
                child: SizedBox(
                  width: 280,
                  child: TRSelect<String>(
                    label: strings.selectLabel,
                    placeholder: strings.selectPlaceholder,
                    items: [
                      TRSelectItem(value: 'first', label: strings.selectFirst),
                      TRSelectItem(
                        value: 'second',
                        label: strings.selectSecond,
                      ),
                    ],
                  ),
                ),
              ),
            ),
          );
          await tester.tap(find.text(strings.selectPlaceholder));
          await tester.pumpAndSettle();
          await expectLater(
            find.byType(MaterialApp),
            matchesGoldenFile(
              'goldens/layers-$language-${themeCase.$1}-select-open.png',
            ),
          );

          await tester.pumpWidget(
            _goldenApp(
              theme: themeCase.$2,
              child: Center(
                child: SizedBox(
                  width: 280,
                  // A distinct key retires the previous scene's select instead
                  // of handing this one a state that is already open, which a
                  // tap would then close.
                  child: TRSelect<String>(
                    key: const ValueKey('searchable-select'),
                    label: strings.selectLabel,
                    placeholder: strings.selectPlaceholder,
                    searchable: true,
                    searchPlaceholder: strings.selectSearch,
                    items: [
                      TRSelectItem(value: 'first', label: strings.selectFirst),
                      TRSelectItem(
                        value: 'second',
                        label: strings.selectSecond,
                      ),
                    ],
                  ),
                ),
              ),
            ),
          );
          await tester.tap(find.text(strings.selectPlaceholder));
          await tester.pumpAndSettle();
          await expectLater(
            find.byType(MaterialApp),
            matchesGoldenFile(
              'goldens/layers-$language-${themeCase.$1}-select-search.png',
            ),
          );

          await tester.pumpWidget(
            _goldenApp(
              theme: themeCase.$2,
              child: Builder(
                builder: (context) => TRButton(
                  onPressed: () => showTRDialog<void>(
                    context: context,
                    builder: (_) => TRDialog(
                      title: Text(strings.dialogTitle),
                      description: Text(strings.dialogDescription),
                      actions: TRButton(
                        onPressed: () {},
                        child: Text(strings.dialogAction),
                      ),
                    ),
                  ),
                  child: Text(strings.dialogTrigger),
                ),
              ),
            ),
          );
          await tester.tap(find.text(strings.dialogTrigger));
          await tester.pumpAndSettle();
          await expectLater(
            find.byType(MaterialApp),
            matchesGoldenFile(
              'goldens/layers-$language-${themeCase.$1}-dialog-open.png',
            ),
          );
        },
      );
    }
  }

  // The sheet surface needs a viewport a select would actually pick it for, and
  // that is the view's own metrics rather than the render surface: `MediaQuery`
  // is built from the view, so `setSurfaceSize` alone would leave the select
  // reading the default 800 logical pixels and opening a dropdown.
  for (final themeCase in <(String, ThemeData)>[
    ('light', TinyrackTheme.light()),
    ('dark', TinyrackTheme.dark()),
  ]) {
    for (final localeCase in _layerLocales.entries) {
      testWidgets(
        'a select sheet preserves ${themeCase.$1} ${localeCase.key} appearance',
        (tester) async {
          await _loadPackageFontAliases();
          _useTolerantGoldenComparator();
          tester.view.devicePixelRatio = 1;
          tester.view.physicalSize = const Size(360, 520);
          tester.view.padding = const FakeViewPadding(top: 24, bottom: 34);
          addTearDown(tester.view.reset);

          final language = localeCase.key;
          final strings = localeCase.value;
          await tester.pumpWidget(
            _goldenApp(
              theme: themeCase.$2,
              child: Align(
                alignment: Alignment.topCenter,
                child: TRSelect<String>(
                  label: strings.selectLabel,
                  placeholder: strings.selectPlaceholder,
                  searchable: true,
                  searchPlaceholder: strings.selectSearch,
                  items: [
                    TRSelectItem(value: 'first', label: strings.selectFirst),
                    TRSelectItem(value: 'second', label: strings.selectSecond),
                  ],
                ),
              ),
            ),
          );
          await tester.tap(find.text(strings.selectPlaceholder));
          await tester.pumpAndSettle();
          await expectLater(
            find.byType(MaterialApp),
            matchesGoldenFile(
              'goldens/layers-$language-${themeCase.$1}-select-sheet.png',
            ),
          );
        },
      );
    }
  }
}

var _packageFontAliasesLoaded = false;

Future<void> _loadPackageFontAliases() async {
  if (_packageFontAliasesLoaded) return;
  const fonts = <String, List<String>>{
    'IBMPlexSans': [
      'IBMPlexSans-Regular.otf',
      'IBMPlexSans-SemiBold.otf',
      'IBMPlexSans-Bold.otf',
    ],
    'IBMPlexSansKR': [
      'IBMPlexSansKR-Regular.otf',
      'IBMPlexSansKR-SemiBold.otf',
      'IBMPlexSansKR-Bold.otf',
    ],
    'IBMPlexSansJP': [
      'IBMPlexSansJP-Regular.otf',
      'IBMPlexSansJP-SemiBold.otf',
      'IBMPlexSansJP-Bold.otf',
    ],
    'IBMPlexMono': ['IBMPlexMono-Regular.otf', 'IBMPlexMono-Medium.otf'],
  };
  for (final family in fonts.entries) {
    final loader = FontLoader('packages/tinyrack_ui/${family.key}');
    for (final asset in family.value) {
      loader.addFont(rootBundle.load('assets/fonts/$asset'));
    }
    await loader.load();
  }
  final lucideLoader = FontLoader('packages/lucide_flutter/LucideIcons')
    ..addFont(rootBundle.load('packages/lucide_flutter/assets/lucide.ttf'));
  await lucideLoader.load();
  _packageFontAliasesLoaded = true;
}

Widget _goldenApp({required ThemeData theme, required Widget child}) {
  return MaterialApp(
    debugShowCheckedModeBanner: false,
    theme: theme,
    home: Scaffold(body: child),
  );
}

void _useTolerantGoldenComparator() {
  final previousGoldenFileComparator = goldenFileComparator;
  goldenFileComparator = _TolerantGoldenFileComparator(
    Uri.parse('test/components_golden_test.dart'),
    precisionTolerance: _goldenPrecisionTolerance,
  );
  addTearDown(() => goldenFileComparator = previousGoldenFileComparator);
}

const _chatLocales = <String, _ChatStrings>{
  'en': _ChatStrings(
    user: 'Please run the tests.',
    assistant: 'I am checking the changes.',
    tool: 'Run command',
    failed: 'Failed',
    detail:
        r'$ flutter test'
        '\nOne test failed.',
    running: 'Running',
  ),
  'ko': _ChatStrings(
    user: '테스트를 실행해 주세요.',
    assistant: '변경 사항을 확인하고 있어요.',
    tool: '명령 실행',
    failed: '실패',
    detail:
        r'$ flutter test'
        '\n테스트 하나가 실패했어요.',
    running: '실행 중',
  ),
  'ja': _ChatStrings(
    user: 'テストを実行してください。',
    assistant: '変更内容を確認しています。',
    tool: 'コマンドを実行',
    failed: '失敗',
    detail:
        r'$ flutter test'
        '\nテストが 1 件失敗しました。',
    running: '実行中',
  ),
};

final class _ChatStrings {
  const _ChatStrings({
    required this.user,
    required this.assistant,
    required this.tool,
    required this.failed,
    required this.detail,
    required this.running,
  });

  final String user;
  final String assistant;
  final String tool;
  final String failed;
  final String detail;
  final String running;
}

const _layerLocales = <String, _LayerStrings>{
  'en': _LayerStrings(
    menuTrigger: 'View options',
    menuChecked: 'Show grid',
    menuCommand: 'Reset layout',
    selectLabel: 'Region',
    selectPlaceholder: 'Choose a region',
    selectFirst: 'Korea',
    selectSecond: 'Japan',
    selectSearch: 'Search regions',
    dialogTrigger: 'Review changes',
    dialogTitle: 'Deploy changes?',
    dialogDescription: 'The latest settings will be applied.',
    dialogAction: 'Deploy',
  ),
  'ko': _LayerStrings(
    menuTrigger: '보기 옵션',
    menuChecked: '격자 표시',
    menuCommand: '레이아웃 초기화',
    selectLabel: '지역',
    selectPlaceholder: '지역 선택',
    selectFirst: '한국',
    selectSecond: '일본',
    selectSearch: '지역 검색',
    dialogTrigger: '변경 사항 검토',
    dialogTitle: '변경 사항을 배포할까요?',
    dialogDescription: '최신 설정이 적용됩니다.',
    dialogAction: '배포',
  ),
  'ja': _LayerStrings(
    menuTrigger: '表示オプション',
    menuChecked: 'グリッドを表示',
    menuCommand: 'レイアウトをリセット',
    selectLabel: '地域',
    selectPlaceholder: '地域を選択',
    selectFirst: '韓国',
    selectSecond: '日本',
    selectSearch: '地域を検索',
    dialogTrigger: '変更を確認',
    dialogTitle: '変更をデプロイしますか？',
    dialogDescription: '最新の設定が適用されます。',
    dialogAction: 'デプロイ',
  ),
};

final class _LayerStrings {
  const _LayerStrings({
    required this.menuTrigger,
    required this.menuChecked,
    required this.menuCommand,
    required this.selectLabel,
    required this.selectPlaceholder,
    required this.selectFirst,
    required this.selectSecond,
    required this.selectSearch,
    required this.dialogTrigger,
    required this.dialogTitle,
    required this.dialogDescription,
    required this.dialogAction,
  });

  final String menuTrigger;
  final String menuChecked;
  final String menuCommand;
  final String selectLabel;
  final String selectPlaceholder;
  final String selectFirst;
  final String selectSecond;
  final String selectSearch;
  final String dialogTrigger;
  final String dialogTitle;
  final String dialogDescription;
  final String dialogAction;
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
