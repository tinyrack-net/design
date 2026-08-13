import 'package:material_ui/material_ui.dart';
import 'package:intl/intl.dart';
import 'package:lucide_flutter/lucide_flutter.dart';
import 'package:tinyrack_ui/tinyrack_ui.dart';

import 'code_highlighter.dart';

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
  'icon-button-states': _iconButtonStates,
  'icon-button-appearances': _iconButtonAppearances,
  'icon-button-intents': _iconButtonIntents,
  'icon-button-sizes': _iconButtonSizes,
  'alert-variants': _alertVariants,
  'alert-actions': _alertActions,
  'badge-variants': _badgeVariants,
  'badge-sizes': _badgeSizes,
  'code-block-highlighted': _codeBlockHighlighted,
  'code-block-modes': _codeBlockModes,
  'code-block-override': _codeBlockOverride,
  'code-block-trailing': _codeBlockTrailing,
  'code-contexts': _codeContexts,
  'copy-button-labels': _copyButtonLabels,
  'copy-button-combinations': _copyButtonCombinations,
  'animated-number-basic': _animatedNumberBasic,
  'animated-number-modes': _animatedNumberModes,
  'animated-number-formats': _animatedNumberFormats,
  'animated-number-direction': _animatedNumberDirection,
  'card-variants': _cardVariants,
  'card-recipe': _cardRecipe,
  'chat-composition': _chatComposition,
  'accordion-controlled': _accordionControlled,
  'accordion-expansion-states': _accordionExpansionStates,
  'tabs-sizes': _tabsSizes,
  'tabs-recipe': _tabsRecipe,
  'tabs-bar': _tabsBar,
  'fieldset-basic': _fieldsetBasic,
  'fieldset-states': _fieldsetStates,
  'fieldset-composition': _fieldsetComposition,
  'otp-field-sizes': _otpSizes,
  'otp-field-states': _otpStates,
  'otp-field-validation': _otpValidation,
  'otp-field-masked': _otpMasked,
  'slider-basic': _sliderBasic,
  'slider-sizes': _sliderSizes,
  'slider-states': _sliderStates,
  'slider-disabled': _sliderDisabled,
  'slider-range': _sliderRange,
  'slider-form': _sliderForm,
  'slider-validation': _sliderValidation,
  'checkbox-states': _checkboxStates,
  'checkbox-sizes': _checkboxSizes,
  'checkbox-availability': _checkboxAvailability,
  'checkbox-validation': _checkboxValidation,
  'checkbox-form-values': _checkboxFormValues,
  'checkbox-group-options': _checkboxGroupOptions,
  'checkbox-group-disabled': _checkboxGroupDisabled,
  'checkbox-group-validation': _checkboxGroupValidation,
  'checkbox-group-parent': _checkboxGroupParent,
  'checkbox-group-form': _checkboxGroupForm,
  'switch-controlled': _switchControlled,
  'switch-availability': _switchAvailability,
  'switch-validation': _switchValidation,
  'radio-states': _radioStates,
  'radio-sizes': _radioSizes,
  'radio-availability': _radioAvailability,
  'radio-group-states': _radioGroupStates,
  'radio-group-validation': _radioGroupValidation,
  'radio-group-form': _radioGroupForm,
  'toggle-controlled': _toggleControlled,
  'toggle-states': _toggleStates,
  'toggle-sizes': _toggleSizes,
  'toggle-group-controlled': _toggleGroupControlled,
  'toggle-group-multiple': _toggleGroupMultiple,
  'toggle-group-orientation': _toggleGroupOrientation,
  'form-basic': _formBasic,
  'form-states': _formStates,
  'form-server-errors': _formServerErrors,
  'form-actions': _formActions,
  'textarea-basic': _textareaBasic,
  'textarea-states': _textareaStates,
  'textarea-sizes': _textareaSizes,
  'textarea-form': _textareaForm,
  'textarea-validation': _textareaValidation,
  'menu-settings': _menuSettings,
  'menu-submenu': _menuSubmenu,
  'menu-icon-trigger': _menuIconTrigger,
  'menubar-nested-layers': _menubarNestedLayers,
  'menubar-menu-states': _menubarMenuStates,
  'select-controlled': _selectControlled,
  'select-form': _selectForm,
  'select-searchable': _selectSearchable,
  'select-surface': _selectSurface,
  'dialog-result': _dialogResult,
  'dialog-nested-layers': _dialogNestedLayers,
  'dialog-scrollable': _dialogScrollable,
  'alert-dialog-result': _alertDialogResult,
  'alert-dialog-states': _alertDialogStates,
  'alert-dialog-scrollable': _alertDialogScrollable,
  'popover-nested-menu': _popoverNestedMenu,
  'autocomplete-modes': _autocompleteModes,
  'autocomplete-async': _autocompleteAsync,
  'autocomplete-states': _autocompleteStates,
  'autocomplete-controller': _autocompleteController,
  'autocomplete-form': _autocompleteForm,
  'autocomplete-keyboard': _autocompleteKeyboard,
  'combobox-basic': _comboboxBasic,
  'combobox-sizes': _comboboxSizes,
  'combobox-option-states': _comboboxOptionStates,
  'combobox-filter-modes': _comboboxFilterModes,
  'combobox-multiple-anatomy': _comboboxMultipleAnatomy,
  'combobox-validation': _comboboxValidation,
  'combobox-controlled-filter-hooks': _comboboxControlledFilterHooks,
  'combobox-overlay': _comboboxOverlay,
  'combobox-keyboard': _comboboxKeyboard,
  'combobox-form': _comboboxForm,
  'app-shell-navigation': _appShellNavigation,
  'app-shell-controls': _appShellControls,
  'app-shell-docs': _appShellDocs,
  'app-shell-pane-header': _appShellPaneHeader,
  'pagination-controlled': _paginationControlled,
  'table-dense-status': _tableDenseStatus,
  'tree-nav-navigation': _treeNavNavigation,
  'window-frame-browser': _windowFrameBrowser,
  'window-frame-title-bar-actions': _windowFrameTitleBarActions,
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

Widget _copyButtonLabels(BuildContext context, Locale locale) {
  return Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    mainAxisSize: MainAxisSize.min,
    spacing: TRSpacing.medium,
    children: [
      Row(
        mainAxisSize: MainAxisSize.min,
        spacing: TRSpacing.small,
        children: [
          const TRCode('flutter pub add tinyrack_ui'),
          TRCopyButton(
            value: 'flutter pub add tinyrack_ui',
            idleLabel: _pick(locale, 'Copy', '복사', 'コピー'),
            copiedLabel: _pick(locale, 'Copied', '복사됨', 'コピー済み'),
          ),
        ],
      ),
      Row(
        mainAxisSize: MainAxisSize.min,
        spacing: TRSpacing.small,
        children: [
          const TRCode('rack_2f8c14d0'),
          TRCopyButton(
            appearance: TRAppearance.outline,
            value: 'rack_2f8c14d0',
            idleLabel: _pick(locale, 'Copy ID', 'ID 복사', 'ID をコピー'),
            copiedLabel: _pick(locale, 'ID copied', 'ID 복사됨', 'ID をコピー済み'),
          ),
        ],
      ),
    ],
  );
}

