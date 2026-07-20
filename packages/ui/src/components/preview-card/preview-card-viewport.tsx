'use client';

import { PreviewCard as BasePreviewCard } from '@base-ui/react/preview-card';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRPreviewCardViewportProps = ComponentProps<
  typeof BasePreviewCard.Viewport
>;
export const TRPreviewCardViewport = createComponentPart(
  BasePreviewCard.Viewport,
  'tr-layer-viewport tr-preview-card-viewport',
);
