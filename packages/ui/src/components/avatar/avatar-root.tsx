'use client';

import { Avatar as BaseAvatar } from '@base-ui/react/avatar';
import type { ComponentProps } from 'react';
import { mergeComponentClassName } from '../../internal/component-class-name.js';

export type TRAvatarShape = 'circle' | 'square';
export type TRAvatarUiSize = 'sm' | 'md' | 'lg';
export type TRAvatarRootProps = ComponentProps<typeof BaseAvatar.Root> & {
  shape?: TRAvatarShape;
  uiSize?: TRAvatarUiSize;
};

export function TRAvatarRoot({
  className,
  shape = 'circle',
  uiSize = 'md',
  ...props
}: TRAvatarRootProps) {
  return (
    <BaseAvatar.Root
      {...props}
      className={mergeComponentClassName('tr-avatar', className)}
      data-shape={shape}
      data-ui-size={uiSize}
    />
  );
}