Widget _copyButtonCombinations(BuildContext context, Locale locale) {
  return Wrap(
    crossAxisAlignment: WrapCrossAlignment.center,
    spacing: TRSpacing.small,
    runSpacing: TRSpacing.small,
    children: [
      TRCopyButton(
        uiSize: TRUiSize.md,
        intent: TRIntent.primary,
        resetDelay: const Duration(milliseconds: 750),
        value: 'tinyrack.net',
        idleLabel: _pick(locale, 'Copy', '복사', 'コピー'),
        copiedLabel: _pick(locale, 'Copied', '복사됨', 'コピー済み'),
      ),
      TRCopyButton(
        appearance: TRAppearance.outline,
        value: "import 'package:tinyrack_ui/tinyrack_ui.dart';",
        idleLabel: _pick(locale, 'Copy import', 'import 복사', 'import をコピー'),
        copiedLabel: _pick(
          locale,
          'Import copied',
          'import 복사됨',
          'import をコピー済み',
        ),
      ),
      TRCopyButton(
        appearance: TRAppearance.ghost,
        intent: TRIntent.danger,
        uiSize: TRUiSize.lg,
        value: 'rack-log-2f8c14d0',
        idleLabel: _pick(locale, 'Copy log id', '로그 ID 복사', 'ログ ID をコピー'),
        copiedLabel: _pick(
          locale,
          'Log id copied',
          '로그 ID 복사됨',
          'ログ ID をコピー済み',
        ),
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
        (TRUiSize.md, 'Small'),
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

Widget _iconButtonStates(BuildContext context, Locale locale) {
  final label = _pick(locale, 'Add rack', '랙 추가', 'ラックを追加');
  return Wrap(
    crossAxisAlignment: WrapCrossAlignment.center,
    spacing: TRSpacing.small,
    runSpacing: TRSpacing.small,
    children: [
      TRIconButton(label: label, icon: const Icon(Icons.add), onPressed: () {}),
      TRIconButton(
        label: label,
        loading: true,
        loadingLabel: _pick(locale, 'Adding rack', '랙 추가 중', 'ラックを追加中'),
        icon: const Icon(Icons.add),
        onPressed: () {},
      ),
      TRIconButton(label: label, icon: const Icon(Icons.add), onPressed: null),
    ],
  );
}

Widget _iconButtonAppearances(BuildContext context, Locale locale) {
  return Wrap(
    crossAxisAlignment: WrapCrossAlignment.center,
    spacing: TRSpacing.small,
    runSpacing: TRSpacing.small,
    children: [
      for (final (appearance, label) in [
        (
          TRAppearance.solid,
          _pick(locale, 'Solid settings', 'Solid 설정', 'Solid の設定'),
        ),
        (
          TRAppearance.outline,
          _pick(locale, 'Outline settings', 'Outline 설정', 'Outline の設定'),
        ),
        (
          TRAppearance.ghost,
          _pick(locale, 'Ghost settings', 'Ghost 설정', 'Ghost の設定'),
        ),
      ])
        TRIconButton(
          appearance: appearance,
          label: label,
          icon: const Icon(Icons.settings),
          onPressed: () {},
        ),
    ],
  );
}

Widget _iconButtonIntents(BuildContext context, Locale locale) {
  return Wrap(
    crossAxisAlignment: WrapCrossAlignment.center,
    spacing: TRSpacing.small,
    runSpacing: TRSpacing.small,
    children: [
      TRIconButton(
        label: _pick(locale, 'Open settings', '설정 열기', '設定を開く'),
        icon: const Icon(Icons.settings),
        onPressed: () {},
      ),
      TRIconButton(
        intent: TRIntent.primary,
        label: _pick(locale, 'Add rack', '랙 추가', 'ラックを追加'),
        icon: const Icon(Icons.add),
        onPressed: () {},
      ),
      TRIconButton(
        intent: TRIntent.danger,
        label: _pick(locale, 'Delete rack', '랙 삭제', 'ラックを削除'),
        icon: const Icon(Icons.delete_outline),
        onPressed: () {},
      ),
    ],
  );
}

Widget _iconButtonSizes(BuildContext context, Locale locale) {
  return Wrap(
    crossAxisAlignment: WrapCrossAlignment.center,
    spacing: TRSpacing.small,
    runSpacing: TRSpacing.small,
    children: [
      for (final (size, label) in [
        (TRUiSize.md, _pick(locale, 'Small settings', '작은 크기 설정', '小サイズの設定')),
        (TRUiSize.md, _pick(locale, 'Medium settings', '중간 크기 설정', '中サイズの設定')),
        (TRUiSize.lg, _pick(locale, 'Large settings', '큰 크기 설정', '大サイズの設定')),
      ])
        TRIconButton(
          uiSize: size,
          label: label,
          icon: const Icon(Icons.settings),
          onPressed: () {},
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
          uiSize: TRUiSize.md,
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
        (TRUiSize.md, 'Small'),
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

Widget _codeBlockHighlighted(BuildContext context, Locale locale) =>
    const SizedBox(
      width: 360,
      child: TRCodeBlock(code: "final status = 'healthy';", language: 'dart'),
    );

Widget _codeBlockModes(BuildContext context, Locale locale) => const SizedBox(
  width: 360,
  child: Column(
    mainAxisSize: MainAxisSize.min,
    spacing: TRSpacing.medium,
    children: [
      TRCodeBlock(code: 'rack-a: healthy'),
      TRCodeBlock(code: '{\n  "status": "healthy"\n}', language: 'json'),
      TRCodeBlock(code: 'puts "healthy"', language: 'ruby'),
      TRCodeBlock(
        code:
            "final message = 'A deliberately long line that wraps inside narrow layouts';",
        language: 'dart',
        wrap: true,
      ),
    ],
  ),
);

Widget _codeBlockOverride(BuildContext context, Locale locale) => SizedBox(
  width: 360,
  child: TRCodeBlock(
    code: "final region = 'icn';",
    highlighter: previewAlternateCodeHighlighter,
    language: 'dart',
  ),
);

Widget _codeBlockTrailing(BuildContext context, Locale locale) =>
    const SizedBox(
      width: 360,
      child: TRCodeBlock(
        code: 'tinyrack deploy --env prod --region icn --wait',
        trailing: TRCopyButton(
          value: 'tinyrack deploy --env prod --region icn --wait',
          appearance: TRAppearance.ghost,
          uiSize: TRUiSize.sm,
        ),
      ),
    );

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
                uiSize: TRUiSize.md,
                onPressed: () {},
                child: Text(_pick(locale, 'Details', '자세히', '詳細')),
              ),
              TRButton(
                intent: TRIntent.primary,
                uiSize: TRUiSize.md,
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

Widget _chatComposition(BuildContext context, Locale locale) => SizedBox(
  width: TRMeasurements.measureXl,
  child: Column(
    crossAxisAlignment: CrossAxisAlignment.stretch,
    children: [
      TRChatUserBubble(
        child: Text(
          _pick(
            locale,
            'Please run the tests.',
            '테스트를 실행해 주세요.',
            'テストを実行してください。',
          ),
        ),
      ),
      TRChatMessageRow(
        icon: LucideIcons.bot,
        tone: TRChatMessageTone.primary,
        child: Text(
          _pick(
            locale,
            'I am checking the changes.',
            '변경 사항을 확인하고 있어요.',
            '変更内容を確認しています。',
          ),
        ),
      ),
      TRChatMessageRow(
        icon: LucideIcons.image,
        alignment: TRChatMessageAlignment.center,
        child: TRCard(
          padding: TRCardPadding.sm,
          child: TRText(
            _pick(
              locale,
              'Result image\npreview.png',
              '결과 이미지\npreview.png',
              '結果画像\npreview.png',
            ),
            variant: TRTextVariant.bodySm,
          ),
        ),
      ),
      TRChatToolDisclosure(
        icon: LucideIcons.terminal,
        label: _pick(locale, 'Run command', '명령 실행', 'コマンドを実行'),
        secondaryLabel: r'flutter test --coverage',
        status: TRChatToolStatus.running,
        statusLabel: _pick(locale, 'Running', '실행 중', '実行中'),
        details: const TRCodeBlock(code: r'$ flutter test'),
      ),
      TRChatStatusRow(
        label: _pick(locale, 'Running', '실행 중', '実行中'),
        status: TRChatToolStatus.running,
      ),
    ],
  ),
);

Widget _accordionControlled(BuildContext context, Locale locale) =>
    _AccordionControlledExample(locale: locale);

class _AccordionControlledExample extends StatefulWidget {
  const _AccordionControlledExample({required this.locale});

  final Locale locale;

  @override
  State<_AccordionControlledExample> createState() =>
      _AccordionControlledExampleState();
}

class _AccordionControlledExampleState
    extends State<_AccordionControlledExample> {
  List<String> _value = const ['overview'];

  @override
  Widget build(BuildContext context) => SizedBox(
    width: 360,
    child: Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      mainAxisSize: MainAxisSize.min,
      spacing: TRSpacing.medium,
      children: [
        TRAccordion(
          multiple: true,
          onValueChange: (value) => setState(() => _value = value),
          value: _value,
          items: [
            TRAccordionItem(
              value: 'overview',
              trigger: Text(
                _pick(
                  widget.locale,
                  'What is Tinyrack?',
                  'Tinyrack은 무엇인가요?',
                  'Tinyrack とは何ですか？',
                ),
              ),
              content: Text(
                _pick(
                  widget.locale,
                  'A UI system for Flutter applications.',
                  'Flutter 애플리케이션을 위한 UI 시스템이에요.',
                  'Flutter アプリケーション向けの UI システムです。',
                ),
              ),
            ),
            TRAccordionItem(
              value: 'install',
              trigger: Text(
                _pick(
                  widget.locale,
                  'How do I install it?',
                  '어떻게 설치하나요?',
                  'インストール方法は？',
                ),
              ),
              content: Text(
                _pick(
                  widget.locale,
                  'Add the package and import its public library.',
                  '패키지를 추가하고 공개 라이브러리를 가져오세요.',
                  'パッケージを追加し、公開ライブラリをインポートしてください。',
                ),
              ),
            ),
          ],
        ),
        TRText(
          '${_pick(widget.locale, 'Expanded', '펼친 항목', '展開中')}: '
          '${_value.isEmpty ? _pick(widget.locale, 'none', '없음', 'なし') : _value.join(', ')}',
          variant: TRTextVariant.bodySm,
          color: TRTextColor.muted,
        ),
      ],
    ),
  );
}

Widget _accordionExpansionStates(
  BuildContext context,
  Locale locale,
) => SizedBox(
  width: 360,
  child: Column(
    mainAxisSize: MainAxisSize.min,
    spacing: TRSpacing.large,
    children: [
      TRAccordion(
        defaultValue: const ['single'],
        items: [
          TRAccordionItem(
            value: 'single',
            trigger: Text(_pick(locale, 'Single expansion', '단일 확장', '単一展開')),
            content: Text(
              _pick(
                locale,
                'Opening another item closes this one.',
                '다른 항목을 열면 이 항목이 닫혀요.',
                '別の項目を開くと、この項目は閉じます。',
              ),
            ),
          ),
          TRAccordionItem(
            value: 'disabled',
            disabled: true,
            trigger: Text(
              _pick(locale, 'Unavailable item', '사용할 수 없는 항목', '利用できない項目'),
            ),
            content: Text(
              _pick(
                locale,
                'Unavailable details.',
                '사용할 수 없는 세부 정보예요.',
                '利用できない詳細です。',
              ),
            ),
          ),
        ],
      ),
      TRAccordion(
        defaultValue: const ['network', 'storage'],
        multiple: true,
        items: [
          TRAccordionItem(
            value: 'network',
            trigger: Text(_pick(locale, 'Network', '네트워크', 'ネットワーク')),
            content: Text(
              _pick(
                locale,
                '10 Gbps uplink.',
                '10Gbps 업링크예요.',
                '10 Gbps のアップリンクです。',
              ),
            ),
          ),
          TRAccordionItem(
            value: 'storage',
            trigger: Text(_pick(locale, 'Storage', '스토리지', 'ストレージ')),
            content: Text(
              _pick(locale, '72% available.', '72%를 사용할 수 있어요.', '72% 利用可能です。'),
            ),
          ),
        ],
      ),
    ],
  ),
);

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

Widget _tabsBar(BuildContext context, Locale locale) {
  return SizedBox(
    width: 320,
    child: TRTabs(
      defaultValue: 'metrics',
      tabWidth: TRTabsWidth.fixed,
      semanticLabel: _pick(locale, 'Open racks', '열린 랙', '開いているラック'),
      tabs: [
        for (final tab in _settingsTabs(locale))
          TRTabsTab(
            value: tab.value,
            label: tab.label,
            leading: const Icon(Icons.dns),
            onClose: () {},
            closeLabel: _pick(
              locale,
              'Close ${tab.label}',
              '${tab.label} 닫기',
              '${tab.label}を閉じる',
            ),
          ),
      ],
      actions: [
        TRIconButton(
          appearance: TRAppearance.ghost,
          icon: const Icon(Icons.add),
          label: _pick(locale, 'New rack', '새 랙', '新しいラック'),
          onPressed: () {},
        ),
      ],
    ),
  );
}

Widget _fieldsetOption({
  required String label,
  bool checked = false,
  bool disabled = false,
}) {
  return Row(
    mainAxisSize: MainAxisSize.min,
    spacing: TRSpacing.small,
    children: [
      TRCheckbox(
        defaultChecked: checked,
        disabled: disabled,
        semanticLabel: label,
      ),
      TRText(label, variant: TRTextVariant.bodySm),
    ],
  );
}

Widget _fieldsetBasic(BuildContext context, Locale locale) {
  return SizedBox(
    width: 320,
    child: TRFieldset(
      legend: _pick(locale, 'Notifications', '알림', '通知'),
      children: [
        _fieldsetOption(
          checked: true,
          label: _pick(locale, 'Email alerts', '이메일 알림', 'メール通知'),
        ),
        _fieldsetOption(
          checked: true,
          label: _pick(locale, 'Incident summaries', '장애 요약', 'インシデント要約'),
        ),
      ],
    ),
  );
}

Widget _fieldsetStates(BuildContext context, Locale locale) {
  final emailAlerts = _pick(locale, 'Email alerts', '이메일 알림', 'メール通知');
  final incidentSummaries = _pick(
    locale,
    'Incident summaries',
    '장애 요약',
    'インシデント要約',
  );

  return Wrap(
    spacing: TRSpacing.large,
    runSpacing: TRSpacing.large,
    children: [
      SizedBox(
        width: 260,
        child: TRFieldset(
          legend: _pick(locale, 'Editable settings', '편집 가능한 설정', '編集可能な設定'),
          children: [
            _fieldsetOption(checked: true, label: emailAlerts),
            _fieldsetOption(checked: true, label: incidentSummaries),
          ],
        ),
      ),
      SizedBox(
        width: 260,
        child: TRFieldset(
          disabled: true,
          legend: _pick(locale, 'Managed settings', '관리되는 설정', '管理された設定'),
          children: [
            _fieldsetOption(checked: true, disabled: true, label: emailAlerts),
            _fieldsetOption(
              checked: true,
              disabled: true,
              label: incidentSummaries,
            ),
          ],
        ),
      ),
    ],
  );
}

Widget _fieldsetComposition(BuildContext context, Locale locale) {
  return SizedBox(
    width: 340,
    child: TRFieldset(
      legend: _pick(locale, 'Incident notifications', '장애 알림', 'インシデント通知'),
      children: [
        _fieldsetOption(
          checked: true,
          label: _pick(
            locale,
            'Enable incident notifications',
            '장애 알림 켜기',
            'インシデント通知を有効にする',
          ),
        ),
        TRFieldset(
          legend: _pick(locale, 'Delivery channels', '전달 채널', '配信チャネル'),
          children: [
            _fieldsetOption(
              checked: true,
              label: _pick(locale, 'Email', '이메일', 'メール'),
            ),
            _fieldsetOption(label: _pick(locale, 'SMS', 'SMS', 'SMS')),
          ],
        ),
      ],
    ),
  );
}

Widget _otpSizes(BuildContext context, Locale locale) {
  return Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    mainAxisSize: MainAxisSize.min,
    spacing: TRSpacing.large,
    children: [
      for (final (uiSize, label) in <(TRUiSize, String)>[
        (TRUiSize.md, 'SM'),
        (TRUiSize.md, 'MD'),
        (TRUiSize.lg, 'LG'),
      ])
        TROtpField(
          defaultValue: '2048',
          label: label,
          length: 4,
          semanticLabel: _pick(
            locale,
            '$label verification code',
            '$label 인증 코드',
            '$label 確認コード',
          ),
          uiSize: uiSize,
        ),
    ],
  );
}

Widget _otpStates(BuildContext context, Locale locale) {
  return Wrap(
    spacing: TRSpacing.extraLarge,
    runSpacing: TRSpacing.large,
    children: [
      TROtpField(
        defaultValue: '2048',
        helperText: _pick(
          locale,
          'Four digits, numbers only.',
          '숫자 네 자리만 입력해요.',
          '数字 4 桁のみです。',
        ),
        label: _pick(locale, 'Editable code', '편집 가능한 코드', '編集できるコード'),
        length: 4,
      ),
      TROtpField(
        defaultValue: '481592',
        helperText: _pick(
          locale,
          'Copy this recovery code.',
          '이 복구 코드를 복사하세요.',
          'この復旧コードをコピーしてください。',
        ),
        label: _pick(locale, 'Recovery code', '복구 코드', '復旧コード'),
        length: 6,
        readOnly: true,
      ),
      TROtpField(
        defaultValue: '2048',
        enabled: false,
        helperText: _pick(
          locale,
          'Request a new code first.',
          '새 코드를 먼저 요청하세요.',
          '先に新しいコードをリクエストしてください。',
        ),
        label: _pick(locale, 'Expired code', '만료된 코드', '期限切れのコード'),
        length: 4,
      ),
    ],
  );
}

Widget _otpValidation(BuildContext context, Locale locale) {
  final formKey = GlobalKey<FormState>();
  var status = '';
  return StatefulBuilder(
    builder: (context, setState) => SizedBox(
      width: 320,
      child: Form(
        key: formKey,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisSize: MainAxisSize.min,
          spacing: TRSpacing.medium,
          children: [
            TROtpFieldFormField(
              autovalidateMode: AutovalidateMode.onUserInteraction,
              helperText: _pick(
                locale,
                'Enter all six digits.',
                '여섯 자리를 모두 입력하세요.',
                '6 桁すべてを入力してください。',
              ),
              label: _pick(locale, 'Verification code', '인증 코드', '確認コード'),
              length: 6,
              validator: (value) => (value ?? '').length == 6
                  ? null
                  : _pick(
                      locale,
                      'A six-digit code is required.',
                      '여섯 자리 코드가 필요해요.',
                      '6 桁のコードが必要です。',
                    ),
            ),
            TRButton(
              onPressed: () => setState(() {
                status = formKey.currentState?.validate() ?? false
                    ? _pick(
                        locale,
                        'Code accepted.',
                        '코드를 확인했어요.',
                        'コードを受け付けました。',
                      )
                    : _pick(
                        locale,
                        'Fix the code and try again.',
                        '코드를 고친 뒤 다시 시도하세요.',
                        'コードを修正して再試行してください。',
                      );
              }),
              child: Text(_pick(locale, 'Verify', '확인', '確認')),
            ),
            TRText(
              status.isEmpty
                  ? _pick(
                      locale,
                      'Waiting for a code.',
                      '코드를 기다리고 있어요.',
                      'コードを待っています。',
                    )
                  : status,
              variant: TRTextVariant.bodySm,
              color: TRTextColor.muted,
            ),
          ],
        ),
      ),
    ),
  );
}

Widget _otpMasked(BuildContext context, Locale locale) =>
    _OtpMaskedExample(locale: locale);

class _OtpMaskedExample extends StatefulWidget {
  const _OtpMaskedExample({required this.locale});

  final Locale locale;

  @override
  State<_OtpMaskedExample> createState() => _OtpMaskedExampleState();
}

class _OtpMaskedExampleState extends State<_OtpMaskedExample> {
  late final TROtpFieldController _controller = TROtpFieldController(
    value: '4821',
  );

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final locale = widget.locale;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisSize: MainAxisSize.min,
      spacing: TRSpacing.medium,
      children: [
        TROtpField(
          controller: _controller,
          helperText: _pick(
            locale,
            'Digits stay hidden while you type.',
            '입력하는 동안 숫자가 가려져요.',
            '入力中は数字が隠れたままになります。',
          ),
          label: _pick(locale, 'Backup PIN', '백업 PIN', 'バックアップ PIN'),
          length: 4,
          obscureText: true,
          separatorBuilder: (context, index) => index == 1
              ? const SizedBox(
                  width: TRSpacing.large,
                  child: Center(
                    child: TRText('-', variant: TRTextVariant.bodySm),
                  ),
                )
              : const SizedBox(width: TRSpacing.small),
        ),
        TRButton(
          appearance: TRAppearance.outline,
          onPressed: _controller.clear,
          child: Text(_pick(locale, 'Clear', '지우기', 'クリア')),
        ),
      ],
    );
  }
}

Widget _sliderBasic(BuildContext context, Locale locale) {
  return SizedBox(
    width: 320,
    child: TRSlider(
      defaultValue: 48,
      label: _pick(locale, 'Volume', '볼륨', '音量'),
    ),
  );
}

Widget _sliderSizes(BuildContext context, Locale locale) {
  return Column(
    mainAxisSize: MainAxisSize.min,
    spacing: TRSpacing.large,
    children: [
      for (final uiSize in TRUiSize.values)
        SizedBox(
          width: 320,
          child: TRSlider(
            defaultValue: 48,
            label:
                '${uiSize.name.toUpperCase()} '
                '${_pick(locale, 'volume', '볼륨', 'の音量')}',
            uiSize: uiSize,
          ),
        ),
    ],
  );
}

Widget _sliderStates(BuildContext context, Locale locale) {
  return Row(
    crossAxisAlignment: CrossAxisAlignment.start,
    mainAxisSize: MainAxisSize.min,
    spacing: TRSpacing.extraLarge,
    children: [
      SizedBox(
        width: 240,
        child: TRSlider(
          defaultValue: 48,
          label: _pick(locale, 'Horizontal volume', '가로 볼륨', '横向きの音量'),
        ),
      ),
      SizedBox(
        height: 220,
        child: TRSlider(
          defaultValue: 36,
          label: _pick(locale, 'Vertical volume', '세로 볼륨', '縦向きの音量'),
          vertical: true,
        ),
      ),
    ],
  );
}

Widget _sliderDisabled(BuildContext context, Locale locale) {
  return SizedBox(
    width: 320,
    child: TRSlider(
      defaultValue: 82,
      enabled: false,
      label: _pick(locale, 'Disabled volume', '비활성 볼륨', '無効な音量'),
    ),
  );
}

Widget _sliderRange(BuildContext context, Locale locale) {
  final label = _pick(locale, 'Maintenance window', '점검 시간대', 'メンテナンス時間帯');
  return SizedBox(
    width: 320,
    child: TRRangeSlider(
      defaultValue: const RangeValues(20, 80),
      label: label,
      labelBuilder: (value) => '${value.round()}%',
      minGap: 10,
      semanticLabel: _pick(
        locale,
        'Maintenance window, percent of the day',
        '점검 시간대, 하루 중 비율',
        'メンテナンス時間帯、1 日に占める割合',
      ),
    ),
  );
}

Widget _sliderForm(BuildContext context, Locale locale) =>
    _SliderFormExample(locale: locale);

Widget _sliderValidation(BuildContext context, Locale locale) =>
    _SliderValidationExample(locale: locale);

class _SliderFormExample extends StatefulWidget {
  const _SliderFormExample({required this.locale});

  final Locale locale;

  @override
  State<_SliderFormExample> createState() => _SliderFormExampleState();
}

class _SliderFormExampleState extends State<_SliderFormExample> {
  final _formKey = GlobalKey<FormState>();
  double? _saved;

  @override
  Widget build(BuildContext context) {
    final locale = widget.locale;
    return SizedBox(
      width: 320,
      child: Form(
        key: _formKey,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisSize: MainAxisSize.min,
          spacing: TRSpacing.large,
          children: [
            TRSliderFormField(
              initialValue: 48,
              label: _pick(locale, 'Volume', '볼륨', '音量'),
              onSaved: (value) => _saved = value,
              onValueChange: (_) => setState(() => _saved = null),
            ),
            TRButton(
              onPressed: () => setState(() => _formKey.currentState?.save()),
              child: Text(_pick(locale, 'Save volume', '볼륨 저장', '音量を保存')),
            ),
            if (_saved != null)
              TRText(
                _pick(
                  locale,
                  'Saved volume ${_saved!.round()}.',
                  '볼륨 ${_saved!.round()}(으)로 저장했어요.',
                  '音量 ${_saved!.round()} を保存しました。',
                ),
                variant: TRTextVariant.bodySm,
              ),
          ],
        ),
      ),
    );
  }
}

class _SliderValidationExample extends StatefulWidget {
  const _SliderValidationExample({required this.locale});

  final Locale locale;

  @override
  State<_SliderValidationExample> createState() =>
      _SliderValidationExampleState();
}

class _SliderValidationExampleState extends State<_SliderValidationExample> {
  final _formKey = GlobalKey<FormState>();
  double? _reserved;

  @override
  Widget build(BuildContext context) {
    final locale = widget.locale;
    return SizedBox(
      width: 320,
      child: Form(
        key: _formKey,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisSize: MainAxisSize.min,
          spacing: TRSpacing.large,
          children: [
            TRSliderFormField(
              autovalidateMode: AutovalidateMode.onUserInteraction,
              initialValue: 30,
              label: _pick(locale, 'Reserved capacity', '예약 용량', '予約容量'),
              onSaved: (value) => _reserved = value,
              onValueChange: (_) => setState(() => _reserved = null),
              validator: (value) => (value ?? 0) < 60
                  ? _pick(
                      locale,
                      'Increase reserved capacity to 60% or more.',
                      '예약 용량을 60% 이상으로 올리세요.',
                      '予約容量を 60% 以上に上げてください。',
                    )
                  : null,
            ),
            TRButton(
              onPressed: () => setState(() {
                if (_formKey.currentState?.validate() ?? false) {
                  _formKey.currentState?.save();
                }
              }),
              child: Text(_pick(locale, 'Reserve capacity', '용량 예약', '容量を予約')),
            ),
            if (_reserved != null)
              TRText(
                _pick(
                  locale,
                  'Reserved ${_reserved!.round()}% capacity.',
                  '용량 ${_reserved!.round()}%를 예약했어요.',
                  '容量 ${_reserved!.round()}% を予約しました。',
                ),
                variant: TRTextVariant.bodySm,
              ),
          ],
        ),
      ),
    );
  }
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

Widget _switchSample({
  required String label,
  bool checked = false,
  bool disabled = false,
  bool readOnly = false,
}) {
  return Column(
    mainAxisSize: MainAxisSize.min,
    spacing: TRSpacing.small,
    children: [
      TRText(label, variant: TRTextVariant.bodySm),
      TRSwitch(
        defaultChecked: checked,
        disabled: disabled,
        readOnly: readOnly,
        semanticLabel: label,
      ),
    ],
  );
}

Widget _switchControlled(BuildContext context, Locale locale) {
  final label = _pick(locale, 'Automatic backups', '자동 백업', '自動バックアップ');
  var enabled = false;
  return StatefulBuilder(
    builder: (context, setState) => Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisSize: MainAxisSize.min,
      spacing: TRSpacing.small,
      children: [
        Row(
          mainAxisSize: MainAxisSize.min,
          spacing: TRSpacing.small,
          children: [
            TRSwitch(
              checked: enabled,
              onCheckedChange: (next) => setState(() => enabled = next),
              semanticLabel: label,
            ),
            TRText(label, variant: TRTextVariant.bodySm),
          ],
        ),
        TRText(
          enabled
              ? _pick(
                  locale,
                  'Automatic backups: on',
                  '자동 백업: 켬',
                  '自動バックアップ: オン',
                )
              : _pick(
                  locale,
                  'Automatic backups: off',
                  '자동 백업: 끔',
                  '自動バックアップ: オフ',
                ),
          variant: TRTextVariant.bodySm,
          color: TRTextColor.muted,
        ),
      ],
    ),
  );
}

Widget _switchAvailability(BuildContext context, Locale locale) {
  return Wrap(
    crossAxisAlignment: WrapCrossAlignment.center,
    spacing: TRSpacing.large,
    runSpacing: TRSpacing.large,
    children: [
      _switchSample(
        checked: true,
        label: _pick(locale, 'Editable', '편집 가능', '編集可能'),
      ),
      _switchSample(
        checked: true,
        label: _pick(locale, 'Read only', '읽기 전용', '読み取り専用'),
        readOnly: true,
      ),
      _switchSample(
        checked: true,
        disabled: true,
        label: _pick(locale, 'Disabled', '사용 불가', '無効'),
      ),
    ],
  );
}

Widget _switchValidation(BuildContext context, Locale locale) {
  final label = _pick(
    locale,
    'Enable uptime monitoring',
    '가동 시간 모니터링 켜기',
    '稼働監視を有効にする',
  );
  final error = _pick(
    locale,
    'Turn on monitoring to save this rack.',
    '이 랙을 저장하려면 모니터링을 켜세요.',
    'このラックを保存するには監視を有効にしてください。',
  );
  var enabled = false;
  return StatefulBuilder(
    builder: (context, setState) => Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisSize: MainAxisSize.min,
      spacing: TRSpacing.small,
      children: [
        Row(
          mainAxisSize: MainAxisSize.min,
          spacing: TRSpacing.small,
          children: [
            TRSwitch(
              checked: enabled,
              invalid: !enabled,
              onCheckedChange: (next) => setState(() => enabled = next),
              semanticLabel: label,
            ),
            TRText(label, variant: TRTextVariant.bodySm),
          ],
        ),
        if (!enabled)
          TRText(
            error,
            variant: TRTextVariant.bodySm,
            color: TRTextColor.danger,
          ),
      ],
    ),
  );
}

