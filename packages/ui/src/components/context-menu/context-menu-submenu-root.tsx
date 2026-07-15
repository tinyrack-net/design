'use client';

import { ContextMenu as BaseContextMenu } from '@base-ui/react/context-menu';
import type { ComponentProps } from 'react';
import { ContextMenuNestedContext } from './context-menu-point-context.js';

export type ContextMenuSubmenuRootProps = ComponentProps<
  typeof BaseContextMenu.SubmenuRoot
>;
export function ContextMenuSubmenuRoot(props: ContextMenuSubmenuRootProps) {
  return (
    <ContextMenuNestedContext value>
      <BaseContextMenu.SubmenuRoot {...props} />
    </ContextMenuNestedContext>
  );
}
