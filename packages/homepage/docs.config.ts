const { defineDocsConfig } = (await import(
  /* @vite-ignore */
  import.meta.resolve('@tinyrack/docs/config')
)) as typeof import('@tinyrack/docs/config');

export default defineDocsConfig({
  contentDir: 'app/content',
  // Every distinct grammar becomes a lazily loaded chunk; aliases can share
  // one. Keep this list to identifiers that actually appear in app/content —
  // the code-block-languages test checks both missing and unused grammars.
  highlight: {
    languages: [
      'css',
      'dart',
      'html',
      'js',
      'json',
      'mdx',
      'python',
      'sh',
      'shellscript',
      'ts',
      'tsx',
    ],
  },
  i18n: {
    defaultLocale: 'en',
    locales: {
      en: {
        label: 'English',
        language: 'en',
        openGraph: 'en_US',
      },
      ko: {
        label: '한국어',
        language: 'ko',
        openGraph: 'ko_KR',
      },
      ja: {
        label: '日本語',
        language: 'ja',
        openGraph: 'ja_JP',
      },
    },
  },
  header: {
    links: [
      { instance: 'foundations' },
      { instance: 'web' },
      { instance: 'flutter' },
      { label: 'GitHub', path: 'https://github.com/tinyrack-net/design' },
    ],
  },
  instances: [
    {
      id: 'foundations',
      label: { en: 'Foundations', ko: '파운데이션', ja: '基礎' },
      routeBasePath: '/foundations',
      sections: ['foundations', 'brand'],
    },
    {
      id: 'web',
      label: 'Web',
      routeBasePath: '/web',
      sections: ['web-start', 'components', 'integrations', 'docs'],
    },
    {
      id: 'flutter',
      label: 'Flutter',
      routeBasePath: '/flutter',
      sections: ['flutter-start', 'flutter-components'],
    },
  ],
  redirects: { '/': '/en/' },
  sections: [
    { id: 'home', label: { en: 'Home', ko: '홈', ja: 'ホーム' }, order: 0 },
    {
      id: 'foundations',
      label: { en: 'Foundations', ko: '파운데이션', ja: '基礎' },
      order: 1,
    },
    {
      id: 'brand',
      label: { en: 'Brand', ko: '브랜드', ja: 'ブランド' },
      order: 2,
    },
    {
      groups: [
        {
          id: 'actions',
          label: { en: 'Actions', ko: '액션', ja: 'アクション' },
        },
        {
          id: 'forms-inputs',
          label: { en: 'Forms & Inputs', ko: '폼 및 입력', ja: 'フォーム・入力' },
        },
        {
          id: 'selection-controls',
          label: {
            en: 'Selection Controls',
            ko: '선택 컨트롤',
            ja: '選択コントロール',
          },
        },
        {
          id: 'navigation',
          label: { en: 'Navigation', ko: '내비게이션', ja: 'ナビゲーション' },
        },
        {
          id: 'overlays',
          label: { en: 'Overlays', ko: '오버레이', ja: 'オーバーレイ' },
        },
        {
          id: 'feedback-status',
          label: {
            en: 'Feedback & Status',
            ko: '피드백 및 상태',
            ja: 'フィードバック・ステータス',
          },
        },
        {
          id: 'layout-structure',
          label: {
            en: 'Layout & Structure',
            ko: '레이아웃 및 구조',
            ja: 'レイアウト・構造',
          },
        },
        {
          id: 'data-content',
          label: {
            en: 'Data & Content',
            ko: '데이터 및 콘텐츠',
            ja: 'データ・コンテンツ',
          },
        },
        {
          id: 'docs-site',
          label: {
            en: 'Docs & Site',
            ko: '문서 및 사이트',
            ja: 'ドキュメント・サイト',
          },
        },
      ],
      id: 'components',
      label: { en: 'Components', ko: '컴포넌트', ja: 'コンポーネント' },
      order: 4,
    },
    {
      id: 'integrations',
      label: { en: 'Integrations', ko: '통합', ja: '連携' },
      order: 5,
    },
    {
      id: 'flutter-start',
      label: { en: 'Start', ko: '시작하기', ja: 'はじめに' },
      order: 6,
    },
    {
      groups: [
        {
          id: 'chat',
          label: { en: 'Chat', ko: '채팅', ja: 'チャット' },
        },
        {
          id: 'actions',
          label: { en: 'Actions', ko: '액션', ja: 'アクション' },
        },
        {
          id: 'forms-inputs',
          label: { en: 'Forms & Inputs', ko: '폼 및 입력', ja: 'フォーム・入力' },
        },
        {
          id: 'selection-controls',
          label: {
            en: 'Selection Controls',
            ko: '선택 컨트롤',
            ja: '選択コントロール',
          },
        },
        {
          id: 'navigation',
          label: { en: 'Navigation', ko: '내비게이션', ja: 'ナビゲーション' },
        },
        {
          id: 'overlays',
          label: { en: 'Overlays', ko: '오버레이', ja: 'オーバーレイ' },
        },
        {
          id: 'feedback-status',
          label: {
            en: 'Feedback & Status',
            ko: '피드백 및 상태',
            ja: 'フィードバック・ステータス',
          },
        },
        {
          id: 'layout-structure',
          label: {
            en: 'Layout & Structure',
            ko: '레이아웃 및 구조',
            ja: 'レイアウト・構造',
          },
        },
        {
          id: 'data-content',
          label: {
            en: 'Data & Content',
            ko: '데이터 및 콘텐츠',
            ja: 'データ・コンテンツ',
          },
        },
        {
          id: 'docs-site',
          label: {
            en: 'Docs & Site',
            ko: '문서 및 사이트',
            ja: 'ドキュメント・サイト',
          },
        },
      ],
      id: 'flutter-components',
      label: { en: 'Components', ko: '컴포넌트', ja: 'コンポーネント' },
      order: 7,
    },
    {
      id: 'docs',
      label: {
        en: 'Docs Framework',
        ko: 'Docs 프레임워크',
        ja: 'Docs フレームワーク',
      },
      order: 8,
    },
    {
      id: 'web-start',
      label: { en: 'Start', ko: '시작하기', ja: 'はじめに' },
      order: 3,
    },
  ],
  site: {
    basePath: '/',
    description: 'React components and foundations for compact operational interfaces.',
    favicon: '/favicon.svg',
    locale: { language: 'en', openGraph: 'en_US' },
    logo: {
      alt: 'Tinyrack',
      dark: '/brand/tinyrack-lockup-inverse.svg',
      light: '/brand/tinyrack-lockup.svg',
    },
    title: 'Tinyrack Design System',
    url: 'https://design.tinyrack.net',
  },
  theme: { default: 'auto' },
});
