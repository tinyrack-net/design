import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
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
  'code-contexts': _codeContexts,
  'animated-number-basic': _animatedNumberBasic,
  'animated-number-modes': _animatedNumberModes,
  'animated-number-formats': _animatedNumberFormats,
  'animated-number-direction': _animatedNumberDirection,
  'card-variants': _cardVariants,
  'card-recipe': _cardRecipe,
  'tabs-sizes': _tabsSizes,
  'tabs-recipe': _tabsRecipe,
  'checkbox-states': _checkboxStates,
  'checkbox-sizes': _checkboxSizes,
  'checkbox-availability': _checkboxAvailability,
  'checkbox-validation': _checkboxValidation,
  'checkbox-form-values': _checkboxFormValues,
  'checkbox-group-options': _checkboxGroupOptions,
  'checkbox-group-disabled': _checkboxGroupDisabled,
  'menu-settings': _menuSettings,
  'menu-submenu': _menuSubmenu,
  'select-controlled': _selectControlled,
  'select-form': _selectForm,
  'dialog-result': _dialogResult,
  'dialog-nested-layers': _dialogNestedLayers,
  'alert-dialog-result': _alertDialogResult,
  'alert-dialog-states': _alertDialogStates,
  'popover-nested-menu': _popoverNestedMenu,
  'autocomplete-modes': _autocompleteModes,
  'autocomplete-async': _autocompleteAsync,
  'autocomplete-states': _autocompleteStates,
  'autocomplete-controller': _autocompleteController,
  'autocomplete-form': _autocompleteForm,
  'autocomplete-keyboard': _autocompleteKeyboard,
  'combobox-form': _comboboxForm,
  'app-shell-navigation': _appShellNavigation,
  'toast-track': _toastTrack,
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

Widget _animatedNumberBasic(BuildContext context, Locale locale) {
  var value = 1248.0;
  return StatefulBuilder(
    builder: (context, setState) => Column(
      mainAxisSize: MainAxisSize.min,
      spacing: TRSpacing.medium,
      children: [
        TRAnimatedNumber(
          value: value,
          style: Theme.of(context).textTheme.displaySmall,
        ),
        Row(
          mainAxisSize: MainAxisSize.min,
          spacing: TRSpacing.small,
          children: [
            TRButton(
              appearance: TRAppearance.outline,
              onPressed: () => setState(() => value -= 125),
              child: Text(_pick(locale, 'Decrease', '감소', '減らす')),
            ),
            TRButton(
              onPressed: () => setState(() => value += 125),
              child: Text(_pick(locale, 'Increase', '증가', '増やす')),
            ),
          ],
        ),
      ],
    ),
  );
}

Widget _animatedNumberModes(BuildContext context, Locale locale) {
  var value = 42.0;
  return StatefulBuilder(
    builder: (context, setState) => Column(
      mainAxisSize: MainAxisSize.min,
      spacing: TRSpacing.medium,
      children: [
        Row(
          mainAxisSize: MainAxisSize.min,
          spacing: TRSpacing.large,
          children: [
            for (final animation in TRAnimatedNumberAnimation.values)
              Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  TRAnimatedNumber(
                    animation: animation,
                    value: value,
                    style: Theme.of(context).textTheme.headlineMedium,
                  ),
                  TRText(animation.name, variant: TRTextVariant.bodySm),
                ],
              ),
          ],
        ),
        TRButton(
          onPressed: () => setState(() => value = value == 42 ? 867 : 42),
          child: Text(_pick(locale, 'Update values', '값 바꾸기', '値を変更')),
        ),
      ],
    ),
  );
}

