'use client';

import { Progress as BaseProgress } from '@base-ui/react/progress';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRProgressValueProps = ComponentProps<typeof BaseProgress.Value>;
export const TRProgressValue = createComponentPart(
  BaseProgress.Value,
  'tr-progress-value',
);
