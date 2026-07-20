'use client';

import { Menu, X } from 'lucide-react';
import type { ComponentPropsWithRef, ReactNode } from 'react';
import { createContext, useContext, useEffect, useMemo, useRef } from 'react';
import { mergeClassNames } from '../../internal/component-class-name.js';
import { TRAppShell, type TRAppShellRootProps } from '../app-shell/index.js';
import { TRProgress } from '../progress/index.js';
import { TRScrollArea } from '../scroll-area/index.js';

export type TRDocsShellLayout = 'docs' | 'splash' | 'standalone';
export type TRDocsShellNavigationKind = 'POP' | 'PUSH' | 'REPLACE';

type DocsShellContextValue = {
  closeNavigationLabel: string;
  isPending: boolean;
  mainViewportRef: React.RefObject<HTMLDivElement | null>;
  openNavigationLabel: string;
};

const DocsShellContext = createContext<DocsShellContextValue | null>(null);

function useDocsShellContext(part: string) {
  const context = useContext(DocsShellContext);
  if (context === null) {
    throw new Error(`TRDocsShell.${part} must be used inside TRDocsShell.Root.`);
  }
  return context;
}

function targetIdFromHash(hash: string) {
  const id = hash.replace(/^#/, '');
  try {
    return decodeURIComponent(id);
  } catch {
    return id;
  }
}

export type TRDocsShellRootProps = Omit<
  TRAppShellRootProps,
  'breakpoint' | 'layout'
> & {
  closeNavigationLabel?: string;
  currentPath: string;
  hash?: string;
  layout?: TRDocsShellLayout;
  loadingLabel?: string;
  locationKey: string;
  navigationKind?: TRDocsShellNavigationKind;
  openNavigationLabel?: string;
  pendingPath?: string;
};

export function TRDocsShellRoot({
  children,
  className,
  closeNavigationLabel = 'Close navigation',
  currentPath,
  hash = '',
  layout = 'docs',
  loadingLabel = 'Loading page',
  locationKey,
  navigationKind = 'PUSH',
  openNavigationLabel = 'Open navigation',
  pendingPath,
  ...props
}: TRDocsShellRootProps) {
  const mainViewportRef = useRef<HTMLDivElement>(null);
  const scrollPositions = useRef(new Map<string, number>());
  const isPending = pendingPath !== undefined && pendingPath !== currentPath;
  const context = useMemo(
    () => ({ closeNavigationLabel, isPending, mainViewportRef, openNavigationLabel }),
    [closeNavigationLabel, isPending, openNavigationLabel],
  );

  useEffect(() => {
    const viewport = mainViewportRef.current;
    if (viewport === null) return;
    if (hash.length > 1) {
      document
        .getElementById(targetIdFromHash(hash))
        ?.scrollIntoView({ block: 'start' });
    } else {
      viewport.scrollTop =
        navigationKind === 'POP' ? (scrollPositions.current.get(locationKey) ?? 0) : 0;
    }
    return () => {
      scrollPositions.current.set(locationKey, viewport.scrollTop);
    };
  }, [hash, locationKey, navigationKind]);

  return (
    <DocsShellContext value={context}>
      <TRAppShell.Root
        {...props}
        breakpoint="lg"
        className={mergeClassNames('tr-docs-shell', className)}
        data-docs-layout={layout}
        drawerPopupClassName="tr-docs-shell-drawer-popup"
        layout="header-first"
      >
        {isPending ? (
          <TRProgress.Root className="tr-docs-shell-progress" uiSize="sm" value={null}>
            <TRProgress.Label className="tr-docs-shell-visually-hidden">
              {loadingLabel}
            </TRProgress.Label>
            <TRProgress.Track>
              <TRProgress.Indicator />
            </TRProgress.Track>
          </TRProgress.Root>
        ) : null}
        {children}
      </TRAppShell.Root>
    </DocsShellContext>
  );
}

export type TRDocsShellHeaderProps = ComponentPropsWithRef<typeof TRAppShell.Header>;

export function TRDocsShellHeader({
  children,
  className,
  ...props
}: TRDocsShellHeaderProps) {
  const { openNavigationLabel } = useDocsShellContext('Header');
  return (
    <TRAppShell.Header
      {...props}
      className={mergeClassNames('tr-docs-shell-header', className)}
    >
      <TRAppShell.Trigger
        appearance="ghost"
        aria-label={openNavigationLabel}
        className="tr-docs-shell-menu-trigger"
        uiSize="sm"
      >
        <Menu aria-hidden="true" className="tr-docs-shell-menu-icon" />
      </TRAppShell.Trigger>
      {children}
    </TRAppShell.Header>
  );
}

export type TRDocsShellBrandProps = ComponentPropsWithRef<'div'>;

export function TRDocsShellBrand({ className, ...props }: TRDocsShellBrandProps) {
  return (
    <div {...props} className={mergeClassNames('tr-docs-shell-brand', className)} />
  );
}

export type TRDocsShellActionsProps = ComponentPropsWithRef<'div'>;

export function TRDocsShellActions({ className, ...props }: TRDocsShellActionsProps) {
  return (
    <div {...props} className={mergeClassNames('tr-docs-shell-actions', className)} />
  );
}

export type TRDocsShellSidebarProps = ComponentPropsWithRef<typeof TRAppShell.Sidebar>;

export function TRDocsShellSidebar({
  children,
  className,
  ...props
}: TRDocsShellSidebarProps) {
  const { closeNavigationLabel } = useDocsShellContext('Sidebar');
  return (
    <TRAppShell.Sidebar
      {...props}
      className={mergeClassNames('tr-docs-shell-sidebar', className)}
    >
      <TRAppShell.Close
        appearance="ghost"
        aria-label={closeNavigationLabel}
        className="tr-docs-shell-menu-close"
        uiSize="sm"
      >
        <X aria-hidden="true" className="tr-docs-shell-close-icon" />
      </TRAppShell.Close>
      {children}
    </TRAppShell.Sidebar>
  );
}

export type TRDocsShellMainProps = Omit<
  ComponentPropsWithRef<typeof TRAppShell.Main>,
  'children'
> & { children?: ReactNode; contentClassName?: string; viewportLabel?: string };

export function TRDocsShellMain({
  children,
  className,
  contentClassName,
  viewportLabel = 'Page content',
  ...props
}: TRDocsShellMainProps) {
  const { isPending, mainViewportRef } = useDocsShellContext('Main');
  return (
    <TRAppShell.Main
      {...props}
      className={mergeClassNames('tr-docs-shell-main', className)}
    >
      <TRScrollArea.Root className="tr-docs-shell-scroll-area" variant="plain">
        <TRScrollArea.Viewport
          aria-label={viewportLabel}
          className="tr-docs-shell-scroll-viewport"
          ref={mainViewportRef}
          role="region"
        >
          <TRScrollArea.Content
            aria-busy={isPending || undefined}
            className={mergeClassNames('tr-docs-shell-content', contentClassName)}
            style={{ minWidth: '100%' }}
          >
            {children}
          </TRScrollArea.Content>
        </TRScrollArea.Viewport>
        <TRScrollArea.Scrollbar orientation="vertical">
          <TRScrollArea.Thumb />
        </TRScrollArea.Scrollbar>
      </TRScrollArea.Root>
    </TRAppShell.Main>
  );
}

export type TRDocsShellOutlineProps = ComponentPropsWithRef<'aside'>;

export function TRDocsShellOutline({ className, ...props }: TRDocsShellOutlineProps) {
  return (
    <aside {...props} className={mergeClassNames('tr-docs-shell-outline', className)} />
  );
}
