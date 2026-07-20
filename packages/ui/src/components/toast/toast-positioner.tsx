'use client';

import { Toast as BaseToast } from '@base-ui/react/toast';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRToastPositionerProps = ComponentProps<typeof BaseToast.Positioner>;
export const TRToastPositioner = createComponentPart(
  BaseToast.Positioner,
  'tr-layer-positioner tr-toast-positioner',
);
