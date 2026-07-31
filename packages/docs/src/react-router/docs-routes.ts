import { join, resolve } from 'node:path';
import type { Config } from '@react-router/dev/config';
import { type RouteConfig, relative } from '@react-router/dev/routes';
import { buildWorkerBudget } from '../config/build-worker-budget.ts';
import type { DocsConfig } from '../config/docs-config.ts';
import {
  type LoadDocsManifestOptions,
  loadDocsManifest,
} from '../config/docs-manifest.ts';
import { finalizeDocsBuild } from './docs-build.ts';

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
    // The runtime honors retryCount/retryDelay (see @react-router/dev vite
    // prerender loop), but the published Config type omits them; cast to keep
    // the retry that absorbs transient prerender request failures.
    prerender: {
      concurrency: buildWorkerBudget({
        maxWorkers: 8,
        override:
          process.env['TINYRACK_DOCS_PRERENDER_WORKERS'] ??
          process.env['TINYRACK_WORKERS'],
      }),
      paths: true,
      // Prerendering fetches every route from an in-process preview server
      // that is simultaneously encoding OpenGraph images; under that load a
      // single request can transiently abort. Retry rather than fail the
      // whole build on one blip.
      retryCount: 2,
      retryDelay: 500,
    } as NonNullable<Config['prerender']>,
    routeDiscovery: { mode: 'initial' },
    ssr: false,
    async buildEnd({ reactRouterConfig, viteConfig }) {
      const manifest = loadDocsManifest(config, { root: viteConfig.root });
      await finalizeDocsBuild(
        join(reactRouterConfig.buildDirectory, 'client'),
        manifest,
      );
    },
  };
}
