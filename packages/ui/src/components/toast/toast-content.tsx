'use client';

import { Toast as BaseToast } from '@base-ui/react/toast';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type ToastContentProps = ComponentProps<typeof BaseToast.Content>;
export const ToastContent = createComponentPart(BaseToast.Content, 'tr-toast-content');
