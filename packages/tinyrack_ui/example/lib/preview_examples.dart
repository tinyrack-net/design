import 'package:flutter/material.dart';
import 'package:tinyrack_ui/tinyrack_ui.dart';

/// Builds one curated docs example from public Tinyrack widgets.
///
/// Each builder composes shipped widgets into a fixed combination (an intent
/// row, a size scale, a real content recipe) so the docs can show more than the
/// single canonical widget the playground renders. Examples are static: they
/// take no playground args and only follow the app theme.
typedef PreviewExampleBuilder =
    Widget Function(BuildContext context, Locale locale);

/// The named example scenarios the docs can request via `?example=<id>`.
///
/// Keys mirror the `flutterExamples` entry ids on the homepage; a missing key
/// surfaces as a schema error in the preview host.
const previewExampleScenarios = <String, PreviewExampleBuilder>{
  'button-intents': _buttonIntents,
  'button-sizes': _buttonSizes,
  'button-states': _buttonStates,
  'alert-variants': _alertVariants,
  'alert-actions': _alertActions,
  'badge-variants': _badgeVariants,
  'badge-sizes': _badgeSizes,
  'card-variants': _cardVariants,
  'card-recipe': _cardRecipe,
  'tabs-sizes': _tabsSizes,
  'tabs-recipe': _tabsRecipe,
  'checkbox-group-options': _checkboxGroupOptions,
  'checkbox-group-disabled': _checkboxGroupDisabled,
  'menu-settings': _menuSettings,
  'menu-submenu': _menuSubmenu,
  'select-controlled': _selectControlled,
  'select-form': _selectForm,
  'dialog-result': _dialogResult,
  'dialog-nested-layers': _dialogNestedLayers,
};

String _pick(Locale locale, String en, String ko, String ja) =>
    switch (locale.languageCode) {
      'ko' => ko,
      'ja' => ja,
      _ => en,
    };

const _intents = <(TRIntent, String)>[
  (TRIntent.neutral, 'Neutral'),
  (TRIntent.primary, 'Primary'),
  (TRIntent.info, 'Info'),
  (TRIntent.success, 'Success'),
  (TRIntent.warning, 'Warning'),
  (TRIntent.danger, 'Danger'),
];

const _statusVariants = <(TRStatusVariant, String)>[
  (TRStatusVariant.neutral, 'Neutral'),
  (TRStatusVariant.info, 'Info'),
  (TRStatusVariant.success, 'Success'),
  (TRStatusVariant.warning, 'Warning'),
  (TRStatusVariant.danger, 'Danger'),
];

Widget _buttonIntents(BuildContext context, Locale locale) {
  return Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    mainAxisSize: MainAxisSize.min,
    spacing: TRSpacing.medium,
    children: [
      for (final appearance in TRAppearance.values)
        Wrap(
          spacing: TRSpacing.small,
          runSpacing: TRSpacing.small,
          children: [
            for (final (intent, label) in _intents)
              TRButton(
                appearance: appearance,
                intent: intent,
                onPressed: () {},
                child: Text(label),
              ),
          ],
        ),
    ],
  );
}

Widget _buttonSizes(BuildContext context, Locale locale) {
  return Wrap(
    crossAxisAlignment: WrapCrossAlignment.center,
    spacing: TRSpacing.small,
    runSpacing: TRSpacing.small,
    children: [
      for (final (size, label) in const [
        (TRUiSize.sm, 'Small'),
        (TRUiSize.md, 'Medium'),
        (TRUiSize.lg, 'Large'),
      ])
        TRButton(
          intent: TRIntent.primary,
          uiSize: size,
          onPressed: () {},
          child: Text(label),
        ),
    ],
  );
}

Widget _buttonStates(BuildContext context, Locale locale) {
  final loadingLabel = _pick(locale, 'Loading', '불러오는 중', '読み込み中');
  return Wrap(
    crossAxisAlignment: WrapCrossAlignment.center,
    spacing: TRSpacing.small,
    runSpacing: TRSpacing.small,
    children: [
      TRButton(
        intent: TRIntent.primary,
        onPressed: () {},
        child: Text(_pick(locale, 'Default', '기본', '既定')),
      ),
      TRButton(
        intent: TRIntent.primary,
        loading: true,
        loadingLabel: loadingLabel,
        onPressed: () {},
        child: Text(_pick(locale, 'Saving', '저장 중', '保存中')),
      ),
      const TRButton(
        intent: TRIntent.primary,
        onPressed: null,
        child: Text('Disabled'),
      ),
    ],
  );
}

