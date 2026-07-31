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
  dart: string;
  description: Record<DemoLocale, string>;
  id: string;
  title: Record<DemoLocale, string>;
};

export const flutterExamples: Partial<
  Record<FlutterPreviewComponent, readonly FlutterExampleEntry[]>
> = {
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
  'checkbox-group': [
    {
      id: 'checkbox-group-options',
      title: { en: 'Option list', ja: 'オプション一覧', ko: '옵션 목록' },
      description: {
        en: 'Pair each checkbox with a label to build a multi-select list; the group tracks the checked values.',
        ja: '各チェックボックスにラベルを添えて複数選択リストを作ります。グループが選択値を管理します。',
        ko: '체크박스마다 라벨을 붙여 다중 선택 목록을 만들어요. 그룹이 선택된 값을 관리해요.',
      },
      dart: String.raw`TRCheckboxGroup(
  value: const ['telemetry'],
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
      title: { en: 'Disabled group', ja: '無効なグループ', ko: '비활성 그룹' },
      description: {
        en: 'Setting disabled on the group blocks every child checkbox at once.',
        ja: 'グループに disabled を設定すると、すべての子チェックボックスが一度に無効になります。',
        ko: '그룹에 disabled를 설정하면 모든 하위 체크박스가 한 번에 비활성화돼요.',
      },
      dart: String.raw`TRCheckboxGroup(
  disabled: true,
  value: const ['telemetry'],
  children: [
    for (final (value, label) in const [
      ('telemetry', 'Share telemetry'),
      ('newsletter', 'Release notes'),
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
  ],
};
