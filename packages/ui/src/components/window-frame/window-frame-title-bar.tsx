import type { ComponentProps } from 'react';
import { mergeClassNames } from '../../internal/component-class-name.js';

export type TRWindowFrameTitleBarProps = ComponentProps<'div'>;

export function TRWindowFrameTitleBar({
  className,
  ...props
}: TRWindowFrameTitleBarProps) {
  return (
    <div
      {...props}
      className={mergeClassNames('tr-window-frame-title-bar', className)}
    />
  );
}
