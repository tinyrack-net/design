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
      "TRCombobox<String>(\n  label: 'Channel',\n  placeholder: 'Choose a channel',\n  items: const [\n    TRComboboxItem(value: 'stable', label: 'Stable'),\n    TRComboboxItem(value: 'beta', label: 'Beta'),\n  ],\n  onValueChange: selectChannel,\n)",
    contractRows: [
      {
        axis: { en: 'State', ko: '상태', ja: '状態' },
        choices: {
          en: 'The query and the selected value are separate axes. `TRComboboxController` owns the value plus the `TextEditingController` and `FocusNode`; `TRCombobox.controlled` hands the value back to you while the controller keeps the query.',
          ko: '검색어와 선택 값은 서로 다른 축이에요. `TRComboboxController`가 값과 함께 `TextEditingController`, `FocusNode`를 소유하고, `TRCombobox.controlled`는 값만 호출하는 쪽에 넘기고 검색어는 controller가 계속 들고 있어요.',
          ja: '検索語と選択値は別々の軸です。`TRComboboxController` が値に加えて `TextEditingController` と `FocusNode` を保持し、`TRCombobox.controlled` は値のみを呼び出し側に渡して検索語は controller が保持し続けます。',
        },
      },
      {
        axis: { en: 'Field', ko: '필드', ja: 'フィールド' },
        choices: {
          en: 'The field is a `TRTextField`, so `label`, `placeholder`, `helperText`, `errorText`, `uiSize`, and `width` behave exactly as they do there. `clearable` adds a clear button in the trailing slot once the field holds a query or a selection.',
          ko: '필드는 `TRTextField`라서 `label`, `placeholder`, `helperText`, `errorText`, `uiSize`, `width`가 그곳과 똑같이 동작해요. `clearable`을 켜면 검색어나 선택 값이 있을 때 뒤쪽 슬롯에 지우기 버튼이 나타나요.',
          ja: 'フィールドは `TRTextField` のため、`label`、`placeholder`、`helperText`、`errorText`、`uiSize`、`width` はそちらと同じ挙動です。`clearable` を有効にすると、検索語または選択値があるときに末尾スロットへクリアボタンが表示されます。',
        },
      },
      {
        axis: { en: 'Filtering', ko: '필터링', ja: 'フィルタリング' },
        choices: {
          en: '`optionsBuilder` decides the candidates and `filterMode` narrows them: `contains`, `startsWith`, or `none`. A `filter` callback overrides `filterMode`. Use `none` when a remote or asynchronous `optionsBuilder` is already authoritative.',
          ko: '`optionsBuilder`가 후보를 정하고 `filterMode`가 `contains`·`startsWith`·`none` 중 하나로 좁혀요. `filter` 콜백을 주면 `filterMode`보다 우선해요. 원격이나 비동기 `optionsBuilder`가 이미 결과를 확정한다면 `none`을 쓰세요.',
          ja: '`optionsBuilder` が候補を決め、`filterMode` が `contains`・`startsWith`・`none` のいずれかで絞り込みます。`filter` コールバックを渡すと `filterMode` より優先されます。リモートや非同期の `optionsBuilder` が既に結果を確定している場合は `none` を使ってください。',
        },
      },
      {
        axis: { en: 'Multiple', ko: '다중 선택', ja: '複数選択' },
        choices: {
          en: '`TRMultiCombobox` renders committed values as removable chips above the field and clears the query after each pick. `layout: TRComboboxLayout.grid` lays the popup out in two columns instead of a list.',
          ko: '`TRMultiCombobox`는 확정된 값을 필드 위에 삭제 가능한 칩으로 그리고, 하나 고를 때마다 검색어를 비워요. `layout: TRComboboxLayout.grid`를 주면 팝업이 목록 대신 2열 격자로 배치돼요.',
          ja: '`TRMultiCombobox` は確定した値をフィールドの上に削除可能なチップとして表示し、選択のたびに検索語を消去します。`layout: TRComboboxLayout.grid` を指定すると、ポップアップがリストではなく 2 列のグリッドになります。',
        },
      },
      {
        axis: { en: 'Interaction', ko: '상호작용', ja: '操作' },
        choices: {
          en: 'Arrow keys move the highlight, Enter commits it, and Escape closes the popup. `autoHighlight` decides whether Enter can commit the first match before any arrow key. Options with `enabled: false` stay visible, render muted, and are skipped by both Enter and arrow navigation.',
          ko: '화살표 키로 하이라이트를 옮기고 Enter로 확정하며 Escape로 팝업을 닫아요. `autoHighlight`는 화살표 키 없이도 Enter가 첫 일치 항목을 확정할지 정해요. `enabled: false` 옵션은 계속 보이되 흐리게 그려지고, Enter와 화살표 이동 모두에서 건너뛰어요.',
          ja: '矢印キーでハイライトを移動し、Enter で確定し、Escape でポップアップを閉じます。`autoHighlight` は、矢印キーを押す前に Enter が最初の一致を確定できるかどうかを決めます。`enabled: false` の候補は表示されたまま淡く描画され、Enter と矢印移動の双方でスキップされます。',
        },
      },
      {
        axis: { en: 'Forms', ko: '폼', ja: 'フォーム' },
        choices: {
          en: '`TRComboboxFormField` and `TRMultiComboboxFormField` are `FormField` subclasses, so `validator`, `onSaved`, `autovalidateMode`, and `Form.reset` work as usual and `errorText` is supplied by the field state.',
          ko: '`TRComboboxFormField`와 `TRMultiComboboxFormField`는 `FormField` 하위 클래스라서 `validator`, `onSaved`, `autovalidateMode`, `Form.reset`이 평소대로 동작하고 `errorText`는 필드 상태가 채워줘요.',
          ja: '`TRComboboxFormField` と `TRMultiComboboxFormField` は `FormField` のサブクラスなので、`validator`、`onSaved`、`autovalidateMode`、`Form.reset` は通常どおり動作し、`errorText` はフィールドの状態から供給されます。',
        },
      },
    ],
    contractIntro: {
      en: 'Reach for a combobox when the option list is long enough that typing beats scrolling but the committed value must still come from that list. Use `TRSelect` for a short fixed list, and `TRAutocomplete` when free text the user typed is itself a valid answer.',
      ko: '선택지가 스크롤보다 입력이 빠를 만큼 길지만 확정되는 값은 반드시 그 목록에서 나와야 할 때 combobox를 쓰세요. 짧은 고정 목록에는 `TRSelect`를, 사용자가 입력한 자유 텍스트 자체가 답이 될 수 있다면 `TRAutocomplete`를 쓰세요.',
      ja: '入力のほうがスクロールより速いほど候補が多く、それでも確定値はその一覧から選ばれる必要がある場合に combobox を使ってください。短い固定リストには `TRSelect` を、利用者が入力した自由テキスト自体が有効な答えになる場合は `TRAutocomplete` を使ってください。',
    },
    apiGroups: [
      {
        title: {
          en: 'TRCombobox properties',
          ko: 'TRCombobox 속성',
          ja: 'TRCombobox のプロパティ',
        },
        rows: [
          {
            name: 'items',
            type: 'List<TRComboboxItem<T>> · const []',
            purpose: {
              en: 'Supplies the option source. Either `items` or `optionsBuilder` must be non-empty.',
              ko: '옵션 원본을 제공해요. `items`나 `optionsBuilder` 중 하나는 반드시 채워야 해요.',
              ja: '候補の元データを提供します。`items` と `optionsBuilder` のいずれかは必ず指定してください。',
            },
          },
          {
            name: 'optionsBuilder',
            type: 'TRComboboxOptionsBuilder<T>? · null',
            purpose: {
              en: 'Returns candidates for a query, synchronously or as a `Future`. Its result is still narrowed by `filterMode` unless that is `none`.',
              ko: '검색어에 대한 후보를 동기 또는 `Future`로 돌려줘요. `filterMode`가 `none`이 아니면 그 결과도 한 번 더 좁혀져요.',
              ja: '検索語に対する候補を同期または `Future` で返します。`filterMode` が `none` でない限り、その結果もさらに絞り込まれます。',
            },
          },
          {
            name: 'filterMode',
            type: 'TRComboboxFilterMode · contains',
            purpose: {
              en: 'Matches option labels case-insensitively with `contains` or `startsWith`, or skips narrowing with `none`. Comparison uses `toLowerCase`, so it is not accent-insensitive the way the React `useFilter` collator is.',
              ko: '`contains`나 `startsWith`로 옵션 레이블을 대소문자 구분 없이 비교하고, `none`이면 좁히지 않아요. 비교에 `toLowerCase`를 쓰기 때문에 React `useFilter`의 collator와 달리 악센트까지 무시하지는 않아요.',
              ja: '`contains` または `startsWith` で候補ラベルを大文字小文字を区別せずに照合し、`none` では絞り込みません。比較には `toLowerCase` を使うため、React の `useFilter` の collator と異なりアクセントの違いは無視されません。',
            },
          },
          {
            name: 'filter',
            type: 'TRComboboxFilter<T>? · null',
            purpose: {
              en: 'Replaces `filterMode` with a custom predicate. The query it receives is already trimmed and lower-cased.',
              ko: '`filterMode` 대신 직접 만든 판정 함수를 써요. 전달되는 검색어는 이미 공백이 제거되고 소문자로 바뀐 상태예요.',
              ja: '`filterMode` の代わりに独自の判定関数を使います。渡される検索語は既に前後の空白が除去され、小文字化されています。',
            },
          },
          {
            name: 'autoHighlight',
            type: 'bool · true',
            purpose: {
              en: 'Keeps the first match armed so Enter commits it immediately. Set it to `false` to require an arrow key first. It defaults to `true` here because the underlying `RawAutocomplete` always keeps a valid highlight index, unlike the React default.',
              ko: '첫 일치 항목을 준비 상태로 둬서 Enter가 바로 확정하게 해요. `false`로 두면 화살표 키를 먼저 눌러야 해요. 바탕이 되는 `RawAutocomplete`가 항상 유효한 하이라이트 인덱스를 유지하기 때문에 React 기본값과 달리 여기서는 `true`가 기본이에요.',
              ja: '最初の一致を待機状態にして、Enter で即座に確定できるようにします。`false` にすると先に矢印キーが必要になります。基盤の `RawAutocomplete` が常に有効なハイライト位置を保つため、React の既定値とは異なり、ここでは `true` が既定です。',
            },
          },
          {
            name: 'clearable, clearSemanticLabel',
            type: "bool · false, String · 'Clear'",
            purpose: {
              en: 'Shows a clear button while the field holds a query or a selection. Clearing empties the query, reports `null` through `onValueChange`, and returns focus to the field.',
              ko: '검색어나 선택 값이 있을 때 지우기 버튼을 보여줘요. 지우면 검색어를 비우고 `onValueChange`로 `null`을 알린 뒤 필드로 포커스를 돌려줘요.',
              ja: '検索語または選択値があるときにクリアボタンを表示します。クリアすると検索語を空にし、`onValueChange` で `null` を通知したうえで、フィールドにフォーカスを戻します。',
            },
          },
          {
            name: 'controller, defaultValue, value',
            type: 'TRComboboxController<T>?, T?, T?',
            purpose: {
              en: 'Chooses the state model. `defaultValue` seeds the uncontrolled constructor, `value` is required by `TRCombobox.controlled`, and a controller can be shared with either.',
              ko: '상태 모델을 정해요. `defaultValue`는 비제어 생성자의 초기값이고, `value`는 `TRCombobox.controlled`에 필수이며, controller는 둘 중 어느 쪽과도 함께 쓸 수 있어요.',
              ja: '状態モデルを選びます。`defaultValue` は非制御コンストラクタの初期値、`value` は `TRCombobox.controlled` で必須で、controller はどちらとも併用できます。',
            },
          },
          {
            name: 'onQueryChange, onValueChange',
            type: 'ValueChanged<String>?, ValueChanged<T?>?',
            purpose: {
              en: 'Report query edits and committed selections separately. `onValueChange` also fires with `null` when the clear button is used.',
              ko: '검색어 편집과 확정된 선택을 따로 알려줘요. 지우기 버튼을 누르면 `onValueChange`가 `null`로도 호출돼요.',
              ja: '検索語の編集と確定した選択を別々に通知します。クリアボタンを押した場合、`onValueChange` は `null` でも呼び出されます。',
            },
          },
          {
            name: 'layout',
            type: 'TRComboboxLayout · list',
            purpose: {
              en: 'Draws the popup as a single-column list or a two-column grid.',
              ko: '팝업을 1열 목록이나 2열 격자로 그려요.',
              ja: 'ポップアップを 1 列のリストまたは 2 列のグリッドとして描画します。',
            },
          },
          {
            name: 'enabled, readOnly',
            type: 'bool · true, bool · false',
            purpose: {
              en: 'Disable interaction, or keep a focusable field whose query cannot be edited. Both hide the clear button.',
              ko: '상호작용을 막거나, 포커스는 되지만 검색어를 편집할 수 없는 필드로 유지해요. 둘 다 지우기 버튼을 감춰요.',
              ja: '操作を無効にするか、フォーカスは可能でも検索語を編集できないフィールドにします。どちらの場合もクリアボタンは表示されません。',
            },
          },
          {
            name: 'label, placeholder, helperText, errorText',
            type: 'String? · null',
            purpose: {
              en: 'Describe the field and its validation state through the underlying `TRTextField`.',
              ko: '바탕이 되는 `TRTextField`를 통해 필드와 검증 상태를 설명해요.',
              ja: '基盤の `TRTextField` を通じて、フィールドと検証状態を説明します。',
            },
          },
          {
            name: 'uiSize, width',
            type: 'TRUiSize · TRUiSize.md, double? · null',
            purpose: {
              en: 'Set the control size and a fixed field width. The popup matches `width`, or falls back to the small overlay width token.',
              ko: '컨트롤 크기와 고정 필드 너비를 정해요. 팝업은 `width`를 따르고, 없으면 small 오버레이 너비 토큰을 써요.',
              ja: 'コントロールサイズと固定のフィールド幅を指定します。ポップアップは `width` に合わせ、未指定の場合は small のオーバーレイ幅トークンを使います。',
            },
          },
        ],
      },
      {
        title: {
          en: 'TRMultiCombobox properties',
          ko: 'TRMultiCombobox 속성',
          ja: 'TRMultiCombobox のプロパティ',
        },
        rows: [
          {
            name: 'defaultValue, value',
            type: 'List<T> · const [], List<T>?',
            purpose: {
              en: 'Hold the committed values. `value` is required by `TRMultiCombobox.controlled` and makes the widget fully controlled.',
              ko: '확정된 값들을 담아요. `value`는 `TRMultiCombobox.controlled`에 필수이고, 이를 주면 위젯이 완전한 제어 모드가 돼요.',
              ja: '確定した値を保持します。`value` は `TRMultiCombobox.controlled` で必須であり、指定するとウィジェットは完全な制御モードになります。',
            },
          },
          {
            name: 'onValueChange',
            type: 'ValueChanged<List<T>>? · null',
            purpose: {
              en: 'Reports the full selection after every pick, chip removal, or clear. Selecting an already selected value removes it.',
              ko: '선택, 칩 삭제, 지우기 뒤마다 전체 선택 목록을 알려줘요. 이미 선택된 값을 다시 고르면 해제돼요.',
              ja: '選択、チップの削除、クリアのたびに選択内容の全体を通知します。既に選択済みの値をもう一度選ぶと解除されます。',
            },
          },
          {
            name: 'controller',
            type: 'TRMultiComboboxController<T>? · null',
            purpose: {
              en: 'Owns the values and the shared query field. Its `clear` resets the values only, so clear the `textEditingController` too when driving it directly.',
              ko: '값들과 공유 검색어 필드를 소유해요. `clear`는 값만 비우므로 직접 제어할 때는 `textEditingController`도 함께 비우세요.',
              ja: '値と共有の検索フィールドを保持します。`clear` は値のみを消去するため、直接操作する場合は `textEditingController` も併せて消去してください。',
            },
          },
        ],
      },
      {
        title: {
          en: 'Items and enums',
          ko: '항목과 열거형',
          ja: '項目と列挙型',
        },
        rows: [
          {
            name: 'TRComboboxItem.value, label',
            type: 'T · required, String · required',
            purpose: {
              en: 'Carry the typed value and the text shown in the popup and written back into the field on commit.',
              ko: '타입이 있는 값과, 팝업에 표시되고 확정 시 필드에 다시 써지는 텍스트를 담아요.',
              ja: '型付きの値と、ポップアップに表示され確定時にフィールドへ書き戻されるテキストを保持します。',
            },
          },
          {
            name: 'TRComboboxItem.enabled',
            type: 'bool · true',
            purpose: {
              en: 'Marks an option as unselectable. It stays in the popup, renders with the muted text color, and is skipped by keyboard navigation.',
              ko: '옵션을 선택할 수 없게 표시해요. 팝업에는 그대로 남고 muted 텍스트 색으로 그려지며 키보드 이동에서 건너뛰어요.',
              ja: '候補を選択不可にします。ポップアップには残り、muted のテキスト色で描画され、キーボード移動ではスキップされます。',
            },
          },
          {
            name: 'TRComboboxItem.leading, trailing',
            type: 'Widget? · null',
            purpose: {
              en: 'Place icons on either side of the option label.',
              ko: '옵션 레이블 양옆에 아이콘을 배치해요.',
              ja: '候補ラベルの両側にアイコンを配置します。',
            },
          },
          {
            name: 'TRComboboxLayout',
            type: 'list, grid',
            purpose: {
              en: 'Selects the popup arrangement. `grid` uses two columns of fixed-height rows.',
              ko: '팝업 배치를 고르는 열거형이에요. `grid`는 높이가 고정된 행을 2열로 배치해요.',
              ja: 'ポップアップの配置を選ぶ列挙型です。`grid` は高さが固定された行を 2 列で配置します。',
            },
          },
          {
            name: 'TRComboboxFilterMode',
            type: 'contains, startsWith, none',
            purpose: {
              en: 'Selects the built-in narrowing rule applied to the option source.',
              ko: '옵션 원본에 적용할 기본 좁히기 규칙을 고르는 열거형이에요.',
              ja: '候補の元データに適用する組み込みの絞り込みルールを選ぶ列挙型です。',
            },
          },
        ],
      },
      {
        title: {
          en: 'Controllers and form fields',
          ko: 'Controller와 폼 필드',
          ja: 'Controller とフォームフィールド',
        },
        rows: [
          {
            name: 'TRComboboxController',
            type: 'ChangeNotifier',
            purpose: {
              en: 'Exposes `value`, `select`, and `clear` alongside the owned `textEditingController` and `focusNode`. Dispose it with the widget that created it.',
              ko: '`value`, `select`, `clear`와 함께 소유한 `textEditingController`, `focusNode`를 노출해요. 만든 위젯에서 dispose하세요.',
              ja: '`value`、`select`、`clear` に加えて、保持する `textEditingController` と `focusNode` を公開します。生成したウィジェット側で dispose してください。',
            },
          },
          {
            name: 'TRMultiComboboxController',
            type: 'ChangeNotifier',
            purpose: {
              en: 'Exposes `values`, `replace`, `toggle`, and `clear`. `values` is an unmodifiable view, so replace the list instead of mutating it.',
              ko: '`values`, `replace`, `toggle`, `clear`를 노출해요. `values`는 수정할 수 없는 뷰라서 직접 바꾸지 말고 목록을 교체하세요.',
              ja: '`values`、`replace`、`toggle`、`clear` を公開します。`values` は変更不可のビューのため、直接変更せずリストを差し替えてください。',
            },
          },
          {
            name: 'TRComboboxFormField',
            type: 'FormField<T>',
            purpose: {
              en: 'Participates in validation and save callbacks with a typed selected value, and feeds `errorText` back into the field.',
              ko: '타입이 있는 선택 값으로 검증과 저장 콜백에 참여하고 `errorText`를 필드로 다시 전달해요.',
              ja: '型付きの選択値で検証と保存コールバックに参加し、`errorText` をフィールドへ戻します。',
            },
          },
          {
            name: 'TRMultiComboboxFormField',
            type: 'FormField<List<T>>',
            purpose: {
              en: 'Does the same for a list of values, so a validator can require at least one selection.',
              ko: '값 목록에 대해 같은 일을 해요. validator로 최소 한 개 선택을 요구할 수 있어요.',
              ja: '値のリストに対して同じ役割を果たします。validator で 1 つ以上の選択を必須にできます。',
            },
          },
        ],
      },
    ],
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
    contractIntro: {
      en: 'Reach `TRFormState` through a `GlobalKey<TRFormState>` you hold, or through `TRForm.maybeOf(context)` from a descendant. Only fields that declare a `name` appear in `TRFormValues`.',
      ko: '`TRFormState`에는 직접 보관한 `GlobalKey<TRFormState>`로 접근하거나, 하위 위젯에서 `TRForm.maybeOf(context)`로 접근하세요. `name`을 선언한 필드만 `TRFormValues`에 담겨요.',
      ja: '`TRFormState` には、保持している `GlobalKey<TRFormState>` か、子孫ウィジェットからの `TRForm.maybeOf(context)` でアクセスしてください。`TRFormValues` に含まれるのは `name` を宣言したフィールドだけです。',
    },
    contractRows: [
      {
        axis: { en: 'Value collection', ko: '값 수집', ja: '値の収集' },
        choices: {
          en: '`values` returns an immutable `TRFormValues` snapshot of the named fields; `save()` runs the native `FormState.save()` first and then returns the same snapshot.',
          ko: '`values`는 이름이 있는 필드의 불변 `TRFormValues` 스냅샷을 반환하고, `save()`는 네이티브 `FormState.save()`를 먼저 실행한 뒤 같은 스냅샷을 반환해요.',
          ja: '`values` は名前付きフィールドの不変な `TRFormValues` スナップショットを返し、`save()` はネイティブの `FormState.save()` を実行してから同じスナップショットを返します。',
        },
      },
      {
        axis: {
          en: 'Disabled and read-only fields',
          ko: '비활성 필드와 읽기 전용 필드',
          ja: '無効フィールドと読み取り専用フィールド',
        },
        choices: {
          en: 'A field with `enabled: false` is left out of `TRFormValues`. A field with `readOnly: true` still contributes its value.',
          ko: '`enabled: false`인 필드는 `TRFormValues`에서 빠져요. `readOnly: true`인 필드는 값을 그대로 담아요.',
          ja: '`enabled: false` のフィールドは `TRFormValues` から除外されます。`readOnly: true` のフィールドは値をそのまま含みます。',
        },
      },
      {
        axis: { en: 'Validation', ko: '검증', ja: '検証' },
        choices: {
          en: '`validate()` returns whether every field validator passed. `validateGranularly()` runs the native granular validation and returns true when the error set is empty; the set itself is not exposed. Both report true when the form has no `FormState` yet.',
          ko: '`validate()`는 모든 필드 검증기가 통과했는지 반환해요. `validateGranularly()`는 네이티브 세부 검증을 실행하고 오류 집합이 비었을 때 true를 반환하며, 집합 자체는 노출하지 않아요. 폼에 아직 `FormState`가 없으면 둘 다 true를 반환해요.',
          ja: '`validate()` はすべてのフィールド検証が通ったかどうかを返します。`validateGranularly()` はネイティブの詳細な検証を実行し、エラー集合が空のとき true を返します。集合そのものは公開されません。フォームにまだ `FormState` がない場合、どちらも true を返します。',
        },
      },
      {
        axis: { en: 'Validation timing', ko: '검증 시점', ja: '検証のタイミング' },
        choices: {
          en: '`autovalidateMode` defaults to null, so errors appear only when validation runs. Pass `AutovalidateMode.onUserInteraction` to validate while the reader types.',
          ko: '`autovalidateMode`의 기본값은 null이라 검증을 실행할 때만 오류가 나타나요. 입력하는 동안 검증하려면 `AutovalidateMode.onUserInteraction`을 넘기세요.',
          ja: '`autovalidateMode` の既定値は null のため、検証を実行したときにだけエラーが表示されます。入力中に検証するには `AutovalidateMode.onUserInteraction` を渡してください。',
        },
      },
      {
        axis: { en: 'Change and reset', ko: '변경과 초기화', ja: '変更とリセット' },
        choices: {
          en: '`onChanged` fires with a fresh snapshot whenever a field changes. `reset()` restores the native field values and then fires `onChanged` again; application state such as a submitted result must be cleared separately.',
          ko: '필드가 바뀔 때마다 `onChanged`가 새 스냅샷과 함께 호출돼요. `reset()`은 네이티브 필드 값을 되돌린 뒤 `onChanged`를 다시 호출하고, 제출 결과 같은 애플리케이션 상태는 따로 지워야 해요.',
          ja: 'フィールドが変わるたびに `onChanged` が新しいスナップショットとともに呼ばれます。`reset()` はネイティブのフィールド値を戻してから `onChanged` を再び呼びます。送信結果などのアプリケーション状態は別途クリアしてください。',
        },
      },
    ],
    usage: {
      en: String.raw`class RackForm extends StatefulWidget {
  const RackForm({super.key});

  @override
  State<RackForm> createState() => _RackFormState();
}

class _RackFormState extends State<RackForm> {
  final GlobalKey<TRFormState> formKey = GlobalKey<TRFormState>();
  String submitted = '';

  @override
  Widget build(BuildContext context) => TRForm(
    key: formKey,
    child: Column(
      mainAxisSize: MainAxisSize.min,
      spacing: TRSpacing.medium,
      children: [
        TRTextField(
          name: 'rack',
          label: 'Rack name',
          validator: (value) =>
              (value ?? '').trim().isEmpty ? 'Enter a rack name.' : null,
        ),
        TRButton(
          onPressed: () {
            final state = formKey.currentState!;
            if (!state.validate()) return;
            final values = state.save();
            setState(() => submitted = values['rack']?.toString() ?? '');
          },
          child: const Text('Save'),
        ),
        if (submitted.isNotEmpty)
          TRText(submitted, variant: TRTextVariant.bodySm),
      ],
    ),
  );
}`,
      ko: String.raw`class RackForm extends StatefulWidget {
  const RackForm({super.key});

  @override
  State<RackForm> createState() => _RackFormState();
}

class _RackFormState extends State<RackForm> {
  final GlobalKey<TRFormState> formKey = GlobalKey<TRFormState>();
  String submitted = '';

  @override
  Widget build(BuildContext context) => TRForm(
    key: formKey,
    child: Column(
      mainAxisSize: MainAxisSize.min,
      spacing: TRSpacing.medium,
      children: [
        TRTextField(
          name: 'rack',
          label: '랙 이름',
          validator: (value) =>
              (value ?? '').trim().isEmpty ? '랙 이름을 입력하세요.' : null,
        ),
        TRButton(
          onPressed: () {
            final state = formKey.currentState!;
            if (!state.validate()) return;
            final values = state.save();
            setState(() => submitted = values['rack']?.toString() ?? '');
          },
          child: const Text('저장'),
        ),
        if (submitted.isNotEmpty)
          TRText(submitted, variant: TRTextVariant.bodySm),
      ],
    ),
  );
}`,
      ja: String.raw`class RackForm extends StatefulWidget {
  const RackForm({super.key});

  @override
  State<RackForm> createState() => _RackFormState();
}

class _RackFormState extends State<RackForm> {
  final GlobalKey<TRFormState> formKey = GlobalKey<TRFormState>();
  String submitted = '';

  @override
  Widget build(BuildContext context) => TRForm(
    key: formKey,
    child: Column(
      mainAxisSize: MainAxisSize.min,
      spacing: TRSpacing.medium,
      children: [
        TRTextField(
          name: 'rack',
          label: 'ラック名',
          validator: (value) =>
              (value ?? '').trim().isEmpty ? 'ラック名を入力してください。' : null,
        ),
        TRButton(
          onPressed: () {
            final state = formKey.currentState!;
            if (!state.validate()) return;
            final values = state.save();
            setState(() => submitted = values['rack']?.toString() ?? '');
          },
          child: const Text('保存'),
        ),
        if (submitted.isNotEmpty)
          TRText(submitted, variant: TRTextVariant.bodySm),
      ],
    ),
  );
}`,
    },
    apiGroups: [
      {
        title: {
          en: 'TRForm properties',
          ko: 'TRForm 속성',
          ja: 'TRForm のプロパティ',
        },
        rows: [
          {
            name: 'child',
            type: 'Widget (required)',
            purpose: {
              en: 'The subtree that holds the form fields.',
              ko: '폼 필드를 담는 하위 트리예요.',
              ja: 'フォームフィールドを含むサブツリーです。',
            },
          },
          {
            name: 'autovalidateMode',
            type: 'AutovalidateMode?',
            purpose: {
              en: 'Chooses when the native form revalidates. Null validates only on an explicit call.',
              ko: '네이티브 폼이 다시 검증하는 시점을 정해요. null이면 명시적으로 호출할 때만 검증해요.',
              ja: 'ネイティブフォームが再検証するタイミングを決めます。null の場合は明示的に呼んだときだけ検証します。',
            },
          },
          {
            name: 'onChanged',
            type: 'ValueChanged<TRFormValues>?',
            purpose: {
              en: 'Called with a fresh snapshot after any field change and after `reset()`.',
              ko: '필드가 바뀐 뒤와 `reset()` 뒤에 새 스냅샷과 함께 호출돼요.',
              ja: 'フィールドの変更後と `reset()` の後に、新しいスナップショットとともに呼ばれます。',
            },
          },
          {
            name: 'canPop',
            type: 'bool?',
            purpose: {
              en: 'Forwarded to the native `Form` to guard route pops while the form holds unsaved input.',
              ko: '저장하지 않은 입력이 있을 때 라우트 팝을 막도록 네이티브 `Form`에 전달돼요.',
              ja: '未保存の入力があるときのルート pop を制御するため、ネイティブの `Form` に渡されます。',
            },
          },
          {
            name: 'onPopInvokedWithResult',
            type: 'PopInvokedWithResultCallback<Object?>?',
            purpose: {
              en: 'Forwarded to the native `Form` and called after a pop attempt.',
              ko: '네이티브 `Form`에 전달되어 팝 시도 뒤에 호출돼요.',
              ja: 'ネイティブの `Form` に渡され、pop の試行後に呼ばれます。',
            },
          },
        ],
      },
      {
        title: {
          en: 'TRFormState members',
          ko: 'TRFormState 멤버',
          ja: 'TRFormState のメンバー',
        },
        rows: [
          {
            name: 'values',
            type: 'TRFormValues',
            purpose: {
              en: 'A snapshot of the enabled named fields, taken without running `save()`.',
              ko: '`save()`를 실행하지 않고 가져오는, 활성화된 이름 있는 필드의 스냅샷이에요.',
              ja: '`save()` を実行せずに取得する、有効な名前付きフィールドのスナップショットです。',
            },
          },
          {
            name: 'save()',
            type: 'TRFormValues',
            purpose: {
              en: 'Runs `FormState.save()` and returns the resulting snapshot.',
              ko: '`FormState.save()`를 실행하고 그 결과 스냅샷을 반환해요.',
              ja: '`FormState.save()` を実行し、その結果のスナップショットを返します。',
            },
          },
          {
            name: 'validate()',
            type: 'bool',
            purpose: {
              en: 'Runs every field validator and returns whether all of them passed.',
              ko: '모든 필드 검증기를 실행하고 전부 통과했는지 반환해요.',
              ja: 'すべてのフィールド検証を実行し、すべて通ったかどうかを返します。',
            },
          },
          {
            name: 'validateGranularly()',
            type: 'bool',
            purpose: {
              en: 'Validates through the native granular API and returns true when no field reports an error.',
              ko: '네이티브 세부 검증 API로 검증하고, 오류를 보고한 필드가 없으면 true를 반환해요.',
              ja: 'ネイティブの詳細な検証 API で検証し、エラーを報告したフィールドがなければ true を返します。',
            },
          },
          {
            name: 'reset()',
            type: 'void',
            purpose: {
              en: 'Restores the native field values and fires `onChanged` with the new snapshot.',
              ko: '네이티브 필드 값을 되돌리고 새 스냅샷으로 `onChanged`를 호출해요.',
              ja: 'ネイティブのフィールド値を戻し、新しいスナップショットで `onChanged` を呼びます。',
            },
          },
          {
            name: 'TRForm.maybeOf',
            type: 'TRFormState? Function(BuildContext)',
            purpose: {
              en: 'Finds the enclosing form state from a descendant, or returns null outside a `TRForm`.',
              ko: '하위 위젯에서 감싸는 폼 상태를 찾고, `TRForm` 밖에서는 null을 반환해요.',
              ja: '子孫ウィジェットから外側のフォーム状態を探し、`TRForm` の外では null を返します。',
            },
          },
        ],
      },
      {
        title: {
          en: 'TRFormValues members',
          ko: 'TRFormValues 멤버',
          ja: 'TRFormValues のメンバー',
        },
        rows: [
          {
            name: 'operator []',
            type: 'Object? Function(String name)',
            purpose: {
              en: 'Reads one field value by name, or null when the name is absent.',
              ko: '이름으로 필드 값 하나를 읽고, 이름이 없으면 null을 반환해요.',
              ja: '名前でフィールド値を 1 つ読み取り、その名前がなければ null を返します。',
            },
          },
          {
            name: 'contains',
            type: 'bool Function(String name)',
            purpose: {
              en: 'Reports whether the snapshot holds the name. A disabled field is absent even when it is mounted.',
              ko: '스냅샷이 그 이름을 담고 있는지 알려줘요. 비활성 필드는 화면에 있어도 빠져 있어요.',
              ja: 'スナップショットがその名前を持つかどうかを示します。無効なフィールドは表示されていても含まれません。',
            },
          },
          {
            name: 'entries',
            type: 'Iterable<MapEntry<String, Object?>>',
            purpose: {
              en: 'Iterates the collected name and value pairs.',
              ko: '수집한 이름과 값 쌍을 순회해요.',
              ja: '収集した名前と値の組を反復します。',
            },
          },
          {
            name: 'toMap()',
            type: 'Map<String, Object?>',
            purpose: {
              en: 'Copies the snapshot into a plain map for encoding or transport.',
              ko: '인코딩이나 전송을 위해 스냅샷을 일반 맵으로 복사해요.',
              ja: 'エンコードや送信のために、スナップショットを通常のマップへコピーします。',
            },
          },
        ],
      },
    ],
  },
  menubar: {
    title: 'Menubar',
    description: {
      en: 'Coordinate horizontal application menus with arrow-key movement and cascading items.',
      ko: '방향키 이동과 중첩 항목을 지원하는 가로 애플리케이션 메뉴를 구성해요.',
      ja: '矢印キー移動と階層項目に対応した横並びのアプリケーションメニューを構成します。',
    },
    contractRows: [
      {
        axis: { en: 'Composition', ko: '구성', ja: '構成' },
        choices: {
          en: '`TRMenubar` lays out ordered `TRMenubarMenu` entries horizontally. Each entry owns one trigger and one popup child list.',
          ko: '`TRMenubar`는 순서가 있는 `TRMenubarMenu`를 가로로 배치해요. 각 항목은 트리거 하나와 팝업 자식 목록 하나를 가져요.',
          ja: '`TRMenubar` は順序付きの `TRMenubarMenu` を横方向に配置します。各項目は1つのトリガーとポップアップの子リストを持ちます。',
        },
      },
      {
        axis: { en: 'Keyboard', ko: '키보드', ja: 'キーボード' },
        choices: {
          en: 'Material menu traversal coordinates arrow keys across top-level triggers and nested submenus. Escape closes the active cascade.',
          ko: 'Material 메뉴 탐색이 상위 트리거와 중첩 메뉴 사이의 방향키 이동을 조정해요. Escape는 열린 메뉴 묶음을 닫아요.',
          ja: 'Material のメニュー操作により、上位トリガーとネストしたサブメニューを方向キーで移動できます。Escape は開いているメニュー階層を閉じます。',
        },
      },
      {
        axis: { en: 'Availability', ko: '사용 가능 여부', ja: '利用可否' },
        choices: {
          en: 'Set `enabled: false` on one `TRMenubarMenu` to remove its commands without disabling sibling menus.',
          ko: '한 `TRMenubarMenu`에 `enabled: false`를 지정하면 다른 메뉴는 유지하면서 해당 명령만 사용할 수 없게 해요.',
          ja: '1つの `TRMenubarMenu` に `enabled: false` を指定すると、ほかのメニューを保ったまま、そのコマンドだけを無効にできます。',
        },
      },
      {
        axis: { en: 'Nested layers', ko: '중첩 레이어', ja: 'ネストレイヤー' },
        choices: {
          en: 'Place `TRMenuSubmenu` entries inside `menuChildren`; each nested popup keeps its own bordered layer surface.',
          ko: '`menuChildren` 안에 `TRMenuSubmenu`를 넣으세요. 중첩된 각 팝업은 자체 테두리가 있는 레이어 표면을 유지해요.',
          ja: '`menuChildren` に `TRMenuSubmenu` を配置します。ネストした各ポップアップは、それぞれ枠線付きのレイヤー面を保ちます。',
        },
      },
    ],
    contractIntro: {
      en: 'Give the menubar a `semanticLabel` that names the command group. Menubar and active triggers are borderless; popup layers retain their border, while focused items use a background highlight without changing border geometry.',
      ko: '명령 그룹을 설명하는 `semanticLabel`을 메뉴바에 지정하세요. 메뉴바와 활성 트리거에는 테두리가 없고 팝업 레이어는 테두리를 유지해요. 초점 항목은 테두리 크기를 바꾸지 않고 배경으로 강조해요.',
      ja: 'コマンドグループを示す `semanticLabel` をメニューバーに指定してください。メニューバーとアクティブなトリガーに枠線はなく、ポップアップレイヤーは枠線を保ちます。フォーカス項目は枠線の寸法を変えず、背景で強調します。',
    },
    usage: {
      en: "TRMenubar(\n  semanticLabel: 'Application menu',\n  menus: [\n    TRMenubarMenu(\n      trigger: const Text('File'),\n      menuChildren: [\n        TRMenuItem(onPressed: createRack, child: const Text('New rack')),\n        TRMenuItem(onPressed: openRack, child: const Text('Open')),\n      ],\n    ),\n  ],\n)",
      ko: "TRMenubar(\n  semanticLabel: '애플리케이션 메뉴',\n  menus: [\n    TRMenubarMenu(\n      trigger: const Text('파일'),\n      menuChildren: [\n        TRMenuItem(onPressed: createRack, child: const Text('새 랙')),\n        TRMenuItem(onPressed: openRack, child: const Text('열기')),\n      ],\n    ),\n  ],\n)",
      ja: "TRMenubar(\n  semanticLabel: 'アプリケーションメニュー',\n  menus: [\n    TRMenubarMenu(\n      trigger: const Text('ファイル'),\n      menuChildren: [\n        TRMenuItem(onPressed: createRack, child: const Text('新規ラック')),\n        TRMenuItem(onPressed: openRack, child: const Text('開く')),\n      ],\n    ),\n  ],\n)",
    },
    apiGroups: [
      {
        title: {
          en: 'TRMenubar properties',
          ko: 'TRMenubar 속성',
          ja: 'TRMenubar のプロパティ',
        },
        rows: [
          {
            name: 'menus',
            type: 'List<TRMenubarMenu> · required',
            purpose: {
              en: 'Defines the ordered top-level menus.',
              ko: '순서가 있는 상위 메뉴를 정의해요.',
              ja: '順序付きの上位メニューを定義します。',
            },
          },
          {
            name: 'semanticLabel',
            type: 'String? · null',
            purpose: {
              en: 'Names the application command group for assistive technology.',
              ko: '보조 기술에 애플리케이션 명령 그룹의 이름을 제공해요.',
              ja: '支援技術にアプリケーションコマンドグループの名前を伝えます。',
            },
          },
        ],
      },
      {
        title: {
          en: 'TRMenubarMenu properties',
          ko: 'TRMenubarMenu 속성',
          ja: 'TRMenubarMenu のプロパティ',
        },
        rows: [
          {
            name: 'trigger',
            type: 'Widget · required',
            purpose: {
              en: 'Renders the top-level menu label.',
              ko: '상위 메뉴 레이블을 렌더링해요.',
              ja: '上位メニューのラベルを表示します。',
            },
          },
          {
            name: 'menuChildren',
            type: 'List<Widget> · required',
            purpose: {
              en: 'Provides commands, settings, separators, and nested submenus for the popup.',
              ko: '팝업에 표시할 명령, 설정, 구분선, 중첩 메뉴를 제공해요.',
              ja: 'ポップアップに表示するコマンド、設定、区切り線、ネストしたサブメニューを指定します。',
            },
          },
          {
            name: 'enabled',
            type: 'bool · true',
            purpose: {
              en: 'Controls whether the trigger can open its menu.',
              ko: '트리거가 메뉴를 열 수 있는지 정해요.',
              ja: 'トリガーからメニューを開けるかを制御します。',
            },
          },
          {
            name: 'controller',
            type: 'MenuController? · null',
            purpose: {
              en: 'Lets the parent open, close, or inspect this menu.',
              ko: '부모에서 이 메뉴를 열고 닫거나 상태를 확인할 수 있게 해요.',
              ja: '親からこのメニューを開閉したり、状態を確認したりできます。',
            },
          },
          {
            name: 'focusNode',
            type: 'FocusNode? · null',
            purpose: {
              en: 'Lets the parent coordinate focus for the top-level trigger.',
              ko: '부모에서 상위 트리거의 초점을 조정할 수 있게 해요.',
              ja: '親から上位トリガーのフォーカスを制御できます。',
            },
          },
          {
            name: 'onOpen / onClose',
            type: 'VoidCallback? · null',
            purpose: {
              en: 'Reports this menu opening and closing.',
              ko: '이 메뉴가 열리고 닫힐 때 알려 줘요.',
              ja: 'このメニューが開閉したときに通知します。',
            },
          },
        ],
      },
    ],
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
    usage:
      "TROtpField(\n  label: 'Verification code',\n  length: 6,\n  helperText: 'Enter the code we sent to your device.',\n  onCompleted: verifyCode,\n)",
    contractIntro: {
      en: 'Reach for `TROtpField` when the reader transcribes a short fixed-length code from another device. Use `TRTextField` for anything longer or free-form.',
      ko: '다른 기기에 온 짧은 고정 길이 코드를 옮겨 적을 때 `TROtpField`를 쓰세요. 더 길거나 자유로운 입력에는 `TRTextField`를 쓰세요.',
      ja: '別のデバイスに届いた短い固定長のコードを書き写す場面では `TROtpField` を使ってください。より長い入力や自由入力には `TRTextField` を使います。',
    },
    contractRows: [
      {
        axis: { en: 'Value', ko: '값', ja: '値' },
        choices: {
          en: 'The default constructor is uncontrolled: seed it with `defaultValue`, or pass a `TROtpFieldController` to read and clear the code from outside. `TROtpField.controlled` takes `value` instead and expects you to store the next code from `onValueChange`.',
          ko: '기본 생성자는 비제어 방식이에요. `defaultValue`로 초기값을 주거나, `TROtpFieldController`를 넘겨 바깥에서 코드를 읽고 지우세요. `TROtpField.controlled`는 대신 `value`를 받고, `onValueChange`로 전달된 다음 코드를 직접 보관해야 해요.',
          ja: 'デフォルトのコンストラクタは非制御です。`defaultValue` で初期値を与えるか、`TROtpFieldController` を渡して外部からコードを読み取ったり消去したりしてください。`TROtpField.controlled` は代わりに `value` を受け取り、`onValueChange` で渡された次のコードを自分で保持する必要があります。',
        },
      },
      {
        axis: { en: 'Input', ko: '입력', ja: '入力' },
        choices: {
          en: 'One hidden `TextField` sits under the slots, so typing, pasting a whole code, deleting, and platform autofill through `AutofillHints.oneTimeCode` all act on the full value. Entry always appends at the end; there is no per-slot caret to move between.',
          ko: '슬롯 아래에 숨겨진 `TextField` 하나가 있어서 입력, 코드 전체 붙여넣기, 삭제, `AutofillHints.oneTimeCode`를 통한 플랫폼 자동 완성이 모두 값 전체에 적용돼요. 입력은 항상 끝에 덧붙고, 슬롯마다 옮겨 다니는 커서는 없어요.',
          ja: 'スロットの下に隠れた `TextField` が 1 つあり、入力、コード全体の貼り付け、削除、`AutofillHints.oneTimeCode` によるプラットフォームの自動入力は、いずれも値全体に作用します。入力は常に末尾へ追加され、スロットごとに移動するキャレットはありません。',
        },
      },
      {
        axis: {
          en: 'Accepted characters',
          ko: '허용 문자',
          ja: '受け付ける文字',
        },
        choices: {
          en: '`allowedPattern` defaults to `RegExp("[0-9]")` and is enforced by a `FilteringTextInputFormatter`, so anything else is dropped as it arrives. Rejection is silent: there is no invalid-input callback, so state the expected format in `helperText`.',
          ko: '`allowedPattern`은 기본값이 `RegExp("[0-9]")`이고 `FilteringTextInputFormatter`로 강제되므로 그 밖의 문자는 들어오는 즉시 버려져요. 거부는 조용히 일어나고 별도의 콜백이 없으니, 기대하는 형식을 `helperText`로 알려 주세요.',
          ja: '`allowedPattern` の既定値は `RegExp("[0-9]")` で、`FilteringTextInputFormatter` によって適用されるため、それ以外の文字は入力時に破棄されます。拒否は通知されず専用のコールバックもないため、期待する形式は `helperText` で示してください。',
        },
      },
      {
        axis: { en: 'Length and size', ko: '길이와 크기', ja: '長さとサイズ' },
        choices: {
          en: '`length` clamps the value and decides when `onCompleted` fires. `uiSize` scales the square slots along the shared control height scale, so `md` and `lg` line up with a neighboring `TRTextField` or `TRButton` of the same size.',
          ko: '`length`는 값을 잘라내고 `onCompleted`가 호출되는 시점을 결정해요. `uiSize`는 공용 컨트롤 높이 스케일에 맞춰 정사각형 슬롯 크기를 조절하므로, `md`·`lg`가 같은 크기의 `TRTextField`나 `TRButton`과 나란히 맞아요.',
          ja: '`length` は値を切り詰め、`onCompleted` が呼ばれるタイミングを決めます。`uiSize` は共通のコントロール高さスケールに沿って正方形スロットを拡縮するため、`md`・`lg` が同じサイズの `TRTextField` や `TRButton` と揃います。',
        },
      },
    ],
    apiGroups: [
      {
        title: {
          en: 'TROtpField properties',
          ko: 'TROtpField 속성',
          ja: 'TROtpField のプロパティ',
        },
        rows: [
          {
            name: 'length',
            type: 'int · 6',
            purpose: {
              en: 'Sets the slot count, clamps the value to that many characters, and gates `onCompleted`. Must be greater than zero.',
              ko: '슬롯 개수를 정하고 값을 그 길이로 잘라내며 `onCompleted` 호출 조건이 돼요. 0보다 커야 해요.',
              ja: 'スロット数を決め、値をその長さに切り詰め、`onCompleted` の発火条件になります。0 より大きい必要があります。',
            },
          },
          {
            name: 'defaultValue',
            type: "String · ''",
            purpose: {
              en: 'Seeds the uncontrolled default constructor. Ignored by `TROtpField.controlled`.',
              ko: '비제어 기본 생성자의 초기값이에요. `TROtpField.controlled`에서는 무시돼요.',
              ja: '非制御のデフォルトコンストラクタの初期値です。`TROtpField.controlled` では無視されます。',
            },
          },
          {
            name: 'value',
            type: 'String · required on .controlled',
            purpose: {
              en: 'Drives the rendered code in the controlled constructor. Pair it with `onValueChange` and store the next code yourself.',
              ko: '제어 생성자에서 표시할 코드를 결정해요. `onValueChange`와 함께 쓰면서 다음 코드를 직접 보관하세요.',
              ja: '制御コンストラクタで表示するコードを決めます。`onValueChange` と組み合わせ、次のコードは自分で保持してください。',
            },
          },
          {
            name: 'controller',
            type: 'TROtpFieldController? · null',
            purpose: {
              en: 'Reads, replaces, or clears the code from outside the widget without switching to the controlled constructor.',
              ko: '제어 생성자로 바꾸지 않고도 위젯 바깥에서 코드를 읽거나 교체하거나 지울 수 있어요.',
              ja: '制御コンストラクタに切り替えることなく、ウィジェットの外からコードの読み取り・置き換え・消去ができます。',
            },
          },
          {
            name: 'onValueChange',
            type: 'ValueChanged<String>? · null',
            purpose: {
              en: 'Fires on every accepted edit with the clamped value. Filtered-out characters never reach it.',
              ko: '허용된 편집마다 잘린 값과 함께 호출돼요. 걸러진 문자는 전달되지 않아요.',
              ja: '受け付けた編集ごとに、切り詰めた値とともに呼ばれます。除外された文字は渡りません。',
            },
          },
          {
            name: 'onCompleted',
            type: 'ValueChanged<String>? · null',
            purpose: {
              en: 'Fires when the value reaches `length`, including when a paste fills the field in one step. It runs on every edit that leaves the field full, so make the callback safe to repeat.',
              ko: '값이 `length`에 도달할 때 호출되고, 붙여넣기로 한 번에 채워질 때도 호출돼요. 값이 가득 찬 채로 이뤄지는 모든 편집에서 실행되므로 반복 호출에 안전하게 작성하세요.',
              ja: '値が `length` に達したときに呼ばれ、貼り付けで一度に埋まった場合も同様です。フィールドが満たされたままの編集ごとに実行されるため、繰り返し呼ばれても安全な処理にしてください。',
            },
          },
          {
            name: 'allowedPattern',
            type: 'Pattern? · RegExp("[0-9]")',
            purpose: {
              en: 'Restricts accepted characters. Widen it for alphanumeric codes, for example `RegExp("[A-Z0-9]")`.',
              ko: '허용 문자를 제한해요. 영숫자 코드라면 `RegExp("[A-Z0-9]")`처럼 범위를 넓히세요.',
              ja: '受け付ける文字を制限します。英数字のコードには `RegExp("[A-Z0-9]")` のように範囲を広げてください。',
            },
          },
          {
            name: 'obscureText',
            type: 'bool · false',
            purpose: {
              en: 'Replaces each filled slot with a bullet and stops the value from being exposed through `Semantics`.',
              ko: '채워진 슬롯을 점으로 대체하고, `Semantics`로 값이 노출되지 않게 해요.',
              ja: '入力済みのスロットを丸印に置き換え、`Semantics` から値が公開されないようにします。',
            },
          },
          {
            name: 'uiSize',
            type: 'TRUiSize · TRUiSize.md',
            purpose: {
              en: 'Scales the square slots and the default gap to the `md` or `lg` control height. A `separatorBuilder` replaces the gap entirely, so size it yourself there.',
              ko: '정사각형 슬롯과 기본 간격을 `md`·`lg` 컨트롤 높이에 맞춰 조절해요. `separatorBuilder`는 간격을 완전히 대체하므로, 그 안에서 직접 크기를 정하세요.',
              ja: '正方形スロットと既定の間隔を `md`・`lg` のコントロール高さに合わせて拡縮します。`separatorBuilder` は間隔をすべて置き換えるため、その中で自分でサイズを決めてください。',
            },
          },
          {
            name: 'label',
            type: 'String? · null',
            purpose: {
              en: 'Renders an uppercased caption above the slots and names the field for assistive technology unless `semanticLabel` overrides it.',
              ko: '슬롯 위에 대문자 캡션을 표시하고, `semanticLabel`이 없으면 보조 기술에도 이 이름을 전달해요.',
              ja: 'スロットの上に大文字のキャプションを表示し、`semanticLabel` がなければ支援技術にもこの名前を伝えます。',
            },
          },
          {
            name: 'semanticLabel',
            type: 'String? · null',
            purpose: {
              en: 'Takes precedence over `label` for assistive technology. Use it when the visible caption is too terse to stand alone.',
              ko: '보조 기술에서는 `label`보다 우선해요. 눈에 보이는 캡션만으로는 설명이 부족할 때 쓰세요.',
              ja: '支援技術では `label` より優先されます。見えているキャプションだけでは説明が足りない場合に使ってください。',
            },
          },
          {
            name: 'helperText',
            type: 'String? · null',
            purpose: {
              en: 'Shows muted supporting text below the slots. `errorText` replaces it while an error is present.',
              ko: '슬롯 아래에 흐린 보조 텍스트를 표시해요. 오류가 있는 동안에는 `errorText`가 대신 표시돼요.',
              ja: 'スロットの下に控えめな補足テキストを表示します。エラーがある間は `errorText` に置き換わります。',
            },
          },
          {
            name: 'errorText',
            type: 'String? · null',
            purpose: {
              en: 'Switches the slot borders to the danger color and replaces the supporting line. A non-null value marks the field invalid on its own; validation stays yours to run.',
              ko: '슬롯 테두리를 위험 색으로 바꾸고 보조 문구를 대체해요. null이 아니면 그 자체로 오류 상태가 되며, 검증은 직접 수행해야 해요.',
              ja: 'スロットの枠線をデンジャー色に変え、補足行を置き換えます。null でなければそれだけでエラー状態になり、検証自体は自分で行います。',
            },
          },
          {
            name: 'enabled',
            type: 'bool · true',
            purpose: {
              en: 'When false, mutes the slots, blocks tap-to-focus and editing, and dims the label.',
              ko: 'false이면 슬롯을 흐리게 하고 탭 포커스와 편집을 막으며 레이블도 흐려져요.',
              ja: 'false のとき、スロットを淡くし、タップによるフォーカスと編集を止め、ラベルも淡くします。',
            },
          },
          {
            name: 'readOnly',
            type: 'bool · false',
            purpose: {
              en: 'Keeps the field focusable and its value visible while rejecting edits. Use it for a code the reader should see but not change.',
              ko: '값을 보여 주고 포커스도 유지하면서 편집만 막아요. 읽기만 하고 바꾸면 안 되는 코드에 쓰세요.',
              ja: '値を表示しフォーカスも保ったまま、編集だけを拒否します。読むだけで変更させないコードに使ってください。',
            },
          },
          {
            name: 'autofocus',
            type: 'bool · false',
            purpose: {
              en: 'Focuses the field on first build. Use it only when the code entry is the sole purpose of the screen.',
              ko: '첫 빌드에서 포커스를 잡아요. 코드 입력이 화면의 유일한 목적일 때만 쓰세요.',
              ja: '最初のビルドでフォーカスします。コード入力が画面の唯一の目的である場合にのみ使ってください。',
            },
          },
          {
            name: 'separatorBuilder',
            type: 'TROtpSeparatorBuilder? · null',
            purpose: {
              en: 'Replaces the gap after slot `index`. Return a plain `SizedBox` for the seams that should stay empty; returning nothing is not an option.',
              ko: '`index` 슬롯 뒤의 간격을 대체해요. 비워 둘 자리에는 일반 `SizedBox`를 반환하세요. 아무것도 반환하지 않을 수는 없어요.',
              ja: '`index` 番目のスロットの後ろの間隔を置き換えます。空けたい箇所では通常の `SizedBox` を返してください。何も返さないことはできません。',
            },
          },
        ],
      },
      {
        title: {
          en: 'TROtpFieldController',
          ko: 'TROtpFieldController',
          ja: 'TROtpFieldController',
        },
        rows: [
          {
            name: 'value',
            type: 'String',
            purpose: {
              en: 'Reads or replaces the current code. Assigning notifies listeners and re-renders the slots; assigning the same string is a no-op.',
              ko: '현재 코드를 읽거나 교체해요. 값을 넣으면 리스너에 알리고 슬롯을 다시 그리며, 같은 문자열을 넣으면 아무 일도 일어나지 않아요.',
              ja: '現在のコードを読み取り、または置き換えます。代入するとリスナーへ通知してスロットを再描画しますが、同じ文字列の代入は何もしません。',
            },
          },
          {
            name: 'clear()',
            type: 'void',
            purpose: {
              en: 'Empties the field. Pair it with a Retry action after a rejected code.',
              ko: '입력을 비워요. 코드가 거부된 뒤의 다시 시도 동작과 함께 쓰세요.',
              ja: '入力を空にします。コードが拒否された後の再試行操作と組み合わせて使ってください。',
            },
          },
        ],
      },
      {
        title: {
          en: 'TROtpFieldFormField',
          ko: 'TROtpFieldFormField',
          ja: 'TROtpFieldFormField',
        },
        rows: [
          {
            name: 'initialValue',
            type: "String · ''",
            purpose: {
              en: 'Seeds the `FormField` state, which owns the value from then on.',
              ko: '`FormField` 상태의 초기값이에요. 이후 값은 `FormField`가 관리해요.',
              ja: '`FormField` の状態の初期値です。以後の値は `FormField` が保持します。',
            },
          },
          {
            name: 'validator',
            type: 'FormFieldValidator<String>? · null',
            purpose: {
              en: 'Returns the message to show as `errorText`. Return `null` once the code is acceptable.',
              ko: '`errorText`로 표시할 메시지를 반환해요. 코드가 올바르면 `null`을 반환하세요.',
              ja: '`errorText` として表示するメッセージを返します。コードが正しければ `null` を返してください。',
            },
          },
          {
            name: 'autovalidateMode',
            type: 'AutovalidateMode? · null',
            purpose: {
              en: 'Chooses when the validator runs. `onUserInteraction` reports a short code as soon as the reader edits it.',
              ko: '검증 시점을 정해요. `onUserInteraction`은 사용자가 편집하는 즉시 짧은 코드를 알려 줘요.',
              ja: '検証を実行するタイミングを決めます。`onUserInteraction` は編集した時点で短いコードを知らせます。',
            },
          },
          {
            name: 'onSaved',
            type: 'FormFieldSetter<String>? · null',
            purpose: {
              en: 'Receives the code when the surrounding `Form` is saved.',
              ko: '상위 `Form`이 저장될 때 코드를 전달받아요.',
              ja: '外側の `Form` が保存されたときにコードを受け取ります。',
            },
          },
          {
            name: 'restorationId',
            type: 'String? · null',
            purpose: {
              en: 'Restores the entered code after the platform recreates the route.',
              ko: '플랫폼이 라우트를 다시 만든 뒤 입력한 코드를 복원해요.',
              ja: 'プラットフォームがルートを再生成した後、入力済みのコードを復元します。',
            },
          },
        ],
      },
    ],
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
    usage:
      "TRSlider.controlled(\n  label: 'Traffic',\n  value: traffic,\n  onValueChange: (value) => setState(() => traffic = value),\n)",
    contractIntro: {
      en: 'Reach for `TRSlider` when the reader picks an approximate value along a known scale, such as a volume or a traffic share. Use `TRTextField` or `TRNumberField` when the exact number matters more than the position.',
      ko: '볼륨이나 트래픽 비중처럼 알려진 범위에서 대략적인 값을 고를 때 `TRSlider`를 쓰세요. 위치보다 정확한 숫자가 중요하다면 `TRTextField`나 `TRNumberField`를 쓰세요.',
      ja: '音量やトラフィックの割合のように、既知の範囲からおおよその値を選ぶ場合に `TRSlider` を使ってください。位置よりも正確な数値が重要な場合は `TRTextField` や `TRNumberField` を使ってください。',
    },
    contractRows: [
      {
        axis: { en: 'Value', ko: '값', ja: '値' },
        choices: {
          en: '`TRSlider` carries a single `double`. Ranges are a separate widget, `TRRangeSlider`, which carries a `RangeValues`. Each widget has an uncontrolled constructor taking `defaultValue` and a `.controlled` constructor taking `value`.',
          ko: '`TRSlider`는 `double` 하나를 다뤄요. 범위는 `RangeValues`를 다루는 별도 위젯인 `TRRangeSlider`예요. 두 위젯 모두 `defaultValue`를 받는 비제어 생성자와 `value`를 받는 `.controlled` 생성자가 있어요.',
          ja: '`TRSlider` は単一の `double` を扱います。範囲は `RangeValues` を扱う別のウィジェット `TRRangeSlider` です。どちらのウィジェットにも、`defaultValue` を受け取る非制御コンストラクタと `value` を受け取る `.controlled` コンストラクタがあります。',
        },
      },
      {
        axis: { en: 'Range', ko: '범위', ja: '範囲' },
        choices: {
          en: '`min`, `max`, and `step` bound and snap every pointer and keyboard change. On `TRRangeSlider`, `minGap` is a distance in value units, not a step count, and the thumb being driven absorbs it. Thumbs stop at each other instead of pushing or swapping.',
          ko: '`min`, `max`, `step`이 포인터와 키보드 변경을 모두 제한하고 눈금에 맞춰요. `TRRangeSlider`의 `minGap`은 스텝 개수가 아니라 값 단위의 거리이고, 움직이는 쪽 썸이 그 간격을 흡수해요. 두 썸은 서로를 밀거나 교차하지 않고 맞닿는 지점에서 멈춰요.',
          ja: '`min`、`max`、`step` がポインターとキーボードによる変更を制限し、目盛りに合わせます。`TRRangeSlider` の `minGap` はステップ数ではなく値の距離で、動かしている側のつまみがその間隔を吸収します。2 つのつまみは互いを押したり入れ替わったりせず、接する位置で止まります。',
        },
      },
      {
        axis: { en: 'Form', ko: '폼', ja: 'フォーム' },
        choices: {
          en: 'There is no `name` and no hidden input. Put `TRSliderFormField` or `TRRangeSliderFormField` inside a Flutter `Form` and read the value through `validator`, `onSaved`, and `FormState`.',
          ko: '`name`이나 숨은 입력 요소는 없어요. Flutter `Form` 안에 `TRSliderFormField`나 `TRRangeSliderFormField`를 두고 `validator`, `onSaved`, `FormState`로 값을 다루세요.',
          ja: '`name` や隠し入力はありません。Flutter の `Form` の中に `TRSliderFormField` または `TRRangeSliderFormField` を置き、`validator`、`onSaved`、`FormState` を通して値を扱ってください。',
        },
      },
      {
        axis: { en: 'Validation', ko: '검증', ja: '検証' },
        choices: {
          en: 'Validation rules live on the form field. It passes its message down as `errorText`, which prints below the track and tints the filled part of it. Set `autovalidateMode` to decide whether the message appears before the first submit. Outside a `Form`, pass `errorText` yourself.',
          ko: '검증 규칙은 폼 필드가 가져요. 폼 필드는 메시지를 `errorText`로 내려보내고, 그 문구가 트랙 아래에 표시되면서 채워진 부분에 오류 색이 입혀져요. 첫 제출 전에 메시지를 보일지는 `autovalidateMode`로 정하세요. `Form` 밖에서는 `errorText`를 직접 넘기세요.',
          ja: '検証ルールはフォームフィールドが持ちます。フォームフィールドはメッセージを `errorText` として渡し、その文言がトラックの下に表示され、トラックの塗りつぶし部分にエラー色が付きます。最初の送信前にメッセージを出すかどうかは `autovalidateMode` で決めてください。`Form` の外では `errorText` を自分で渡してください。',
        },
      },
      {
        axis: { en: 'Keyboard', ko: '키보드', ja: 'キーボード' },
        choices: {
          en: 'A focused track moves by one `step` on Right and Up, and back on Left and Down. There is no large step, and Page Up, Page Down, Home, and End are not handled. On `TRRangeSlider` the arrow keys drive the thumb the last pointer press selected, which starts as the lower one.',
          ko: '포커스된 트랙은 Right·Up에서 `step`만큼 올라가고 Left·Down에서 같은 만큼 내려가요. 큰 단위 이동은 없고 Page Up, Page Down, Home, End는 처리하지 않아요. `TRRangeSlider`에서는 마지막 포인터 입력이 고른 썸을 방향키가 움직이고, 처음에는 아래쪽 썸이에요.',
          ja: 'フォーカスされたトラックは Right・Up で `step` 分進み、Left・Down で同じだけ戻ります。大きい単位の移動はなく、Page Up、Page Down、Home、End は処理されません。`TRRangeSlider` では、直前のポインター操作で選ばれたつまみを矢印キーが動かします。初期状態では下側のつまみです。',
        },
      },
      {
        axis: { en: 'Labeling', ko: '레이블', ja: 'ラベル' },
        choices: {
          en: '`label` draws a heading row above the track with the current value beside it, and `labelBuilder` formats that value for both the visible text and the semantics. Set `semanticLabel` when the accessible name should differ from the visible one, or when there is no visible label.',
          ko: '`label`은 트랙 위에 현재 값을 함께 보여주는 제목 줄을 그리고, `labelBuilder`는 보이는 텍스트와 시맨틱 값 모두를 포맷해요. 접근성 이름을 보이는 레이블과 다르게 하거나 보이는 레이블이 없을 때는 `semanticLabel`을 설정하세요.',
          ja: '`label` はトラックの上に現在値を添えた見出し行を描画し、`labelBuilder` は表示テキストとセマンティクスの両方の値を整形します。アクセシブルネームを表示ラベルと変えたい場合や表示ラベルがない場合は、`semanticLabel` を設定してください。',
        },
      },
    ],
    apiGroups: [
      {
        title: {
          en: 'TRSlider properties',
          ko: 'TRSlider 속성',
          ja: 'TRSlider のプロパティ',
        },
        rows: [
          {
            name: 'defaultValue',
            type: 'double · 0',
            purpose: {
              en: 'Sets the starting value of the uncontrolled constructor. The widget then owns the value and reports each change through `onValueChange`.',
              ko: '비제어 생성자의 시작 값을 정해요. 이후에는 위젯이 값을 소유하고 변경될 때마다 `onValueChange`로 알려요.',
              ja: '非制御コンストラクタの初期値を指定します。以降はウィジェットが値を保持し、変更のたびに `onValueChange` で通知します。',
            },
          },
          {
            name: 'value',
            type: 'double? · required on .controlled',
            purpose: {
              en: 'Drives the thumb from your own state. The widget never moves on its own, so update the state inside `onValueChange`.',
              ko: '직접 관리하는 상태로 썸을 움직여요. 위젯이 스스로 값을 바꾸지 않으니 `onValueChange` 안에서 상태를 갱신하세요.',
              ja: '自分で管理する状態からつまみを動かします。ウィジェットが自ら値を変えることはないため、`onValueChange` の中で状態を更新してください。',
            },
          },
          {
            name: 'onValueChange',
            type: 'ValueChanged<double>? · null',
            purpose: {
              en: 'Fires on every pointer and keyboard change while the interaction is still in progress. There is no separate commit callback, so debounce the work yourself when a drag would be expensive.',
              ko: '조작이 진행되는 동안 포인터와 키보드 변경마다 호출돼요. 별도의 커밋 콜백은 없으니 드래그 비용이 큰 작업은 직접 디바운스하세요.',
              ja: '操作中のポインターとキーボードによる変更のたびに呼ばれます。別途のコミットコールバックはないため、ドラッグのコストが大きい処理は自分でデバウンスしてください。',
            },
          },
          {
            name: 'min, max, step',
            type: 'double · 0, 100, 1',
            purpose: {
              en: 'Define the scale. Values are clamped to the bounds and snapped to the nearest step. The constructors assert `min < max` and `step > 0`.',
              ko: '범위를 정해요. 값은 경계 안으로 잘리고 가장 가까운 스텝에 맞춰져요. 생성자는 `min < max`와 `step > 0`을 단언해요.',
              ja: 'スケールを定義します。値は境界内に収められ、最も近いステップに揃えられます。コンストラクタは `min < max` と `step > 0` をアサートします。',
            },
          },
          {
            name: 'label',
            type: 'String? · null',
            purpose: {
              en: 'Adds a heading row above the track showing the label and the current value. Leave it `null` for a bare track, and give the control a `semanticLabel` instead.',
              ko: '트랙 위에 레이블과 현재 값을 보여주는 제목 줄을 더해요. `null`로 두면 트랙만 남으니 대신 `semanticLabel`을 주세요.',
              ja: 'トラックの上にラベルと現在値を表示する見出し行を追加します。`null` にするとトラックだけになるため、代わりに `semanticLabel` を指定してください。',
            },
          },
          {
            name: 'labelBuilder',
            type: 'TRSliderLabelBuilder? · null',
            purpose: {
              en: 'Formats the value for the heading row and the semantics value. Use it for units and percentages; whole numbers otherwise print without a decimal part.',
              ko: '제목 줄과 시맨틱 값에 쓰일 값을 포맷해요. 단위나 백분율에 사용하세요. 지정하지 않으면 정수는 소수점 없이 표시돼요.',
              ja: '見出し行とセマンティクスの値を整形します。単位や百分率に使ってください。指定しない場合、整数は小数部なしで表示されます。',
            },
          },
          {
            name: 'semanticLabel',
            type: 'String? · null',
            purpose: {
              en: 'Names the control for assistive technology. It falls back to `label`, so set it when the visible label is missing or too terse to stand alone.',
              ko: '보조 기술에 컨트롤 이름을 알려줘요. 지정하지 않으면 `label`을 따르니, 보이는 레이블이 없거나 그것만으로 뜻이 불분명할 때 설정하세요.',
              ja: '支援技術に対してコントロールの名前を伝えます。未指定の場合は `label` にフォールバックするため、表示ラベルがない場合や、それだけでは意味が伝わらない場合に設定してください。',
            },
          },
          {
            name: 'errorText',
            type: 'String? · null',
            purpose: {
              en: 'Prints a danger-toned message below the track and tints the filled part of it. `TRSliderFormField` supplies this from its validator, so set it directly only outside a `Form`.',
              ko: '트랙 아래에 오류 색 메시지를 표시하고 채워진 부분에도 그 색을 입혀요. `TRSliderFormField`가 검증기에서 이 값을 넘겨주므로, 직접 설정하는 건 `Form` 밖일 때만 하세요.',
              ja: 'トラックの下にエラー色のメッセージを表示し、トラックの塗りつぶし部分にも同じ色を適用します。`TRSliderFormField` がバリデータからこの値を渡すため、直接指定するのは `Form` の外の場合だけにしてください。',
            },
          },
          {
            name: 'uiSize',
            type: 'TRUiSize · TRUiSize.md',
            purpose: {
              en: 'Scales the thumb and the space reserved around the track. The track thickness stays the same at every size. Use `TRUiSize.md` on dense surfaces.',
              ko: '썸과 트랙 주변에 확보되는 공간의 크기를 조절해요. 트랙 두께는 모든 크기에서 같아요. 밀도가 높은 화면에는 `TRUiSize.md`을 쓰세요.',
              ja: 'つまみとトラック周辺に確保される領域の大きさを調整します。トラックの太さはどのサイズでも同じです。密度の高い画面では `TRUiSize.md` を使ってください。',
            },
          },
          {
            name: 'vertical',
            type: 'bool · false',
            purpose: {
              en: 'Turns the track upright, with the maximum at the top. A vertical slider takes a fixed width and fills the height its parent gives it, so constrain that height.',
              ko: '트랙을 세로로 세우고 최댓값을 위쪽에 둬요. 세로 슬라이더는 고정 너비를 쓰고 부모가 주는 높이를 채우니 그 높이를 제약하세요.',
              ja: 'トラックを縦向きにし、最大値を上端に配置します。縦スライダーは固定幅を取り、親から与えられた高さいっぱいに広がるため、その高さを制約してください。',
            },
          },
          {
            name: 'enabled',
            type: 'bool · true',
            purpose: {
              en: 'Blocks pointer and keyboard changes and drops the increase and decrease actions from the semantics node. The value stays visible. Flutter uses `enabled`, not the `disabled` prop the React page documents.',
              ko: '포인터와 키보드 변경을 막고 시맨틱 노드에서 증가·감소 동작을 없애요. 값은 계속 보여요. Flutter는 React 문서의 `disabled` 대신 `enabled`를 써요.',
              ja: 'ポインターとキーボードによる変更を止め、セマンティクスノードから増減アクションを取り除きます。値は表示されたままです。Flutter では React ページの `disabled` ではなく `enabled` を使います。',
            },
          },
        ],
      },
      {
        title: {
          en: 'TRRangeSlider properties',
          ko: 'TRRangeSlider 속성',
          ja: 'TRRangeSlider のプロパティ',
        },
        rows: [
          {
            name: 'defaultValue',
            type: 'RangeValues · RangeValues(25, 75)',
            purpose: {
              en: 'Sets the starting pair for the uncontrolled constructor. The `.controlled` constructor takes `value` instead and requires it.',
              ko: '비제어 생성자의 시작 쌍을 정해요. `.controlled` 생성자는 대신 `value`를 받고 이 값은 필수예요.',
              ja: '非制御コンストラクタの初期値の組を指定します。`.controlled` コンストラクタは代わりに `value` を受け取り、これは必須です。',
            },
          },
          {
            name: 'minGap',
            type: 'double · 0',
            purpose: {
              en: 'Keeps the thumbs at least this far apart in value units. The thumb being driven stops at the gap; the other one stays where the reader put it.',
              ko: '두 썸 사이를 값 단위로 최소 이만큼 벌려요. 움직이는 썸이 그 간격에서 멈추고, 나머지 썸은 원래 자리에 남아요.',
              ja: '2 つのつまみを値の単位で少なくともこの分だけ離します。動かしているつまみが間隔の位置で止まり、もう一方は読み手が置いた位置に留まります。',
            },
          },
          {
            name: 'onValueChange',
            type: 'ValueChanged<RangeValues>? · null',
            purpose: {
              en: 'Reports the whole pair on every change, after clamping and the minimum gap are applied.',
              ko: '경계와 최소 간격이 적용된 뒤의 값 쌍 전체를 변경마다 알려요.',
              ja: '境界と最小間隔が適用されたあとの値の組全体を、変更のたびに通知します。',
            },
          },
          {
            name: 'labelBuilder',
            type: 'TRSliderLabelBuilder? · null',
            purpose: {
              en: 'Formats each end separately. The heading row then joins the two results with an en dash, as in `20%–80%`.',
              ko: '양쪽 끝을 각각 포맷해요. 제목 줄은 두 결과를 `20%–80%`처럼 en 대시로 이어요.',
              ja: '両端をそれぞれ整形します。見出し行は 2 つの結果を `20%–80%` のように en ダッシュでつなぎます。',
            },
          },
        ],
      },
      {
        title: {
          en: 'TRSliderFormField and TRRangeSliderFormField',
          ko: 'TRSliderFormField와 TRRangeSliderFormField',
          ja: 'TRSliderFormField と TRRangeSliderFormField',
        },
        rows: [
          {
            name: 'initialValue',
            type: 'double · 0 / RangeValues · RangeValues(25, 75)',
            purpose: {
              en: 'Seeds the field. `FormState.reset` returns the slider to this value.',
              ko: '필드의 초기값이에요. `FormState.reset`은 슬라이더를 이 값으로 되돌려요.',
              ja: 'フィールドの初期値です。`FormState.reset` はスライダーをこの値に戻します。',
            },
          },
          {
            name: 'validator',
            type: 'FormFieldValidator? · null',
            purpose: {
              en: 'Returns an error message to block `FormState.validate`, or `null` to accept the value. The field forwards the message to the slider as `errorText`.',
              ko: '오류 메시지를 반환해 `FormState.validate`를 막고, `null`을 반환하면 값을 받아들여요. 폼 필드는 그 메시지를 `errorText`로 슬라이더에 전달해요.',
              ja: 'エラーメッセージを返すと `FormState.validate` を通さず、`null` を返すと値を受け入れます。フォームフィールドはそのメッセージを `errorText` としてスライダーに渡します。',
            },
          },
          {
            name: 'autovalidateMode',
            type: 'AutovalidateMode? · null',
            purpose: {
              en: 'Decides when the validator runs. `AutovalidateMode.onUserInteraction` keeps the field quiet until the reader moves the thumb, then clears the error as soon as the value becomes acceptable.',
              ko: '검증을 언제 실행할지 정해요. `AutovalidateMode.onUserInteraction`은 썸을 움직이기 전까지 조용히 있다가, 값이 조건을 만족하면 바로 오류를 지워요.',
              ja: 'バリデータを実行するタイミングを決めます。`AutovalidateMode.onUserInteraction` はつまみが動かされるまで何も表示せず、値が条件を満たした時点でエラーを消します。',
            },
          },
          {
            name: 'onSaved',
            type: 'FormFieldSetter? · null',
            purpose: {
              en: 'Receives the value when `FormState.save` runs. Use it to collect the submitted result after a successful `validate`.',
              ko: '`FormState.save`가 실행될 때 값을 받아요. `validate`를 통과한 뒤 제출 결과를 모을 때 쓰세요.',
              ja: '`FormState.save` の実行時に値を受け取ります。`validate` を通過したあと、送信結果をまとめるのに使ってください。',
            },
          },
        ],
      },
    ],
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
      en: 'Build typed, expandable navigation with selected destinations and visible nested rails.',
      ko: '선택된 목적지와 중첩 rail을 표시하는 타입 기반 확장 탐색을 구성해요.',
      ja: '選択中の移動先とネストされたレールを表示する、型付きの展開ナビゲーションを構築します。',
    },
    contractIntro: {
      en: 'Tab follows reading order. Enter and Space activate the focused row, Up and Down move between rows, and the logical expand and collapse arrow keys follow text direction. Disabled rows are skipped and ignore pointer and keyboard input.',
      ko: 'Tab은 읽기 순서를 따라요. Enter와 Space는 포커스된 행을 실행하고, 위·아래 화살표는 행 사이를 이동하며, 펼침·접힘 화살표는 텍스트 방향을 따라요. 비활성 행은 건너뛰고 포인터와 키보드 입력을 무시해요.',
      ja: 'Tab は読み順に従います。Enter と Space はフォーカス中の行を実行し、上下矢印は行間を移動し、展開・折りたたみの矢印はテキスト方向に従います。無効な行はスキップされ、ポインターとキーボード入力を無視します。',
    },
    contractRows: [
      {
        axis: { en: 'Selection', ko: '선택 상태', ja: '選択状態' },
        choices: {
          en: 'Use `defaultValue` for local selection or `TRTreeNav.controlled` with `value` and `onValueChange` for parent-owned selection.',
          ko: '로컬 선택에는 `defaultValue`를 사용하고, 부모가 선택을 관리하려면 `value`, `onValueChange`와 함께 `TRTreeNav.controlled`를 사용해요.',
          ja: 'ローカル選択には `defaultValue` を使い、親で管理する場合は `value` と `onValueChange` を指定した `TRTreeNav.controlled` を使います。',
        },
      },
      {
        axis: { en: 'Expansion', ko: '확장 상태', ja: '展開状態' },
        choices: {
          en: '`initiallyExpanded` seeds a group; `TRTreeNavController` reads or changes the live expanded set.',
          ko: '`initiallyExpanded`는 그룹의 초기 상태를 정하고, `TRTreeNavController`는 현재 펼친 집합을 읽거나 바꿔요.',
          ja: '`initiallyExpanded` はグループの初期状態を設定し、`TRTreeNavController` は現在の展開集合を読み書きします。',
        },
      },
      {
        axis: { en: 'Nesting', ko: '중첩과 rail', ja: 'ネストとレール' },
        choices: {
          en: 'Every nested level adds a guide rail and indentation; groups containing the selected leaf use active emphasis.',
          ko: '중첩 단계마다 guide rail과 들여쓰기가 추가되고, 선택한 leaf를 포함한 그룹은 활성 강조를 사용해요.',
          ja: 'ネストの各階層にガイドレールとインデントが加わり、選択中の leaf を含むグループは強調表示されます。',
        },
      },
      {
        axis: { en: 'Persistence', ko: '상태 유지', ja: '状態の保持' },
        choices: {
          en: '`pageStorageId` restores expanded groups within the nearest `PageStorage`; selection ownership is unchanged.',
          ko: '`pageStorageId`는 가장 가까운 `PageStorage`에서 펼친 그룹을 복원하며 선택 상태의 관리 방식은 바꾸지 않아요.',
          ja: '`pageStorageId` は最寄りの `PageStorage` から展開グループを復元します。選択状態の管理方法は変わりません。',
        },
      },
      {
        axis: { en: 'Content', ko: '콘텐츠', ja: 'コンテンツ' },
        choices: {
          en: '`description` adds a muted secondary line. `leading` and `trailing` stay aligned around the complete row, and a group `trailing` replaces its default chevron.',
          ko: '`description`은 옅은 보조 줄을 추가해요. `leading`과 `trailing`은 전체 행 주위에서 정렬을 유지하고, 그룹의 `trailing`은 기본 chevron을 대체해요.',
          ja: '`description` は薄い補助行を追加します。`leading` と `trailing` は行全体の両側で整列し、グループの `trailing` は既定の chevron を置き換えます。',
        },
      },
    ],
    usage: String.raw`class DocsTree extends StatefulWidget {
  const DocsTree({super.key});

  @override
  State<DocsTree> createState() => _DocsTreeState();
}

class _DocsTreeState extends State<DocsTree> {
  String? currentPage = 'theming';

  @override
  Widget build(BuildContext context) => TRTreeNav<String>.controlled(
    value: currentPage,
    onValueChange: (value) => setState(() => currentPage = value),
    pageStorageId: 'docs-navigation',
    semanticLabel: 'Documentation',
    items: const [
      TRTreeNavGroup(
        value: 'guides',
        label: Text('GUIDES'),
        description: Text('Product documentation'),
        initiallyExpanded: true,
        children: [
          TRTreeNavLeaf(
            value: 'install',
            label: Text('Install'),
            description: Text('Add and configure the package'),
          ),
          TRTreeNavGroup(
            value: 'advanced',
            label: Text('ADVANCED'),
            initiallyExpanded: true,
            children: [
              TRTreeNavLeaf(value: 'plugins', label: Text('Plugins')),
              TRTreeNavLeaf(value: 'theming', label: Text('Theming')),
            ],
          ),
        ],
      ),
    ],
  );
}`,
    apiGroups: [
      {
        title: {
          en: 'TRTreeNav properties',
          ko: 'TRTreeNav 속성',
          ja: 'TRTreeNav のプロパティ',
        },
        rows: [
          {
            name: 'items',
            type: 'List<TRTreeNavItem<T>> · required',
            purpose: {
              en: 'Defines the ordered groups and destinations.',
              ko: '순서가 있는 그룹과 목적지를 정의해요.',
              ja: '順序付きのグループと移動先を定義します。',
            },
          },
          {
            name: 'value, defaultValue',
            type: 'T?, T? · null',
            purpose: {
              en: 'Control selection or initialize uncontrolled selection.',
              ko: '선택을 제어하거나 비제어 선택의 초기값을 정해요.',
              ja: '選択を制御するか、非制御選択の初期値を設定します。',
            },
          },
          {
            name: 'onValueChange',
            type: 'ValueChanged<T?>? · null',
            purpose: {
              en: 'Reports an enabled leaf activation.',
              ko: '활성화된 leaf를 실행하면 값을 전달해요.',
              ja: '有効な leaf が実行されたときに値を通知します。',
            },
          },
          {
            name: 'controller',
            type: 'TRTreeNavController<T>? · null',
            purpose: {
              en: 'Observes selection and owns the expanded group set.',
              ko: '선택을 관찰하고 펼친 그룹 집합을 관리해요.',
              ja: '選択を監視し、展開グループの集合を管理します。',
            },
          },
          {
            name: 'pageStorageId, semanticLabel',
            type: 'Object?, String? · null',
            purpose: {
              en: 'Persist expansion and name the navigation region for assistive technology.',
              ko: '펼침 상태를 유지하고 보조 기술에 탐색 영역 이름을 제공해요.',
              ja: '展開状態を保持し、支援技術向けにナビゲーション領域へ名前を付けます。',
            },
          },
        ],
      },
      {
        title: {
          en: 'TRTreeNavGroup properties',
          ko: 'TRTreeNavGroup 속성',
          ja: 'TRTreeNavGroup のプロパティ',
        },
        rows: [
          {
            name: 'value, label, children',
            type: 'T, Widget, List<TRTreeNavItem<T>> · required',
            purpose: {
              en: 'Identify the group and define its trigger and nested nodes.',
              ko: '그룹을 식별하고 trigger와 중첩 node를 정의해요.',
              ja: 'グループを識別し、trigger とネストされた node を定義します。',
            },
          },
          {
            name: 'initiallyExpanded',
            type: 'bool · false',
            purpose: {
              en: 'Adds the group to the initial expanded set.',
              ko: '그룹을 초기 펼침 집합에 추가해요.',
              ja: 'グループを初期展開集合へ追加します。',
            },
          },
          {
            name: 'description',
            type: 'Widget? · null',
            purpose: {
              en: 'Adds a muted secondary line below the group label.',
              ko: '그룹 label 아래에 옅은 보조 줄을 추가해요.',
              ja: 'グループの label の下に薄い補助行を追加します。',
            },
          },
          {
            name: 'disabled, leading, trailing',
            type: 'bool?, Widget?, Widget? · null',
            purpose: {
              en: 'Disable expansion or decorate the row; trailing replaces the chevron.',
              ko: '확장을 막거나 행을 꾸며요. trailing은 chevron을 대체해요.',
              ja: '展開を無効にするか行を装飾します。trailing は chevron を置き換えます。',
            },
          },
        ],
      },
      {
        title: {
          en: 'TRTreeNavLeaf properties',
          ko: 'TRTreeNavLeaf 속성',
          ja: 'TRTreeNavLeaf のプロパティ',
        },
        rows: [
          {
            name: 'value, label',
            type: 'T, Widget · required',
            purpose: {
              en: 'Identify and render a selectable destination.',
              ko: '선택할 수 있는 목적지를 식별하고 렌더링해요.',
              ja: '選択可能な移動先を識別して描画します。',
            },
          },
          {
            name: 'description',
            type: 'Widget? · null',
            purpose: {
              en: 'Adds a muted secondary line below the destination label.',
              ko: '목적지 label 아래에 옅은 보조 줄을 추가해요.',
              ja: '移動先の label の下に薄い補助行を追加します。',
            },
          },
          {
            name: 'disabled, leading, trailing',
            type: 'bool?, Widget?, Widget? · null',
            purpose: {
              en: 'Block selection or add content before and after the label.',
              ko: '선택을 막거나 label 앞뒤에 콘텐츠를 추가해요.',
              ja: '選択を無効にするか、label の前後へコンテンツを追加します。',
            },
          },
        ],
      },
      {
        title: {
          en: 'TRTreeNavController API',
          ko: 'TRTreeNavController API',
          ja: 'TRTreeNavController API',
        },
        rows: [
          {
            name: 'value, expanded',
            type: 'T?, Set<T>',
            purpose: {
              en: 'Read the current selection and an unmodifiable expanded set.',
              ko: '현재 선택과 수정할 수 없는 펼침 집합을 읽어요.',
              ja: '現在の選択と変更不可の展開集合を読み取ります。',
            },
          },
          {
            name: 'select, toggle',
            type: 'void Function(T?), void Function(T)',
            purpose: {
              en: 'Change selection or invert one group’s expansion.',
              ko: '선택을 바꾸거나 한 그룹의 펼침 상태를 반전해요.',
              ja: '選択を変更するか、1 つのグループの展開状態を反転します。',
            },
          },
          {
            name: 'setExpanded, replaceExpanded',
            type: 'methods',
            purpose: {
              en: 'Set one group or replace the complete expanded set.',
              ko: '그룹 하나를 설정하거나 전체 펼침 집합을 교체해요.',
              ja: '1 つのグループを設定するか、展開集合全体を置き換えます。',
            },
          },
        ],
      },
    ],
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
          en: '`md` or `lg`; the default is `md`.',
          ko: '`md`, `lg` 중에서 고르며 기본값은 `md`예요.',
          ja: '`md`、`lg` から選びます。デフォルトは `md` です。',
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
    contractIntro: {
      en: 'Keep `value` to what the reader expects on the clipboard, such as a command or an identifier. Watch `onStatusChange` when a surrounding surface needs to react to the copy.',
      ko: '`value`에는 명령어나 식별자처럼 읽는 사람이 클립보드에서 기대하는 값을 넣으세요. 주변 화면이 복사에 반응해야 하면 `onStatusChange`를 관찰하세요.',
      ja: '`value` には、コマンドや識別子など読み手がクリップボードに期待する値を渡してください。周囲の画面がコピーに反応する必要がある場合は `onStatusChange` を監視します。',
    },
    contractRows: [
      {
        axis: { en: 'Status', ko: '상태', ja: '状態' },
        choices: {
          en: 'Starts at `TRCopyButtonStatus.idle`, switches to `copied` after the clipboard write succeeds, and returns to `idle` after `resetDelay`.',
          ko: '`TRCopyButtonStatus.idle`에서 시작해 클립보드 쓰기가 성공하면 `copied`로 바뀌고, `resetDelay`가 지나면 다시 `idle`로 돌아와요.',
          ja: '`TRCopyButtonStatus.idle` から始まり、クリップボードへの書き込みが成功すると `copied` に変わり、`resetDelay` の経過後に `idle` へ戻ります。',
        },
      },
      {
        axis: { en: 'Repeated presses', ko: '연속 누름', ja: '連続した押下' },
        choices: {
          en: 'Each press restarts the reset timer, so the last press decides when the label returns to `idleLabel`.',
          ko: '누를 때마다 복귀 타이머가 다시 시작되므로, 마지막으로 누른 시점이 `idleLabel`로 돌아가는 시각을 결정해요.',
          ja: '押すたびにリセットタイマーが再スタートするため、最後に押した時点が `idleLabel` へ戻る時刻を決めます。',
        },
      },
      {
        axis: { en: 'Label width', ko: '레이블 너비', ja: 'ラベル幅' },
        choices: {
          en: 'Both labels stay laid out, so the button keeps the width of the wider label instead of resizing on copy.',
          ko: '두 레이블이 모두 배치된 상태로 남아 있어, 복사할 때 크기가 변하지 않고 더 넓은 레이블의 너비를 유지해요.',
          ja: '両方のラベルが配置されたままになるため、コピー時に幅が変わらず、広い方のラベルの幅を保ちます。',
        },
      },
      {
        axis: {
          en: 'Clipboard failure',
          ko: '클립보드 실패',
          ja: 'クリップボードの失敗',
        },
        choices: {
          en: 'When the platform rejects the clipboard write, the button stays on `idleLabel` and `onStatusChange` does not fire.',
          ko: '플랫폼이 클립보드 쓰기를 거부하면 버튼은 `idleLabel`을 유지하고 `onStatusChange`도 호출되지 않아요.',
          ja: 'プラットフォームがクリップボードへの書き込みを拒否した場合、ボタンは `idleLabel` のままで `onStatusChange` も呼ばれません。',
        },
      },
      {
        axis: { en: 'Appearance', ko: '외형', ja: '外観' },
        choices: {
          en: '`appearance`, `intent`, and `uiSize` are forwarded to the underlying `TRButton`.',
          ko: '`appearance`, `intent`, `uiSize`는 내부의 `TRButton`으로 그대로 전달돼요.',
          ja: '`appearance`、`intent`、`uiSize` は内部の `TRButton` にそのまま渡されます。',
        },
      },
    ],
    usage: {
      en: String.raw`class InstallCommand extends StatefulWidget {
  const InstallCommand({super.key});

  @override
  State<InstallCommand> createState() => _InstallCommandState();
}

class _InstallCommandState extends State<InstallCommand> {
  TRCopyButtonStatus status = TRCopyButtonStatus.idle;

  @override
  Widget build(BuildContext context) => Row(
    mainAxisSize: MainAxisSize.min,
    spacing: TRSpacing.small,
    children: [
      const TRCode('flutter pub add tinyrack_ui'),
      TRCopyButton(
        value: 'flutter pub add tinyrack_ui',
        onStatusChange: (next) => setState(() => status = next),
      ),
    ],
  );
}`,
      ko: String.raw`class InstallCommand extends StatefulWidget {
  const InstallCommand({super.key});

  @override
  State<InstallCommand> createState() => _InstallCommandState();
}

class _InstallCommandState extends State<InstallCommand> {
  TRCopyButtonStatus status = TRCopyButtonStatus.idle;

  @override
  Widget build(BuildContext context) => Row(
    mainAxisSize: MainAxisSize.min,
    spacing: TRSpacing.small,
    children: [
      const TRCode('flutter pub add tinyrack_ui'),
      TRCopyButton(
        value: 'flutter pub add tinyrack_ui',
        idleLabel: '복사',
        copiedLabel: '복사됨',
        onStatusChange: (next) => setState(() => status = next),
      ),
    ],
  );
}`,
      ja: String.raw`class InstallCommand extends StatefulWidget {
  const InstallCommand({super.key});

  @override
  State<InstallCommand> createState() => _InstallCommandState();
}

class _InstallCommandState extends State<InstallCommand> {
  TRCopyButtonStatus status = TRCopyButtonStatus.idle;

  @override
  Widget build(BuildContext context) => Row(
    mainAxisSize: MainAxisSize.min,
    spacing: TRSpacing.small,
    children: [
      const TRCode('flutter pub add tinyrack_ui'),
      TRCopyButton(
        value: 'flutter pub add tinyrack_ui',
        idleLabel: 'コピー',
        copiedLabel: 'コピー済み',
        onStatusChange: (next) => setState(() => status = next),
      ),
    ],
  );
}`,
    },
    apiGroups: [
      {
        title: {
          en: 'Copy behavior',
          ko: '복사 동작',
          ja: 'コピー動作',
        },
        rows: [
          {
            name: 'value',
            type: 'String (required)',
            purpose: {
              en: 'The text written to the clipboard.',
              ko: '클립보드에 쓰는 텍스트예요.',
              ja: 'クリップボードに書き込むテキストです。',
            },
          },
          {
            name: 'idleLabel',
            type: "String = 'Copy'",
            purpose: {
              en: 'The label shown before a copy and after the reset delay.',
              ko: '복사 전과 복귀 지연이 끝난 뒤에 보여 주는 레이블이에요.',
              ja: 'コピー前と復帰待ち時間の経過後に表示するラベルです。',
            },
          },
          {
            name: 'copiedLabel',
            type: "String = 'Copied'",
            purpose: {
              en: 'The confirmation label shown while the status is `copied`.',
              ko: '상태가 `copied`인 동안 보여 주는 확인 레이블이에요.',
              ja: '状態が `copied` の間に表示する確認ラベルです。',
            },
          },
          {
            name: 'resetDelay',
            type: 'Duration = Duration(seconds: 2)',
            purpose: {
              en: 'How long the confirmation stays before the label returns to `idleLabel`.',
              ko: '레이블이 `idleLabel`로 돌아가기까지 확인 상태를 유지하는 시간이에요.',
              ja: 'ラベルが `idleLabel` に戻るまで確認状態を保つ時間です。',
            },
          },
          {
            name: 'onStatusChange',
            type: 'ValueChanged<TRCopyButtonStatus>?',
            purpose: {
              en: 'Called with `copied` after a successful copy and with `idle` when the delay ends.',
              ko: '복사에 성공하면 `copied`로, 지연이 끝나면 `idle`로 호출돼요.',
              ja: 'コピーに成功すると `copied`、待ち時間が終わると `idle` で呼ばれます。',
            },
          },
        ],
      },
      {
        title: {
          en: 'Appearance',
          ko: '외형',
          ja: '外観',
        },
        rows: [
          {
            name: 'appearance',
            type: 'TRAppearance = TRAppearance.solid',
            purpose: {
              en: 'Chooses the `solid`, `outline`, or `ghost` button surface.',
              ko: '`solid`, `outline`, `ghost` 중에서 버튼 표면을 골라요.',
              ja: '`solid`、`outline`、`ghost` からボタン表面を選びます。',
            },
          },
          {
            name: 'intent',
            type: 'TRIntent = TRIntent.neutral',
            purpose: {
              en: 'Applies the semantic color intent shared with `TRButton`.',
              ko: '`TRButton`과 공유하는 시맨틱 색상 인텐트를 적용해요.',
              ja: '`TRButton` と共有するセマンティックな色のインテントを適用します。',
            },
          },
          {
            name: 'uiSize',
            type: 'TRUiSize = TRUiSize.md',
            purpose: {
              en: 'Sets the control height and typography to `md` or `lg`.',
              ko: '컨트롤 높이와 타이포그래피를 `md`, `lg`로 지정해요.',
              ja: 'コントロールの高さとタイポグラフィを `md`、`lg` に設定します。',
            },
          },
        ],
      },
    ],
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
    usage:
      "TRFieldset(\n  legend: 'Notifications',\n  children: [\n    Row(\n      mainAxisSize: MainAxisSize.min,\n      spacing: TRSpacing.small,\n      children: const [\n        TRCheckbox(defaultChecked: true, semanticLabel: 'Email alerts'),\n        TRText('Email alerts', variant: TRTextVariant.bodySm),\n      ],\n    ),\n  ],\n)",
    contractRows: [
      {
        axis: { en: 'Legend', ko: '레전드', ja: 'レジェンド' },
        choices: {
          en: '`legend` is a plain `String` drawn on the top border, not a widget slot. Leave it `null` for a bordered group with no caption.',
          ko: '`legend`는 위젯 슬롯이 아니라 위쪽 테두리에 겹쳐 그려지는 `String`이에요. `null`로 두면 캡션 없이 테두리만 있는 그룹이 돼요.',
          ja: '`legend` はウィジェットスロットではなく、上端の枠線に重ねて描画される `String` です。`null` のままにすると、キャプションのない枠だけのグループになります。',
        },
      },
      {
        axis: { en: 'Grouping', ko: '그룹 구성', ja: 'グループ構成' },
        choices: {
          en: '`children` are stacked in a stretched `Column` with a medium gap, inside token-driven padding, border, and radius. The fieldset takes the width its parent gives it, so constrain that parent when a narrower group is needed.',
          ko: '`children`은 가로로 늘어난 `Column`에 medium 간격으로 쌓이고, 토큰 기반 패딩·테두리·모서리 반경 안에 들어가요. 너비는 부모가 주는 만큼 차지하므로 더 좁은 그룹이 필요하면 부모를 제약하세요.',
          ja: '`children` は横方向に広がる `Column` に medium の間隔で積まれ、トークンで決まる余白・枠線・角丸の内側に配置されます。幅は親から与えられた分だけ広がるため、狭いグループが必要な場合は親側で制約してください。',
        },
      },
      {
        axis: { en: 'State', ko: '상태', ja: '状態' },
        choices: {
          en: '`disabled` dims the group with the disabled opacity token and marks it as disabled for `Semantics`. It does not disable the controls inside, so pass `disabled` to each control as well.',
          ko: '`disabled`는 비활성 불투명도 토큰으로 그룹을 흐리게 하고 `Semantics`에 비활성 상태로 표시해요. 내부 컨트롤까지 비활성으로 만들지는 않으니 각 컨트롤에도 `disabled`를 함께 넘기세요.',
          ja: '`disabled` は無効時の不透明度トークンでグループを淡くし、`Semantics` 上でも無効として扱います。内部のコントロールは無効にならないため、各コントロールにも `disabled` を渡してください。',
        },
      },
      {
        axis: { en: 'Labeling', ko: '레이블', ja: 'ラベル' },
        choices: {
          en: 'The legend names the group, not the individual controls. Give each control its own visible label with `TRField` or a text widget beside it, and set `semanticLabel` on controls such as `TRCheckbox`.',
          ko: '레전드는 개별 컨트롤이 아니라 그룹의 이름이에요. 각 컨트롤에는 `TRField`나 옆에 둔 텍스트 위젯으로 눈에 보이는 레이블을 주고, `TRCheckbox` 같은 컨트롤에는 `semanticLabel`을 설정하세요.',
          ja: 'レジェンドは個々のコントロールではなくグループの名前です。各コントロールには `TRField` や隣接するテキストウィジェットで見えるラベルを与え、`TRCheckbox` などには `semanticLabel` を設定してください。',
        },
      },
    ],
    contractIntro: {
      en: 'Reach for `TRFieldset` when several controls answer one question together, such as choosing notification channels. A plain `Column` is enough when controls only share vertical space.',
      ko: '알림 채널 선택처럼 여러 컨트롤이 하나의 질문에 함께 답할 때 `TRFieldset`을 쓰세요. 컨트롤이 세로 공간만 공유한다면 일반 `Column`으로 충분해요.',
      ja: '通知チャネルの選択のように、複数のコントロールが 1 つの問いにまとめて答える場合に `TRFieldset` を使ってください。縦方向の空間を共有するだけであれば、通常の `Column` で十分です。',
    },
    apiGroups: [
      {
        title: {
          en: 'TRFieldset properties',
          ko: 'TRFieldset 속성',
          ja: 'TRFieldset のプロパティ',
        },
        rows: [
          {
            name: 'children',
            type: 'List<Widget> · required',
            purpose: {
              en: 'Holds the grouped controls. They are laid out in a stretched `Column` with a medium gap between entries.',
              ko: '묶을 컨트롤을 담아요. 항목 사이에 medium 간격을 둔, 가로로 늘어난 `Column`으로 배치돼요.',
              ja: 'グループ化するコントロールを保持します。項目間に medium の間隔を持つ、横方向に広がる `Column` で配置されます。',
            },
          },
          {
            name: 'legend',
            type: 'String? · null',
            purpose: {
              en: 'Names the group on the top border. The text measures against the current text scale, so the border keeps its gap when the reader enlarges text.',
              ko: '위쪽 테두리에 그룹 이름을 표시해요. 현재 텍스트 배율을 기준으로 크기를 재기 때문에 텍스트를 키워도 테두리 사이 여백이 유지돼요.',
              ja: '上端の枠線にグループ名を表示します。現在のテキストスケールに合わせて計測されるため、文字を拡大しても枠線との間隔が保たれます。',
            },
          },
          {
            name: 'disabled',
            type: 'bool · false',
            purpose: {
              en: 'Applies the disabled opacity token and exposes the group as disabled through `Semantics`. Descendant controls keep their own enabled state.',
              ko: '비활성 불투명도 토큰을 적용하고 `Semantics`로 그룹을 비활성 상태로 노출해요. 하위 컨트롤은 각자의 활성 상태를 그대로 유지해요.',
              ja: '無効時の不透明度トークンを適用し、`Semantics` でグループを無効として公開します。子孫のコントロールは自身の有効状態を保ちます。',
            },
          },
        ],
      },
    ],
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
    contractIntro: {
      en: 'A radio only means something inside `TRRadioGroup`, which owns the selected value. Give every option a `value` that is unique within its group and a `label` a reader can act on. For a standalone on or off control use `TRCheckbox` or `TRSwitch` instead.',
      ko: '라디오는 선택 값을 소유하는 `TRRadioGroup` 안에서만 의미가 있어요. 각 옵션에는 그룹 안에서 고유한 `value`와 읽고 누를 수 있는 `label`을 지정하세요. 켜고 끄는 단독 컨트롤이 필요하면 `TRCheckbox`나 `TRSwitch`를 사용해요.',
      ja: 'ラジオは選択値を保持する `TRRadioGroup` の中でのみ意味を持ちます。各選択肢には、グループ内で一意な `value` と操作できる `label` を指定してください。単独のオン・オフ操作には `TRCheckbox` か `TRSwitch` を使います。',
    },
    contractRows: [
      {
        axis: { en: 'Selection', ko: '선택', ja: '選択' },
        choices: {
          en: 'Selected while the group value equals this `value`. A radio never sets its own state; the group does.',
          ko: '그룹의 값이 이 `value`와 같을 때 선택돼요. 라디오가 스스로 상태를 바꾸지 않고 그룹이 바꿔요.',
          ja: 'グループの値がこの `value` と一致する間だけ選択されます。ラジオが自分で状態を変えることはなく、グループが変更します。',
        },
      },
      {
        axis: { en: 'Label', ko: '레이블', ja: 'ラベル' },
        choices: {
          en: '`label` renders beside the glyph as one tappable target and one semantic node. Style it with `TRText`; the radio applies no text style of its own.',
          ko: '`label`은 글리프 옆에 그려지고, 탭 영역과 시맨틱 노드를 하나로 묶어요. 텍스트 스타일은 `TRText`로 지정하세요. 라디오는 자체 텍스트 스타일을 적용하지 않아요.',
          ja: '`label` はグリフの隣に描画され、タップ領域とセマンティックノードを 1 つにまとめます。文字スタイルは `TRText` で指定してください。ラジオ自体は文字スタイルを適用しません。',
        },
      },
      {
        axis: { en: 'Size', ko: '크기', ja: 'サイズ' },
        choices: {
          en: '`uiSize` takes `TRUiSize.md` or `TRUiSize.lg`; the default is `md`. Match it to the controls around the option.',
          ko: '`uiSize`는 `TRUiSize.md`, `TRUiSize.lg`를 받고 기본값은 `md`예요. 주변 컨트롤의 밀도에 맞추세요.',
          ja: '`uiSize` は `TRUiSize.md`・`TRUiSize.lg` を受け取り、既定値は `md` です。周囲のコントロールの密度に合わせてください。',
        },
      },
      {
        axis: { en: 'Availability', ko: '사용 가능 여부', ja: '利用可否' },
        choices: {
          en: '`disabled` and `readOnly` combine with the values the group sets. `readOnly` keeps the option focusable and its value intact; `disabled` blocks interaction and dims the option.',
          ko: '`disabled`와 `readOnly`는 그룹이 정한 값과 함께 적용돼요. `readOnly`는 포커스와 값을 유지하고, `disabled`는 조작을 막고 옵션을 흐리게 만들어요.',
          ja: '`disabled` と `readOnly` はグループが設定した値と合わせて適用されます。`readOnly` はフォーカスと値を保ち、`disabled` は操作を止めて選択肢を淡く表示します。',
        },
      },
      {
        axis: { en: 'Keyboard', ko: '키보드', ja: 'キーボード' },
        choices: {
          en: 'Space selects the focused option on key release, matching a native radio. Moving between options belongs to `TRRadioGroup`.',
          ko: '네이티브 라디오처럼 Space를 뗄 때 포커스된 옵션이 선택돼요. 옵션 사이 이동은 `TRRadioGroup`이 담당해요.',
          ja: 'ネイティブのラジオと同じく、Space はキーを離したときに、フォーカス中の選択肢を選びます。選択肢間の移動は `TRRadioGroup` が担当します。',
        },
      },
    ],
    usage: {
      en: String.raw`TRRadioGroup(
  defaultValue: 'weekly',
  onValueChange: setSchedule,
  children: const [
    TRRadio(
      value: 'weekly',
      label: TRText('Weekly', variant: TRTextVariant.bodySm),
    ),
    TRRadio(
      value: 'monthly',
      label: TRText('Monthly', variant: TRTextVariant.bodySm),
    ),
  ],
)`,
      ko: String.raw`TRRadioGroup(
  defaultValue: 'weekly',
  onValueChange: setSchedule,
  children: const [
    TRRadio(
      value: 'weekly',
      label: TRText('매주', variant: TRTextVariant.bodySm),
    ),
    TRRadio(
      value: 'monthly',
      label: TRText('매월', variant: TRTextVariant.bodySm),
    ),
  ],
)`,
      ja: String.raw`TRRadioGroup(
  defaultValue: 'weekly',
  onValueChange: setSchedule,
  children: const [
    TRRadio(
      value: 'weekly',
      label: TRText('毎週', variant: TRTextVariant.bodySm),
    ),
    TRRadio(
      value: 'monthly',
      label: TRText('毎月', variant: TRTextVariant.bodySm),
    ),
  ],
)`,
    },
    apiGroups: [
      {
        title: {
          en: 'TRRadio properties',
          ko: 'TRRadio 속성',
          ja: 'TRRadio のプロパティ',
        },
        rows: [
          {
            name: 'value',
            type: 'String · required',
            purpose: {
              en: 'Identifies the option inside its group. Keep it unique and stable.',
              ko: '그룹 안에서 옵션을 구분해요. 고유하고 변하지 않는 값을 쓰세요.',
              ja: 'グループ内で選択肢を識別します。一意で変化しない値にしてください。',
            },
          },
          {
            name: 'label',
            type: 'Widget? · null',
            purpose: {
              en: 'Renders beside the glyph and joins it as one tap target and one semantic node. Without it the option shows only the glyph.',
              ko: '글리프 옆에 그려지고 탭 대상과 시맨틱 노드를 하나로 합쳐요. 지정하지 않으면 글리프만 보여요.',
              ja: 'グリフの隣に描画され、タップ対象とセマンティックノードを 1 つに統合します。指定しない場合はグリフだけが表示されます。',
            },
          },
          {
            name: 'uiSize',
            type: 'TRUiSize · TRUiSize.md',
            purpose: {
              en: 'Sets the glyph and indicator size.',
              ko: '글리프와 표시점의 크기를 정해요.',
              ja: 'グリフとインジケーターのサイズを決めます。',
            },
          },
          {
            name: 'disabled',
            type: 'bool · false',
            purpose: {
              en: 'Blocks interaction for this option, on top of the group value. Disabled options are skipped by the arrow keys.',
              ko: '그룹 값에 더해 이 옵션의 조작을 막아요. 비활성 옵션은 화살표 키가 건너뛰어요.',
              ja: 'グループの値に加えて、この選択肢の操作を止めます。無効な選択肢は矢印キーで飛ばされます。',
            },
          },
          {
            name: 'readOnly',
            type: 'bool · false',
            purpose: {
              en: 'Keeps the option focusable and its value visible while refusing changes.',
              ko: '포커스와 값을 그대로 유지하면서 변경만 막아요.',
              ja: 'フォーカスと表示中の値を保ったまま、変更だけを拒否します。',
            },
          },
          {
            name: 'invalid',
            type: 'bool · false',
            purpose: {
              en: 'Paints the danger border. Drive it from your own validation; the widget never sets it.',
              ko: '위험 상태 테두리를 그려요. 직접 검증 결과로 넘기세요. 위젯이 스스로 설정하지 않아요.',
              ja: '危険状態の枠線を描きます。検証結果から渡してください。ウィジェットが自動で設定することはありません。',
            },
          },
          {
            name: 'focusNode, autofocus',
            type: 'FocusNode? · null, bool · false',
            purpose: {
              en: 'An explicit `focusNode` replaces the one the group manages for this option.',
              ko: '`focusNode`를 직접 넘기면 그룹이 이 옵션에 배정한 노드를 대신해요.',
              ja: '`focusNode` を明示すると、グループがこの選択肢に割り当てたノードの代わりに使われます。',
            },
          },
        ],
      },
    ],
  },
  'radio-group': {
    title: 'RadioGroup',
    description: {
      en: 'Coordinate a mutually exclusive selection across radios.',
      ko: '라디오 사이의 상호 배타적 선택을 관리해요.',
      ja: 'ラジオ間の相互排他的な選択を管理します。',
    },
    contractIntro: {
      en: 'The group holds the selected value and its children are public `TRRadio` widgets, so each option needs a unique `value`. Unlike the web component it has no `required` prop, no `form` association, and no built-in validation: wrap it in `TRField` to add a visible label, and compute the error message from your own state.',
      ko: '그룹이 선택 값을 들고 있고 자식은 공개 위젯인 `TRRadio`이므로, 각 옵션에는 고유한 `value`가 필요해요. 웹 컴포넌트와 달리 `required` 속성, 바깥 폼 연결, 내장 검증이 없어요. `TRField`로 감싸 보이는 레이블을 붙이고, 오류 메시지는 직접 상태에서 계산하세요.',
      ja: 'グループが選択値を保持し、子は公開ウィジェットの `TRRadio` なので、各選択肢には一意な `value` が必要です。Web コンポーネントと違い `required` プロパティ、外部フォームとの関連付け、組み込みの検証はありません。`TRField` で包んで表示ラベルを付け、エラーメッセージは自分の状態から組み立ててください。',
    },
    contractRows: [
      {
        axis: { en: 'State ownership', ko: '상태 관리', ja: '状態管理' },
        choices: {
          en: 'Use `defaultValue` when the group owns the selection, or pair `value` with `onValueChange` for controlled state. Both are `String?`, and no option starts selected when both are null.',
          ko: '그룹이 선택을 관리하면 `defaultValue`를, controlled 상태에는 `value`와 `onValueChange`를 함께 사용해요. 둘 다 `String?`이고 모두 null이면 처음에는 아무것도 선택되지 않아요.',
          ja: 'グループが選択を管理する場合は `defaultValue`、controlled 状態では `value` と `onValueChange` を組み合わせます。どちらも `String?` で、両方 null のときは何も選択されていない状態から始まります。',
        },
      },
      {
        axis: { en: 'Label', ko: '레이블', ja: 'ラベル' },
        choices: {
          en: 'The group renders no label of its own. Wrap it in `TRField` to name the choice and show an error message below it.',
          ko: '그룹은 자체 레이블을 그리지 않아요. `TRField`로 감싸서 선택 항목의 이름을 붙이고 아래에 오류 메시지를 보여 주세요.',
          ja: 'グループ自体はラベルを描画しません。`TRField` で包んで選択項目に名前を付け、その下にエラーメッセージを表示してください。',
        },
      },
      {
        axis: { en: 'Availability', ko: '사용 가능 여부', ja: '利用可否' },
        choices: {
          en: 'Group `disabled` blocks every option and omits a named group from `TRFormValues`. Group `readOnly` keeps the selected value and focus while refusing changes.',
          ko: '그룹 `disabled`는 모든 옵션을 막고, 이름 있는 그룹을 `TRFormValues`에서 제외해요. 그룹 `readOnly`는 선택 값과 포커스를 유지하면서 변경만 막아요.',
          ja: 'グループの `disabled` はすべての選択肢を操作不可にし、名前付きグループを `TRFormValues` から除外します。グループの `readOnly` は選択値とフォーカスを保ったまま変更を拒否します。',
        },
      },
      {
        axis: { en: 'Forms', ko: '폼', ja: 'フォーム' },
        choices: {
          en: 'Set `name` to register the selected string with the nearest `TRForm`, which reports it from `save()`. The group is not a `FormField`, so `TRForm.reset()` leaves its value alone; restore the starting value from your own state.',
          ko: '`name`을 지정하면 선택된 문자열을 가장 가까운 `TRForm`에 등록하고 `save()`가 그 값을 알려줘요. 그룹은 `FormField`가 아니라서 `TRForm.reset()`이 값을 되돌리지 않아요. 처음 값은 직접 상태에서 복원하세요.',
          ja: '`name` を設定すると選択済み文字列を最も近い `TRForm` に登録し、`save()` がその値を返します。グループは `FormField` ではないため `TRForm.reset()` では値が戻りません。初期値は自分の状態から復元してください。',
        },
      },
      {
        axis: { en: 'Keyboard', ko: '키보드', ja: 'キーボード' },
        choices: {
          en: 'Tab reaches the group once, landing on the selected option. The arrow keys on either axis, plus Home and End, then move focus and selection together, skip disabled options, and wrap at the ends. A read-only group moves focus without changing its value.',
          ko: 'Tab으로 그룹에 한 번 들어가면 선택된 옵션에 포커스가 놓여요. 이후에는 양쪽 축의 화살표 키와 Home, End가 포커스와 선택을 함께 옮기고, 비활성 옵션을 건너뛰며, 양 끝에서 순환해요. `readOnly` 그룹은 값을 바꾸지 않고 포커스만 옮겨요.',
          ja: 'Tab でグループに入ると、選択中の選択肢にフォーカスが移ります。その後は両軸の矢印キーと Home・End がフォーカスと選択を一緒に移動させ、無効な選択肢を飛ばし、端で循環します。`readOnly` のグループは値を変えずにフォーカスだけを移します。',
        },
      },
    ],
    usage: {
      en: String.raw`class DeploymentRack extends StatefulWidget {
  const DeploymentRack({super.key});

  @override
  State<DeploymentRack> createState() => _DeploymentRackState();
}

class _DeploymentRackState extends State<DeploymentRack> {
  String rack = 'alpha';

  @override
  Widget build(BuildContext context) {
    return TRField(
      label: 'Deployment rack',
      control: TRRadioGroup(
        name: 'rack',
        value: rack,
        onValueChange: (next) => setState(() => rack = next),
        children: const [
          TRRadio(
            value: 'alpha',
            label: TRText('Rack alpha', variant: TRTextVariant.bodySm),
          ),
          TRRadio(
            value: 'beta',
            label: TRText('Rack beta', variant: TRTextVariant.bodySm),
          ),
        ],
      ),
    );
  }
}`,
      ko: String.raw`class DeploymentRack extends StatefulWidget {
  const DeploymentRack({super.key});

  @override
  State<DeploymentRack> createState() => _DeploymentRackState();
}

class _DeploymentRackState extends State<DeploymentRack> {
  String rack = 'alpha';

  @override
  Widget build(BuildContext context) {
    return TRField(
      label: '배포 랙',
      control: TRRadioGroup(
        name: 'rack',
        value: rack,
        onValueChange: (next) => setState(() => rack = next),
        children: const [
          TRRadio(
            value: 'alpha',
            label: TRText('알파 랙', variant: TRTextVariant.bodySm),
          ),
          TRRadio(
            value: 'beta',
            label: TRText('베타 랙', variant: TRTextVariant.bodySm),
          ),
        ],
      ),
    );
  }
}`,
      ja: String.raw`class DeploymentRack extends StatefulWidget {
  const DeploymentRack({super.key});

  @override
  State<DeploymentRack> createState() => _DeploymentRackState();
}

class _DeploymentRackState extends State<DeploymentRack> {
  String rack = 'alpha';

  @override
  Widget build(BuildContext context) {
    return TRField(
      label: 'デプロイ先ラック',
      control: TRRadioGroup(
        name: 'rack',
        value: rack,
        onValueChange: (next) => setState(() => rack = next),
        children: const [
          TRRadio(
            value: 'alpha',
            label: TRText('ラック alpha', variant: TRTextVariant.bodySm),
          ),
          TRRadio(
            value: 'beta',
            label: TRText('ラック beta', variant: TRTextVariant.bodySm),
          ),
        ],
      ),
    );
  }
}`,
    },
    apiGroups: [
      {
        title: {
          en: 'TRRadioGroup properties',
          ko: 'TRRadioGroup 속성',
          ja: 'TRRadioGroup のプロパティ',
        },
        rows: [
          {
            name: 'children',
            type: 'List<TRRadio> · required',
            purpose: {
              en: 'Lists the options in visual and focus order. The type is `TRRadio`, so the group can read each option `value` and `disabled`.',
              ko: '옵션을 화면 순서이자 포커스 순서로 나열해요. 타입이 `TRRadio`라 그룹이 각 옵션의 `value`와 `disabled`를 읽을 수 있어요.',
              ja: '選択肢を表示順かつフォーカス順に並べます。型が `TRRadio` なので、グループは各選択肢の `value` と `disabled` を読み取れます。',
            },
          },
          {
            name: 'value',
            type: 'String? · null',
            purpose: {
              en: 'Controls the selected option. While it is non-null the group never changes the selection on its own.',
              ko: '선택된 옵션을 제어해요. 값이 있으면 그룹이 스스로 선택을 바꾸지 않아요.',
              ja: '選択中の選択肢を制御します。値がある間、グループは自分で選択を変えません。',
            },
          },
          {
            name: 'defaultValue',
            type: 'String? · null',
            purpose: {
              en: 'Sets the initial selection of an uncontrolled group. It is read once, so a later change does not move the selection, and it is ignored when `value` is provided.',
              ko: '제어하지 않는 그룹의 처음 선택을 정해요. 한 번만 읽으므로 나중에 바꿔도 선택이 옮겨지지 않고, `value`를 넘기면 쓰이지 않아요.',
              ja: '制御しないグループの初期選択を設定します。一度だけ読まれるため後から変更しても選択は移らず、`value` を渡した場合は使われません。',
            },
          },
          {
            name: 'onValueChange',
            type: 'ValueChanged<String>? · null',
            purpose: {
              en: 'Reports the next selected value after a tap or an arrow key. There is no way to veto the change.',
              ko: '탭이나 화살표 키 뒤의 다음 선택 값을 알려줘요. 변경을 취소할 수단은 없어요.',
              ja: 'タップや矢印キーの後の次の選択値を通知します。変更を取り消す手段はありません。',
            },
          },
          {
            name: 'disabled',
            type: 'bool · false',
            purpose: {
              en: 'Disables every option and omits a named group from `TRFormValues`.',
              ko: '모든 옵션을 비활성화하고 이름 있는 그룹을 `TRFormValues`에서 제외해요.',
              ja: 'すべての選択肢を無効にし、名前付きグループを `TRFormValues` から除外します。',
            },
          },
          {
            name: 'readOnly',
            type: 'bool · false',
            purpose: {
              en: 'Keeps the selected value and keyboard focus while refusing every change.',
              ko: '선택 값과 키보드 포커스를 유지하면서 모든 변경을 막아요.',
              ja: '選択値とキーボードフォーカスを保ったまま、すべての変更を拒否します。',
            },
          },
          {
            name: 'name',
            type: 'String? · null',
            purpose: {
              en: 'Registers the selected value with the nearest `TRForm`.',
              ko: '선택 값을 가장 가까운 `TRForm`에 등록해요.',
              ja: '選択値を最も近い `TRForm` に登録します。',
            },
          },
        ],
      },
    ],
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
    usage: {
      en: String.raw`class BackupSetting extends StatefulWidget {
  const BackupSetting({super.key});

  @override
  State<BackupSetting> createState() => _BackupSettingState();
}

class _BackupSettingState extends State<BackupSetting> {
  bool enabled = false;

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      spacing: TRSpacing.small,
      children: [
        TRSwitch(
          checked: enabled,
          onCheckedChange: (next) => setState(() => enabled = next),
          semanticLabel: 'Automatic backups',
        ),
        const TRText('Automatic backups'),
      ],
    );
  }
}`,
      ko: String.raw`class BackupSetting extends StatefulWidget {
  const BackupSetting({super.key});

  @override
  State<BackupSetting> createState() => _BackupSettingState();
}

class _BackupSettingState extends State<BackupSetting> {
  bool enabled = false;

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      spacing: TRSpacing.small,
      children: [
        TRSwitch(
          checked: enabled,
          onCheckedChange: (next) => setState(() => enabled = next),
          semanticLabel: '자동 백업',
        ),
        const TRText('자동 백업'),
      ],
    );
  }
}`,
      ja: String.raw`class BackupSetting extends StatefulWidget {
  const BackupSetting({super.key});

  @override
  State<BackupSetting> createState() => _BackupSettingState();
}

class _BackupSettingState extends State<BackupSetting> {
  bool enabled = false;

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      spacing: TRSpacing.small,
      children: [
        TRSwitch(
          checked: enabled,
          onCheckedChange: (next) => setState(() => enabled = next),
          semanticLabel: '自動バックアップ',
        ),
        const TRText('自動バックアップ'),
      ],
    );
  }
}`,
    },
    contractIntro: {
      en: 'Reach for a switch when flipping it applies the setting right away. Use a checkbox when the value is collected and submitted with the rest of a form: `TRSwitch` takes no `name`, `value`, or `required`, so a submitted value has to come from your own state. There is also no size variant.',
      ko: '전환하는 즉시 설정이 적용될 때 스위치를 쓰세요. 값을 모아서 폼과 함께 제출한다면 체크박스를 쓰세요. `TRSwitch`는 `name`이나 `value`, `required`를 받지 않아서 제출할 값은 직접 관리하는 상태에서 읽어야 해요. 크기 변형도 없어요.',
      ja: '切り替えた瞬間に設定が反映される場面ではスイッチを使ってください。値をまとめてフォームと一緒に送信する場合はチェックボックスを使ってください。`TRSwitch` は `name` や `value`、`required` を受け取らないため、送信する値は自分で保持している状態から読み取る必要があります。サイズのバリエーションもありません。',
    },
    contractRows: [
      {
        axis: { en: 'State', ko: '상태', ja: '状態' },
        choices: {
          en: 'Pass `checked` to control the value, or leave it `null` and start from `defaultChecked`, which is `false`. `onCheckedChange` reports the next value in both cases.',
          ko: '`checked`를 넘기면 값을 직접 제어하고, 넘기지 않으면 `false`인 `defaultChecked`에서 시작해 스스로 관리해요. 두 방식 모두 `onCheckedChange`로 다음 값을 알려줘요.',
          ja: '`checked` を渡すと値を制御でき、渡さない場合は `false` の `defaultChecked` から自身で管理します。どちらでも `onCheckedChange` が次の値を通知します。',
        },
      },
      {
        axis: { en: 'Availability', ko: '사용 가능 여부', ja: '利用可否' },
        choices: {
          en: '`readOnly` refuses changes but keeps focus and keyboard reach. `disabled` refuses changes and marks the switch as unavailable for assistive technology. Both keep the current value visible.',
          ko: '`readOnly`는 변경은 막지만 포커스와 키보드 접근은 남겨요. `disabled`는 변경을 막고 보조 기술에 사용할 수 없는 상태로 알려요. 둘 다 현재 값은 그대로 보여줘요.',
          ja: '`readOnly` は変更を拒みつつ、フォーカスとキーボード操作は残します。`disabled` は変更を拒み、支援技術には利用できない状態として伝えます。どちらも現在の値は表示したままです。',
        },
      },
      {
        axis: { en: 'Labeling', ko: '레이블', ja: 'ラベル' },
        choices: {
          en: 'The switch renders no label of its own. Place visible text beside it and pass the same text to `semanticLabel`, otherwise the switch has no accessible name. Space toggles a focused editable switch on key release.',
          ko: '스위치는 자체 레이블을 그리지 않아요. 옆에 보이는 텍스트를 두고 같은 문구를 `semanticLabel`에 넘기지 않으면 접근 가능한 이름이 비어요. 포커스된 편집 가능한 스위치는 Space 키를 뗄 때 전환돼요.',
          ja: 'スイッチ自体はラベルを描画しません。隣に見えるテキストを置き、同じ文言を `semanticLabel` に渡さないとアクセシブルな名前が空になります。フォーカスされた編集可能なスイッチは Space キーを離した時点で切り替わります。',
        },
      },
      {
        axis: { en: 'Validation', ko: '검증', ja: '検証' },
        choices: {
          en: '`invalid` only paints the danger border. There is no error text slot and no form field wrapper, so render the message and clear `invalid` yourself.',
          ko: '`invalid`는 위험을 알리는 테두리만 그려요. 오류 텍스트 자리도 폼 필드 래퍼도 없으니 메시지를 직접 그리고 `invalid`도 직접 해제하세요.',
          ja: '`invalid` は危険を示す枠線を描くだけです。エラーテキストの領域もフォームフィールドのラッパーもないため、メッセージの描画と `invalid` の解除は自分で行ってください。',
        },
      },
    ],
    apiGroups: [
      {
        title: {
          en: 'State and availability',
          ko: '상태와 사용 가능 여부',
          ja: '状態と利用可否',
        },
        rows: [
          {
            name: 'checked',
            type: 'bool? · null',
            purpose: {
              en: 'Controls the value. While it is non-null the widget never changes state on its own.',
              ko: '값을 제어해요. 값이 있으면 위젯이 스스로 상태를 바꾸지 않아요.',
              ja: '値を制御します。値がある間、ウィジェットは自分で状態を変えません。',
            },
          },
          {
            name: 'defaultChecked',
            type: 'bool · false',
            purpose: {
              en: 'Sets the initial value of an uncontrolled switch. It is ignored once `checked` is provided.',
              ko: '제어하지 않는 스위치의 처음 값을 정해요. `checked`를 넘기면 쓰이지 않아요.',
              ja: '制御しないスイッチの初期値を設定します。`checked` を渡した場合は使われません。',
            },
          },
          {
            name: 'onCheckedChange',
            type: 'ValueChanged<bool>? · null',
            purpose: {
              en: 'Reports the next value after a tap or Space. There is no way to veto the change.',
              ko: '탭이나 Space 이후의 다음 값을 알려줘요. 변경을 취소할 수단은 없어요.',
              ja: 'タップや Space の後の次の値を通知します。変更を取り消す手段はありません。',
            },
          },
          {
            name: 'disabled',
            type: 'bool · false',
            purpose: {
              en: 'Removes pointer and keyboard activation and marks the switch as disabled for assistive technology.',
              ko: '포인터와 키보드 조작을 막고 보조 기술에 비활성 상태로 알려요.',
              ja: 'ポインターとキーボードの操作を無効にし、支援技術に無効状態として伝えます。',
            },
          },
          {
            name: 'readOnly',
            type: 'bool · false',
            purpose: {
              en: 'Refuses changes while the switch stays focusable and reports its normal enabled state.',
              ko: '변경은 막지만 포커스는 받을 수 있고 보조 기술에는 평소의 활성 상태로 알려요.',
              ja: '変更を拒みますが、フォーカスは受け取れ、支援技術には通常の有効状態として伝えます。',
            },
          },
          {
            name: 'invalid',
            type: 'bool · false',
            purpose: {
              en: 'Paints the danger border. It does not change behavior or announce an error.',
              ko: '위험을 알리는 테두리를 그려요. 동작을 바꾸거나 오류를 알리지는 않아요.',
              ja: '危険を示す枠線を描きます。動作を変えることも、エラーを読み上げることもありません。',
            },
          },
        ],
      },
      {
        title: {
          en: 'Naming, focus, and composition',
          ko: '이름과 포커스, 조합',
          ja: '名前とフォーカス、組み合わせ',
        },
        rows: [
          {
            name: 'semanticLabel',
            type: 'String? · null',
            purpose: {
              en: 'Names the switch for assistive technology. Without it the switch has no accessible name, because it renders no label of its own.',
              ko: '보조 기술에 스위치 이름을 알려요. 스위치는 자체 레이블을 그리지 않으므로 이 값이 없으면 접근 가능한 이름이 비어요.',
              ja: '支援技術に対してスイッチの名前を伝えます。スイッチ自体はラベルを描画しないため、指定しないとアクセシブルな名前が空になります。',
            },
          },
          {
            name: 'focusNode',
            type: 'FocusNode? · null',
            purpose: {
              en: 'Supplies your own focus node. Without it the switch creates and disposes an internal one.',
              ko: '직접 만든 포커스 노드를 넘겨요. 넘기지 않으면 스위치가 내부 노드를 만들고 정리해요.',
              ja: '独自のフォーカスノードを渡します。渡さない場合はスイッチが内部のノードを生成し、破棄します。',
            },
          },
          {
            name: 'autofocus',
            type: 'bool · false',
            purpose: {
              en: 'Requests focus when the switch is first inserted into the tree.',
              ko: '스위치가 트리에 처음 들어갈 때 포커스를 요청해요.',
              ja: 'スイッチがツリーに初めて挿入されたときにフォーカスを要求します。',
            },
          },
          {
            name: 'thumbKey',
            type: 'Key? · null',
            purpose: {
              en: 'Identifies the moving thumb so tests and tooling can measure its geometry.',
              ko: '움직이는 손잡이를 식별해 테스트와 도구가 위치와 크기를 측정할 수 있게 해요.',
              ja: '動くつまみを識別し、テストやツールがその位置とサイズを計測できるようにします。',
            },
          },
        ],
      },
    ],
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
    usage:
      "TRField(\n  label: 'Rack notes',\n  control: TRTextarea(\n    name: 'notes',\n    placeholder: 'Operational notes',\n    onChanged: setNotes,\n  ),\n)",
    contractIntro: {
      en: '`TRTextarea` is the multi-line counterpart to `TRTextField`. Reach for it when the answer is a note or a description rather than a single short value.',
      ko: '`TRTextarea`는 `TRTextField`의 여러 줄 버전이에요. 짧은 값 하나가 아니라 메모나 설명을 받을 때 쓰세요.',
      ja: '`TRTextarea` は `TRTextField` の複数行版です。短い 1 つの値ではなく、メモや説明を受け取る場合に使ってください。',
    },
    contractRows: [
      {
        axis: { en: 'Value', ko: '값', ja: '値' },
        choices: {
          en: 'Pass `initialValue` for an uncontrolled start, or `controller` when the surrounding screen owns the text. Providing both trips an `assert`. `onChanged` reports every edit without taking ownership of the value.',
          ko: '제어되지 않는 초기 상태에는 `initialValue`를, 화면이 텍스트를 직접 관리할 때는 `controller`를 넘기세요. 둘을 함께 주면 `assert`가 걸려요. `onChanged`는 값 소유권을 가져가지 않고 편집만 알려줘요.',
          ja: '非制御の初期状態には `initialValue` を、画面側がテキストを保持する場合は `controller` を渡してください。両方を指定すると `assert` に掛かります。`onChanged` は値の所有権を持たず、編集の通知だけを行います。',
        },
      },
      {
        axis: { en: 'Sizing', ko: '크기', ja: 'サイズ' },
        choices: {
          en: '`uiSize` selects the control typography and inline padding, and the box keeps a minimum height of twice the matching control height. `minLines` (default `2`) sets the starting height; `maxLines` is left unset, so the box grows downward as text wraps. There is no drag handle, unlike the web control.',
          ko: '`uiSize`가 컨트롤 타이포그래피와 좌우 패딩을 정하고, 상자는 해당 사이즈 컨트롤 높이의 두 배를 최소 높이로 유지해요. 시작 높이는 `minLines`(기본값 `2`)로 정하고, `maxLines`는 지정하지 않아서 줄이 늘어나면 상자가 아래로 늘어나요. 웹 컨트롤과 달리 크기 조절 핸들은 없어요.',
          ja: '`uiSize` がコントロールのタイポグラフィと左右の余白を決め、ボックスは対応するコントロール高さの 2 倍を最小高さとして保ちます。開始時の高さは `minLines`（既定値 `2`）で決まり、`maxLines` は未指定なので行が増えるとボックスは下方向に伸びます。Web のコントロールと異なり、リサイズハンドルはありません。',
        },
      },
      {
        axis: { en: 'State', ko: '상태', ja: '状態' },
        choices: {
          en: '`enabled: false` applies the disabled opacity token, and `readOnly: true` keeps the text selectable on the muted surface. Both stop the hover border from strengthening. Focus swaps the border to the focus color at the wider focus border width.',
          ko: '`enabled: false`는 비활성 불투명도 토큰을 적용하고, `readOnly: true`는 muted 표면 위에서 텍스트를 선택할 수 있게 남겨둬요. 둘 다 hover 시 테두리가 진해지지 않게 해요. 포커스를 받으면 테두리가 focus 색과 더 두꺼운 포커스 테두리 두께로 바뀌어요.',
          ja: '`enabled: false` は無効時の不透明度トークンを適用し、`readOnly: true` は淡い背景の上でテキストを選択できる状態に保ちます。どちらも hover 時に枠線が濃くなる挙動を止めます。フォーカス時は枠線がフォーカス色になり、太いフォーカス枠線幅に切り替わります。',
        },
      },
      {
        axis: { en: 'Forms', ko: '폼', ja: 'フォーム' },
        choices: {
          en: 'Set `name` to register the textarea with the nearest `TRForm`, so its text appears in `TRFormState.values` and `save()`. Unlike `TRTextField`, it is not a `FormField`: `validator` is unavailable and `TRFormState.reset()` leaves the text alone. Validate in the submit handler, show the message through `TRField(errorText:)`, and restore the text through a `controller` you own.',
          ko: '`name`을 지정하면 가장 가까운 `TRForm`에 등록돼 텍스트가 `TRFormState.values`와 `save()` 결과에 들어가요. 다만 `TRTextField`와 달리 `FormField`가 아니라서 `validator`를 쓸 수 없고 `TRFormState.reset()`도 텍스트를 되돌리지 않아요. 제출 핸들러에서 직접 검증하고, 메시지는 `TRField(errorText:)`로 보여주고, 텍스트는 직접 소유한 `controller`로 되돌리세요.',
          ja: '`name` を設定すると最も近い `TRForm` に登録され、テキストが `TRFormState.values` と `save()` の結果に含まれます。ただし `TRTextField` と異なり `FormField` ではないため、`validator` は使えず `TRFormState.reset()` でもテキストは戻りません。送信ハンドラーで検証し、メッセージは `TRField(errorText:)` で表示し、テキストは自分で保持する `controller` から戻してください。',
        },
      },
      {
        axis: { en: 'Labeling', ko: '레이블', ja: 'ラベル' },
        choices: {
          en: '`TRTextarea` renders no label of its own. Wrap it in `TRField` to attach a visible label, a description, or an error message. `placeholder` is a hint in the placeholder text color and disappears on the first character, so it cannot replace a label.',
          ko: '`TRTextarea`는 자체 레이블을 그리지 않아요. 보이는 레이블이나 설명, 오류 메시지를 붙이려면 `TRField`로 감싸세요. `placeholder`는 placeholder 텍스트 색으로 표시되는 힌트라 첫 글자를 입력하면 사라지므로 레이블을 대신할 수 없어요.',
          ja: '`TRTextarea` 自体はラベルを描画しません。見えるラベルや説明、エラーメッセージを付けるには `TRField` で包んでください。`placeholder` は placeholder 用のテキスト色で表示されるヒントで、1 文字入力すると消えるためラベルの代わりにはなりません。',
        },
      },
    ],
    apiGroups: [
      {
        title: {
          en: 'TRTextarea properties',
          ko: 'TRTextarea 속성',
          ja: 'TRTextarea のプロパティ',
        },
        rows: [
          {
            name: 'controller',
            type: 'TextEditingController? · null',
            purpose: {
              en: 'Owns the text from outside the widget. Cannot be combined with `initialValue`, and the caller is responsible for disposing it.',
              ko: '위젯 바깥에서 텍스트를 소유해요. `initialValue`와 함께 쓸 수 없고, dispose는 호출한 쪽이 책임져요.',
              ja: 'ウィジェットの外側でテキストを保持します。`initialValue` とは併用できず、dispose は呼び出し側の責任です。',
            },
          },
          {
            name: 'initialValue',
            type: 'String? · null',
            purpose: {
              en: 'Seeds the internal controller once. Later changes to the argument do not replace the text the reader has typed.',
              ko: '내부 컨트롤러를 한 번만 채워요. 이후 인자를 바꿔도 이미 입력된 텍스트를 덮어쓰지 않아요.',
              ja: '内部のコントローラーを一度だけ初期化します。以降に引数を変更しても、入力済みのテキストは置き換わりません。',
            },
          },
          {
            name: 'placeholder',
            type: 'String? · null',
            purpose: {
              en: 'Shows a hint in the placeholder text color while the field is empty.',
              ko: '입력이 비어 있는 동안 placeholder 텍스트 색으로 힌트를 보여줘요.',
              ja: '入力が空の間、placeholder 用のテキスト色でヒントを表示します。',
            },
          },
          {
            name: 'onChanged',
            type: 'ValueChanged<String>? · null',
            purpose: {
              en: 'Fires on every edit with the current text.',
              ko: '편집할 때마다 현재 텍스트와 함께 호출돼요.',
              ja: '編集のたびに現在のテキストとともに呼び出されます。',
            },
          },
          {
            name: 'name',
            type: 'String? · null',
            purpose: {
              en: 'Registers the value with the nearest `TRForm` under this key. Disabled fields are excluded from the collected values, and `reset()` does not restore the text.',
              ko: '가장 가까운 `TRForm`에 이 키로 값을 등록해요. 비활성 필드는 수집된 값에서 빠지고, `reset()`은 텍스트를 되돌리지 않아요.',
              ja: '最も近い `TRForm` にこのキーで値を登録します。無効なフィールドは収集される値から除外され、`reset()` ではテキストは戻りません。',
            },
          },
          {
            name: 'uiSize',
            type: 'TRUiSize · TRUiSize.md',
            purpose: {
              en: 'Selects the font size, inline padding, and the control height the minimum box height is derived from.',
              ko: '글자 크기와 좌우 패딩, 그리고 최소 상자 높이의 기준이 되는 컨트롤 높이를 정해요.',
              ja: '文字サイズ、左右の余白、そして最小のボックス高さの基準となるコントロール高さを決めます。',
            },
          },
          {
            name: 'minLines',
            type: 'int · 2',
            purpose: {
              en: 'Sets how many lines the box shows before it grows. The rendered height never drops below twice the control height for the current `uiSize`.',
              ko: '상자가 늘어나기 전에 보여줄 줄 수를 정해요. 실제 높이는 현재 `uiSize`의 컨트롤 높이 두 배 아래로 내려가지 않아요.',
              ja: 'ボックスが伸び始めるまでに表示する行数を指定します。実際の高さは、現在の `uiSize` のコントロール高さの 2 倍を下回りません。',
            },
          },
          {
            name: 'enabled',
            type: 'bool · true',
            purpose: {
              en: 'Blocks editing and focus, applies the disabled opacity token, and drops the field from the form values.',
              ko: '편집과 포커스를 막고 비활성 불투명도 토큰을 적용하며, 폼 값에서 해당 필드를 제외해요.',
              ja: '編集とフォーカスを止め、無効時の不透明度トークンを適用し、フォームの値からもそのフィールドを外します。',
            },
          },
          {
            name: 'readOnly',
            type: 'bool · false',
            purpose: {
              en: 'Keeps the text focusable and selectable but not editable, on the muted surface. The value still reaches the form.',
              ko: 'muted 표면 위에서 텍스트를 포커스하고 선택할 수는 있지만 편집은 못 하게 해요. 값은 그대로 폼에 전달돼요.',
              ja: '淡い背景の上でテキストのフォーカスと選択は可能なまま、編集だけを止めます。値はフォームにそのまま渡されます。',
            },
          },
          {
            name: 'autofocus',
            type: 'bool · false',
            purpose: {
              en: 'Requests focus when the textarea first mounts. Use it only when the note is the single reason the screen opened.',
              ko: 'Textarea가 처음 마운트될 때 포커스를 요청해요. 메모 입력이 화면을 연 유일한 이유일 때만 쓰세요.',
              ja: 'Textarea が最初にマウントされたときにフォーカスを要求します。メモの入力が画面を開いた唯一の理由である場合にだけ使ってください。',
            },
          },
          {
            name: 'focusNode',
            type: 'FocusNode? · null',
            purpose: {
              en: 'Supplies an external focus node so the screen can move focus to the textarea, for example after a failed submit.',
              ko: '외부 포커스 노드를 넘겨 제출 실패 후처럼 화면이 Textarea로 포커스를 옮길 수 있게 해요.',
              ja: '外部のフォーカスノードを渡し、送信失敗後などに画面側から Textarea へフォーカスを移せるようにします。',
            },
          },
        ],
      },
    ],
  },
  toggle: {
    title: 'Toggle',
    description: {
      en: 'Press a two-state control that stays pressed until released.',
      ko: '해제할 때까지 눌린 상태를 유지하는 2상태 컨트롤이에요.',
      ja: '解除するまで押下状態を保つ 2 状態のコントロールです。',
    },
    usage: {
      en: String.raw`class FormattingBar extends StatefulWidget {
  const FormattingBar({super.key});

  @override
  State<FormattingBar> createState() => _FormattingBarState();
}

class _FormattingBarState extends State<FormattingBar> {
  bool bold = false;

  @override
  Widget build(BuildContext context) {
    return TRToggle(
      pressed: bold,
      onPressedChange: (next) => setState(() => bold = next),
      child: const Text('Bold'),
    );
  }
}`,
      ko: String.raw`class FormattingBar extends StatefulWidget {
  const FormattingBar({super.key});

  @override
  State<FormattingBar> createState() => _FormattingBarState();
}

class _FormattingBarState extends State<FormattingBar> {
  bool bold = false;

  @override
  Widget build(BuildContext context) {
    return TRToggle(
      pressed: bold,
      onPressedChange: (next) => setState(() => bold = next),
      child: const Text('굵게'),
    );
  }
}`,
      ja: String.raw`class FormattingBar extends StatefulWidget {
  const FormattingBar({super.key});

  @override
  State<FormattingBar> createState() => _FormattingBarState();
}

class _FormattingBarState extends State<FormattingBar> {
  bool bold = false;

  @override
  Widget build(BuildContext context) {
    return TRToggle(
      pressed: bold,
      onPressedChange: (next) => setState(() => bold = next),
      child: const Text('太字'),
    );
  }
}`,
    },
    contractRows: [
      {
        axis: { en: 'State', ko: '상태', ja: '状態' },
        choices: {
          en: 'Pass `pressed` to control the state, or leave it `null` and start from `defaultPressed`, which is `false`. `onPressedChange` reports the next value in both cases.',
          ko: '`pressed`를 넘기면 상태를 직접 제어하고, 넘기지 않으면 `false`인 `defaultPressed`에서 시작해 스스로 관리해요. 두 방식 모두 `onPressedChange`로 다음 값을 알려줘요.',
          ja: '`pressed` を渡すと状態を制御でき、渡さない場合は `false` の `defaultPressed` から自身で管理します。どちらでも `onPressedChange` が次の値を通知します。',
        },
      },
      {
        axis: { en: 'Availability', ko: '사용 가능 여부', ja: '利用可否' },
        choices: {
          en: '`disabled` blocks taps and keyboard activation and applies the disabled opacity token. The pressed appearance stays visible.',
          ko: '`disabled`는 탭과 키보드 조작을 막고 비활성 불투명도 토큰을 적용해요. 눌린 모습은 그대로 보여요.',
          ja: '`disabled` はタップとキーボード操作を無効にし、無効時の不透明度トークンを適用します。押下時の見た目は保たれます。',
        },
      },
      {
        axis: { en: 'Label', ko: '레이블', ja: 'ラベル' },
        choices: {
          en: '`child` is required and provides the visible, accessible name. Keep it short enough to read at every size.',
          ko: '`child`는 필수이고 눈에 보이면서 접근 가능한 이름이 돼요. 어떤 크기에서도 읽히도록 짧게 쓰세요.',
          ja: '`child` は必須で、表示されるアクセシブルな名前になります。どのサイズでも読めるよう短くしてください。',
        },
      },
      {
        axis: { en: 'Size', ko: '크기', ja: 'サイズ' },
        choices: {
          en: '`uiSize` accepts `md` and `lg`; the default is `md`. Each size sets height, inline padding, and text size from the shared control metrics.',
          ko: '`uiSize`는 `md`, `lg`를 받고 기본값은 `md`예요. 각 크기는 공통 컨트롤 지표에서 높이와 좌우 여백, 글자 크기를 함께 정해요.',
          ja: '`uiSize` は `md`、`lg` を受け取り、既定値は `md` です。各サイズは共通のコントロール指標から高さ・左右の余白・文字サイズを決めます。',
        },
      },
      {
        axis: { en: 'Grouping', ko: '그룹', ja: 'グループ' },
        choices: {
          en: 'Inside a `TRToggleGroup`, a toggle with a `value` takes its pressed state from the group. `pressed` and `onPressedChange` are then ignored, and the group `disabled` adds to the item one.',
          ko: '`TRToggleGroup` 안에서 `value`가 있는 토글은 눌림 상태를 그룹에서 가져와요. 이때 `pressed`와 `onPressedChange`는 쓰이지 않고, 그룹의 `disabled`가 항목의 `disabled`에 더해져요.',
          ja: '`TRToggleGroup` の内側では、`value` を持つトグルは押下状態をグループから受け取ります。その場合 `pressed` と `onPressedChange` は使われず、グループの `disabled` が項目の `disabled` に加わります。',
        },
      },
    ],
    contractIntro: {
      en: 'A toggle is a button that stays pressed, not a form field: it exposes `Semantics(button: true, toggled: pressed)` and submits no value. Enter activates on key down and Space on key up, matching native buttons. Use `TRCheckbox` or `TRSwitch` when the value has to travel with a form.',
      ko: '토글은 눌린 상태를 유지하는 버튼이지 폼 필드가 아니에요. `Semantics(button: true, toggled: pressed)`를 노출하고 값을 제출하지 않아요. 네이티브 버튼처럼 Enter는 누를 때, Space는 뗄 때 동작해요. 값이 폼과 함께 전송돼야 한다면 `TRCheckbox`나 `TRSwitch`를 쓰세요.',
      ja: 'トグルは押下状態を保つボタンであり、フォームフィールドではありません。`Semantics(button: true, toggled: pressed)` を公開し、値は送信しません。ネイティブのボタンと同じく Enter は押下時、Space は離した時に作動します。値をフォームで送る必要がある場合は `TRCheckbox` か `TRSwitch` を使ってください。',
    },
    apiGroups: [
      {
        title: {
          en: 'TRToggle properties',
          ko: 'TRToggle 속성',
          ja: 'TRToggle のプロパティ',
        },
        rows: [
          {
            name: 'child',
            type: 'Widget · required',
            purpose: {
              en: 'Renders the label. Text styling comes from `uiSize` and the theme, so an explicit `TextStyle` is unnecessary.',
              ko: '레이블을 렌더링해요. 글자 스타일은 `uiSize`와 테마에서 오므로 `TextStyle`을 따로 지정하지 않아도 돼요.',
              ja: 'ラベルを描画します。文字のスタイルは `uiSize` とテーマから決まるため、`TextStyle` の明示は不要です。',
            },
          },
          {
            name: 'pressed',
            type: 'bool? · null',
            purpose: {
              en: 'Controls the pressed state. While it is non-null the widget never changes state on its own.',
              ko: '눌림 상태를 제어해요. 값이 있으면 위젯이 스스로 상태를 바꾸지 않아요.',
              ja: '押下状態を制御します。値がある間、ウィジェットは自分で状態を変えません。',
            },
          },
          {
            name: 'defaultPressed',
            type: 'bool · false',
            purpose: {
              en: 'Sets the initial state of an uncontrolled toggle. It is ignored once `pressed` is provided.',
              ko: '제어하지 않는 토글의 처음 상태를 정해요. `pressed`를 넘기면 쓰이지 않아요.',
              ja: '制御しないトグルの初期状態を設定します。`pressed` を渡した場合は使われません。',
            },
          },
          {
            name: 'onPressedChange',
            type: 'ValueChanged<bool>? · null',
            purpose: {
              en: 'Reports the next pressed value after a tap, Enter, or Space. There is no way to veto the change.',
              ko: '탭이나 Enter, Space 이후의 다음 눌림 값을 알려줘요. 변경을 취소할 수단은 없어요.',
              ja: 'タップや Enter、Space の後の次の押下値を通知します。変更を取り消す手段はありません。',
            },
          },
          {
            name: 'disabled',
            type: 'bool · false',
            purpose: {
              en: 'Removes pointer and keyboard activation and marks the toggle as disabled for assistive technology.',
              ko: '포인터와 키보드 조작을 막고 보조 기술에 비활성 상태로 알려요.',
              ja: 'ポインターとキーボードの操作を無効にし、支援技術に無効状態として伝えます。',
            },
          },
          {
            name: 'uiSize',
            type: 'TRUiSize · TRUiSize.md',
            purpose: {
              en: 'Selects the `md` or `lg` control metrics.',
              ko: '`md`, `lg` 중 컨트롤 지표를 선택해요.',
              ja: '`md`、`lg` のコントロール指標を選びます。',
            },
          },
          {
            name: 'value',
            type: 'String? · null',
            purpose: {
              en: 'Identifies the toggle inside a `TRToggleGroup`. Keep it stable and unique within the group.',
              ko: '`TRToggleGroup` 안에서 토글을 식별해요. 그룹 안에서 고유하고 변하지 않는 값을 쓰세요.',
              ja: '`TRToggleGroup` 内でトグルを識別します。グループ内で一意かつ変化しない値にしてください。',
            },
          },
          {
            name: 'focusNode',
            type: 'FocusNode? · null',
            purpose: {
              en: 'Takes over focus handling. Without one the toggle creates and disposes its own node, or borrows the node its group manages.',
              ko: '포커스 처리를 넘겨받아요. 넘기지 않으면 토글이 직접 노드를 만들고 정리하거나, 그룹이 관리하는 노드를 빌려 써요.',
              ja: 'フォーカス処理を引き受けます。渡さない場合はトグルが自身のノードを生成・破棄するか、グループが管理するノードを利用します。',
            },
          },
          {
            name: 'autofocus',
            type: 'bool · false',
            purpose: {
              en: 'Requests focus when the toggle first appears. Use it at most once per screen.',
              ko: '토글이 처음 나타날 때 포커스를 요청해요. 한 화면에서 한 번만 쓰세요.',
              ja: 'トグルが最初に表示された時にフォーカスを要求します。1 画面につき 1 か所までにしてください。',
            },
          },
        ],
      },
    ],
  },
  'toggle-group': {
    title: 'ToggleGroup',
    description: {
      en: 'Coordinate single or multiple pressed toggles by value.',
      ko: '값 기준으로 단일 또는 다중 눌림 토글을 관리해요.',
      ja: '値に基づいて単一または複数の押下トグルを管理します。',
    },
    usage: {
      en: String.raw`class AlignmentBar extends StatefulWidget {
  const AlignmentBar({super.key});

  @override
  State<AlignmentBar> createState() => _AlignmentBarState();
}

class _AlignmentBarState extends State<AlignmentBar> {
  List<String> alignment = const ['start'];

  @override
  Widget build(BuildContext context) {
    return TRToggleGroup(
      value: alignment,
      onValueChange: (next) => setState(() => alignment = next),
      children: const [
        TRToggle(value: 'start', child: Text('Start')),
        TRToggle(value: 'center', child: Text('Center')),
        TRToggle(value: 'end', child: Text('End')),
      ],
    );
  }
}`,
      ko: String.raw`class AlignmentBar extends StatefulWidget {
  const AlignmentBar({super.key});

  @override
  State<AlignmentBar> createState() => _AlignmentBarState();
}

class _AlignmentBarState extends State<AlignmentBar> {
  List<String> alignment = const ['start'];

  @override
  Widget build(BuildContext context) {
    return TRToggleGroup(
      value: alignment,
      onValueChange: (next) => setState(() => alignment = next),
      children: const [
        TRToggle(value: 'start', child: Text('시작')),
        TRToggle(value: 'center', child: Text('가운데')),
        TRToggle(value: 'end', child: Text('끝')),
      ],
    );
  }
}`,
      ja: String.raw`class AlignmentBar extends StatefulWidget {
  const AlignmentBar({super.key});

  @override
  State<AlignmentBar> createState() => _AlignmentBarState();
}

class _AlignmentBarState extends State<AlignmentBar> {
  List<String> alignment = const ['start'];

  @override
  Widget build(BuildContext context) {
    return TRToggleGroup(
      value: alignment,
      onValueChange: (next) => setState(() => alignment = next),
      children: const [
        TRToggle(value: 'start', child: Text('先頭')),
        TRToggle(value: 'center', child: Text('中央')),
        TRToggle(value: 'end', child: Text('末尾')),
      ],
    );
  }
}`,
    },
    contractRows: [
      {
        axis: { en: 'Selection', ko: '선택', ja: '選択' },
        choices: {
          en: 'One value at most by default, and tapping the selected item clears the group. `multiple` lets every item toggle independently.',
          ko: '기본값은 최대 한 개이고, 선택된 항목을 다시 누르면 선택이 비워져요. `multiple`을 켜면 각 항목을 따로 켜고 끌 수 있어요.',
          ja: '既定では最大 1 つで、選択中の項目をもう一度押すと選択が解除されます。`multiple` を有効にすると各項目を個別に切り替えられます。',
        },
      },
      {
        axis: { en: 'State', ko: '상태', ja: '状態' },
        choices: {
          en: 'Pass `value` to control the selection, or leave it `null` and start from `defaultValue`. Both are `List<String>`, and the default is empty.',
          ko: '`value`를 넘기면 선택을 직접 제어하고, 넘기지 않으면 `defaultValue`에서 시작해요. 둘 다 `List<String>`이고 기본값은 비어 있어요.',
          ja: '`value` を渡すと選択を制御でき、渡さない場合は `defaultValue` から始まります。どちらも `List<String>` で、既定は空です。',
        },
      },
      {
        axis: { en: 'Orientation', ko: '방향', ja: '方向' },
        choices: {
          en: '`orientation` takes a Flutter `Axis`; the default is `Axis.horizontal`. It sets both the layout direction and the arrow-key axis.',
          ko: '`orientation`은 Flutter의 `Axis`를 받고 기본값은 `Axis.horizontal`이에요. 배치 방향과 방향키 축을 함께 정해요.',
          ja: '`orientation` は Flutter の `Axis` を受け取り、既定値は `Axis.horizontal` です。レイアウトの向きと方向キーの軸をまとめて決めます。',
        },
      },
      {
        axis: { en: 'Keyboard', ko: '키보드', ja: 'キーボード' },
        choices: {
          en: 'Tab reaches the group once and then the arrow keys along the orientation axis, plus Home and End, move between items. Focus wraps at the ends unless `loopFocus` is `false`, and disabled items are skipped.',
          ko: 'Tab으로 그룹에 한 번 들어간 뒤에는 방향 축의 화살표 키와 Home, End로 항목 사이를 이동해요. `loopFocus`가 `false`가 아니면 양 끝에서 포커스가 순환하고, 비활성 항목은 건너뛰어요.',
          ja: 'Tab でグループに入った後は、方向軸の矢印キーと Home・End で項目間を移動します。`loopFocus` が `false` でなければ端でフォーカスが循環し、無効な項目は飛ばされます。',
        },
      },
      {
        axis: { en: 'Availability', ko: '사용 가능 여부', ja: '利用可否' },
        choices: {
          en: 'The group `disabled` turns off every item, and a single `TRToggle` can be disabled on its own.',
          ko: '그룹의 `disabled`는 모든 항목을 끄고, 개별 `TRToggle`만 따로 끌 수도 있어요.',
          ja: 'グループの `disabled` はすべての項目を無効にし、個々の `TRToggle` を単独で無効にすることもできます。',
        },
      },
    ],
    contractIntro: {
      en: 'The group holds the selection and its children are public `TRToggle` widgets, so each item needs a stable, unique `value`. Like a single toggle the group submits no form value; use `TRCheckboxGroup` or `TRRadioGroup` when the selection has to travel with a form.',
      ko: '그룹이 선택을 들고 있고 자식은 공개 위젯인 `TRToggle`이므로, 각 항목에는 고유하고 변하지 않는 `value`가 필요해요. 단일 토글과 마찬가지로 그룹도 폼 값을 제출하지 않으니, 선택이 폼과 함께 전송돼야 한다면 `TRCheckboxGroup`이나 `TRRadioGroup`을 쓰세요.',
      ja: 'グループが選択を保持し、子は公開ウィジェットの `TRToggle` なので、各項目には一意で変化しない `value` が必要です。単一のトグルと同じくグループもフォーム値を送信しないため、選択をフォームで送る必要がある場合は `TRCheckboxGroup` か `TRRadioGroup` を使ってください。',
    },
    apiGroups: [
      {
        title: {
          en: 'TRToggleGroup properties',
          ko: 'TRToggleGroup 속성',
          ja: 'TRToggleGroup のプロパティ',
        },
        rows: [
          {
            name: 'children',
            type: 'List<TRToggle> · required',
            purpose: {
              en: 'Lists the items in visual and focus order. The type is `TRToggle`, so the group can read each item `value` and `disabled`.',
              ko: '항목을 화면 순서이자 포커스 순서로 나열해요. 타입이 `TRToggle`이라 그룹이 각 항목의 `value`와 `disabled`를 읽을 수 있어요.',
              ja: '項目を表示順かつフォーカス順に並べます。型が `TRToggle` なので、グループは各項目の `value` と `disabled` を読み取れます。',
            },
          },
          {
            name: 'value',
            type: 'List<String>? · null',
            purpose: {
              en: 'Controls the selected values. While it is non-null the group never changes the selection on its own.',
              ko: '선택된 값을 제어해요. 값이 있으면 그룹이 스스로 선택을 바꾸지 않아요.',
              ja: '選択中の値を制御します。値がある間、グループは自分で選択を変えません。',
            },
          },
          {
            name: 'defaultValue',
            type: 'List<String> · const []',
            purpose: {
              en: 'Sets the initial selection of an uncontrolled group. It is ignored once `value` is provided.',
              ko: '제어하지 않는 그룹의 처음 선택을 정해요. `value`를 넘기면 쓰이지 않아요.',
              ja: '制御しないグループの初期選択を設定します。`value` を渡した場合は使われません。',
            },
          },
          {
            name: 'onValueChange',
            type: 'ValueChanged<List<String>>? · null',
            purpose: {
              en: 'Reports the next list after an item changes. There is no way to veto the change.',
              ko: '항목이 바뀐 뒤의 다음 목록을 알려줘요. 변경을 취소할 수단은 없어요.',
              ja: '項目が変わった後の次のリストを通知します。変更を取り消す手段はありません。',
            },
          },
          {
            name: 'multiple',
            type: 'bool · false',
            purpose: {
              en: 'Allows each item to be toggled independently instead of keeping at most one value.',
              ko: '값을 최대 하나만 두는 대신 각 항목을 독립적으로 켜고 끌 수 있게 해요.',
              ja: '値を 1 つに保つ代わりに、各項目を独立して切り替えられるようにします。',
            },
          },
          {
            name: 'orientation',
            type: 'Axis · Axis.horizontal',
            purpose: {
              en: 'Lays the items out along this axis and selects the arrow keys that move focus.',
              ko: '이 축을 따라 항목을 배치하고, 포커스를 옮기는 화살표 키를 정해요.',
              ja: 'この軸に沿って項目を並べ、フォーカスを移動する矢印キーを決めます。',
            },
          },
          {
            name: 'loopFocus',
            type: 'bool · true',
            purpose: {
              en: 'Wraps arrow-key focus at the first and last enabled item. Set it to `false` to stop at the ends.',
              ko: '처음과 마지막 사용 가능 항목에서 방향키 포커스를 순환시켜요. `false`로 두면 양 끝에서 멈춰요.',
              ja: '最初と最後の有効な項目で矢印キーのフォーカスを循環させます。`false` にすると端で止まります。',
            },
          },
          {
            name: 'disabled',
            type: 'bool · false',
            purpose: {
              en: 'Disables every item in the group, on top of any item that is disabled on its own.',
              ko: '개별로 비활성인 항목과 더해, 그룹의 모든 항목을 비활성으로 만들어요.',
              ja: '個別に無効な項目に加えて、グループのすべての項目を無効にします。',
            },
          },
        ],
      },
    ],
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
          en: '`uiSize` accepts `md` and `lg`; the default is `md`. Each size sets a square target and its icon size from the shared control metrics.',
          ko: '`uiSize`는 `md`, `lg`를 받고 기본값은 `md`예요. 각 크기는 공통 컨트롤 지표에서 정사각형 터치 영역과 아이콘 크기를 함께 정해요.',
          ja: '`uiSize` は `md`、`lg` を受け取り、既定値は `md` です。各サイズは共通のコントロール指標から正方形のタップ領域とアイコンサイズを決めます。',
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
      "TRWindowFrameTitleBar(\n  leading: const Text('File'),\n  actions: TRWindowCaptionButton(\n    action: TRWindowCaptionAction.maximize,\n    glyphStyle: TRWindowCaptionGlyphStyle.expandCollapse,\n    label: 'Maximize window',\n    onPressed: maximizeWindow,\n  ),\n  child: const Text('Tinyrack'),\n)",
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
          en: '`none`, `md`, `lg`',
          ko: '`none`, `md`, `lg`',
          ja: '`none`, `md`, `lg`',
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
            name: 'TRWindowFrameTitleBar.leading / actions',
            type: 'Widget?',
            purpose: {
              en: 'Places application menus and native caption actions on opposite edges.',
              ko: '앱 메뉴와 네이티브 캡션 동작을 양쪽 가장자리에 배치해요.',
              ja: 'アプリメニューとネイティブのキャプション操作を両端に配置します。',
            },
          },
          {
            name: 'TRWindowCaptionButton.action',
            type: 'TRWindowCaptionAction',
            purpose: {
              en: 'Selects a Lucide minimize, maximize, restore, or close glyph.',
              ko: 'Lucide 최소화, 최대화, 복원 또는 닫기 글리프를 선택해요.',
              ja: 'Lucide の最小化、最大化、復元、閉じるグリフを選択します。',
            },
          },
          {
            name: 'TRWindowCaptionButton.glyphStyle',
            type: 'TRWindowCaptionGlyphStyle · standard',
            purpose: {
              en: 'Chooses standard window marks or neutral expand-and-collapse corner glyphs.',
              ko: '표준 창 표시 또는 중립 확장·축소 모서리 글리프를 선택해요.',
              ja: '標準のウィンドウ記号またはニュートラルな展開・縮小コーナーグリフを選びます。',
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
