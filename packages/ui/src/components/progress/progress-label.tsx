'use client';

import { Progress as BaseProgress } from '@base-ui/react/progress';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRProgressLabelProps = ComponentProps<typeof BaseProgress.Label>;
export const TRProgressLabel = createComponentPart(
  BaseProgress.Label,
  'tr-progress-label',
);
