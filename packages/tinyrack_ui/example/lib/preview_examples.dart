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
