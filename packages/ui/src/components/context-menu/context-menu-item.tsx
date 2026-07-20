'use client';

import { ContextMenu as BaseContextMenu } from '@base-ui/react/context-menu';
import type { ComponentProps } from 'react';
import { mergeComponentClassName } from '../../internal/component-class-name.js';

export type TRContextMenuItemVariant = 'default' | 'danger';
export type TRContextMenuItemProps = ComponentProps<typeof BaseContextMenu.Item> & {
  variant?: TRContextMenuItemVariant;
};

export function TRContextMenuItem({
  className,
  variant = 'default',
  ...props
}: TRContextMenuItemProps) {
  return (
    <BaseContextMenu.Item
      {...props}
      className={mergeComponentClassName('tr-context-menu-item', className)}
      data-variant={variant}
    />
  );
}
