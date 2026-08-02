'use client';

import { Menu as BaseMenu } from '@base-ui/react/menu';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRMenuRadioItemIndicatorProps = ComponentProps<
  typeof BaseMenu.RadioItemIndicator
>;
export const TRMenuRadioItemIndicator = createComponentPart(
  BaseMenu.RadioItemIndicator,
  'tr-menu-item-indicator tr-menu-radio-item-indicator',
);