Widget _animatedNumberFormats(BuildContext context, Locale locale) {
  var value = 1234.5;
  final localeName = locale.toString();
  return StatefulBuilder(
    builder: (context, setState) => Column(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.start,
      spacing: TRSpacing.medium,
      children: [
        TRAnimatedNumber(
          numberFormat: NumberFormat.simpleCurrency(
            locale: localeName,
            name: 'USD',
          ),
          value: value,
        ),
        TRAnimatedNumber(
          numberFormat: NumberFormat.percentPattern(localeName)
            ..maximumFractionDigits = 1,
          value: value * 0.0001,
        ),
        TRAnimatedNumber(
          formatter: (number) =>
              '${NumberFormat.decimalPattern(localeName).format(number)} GB',
          value: value,
        ),
        TRButton(
          onPressed: () =>
              setState(() => value = value == 1234.5 ? 9876.5 : 1234.5),
          child: Text(_pick(locale, 'Update values', '값 바꾸기', '値を変更')),
        ),
      ],
    ),
  );
}

Widget _animatedNumberDirection(BuildContext context, Locale locale) {
  var value = 10.0;
  return StatefulBuilder(
    builder: (context, setState) => Column(
      mainAxisSize: MainAxisSize.min,
      spacing: TRSpacing.medium,
      children: [
        Row(
          mainAxisSize: MainAxisSize.min,
          spacing: TRSpacing.large,
          children: [
            for (final direction in const [
              TRAnimatedNumberRollDirection.up,
              TRAnimatedNumberRollDirection.down,
            ])
              Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  TRAnimatedNumber(
                    rollDirection: direction,
                    value: value,
                    style: Theme.of(context).textTheme.headlineMedium,
                  ),
                  TRText(direction.name, variant: TRTextVariant.bodySm),
                ],
              ),
          ],
        ),
        TRButton(
          onPressed: () => setState(() => value = value == 10 ? 90 : 10),
          child: Text(_pick(locale, 'Update values', '값 바꾸기', '値を変更')),
        ),
      ],
    ),
  );
}

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

