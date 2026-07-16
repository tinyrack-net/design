'use client';

import type { ComponentProps } from 'react';
import { mergeClassNames } from '../../internal/component-class-name.js';
import { Drawer } from '../drawer/index.js';
import { ScrollArea } from '../scroll-area/index.js';
import { useAppShellContext } from './app-shell-context.js';

export type AppShellSidebarProps = ComponentProps<'aside'>;

function SidebarScroll({ children }: Pick<AppShellSidebarProps, 'children'>) {
  return (
    <ScrollArea.Root className="tr-app-shell-scroll-area" variant="plain">
      <ScrollArea.Viewport className="tr-app-shell-scroll-viewport">
        <ScrollArea.Content>{children}</ScrollArea.Content>
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar orientation="vertical">
        <ScrollArea.Thumb />
      </ScrollArea.Scrollbar>
    </ScrollArea.Root>
  );
}

export function AppShellSidebar({
  children,
  className,
  ...props
}: AppShellSidebarProps) {
  const {
    defaultOpen,
    drawerHandle,
    mobile,
    onOpenChange,
    open,
    portalContainer,
    triggerRef,
  } = useAppShellContext('Sidebar');
  const popupNameProps = {
    ...(props['aria-label'] ? { 'aria-label': props['aria-label'] } : {}),
    ...(props['aria-labelledby']
      ? { 'aria-labelledby': props['aria-labelledby'] }
      : {}),
  };
  const aside = (
    <aside {...props} className={mergeClassNames('tr-app-shell-sidebar', className)}>
      <SidebarScroll>{children}</SidebarScroll>
    </aside>
  );

  if (!mobile) return aside;

  return (
    <Drawer.Root
      defaultOpen={defaultOpen}
      handle={drawerHandle}
      modal
      onOpenChange={onOpenChange}
      open={open}
      swipeDirection="left"
    >
      <Drawer.Portal container={portalContainer}>
        <Drawer.Backdrop className="tr-app-shell-backdrop" />
        <Drawer.Viewport className="tr-app-shell-drawer-viewport">
          <Drawer.Popup
            {...popupNameProps}
            className="tr-app-shell-drawer-popup"
            finalFocus={() => triggerRef.current}
          >
            <Drawer.Content className="tr-app-shell-drawer-content">
              {aside}
            </Drawer.Content>
          </Drawer.Popup>
        </Drawer.Viewport>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
