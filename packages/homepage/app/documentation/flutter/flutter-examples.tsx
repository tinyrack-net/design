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
      dart: String.raw`Form(
  child: Column(
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
)`,
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
