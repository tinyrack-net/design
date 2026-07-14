'use client';

import { Menu as BaseMenu } from '@base-ui/react/menu';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type MenuRadioGroupProps = ComponentProps<typeof BaseMenu.RadioGroup>;
export const MenuRadioGroup = createComponentPart(
  BaseMenu.RadioGroup,
  'tr-menu-radio-group',
);
