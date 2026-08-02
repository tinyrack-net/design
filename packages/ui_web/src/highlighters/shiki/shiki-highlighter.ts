import type {
  TRCodeHighlighter,
  TRCodeHighlightResult,
  TRCodeToken,
} from '../../components/code-block/code-block-highlighter.js';

/**
 * Structural subset of Shiki's `codeToTokens`. Declared rather than imported so
 * this module compiles without `shiki` installed and accepts any Shiki-shaped
 * bundle, including a narrowed one built with `createBundledHighlighter`.
 */
export type TRShikiCodeToTokens = (
  code: string,
  options: {
    defaultColor: 'light-dark()';
    lang: string;
    themes: { dark: string; light: string };
  },
) => Promise<{
  bg?: string;
  fg?: string;
  tokens: TRCodeToken[][];
}>;

export type TRShikiThemePair = {
  dark: string;
  light: string;
};

export type TRShikiHighlighterOptions = {
  codeToTokens: TRShikiCodeToTokens;
  /**
   * Grammars this bundle can load. When provided, a language outside the list
   * resolves `null` without calling Shiki. When omitted, an unknown language is
   * recognised from the error Shiki throws.
   */
  languages?: readonly string[];
  themes?: TRShikiThemePair;
};

export const trShikiDefaultThemes: TRShikiThemePair = {
  dark: 'github-dark-high-contrast',
  light: 'github-light-high-contrast',
};

/**
 * With `defaultColor: 'light-dark()'` Shiki packs both theme colors into one
 * `;`-separated declaration. Only the first is a usable bare color value.
 */
function shikiColorValue(value: string | undefined) {
  return value?.split(';', 1)[0];
}

function isUnknownLanguageError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  return /language[^\n]*not (?:found|included|loaded)/i.test(message);
}

export function createTRShikiHighlighter({
  codeToTokens,
  languages,
  themes = trShikiDefaultThemes,
}: TRShikiHighlighterOptions): TRCodeHighlighter {
  const supported = languages === undefined ? null : new Set(languages);

  return async ({ code, language }): Promise<TRCodeHighlightResult | null> => {
    if (supported !== null && !supported.has(language)) return null;

    let result: Awaited<ReturnType<TRShikiCodeToTokens>>;
    try {
      result = await codeToTokens(code, {
        defaultColor: 'light-dark()',
        lang: language,
        themes,
      });
    } catch (error) {
      if (isUnknownLanguageError(error)) return null;
      throw error;
    }

    return {
      backgroundColor: shikiColorValue(result.bg),
      color: shikiColorValue(result.fg),
      lines: result.tokens,
    };
  };
}
