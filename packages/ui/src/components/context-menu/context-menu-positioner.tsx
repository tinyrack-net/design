'use client';

import { ContextMenu as BaseContextMenu } from '@base-ui/react/context-menu';
import { type ComponentProps, type CSSProperties, useContext, useMemo } from 'react';
import { mergeComponentClassName } from '../../internal/component-class-name.js';
import {
  ContextMenuNestedContext,
  ContextMenuPointContext,
} from './context-menu-point-context.js';

export type TRContextMenuPositionerProps = ComponentProps<
  typeof BaseContextMenu.Positioner
>;
export function TRContextMenuPositioner({
  anchor,
  className,
  style,
  ...props
}: TRContextMenuPositionerProps) {
  const { point } = useContext(ContextMenuPointContext);
  const nested = useContext(ContextMenuNestedContext);
  const pointAnchor = useMemo(
    () =>
      point === null
        ? undefined
        : {
            getBoundingClientRect: () =>
              DOMRect.fromRect({ height: 0, width: 0, x: point.x, y: point.y }),
          },
    [point],
  );
  const coordinateStyle =
    point === null || nested
      ? undefined
      : ({
          '--tr-context-menu-x': `${point.x}px`,
          '--tr-context-menu-y': `${point.y}px`,
          inset: 'auto',
          insetBlockStart:
            'clamp(var(--tinyrack-space-sm), var(--tr-context-menu-y), calc(100dvh - var(--tinyrack-control-height-md)))',
          insetInlineStart:
            'clamp(var(--tinyrack-space-sm), var(--tr-context-menu-x), calc(100vw - var(--tinyrack-measure-sm)))',
          position: 'fixed',
          transform: 'none',
        } as CSSProperties);
  const mergedStyle: TRContextMenuPositionerProps['style'] =
    coordinateStyle === undefined
      ? style
      : typeof style === 'function'
        ? (state) => ({ ...style(state), ...coordinateStyle })
        : { ...style, ...coordinateStyle };
  return (
    <BaseContextMenu.Positioner
      {...props}
      anchor={anchor ?? (nested ? undefined : pointAnchor)}
      className={mergeComponentClassName(
        'tr-layer-positioner tr-context-menu-positioner',
        className,
      )}
      data-context-point={
        point === null || nested ? undefined : `${point.x},${point.y}`
      }
      style={mergedStyle}
    />
  );
}
