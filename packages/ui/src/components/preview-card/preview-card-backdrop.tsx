'use client';

import { PreviewCard as BasePreviewCard } from '@base-ui/react/preview-card';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRPreviewCardBackdropProps = ComponentProps<
  typeof BasePreviewCard.Backdrop
>;
export const TRPreviewCardBackdrop = createComponentPart(
  BasePreviewCard.Backdrop,
  'tr-layer-backdrop tr-preview-card-backdrop',
);
