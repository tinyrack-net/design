'use client';

import { PreviewCard as BasePreviewCard } from '@base-ui/react/preview-card';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRPreviewCardPositionerProps = ComponentProps<
  typeof BasePreviewCard.Positioner
>;
export const TRPreviewCardPositioner = createComponentPart(
  BasePreviewCard.Positioner,
  'tr-layer-positioner tr-preview-card-positioner',
);
