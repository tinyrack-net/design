'use client';

import type { ComponentProps } from 'react';
import { mergeClassNames } from '../../internal/component-class-name.js';
import { TRDrawer } from '../drawer/index.js';
import { TRScrollArea } from '../scroll-area/index.js';
import { useAppShellContext } from './app-shell-context.js';

export type TRAppShellSidebarProps = ComponentProps<'aside'> & {
  /**
   * Animates the sidebar away and takes it out of interaction. The drawer
   * surface keeps its own presentation and ignores this.
   */
  collapsed?: boolean;
};

function SidebarScroll({ children }: Pick<TRAppShellSidebarProps, 'children'>) {
  return (
    <TRScrollArea.Root className="tr-app-shell-scroll-area" variant="plain">
      <TRScrollArea.Viewport className="tr-app-shell-scroll-viewport">
        <TRScrollArea.Content>{children}</TRScrollArea.Content>
      </TRScrollArea.Viewport>
      <TRScrollArea.Scrollbar orientation="vertical">
        <TRScrollArea.Thumb />
      </TRScrollArea.Scrollbar>
    </TRScrollArea.Root>
  );
}

export function TRAppShellSidebar({
  children,
  className,
  collapsed = false,
  ...props
}: TRAppShellSidebarProps) {
  const {
    defaultOpen,
    drawerHandle,
    drawerPopupClassName,
    drawerActive,
    mobileDrawerSide,
    mobile,
    onOpenChange,
    open,
    portalContainer,
    sidebarMode,
    triggerRef,
  } = useAppShellContext('Sidebar');
  const popupNameProps = {
    ...(props['aria-label'] ? { 'aria-label': props['aria-label'] } : {}),
    ...(props['aria-labelledby']
      ? { 'aria-labelledby': props['aria-labelledby'] }
      : {}),
  };
  const aside = (
    <aside
      {...props}
      className={mergeClassNames('tr-app-shell-sidebar', className)}
      data-collapsed={collapsed ? 'true' : 'false'}
      data-sidebar-mode={drawerActive ? 'expanded' : sidebarMode}
      // Interaction ends when the collapse starts, not when it finishes, so a
      // focused control cannot keep receiving keys on the way out.
      inert={collapsed && !drawerActive}
    >
      <SidebarScroll>{children}</SidebarScroll>
    </aside>
  );

  if (!mobile || !drawerActive) return aside;

  return (
    <TRDrawer.Root
      defaultOpen={defaultOpen}
      handle={drawerHandle}
      modal
      onOpenChange={onOpenChange}
      open={open}
      swipeDirection={mobileDrawerSide}
    >
      <TRDrawer.Portal container={portalContainer}>
        <TRDrawer.Backdrop className="tr-app-shell-backdrop" />
        <TRDrawer.Viewport
          className={mergeClassNames(
            'tr-app-shell-drawer-viewport',
            mobileDrawerSide === 'right'
              ? 'tr-app-shell-drawer-viewport-right'
              : undefined,
          )}
        >
          <TRDrawer.Popup
            {...popupNameProps}
            className={mergeClassNames(
              'tr-app-shell-drawer-popup',
              drawerPopupClassName,
            )}
            finalFocus={() => triggerRef.current}
          >
            <TRDrawer.Content className="tr-app-shell-drawer-content">
              {aside}
            </TRDrawer.Content>
          </TRDrawer.Popup>
        </TRDrawer.Viewport>
      </TRDrawer.Portal>
    </TRDrawer.Root>
  );
}
