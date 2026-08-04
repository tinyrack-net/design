import type { DemoLocale } from '../shared/demo-locale.js';
import type { FlutterPreviewComponent } from './preview-registry.generated.js';

/**
 * One curated docs example for a Flutter component.
 *
 * `id` doubles as the `?example=` scenario key rendered by the preview bundle
 * (see `preview_examples.dart`). `dart` is a copy-ready, locale-independent
 * snippet; `title` and `description` are localized prose.
 */
export type FlutterExampleEntry = {
  dart: string | Record<DemoLocale, string>;
  description: Record<DemoLocale, string>;
  id: string;
  title: Record<DemoLocale, string>;
};

const alertDialogResultSourceEn = String.raw`TRButton(
  intent: TRIntent.danger,
  onPressed: () async {
    final confirmed = await showTRAlertDialog<bool>(
      context: context,
      builder: (dialogContext) => TRAlertDialog(
        title: const Text('Delete rack?'),
        description: const Text('This action cannot be undone.'),
        actions: [
          TRButton(
            appearance: TRAppearance.outline,
            onPressed: () => Navigator.pop(dialogContext, false),
            child: const Text('Cancel'),
          ),
          TRButton(
            intent: TRIntent.danger,
            onPressed: () => Navigator.pop(dialogContext, true),
            child: const Text('Delete rack'),
          ),
        ],
      ),
    );
    setState(() => result = confirmed == true ? 'Rack deleted' : 'Rack kept');
  },
  child: const Text('Delete rack'),
)`;

const alertDialogResultSources = {
  en: alertDialogResultSourceEn,
  ko: alertDialogResultSourceEn
    .replaceAll('Delete rack?', '랙을 삭제할까요?')
    .replaceAll('This action cannot be undone.', '이 작업은 되돌릴 수 없어요.')
    .replaceAll('Delete rack', '랙 삭제')
    .replaceAll('Cancel', '취소')
    .replaceAll('Rack deleted', '랙을 삭제했어요')
    .replaceAll('Rack kept', '랙을 유지했어요'),
  ja: alertDialogResultSourceEn
    .replaceAll('Delete rack?', 'ラックを削除しますか？')
    .replaceAll('This action cannot be undone.', 'この操作は取り消せません。')
    .replaceAll('Delete rack', 'ラックを削除')
    .replaceAll('Cancel', 'キャンセル')
    .replaceAll('Rack deleted', 'ラックを削除しました')
    .replaceAll('Rack kept', 'ラックを保持しました'),
};

const alertDialogStatesSourceEn = String.raw`Column(
  crossAxisAlignment: CrossAxisAlignment.start,
  spacing: TRSpacing.medium,
  children: [
    TRButton(
      intent: TRIntent.danger,
      onPressed: () => showTRAlertDialog<void>(
        context: context,
        builder: (dialogContext) => TRAlertDialog(
          title: const Text('Delete rack?'),
          description: const Text('This action cannot be undone.'),
          actions: [
            TRButton(
              appearance: TRAppearance.outline,
              onPressed: () => Navigator.pop(dialogContext),
              child: const Text('Cancel'),
            ),
            TRButton(
              intent: TRIntent.danger,
              onPressed: () => Navigator.pop(dialogContext),
              child: const Text('Delete rack'),
            ),
          ],
        ),
      ),
      child: const Text('Delete a rack with a very long mobile confirmation label'),
    ),
    const TRButton(
      intent: TRIntent.danger,
      onPressed: null,
      child: Text('Deletion unavailable'),
    ),
  ],
)`;

const alertDialogStatesSources = {
  en: alertDialogStatesSourceEn,
  ko: alertDialogStatesSourceEn
    .replaceAll(
      'Delete a rack with a very long mobile confirmation label',
      '모바일에서도 읽기 쉬운 긴 확인 레이블로 랙 삭제',
    )
    .replaceAll('Deletion unavailable', '랙을 삭제할 수 없음')
    .replaceAll('Delete rack?', '랙을 삭제할까요?')
    .replaceAll('This action cannot be undone.', '이 작업은 되돌릴 수 없어요.')
    .replaceAll('Delete rack', '랙 삭제')
    .replaceAll('Cancel', '취소'),
  ja: alertDialogStatesSourceEn
    .replaceAll(
      'Delete a rack with a very long mobile confirmation label',
      'モバイルでも読みやすい長い確認ラベルでラックを削除',
    )
    .replaceAll('Deletion unavailable', 'ラックを削除できません')
    .replaceAll('Delete rack?', 'ラックを削除しますか？')
    .replaceAll('This action cannot be undone.', 'この操作は取り消せません。')
    .replaceAll('Delete rack', 'ラックを削除')
    .replaceAll('Cancel', 'キャンセル'),
};

const fieldsetOptionHelper = String.raw`Widget option(String label, {bool checked = false, bool disabled = false}) {
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
}`;

const fieldsetBasicSourceEn = String.raw`${fieldsetOptionHelper}

TRFieldset(
  legend: 'Notifications',
  children: [
    option('Email alerts', checked: true),
    option('Incident summaries', checked: true),
  ],
)`;

const fieldsetStatesSourceEn = String.raw`${fieldsetOptionHelper}

Wrap(
  spacing: TRSpacing.large,
  runSpacing: TRSpacing.large,
  children: [
    SizedBox(
      width: 260,
      child: TRFieldset(
        legend: 'Editable settings',
        children: [
          option('Email alerts', checked: true),
          option('Incident summaries', checked: true),
        ],
      ),
    ),
    SizedBox(
      width: 260,
      child: TRFieldset(
        disabled: true,
        legend: 'Managed settings',
        children: [
          option('Email alerts', checked: true, disabled: true),
          option('Incident summaries', checked: true, disabled: true),
        ],
      ),
    ),
  ],
)`;

const fieldsetCompositionSourceEn = String.raw`${fieldsetOptionHelper}

TRFieldset(
  legend: 'Incident notifications',
  children: [
    option('Enable incident notifications', checked: true),
    TRFieldset(
      legend: 'Delivery channels',
      children: [
        option('Email', checked: true),
        option('SMS'),
      ],
    ),
  ],
)`;

const localizeExampleSource = (
  source: string,
  replacements: readonly (readonly [string, string])[],
) => replacements.reduce((result, [from, to]) => result.replaceAll(from, to), source);

const fieldsetKoLabels = [
  ['Enable incident notifications', '장애 알림 켜기'],
  ['Incident notifications', '장애 알림'],
  ['Incident summaries', '장애 요약'],
  ['Editable settings', '편집 가능한 설정'],
  ['Managed settings', '관리되는 설정'],
  ['Delivery channels', '전달 채널'],
  ['Notifications', '알림'],
  ['Email alerts', '이메일 알림'],
  ['Email', '이메일'],
] as const;

const fieldsetJaLabels = [
  ['Enable incident notifications', 'インシデント通知を有効にする'],
  ['Incident notifications', 'インシデント通知'],
  ['Incident summaries', 'インシデント要約'],
  ['Editable settings', '編集可能な設定'],
  ['Managed settings', '管理された設定'],
  ['Delivery channels', '配信チャネル'],
  ['Notifications', '通知'],
  ['Email alerts', 'メール通知'],
  ['Email', 'メール'],
] as const;

const switchKoLabels = [
  ['Turn on monitoring to save this rack.', '이 랙을 저장하려면 모니터링을 켜세요.'],
  ['Enable uptime monitoring', '가동 시간 모니터링 켜기'],
  ['Automatic backups: on', '자동 백업: 켬'],
  ['Automatic backups: off', '자동 백업: 끔'],
  ['Automatic backups', '자동 백업'],
  ['Read only', '읽기 전용'],
  ['Editable', '편집 가능'],
  ['Disabled', '사용 불가'],
] as const;

const switchJaLabels = [
  [
    'Turn on monitoring to save this rack.',
    'このラックを保存するには監視を有効にしてください。',
  ],
  ['Enable uptime monitoring', '稼働監視を有効にする'],
  ['Automatic backups: on', '自動バックアップ: オン'],
  ['Automatic backups: off', '自動バックアップ: オフ'],
  ['Automatic backups', '自動バックアップ'],
  ['Read only', '読み取り専用'],
  ['Editable', '編集可能'],
  ['Disabled', '無効'],
] as const;

const switchSources = (sourceEn: string) => ({
  en: sourceEn,
  ja: localizeExampleSource(sourceEn, switchJaLabels),
  ko: localizeExampleSource(sourceEn, switchKoLabels),
});

const switchControlledSourceEn = String.raw`class BackupSetting extends StatefulWidget {
  const BackupSetting({super.key});

  @override
  State<BackupSetting> createState() => _BackupSettingState();
}

class _BackupSettingState extends State<BackupSetting> {
  bool enabled = false;

  @override
  Widget build(BuildContext context) {
    return Column(
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
              semanticLabel: 'Automatic backups',
            ),
            const TRText('Automatic backups', variant: TRTextVariant.bodySm),
          ],
        ),
        TRText(
          enabled ? 'Automatic backups: on' : 'Automatic backups: off',
          variant: TRTextVariant.bodySm,
          color: TRTextColor.muted,
        ),
      ],
    );
  }
}`;

const switchAvailabilitySourceEn = String.raw`Wrap(
  crossAxisAlignment: WrapCrossAlignment.center,
  spacing: TRSpacing.large,
  runSpacing: TRSpacing.large,
  children: const [
    TRSwitch(defaultChecked: true, semanticLabel: 'Editable'),
    TRSwitch(defaultChecked: true, readOnly: true, semanticLabel: 'Read only'),
    TRSwitch(defaultChecked: true, disabled: true, semanticLabel: 'Disabled'),
  ],
)`;

const switchValidationSourceEn = String.raw`class MonitoringSetting extends StatefulWidget {
  const MonitoringSetting({super.key});

  @override
  State<MonitoringSetting> createState() => _MonitoringSettingState();
}

class _MonitoringSettingState extends State<MonitoringSetting> {
  bool enabled = false;

  @override
  Widget build(BuildContext context) {
    return Column(
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
              semanticLabel: 'Enable uptime monitoring',
            ),
            const TRText(
              'Enable uptime monitoring',
              variant: TRTextVariant.bodySm,
            ),
          ],
        ),
        if (!enabled)
          const TRText(
            'Turn on monitoring to save this rack.',
            variant: TRTextVariant.bodySm,
            color: TRTextColor.danger,
          ),
      ],
    );
  }
}`;

const fieldsetSources = (sourceEn: string) => ({
  en: sourceEn,
  ja: localizeExampleSource(sourceEn, fieldsetJaLabels),
  ko: localizeExampleSource(sourceEn, fieldsetKoLabels),
});

const textareaBasicSourceEn = String.raw`TRField(
  label: 'Rack notes',
  description: 'Shared with everyone on the rack team.',
  control: TRTextarea(
    name: 'notes',
    placeholder: 'Operational notes',
  ),
)`;

const textareaStatesSourceEn = String.raw`Widget state(
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
        placeholder: 'Operational notes',
        readOnly: readOnly,
      ),
    ),
  );
}

Wrap(
  spacing: TRSpacing.large,
  runSpacing: TRSpacing.large,
  children: [
    state('Editable'),
    state('Read only', readOnly: true, text: 'Swap the fan tray tomorrow.'),
    state('Disabled', enabled: false, text: 'Swap the fan tray tomorrow.'),
  ],
)`;

const textareaSizesSourceEn = String.raw`Wrap(
  spacing: TRSpacing.large,
  runSpacing: TRSpacing.large,
  children: [
    for (final size in TRUiSize.values)
      SizedBox(
        width: 240,
        child: TRField(
          label: size.name,
          control: TRTextarea(
            initialValue: 'Rack notes',
            uiSize: size,
          ),
        ),
      ),
  ],
)`;

const textareaFormSourceEn = String.raw`// TRTextarea is not a FormField, so keep a controller to restore the text.
final controller = TextEditingController(text: 'Scheduled maintenance');

TRForm(
  key: formKey,
  child: Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    mainAxisSize: MainAxisSize.min,
    spacing: TRSpacing.medium,
    children: [
      TRField(
        label: 'Maintenance notes',
        control: TRTextarea(name: 'notes', controller: controller),
      ),
      Wrap(
        spacing: TRSpacing.small,
        runSpacing: TRSpacing.small,
        children: [
          TRButton(
            onPressed: () => submit(
              formKey.currentState!.values['notes']?.toString() ?? '',
            ),
            child: const Text('Submit'),
          ),
          TRButton(
            appearance: TRAppearance.outline,
            onPressed: () {
              controller.text = 'Scheduled maintenance';
              submit('');
            },
            child: const Text('Reset'),
          ),
        ],
      ),
    ],
  ),
)`;

const textareaValidationSourceEn = String.raw`TRForm(
  child: Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    mainAxisSize: MainAxisSize.min,
    spacing: TRSpacing.medium,
    children: [
      TRField(
        label: 'Change reason',
        errorText: attempted && reason.trim().isEmpty
            ? 'Add a reason before submitting.'
            : null,
        control: TRTextarea(
          name: 'reason',
          focusNode: reasonFocusNode,
          onChanged: (value) => setState(() {
            reason = value;
            submitted = false;
          }),
        ),
      ),
      TRButton(
        onPressed: () {
          final empty = reason.trim().isEmpty;
          setState(() {
            attempted = true;
            submitted = !empty;
          });
          if (empty) reasonFocusNode.requestFocus();
        },
        child: const Text('Submit change'),
      ),
      if (submitted)
        const TRText('Change submitted.', variant: TRTextVariant.bodySm),
    ],
  ),
)`;

const textareaKoLabels = [
  [
    '// TRTextarea is not a FormField, so keep a controller to restore the text.',
    '// TRTextarea는 FormField가 아니라서, 텍스트를 되돌리려면 controller를 직접 들고 있어야 해요.',
  ],
  ['Shared with everyone on the rack team.', '랙 팀 모두에게 공유돼요.'],
  ['Swap the fan tray tomorrow.', '내일 팬 트레이를 교체하세요.'],
  ['Add a reason before submitting.', '제출하기 전에 이유를 입력하세요.'],
  ['Maintenance notes', '유지보수 메모'],
  ['Scheduled maintenance', '예정된 유지보수'],
  ['Operational notes', '운영 메모'],
  ['Submit change', '변경 사항 제출'],
  ['Change submitted.', '변경 사항을 제출했어요.'],
  ['Change reason', '변경 이유'],
  ['Rack notes', '랙 메모'],
  ['Read only', '읽기 전용'],
  ['Editable', '편집 가능'],
  ['Disabled', '비활성'],
  ['Submit', '제출'],
  ['Reset', '초기화'],
] as const;

const textareaJaLabels = [
  [
    '// TRTextarea is not a FormField, so keep a controller to restore the text.',
    '// TRTextarea は FormField ではないため、テキストを戻すには controller を自分で保持します。',
  ],
  ['Shared with everyone on the rack team.', 'ラックチーム全員に共有されます。'],
  ['Swap the fan tray tomorrow.', '明日ファントレイを交換してください。'],
  ['Add a reason before submitting.', '送信前に理由を入力してください。'],
  ['Maintenance notes', 'メンテナンスのメモ'],
  ['Scheduled maintenance', '予定メンテナンス'],
  ['Operational notes', '運用メモ'],
  ['Submit change', '変更を送信'],
  ['Change submitted.', '変更を送信しました。'],
  ['Change reason', '変更理由'],
  ['Rack notes', 'ラックのメモ'],
  ['Read only', '読み取り専用'],
  ['Editable', '編集可能'],
  ['Disabled', '無効'],
  ['Submit', '送信'],
  ['Reset', 'リセット'],
] as const;

const textareaSources = (sourceEn: string) => ({
  en: sourceEn,
  ja: localizeExampleSource(sourceEn, textareaJaLabels),
  ko: localizeExampleSource(sourceEn, textareaKoLabels),
});

const otpSizesSourceEn = String.raw`Column(
  crossAxisAlignment: CrossAxisAlignment.start,
  mainAxisSize: MainAxisSize.min,
  spacing: TRSpacing.large,
  children: const [
    TROtpField(
      defaultValue: '2048',
      label: 'SM',
      length: 4,
      semanticLabel: 'SM verification code',
      uiSize: TRUiSize.sm,
    ),
    TROtpField(
      defaultValue: '2048',
      label: 'MD',
      length: 4,
      semanticLabel: 'MD verification code',
    ),
    TROtpField(
      defaultValue: '2048',
      label: 'LG',
      length: 4,
      semanticLabel: 'LG verification code',
      uiSize: TRUiSize.lg,
    ),
  ],
)`;

const otpStatesSourceEn = String.raw`Wrap(
  spacing: TRSpacing.extraLarge,
  runSpacing: TRSpacing.large,
  children: const [
    TROtpField(
      defaultValue: '2048',
      helperText: 'Four digits, numbers only.',
      label: 'Editable code',
      length: 4,
    ),
    TROtpField(
      defaultValue: '481592',
      helperText: 'Copy this recovery code.',
      label: 'Recovery code',
      length: 6,
      readOnly: true,
    ),
    TROtpField(
      defaultValue: '2048',
      enabled: false,
      helperText: 'Request a new code first.',
      label: 'Expired code',
      length: 4,
    ),
  ],
)`;

const otpValidationSourceEn = String.raw`final formKey = GlobalKey<FormState>();
var status = '';

Form(
  key: formKey,
  child: Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    mainAxisSize: MainAxisSize.min,
    spacing: TRSpacing.medium,
    children: [
      TROtpFieldFormField(
        autovalidateMode: AutovalidateMode.onUserInteraction,
        helperText: 'Enter all six digits.',
        label: 'Verification code',
        length: 6,
        validator: (value) => (value ?? '').length == 6
            ? null
            : 'A six-digit code is required.',
      ),
      TRButton(
        onPressed: () => setState(() {
          status = formKey.currentState?.validate() ?? false
              ? 'Code accepted.'
              : 'Fix the code and try again.';
        }),
        child: const Text('Verify'),
      ),
      TRText(
        status.isEmpty ? 'Waiting for a code.' : status,
        variant: TRTextVariant.bodySm,
        color: TRTextColor.muted,
      ),
    ],
  ),
)`;

const otpMaskedSourceEn = String.raw`late final controller = TROtpFieldController(value: '4821');

Column(
  crossAxisAlignment: CrossAxisAlignment.start,
  mainAxisSize: MainAxisSize.min,
  spacing: TRSpacing.medium,
  children: [
    TROtpField(
      controller: controller,
      helperText: 'Digits stay hidden while you type.',
      label: 'Backup PIN',
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
      onPressed: controller.clear,
      child: const Text('Clear'),
    ),
  ],
)`;

const otpKoLabels = [
  ['SM verification code', 'SM 인증 코드'],
  ['MD verification code', 'MD 인증 코드'],
  ['LG verification code', 'LG 인증 코드'],
  ['Four digits, numbers only.', '숫자 네 자리만 입력해요.'],
  ['Copy this recovery code.', '이 복구 코드를 복사하세요.'],
  ['Request a new code first.', '새 코드를 먼저 요청하세요.'],
  ['Editable code', '편집 가능한 코드'],
  ['Recovery code', '복구 코드'],
  ['Expired code', '만료된 코드'],
  ['Enter all six digits.', '여섯 자리를 모두 입력하세요.'],
  ['A six-digit code is required.', '여섯 자리 코드가 필요해요.'],
  ['Verification code', '인증 코드'],
  ['Digits stay hidden while you type.', '입력하는 동안 숫자가 가려져요.'],
  ['Backup PIN', '백업 PIN'],
  ['Fix the code and try again.', '코드를 고친 뒤 다시 시도하세요.'],
  ['Waiting for a code.', '코드를 기다리고 있어요.'],
  ['Code accepted.', '코드를 확인했어요.'],
  ['Verify', '확인'],
  ['Clear', '지우기'],
] as const;

