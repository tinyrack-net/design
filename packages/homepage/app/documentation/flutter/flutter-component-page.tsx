import { TRCode } from '@tinyrack/ui/components/code';
import { TRCodeBlock } from '@tinyrack/ui/components/code-block';
import { TRTable } from '@tinyrack/ui/components/table';
import type { ReactNode } from 'react';
import { ComponentPlayground } from '../../playground/playground.js';
import { ComponentExampleTabs } from '../shared/component-example-tabs.js';
import type { DemoLocale } from '../shared/demo-locale.js';
import { flutterExamples } from './flutter-examples.js';
import { FlutterExample } from './flutter-preview.js';
import { flutterPlaygrounds } from './playgrounds.js';

type FlutterComponentId = keyof typeof flutterPlaygrounds;
type LocalizedText = Record<DemoLocale, string>;

const alertDialogUsage: LocalizedText = {
  en: String.raw`Widget deleteRackButton(BuildContext context, VoidCallback onDelete) {
  return TRButton(
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
      if (confirmed == true) onDelete();
    },
    child: const Text('Delete rack'),
  );
}`,
  ko: String.raw`Widget deleteRackButton(BuildContext context, VoidCallback onDelete) {
  return TRButton(
    intent: TRIntent.danger,
    onPressed: () async {
      final confirmed = await showTRAlertDialog<bool>(
        context: context,
        builder: (dialogContext) => TRAlertDialog(
          title: const Text('랙을 삭제할까요?'),
          description: const Text('이 작업은 되돌릴 수 없어요.'),
          actions: [
            TRButton(
              appearance: TRAppearance.outline,
              onPressed: () => Navigator.pop(dialogContext, false),
              child: const Text('취소'),
            ),
            TRButton(
              intent: TRIntent.danger,
              onPressed: () => Navigator.pop(dialogContext, true),
              child: const Text('랙 삭제'),
            ),
          ],
        ),
      );
      if (confirmed == true) onDelete();
    },
    child: const Text('랙 삭제'),
  );
}`,
  ja: String.raw`Widget deleteRackButton(BuildContext context, VoidCallback onDelete) {
  return TRButton(
    intent: TRIntent.danger,
    onPressed: () async {
      final confirmed = await showTRAlertDialog<bool>(
        context: context,
        builder: (dialogContext) => TRAlertDialog(
          title: const Text('ラックを削除しますか？'),
          description: const Text('この操作は取り消せません。'),
          actions: [
            TRButton(
              appearance: TRAppearance.outline,
              onPressed: () => Navigator.pop(dialogContext, false),
              child: const Text('キャンセル'),
            ),
            TRButton(
              intent: TRIntent.danger,
              onPressed: () => Navigator.pop(dialogContext, true),
              child: const Text('ラックを削除'),
            ),
          ],
        ),
      );
      if (confirmed == true) onDelete();
    },
    child: const Text('ラックを削除'),
  );
}`,
};

const componentData: Record<
  FlutterComponentId,
  {
    api?: Record<DemoLocale, ReactNode>;
    contract?: Record<DemoLocale, ReactNode>;
    apiGroups?: readonly {
      title: LocalizedText;
      rows: readonly {
        name: string;
        purpose: LocalizedText;
        type: string;
      }[];
    }[];
    contractIntro?: LocalizedText;
    contractRows?: readonly {
      axis: LocalizedText;
      choices: LocalizedText;
    }[];
    description: LocalizedText;
    title: string;
    usage: string | LocalizedText;
  }
