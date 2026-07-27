'use client';

import {
  type ComponentProps,
  type CSSProperties,
  Fragment,
  type ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { mergeClassNames } from '../../internal/component-class-name.js';
import { warnOnce } from '../../internal/warn-once.js';
import { useTRCodeHighlighter } from '../../providers/highlighter/highlighter-provider.js';
import type {
  TRCodeHighlighter,
  TRCodeHighlightFailure,
  TRCodeHighlightResult,
  TRCodeHighlightState,
  TRCodeToken,
} from './code-block-highlighter.js';

type HighlightedLines = readonly (readonly TRCodeToken[])[];

type CodeBlockHighlightRequest = {
  code: string;
  highlighter: TRCodeHighlighter | null;
  language: string | undefined;
};

type HighlightedCodeState = {
  request: CodeBlockHighlightRequest;
  result: TRCodeHighlightResult;
};

type HighlightFailureState = {
  request: CodeBlockHighlightRequest;
  reason: TRCodeHighlightFailure['reason'];
};

export type TRCodeBlockProps = Omit<ComponentProps<'pre'>, 'children'> & {
  code: string;
  /**
   * Overrides the highlighter from `TRCodeHighlighterProvider` for this block.
   * Use a stable reference; a new function identity re-runs highlighting.
   */
  highlighter?: TRCodeHighlighter;
  /**
   * Grammar identifier. Which values are valid is decided by the configured
   * highlighter, not by this package; an unrecognised one renders as plain text
   * and sets `data-highlight="unsupported"`.
   */
  language?: string;
  onHighlightFailure?: (failure: TRCodeHighlightFailure) => void;
  wrap?: boolean;
};

export function styleForToken(token: TRCodeToken) {
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
  highlighter,
  language,
  onHighlightFailure,
  style,
  wrap = false,
  ...props
}: TRCodeBlockProps) {
  const [highlightedCode, setHighlightedCode] = useState<HighlightedCodeState | null>(
    null,
  );
  const [highlightFailure, setHighlightFailure] =
    useState<HighlightFailureState | null>(null);
  const context = useTRCodeHighlighter();

  const activeHighlighter = highlighter ?? context.highlighter;
  const highlightRequest = useMemo<CodeBlockHighlightRequest>(
    () => ({ code, highlighter: activeHighlighter, language }),
    [activeHighlighter, code, language],
  );

  // The reporter is a side channel, not an input to highlighting. Holding it in
  // a ref keeps an inline `onHighlightFailure={() => …}` from re-running the
  // effect on every render, which would highlight in a loop.
  const reportFailureRef = useRef(onHighlightFailure ?? context.onHighlightFailure);
  useEffect(() => {
    reportFailureRef.current = onHighlightFailure ?? context.onHighlightFailure;
  });

  useEffect(() => {
    let cancelled = false;
    const {
      code: codeToHighlight,
      highlighter: requestHighlighter,
      language: requestLanguage,
    } = highlightRequest;

    if (requestLanguage === undefined) {
      return () => {
        cancelled = true;
      };
    }

    const languageToHighlight = requestLanguage;

    function fail(reason: TRCodeHighlightFailure['reason'], error?: unknown) {
      if (cancelled) return;
      setHighlightFailure({
        request: highlightRequest,
        reason,
      });
      const failure: TRCodeHighlightFailure = {
        code: codeToHighlight,
        error,
        language: languageToHighlight,
        reason,
      };

      const reportFailure = reportFailureRef.current;
      if (reportFailure !== undefined) {
        reportFailure(failure);
        return;
      }

      // Only a thrown highlighter is a fault worth logging. A missing
      // highlighter and an unsupported language are configuration states whose
      // correct rendering is plain text, so they surface through
      // `data-highlight` and `onHighlightFailure` without console noise.
      if (reason === 'highlight-failed') {
        warnOnce(
          `tr-code-block:highlight-failed:${languageToHighlight}`,
          `[tinyrack] TRCodeBlock failed to highlight "${languageToHighlight}". Rendering plain text.`,
          error,
        );
      }
    }

    if (requestHighlighter === null) {
      fail('no-highlighter');
      return () => {
        cancelled = true;
      };
    }

    const highlight = requestHighlighter;

    async function run() {
      try {
        const result = await highlight({
          code: codeToHighlight,
          language: languageToHighlight,
        });
        if (cancelled) return;
        if (result === null) {
          fail('unsupported-language');
          return;
        }
        setHighlightedCode({
          request: highlightRequest,
          result,
        });
      } catch (error) {
        fail('highlight-failed', error);
      }
    }

    void run();
    return () => {
      cancelled = true;
    };
  }, [highlightRequest]);

  const currentHighlightedCode =
    highlightedCode !== null && highlightedCode.request === highlightRequest
      ? highlightedCode.result
      : null;
  const currentFailureReason =
    highlightFailure !== null && highlightFailure.request === highlightRequest
      ? highlightFailure.reason
      : null;

  const highlightState: TRCodeHighlightState =
    language === undefined
      ? 'plain'
      : currentHighlightedCode !== null
        ? 'highlighted'
        : currentFailureReason === 'unsupported-language'
          ? 'unsupported'
          : currentFailureReason === 'no-highlighter'
            ? 'no-highlighter'
            : currentFailureReason === 'highlight-failed'
              ? 'error'
              : 'pending';

  const renderedCode: ReactNode =
    currentHighlightedCode === null
      ? code
      : renderHighlightedLines(currentHighlightedCode.lines);
  const highlightedStyle =
    currentHighlightedCode === null
      ? style
      : {
          backgroundColor:
            currentHighlightedCode.backgroundColor === undefined
              ? undefined
              : `var(--tr-code-block-background, ${currentHighlightedCode.backgroundColor})`,
          color:
            currentHighlightedCode.color === undefined
              ? undefined
              : `var(--tr-code-block-color, ${currentHighlightedCode.color})`,
          ...style,
        };

  return (
    <pre
      {...props}
      className={mergeClassNames('tr-code-block', className)}
      data-highlight={highlightState}
      data-highlighted={currentHighlightedCode === null ? undefined : 'true'}
      data-language={language}
      data-wrap={wrap ? 'true' : undefined}
      style={highlightedStyle}
    >
      <code>{renderedCode}</code>
    </pre>
  );
}
