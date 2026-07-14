'use client';

import { Menu as BaseMenu } from '@base-ui/react/menu';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type MenuLinkItemProps = ComponentProps<typeof BaseMenu.LinkItem>;
export const MenuLinkItem = createComponentPart(
  BaseMenu.LinkItem,
  'tr-menu-item tr-menu-link-item',
);
