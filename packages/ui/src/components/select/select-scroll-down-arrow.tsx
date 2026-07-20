'use client';

import { Select as BaseSelect } from '@base-ui/react/select';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRSelectScrollDownArrowProps = ComponentProps<
  typeof BaseSelect.ScrollDownArrow
>;
export const TRSelectScrollDownArrow = createComponentPart(
  BaseSelect.ScrollDownArrow,
  'tr-select-scroll-down-arrow',
);
