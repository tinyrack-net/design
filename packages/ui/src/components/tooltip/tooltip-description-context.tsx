'use client';

import { createContext, type Dispatch, type SetStateAction, useContext } from 'react';

export type TooltipDescriptionContextValue = {
  descriptionId: string;
  fallbackId: string;
  setPopupId: Dispatch<SetStateAction<string | null>>;
};

const TooltipDescriptionContext = createContext<TooltipDescriptionContextValue | null>(
  null,
);

export const TooltipDescriptionProvider = TooltipDescriptionContext.Provider;

export function useTooltipDescriptionContext(): TooltipDescriptionContextValue | null {
  return useContext(TooltipDescriptionContext);
}
