'use client';

import { type ComponentProps, useMemo, useRef, useSyncExternalStore } from 'react';
import { mergeClassNames } from '../../internal/component-class-name.js';
import { TRDrawer, type TRDrawerRootProps } from '../drawer/index.js';
import {
  AppShellContext,
  type TRAppShellBreakpoint,
  type TRAppShellLayout,
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
  drawerPopupClassName?: string;
  layout?: TRAppShellLayout;
  onOpenChange?: TRDrawerRootProps['onOpenChange'];
  open?: boolean;
  portalContainer?: HTMLElement | null;
};

export function TRAppShellRoot({
  breakpoint = 'lg',
  className,
  defaultOpen,
  drawerPopupClassName,
  layout = 'header-first',
  onOpenChange,
  open,
  portalContainer,
  ...props
}: TRAppShellRootProps) {
  const query = breakpointQueries[breakpoint];
  const mobile = useSyncExternalStore(
    (callback) => subscribeToQuery(query, callback),
    () => window.matchMedia(query).matches,
    () => false,
  );
  const drawerHandle = useMemo(() => TRDrawer.createHandle(), []);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const context = useMemo(
    () => ({
      breakpoint,
      defaultOpen,
      drawerHandle,
      drawerPopupClassName,
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
      drawerPopupClassName,
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
