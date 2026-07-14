'use client';

import { Toast as BaseToast } from '@base-ui/react/toast';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type ToastDescriptionProps = ComponentProps<typeof BaseToast.Description>;
export const ToastDescription = createComponentPart(
  BaseToast.Description,
  'tr-toast-description',
);
