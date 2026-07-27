import type { TRCodeHighlighter } from '../../components/code-block/code-block-highlighter.js';
import {
  createTRShikiHighlighter,
  type TRShikiCodeToTokens,
  type TRShikiThemePair,
} from '../shiki/shiki-highlighter.js';

/**
 * This is the only module in `@tinyrack/ui` that names `shiki`. Importing it is
 * what pulls Shiki's full web bundle into an application; the component itself
 * ships no grammars. `shiki` is an optional peer dependency, so this subpath
 * requires the consumer to have installed it.
 */

export type TRShikiWebHighlighterOptions = {
  themes?: TRShikiThemePair;
};

export function createTRShikiWebHighlighter(
  options: TRShikiWebHighlighterOptions = {},
): TRCodeHighlighter {
  const codeToTokens: TRShikiCodeToTokens = async (code, tokenOptions) => {
    const shiki = await import('shiki/bundle/web');
    // The bundle types `lang` as `BundledLanguage`; the contract accepts any
    // string and relies on Shiki throwing for an unknown one, which
    // `createTRShikiHighlighter` converts into an unsupported-language result.
    return shiki.codeToTokens(code, tokenOptions as never);
  };

  return createTRShikiHighlighter({ codeToTokens, ...options });
}

/** Zero-configuration highlighter backed by Shiki's full web bundle. */
export const trShikiWebHighlighter: TRCodeHighlighter = createTRShikiWebHighlighter();
