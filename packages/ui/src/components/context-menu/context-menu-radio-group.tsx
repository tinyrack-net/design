'use client';

import { ContextMenu as BaseContextMenu } from '@base-ui/react/context-menu';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type ContextMenuRadioGroupProps = ComponentProps<
  typeof BaseContextMenu.RadioGroup
>;
export const ContextMenuRadioGroup = createComponentPart(
  BaseContextMenu.RadioGroup,
  'tr-context-menu-radio-group',
);
