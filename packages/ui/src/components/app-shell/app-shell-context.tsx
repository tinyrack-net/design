'use client';

import { createContext, type RefObject, type UIEventHandler, useContext } from 'react';
import type { TRDrawerHandle, TRDrawerRootProps } from '../drawer/index.js';

export type TRAppShellBreakpoint = 'sm' | 'lg';
export type TRAppShellChrome = 'app' | 'docs' | 'splash' | 'standalone';
export type TRAppShellLayout = 'header-first' | 'sidebar-first';
export type TRAppShellMobileSidebar = 'drawer' | 'rail';
export type TRAppShellNavigationKind = 'POP' | 'PUSH' | 'REPLACE';
export type TRAppShellSidebarMode = 'expanded' | 'rail';

export type AppShellContextValue = {
  breakpoint: TRAppShellBreakpoint;
  chrome: TRAppShellChrome;
  defaultOpen: boolean | undefined;
  drawerHandle: TRDrawerHandle<unknown>;
  drawerPopupClassName: string | undefined;
  drawerActive: boolean;
  isPending: boolean;
  mainViewportRef: RefObject<HTMLDivElement | null>;
  mobile: boolean;
  mobileSidebar: TRAppShellMobileSidebar;
  onMainScroll: UIEventHandler<HTMLDivElement>;
  onOpenChange: TRDrawerRootProps['onOpenChange'] | undefined;
  open: boolean | undefined;
  portalContainer: HTMLElement | null | undefined;
  setSidebarMode: (mode: TRAppShellSidebarMode) => void;
  sidebarMode: TRAppShellSidebarMode;
  triggerRef: RefObject<HTMLButtonElement | null>;
};

export const AppShellContext = createContext<AppShellContextValue | null>(null);

export function useAppShellContext(part: string) {
  const context = useContext(AppShellContext);
  if (!context)
    throw new Error(`TRAppShell.${part} must be used inside TRAppShell.Root.`);
  return context;
}
