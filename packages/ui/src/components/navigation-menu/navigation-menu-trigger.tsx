'use client';

import { NavigationMenu as BaseNavigationMenu } from '@base-ui/react/navigation-menu';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRNavigationMenuTriggerProps = ComponentProps<
  typeof BaseNavigationMenu.Trigger
>;
export const TRNavigationMenuTrigger = createComponentPart(
  BaseNavigationMenu.Trigger,
  'tr-navigation-menu-trigger',
);
