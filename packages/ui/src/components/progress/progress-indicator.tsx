'use client';

import { Progress as BaseProgress } from '@base-ui/react/progress';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRProgressIndicatorProps = ComponentProps<typeof BaseProgress.Indicator>;
export const TRProgressIndicator = createComponentPart(
  BaseProgress.Indicator,
  'tr-progress-indicator',
);
