import type { Plugin } from 'vite';
import {
  createRobots,
  createRss,
  createSitemap,
  type SiteFeedDescriptor,
  type SitePageDescriptor,
  type SiteSeoConfig,
} from '../site/site.ts';

export type TinyrackSiteAssetsOptions = {
  feeds?: () => readonly SiteFeedDescriptor[];
  pages: () => readonly SitePageDescriptor[];
  site: SiteSeoConfig;
};

function normalizedBasePath(basePath = '/') {
  const normalized = `/${basePath}`.replace(/\/+/g, '/').replace(/\/+$/, '');
  return normalized.length === 0 ? '/' : normalized;
}

function normalizedAssetPath(path: string) {
  return `/${path}`.replace(/\/+/g, '/');
}

export function siteAssetOutputFileName(basePath: string, path: string) {
  return [basePath, path].join('/').split('/').filter(Boolean).join('/');
}

export function createSiteAssetSources({
  feeds,
  pages,
  site,
}: TinyrackSiteAssetsOptions) {
  return new Map<string, { contentType: string; source: string }>([
    [
      '/sitemap.xml',
      {
        contentType: 'application/xml; charset=utf-8',
        source: createSitemap(pages()),
      },
    ],
    [
      '/robots.txt',
      {
        contentType: 'text/plain; charset=utf-8',
        source: createRobots(site),
      },
    ],
    ...(feeds?.() ?? []).map(
      (feed) =>
        [
          normalizedAssetPath(feed.path),
          {
            contentType: 'application/rss+xml; charset=utf-8',
            source: createRss(feed),
          },
        ] as const,
    ),
  ]);
}

export function tinyrackSiteAssets(options: TinyrackSiteAssetsOptions): Plugin {
  const basePath = normalizedBasePath(options.site.basePath);
  return {
    name: 'tinyrack-site-assets',
    enforce: 'pre',
    configureServer(server) {
      server.middlewares.use((request, response, next) => {
        const pathname = new URL(request.url ?? '/', 'http://tinyrack.local').pathname;
        const assetPath =
          basePath !== '/' && pathname.startsWith(`${basePath}/`)
            ? pathname.slice(basePath.length)
            : pathname;
        const asset = createSiteAssetSources(options).get(assetPath);
        if (asset === undefined) {
          next();
          return;
        }
        response.setHeader('content-type', asset.contentType);
        response.end(asset.source);
      });
    },
    generateBundle() {
      if (this.environment.name !== 'client') return;
      for (const [path, asset] of createSiteAssetSources(options)) {
        this.emitFile({
          fileName: siteAssetOutputFileName(basePath, path),
          source: asset.source,
          type: 'asset',
        });
      }
    },
  };
}
