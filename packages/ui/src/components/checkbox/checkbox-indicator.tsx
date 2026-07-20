'use client';

import { Checkbox as BaseCheckbox } from '@base-ui/react/checkbox';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRCheckboxIndicatorProps = ComponentProps<typeof BaseCheckbox.Indicator>;
export const TRCheckboxIndicator = createComponentPart(
  BaseCheckbox.Indicator,
  'tr-checkbox-indicator',
);
