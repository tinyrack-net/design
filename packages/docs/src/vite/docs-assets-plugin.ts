import { readFileSync } from 'node:fs';
import { isAbsolute, join, relative, resolve, sep } from 'node:path';
import sharp from 'sharp';
import type { Plugin } from 'vite';
import { buildWorkerBudget } from '../config/build-worker-budget.ts';
import type { DocsConfig, DocsManifest, DocsPage } from '../config/docs-config.ts';
import { loadDocsManifest } from '../config/docs-manifest.ts';
import { isDocsPageFile } from '../config/docs-page-file.ts';
import { createRedirectFiles } from '../react-router/docs-build.ts';

export const docsManifestModuleId = 'virtual:tinyrack-docs/manifest';
const resolvedDocsManifestModuleId = `\0${docsManifestModuleId}`;

type DocsAssets = {
  images: ReadonlyMap<string, Buffer>;
  notFound: string;
  redirects: ReadonlyMap<string, string>;
  robots: string;
  sitemap: string;
};

export function createBuildAssetCache<T>(create: () => Promise<T>) {
  let current: Promise<T> | undefined;
  return {
    get() {
      current ??= create();
      return current;
    },
    invalidate() {
      current = undefined;
    },
  };
}

export async function mapWithConcurrency<Input, Output>(
  values: readonly Input[],
  concurrency: number,
  transform: (value: Input, index: number) => Promise<Output>,
) {
  const results = new Array<Output>(values.length);
  let nextIndex = 0;
  const workerCount = Math.min(values.length, Math.max(1, Math.floor(concurrency)));
  await Promise.all(
    Array.from({ length: workerCount }, async () => {
      while (nextIndex < values.length) {
        const index = nextIndex;
        nextIndex += 1;
        results[index] = await transform(values[index] as Input, index);
      }
    }),
  );
  return results;
}

function escapeXml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

function wrapText(value: string, maximumLineLength: number, maximumLines: number) {
  const words = value.split(/\s+/);
  const lines: string[] = [];
  let current = '';
  let truncated = false;

  for (const word of words) {
    const candidate = current.length === 0 ? word : `${current} ${word}`;
    if (candidate.length <= maximumLineLength || current.length === 0) {
      current = candidate;
      continue;
    }
    if (lines.length < maximumLines - 1) {
      lines.push(current);
      current = word;
      continue;
    }
    truncated = true;
    break;
  }

  if (lines.length < maximumLines && current.length > 0) lines.push(current);
  if (truncated && lines.length > 0) {
    const lastIndex = lines.length - 1;
    lines[lastIndex] = `${lines[lastIndex]?.replace(/[.,;:!?]?$/, '')}…`;
  }
  return lines;
}

function socialCardSvg(page: DocsPage, manifest: DocsManifest, iconDataUrl: string) {
  const description = wrapText(page.description, 70, 2)
    .map(
      (line, index) =>
        `<text x="96" y="${407 + index * 42}" fill="#d4d4d4" font-family="IBM Plex Sans, Arial, sans-serif" font-size="28">${escapeXml(line)}</text>`,
    )
    .join('');
  const host = new URL(manifest.site.url).host;

  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="background" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#080808" /><stop offset="1" stop-color="#171717" /></linearGradient>
    <linearGradient id="accent" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#16a34a" /><stop offset="1" stop-color="#f59e0b" /></linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#background)" />
  <rect x="32" y="32" width="1136" height="566" rx="32" fill="none" stroke="#404040" stroke-width="2" />
  <rect x="32" y="32" width="1136" height="8" rx="4" fill="url(#accent)" />
  <image href="${iconDataUrl}" x="96" y="92" width="104" height="104" />
  <text x="232" y="137" fill="#f5f5f5" font-family="IBM Plex Sans, Arial, sans-serif" font-size="34" font-weight="700">${escapeXml(manifest.site.title)}</text>
  <text x="232" y="178" fill="#a3a3a3" font-family="IBM Plex Sans, Arial, sans-serif" font-size="24">${escapeXml(page.sectionLabel)}</text>
  <text x="96" y="335" fill="#ffffff" font-family="IBM Plex Sans, Arial, sans-serif" font-size="68" font-weight="700">${escapeXml(page.title)}</text>
  ${description}
  <text x="96" y="552" fill="#737373" font-family="IBM Plex Sans, Arial, sans-serif" font-size="22">${escapeXml(host)}</text>
</svg>`);
}

function createSitemap(manifest: DocsManifest) {
  const urls = manifest.pages
    .map(
      (page) =>
        `  <url><loc>${escapeXml(page.canonicalUrl)}</loc>${page.alternates
          .map(
            (alternate) =>
              `<xhtml:link rel="alternate" hreflang="${escapeXml(alternate.language)}" href="${escapeXml(alternate.url)}" />`,
          )
          .join('')}</url>`,
    )
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls}\n</urlset>\n`;
}

