import { TRCodeBlock } from '@tinyrack/ui/components/code-block';
import type { ReactNode } from 'react';
import { ComponentPlayground } from '../../playground/playground.js';
import { ComponentExampleTabs } from '../shared/component-example-tabs.js';
import type { DemoLocale } from '../shared/demo-locale.js';
import { flutterExamples } from './flutter-examples.js';
import { FlutterExample } from './flutter-preview.js';
import { flutterPlaygrounds } from './playgrounds.js';

type FlutterComponentId = keyof typeof flutterPlaygrounds;

const componentData: Record<
  FlutterComponentId,
  {
    api?: Record<DemoLocale, readonly ReactNode[]>;
    contract?: Record<DemoLocale, readonly ReactNode[]>;
    description: Record<DemoLocale, string>;
    title: string;
    usage: string;
  }
> = {
  accordion: {
    title: 'Accordion',
    description: {
      en: 'Stack disclosure items that expand one section or several at a time.',
      ko: '한 번에 하나 또는 여러 섹션을 펼치는 디스클로저 항목을 쌓아요.',
      ja: '一度に 1 つまたは複数のセクションを展開できる開閉項目を積み重ねます。',
    },
    usage:
      "TRAccordion(\n  items: const [\n    TRAccordionItem(\n      value: 'install',\n      trigger: Text('Install'),\n      content: Text('Run the installer.'),\n    ),\n  ],\n)",
  },
  'alert-dialog': {
    title: 'AlertDialog',
    description: {
      en: 'Ask for an explicit decision in a modal that ignores backdrop taps.',
      ko: '배경을 눌러도 닫히지 않는 모달에서 명시적인 결정을 요청해요.',
      ja: '背景をタップしても閉じないモーダルで、明示的な判断を求めます。',
    },
    usage:
      "showTRAlertDialog<bool>(\n  context: context,\n  builder: (context) => const TRAlertDialog(\n    title: Text('Delete rack?'),\n  ),\n)",
  },
  'app-shell': {
    title: 'AppShell',
    description: {
      en: 'Compose responsive header, sidebar, rail, and mobile navigation regions.',
      ko: '반응형 헤더, 사이드바, 레일, 모바일 탐색 영역을 조합해요.',
      ja: 'レスポンシブなヘッダー、サイドバー、レール、モバイルナビゲーションを構成します。',
    },
    usage: 'TRAppShell(\n  header: header,\n  sidebar: navigation,\n  body: page,\n)',
  },
  autocomplete: {
    title: 'Autocomplete',
    description: {
      en: 'Complete free text from typed static or asynchronous suggestions.',
      ko: '타입이 있는 정적 또는 비동기 제안으로 자유 텍스트 입력을 완성해요.',
      ja: '型付きの静的候補または非同期候補から自由入力を補完します。',
    },
    usage:
      "TRAutocomplete<String>(\n  items: const [\n    TRAutocompleteItem(value: 'seoul', label: 'Seoul'),\n  ],\n)",
  },
  combobox: {
    title: 'Combobox',
    description: {
      en: 'Search and select one or several typed options with query and selection state kept separate.',
      ko: '검색어와 선택 상태를 분리해 타입이 있는 옵션을 하나 또는 여러 개 선택해요.',
      ja: '検索語と選択状態を分け、型付きの候補を 1 つまたは複数選択します。',
    },
    usage:
      "TRCombobox<String>(\n  items: const [\n    TRComboboxItem(value: 'stable', label: 'Stable'),\n  ],\n)",
  },
  'context-menu': {
    title: 'ContextMenu',
    description: {
      en: 'Open menu commands from secondary click, long press, or the keyboard context-menu key.',
      ko: '우클릭, 길게 누르기, 키보드 컨텍스트 메뉴 키로 명령 메뉴를 열어요.',
      ja: '右クリック、長押し、キーボードのコンテキストメニューキーでコマンドを開きます。',
    },
    usage:
      "TRContextMenu(\n  menuChildren: [TRMenuItem(onPressed: open, child: const Text('Open'))],\n  child: card,\n)",
  },
  drawer: {
    title: 'Drawer',
    description: {
      en: 'Present a swipeable modal or scaffold sheet from any logical edge.',
      ko: '논리적 네 방향에서 스와이프할 수 있는 모달 또는 스캐폴드 시트를 표시해요.',
      ja: '論理方向の各辺から、スワイプ可能なモーダルまたはスキャフォールドシートを表示します。',
    },
    usage:
      "showTRDrawer<void>(\n  context: context,\n  builder: (_) => const TRDrawer(content: Text('Settings')),\n)",
  },
  'file-tree': {
    title: 'FileTree',
    description: {
      en: 'Browse expandable directories and selectable files with tree keyboard behavior.',
      ko: '트리 키보드 동작으로 폴더를 펼치고 파일을 선택해요.',
      ja: 'ツリーのキーボード操作でディレクトリを展開し、ファイルを選択します。',
    },
    usage:
      "const TRFileTree(\n  nodes: [TRFileTreeFile(name: 'main.dart', path: '/main.dart')],\n)",
  },
  form: {
    title: 'Form',
    description: {
      en: 'Validate Flutter form fields and collect enabled named Tinyrack values in one snapshot.',
      ko: 'Flutter 폼 필드를 검증하고 활성화된 Tinyrack 이름 값을 한 번에 모아요.',
      ja: 'Flutter のフォームフィールドを検証し、有効な Tinyrack の名前付き値をまとめて取得します。',
    },
    usage: "TRForm(\n  key: formKey,\n  child: const TRTextField(name: 'rack'),\n)",
  },
  menubar: {
    title: 'Menubar',
    description: {
      en: 'Coordinate horizontal application menus with arrow-key movement and cascading items.',
      ko: '방향키 이동과 중첩 항목을 지원하는 가로 애플리케이션 메뉴를 구성해요.',
      ja: '矢印キー移動と階層項目に対応した横並びのアプリケーションメニューを構成します。',
    },
    usage:
      "TRMenubar(\n  menus: [TRMenubarMenu(trigger: const Text('File'), menuChildren: items)],\n)",
  },
  'navigation-menu': {
    title: 'NavigationMenu',
    description: {
      en: 'Open rich navigation panels from a coordinated horizontal trigger list.',
      ko: '서로 연동되는 가로 트리거 목록에서 풍부한 탐색 패널을 열어요.',
      ja: '連動する横並びのトリガーから、情報量の多いナビゲーションパネルを開きます。',
    },
    usage:
      "TRNavigationMenu<String>(\n  items: const [\n    TRNavigationMenuItem(value: 'docs', trigger: Text('Docs'), content: Text('Guides')),\n  ],\n)",
  },
  'number-field': {
    title: 'NumberField',
    description: {
      en: 'Edit a nullable locale-formatted number with stepper, keyboard, and scrub controls.',
      ko: '단계 버튼, 키보드, 스크럽으로 지역 형식이 적용된 nullable 숫자를 편집해요.',
      ja: 'ステッパー、キーボード、スクラブ操作で、ロケール形式の nullable 数値を編集します。',
    },
    usage: 'const TRNumberField(\n  defaultValue: 4,\n  min: 0,\n  max: 20,\n)',
  },
  'otp-field': {
    title: 'OTPField',
    description: {
      en: 'Collect a verification code through one accessible input rendered as individual slots.',
      ko: '하나의 접근 가능한 입력을 개별 슬롯으로 표시해 인증 코드를 받아요.',
      ja: '1 つのアクセシブルな入力を個別スロットとして表示し、認証コードを受け取ります。',
    },
    usage: 'TROtpField(\n  length: 6,\n  onCompleted: verifyCode,\n)',
  },
  popover: {
    title: 'Popover',
    description: {
      en: 'Open an interactive collision-aware surface from a pointer or keyboard trigger.',
      ko: '포인터나 키보드 트리거에서 충돌을 피하는 인터랙티브 표면을 열어요.',
      ja: 'ポインターまたはキーボードのトリガーから、衝突回避するインタラクティブなサーフェスを開きます。',
    },
    usage:
      "const TRPopover(\n  trigger: Text('Details'),\n  content: Text('Rack alpha'),\n)",
  },
  'preview-card': {
    title: 'PreviewCard',
    description: {
      en: 'Reveal an interactive preview after a short hover or focus delay.',
      ko: '짧은 hover 또는 포커스 지연 뒤 인터랙티브 미리보기를 표시해요.',
      ja: '短いホバーまたはフォーカス遅延の後に、操作可能なプレビューを表示します。',
    },
    usage:
      "const TRPreviewCard(\n  trigger: Text('Rack alpha'),\n  content: Text('Healthy'),\n)",
  },
  'scroll-area': {
    title: 'ScrollArea',
    description: {
      en: 'Scroll bounded content with themed, keyboard-accessible Flutter scrollbars.',
      ko: '테마가 적용된 키보드 접근 가능 Flutter 스크롤바로 제한된 콘텐츠를 스크롤해요.',
      ja: 'テーマ付きでキーボード操作可能な Flutter スクロールバーを使い、領域内のコンテンツをスクロールします。',
    },
    usage: 'const TRScrollArea(\n  child: activityList,\n)',
  },
  slider: {
    title: 'Slider',
    description: {
      en: 'Choose scalar or range values on horizontal or vertical tracks.',
      ko: '가로 또는 세로 트랙에서 단일 값이나 범위를 선택해요.',
      ja: '横または縦のトラックで、単一値または範囲を選択します。',
    },
    usage: 'TRSlider.controlled(\n  value: traffic,\n  onValueChange: setTraffic,\n)',
  },
  toast: {
    title: 'Toast',
    description: {
      en: 'Queue live notifications that can be updated, swiped away, or tied to a Future.',
      ko: '업데이트하거나 스와이프로 닫고 Future에 연결할 수 있는 실시간 알림을 대기열로 표시해요.',
      ja: '更新、スワイプでの終了、Future との連携に対応したライブ通知をキュー表示します。',
    },
    usage:
      "toastController.show(\n  const TRToastData(title: Text('Changes saved')),\n)",
  },
  toolbar: {
    title: 'Toolbar',
    description: {
      en: 'Group compact commands, links, inputs, and separators with directional focus movement.',
      ko: '방향 포커스 이동을 지원하는 간결한 명령, 링크, 입력, 구분선을 묶어요.',
      ja: '方向フォーカス移動に対応した、コンパクトなコマンド、リンク、入力、区切りをまとめます。',
    },
    usage:
      "TRToolbar(\n  children: [TRToolbarButton(onPressed: save, child: const Text('Save'))],\n)",
  },
  tooltip: {
    title: 'Tooltip',
    description: {
      en: 'Describe compact controls on hover, focus, or long press with shared delay settings.',
      ko: '공유 지연 설정을 사용해 hover, 포커스, 길게 누르기에서 간결한 컨트롤을 설명해요.',
      ja: '共通の遅延設定を使い、ホバー、フォーカス、長押しでコンパクトな操作を説明します。',
    },
    usage:
      "const TRTooltip(\n  message: 'Refresh rack',\n  width: 200,\n  child: Icon(Icons.refresh),\n)",
  },
  'tree-nav': {
    title: 'TreeNav',
    description: {
      en: 'Navigate expandable groups and typed destinations with tree keyboard semantics.',
      ko: '트리 키보드 시맨틱으로 펼칠 수 있는 그룹과 타입이 있는 목적지를 탐색해요.',
      ja: 'ツリーのキーボードセマンティクスで、展開可能なグループと型付きの移動先を操作します。',
    },
    usage:
      "const TRTreeNav<String>(\n  items: [TRTreeNavLeaf(value: 'home', label: Text('Home'))],\n)",
  },
  'animated-number': {
    title: 'AnimatedNumber',
    description: {
      en: 'Tween a numeric value smoothly toward its new target.',
      ko: '숫자 값을 새 목표값으로 부드럽게 전환해요.',
      ja: '数値を新しい目標値へ滑らかに遷移させます。',
    },
    usage: 'const TRAnimatedNumber(value: 12345)',
  },
  avatar: {
    title: 'Avatar',
    description: {
      en: 'Show an identity badge with an image or fallback initials.',
      ko: '이미지나 대체 이니셜로 아이덴티티 배지를 표시해요.',
      ja: '画像またはフォールバックのイニシャルでアイデンティティバッジを表示します。',
    },
    usage: "const TRAvatar(fallback: 'AB')",
  },
  breadcrumbs: {
    title: 'Breadcrumbs',
    description: {
      en: 'Show the trail of ancestor pages leading to the current page.',
      ko: '현재 페이지까지 이어지는 상위 페이지 경로를 표시해요.',
      ja: '現在のページに至る上位ページの経路を表示します。',
    },
    usage:
      "TRBreadcrumbs(\n  items: [\n    TRBreadcrumbsItem(label: 'Home', onTap: goHome),\n    const TRBreadcrumbsItem(label: 'Settings'),\n  ],\n)",
  },
  checkbox: {
    title: 'Checkbox',
    description: {
      en: 'Collect a binary or indeterminate selection with shared sizing.',
      ko: '공통 크기로 이진 또는 중간 상태 선택을 입력받아요.',
      ja: '共通サイズで二値または不確定の選択を受け取ります。',
    },
    usage: 'TRCheckbox(\n  checked: agreed,\n  onCheckedChange: setAgreed,\n)',
  },
  'checkbox-group': {
    title: 'CheckboxGroup',
    description: {
      en: 'Coordinate several independently toggleable values as one controlled, uncontrolled, or named form field.',
      ko: '독립적으로 전환할 수 있는 여러 값을 하나의 controlled, uncontrolled 또는 이름 있는 폼 필드로 관리해요.',
      ja: '個別に切り替えられる複数の値を、controlled・uncontrolled・名前付きフォームフィールドとしてまとめて管理します。',
    },
    contract: {
      en: [
        <>
          Use <code>defaultValue</code> when the group owns its selection, or pair
          <code>value</code> with <code>onValueChange</code> for controlled state.
        </>,
        <>
          Give every child <code>TRCheckbox</code> a distinct <code>value</code>
          and a visible label. Use <code>MergeSemantics</code> to expose the control and
          adjacent label as one semantic unit.
        </>,
        <>
          Set <code>disabled</code> on the group to block every child. Set
          <code>readOnly</code> on individual checkboxes when values should remain
          visible without changing.
        </>,
        <>
          Set <code>name</code> to register the selected string list with the nearest{' '}
          <code>TRForm</code>. Use <code>TRRadioGroup</code> when exactly one value may
          be selected.
        </>,
      ],
      ko: [
        <>
          그룹이 선택 상태를 관리하면 <code>defaultValue</code>를 사용하고, controlled
          상태에는 <code>value</code>와 <code>onValueChange</code>를 함께 제공하세요.
        </>,
        <>
          각 <code>TRCheckbox</code>에 고유한 <code>value</code>와 보이는 레이블을
          제공하세요. <code>MergeSemantics</code>로 컨트롤과 인접한 레이블을 하나의
          시맨틱 단위로 묶을 수 있어요.
        </>,
        <>
          모든 자식의 동작을 막으려면 그룹에 <code>disabled</code>를 설정하세요. 값을
          그대로 보여주되 바꾸지 못하게 하려면 개별 체크박스에
          <code>readOnly</code>를 설정하세요.
        </>,
        <>
          <code>name</code>을 지정하면 선택된 문자열 목록이 가장 가까운
          <code>TRForm</code>에 등록돼요. 값 하나만 선택해야 한다면
          <code>TRRadioGroup</code>을 사용하세요.
        </>,
      ],
      ja: [
        <>
          グループが選択状態を管理する場合は <code>defaultValue</code> を使い、
          controlled 状態では <code>value</code> と <code>onValueChange</code> を
          組み合わせてください。
        </>,
        <>
          各 <code>TRCheckbox</code> に固有の <code>value</code> と表示ラベルを
          付けてください。<code>MergeSemantics</code> を使うと、コントロールと
          隣接するラベルを 1 つのセマンティック単位として公開できます。
        </>,
        <>
          すべての子を操作不可にする場合はグループに <code>disabled</code> を
          設定します。値を表示したまま変更を防ぐ場合は、個々のチェックボックスに
          <code>readOnly</code> を設定します。
        </>,
        <>
          <code>name</code> を設定すると、選択済みの文字列リストが最も近い
          <code>TRForm</code> に登録されます。1 つだけ選択する場合は
          <code>TRRadioGroup</code> を使ってください。
        </>,
      ],
    },
    api: {
      en: [
        <>
          <code>value: List&lt;String&gt;?</code> controls the selected values;
          <code>defaultValue: List&lt;String&gt;</code> initializes uncontrolled state
          and defaults to an empty list.
        </>,
        <>
          <code>onValueChange</code> reports the next selected list.
          <code>disabled</code> disables every child and omits the named group from
          <code>TRFormState.values</code>.
        </>,
        <>
          <code>children</code> accepts layout and label widgets, but only descendant
          <code>TRCheckbox</code> widgets with a non-null <code>value</code> participate
          in group selection.
        </>,
      ],
      ko: [
        <>
          <code>value: List&lt;String&gt;?</code>는 선택 값을 제어해요.
          <code>defaultValue: List&lt;String&gt;</code>는 uncontrolled 상태의 초기값이며
          기본값은 빈 목록이에요.
        </>,
        <>
          <code>onValueChange</code>는 다음 선택 목록을 전달해요.
          <code>disabled</code>는 모든 자식을 비활성화하고 이름 있는 그룹을
          <code>TRFormState.values</code>에서 제외해요.
        </>,
        <>
          <code>children</code>에는 레이아웃과 레이블 위젯도 넣을 수 있지만,
          <code>value</code>가 null이 아닌 하위 <code>TRCheckbox</code>만 그룹 선택에
          참여해요.
        </>,
      ],
      ja: [
        <>
          <code>value: List&lt;String&gt;?</code> は選択値を制御します。
          <code>defaultValue: List&lt;String&gt;</code> は uncontrolled 状態を初期化し、
          既定値は空のリストです。
        </>,
        <>
          <code>onValueChange</code> は次の選択リストを通知します。
          <code>disabled</code> はすべての子を無効にし、名前付きグループを
          <code>TRFormState.values</code> から除外します。
        </>,
        <>
          <code>children</code> にはレイアウトやラベルのウィジェットも指定できますが、
          グループ選択に参加するのは、null ではない <code>value</code> を持つ子孫の
          <code>TRCheckbox</code> だけです。
        </>,
      ],
    },
    usage:
      "TRCheckboxGroup(\n  defaultValue: const ['metrics'],\n  onValueChange: setValues,\n  children: const [\n    MergeSemantics(\n      child: Row(\n        mainAxisSize: MainAxisSize.min,\n        spacing: TRSpacing.small,\n        children: [\n          TRCheckbox(value: 'metrics'),\n          TRText('Metrics', variant: TRTextVariant.bodySm),\n        ],\n      ),\n    ),\n    MergeSemantics(\n      child: Row(\n        mainAxisSize: MainAxisSize.min,\n        spacing: TRSpacing.small,\n        children: [\n          TRCheckbox(value: 'alerts'),\n          TRText('Alerts', variant: TRTextVariant.bodySm),\n        ],\n      ),\n    ),\n  ],\n)",
  },
  code: {
    title: 'Code',
    description: {
      en: 'Render an inline monospace code chip.',
      ko: '인라인 모노스페이스 코드 칩을 렌더링해요.',
      ja: 'インラインの等幅コードチップを表示します。',
    },
    usage: "const TRCode('rack.deploy()')",
  },
  'code-block': {
    title: 'CodeBlock',
    description: {
      en: 'Present multi-line code on a scrollable monospace surface.',
      ko: '스크롤 가능한 모노스페이스 표면에 여러 줄 코드를 표시해요.',
      ja: 'スクロール可能な等幅サーフェスに複数行のコードを表示します。',
    },
    usage: "const TRCodeBlock(code: 'tinyrack deploy --env prod')",
  },
  collapsible: {
    title: 'Collapsible',
    description: {
      en: 'Reveal or hide a single content panel behind a trigger.',
      ko: '트리거로 콘텐츠 패널 하나를 펼치거나 접어요.',
      ja: 'トリガーで 1 つのコンテンツパネルを開閉します。',
    },
    usage:
      "const TRCollapsible(\n  trigger: Text('Details'),\n  content: Text('Panel body'),\n)",
  },
  'copy-button': {
    title: 'CopyButton',
    description: {
      en: 'Copy a value to the clipboard and confirm the copy briefly.',
      ko: '값을 클립보드에 복사하고 잠시 확인 상태를 보여줘요.',
      ja: '値をクリップボードにコピーし、完了状態を一時的に表示します。',
    },
    usage: "const TRCopyButton(value: 'tinyrack.net')",
  },
  dialog: {
    title: 'Dialog',
    description: {
      en: 'Present modal content on a Navigator route with typed results, focus containment, and five logical placements.',
      ko: '타입이 있는 결과, 포커스 가두기, 5가지 논리적 배치를 지원하는 Navigator route로 모달 콘텐츠를 표시해요.',
      ja: '型付きの結果、フォーカスの閉じ込め、5 つの論理配置に対応した Navigator route でモーダルコンテンツを表示します。',
    },
    usage:
      "final result = await showTRDialog<bool>(\n  context: context,\n  builder: (context) => TRDialog(\n    title: const Text('Deploy rack?'),\n    content: const Text('The stable channel will be updated.'),\n    actions: TRButton(\n      onPressed: () => Navigator.pop(context, true),\n      child: const Text('Deploy'),\n    ),\n  ),\n);",
  },
  field: {
    title: 'Field',
    description: {
      en: 'Label a control with an optional description or error message.',
      ko: '컨트롤에 레이블과 선택적 설명 또는 오류 메시지를 붙여요.',
      ja: 'コントロールにラベルと任意の説明またはエラーメッセージを付けます。',
    },
    usage:
      "TRField(\n  label: 'Rack name',\n  control: myControl,\n  errorText: error,\n)",
  },
  fieldset: {
    title: 'Fieldset',
    description: {
      en: 'Group related form controls inside a bordered region.',
      ko: '관련 폼 컨트롤을 테두리가 있는 영역으로 묶어요.',
      ja: '関連するフォームコントロールを枠付きの領域にまとめます。',
    },
    usage: "const TRFieldset(\n  legend: 'Contact',\n  children: [/* controls */],\n)",
  },
  link: {
    title: 'Link',
    description: {
      en: 'Render an inline navigable text action with semantic variants.',
      ko: '시맨틱 변형이 있는 인라인 탐색 텍스트 액션을 렌더링해요.',
      ja: 'セマンティックなバリアントを持つインラインのナビゲーションテキストを表示します。',
    },
    usage: "TRLink(\n  onTap: openDocs,\n  child: const Text('Docs'),\n)",
  },
  menu: {
    title: 'Menu',
    description: {
      en: 'Open commands, persistent checkbox or radio settings, and cascading submenus from an anchored trigger.',
      ko: '고정된 트리거에서 명령, 열린 채로 유지되는 체크박스·라디오 설정, 중첩 메뉴를 열어요.',
      ja: 'アンカー付きトリガーから、コマンド、開いたまま操作できるチェックボックス・ラジオ設定、サブメニューを表示します。',
    },
    usage:
      "TRMenu(\n  trigger: const Text('View'),\n  menuChildren: [\n    TRMenuItem(onPressed: duplicate, child: const Text('Duplicate')),\n    TRMenuCheckboxItem(\n      value: showGrid,\n      onChanged: setShowGrid,\n      child: const Text('Show grid'),\n    ),\n  ],\n)",
  },
  meter: {
    title: 'Meter',
    description: {
      en: 'Show a labeled measurement against a known range.',
      ko: '알려진 범위에 대한 측정값을 레이블과 함께 표시해요.',
      ja: '既知の範囲に対する測定値をラベル付きで表示します。',
    },
    usage: "const TRMeter(\n  label: 'Storage',\n  value: 75,\n)",
  },
  progress: {
    title: 'Progress',
    description: {
      en: 'Report determinate or indeterminate progress on a linear track.',
      ko: '선형 트랙에서 확정 또는 불확정 진행률을 보고해요.',
      ja: '線形トラックで確定または不確定の進捗を報告します。',
    },
    usage: 'const TRProgress(value: 60)',
  },
  radio: {
    title: 'Radio',
    description: {
      en: 'Offer one option inside a mutually exclusive radio group.',
      ko: '상호 배타적인 라디오 그룹 안에서 옵션 하나를 제공해요.',
      ja: '相互排他的なラジオグループ内で 1 つの選択肢を提供します。',
    },
    usage: "const TRRadio(value: 'start')",
  },
  'radio-group': {
    title: 'RadioGroup',
    description: {
      en: 'Coordinate a mutually exclusive selection across radios.',
      ko: '라디오 사이의 상호 배타적 선택을 관리해요.',
      ja: 'ラジオ間の相互排他的な選択を管理します。',
    },
    usage:
      "TRRadioGroup(\n  onValueChange: setValue,\n  children: const [\n    TRRadio(value: 'start'),\n    TRRadio(value: 'end'),\n  ],\n)",
  },
  separator: {
    title: 'Separator',
    description: {
      en: 'Divide content regions with a thin semantic line.',
      ko: '얇은 시맨틱 선으로 콘텐츠 영역을 구분해요.',
      ja: '細いセマンティックな線でコンテンツ領域を区切ります。',
    },
    usage: 'const TRSeparator()',
  },
  select: {
    title: 'Select',
    description: {
      en: 'Choose one typed value with controlled, uncontrolled, and FormField APIs while retaining Material keyboard and search behavior.',
      ko: 'Material 키보드 탐색과 검색 동작을 유지하면서 controlled, uncontrolled, FormField API로 타입이 있는 값 하나를 선택해요.',
      ja: 'Material のキーボード操作と検索動作を保ちながら、controlled・uncontrolled・FormField API で型付きの値を 1 つ選択します。',
    },
    usage:
      "TRSelect<String>.controlled(\n  value: channel,\n  items: const [\n    TRSelectItem(value: 'stable', label: 'Stable'),\n    TRSelectItem(value: 'beta', label: 'Beta'),\n  ],\n  onValueChange: setChannel,\n)",
  },
  skeleton: {
    title: 'Skeleton',
    description: {
      en: 'Hold space with a placeholder surface while content loads.',
      ko: '콘텐츠가 로드되는 동안 자리 표시 표면으로 공간을 유지해요.',
      ja: 'コンテンツの読み込み中にプレースホルダーで領域を確保します。',
    },
    usage: 'const TRSkeleton(shape: TRSkeletonShape.text)',
  },
  steps: {
    title: 'Steps',
    description: {
      en: 'Present a numbered sequence of stages connected by a rail.',
      ko: '레일로 연결된 번호 매김 단계를 순서대로 표시해요.',
      ja: 'レールでつながった番号付きの手順を順に表示します。',
    },
    usage:
      "TRStepsRoot(\n  children: [\n    TRStepsItem(child: const Text('Create account')),\n    TRStepsItem(child: const Text('Verify email')),\n  ],\n)",
  },
  switch: {
    title: 'Switch',
    description: {
      en: 'Toggle a binary on/off setting with immediate effect.',
      ko: '즉시 적용되는 켬/끔 설정을 전환해요.',
      ja: '即時に反映されるオン/オフ設定を切り替えます。',
    },
    usage: 'TRSwitch(\n  checked: enabled,\n  onCheckedChange: setEnabled,\n)',
  },
  tabs: {
    title: 'Tabs',
    description: {
      en: 'Switch between content panels with a sliding selection indicator.',
      ko: '슬라이딩 선택 표시선으로 콘텐츠 패널을 전환해요.',
      ja: 'スライドする選択インジケーターでコンテンツパネルを切り替えます。',
    },
    usage:
      "TRTabs(\n  tabs: const [\n    TRTabsTab(value: 'overview', label: 'Overview'),\n    TRTabsTab(value: 'settings', label: 'Settings'),\n  ],\n  panelBuilder: buildPanel,\n)",
  },
  textarea: {
    title: 'Textarea',
    description: {
      en: 'Collect multi-line text with themed borders and states.',
      ko: '테마가 적용된 테두리와 상태로 여러 줄 텍스트를 입력받아요.',
      ja: 'テーマ適用済みの枠線と状態で複数行テキストを受け取ります。',
    },
    usage: 'TRTextarea(\n  onChanged: setNotes,\n)',
  },
  toggle: {
    title: 'Toggle',
    description: {
      en: 'Press a two-state control that stays pressed until released.',
      ko: '해제할 때까지 눌린 상태를 유지하는 2상태 컨트롤이에요.',
      ja: '解除するまで押下状態を保つ 2 状態のコントロールです。',
    },
    usage: "TRToggle(\n  onPressedChange: setBold,\n  child: const Text('Bold'),\n)",
  },
  'toggle-group': {
    title: 'ToggleGroup',
    description: {
      en: 'Coordinate single or multiple pressed toggles by value.',
      ko: '값 기준으로 단일 또는 다중 눌림 토글을 관리해요.',
      ja: '値に基づいて単一または複数の押下トグルを管理します。',
    },
    usage:
      "TRToggleGroup(\n  onValueChange: setAlignment,\n  children: const [\n    TRToggle(value: 'start', child: Text('Start')),\n    TRToggle(value: 'end', child: Text('End')),\n  ],\n)",
  },
  alert: {
    title: 'Alert',
    description: {
      en: 'Show a persistent status message with a title, description, and optional actions.',
      ko: '제목, 설명, 선택적 액션이 있는 지속 상태 메시지를 표시해요.',
      ja: 'タイトル、説明、任意のアクションを持つ永続的なステータスメッセージを表示します。',
    },
    usage:
      "const TRAlert(\n  variant: TRStatusVariant.success,\n  title: Text('Changes saved'),\n  description: Text('The rack is up to date.'),\n)",
  },
  badge: {
    title: 'Badge',
    description: {
      en: 'Label compact status values with semantic intent and shared sizing.',
      ko: '시맨틱 의도와 공통 크기를 사용해 간결한 상태 값을 표시해요.',
      ja: 'セマンティックな意図と共通サイズで、コンパクトな状態値を表示します。',
    },
    usage:
      "const TRBadge(\n  variant: TRStatusVariant.success,\n  child: Text('Healthy'),\n)",
  },
  button: {
    title: 'Button',
    description: {
      en: 'Trigger commands and form actions with shared intent, appearance, size, and loading states.',
      ko: '공통 의도, 표현 방식, 크기, 로딩 상태로 명령과 폼 동작을 실행해요.',
      ja: '共通の意図、外観、サイズ、読み込み状態でコマンドやフォーム操作を実行します。',
    },
    usage:
      "TRButton(\n  intent: TRIntent.primary,\n  onPressed: deploy,\n  child: const Text('Deploy'),\n)",
  },
  card: {
    title: 'Card',
    description: {
      en: 'Group related content on a bordered semantic surface.',
      ko: '테두리가 있는 시맨틱 표면에 관련 콘텐츠를 묶어요.',
      ja: '枠線のあるセマンティックなサーフェスに関連コンテンツをまとめます。',
    },
    usage:
      "const TRCard(\n  variant: TRCardVariant.outlined,\n  child: TRCardHeader(\n    children: [\n      TRCardTitle(child: Text('Rack alpha')),\n      TRCardDescription(child: Text('Healthy')),\n    ],\n  ),\n)",
  },
  'icon-button': {
    title: 'IconButton',
    description: {
      en: 'Render a compact icon action with a required accessible label.',
      ko: '필수 접근 가능 레이블이 있는 간결한 아이콘 액션을 렌더링해요.',
      ja: '必須のアクセシブルなラベルを持つコンパクトなアイコン操作を表示します。',
    },
    usage:
      "TRIconButton(\n  label: 'Add rack',\n  icon: const Icon(Icons.add),\n  onPressed: addRack,\n)",
  },
  spinner: {
    title: 'Spinner',
    description: {
      en: 'Indicate indeterminate or measured progress at a shared control size.',
      ko: '공통 컨트롤 크기로 진행 중이거나 측정된 진행률을 표시해요.',
      ja: '共通のコントロールサイズで、不確定または測定済みの進捗を表示します。',
    },
    usage: "const TRSpinner(label: 'Loading')",
  },
  text: {
    title: 'Text',
    description: {
      en: 'Apply named Tinyrack typography roles without rebuilding TextStyle values.',
      ko: 'TextStyle 값을 다시 만들지 않고 이름이 있는 Tinyrack 타이포그래피 역할을 적용해요.',
      ja: 'TextStyle を組み直さず、名前付きの Tinyrack タイポグラフィ役割を適用します。',
    },
    usage:
      "const TRText(\n  'Rack status',\n  variant: TRTextVariant.headingMd,\n  color: TRTextColor.defaultColor,\n)",
  },
  'text-field': {
    title: 'TextField',
    description: {
      en: 'Collect and validate text while preserving Flutter controller, focus, keyboard, autofill, and Form lifecycle behavior.',
      ko: 'Flutter의 controller, 포커스, 키보드, 자동 완성과 폼 생명 주기를 유지하며 텍스트를 입력받고 검증해요.',
      ja: 'Flutter の controller、フォーカス、キーボード、自動入力、フォームのライフサイクルを保ちながらテキストを受け取り、検証します。',
    },
    usage:
      "TRTextField(\n  label: 'Rack name',\n  controller: controller,\n  validator: (value) =>\n      value == null || value.isEmpty ? 'Required' : null,\n  onSaved: save,\n)",
  },
};

