import { fileURLToPath } from 'node:url';
import type { Plugin } from 'vite';
import type { DocsConfig } from '../config/docs-config.ts';
import {
  type DocsHighlightLanguage,
  type DocsHighlightThemePair,
  docsHighlightDefaultThemes,
  docsHighlightLanguageGrammars,
  docsHighlightLanguages,
  isDocsHighlightLanguage,
  isDocsHighlightTheme,
} from '../highlighting/docs-languages.ts';

export const docsHighlighterModuleId = 'virtual:tinyrack-docs/highlighter';

const moduleExtension = import.meta.url.endsWith('.ts') ? 'ts' : 'js';

/**
 * Vite normalizes module ids to posix separators, while `fileURLToPath` yields
 * backslashes on Windows. Comparing unnormalized paths silently fails to match
 * in dev (where ids are normalized) while still working in build (where Rollup
 * reuses the id `resolveId` returned), so both sides are normalized here.
 */
function toModuleId(path: string) {
  return path.replaceAll('\\', '/');
}

/**
 * The virtual module resolves to a path inside this package rather than a `\0`
 * id so that the bare `@shikijs/langs/*` specifiers it emits resolve against
 * `packages/docs`, which is where those grammars are installed. The file itself
 * never exists on disk; `load` always answers first.
 */
const virtualHighlighterPath = toModuleId(
  fileURLToPath(
    new URL(
      `../highlighting/tinyrack-docs-highlighter.generated.${moduleExtension}`,
      import.meta.url,
    ),
  ),
);

const highlighterModulePath = toModuleId(
  fileURLToPath(
    new URL(`../highlighting/docs-highlighter.${moduleExtension}`, import.meta.url),
  ),
);

export const defaultDocsHighlightLanguages = [
  'css',
  'html',
  'javascript',
  'js',
  'json',
  'jsx',
  'shellscript',
  'bash',
  'sh',
  'shell',
  'ts',
  'tsx',
  'typescript',
] as const satisfies readonly DocsHighlightLanguage[];

export function resolveDocsHighlightLanguages(
  config: DocsConfig,
): readonly DocsHighlightLanguage[] {
  const declared = config.highlight?.languages ?? defaultDocsHighlightLanguages;
  const unknown = declared.filter((language) => !isDocsHighlightLanguage(language));
  if (unknown.length > 0) {
    throw new Error(
      `[tinyrack-docs] Unknown highlight.languages entries: ${unknown.join(', ')}. Supported ids: ${docsHighlightLanguages.join(', ')}`,
    );
  }
  return [...new Set(declared)];
}

export function resolveDocsHighlightThemes(config: DocsConfig): DocsHighlightThemePair {
  const themes = config.highlight?.themes ?? docsHighlightDefaultThemes;
  const unknown = [...new Set(Object.values(themes))].filter(
    (theme) => !isDocsHighlightTheme(theme),
  );
  if (unknown.length > 0) {
    throw new Error(
      `[tinyrack-docs] Unknown highlight.themes entries: ${unknown.join(', ')}`,
    );
  }
  return themes;
}

function generateHighlighterSource(config: DocsConfig) {
  const languages = resolveDocsHighlightLanguages(config);
  const themes = resolveDocsHighlightThemes(config);
  const languageLoaders = languages
    .map(
      (language) =>
        `  ${JSON.stringify(language)}: () => import('@shikijs/langs/${docsHighlightLanguageGrammars[language]}'),`,
    )
    .join('\n');
  const themeLoaders = [...new Set(Object.values(themes))]
    .map(
      (theme) =>
        `  ${JSON.stringify(theme)}: () => import('@shikijs/themes/${theme}'),`,
    )
    .join('\n');

  // `createDocsHighlighter` is imported dynamically so Shiki's core and regex
  // engine stay out of the eagerly loaded root chunk. Only these tiny loader
  // closures are evaluated up front; each grammar remains its own lazy chunk.
  return `const langs = {
${languageLoaders}
};

const themeLoaders = {
${themeLoaders}
};

const themes = ${JSON.stringify(themes)};

let highlighterPromise;

export const docsHighlightLanguages = ${JSON.stringify(languages)};

export const docsHighlighter = async (request) => {
  highlighterPromise ??= import(${JSON.stringify(highlighterModulePath)}).then(
    ({ createDocsHighlighter }) => createDocsHighlighter({ langs, themeLoaders, themes }),
  );
  return (await highlighterPromise)(request);
};
`;
}

export function docsHighlighterPlugin(config: DocsConfig): Plugin {
  return {
    name: 'tinyrack-docs-highlighter',
    enforce: 'pre',
    load(id) {
      return toModuleId(id) === virtualHighlighterPath
        ? generateHighlighterSource(config)
        : undefined;
    },
    resolveId(id) {
      return id === docsHighlighterModuleId ? virtualHighlighterPath : undefined;
    },
  };
}