function sitemapUrl(manifest: DocsManifest) {
  return `${manifest.site.url}${manifest.site.basePath === '/' ? '' : manifest.site.basePath}/sitemap.xml`;
}

function createNotFoundPage(manifest: DocsManifest) {
  const homePath = manifest.site.basePath === '/' ? '/' : `${manifest.site.basePath}/`;
  return `<!doctype html>
<html lang="${escapeXml(manifest.site.locale.language)}">
  <head>
    <meta charset="utf-8" />
    <meta content="width=device-width, initial-scale=1" name="viewport" />
    <meta content="noindex,nofollow" name="robots" />
    <title>Page not found · ${escapeXml(manifest.site.title)}</title>
    <style>:root{color-scheme:dark;font-family:system-ui,sans-serif;background:#080808;color:#f4f4f5}body{min-height:100vh;margin:0;display:grid;place-items:center}main{max-width:32rem;padding:2rem}a{color:inherit}</style>
  </head>
  <body>
    <main>
      <p>404</p>
      <h1>Page not found</h1>
      <p>The requested ${escapeXml(manifest.site.title)} documentation page does not exist.</p>
      <a href="${escapeXml(homePath)}">Return to ${escapeXml(manifest.site.title)}</a>
    </main>
  </body>
</html>
`;
}

async function createDocsAssets(
  manifest: DocsManifest,
  iconDataUrl: string,
): Promise<DocsAssets> {
  const images = new Map<string, Buffer>();
  await mapWithConcurrency(
    manifest.pages,
    buildWorkerBudget({
      maxWorkers: 16,
      override:
        process.env['TINYRACK_DOCS_ASSET_WORKERS'] ?? process.env['TINYRACK_WORKERS'],
    }),
    async (page) => {
      images.set(
        page.imagePath,
        await sharp(socialCardSvg(page, manifest, iconDataUrl))
          .png()
          .toBuffer(),
      );
    },
  );
  return {
    images,
    notFound: createNotFoundPage(manifest),
    redirects: createRedirectFiles(manifest),
    robots: `User-agent: *\nAllow: /\n\nSitemap: ${sitemapUrl(manifest)}\n`,
    sitemap: createSitemap(manifest),
  };
}

