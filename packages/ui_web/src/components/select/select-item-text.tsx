'use client';

import { Select as BaseSelect } from '@base-ui/react/select';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRSelectItemTextProps = ComponentProps<typeof BaseSelect.ItemText>;
export const TRSelectItemText = createComponentPart(
  BaseSelect.ItemText,
  'tr-select-item-text',
);
