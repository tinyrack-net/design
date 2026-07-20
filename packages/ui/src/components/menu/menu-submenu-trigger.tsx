'use client';

import { Menu as BaseMenu } from '@base-ui/react/menu';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRMenuSubmenuTriggerProps = ComponentProps<typeof BaseMenu.SubmenuTrigger>;
export const TRMenuSubmenuTrigger = createComponentPart(
  BaseMenu.SubmenuTrigger,
  'tr-menu-item tr-menu-submenu-trigger',
);
