'use client';

import { type ComponentProps, useMemo, useRef, useSyncExternalStore } from 'react';
import { mergeClassNames } from '../../internal/component-class-name.js';
import { Drawer, type DrawerRootProps } from '../drawer/index.js';
import {
  type AppShellBreakpoint,
  AppShellContext,
  type AppShellLayout,
} from './app-shell-context.js';

const breakpointQueries: Record<AppShellBreakpoint, string> = {
  sm: '(width < 48rem)',
  lg: '(width < 64rem)',
};

function subscribeToQuery(query: string, callback: () => void) {
  const media = window.matchMedia(query);
  media.addEventListener('change', callback);
  return () => media.removeEventListener('change', callback);
}

export type AppShellRootProps = Omit<ComponentProps<'div'>, 'onChange'> & {
  breakpoint?: AppShellBreakpoint;
  defaultOpen?: boolean;
  layout?: AppShellLayout;
  onOpenChange?: DrawerRootProps['onOpenChange'];
  open?: boolean;
  portalContainer?: HTMLElement | null;
};

export function AppShellRoot({
  breakpoint = 'lg',
  className,
  defaultOpen,
  layout = 'header-first',
  onOpenChange,
  open,
  portalContainer,
  ...props
}: AppShellRootProps) {
  const query = breakpointQueries[breakpoint];
  const mobile = useSyncExternalStore(
    (callback) => subscribeToQuery(query, callback),
    () => window.matchMedia(query).matches,
    () => false,
  );
  const drawerHandle = useMemo(() => Drawer.createHandle(), []);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const context = useMemo(
    () => ({
      breakpoint,
      defaultOpen,
      drawerHandle,
      mobile,
      onOpenChange,
      open,
      portalContainer,
      triggerRef,
    }),
    [
      breakpoint,
      defaultOpen,
      drawerHandle,
      mobile,
      onOpenChange,
      open,
      portalContainer,
    ],
  );

  return (
    <AppShellContext.Provider value={context}>
      <div
        {...props}
        className={mergeClassNames('tr-app-shell', className)}
        data-breakpoint={breakpoint}
        data-layout={layout}
      />
    </AppShellContext.Provider>
  );
}
