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
        en: 'Responsive application frame',
        ja: 'レスポンシブなアプリケーションフレーム',
        ko: '반응형 애플리케이션 프레임',
      },
      description: {
        en: 'Combine Toolbar, TreeNav, FileTree, and Tooltip regions while AppShell switches between desktop sidebar and mobile drawer navigation.',
        ja: 'Toolbar、TreeNav、FileTree、Tooltip を組み合わせ、AppShell がデスクトップのサイドバーとモバイルのドロワーを切り替えます。',
        ko: 'Toolbar, TreeNav, FileTree, Tooltip을 조합하고 AppShell이 데스크톱 사이드바와 모바일 drawer 탐색을 전환해요.',
      },
      dart: String.raw`TRAppShell(
  header: TRToolbar(children: toolbarActions),
  sidebar: TRTreeNav<String>(items: destinations),
  mobileDrawer: TRFileTree(nodes: files),
  body: const DeploymentOverview(),
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