Widget _alertIcon(TRStatusVariant variant) => Icon(switch (variant) {
  TRStatusVariant.success => Icons.check_circle_outline,
  TRStatusVariant.warning => Icons.warning_amber_outlined,
  TRStatusVariant.danger => Icons.error_outline,
  TRStatusVariant.info => Icons.info_outline,
  TRStatusVariant.neutral => Icons.notifications_none,
}, size: 20);

Widget _alertVariants(BuildContext context, Locale locale) {
  return SizedBox(
    width: 360,
    child: Column(
      mainAxisSize: MainAxisSize.min,
      spacing: TRSpacing.medium,
      children: [
        for (final (variant, label) in _statusVariants)
          TRAlert(
            variant: variant,
            icon: _alertIcon(variant),
            title: Text(label),
          ),
      ],
    ),
  );
}

Widget _alertActions(BuildContext context, Locale locale) {
  return SizedBox(
    width: 360,
    child: TRAlert(
      variant: TRStatusVariant.success,
      icon: _alertIcon(TRStatusVariant.success),
      title: Text(_pick(locale, 'Changes saved', '변경 사항을 저장했어요', '変更を保存しました')),
      description: Text(
        _pick(
          locale,
          'The rack configuration is up to date.',
          '랙 구성이 최신 상태예요.',
          'ラック構成は最新です。',
        ),
      ),
      actions: [
        TRButton(
          appearance: TRAppearance.ghost,
          intent: TRIntent.success,
          uiSize: TRUiSize.sm,
          onPressed: () {},
          child: Text(_pick(locale, 'Review', '검토', '確認')),
        ),
      ],
    ),
  );
}

Widget _badgeVariants(BuildContext context, Locale locale) {
  return Wrap(
    spacing: TRSpacing.small,
    runSpacing: TRSpacing.small,
    children: [
      for (final (variant, label) in _statusVariants)
        TRBadge(variant: variant, child: Text(label)),
    ],
  );
}

Widget _badgeSizes(BuildContext context, Locale locale) {
  return Wrap(
    crossAxisAlignment: WrapCrossAlignment.center,
    spacing: TRSpacing.small,
    runSpacing: TRSpacing.small,
    children: [
      for (final (size, label) in const [
        (TRUiSize.sm, 'Small'),
        (TRUiSize.md, 'Medium'),
        (TRUiSize.lg, 'Large'),
      ])
        TRBadge(
          variant: TRStatusVariant.success,
          uiSize: size,
          child: Text(label),
        ),
    ],
  );
}

Widget _cardVariants(BuildContext context, Locale locale) {
  final body = _pick(
    locale,
    '4 services are healthy.',
    '서비스 4개가 정상이에요.',
    'サービス 4 件が正常です。',
  );
  return Wrap(
    spacing: TRSpacing.medium,
    runSpacing: TRSpacing.medium,
    children: [
      for (final (variant, label) in const [
        (TRCardVariant.defaultVariant, 'Default'),
        (TRCardVariant.outlined, 'Outlined'),
        (TRCardVariant.elevated, 'Elevated'),
      ])
        SizedBox(
          width: 200,
          child: TRCard(
            variant: variant,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              spacing: TRSpacing.small,
              children: [
                TRCardTitle(child: Text(label)),
                TRText(body, variant: TRTextVariant.bodySm),
              ],
            ),
          ),
        ),
    ],
  );
}

Widget _cardRecipe(BuildContext context, Locale locale) {
  return SizedBox(
    width: 320,
    child: TRCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        spacing: TRSpacing.medium,
        children: [
          TRCardHeader(
            children: [
              TRCardTitle(
                child: Text(_pick(locale, 'Rack alpha', '랙 알파', 'ラック alpha')),
              ),
              TRCardDescription(
                child: Text(
                  _pick(
                    locale,
                    '4 services are healthy.',
                    '서비스 4개가 정상이에요.',
                    'サービス 4 件が正常です。',
                  ),
                ),
              ),
            ],
          ),
          const TRCardContent(
            child: TRText('Latency 18 ms', variant: TRTextVariant.bodySm),
          ),
          TRCardFooter(
            children: [
              TRButton(
                appearance: TRAppearance.ghost,
                uiSize: TRUiSize.sm,
                onPressed: () {},
                child: Text(_pick(locale, 'Details', '자세히', '詳細')),
              ),
              TRButton(
                intent: TRIntent.primary,
                uiSize: TRUiSize.sm,
                onPressed: () {},
                child: Text(_pick(locale, 'Restart', '재시작', '再起動')),
              ),
            ],
          ),
        ],
      ),
    ),
  );
}

