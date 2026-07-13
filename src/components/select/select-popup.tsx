'use client';

import { Select as BaseSelect } from '@base-ui/react/select';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type SelectPopupProps = ComponentProps<typeof BaseSelect.Popup>;
export const SelectPopup = createComponentPart(
  BaseSelect.Popup,
  'tr-layer tr-select-popup',
);
