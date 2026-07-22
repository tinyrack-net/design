'use client';

import { Select as BaseSelect } from '@base-ui/react/select';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRSelectSeparatorProps = ComponentProps<typeof BaseSelect.Separator>;
export const TRSelectSeparator = createComponentPart(
  BaseSelect.Separator,
  'tr-separator tr-select-separator',
);