Widget _toggleControlled(BuildContext context, Locale locale) {
  var pressed = false;
  return StatefulBuilder(
    builder: (context, setState) => Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisSize: MainAxisSize.min,
      spacing: TRSpacing.small,
      children: [
        TRToggle(
          pressed: pressed,
          onPressedChange: (next) => setState(() => pressed = next),
          child: Text(_pick(locale, 'Bold', '굵게', '太字')),
        ),
        TRText(
          pressed
              ? _pick(locale, 'Bold: on', '굵게: 켬', '太字: オン')
              : _pick(locale, 'Bold: off', '굵게: 끔', '太字: オフ'),
          variant: TRTextVariant.bodySm,
          color: TRTextColor.muted,
        ),
      ],
    ),
  );
}

Widget _toggleSample({
  required String caption,
  required String label,
  bool defaultPressed = false,
  bool disabled = false,
}) {
  return Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    mainAxisSize: MainAxisSize.min,
    spacing: TRSpacing.extraSmall,
    children: [
      TRText(caption, variant: TRTextVariant.label),
      TRToggle(
        defaultPressed: defaultPressed,
        disabled: disabled,
        child: Text(label),
      ),
    ],
  );
}

Widget _toggleStates(BuildContext context, Locale locale) {
  return Wrap(
    crossAxisAlignment: WrapCrossAlignment.start,
    spacing: TRSpacing.large,
    runSpacing: TRSpacing.large,
    children: [
      _toggleSample(
        caption: _pick(locale, 'Enabled · Off', '사용 가능 · 끔', '有効 · オフ'),
        label: _pick(locale, 'Bold', '굵게', '太字'),
      ),
      _toggleSample(
        caption: _pick(locale, 'Enabled · On', '사용 가능 · 켬', '有効 · オン'),
        defaultPressed: true,
        label: _pick(locale, 'Italic', '기울임', '斜体'),
      ),
      _toggleSample(
        caption: _pick(locale, 'Disabled · Off', '사용 불가 · 끔', '無効 · オフ'),
        disabled: true,
        label: _pick(locale, 'Underline', '밑줄', '下線'),
      ),
      _toggleSample(
        caption: _pick(locale, 'Disabled · On', '사용 불가 · 켬', '無効 · オン'),
        defaultPressed: true,
        disabled: true,
        label: _pick(locale, 'Strikethrough', '취소선', '取り消し線'),
      ),
    ],
  );
}