Widget _codeContexts(BuildContext context, Locale locale) {
  return Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    mainAxisSize: MainAxisSize.min,
    spacing: TRSpacing.medium,
    children: [
      Wrap(
        crossAxisAlignment: WrapCrossAlignment.center,
        children: [
          Text(_pick(locale, 'Import ', '가져오기: ', 'インポート: ')),
          const TRCode('package:tinyrack_ui/tinyrack_ui.dart'),
        ],
      ),
      Wrap(
        crossAxisAlignment: WrapCrossAlignment.center,
        children: [
          Text(_pick(locale, 'Set ', '설정: ', '設定: ')),
          const TRCode('themeMode: ThemeMode.dark'),
        ],
      ),
      const SizedBox(
        width: 256,
        child: TRCode(
          'very-long-rack-identifier-with-overflow-safe-wrapping-01',
        ),
      ),
      DefaultTextStyle.merge(
        style: const TextStyle(fontSize: 20),
        child: const TRCode('pnpm test\npnpm verify'),
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

Widget _checkboxSample({
  required String label,
  bool checked = false,
  bool disabled = false,
  bool indeterminate = false,
  bool readOnly = false,
  TRUiSize uiSize = TRUiSize.md,
}) {
  return Column(
    mainAxisSize: MainAxisSize.min,
    spacing: TRSpacing.small,
    children: [
      TRText(label, variant: TRTextVariant.bodySm),
      TRCheckbox(
        defaultChecked: checked,
        disabled: disabled,
        indeterminate: indeterminate,
        readOnly: readOnly,
        semanticLabel: label,
        uiSize: uiSize,
      ),
    ],
  );
}

Widget _checkboxStates(BuildContext context, Locale locale) {
  return Wrap(
    crossAxisAlignment: WrapCrossAlignment.center,
    spacing: TRSpacing.large,
    runSpacing: TRSpacing.large,
    children: [
      _checkboxSample(label: _pick(locale, 'Unchecked', '선택 안 함', '未選択')),
      _checkboxSample(
        checked: true,
        label: _pick(locale, 'Checked', '선택함', '選択済み'),
      ),
      _checkboxSample(
        indeterminate: true,
        label: _pick(locale, 'Partially selected', '일부 선택', '一部選択'),
      ),
    ],
  );
}

Widget _checkboxSizes(BuildContext context, Locale locale) {
  return Wrap(
    crossAxisAlignment: WrapCrossAlignment.center,
    spacing: TRSpacing.large,
    runSpacing: TRSpacing.large,
    children: [
      for (final size in TRUiSize.values)
        _checkboxSample(checked: true, label: size.name, uiSize: size),
    ],
  );
}

Widget _checkboxAvailability(BuildContext context, Locale locale) {
  return Wrap(
    crossAxisAlignment: WrapCrossAlignment.center,
    spacing: TRSpacing.large,
    runSpacing: TRSpacing.large,
    children: [
      _checkboxSample(
        checked: true,
        label: _pick(locale, 'Editable', '편집 가능', '編集可能'),
      ),
      _checkboxSample(
        checked: true,
        label: _pick(locale, 'Read only', '읽기 전용', '読み取り専用'),
        readOnly: true,
      ),
      _checkboxSample(
        checked: true,
        disabled: true,
        label: _pick(locale, 'Disabled', '사용 불가', '無効'),
      ),
    ],
  );
}

Widget _checkboxValidation(BuildContext context, Locale locale) =>
    _CheckboxValidationExample(locale: locale);

class _CheckboxValidationExample extends StatefulWidget {
  const _CheckboxValidationExample({required this.locale});

  final Locale locale;

  @override
  State<_CheckboxValidationExample> createState() =>
      _CheckboxValidationExampleState();
}

class _CheckboxValidationExampleState
    extends State<_CheckboxValidationExample> {
  final _formKey = GlobalKey<FormState>();
  bool _attempted = false;
  bool _checked = false;

  @override
  Widget build(BuildContext context) {
    final label = _pick(
      widget.locale,
      'Accept the maintenance window',
      '유지보수 시간에 동의',
      'メンテナンス時間帯に同意する',
    );
    final error = _pick(
      widget.locale,
      'Accept the maintenance window to continue.',
      '계속하려면 유지보수 시간에 동의하세요.',
      '続行するにはメンテナンス時間帯に同意してください。',
    );
    return Form(
      key: _formKey,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        spacing: TRSpacing.medium,
        children: [
          Row(
            mainAxisSize: MainAxisSize.min,
            spacing: TRSpacing.small,
            children: [
              TRCheckboxFormField(
                onCheckedChange: (checked) =>
                    setState(() => _checked = checked),
                semanticLabel: label,
                validator: (checked) => checked == true ? null : error,
              ),
              TRText(label, variant: TRTextVariant.bodySm),
            ],
          ),
          if (_attempted && !_checked)
            TRText(
              error,
              color: TRTextColor.danger,
              variant: TRTextVariant.caption,
            ),
          TRButton(
            onPressed: () {
              setState(() => _attempted = true);
              _formKey.currentState?.validate();
            },
            child: Text(_pick(widget.locale, 'Continue', '계속', '続行')),
          ),
        ],
      ),
    );
  }
}

Widget _checkboxFormValues(BuildContext context, Locale locale) =>
    _CheckboxFormValuesExample(locale: locale);

class _CheckboxFormValuesExample extends StatefulWidget {
  const _CheckboxFormValuesExample({required this.locale});

  final Locale locale;

  @override
  State<_CheckboxFormValuesExample> createState() =>
      _CheckboxFormValuesExampleState();
}

class _CheckboxFormValuesExampleState
    extends State<_CheckboxFormValuesExample> {
  final _formKey = GlobalKey<TRFormState>();
  String _result = '';

  @override
  Widget build(BuildContext context) {
    final label = _pick(widget.locale, 'Monitoring', '모니터링', 'モニタリング');
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisSize: MainAxisSize.min,
      spacing: TRSpacing.medium,
      children: [
        TRForm(
          key: _formKey,
          child: Row(
            mainAxisSize: MainAxisSize.min,
            spacing: TRSpacing.small,
            children: [
              TRCheckboxFormField(
                name: 'monitoring',
                checkedValue: 'enabled',
                uncheckedValue: 'disabled',
                semanticLabel: label,
              ),
              TRText(label, variant: TRTextVariant.bodySm),
            ],
          ),
        ),
        TRButton(
          onPressed: () => setState(() {
            _result = '${_formKey.currentState?.save()['monitoring'] ?? ''}';
          }),
          child: Text(_pick(widget.locale, 'Read value', '값 읽기', '値を確認')),
        ),
        if (_result.isNotEmpty)
          TRText(
            '${_pick(widget.locale, 'Submitted', '제출한 값', '送信値')}: $_result',
            variant: TRTextVariant.bodySm,
          ),
      ],
    );
  }
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

Widget _alertDialogResult(BuildContext context, Locale locale) =>
    _AlertDialogResultExample(locale: locale);

class _AlertDialogResultExample extends StatefulWidget {
  const _AlertDialogResultExample({required this.locale});

  final Locale locale;

  @override
  State<_AlertDialogResultExample> createState() =>
      _AlertDialogResultExampleState();
}

class _AlertDialogResultExampleState extends State<_AlertDialogResultExample> {
  late String _result = _pick(
    widget.locale,
    'Rack not deleted',
    '랙을 삭제하지 않았어요',
    'ラックは削除されていません',
  );

  Future<void> _show() async {
    final confirmed = await showTRAlertDialog<bool>(
      context: context,
      builder: (dialogContext) => TRAlertDialog(
        title: Text(
          _pick(widget.locale, 'Delete rack?', '랙을 삭제할까요?', 'ラックを削除しますか？'),
        ),
        description: Text(
          _pick(
            widget.locale,
            'This action cannot be undone.',
            '이 작업은 되돌릴 수 없어요.',
            'この操作は取り消せません。',
          ),
        ),
        actions: [
          TRButton(
            appearance: TRAppearance.outline,
            onPressed: () => Navigator.pop(dialogContext, false),
            child: Text(_pick(widget.locale, 'Cancel', '취소', 'キャンセル')),
          ),
          TRButton(
            intent: TRIntent.danger,
            onPressed: () => Navigator.pop(dialogContext, true),
            child: Text(_pick(widget.locale, 'Delete rack', '랙 삭제', 'ラックを削除')),
          ),
        ],
      ),
    );
    if (!mounted) return;
    setState(() {
      _result = confirmed == true
          ? _pick(widget.locale, 'Rack deleted', '랙을 삭제했어요', 'ラックを削除しました')
          : _pick(widget.locale, 'Rack kept', '랙을 유지했어요', 'ラックを保持しました');
    });
  }

  @override
  Widget build(BuildContext context) => Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    mainAxisSize: MainAxisSize.min,
    spacing: TRSpacing.medium,
    children: [
      TRButton(
        intent: TRIntent.danger,
        onPressed: _show,
        child: Text(_pick(widget.locale, 'Delete rack', '랙 삭제', 'ラックを削除')),
      ),
      TRText(_result, variant: TRTextVariant.bodySm, color: TRTextColor.muted),
    ],
  );
}

Widget _alertDialogStates(BuildContext context, Locale locale) => SizedBox(
  width: 320,
  child: Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    spacing: TRSpacing.medium,
    children: [
      TRButton(
        intent: TRIntent.danger,
        onPressed: () => showTRAlertDialog<void>(
          context: context,
          builder: (dialogContext) => TRAlertDialog(
            title: Text(
              _pick(locale, 'Delete rack?', '랙을 삭제할까요?', 'ラックを削除しますか？'),
            ),
            description: Text(
              _pick(
                locale,
                'This action cannot be undone.',
                '이 작업은 되돌릴 수 없어요.',
                'この操作は取り消せません。',
              ),
            ),
            actions: [
              TRButton(
                appearance: TRAppearance.outline,
                onPressed: () => Navigator.pop(dialogContext),
                child: Text(_pick(locale, 'Cancel', '취소', 'キャンセル')),
              ),
              TRButton(
                intent: TRIntent.danger,
                onPressed: () => Navigator.pop(dialogContext),
                child: Text(_pick(locale, 'Delete rack', '랙 삭제', 'ラックを削除')),
              ),
            ],
          ),
        ),
        child: Text(
          _pick(
            locale,
            'Delete a rack with a very long mobile confirmation label',
            '모바일에서도 읽기 쉬운 긴 확인 레이블로 랙 삭제',
            'モバイルでも読みやすい長い確認ラベルでラックを削除',
          ),
        ),
      ),
      TRButton(
        intent: TRIntent.danger,
        onPressed: null,
        child: Text(
          _pick(locale, 'Deletion unavailable', '랙을 삭제할 수 없음', 'ラックを削除できません'),
        ),
      ),
    ],
  ),
);

