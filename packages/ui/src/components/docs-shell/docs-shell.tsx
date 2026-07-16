'use client';

import { Menu, X } from 'lucide-react';
import type { ComponentPropsWithRef, ReactNode } from 'react';
import { createContext, useContext, useEffect, useMemo, useRef } from 'react';
import { mergeClassNames } from '../../internal/component-class-name.js';
import { AppShell, type AppShellRootProps } from '../app-shell/index.js';
import { Progress } from '../progress/index.js';
import { ScrollArea } from '../scroll-area/index.js';

export type DocsShellLayout = 'docs' | 'splash' | 'standalone';
export type DocsShellNavigationKind = 'POP' | 'PUSH' | 'REPLACE';

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
    throw new Error(`DocsShell.${part} must be used inside DocsShell.Root.`);
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

export type DocsShellRootProps = Omit<AppShellRootProps, 'breakpoint' | 'layout'> & {
  closeNavigationLabel?: string;
  currentPath: string;
  hash?: string;
  layout?: DocsShellLayout;
  loadingLabel?: string;
  locationKey: string;
  navigationKind?: DocsShellNavigationKind;
  openNavigationLabel?: string;
  pendingPath?: string;
};

export function DocsShellRoot({
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
}: DocsShellRootProps) {
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
      <AppShell.Root
        {...props}
        breakpoint="lg"
        className={mergeClassNames('tr-docs-shell', className)}
        data-docs-layout={layout}
        drawerPopupClassName="tr-docs-shell-drawer-popup"
        layout="header-first"
      >
        {isPending ? (
          <Progress.Root className="tr-docs-shell-progress" size="sm" value={null}>
            <Progress.Label className="tr-docs-shell-visually-hidden">
              {loadingLabel}
            </Progress.Label>
            <Progress.Track>
              <Progress.Indicator />
            </Progress.Track>
          </Progress.Root>
        ) : null}
        {children}
      </AppShell.Root>
    </DocsShellContext>
  );
}

export type DocsShellHeaderProps = ComponentPropsWithRef<typeof AppShell.Header>;

export function DocsShellHeader({
  children,
  className,
  ...props
}: DocsShellHeaderProps) {
  const { openNavigationLabel } = useDocsShellContext('Header');
  return (
    <AppShell.Header
      {...props}
      className={mergeClassNames('tr-docs-shell-header', className)}
    >
      <AppShell.Trigger
        appearance="ghost"
        aria-label={openNavigationLabel}
        className="tr-docs-shell-menu-trigger"
        size="sm"
      >
        <Menu aria-hidden="true" className="tr-docs-shell-menu-icon" />
      </AppShell.Trigger>
      {children}
    </AppShell.Header>
  );
}

export type DocsShellBrandProps = ComponentPropsWithRef<'div'>;

export function DocsShellBrand({ className, ...props }: DocsShellBrandProps) {
  return (
    <div {...props} className={mergeClassNames('tr-docs-shell-brand', className)} />
  );
}

export type DocsShellActionsProps = ComponentPropsWithRef<'div'>;

export function DocsShellActions({ className, ...props }: DocsShellActionsProps) {
  return (
    <div {...props} className={mergeClassNames('tr-docs-shell-actions', className)} />
  );
}

export type DocsShellSidebarProps = ComponentPropsWithRef<typeof AppShell.Sidebar>;

export function DocsShellSidebar({
  children,
  className,
  ...props
}: DocsShellSidebarProps) {
  const { closeNavigationLabel } = useDocsShellContext('Sidebar');
  return (
    <AppShell.Sidebar
      {...props}
      className={mergeClassNames('tr-docs-shell-sidebar', className)}
    >
      <AppShell.Close
        appearance="ghost"
        aria-label={closeNavigationLabel}
        className="tr-docs-shell-menu-close"
        size="sm"
      >
        <X aria-hidden="true" className="tr-docs-shell-close-icon" />
      </AppShell.Close>
      {children}
    </AppShell.Sidebar>
  );
}

export type DocsShellMainProps = Omit<
  ComponentPropsWithRef<typeof AppShell.Main>,
  'children'
> & { children?: ReactNode; contentClassName?: string; viewportLabel?: string };

export function DocsShellMain({
  children,
  className,
  contentClassName,
  viewportLabel = 'Page content',
  ...props
}: DocsShellMainProps) {
  const { isPending, mainViewportRef } = useDocsShellContext('Main');
  return (
    <AppShell.Main
      {...props}
      className={mergeClassNames('tr-docs-shell-main', className)}
    >
      <ScrollArea.Root className="tr-docs-shell-scroll-area" variant="plain">
        <ScrollArea.Viewport
          aria-label={viewportLabel}
          className="tr-docs-shell-scroll-viewport"
          ref={mainViewportRef}
          role="region"
        >
          <ScrollArea.Content
            aria-busy={isPending || undefined}
            className={mergeClassNames('tr-docs-shell-content', contentClassName)}
            style={{ minWidth: '100%' }}
          >
            {children}
          </ScrollArea.Content>
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar orientation="vertical">
          <ScrollArea.Thumb />
        </ScrollArea.Scrollbar>
      </ScrollArea.Root>
    </AppShell.Main>
  );
}

export type DocsShellOutlineProps = ComponentPropsWithRef<'aside'>;

export function DocsShellOutline({ className, ...props }: DocsShellOutlineProps) {
  return (
    <aside {...props} className={mergeClassNames('tr-docs-shell-outline', className)} />
  );
}
