'use client';

import { Progress as BaseProgress } from '@base-ui/react/progress';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type ProgressIndicatorProps = ComponentProps<typeof BaseProgress.Indicator>;
export const ProgressIndicator = createComponentPart(
  BaseProgress.Indicator,
  'tr-progress-indicator',
);