Widget _popoverNestedMenu(BuildContext context, Locale locale) => TRPopover(
  title: Text(_pick(locale, 'Rack alpha', '랙 알파', 'ラック alpha')),
  description: Text(
    _pick(
      locale,
      '4 services are healthy.',
      '서비스 4개가 정상이에요.',
      'サービス 4 件が正常です。',
    ),
  ),
  trigger: TRButton(
    onPressed: null,
    child: Text(_pick(locale, 'View rack', '랙 보기', 'ラックを表示')),
  ),
  content: TRMenu(
    trigger: Text(_pick(locale, 'Actions', '작업', '操作')),
    menuChildren: [
      TRMenuItem(
        onPressed: () {},
        child: Text(_pick(locale, 'Open logs', '로그 열기', 'ログを開く')),
      ),
      TRMenuItem(
        onPressed: () {},
        child: Text(_pick(locale, 'Restart', '재시작', '再起動')),
      ),
    ],
  ),
);

const _autocompleteItems = [
  TRAutocompleteItem(value: 'seoul', label: 'Seoul'),
  TRAutocompleteItem(value: 'tokyo', label: 'Tokyo'),
  TRAutocompleteItem(value: 'virginia', label: 'Virginia'),
];

Widget _autocompleteModes(BuildContext context, Locale locale) => SizedBox(
  width: 520,
  child: Wrap(
    spacing: TRSpacing.medium,
    runSpacing: TRSpacing.medium,
    children: [
      for (final mode in TRAutocompleteCompletionMode.values)
        TRAutocomplete<String>(
          completionMode: mode,
          items: _autocompleteItems,
          label: mode.name,
          placeholder: _pick(locale, 'Type a region', '지역 입력', '地域を入力'),
          width: 248,
        ),
    ],
  ),
);

