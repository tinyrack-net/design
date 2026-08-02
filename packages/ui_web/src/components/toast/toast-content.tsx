'use client';

import { Toast as BaseToast } from '@base-ui/react/toast';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRToastContentProps = ComponentProps<typeof BaseToast.Content>;
export const TRToastContent = createComponentPart(
  BaseToast.Content,
  'tr-toast-content',
);
