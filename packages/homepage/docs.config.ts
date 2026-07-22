const { defineDocsConfig } = (await import(
  /* @vite-ignore */
  import.meta.resolve('@tinyrack/docs/config')
)) as typeof import('@tinyrack/docs/config');

export default defineDocsConfig({
  contentDir: 'app/content',
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
      {
        label: { en: 'Docs', ko: '문서', ja: 'ドキュメント' },
        path: '/{locale}/foundations/',
      },
      { label: 'GitHub', path: 'https://github.com/tinyrack-net/design' },
    ],
  },
  redirects: { '/': '/en/' },
  sections: [
    { id: 'start', label: { en: 'Start', ko: '시작하기', ja: 'はじめに' }, order: 0 },
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
      id: 'components',
      label: { en: 'Components', ko: '컴포넌트', ja: 'コンポーネント' },
      order: 3,
    },
    {
      id: 'integrations',
      label: { en: 'Integrations', ko: '통합', ja: '連携' },
      order: 4,
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
    title: 'Tinyrack UI',
    url: 'https://design.tinyrack.net',
  },
  theme: { default: 'dark' },
});
