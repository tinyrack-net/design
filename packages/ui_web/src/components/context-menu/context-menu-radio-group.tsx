'use client';

import { ContextMenu as BaseContextMenu } from '@base-ui/react/context-menu';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRContextMenuRadioGroupProps = ComponentProps<
  typeof BaseContextMenu.RadioGroup
>;
export const TRContextMenuRadioGroup = createComponentPart(
  BaseContextMenu.RadioGroup,
  'tr-context-menu-radio-group',
);
