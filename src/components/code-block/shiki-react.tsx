'use client';

import {
  type CSSProperties,
  Fragment,
  type ReactNode,
  useEffect,
  useState,
} from 'react';
import type { BundledLanguage, BundledTheme, ThemedToken } from 'shiki/bundle/web';
import { CodeBlock, type CodeBlockProps } from './react.js';

const defaultShikiTheme = 'github-dark' satisfies BundledTheme;

type HighlightedLines = ThemedToken[][];

export type ShikiCodeBlockProps = Omit<CodeBlockProps, 'children' | 'language'> & {
  code: string;
  language?: BundledLanguage;
  theme?: BundledTheme;
};

function styleForToken(token: ThemedToken) {
  if (token.htmlStyle) {
    return token.htmlStyle as CSSProperties;
  }

  const style: CSSProperties = {};

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

export function ShikiCodeBlock({
  code,
  language,
  theme = defaultShikiTheme,
  ...codeBlockProps
}: ShikiCodeBlockProps) {
  const [highlightedLines, setHighlightedLines] = useState<HighlightedLines | null>(
    null,
  );

  useEffect(() => {
    let cancelled = false;

    async function highlight() {
      try {
        const { codeToTokens } = await import('shiki/bundle/web');
        const result = await codeToTokens(code, {
          lang: language ?? 'text',
          theme,
        });

        if (!cancelled) {
          setHighlightedLines(result.tokens);
        }
      } catch {
        if (!cancelled) {
          setHighlightedLines(null);
        }
      }
    }

    void highlight();

    return () => {
      cancelled = true;
    };
  }, [code, language, theme]);

  const renderedCode: ReactNode =
    highlightedLines === null ? code : renderHighlightedLines(highlightedLines);

  return language === undefined ? (
    <CodeBlock {...codeBlockProps}>{renderedCode}</CodeBlock>
  ) : (
    <CodeBlock {...codeBlockProps} language={language}>
      {renderedCode}
    </CodeBlock>
  );
}
