'use client';

import { Select as BaseSelect } from '@base-ui/react/select';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRSelectGroupLabelProps = ComponentProps<typeof BaseSelect.GroupLabel>;
export const TRSelectGroupLabel = createComponentPart(
  BaseSelect.GroupLabel,
  'tr-select-group-label',
);