const otpJaLabels = [
  ['SM verification code', 'SM 確認コード'],
  ['MD verification code', 'MD 確認コード'],
  ['LG verification code', 'LG 確認コード'],
  ['Four digits, numbers only.', '数字 4 桁のみです。'],
  ['Copy this recovery code.', 'この復旧コードをコピーしてください。'],
  ['Request a new code first.', '先に新しいコードをリクエストしてください。'],
  ['Editable code', '編集できるコード'],
  ['Recovery code', '復旧コード'],
  ['Expired code', '期限切れのコード'],
  ['Enter all six digits.', '6 桁すべてを入力してください。'],
  ['A six-digit code is required.', '6 桁のコードが必要です。'],
  ['Verification code', '確認コード'],
  ['Digits stay hidden while you type.', '入力中は数字が隠れたままになります。'],
  ['Backup PIN', 'バックアップ PIN'],
  ['Fix the code and try again.', 'コードを修正して再試行してください。'],
  ['Waiting for a code.', 'コードを待っています。'],
  ['Code accepted.', 'コードを受け付けました。'],
  ['Verify', '確認'],
  ['Clear', 'クリア'],
] as const;

const otpSources = (sourceEn: string) => ({
  en: sourceEn,
  ja: localizeExampleSource(sourceEn, otpJaLabels),
  ko: localizeExampleSource(sourceEn, otpKoLabels),
});

const comboboxRacksHelper = String.raw`const racks = [
  TRComboboxItem(value: 'rack-a', label: 'Rack A'),
  TRComboboxItem(value: 'rack-b', label: 'Rack B'),
  TRComboboxItem(value: 'rack-c', label: 'Rack C'),
];`;

const comboboxBasicSourceEn = String.raw`${comboboxRacksHelper}

TRCombobox<String>(
  label: 'Deployment rack',
  placeholder: 'Choose a rack',
  helperText: 'Type to filter, then commit one rack',
  items: racks,
  onValueChange: selectRack,
)`;

const comboboxSizesSourceEn = String.raw`${comboboxRacksHelper}

Column(
  spacing: TRSpacing.medium,
  children: [
    for (final uiSize in TRUiSize.values)
      TRCombobox<String>(
        label: 'Deployment rack',
        placeholder: 'Choose a rack',
        items: racks,
        uiSize: uiSize,
        width: 320,
      ),
  ],
)`;

const comboboxOptionStatesSourceEn = String.raw`TRCombobox<String>(
  label: 'Deployment rack',
  placeholder: 'Choose a rack',
  helperText: 'Racks under maintenance stay visible but cannot be picked',
  defaultValue: 'rack-a',
  items: const [
    TRComboboxItem(value: 'rack-a', label: 'Rack A'),
    TRComboboxItem(value: 'rack-b', label: 'Rack B', enabled: false),
    TRComboboxItem(value: 'rack-c', label: 'Rack C'),
  ],
)`;

const comboboxFilterModesSourceEn = String.raw`${comboboxRacksHelper}

Column(
  spacing: TRSpacing.medium,
  children: [
    TRCombobox<String>(
      label: 'Contains',
      placeholder: 'Choose a rack',
      items: racks,
    ),
    TRCombobox<String>(
      label: 'Starts with',
      placeholder: 'Choose a rack',
      items: racks,
      filterMode: TRComboboxFilterMode.startsWith,
    ),
    // The builder already returns the matches, so no second pass is applied.
    TRCombobox<String>(
      label: 'Server side',
      placeholder: 'Choose a rack',
      filterMode: TRComboboxFilterMode.none,
      optionsBuilder: searchRacks,
    ),
  ],
)`;

const comboboxMultipleAnatomySourceEn = String.raw`TRMultiCombobox<String>(
  label: 'Deployment racks',
  placeholder: 'Choose racks',
  helperText: 'Committed racks appear as chips above the field',
  layout: TRComboboxLayout.grid,
  defaultValue: const ['rack-a'],
  items: const [
    TRComboboxItem(
      value: 'rack-a',
      label: 'Rack A',
      leading: Icon(Icons.dns_outlined),
    ),
    TRComboboxItem(
      value: 'rack-b',
      label: 'Rack B',
      leading: Icon(Icons.dns_outlined),
    ),
    TRComboboxItem(
      value: 'rack-c',
      label: 'Rack C',
      leading: Icon(Icons.dns_outlined),
    ),
  ],
  onValueChange: selectRacks,
)`;

const comboboxValidationSourceEn = String.raw`${comboboxRacksHelper}

Form(
  key: formKey,
  child: Column(
    spacing: TRSpacing.medium,
    children: [
      TRComboboxFormField<String>(
        label: 'Deployment rack',
        placeholder: 'Choose a rack',
        items: racks,
        autovalidateMode: AutovalidateMode.onUserInteraction,
        validator: (value) => value == null ? 'Choose a rack' : null,
      ),
      TRButton(
        onPressed: () => formKey.currentState?.validate(),
        child: const Text('Deploy'),
      ),
    ],
  ),
)`;

const comboboxControlledFilterHooksSourceEn = String.raw`${comboboxRacksHelper}

final controller = TRComboboxController<String>(value: 'rack-a');

TRCombobox<String>.controlled(
  value: rack,
  controller: controller,
  label: 'Deployment rack',
  placeholder: 'Choose a rack',
  helperText: 'Query: $query',
  items: racks,
  filter: (item, query) => item.label.toLowerCase().endsWith(query),
  onQueryChange: (value) => setState(() => query = value),
  onValueChange: (value) => setState(() => rack = value),
)`;

const comboboxOverlaySourceEn = String.raw`${comboboxRacksHelper}

// The popup matches width when it is set, and falls back to the small overlay
// width token otherwise.
Column(
  spacing: TRSpacing.medium,
  children: [
    TRCombobox<String>(
      label: 'Popup follows the field',
      placeholder: 'Choose a rack',
      items: racks,
      width: 360,
    ),
    TRCombobox<String>(
      label: 'Popup uses the overlay token',
      placeholder: 'Choose a rack',
      items: racks,
    ),
  ],
)`;

const comboboxKeyboardSourceEn = String.raw`TRCombobox<String>(
  label: 'Deployment rack',
  placeholder: 'Choose a rack',
  helperText: 'Arrow keys move, Enter commits, Escape closes',
  autoHighlight: false,
  clearable: true,
  clearSemanticLabel: 'Clear rack',
  items: const [
    TRComboboxItem(value: 'rack-a', label: 'Rack A'),
    TRComboboxItem(value: 'rack-b', label: 'Rack B', enabled: false),
    TRComboboxItem(value: 'rack-c', label: 'Rack C'),
  ],
)`;

const comboboxFormSourceEn = String.raw`Form(
  child: Column(
    spacing: TRSpacing.medium,
    children: [
      TRComboboxFormField<String>(
        label: 'Release channel',
        items: channels,
        validator: (value) => value == null ? 'Choose a channel' : null,
      ),
      TRMultiComboboxFormField<String>(
        label: 'Regions',
        items: regions,
      ),
    ],
  ),
)`;

const comboboxKoLabels = [
  [
    '// The popup matches width when it is set, and falls back to the small overlay\n// width token otherwise.',
    '// width를 주면 팝업이 그 너비를 따르고, 없으면 small 오버레이 너비 토큰을\n// 사용해요.',
  ],
  [
    '// The builder already returns the matches, so no second pass is applied.',
    '// 빌더가 이미 일치 결과를 돌려주므로 한 번 더 좁히지 않아요.',
  ],
  [
    'Racks under maintenance stay visible but cannot be picked',
    '점검 중인 랙도 계속 보이지만 선택할 수는 없어요',
  ],
  [
    'Committed racks appear as chips above the field',
    '확정한 랙은 필드 위에 칩으로 나타나요',
  ],
  [
    'Arrow keys move, Enter commits, Escape closes',
    '방향키로 이동, Enter로 확정, Escape로 닫기',
  ],
  ['Type to filter, then commit one rack', '입력해서 좁힌 뒤 랙 하나를 확정하세요'],
  ['Popup uses the overlay token', '팝업이 오버레이 토큰을 사용'],
  ['Popup follows the field', '팝업이 필드 너비를 따름'],
  ['Deployment racks', '배포 랙'],
  ['Deployment rack', '배포 랙'],
  ['Release channel', '릴리스 채널'],
  ['Choose a channel', '채널을 선택하세요'],
  ['Choose a rack', '랙을 선택하세요'],
  ['Choose racks', '랙을 선택하세요'],
  ['Clear rack', '랙 지우기'],
  ['Starts with', '접두사 일치'],
  ['Server side', '서버 측'],
  ['Contains', '부분 일치'],
  ['Regions', '리전'],
  ['Deploy', '배포'],
  ['Query: ', '검색어: '],
] as const;

const comboboxJaLabels = [
  [
    '// The popup matches width when it is set, and falls back to the small overlay\n// width token otherwise.',
    '// width を指定するとポップアップはその幅に合わせ、未指定の場合は small の\n// オーバーレイ幅トークンを使います。',
  ],
  [
    '// The builder already returns the matches, so no second pass is applied.',
    '// ビルダーが既に一致結果を返すため、二段目の絞り込みは行いません。',
  ],
  [
    'Racks under maintenance stay visible but cannot be picked',
    'メンテナンス中のラックも表示されますが選択できません',
  ],
  [
    'Committed racks appear as chips above the field',
    '確定したラックはフィールドの上にチップとして表示されます',
  ],
  [
    'Arrow keys move, Enter commits, Escape closes',
    '矢印キーで移動、Enter で確定、Escape で閉じます',
  ],
  ['Type to filter, then commit one rack', '入力して絞り込み、ラックを 1 つ確定します'],
  ['Popup uses the overlay token', 'ポップアップはオーバーレイトークンを使用'],
  ['Popup follows the field', 'ポップアップはフィールド幅に追従'],
  ['Deployment racks', 'デプロイ先ラック'],
  ['Deployment rack', 'デプロイ先ラック'],
  ['Release channel', 'リリースチャンネル'],
  ['Choose a channel', 'チャンネルを選択'],
  ['Choose a rack', 'ラックを選択'],
  ['Choose racks', 'ラックを選択'],
  ['Clear rack', 'ラックをクリア'],
  ['Starts with', '前方一致'],
  ['Server side', 'サーバー側'],
  ['Contains', '部分一致'],
  ['Regions', 'リージョン'],
  ['Deploy', 'デプロイ'],
  ['Query: ', '検索語: '],
] as const;

const comboboxSources = (sourceEn: string) => ({
  en: sourceEn,
  ja: localizeExampleSource(sourceEn, comboboxJaLabels),
  ko: localizeExampleSource(sourceEn, comboboxKoLabels),
});

const sliderBasicSourceEn = String.raw`SizedBox(
  width: 320,
  child: TRSlider(defaultValue: 48, label: 'Volume'),
)`;

const sliderSizesSourceEn = String.raw`Column(
  spacing: TRSpacing.large,
  children: [
    for (final uiSize in TRUiSize.values)
      SizedBox(
        width: 320,
        child: TRSlider(
          defaultValue: 48,
          label: '${'$'}{uiSize.name.toUpperCase()} volume',
          uiSize: uiSize,
        ),
      ),
  ],
)`;

const sliderStatesSourceEn = String.raw`Row(
  spacing: TRSpacing.extraLarge,
  crossAxisAlignment: CrossAxisAlignment.start,
  children: [
    const SizedBox(
      width: 240,
      child: TRSlider(defaultValue: 48, label: 'Horizontal volume'),
    ),
    const SizedBox(
      height: 220,
      child: TRSlider(
        defaultValue: 36,
        label: 'Vertical volume',
        vertical: true,
      ),
    ),
  ],
)`;

const sliderDisabledSourceEn = String.raw`SizedBox(
  width: 320,
  child: TRSlider(
    defaultValue: 82,
    enabled: false,
    label: 'Disabled volume',
  ),
)`;

const sliderRangeSourceEn = String.raw`SizedBox(
  width: 320,
  child: TRRangeSlider(
    defaultValue: const RangeValues(20, 80),
    label: 'Maintenance window',
    labelBuilder: (value) => '${'$'}{value.round()}%',
    minGap: 10,
    semanticLabel: 'Maintenance window, percent of the day',
  ),
)`;

const sliderFormSourceEn = String.raw`class SliderForm extends StatefulWidget {
  const SliderForm({super.key});

  @override
  State<SliderForm> createState() => _SliderFormState();
}

class _SliderFormState extends State<SliderForm> {
  final _formKey = GlobalKey<FormState>();
  double? _saved;

  @override
  Widget build(BuildContext context) {
    return Form(
      key: _formKey,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        spacing: TRSpacing.large,
        children: [
          SizedBox(
            width: 320,
            child: TRSliderFormField(
              initialValue: 48,
              label: 'Volume',
              onSaved: (value) => _saved = value,
              onValueChange: (_) => setState(() => _saved = null),
            ),
          ),
          TRButton(
            onPressed: () => setState(() => _formKey.currentState?.save()),
            child: const Text('Save volume'),
          ),
          if (_saved != null)
            TRText('Saved volume ${'$'}{_saved!.round()}.',
                variant: TRTextVariant.bodySm),
        ],
      ),
    );
  }
}`;

const sliderValidationSourceEn = String.raw`class CapacityForm extends StatefulWidget {
  const CapacityForm({super.key});

  @override
  State<CapacityForm> createState() => _CapacityFormState();
}

class _CapacityFormState extends State<CapacityForm> {
  final _formKey = GlobalKey<FormState>();
  double? _reserved;

  @override
  Widget build(BuildContext context) {
    return Form(
      key: _formKey,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        spacing: TRSpacing.large,
        children: [
          SizedBox(
            width: 320,
            child: TRSliderFormField(
              autovalidateMode: AutovalidateMode.onUserInteraction,
              initialValue: 30,
              label: 'Reserved capacity',
              onSaved: (value) => _reserved = value,
              onValueChange: (_) => setState(() => _reserved = null),
              validator: (value) => (value ?? 0) < 60
                  ? 'Increase reserved capacity to 60% or more.'
                  : null,
            ),
          ),
          TRButton(
            onPressed: () => setState(() {
              if (_formKey.currentState?.validate() ?? false) {
                _formKey.currentState?.save();
              }
            }),
            child: const Text('Reserve capacity'),
          ),
          if (_reserved != null)
            TRText('Reserved ${'$'}{_reserved!.round()}% capacity.',
                variant: TRTextVariant.bodySm),
        ],
      ),
    );
  }
}`;

const sliderKoLabels = [
  ['Increase reserved capacity to 60% or more.', '예약 용량을 60% 이상으로 올리세요.'],
  ['Maintenance window, percent of the day', '점검 시간대, 하루 중 비율'],
  [
    `Reserved ${'$'}{_reserved!.round()}% capacity.`,
    `용량 ${'$'}{_reserved!.round()}%를 예약했어요.`,
  ],
  [
    `Saved volume ${'$'}{_saved!.round()}.`,
    `볼륨 ${'$'}{_saved!.round()}(으)로 저장했어요.`,
  ],
  [
    `${'$'}{uiSize.name.toUpperCase()} volume`,
    `${'$'}{uiSize.name.toUpperCase()} 볼륨`,
  ],
  ['Reserved capacity', '예약 용량'],
  ['Reserve capacity', '용량 예약'],
  ['Maintenance window', '점검 시간대'],
  ['Horizontal volume', '가로 볼륨'],
  ['Disabled volume', '비활성 볼륨'],
  ['Vertical volume', '세로 볼륨'],
  ['Save volume', '볼륨 저장'],
  ['Volume', '볼륨'],
] as const;

const sliderJaLabels = [
  [
    'Increase reserved capacity to 60% or more.',
    '予約容量を 60% 以上に上げてください。',
  ],
  ['Maintenance window, percent of the day', 'メンテナンス時間帯、1 日に占める割合'],
  [
    `Reserved ${'$'}{_reserved!.round()}% capacity.`,
    `容量 ${'$'}{_reserved!.round()}% を予約しました。`,
  ],
  [
    `Saved volume ${'$'}{_saved!.round()}.`,
    `音量 ${'$'}{_saved!.round()} を保存しました。`,
  ],
  [
    `${'$'}{uiSize.name.toUpperCase()} volume`,
    `${'$'}{uiSize.name.toUpperCase()} の音量`,
  ],
  ['Reserved capacity', '予約容量'],
  ['Reserve capacity', '容量を予約'],
  ['Maintenance window', 'メンテナンス時間帯'],
  ['Horizontal volume', '横向きの音量'],
  ['Disabled volume', '無効な音量'],
  ['Vertical volume', '縦向きの音量'],
  ['Save volume', '音量を保存'],
  ['Volume', '音量'],
] as const;

const sliderSources = (sourceEn: string) => ({
  en: sourceEn,
  ja: localizeExampleSource(sourceEn, sliderJaLabels),
  ko: localizeExampleSource(sourceEn, sliderKoLabels),
});

const radioPlanHelper = String.raw`TRRadio planOption(String value, String label) {
  return TRRadio(
    value: value,
    label: TRText(label, variant: TRTextVariant.bodySm),
  );
}`;

const radioStatesSourceEn = String.raw`${radioPlanHelper}

TRRadioGroup(
  defaultValue: 'growth',
  children: [
    planOption('starter', 'Starter'),
    planOption('growth', 'Growth'),
  ],
)`;

const radioSizesSourceEn = String.raw`Wrap(
  crossAxisAlignment: WrapCrossAlignment.center,
  spacing: TRSpacing.large,
  children: [
    for (final size in TRUiSize.values)
      TRRadioGroup(
        defaultValue: 'on',
        children: [
          TRRadio(
            value: 'on',
            uiSize: size,
            label: TRText(size.name, variant: TRTextVariant.bodySm),
          ),
        ],
      ),
  ],
)`;

const radioAvailabilitySourceEn = String.raw`TRRadioGroup(
  defaultValue: 'editable',
  children: const [
    TRRadio(
      value: 'editable',
      label: TRText('Editable', variant: TRTextVariant.bodySm),
    ),
    TRRadio(
      value: 'read-only',
      readOnly: true,
      label: TRText('Read only', variant: TRTextVariant.bodySm),
    ),
    TRRadio(
      value: 'disabled',
      disabled: true,
      label: TRText('Disabled', variant: TRTextVariant.bodySm),
    ),
  ],
)`;

const radioGroupStatesSourceEn = String.raw`${radioPlanHelper}

Widget planGroup(String label, {bool disabled = false, bool readOnly = false}) {
  return TRField(
    label: label,
    disabled: disabled,
    control: TRRadioGroup(
      defaultValue: 'starter',
      disabled: disabled,
      readOnly: readOnly,
      children: [
        planOption('starter', 'Starter'),
        planOption('growth', 'Growth'),
      ],
    ),
  );
}

Wrap(
  spacing: TRSpacing.large,
  runSpacing: TRSpacing.large,
  children: [
    planGroup('Editable'),
    planGroup('Read only', readOnly: true),
    planGroup('Disabled', disabled: true),
  ],
)`;

