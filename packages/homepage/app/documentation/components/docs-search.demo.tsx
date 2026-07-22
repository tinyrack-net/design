import {
  TRDocsSearch,
  type TRDocsSearchResult,
  type TRDocsSearchTriggerProps,
} from '@tinyrack/ui/components/docs-search';
import { useState } from 'react';
import type {
  DemoMeta as Meta,
  DemoVariant as StoryObj,
} from '../../playground/demo.js';
import { definePlayground } from '../../playground/demo.js';
import { useDemoLocale } from '../shared/demo-locale.js';

const getResults = (locale: 'en' | 'ko' | 'ja'): readonly TRDocsSearchResult[] => {
  const copy = { en: ['Install the UI package and import the component stylesheet.', 'Getting started', 'Installation', 'Configure localized messages and keyboard shortcuts.', 'Guides', 'Localization'], ko: ['UI 패키지를 설치하고 컴포넌트 스타일시트를 불러오세요.', '시작하기예요', '설치해요', '현지화 메시지와 키보드 단축키를 구성하세요.', '가이드예요', '현지화해요'], ja: ['UI パッケージをインストールし、コンポーネントのスタイルシートを読み込みます。', 'はじめに', 'インストール', 'ローカライズメッセージとキーボードショートカットを設定します。', 'ガイド', 'ローカライズ'] }[locale];
  return [
  {
    excerpt: copy[0] ?? '',
    excerptMatches: [{ end: 7, start: 0 }],
    id: 'install',
    section: copy[1] ?? '',
    title: copy[2] ?? '',
    titleMatches: [{ end: 7, start: 0 }],
    url: '/install',
  },
  {
    excerpt: copy[3] ?? '',
    id: 'localization',
    section: copy[4] ?? '',
    title: copy[5] ?? '',
    url: '/localization',
  },
  ];
};
type Args = {
  compact: boolean;
  disabled: boolean;
  label: string;
  shortcutLabel: string;
  uiSize: NonNullable<TRDocsSearchTriggerProps['uiSize']>;
};

export function DocsSearchPreview({
  compact,
  disabled,
  label,
  shortcutLabel,
  uiSize,
}: Args) {
  const locale = useDemoLocale();
  const results = getResults(locale);
  const messages = {
    en: { close: 'Close search', empty: 'No documentation found.', error: 'Documentation search is unavailable.', fallback: 'Using the bundled fallback index.', idle: 'Type to search documentation.', loading: 'Searching documentation', placeholder: 'Search documentation', results: 'Search results', title: 'Search documentation', trigger: 'Search docs' },
    ko: { close: '검색을 닫아요', empty: '문서를 찾지 못했어요.', error: '문서 검색을 사용할 수 없어요.', fallback: '내장된 대체 색인을 사용해요.', idle: '검색어를 입력해요.', loading: '문서를 검색하고 있어요', placeholder: '문서를 검색해요', results: '검색 결과예요', title: '문서를 검색해요', trigger: '문서를 검색해요' },
    ja: { close: '検索を閉じる', empty: 'ドキュメントが見つかりません。', error: 'ドキュメント検索を利用できません。', fallback: '内蔵の代替インデックスを使用しています。', idle: '検索語を入力してください。', loading: 'ドキュメントを検索しています', placeholder: 'ドキュメントを検索', results: '検索結果', title: 'ドキュメントを検索', trigger: 'ドキュメントを検索' },
  }[locale];
  const [open, setOpen] = useState(false);
  return (
    <div data-docs-example-item="">
      <TRDocsSearch.Trigger
        aria-label={label}
        compact={compact}
        disabled={disabled}
        label={label}
        onClick={() => setOpen(true)}
        shortcutLabel={shortcutLabel}
        uiSize={uiSize}
      />
      <TRDocsSearch.Dialog
        messages={messages}
        enableShortcut={false}
        onOpenChange={setOpen}
        onSearch={async (query) => {
          const normalizedQuery = query.toLocaleLowerCase();
          return results.filter((result) =>
            `${result.title} ${result.section ?? ''} ${result.excerpt}`
              .toLocaleLowerCase()
              .includes(normalizedQuery),
          );
        }}
        onSelect={() => setOpen(false)}
        open={open}
      />
    </div>
  );
}

export function DocsSearchSizes() {
  const locale = useDemoLocale();
  const label = { en: 'Search docs', ko: '문서를 검색하세요', ja: 'ドキュメントを検索' }[locale];
  return <div className="grid gap-3" data-docs-example-item-count="3">{(['sm', 'md', 'lg'] as const).map((uiSize) => <DocsSearchPreview compact={false} disabled={false} key={uiSize} label={`${uiSize.toUpperCase()} ${label}`} shortcutLabel="Ctrl / ⌘ K" uiSize={uiSize} />)}</div>;
}

export function DocsSearchCompact() {
  const label = { en: 'Search docs', ko: '문서를 검색하세요', ja: 'ドキュメントを検索' }[useDemoLocale()];
  return <DocsSearchPreview compact disabled={false} label={label} shortcutLabel="Ctrl / ⌘ K" uiSize="md" />;
}

export function DocsSearchDisabled() {
  const label = { en: 'Search unavailable', ko: '검색할 수 없어요', ja: '検索できません' }[useDemoLocale()];
  return <DocsSearchPreview compact={false} disabled label={label} shortcutLabel="Ctrl / ⌘ K" uiSize="md" />;
}

export const docsSearchBasicSource = `import '@tinyrack/ui/components/docs-search.css';
import {
  TRDocsSearch,
  type TRDocsSearchResult,
} from '@tinyrack/ui/components/docs-search';
import { useRef, useState } from 'react';

async function searchDocs(query: string, signal: AbortSignal) {
  const response = await fetch(
    \`/api/docs-search?q=\${encodeURIComponent(query)}\`,
    { signal },
  );
  if (!response.ok) throw new Error('Documentation search failed');
  const payload = (await response.json()) as {
    results: readonly TRDocsSearchResult[];
  };
  if (signal.aborted) return [];
  return payload.results;
}

export function DocumentationSearch() {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  return (
    <>
      <TRDocsSearch.Trigger
        label="Search docs"
        onClick={() => setOpen(true)}
        ref={triggerRef}
        shortcutLabel="Ctrl / ⌘ K"
      />
      <TRDocsSearch.Dialog
        messages={{ error: 'Search is temporarily unavailable.' }}
        onOpenChange={setOpen}
        onSearch={searchDocs}
        onSelect={(result) => window.location.assign(result.url)}
        open={open}
        returnFocusRef={triggerRef}
      />
    </>
  );
}`;

const meta = {
  args: {
    compact: false,
    disabled: false,
    label: 'Search docs',
    shortcutLabel: 'Ctrl / ⌘ K',
    uiSize: 'md',
  },
  argTypes: {
    compact: { control: 'boolean' },
    disabled: { control: 'boolean' },
    label: { control: 'text' },
    shortcutLabel: { control: 'text' },
    uiSize: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
  parameters: { layout: 'centered' },
  render: DocsSearchPreview,
  title: 'Components/DocsSearch',
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const playground = definePlayground(meta);
