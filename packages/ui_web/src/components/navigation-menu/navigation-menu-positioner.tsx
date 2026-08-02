'use client';

import { NavigationMenu as BaseNavigationMenu } from '@base-ui/react/navigation-menu';
import type { ComponentProps } from 'react';
import { mergeComponentClassName } from '../../internal/component-class-name.js';

export type TRNavigationMenuPositionerProps = ComponentProps<
  typeof BaseNavigationMenu.Positioner
>;
export function TRNavigationMenuPositioner({
  className,
  collisionAvoidance = { align: 'shift', side: 'flip' },
  sideOffset = 8,
  ...props
}: TRNavigationMenuPositionerProps) {
  return (
    <BaseNavigationMenu.Positioner
      {...props}
      className={mergeComponentClassName(
        'tr-layer-positioner tr-navigation-menu-positioner',
        className,
      )}
      collisionAvoidance={collisionAvoidance}
      sideOffset={sideOffset}
    />
  );
}
