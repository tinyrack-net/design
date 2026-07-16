'use client';

import { createContext, type RefObject, useContext } from 'react';
import type { DrawerHandle, DrawerRootProps } from '../drawer/index.js';

export type AppShellBreakpoint = 'sm' | 'lg';
export type AppShellLayout = 'header-first' | 'sidebar-first';

export type AppShellContextValue = {
  breakpoint: AppShellBreakpoint;
  defaultOpen: boolean | undefined;
  drawerHandle: DrawerHandle<unknown>;
  mobile: boolean;
  onOpenChange: DrawerRootProps['onOpenChange'] | undefined;
  open: boolean | undefined;
  portalContainer: HTMLElement | null | undefined;
  triggerRef: RefObject<HTMLButtonElement | null>;
};

export const AppShellContext = createContext<AppShellContextValue | null>(null);

export function useAppShellContext(part: string) {
  const context = useContext(AppShellContext);
  if (!context) throw new Error(`AppShell.${part} must be used inside AppShell.Root.`);
  return context;
}
