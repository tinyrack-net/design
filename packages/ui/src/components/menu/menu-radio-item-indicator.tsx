'use client';

import { Menu as BaseMenu } from '@base-ui/react/menu';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type MenuRadioItemIndicatorProps = ComponentProps<
  typeof BaseMenu.RadioItemIndicator
>;
export const MenuRadioItemIndicator = createComponentPart(
  BaseMenu.RadioItemIndicator,
  'tr-menu-item-indicator tr-menu-radio-item-indicator',
);