Widget _autocompleteAsync(BuildContext context, Locale locale) => SizedBox(
  width: 320,
  child: TRAutocomplete<String>(
    label: _pick(locale, 'Remote region', '원격 지역', 'リモート地域'),
    placeholder: _pick(locale, 'Search regions', '지역 검색', '地域を検索'),
    optionsBuilder: (query) async {
      await Future<void>.delayed(const Duration(milliseconds: 250));
      final normalized = query.toLowerCase();
      return _autocompleteItems.where(
        (item) => item.label.toLowerCase().contains(normalized),
      );
    },
  ),
);

Widget _autocompleteStates(BuildContext context, Locale locale) => SizedBox(
  width: 320,
  child: Column(
    mainAxisSize: MainAxisSize.min,
    spacing: TRSpacing.medium,
    children: [
      TRAutocomplete<String>(
        items: _autocompleteItems,
        label: _pick(locale, 'Compact', '좁게', 'コンパクト'),
        uiSize: TRUiSize.sm,
      ),
      TRAutocomplete<String>(
        enabled: false,
        items: _autocompleteItems,
        label: _pick(locale, 'Unavailable', '사용 불가', '利用不可'),
      ),
      TRAutocomplete<String>(
        errorText: _pick(
          locale,
          'Choose a supported region',
          '지원하는 지역을 선택하세요',
          '対応地域を選択してください',
        ),
        items: _autocompleteItems,
        label: _pick(locale, 'Read only', '읽기 전용', '読み取り専用'),
        readOnly: true,
      ),
    ],
  ),
);

