'use client';

import { Select as BaseSelect } from '@base-ui/react/select';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRSelectBackdropProps = ComponentProps<typeof BaseSelect.Backdrop>;
export const TRSelectBackdrop = createComponentPart(
  BaseSelect.Backdrop,
  'tr-layer-backdrop tr-select-backdrop',
);