List<TRTabsTab> _settingsTabs(Locale locale) => [
  TRTabsTab(value: 'overview', label: _pick(locale, 'Overview', '개요', '概要')),
  TRTabsTab(value: 'metrics', label: _pick(locale, 'Metrics', '지표', '指標')),
  TRTabsTab(value: 'settings', label: _pick(locale, 'Settings', '설정', '設定')),
];

Widget _settingsPanel(Locale locale, String value) {
  final text = switch (value) {
    'metrics' => _pick(
      locale,
      'Latency 18 ms across 4 racks.',
      '랙 4개 전반 지연 시간이 18 ms예요.',
      '4 ラック全体で遅延は 18 ms です。',
    ),
    'settings' => _pick(
      locale,
      'Deploy targets and access are configurable here.',
      '배포 대상과 접근 권한을 여기에서 설정해요.',
      'デプロイ先とアクセス権をここで設定します。',
    ),
    _ => _pick(
      locale,
      'The rack configuration is up to date.',
      '랙 구성이 최신 상태예요.',
      'ラック構成は最新です。',
    ),
  };
  return TRText(text, variant: TRTextVariant.bodySm);
}

Widget _tabsSizes(BuildContext context, Locale locale) {
  return SizedBox(
    width: 320,
    child: Column(
      mainAxisSize: MainAxisSize.min,
      spacing: TRSpacing.large,
      children: [
        for (final size in TRUiSize.values)
          TRTabs(
            defaultValue: 'overview',
            uiSize: size,
            tabs: _settingsTabs(locale),
            panelBuilder: (value) => _settingsPanel(locale, value),
          ),
      ],
    ),
  );
}

Widget _tabsRecipe(BuildContext context, Locale locale) {
  return SizedBox(
    width: 320,
    child: TRTabs(
      defaultValue: 'metrics',
      tabs: _settingsTabs(locale),
      panelBuilder: (value) => _settingsPanel(locale, value),
    ),
  );
}

Widget _checkboxOption(String value, String label) {
  return Row(
    mainAxisSize: MainAxisSize.min,
    spacing: TRSpacing.small,
    children: [
      TRCheckbox(value: value),
      TRText(label, variant: TRTextVariant.bodySm),
    ],
  );
}

Widget _checkboxGroupOptions(BuildContext context, Locale locale) {
  return TRCheckboxGroup(
    value: const ['telemetry'],
    children: [
      _checkboxOption(
        'telemetry',
        _pick(locale, 'Share telemetry', '텔레메트리 공유', 'テレメトリを共有'),
      ),
      _checkboxOption(
        'newsletter',
        _pick(locale, 'Release notes', '릴리스 노트', 'リリースノート'),
      ),
      _checkboxOption('beta', _pick(locale, 'Beta features', '베타 기능', 'ベータ機能')),
    ],
  );
}

Widget _checkboxGroupDisabled(BuildContext context, Locale locale) {
  return TRCheckboxGroup(
    disabled: true,
    value: const ['telemetry'],
    children: [
      _checkboxOption(
        'telemetry',
        _pick(locale, 'Share telemetry', '텔레메트리 공유', 'テレメトリを共有'),
      ),
      _checkboxOption(
        'newsletter',
        _pick(locale, 'Release notes', '릴리스 노트', 'リリースノート'),
      ),
    ],
  );
}

Widget _menuSettings(BuildContext context, Locale locale) {
  var showGrid = true;
  var density = 'comfortable';
  return StatefulBuilder(
    builder: (context, setState) => TRMenu(
      trigger: Text(_pick(locale, 'View settings', '보기 설정', '表示設定')),
      menuChildren: [
        TRMenuGroupLabel(child: Text(_pick(locale, 'Layout', '레이아웃', 'レイアウト'))),
        TRMenuCheckboxItem(
          value: showGrid,
          onChanged: (value) => setState(() => showGrid = value ?? false),
          child: Text(_pick(locale, 'Show grid', '격자 표시', 'グリッドを表示')),
        ),
        TRMenuRadioItem<String>(
          value: 'compact',
          groupValue: density,
          onChanged: (value) => setState(() => density = value!),
          child: Text(_pick(locale, 'Compact', '좁게', 'コンパクト')),
        ),
        TRMenuRadioItem<String>(
          value: 'comfortable',
          groupValue: density,
          onChanged: (value) => setState(() => density = value!),
          child: Text(_pick(locale, 'Comfortable', '여유롭게', 'ゆったり')),
        ),
      ],
    ),
  );
}