function publicAssetFile(root: string, publicPath: string) {
  return join(root, 'public', publicPath.replace(/^\//, ''));
}

function virtualManifestSource(manifest: DocsManifest) {
  return `export const docsManifest = ${JSON.stringify(manifest).replaceAll('<', '\\u003c')};`;
}

function routeConfigSignature(manifest: DocsManifest) {
  return JSON.stringify(
    manifest.pages.map(({ id, path, routeFile }) => [id, path, routeFile]),
  );
}

function isDocsContentFileWithin(
  file: string,
  resolvedRoot: string,
  resolvedContent: string,
) {
  const candidate = resolve(resolvedRoot, file);
  const contentRelative = relative(resolvedContent, candidate);
  return (
    !isAbsolute(contentRelative) &&
    contentRelative !== '..' &&
    !contentRelative.startsWith(`..${sep}`) &&
    isDocsPageFile(contentRelative)
  );
}

export function isDocsContentFile(file: string, root: string, contentDir: string) {
  const resolvedRoot = resolve(root);
  return isDocsContentFileWithin(file, resolvedRoot, resolve(resolvedRoot, contentDir));
}

export function docsAssetsPlugin(config: DocsConfig, root: string): Plugin {
  const resolvedRoot = resolve(root);
  const resolvedContent = resolve(resolvedRoot, config.contentDir);
  const icon = readFileSync(publicAssetFile(root, config.site.favicon)).toString(
    'base64',
  );
  const iconDataUrl = `data:image/svg+xml;base64,${icon}`;
  let manifest = loadDocsManifest(config, { root });
  const assets = createBuildAssetCache(() => createDocsAssets(manifest, iconDataUrl));
  void assets.get();

  const refresh = () => {
    const previousRouteConfig = routeConfigSignature(manifest);
    manifest = loadDocsManifest(config, { root });
    assets.invalidate();
    return previousRouteConfig !== routeConfigSignature(manifest);
  };

  return {
    name: 'tinyrack-docs-assets',
    enforce: 'pre',
    configureServer(server) {
      server.middlewares.use(async (request, response, next) => {
        const pathname = new URL(request.url ?? '/', 'http://tinyrack.local').pathname;
        const basePath = manifest.site.basePath;
        const assetPath =
          basePath !== '/' && pathname.startsWith(`${basePath}/`)
            ? pathname.slice(basePath.length)
            : pathname;
        const currentAssets = await assets.get();
        const redirectTarget = manifest.redirects[pathname];
        if (redirectTarget !== undefined) {
          response.statusCode = 302;
          response.setHeader('location', redirectTarget);
          response.end();
          return;
        }
        if (assetPath === '/sitemap.xml') {
          response.setHeader('content-type', 'application/xml; charset=utf-8');
          response.end(currentAssets.sitemap);
          return;
        }
        if (assetPath === '/robots.txt') {
          response.setHeader('content-type', 'text/plain; charset=utf-8');
          response.end(currentAssets.robots);
          return;
        }
        const image = currentAssets.images.get(assetPath);
        if (image !== undefined) {
          response.setHeader('content-type', 'image/png');
          response.end(image);
          return;
        }
        next();
      });
    },
    generateBundle() {
      if (this.environment.name !== 'client') return;
      return assets.get().then((assets) => {
        this.emitFile({
          fileName: 'sitemap.xml',
          source: assets.sitemap,
          type: 'asset',
        });
        this.emitFile({ fileName: '404.html', source: assets.notFound, type: 'asset' });
        this.emitFile({ fileName: 'robots.txt', source: assets.robots, type: 'asset' });
        for (const [fileName, source] of assets.redirects) {
          this.emitFile({ fileName, source, type: 'asset' });
        }
        for (const [path, source] of assets.images) {
          this.emitFile({ fileName: path.replace(/^\//, ''), source, type: 'asset' });
        }
      });
    },
    async hotUpdate(options) {
      if (!isDocsContentFileWithin(options.file, resolvedRoot, resolvedContent)) {
        return undefined;
      }
      const routeConfigChanged = refresh();
      if (routeConfigChanged) {
        await options.server.restart();
        return [];
      }
      const module = this.environment.moduleGraph.getModuleById(
        resolvedDocsManifestModuleId,
      );
      if (module !== undefined) this.environment.moduleGraph.invalidateModule(module);
      this.environment.hot.send({ path: '*', type: 'full-reload' });
      return [];
    },
    load(id) {
      if (id === resolvedDocsManifestModuleId) return virtualManifestSource(manifest);
      return undefined;
    },
    resolveId(id) {
      return id === docsManifestModuleId ? resolvedDocsManifestModuleId : undefined;
    },
  };
}
