'use client';

import { Toast as BaseToast } from '@base-ui/react/toast';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRToastProviderProps = ComponentProps<typeof BaseToast.Provider>;
export const TRToastProvider = createComponentPart(BaseToast.Provider);
