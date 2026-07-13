'use client';

import { Menu as BaseMenu } from '@base-ui/react/menu';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type MenuCheckboxItemIndicatorProps = ComponentProps<
  typeof BaseMenu.CheckboxItemIndicator
>;
export const MenuCheckboxItemIndicator = createComponentPart(
  BaseMenu.CheckboxItemIndicator,
  'tr-menu-item-indicator tr-menu-checkbox-item-indicator',
);
