import { createContext, type MutableRefObject, useContext } from 'react';
import { requireComponentContext } from '../../internal/react/context.js';
import type { OpenState } from '../../internal/react/state.js';
import type { ModalOpenChangeReason } from './contract.js';

export type ModalContextValue = OpenState<ModalOpenChangeReason> & {
  closeOnBackdrop: boolean;
  closeOnEscape: boolean;
  descriptionId: string;
  descriptionPresent: boolean;
  id: string;
  preventScroll: boolean;
  setDescriptionPresent: (present: boolean) => void;
  titleId: string;
  triggerRef: MutableRefObject<HTMLElement | null>;
};

export const ModalContext = createContext<ModalContextValue | null>(null);

export function useModalContext(componentName: string) {
  return requireComponentContext(useContext(ModalContext), componentName, 'Modal');
}
