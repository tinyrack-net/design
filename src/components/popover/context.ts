import { createContext, type MutableRefObject, useContext } from 'react';
import { requireComponentContext } from '../../internal/react/context.js';
import type { OpenState } from '../../internal/react/state.js';
import type {
  PopoverMode,
  PopoverOpenChangeReason,
  PopoverPlacement,
} from './contract.js';

export type PopoverContextValue = OpenState<PopoverOpenChangeReason> & {
  anchorRef: MutableRefObject<HTMLElement | null>;
  closeOnEscape: boolean;
  collisionPadding: number;
  id: string;
  matchAnchorWidth: boolean;
  mode: PopoverMode;
  offset: number;
  placement: PopoverPlacement;
};

export const PopoverContext = createContext<PopoverContextValue | null>(null);

export function usePopoverContext(componentName: string) {
  return requireComponentContext(useContext(PopoverContext), componentName, 'Popover');
}
