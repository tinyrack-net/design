import { TRCodeBlock } from '@tinyrack/ui/components/code-block';
import { ComponentPlayground } from '../../playground/playground.js';
import type { DemoLocale } from '../shared/demo-locale.js';
import { flutterPlaygrounds } from './playgrounds.js';

type FlutterComponentId = keyof typeof flutterPlaygrounds;

const componentData: Record<
  FlutterComponentId,
  {
    description: Record<DemoLocale, string>;
    title: string;
    usage: string;
  }
> = {
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
    install: 'Install',
    installBody: 'Add the package, then import its public library.',
    playground: 'Playground',
    usage: 'Usage',
  },
  ja: {
    api: 'API',
    contract: '主なプロパティ',
    install: 'インストール',
    installBody: 'パッケージを追加し、公開ライブラリをインポートしてください。',
    playground: 'プレイグラウンド',
    usage: '使用方法',
  },
  ko: {
    api: 'API',
    contract: '핵심 속성',
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
  return (
    <>
      <p>{data.description[locale]}</p>

      <h2>{labels.contract}</h2>
      <p>
        {locale === 'ko'
          ? '시맨틱 값은 웹과 공유하지만 위젯 동작은 Flutter와 Material 3 규약을 따라요.'
          : locale === 'ja'
            ? 'セマンティック値は Web と共有し、ウィジェットの動作は Flutter と Material 3 の規約に従います。'
            : 'Semantic values match the web system while widget behavior follows Flutter and Material 3.'}
      </p>

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

      <h2>{labels.api}</h2>
      <p>
        {locale === 'ko'
          ? `${data.title}는 Flutter의 네이티브 상태와 콜백을 유지하고 Tinyrack 토큰을 기본값으로 사용해요.`
          : locale === 'ja'
            ? `${data.title} は Flutter のネイティブ状態とコールバックを保ち、Tinyrack トークンを既定値として使用します。`
            : `${data.title} preserves native Flutter state and callbacks while applying Tinyrack token defaults.`}
      </p>
    </>
  );
}
