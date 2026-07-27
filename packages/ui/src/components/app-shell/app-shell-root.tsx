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
import { useIsoLayoutEffect } from '../../internal/iso-layout-effect.js';
import { TRDrawer, type TRDrawerRootProps } from '../drawer/index.js';
import {
  AppShellContext,
  type TRAppShellBreakpoint,
  type TRAppShellChrome,
  type TRAppShellLayout,
  type TRAppShellMobileDrawerSide,
  type TRAppShellMobileSidebar,
  type TRAppShellNavigationKind,
  type TRAppShellPageScroll,
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
  mobileDrawerSide?: TRAppShellMobileDrawerSide;
  mobileSidebar?: TRAppShellMobileSidebar;
  navigationKind?: TRAppShellNavigationKind;
  onOpenChange?: TRDrawerRootProps['onOpenChange'];
  onSidebarModeChange?: (mode: TRAppShellSidebarMode) => void;
  open?: boolean;
  /**
   * Where page scrolling happens. `container` (default) keeps the shell in a
   * viewport-height frame and scrolls inside `Main`. `document` lets the
   * document scroll and makes only the sidebar and outline independent
   * scrollers, which is what pinch-zoom panning needs on phones.
   */
  pageScroll?: TRAppShellPageScroll;
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
  mobileDrawerSide = 'left',
  mobileSidebar = 'drawer',
  navigationKind = 'PUSH',
  onOpenChange,
  onSidebarModeChange,
  open,
  pageScroll = 'container',
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
  const documentScroll = pageScroll === 'document';
  const restoringRef = useRef(false);
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
      mobileDrawerSide,
      mobileSidebar,
      onMainScroll,
      onOpenChange,
      open,
      pageScroll,
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
      mobileDrawerSide,
      mobileSidebar,
      onMainScroll,
      onOpenChange,
      open,
      pageScroll,
      portalContainer,
      setSidebarMode,
      sidebarMode,
    ],
  );

  /*
   * The shell owns restoration in both postures, so the browser must not also
   * restore the document scroll on POP. Declared first, and before paint, so
   * it lands ahead of the restoration effect below.
   */
  useIsoLayoutEffect(() => {
    if (!documentScroll || !('scrollRestoration' in history)) return;
    const previous = history.scrollRestoration;
    history.scrollRestoration = 'manual';
    return () => {
      history.scrollRestoration = previous;
    };
  }, [documentScroll]);

  /*
   * Declared before the restoration effect so that on a navigation this
   * listener is already rebound to the new `scrollKey` when restoration
   * scrolls the document — otherwise the programmatic reset would be recorded
   * under the previous key and clobber the offset needed on Back.
   */
  useEffect(() => {
    if (!documentScroll) return;
    const handleScroll = () => {
      if (restoringRef.current) return;
      scrollPositions.current.set(scrollKey, window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [documentScroll, scrollKey]);

  useEffect(() => {
    const viewport = mainViewportRef.current;
    if (!documentScroll && viewport === null) return;
    restoringRef.current = true;
    const release = requestAnimationFrame(() => {
      restoringRef.current = false;
    });
    if (hash.length > 1) {
      const target = document.getElementById(targetIdFromHash(hash));
      // The `contains` guard keeps container scrolling from chasing a target
      // outside the panel. With the document as the scroller there is no such
      // constraint.
      if (target !== null && (documentScroll || viewport?.contains(target) === true)) {
        target.scrollIntoView({ block: 'start' });
      }
    } else {
      const top =
        navigationKind === 'POP' ? (scrollPositions.current.get(scrollKey) ?? 0) : 0;
      if (documentScroll) window.scrollTo(0, top);
      else if (viewport !== null) viewport.scrollTop = top;
    }
    return () => cancelAnimationFrame(release);
  }, [documentScroll, hash, scrollKey, navigationKind]);

  return (
    <AppShellContext.Provider value={context}>
      <div
        {...props}
        className={mergeClassNames('tr-app-shell', className)}
        data-breakpoint={breakpoint}
        data-chrome={chrome}
        data-layout={layout}
        data-mobile-sidebar={mobileSidebar}
        data-page-scroll={pageScroll}
        data-sidebar-mode={sidebarMode}
      >
        {isPending ? <AppShellProgress label={loadingLabel} /> : null}
        {children}
      </div>
    </AppShellContext.Provider>
  );
}
