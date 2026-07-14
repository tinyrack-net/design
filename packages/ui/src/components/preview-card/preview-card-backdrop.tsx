'use client';

import { PreviewCard as BasePreviewCard } from '@base-ui/react/preview-card';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type PreviewCardBackdropProps = ComponentProps<typeof BasePreviewCard.Backdrop>;
export const PreviewCardBackdrop = createComponentPart(
  BasePreviewCard.Backdrop,
  'tr-preview-card-backdrop',
);
