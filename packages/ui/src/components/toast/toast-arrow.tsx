'use client';

import { Toast as BaseToast } from '@base-ui/react/toast';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRToastArrowProps = ComponentProps<typeof BaseToast.Arrow>;
export const TRToastArrow = createComponentPart(
  BaseToast.Arrow,
  'tr-layer-arrow tr-toast-arrow',
);
