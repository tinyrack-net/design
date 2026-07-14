'use client';

import { Progress as BaseProgress } from '@base-ui/react/progress';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type ProgressLabelProps = ComponentProps<typeof BaseProgress.Label>;
export const ProgressLabel = createComponentPart(
  BaseProgress.Label,
  'tr-progress-label',
);
