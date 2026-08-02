'use client';

import { ScrollArea as BaseScrollArea } from '@base-ui/react/scroll-area';
import type { ComponentProps } from 'react';
import { mergeComponentClassName } from '../../internal/component-class-name.js';

export type TRScrollAreaVariant = 'surface' | 'plain';
export type TRScrollAreaRootProps = ComponentProps<typeof BaseScrollArea.Root> & {
  autoHide?: boolean;
  variant?: TRScrollAreaVariant;
};

export function TRScrollAreaRoot({
  autoHide = false,
  className,
  variant = 'surface',
  ...props
}: TRScrollAreaRootProps) {
  return (
    <BaseScrollArea.Root
      {...props}
      className={mergeComponentClassName('tr-scroll-area', className)}
      data-auto-hide={autoHide || undefined}
      data-variant={variant}
    />
  );
}