Widget _toggleSizes(BuildContext context, Locale locale) {
  return Wrap(
    crossAxisAlignment: WrapCrossAlignment.center,
    spacing: TRSpacing.small,
    runSpacing: TRSpacing.small,
    children: [
      for (final (size, label) in [
        (TRUiSize.md, _pick(locale, 'Small', '작게', '小')),
        (TRUiSize.md, _pick(locale, 'Medium', '보통', '中')),
        (TRUiSize.lg, _pick(locale, 'Large', '크게', '大')),
      ])
        TRToggle(uiSize: size, child: Text(label)),
    ],
  );
}

Widget _toggleGroupControlled(BuildContext context, Locale locale) {
  var value = const ['start'];
  return StatefulBuilder(
    builder: (context, setState) => Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisSize: MainAxisSize.min,
      spacing: TRSpacing.small,
      children: [
        TRToggleGroup(
          value: value,
          onValueChange: (next) => setState(() => value = next),
          children: [
            TRToggle(
              value: 'start',
              child: Text(_pick(locale, 'Start', '시작', '先頭')),
            ),
            TRToggle(
              value: 'center',
              child: Text(_pick(locale, 'Center', '가운데', '中央')),
            ),
            TRToggle(
              value: 'end',
              child: Text(_pick(locale, 'End', '끝', '末尾')),
            ),
          ],
        ),
        TRText(
          value.isEmpty
              ? _pick(locale, 'Alignment: none', '정렬: 없음', '配置: なし')
              : _pick(
                  locale,
                  'Alignment: ${value.join(', ')}',
                  '정렬: ${value.join(', ')}',
                  '配置: ${value.join(', ')}',
                ),
          variant: TRTextVariant.bodySm,
          color: TRTextColor.muted,
        ),
      ],
    ),
  );
}

Widget _toggleGroupMultiple(BuildContext context, Locale locale) {
  var value = const ['bold', 'underline'];
  return StatefulBuilder(
    builder: (context, setState) => Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisSize: MainAxisSize.min,
      spacing: TRSpacing.small,
      children: [
        TRToggleGroup(
          multiple: true,
          value: value,
          onValueChange: (next) => setState(() => value = next),
          children: [
            TRToggle(
              value: 'bold',
              child: Text(_pick(locale, 'Bold', '굵게', '太字')),
            ),
            TRToggle(
              value: 'italic',
              child: Text(_pick(locale, 'Italic', '기울임', '斜体')),
            ),
            TRToggle(
              value: 'underline',
              child: Text(_pick(locale, 'Underline', '밑줄', '下線')),
            ),
          ],
        ),
        TRText(
          value.isEmpty
              ? _pick(locale, 'Formatting: none', '서식: 없음', '書式: なし')
              : _pick(
                  locale,
                  'Formatting: ${value.join(', ')}',
                  '서식: ${value.join(', ')}',
                  '書式: ${value.join(', ')}',
                ),
          variant: TRTextVariant.bodySm,
          color: TRTextColor.muted,
        ),
      ],
    ),
  );
}

Widget _toggleGroupOrientation(BuildContext context, Locale locale) {
  Widget group({required String caption, bool disabled = false}) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisSize: MainAxisSize.min,
      spacing: TRSpacing.small,
      children: [
        TRText(caption, variant: TRTextVariant.label),
        TRToggleGroup(
          defaultValue: const ['top'],
          disabled: disabled,
          loopFocus: false,
          orientation: Axis.vertical,
          children: [
            TRToggle(value: 'top', child: Text(_pick(locale, 'Top', '위', '上'))),
            TRToggle(
              value: 'middle',
              child: Text(_pick(locale, 'Middle', '가운데', '中央')),
            ),
            TRToggle(
              disabled: !disabled,
              value: 'bottom',
              child: Text(
                disabled
                    ? _pick(locale, 'Bottom', '아래', '下')
                    : _pick(
                        locale,
                        'Bottom unavailable',
                        '아래 사용 불가',
                        '下は選択できません',
                      ),
              ),
            ),
          ],
        ),
      ],
    );
  }

  return Wrap(
    crossAxisAlignment: WrapCrossAlignment.start,
    spacing: TRSpacing.large,
    runSpacing: TRSpacing.large,
    children: [
      group(
        caption: _pick(locale, 'Group disabled', '그룹 비활성화', 'グループを無効化'),
        disabled: true,
      ),
      group(
        caption: _pick(locale, 'One item disabled', '항목 하나 비활성화', '項目を 1 つ無効化'),
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

Widget _checkboxOption(String value, String label, {bool readOnly = false}) {
  return MergeSemantics(
    child: Row(
      mainAxisSize: MainAxisSize.min,
      spacing: TRSpacing.small,
      children: [
        TRCheckbox(value: value, readOnly: readOnly),
        TRText(label, variant: TRTextVariant.bodySm),
      ],
    ),
  );
}

List<(String, String)> _checkboxOptions(Locale locale) => [
  ('telemetry', _pick(locale, 'Share telemetry', '텔레메트리 공유', 'テレメトリを共有')),
  ('newsletter', _pick(locale, 'Release notes', '릴리스 노트', 'リリースノート')),
  ('beta', _pick(locale, 'Beta features', '베타 기능', 'ベータ機能')),
];

Widget _checkboxGroupOptions(BuildContext context, Locale locale) {
  return TRCheckboxGroup(
    defaultValue: const ['telemetry'],
    children: [
      for (final (value, label) in _checkboxOptions(locale))
        _checkboxOption(value, label),
    ],
  );
}

Widget _checkboxGroupDisabled(BuildContext context, Locale locale) {
  final options = _checkboxOptions(locale).take(2).toList();
  return Wrap(
    spacing: TRSpacing.large,
    runSpacing: TRSpacing.large,
    children: [
      for (final (label, disabled, readOnly, selected) in [
        (
          _pick(locale, 'Editable', '편집 가능', '編集可能'),
          false,
          false,
          const ['telemetry'],
        ),
        (
          _pick(locale, 'Read only', '읽기 전용', '読み取り専用'),
          false,
          true,
          const ['newsletter'],
        ),
        (
          _pick(locale, 'Disabled', '비활성', '無効'),
          true,
          false,
          const ['telemetry'],
        ),
      ])
        TRField(
          label: label,
          disabled: disabled,
          control: TRCheckboxGroup(
            disabled: disabled,
            defaultValue: selected,
            children: [
              for (final (value, optionLabel) in options)
                _checkboxOption(value, optionLabel, readOnly: readOnly),
            ],
          ),
        ),
    ],
  );
}

Widget _checkboxGroupValidation(BuildContext context, Locale locale) {
  var attempted = false;
  var selected = <String>['telemetry'];
  var saved = <String>[];
  return StatefulBuilder(
    builder: (context, setState) {
      final invalid = attempted && (selected.isEmpty || selected.length > 2);
      final errorText = selected.isEmpty
          ? _pick(
              locale,
              'Select at least one feature.',
              '기능을 하나 이상 선택하세요.',
              '機能を 1 つ以上選択してください。',
            )
          : _pick(
              locale,
              'Select no more than two features.',
              '기능을 두 개까지만 선택하세요.',
              '機能は 2 つまで選択してください。',
            );
      return SizedBox(
        width: 320,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisSize: MainAxisSize.min,
          spacing: TRSpacing.medium,
          children: [
            TRField(
              label: _pick(locale, 'Included features', '포함할 기능', '含める機能'),
              errorText: invalid ? errorText : null,
              control: TRCheckboxGroup(
                value: selected,
                onValueChange: (value) => setState(() {
                  selected = value;
                  saved = [];
                }),
                children: [
                  for (final (value, label) in _checkboxOptions(locale))
                    _checkboxOption(value, label),
                ],
              ),
            ),
            TRButton(
              onPressed: () => setState(() {
                attempted = true;
                saved = selected.isNotEmpty && selected.length <= 2
                    ? [...selected]
                    : [];
              }),
              child: Text(_pick(locale, 'Save features', '기능 저장', '機能を保存')),
            ),
            if (saved.isNotEmpty)
              TRText(
                '${_pick(locale, 'Saved', '저장한 값', '保存値')}: ${saved.join(', ')}',
                variant: TRTextVariant.bodySm,
              ),
          ],
        ),
      );
    },
  );
}

Widget _checkboxGroupParent(BuildContext context, Locale locale) {
  final options = _checkboxOptions(locale);
  final allValues = options.map((option) => option.$1).toList();
  var selected = <String>['telemetry'];
  return StatefulBuilder(
    builder: (context, setState) {
      final allSelected = selected.length == allValues.length;
      return Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        spacing: TRSpacing.small,
        children: [
          MergeSemantics(
            child: Row(
              mainAxisSize: MainAxisSize.min,
              spacing: TRSpacing.small,
              children: [
                TRCheckbox(
                  checked: allSelected,
                  indeterminate: selected.isNotEmpty && !allSelected,
                  onCheckedChange: (checked) =>
                      setState(() => selected = checked ? [...allValues] : []),
                ),
                TRText(
                  _pick(locale, 'Select all', '모두 선택', 'すべて選択'),
                  variant: TRTextVariant.bodySm,
                ),
              ],
            ),
          ),
          TRCheckboxGroup(
            value: selected,
            onValueChange: (value) => setState(() => selected = value),
            children: [
              for (final (value, label) in options)
                _checkboxOption(value, label),
            ],
          ),
          TRText(
            '${_pick(locale, 'Selected', '선택한 값', '選択中')}: '
            '${selected.isEmpty ? _pick(locale, 'none', '없음', 'なし') : selected.join(', ')}',
            variant: TRTextVariant.bodySm,
          ),
        ],
      );
    },
  );
}

Widget _checkboxGroupForm(BuildContext context, Locale locale) {
  final formKey = GlobalKey<TRFormState>();
  var result = '';
  return StatefulBuilder(
    builder: (context, setState) => TRForm(
      key: formKey,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        spacing: TRSpacing.medium,
        children: [
          TRCheckboxGroup(
            name: 'features',
            defaultValue: const ['telemetry'],
            children: [
              for (final (value, label) in _checkboxOptions(locale).take(2))
                _checkboxOption(value, label),
            ],
          ),
          TRButton(
            onPressed: () {
              final values = formKey.currentState?.save()['features'];
              setState(
                () => result = values is List
                    ? values.whereType<String>().join(', ')
                    : '',
              );
            },
            child: Text(
              _pick(locale, 'Collect form values', '폼 값 모으기', 'フォーム値を取得'),
            ),
          ),
          if (result.isNotEmpty)
            TRText(
              '${_pick(locale, 'Submitted', '제출한 값', '送信値')}: $result',
              variant: TRTextVariant.bodySm,
            ),
        ],
      ),
    ),
  );
}

