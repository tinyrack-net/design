import { index, type RouteConfig, route } from '@react-router/dev/routes';
import { componentDocsManifest } from './content/shared/component-docs-manifest.js';

const componentRoutes = componentDocsManifest.map((entry) =>
  route(`components/${entry.id}`, `content/components/${entry.id}.docs.mdx`, {
    id: `component-${entry.id}`,
  }),
);

export default [
  index('content/welcome.mdx'),
  route('foundations', 'content/foundations/overview.mdx'),
  route('foundations/colors', 'content/foundations/colors.mdx'),
  route('foundations/typography', 'content/foundations/typography.mdx'),
  route('foundations/spacing', 'content/foundations/spacing.mdx'),
  route('foundations/radius', 'content/foundations/radius.mdx'),
  route('foundations/controls', 'content/foundations/controls.mdx'),
  route('foundations/motion', 'content/foundations/motion.mdx'),
  route('foundations/elevation', 'content/foundations/elevation.mdx'),
  ...componentRoutes,
  route(
    'integrations/base-ui-providers',
    'content/integrations/base-ui-providers.docs.mdx',
  ),
  route('integrations/mdx-renderer', 'content/integrations/mdx-renderer.docs.mdx'),
] satisfies RouteConfig;
