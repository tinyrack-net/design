import type { TRCodeHighlighter } from '@tinyrack/ui/components/code-block';
import { createTRShikiHighlighter } from '@tinyrack/ui/highlighters/shiki';
import type { LanguageInput, ThemeInput } from 'shiki/core';
import { createBundledHighlighter, createSingletonShorthands } from 'shiki/core';
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript';
import {
  type DocsHighlightLanguage,
  type DocsHighlightThemePair,
  docsHighlightDefaultThemes,
} from './docs-languages.js';

export type CreateDocsHighlighterOptions = {
  /**
   * Grammar loaders keyed by language id. Supplied by the caller — normally the
   * generated `virtual:tinyrack-docs/highlighter` module, which emits an
   * `import()` only for the languages a site declares in `docs.config.ts`. That
   * is what keeps an undeclared grammar out of the build entirely; filtering a
   * record of literal loaders would not, because Rollup cannot drop a dynamic
   * import reachable through an object it cannot analyse.
   */
  langs: Readonly<Record<string, LanguageInput>>;
  /**
   * Theme loaders keyed by the ids in `themes`. The generated docs virtual
   * module supplies one literal `import()` per selected theme so every other
   * Shiki theme stays out of the client build.
   */
  themeLoaders: Readonly<Record<string, ThemeInput>>;
  themes?: DocsHighlightThemePair;
};

/**
 * Builds a fine-grained Shiki bundle for a docs site and adapts it to the
 * `TRCodeHighlighter` contract.
 *
 * Uses the JavaScript regex engine, so no Oniguruma WASM payload ships.
 */
export function createDocsHighlighter({
  langs,
  themeLoaders,
  themes = docsHighlightDefaultThemes,
}: CreateDocsHighlighterOptions): TRCodeHighlighter {
  const missingThemeLoaders = [...new Set(Object.values(themes))].filter(
    (theme) => !Object.hasOwn(themeLoaders, theme),
  );
  if (missingThemeLoaders.length > 0) {
    throw new Error(
      `[tinyrack-docs] Missing theme loaders for: ${missingThemeLoaders.join(', ')}`,
    );
  }

  const { codeToTokens } = createSingletonShorthands<string, string>(
    createBundledHighlighter<string, string>({
      engine: () => createJavaScriptRegexEngine(),
      langs,
      themes: { ...themeLoaders },
    }),
  );

  return createTRShikiHighlighter({
    codeToTokens,
    languages: Object.keys(langs),
    themes,
  });
}

export type { DocsHighlightLanguage };