List<(String, String)> _radioPlans(Locale locale) => [
  ('starter', _pick(locale, 'Starter', '스타터', 'スターター')),
  ('growth', _pick(locale, 'Growth', '그로스', 'グロース')),
  ('enterprise', _pick(locale, 'Enterprise', '엔터프라이즈', 'エンタープライズ')),
];

TRRadio _radioOption(
  String value,
  String label, {
  bool disabled = false,
  bool readOnly = false,
  TRUiSize uiSize = TRUiSize.md,
}) {
  return TRRadio(
    value: value,
    disabled: disabled,
    readOnly: readOnly,
    uiSize: uiSize,
    label: TRText(label, variant: TRTextVariant.bodySm),
  );
}

Widget _radioStates(BuildContext context, Locale locale) {
  return TRRadioGroup(
    defaultValue: 'growth',
    children: [
      for (final (value, label) in _radioPlans(locale).take(2))
        _radioOption(value, label),
    ],
  );
}

Widget _radioSizes(BuildContext context, Locale locale) {
  return Wrap(
    crossAxisAlignment: WrapCrossAlignment.center,
    spacing: TRSpacing.large,
    runSpacing: TRSpacing.medium,
    children: [
      for (final size in TRUiSize.values)
        TRRadioGroup(
          defaultValue: 'on',
          children: [_radioOption('on', size.name, uiSize: size)],
        ),
    ],
  );
}

Widget _radioAvailability(BuildContext context, Locale locale) {
  return TRRadioGroup(
    defaultValue: 'editable',
    children: [
      _radioOption('editable', _pick(locale, 'Editable', '편집 가능', '編集可能')),
      _radioOption(
        'read-only',
        _pick(locale, 'Read only', '읽기 전용', '読み取り専用'),
        readOnly: true,
      ),
      _radioOption(
        'disabled',
        _pick(locale, 'Disabled', '비활성', '無効'),
        disabled: true,
      ),
    ],
  );
}

Widget _radioGroupStates(BuildContext context, Locale locale) {
  final plans = _radioPlans(locale).take(2).toList();
  return Wrap(
    spacing: TRSpacing.large,
    runSpacing: TRSpacing.large,
    children: [
      for (final (label, disabled, readOnly) in [
        (_pick(locale, 'Editable', '편집 가능', '編集可能'), false, false),
        (_pick(locale, 'Read only', '읽기 전용', '読み取り専用'), false, true),
        (_pick(locale, 'Disabled', '비활성', '無効'), true, false),
      ])
        TRField(
          label: label,
          disabled: disabled,
          control: TRRadioGroup(
            defaultValue: 'starter',
            disabled: disabled,
            readOnly: readOnly,
            children: [
              for (final (value, optionLabel) in plans)
                _radioOption(value, optionLabel),
            ],
          ),
        ),
    ],
  );
}

Widget _radioGroupValidation(BuildContext context, Locale locale) {
  var attempted = false;
  String? plan;
  var saved = '';
  return StatefulBuilder(
    builder: (context, setState) => SizedBox(
      width: 320,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        spacing: TRSpacing.medium,
        children: [
          TRField(
            label: _pick(locale, 'Support plan', '지원 플랜', 'サポートプラン'),
            errorText: attempted && plan == null
                ? _pick(
                    locale,
                    'Choose a support plan to continue.',
                    '계속하려면 지원 플랜을 선택하세요.',
                    'サポートプランを選択してください。',
                  )
                : null,
            control: TRRadioGroup(
              value: plan,
              onValueChange: (next) => setState(() {
                plan = next;
                saved = '';
              }),
              children: [
                for (final (value, label) in _radioPlans(locale))
                  _radioOption(value, label),
              ],
            ),
          ),
          TRButton(
            onPressed: () => setState(() {
              attempted = true;
              saved = plan ?? '';
            }),
            child: Text(_pick(locale, 'Continue', '계속', '続ける')),
          ),
          if (saved.isNotEmpty)
            TRText(
              '${_pick(locale, 'Selected', '선택한 값', '選択値')}: $saved',
              variant: TRTextVariant.bodySm,
            ),
        ],
      ),
    ),
  );
}

Widget _radioGroupForm(BuildContext context, Locale locale) {
  final formKey = GlobalKey<TRFormState>();
  var result = '';
  return StatefulBuilder(
    builder: (context, setState) => TRForm(
      key: formKey,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        spacing: TRSpacing.medium,
        children: [
          TRRadioGroup(
            name: 'plan',
            defaultValue: 'starter',
            children: [
              for (final (value, label) in _radioPlans(locale).take(2))
                _radioOption(value, label),
            ],
          ),
          TRButton(
            onPressed: () {
              final value = formKey.currentState?.save()['plan'];
              setState(() => result = value is String ? value : '');
            },
            child: Text(
              _pick(locale, 'Collect form values', '폼 값 모으기', 'フォーム値を取得'),
            ),
          ),
          if (result.isNotEmpty)
            TRText(
              '${_pick(locale, 'Submitted', '제출한 값', '送信値')}: $result',
              variant: TRTextVariant.bodySm,
            ),
        ],
      ),
    ),
  );
}

Widget _formBasic(BuildContext context, Locale locale) =>
    _FormBasicExample(locale: locale);

class _FormBasicExample extends StatefulWidget {
  const _FormBasicExample({required this.locale});

  final Locale locale;

  @override
  State<_FormBasicExample> createState() => _FormBasicExampleState();
}

class _FormBasicExampleState extends State<_FormBasicExample> {
  final _formKey = GlobalKey<TRFormState>();
  String _submitted = '';

  @override
  Widget build(BuildContext context) {
    final locale = widget.locale;
    return TRForm(
      key: _formKey,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        spacing: TRSpacing.medium,
        children: [
          TRTextField(
            name: 'rack',
            label: _pick(locale, 'Rack name', '랙 이름', 'ラック名'),
            initialValue: 'rack-alpha',
          ),
          TRTextField(
            name: 'secret',
            label: _pick(locale, 'Access token', '액세스 토큰', 'アクセストークン'),
            obscureText: true,
          ),
          TRTextField(
            name: 'notes',
            label: _pick(locale, 'Notes', '메모', 'メモ'),
            minLines: 2,
            maxLines: 4,
          ),
          Wrap(
            spacing: TRSpacing.small,
            runSpacing: TRSpacing.small,
            children: [
              TRButton(
                onPressed: () {
                  final values = _formKey.currentState!.save();
                  setState(() => _submitted = values['rack']?.toString() ?? '');
                },
                child: Text(_pick(locale, 'Submit rack', '랙 제출', 'ラックを送信')),
              ),
              TRButton(
                appearance: TRAppearance.outline,
                onPressed: () {
                  _formKey.currentState!.reset();
                  setState(() => _submitted = '');
                },
                child: Text(_pick(locale, 'Reset form', '폼 초기화', 'フォームをリセット')),
              ),
            ],
          ),
          if (_submitted.isNotEmpty)
            TRText(
              '${_pick(locale, 'Submitted', '제출한 값', '送信値')}: $_submitted',
              variant: TRTextVariant.bodySm,
            ),
        ],
      ),
    );
  }
}

Widget _formStates(BuildContext context, Locale locale) =>
    _FormStatesExample(locale: locale);

class _FormStatesExample extends StatefulWidget {
  const _FormStatesExample({required this.locale});

  final Locale locale;

  @override
  State<_FormStatesExample> createState() => _FormStatesExampleState();
}

class _FormStatesExampleState extends State<_FormStatesExample> {
  final _formKey = GlobalKey<TRFormState>();
  String _saved = '';

  @override
  Widget build(BuildContext context) {
    final locale = widget.locale;
    return TRForm(
      key: _formKey,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        spacing: TRSpacing.medium,
        children: [
          TRTextField(
            name: 'rack',
            label: _pick(locale, 'Rack name', '랙 이름', 'ラック名'),
            validator: (value) => (value ?? '').trim().isEmpty
                ? _pick(
                    locale,
                    'Enter a rack name before saving.',
                    '저장하기 전에 랙 이름을 입력하세요.',
                    '保存する前にラック名を入力してください。',
                  )
                : null,
          ),
          TRButton(
            onPressed: () {
              final state = _formKey.currentState!;
              if (!state.validate()) {
                setState(() => _saved = '');
                return;
              }
              setState(() => _saved = state.save()['rack']?.toString() ?? '');
            },
            child: Text(_pick(locale, 'Save rack', '랙 저장', 'ラックを保存')),
          ),
          if (_saved.isNotEmpty)
            TRText(
              '${_pick(locale, 'Saved', '저장한 값', '保存値')}: $_saved',
              variant: TRTextVariant.bodySm,
            ),
        ],
      ),
    );
  }
}

