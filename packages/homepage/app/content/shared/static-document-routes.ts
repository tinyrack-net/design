import {
  type ComponentDocsManifestEntry,
  componentDocsManifest,
} from './component-docs-manifest.ts';

export type StaticDocumentSection =
  | 'start'
  | 'foundations'
  | 'components'
  | 'integrations';

export type StaticDocumentRoute = {
  componentEntry?: ComponentDocsManifestEntry;
  id: string;
  moduleStem: string;
  navLabel: string;
  path: string;
  routeModule: string;
  section: StaticDocumentSection;
  seo?: { description?: string };
  sourceFile: string;
  title: string;
};

export function normalizeDocumentPathname(pathname: string) {
  const normalized = pathname.replace(/\/+$/, '');
  return normalized.length === 0 ? '/' : normalized;
}

export function canonicalDocumentPath(pathname: string) {
  const normalized = normalizeDocumentPathname(pathname);
  return normalized === '/' ? '/' : `${normalized}/`;
}

export const staticDocumentRoutes: readonly StaticDocumentRoute[] = [
  {
    id: 'home',
    moduleStem: 'welcome',
    navLabel: 'Tinyrack UI',
    path: '/',
    routeModule: 'content/welcome.mdx',
    section: 'start',
    sourceFile: 'app/content/welcome.mdx',
    title: 'Tinyrack UI',
  },
  {
    id: 'foundation-overview',
    moduleStem: 'overview',
    navLabel: 'Overview',
    path: '/foundations',
    routeModule: 'content/foundations/overview.mdx',
    section: 'foundations',
    sourceFile: 'app/content/foundations/overview.mdx',
    title: 'Foundations',
  },
  {
    id: 'foundation-logo',
    moduleStem: 'logo',
    navLabel: 'Logo',
    path: '/foundations/logo',
    routeModule: 'content/foundations/logo.mdx',
    section: 'foundations',
    sourceFile: 'app/content/foundations/logo.mdx',
    title: 'Logo',
  },
  {
    id: 'foundation-colors',
    moduleStem: 'colors',
    navLabel: 'Colors',
    path: '/foundations/colors',
    routeModule: 'content/foundations/colors.mdx',
    section: 'foundations',
    sourceFile: 'app/content/foundations/colors.mdx',
    title: 'Colors',
  },
  {
    id: 'foundation-typography',
    moduleStem: 'typography',
    navLabel: 'Typography',
    path: '/foundations/typography',
    routeModule: 'content/foundations/typography.mdx',
    section: 'foundations',
    sourceFile: 'app/content/foundations/typography.mdx',
    title: 'Typography',
  },
  {
    id: 'foundation-spacing',
    moduleStem: 'spacing',
    navLabel: 'Spacing',
    path: '/foundations/spacing',
    routeModule: 'content/foundations/spacing.mdx',
    section: 'foundations',
    sourceFile: 'app/content/foundations/spacing.mdx',
    title: 'Spacing',
  },
  {
    id: 'foundation-radius',
    moduleStem: 'radius',
    navLabel: 'Radius',
    path: '/foundations/radius',
    routeModule: 'content/foundations/radius.mdx',
    section: 'foundations',
    sourceFile: 'app/content/foundations/radius.mdx',
    title: 'Radius',
  },
  {
    id: 'foundation-controls',
    moduleStem: 'controls',
    navLabel: 'Controls',
    path: '/foundations/controls',
    routeModule: 'content/foundations/controls.mdx',
    section: 'foundations',
    sourceFile: 'app/content/foundations/controls.mdx',
    title: 'Controls',
  },
  {
    id: 'foundation-motion',
    moduleStem: 'motion',
    navLabel: 'Motion',
    path: '/foundations/motion',
    routeModule: 'content/foundations/motion.mdx',
    section: 'foundations',
    sourceFile: 'app/content/foundations/motion.mdx',
    title: 'Motion',
  },
  {
    id: 'foundation-elevation',
    moduleStem: 'elevation',
    navLabel: 'Elevation',
    path: '/foundations/elevation',
    routeModule: 'content/foundations/elevation.mdx',
    section: 'foundations',
    sourceFile: 'app/content/foundations/elevation.mdx',
    title: 'Elevation',
  },
  ...componentDocsManifest.map((entry) => ({
    componentEntry: entry,
    id: `component-${entry.id}`,
    moduleStem: `${entry.id}.docs`,
    navLabel: entry.title,
    path: `/components/${entry.id}`,
    routeModule: `content/components/${entry.id}.docs.mdx`,
    section: 'components' as const,
    sourceFile: entry.file,
    title: entry.title,
  })),
  {
    id: 'integration-base-ui-providers',
    moduleStem: 'base-ui-providers.docs',
    navLabel: 'Base UI providers',
    path: '/integrations/base-ui-providers',
    routeModule: 'content/integrations/base-ui-providers.docs.mdx',
    section: 'integrations',
    sourceFile: 'app/content/integrations/base-ui-providers.docs.mdx',
    title: 'Base UI Providers',
  },
  {
    id: 'integration-mdx-renderer',
    moduleStem: 'mdx-renderer.docs',
    navLabel: 'MDX renderer',
    path: '/integrations/mdx-renderer',
    routeModule: 'content/integrations/mdx-renderer.docs.mdx',
    section: 'integrations',
    sourceFile: 'app/content/integrations/mdx-renderer.docs.mdx',
    title: 'React MDX Renderer',
  },
];
