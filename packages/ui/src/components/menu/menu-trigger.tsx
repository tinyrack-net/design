'use client';

import { Menu as BaseMenu } from '@base-ui/react/menu';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type MenuTriggerProps = ComponentProps<typeof BaseMenu.Trigger>;
export const MenuTrigger = createComponentPart(BaseMenu.Trigger, 'tr-menu-trigger');
