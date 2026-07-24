'use client';

import {
  type ComponentProps,
  type UIEventHandler,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react';
import { tinyrackBreakpoints } from '../../core/tokens/breakpoints.js';
import { mergeClassNames } from '../../internal/component-class-name.js';
import { TRDrawer, type TRDrawerRootProps } from '../drawer/index.js';
import {
  AppShellContext,
  type TRAppShellBreakpoint,
  type TRAppShellChrome,
  type TRAppShellLayout,
  type TRAppShellMobileSidebar,
  type TRAppShellNavigationKind,
  type TRAppShellSidebarMode,
} from './app-shell-context.js';
import { AppShellProgress } from './app-shell-progress.js';

const breakpointQueries: Record<TRAppShellBreakpoint, string> = {
  sm: `(width < ${tinyrackBreakpoints.md})`,
  lg: `(width < ${tinyrackBreakpoints.lg})`,
};

function subscribeToQuery(query: string, callback: () => void) {
  const media = window.matchMedia(query);
  media.addEventListener('change', callback);
  return () => media.removeEventListener('change', callback);
}

function targetIdFromHash(hash: string) {
  const id = hash.replace(/^#/, '');
  try {
    return decodeURIComponent(id);
  } catch {
    return id;
  }
}

export type TRAppShellRootProps = Omit<ComponentProps<'div'>, 'onChange'> & {
  breakpoint?: TRAppShellBreakpoint;
  /**
   * Content shape of the shell. `app` (default) is a plain application shell.
   * `docs`/`splash`/`standalone` enable documentation chrome, route progress,
   * and scroll restoration.
   */
  chrome?: TRAppShellChrome;
  currentPath?: string;
  defaultOpen?: boolean;
  defaultSidebarMode?: TRAppShellSidebarMode;
  drawerPopupClassName?: string;
  hash?: string;
  layout?: TRAppShellLayout;
  loadingLabel?: string;
  locationKey?: string;
  mobileSidebar?: TRAppShellMobileSidebar;
  navigationKind?: TRAppShellNavigationKind;
  onOpenChange?: TRDrawerRootProps['onOpenChange'];
  onSidebarModeChange?: (mode: TRAppShellSidebarMode) => void;
  open?: boolean;
  pendingPath?: string;
  portalContainer?: HTMLElement | null;
  sidebarMode?: TRAppShellSidebarMode;
};

export function TRAppShellRoot({
  breakpoint = 'lg',
  children,
  chrome = 'app',
  className,
  currentPath,
  defaultOpen,
  defaultSidebarMode = 'expanded',
  drawerPopupClassName,
  hash = '',
  layout = 'header-first',
  loadingLabel = 'Loading page',
  locationKey,
  mobileSidebar = 'drawer',
  navigationKind = 'PUSH',
  onOpenChange,
  onSidebarModeChange,
  open,
  pendingPath,
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
  const mainViewportRef = useRef<HTMLDivElement>(null);
  const scrollPositions = useRef(new Map<string, number>());
  const isPending =
    pendingPath !== undefined &&
    currentPath !== undefined &&
    pendingPath !== currentPath;
  const scrollKey = locationKey ?? currentPath ?? '';
  const onMainScroll = useCallback<UIEventHandler<HTMLDivElement>>(
    (event) => {
      scrollPositions.current.set(scrollKey, event.currentTarget.scrollTop);
    },
    [scrollKey],
  );
  const context = useMemo(
    () => ({
      breakpoint,
      chrome,
      defaultOpen,
      drawerHandle,
      drawerPopupClassName,
      drawerActive,
      isPending,
      mainViewportRef,
      mobile,
      mobileSidebar,
      onMainScroll,
      onOpenChange,
      open,
      portalContainer,
      setSidebarMode,
      sidebarMode,
      triggerRef,
    }),
    [
      breakpoint,
      chrome,
      defaultOpen,
      drawerHandle,
      drawerPopupClassName,
      drawerActive,
      isPending,
      mobile,
      mobileSidebar,
      onMainScroll,
      onOpenChange,
      open,
      portalContainer,
      setSidebarMode,
      sidebarMode,
    ],
  );

  useEffect(() => {
    const viewport = mainViewportRef.current;
    if (viewport === null) return;
    if (hash.length > 1) {
      const target = document.getElementById(targetIdFromHash(hash));
      if (target !== null && viewport.contains(target)) {
        target.scrollIntoView({ block: 'start' });
      }
    } else {
      viewport.scrollTop =
        navigationKind === 'POP' ? (scrollPositions.current.get(scrollKey) ?? 0) : 0;
    }
  }, [hash, scrollKey, navigationKind]);

  return (
    <AppShellContext.Provider value={context}>
      <div
        {...props}
        className={mergeClassNames('tr-app-shell', className)}
        data-breakpoint={breakpoint}
        data-chrome={chrome}
        data-layout={layout}
        data-mobile-sidebar={mobileSidebar}
        data-sidebar-mode={sidebarMode}
      >
        {isPending ? <AppShellProgress label={loadingLabel} /> : null}
        {children}
      </div>
    </AppShellContext.Provider>
  );
}
