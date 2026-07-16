const { defineDocsConfig } = (await import(
  /* @vite-ignore */
  import.meta.resolve('@tinyrack/docs/config')
)) as typeof import('@tinyrack/docs/config');

export default defineDocsConfig({
  contentDir: 'app/content',
  header: {
    links: [
      { label: 'Docs', path: '/foundations/' },
      { label: 'GitHub', path: 'https://github.com/tinyrack-net/design' },
    ],
  },
  sections: [
    { id: 'start', label: 'Start', order: 0 },
    { id: 'foundations', label: 'Foundations', order: 1 },
    { id: 'components', label: 'Components', order: 2 },
    { id: 'integrations', label: 'Integrations', order: 3 },
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
