import { resolve } from 'node:path';
import type { Config } from '@react-router/dev/config';
import { type RouteConfig, relative } from '@react-router/dev/routes';
import type { DocsConfig } from '../config/docs-config.ts';
import {
  type LoadDocsManifestOptions,
  loadDocsManifest,
} from '../config/docs-manifest.ts';

export function createDocsRoutes(
  config: DocsConfig,
  options: LoadDocsManifestOptions = {},
): RouteConfig {
  const root = options.root ?? process.cwd();
  const manifest = loadDocsManifest(config, { root });
  const contentRoutes = relative(resolve(root, config.contentDir));

  return manifest.pages.map((page) =>
    page.path === '/'
      ? contentRoutes.index(page.routeFile, { id: page.id })
      : contentRoutes.route(page.path.replace(/^\//, ''), page.routeFile, {
          id: page.id,
        }),
  );
}

export function createDocsRouterConfig(config: DocsConfig): Config {
  const basePath = config.site.basePath ?? '/';
  return {
    basename: basePath === '/' ? '/' : `${basePath.replace(/\/+$/, '')}/`,
    prerender: true,
    routeDiscovery: { mode: 'initial' },
    ssr: false,
  };
}
