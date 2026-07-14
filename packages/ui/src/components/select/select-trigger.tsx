'use client';

import { Select as BaseSelect } from '@base-ui/react/select';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type SelectTriggerProps = ComponentProps<typeof BaseSelect.Trigger>;
export const SelectTrigger = createComponentPart(
  BaseSelect.Trigger,
  'tr-select-trigger',
);
