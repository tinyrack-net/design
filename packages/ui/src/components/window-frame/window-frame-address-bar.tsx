import type { ComponentProps } from 'react';
import { mergeClassNames } from '../../internal/component-class-name.js';

export type TRWindowFrameAddressBarProps = ComponentProps<'div'>;

export function TRWindowFrameAddressBar({
  className,
  ...props
}: TRWindowFrameAddressBarProps) {
  return (
    <div
      {...props}
      className={mergeClassNames('tr-window-frame-address-bar', className)}
    />
  );
}
