'use client';

import { Toast as BaseToast } from '@base-ui/react/toast';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type ToastProviderProps = ComponentProps<typeof BaseToast.Provider>;
export const ToastProvider = createComponentPart(BaseToast.Provider);
