'use client';

import { Progress as BaseProgress } from '@base-ui/react/progress';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type ProgressTrackProps = ComponentProps<typeof BaseProgress.Track>;
export const ProgressTrack = createComponentPart(
  BaseProgress.Track,
  'tr-progress-track',
);
