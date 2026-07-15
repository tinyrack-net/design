import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import mdx from '@mdx-js/rollup';
import { reactRouter } from '@react-router/dev/vite';
import remarkFrontmatter from 'remark-frontmatter';
import remarkGfm from 'remark-gfm';
import type { PluginOption } from 'vite';
import type { DocsConfig } from '../config/docs-config.ts';
import { normalizeBasePath } from '../config/docs-config.ts';
import { docsAssetsPlugin } from './docs-assets-plugin.ts';

const sourceCondition = '@tinyrack/source';

function usesSourceCondition() {
  const conditionArgument = `--conditions=${sourceCondition}`;
  if (process.execArgv.includes(conditionArgument)) return true;
  return (process.env['NODE_OPTIONS'] ?? '').split(/\s+/).includes(conditionArgument);
}

export type TinyrackDocsOptions = {
  root?: string;
};

export function tinyrackDocs(
  config: DocsConfig,
  options: TinyrackDocsOptions = {},
): PluginOption[] {
  const root = options.root ?? process.cwd();
  const moduleExtension = import.meta.url.endsWith('.ts') ? 'ts' : 'js';
  const highlighter = fileURLToPath(
    new URL(`../highlighting/docs-highlighter.${moduleExtension}`, import.meta.url),
  );
  const mdxReact = fileURLToPath(import.meta.resolve('@mdx-js/react'));
  const basePath = normalizeBasePath(config.site.basePath);
  const sourceMode = usesSourceCondition();
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
        build: {
          rolldownOptions: {
            checks: { pluginTimings: false },
          },
        },
        resolve: {
          ...(sourceMode ? { conditions: [sourceCondition] } : {}),
          alias: [
            ...sourceCssAliases,
            { find: 'shiki/bundle/web', replacement: highlighter },
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
    {
      enforce: 'pre',
      ...mdx({
        providerImportSource: '@mdx-js/react',
        remarkPlugins: [remarkFrontmatter, remarkGfm],
      }),
    },
    reactRouter(),
  ];
}
