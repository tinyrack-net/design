'use client';

import { Avatar as BaseAvatar } from '@base-ui/react/avatar';
import type { ComponentProps } from 'react';
import { mergeComponentClassName } from '../../internal/component-class-name.js';

export type AvatarShape = 'circle' | 'square';
export type AvatarSize = 'sm' | 'md' | 'lg';
export type AvatarRootProps = ComponentProps<typeof BaseAvatar.Root> & {
  shape?: AvatarShape;
  size?: AvatarSize;
};

export function AvatarRoot({
  className,
  shape = 'circle',
  size = 'md',
  ...props
}: AvatarRootProps) {
  return (
    <BaseAvatar.Root
      {...props}
      className={mergeComponentClassName('tr-avatar', className)}
      data-shape={shape}
      data-size={size}
    />
  );
}