const radioGroupValidationSourceEn = String.raw`${radioPlanHelper}

Builder(
  builder: (context) {
    var attempted = false;
    String? plan;
    return StatefulBuilder(
      builder: (context, setState) => Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        spacing: TRSpacing.medium,
        children: [
          TRField(
            label: 'Support plan',
            errorText: attempted && plan == null
                ? 'Choose a support plan to continue.'
                : null,
            control: TRRadioGroup(
              value: plan,
              onValueChange: (next) => setState(() => plan = next),
              children: [
                planOption('starter', 'Starter'),
                planOption('growth', 'Growth'),
                planOption('enterprise', 'Enterprise'),
              ],
            ),
          ),
          TRButton(
            onPressed: () => setState(() => attempted = true),
            child: const Text('Continue'),
          ),
        ],
      ),
    );
  },
)`;

const radioGroupFormSourceEn = String.raw`${radioPlanHelper}

final formKey = GlobalKey<TRFormState>();
var submitted = '';

TRForm(
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
          planOption('starter', 'Starter'),
          planOption('growth', 'Growth'),
        ],
      ),
      TRButton(
        onPressed: () {
          final value = formKey.currentState?.save()['plan'];
          setState(() => submitted = value is String ? value : '');
        },
        child: const Text('Collect form values'),
      ),
    ],
  ),
)`;

const radioKoLabels = [
  ['Choose a support plan to continue.', '계속하려면 지원 플랜을 선택하세요.'],
  ['Collect form values', '폼 값 모으기'],
  ['Support plan', '지원 플랜'],
  ['Enterprise', '엔터프라이즈'],
  ['Read only', '읽기 전용'],
  ['Editable', '편집 가능'],
  ['Disabled', '비활성'],
  ['Continue', '계속'],
  ['Starter', '스타터'],
  ['Growth', '그로스'],
] as const;

const radioJaLabels = [
  ['Choose a support plan to continue.', 'サポートプランを選択してください。'],
  ['Collect form values', 'フォーム値を取得'],
  ['Support plan', 'サポートプラン'],
  ['Enterprise', 'エンタープライズ'],
  ['Read only', '読み取り専用'],
  ['Editable', '編集可能'],
  ['Disabled', '無効'],
  ['Continue', '続ける'],
  ['Starter', 'スターター'],
  ['Growth', 'グロース'],
] as const;

const radioSources = (sourceEn: string) => ({
  en: sourceEn,
  ja: localizeExampleSource(sourceEn, radioJaLabels),
  ko: localizeExampleSource(sourceEn, radioKoLabels),
});

export const flutterExamples: Partial<
  Record<FlutterPreviewComponent, readonly FlutterExampleEntry[]>
