import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import sharp from 'sharp';
import type { Plugin } from 'vite';
import type { DocumentSeoEntry } from '../app/seo/document-seo.js';
import { documentSiteUrl } from '../app/seo/document-seo.js';
import { createDocumentSeoManifest } from './create-document-seo.js';

const publicModuleId = 'virtual:tinyrack-document-seo';
const resolvedModuleId = `\0${publicModuleId}`;

const sectionLabels = {
  components: 'Component',
  foundations: 'Foundation',
  integrations: 'Integration',
  start: 'Documentation',
} as const;

type SeoAssets = {
  images: ReadonlyMap<string, Buffer>;
  robots: string;
  sitemap: string;
};

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

function socialCardSvg(entry: DocumentSeoEntry, avatarDataUrl: string) {
  const descriptionLines = wrapText(entry.description, 70, 2);
  const description = descriptionLines
    .map(
      (line, index) =>
        `<text x="96" y="${407 + index * 42}" fill="#d4d4d4" font-family="IBM Plex Sans, Arial, sans-serif" font-size="28">${escapeXml(line)}</text>`,
    )
    .join('');

  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="background" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#080808" />
      <stop offset="1" stop-color="#171717" />
    </linearGradient>
    <linearGradient id="accent" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#16a34a" />
      <stop offset="1" stop-color="#f59e0b" />
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#background)" />
  <rect x="32" y="32" width="1136" height="566" rx="32" fill="none" stroke="#404040" stroke-width="2" />
  <rect x="32" y="32" width="1136" height="8" rx="4" fill="url(#accent)" />
  <image href="${avatarDataUrl}" x="96" y="92" width="104" height="104" />
  <text x="232" y="137" fill="#f5f5f5" font-family="IBM Plex Sans, Arial, sans-serif" font-size="34" font-weight="700">Tinyrack UI</text>
  <text x="232" y="178" fill="#a3a3a3" font-family="IBM Plex Sans, Arial, sans-serif" font-size="24">${sectionLabels[entry.section]}</text>
  <text x="96" y="335" fill="#ffffff" font-family="IBM Plex Sans, Arial, sans-serif" font-size="68" font-weight="700">${escapeXml(entry.title)}</text>
  ${description}
  <text x="96" y="552" fill="#737373" font-family="IBM Plex Sans, Arial, sans-serif" font-size="22">design.tinyrack.net</text>
</svg>`);
}

function createSitemap(manifest: readonly DocumentSeoEntry[]) {
  const urls = manifest
    .map((entry) => `  <url><loc>${escapeXml(entry.canonicalUrl)}</loc></url>`)
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

async function createSeoAssets(
  manifest: readonly DocumentSeoEntry[],
  avatarDataUrl: string,
): Promise<SeoAssets> {
  const images = new Map<string, Buffer>();
  await Promise.all(
    manifest.map(async (entry) => {
      const image = await sharp(socialCardSvg(entry, avatarDataUrl)).png().toBuffer();
      images.set(entry.imagePath, image);
    }),
  );

  return {
    images,
    robots: `User-agent: *\nAllow: /\n\nSitemap: ${documentSiteUrl}/sitemap.xml\n`,
    sitemap: createSitemap(manifest),
  };
}

export function homepageSeoPlugin(homepageRoot: string): Plugin {
  const avatar = readFileSync(
    join(homepageRoot, 'app/content/fixtures/tinyrack-avatar.svg'),
  ).toString('base64');
  const avatarDataUrl = `data:image/svg+xml;base64,${avatar}`;
  let manifest = createDocumentSeoManifest(homepageRoot);
  let assetsPromise = createSeoAssets(manifest, avatarDataUrl);

  const refresh = () => {
    manifest = createDocumentSeoManifest(homepageRoot);
    assetsPromise = createSeoAssets(manifest, avatarDataUrl);
  };

  return {
    name: 'tinyrack-homepage-seo',
    enforce: 'pre',
    buildStart() {
      refresh();
    },
    configureServer(server) {
      server.middlewares.use(async (request, response, next) => {
        const pathname = new URL(request.url ?? '/', 'http://tinyrack.local').pathname;
        const assets = await assetsPromise;

        if (pathname === '/sitemap.xml') {
          response.setHeader('content-type', 'application/xml; charset=utf-8');
          response.end(assets.sitemap);
          return;
        }
        if (pathname === '/robots.txt') {
          response.setHeader('content-type', 'text/plain; charset=utf-8');
          response.end(assets.robots);
          return;
        }
        const image = assets.images.get(pathname);
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

      return assetsPromise.then((assets) => {
        this.emitFile({
          fileName: 'sitemap.xml',
          source: assets.sitemap,
          type: 'asset',
        });
        this.emitFile({ fileName: 'robots.txt', source: assets.robots, type: 'asset' });
        for (const [path, source] of assets.images) {
          this.emitFile({ fileName: path.replace(/^\//, ''), source, type: 'asset' });
        }
      });
    },
    handleHotUpdate(context) {
      if (!context.file.endsWith('.mdx')) return;

      refresh();
      const module = context.server.moduleGraph.getModuleById(resolvedModuleId);
      if (module !== undefined) context.server.moduleGraph.invalidateModule(module);
      context.server.ws.send({ path: '*', type: 'full-reload' });
      return [];
    },
    load(id) {
      if (id !== resolvedModuleId) return;
      return `export const documentSeoManifest = ${JSON.stringify(manifest)};`;
    },
    resolveId(id) {
      return id === publicModuleId ? resolvedModuleId : undefined;
    },
  };
}
