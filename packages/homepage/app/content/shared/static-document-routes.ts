import { componentDocsManifest } from './component-docs-manifest.ts';

export const staticDocumentRoutes = [
  { moduleStem: 'welcome', path: '/', title: 'Tinyrack UI' },
  { moduleStem: 'overview', path: '/foundations', title: 'Foundations' },
  { moduleStem: 'colors', path: '/foundations/colors', title: 'Colors' },
  {
    moduleStem: 'typography',
    path: '/foundations/typography',
    title: 'Typography',
  },
  { moduleStem: 'spacing', path: '/foundations/spacing', title: 'Spacing' },
  { moduleStem: 'radius', path: '/foundations/radius', title: 'Radius' },
  { moduleStem: 'controls', path: '/foundations/controls', title: 'Controls' },
  { moduleStem: 'motion', path: '/foundations/motion', title: 'Motion' },
  { moduleStem: 'elevation', path: '/foundations/elevation', title: 'Elevation' },
  ...componentDocsManifest.map((entry) => ({
    entry,
    moduleStem: `${entry.id}.docs`,
    path: `/components/${entry.id}`,
    title: entry.title,
  })),
  {
    moduleStem: 'base-ui-providers.docs',
    path: '/integrations/base-ui-providers',
    title: 'Base UI Providers',
  },
  {
    moduleStem: 'mdx-renderer.docs',
    path: '/integrations/mdx-renderer',
    title: 'React MDX Renderer',
  },
] as const;