> = {
  accordion: [
    {
      id: 'accordion-controlled',
      title: {
        en: 'Controlled multiple expansion',
        ja: '制御付き複数展開',
        ko: '제어형 다중 확장',
      },
      description: {
        en: 'Update value from onValueChange so either section can open or close and the current selection stays visible.',
        ja: 'onValueChange から value を更新すると、各セクションを開閉でき、現在の選択も表示できます。',
        ko: 'onValueChange에서 value를 갱신하면 각 섹션을 열고 닫을 수 있고 현재 선택도 표시할 수 있어요.',
      },
      dart: String.raw`import 'package:flutter/material.dart';
import 'package:tinyrack_ui/tinyrack_ui.dart';

class AccordionExample extends StatefulWidget {
  const AccordionExample({super.key});

  @override
  State<AccordionExample> createState() => _AccordionExampleState();
}

class _AccordionExampleState extends State<AccordionExample> {
  List<String> value = const ['overview'];

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      spacing: TRSpacing.medium,
      children: [
        TRAccordion(
          multiple: true,
          value: value,
          onValueChange: (nextValue) => setState(() => value = nextValue),
          items: const [
            TRAccordionItem(
              value: 'overview',
              trigger: Text('What is Tinyrack?'),
              content: Text('A UI system for Flutter applications.'),
            ),
            TRAccordionItem(
              value: 'install',
              trigger: Text('How do I install it?'),
              content: Text('Add the package and import its public library.'),
            ),
          ],
        ),
        Text('Expanded: ' + (value.isEmpty ? 'none' : value.join(', '))),
      ],
    );
  }
}`,
    },
    {
      id: 'accordion-expansion-states',
      title: {
        en: 'Single, multiple, and disabled states',
        ja: '単一・複数展開と無効状態',
        ko: '단일·다중 확장과 비활성 상태',
      },
      description: {
        en: 'Use the default single mode for mutually exclusive sections, multiple for independent sections, and disabled on an unavailable item.',
        ja: '排他的なセクションには既定の単一展開、独立したセクションには multiple、利用できない項目には disabled を使います。',
        ko: '서로 하나만 열어야 하는 섹션에는 기본 단일 모드를, 독립적인 섹션에는 multiple을, 사용할 수 없는 항목에는 disabled를 사용하세요.',
      },
      dart: String.raw`import 'package:flutter/material.dart';
import 'package:tinyrack_ui/tinyrack_ui.dart';

class AccordionStates extends StatelessWidget {
  const AccordionStates({super.key});

  @override
  Widget build(BuildContext context) {
    return Column(
      spacing: TRSpacing.large,
      children: [
        TRAccordion(
          defaultValue: const ['single'],
          items: const [
            TRAccordionItem(
              value: 'single',
              trigger: Text('Single expansion'),
              content: Text('Opening another item closes this one.'),
            ),
            TRAccordionItem(
              value: 'disabled',
              disabled: true,
              trigger: Text('Unavailable item'),
              content: Text('Unavailable details.'),
            ),
          ],
        ),
        TRAccordion(
          defaultValue: const ['network', 'storage'],
          multiple: true,
          items: const [
            TRAccordionItem(
              value: 'network',
              trigger: Text('Network'),
              content: Text('10 Gbps uplink.'),
            ),
            TRAccordionItem(
              value: 'storage',
              trigger: Text('Storage'),
              content: Text('72% available.'),
            ),
          ],
        ),
      ],
    );
  }
}`,
    },
  ],
  button: [
    {
      id: 'button-intents',
      title: {
        en: 'Intents and appearances',
        ja: 'インテントと外観',
        ko: '인텐트와 표현',
      },
      description: {
        en: 'Every intent renders in each appearance. Use solid for the primary action, outline for secondary, and ghost for low-emphasis controls.',
        ja: 'すべてのインテントを各 appearance で表示します。主要な操作には solid、補助的な操作には outline、控えめな操作には ghost を使ってください。',
        ko: '모든 인텐트를 appearance별로 보여줘요. 주요 동작에는 solid, 보조 동작에는 outline, 강조가 낮은 컨트롤에는 ghost를 사용하세요.',
      },
      dart: String.raw`Column(
  crossAxisAlignment: CrossAxisAlignment.start,
  spacing: TRSpacing.medium,
  children: [
    for (final appearance in TRAppearance.values)
      Wrap(
        spacing: TRSpacing.small,
        runSpacing: TRSpacing.small,
        children: [
          for (final intent in TRIntent.values)
            TRButton(
              appearance: appearance,
              intent: intent,
              onPressed: () {},
              child: Text(intent.name),
            ),
        ],
      ),
  ],
)`,
    },
    {
      id: 'button-sizes',
      title: { en: 'Sizes', ja: 'サイズ', ko: '크기' },
      description: {
        en: 'Match the button size to its surrounding density with sm, md, or lg.',
        ja: '周囲の密度に合わせて sm・md・lg のサイズを選びます。',
        ko: '주변 밀도에 맞춰 sm, md, lg 크기를 선택하세요.',
      },
      dart: String.raw`Wrap(
  crossAxisAlignment: WrapCrossAlignment.center,
  spacing: TRSpacing.small,
  children: [
    for (final size in TRUiSize.values)
      TRButton(
        intent: TRIntent.primary,
        uiSize: size,
        onPressed: () {},
        child: Text(size.name),
      ),
  ],
)`,
    },
    {
      id: 'button-states',
      title: { en: 'States', ja: '状態', ko: '상태' },
      description: {
        en: 'A loading button keeps its footprint and blocks activation; a disabled button drops its callback.',
        ja: 'loading 中もサイズを保ったまま操作を無効化し、disabled ではコールバックを外します。',
        ko: 'loading 버튼은 크기를 유지한 채 활성화를 막고, disabled 버튼은 콜백을 제거해요.',
      },
      dart: String.raw`Wrap(
  crossAxisAlignment: WrapCrossAlignment.center,
  spacing: TRSpacing.small,
  children: [
    TRButton(
      intent: TRIntent.primary,
      onPressed: () {},
      child: const Text('Default'),
    ),
    TRButton(
      intent: TRIntent.primary,
      loading: true,
      loadingLabel: 'Loading',
      onPressed: () {},
      child: const Text('Saving'),
    ),
    const TRButton(
      intent: TRIntent.primary,
      onPressed: null,
      child: Text('Disabled'),
    ),
  ],
)`,
    },
  ],
  'icon-button': [
    {
      id: 'icon-button-states',
      title: { en: 'Action states', ja: '操作の状態', ko: '동작 상태' },
      description: {
        en: 'Loading replaces the icon with a spinner and uses loadingLabel as the temporary accessible name. A null onPressed keeps the button visible but inactive.',
        ja: 'loading 中はアイコンをスピナーに置き換え、loadingLabel を一時的なアクセシブルな名前として使います。onPressed が null のボタンは表示されたまま無効になります。',
        ko: 'loading 상태에서는 아이콘이 스피너로 바뀌고 loadingLabel이 임시 접근 가능한 이름이 돼요. onPressed가 null이면 버튼은 보이되 동작하지 않아요.',
      },
      dart: String.raw`Wrap(
  crossAxisAlignment: WrapCrossAlignment.center,
  spacing: TRSpacing.small,
  children: [
    TRIconButton(
      label: 'Add rack',
      icon: const Icon(Icons.add),
      onPressed: () {},
    ),
    TRIconButton(
      label: 'Add rack',
      loading: true,
      loadingLabel: 'Adding rack',
      icon: const Icon(Icons.add),
      onPressed: () {},
    ),
    const TRIconButton(
      label: 'Add rack',
      icon: Icon(Icons.add),
      onPressed: null,
    ),
  ],
)`,
    },
    {
      id: 'icon-button-appearances',
      title: { en: 'Appearance', ja: '外観', ko: '표현 방식' },
      description: {
        en: 'Choose solid for the strongest emphasis, outline for a visible boundary, and ghost for low-emphasis toolbar actions.',
        ja: '最も強い強調には solid、境界を見せたい場合は outline、控えめなツールバー操作には ghost を選びます。',
        ko: '가장 강한 강조에는 solid, 경계를 드러내야 할 때는 outline, 강조가 낮은 툴바 동작에는 ghost를 선택하세요.',
      },
      dart: String.raw`Wrap(
  crossAxisAlignment: WrapCrossAlignment.center,
  spacing: TRSpacing.small,
  children: [
    for (final (appearance, label) in const [
      (TRAppearance.solid, 'Solid settings'),
      (TRAppearance.outline, 'Outline settings'),
      (TRAppearance.ghost, 'Ghost settings'),
    ])
      TRIconButton(
        appearance: appearance,
        label: label,
        icon: const Icon(Icons.settings),
        onPressed: () {},
      ),
  ],
)`,
    },
    {
      id: 'icon-button-intents',
      title: { en: 'Action intent', ja: '操作の意図', ko: '동작 의도' },
      description: {
        en: 'Use primary for the main action and danger only for destructive actions. Neutral is the default for ordinary toolbar controls.',
        ja: '主要な操作には primary を、取り消せない操作にのみ danger を使います。通常のツールバー操作の既定値は neutral です。',
        ko: '주요 동작에는 primary를, 되돌릴 수 없는 동작에만 danger를 사용하세요. 일반 툴바 컨트롤의 기본값은 neutral이에요.',
      },
      dart: String.raw`Wrap(
  crossAxisAlignment: WrapCrossAlignment.center,
  spacing: TRSpacing.small,
  children: [
    TRIconButton(
      label: 'Open settings',
      icon: const Icon(Icons.settings),
      onPressed: () {},
    ),
    TRIconButton(
      intent: TRIntent.primary,
      label: 'Add rack',
      icon: const Icon(Icons.add),
      onPressed: () {},
    ),
    TRIconButton(
      intent: TRIntent.danger,
      label: 'Delete rack',
      icon: const Icon(Icons.delete_outline),
      onPressed: () {},
    ),
  ],
)`,
    },
    {
      id: 'icon-button-sizes',
      title: { en: 'Sizes', ja: 'サイズ', ko: '크기' },
      description: {
        en: 'Each size sets a square target and its icon size together. Match the size to the controls beside the button and keep an adequate target for touch input.',
        ja: '各サイズが正方形のタップ領域とアイコンサイズをまとめて決めます。隣接するコントロールに合わせつつ、タッチ操作に十分な領域を確保してください。',
        ko: '각 크기가 정사각형 터치 영역과 아이콘 크기를 함께 정해요. 옆에 놓인 컨트롤과 크기를 맞추되 터치 입력에 충분한 영역을 남기세요.',
      },
      dart: String.raw`Wrap(
  crossAxisAlignment: WrapCrossAlignment.center,
  spacing: TRSpacing.small,
  children: [
    for (final (size, label) in const [
      (TRUiSize.sm, 'Small settings'),
      (TRUiSize.md, 'Medium settings'),
      (TRUiSize.lg, 'Large settings'),
    ])
      TRIconButton(
        uiSize: size,
        label: label,
        icon: const Icon(Icons.settings),
        onPressed: () {},
      ),
  ],
)`,
    },
  ],
  switch: [
    {
      id: 'switch-controlled',
      title: {
        en: 'Controlled setting',
        ja: '制御付きの設定',
        ko: '제어형 설정',
      },
      description: {
        en: 'Hold the value in `checked` and update it from `onCheckedChange` when the setting drives other UI. Pair the switch with visible text and repeat that text in `semanticLabel`.',
        ja: '値を `checked` で保持し、`onCheckedChange` で更新すると、設定をほかの UI にも反映できます。スイッチには見えるテキストを添え、同じ文言を `semanticLabel` にも渡してください。',
        ko: '값을 `checked`로 들고 `onCheckedChange`에서 갱신하면 설정을 다른 UI에도 반영할 수 있어요. 스위치 옆에 보이는 텍스트를 두고 같은 문구를 `semanticLabel`에도 넘기세요.',
      },
      dart: switchSources(switchControlledSourceEn),
    },
    {
      id: 'switch-availability',
      title: {
        en: 'Editable, read only, and disabled',
        ja: '編集可能・読み取り専用・無効',
        ko: '편집 가능, 읽기 전용, 사용 불가',
      },
      description: {
        en: '`readOnly` keeps the switch focusable and keyboard-reachable while refusing changes. `disabled` refuses changes too and marks the switch as unavailable for assistive technology. Both leave the current value visible.',
        ja: '`readOnly` はフォーカスとキーボード操作を残したまま変更だけを拒みます。`disabled` も変更を拒み、支援技術には利用できない状態として伝えます。どちらも現在の値は表示したままです。',
        ko: '`readOnly`는 포커스와 키보드 접근은 남기고 변경만 막아요. `disabled`도 변경을 막고 보조 기술에는 사용할 수 없는 상태로 알려요. 둘 다 현재 값은 그대로 보여줘요.',
      },
      dart: switchSources(switchAvailabilitySourceEn),
    },
    {
      id: 'switch-validation',
      title: {
        en: 'Required setting and recovery',
        ja: '必須の設定と復帰',
        ko: '필수 설정과 복구',
      },
      description: {
        en: '`invalid` only paints the danger border. Render the message yourself and clear both once the setting is turned on, because `TRSwitch` has no error text slot and no form validation.',
        ja: '`invalid` は危険を示す枠線を描くだけです。`TRSwitch` にはエラーテキストの領域もフォーム検証もないため、メッセージは自分で描画し、設定が有効になったら両方とも解除してください。',
        ko: '`invalid`는 위험을 알리는 테두리만 그려요. `TRSwitch`에는 오류 텍스트 자리도 폼 검증도 없으니 메시지는 직접 그리고, 설정이 켜지면 둘 다 함께 해제하세요.',
      },
      dart: switchSources(switchValidationSourceEn),
    },
  ],
  toggle: [
    {
      id: 'toggle-controlled',
      title: {
        en: 'Controlled formatting toggle',
        ja: '制御付きの書式トグル',
        ko: '제어형 서식 토글',
      },
      description: {
        en: 'Hold the state yourself with pressed and update it from onPressedChange when the toggle drives other UI.',
        ja: 'pressed で状態を保持し、onPressedChange で更新すると、トグルの状態をほかの UI にも反映できます。',
        ko: 'pressed로 상태를 직접 들고 onPressedChange에서 갱신하면 토글 상태를 다른 UI에도 반영할 수 있어요.',
      },
      dart: String.raw`class BoldToggle extends StatefulWidget {
  const BoldToggle({super.key});

  @override
  State<BoldToggle> createState() => _BoldToggleState();
}

class _BoldToggleState extends State<BoldToggle> {
  bool pressed = false;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisSize: MainAxisSize.min,
      spacing: TRSpacing.small,
      children: [
        TRToggle(
          pressed: pressed,
          onPressedChange: (next) => setState(() => pressed = next),
          child: const Text('Bold'),
        ),
        TRText(
          pressed ? 'Bold: on' : 'Bold: off',
          variant: TRTextVariant.bodySm,
          color: TRTextColor.muted,
        ),
      ],
    );
  }
}`,
    },
    {
      id: 'toggle-states',
      title: {
        en: 'Enabled and disabled states',
        ja: '有効と無効の状態',
        ko: '사용 가능 상태와 사용 불가 상태',
      },
      description: {
        en: 'Without pressed the toggle keeps its own state from defaultPressed. A disabled toggle keeps its pressed appearance but ignores taps, keyboard activation, and focus.',
        ja: 'pressed を渡さない場合は defaultPressed から自身で状態を保持します。disabled なトグルは押された見た目を保ったまま、タップ・キーボード操作・フォーカスを受け付けません。',
        ko: 'pressed를 넘기지 않으면 defaultPressed에서 시작해 스스로 상태를 관리해요. disabled 토글은 눌린 모습은 유지하지만 탭과 키보드 조작, 포커스를 받지 않아요.',
      },
      dart: String.raw`Wrap(
  crossAxisAlignment: WrapCrossAlignment.start,
  spacing: TRSpacing.large,
  runSpacing: TRSpacing.large,
  children: const [
    TRToggle(child: Text('Bold')),
    TRToggle(defaultPressed: true, child: Text('Italic')),
    TRToggle(disabled: true, child: Text('Underline')),
    TRToggle(
      defaultPressed: true,
      disabled: true,
      child: Text('Strikethrough'),
    ),
  ],
)`,
    },
    {
      id: 'toggle-sizes',
      title: { en: 'Sizes', ja: 'サイズ', ko: '크기' },
      description: {
        en: 'uiSize sets height, inline padding, and text size together. Match the size to the controls beside the toggle.',
        ja: 'uiSize が高さ・左右の余白・文字サイズをまとめて決めます。隣接するコントロールに合わせて選んでください。',
        ko: 'uiSize가 높이와 좌우 여백, 글자 크기를 함께 정해요. 토글 옆에 놓인 컨트롤과 크기를 맞추세요.',
      },
      dart: String.raw`Wrap(
  crossAxisAlignment: WrapCrossAlignment.center,
  spacing: TRSpacing.small,
  children: [
    for (final (size, label) in const [
      (TRUiSize.sm, 'Small'),
      (TRUiSize.md, 'Medium'),
      (TRUiSize.lg, 'Large'),
    ])
      TRToggle(uiSize: size, child: Text(label)),
  ],
)`,
    },
  ],
  'toggle-group': [
    {
      id: 'toggle-group-controlled',
      title: {
        en: 'Single selection',
        ja: '単一選択',
        ko: '단일 선택',
      },
      description: {
        en: 'By default only one value stays selected, and tapping the selected item clears the group. onValueChange reports the next list.',
        ja: '既定では選択できる値は 1 つだけで、選択中の項目をもう一度押すと選択が外れます。onValueChange は次のリストを渡します。',
        ko: '기본적으로 값은 하나만 선택돼요. 선택된 항목을 다시 누르면 선택이 해제되고, onValueChange가 다음 목록을 전달해요.',
      },
      dart: String.raw`class AlignmentGroup extends StatefulWidget {
  const AlignmentGroup({super.key});

  @override
  State<AlignmentGroup> createState() => _AlignmentGroupState();
}

class _AlignmentGroupState extends State<AlignmentGroup> {
  List<String> value = const ['start'];

  @override
  Widget build(BuildContext context) {
    final active = value.isEmpty ? 'none' : value.join(', ');
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisSize: MainAxisSize.min,
      spacing: TRSpacing.small,
      children: [
        TRToggleGroup(
          value: value,
          onValueChange: (next) => setState(() => value = next),
          children: const [
            TRToggle(value: 'start', child: Text('Start')),
            TRToggle(value: 'center', child: Text('Center')),
            TRToggle(value: 'end', child: Text('End')),
          ],
        ),
        TRText(
          'Alignment: $active',
          variant: TRTextVariant.bodySm,
          color: TRTextColor.muted,
        ),
      ],
    );
  }
}`,
    },
    {
      id: 'toggle-group-multiple',
      title: { en: 'Multiple selection', ja: '複数選択', ko: '다중 선택' },
      description: {
        en: 'multiple lets each item toggle independently, so the value list can hold several values at once.',
        ja: 'multiple を有効にすると各項目が独立して切り替わり、value に複数の値を同時に保持できます。',
        ko: 'multiple을 켜면 각 항목이 서로 독립적으로 켜지고 꺼져서 value에 여러 값을 함께 담을 수 있어요.',
      },
      dart: String.raw`TRToggleGroup(
  multiple: true,
  defaultValue: const ['bold', 'underline'],
  onValueChange: (value) => debugPrint(value.join(', ')),
  children: const [
    TRToggle(value: 'bold', child: Text('Bold')),
    TRToggle(value: 'italic', child: Text('Italic')),
    TRToggle(value: 'underline', child: Text('Underline')),
  ],
)`,
    },
    {
      id: 'toggle-group-orientation',
      title: {
        en: 'Vertical focus and disabled scopes',
        ja: '縦方向のフォーカスと無効化の範囲',
        ko: '세로 포커스와 비활성화 범위',
      },
      description: {
        en: 'A vertical group moves focus with Up and Down. loopFocus: false stops focus at the ends, disabled turns off every item, and a single item can be disabled on its own.',
        ja: '縦方向のグループでは上下キーでフォーカスが移動します。loopFocus: false は端でフォーカスを止め、disabled はすべての項目を無効にし、項目ごとに個別に無効化することもできます。',
        ko: '세로 그룹에서는 위아래 방향키로 포커스를 옮겨요. loopFocus: false는 양 끝에서 포커스를 멈추고, disabled는 모든 항목을 끄며, 항목 하나만 따로 끌 수도 있어요.',
      },
      dart: String.raw`TRToggleGroup(
  defaultValue: const ['top'],
  loopFocus: false,
  orientation: Axis.vertical,
  children: const [
    TRToggle(value: 'top', child: Text('Top')),
    TRToggle(value: 'middle', child: Text('Middle')),
    TRToggle(
      disabled: true,
      value: 'bottom',
      child: Text('Bottom unavailable'),
    ),
  ],
)`,
    },
  ],
  alert: [
    {
      id: 'alert-variants',
      title: {
        en: 'Status variants',
        ja: 'ステータスの種類',
        ko: '상태 변형',
      },
      description: {
        en: 'Each status variant pairs a semantic color with a matching icon.',
        ja: '各ステータスは意味のある色とアイコンを組み合わせます。',
        ko: '각 상태 변형은 시맨틱 색상과 어울리는 아이콘을 함께 써요.',
      },
      dart: String.raw`Column(
  spacing: TRSpacing.medium,
  children: [
    for (final variant in TRStatusVariant.values)
      TRAlert(
        variant: variant,
        icon: const Icon(Icons.info_outline, size: 20),
        title: Text(variant.name),
      ),
  ],
)`,
    },
    {
      id: 'alert-actions',
      title: { en: 'With actions', ja: 'アクション付き', ko: '액션 포함' },
      description: {
        en: 'Add a description and inline action buttons for alerts that ask the reader to respond.',
        ja: '読者に対応を促すアラートには、説明とインラインのアクションボタンを添えます。',
        ko: '사용자에게 응답을 요청하는 알림에는 설명과 인라인 액션 버튼을 함께 넣으세요.',
      },
      dart: String.raw`TRAlert(
  variant: TRStatusVariant.success,
  icon: const Icon(Icons.check_circle_outline, size: 20),
  title: const Text('Changes saved'),
  description: const Text('The rack configuration is up to date.'),
  actions: [
    TRButton(
      appearance: TRAppearance.ghost,
      intent: TRIntent.success,
      uiSize: TRUiSize.sm,
      onPressed: () {},
      child: const Text('Review'),
    ),
  ],
)`,
    },
  ],
  badge: [
    {
      id: 'badge-variants',
      title: { en: 'Variants', ja: '種類', ko: '변형' },
      description: {
        en: 'Status variants tint the badge to signal health, progress, or risk.',
        ja: 'ステータスの種類に応じてバッジの色を変え、状態や進捗、リスクを示します。',
        ko: '상태 변형으로 배지 색을 바꿔 정상·진행·위험을 나타내요.',
      },
      dart: String.raw`Wrap(
  spacing: TRSpacing.small,
  children: [
    for (final variant in TRStatusVariant.values)
      TRBadge(variant: variant, child: Text(variant.name)),
  ],
)`,
    },
    {
      id: 'badge-sizes',
      title: { en: 'Sizes', ja: 'サイズ', ko: '크기' },
      description: {
        en: 'Scale the badge with sm, md, and lg to sit beside text or headings.',
        ja: 'sm・md・lg でバッジの大きさを変え、本文や見出しに合わせます。',
        ko: 'sm, md, lg로 배지 크기를 조절해 본문이나 제목 옆에 맞추세요.',
      },
      dart: String.raw`Wrap(
  crossAxisAlignment: WrapCrossAlignment.center,
  spacing: TRSpacing.small,
  children: [
    for (final size in TRUiSize.values)
      TRBadge(
        variant: TRStatusVariant.success,
        uiSize: size,
        child: Text(size.name),
      ),
  ],
)`,
    },
  ],
  'code-block': [
    {
      id: 'code-block-highlighted',
      title: {
        en: 'Highlighted Dart',
        ja: 'ハイライトされた Dart',
        ko: '강조된 Dart',
      },
      description: {
        en: 'Pass a language after configuring a highlighter to render theme-aware syntax colors.',
        ja: 'ハイライターを設定した後に language を渡すと、テーマに対応した構文色を表示できます。',
        ko: '하이라이터를 설정한 뒤 language를 전달하면 테마에 맞는 구문 색상을 표시해요.',
      },
      dart: String.raw`const TRCodeBlock(
  code: "final status = 'healthy';",
  language: 'dart',
)`,
    },
    {
      id: 'code-block-modes',
      title: { en: 'Display modes', ja: '表示モード', ko: '표시 모드' },
      description: {
        en: 'Omit language for plain text, choose an identifier supported by the highlighter, and enable wrap for constrained layouts.',
        ja: 'プレーンテキストでは language を省略し、ハイライトにはハイライターが対応する識別子を選び、幅が限られるレイアウトでは wrap を有効にします。',
        ko: '일반 텍스트에는 language를 생략하고, 강조에는 하이라이터가 지원하는 식별자를 선택하며, 폭이 좁은 레이아웃에서는 wrap을 켜세요.',
      },
      dart: String.raw`Column(
  spacing: TRSpacing.medium,
  children: const [
    TRCodeBlock(code: 'rack-a: healthy'),
    TRCodeBlock(
      code: '{\n  "status": "healthy"\n}',
      language: 'json',
    ),
    TRCodeBlock(code: 'puts "healthy"', language: 'ruby'),
    TRCodeBlock(
      code: "final message = 'A long line that can wrap';",
      language: 'dart',
      wrap: true,
    ),
  ],
)`,
    },
    {
      id: 'code-block-override',
      title: {
        en: 'Per-block override',
        ja: 'ブロック単位の上書き',
        ko: '블록별 재정의',
      },
      description: {
        en: 'Pass highlighter directly when one block needs different language support or token colors than its provider.',
        ja: '1 つのブロックだけプロバイダーと異なる対応言語やトークン色が必要な場合は、highlighter を直接渡します。',
        ko: '블록 하나에 프로바이더와 다른 지원 언어나 토큰 색상이 필요하면 highlighter를 직접 전달하세요.',
      },
      dart: String.raw`Future<TRCodeHighlightResult?> alternateCodeHighlighter(
  TRCodeHighlightRequest request,
) async {
  if (request.language != 'dart') return null;
  final color = request.brightness == Brightness.dark
      ? Colors.purpleAccent
      : Colors.purple;
  return TRCodeHighlightResult(
    span: TextSpan(
      text: request.code,
      style: TextStyle(color: color),
    ),
  );
}

TRCodeBlock(
  code: "final region = 'icn';",
  highlighter: alternateCodeHighlighter,
  language: 'dart',
)`,
    },
  ],
  code: [
    {
      id: 'code-contexts',
      title: {
        en: 'Content contexts',
        ja: 'コンテンツの文脈',
        ko: '콘텐츠 맥락',
      },
      description: {
        en: 'Inline code keeps its visual treatment in prose, configuration values, long tokens, and multiline content.',
        ja: 'インラインコードは、本文、設定値、長いトークン、複数行の内容でも一貫した外観を保ちます。',
        ko: '인라인 코드는 본문, 설정값, 긴 토큰, 여러 줄 콘텐츠에서도 일관된 모양을 유지해요.',
      },
      dart: String.raw`Column(
  crossAxisAlignment: CrossAxisAlignment.start,
  mainAxisSize: MainAxisSize.min,
  spacing: TRSpacing.medium,
  children: [
    const Wrap(
      crossAxisAlignment: WrapCrossAlignment.center,
      children: [
        Text('Import '),
        TRCode('package:tinyrack_ui/tinyrack_ui.dart'),
        Text('.'),
      ],
    ),
    const Wrap(
      crossAxisAlignment: WrapCrossAlignment.center,
      children: [
        Text('Set '),
        TRCode('themeMode: ThemeMode.dark'),
        Text(' on MaterialApp.'),
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
)`,
    },
  ],
  'copy-button': [
    {
      id: 'copy-button-labels',
      title: {
        en: 'Contextual labels',
        ja: '文脈に合わせたラベル',
        ko: '맥락에 맞는 레이블',
      },
      description: {
        en: 'Name what gets copied so the confirmation still reads clearly when several copy buttons share a screen.',
        ja: '何をコピーするかをラベルに含めると、1 つの画面に複数のコピーボタンがあっても確認表示が明確になります。',
        ko: '무엇을 복사하는지 레이블에 담으면 한 화면에 복사 버튼이 여러 개 있어도 확인 표시를 명확하게 읽을 수 있어요.',
      },
      dart: {
        en: String.raw`Column(
  crossAxisAlignment: CrossAxisAlignment.start,
  mainAxisSize: MainAxisSize.min,
  spacing: TRSpacing.medium,
  children: const [
    Row(
      mainAxisSize: MainAxisSize.min,
      spacing: TRSpacing.small,
      children: [
        TRCode('flutter pub add tinyrack_ui'),
        TRCopyButton(value: 'flutter pub add tinyrack_ui'),
      ],
    ),
    Row(
      mainAxisSize: MainAxisSize.min,
      spacing: TRSpacing.small,
      children: [
        TRCode('rack_2f8c14d0'),
        TRCopyButton(
          appearance: TRAppearance.outline,
          value: 'rack_2f8c14d0',
          idleLabel: 'Copy ID',
          copiedLabel: 'ID copied',
        ),
      ],
    ),
  ],
)`,
        ko: String.raw`Column(
  crossAxisAlignment: CrossAxisAlignment.start,
  mainAxisSize: MainAxisSize.min,
  spacing: TRSpacing.medium,
  children: const [
    Row(
      mainAxisSize: MainAxisSize.min,
      spacing: TRSpacing.small,
      children: [
        TRCode('flutter pub add tinyrack_ui'),
        TRCopyButton(
          value: 'flutter pub add tinyrack_ui',
          idleLabel: '복사',
          copiedLabel: '복사됨',
        ),
      ],
    ),
    Row(
      mainAxisSize: MainAxisSize.min,
      spacing: TRSpacing.small,
      children: [
        TRCode('rack_2f8c14d0'),
        TRCopyButton(
          appearance: TRAppearance.outline,
          value: 'rack_2f8c14d0',
          idleLabel: 'ID 복사',
          copiedLabel: 'ID 복사됨',
        ),
      ],
    ),
  ],
)`,
        ja: String.raw`Column(
  crossAxisAlignment: CrossAxisAlignment.start,
  mainAxisSize: MainAxisSize.min,
  spacing: TRSpacing.medium,
  children: const [
    Row(
      mainAxisSize: MainAxisSize.min,
      spacing: TRSpacing.small,
      children: [
        TRCode('flutter pub add tinyrack_ui'),
        TRCopyButton(
          value: 'flutter pub add tinyrack_ui',
          idleLabel: 'コピー',
          copiedLabel: 'コピー済み',
        ),
      ],
    ),
    Row(
      mainAxisSize: MainAxisSize.min,
      spacing: TRSpacing.small,
      children: [
        TRCode('rack_2f8c14d0'),
        TRCopyButton(
          appearance: TRAppearance.outline,
          value: 'rack_2f8c14d0',
          idleLabel: 'ID をコピー',
          copiedLabel: 'ID をコピー済み',
        ),
      ],
    ),
  ],
)`,
      },
    },
    {
      id: 'copy-button-combinations',
      title: {
        en: 'Inherited Button combinations',
        ja: 'Button から継承した組み合わせ',
        ko: 'Button에서 물려받은 조합',
      },
      description: {
        en: '`appearance`, `intent`, and `uiSize` reach the underlying `TRButton`, and `resetDelay` shortens or extends the confirmation.',
        ja: '`appearance`、`intent`、`uiSize` は内部の `TRButton` に届き、`resetDelay` は確認表示の長さを調整します。',
        ko: '`appearance`, `intent`, `uiSize`는 내부의 `TRButton`까지 전달되고, `resetDelay`로 확인 표시 시간을 조절해요.',
      },
      dart: String.raw`Wrap(
  crossAxisAlignment: WrapCrossAlignment.center,
  spacing: TRSpacing.small,
  runSpacing: TRSpacing.small,
  children: const [
    TRCopyButton(
      uiSize: TRUiSize.sm,
      intent: TRIntent.primary,
      resetDelay: Duration(milliseconds: 750),
      value: 'tinyrack.net',
    ),
    TRCopyButton(
      appearance: TRAppearance.outline,
      value: "import 'package:tinyrack_ui/tinyrack_ui.dart';",
      idleLabel: 'Copy import',
      copiedLabel: 'Import copied',
    ),
    TRCopyButton(
      appearance: TRAppearance.ghost,
      intent: TRIntent.danger,
      uiSize: TRUiSize.lg,
      value: 'rack-log-2f8c14d0',
      idleLabel: 'Copy log id',
      copiedLabel: 'Log id copied',
    ),
  ],
)`,
    },
  ],
  'animated-number': [
    {
      id: 'animated-number-basic',
      title: { en: 'Counter', ja: 'カウンター', ko: '카운터' },
      description: {
        en: 'Update application state to roll the displayed value up or down.',
        ja: 'アプリケーションの状態を更新し、表示値を上下にロールさせます。',
        ko: '애플리케이션 상태를 바꿔 표시 값을 위나 아래로 롤링해요.',
      },
      dart: String.raw`class AnimatedNumberCounter extends StatefulWidget {
  const AnimatedNumberCounter({super.key});

  @override
  State<AnimatedNumberCounter> createState() =>
      _AnimatedNumberCounterState();
}

class _AnimatedNumberCounterState extends State<AnimatedNumberCounter> {
  double value = 1248;

  @override
  Widget build(BuildContext context) => Column(
    children: [
      TRAnimatedNumber(value: value),
      Row(
        children: [
          TRButton(
            onPressed: () => setState(() => value -= 125),
            child: const Text('Decrease'),
          ),
          TRButton(
            onPressed: () => setState(() => value += 125),
            child: const Text('Increase'),
          ),
        ],
      ),
    ],
  );
}`,
    },
    {
      id: 'animated-number-modes',
      title: {
        en: 'Animation modes',
        ja: 'アニメーションモード',
        ko: '애니메이션 모드',
      },
      description: {
        en: 'Use roll for digit-slot movement or count for continuous numeric interpolation.',
        ja: '桁ごとの移動には roll、数値の連続補間には count を使います。',
        ko: '숫자 슬롯 이동에는 roll을, 연속적인 숫자 보간에는 count를 사용하세요.',
      },
      dart: String.raw`Row(
  children: [
    TRAnimatedNumber(
      animation: TRAnimatedNumberAnimation.roll,
      value: value,
    ),
    TRAnimatedNumber(
      animation: TRAnimatedNumberAnimation.count,
      value: value,
    ),
  ],
)`,
    },
    {
      id: 'animated-number-formats',
      title: { en: 'Number formats', ja: '数値形式', ko: '숫자 형식' },
      description: {
        en: 'Pass a NumberFormat for currency and percent values, or a formatter callback for units.',
        ja: '通貨とパーセントには NumberFormat、単位には formatter コールバックを渡します。',
        ko: '통화와 퍼센트에는 NumberFormat을, 단위에는 formatter 콜백을 전달하세요.',
      },
      dart: String.raw`import 'package:intl/intl.dart';

Column(
  children: [
    TRAnimatedNumber(
      numberFormat: NumberFormat.simpleCurrency(name: 'USD'),
      value: 1234.5,
    ),
    TRAnimatedNumber(
      numberFormat: NumberFormat.percentPattern()
        ..maximumFractionDigits = 1,
      value: 0.42,
    ),
    TRAnimatedNumber(
      formatter: (value) =>
          NumberFormat.decimalPattern().format(value) + ' GB',
      value: 128,
    ),
  ],
)`,
    },
    {
      id: 'animated-number-direction',
      title: { en: 'Forced directions', ja: '方向の固定', ko: '방향 고정' },
      description: {
        en: 'Force changed digits to move up or down regardless of the value trend.',
        ja: '値の増減に関係なく、変更された数字を上または下へ移動させます。',
        ko: '값의 증감과 관계없이 바뀐 숫자를 위나 아래로 이동시켜요.',
      },
      dart: String.raw`Row(
  children: [
    TRAnimatedNumber(
      rollDirection: TRAnimatedNumberRollDirection.up,
      value: value,
    ),
    TRAnimatedNumber(
      rollDirection: TRAnimatedNumberRollDirection.down,
      value: value,
    ),
  ],
)`,
    },
  ],
  card: [
    {
      id: 'card-variants',
      title: { en: 'Variants', ja: '種類', ko: '변형' },
      description: {
        en: 'Choose default, outlined, or elevated to set how much a card separates from the page.',
        ja: 'default・outlined・elevated から選び、カードをページからどれだけ際立たせるかを決めます。',
        ko: 'default, outlined, elevated 중에서 골라 카드가 페이지에서 얼마나 도드라질지 정하세요.',
      },
      dart: String.raw`Wrap(
  spacing: TRSpacing.medium,
  runSpacing: TRSpacing.medium,
  children: [
    for (final variant in const [
      TRCardVariant.defaultVariant,
      TRCardVariant.outlined,
      TRCardVariant.elevated,
    ])
      SizedBox(
        width: 200,
        child: TRCard(
          variant: variant,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            spacing: TRSpacing.small,
            children: [
              TRCardTitle(child: Text(variant.name)),
              const TRText(
                '4 services are healthy.',
                variant: TRTextVariant.bodySm,
              ),
            ],
          ),
        ),
      ),
  ],
)`,
    },
    {
      id: 'card-recipe',
      title: { en: 'Content layout', ja: 'コンテンツ構成', ko: '콘텐츠 구성' },
      description: {
        en: 'Compose header, content, and footer slots for a complete card with actions.',
        ja: 'header・content・footer のスロットを組み合わせ、アクション付きのカードを構成します。',
        ko: 'header, content, footer 슬롯을 조합해 액션이 있는 카드를 구성하세요.',
      },
      dart: String.raw`TRCard(
  child: Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    spacing: TRSpacing.medium,
    children: [
      TRCardHeader(
        children: [
          const TRCardTitle(child: Text('Rack alpha')),
          const TRCardDescription(child: Text('4 services are healthy.')),
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
            child: const Text('Details'),
          ),
          TRButton(
            intent: TRIntent.primary,
            uiSize: TRUiSize.sm,
            onPressed: () {},
            child: const Text('Restart'),
          ),
        ],
      ),
    ],
  ),
)`,
    },
  ],
  tabs: [
    {
      id: 'tabs-sizes',
      title: { en: 'Sizes', ja: 'サイズ', ko: '크기' },
      description: {
        en: 'The tab bar scales with sm, md, and lg while keeping its active indicator.',
        ja: 'sm・md・lg でタブバーの大きさが変わり、アクティブなインジケーターは保たれます。',
        ko: 'sm, md, lg로 탭 바 크기가 바뀌며 활성 표시는 그대로 유지돼요.',
      },
      dart: String.raw`Column(
  spacing: TRSpacing.large,
  children: [
    for (final size in TRUiSize.values)
      TRTabs(
        defaultValue: 'overview',
        uiSize: size,
        tabs: const [
          TRTabsTab(value: 'overview', label: 'Overview'),
          TRTabsTab(value: 'metrics', label: 'Metrics'),
          TRTabsTab(value: 'settings', label: 'Settings'),
        ],
        panelBuilder: (value) => TRText(value, variant: TRTextVariant.bodySm),
      ),
  ],
)`,
    },
    {
      id: 'tabs-recipe',
      title: { en: 'Panels', ja: 'パネル構成', ko: '패널 구성' },
      description: {
        en: 'Give each tab its own panel by switching on the active value in panelBuilder.',
        ja: 'panelBuilder でアクティブな値を分岐し、タブごとにパネルを用意します。',
        ko: 'panelBuilder에서 활성 값을 분기해 탭마다 패널을 지정하세요.',
      },
      dart: String.raw`TRTabs(
  defaultValue: 'metrics',
  tabs: const [
    TRTabsTab(value: 'overview', label: 'Overview'),
    TRTabsTab(value: 'metrics', label: 'Metrics'),
    TRTabsTab(value: 'settings', label: 'Settings'),
  ],
  panelBuilder: (value) => TRText(
    switch (value) {
      'metrics' => 'Latency 18 ms across 4 racks.',
      'settings' => 'Deploy targets and access are configurable here.',
      _ => 'The rack configuration is up to date.',
    },
    variant: TRTextVariant.bodySm,
  ),
)`,
    },
  ],
  checkbox: [
    {
      id: 'checkbox-states',
      title: {
        en: 'Unchecked, checked, and mixed',
        ja: '未選択、選択済み、一部選択',
        ko: '선택 안 함, 선택함, 일부 선택',
      },
      description: {
        en: 'Use indeterminate only when the checkbox summarizes a partially selected set.',
        ja: 'チェックボックスが一部だけ選択された集合を要約する場合に限り、indeterminate を使います。',
        ko: '체크박스가 일부만 선택한 집합을 요약할 때만 indeterminate를 사용해요.',
      },
      dart: String.raw`import 'package:flutter/material.dart';
import 'package:tinyrack_ui/tinyrack_ui.dart';

Widget checkboxStates() => const Wrap(
  spacing: TRSpacing.large,
  children: [
    TRCheckbox(semanticLabel: 'Unchecked'),
    TRCheckbox(
      defaultChecked: true,
      semanticLabel: 'Checked',
    ),
    TRCheckbox(
      indeterminate: true,
      semanticLabel: 'Partially selected',
    ),
  ],
);`,
    },
    {
      id: 'checkbox-sizes',
      title: {
        en: 'Small, medium, and large',
        ja: '小、中、大',
        ko: '작게, 보통으로, 크게',
      },
      description: {
        en: 'Match sm, md, or lg to the density of nearby controls.',
        ja: '周囲のコントロールの密度に合わせて sm、md、lg を選びます。',
        ko: '주변 컨트롤 밀도에 맞춰 sm, md, lg를 선택하세요.',
      },
      dart: String.raw`import 'package:flutter/material.dart';
import 'package:tinyrack_ui/tinyrack_ui.dart';

Widget checkboxSizes() => Wrap(
  crossAxisAlignment: WrapCrossAlignment.center,
  spacing: TRSpacing.large,
  children: [
    for (final size in TRUiSize.values)
      TRCheckbox(
        defaultChecked: true,
        semanticLabel: size.name,
        uiSize: size,
      ),
  ],
);`,
    },
    {
      id: 'checkbox-availability',
      title: {
        en: 'Editable, read only, and disabled',
        ja: '編集可能、読み取り専用、無効',
        ko: '편집 가능, 읽기 전용, 사용 불가',
      },
      description: {
        en: 'Read-only controls keep focus and form values; disabled controls do neither.',
        ja: '読み取り専用はフォーカスとフォーム値を保ち、無効はどちらも保持しません。',
        ko: '읽기 전용 컨트롤은 포커스와 폼 값을 유지하고, 비활성 컨트롤은 둘 다 유지하지 않아요.',
      },
      dart: String.raw`import 'package:flutter/material.dart';
import 'package:tinyrack_ui/tinyrack_ui.dart';

Widget checkboxAvailability() => const Wrap(
  spacing: TRSpacing.large,
  children: [
    TRCheckbox(defaultChecked: true, semanticLabel: 'Editable'),
    TRCheckbox(
      defaultChecked: true,
      readOnly: true,
      semanticLabel: 'Read only',
    ),
    TRCheckbox(
      defaultChecked: true,
      disabled: true,
      semanticLabel: 'Disabled',
    ),
  ],
);`,
    },
    {
      id: 'checkbox-validation',
      title: {
        en: 'Required choice and recovery',
        ja: '必須選択とエラー回復',
        ko: '필수 선택과 오류 복구',
      },
      description: {
        en: 'Use TRCheckboxFormField to validate an agreement and show the invalid control state.',
        ja: 'TRCheckboxFormField で同意を検証し、無効なコントロール状態を表示します。',
        ko: 'TRCheckboxFormField로 동의를 검증하고 올바르지 않은 컨트롤 상태를 표시해요.',
      },
      dart: String.raw`import 'package:flutter/material.dart';
import 'package:tinyrack_ui/tinyrack_ui.dart';

class AgreementForm extends StatefulWidget {
  const AgreementForm({super.key});

  @override
  State<AgreementForm> createState() => _AgreementFormState();
}

class _AgreementFormState extends State<AgreementForm> {
  final formKey = GlobalKey<FormState>();

  @override
  Widget build(BuildContext context) => Form(
    key: formKey,
    child: Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        const Text('Accept the maintenance window'),
        TRCheckboxFormField(
          semanticLabel: 'Accept the maintenance window',
          validator: (checked) => checked == true
              ? null
              : 'Accept the maintenance window to continue.',
        ),
        TRButton(
          onPressed: () => formKey.currentState?.validate(),
          child: const Text('Continue'),
        ),
      ],
    ),
  );
}`,
    },
    {
      id: 'checkbox-form-values',
      title: {
        en: 'Explicit on and off values',
        ja: '明示的なオン・オフ値',
        ko: '명시적인 켜짐과 꺼짐 값',
      },
      description: {
        en: 'Register a name and choose the value TRFormValues collects for each state.',
        ja: '名前を登録し、各状態で TRFormValues が収集する値を指定します。',
        ko: '이름을 등록하고 각 상태에서 TRFormValues가 수집할 값을 정해요.',
      },
      dart: String.raw`import 'package:flutter/material.dart';
import 'package:tinyrack_ui/tinyrack_ui.dart';

class MonitoringForm extends StatefulWidget {
  const MonitoringForm({super.key});

  @override
  State<MonitoringForm> createState() => _MonitoringFormState();
}

class _MonitoringFormState extends State<MonitoringForm> {
  final formKey = GlobalKey<TRFormState>();
  String result = '';

  @override
  Widget build(BuildContext context) => Column(
    mainAxisSize: MainAxisSize.min,
    children: [
      TRForm(
        key: formKey,
        child: TRCheckboxFormField(
          name: 'monitoring',
          checkedValue: 'enabled',
          uncheckedValue: 'disabled',
          semanticLabel: 'Monitoring',
        ),
      ),
      TRButton(
        onPressed: () => setState(() {
          result = (formKey.currentState?.save()['monitoring'] ?? '').toString();
        }),
        child: const Text('Read value'),
      ),
      Text(result),
    ],
  );
}`,
    },
  ],
  fieldset: [
    {
      id: 'fieldset-basic',
      title: {
        en: 'Notification channels',
        ja: '通知チャネル',
        ko: '알림 채널',
      },
      description: {
        en: 'Name the group with `legend`, then give every control its own visible label beside the checkbox and a matching `semanticLabel`.',
        ja: '`legend` でグループに名前を付け、各コントロールにはチェックボックスの隣に見えるラベルと、対応する `semanticLabel` を与えてください。',
        ko: '`legend`로 그룹 이름을 정하고, 각 컨트롤에는 체크박스 옆에 보이는 레이블과 그에 맞는 `semanticLabel`을 함께 주세요.',
      },
      dart: fieldsetSources(fieldsetBasicSourceEn),
    },
    {
      id: 'fieldset-states',
      title: {
        en: 'Enabled and disabled groups',
        ja: '有効なグループと無効なグループ',
        ko: '활성 그룹과 비활성 그룹',
      },
      description: {
        en: '`disabled` dims the group and marks it disabled for assistive technology, but it does not block the controls inside. Pass `disabled` to each control so the group cannot be edited.',
        ja: '`disabled` はグループを淡くし、支援技術にも無効として伝えますが、内部のコントロールの操作までは止めません。編集できないようにするには、各コントロールにも `disabled` を渡してください。',
        ko: '`disabled`는 그룹을 흐리게 하고 보조 기술에도 비활성으로 알리지만, 내부 컨트롤의 조작까지 막지는 않아요. 편집을 막으려면 각 컨트롤에도 `disabled`를 넘기세요.',
      },
      dart: fieldsetSources(fieldsetStatesSourceEn),
    },
    {
      id: 'fieldset-composition',
      title: { en: 'Nested groups', ja: '入れ子のグループ', ko: '중첩 그룹' },
      description: {
        en: 'Nest a fieldset inside another one when a subset of options belongs to a narrower question. Each level keeps its own legend, so the relationship stays readable.',
        ja: '一部の選択肢がより狭い問いに属する場合は、フィールドセットを入れ子にしてください。各階層が自分のレジェンドを持つため、関係が読み取りやすくなります。',
        ko: '일부 선택지가 더 좁은 질문에 속한다면 필드셋을 중첩하세요. 각 단계가 자기 레전드를 유지하므로 관계를 읽기 쉬워요.',
      },
      dart: fieldsetSources(fieldsetCompositionSourceEn),
    },
  ],
  'otp-field': [
    {
      id: 'otp-field-sizes',
      title: { en: 'Sizes', ja: 'サイズ', ko: '크기' },
      description: {
        en: 'Choose `uiSize` so the slots line up with the `TRTextField`, `TRButton`, or `TRNumberField` beside them. The digit style stays the same at every size; only the square slots and the default gap change.',
        ja: '隣に並ぶ `TRTextField`・`TRButton`・`TRNumberField` と揃うように `uiSize` を選んでください。数字のスタイルはどのサイズでも変わらず、正方形のスロットと既定の間隔だけが変化します。',
        ko: '옆에 놓인 `TRTextField`, `TRButton`, `TRNumberField`와 나란히 맞도록 `uiSize`를 고르세요. 숫자 스타일은 어떤 크기에서도 그대로이고, 정사각형 슬롯과 기본 간격만 달라져요.',
      },
      dart: otpSources(otpSizesSourceEn),
    },
    {
      id: 'otp-field-states',
      title: {
        en: 'Length and availability',
        ja: '長さと利用可否',
        ko: '길이와 사용 가능 여부',
      },
      description: {
        en: '`length` sets the slot count and decides when `onCompleted` fires. `readOnly` keeps a code visible and focusable but rejects edits, while `enabled: false` mutes the whole field and blocks focus.',
        ja: '`length` はスロット数を決め、`onCompleted` が呼ばれるタイミングを左右します。`readOnly` はコードを表示したままフォーカスもできますが編集は拒否し、`enabled: false` はフィールド全体を淡くしてフォーカスも止めます。',
        ko: '`length`는 슬롯 개수를 정하고 `onCompleted` 호출 시점을 결정해요. `readOnly`는 코드를 보여 주고 포커스도 유지하면서 편집만 막고, `enabled: false`는 필드 전체를 흐리게 하며 포커스까지 막아요.',
      },
      dart: otpSources(otpStatesSourceEn),
    },
    {
      id: 'otp-field-validation',
      title: {
        en: 'Required code and recovery',
        ja: '必須コードとリカバリー',
        ko: '필수 코드와 복구',
      },
      description: {
        en: '`TROtpFieldFormField` joins the surrounding `Form`, so `validator` output lands in `errorText` and turns the slot borders red. `AutovalidateMode.onUserInteraction` reports a short code while the reader is still typing rather than only on submit.',
        ja: '`TROtpFieldFormField` は外側の `Form` に参加するため、`validator` の戻り値が `errorText` になり、スロットの枠線が赤に変わります。`AutovalidateMode.onUserInteraction` を使うと、送信時だけでなく入力中にも桁数不足を知らせます。',
        ko: '`TROtpFieldFormField`는 상위 `Form`에 참여하므로 `validator`가 반환한 문구가 `errorText`가 되고 슬롯 테두리가 빨갛게 바뀌어요. `AutovalidateMode.onUserInteraction`을 쓰면 제출할 때뿐 아니라 입력하는 중에도 자릿수가 모자란 것을 알려 줘요.',
      },
      dart: otpSources(otpValidationSourceEn),
    },
    {
      id: 'otp-field-masked',
      title: {
        en: 'Masked entry and reset',
        ja: 'マスク入力とリセット',
        ko: '가려진 입력과 초기화',
      },
      description: {
        en: '`obscureText` replaces each digit with a bullet and stops the value from reaching `Semantics`, so use it only for a code that stays secret after entry. A `TROtpFieldController` clears the field from a Retry action, and `separatorBuilder` replaces the gap after the slot at `index` — return a plain `SizedBox` for the seams that should stay empty.',
        ja: '`obscureText` は各桁を丸印に置き換え、値が `Semantics` に渡らないようにします。入力後も秘密であり続けるコードにのみ使ってください。`TROtpFieldController` は再試行操作からフィールドを空にし、`separatorBuilder` は `index` 番目のスロットの後ろの間隔を置き換えます。空けたい箇所では通常の `SizedBox` を返してください。',
        ko: '`obscureText`는 각 자리를 점으로 바꾸고 값이 `Semantics`에 전달되지 않게 하므로, 입력 후에도 비밀로 남아야 하는 코드에만 쓰세요. `TROtpFieldController`는 다시 시도 동작에서 입력을 비우고, `separatorBuilder`는 `index` 슬롯 뒤의 간격을 대체해요. 비워 둘 자리에는 일반 `SizedBox`를 반환하세요.',
      },
      dart: otpSources(otpMaskedSourceEn),
    },
  ],
  slider: [
    {
      id: 'slider-basic',
      title: { en: 'Volume', ja: '音量', ko: '볼륨' },
      description: {
        en: 'The uncontrolled constructor owns the value. Give the slider a bounded width, since it fills the space its parent offers.',
        ja: '非制御コンストラクタが値を保持します。スライダーは親から与えられた幅いっぱいに広がるため、幅を制約してください。',
        ko: '비제어 생성자가 값을 소유해요. 슬라이더는 부모가 주는 너비를 채우므로 너비를 제약하세요.',
      },
      dart: sliderSources(sliderBasicSourceEn),
    },
    {
      id: 'slider-sizes',
      title: { en: 'Sizes', ja: 'サイズ', ko: '크기' },
      description: {
        en: '`uiSize` scales the thumb and the space around the track while the track thickness stays the same. Use `TRUiSize.sm` when the slider sits in a dense control surface.',
        ja: '`uiSize` はトラックの太さを保ったまま、つまみとトラック周辺の領域を拡大縮小します。密度の高いコントロール面に置く場合は `TRUiSize.sm` を使ってください。',
        ko: '`uiSize`는 트랙 두께는 그대로 두고 썸과 트랙 주변 공간의 크기를 조절해요. 밀도가 높은 컨트롤 영역에 놓을 때는 `TRUiSize.sm`을 쓰세요.',
      },
      dart: sliderSources(sliderSizesSourceEn),
    },
    {
      id: 'slider-states',
      title: { en: 'Orientations', ja: '向き', ko: '방향' },
      description: {
        en: 'A vertical slider puts the maximum at the top, takes a fixed width, and fills the height it is given. Constrain that height so the track has room.',
        ja: '縦向きのスライダーは最大値を上端に置き、固定幅を取り、与えられた高さいっぱいに広がります。トラックの領域を確保するため、その高さを制約してください。',
        ko: '세로 슬라이더는 최댓값을 위에 두고 고정 너비를 쓰며 주어진 높이를 채워요. 트랙이 들어갈 자리가 생기도록 높이를 제약하세요.',
      },
      dart: sliderSources(sliderStatesSourceEn),
    },
    {
      id: 'slider-disabled',
      title: { en: 'Disabled slider', ja: '無効なスライダー', ko: '비활성 슬라이더' },
      description: {
        en: 'Set `enabled: false` when the value should stay readable but cannot be changed. The increase and decrease actions leave the semantics node, so assistive technology no longer offers them.',
        ja: '値は読めるままで変更はさせたくない場合は `enabled: false` を設定してください。セマンティクスノードから増減アクションが外れるため、支援技術もそれらを提示しなくなります。',
        ko: '값은 계속 보이되 바꿀 수 없어야 한다면 `enabled: false`를 설정하세요. 시맨틱 노드에서 증가·감소 동작이 빠지므로 보조 기술도 더 이상 제공하지 않아요.',
      },
      dart: sliderSources(sliderDisabledSourceEn),
    },
    {
      id: 'slider-range',
      title: { en: 'Two-thumb range', ja: '2 つのつまみによる範囲', ko: '두 썸 범위' },
      description: {
        en: '`TRRangeSlider` carries a `RangeValues` and keeps the thumbs `minGap` apart in value units. `labelBuilder` formats each end for both the heading row and the semantics value, and the arrow keys drive whichever thumb the last pointer press selected.',
        ja: '`TRRangeSlider` は `RangeValues` を扱い、2 つのつまみを値の単位で `minGap` 分だけ離して保ちます。`labelBuilder` は見出し行とセマンティクスの値の両方について各端を整形し、矢印キーは直前のポインター操作で選ばれたつまみを動かします。',
        ko: '`TRRangeSlider`는 `RangeValues`를 다루고 두 썸을 값 단위로 `minGap`만큼 떨어뜨려 유지해요. `labelBuilder`는 제목 줄과 시맨틱 값 양쪽에서 각 끝을 포맷하고, 방향키는 마지막 포인터 입력이 고른 썸을 움직여요.',
      },
      dart: sliderSources(sliderRangeSourceEn),
    },
    {
      id: 'slider-form',
      title: { en: 'Form submission', ja: 'フォーム送信', ko: '폼 제출' },
      description: {
        en: '`TRSliderFormField` joins the surrounding `Form`, so `FormState.save` collects the value through `onSaved`. There is no `name` and no hidden input to serialize.',
        ja: '`TRSliderFormField` は周囲の `Form` に参加するため、`FormState.save` が `onSaved` を通じて値を集めます。シリアライズ用の `name` や隠し入力はありません。',
        ko: '`TRSliderFormField`는 감싸는 `Form`에 참여하므로 `FormState.save`가 `onSaved`로 값을 모아요. 직렬화를 위한 `name`이나 숨은 입력은 없어요.',
      },
      dart: sliderSources(sliderFormSourceEn),
    },
    {
      id: 'slider-validation',
      title: {
        en: 'Field-owned validation',
        ja: 'フィールドが持つ検証',
        ko: '필드가 담당하는 검증',
      },
      description: {
        en: 'Move the thumb below 60% to reveal the error, then raise it to clear the message. `AutovalidateMode.onUserInteraction` keeps the field quiet until the reader touches it, and `validate` guards `save` on submit.',
        ja: 'つまみを 60% 未満に動かすとエラーが表示され、値を上げるとメッセージが消えます。`AutovalidateMode.onUserInteraction` は読み手が操作するまで何も表示せず、送信時は `validate` が `save` を守ります。',
        ko: '썸을 60% 아래로 옮기면 오류가 나타나고, 값을 올리면 메시지가 사라져요. `AutovalidateMode.onUserInteraction`은 조작 전까지 조용히 있고, 제출할 때는 `validate`가 `save`를 막아줘요.',
      },
      dart: sliderSources(sliderValidationSourceEn),
    },
  ],
  'checkbox-group': [
    {
      id: 'checkbox-group-options',
      title: { en: 'Option list', ja: 'オプション一覧', ko: '옵션 목록' },
      description: {
        en: 'Pair each checkbox with a visible label and use defaultValue when the group should own its initial selection.',
        ja: '各チェックボックスに表示ラベルを付け、グループが初期選択を管理する場合は defaultValue を使います。',
        ko: '체크박스마다 보이는 레이블을 붙이고, 그룹이 초기 선택을 관리할 때는 defaultValue를 사용해요.',
      },
      dart: String.raw`TRCheckboxGroup(
  defaultValue: const ['telemetry'],
  children: [
    for (final (value, label) in const [
      ('telemetry', 'Share telemetry'),
      ('newsletter', 'Release notes'),
      ('beta', 'Beta features'),
    ])
      Row(
        mainAxisSize: MainAxisSize.min,
        spacing: TRSpacing.small,
        children: [
          TRCheckbox(value: value),
          TRText(label, variant: TRTextVariant.bodySm),
        ],
      ),
  ],
)`,
    },
    {
      id: 'checkbox-group-disabled',
      title: {
        en: 'Editable, read-only, and disabled',
        ja: '編集可能、読み取り専用、無効',
        ko: '편집 가능, 읽기 전용, 비활성',
      },
      description: {
        en: 'Set readOnly on individual checkboxes when values must remain visible, or disable the group to block every child.',
        ja: '値を表示したままにする場合は個々のチェックボックスを readOnly にし、すべての子を操作不可にする場合はグループを無効にします。',
        ko: '값을 그대로 보여줘야 한다면 개별 체크박스에 readOnly를 설정하고, 모든 자식의 동작을 막으려면 그룹을 비활성화하세요.',
      },
      dart: String.raw`Wrap(
  spacing: TRSpacing.large,
  children: [
    TRCheckboxGroup(
      defaultValue: const ['telemetry'],
      children: editableOptions,
    ),
    TRCheckboxGroup(
      defaultValue: const ['telemetry'],
      children: readOnlyOptions,
    ),
    TRCheckboxGroup(
      disabled: true,
      defaultValue: const ['telemetry'],
      children: disabledOptions,
    ),
  ],
)`,
    },
    {
      id: 'checkbox-group-validation',
      title: {
        en: 'Choose one or two values',
        ja: '1つまたは2つを選ぶ',
        ko: '값을 한 개나 두 개 골라요',
      },
      description: {
        en: 'Control the value list when product rules require a minimum and maximum selection count.',
        ja: '最小数と最大数のルールがある場合は、値のリストを制御します。',
        ko: '제품 규칙에 최소와 최대 선택 개수가 있다면 값 목록을 제어해요.',
      },
      dart: String.raw`Builder(
  builder: (context) {
    var selected = <String>['telemetry'];
    return StatefulBuilder(
      builder: (context, setState) => TRField(
        label: 'Included features',
        errorText: selected.isEmpty || selected.length > 2
            ? 'Select one or two features.'
            : null,
        control: TRCheckboxGroup(
          value: selected,
          onValueChange: (value) => setState(() => selected = value),
          children: options,
        ),
      ),
    );
  },
)`,
    },
    {
      id: 'checkbox-group-parent',
      title: {
        en: 'Select all and mixed state',
        ja: 'すべて選択と一部選択',
        ko: '모두 선택과 일부 선택 상태',
      },
      description: {
        en: 'Drive a separate checkbox from the controlled value list to provide select-all and indeterminate states.',
        ja: '制御された値のリストから別のチェックボックスを更新し、すべて選択と一部選択の状態を提供します。',
        ko: 'controlled 값 목록으로 별도 체크박스를 제어해 모두 선택과 일부 선택 상태를 제공해요.',
      },
      dart: String.raw`Column(
  children: [
    TRCheckbox(
      checked: selected.length == allValues.length,
      indeterminate: selected.isNotEmpty &&
          selected.length != allValues.length,
      onCheckedChange: (checked) => setState(
        () => selected = checked ? [...allValues] : [],
      ),
    ),
    TRCheckboxGroup(
      value: selected,
      onValueChange: (value) => setState(() => selected = value),
      children: options,
    ),
  ],
)`,
    },
    {
      id: 'checkbox-group-form',
      title: {
        en: 'Collect a named form value',
        ja: '名前付きフォーム値を取得',
        ko: '이름 있는 폼 값 모으기',
      },
      description: {
        en: 'Give the group a name so TRFormState.save() includes its selected string list.',
        ja: 'グループに name を設定すると、TRFormState.save() に選択済みの文字列リストが含まれます。',
        ko: '그룹에 name을 지정하면 TRFormState.save() 결과에 선택된 문자열 목록이 포함돼요.',
      },
      dart: String.raw`TRForm(
  key: formKey,
  child: Column(
    children: [
      TRCheckboxGroup(
        name: 'features',
        defaultValue: const ['telemetry'],
        children: options,
      ),
      TRButton(
        onPressed: () {
          final values = formKey.currentState!.save();
          submit(values['features'] as List<String>);
        },
        child: const Text('Collect form values'),
      ),
    ],
  ),
)`,
    },
  ],
  radio: [
    {
      id: 'radio-states',
      title: {
        en: 'Unselected and selected',
        ja: '未選択と選択済み',
        ko: '선택 안 함과 선택함',
      },
      description: {
        en: 'Selection is meaningful only against the value the group holds, so compare both options inside one group.',
        ja: '選択はグループが保持する値との関係でのみ意味を持つため、1 つのグループ内で両方の状態を比べます。',
        ko: '선택은 그룹이 가진 값과의 관계에서만 의미가 있으니, 한 그룹 안에서 두 상태를 함께 비교해요.',
      },
      dart: radioSources(radioStatesSourceEn),
    },
    {
      id: 'radio-sizes',
      title: {
        en: 'Small, medium, and large',
        ja: '小、中、大',
        ko: '작게, 보통으로, 크게',
      },
      description: {
        en: 'Match sm, md, or lg to the density of the controls around the option.',
        ja: 'sm・md・lg を、選択肢の周囲にあるコントロールの密度に合わせます。',
        ko: '옵션 주변 컨트롤의 밀도에 맞춰 sm, md, lg 중에서 고르세요.',
      },
      dart: radioSources(radioSizesSourceEn),
    },
    {
      id: 'radio-availability',
      title: {
        en: 'Editable, read only, and disabled',
        ja: '編集可能、読み取り専用、無効',
        ko: '편집 가능, 읽기 전용, 비활성',
      },
      description: {
        en: 'Set availability on one option when it differs from the rest; otherwise set it once on the group.',
        ja: '他と状態が異なる選択肢にだけ利用可否を設定します。全体が同じならグループにまとめて設定してください。',
        ko: '나머지와 상태가 다른 옵션에만 사용 가능 여부를 지정하세요. 전부 같다면 그룹에 한 번만 지정해요.',
      },
      dart: radioSources(radioAvailabilitySourceEn),
    },
  ],
  'radio-group': [
    {
      id: 'radio-group-states',
      title: {
        en: 'Editable, read only, and disabled groups',
        ja: '編集可能、読み取り専用、無効のグループ',
        ko: '편집 가능, 읽기 전용, 비활성 그룹',
      },
      description: {
        en: 'A read-only group keeps its value and keyboard focus; a disabled group blocks both and drops out of TRFormValues.',
        ja: '読み取り専用のグループは値とキーボードフォーカスを保ち、無効なグループは両方を止めて TRFormValues から外れます。',
        ko: '읽기 전용 그룹은 값과 키보드 포커스를 유지하고, 비활성 그룹은 둘 다 막으면서 TRFormValues에서도 빠져요.',
      },
      dart: radioSources(radioGroupStatesSourceEn),
    },
    {
      id: 'radio-group-validation',
      title: {
        en: 'Require one value',
        ja: '値を 1 つ必須にする',
        ko: '값 하나를 필수로 받기',
      },
      description: {
        en: 'The group has no required prop, so control the value and pass your own message to TRField.errorText.',
        ja: 'グループに required プロパティはないため、値を制御して独自のメッセージを TRField.errorText に渡します。',
        ko: '그룹에는 required 속성이 없으니 값을 직접 제어하고 메시지를 TRField.errorText로 넘기세요.',
      },
      dart: radioSources(radioGroupValidationSourceEn),
    },
    {
      id: 'radio-group-form',
      title: {
        en: 'Collect the value from a form',
        ja: 'フォームから値を取得する',
        ko: '폼에서 값 모으기',
      },
      description: {
        en: 'name registers the selected string with the nearest TRForm, which reports it from save().',
        ja: 'name を設定すると選択済み文字列が最も近い TRForm に登録され、save() で取得できます。',
        ko: 'name을 지정하면 선택된 문자열이 가장 가까운 TRForm에 등록되고 save()로 가져올 수 있어요.',
      },
      dart: radioSources(radioGroupFormSourceEn),
    },
  ],
  form: [
    {
      id: 'form-basic',
      title: {
        en: 'Collect values and reset',
        ja: '値の収集とリセット',
        ko: '값 수집과 초기화',
      },
      description: {
        en: 'Submit reads the named field through `save()`. Reset restores the initial value, and the application clears its own submitted result.',
        ja: '送信では `save()` を通じて名前付きフィールドを読み取ります。リセットは初期値を戻し、送信結果はアプリケーション側でクリアします。',
        ko: '제출하면 `save()`로 이름 있는 필드를 읽어요. 초기화는 초기값을 되돌리고, 제출 결과는 애플리케이션이 직접 지워요.',
      },
      dart: {
        en: String.raw`TRForm(
  key: formKey,
  child: Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    mainAxisSize: MainAxisSize.min,
    spacing: TRSpacing.medium,
    children: [
      const TRTextField(
        name: 'rack',
        label: 'Rack name',
        initialValue: 'rack-alpha',
      ),
      Wrap(
        spacing: TRSpacing.small,
        runSpacing: TRSpacing.small,
        children: [
          TRButton(
            onPressed: () {
              final values = formKey.currentState!.save();
              submit(values['rack']?.toString() ?? '');
            },
            child: const Text('Submit rack'),
          ),
          TRButton(
            appearance: TRAppearance.outline,
            onPressed: () {
              formKey.currentState!.reset();
              submit('');
            },
            child: const Text('Reset form'),
          ),
        ],
      ),
    ],
  ),
)`,
        ja: String.raw`TRForm(
  key: formKey,
  child: Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    mainAxisSize: MainAxisSize.min,
    spacing: TRSpacing.medium,
    children: [
      const TRTextField(
        name: 'rack',
        label: 'ラック名',
        initialValue: 'rack-alpha',
      ),
      Wrap(
        spacing: TRSpacing.small,
        runSpacing: TRSpacing.small,
        children: [
          TRButton(
            onPressed: () {
              final values = formKey.currentState!.save();
              submit(values['rack']?.toString() ?? '');
            },
            child: const Text('ラックを送信'),
          ),
          TRButton(
            appearance: TRAppearance.outline,
            onPressed: () {
              formKey.currentState!.reset();
              submit('');
            },
            child: const Text('フォームをリセット'),
          ),
        ],
      ),
    ],
  ),
)`,
        ko: String.raw`TRForm(
  key: formKey,
  child: Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    mainAxisSize: MainAxisSize.min,
    spacing: TRSpacing.medium,
    children: [
      const TRTextField(
        name: 'rack',
        label: '랙 이름',
        initialValue: 'rack-alpha',
      ),
      Wrap(
        spacing: TRSpacing.small,
        runSpacing: TRSpacing.small,
        children: [
          TRButton(
            onPressed: () {
              final values = formKey.currentState!.save();
              submit(values['rack']?.toString() ?? '');
            },
            child: const Text('랙 제출'),
          ),
          TRButton(
            appearance: TRAppearance.outline,
            onPressed: () {
              formKey.currentState!.reset();
              submit('');
            },
            child: const Text('폼 초기화'),
          ),
        ],
      ),
    ],
  ),
)`,
      },
    },
    {
      id: 'form-states',
      title: {
        en: 'Required submission and recovery',
        ja: '必須送信と復旧',
        ko: '필수 제출과 복구',
      },
      description: {
        en: 'Submit while the field is empty to see the validator message, then enter a rack name and submit again. `validate()` gates the read of `save()`.',
        ja: '空のまま送信すると検証メッセージが表示されます。ラック名を入力して再送信してください。`validate()` が `save()` の読み取りを制御します。',
        ko: '비운 채로 제출하면 검증 메시지가 보이고, 랙 이름을 입력한 뒤 다시 제출하면 통과해요. `validate()`가 `save()` 읽기를 막아 줘요.',
      },
      dart: {
        en: String.raw`TRForm(
  key: formKey,
  child: Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    mainAxisSize: MainAxisSize.min,
    spacing: TRSpacing.medium,
    children: [
      TRTextField(
        name: 'rack',
        label: 'Rack name',
        validator: (value) => (value ?? '').trim().isEmpty
            ? 'Enter a rack name before saving.'
            : null,
      ),
      TRButton(
        onPressed: () {
          final state = formKey.currentState!;
          if (!state.validate()) return;
          submit(state.save()['rack']?.toString() ?? '');
        },
        child: const Text('Save rack'),
      ),
    ],
  ),
)`,
        ja: String.raw`TRForm(
  key: formKey,
  child: Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    mainAxisSize: MainAxisSize.min,
    spacing: TRSpacing.medium,
    children: [
      TRTextField(
        name: 'rack',
        label: 'ラック名',
        validator: (value) => (value ?? '').trim().isEmpty
            ? '保存する前にラック名を入力してください。'
            : null,
      ),
      TRButton(
        onPressed: () {
          final state = formKey.currentState!;
          if (!state.validate()) return;
          submit(state.save()['rack']?.toString() ?? '');
        },
        child: const Text('ラックを保存'),
      ),
    ],
  ),
)`,
        ko: String.raw`TRForm(
  key: formKey,
  child: Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    mainAxisSize: MainAxisSize.min,
    spacing: TRSpacing.medium,
    children: [
      TRTextField(
        name: 'rack',
        label: '랙 이름',
        validator: (value) => (value ?? '').trim().isEmpty
            ? '저장하기 전에 랙 이름을 입력하세요.'
            : null,
      ),
      TRButton(
        onPressed: () {
          final state = formKey.currentState!;
          if (!state.validate()) return;
          submit(state.save()['rack']?.toString() ?? '');
        },
        child: const Text('랙 저장'),
      ),
    ],
  ),
)`,
      },
    },
    {
      id: 'form-server-errors',
      title: {
        en: 'Server error and recovery',
        ja: 'サーバーエラーと復旧',
        ko: '서버 오류와 복구',
      },
      description: {
        en: 'A rejected name arrives back as `errorText` instead of a validator. `onChanged` clears the error while the reader edits, and `reset()` restores the field while the application clears its own result.',
        ja: '拒否された名前は検証関数ではなく `errorText` として戻ります。編集中は `onChanged` がエラーを消し、`reset()` はフィールドを戻します。結果はアプリケーション側でクリアします。',
        ko: '거절된 이름은 검증기 대신 `errorText`로 돌아와요. 입력하는 동안 `onChanged`가 오류를 지우고, `reset()`은 필드를 되돌리며 결과는 애플리케이션이 직접 지워요.',
      },
      dart: {
        en: String.raw`TRForm(
  key: formKey,
  onChanged: (_) => clearServerError(),
  child: Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    mainAxisSize: MainAxisSize.min,
    spacing: TRSpacing.medium,
    children: [
      TRTextField(
        name: 'rack',
        label: 'Rack name',
        initialValue: 'rack-alpha',
        helperText: 'Use a name that is not already registered.',
        errorText: serverError,
      ),
      Wrap(
        spacing: TRSpacing.small,
        runSpacing: TRSpacing.small,
        children: [
          TRButton(
            onPressed: () {
              final rack =
                  formKey.currentState!.save()['rack']?.toString() ?? '';
              if (rack.toLowerCase() == 'rack-alpha') {
                rejectRack('Rack Alpha already exists.');
                return;
              }
              createRack(rack);
            },
            child: const Text('Create rack'),
          ),
          TRButton(
            appearance: TRAppearance.outline,
            onPressed: () {
              formKey.currentState!.reset();
              clearServerError();
            },
            child: const Text('Reset form'),
          ),
        ],
      ),
    ],
  ),
)`,
        ja: String.raw`TRForm(
  key: formKey,
  onChanged: (_) => clearServerError(),
  child: Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    mainAxisSize: MainAxisSize.min,
    spacing: TRSpacing.medium,
    children: [
      TRTextField(
        name: 'rack',
        label: 'ラック名',
        initialValue: 'rack-alpha',
        helperText: 'まだ登録されていない名前を使ってください。',
        errorText: serverError,
      ),
      Wrap(
        spacing: TRSpacing.small,
        runSpacing: TRSpacing.small,
        children: [
          TRButton(
            onPressed: () {
              final rack =
                  formKey.currentState!.save()['rack']?.toString() ?? '';
              if (rack.toLowerCase() == 'rack-alpha') {
                rejectRack('Rack Alpha はすでに存在します。');
                return;
              }
              createRack(rack);
            },
            child: const Text('ラックを作成'),
          ),
          TRButton(
            appearance: TRAppearance.outline,
            onPressed: () {
              formKey.currentState!.reset();
              clearServerError();
            },
            child: const Text('フォームをリセット'),
          ),
        ],
      ),
    ],
  ),
)`,
        ko: String.raw`TRForm(
  key: formKey,
  onChanged: (_) => clearServerError(),
  child: Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    mainAxisSize: MainAxisSize.min,
    spacing: TRSpacing.medium,
    children: [
      TRTextField(
        name: 'rack',
        label: '랙 이름',
        initialValue: 'rack-alpha',
        helperText: '아직 등록되지 않은 이름을 사용하세요.',
        errorText: serverError,
      ),
      Wrap(
        spacing: TRSpacing.small,
        runSpacing: TRSpacing.small,
        children: [
          TRButton(
            onPressed: () {
              final rack =
                  formKey.currentState!.save()['rack']?.toString() ?? '';
              if (rack.toLowerCase() == 'rack-alpha') {
                rejectRack('Rack Alpha는 이미 있어요.');
                return;
              }
              createRack(rack);
            },
            child: const Text('랙 만들기'),
          ),
          TRButton(
            appearance: TRAppearance.outline,
            onPressed: () {
              formKey.currentState!.reset();
              clearServerError();
            },
            child: const Text('폼 초기화'),
          ),
        ],
      ),
    ],
  ),
)`,
      },
    },
    {
      id: 'form-actions',
      title: {
        en: 'Live snapshot and granular validation',
        ja: 'ライブスナップショットと詳細な検証',
        ko: '실시간 스냅샷과 세부 검증',
      },
      description: {
        en: 'Type to watch `onChanged` report the snapshot. The disabled region field stays out of `TRFormValues`, and `validateGranularly()` validates without synthesizing a submit.',
        ja: '入力すると `onChanged` がスナップショットを報告します。無効なリージョンフィールドは `TRFormValues` に含まれず、`validateGranularly()` は送信を発生させずに検証します。',
        ko: '입력하면 `onChanged`가 스냅샷을 알려줘요. 비활성 리전 필드는 `TRFormValues`에서 빠지고, `validateGranularly()`는 제출을 만들지 않고 검증해요.',
      },
      dart: {
        en: String.raw`TRForm(
  key: formKey,
  onChanged: (values) => showSnapshot(values.toMap()),
  child: Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    mainAxisSize: MainAxisSize.min,
    spacing: TRSpacing.medium,
    children: [
      TRTextField(
        name: 'rack',
        label: 'Rack name',
        validator: (value) =>
            (value ?? '').trim().isEmpty ? 'Enter a rack name.' : null,
      ),
      const TRTextField(
        name: 'region',
        label: 'Region',
        initialValue: 'ap-northeast-2',
        enabled: false,
      ),
      TRButton(
        onPressed: () =>
            showValid(formKey.currentState!.validateGranularly()),
        child: const Text('Validate all'),
      ),
    ],
  ),
)`,
        ja: String.raw`TRForm(
  key: formKey,
  onChanged: (values) => showSnapshot(values.toMap()),
  child: Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    mainAxisSize: MainAxisSize.min,
    spacing: TRSpacing.medium,
    children: [
      TRTextField(
        name: 'rack',
        label: 'ラック名',
        validator: (value) =>
            (value ?? '').trim().isEmpty ? 'ラック名を入力してください。' : null,
      ),
      const TRTextField(
        name: 'region',
        label: 'リージョン',
        initialValue: 'ap-northeast-2',
        enabled: false,
      ),
      TRButton(
        onPressed: () =>
            showValid(formKey.currentState!.validateGranularly()),
        child: const Text('すべて検証'),
      ),
    ],
  ),
)`,
        ko: String.raw`TRForm(
  key: formKey,
  onChanged: (values) => showSnapshot(values.toMap()),
  child: Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    mainAxisSize: MainAxisSize.min,
    spacing: TRSpacing.medium,
    children: [
      TRTextField(
        name: 'rack',
        label: '랙 이름',
        validator: (value) =>
            (value ?? '').trim().isEmpty ? '랙 이름을 입력하세요.' : null,
      ),
      const TRTextField(
        name: 'region',
        label: '리전',
        initialValue: 'ap-northeast-2',
        enabled: false,
      ),
      TRButton(
        onPressed: () =>
            showValid(formKey.currentState!.validateGranularly()),
        child: const Text('모두 검증'),
      ),
    ],
  ),
)`,
      },
    },
  ],
  textarea: [
    {
      id: 'textarea-basic',
      title: {
        en: 'Operational notes',
        ja: '運用メモ',
        ko: '운영 메모',
      },
      description: {
        en: 'Wrap the textarea in TRField so the note carries a visible label, and keep the placeholder for the expected content rather than the label itself.',
        ja: 'TRField で包んでメモに見えるラベルを付け、placeholder はラベルではなく想定される内容の案内に使います。',
        ko: 'TRField로 감싸 메모에 보이는 레이블을 붙이고, placeholder는 레이블 대신 어떤 내용을 적을지 안내하는 데 쓰세요.',
      },
      dart: textareaSources(textareaBasicSourceEn),
    },
    {
      id: 'textarea-states',
      title: {
        en: 'Editable, read-only, and disabled',
        ja: '編集可能、読み取り専用、無効',
        ko: '편집 가능, 읽기 전용, 비활성',
      },
      description: {
        en: 'Use readOnly when the note must stay readable and selectable, and enabled: false when it is unavailable. Pass the same state to TRField so the label matches the control.',
        ja: 'メモを読める・選択できる状態に保つ場合は readOnly を、利用できない場合は enabled: false を使います。ラベルとコントロールを揃えるため、同じ状態を TRField にも渡します。',
        ko: '메모를 읽고 선택할 수 있게 남겨야 하면 readOnly를, 아예 쓸 수 없다면 enabled: false를 사용하세요. 레이블과 컨트롤을 맞추려면 같은 상태를 TRField에도 넘기세요.',
      },
      dart: textareaSources(textareaStatesSourceEn),
    },
    {
      id: 'textarea-sizes',
      title: {
        en: 'Small, medium, and large',
        ja: 'スモール、ミディアム、ラージ',
        ko: '작게, 보통, 크게',
      },
      description: {
        en: 'uiSize changes the typography and inline padding, and the minimum height follows from the matching control height. Pick sm for dense screens and lg when the reader edits longer text.',
        ja: 'uiSize はタイポグラフィと左右の余白を変え、最小の高さは対応するコントロール高さから決まります。密度の高い画面では sm を、長い文章を編集する場合は lg を選びます。',
        ko: 'uiSize는 타이포그래피와 좌우 패딩을 바꾸고, 최소 높이는 해당 컨트롤 높이에서 정해져요. 밀도가 높은 화면에는 sm을, 긴 글을 편집할 때는 lg를 고르세요.',
      },
      dart: textareaSources(textareaSizesSourceEn),
    },
    {
      id: 'textarea-form',
      title: {
        en: 'Form values and manual reset',
        ja: 'フォーム値と手動リセット',
        ko: '폼 값과 수동 초기화',
      },
      description: {
        en: 'A named textarea appears in TRFormState.values. Because it is not a FormField, reset() leaves the text in place, so restore the original note through the controller you own.',
        ja: 'name を付けた textarea は TRFormState.values に現れます。FormField ではないため reset() ではテキストが残るので、元のメモは自分で保持する controller から戻します。',
        ko: 'name을 지정한 textarea는 TRFormState.values에 나타나요. FormField가 아니라서 reset()으로는 텍스트가 그대로 남으니, 원래 메모는 직접 소유한 controller로 되돌리세요.',
      },
      dart: textareaSources(textareaFormSourceEn),
    },
    {
      id: 'textarea-validation',
      title: {
        en: 'Required-style validation and recovery',
        ja: '必須項目の検証と復帰',
        ko: '필수 입력 검증과 복구',
      },
      description: {
        en: 'TRTextarea has no required or validator property. Check the text on submit, report the problem through TRField(errorText:), and move focus back with a focusNode so the reader can fix it right away.',
        ja: 'TRTextarea には required や validator のプロパティがありません。送信時にテキストを確認し、問題は TRField(errorText:) で伝え、focusNode でフォーカスを戻してすぐ修正できるようにします。',
        ko: 'TRTextarea에는 required나 validator 속성이 없어요. 제출할 때 텍스트를 확인하고 문제는 TRField(errorText:)로 알리며, focusNode로 포커스를 되돌려 바로 고칠 수 있게 하세요.',
      },
      dart: textareaSources(textareaValidationSourceEn),
    },
  ],
  menu: [
    {
      id: 'menu-settings',
      title: {
        en: 'Persistent settings',
        ja: '連続して変更できる設定',
        ko: '연속 설정',
      },
      description: {
        en: 'Checkbox and radio items stay open by default so several settings can be changed without reopening the menu.',
        ja: 'チェックボックスとラジオ項目は既定で開いたままになり、メニューを開き直さず複数の設定を変更できます。',
        ko: '체크박스와 라디오 항목은 기본적으로 메뉴를 닫지 않아 여러 설정을 연속으로 바꿀 수 있어요.',
      },
      dart: String.raw`TRMenu(
  trigger: const Text('View settings'),
  menuChildren: [
    const TRMenuGroupLabel(child: Text('Layout')),
    TRMenuCheckboxItem(
      value: showGrid,
      onChanged: setShowGrid,
      child: const Text('Show grid'),
    ),
    TRMenuRadioItem<String>(
      value: 'compact',
      groupValue: density,
      onChanged: setDensity,
      child: const Text('Compact'),
    ),
  ],
)`,
    },
    {
      id: 'menu-submenu',
      title: { en: 'Cascading submenu', ja: 'カスケードサブメニュー', ko: '중첩 메뉴' },
      description: {
        en: 'Submenus retain Material arrow-key navigation, Escape handling, focus restoration, and RTL direction.',
        ja: 'サブメニューでも Material の方向キー操作、Escape、フォーカス復元、RTL の向きが保たれます。',
        ko: '중첩 메뉴에서도 Material 방향키 탐색, Escape, 포커스 복원, RTL 방향을 유지해요.',
      },
      dart: String.raw`TRMenu(
  trigger: const Text('Actions'),
  menuChildren: [
    TRMenuItem(onPressed: duplicate, child: const Text('Duplicate')),
    TRMenuSubmenu(
      menuChildren: [
        TRMenuItem(onPressed: archive, child: const Text('Archive')),
        TRMenuItem(onPressed: delete, child: const Text('Delete')),
      ],
      child: const Text('More'),
    ),
  ],
)`,
    },
  ],
  select: [
    {
      id: 'select-controlled',
      title: { en: 'Controlled value', ja: 'Controlled 値', ko: 'Controlled 값' },
      description: {
        en: 'Use the named controlled constructor when the parent owns the value. A null value explicitly clears the selection.',
        ja: '親が値を管理する場合は named controlled constructor を使います。null は選択解除を明示します。',
        ko: '부모가 값을 소유하면 named controlled constructor를 사용하세요. null 값은 선택 해제를 명확히 나타내요.',
      },
      dart: String.raw`TRSelect<String>.controlled(
  value: channel,
  label: 'Release channel',
  items: const [
    TRSelectItem(value: 'stable', label: 'Stable'),
    TRSelectItem(value: 'beta', label: 'Beta'),
  ],
  onValueChange: setChannel,
)`,
    },
    {
      id: 'select-form',
      title: { en: 'Form validation', ja: 'フォーム検証', ko: '폼 검증' },
      description: {
        en: 'TRSelectFormField participates in validation, save, reset, autovalidation, and state restoration without replacing Material keyboard behavior.',
        ja: 'TRSelectFormField は Material のキーボード動作を保ったまま、検証、保存、リセット、自動検証、状態復元に参加します。',
        ko: 'TRSelectFormField는 Material 키보드 동작을 유지하면서 검증, 저장, 초기화, 자동 검증, 상태 복원에 참여해요.',
      },
      dart: String.raw`TRSelectFormField<String>(
  label: 'Environment',
  items: const [
    TRSelectItem(value: 'production', label: 'Production'),
    TRSelectItem(value: 'staging', label: 'Staging'),
  ],
  validator: (value) => value == null ? 'Choose an environment' : null,
  onSaved: saveEnvironment,
)`,
    },
  ],
  dialog: [
    {
      id: 'dialog-result',
      title: { en: 'Typed result', ja: '型付きの結果', ko: '타입이 있는 결과' },
      description: {
        en: 'showTRDialog returns the value passed to Navigator.pop and preserves barrier semantics, system back, focus containment, and trigger focus restoration.',
        ja: 'showTRDialog は Navigator.pop に渡した値を返し、バリアのセマンティクス、システムの戻る操作、フォーカスの閉じ込め、トリガーへのフォーカス復元を保ちます。',
        ko: 'showTRDialog는 Navigator.pop에 전달한 값을 반환하며 barrier semantics, 시스템 뒤로 가기, 포커스 가두기, 트리거 포커스 복원을 유지해요.',
      },
      dart: String.raw`final confirmed = await showTRDialog<bool>(
  context: context,
  builder: (dialogContext) => TRDialog(
    title: const Text('Deploy rack?'),
    description: const Text('The stable channel will be updated.'),
    actions: TRButton(
      onPressed: () => Navigator.pop(dialogContext, true),
      child: const Text('Deploy'),
    ),
  ),
);`,
    },
    {
      id: 'dialog-nested-layers',
      title: { en: 'Nested layers', ja: 'ネストしたレイヤー', ko: '중첩 레이어' },
      description: {
        en: 'Select and Menu can open inside a dialog. Start and end placements resolve through the current text direction.',
        ja: 'Dialog 内でも Select と Menu を開けます。start と end の配置は現在の文字方向に従います。',
        ko: 'Dialog 안에서도 Select와 Menu를 열 수 있어요. start와 end 배치는 현재 문자 방향에 맞춰 해석돼요.',
      },
      dart: String.raw`TRDialog(
  placement: TRDialogPlacement.end,
  title: const Text('Deployment settings'),
  content: Column(
    children: [
      TRSelect<String>(items: channels, defaultValue: 'stable'),
      TRMenu(trigger: const Text('Advanced'), menuChildren: advancedItems),
    ],
  ),
)`,
    },
  ],
  'alert-dialog': [
    {
      id: 'alert-dialog-result',
      title: {
        en: 'Destructive confirmation',
        ja: '破壊的な操作の確認',
        ko: '위험한 작업 확인',
      },
      description: {
        en: 'Place the safe cancel action first and the danger confirmation last. The route returns the typed value passed to Navigator.pop.',
        ja: '安全なキャンセルを先に、danger の確認操作を最後に配置します。ルートは Navigator.pop に渡した型付きの値を返します。',
        ko: '안전한 취소 액션을 먼저, danger 확인 액션을 마지막에 배치하세요. route는 Navigator.pop에 전달한 타입 있는 값을 반환해요.',
      },
      dart: alertDialogResultSources,
    },
    {
      id: 'alert-dialog-states',
      title: {
        en: 'Labels, disabled state, and focus',
        ja: 'ラベル、無効状態、フォーカス',
        ko: '레이블, 비활성 상태와 포커스',
      },
      description: {
        en: 'Long labels wrap at narrow widths, a disabled trigger cannot open the route, and Escape or Cancel returns focus to the trigger.',
        ja: '狭い幅では長いラベルが折り返され、無効なトリガーはルートを開きません。Escape またはキャンセルで閉じると、フォーカスはトリガーへ戻ります。',
        ko: '폭이 좁으면 긴 레이블이 줄바꿈되고 비활성 트리거는 route를 열지 않아요. Escape 또는 취소로 닫으면 포커스가 트리거로 돌아가요.',
      },
      dart: alertDialogStatesSources,
    },
  ],
  popover: [
    {
      id: 'popover-nested-menu',
      title: {
        en: 'Nested menu',
        ja: 'ネストしたメニュー',
        ko: '중첩 메뉴',
      },
      description: {
        en: 'Interactive content can open a Menu inside the popover while the shared layer system preserves collision handling and focus restoration.',
        ja: 'Popover 内の操作可能なコンテンツから Menu を開いても、共通レイヤーが衝突回避とフォーカス復元を保ちます。',
        ko: 'Popover의 인터랙티브 콘텐츠 안에서 Menu를 열어도 공용 레이어가 충돌 회피와 포커스 복원을 유지해요.',
      },
      dart: String.raw`TRPopover(
  title: const Text('Rack alpha'),
  description: const Text('4 services are healthy.'),
  trigger: const Text('View rack'),
  content: TRMenu(
    trigger: const Text('Actions'),
    menuChildren: [
      TRMenuItem(onPressed: openLogs, child: const Text('Open logs')),
      TRMenuItem(onPressed: restart, child: const Text('Restart')),
    ],
  ),
)`,
    },
  ],
  autocomplete: [
    {
      id: 'autocomplete-modes',
      title: { en: 'Completion modes', ja: '補完モード', ko: '완성 모드' },
      description: {
        en: 'Choose list suggestions, inline completion, both behaviors, or manual mode. Manual mode waits for text before showing an empty-query list.',
        ja: '候補リスト、インライン補完、両方の動作、manual モードから選べます。manual モードでは、文字を入力するまで空の検索結果を表示しません。',
        ko: '제안 목록, 인라인 완성, 두 동작 함께 사용, manual 모드 중에서 선택하세요. manual 모드는 텍스트를 입력하기 전까지 빈 검색어 목록을 표시하지 않아요.',
      },
      dart: String.raw`Column(
  children: [
    for (final mode in TRAutocompleteCompletionMode.values)
      TRAutocomplete<String>(
        label: mode.name,
        completionMode: mode,
        items: const [
          TRAutocompleteItem(value: 'seoul', label: 'Seoul'),
          TRAutocompleteItem(value: 'tokyo', label: 'Tokyo'),
        ],
      ),
  ],
)`,
    },
    {
      id: 'autocomplete-async',
      title: { en: 'Asynchronous suggestions', ja: '非同期の候補', ko: '비동기 제안' },
      description: {
        en: 'Return a Future from optionsBuilder to load remote suggestions. If requests finish out of order, only the newest query updates the popup.',
        ja: 'optionsBuilder から Future を返してリモート候補を読み込みます。リクエストの完了順が前後しても、最新の検索文字列だけがポップアップを更新します。',
        ko: 'optionsBuilder에서 Future를 반환해 원격 제안을 불러오세요. 요청 완료 순서가 바뀌어도 최신 검색어만 팝업을 업데이트해요.',
      },
      dart: String.raw`TRAutocomplete<String>(
  label: 'Region',
  optionsBuilder: (query) async {
    await Future<void>.delayed(const Duration(milliseconds: 250));
    const regions = [
      TRAutocompleteItem(value: 'seoul', label: 'Seoul'),
      TRAutocompleteItem(value: 'tokyo', label: 'Tokyo'),
      TRAutocompleteItem(value: 'virginia', label: 'Virginia'),
    ];
    final normalized = query.toLowerCase();
    return regions.where(
      (item) => item.label.toLowerCase().contains(normalized),
    );
  },
)`,
    },
    {
      id: 'autocomplete-states',
      title: { en: 'Sizes and states', ja: 'サイズと状態', ko: '크기와 상태' },
      description: {
        en: 'Match nearby controls with uiSize and communicate unavailable, read-only, or invalid input through the corresponding field state.',
        ja: 'uiSize で周囲のコントロールと高さを揃え、無効、読み取り専用、エラーの各入力状態を適切に示します。',
        ko: 'uiSize로 주변 컨트롤과 높이를 맞추고 disabled, read-only, 오류 입력 상태를 알맞게 표시하세요.',
      },
      dart: String.raw`Column(
  children: [
    TRAutocomplete<String>(
      uiSize: TRUiSize.sm,
      label: 'Compact',
      items: const [TRAutocompleteItem(value: 'seoul', label: 'Seoul')],
    ),
    TRAutocomplete<String>(
      enabled: false,
      label: 'Unavailable',
      items: const [TRAutocompleteItem(value: 'seoul', label: 'Seoul')],
    ),
    TRAutocomplete<String>(
      readOnly: true,
      errorText: 'Choose a supported region',
      label: 'Read only',
      items: const [TRAutocompleteItem(value: 'seoul', label: 'Seoul')],
    ),
  ],
)`,
    },
    {
      id: 'autocomplete-controller',
      title: {
        en: 'Controller lifecycle',
        ja: 'Controller のライフサイクル',
        ko: 'Controller 생명 주기',
      },
      description: {
        en: 'Own a TRAutocompleteController when another control must read the query, clear the field, or inspect the typed selected value. Dispose it with the owning State.',
        ja: '別のコントロールから検索文字列の読み取り、フィールドのクリア、型付き選択値の確認を行う場合は TRAutocompleteController を所有します。所有する State とともに破棄してください。',
        ko: '다른 컨트롤에서 검색어를 읽거나 필드를 지우고 타입이 있는 선택 값을 확인해야 한다면 TRAutocompleteController를 소유하세요. 소유한 State와 함께 dispose하세요.',
      },
      dart: String.raw`class RegionAutocomplete extends StatefulWidget {
  const RegionAutocomplete({super.key});

  @override
  State<RegionAutocomplete> createState() => _RegionAutocompleteState();
}

class _RegionAutocompleteState extends State<RegionAutocomplete> {
  final controller = TRAutocompleteController<String>();

  @override
  void dispose() {
    controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) => Column(
    children: [
      TRAutocomplete<String>(
        controller: controller,
        items: const [
          TRAutocompleteItem(value: 'seoul', label: 'Seoul'),
          TRAutocompleteItem(value: 'tokyo', label: 'Tokyo'),
        ],
      ),
      TRButton(onPressed: controller.clear, child: const Text('Clear')),
    ],
  );
}`,
    },
    {
      id: 'autocomplete-form',
      title: { en: 'Form validation', ja: 'フォーム検証', ko: '폼 검증' },
      description: {
        en: 'TRAutocompleteFormField reports the typed selected value to Form validation and save callbacks while the query remains editable.',
        ja: 'TRAutocompleteFormField は検索文字列を編集可能なまま保ち、型付きの選択値を Form の検証と保存コールバックへ渡します。',
        ko: 'TRAutocompleteFormField는 검색어를 계속 편집할 수 있게 유지하면서 타입이 있는 선택 값을 Form 검증과 저장 콜백에 전달해요.',
      },
      dart: String.raw`Form(
  child: TRAutocompleteFormField<String>(
    label: 'Region',
    items: const [
      TRAutocompleteItem(value: 'seoul', label: 'Seoul'),
      TRAutocompleteItem(value: 'tokyo', label: 'Tokyo'),
    ],
    validator: (value) => value == null ? 'Choose a region' : null,
    onSaved: (value) {},
  ),
)`,
    },
    {
      id: 'autocomplete-keyboard',
      title: {
        en: 'Pointer and keyboard',
        ja: 'ポインターとキーボード',
        ko: '포인터와 키보드',
      },
      description: {
        en: 'Hover suggestions without moving input focus. Use Arrow keys to highlight, Enter to select, Escape to close, and Tab to leave without selecting.',
        ja: '入力フォーカスを移さずに候補へポインターを重ねられます。矢印キーでハイライトし、Enter で選択、Escape で閉じ、Tab では選択せずに移動します。',
        ko: '입력 포커스를 옮기지 않고 제안에 마우스를 올릴 수 있어요. 방향키로 강조하고 Enter로 선택하며, Escape로 닫고 Tab으로 선택 없이 이동하세요.',
      },
      dart: String.raw`TRAutocomplete<String>(
  label: 'Region',
  helperText: 'Arrow keys move, Enter selects, Escape closes',
  items: const [
    TRAutocompleteItem(value: 'seoul', label: 'Seoul'),
    TRAutocompleteItem(value: 'tokyo', label: 'Tokyo'),
    TRAutocompleteItem(value: 'virginia', label: 'Virginia'),
  ],
)`,
    },
  ],
  combobox: [
    {
      id: 'combobox-basic',
      title: {
        en: 'Filter and commit one rack',
        ja: '絞り込んでラックを 1 つ確定する',
        ko: '좁혀서 랙 하나 확정하기',
      },
      description: {
        en: 'Typing narrows the popup while the committed value stays separate from the query. Selecting a rack writes its label back into the field.',
        ja: '入力でポップアップを絞り込みつつ、確定した値は検索語とは別に保たれます。ラックを選ぶと、そのラベルがフィールドへ書き戻されます。',
        ko: '입력하면 팝업이 좁혀지고, 확정된 값은 검색어와 별개로 유지돼요. 랙을 고르면 그 레이블이 필드에 다시 쓰여요.',
      },
      dart: comboboxSources(comboboxBasicSourceEn),
    },
    {
      id: 'combobox-sizes',
      title: { en: 'Sizes', ja: 'サイズ', ko: '크기' },
      description: {
        en: 'Pass uiSize to align the combobox with neighboring TRTextField, TRSelect, or TRButton heights.',
        ja: 'uiSize を渡して、隣接する TRTextField、TRSelect、TRButton と高さを揃えます。',
        ko: 'uiSize를 넘겨 옆에 놓인 TRTextField, TRSelect, TRButton과 높이를 맞추세요.',
      },
      dart: comboboxSources(comboboxSizesSourceEn),
    },
    {
      id: 'combobox-option-states',
      title: {
        en: 'Selected and disabled options',
        ja: '選択済みと無効な候補',
        ko: '선택된 옵션과 비활성 옵션',
      },
      description: {
        en: 'An option with enabled set to false stays in the popup so the reason it is unavailable remains visible. It renders muted and both Enter and arrow navigation skip it.',
        ja: 'enabled を false にした候補はポップアップに残るため、利用できない理由が見えたままになります。淡く描画され、Enter と矢印移動の双方でスキップされます。',
        ko: 'enabled를 false로 둔 옵션은 팝업에 남아서 왜 쓸 수 없는지가 계속 보여요. 흐리게 그려지고 Enter와 화살표 이동 모두에서 건너뛰어요.',
      },
      dart: comboboxSources(comboboxOptionStatesSourceEn),
    },
    {
      id: 'combobox-filter-modes',
      title: {
        en: 'Filter semantics',
        ja: 'フィルタの意味',
        ko: '필터 의미',
      },
      description: {
        en: 'Compare contains, startsWith, and no built-in narrowing. Use none when an asynchronous optionsBuilder already returns the matches it wants shown.',
        ja: 'contains、startsWith、組み込みの絞り込みなしを比べます。非同期の optionsBuilder が表示したい候補を既に返している場合は none を使ってください。',
        ko: 'contains, startsWith, 기본 좁히기 없음을 비교해요. 비동기 `optionsBuilder`가 이미 보여줄 결과를 돌려준다면 none을 쓰세요.',
      },
      dart: comboboxSources(comboboxFilterModesSourceEn),
    },
    {
      id: 'combobox-multiple-anatomy',
      title: {
        en: 'Multiple chips and grid popup',
        ja: '複数選択のチップとグリッドのポップアップ',
        ko: '다중 선택 칩과 격자 팝업',
      },
      description: {
        en: 'TRMultiCombobox renders committed values as removable chips and clears the query after each pick. The grid layout fits short labels into two columns.',
        ja: 'TRMultiCombobox は確定した値を削除可能なチップとして表示し、選択のたびに検索語を消去します。グリッドレイアウトは短いラベルを 2 列に収めます。',
        ko: 'TRMultiCombobox는 확정된 값을 삭제 가능한 칩으로 그리고, 하나 고를 때마다 검색어를 비워요. 격자 레이아웃은 짧은 레이블을 2열에 담아요.',
      },
      dart: comboboxSources(comboboxMultipleAnatomySourceEn),
    },
    {
      id: 'combobox-validation',
      title: {
        en: 'Required option and recovery',
        ja: '必須の選択とエラー解消',
        ko: '필수 선택과 복구',
      },
      description: {
        en: 'TRComboboxFormField reports its error through errorText and clears it as soon as a value is committed, so the reader can recover without submitting again.',
        ja: 'TRComboboxFormField はエラーを errorText で伝え、値が確定した時点で解消します。そのため、再送信しなくても状態を回復できます。',
        ko: 'TRComboboxFormField는 오류를 errorText로 알리고 값이 확정되면 바로 지워요. 그래서 다시 제출하지 않아도 상태를 되돌릴 수 있어요.',
      },
      dart: comboboxSources(comboboxValidationSourceEn),
    },
    {
      id: 'combobox-controlled-filter-hooks',
      title: {
        en: 'Controlled state and a custom filter',
        ja: '制御された状態とカスタムフィルタ',
        ko: '제어 상태와 사용자 정의 필터',
      },
      description: {
        en: 'The controlled constructor hands the value back to the caller while the controller keeps the query. A filter callback replaces filterMode when the built-in rules are not enough.',
        ja: '制御コンストラクタは値を呼び出し側に返し、controller が検索語を保持します。組み込みの規則で足りない場合は、filter コールバックが filterMode を置き換えます。',
        ko: '제어 생성자는 값을 호출하는 쪽에 넘기고 controller가 검색어를 들고 있어요. 기본 규칙으로 부족하면 filter 콜백이 filterMode를 대신해요.',
      },
      dart: comboboxSources(comboboxControlledFilterHooksSourceEn),
    },
    {
      id: 'combobox-overlay',
      title: {
        en: 'Popup width and layering',
        ja: 'ポップアップの幅とレイヤー',
        ko: '팝업 너비와 레이어',
      },
      description: {
        en: 'Flutter has no portal or positioner parts. The popup opens on the combobox layer and takes its width from the field, or from the small overlay width token when width is left unset.',
        ja: 'Flutter には portal や positioner に相当するパーツはありません。ポップアップは combobox レイヤーで開き、幅はフィールドから、width が未指定の場合は small のオーバーレイ幅トークンから取得します。',
        ko: 'Flutter에는 portal이나 positioner 같은 파트가 없어요. 팝업은 combobox 레이어에서 열리고 너비는 필드에서, `width`를 두지 않으면 small 오버레이 너비 토큰에서 가져와요.',
      },
      dart: comboboxSources(comboboxOverlaySourceEn),
    },
    {
      id: 'combobox-keyboard',
      title: {
        en: 'Keyboard selection',
        ja: 'キーボードでの選択',
        ko: '키보드 선택',
      },
      description: {
        en: 'With autoHighlight off, Enter commits nothing until an arrow key highlights a row. The clear button returns focus to the field so the popup stays open.',
        ja: 'autoHighlight を無効にすると、矢印キーで行をハイライトするまで Enter では何も確定しません。クリアボタンはフィールドにフォーカスを戻すため、ポップアップは開いたままです。',
        ko: 'autoHighlight를 끄면 화살표 키로 행을 강조하기 전까지 Enter가 아무것도 확정하지 않아요. 지우기 버튼은 필드로 포커스를 돌려주므로 팝업이 열린 채로 남아요.',
      },
      dart: comboboxSources(comboboxKeyboardSourceEn),
    },
    {
      id: 'combobox-form',
      title: {
        en: 'Single and multiple fields',
        ja: '単一選択と複数選択のフィールド',
        ko: '단일·다중 선택 필드',
      },
      description: {
        en: 'The FormField variants keep query text separate from typed selections and participate in validation, save, and reset.',
        ja: 'FormField 版は検索文字列と型付きの選択値を分けたまま、検証、保存、リセットに参加します。',
        ko: 'FormField 변형은 검색어와 타입이 있는 선택 값을 분리한 채 검증, 저장, 초기화에 참여해요.',
      },
      dart: comboboxSources(comboboxFormSourceEn),
    },
  ],
  'app-shell': [
    {
      id: 'app-shell-navigation',
      title: {
        en: 'Responsive navigation patterns',
        ja: 'レスポンシブナビゲーションパターン',
        ko: '반응형 탐색 패턴',
      },
      description: {
        en: 'Use a persistent 64px rail below the selected breakpoint and an expanded 288px sidebar above it.',
        ja: '選択したブレークポイント未満では 64px のレール、それ以上では 288px の展開サイドバーを使います。',
        ko: '선택한 breakpoint 아래에서는 64px rail을, 그 위에서는 288px 확장 sidebar를 사용해요.',
      },
      dart: String.raw`TRAppShell(
  breakpoint: TRAppShellBreakpoint.lg,
  mobileSidebar: TRAppShellMobileSidebar.rail,
  header: TRAppShellHeader(children: [brand, actions]),
  sidebar: TRAppShellSidebar(child: navigation),
  main: const TRAppShellMain(child: DeploymentOverview()),
)`,
    },
    {
      id: 'app-shell-controls',
      title: {
        en: 'Control appearances',
        ja: 'コントロールの外観',
        ko: '컨트롤 appearance',
      },
      description: {
        en: 'Trigger, Close, and SidebarToggle use 32px small controls and accept the shared solid, outline, and ghost appearances.',
        ja: 'Trigger、Close、SidebarToggle は 32px の small コントロールで、solid、outline、ghost の外観を共有します。',
        ko: 'Trigger, Close, SidebarToggle은 32px small 컨트롤이며 solid, outline, ghost appearance를 공유해요.',
      },
      dart: String.raw`TRAppShellSidebarToggle(
  appearance: TRAppearance.ghost,
  icon: const Icon(Icons.view_sidebar_outlined),
  label: 'Toggle sidebar',
)`,
    },
    {
      id: 'app-shell-docs',
      title: {
        en: 'Docs chrome and scroll restoration',
        ja: 'ドキュメントクロームとスクロール復元',
        ko: '문서 chrome과 스크롤 복원',
      },
      description: {
        en: 'Docs chrome adds a 48px header and route progress while Main owns a named container scroller.',
        ja: 'docs クロームは 48px のヘッダーとルート進行状況を加え、Main が名前付きコンテナスクロールを所有します。',
        ko: 'docs chrome은 48px header와 route progress를 추가하고 Main이 이름 있는 container scroll을 소유해요.',
      },
      dart: String.raw`TRAppShell(
  chrome: TRAppShellChrome.docs,
  currentPath: '/guide',
  pendingPath: '/reference',
  pageScroll: TRAppShellPageScroll.container,
  header: TRAppShellHeader(children: [brand, actions]),
  sidebar: TRAppShellSidebar(child: docsNavigation),
  main: TRAppShellMain(scroll: true, child: article),
)`,
    },
  ],
  pagination: [
    {
      id: 'pagination-controlled',
      title: {
        en: 'Control the current page',
        ko: '현재 페이지 제어',
        ja: '現在のページを制御',
      },
      description: {
        en: 'Keep page state in the parent and tune the derived range without rebuilding pagination items.',
        ko: '페이지 상태는 부모가 관리하고 항목을 직접 만들지 않고 계산 범위를 조절해요.',
        ja: 'ページ状態を親で管理し、項目を組み直さずに算出範囲を調整します。',
      },
      dart: String.raw`TRPagination(
  currentPage: page,
  totalPages: 24,
  boundaryCount: 1,
  siblingCount: 2,
  onPageChanged: (next) => setState(() => page = next),
)`,
    },
  ],
  table: [
    {
      id: 'table-dense-status',
      title: {
        en: 'Compact status data',
        ko: '간결한 상태 데이터',
        ja: 'コンパクトな状態データ',
      },
      description: {
        en: 'Use compact density and striping for scan-heavy operational data.',
        ko: '빠르게 훑어보는 운영 데이터에는 compact 밀도와 줄무늬를 사용해요.',
        ja: '一覧性が必要な運用データには compact 密度とストライプを使います。',
      },
      dart: String.raw`TRTable(
  density: TRTableDensity.compact,
  striped: true,
  columns: const [
    TRTableColumn(label: Text('Rack')),
    TRTableColumn(label: Text('Status')),
  ],
  rows: const [
    TRTableRow(cells: [Text('Rack A'), Text('Healthy')]),
    TRTableRow(cells: [Text('Rack B'), Text('Degraded')]),
  ],
)`,
    },
  ],
  'window-frame': [
    {
      id: 'window-frame-caption-actions',
      title: {
        en: 'Application window chrome',
        ko: '애플리케이션 창 크롬',
        ja: 'アプリケーションウィンドウクローム',
      },
      description: {
        en: 'Place application menus and typed native caption actions around a draggable center region.',
        ko: '드래그 가능한 중앙 영역 양쪽에 앱 메뉴와 타입이 지정된 네이티브 캡션 동작을 배치해요.',
        ja: 'ドラッグ可能な中央領域の両側にアプリメニューと型付きのネイティブキャプション操作を配置します。',
      },
      dart: String.raw`TRWindowFrameTitleBar(
  leading: const Text('File'),
  actions: TRWindowCaptionButton(
    action: TRWindowCaptionAction.close,
    label: 'Close window',
    onPressed: closeWindow,
  ),
  child: const Text('Tinyrack'),
)`,
    },
    {
      id: 'window-frame-browser',
      title: { en: 'Browser chrome', ko: '브라우저 프레임', ja: 'ブラウザクローム' },
      description: {
        en: 'Use the browser variant and address bar for web-content previews.',
        ko: '웹 콘텐츠 미리보기에는 browser 형태와 주소 표시줄을 사용해요.',
        ja: 'Web コンテンツのプレビューには browser バリアントとアドレスバーを使います。',
      },
      dart: String.raw`const TRWindowFrame(
  variant: TRWindowFrameVariant.browser,
  address: Text('https://tinyrack.net'),
  body: Text('Ready'),
)`,
    },
  ],
  toast: [
    {
      id: 'toast-track',
      title: {
        en: 'Track asynchronous work',
        ja: '非同期処理を追跡',
        ko: '비동기 작업 추적',
      },
      description: {
        en: 'A stable toast handle updates the loading notification in place when its Future succeeds or fails.',
        ja: '安定した toast handle が、Future の成功または失敗時に loading 通知をその場で更新します。',
        ko: '안정적인 toast handle이 Future 성공 또는 실패 시 loading 알림을 제자리에서 업데이트해요.',
      },
      dart: String.raw`toastController.track(
  deployRack(),
  loading: const TRToastData(title: Text('Deploying')),
  success: (_) => const TRToastData(
    title: Text('Deployment complete'),
    variant: TRStatusVariant.success,
  ),
  error: (_, _) => const TRToastData(
    title: Text('Deployment failed'),
    variant: TRStatusVariant.danger,
  ),
)`,
    },
  ],
};
