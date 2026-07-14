'use client';

import { PreviewCard as BasePreviewCard } from '@base-ui/react/preview-card';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type PreviewCardViewportProps = ComponentProps<typeof BasePreviewCard.Viewport>;
export const PreviewCardViewport = createComponentPart(
  BasePreviewCard.Viewport,
  'tr-preview-card-viewport',
);
