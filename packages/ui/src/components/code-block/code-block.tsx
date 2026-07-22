'use client';

import {
  type ComponentProps,
  type CSSProperties,
  Fragment,
  type ReactNode,
  useEffect,
  useState,
} from 'react';
import type { BundledLanguage, ThemedToken } from 'shiki/bundle/web';
import { mergeClassNames } from '../../internal/component-class-name.js';

const automaticShikiThemes = {
  dark: 'github-dark-high-contrast',
  light: 'github-light-high-contrast',
} as const;

type HighlightedLines = ThemedToken[][];
type HighlightedCode = {
  backgroundColor: string | undefined;
  color: string | undefined;
  lines: HighlightedLines;
};

export type TRCodeBlockProps = Omit<ComponentProps<'pre'>, 'children'> & {
  code: string;
  language?: BundledLanguage;
  wrap?: boolean;
};

function shikiColorValue(value: string | undefined) {
  return value?.split(';', 1)[0];
}

export function styleForToken(token: ThemedToken) {
  if (token.htmlStyle) {
    return token.htmlStyle as CSSProperties;
  }

  const style: CSSProperties = {};
  if (token.color) style.color = token.color;
  if (token.bgColor) style.backgroundColor = token.bgColor;
  if (typeof token.fontStyle === 'number') {
    if ((token.fontStyle & 1) !== 0) style.fontStyle = 'italic';
    if ((token.fontStyle & 2) !== 0) style.fontWeight = 700;
    if ((token.fontStyle & 4) !== 0) style.textDecoration = 'underline';
  }

  return Object.keys(style).length > 0 ? style : undefined;
}

function renderHighlightedLines(lines: HighlightedLines) {
  let emptyLineCount = 0;
  const lastLine = lines.at(-1);

  return lines.map((line) => {
    const lineKey =
      line[0] === undefined
        ? `empty-line-${emptyLineCount++}`
        : `line-${line[0].offset}`;
    return (
      <Fragment key={lineKey}>
        {line.map((token) => (
          <span key={`${token.offset}-${token.content}`} style={styleForToken(token)}>
            {token.content}
          </span>
        ))}
        {line === lastLine ? null : '\n'}
      </Fragment>
    );
  });
}

export function TRCodeBlock({
  code,
  className,
  language,
  style,
  wrap = false,
  ...props
}: TRCodeBlockProps) {
  const [highlightedCode, setHighlightedCode] = useState<HighlightedCode | null>(null);

  useEffect(() => {
    let cancelled = false;
    setHighlightedCode(null);

    if (language === undefined) {
      return () => {
        cancelled = true;
      };
    }

    const languageToHighlight = language;

    async function highlight() {
      try {
        const { codeToTokens } = await import('shiki/bundle/web');
        const result = await codeToTokens(code, {
          defaultColor: 'light-dark()',
          lang: languageToHighlight,
          themes: automaticShikiThemes,
        });
        if (!cancelled) {
          setHighlightedCode({
            backgroundColor: shikiColorValue(result.bg),
            color: shikiColorValue(result.fg),
            lines: result.tokens,
          });
        }
      } catch {}
    }

    void highlight();
    return () => {
      cancelled = true;
    };
  }, [code, language]);

  const renderedCode: ReactNode =
    highlightedCode === null ? code : renderHighlightedLines(highlightedCode.lines);
  const highlightedStyle =
    highlightedCode === null
      ? style
      : {
          backgroundColor:
            highlightedCode.backgroundColor === undefined
              ? undefined
              : `var(--tr-code-block-background, ${highlightedCode.backgroundColor})`,
          color:
            highlightedCode.color === undefined
              ? undefined
              : `var(--tr-code-block-color, ${highlightedCode.color})`,
          ...style,
        };

  return (
    <pre
      {...props}
      className={mergeClassNames('tr-code-block', className)}
      data-highlighted={highlightedCode === null ? undefined : 'true'}
      data-language={language}
      data-wrap={wrap ? 'true' : undefined}
      style={highlightedStyle}
    >
      <code>{renderedCode}</code>
    </pre>
  );
}
