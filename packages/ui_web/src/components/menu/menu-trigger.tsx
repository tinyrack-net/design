'use client';

import { Menu as BaseMenu } from '@base-ui/react/menu';
import { createComponentPart } from '../../internal/component-part.js';

export type TRMenuTriggerProps<Payload = unknown> = BaseMenu.Trigger.Props<Payload>;
export const TRMenuTrigger = createComponentPart(
  BaseMenu.Trigger,
  'tr-menu-trigger',
) as typeof BaseMenu.Trigger;
