'use client';

import { PreviewCard as BasePreviewCard } from '@base-ui/react/preview-card';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type PreviewCardPositionerProps = ComponentProps<
  typeof BasePreviewCard.Positioner
>;
export const PreviewCardPositioner = createComponentPart(
  BasePreviewCard.Positioner,
  'tr-preview-card-positioner',
);
