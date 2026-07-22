import { TRBadge } from '@tinyrack/ui/components/badge';
import { TRCode } from '@tinyrack/ui/components/code';
import {
  type TRColorScheme,
  TRColorSchemeToggle,
} from '@tinyrack/ui/components/color-scheme-toggle';
import {
  TRDocsNavigation,
  type TRDocsNavigationItem,
} from '@tinyrack/ui/components/docs-navigation';
import { TRDocsSearch } from '@tinyrack/ui/components/docs-search';
import {
  TRDocsShell,
  type TRDocsShellLayout,
} from '@tinyrack/ui/components/docs-shell';
import { TRLanguageSelect } from '@tinyrack/ui/components/language-select';
import { TRLink } from '@tinyrack/ui/components/link';
import { TRTableOfContents } from '@tinyrack/ui/components/table-of-contents';
import { type CSSProperties, useState } from 'react';
import type {
  DemoMeta as Meta,
  DemoVariant as StoryObj,
} from '../../playground/demo.js';
import { definePlayground } from '../../playground/demo.js';
import { useDemoLocale } from '../shared/demo-locale.js';

type Args = { layout: TRDocsShellLayout };
export function DocsShellPreview({
  layout,
  pending = false,
}: {
  layout: TRDocsShellLayout;
  pending?: boolean;
}) {
  const locale = useDemoLocale();
  const copy = {
    en: ['Documentation', 'Navigation', 'Router-neutral documentation shell.'],
    ko: ['문서예요', '탐색이에요', '라우터에 종속되지 않는 문서 셸이에요.'],
    ja: [
      'ドキュメント',
      'ナビゲーション',
      'ルーターに依存しないドキュメントシェルです。',
    ],
  }[locale];
  return (
    <div className="h-96 w-full overflow-hidden" data-docs-example-item="">
      <TRDocsShell.Root
        {...(pending ? { pendingPath: '/next' } : {})}
        currentPath="/guide"
        layout={layout}
        locationKey="demo"
        style={{ '--tr-docs-shell-block-size': '100%' } as CSSProperties}
      >
        <TRDocsShell.Header>
          <TRDocsShell.Brand>Tinyrack</TRDocsShell.Brand>
        </TRDocsShell.Header>
        <TRDocsShell.Sidebar aria-label={copy[0]}>{copy[1]}</TRDocsShell.Sidebar>
        <TRDocsShell.Main render={<div />}>
          <article className="p-6">
            <h2>{copy[0]}</h2>
            <p>{copy[2]}</p>
          </article>
        </TRDocsShell.Main>
      </TRDocsShell.Root>
    </div>
  );
}

const getNavigationItems = (
  locale: 'en' | 'ko' | 'ja',
): readonly TRDocsNavigationItem[] => {
  const copy = {
    en: ['Installation', 'Configuration', 'Getting started', 'Components'],
    ko: ['설치해요', '구성해요', '시작하기예요', '컴포넌트예요'],
    ja: ['インストール', '設定', 'はじめに', 'コンポーネント'],
  }[locale];
  return [
    {
      children: [
        { label: copy[0] ?? '', path: '/install', type: 'page' },
        { label: copy[1] ?? '', path: '/configure', type: 'page' },
      ],
      label: copy[2] ?? '',
      type: 'group',
    },
    {
      children: [
        { label: 'TRButton', path: '/components/button', type: 'page' },
        { label: 'Docs Shell', path: '/components/docs-shell', type: 'page' },
      ],
      label: copy[3] ?? '',
      type: 'group',
    },
  ];
};

const tableOfContentsItems = [
  { depth: 2 as const, id: 'contract', label: 'Contract' },
  { depth: 2 as const, id: 'composition', label: 'Composition' },
  { depth: 2 as const, id: 'api', label: 'API' },
];

