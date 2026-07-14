'use client';

import { Progress as BaseProgress } from '@base-ui/react/progress';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type ProgressValueProps = ComponentProps<typeof BaseProgress.Value>;
export const ProgressValue = createComponentPart(
  BaseProgress.Value,
  'tr-progress-value',
);
