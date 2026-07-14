'use client';

import { Select as BaseSelect } from '@base-ui/react/select';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type SelectBackdropProps = ComponentProps<typeof BaseSelect.Backdrop>;
export const SelectBackdrop = createComponentPart(
  BaseSelect.Backdrop,
  'tr-select-backdrop',
);