export const docsShellCompositionSource = `import '@tinyrack/ui/components/button.css';
import { TRButton } from '@tinyrack/ui/components/button';
import '@tinyrack/ui/components/docs-shell.css';
import { TRDocsShell } from '@tinyrack/ui/components/docs-shell';
import '@tinyrack/ui/components/link.css';
import { TRLink } from '@tinyrack/ui/components/link';
import type { ReactNode } from 'react';

export function DocumentationShell({ children }: { children: ReactNode }) {
  return (
    <TRDocsShell.Root
      currentPath="/guide"
      hash=""
      layout="docs"
      locationKey="guide"
      navigationKind="PUSH"
    >
      <TRDocsShell.Header>
        <TRDocsShell.Brand>
          <TRLink href="/" underline="none">Acme Docs</TRLink>
        </TRDocsShell.Brand>
        <TRDocsShell.Actions>
          <TRButton type="button" variant="secondary">Search</TRButton>
        </TRDocsShell.Actions>
      </TRDocsShell.Header>
      <TRDocsShell.Sidebar aria-label="Documentation navigation">
        <nav aria-label="Guides">
          <TRLink aria-current="page" href="/guide">Guide</TRLink>
          <TRLink href="/api">API</TRLink>
        </nav>
      </TRDocsShell.Sidebar>
      <TRDocsShell.Main viewportLabel="Documentation page">
        <article>{children}</article>
        <TRDocsShell.Outline aria-label="On this page">
          <TRLink href="#overview">Overview</TRLink>
        </TRDocsShell.Outline>
      </TRDocsShell.Main>
    </TRDocsShell.Root>
  );
}`;

export const docsShellLayoutsSource = `import '@tinyrack/ui/components/docs-shell.css';
import { TRDocsShell } from '@tinyrack/ui/components/docs-shell';

export function LandingPage() {
  return (
    <TRDocsShell.Root currentPath="/" layout="splash" locationKey="home">
      <TRDocsShell.Header>
        <TRDocsShell.Brand>Acme</TRDocsShell.Brand>
      </TRDocsShell.Header>
      <TRDocsShell.Main><h1>Build faster</h1></TRDocsShell.Main>
    </TRDocsShell.Root>
  );
}

export function ApiReference() {
  return (
    <TRDocsShell.Root
      currentPath="/api"
      layout="standalone"
      locationKey="api"
    >
      <TRDocsShell.Main contentClassName="api-reference" viewportLabel="API reference">
        <h1>API reference</h1>
      </TRDocsShell.Main>
    </TRDocsShell.Root>
  );
}`;

