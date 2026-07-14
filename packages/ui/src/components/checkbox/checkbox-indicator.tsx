'use client';

import { Checkbox as BaseCheckbox } from '@base-ui/react/checkbox';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type CheckboxIndicatorProps = ComponentProps<typeof BaseCheckbox.Indicator>;
export const CheckboxIndicator = createComponentPart(
  BaseCheckbox.Indicator,
  'tr-checkbox-indicator',
);
