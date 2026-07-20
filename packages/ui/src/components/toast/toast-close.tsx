'use client';

import { Toast as BaseToast } from '@base-ui/react/toast';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRToastCloseProps = ComponentProps<typeof BaseToast.Close>;
export const TRToastClose = createComponentPart(BaseToast.Close, 'tr-toast-close');