export function DocsShellDocsPreview() {
  const locale = useDemoLocale();
  const navigationItems = getNavigationItems(locale);
  const copy = {
    en: {
      site: 'Site navigation',
      docs: 'Docs',
      components: 'Components',
      language: 'Language',
      search: 'Search documentation',
      navigation: 'Documentation navigation',
      section: 'Components',
      layout: 'Layout',
      composition: 'Composition',
      description:
        'Responsive documentation chrome for navigation, search, and page context.',
      compositionText:
        'Bring together navigation, actions, content, and an outline without owning responsive shell state.',
      apiText:
        'Router state stays at the edge while the shell handles mobile disclosure and scroll restoration.',
    },
    ko: {
      site: '사이트 탐색이에요',
      docs: '문서예요',
      components: '컴포넌트예요',
      language: '언어예요',
      search: '문서를 검색해요',
      navigation: '문서 탐색이에요',
      section: '컴포넌트예요',
      layout: '레이아웃이에요',
      composition: '구성이에요',
      description: '탐색, 검색, 페이지 맥락을 위한 반응형 문서 chrome이에요.',
      compositionText:
        '반응형 셸 상태를 직접 관리하지 않고 탐색, 동작, 콘텐츠, 개요를 결합해요.',
      apiText: '라우터 상태는 경계에 두고 셸이 모바일 공개와 스크롤 복원을 처리해요.',
    },
    ja: {
      site: 'サイトナビゲーション',
      docs: 'ドキュメント',
      components: 'コンポーネント',
      language: '言語',
      search: 'ドキュメントを検索',
      navigation: 'ドキュメントナビゲーション',
      section: 'コンポーネント',
      layout: 'レイアウト',
      composition: '構成',
      description:
        'ナビゲーション、検索、ページコンテキストのためのレスポンシブなドキュメント chrome です。',
      compositionText:
        'レスポンシブなシェル状態を所有せずに、ナビゲーション、操作、コンテンツ、アウトラインを組み合わせます。',
      apiText:
        'ルーター状態は境界に置き、シェルがモバイル表示とスクロール復元を処理します。',
    },
  }[locale];
  const [scheme, setScheme] = useState<TRColorScheme>('light');
  return (
    <div className="h-[34rem] w-full overflow-hidden" data-docs-example-item="">
      <TRDocsShell.Root
        currentPath="/components/docs-shell"
        layout="docs"
        locationKey="docs-shell-composition"
        style={{ '--tr-docs-shell-block-size': '100%' } as CSSProperties}
      >
        <TRDocsShell.Header>
          <TRDocsShell.Brand>
            <TRLink href="/" underline="none">
              <span className="text-lg font-semibold">Tinyrack</span>
            </TRLink>
            <TRBadge>v0.4</TRBadge>
          </TRDocsShell.Brand>
          <nav
            aria-label={copy.site}
            className="hidden min-w-0 flex-1 items-center gap-6 lg:flex"
          >
            <TRLink href="/docs" underline="none">
              {copy.docs}
            </TRLink>
            <TRLink href="/components" underline="none">
              {copy.components}
            </TRLink>
            <TRLink href="/github" underline="none">
              GitHub
            </TRLink>
          </nav>
          <TRDocsShell.Actions>
            <TRLanguageSelect
              label={copy.language}
              onValueChange={() => undefined}
              options={[
                { label: 'English', value: 'en' },
                { label: '한국어', value: 'ko' },
              ]}
              uiSize="sm"
              value="en"
            />
            <TRDocsSearch.Trigger
              aria-label={copy.search}
              compact
              label={copy.search}
              uiSize="sm"
            />
            <TRColorSchemeToggle onValueChange={setScheme} uiSize="sm" value={scheme} />
          </TRDocsShell.Actions>
        </TRDocsShell.Header>
        <TRDocsShell.Sidebar aria-label={copy.navigation}>
          <div className="flex min-h-full flex-col gap-6 p-4">
            <div className="flex items-center gap-2 lg:hidden">
              <span className="font-semibold">Tinyrack</span>
              <TRBadge>v0.4</TRBadge>
            </div>
            <TRDocsNavigation
              currentPath="/components/docs-shell"
              defaultGroupsOpen
              items={navigationItems}
              label={copy.navigation}
            />
            <TRLanguageSelect
              label={copy.language}
              onValueChange={() => undefined}
              options={[
                { label: 'English', value: 'en' },
                { label: '한국어', value: 'ko' },
              ]}
              uiSize="sm"
              value="en"
            />
          </div>
        </TRDocsShell.Sidebar>
        <TRDocsShell.Main render={<div />}>
          <div className="tr-docs-content-layout">
            <div className="tr-docs-content-column">
              <article className="mx-auto max-w-4xl space-y-8 p-6 lg:p-10">
                <header className="space-y-3">
                  <div className="flex items-center gap-2">
                    <TRBadge variant="info">{copy.section}</TRBadge>
                    <span className="text-sm text-[var(--tinyrack-text-muted)]">
                      {copy.layout}
                    </span>
                  </div>
                  <h2 id="contract" className="text-3xl font-semibold">
                    Docs Shell
                  </h2>
                  <p className="text-lg text-[var(--tinyrack-text-muted)]">
                    {copy.description}
                  </p>
                </header>
                <section className="space-y-3">
                  <h3 id="composition" className="text-xl font-semibold">
                    {copy.composition}
                  </h3>
                  <p>{copy.compositionText}</p>
                  <div className="rounded-lg border border-[var(--tinyrack-border)] p-4">
                    <TRCode className="text-sm">
                      Root → Header + Sidebar + Main → Outline
                    </TRCode>
                  </div>
                </section>
                <section className="space-y-3">
                  <h3 id="api" className="text-xl font-semibold">
                    API
                  </h3>
                  <p>{copy.apiText}</p>
                </section>
              </article>
            </div>
            <TRDocsShell.Outline>
              <TRTableOfContents
                currentHeading="composition"
                items={tableOfContentsItems}
              />
            </TRDocsShell.Outline>
          </div>
        </TRDocsShell.Main>
      </TRDocsShell.Root>
    </div>
  );
}

export function DocsShellLayoutMatrix() {
  return (
    <div className="grid gap-6" data-docs-example-item-count="3">
      {(['docs', 'splash', 'standalone'] as const).map((layout) => (
        <DocsShellPreview key={layout} layout={layout} />
      ))}
    </div>
  );
}
const meta = {
  args: { layout: 'docs' },
  argTypes: {
    layout: { control: 'radio', options: ['docs', 'splash', 'standalone'] },
  },
  excludeStories: /.*(?:Preview|Source)$/,
  parameters: { layout: 'centered', playgroundLayout: 'fill' },
  render: DocsShellPreview,
  title: 'Components/DocsShell',
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const playground = definePlayground(meta);
