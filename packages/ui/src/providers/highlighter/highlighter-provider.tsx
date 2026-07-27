'use client';

import { createContext, type ReactNode, useContext, useMemo } from 'react';
import type {
  TRCodeHighlighter,
  TRCodeHighlightFailure,
} from '../../components/code-block/code-block-highlighter.js';

export type TRCodeHighlighterContextValue = {
  highlighter: TRCodeHighlighter | null;
  onHighlightFailure: ((failure: TRCodeHighlightFailure) => void) | undefined;
};

const emptyContext: TRCodeHighlighterContextValue = {
  highlighter: null,
  onHighlightFailure: undefined,
};

const TRCodeHighlighterContext =
  createContext<TRCodeHighlighterContextValue>(emptyContext);

export type TRCodeHighlighterProviderProps = {
  children?: ReactNode;
  highlighter: TRCodeHighlighter;
  onHighlightFailure?: (failure: TRCodeHighlightFailure) => void;
};

export function TRCodeHighlighterProvider({
  children,
  highlighter,
  onHighlightFailure,
}: TRCodeHighlighterProviderProps) {
  const value = useMemo<TRCodeHighlighterContextValue>(
    () => ({ highlighter, onHighlightFailure }),
    [highlighter, onHighlightFailure],
  );

  return (
    <TRCodeHighlighterContext.Provider value={value}>
      {children}
    </TRCodeHighlighterContext.Provider>
  );
}

export function useTRCodeHighlighter() {
  return useContext(TRCodeHighlighterContext);
}
