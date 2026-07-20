'use client';

import type { ComponentProps } from 'react';
import { mergeClassNames } from '../../internal/component-class-name.js';
import { TRDrawer } from '../drawer/index.js';
import { TRScrollArea } from '../scroll-area/index.js';
import { useAppShellContext } from './app-shell-context.js';

export type TRAppShellSidebarProps = ComponentProps<'aside'>;

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
  ...props
}: TRAppShellSidebarProps) {
  const {
    defaultOpen,
    drawerHandle,
    drawerPopupClassName,
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
    <TRDrawer.Root
      defaultOpen={defaultOpen}
      handle={drawerHandle}
      modal
      onOpenChange={onOpenChange}
      open={open}
      swipeDirection="left"
    >
      <TRDrawer.Portal container={portalContainer}>
        <TRDrawer.Backdrop className="tr-app-shell-backdrop" />
        <TRDrawer.Viewport className="tr-app-shell-drawer-viewport">
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
