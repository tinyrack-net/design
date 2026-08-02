import type { ComponentProps } from 'react';
import { mergeClassNames } from '../../internal/component-class-name.js';

export type TRWindowFrameBodyProps = ComponentProps<'div'> & {
  padding?: 'none' | 'sm' | 'md' | 'lg';
};

export function TRWindowFrameBody({
  className,
  padding = 'md',
  ...props
}: TRWindowFrameBodyProps) {
  return (
    <div
      {...props}
      className={mergeClassNames('tr-window-frame-body', className)}
      data-padding={padding}
    />
  );
}