Widget _formServerErrors(BuildContext context, Locale locale) =>
    _FormServerErrorsExample(locale: locale);

class _FormServerErrorsExample extends StatefulWidget {
  const _FormServerErrorsExample({required this.locale});

  final Locale locale;

  @override
  State<_FormServerErrorsExample> createState() =>
      _FormServerErrorsExampleState();
}

class _FormServerErrorsExampleState extends State<_FormServerErrorsExample> {
  final _formKey = GlobalKey<TRFormState>();
  String? _serverError;
  String _result = '';

  void _clearServerError() {
    if (_serverError == null) return;
    setState(() => _serverError = null);
  }

  @override
  Widget build(BuildContext context) {
    final locale = widget.locale;
    return TRForm(
      key: _formKey,
      onChanged: (_) => _clearServerError(),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        spacing: TRSpacing.medium,
        children: [
          TRTextField(
            name: 'rack',
            label: _pick(locale, 'Rack name', '랙 이름', 'ラック名'),
            initialValue: 'rack-alpha',
            helperText: _pick(
              locale,
              'Use a name that is not already registered.',
              '아직 등록되지 않은 이름을 사용하세요.',
              'まだ登録されていない名前を使ってください。',
            ),
            errorText: _serverError,
          ),
          Wrap(
            spacing: TRSpacing.small,
            runSpacing: TRSpacing.small,
            children: [
              TRButton(
                onPressed: () {
                  final rack =
                      _formKey.currentState!.save()['rack']?.toString() ?? '';
                  if (rack.toLowerCase() == 'rack-alpha') {
                    setState(() {
                      _serverError = _pick(
                        locale,
                        'Rack Alpha already exists.',
                        'Rack Alpha는 이미 있어요.',
                        'Rack Alpha はすでに存在します。',
                      );
                      _result = '';
                    });
                    return;
                  }
                  setState(() {
                    _serverError = null;
                    _result = rack;
                  });
                },
                child: Text(_pick(locale, 'Create rack', '랙 만들기', 'ラックを作成')),
              ),
              TRButton(
                appearance: TRAppearance.outline,
                onPressed: () {
                  _formKey.currentState!.reset();
                  setState(() {
                    _serverError = null;
                    _result = '';
                  });
                },
                child: Text(_pick(locale, 'Reset form', '폼 초기화', 'フォームをリセット')),
              ),
            ],
          ),
          if (_result.isNotEmpty)
            TRText(
              '${_pick(locale, 'Created', '만든 랙', '作成したラック')}: $_result',
              variant: TRTextVariant.bodySm,
            ),
        ],
      ),
    );
  }
}

Widget _formActions(BuildContext context, Locale locale) =>
    _FormActionsExample(locale: locale);

class _FormActionsExample extends StatefulWidget {
  const _FormActionsExample({required this.locale});

  final Locale locale;

  @override
  State<_FormActionsExample> createState() => _FormActionsExampleState();
}

class _FormActionsExampleState extends State<_FormActionsExample> {
  final _formKey = GlobalKey<TRFormState>();
  String _snapshot = '';
  String _valid = '';

  @override
  Widget build(BuildContext context) {
    final locale = widget.locale;
    return TRForm(
      key: _formKey,
      onChanged: (values) {
        final snapshot = values.entries
            .map((entry) => '${entry.key}=${entry.value}')
            .join(', ');
        setState(() => _snapshot = snapshot);
      },
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        spacing: TRSpacing.medium,
        children: [
          TRTextField(
            name: 'rack',
            label: _pick(locale, 'Rack name', '랙 이름', 'ラック名'),
            validator: (value) => (value ?? '').trim().isEmpty
                ? _pick(
                    locale,
                    'Enter a rack name.',
                    '랙 이름을 입력하세요.',
                    'ラック名を入力してください。',
                  )
                : null,
          ),
          TRTextField(
            name: 'region',
            label: _pick(locale, 'Region', '리전', 'リージョン'),
            initialValue: 'ap-northeast-2',
            enabled: false,
          ),
          TRButton(
            onPressed: () => setState(() {
              _valid = _formKey.currentState!.validateGranularly()
                  ? _pick(locale, 'Valid', '통과', '有効')
                  : _pick(locale, 'Invalid', '실패', '無効');
            }),
            child: Text(_pick(locale, 'Validate all', '모두 검증', 'すべて検証')),
          ),
          if (_snapshot.isNotEmpty)
            TRText(
              '${_pick(locale, 'Snapshot', '스냅샷', 'スナップショット')}: $_snapshot',
              variant: TRTextVariant.bodySm,
            ),
          if (_valid.isNotEmpty) TRText(_valid, variant: TRTextVariant.bodySm),
        ],
      ),
    );
  }
}

Widget _textareaBasic(BuildContext context, Locale locale) {
  return SizedBox(
    width: 320,
    child: TRField(
      label: _pick(locale, 'Rack notes', '랙 메모', 'ラックのメモ'),
      description: _pick(
        locale,
        'Shared with everyone on the rack team.',
        '랙 팀 모두에게 공유돼요.',
        'ラックチーム全員に共有されます。',
      ),
      control: TRTextarea(
        name: 'notes',
        placeholder: _pick(locale, 'Operational notes', '운영 메모', '運用メモ'),
      ),
    ),
  );
}

Widget _textareaStates(BuildContext context, Locale locale) {
  final note = _pick(
    locale,
    'Swap the fan tray tomorrow.',
    '내일 팬 트레이를 교체하세요.',
    '明日ファントレイを交換してください。',
  );
  final placeholder = _pick(locale, 'Operational notes', '운영 메모', '運用メモ');

  Widget state(
    String label, {
    bool enabled = true,
    bool readOnly = false,
    String? text,
  }) {
    return SizedBox(
      width: 240,
      child: TRField(
        label: label,
        disabled: !enabled,
        control: TRTextarea(
          enabled: enabled,
          initialValue: text,
          placeholder: placeholder,
          readOnly: readOnly,
        ),
      ),
    );
  }

  return Wrap(
    spacing: TRSpacing.large,
    runSpacing: TRSpacing.large,
    children: [
      state(_pick(locale, 'Editable', '편집 가능', '編集可能')),
      state(
        _pick(locale, 'Read only', '읽기 전용', '読み取り専用'),
        readOnly: true,
        text: note,
      ),
      state(_pick(locale, 'Disabled', '비활성', '無効'), enabled: false, text: note),
    ],
  );
}

Widget _textareaSizes(BuildContext context, Locale locale) {
  final note = _pick(locale, 'Rack notes', '랙 메모', 'ラックのメモ');
  return Wrap(
    spacing: TRSpacing.large,
    runSpacing: TRSpacing.large,
    children: [
      for (final size in TRUiSize.values)
        SizedBox(
          width: 240,
          child: TRField(
            label: size.name,
            control: TRTextarea(initialValue: note, uiSize: size),
          ),
        ),
    ],
  );
}

Widget _textareaForm(BuildContext context, Locale locale) =>
    _TextareaFormExample(locale: locale);

class _TextareaFormExample extends StatefulWidget {
  const _TextareaFormExample({required this.locale});

  final Locale locale;

  @override
  State<_TextareaFormExample> createState() => _TextareaFormExampleState();
}

class _TextareaFormExampleState extends State<_TextareaFormExample> {
  final _formKey = GlobalKey<TRFormState>();
  late final String _initialNote = _pick(
    widget.locale,
    'Scheduled maintenance',
    '예정된 유지보수',
    '予定メンテナンス',
  );
  // TRTextarea is not a FormField, so reset() cannot restore its text.
  // The docs snippet keeps the same controller for the same reason.
  late final TextEditingController _controller = TextEditingController(
    text: _initialNote,
  );
  String _submitted = '';

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final locale = widget.locale;
    return SizedBox(
      width: 320,
      child: TRForm(
        key: _formKey,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisSize: MainAxisSize.min,
          spacing: TRSpacing.medium,
          children: [
            TRField(
              label: _pick(locale, 'Maintenance notes', '유지보수 메모', 'メンテナンスのメモ'),
              control: TRTextarea(name: 'notes', controller: _controller),
            ),
            Wrap(
              spacing: TRSpacing.small,
              runSpacing: TRSpacing.small,
              children: [
                TRButton(
                  onPressed: () {
                    final values = _formKey.currentState!.values;
                    setState(
                      () => _submitted = values['notes']?.toString() ?? '',
                    );
                  },
                  child: Text(_pick(locale, 'Submit', '제출', '送信')),
                ),
                TRButton(
                  appearance: TRAppearance.outline,
                  onPressed: () {
                    _controller.text = _initialNote;
                    setState(() => _submitted = '');
                  },
                  child: Text(_pick(locale, 'Reset', '초기화', 'リセット')),
                ),
              ],
            ),
            if (_submitted.isNotEmpty)
              TRText(
                '${_pick(locale, 'Submitted', '제출한 값', '送信値')}: $_submitted',
                variant: TRTextVariant.bodySm,
              ),
          ],
        ),
      ),
    );
  }
}

Widget _textareaValidation(BuildContext context, Locale locale) =>
    _TextareaValidationExample(locale: locale);

class _TextareaValidationExample extends StatefulWidget {
  const _TextareaValidationExample({required this.locale});

  final Locale locale;

  @override
  State<_TextareaValidationExample> createState() =>
      _TextareaValidationExampleState();
}

class _TextareaValidationExampleState
    extends State<_TextareaValidationExample> {
  final _reasonFocusNode = FocusNode();
  bool _attempted = false;
  bool _submitted = false;
  String _reason = '';

  @override
  void dispose() {
    _reasonFocusNode.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final locale = widget.locale;
    final invalid = _attempted && _reason.trim().isEmpty;
    return SizedBox(
      width: 320,
      child: TRForm(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisSize: MainAxisSize.min,
          spacing: TRSpacing.medium,
          children: [
            TRField(
              label: _pick(locale, 'Change reason', '변경 이유', '変更理由'),
              errorText: invalid
                  ? _pick(
                      locale,
                      'Add a reason before submitting.',
                      '제출하기 전에 이유를 입력하세요.',
                      '送信前に理由を入力してください。',
                    )
                  : null,
              control: TRTextarea(
                name: 'reason',
                focusNode: _reasonFocusNode,
                onChanged: (value) => setState(() {
                  _reason = value;
                  _submitted = false;
                }),
              ),
            ),
            TRButton(
              onPressed: () {
                final empty = _reason.trim().isEmpty;
                setState(() {
                  _attempted = true;
                  _submitted = !empty;
                });
                if (empty) _reasonFocusNode.requestFocus();
              },
              child: Text(_pick(locale, 'Submit change', '변경 사항 제출', '変更を送信')),
            ),
            if (_submitted)
              TRText(
                _pick(
                  locale,
                  'Change submitted.',
                  '변경 사항을 제출했어요.',
                  '変更を送信しました。',
                ),
                variant: TRTextVariant.bodySm,
              ),
          ],
        ),
      ),
    );
  }
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

Widget _menuIconTrigger(BuildContext context, Locale locale) => Row(
  mainAxisSize: MainAxisSize.min,
  children: [
    // Beside a plain icon button, so the shared square geometry is the point
    // of the preview rather than something the reader has to measure.
    TRIconButton(
      appearance: TRAppearance.ghost,
      icon: const Icon(Icons.view_sidebar_outlined),
      label: _pick(locale, 'Toggle sidebar', '사이드바 전환', 'サイドバー切り替え'),
      onPressed: () {},
    ),
    TRMenu.icon(
      icon: const Icon(Icons.add),
      label: _pick(locale, 'New tab', '새 탭', '新しいタブ'),
      menuChildren: [
        TRMenuItem(
          leadingIcon: const Icon(Icons.chat_bubble_outline),
          onPressed: () {},
          child: Text(_pick(locale, 'New session', '새 세션', '新しいセッション')),
        ),
        TRMenuItem(
          leadingIcon: const Icon(Icons.terminal),
          onPressed: () {},
          child: Text(_pick(locale, 'New terminal', '새 터미널', '新しいターミナル')),
        ),
      ],
    ),
  ],
);

