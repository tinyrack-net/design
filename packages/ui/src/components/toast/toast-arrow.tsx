'use client';

import { Toast as BaseToast } from '@base-ui/react/toast';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type ToastArrowProps = ComponentProps<typeof BaseToast.Arrow>;
export const ToastArrow = createComponentPart(BaseToast.Arrow, 'tr-toast-arrow');