> = {
  accordion: {
    title: 'Accordion',
    description: {
      en: 'Stack disclosure items that expand one section or several at a time.',
      ko: '한 번에 하나 또는 여러 섹션을 펼치는 디스클로저 항목을 쌓아요.',
      ja: '一度に 1 つまたは複数のセクションを展開できる開閉項目を積み重ねます。',
    },
    contractRows: [
      {
        axis: { en: 'Selection', ko: '선택', ja: '選択' },
        choices: {
          en: 'Controlled `value` or uncontrolled `defaultValue`',
          ko: '제어형 `value` 또는 비제어형 `defaultValue`',
          ja: '`value` で制御、または `defaultValue` で非制御',
        },
      },
      {
        axis: { en: 'Expansion', ko: '확장', ja: '展開' },
        choices: {
          en: 'Single by default; set `multiple` for independent open items',
          ko: '기본값은 단일 확장이며 `multiple`로 여러 항목을 함께 열 수 있어요',
          ja: '既定は単一展開。`multiple` で複数の項目を同時に開けます',
        },
      },
      {
        axis: { en: 'Availability', ko: '사용 가능 여부', ja: '利用可否' },
        choices: {
          en: 'Disable individual `TRAccordionItem` entries',
          ko: '개별 `TRAccordionItem`을 비활성화할 수 있어요',
          ja: '個別の `TRAccordionItem` を無効にできます',
        },
      },
      {
        axis: { en: 'Lifecycle', ko: '수명 주기', ja: 'ライフサイクル' },
        choices: {
          en: 'Closed content is removed from the widget tree',
          ko: '닫힌 콘텐츠는 위젯 트리에서 제거돼요',
          ja: '閉じたコンテンツはウィジェットツリーから取り除かれます',
        },
      },
    ],
    contractIntro: {
      en: 'When `value` is provided, update it from `onValueChange` so the rendered panels follow each interaction. Tab follows the normal focus order, Enter activates immediately, and Space activates on key release. Disabled items ignore pointer and keyboard activation.',
      ko: '`value`를 제공했다면 상호작용에 맞춰 패널이 바뀌도록 `onValueChange`에서 값을 갱신하세요. Tab은 일반 포커스 순서를 따르고 Enter는 즉시, Space는 키를 놓을 때 전환해요. 비활성화된 항목은 포인터와 키보드 입력을 무시해요.',
      ja: '`value` を指定した場合は、操作に応じてパネルが変わるよう `onValueChange` から値を更新してください。Tab は通常のフォーカス順序に従い、Enter はすぐに、Space はキーを離したときに切り替えます。無効な項目はポインターとキーボードの操作を無視します。',
    },
    apiGroups: [
      {
        title: {
          en: 'TRAccordion properties',
          ko: 'TRAccordion 속성',
          ja: 'TRAccordion のプロパティ',
        },
        rows: [
          {
            name: 'items',
            type: 'List<TRAccordionItem> · required',
            purpose: {
              en: 'Defines the ordered disclosure items.',
              ko: '순서가 있는 디스클로저 항목을 정의해요.',
              ja: '順序付きの開閉項目を定義します。',
            },
          },
          {
            name: 'value',
            type: 'List<String>? · null',
            purpose: {
              en: 'Controls the open item values.',
              ko: '열린 항목의 값을 제어해요.',
              ja: '開いている項目の値を制御します。',
            },
          },
          {
            name: 'defaultValue',
            type: 'List<String> · const []',
            purpose: {
              en: 'Sets the initially open values in uncontrolled mode.',
              ko: '비제어형 모드에서 처음 열 값을 지정해요.',
              ja: '非制御モードで最初に開く値を指定します。',
            },
          },
          {
            name: 'multiple',
            type: 'bool · false',
            purpose: {
              en: 'Allows several items to remain open.',
              ko: '여러 항목을 동시에 열어 둬요.',
              ja: '複数の項目を同時に開いたままにします。',
            },
          },
          {
            name: 'onValueChange',
            type: 'ValueChanged<List<String>>? · null',
            purpose: {
              en: 'Reports the next open values after activation.',
              ko: '항목을 전환한 뒤 다음 열린 값을 전달해요.',
              ja: '項目を切り替えた後の開いている値を通知します。',
            },
          },
        ],
      },
      {
        title: {
          en: 'TRAccordionItem properties',
          ko: 'TRAccordionItem 속성',
          ja: 'TRAccordionItem のプロパティ',
        },
        rows: [
          {
            name: 'value',
            type: 'String · required',
            purpose: {
              en: 'Identifies the item in the root value list.',
              ko: 'Root의 값 목록에서 항목을 식별해요.',
              ja: 'Root の値リスト内で項目を識別します。',
            },
          },
          {
            name: 'trigger',
            type: 'Widget · required',
            purpose: {
              en: 'Renders the interactive item label.',
              ko: '상호작용하는 항목 레이블을 렌더링해요.',
              ja: '操作可能な項目ラベルを表示します。',
            },
          },
          {
            name: 'content',
            type: 'Widget · required',
            purpose: {
              en: 'Renders the panel while the item is open.',
              ko: '항목이 열려 있을 때 패널을 렌더링해요.',
              ja: '項目が開いている間、パネルを表示します。',
            },
          },
          {
            name: 'disabled',
            type: 'bool · false',
            purpose: {
              en: 'Prevents pointer and keyboard activation.',
              ko: '포인터와 키보드 전환을 막아요.',
              ja: 'ポインターとキーボードによる切り替えを無効にします。',
            },
          },
        ],
      },
    ],
    usage:
      "TRAccordion(\n  items: const [\n    TRAccordionItem(\n      value: 'install',\n      trigger: Text('Install'),\n      content: Text('Run the installer.'),\n    ),\n  ],\n)",
  },
  'alert-dialog': {
    title: 'AlertDialog',
    description: {
      en: 'Confirm destructive or irreversible actions in a modal that requires an explicit choice.',
      ko: '명시적인 선택이 필요한 모달에서 위험하거나 되돌릴 수 없는 작업을 확인해요.',
      ja: '明示的な選択が必要なモーダルで、破壊的または元に戻せない操作を確認します。',
    },
    contractRows: [
      {
        axis: { en: 'Actions', ko: '액션', ja: 'アクション' },
        choices: {
          en: 'Pass only `TRButton` values, ordered from the safest action to the most destructive.',
          ko: '`TRButton`만 전달하고 가장 안전한 액션부터 가장 위험한 액션 순서로 배치해요.',
          ja: '`TRButton` だけを渡し、安全なアクションから最も破壊的なアクションの順に配置します。',
        },
      },
      {
        axis: { en: 'Dismissal', ko: '닫기', ja: '閉じる操作' },
        choices: {
          en: 'Backdrop taps are blocked; Escape and system back close the route.',
          ko: '배경 탭은 차단하며 Escape와 시스템 뒤로 가기는 route를 닫아요.',
          ja: '背景タップは無効で、Escape とシステムの戻る操作はルートを閉じます。',
        },
      },
      {
        axis: { en: 'Result and focus', ko: '결과와 포커스', ja: '結果とフォーカス' },
        choices: {
          en: '`Navigator.pop` returns a typed result and focus returns to the opening control.',
          ko: '`Navigator.pop`은 타입 있는 결과를 반환하고 포커스는 연 컨트롤로 돌아가요.',
          ja: '`Navigator.pop` は型付きの結果を返し、フォーカスは開いたコントロールへ戻ります。',
        },
      },
    ],
    contractIntro: {
      en: 'Use neutral outline styling for cancel and `TRIntent.danger` for destructive confirmation.',
      ko: '취소는 neutral outline, 위험한 확인은 `TRIntent.danger`를 사용하세요.',
      ja: 'キャンセルには neutral outline、破壊的な確認には `TRIntent.danger` を使用します。',
    },
    apiGroups: [
      {
        title: { en: 'TRAlertDialog', ko: 'TRAlertDialog', ja: 'TRAlertDialog' },
        rows: [
          {
            name: 'actions',
            type: 'List<TRButton> = const []',
            purpose: {
              en: 'Buttons laid out with token spacing, wrapping, and end alignment.',
              ko: '토큰 간격, 줄바꿈과 끝 정렬을 적용할 버튼 목록이에요.',
              ja: 'トークン間隔、折り返し、末尾揃えで配置するボタン一覧です。',
            },
          },
        ],
      },
      {
        title: {
          en: 'showTRAlertDialog<T>',
          ko: 'showTRAlertDialog<T>',
          ja: 'showTRAlertDialog<T>',
        },
        rows: [
          {
            name: 'route options',
            type: 'useSafeArea, useRootNavigator, requestFocus, routeSettings, anchorPoint',
            purpose: {
              en: 'Controls safe-area placement, navigator ownership, initial focus, route metadata, and foldable anchoring.',
              ko: 'safe area 배치, navigator 소유권, 초기 포커스, route 메타데이터와 폴더블 기준점을 제어해요.',
              ja: 'safe area、navigator、初期フォーカス、ルート情報、折りたたみ端末の基準点を制御します。',
            },
          },
        ],
      },
    ],
    usage: alertDialogUsage,
  },
  'app-shell': {
    title: 'AppShell',
    description: {
      en: 'Compose typed header, sidebar, main, and outline parts with responsive rail or modal-drawer navigation, route progress, and scroll restoration.',
      ko: '타입이 있는 header, sidebar, main, outline 파트를 반응형 rail 또는 modal drawer 탐색, route progress, 스크롤 복원과 함께 조합해요.',
      ja: '型付きの header、sidebar、main、outline パーツを、レスポンシブな rail または modal drawer ナビゲーション、ルート進行状況、スクロール復元と組み合わせます。',
    },
    usage:
      'TRAppShell(\n  breakpoint: TRAppShellBreakpoint.sm,\n  layout: TRAppShellLayout.sidebarFirst,\n  controller: controller,\n  header: TRAppShellHeader(children: [brand, actions]),\n  sidebar: TRAppShellSidebar(child: navigation),\n  main: const TRAppShellMain(child: Workspace()),\n)',
  },
  autocomplete: {
    title: 'Autocomplete',
    description: {
      en: 'Complete free text from typed static or asynchronous suggestions.',
      ko: '타입이 있는 정적 또는 비동기 제안으로 자유 텍스트 입력을 완성해요.',
      ja: '型付きの静的候補または非同期候補から自由入力を補完します。',
    },
    contractRows: [
      {
        axis: { en: 'Value', ko: '값', ja: '値' },
        choices: {
          en: 'The query remains free-form text. Selecting a suggestion also stores its typed value on the controller.',
          ko: '검색어는 자유 형식 텍스트로 유지돼요. 제안을 선택하면 controller에 타입이 있는 값도 함께 저장돼요.',
          ja: '検索文字列は自由入力のままです。候補を選択すると、型付きの値も controller に保存されます。',
        },
      },
      {
        axis: { en: 'Suggestions', ko: '제안', ja: '候補' },
        choices: {
          en: 'Pass static `items` or load them asynchronously with `optionsBuilder`. Older asynchronous responses are discarded.',
          ko: '정적 `items`를 전달하거나 `optionsBuilder`로 비동기 제안을 불러오세요. 이전 요청의 늦은 응답은 버려요.',
          ja: '静的な `items` を渡すか、`optionsBuilder` で候補を非同期に読み込みます。古いリクエストの遅い応答は破棄されます。',
        },
      },
      {
        axis: { en: 'Interaction', ko: '상호작용', ja: '操作' },
        choices: {
          en: 'Pointer hover keeps input focus. Arrow keys move the highlight, Enter selects, Escape closes, and Tab moves on without selecting.',
          ko: '마우스를 올려도 입력 포커스를 유지해요. 방향키는 강조 항목을 옮기고 Enter는 선택하며, Escape는 닫고 Tab은 선택 없이 다음으로 이동해요.',
          ja: 'ポインターを重ねても入力フォーカスを保ちます。矢印キーでハイライトを移動し、Enter で選択、Escape で閉じ、Tab では選択せず次へ移動します。',
        },
      },
    ],
    usage:
      "TRAutocomplete<String>(\n  label: 'Region',\n  placeholder: 'Search regions',\n  items: const [\n    TRAutocompleteItem(value: 'seoul', label: 'Seoul'),\n    TRAutocompleteItem(value: 'tokyo', label: 'Tokyo'),\n  ],\n  onSelected: (region) => selectedRegion = region,\n)",
    apiGroups: [
      {
        title: { en: 'Suggestions', ko: '제안', ja: '候補' },
        rows: [
          {
            name: 'items',
            type: 'List<TRAutocompleteItem<T>> = const []',
            purpose: {
              en: 'Provide typed static suggestions. Disabled items are filtered out.',
              ko: '타입이 있는 정적 제안을 제공해요. 비활성 항목은 결과에서 제외돼요.',
              ja: '型付きの静的候補を指定します。無効な項目は結果から除外されます。',
            },
          },
          {
            name: 'optionsBuilder',
            type: 'FutureOr<Iterable<TRAutocompleteItem<T>>> Function(String)?',
            purpose: {
              en: 'Load suggestions from the current query. It may return synchronously or asynchronously.',
              ko: '현재 검색어로 제안을 불러와요. 동기 또는 비동기로 반환할 수 있어요.',
              ja: '現在の検索文字列から候補を読み込みます。同期または非同期で返せます。',
            },
          },
          {
            name: 'completionMode',
            type: 'TRAutocompleteCompletionMode = list',
            purpose: {
              en: 'Choose `manual`, `list`, `inline`, or `both` completion behavior.',
              ko: '`manual`, `list`, `inline`, `both` 완성 동작 중 하나를 선택해요.',
              ja: '`manual`、`list`、`inline`、`both` の補完動作を選びます。',
            },
          },
          {
            name: 'TRAutocompleteItem',
            type: 'value, label, enabled = true, leading?, trailing?',
            purpose: {
              en: 'Pair a typed value with its label and optional presentation.',
              ko: '타입이 있는 값에 레이블과 선택적 표현 요소를 연결해요.',
              ja: '型付きの値にラベルと任意の表示要素を組み合わせます。',
            },
          },
        ],
      },
      {
        title: {
          en: 'State and callbacks',
          ko: '상태와 콜백',
          ja: '状態とコールバック',
        },
        rows: [
          {
            name: 'controller',
            type: 'TRAutocompleteController<T>?',
            purpose: {
              en: 'Observe `query` and `value`, call `select` or `clear`, and dispose owned text and focus controllers.',
              ko: '`query`와 `value`를 관찰하고 `select`나 `clear`를 호출하며 소유한 텍스트·포커스 controller를 dispose해요.',
              ja: '`query` と `value` を監視し、`select` や `clear` を呼び出し、所有するテキスト・フォーカス controller を dispose します。',
            },
          },
          {
            name: 'onQueryChange',
            type: 'ValueChanged<String>?',
            purpose: {
              en: 'Report free-text edits.',
              ko: '자유 텍스트 편집을 알려줘요.',
              ja: '自由入力の編集を通知します。',
            },
          },
          {
            name: 'onSelected',
            type: 'ValueChanged<T>?',
            purpose: {
              en: 'Report the typed value selected from a suggestion.',
              ko: '제안에서 선택한 타입이 있는 값을 알려줘요.',
              ja: '候補から選択した型付きの値を通知します。',
            },
          },
        ],
      },
      {
        title: { en: 'Field and form', ko: '필드와 폼', ja: 'フィールドとフォーム' },
        rows: [
          {
            name: 'enabled, readOnly',
            type: 'bool = true, bool = false',
            purpose: {
              en: 'Disable interaction or keep a focusable immutable query.',
              ko: '상호작용을 비활성화하거나 포커스 가능한 읽기 전용 검색어를 유지해요.',
              ja: '操作を無効にするか、フォーカス可能な読み取り専用の検索文字列を保ちます。',
            },
          },
          {
            name: 'label, placeholder, helperText, errorText',
            type: 'String?',
            purpose: {
              en: 'Describe the field and its validation state.',
              ko: '필드와 검증 상태를 설명해요.',
              ja: 'フィールドと検証状態を説明します。',
            },
          },
          {
            name: 'uiSize, width',
            type: 'TRUiSize = md, double?',
            purpose: {
              en: 'Set the control size and optional fixed field width.',
              ko: '컨트롤 크기와 선택적 고정 필드 너비를 정해요.',
              ja: 'コントロールサイズと任意の固定フィールド幅を指定します。',
            },
          },
          {
            name: 'TRAutocompleteFormField',
            type: 'FormField<T>',
            purpose: {
              en: 'Participate in validation and save callbacks with a typed selected value.',
              ko: '타입이 있는 선택 값으로 검증과 저장 콜백에 참여해요.',
              ja: '型付きの選択値で検証と保存コールバックに参加します。',
            },
          },
        ],
      },
    ],
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
      en: 'Scroll bounded content with themed, keyboard-accessible Flutter scrollbars that can remain visible or fade on hover.',
      ko: '항상 표시하거나 hover에서 페이드할 수 있는, 테마가 적용된 키보드 접근 가능 Flutter 스크롤바로 제한된 콘텐츠를 스크롤해요.',
      ja: '常時表示またはホバー時にフェード表示できる、テーマ付きでキーボード操作可能な Flutter スクロールバーで領域内のコンテンツをスクロールします。',
    },
    usage: 'const TRScrollArea(\n  autoHide: true,\n  child: activityList,\n)',
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
      en: 'Roll changed digits or count smoothly toward a locale-formatted target value.',
      ko: '바뀐 숫자를 롤링하거나 로케일 형식의 목표값까지 부드럽게 보간해요.',
      ja: '変更された数字をロールさせるか、ロケール形式の目標値まで滑らかに補間します。',
    },
    usage:
      'const TRAnimatedNumber(\n  animation: TRAnimatedNumberAnimation.roll,\n  value: 12345,\n)',
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
      en: 'Collect a binary or mixed selection with controlled, uncontrolled, and Flutter Form APIs.',
      ko: '제어·비제어 상태와 Flutter Form API로 이진 또는 일부 선택을 입력받아요.',
      ja: '制御・非制御の状態と Flutter Form API で、二値または一部選択を受け取ります。',
    },
    contractIntro: {
      en: 'Give every checkbox a visible label or `semanticLabel`. Use `TRCheckboxFormField` when validation, saving, reset, or named `TRFormValues` are required.',
      ko: '모든 체크박스에 보이는 레이블이나 `semanticLabel`을 제공하세요. 검증, 저장, 초기화 또는 이름이 있는 `TRFormValues`가 필요하면 `TRCheckboxFormField`를 사용해요.',
      ja: 'すべてのチェックボックスに表示ラベルまたは `semanticLabel` を指定してください。検証、保存、リセット、名前付きの `TRFormValues` が必要な場合は `TRCheckboxFormField` を使います。',
    },
    contractRows: [
      {
        axis: { en: 'Selection', ko: '선택 상태', ja: '選択状態' },
        choices: {
          en: 'Unchecked, checked, or `indeterminate` for a partially selected set.',
          ko: '선택 안 함, 선택함 또는 일부만 선택한 집합을 나타내는 `indeterminate`를 사용해요.',
          ja: '未選択、選択済み、または一部だけ選択された集合を示す `indeterminate` を使います。',
        },
      },
      {
        axis: { en: 'State ownership', ko: '상태 관리', ja: '状態管理' },
        choices: {
          en: 'Use `defaultChecked` for local state or `checked` with `onCheckedChange` for controlled state.',
          ko: '로컬 상태에는 `defaultChecked`를, 제어 상태에는 `checked`와 `onCheckedChange`를 사용해요.',
          ja: 'ローカル状態には `defaultChecked`、制御状態には `checked` と `onCheckedChange` を使います。',
        },
      },
      {
        axis: { en: 'Availability', ko: '사용 가능 여부', ja: '利用可否' },
        choices: {
          en: '`readOnly` keeps focus and the form value; `disabled` blocks interaction and leaves `TRFormValues`.',
          ko: '`readOnly`는 포커스와 폼 값을 유지하고, `disabled`는 상호작용을 막고 `TRFormValues`에서 빠져요.',
          ja: '`readOnly` はフォーカスとフォーム値を保ち、`disabled` は操作を止めて `TRFormValues` から除外します。',
        },
      },
      {
        axis: { en: 'Size', ko: '크기', ja: 'サイズ' },
        choices: {
          en: '`sm`, `md`, or `lg`; the default is `md`.',
          ko: '`sm`, `md`, `lg` 중에서 고르며 기본값은 `md`예요.',
          ja: '`sm`、`md`、`lg` から選びます。デフォルトは `md` です。',
        },
      },
      {
        axis: { en: 'Forms', ko: '폼', ja: 'フォーム' },
        choices: {
          en: '`TRCheckboxFormField` supports validation, save, reset, restoration, and explicit checked or unchecked values.',
          ko: '`TRCheckboxFormField`는 검증, 저장, 초기화, 상태 복원과 명시적인 켜짐·꺼짐 값을 지원해요.',
          ja: '`TRCheckboxFormField` は検証、保存、リセット、状態復元、明示的なオン・オフ値に対応します。',
        },
      },
    ],
    usage: `class BackupChoice extends StatefulWidget {
  const BackupChoice({super.key});

  @override
  State<BackupChoice> createState() => _BackupChoiceState();
}

class _BackupChoiceState extends State<BackupChoice> {
  bool enabled = true;

  @override
  Widget build(BuildContext context) => Row(
    mainAxisSize: MainAxisSize.min,
    spacing: TRSpacing.small,
    children: [
      TRCheckbox(
        checked: enabled,
        semanticLabel: 'Enable backups',
        onCheckedChange: (value) => setState(() => enabled = value),
      ),
      const TRText('Enable backups', variant: TRTextVariant.bodySm),
    ],
  );
}`,
    apiGroups: [
      {
        title: {
          en: 'Selection and interaction',
          ko: '선택과 상호작용',
          ja: '選択と操作',
        },
        rows: [
          {
            name: 'checked, defaultChecked',
            type: 'bool?, bool = false',
            purpose: {
              en: 'Control or initialize selection.',
              ko: '선택 상태를 제어하거나 초기화해요.',
              ja: '選択状態を制御または初期化します。',
            },
          },
          {
            name: 'indeterminate',
            type: 'bool = false',
            purpose: {
              en: 'Show a partially selected set. Clear it when the choice is resolved.',
              ko: '일부 선택 상태를 표시해요. 선택이 확정되면 해제하세요.',
              ja: '一部選択の状態を表示します。選択が確定したら解除してください。',
            },
          },
          {
            name: 'onCheckedChange',
            type: 'ValueChanged<bool>?',
            purpose: {
              en: 'Report an attempted selection change.',
              ko: '선택 변경 시도를 알려줘요.',
              ja: '選択変更の試行を通知します。',
            },
          },
          {
            name: 'disabled, readOnly',
            type: 'bool = false',
            purpose: {
              en: 'Remove interaction or keep a focusable immutable value.',
              ko: '상호작용을 없애거나 포커스 가능한 읽기 전용 값을 유지해요.',
              ja: '操作を無効にするか、フォーカス可能な読み取り専用値を保ちます。',
            },
          },
          {
            name: 'uiSize, semanticLabel',
            type: 'TRUiSize, String?',
            purpose: {
              en: 'Set the control size and accessible name.',
              ko: '컨트롤 크기와 접근 가능한 이름을 정해요.',
              ja: 'コントロールのサイズとアクセシブルな名前を指定します。',
            },
          },
        ],
      },
      {
        title: {
          en: 'Form field',
          ko: '폼 필드',
          ja: 'フォームフィールド',
        },
        rows: [
          {
            name: 'initialValue, name',
            type: 'bool = false, String?',
            purpose: {
              en: 'Initialize the field and register a named `TRFormValues` entry.',
              ko: '필드를 초기화하고 이름이 있는 `TRFormValues` 항목을 등록해요.',
              ja: 'フィールドを初期化し、名前付きの `TRFormValues` 項目を登録します。',
            },
          },
          {
            name: 'checkedValue, uncheckedValue',
            type: 'Object? = true, false',
            purpose: {
              en: 'Choose the values collected for checked and unchecked states.',
              ko: '선택함과 선택 안 함 상태에서 수집할 값을 정해요.',
              ja: '選択済みと未選択の状態で収集する値を指定します。',
            },
          },
          {
            name: 'validator, onSaved, onReset',
            type: 'FormField callbacks',
            purpose: {
              en: 'Participate in Flutter validation, save, and reset lifecycles.',
              ko: 'Flutter의 검증, 저장, 초기화 생명 주기에 참여해요.',
              ja: 'Flutter の検証、保存、リセットのライフサイクルに参加します。',
            },
          },
          {
            name: 'autovalidateMode, restorationId',
            type: 'Flutter FormField options',
            purpose: {
              en: 'Configure automatic validation and state restoration.',
              ko: '자동 검증과 상태 복원을 설정해요.',
              ja: '自動検証と状態復元を設定します。',
            },
          },
        ],
      },
    ],
  },
  'checkbox-group': {
    title: 'CheckboxGroup',
    description: {
      en: 'Coordinate several independently toggleable values as one controlled, uncontrolled, or named form field.',
      ko: '독립적으로 전환할 수 있는 여러 값을 하나의 controlled, uncontrolled 또는 이름 있는 폼 필드로 관리해요.',
      ja: '個別に切り替えられる複数の値を、controlled・uncontrolled・名前付きフォームフィールドとしてまとめて管理します。',
    },
    contractIntro: {
      en: 'Give every child `TRCheckbox` a distinct `value` and visible label. Use `MergeSemantics` to expose each checkbox and adjacent label as one semantic unit.',
      ko: '각 `TRCheckbox`에 고유한 `value`와 보이는 레이블을 제공하세요. `MergeSemantics`로 체크박스와 인접한 레이블을 하나의 시맨틱 단위로 묶어요.',
      ja: '各 `TRCheckbox` に固有の `value` と表示ラベルを指定してください。`MergeSemantics` でチェックボックスと隣接ラベルを 1 つのセマンティック単位にまとめます。',
    },
    contractRows: [
      {
        axis: { en: 'State ownership', ko: '상태 관리', ja: '状態管理' },
        choices: {
          en: 'Use `defaultValue` when the group owns selection, or pair `value` with `onValueChange` for controlled state.',
          ko: '그룹이 선택을 관리하면 `defaultValue`를, controlled 상태에는 `value`와 `onValueChange`를 함께 사용해요.',
          ja: 'グループが選択を管理する場合は `defaultValue`、controlled 状態では `value` と `onValueChange` を組み合わせます。',
        },
      },
      {
        axis: { en: 'Availability', ko: '사용 가능 여부', ja: '利用可否' },
        choices: {
          en: 'Group `disabled` blocks every child. Child `readOnly` keeps a value visible without allowing changes.',
          ko: '그룹 `disabled`는 모든 자식의 동작을 막아요. 자식 `readOnly`는 값을 보여주되 바꾸지 못하게 해요.',
          ja: 'グループの `disabled` はすべての子を操作不可にします。子の `readOnly` は値を表示したまま変更を防ぎます。',
        },
      },
      {
        axis: { en: 'Forms', ko: '폼', ja: 'フォーム' },
        choices: {
          en: 'Set `name` to register the selected string list with the nearest `TRForm`; disabled groups are omitted.',
          ko: '`name`을 지정하면 선택된 문자열 목록을 가장 가까운 `TRForm`에 등록해요. disabled 그룹은 제외돼요.',
          ja: '`name` を設定すると選択済み文字列リストを最も近い `TRForm` に登録します。disabled グループは除外されます。',
        },
      },
      {
        axis: { en: 'Single selection', ko: '단일 선택', ja: '単一選択' },
        choices: {
          en: 'Use `TRRadioGroup` when exactly one value may be selected.',
          ko: '값 하나만 선택해야 한다면 `TRRadioGroup`을 사용해요.',
          ja: '1 つだけ選択する場合は `TRRadioGroup` を使います。',
        },
      },
    ],
    usage:
      "TRCheckboxGroup(\n  defaultValue: const ['metrics'],\n  onValueChange: setValues,\n  children: const [\n    MergeSemantics(\n      child: Row(\n        mainAxisSize: MainAxisSize.min,\n        spacing: TRSpacing.small,\n        children: [\n          TRCheckbox(value: 'metrics'),\n          TRText('Metrics', variant: TRTextVariant.bodySm),\n        ],\n      ),\n    ),\n    MergeSemantics(\n      child: Row(\n        mainAxisSize: MainAxisSize.min,\n        spacing: TRSpacing.small,\n        children: [\n          TRCheckbox(value: 'alerts'),\n          TRText('Alerts', variant: TRTextVariant.bodySm),\n        ],\n      ),\n    ),\n  ],\n)",
    apiGroups: [
      {
        title: {
          en: 'Selection and interaction',
          ko: '선택과 상호작용',
          ja: '選択と操作',
        },
        rows: [
          {
            name: 'value, defaultValue',
            type: 'List<String>?, List<String> = const []',
            purpose: {
              en: 'Control or initialize the selected values.',
              ko: '선택 값을 제어하거나 초기화해요.',
              ja: '選択値を制御または初期化します。',
            },
          },
          {
            name: 'onValueChange',
            type: 'ValueChanged<List<String>>?',
            purpose: {
              en: 'Report the next selected string list.',
              ko: '다음 선택 문자열 목록을 전달해요.',
              ja: '次の選択済み文字列リストを通知します。',
            },
          },
          {
            name: 'children',
            type: 'List<Widget>',
            purpose: {
              en: 'Only descendant `TRCheckbox` widgets with non-null values participate in selection.',
              ko: 'null이 아닌 값을 가진 하위 `TRCheckbox`만 선택에 참여해요.',
              ja: 'null ではない値を持つ子孫の `TRCheckbox` だけが選択に参加します。',
            },
          },
          {
            name: 'disabled',
            type: 'bool = false',
            purpose: {
              en: 'Disable every child and omit the named group from `TRFormValues`.',
              ko: '모든 자식을 비활성화하고 이름 있는 그룹을 `TRFormValues`에서 제외해요.',
              ja: 'すべての子を無効にし、名前付きグループを `TRFormValues` から除外します。',
            },
          },
          {
            name: 'name',
            type: 'String?',
            purpose: {
              en: 'Register the selected list with the nearest `TRForm`.',
              ko: '선택 목록을 가장 가까운 `TRForm`에 등록해요.',
              ja: '選択済みリストを最も近い `TRForm` に登録します。',
            },
          },
        ],
      },
    ],
  },
  code: {
    title: 'Code',
    description: {
      en: 'Show inline Flutter code chips that preserve line breaks and wrap long tokens.',
      ko: '줄바꿈을 보존하고 긴 토큰을 감싸는 Flutter 인라인 코드 칩을 표시해요.',
      ja: '改行を保ち、長いトークンを折り返す Flutter のインラインコードチップを表示します。',
    },
    contract: {
      en: (
        <>
          <TRCode>TRCode</TRCode> renders short, inline machine-readable text. It
          accepts a string, inherits the surrounding font size, and preserves explicit
          line breaks. Use <TRCode>TRCodeBlock</TRCode> for standalone code samples.
        </>
      ),
      ko: (
        <>
          <TRCode>TRCode</TRCode>는 짧은 인라인 기계 판독용 텍스트를 표시해요. 문자열을
          받아 주변 글꼴 크기를 상속하고 명시적인 줄바꿈을 보존해요. 독립된 코드
          예시에는 <TRCode>TRCodeBlock</TRCode>을 사용하세요.
        </>
      ),
      ja: (
        <>
          <TRCode>TRCode</TRCode> は、短いインラインの機械可読テキストを表示します。
          文字列を受け取り、周囲のフォントサイズを継承して明示的な改行を保ちます。
          独立したコード例には <TRCode>TRCodeBlock</TRCode> を使用してください。
        </>
      ),
    },
    usage: "const TRCode('pnpm verify')",
    api: {
      en: (
        <>
          <p>
            <TRCode>TRCode</TRCode> exposes{' '}
            <TRCode>{`const TRCode(String data, {Key? key})`}</TRCode>. The required{' '}
            <TRCode>data</TRCode> string is rendered by Flutter <TRCode>Text</TRCode>,
            so explicit newlines are preserved and long tokens wrap when the parent
            provides a bounded width. The optional <TRCode>key</TRCode> defaults to{' '}
            <TRCode>null</TRCode>.
          </p>
          <p>
            The widget uses <TRCode>TinyrackThemeData.surfaceMuted</TRCode> for its
            background, <TRCode>TinyrackThemeData.border</TRCode> for its border, and{' '}
            <TRCode>TinyrackThemeData.text</TRCode> for its foreground. It applies the
            bundled IBM Plex Mono family, inherits the surrounding font size, and uses
            the shared inline-code line height, small radius, and extra-small spacing
            tokens.
          </p>
        </>
      ),
      ko: (
        <>
          <p>
            <TRCode>TRCode</TRCode>는{' '}
            <TRCode>{`const TRCode(String data, {Key? key})`}</TRCode> 생성자를
            제공해요. 필수 <TRCode>data</TRCode> 문자열은 Flutter <TRCode>Text</TRCode>
            로 표시되므로 명시적인 줄바꿈을 보존하고, 부모가 너비를 제한하면 긴 토큰을
            줄바꿈해요. 선택 사항인 <TRCode>key</TRCode>의 기본값은{' '}
            <TRCode>null</TRCode>
            이에요.
          </p>
          <p>
            배경에는 <TRCode>TinyrackThemeData.surfaceMuted</TRCode>, 테두리에는{' '}
            <TRCode>TinyrackThemeData.border</TRCode>, 전경에는{' '}
            <TRCode>TinyrackThemeData.text</TRCode>를 사용해요. 번들에 포함된 IBM Plex
            Mono 서체를 적용하고 주변 글꼴 크기를 상속하며, 공통 인라인 코드 행간과 작은
            반경, extra-small 간격 토큰을 사용해요.
          </p>
        </>
      ),
      ja: (
        <>
          <p>
            <TRCode>TRCode</TRCode> は{' '}
            <TRCode>{`const TRCode(String data, {Key? key})`}</TRCode>{' '}
            コンストラクターを提供します。必須の <TRCode>data</TRCode> 文字列は Flutter
            の <TRCode>data</TRCode> 文字列は Flutter の <TRCode>Text</TRCode>{' '}
            で表示されるため、明示的な改行を保ち、親が幅を制限すると長いトークンを
            折り返します。任意の <TRCode>key</TRCode> の既定値は <TRCode>null</TRCode>{' '}
            です。
          </p>
          <p>
            背景には <TRCode>TinyrackThemeData.surfaceMuted</TRCode>、境界線には{' '}
            <TRCode>TinyrackThemeData.border</TRCode>、前景には{' '}
            <TRCode>TinyrackThemeData.text</TRCode> を使用します。同梱の IBM Plex Mono
            書体を適用して周囲のフォントサイズを継承し、共通のインラインコード用
            行間、小さい角丸、extra-small の余白トークンを使用します。
          </p>
        </>
      ),
    },
  },
  'code-block': {
    title: 'CodeBlock',
    description: {
      en: 'Present multi-line code with optional, theme-aware syntax highlighting and explicit wrapping.',
      ko: '선택적 테마 대응 구문 강조와 명시적 줄바꿈으로 여러 줄 코드를 표시해요.',
      ja: '任意のテーマ対応構文ハイライトと明示的な折り返しで、複数行のコードを表示します。',
    },
    usage:
      "const TRCodeBlock(\n  code: \"final status = 'healthy';\",\n  language: 'dart',\n)",
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
    contractRows: [
      {
        axis: { en: 'Intent', ko: '의도', ja: '意図' },
        choices: {
          en: '`intent` accepts `neutral`, `primary`, `info`, `success`, `warning`, and `danger`; the default is `neutral`.',
          ko: '`intent`는 `neutral`, `primary`, `info`, `success`, `warning`, `danger`를 받고 기본값은 `neutral`이에요.',
          ja: '`intent` は `neutral`、`primary`、`info`、`success`、`warning`、`danger` を受け取り、既定値は `neutral` です。',
        },
      },
      {
        axis: { en: 'Emphasis', ko: '강조', ja: '強調' },
        choices: {
          en: '`appearance` accepts `solid`, `outline`, and `ghost`; the default is `solid`. Emphasis changes without changing intent.',
          ko: '`appearance`는 `solid`, `outline`, `ghost`를 받고 기본값은 `solid`예요. 의도는 그대로 두고 강조만 바꿔요.',
          ja: '`appearance` は `solid`、`outline`、`ghost` を受け取り、既定値は `solid` です。意図を変えずに強調だけを調整します。',
        },
      },
      {
        axis: { en: 'Size', ko: '크기', ja: 'サイズ' },
        choices: {
          en: '`uiSize` accepts `sm`, `md`, and `lg`; the default is `md`. Each size sets a square target and its icon size from the shared control metrics.',
          ko: '`uiSize`는 `sm`, `md`, `lg`를 받고 기본값은 `md`예요. 각 크기는 공통 컨트롤 지표에서 정사각형 터치 영역과 아이콘 크기를 함께 정해요.',
          ja: '`uiSize` は `sm`、`md`、`lg` を受け取り、既定値は `md` です。各サイズは共通のコントロール指標から正方形のタップ領域とアイコンサイズを決めます。',
        },
      },
      {
        axis: { en: 'State', ko: '상태', ja: '状態' },
        choices: {
          en: 'A `null` `onPressed` disables the button. `loading` also blocks activation, replaces the icon with a spinner, and keeps the square footprint.',
          ko: '`onPressed`가 `null`이면 버튼이 비활성이에요. `loading`도 활성화를 막고 아이콘을 스피너로 바꾸며 정사각형 크기를 유지해요.',
          ja: '`onPressed` が `null` の場合はボタンが無効になります。`loading` も操作を無効にし、アイコンをスピナーに置き換えたまま正方形のサイズを保ちます。',
        },
      },
    ],
    contractIntro: {
      en: 'An icon alone carries no accessible name, so `label` is required. Name the action the button performs, such as `Add rack`, rather than the icon it shows.',
      ko: '아이콘만으로는 접근 가능한 이름이 생기지 않아서 `label`이 필수예요. 아이콘 모양이 아니라 `Add rack`처럼 버튼이 수행하는 동작을 이름으로 쓰세요.',
      ja: 'アイコンだけではアクセシブルな名前にならないため、`label` は必須です。アイコンの見た目ではなく、`Add rack` のようにボタンが実行する操作を名前にしてください。',
    },
    apiGroups: [
      {
        title: {
          en: 'TRIconButton properties',
          ko: 'TRIconButton 속성',
          ja: 'TRIconButton のプロパティ',
        },
        rows: [
          {
            name: 'icon',
            type: 'Widget · required',
            purpose: {
              en: 'Renders the single icon child. Its size comes from `uiSize`, so an explicit `size` is unnecessary.',
              ko: '단일 아이콘 자식을 렌더링해요. 크기는 `uiSize`에서 오므로 `size`를 따로 지정하지 않아도 돼요.',
              ja: '単一のアイコンを描画します。サイズは `uiSize` から決まるため、`size` の明示は不要です。',
            },
          },
          {
            name: 'label',
            type: 'String · required',
            purpose: {
              en: 'Sets the accessible name exposed through `Semantics`, and acts as the fallback for `loadingLabel`.',
              ko: '`Semantics`로 노출되는 접근 가능한 이름을 정하고, `loadingLabel`의 기본값으로도 쓰여요.',
              ja: '`Semantics` で公開されるアクセシブルな名前を設定し、`loadingLabel` の代替値にもなります。',
            },
          },
          {
            name: 'onPressed',
            type: 'VoidCallback? · required',
            purpose: {
              en: 'Receives taps. Passing `null` disables the button and applies the disabled opacity token.',
              ko: '탭을 받아요. `null`을 넘기면 버튼이 비활성이 되고 비활성 불투명도 토큰이 적용돼요.',
              ja: 'タップを受け取ります。`null` を渡すとボタンが無効になり、無効時の不透明度トークンが適用されます。',
            },
          },
          {
            name: 'appearance',
            type: 'TRAppearance · TRAppearance.solid',
            purpose: {
              en: 'Selects `solid`, `outline`, or `ghost` emphasis.',
              ko: '`solid`, `outline`, `ghost` 중 강조 방식을 선택해요.',
              ja: '`solid`、`outline`、`ghost` のいずれかの強調を選びます。',
            },
          },
          {
            name: 'intent',
            type: 'TRIntent · TRIntent.neutral',
            purpose: {
              en: 'Selects the semantic color role shared with the web system.',
              ko: '웹 시스템과 공유하는 시맨틱 색상 역할을 선택해요.',
              ja: 'Web システムと共有するセマンティックな色の役割を選びます。',
            },
          },
          {
            name: 'uiSize',
            type: 'TRUiSize · TRUiSize.md',
            purpose: {
              en: 'Sets the square dimension and icon size together. Match it to the controls beside the button.',
              ko: '정사각형 크기와 아이콘 크기를 함께 정해요. 옆에 놓인 컨트롤과 크기를 맞추세요.',
              ja: '正方形のサイズとアイコンサイズをまとめて設定します。隣接するコントロールに合わせてください。',
            },
          },
          {
            name: 'loading',
            type: 'bool · false',
            purpose: {
              en: 'Blocks activation and replaces the icon with a small `TRSpinner` while work is in progress.',
              ko: '작업이 진행되는 동안 활성화를 막고 아이콘을 작은 `TRSpinner`로 바꿔요.',
              ja: '処理中は操作を無効にし、アイコンを小さな `TRSpinner` に置き換えます。',
            },
          },
          {
            name: 'loadingLabel',
            type: 'String? · null',
            purpose: {
              en: 'Replaces the accessible name while `loading` is true. When omitted, `label` stays in place.',
              ko: '`loading`이 true인 동안 접근 가능한 이름을 대신해요. 생략하면 `label`이 그대로 유지돼요.',
              ja: '`loading` が true の間、アクセシブルな名前を置き換えます。省略した場合は `label` がそのまま使われます。',
            },
          },
        ],
      },
    ],
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
  pagination: {
    title: 'Pagination',
    description: {
      en: 'Navigate static result pages with a compact, derived number range.',
      ko: '계산된 번호 범위로 정적 결과 페이지를 간결하게 이동해요.',
      ja: '算出された番号範囲で、静的な結果ページをコンパクトに移動します。',
    },
    usage:
      'TRPagination(\n  currentPage: page,\n  totalPages: 12,\n  onPageChanged: setPage,\n)',
    contractRows: [
      {
        axis: { en: 'Range', ko: '범위', ja: '範囲' },
        choices: {
          en: '`boundaryCount`, `siblingCount`',
          ko: '`boundaryCount`, `siblingCount`',
          ja: '`boundaryCount`, `siblingCount`',
        },
      },
      {
        axis: { en: 'Current page', ko: '현재 페이지', ja: '現在のページ' },
        choices: {
          en: 'Clamped to `1...totalPages`',
          ko: '`1...totalPages` 범위로 제한해요',
          ja: '`1...totalPages` の範囲に制限します',
        },
      },
    ],
    apiGroups: [
      {
        title: {
          en: 'TRPagination properties',
          ko: 'TRPagination 속성',
          ja: 'TRPagination のプロパティ',
        },
        rows: [
          {
            name: 'currentPage',
            type: 'int · required',
            purpose: {
              en: 'Selects the current page.',
              ko: '현재 페이지를 선택해요.',
              ja: '現在のページを選択します。',
            },
          },
          {
            name: 'totalPages',
            type: 'int · required',
            purpose: {
              en: 'Sets the available page count.',
              ko: '전체 페이지 수를 정해요.',
              ja: 'ページの総数を設定します。',
            },
          },
          {
            name: 'onPageChanged',
            type: 'ValueChanged<int> · required',
            purpose: {
              en: 'Receives page activations.',
              ko: '페이지 선택 결과를 받아요.',
              ja: 'ページ選択を受け取ります。',
            },
          },
          {
            name: 'boundaryCount / siblingCount',
            type: 'int · 1',
            purpose: {
              en: 'Controls pinned and adjacent pages.',
              ko: '고정 페이지와 인접 페이지 수를 조절해요.',
              ja: '固定ページと隣接ページの数を調整します。',
            },
          },
        ],
      },
    ],
  },
  table: {
    title: 'Table',
    description: {
      en: 'Present semantic row-and-column data with density, striping, and horizontal overflow.',
      ko: '밀도, 줄무늬, 가로 스크롤을 지원하는 시맨틱 행과 열 데이터를 표시해요.',
      ja: '密度、ストライプ、横スクロールに対応したセマンティックな行列データを表示します。',
    },
    usage:
      "const TRTable(\n  columns: [TRTableColumn(label: Text('Rack'))],\n  rows: [TRTableRow(cells: [Text('Rack A')])],\n)",
    contractRows: [
      {
        axis: { en: 'Density', ko: '밀도', ja: '密度' },
        choices: {
          en: '`compact`, `comfortable`, `spacious`',
          ko: '`compact`, `comfortable`, `spacious`',
          ja: '`compact`, `comfortable`, `spacious`',
        },
      },
      {
        axis: { en: 'Rows', ko: '행', ja: '行' },
        choices: {
          en: 'Optional striping and footer',
          ko: '선택적 줄무늬와 footer',
          ja: '任意のストライプと footer',
        },
      },
    ],
    apiGroups: [
      {
        title: {
          en: 'TRTable properties',
          ko: 'TRTable 속성',
          ja: 'TRTable のプロパティ',
        },
        rows: [
          {
            name: 'columns / rows',
            type: 'List · required',
            purpose: {
              en: 'Defines headers and ordered cells.',
              ko: 'header와 순서가 있는 cell을 정의해요.',
              ja: 'ヘッダーと順序付きセルを定義します。',
            },
          },
          {
            name: 'density',
            type: 'TRTableDensity · comfortable',
            purpose: {
              en: 'Sets row spacing.',
              ko: '행 간격을 정해요.',
              ja: '行間隔を設定します。',
            },
          },
          {
            name: 'striped',
            type: 'bool · false',
            purpose: {
              en: 'Alternates body row surfaces.',
              ko: '본문 행의 배경을 번갈아 표시해요.',
              ja: '本文行の背景を交互に表示します。',
            },
          },
          {
            name: 'caption / footer',
            type: 'Widget? / TRTableFooter?',
            purpose: {
              en: 'Adds a caption and summary row.',
              ko: 'caption과 요약 행을 추가해요.',
              ja: 'キャプションと集計行を追加します。',
            },
          },
        ],
      },
    ],
  },
  'window-frame': {
    title: 'WindowFrame',
    description: {
      en: 'Frame application content with macOS or browser-style decorative chrome.',
      ko: '앱 콘텐츠를 macOS 또는 브라우저 스타일의 장식 프레임으로 감싸요.',
      ja: 'アプリの内容を macOS またはブラウザ風の装飾フレームで囲みます。',
    },
    usage:
      "const TRWindowFrame(\n  title: Text('Terminal'),\n  body: Text('Ready'),\n)",
    contractRows: [
      {
        axis: { en: 'Variant', ko: '형태', ja: 'バリアント' },
        choices: {
          en: '`macos`, `browser`',
          ko: '`macos`, `browser`',
          ja: '`macos`, `browser`',
        },
      },
      {
        axis: { en: 'Body padding', ko: '본문 여백', ja: '本文余白' },
        choices: {
          en: '`none`, `sm`, `md`, `lg`',
          ko: '`none`, `sm`, `md`, `lg`',
          ja: '`none`, `sm`, `md`, `lg`',
        },
      },
    ],
    apiGroups: [
      {
        title: {
          en: 'TRWindowFrame properties',
          ko: 'TRWindowFrame 속성',
          ja: 'TRWindowFrame のプロパティ',
        },
        rows: [
          {
            name: 'body',
            type: 'Widget · required',
            purpose: {
              en: 'Provides framed content.',
              ko: '프레임 안의 콘텐츠를 제공해요.',
              ja: 'フレーム内の内容を指定します。',
            },
          },
          {
            name: 'variant',
            type: 'TRWindowFrameVariant · macos',
            purpose: {
              en: 'Chooses app or browser chrome.',
              ko: '앱 또는 브라우저 프레임을 선택해요.',
              ja: 'アプリまたはブラウザのフレームを選択します。',
            },
          },
          {
            name: 'padding',
            type: 'TRWindowFramePadding · md',
            purpose: {
              en: 'Sets the body inset.',
              ko: '본문 안쪽 여백을 정해요.',
              ja: '本文の内側余白を設定します。',
            },
          },
          {
            name: 'title / address',
            type: 'Widget?',
            purpose: {
              en: 'Labels the selected title bar.',
              ko: '선택한 title bar에 레이블을 표시해요.',
              ja: '選択したタイトルバーにラベルを表示します。',
            },
          },
        ],
      },
    ],
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

const codeBlockSetupSource = String.raw`import 'package:flutter/material.dart';
import 'package:tinyrack_ui/tinyrack_ui.dart';

final dartKeywords = RegExp(r'\b(class|const|final|return|void)\b');

Future<TRCodeHighlightResult?> appCodeHighlighter(
  TRCodeHighlightRequest request,
) async {
  if (request.language != 'dart') return null;
  final keywordColor = request.brightness == Brightness.dark
      ? Colors.lightBlueAccent
      : Colors.blue;
  final spans = <TextSpan>[];
  var offset = 0;

  for (final match in dartKeywords.allMatches(request.code)) {
    if (match.start > offset) {
      spans.add(TextSpan(text: request.code.substring(offset, match.start)));
    }
    spans.add(
      TextSpan(
        text: match.group(0),
        style: TextStyle(color: keywordColor),
      ),
    );
    offset = match.end;
  }
  if (offset < request.code.length) {
    spans.add(TextSpan(text: request.code.substring(offset)));
  }
  return TRCodeHighlightResult(span: TextSpan(children: spans));
}

void main() {
  runApp(
    TRCodeHighlighterProvider(
      highlighter: appCodeHighlighter,
      child: const App(),
    ),
  );
}

class App extends StatelessWidget {
  const App({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      theme: TinyrackTheme.light(),
      darkTheme: TinyrackTheme.dark(),
      home: const Scaffold(
        body: TRCodeBlock(
          code: 'final status = "healthy";',
          language: 'dart',
        ),
      ),
    );
  }
}`;

const codeBlockDocs = {
  en: {
    axis: 'Axis',
    contractLabel: 'CodeBlock contract',
    contractRows: [
      [
        'language',
        'Any identifier handled by the configured highlighter',
        'plain text',
      ],
      ['Highlighter', 'highlighter prop, TRCodeHighlighterProvider, none', 'none'],
      [
        'Syntax theme',
        'Defined by the application highlighter for each brightness',
        'plain text colors',
      ],
      ['wrap', 'true, false', 'false'],
    ],
    defaultLabel: 'Default',
    failure:
      'Missing highlighters, unsupported languages, and thrown errors keep the original source visible. Handle these outcomes with onHighlightFailure on a block or provider.',
    setup:
      'Adapt the syntax engine used by the application to TRCodeHighlighter, then provide it above the code blocks. The highlighter owns language support, token styles, and light and dark colors; returning null marks a language as unsupported.',
    setupSource: codeBlockSetupSource,
    values: 'Values',
    apiLabel: 'CodeBlock API',
    apiDescription: 'Description',
    typeLabel: 'Type',
    apiRows: [
      ['code', 'String', 'required', 'Source text to display.'],
      [
        'language',
        'String?',
        'null',
        'Language identifier passed to the highlighter; omit it for plain text.',
      ],
      [
        'highlighter',
        'TRCodeHighlighter?',
        'provider value',
        'Overrides the provider for this block.',
      ],
      [
        'onHighlightFailure',
        'ValueChanged<TRCodeHighlightFailure>?',
        'provider value',
        'Receives noHighlighter, unsupportedLanguage, and highlightFailed.',
      ],
      [
        'wrap',
        'bool',
        'false',
        'Wraps long lines instead of exposing horizontal scrolling.',
      ],
    ],
  },
  ja: {
    axis: 'プロパティ',
    contractLabel: 'CodeBlock の主なプロパティ',
    contractRows: [
      ['language', '設定したハイライターが処理する識別子', 'プレーンテキスト'],
      [
        'ハイライター',
        'highlighter プロパティ、TRCodeHighlighterProvider、なし',
        'なし',
      ],
      [
        '構文テーマ',
        '明るさごとにアプリケーションのハイライターが定義',
        'プレーンテキストの色',
      ],
      ['wrap', 'true、false', 'false'],
    ],
    defaultLabel: '既定値',
    failure:
      'ハイライター未設定、未対応言語、例外のいずれでも元のソースを表示し続けます。ブロックまたはプロバイダーの onHighlightFailure で結果を処理してください。',
    setup:
      'アプリケーションで使う構文エンジンを TRCodeHighlighter に適合させ、コードブロックの上位に設定します。対応言語、トークンスタイル、ライト・ダークの色はハイライターが管理し、null を返すと言語が未対応であることを示します。',
    setupSource: codeBlockSetupSource,
    values: '値',
    apiLabel: 'CodeBlock API',
    apiDescription: '説明',
    typeLabel: '型',
    apiRows: [
      ['code', 'String', '必須', '表示するソーステキストです。'],
      [
        'language',
        'String?',
        'null',
        'ハイライターに渡す言語識別子です。プレーンテキストでは省略します。',
      ],
      [
        'highlighter',
        'TRCodeHighlighter?',
        'プロバイダー値',
        'このブロックだけプロバイダーを上書きします。',
      ],
      [
        'onHighlightFailure',
        'ValueChanged<TRCodeHighlightFailure>?',
        'プロバイダー値',
        'noHighlighter、unsupportedLanguage、highlightFailed を受け取ります。',
      ],
      ['wrap', 'bool', 'false', '水平スクロールの代わりに長い行を折り返します。'],
    ],
  },
  ko: {
    axis: '속성',
    contractLabel: 'CodeBlock 핵심 속성',
    contractRows: [
      ['language', '설정한 하이라이터가 처리하는 언어 식별자', '일반 텍스트'],
      ['하이라이터', 'highlighter 속성, TRCodeHighlighterProvider, 없음', '없음'],
      ['구문 테마', '밝기별로 애플리케이션 하이라이터가 정의', '일반 텍스트 색상'],
      ['wrap', 'true, false', 'false'],
    ],
    defaultLabel: '기본값',
    failure:
      '하이라이터 미설정, 미지원 언어, 예외 상황에서도 원본 소스를 계속 표시해요. 블록이나 프로바이더의 onHighlightFailure로 결과를 처리하세요.',
    setup:
      '애플리케이션에서 사용하는 구문 엔진을 TRCodeHighlighter에 맞춘 뒤 코드 블록 상위에 제공하세요. 지원 언어, 토큰 스타일, 밝고 어두운 색상은 하이라이터가 관리하고, null을 반환하면 미지원 언어로 처리해요.',
    setupSource: codeBlockSetupSource,
    values: '값',
    apiLabel: 'CodeBlock API',
    apiDescription: '설명',
    typeLabel: '타입',
    apiRows: [
      ['code', 'String', '필수', '표시할 소스 텍스트예요.'],
      [
        'language',
        'String?',
        'null',
        '하이라이터에 전달할 언어 식별자예요. 일반 텍스트에는 생략하세요.',
      ],
      [
        'highlighter',
        'TRCodeHighlighter?',
        '프로바이더 값',
        '이 블록에 한해 프로바이더를 대체해요.',
      ],
      [
        'onHighlightFailure',
        'ValueChanged<TRCodeHighlightFailure>?',
        '프로바이더 값',
        'noHighlighter, unsupportedLanguage, highlightFailed를 받아요.',
      ],
      ['wrap', 'bool', 'false', '가로 스크롤 대신 긴 줄을 줄바꿈해요.'],
    ],
  },
} as const;

function InlineCode({ children }: { children: string }) {
  return children
    .split(/(`[^`]+`)/)
    .map((part) =>
      part.startsWith('`') && part.endsWith('`') ? (
        <TRCode key={part}>{part.slice(1, -1)}</TRCode>
      ) : (
        part
      ),
    );
}

export function FlutterComponentPage({
  component,
  locale,
}: {
  component: FlutterComponentId;
  locale: DemoLocale;
}) {
  const data = componentData[component];
  const labels = copy[locale];
  const codeBlock = component === 'code-block' ? codeBlockDocs[locale] : null;
  const examples = flutterExamples[component] ?? [];
  const localized = (value: string | LocalizedText) =>
    typeof value === 'string' ? value : value[locale];
  return (
    <>
      <p>{data.description[locale]}</p>

      <h2>{labels.contract}</h2>
      {codeBlock !== null ? (
        <TRTable.Root
          containerProps={{ 'aria-label': codeBlock.contractLabel, tabIndex: 0 }}
          density="compact"
        >
          <thead>
            <tr>
              <th scope="col">{codeBlock.axis}</th>
              <th scope="col">{codeBlock.values}</th>
              <th scope="col">{codeBlock.defaultLabel}</th>
            </tr>
          </thead>
          <tbody>
            {codeBlock.contractRows.map(([axis, values, defaultValue]) => (
              <tr key={axis}>
                <th scope="row">
                  <TRCode>{axis}</TRCode>
                </th>
                <td>{values}</td>
                <td>{defaultValue}</td>
              </tr>
            ))}
          </tbody>
        </TRTable.Root>
      ) : data.contract?.[locale] !== undefined ? (
        <p>{data.contract[locale]}</p>
      ) : data.contractRows === undefined ? (
        <p>
          {locale === 'ko'
            ? '시맨틱 값은 웹과 공유하지만 위젯 동작은 Flutter와 Material 3 규약을 따라요.'
            : locale === 'ja'
              ? 'セマンティック値は Web と共有し、ウィジェットの動作は Flutter と Material 3 の規約に従います。'
              : 'Semantic values match the web system while widget behavior follows Flutter and Material 3.'}
        </p>
      ) : (
        <>
          <TRTable.Root containerClassName="tr-mdx-table-container" density="compact">
            <TRTable.Header>
              <TRTable.Row>
                <TRTable.Head>
                  {locale === 'ko' ? '속성' : locale === 'ja' ? 'プロパティ' : 'Axis'}
                </TRTable.Head>
                <TRTable.Head>
                  {locale === 'ko' ? '설명' : locale === 'ja' ? '説明' : 'Contract'}
                </TRTable.Head>
              </TRTable.Row>
            </TRTable.Header>
            <TRTable.Body>
              {data.contractRows.map((row) => (
                <TRTable.Row key={row.axis.en}>
                  <TRTable.Cell>{row.axis[locale]}</TRTable.Cell>
                  <TRTable.Cell>
                    <InlineCode>{row.choices[locale]}</InlineCode>
                  </TRTable.Cell>
                </TRTable.Row>
              ))}
            </TRTable.Body>
          </TRTable.Root>
          {data.contractIntro === undefined ? null : (
            <p>
              <InlineCode>{data.contractIntro[locale]}</InlineCode>
            </p>
          )}
        </>
      )}

      <h2>{labels.install}</h2>
      <p>{labels.installBody}</p>
      <TRCodeBlock code="flutter pub add tinyrack_ui" language="shellscript" />
      <TRCodeBlock
        code="import 'package:tinyrack_ui/tinyrack_ui.dart';"
        language="dart"
      />
      {codeBlock === null ? null : (
        <>
          <p>{codeBlock.setup}</p>
          <TRCodeBlock code={codeBlock.setupSource} language="dart" />
        </>
      )}

      <h2>{labels.playground}</h2>
      <ComponentPlayground definition={flutterPlaygrounds[component]} />

      <h2>{labels.usage}</h2>
      <TRCodeBlock
        code={`import 'package:flutter/material.dart';\nimport 'package:tinyrack_ui/tinyrack_ui.dart';\n\n${localized(data.usage)}`}
        language="dart"
      />

      {component === 'app-shell' ? (
        <>
          <h2>
            {locale === 'ko'
              ? '파트와 상태'
              : locale === 'ja'
                ? 'パーツと状態'
                : 'Parts and state'}
          </h2>
          <p>
            {locale === 'ko'
              ? 'TRAppShell은 TRAppShellHeader, TRAppShellSidebar, TRAppShellMain과 선택적인 TRAppShellOutline을 받습니다. Brand와 Actions는 header를 정렬하고, SidebarLabel은 rail에서 시각적으로 숨겨져도 접근 가능한 이름을 유지해요. 외부 상태가 필요하면 하나의 TRAppShellController로 mobileOpen과 sidebarMode를 제어하세요.'
              : locale === 'ja'
                ? 'TRAppShell は TRAppShellHeader、TRAppShellSidebar、TRAppShellMain と任意の TRAppShellOutline を受け取ります。Brand と Actions は header を整列し、SidebarLabel は rail で視覚的に隠れてもアクセシブルな名前を保ちます。外部状態が必要な場合は、1 つの TRAppShellController で mobileOpen と sidebarMode を制御します。'
                : 'TRAppShell accepts TRAppShellHeader, TRAppShellSidebar, TRAppShellMain, and an optional TRAppShellOutline. Brand and Actions align header content, while SidebarLabel keeps its accessible name when visually hidden in rail mode. Use one TRAppShellController when mobileOpen and sidebarMode must be externally controlled.'}
          </p>
          <TRCodeBlock
            code={`final controller = TRAppShellController(
  mobileOpen: false,
  sidebarMode: TRAppShellSidebarMode.expanded,
);

TRAppShell(
  controller: controller,
  onMobileOpenChanged: handleOpen,
  onSidebarModeChanged: handleSidebarMode,
  header: TRAppShellHeader(children: [
    TRAppShellTrigger(
      icon: const Icon(Icons.menu),
      label: 'Open navigation',
    ),
    TRAppShellBrand(child: const Text('Orbit Ops')),
  ]),
  sidebar: TRAppShellSidebar(child: navigation),
  main: const TRAppShellMain(child: Workspace()),
)`}
            language="dart"
          />

          <h2>
            {locale === 'ko'
              ? '반응형 레이아웃과 포커스'
              : locale === 'ja'
                ? 'レスポンシブレイアウトとフォーカス'
                : 'Responsive layout and focus'}
          </h2>
          <p>
            {locale === 'ko'
              ? 'sm은 768px, lg는 1024px viewport 경계예요. headerFirst는 header를 전체 너비에 두고 sidebarFirst는 sidebar를 전체 높이에 둡니다. 모바일 drawer는 논리적 start 또는 end에서 열리는 Navigator route라서 배경 클릭, Escape와 시스템 뒤로 가기로 닫히며 포커스를 내부에 가두고 trigger로 복원해요. mobileSidebar를 rail로 설정하면 64px 탐색을 계속 표시합니다.'
              : locale === 'ja'
                ? 'sm は 768px、lg は 1024px の viewport 境界です。headerFirst は header を全幅に、sidebarFirst は sidebar を全高に配置します。モバイル drawer は論理的な start または end から開く Navigator route で、背景クリック、Escape、システムの戻る操作で閉じ、フォーカスを内部に閉じ込めて trigger に戻します。mobileSidebar を rail にすると 64px のナビゲーションを表示し続けます。'
                : 'sm and lg resolve at 768px and 1024px viewport boundaries. headerFirst spans the header across the shell; sidebarFirst spans the sidebar from top to bottom. The mobile drawer is a Navigator route from the logical start or end edge, so backdrop taps, Escape, and system Back dismiss it, focus stays inside, and focus returns to the trigger. Set mobileSidebar to rail to keep a 64px navigation strip visible.'}
          </p>

          <h2>
            {locale === 'ko'
              ? '문서 chrome과 스크롤'
              : locale === 'ja'
                ? 'ドキュメントクロームとスクロール'
                : 'Docs chrome and scrolling'}
          </h2>
          <p>
            {locale === 'ko'
              ? 'docs는 48px header, 선택적 outline과 route progress를 제공합니다. pendingPath가 currentPath와 다르면 Main이 busy 상태가 됩니다. container는 Main 내부 scroll area를 사용하고 primary는 현재 Flutter route의 primary scroller를 사용해요. PUSH와 REPLACE는 위로 이동하고 POP은 locationKey의 위치를 복원하며 hash는 anchorTargets의 GlobalKey로 이동합니다.'
              : locale === 'ja'
                ? 'docs は 48px の header、任意の outline、ルート進行状況を提供します。pendingPath が currentPath と異なると Main は busy 状態になります。container は Main 内の scroll area を使い、primary は現在の Flutter route の primary scroller を使います。PUSH と REPLACE は先頭へ移動し、POP は locationKey の位置を復元し、hash は anchorTargets の GlobalKey へ移動します。'
                : 'docs provides a 48px header, optional outline, and route progress. Main becomes busy while pendingPath differs from currentPath. container uses Main’s Tinyrack scroll area; primary uses the current Flutter route’s primary scroller. PUSH and REPLACE move to the top, POP restores the locationKey offset, and hash moves to a GlobalKey registered in anchorTargets.'}
          </p>
          <TRCodeBlock
            code={`TRAppShell(
  chrome: TRAppShellChrome.docs,
  currentPath: route.path,
  pendingPath: navigation.pendingPath,
  locationKey: route.key,
  navigationKind: TRAppShellNavigationKind.pop,
  hash: route.hash,
  anchorTargets: {'install': installHeadingKey},
  pageScroll: TRAppShellPageScroll.container,
  header: TRAppShellHeader(children: [brand, actions]),
  sidebar: TRAppShellSidebar(child: docsNavigation),
  outline: TRAppShellOutline(child: tableOfContents),
  main: TRAppShellMain(scroll: true, child: article),
)`}
            language="dart"
          />
        </>
      ) : null}

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
              sources={[
                { code: localized(example.dart), label: 'Dart', language: 'dart' },
              ]}
              title={example.title[locale]}
            />
          ))}
        </>
      ) : null}

      <h2>{labels.api}</h2>
      {codeBlock !== null ? (
        <>
          <p>{codeBlock.failure}</p>
          <TRTable.Root
            containerProps={{ 'aria-label': codeBlock.apiLabel, tabIndex: 0 }}
            density="compact"
          >
            <thead>
              <tr>
                <th scope="col">{codeBlock.axis}</th>
                <th scope="col">{codeBlock.typeLabel}</th>
                <th scope="col">{codeBlock.defaultLabel}</th>
                <th scope="col">{codeBlock.apiDescription}</th>
              </tr>
            </thead>
            <tbody>
              {codeBlock.apiRows.map(([name, type, defaultValue, description]) => (
                <tr key={name}>
                  <th scope="row">
                    <TRCode>{name}</TRCode>
                  </th>
                  <td>
                    <TRCode>{type}</TRCode>
                  </td>
                  <td>{defaultValue}</td>
                  <td>{description}</td>
                </tr>
              ))}
            </tbody>
          </TRTable.Root>
        </>
      ) : (
        (data.api?.[locale] ??
        (data.apiGroups === undefined ? (
          <p>
            {locale === 'ko'
              ? `${data.title}는 Flutter의 네이티브 상태와 콜백을 유지하고 Tinyrack 토큰을 기본값으로 사용해요.`
              : locale === 'ja'
                ? `${data.title} は Flutter のネイティブ状態とコールバックを保ち、Tinyrack トークンを既定値として使用します。`
                : `${data.title} preserves native Flutter state and callbacks while applying Tinyrack token defaults.`}
          </p>
        ) : (
          data.apiGroups.map((group) => (
            <section key={group.title.en}>
              <h3>{group.title[locale]}</h3>
              <TRTable.Root
                containerClassName="tr-mdx-table-container"
                density="compact"
              >
                <TRTable.Header>
                  <TRTable.Row>
                    <TRTable.Head>Prop</TRTable.Head>
                    <TRTable.Head>
                      {locale === 'ko'
                        ? '타입 / 기본값'
                        : locale === 'ja'
                          ? '型 / デフォルト'
                          : 'Type / default'}
                    </TRTable.Head>
                    <TRTable.Head>
                      {locale === 'ko' ? '용도' : locale === 'ja' ? '用途' : 'Purpose'}
                    </TRTable.Head>
                  </TRTable.Row>
                </TRTable.Header>
                <TRTable.Body>
                  {group.rows.map((row) => (
                    <TRTable.Row key={row.name}>
                      <TRTable.Cell>
                        <TRCode>{row.name}</TRCode>
                      </TRTable.Cell>
                      <TRTable.Cell>
                        <TRCode>{row.type}</TRCode>
                      </TRTable.Cell>
                      <TRTable.Cell>
                        <InlineCode>{row.purpose[locale]}</InlineCode>
                      </TRTable.Cell>
                    </TRTable.Row>
                  ))}
                </TRTable.Body>
              </TRTable.Root>
            </section>
          ))
        )))
      )}
    </>
  );
}
