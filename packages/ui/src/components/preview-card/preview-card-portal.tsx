'use client';

import { PreviewCard as BasePreviewCard } from '@base-ui/react/preview-card';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRPreviewCardPortalProps = ComponentProps<typeof BasePreviewCard.Portal>;
export const TRPreviewCardPortal = createComponentPart(
  BasePreviewCard.Portal,
  'tr-preview-card-portal',
);
