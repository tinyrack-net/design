import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import mdx from '@mdx-js/rollup';
import { reactRouter } from '@react-router/dev/vite';
import remarkDirective from 'remark-directive';
import remarkFrontmatter from 'remark-frontmatter';
import remarkGfm from 'remark-gfm';
import type { PluginOption } from 'vite';
import type { DocsConfig } from '../config/docs-config.ts';
import { normalizeBasePath } from '../config/docs-config.ts';
import { docsAssetsPlugin } from './docs-assets-plugin.ts';
import { docsHighlighterPlugin } from './docs-highlighter-plugin.ts';
import { docsPreviewPlugin } from './docs-preview-plugin.ts';
import { remarkDocsDirectives, remarkDocsHeadings } from './docs-remark-plugins.ts';

const sourceCondition = '@tinyrack/source';

function usesSourceCondition() {
  const conditionArgument = `--conditions=${sourceCondition}`;
  if (process.execArgv.includes(conditionArgument)) return true;
  return (process.env['NODE_OPTIONS'] ?? '').split(/\s+/).includes(conditionArgument);
}

export type TinyrackDocsOptions = {
  root?: string;
};

type SourceOptimize = {
  include: string[];
  entries: string[];
};

// In source mode (`--conditions=@tinyrack/source`), `@tinyrack/ui` and
// `@tinyrack/docs` are loaded as raw workspace TS instead of prebuilt dist, so
// Vite cannot see the whole dependency graph up front. Each component page pulls
// in a different `@base-ui/react/<part>` subpath through a route-split lazy
// import, so Vite's initial dependency scan (which only crawls the statically
// reachable graph) misses them. Navigating between routes then makes Vite
// discover a new bare import, re-run dependency optimization, and invalidate the
// previously optimized chunks. In-flight requests fail with
// `504 (Outdated Optimize Dep)` and Vite forces a full page reload — surfacing as
// routing that "doesn't work in one go" and pages that keep refreshing, but only
// on the dev server.
//
// The fix is to widen the optimizer's scan to the whole @tinyrack/ui component
// source via `optimizeDeps.entries`, so every `@base-ui/react/*` subpath is
// discovered and pre-bundled at server start. Vite resolves these through its own
// resolver (honouring @base-ui/react's conditional exports and the pnpm layout),
// so no alias is needed and the SSR/client builds stay correct. Bare specifiers
// resolvable from the consumer root are still listed in `include` directly.
function sourceOptimize(): SourceOptimize {
  const include = ['lucide-react', '@mdx-js/react'];
  const entries: string[] = [];
  try {
    // tinyglobby (Vite's scanner) expects POSIX-style separators, even on Windows.
    const uiSource = `${dirname(
      fileURLToPath(import.meta.resolve('@tinyrack/ui/package.json')),
    ).replace(/\\/g, '/')}/src`;
    entries.push(
      `${uiSource}/**/*.{ts,tsx}`,
      // Type declarations are not real modules; esbuild's scanner throws on them
      // and aborts the whole pre-bundle, so exclude them.
      `!${uiSource}/**/*.d.ts`,
      // Exclude test files so test-only dependencies (vitest, etc.) are not
      // dragged into the client dependency optimizer.
      `!${uiSource}/**/*.{test,spec}.{ts,tsx}`,
    );
  } catch {
    // If @tinyrack/ui cannot be located, fall back to lazy discovery.
  }
  return { include, entries };
}

export function tinyrackDocs(
  config: DocsConfig,
  options: TinyrackDocsOptions = {},
): PluginOption[] {
  const root = options.root ?? process.cwd();
  const mdxReact = fileURLToPath(import.meta.resolve('@mdx-js/react'));
  const basePath = normalizeBasePath(config.site.basePath);
  const sourceMode = usesSourceCondition();
  const { include: sourceOptimizeInclude, entries: sourceOptimizeEntries } = sourceMode
    ? sourceOptimize()
    : { include: [], entries: [] };
  const sourceCssAliases = sourceMode
    ? [
        {
          find: '@tinyrack/docs/styles.css',
          replacement: fileURLToPath(import.meta.resolve('@tinyrack/docs/styles.css')),
        },
        {
          find: '@tinyrack/ui/core.css',
          replacement: fileURLToPath(import.meta.resolve('@tinyrack/ui/core.css')),
        },
        {
          find: '@tinyrack/ui/mdx.css',
          replacement: fileURLToPath(import.meta.resolve('@tinyrack/ui/mdx.css')),
        },
        {
          find: /^@tinyrack\/ui\/components\/([^/]+)\.css$/,
          replacement: `${dirname(
            dirname(
              fileURLToPath(import.meta.resolve('@tinyrack/ui/components/button.css')),
            ),
          )}/$1/$1.css`,
        },
      ]
    : [];

  return [
    {
      name: 'tinyrack-docs-config',
      enforce: 'pre',
      config: () => ({
        base: basePath === '/' ? '/' : `${basePath}/`,
        resolve: {
          ...(sourceMode ? { conditions: [sourceCondition] } : {}),
          alias: [
            ...sourceCssAliases,
            { find: '@mdx-js/react', replacement: mdxReact },
          ],
        },
      }),
    },
    {
      name: 'tinyrack-docs-runtime-config',
      enforce: 'post',
      config: () => ({
        ...(sourceMode
          ? {
              environments: {
                ssr: { resolve: { conditions: [sourceCondition] } },
                // react-router drives Vite's environment API, so the client
                // environment's optimizeDeps shadows any top-level optimizeDeps.
                // Seed the include list here so every workspace-source dependency
                // is pre-bundled at server start instead of trickling in per route.
                client: {
                  optimizeDeps: {
                    include: sourceOptimizeInclude,
                    entries: sourceOptimizeEntries,
                  },
                },
              },
              resolve: { conditions: [sourceCondition] },
            }
          : {}),
        ssr: {
          external: ['react', 'react-dom', 'react-router', 'use-sync-external-store'],
          noExternal: true,
        },
      }),
    },
    docsAssetsPlugin(config, root),
    docsHighlighterPlugin(config),
    docsPreviewPlugin(basePath),
    {
      enforce: 'pre',
      ...mdx({
        providerImportSource: '@mdx-js/react',
        remarkPlugins: [
          remarkFrontmatter,
          remarkGfm,
          remarkDirective,
          remarkDocsDirectives,
          remarkDocsHeadings,
        ],
      }),
    },
    reactRouter(),
  ];
}
