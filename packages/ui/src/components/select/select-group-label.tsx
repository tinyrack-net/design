'use client';

import { Select as BaseSelect } from '@base-ui/react/select';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type SelectGroupLabelProps = ComponentProps<typeof BaseSelect.GroupLabel>;
export const SelectGroupLabel = createComponentPart(
  BaseSelect.GroupLabel,
  'tr-select-group-label',
);
