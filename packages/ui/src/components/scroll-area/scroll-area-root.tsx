'use client';

import { ScrollArea as BaseScrollArea } from '@base-ui/react/scroll-area';
import type { ComponentProps } from 'react';
import { mergeComponentClassName } from '../../internal/component-class-name.js';

export type ScrollAreaVariant = 'surface' | 'plain';
export type ScrollAreaRootProps = ComponentProps<typeof BaseScrollArea.Root> & {
  autoHide?: boolean;
  variant?: ScrollAreaVariant;
};

export function ScrollAreaRoot({
  autoHide = false,
  className,
  variant = 'surface',
  ...props
}: ScrollAreaRootProps) {
  return (
    <BaseScrollArea.Root
      {...props}
      className={mergeComponentClassName('tr-scroll-area', className)}
      data-auto-hide={autoHide || undefined}
      data-variant={variant}
    />
  );
}