Widget _menubarNestedLayers(BuildContext context, Locale locale) => TRMenubar(
  semanticLabel: _pick(locale, 'Application menu', '애플리케이션 메뉴', 'アプリケーションメニュー'),
  menus: [
    TRMenubarMenu(
      trigger: Text(_pick(locale, 'Deploy', '배포', 'デプロイ')),
      menuChildren: [
        TRMenuSubmenu(
          menuChildren: [
            TRMenuSubmenu(
              menuChildren: [
                TRMenuItem(
                  onPressed: () {},
                  child: Text(_pick(locale, 'Seoul', '서울', 'ソウル')),
                ),
              ],
              child: Text(_pick(locale, 'Asia Pacific', '아시아 태평양', 'アジア太平洋')),
            ),
          ],
          child: Text(_pick(locale, 'Region', '리전', 'リージョン')),
        ),
      ],
    ),
  ],
);

Widget _menubarMenuStates(BuildContext context, Locale locale) {
  var status = _pick(locale, 'Menu closed', '메뉴 닫힘', 'メニューは閉じています');
  return StatefulBuilder(
    builder: (context, setState) => Column(
      mainAxisSize: MainAxisSize.min,
      spacing: TRSpacing.medium,
      children: [
        TRMenubar(
          semanticLabel: _pick(
            locale,
            'Application menu',
            '애플리케이션 메뉴',
            'アプリケーションメニュー',
          ),
          menus: [
            TRMenubarMenu(
              trigger: Text(_pick(locale, 'File', '파일', 'ファイル')),
              onOpen: () => setState(
                () => status = _pick(
                  locale,
                  'File menu open',
                  '파일 메뉴 열림',
                  'ファイルメニューを開きました',
                ),
              ),
              onClose: () => setState(
                () => status = _pick(
                  locale,
                  'Menu closed',
                  '메뉴 닫힘',
                  'メニューを閉じました',
                ),
              ),
              menuChildren: [
                TRMenuItem(
                  onPressed: () {},
                  child: Text(_pick(locale, 'New rack', '새 랙', '新規ラック')),
                ),
              ],
            ),
            TRMenubarMenu(
              enabled: false,
              trigger: Text(_pick(locale, 'Managed', '관리됨', '管理対象')),
              menuChildren: const [],
            ),
          ],
        ),
        Text(status),
      ],
    ),
  );
}

Widget _selectControlled(BuildContext context, Locale locale) {
  String? channel = 'stable';
  return StatefulBuilder(
    builder: (context, setState) => SizedBox(
      width: 320,
      child: TRSelect<String>.controlled(
        value: channel,
        leading: const Icon(Icons.layers),
        label: _pick(locale, 'Release channel', '릴리스 채널', 'リリースチャンネル'),
        items: [
          TRSelectItem(
            key: const ValueKey('release-channel-stable'),
            value: 'stable',
            label: _pick(locale, 'Stable', '안정', '安定版'),
            description: _pick(
              locale,
              'Recommended for production',
              '프로덕션에 권장해요',
              '本番環境に推奨します',
            ),
          ),
          TRSelectItem(
            key: const ValueKey('release-channel-beta'),
            value: 'beta',
            label: _pick(locale, 'Beta', '베타', 'ベータ'),
            description: _pick(
              locale,
              'Preview upcoming changes',
              '예정된 변경을 미리 확인해요',
              '今後の変更を先行確認します',
            ),
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

Widget _selectSearchable(BuildContext context, Locale locale) {
  const regions = <(String, String, String, String)>[
    ('seoul', 'Seoul', '서울', 'ソウル'),
    ('busan', 'Busan', '부산', '釜山'),
    ('tokyo', 'Tokyo', '도쿄', '東京'),
    ('osaka', 'Osaka', '오사카', '大阪'),
    ('singapore', 'Singapore', '싱가포르', 'シンガポール'),
    ('sydney', 'Sydney', '시드니', 'シドニー'),
  ];
  String? region = 'seoul';
  return StatefulBuilder(
    builder: (context, setState) => SizedBox(
      width: 320,
      child: TRSelect<String>.controlled(
        value: region,
        label: _pick(locale, 'Region', '지역', '地域'),
        searchable: true,
        searchPlaceholder: _pick(locale, 'Search regions', '지역 검색', '地域を検索'),
        noResultsText: _pick(
          locale,
          'No matching region',
          '일치하는 지역이 없습니다',
          '一致する地域がありません',
        ),
        items: [
          for (final (value, en, ko, ja) in regions)
            TRSelectItem(value: value, label: _pick(locale, en, ko, ja)),
        ],
        onValueChange: (value) => setState(() => region = value),
      ),
    ),
  );
}

Widget _selectSurface(BuildContext context, Locale locale) => SizedBox(
  width: 320,
  child: TRSelect<String>(
    label: _pick(locale, 'Release channel', '릴리스 채널', 'リリースチャンネル'),
    defaultValue: 'stable',
    // Pinned so the example reads the same at every preview width; leaving it
    // at TRSelectSurface.auto is what a product screen wants.
    surface: TRSelectSurface.menu,
    items: [
      TRSelectItem(
        value: 'stable',
        label: _pick(locale, 'Stable', '안정', '安定版'),
      ),
      TRSelectItem(value: 'beta', label: _pick(locale, 'Beta', '베타', 'ベータ')),
    ],
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

Widget _dialogScrollable(BuildContext context, Locale locale) => TRButton(
  onPressed: () => showTRDialog<void>(
    context: context,
    builder: (dialogContext) => TRDialog(
      title: Text(_pick(locale, 'Release notes', '릴리스 노트', 'リリースノート')),
      content: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        spacing: TRSpacing.medium,
        children: List<Widget>.generate(
          20,
          (index) => Text(
            _pick(
              locale,
              'Change ${index + 1}: Modal content remains readable.',
              '변경 ${index + 1}: 모달 콘텐츠를 계속 읽을 수 있어요.',
              '変更 ${index + 1}: モーダルの内容を続けて読めます。',
            ),
          ),
        ),
      ),
      actions: TRButton(
        onPressed: () => Navigator.pop(dialogContext),
        child: Text(_pick(locale, 'Done', '완료', '完了')),
      ),
    ),
  ),
  child: Text(_pick(locale, 'Open long dialog', '긴 다이얼로그 열기', '長いダイアログを開く')),
);

Widget _alertDialogResult(BuildContext context, Locale locale) =>
    _AlertDialogResultExample(locale: locale);

Widget _alertDialogScrollable(BuildContext context, Locale locale) => TRButton(
  onPressed: () => showTRAlertDialog<void>(
    context: context,
    builder: (dialogContext) => TRAlertDialog(
      title: Text(_pick(locale, 'Review output', '출력 검토', '出力を確認')),
      content: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        spacing: TRSpacing.medium,
        children: List<Widget>.generate(
          20,
          (index) => Text(
            _pick(
              locale,
              'Output line ${index + 1}',
              '출력 줄 ${index + 1}',
              '出力行 ${index + 1}',
            ),
          ),
        ),
      ),
      actions: <TRButton>[
        TRButton(
          onPressed: () => Navigator.pop(dialogContext),
          child: Text(_pick(locale, 'Close', '닫기', '閉じる')),
        ),
      ],
    ),
  ),
  child: Text(_pick(locale, 'Open long alert', '긴 경고 열기', '長い警告を開く')),
);

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
        uiSize: TRUiSize.md,
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

List<TRComboboxItem<String>> _comboboxRacks({bool disabledSecond = false}) => [
  const TRComboboxItem(value: 'rack-a', label: 'Rack A'),
  TRComboboxItem(value: 'rack-b', label: 'Rack B', enabled: !disabledSecond),
  const TRComboboxItem(value: 'rack-c', label: 'Rack C'),
];

String _comboboxRackLabel(Locale locale) =>
    _pick(locale, 'Deployment rack', '배포 랙', 'デプロイ先ラック');

String _comboboxRackPlaceholder(Locale locale) =>
    _pick(locale, 'Choose a rack', '랙을 선택하세요', 'ラックを選択');

Widget _comboboxBasic(BuildContext context, Locale locale) => SizedBox(
  width: 320,
  child: TRCombobox<String>(
    label: _comboboxRackLabel(locale),
    placeholder: _comboboxRackPlaceholder(locale),
    helperText: _pick(
      locale,
      'Type to filter, then commit one rack',
      '입력해서 좁힌 뒤 랙 하나를 확정하세요',
      '入力して絞り込み、ラックを 1 つ確定します',
    ),
    items: _comboboxRacks(),
  ),
);

Widget _comboboxSizes(BuildContext context, Locale locale) => Column(
  mainAxisSize: MainAxisSize.min,
  spacing: TRSpacing.medium,
  children: [
    for (final uiSize in TRUiSize.values)
      TRCombobox<String>(
        label: _comboboxRackLabel(locale),
        placeholder: _comboboxRackPlaceholder(locale),
        items: _comboboxRacks(),
        uiSize: uiSize,
        width: 320,
      ),
  ],
);

Widget _comboboxOptionStates(BuildContext context, Locale locale) => SizedBox(
  width: 320,
  child: TRCombobox<String>(
    label: _comboboxRackLabel(locale),
    placeholder: _comboboxRackPlaceholder(locale),
    helperText: _pick(
      locale,
      'Racks under maintenance stay visible but cannot be picked',
      '점검 중인 랙도 계속 보이지만 선택할 수는 없어요',
      'メンテナンス中のラックも表示されますが選択できません',
    ),
    defaultValue: 'rack-a',
    items: _comboboxRacks(disabledSecond: true),
  ),
);

Widget _comboboxFilterModes(BuildContext context, Locale locale) => Column(
  mainAxisSize: MainAxisSize.min,
  spacing: TRSpacing.medium,
  children: [
    TRCombobox<String>(
      label: _pick(locale, 'Contains', '부분 일치', '部分一致'),
      placeholder: _comboboxRackPlaceholder(locale),
      items: _comboboxRacks(),
      width: 320,
    ),
    TRCombobox<String>(
      label: _pick(locale, 'Starts with', '접두사 일치', '前方一致'),
      placeholder: _comboboxRackPlaceholder(locale),
      items: _comboboxRacks(),
      filterMode: TRComboboxFilterMode.startsWith,
      width: 320,
    ),
    TRCombobox<String>(
      label: _pick(locale, 'Server side', '서버 측', 'サーバー側'),
      placeholder: _comboboxRackPlaceholder(locale),
      filterMode: TRComboboxFilterMode.none,
      optionsBuilder: (query) => _comboboxRacks()
          .where(
            (item) =>
                query.isEmpty ||
                item.label.toLowerCase().contains(query.toLowerCase()),
          )
          .toList(),
      width: 320,
    ),
  ],
);

Widget _comboboxMultipleAnatomy(BuildContext context, Locale locale) =>
    SizedBox(
      width: 320,
      child: TRMultiCombobox<String>(
        label: _pick(locale, 'Deployment racks', '배포 랙', 'デプロイ先ラック'),
        placeholder: _pick(locale, 'Choose racks', '랙을 선택하세요', 'ラックを選択'),
        helperText: _pick(
          locale,
          'Committed racks appear as chips above the field',
          '확정한 랙은 필드 위에 칩으로 나타나요',
          '確定したラックはフィールドの上にチップとして表示されます',
        ),
        layout: TRComboboxLayout.grid,
        defaultValue: const ['rack-a'],
        items: [
          for (final item in _comboboxRacks())
            TRComboboxItem(
              value: item.value,
              label: item.label,
              leading: const Icon(Icons.dns_outlined),
            ),
        ],
      ),
    );

Widget _comboboxValidation(BuildContext context, Locale locale) =>
    _ComboboxValidationExample(locale: locale);

class _ComboboxValidationExample extends StatefulWidget {
  const _ComboboxValidationExample({required this.locale});

  final Locale locale;

  @override
  State<_ComboboxValidationExample> createState() =>
      _ComboboxValidationExampleState();
}

class _ComboboxValidationExampleState
    extends State<_ComboboxValidationExample> {
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
          TRComboboxFormField<String>(
            label: _comboboxRackLabel(widget.locale),
            placeholder: _comboboxRackPlaceholder(widget.locale),
            items: _comboboxRacks(),
            autovalidateMode: AutovalidateMode.onUserInteraction,
            validator: (value) => value == null
                ? _pick(
                    widget.locale,
                    'Choose a rack',
                    '랙을 선택하세요',
                    'ラックを選択してください',
                  )
                : null,
          ),
          TRButton(
            onPressed: () => _formKey.currentState?.validate(),
            child: Text(_pick(widget.locale, 'Deploy', '배포', 'デプロイ')),
          ),
        ],
      ),
    ),
  );
}

Widget _comboboxControlledFilterHooks(BuildContext context, Locale locale) =>
    _ComboboxControlledExample(locale: locale);

class _ComboboxControlledExample extends StatefulWidget {
  const _ComboboxControlledExample({required this.locale});

  final Locale locale;

  @override
  State<_ComboboxControlledExample> createState() =>
      _ComboboxControlledExampleState();
}

class _ComboboxControlledExampleState
    extends State<_ComboboxControlledExample> {
  final _controller = TRComboboxController<String>(value: 'rack-a');
  String? _rack = 'rack-a';
  String _query = '';

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) => SizedBox(
    width: 320,
    child: TRCombobox<String>.controlled(
      value: _rack,
      controller: _controller,
      label: _comboboxRackLabel(widget.locale),
      placeholder: _comboboxRackPlaceholder(widget.locale),
      helperText: '${_pick(widget.locale, 'Query: ', '검색어: ', '検索語: ')}$_query',
      items: _comboboxRacks(),
      filter: (item, query) => item.label.toLowerCase().endsWith(query),
      onQueryChange: (value) => setState(() => _query = value),
      onValueChange: (value) => setState(() => _rack = value),
    ),
  );
}

Widget _comboboxOverlay(BuildContext context, Locale locale) => Column(
  mainAxisSize: MainAxisSize.min,
  spacing: TRSpacing.medium,
  children: [
    TRCombobox<String>(
      label: _pick(
        locale,
        'Popup follows the field',
        '팝업이 필드 너비를 따름',
        'ポップアップはフィールド幅に追従',
      ),
      placeholder: _comboboxRackPlaceholder(locale),
      items: _comboboxRacks(),
      width: 360,
    ),
    SizedBox(
      width: 360,
      child: TRCombobox<String>(
        label: _pick(
          locale,
          'Popup uses the overlay token',
          '팝업이 오버레이 토큰을 사용',
          'ポップアップはオーバーレイトークンを使用',
        ),
        placeholder: _comboboxRackPlaceholder(locale),
        items: _comboboxRacks(),
      ),
    ),
  ],
);

Widget _comboboxKeyboard(BuildContext context, Locale locale) => SizedBox(
  width: 320,
  child: TRCombobox<String>(
    label: _comboboxRackLabel(locale),
    placeholder: _comboboxRackPlaceholder(locale),
    helperText: _pick(
      locale,
      'Arrow keys move, Enter commits, Escape closes',
      '방향키로 이동, Enter로 확정, Escape로 닫기',
      '矢印キーで移動、Enter で確定、Escape で閉じます',
    ),
    autoHighlight: false,
    clearable: true,
    clearSemanticLabel: _pick(locale, 'Clear rack', '랙 지우기', 'ラックをクリア'),
    items: _comboboxRacks(disabledSecond: true),
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
    breakpoint: TRAppShellBreakpoint.lg,
    defaultSidebarMode: TRAppShellSidebarMode.rail,
    mobileSidebar: TRAppShellMobileSidebar.rail,
    header: TRAppShellHeader(
      height: 52,
      padding: const EdgeInsets.symmetric(horizontal: TRSpacing.medium),
      children: [
        TRAppShellBrand(
          child: Text(
            _pick(locale, 'Orbit Ops', 'Orbit 운영', 'Orbit Ops'),
            style: const TextStyle(fontWeight: FontWeight.w600),
          ),
        ),
        const TRAppShellActions(children: [Text('us-east')]),
      ],
    ),
    sidebar: TRAppShellSidebar(
      padding: const EdgeInsets.all(TRSpacing.small),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        spacing: TRSpacing.small,
        children: [
          const Icon(Icons.speed_outlined, size: 16),
          TRAppShellSidebarLabel(
            child: Text(_pick(locale, 'Overview', '개요', '概要')),
          ),
        ],
      ),
    ),
    main: TRAppShellMain(
      child: Center(
        child: Text(_pick(locale, 'Deployment overview', '배포 개요', 'デプロイ概要')),
      ),
    ),
  ),
);

