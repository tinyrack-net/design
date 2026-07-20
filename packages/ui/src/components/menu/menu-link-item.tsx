'use client';

import { Menu as BaseMenu } from '@base-ui/react/menu';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRMenuLinkItemProps = ComponentProps<typeof BaseMenu.LinkItem>;
export const TRMenuLinkItem = createComponentPart(
  BaseMenu.LinkItem,
  'tr-menu-item tr-menu-link-item',
);
