'use client';

import { Toast as BaseToast } from '@base-ui/react/toast';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type ToastTitleProps = ComponentProps<typeof BaseToast.Title>;
export const ToastTitle = createComponentPart(BaseToast.Title, 'tr-toast-title');
