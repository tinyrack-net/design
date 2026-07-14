'use client';

import { Toast as BaseToast } from '@base-ui/react/toast';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type ToastPositionerProps = ComponentProps<typeof BaseToast.Positioner>;
export const ToastPositioner = createComponentPart(
  BaseToast.Positioner,
  'tr-toast-positioner',
);
