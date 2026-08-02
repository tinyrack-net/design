'use client';

import { NavigationMenu as BaseNavigationMenu } from '@base-ui/react/navigation-menu';
import type { ComponentProps } from 'react';
import { mergeComponentClassName } from '../../internal/component-class-name.js';

export type TRNavigationMenuRootProps = ComponentProps<typeof BaseNavigationMenu.Root>;
export function TRNavigationMenuRoot({
  className,
  orientation = 'horizontal',
  ...props
}: TRNavigationMenuRootProps) {
  return (
    <BaseNavigationMenu.Root
      {...props}
      className={mergeComponentClassName('tr-navigation-menu', className)}
      data-orientation={orientation}
      orientation={orientation}
    />
  );
}
