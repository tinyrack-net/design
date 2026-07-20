'use client';

import { createContext, type RefObject, useContext } from 'react';
import type { TRDrawerHandle, TRDrawerRootProps } from '../drawer/index.js';

export type TRAppShellBreakpoint = 'sm' | 'lg';
export type TRAppShellLayout = 'header-first' | 'sidebar-first';

export type AppShellContextValue = {
  breakpoint: TRAppShellBreakpoint;
  defaultOpen: boolean | undefined;
  drawerHandle: TRDrawerHandle<unknown>;
  drawerPopupClassName: string | undefined;
  mobile: boolean;
  onOpenChange: TRDrawerRootProps['onOpenChange'] | undefined;
  open: boolean | undefined;
  portalContainer: HTMLElement | null | undefined;
  triggerRef: RefObject<HTMLButtonElement | null>;
};

export const AppShellContext = createContext<AppShellContextValue | null>(null);

export function useAppShellContext(part: string) {
  const context = useContext(AppShellContext);
  if (!context)
    throw new Error(`TRAppShell.${part} must be used inside TRAppShell.Root.`);
  return context;
}