Widget _menuSubmenu(BuildContext context, Locale locale) => TRMenu(
  trigger: Text(_pick(locale, 'Actions', '작업', '操作')),
  menuChildren: [
    TRMenuItem(
      onPressed: () {},
      child: Text(_pick(locale, 'Duplicate', '복제', '複製')),
    ),
    const TRMenuSeparator(),
    TRMenuSubmenu(
      menuChildren: [
        TRMenuItem(
          onPressed: () {},
          child: Text(_pick(locale, 'Archive', '보관', 'アーカイブ')),
        ),
        TRMenuItem(
          onPressed: () {},
          child: Text(_pick(locale, 'Delete', '삭제', '削除')),
        ),
      ],
      child: Text(_pick(locale, 'More', '더 보기', 'その他')),
    ),
  ],
);

Widget _selectControlled(BuildContext context, Locale locale) {
  String? channel = 'stable';
  return StatefulBuilder(
    builder: (context, setState) => SizedBox(
      width: 320,
      child: TRSelect<String>.controlled(
        value: channel,
        label: _pick(locale, 'Release channel', '릴리스 채널', 'リリースチャンネル'),
        items: [
          TRSelectItem(
            value: 'stable',
            label: _pick(locale, 'Stable', '안정', '安定版'),
          ),
          TRSelectItem(
            value: 'beta',
            label: _pick(locale, 'Beta', '베타', 'ベータ'),
          ),
        ],
        onValueChange: (value) => setState(() => channel = value),
      ),
    ),
  );
}

Widget _selectForm(BuildContext context, Locale locale) => SizedBox(
  width: 320,
  child: Form(
    child: TRSelectFormField<String>(
      label: _pick(locale, 'Environment', '환경', '環境'),
      placeholder: _pick(locale, 'Choose one', '하나 선택', '選択してください'),
      items: [
        TRSelectItem(
          value: 'production',
          label: _pick(locale, 'Production', '프로덕션', '本番'),
        ),
        TRSelectItem(
          value: 'staging',
          label: _pick(locale, 'Staging', '스테이징', 'ステージング'),
        ),
      ],
      validator: (value) => value == null
          ? _pick(locale, 'Choose an environment', '환경을 선택하세요', '環境を選択してください')
          : null,
    ),
  ),
);

Widget _dialogResult(BuildContext context, Locale locale) => TRButton(
  intent: TRIntent.primary,
  onPressed: () async {
    await showTRDialog<bool>(
      context: context,
      builder: (dialogContext) => TRDialog(
        title: Text(
          _pick(locale, 'Deploy rack?', '랙을 배포할까요?', 'ラックをデプロイしますか？'),
        ),
        description: Text(
          _pick(
            locale,
            'The stable channel will be updated.',
            '안정 채널이 업데이트돼요.',
            '安定版チャンネルが更新されます。',
          ),
        ),
        actions: Wrap(
          spacing: TRSpacing.small,
          children: [
            TRButton(
              appearance: TRAppearance.ghost,
              onPressed: () => Navigator.pop(dialogContext, false),
              child: Text(_pick(locale, 'Cancel', '취소', 'キャンセル')),
            ),
            TRButton(
              intent: TRIntent.primary,
              onPressed: () => Navigator.pop(dialogContext, true),
              child: Text(_pick(locale, 'Deploy', '배포', 'デプロイ')),
            ),
          ],
        ),
      ),
    );
  },
  child: Text(_pick(locale, 'Open dialog', '다이얼로그 열기', 'ダイアログを開く')),
);

Widget _dialogNestedLayers(BuildContext context, Locale locale) => TRButton(
  onPressed: () => showTRDialog<void>(
    context: context,
    builder: (dialogContext) => TRDialog(
      placement: TRDialogPlacement.end,
      title: Text(_pick(locale, 'Deployment settings', '배포 설정', 'デプロイ設定')),
      content: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        spacing: TRSpacing.medium,
        children: [
          TRSelect<String>(
            defaultValue: 'stable',
            label: _pick(locale, 'Channel', '채널', 'チャンネル'),
            items: const [
              TRSelectItem(value: 'stable', label: 'Stable'),
              TRSelectItem(value: 'beta', label: 'Beta'),
            ],
          ),
          TRMenu(
            trigger: Text(_pick(locale, 'Advanced', '고급', '詳細設定')),
            menuChildren: [
              TRMenuItem(
                onPressed: () {},
                child: Text(_pick(locale, 'View logs', '로그 보기', 'ログを表示')),
              ),
            ],
          ),
        ],
      ),
      actions: TRButton(
        onPressed: () => Navigator.pop(dialogContext),
        child: Text(_pick(locale, 'Done', '완료', '完了')),
      ),
    ),
  ),
  child: Text(_pick(locale, 'Open settings', '설정 열기', '設定を開く')),
);
