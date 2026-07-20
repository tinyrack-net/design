'use client';

import { Menu as BaseMenu } from '@base-ui/react/menu';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRMenuTriggerProps = ComponentProps<typeof BaseMenu.Trigger>;
export const TRMenuTrigger = createComponentPart(BaseMenu.Trigger, 'tr-menu-trigger');
