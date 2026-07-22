'use client';

import { NavigationMenu as BaseNavigationMenu } from '@base-ui/react/navigation-menu';
import { ChevronDown } from 'lucide-react';
import type { ComponentProps } from 'react';
import { mergeComponentClassName } from '../../internal/component-class-name.js';

export type TRNavigationMenuIconProps = ComponentProps<typeof BaseNavigationMenu.Icon>;
export function TRNavigationMenuIcon({
  children,
  className,
  ...props
}: TRNavigationMenuIconProps) {
  return (
    <BaseNavigationMenu.Icon
      {...props}
      className={mergeComponentClassName('tr-navigation-menu-icon', className)}
    >
      {children ?? <ChevronDown aria-hidden="true" />}
    </BaseNavigationMenu.Icon>
  );
}
