'use client';

import { ContextMenu as BaseContextMenu } from '@base-ui/react/context-menu';
import type { ComponentProps } from 'react';
import { useMemo, useState } from 'react';
import {
  ContextMenuNestedContext,
  type ContextMenuPoint,
  ContextMenuPointContext,
} from './context-menu-point-context.js';

export type ContextMenuRootProps = ComponentProps<typeof BaseContextMenu.Root>;
export function ContextMenuRoot(props: ContextMenuRootProps) {
  const [point, setPoint] = useState<ContextMenuPoint>(null);
  const pointContext = useMemo(() => ({ point, setPoint }), [point]);
  return (
    <ContextMenuPointContext value={pointContext}>
      <ContextMenuNestedContext value={false}>
        <BaseContextMenu.Root {...props} />
      </ContextMenuNestedContext>
    </ContextMenuPointContext>
  );
}
