'use client';

import { Select as BaseSelect } from '@base-ui/react/select';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRSelectPopupProps = ComponentProps<typeof BaseSelect.Popup>;
export const TRSelectPopup = createComponentPart(
  BaseSelect.Popup,
  'tr-layer tr-select-popup',
);
