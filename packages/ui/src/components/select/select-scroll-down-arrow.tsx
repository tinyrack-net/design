'use client';

import { Select as BaseSelect } from '@base-ui/react/select';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type SelectScrollDownArrowProps = ComponentProps<
  typeof BaseSelect.ScrollDownArrow
>;
export const SelectScrollDownArrow = createComponentPart(
  BaseSelect.ScrollDownArrow,
  'tr-select-scroll-down-arrow',
);
