'use client';

import { Toast as BaseToast } from '@base-ui/react/toast';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRToastDescriptionProps = ComponentProps<typeof BaseToast.Description>;
export const TRToastDescription = createComponentPart(
  BaseToast.Description,
  'tr-toast-description',
);
