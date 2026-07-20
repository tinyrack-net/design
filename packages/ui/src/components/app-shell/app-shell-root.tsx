'use client';

import {
  type ComponentProps,
  useCallback,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react';
import { mergeClassNames } from '../../internal/component-class-name.js';
import { TRDrawer, type TRDrawerRootProps } from '../drawer/index.js';
import {
  AppShellContext,
  type TRAppShellBreakpoint,
  type TRAppShellLayout,
  type TRAppShellMobileSidebar,
  type TRAppShellSidebarMode,
} from './app-shell-context.js';

const breakpointQueries: Record<TRAppShellBreakpoint, string> = {
  sm: '(width < 48rem)',
  lg: '(width < 64rem)',
};

function subscribeToQuery(query: string, callback: () => void) {
  const media = window.matchMedia(query);
  media.addEventListener('change', callback);
  return () => media.removeEventListener('change', callback);
}

export type TRAppShellRootProps = Omit<ComponentProps<'div'>, 'onChange'> & {
  breakpoint?: TRAppShellBreakpoint;
  defaultOpen?: boolean;
  defaultSidebarMode?: TRAppShellSidebarMode;
  drawerPopupClassName?: string;
  layout?: TRAppShellLayout;
  mobileSidebar?: TRAppShellMobileSidebar;
  onOpenChange?: TRDrawerRootProps['onOpenChange'];
  onSidebarModeChange?: (mode: TRAppShellSidebarMode) => void;
  open?: boolean;
  portalContainer?: HTMLElement | null;
  sidebarMode?: TRAppShellSidebarMode;
};

export function TRAppShellRoot({
  breakpoint = 'lg',
  className,
  defaultOpen,
  defaultSidebarMode = 'expanded',
  drawerPopupClassName,
  layout = 'header-first',
  mobileSidebar = 'drawer',
  onOpenChange,
  onSidebarModeChange,
  open,
  portalContainer,
  sidebarMode: controlledSidebarMode,
  ...props
}: TRAppShellRootProps) {
  const query = breakpointQueries[breakpoint];
  const mobile = useSyncExternalStore(
    (callback) => subscribeToQuery(query, callback),
    () => window.matchMedia(query).matches,
    () => false,
  );
  const [uncontrolledSidebarMode, setUncontrolledSidebarMode] =
    useState<TRAppShellSidebarMode>(defaultSidebarMode);
  const storedSidebarMode = controlledSidebarMode ?? uncontrolledSidebarMode;
  const sidebarMode = mobile && mobileSidebar === 'rail' ? 'rail' : storedSidebarMode;
  const drawerActive = mobile && mobileSidebar === 'drawer';
  const setSidebarMode = useCallback(
    (mode: TRAppShellSidebarMode) => {
      if (controlledSidebarMode === undefined) setUncontrolledSidebarMode(mode);
      onSidebarModeChange?.(mode);
    },
    [controlledSidebarMode, onSidebarModeChange],
  );
  const drawerHandle = useMemo(() => TRDrawer.createHandle(), []);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const context = useMemo(
    () => ({
      breakpoint,
      defaultOpen,
      drawerHandle,
      drawerPopupClassName,
      drawerActive,
      mobile,
      mobileSidebar,
      onOpenChange,
      open,
      portalContainer,
      setSidebarMode,
      sidebarMode,
      triggerRef,
    }),
    [
      breakpoint,
      defaultOpen,
      drawerHandle,
      drawerPopupClassName,
      drawerActive,
      mobile,
      mobileSidebar,
      onOpenChange,
      open,
      portalContainer,
      setSidebarMode,
      sidebarMode,
    ],
  );

  return (
    <AppShellContext.Provider value={context}>
      <div
        {...props}
        className={mergeClassNames('tr-app-shell', className)}
        data-breakpoint={breakpoint}
        data-layout={layout}
        data-mobile-sidebar={mobileSidebar}
        data-sidebar-mode={sidebarMode}
      />
    </AppShellContext.Provider>
  );
}
