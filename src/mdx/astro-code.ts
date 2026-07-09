import type { BundledLanguage, BundledTheme, ThemedToken } from 'shiki/bundle/web';
import { htmlToPlainText, languageFromClassName } from './shared.js';

const defaultShikiTheme = 'github-dark' satisfies BundledTheme;

export type TinyrackAstroCodeToken = {
  content: string;
  style?: string;
};

export type TinyrackAstroCodeRenderResult =
  | {
      kind: 'block';
      language: string;
      lines: TinyrackAstroCodeToken[][] | null;
      text: string;
    }
  | {
      kind: 'inline';
      text: string;
    };

export type TinyrackAstroCodeRenderOptions = {
  className?: string;
  html: string;
  theme?: BundledTheme;
};

type TinyrackAstroTokenStyle = {
  backgroundColor?: string;
  color?: string;
  fontStyle?: string;
  fontWeight?: number;
  textDecoration?: string;
};

function cssPropertyName(propertyName: string) {
  return propertyName.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);
}

function cssTextFromStyle(style: TinyrackAstroTokenStyle) {
  return Object.entries(style)
    .map(([propertyName, value]) => `${cssPropertyName(propertyName)}:${value}`)
    .join(';');
}

function styleForToken(token: ThemedToken) {
  if (token.htmlStyle) {
    return cssTextFromStyle(token.htmlStyle as TinyrackAstroTokenStyle);
  }

  const style: TinyrackAstroTokenStyle = {};

  if (token.color) {
    style.color = token.color;
  }

  if (token.bgColor) {
    style.backgroundColor = token.bgColor;
  }

  if (typeof token.fontStyle === 'number') {
    if ((token.fontStyle & 1) !== 0) {
      style.fontStyle = 'italic';
    }

    if ((token.fontStyle & 2) !== 0) {
      style.fontWeight = 700;
    }

    if ((token.fontStyle & 4) !== 0) {
      style.textDecoration = 'underline';
    }
  }

  return Object.keys(style).length > 0 ? cssTextFromStyle(style) : undefined;
}

export async function renderTinyrackAstroCode({
  className,
  html,
  theme = defaultShikiTheme,
}: TinyrackAstroCodeRenderOptions): Promise<TinyrackAstroCodeRenderResult> {
  const language = languageFromClassName(className);
  const text = htmlToPlainText(html).replace(/\n$/, '');

  if (language === undefined) {
    return { kind: 'inline', text };
  }

  try {
    const { codeToTokens } = await import('shiki/bundle/web');
    const result = await codeToTokens(text, {
      lang: language as BundledLanguage,
      theme,
    });

    return {
      kind: 'block',
      language,
      lines: result.tokens.map((line) =>
        line.map((token) => {
          const style = styleForToken(token);

          return style === undefined
            ? { content: token.content }
            : { content: token.content, style };
        }),
      ),
      text,
    };
  } catch {
    return {
      kind: 'block',
      language,
      lines: null,
      text,
    };
  }
}