const copy = {
  en: {
    api: 'API',
    contract: 'Contract',
    examples: 'Examples',
    install: 'Install',
    installBody: 'Add the package, then import its public library.',
    playground: 'Playground',
    usage: 'Usage',
  },
  ja: {
    api: 'API',
    contract: '主なプロパティ',
    examples: '例',
    install: 'インストール',
    installBody: 'パッケージを追加し、公開ライブラリをインポートしてください。',
    playground: 'プレイグラウンド',
    usage: '使用方法',
  },
  ko: {
    api: 'API',
    contract: '핵심 속성',
    examples: '예시',
    install: '설치',
    installBody: '패키지를 추가한 뒤 공개 라이브러리를 가져오세요.',
    playground: '플레이그라운드',
    usage: '사용법',
  },
} as const;

export function FlutterComponentPage({
  component,
  locale,
}: {
  component: FlutterComponentId;
  locale: DemoLocale;
}) {
  const data = componentData[component];
  const labels = copy[locale];
  const examples = flutterExamples[component] ?? [];
  return (
    <>
      <p>{data.description[locale]}</p>

      <h2>{labels.contract}</h2>
      {data.contract ? (
        <ul>
          {data.contract[locale].map((item, index) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: localized copy is a fixed, immutable list
            <li key={index}>{item}</li>
          ))}
        </ul>
      ) : (
        <p>
          {locale === 'ko'
            ? '시맨틱 값은 웹과 공유하지만 위젯 동작은 Flutter와 Material 3 규약을 따라요.'
            : locale === 'ja'
              ? 'セマンティック値は Web と共有し、ウィジェットの動作は Flutter と Material 3 の規約に従います。'
              : 'Semantic values match the web system while widget behavior follows Flutter and Material 3.'}
        </p>
      )}

      <h2>{labels.install}</h2>
      <p>{labels.installBody}</p>
      <TRCodeBlock code="flutter pub add tinyrack_ui" language="shellscript" />
      <TRCodeBlock
        code="import 'package:tinyrack_ui/tinyrack_ui.dart';"
        language="dart"
      />

      <h2>{labels.playground}</h2>
      <ComponentPlayground definition={flutterPlaygrounds[component]} />

      <h2>{labels.usage}</h2>
      <TRCodeBlock
        code={`import 'package:tinyrack_ui/tinyrack_ui.dart';\n\n${data.usage}`}
        language="dart"
      />

      {examples.length > 0 ? (
        <>
          <h2>{labels.examples}</h2>
          {examples.map((example) => (
            <ComponentExampleTabs
              description={example.description[locale]}
              id={example.id}
              key={example.id}
              preview={<FlutterExample component={component} example={example.id} />}
              previewLayout="stretch"
              sources={[{ code: example.dart, label: 'Dart', language: 'dart' }]}
              title={example.title[locale]}
            />
          ))}
        </>
      ) : null}

      <h2>{labels.api}</h2>
      {data.api ? (
        <ul>
          {data.api[locale].map((item, index) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: localized copy is a fixed, immutable list
            <li key={index}>{item}</li>
          ))}
        </ul>
      ) : (
        <p>
          {locale === 'ko'
            ? `${data.title}는 Flutter의 네이티브 상태와 콜백을 유지하고 Tinyrack 토큰을 기본값으로 사용해요.`
            : locale === 'ja'
              ? `${data.title} は Flutter のネイティブ状態とコールバックを保ち、Tinyrack トークンを既定値として使用します。`
              : `${data.title} preserves native Flutter state and callbacks while applying Tinyrack token defaults.`}
        </p>
      )}
    </>
  );
}
