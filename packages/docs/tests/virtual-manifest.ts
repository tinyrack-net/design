import type { DocsManifest, DocsPage } from '../src/config/index.js';

const page = (
  path: string,
  title: string,
  description: string,
  order: number,
): DocsPage => ({
  breadcrumbs: [],
  canonicalPath: `/docs${path === '/' ? '/' : `${path}/`}`,
  canonicalUrl: `https://example.com/docs${path === '/' ? '/' : `${path}/`}`,
  description,
  documentTitle: `${title} · Test Docs`,
  id: path === '/' ? 'home' : path.slice(1).replaceAll('/', '-'),
  imagePath: path === '/' ? '/og/home.png' : `/og${path}.png`,
  imageUrl: `https://example.com/docs${path === '/' ? '/og/home.png' : `/og${path}.png`}`,
  moduleStem: title.toLocaleLowerCase(),
  order,
  path,
  routeFile: `${title.toLocaleLowerCase()}.mdx`,
  section: path === '/' ? 'start' : 'components',
  sectionLabel: path === '/' ? 'Start' : 'Components',
  sidebarLabel: title,
  sourceFile: `content/${title.toLocaleLowerCase()}.mdx`,
  title,
});

export const docsManifest: DocsManifest = {
  pages: [
    page('/', 'Home', 'Welcome.', 0),
    page('/components/button', 'Button', 'Commands and form actions.', 0),
    page('/components/card', 'Card', 'Grouped content.', 1),
  ],
  sections: [
    { id: 'start', label: 'Start', order: 0 },
    { id: 'components', label: 'Components', order: 1 },
  ],
  site: {
    basePath: '/docs',
    description: 'Test documentation.',
    favicon: '/favicon.svg',
    locale: { language: 'en', openGraph: 'en_US' },
    logo: { alt: 'Test Docs', dark: '/dark.svg', light: '/light.svg' },
    title: 'Test Docs',
    url: 'https://example.com',
  },
  theme: { default: 'dark' },
};