Widget _autocompleteController(BuildContext context, Locale locale) =>
    _AutocompleteControllerExample(locale: locale);

class _AutocompleteControllerExample extends StatefulWidget {
  const _AutocompleteControllerExample({required this.locale});

  final Locale locale;

  @override
  State<_AutocompleteControllerExample> createState() =>
      _AutocompleteControllerExampleState();
}

class _AutocompleteControllerExampleState
    extends State<_AutocompleteControllerExample> {
  late final TRAutocompleteController<String> _controller =
      TRAutocompleteController<String>();

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) => SizedBox(
    width: 320,
    child: Column(
      mainAxisSize: MainAxisSize.min,
      spacing: TRSpacing.medium,
      children: [
        TRAutocomplete<String>(
          controller: _controller,
          items: _autocompleteItems,
          label: _pick(widget.locale, 'Region', '지역', '地域'),
        ),
        AnimatedBuilder(
          animation: Listenable.merge([
            _controller,
            _controller.textEditingController,
          ]),
          builder: (context, child) => TRText(
            '${_controller.query} / ${_controller.value ?? '—'}',
            variant: TRTextVariant.bodySm,
          ),
        ),
        Align(
          alignment: AlignmentDirectional.centerStart,
          child: TRButton(
            appearance: TRAppearance.ghost,
            onPressed: _controller.clear,
            child: Text(_pick(widget.locale, 'Clear', '지우기', 'クリア')),
          ),
        ),
      ],
    ),
  );
}

Widget _autocompleteForm(BuildContext context, Locale locale) =>
    _AutocompleteFormExample(locale: locale);

class _AutocompleteFormExample extends StatefulWidget {
  const _AutocompleteFormExample({required this.locale});

  final Locale locale;

  @override
  State<_AutocompleteFormExample> createState() =>
      _AutocompleteFormExampleState();
}

class _AutocompleteFormExampleState extends State<_AutocompleteFormExample> {
  final _formKey = GlobalKey<FormState>();

  @override
  Widget build(BuildContext context) => SizedBox(
    width: 320,
    child: Form(
      key: _formKey,
      child: Column(
        mainAxisSize: MainAxisSize.min,
        spacing: TRSpacing.medium,
        children: [
          TRAutocompleteFormField<String>(
            items: _autocompleteItems,
            label: _pick(widget.locale, 'Region', '지역', '地域'),
            validator: (value) => value == null
                ? _pick(
                    widget.locale,
                    'Choose a region',
                    '지역을 선택하세요',
                    '地域を選択してください',
                  )
                : null,
          ),
          Align(
            alignment: AlignmentDirectional.centerStart,
            child: TRButton(
              onPressed: () => _formKey.currentState?.validate(),
              child: Text(_pick(widget.locale, 'Validate', '검증', '検証')),
            ),
          ),
        ],
      ),
    ),
  );
}

Widget _autocompleteKeyboard(BuildContext context, Locale locale) => SizedBox(
  width: 320,
  child: TRAutocomplete<String>(
    helperText: _pick(
      locale,
      'Arrow keys move · Enter selects · Escape closes',
      '방향키 이동 · Enter 선택 · Escape 닫기',
      '矢印キーで移動 · Enter で選択 · Escape で閉じる',
    ),
    items: _autocompleteItems,
    label: _pick(locale, 'Region', '지역', '地域'),
    placeholder: _pick(locale, 'Search regions', '지역 검색', '地域を検索'),
  ),
);

