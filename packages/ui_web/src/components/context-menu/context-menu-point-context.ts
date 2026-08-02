'use client';

import { createContext } from 'react';

export type ContextMenuPoint = { x: number; y: number } | null;
export type ContextMenuPointContextValue = {
  point: ContextMenuPoint;
  setPoint: (point: ContextMenuPoint) => void;
};

export const ContextMenuPointContext = createContext<ContextMenuPointContextValue>({
  point: null,
  /* v8 ignore next -- Base UI rejects Trigger and Positioner outside Root. */
  setPoint: () => undefined,
});

export const ContextMenuNestedContext = createContext(false);
