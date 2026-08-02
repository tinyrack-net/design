'use client';

import { ContextMenu as BaseContextMenu } from '@base-ui/react/context-menu';
import type { ComponentProps } from 'react';
import { ContextMenuNestedContext } from './context-menu-point-context.js';

export type TRContextMenuSubmenuRootProps = ComponentProps<
  typeof BaseContextMenu.SubmenuRoot
>;
export function TRContextMenuSubmenuRoot(props: TRContextMenuSubmenuRootProps) {
  return (
    <ContextMenuNestedContext value>
      <BaseContextMenu.SubmenuRoot {...props} />
    </ContextMenuNestedContext>
  );
}