Widget _comboboxForm(BuildContext context, Locale locale) => SizedBox(
  width: 320,
  child: Form(
    child: Column(
      mainAxisSize: MainAxisSize.min,
      spacing: TRSpacing.medium,
      children: [
        TRComboboxFormField<String>(
          label: _pick(locale, 'Release channel', '릴리스 채널', 'リリースチャンネル'),
          items: [
            TRComboboxItem(
              value: 'stable',
              label: _pick(locale, 'Stable', '안정', '安定版'),
            ),
            TRComboboxItem(
              value: 'beta',
              label: _pick(locale, 'Beta', '베타', 'ベータ'),
            ),
          ],
          validator: (value) => value == null
              ? _pick(locale, 'Choose a channel', '채널을 선택하세요', 'チャンネルを選択してください')
              : null,
        ),
        TRMultiComboboxFormField<String>(
          label: _pick(locale, 'Regions', '리전', 'リージョン'),
          items: const [
            TRComboboxItem(value: 'seoul', label: 'Seoul'),
            TRComboboxItem(value: 'tokyo', label: 'Tokyo'),
          ],
        ),
      ],
    ),
  ),
);

Widget _appShellNavigation(BuildContext context, Locale locale) => SizedBox(
  width: 720,
  height: 360,
  child: TRAppShell(
    header: Padding(
      padding: const EdgeInsets.all(TRSpacing.small),
      child: TRToolbar(
        children: [
          TRToolbarButton(
            onPressed: () {},
            child: Text(_pick(locale, 'Deploy', '배포', 'デプロイ')),
          ),
          const TRToolbarSeparator(),
          const TRTooltip(message: 'Refresh', child: Icon(Icons.refresh)),
        ],
      ),
    ),
    sidebar: TRTreeNav<String>(
      items: [
        TRTreeNavLeaf(
          value: 'overview',
          label: Text(_pick(locale, 'Overview', '개요', '概要')),
        ),
        TRTreeNavGroup(
          value: 'racks',
          label: Text(_pick(locale, 'Racks', '랙', 'ラック')),
          initiallyExpanded: true,
          children: const [
            TRTreeNavLeaf(value: 'alpha', label: Text('Rack alpha')),
          ],
        ),
      ],
    ),
    mobileDrawer: const TRFileTree(
      nodes: [TRFileTreeFile(name: 'main.dart', path: '/main.dart')],
    ),
    body: Center(
      child: Text(_pick(locale, 'Deployment overview', '배포 개요', 'デプロイ概要')),
    ),
  ),
);

Widget _toastTrack(BuildContext context, Locale locale) =>
    _ToastTrackExample(locale: locale);

class _ToastTrackExample extends StatefulWidget {
  const _ToastTrackExample({required this.locale});

  final Locale locale;

  @override
  State<_ToastTrackExample> createState() => _ToastTrackExampleState();
}

class _ToastTrackExampleState extends State<_ToastTrackExample> {
  late final TRToastController _controller = TRToastController();

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) => SizedBox(
    width: 420,
    height: 220,
    child: TRToastRegion(
      controller: _controller,
      child: Center(
        child: TRButton(
          onPressed: () => _controller.track<void>(
            Future<void>.delayed(const Duration(milliseconds: 800)),
            loading: TRToastData(
              title: Text(_pick(widget.locale, 'Deploying', '배포 중', 'デプロイ中')),
            ),
            success: (_) => TRToastData(
              title: Text(
                _pick(widget.locale, 'Deployment complete', '배포 완료', 'デプロイ完了'),
              ),
              variant: TRStatusVariant.success,
            ),
            error: (_, _) => TRToastData(
              title: Text(
                _pick(widget.locale, 'Deployment failed', '배포 실패', 'デプロイ失敗'),
              ),
              variant: TRStatusVariant.danger,
            ),
          ),
          child: Text(_pick(widget.locale, 'Deploy rack', '랙 배포', 'ラックをデプロイ')),
        ),
      ),
    ),
  );
}
