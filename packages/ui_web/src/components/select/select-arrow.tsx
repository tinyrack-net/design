'use client';

import { Select as BaseSelect } from '@base-ui/react/select';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRSelectArrowProps = ComponentProps<typeof BaseSelect.Arrow>;
export const TRSelectArrow = createComponentPart(
  BaseSelect.Arrow,
  'tr-layer-arrow tr-select-arrow',
);
