'use client';

import { Select as BaseSelect } from '@base-ui/react/select';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRSelectScrollUpArrowProps = ComponentProps<
  typeof BaseSelect.ScrollUpArrow
>;
export const TRSelectScrollUpArrow = createComponentPart(
  BaseSelect.ScrollUpArrow,
  'tr-select-scroll-up-arrow',
);
