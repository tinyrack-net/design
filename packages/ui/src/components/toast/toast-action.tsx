'use client';

import { Toast as BaseToast } from '@base-ui/react/toast';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type ToastActionProps = ComponentProps<typeof BaseToast.Action>;
export const ToastAction = createComponentPart(BaseToast.Action, 'tr-toast-action');