Widget _appShellControls(BuildContext context, Locale locale) => SizedBox(
  width: 720,
  height: 360,
  child: TRAppShell(
    breakpoint: TRAppShellBreakpoint.sm,
    layout: TRAppShellLayout.sidebarFirst,
    header: TRAppShellHeader(
      height: 48,
      padding: const EdgeInsets.symmetric(horizontal: TRSpacing.medium),
      children: [
        TRAppShellBrand(
          child: Text(_pick(locale, 'Control styles', '컨트롤 스타일', 'コントロールスタイル')),
        ),
      ],
    ),
    sidebar: TRAppShellSidebar(
      padding: const EdgeInsets.all(TRSpacing.medium),
      scroll: false,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        spacing: TRSpacing.small,
        children: [
          for (final appearance in TRAppearance.values)
            Row(
              children: [
                TRAppShellSidebarToggle(
                  appearance: appearance,
                  icon: const Icon(Icons.view_sidebar_outlined),
                  label: appearance.name,
                ),
                const SizedBox(width: TRSpacing.small),
                TRAppShellSidebarLabel(child: Text(appearance.name)),
              ],
            ),
        ],
      ),
    ),
    main: TRAppShellMain(
      child: Center(
        child: Text(
          _pick(
            locale,
            'Solid, outline, and ghost controls',
            'solid, outline, ghost 컨트롤',
            'solid、outline、ghost コントロール',
          ),
        ),
      ),
    ),
  ),
);

Widget _appShellDocs(BuildContext context, Locale locale) => SizedBox(
  width: 720,
  height: 360,
  child: TRAppShell(
    breakpoint: TRAppShellBreakpoint.sm,
    chrome: TRAppShellChrome.docs,
    currentPath: '/guide',
    pendingPath: '/reference',
    header: TRAppShellHeader(
      children: [
        TRAppShellBrand(
          child: Text(
            _pick(locale, 'Tinyrack Docs', 'Tinyrack 문서', 'Tinyrack ドキュメント'),
          ),
        ),
        const TRAppShellActions(children: [Icon(Icons.search, size: 16)]),
      ],
    ),
    sidebar: TRAppShellSidebar(
      padding: const EdgeInsets.all(TRSpacing.medium),
      child: Text(
        _pick(locale, 'Foundations\nComponents', '기초\n컴포넌트', '基礎\nコンポーネント'),
      ),
    ),
    main: TRAppShellMain(
      scroll: true,
      child: Padding(
        padding: const EdgeInsets.all(TRSpacing.large),
        child: Text(
          List.filled(
            8,
            _pick(
              locale,
              'Scrollable documentation content',
              '스크롤되는 문서 콘텐츠',
              'スクロールするドキュメントコンテンツ',
            ),
          ).join('\n\n'),
        ),
      ),
    ),
  ),
);

Widget _appShellPaneHeader(BuildContext context, Locale locale) =>
    TRUiDensityScope(
      density: TRUiDensity.comfortable,
      child: TRPaneHeader(
        leading: TRIconButton(
          appearance: TRAppearance.ghost,
          icon: const Icon(Icons.arrow_back),
          label: _pick(locale, 'Back', '뒤로', '戻る'),
          onPressed: () {},
        ),
        title: Text(_pick(locale, 'Projects', '프로젝트', 'プロジェクト')),
        description: Text(
          _pick(locale, '1 active project', '활성 프로젝트 1개', '有効なプロジェクト 1 件'),
        ),
        actions: [
          TRButton(
            onPressed: () {},
            child: Text(_pick(locale, 'Create', '만들기', '作成')),
          ),
        ],
      ),
    );

Widget _paginationControlled(BuildContext context, Locale locale) {
  var page = 3;
  return StatefulBuilder(
    builder: (context, setState) => TRPagination(
      currentPage: page,
      totalPages: 24,
      siblingCount: 2,
      onPageChanged: (next) => setState(() => page = next),
    ),
  );
}

Widget _tableDenseStatus(BuildContext context, Locale locale) => const TRTable(
  density: TRTableDensity.compact,
  striped: true,
  columns: [
    TRTableColumn(label: Text('Rack')),
    TRTableColumn(label: Text('Status')),
  ],
  rows: [
    TRTableRow(cells: [Text('Rack A'), Text('Healthy')]),
    TRTableRow(cells: [Text('Rack B'), Text('Degraded')]),
  ],
);

Widget _treeNavNavigation(BuildContext context, Locale locale) {
  String? currentPage = 'theming';
  return StatefulBuilder(
    builder: (context, setState) => SizedBox(
      width: 320,
      child: TRTreeNav<String>.controlled(
        value: currentPage,
        onValueChange: (value) => setState(() => currentPage = value),
        pageStorageId: 'documentation-navigation',
        semanticLabel: _pick(locale, 'Documentation', '문서 탐색', 'ドキュメント'),
        items: [
          TRTreeNavGroup(
            value: 'guides',
            label: Text(_pick(locale, 'GUIDES', '가이드', 'ガイド')),
            initiallyExpanded: true,
            children: [
              TRTreeNavLeaf(
                value: 'install',
                label: Text(_pick(locale, 'Install', '설치', 'インストール')),
                leading: const Icon(Icons.download_outlined, size: 16),
              ),
              TRTreeNavGroup(
                value: 'advanced',
                label: Text(_pick(locale, 'ADVANCED', '고급', '高度な設定')),
                initiallyExpanded: true,
                children: [
                  TRTreeNavLeaf(
                    value: 'plugins',
                    label: Text(_pick(locale, 'Plugins', '플러그인', 'プラグイン')),
                  ),
                  TRTreeNavLeaf(
                    value: 'theming',
                    label: Text(_pick(locale, 'Theming', '테마', 'テーマ')),
                  ),
                  TRTreeNavLeaf(
                    value: 'labs',
                    label: Text(_pick(locale, 'Labs', '실험실', 'ラボ')),
                    disabled: true,
                  ),
                ],
              ),
            ],
          ),
        ],
      ),
    ),
  );
}

Widget _windowFrameBrowser(BuildContext context, Locale locale) =>
    const SizedBox(
      width: 400,
      child: TRWindowFrame(
        variant: TRWindowFrameVariant.browser,
        address: Text('https://tinyrack.net'),
        body: Text('Ready'),
      ),
    );

Widget _windowFrameTitleBarActions(BuildContext context, Locale locale) =>
    SizedBox(
      width: 400,
      child: TRWindowFrameTitleBar(
        leading: const Text('File'),
        actions: TRIconButton(
          icon: const Icon(Icons.remove),
          label: _pick(locale, 'Minimize window', '창 최소화', 'ウィンドウを最小化'),
          onPressed: () {},
          appearance: TRAppearance.ghost,
          uiSize: TRUiSize.sm,
        ),
        child: const Text('Tinyrack'),
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
