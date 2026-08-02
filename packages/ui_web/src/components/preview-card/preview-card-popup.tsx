'use client';

import { PreviewCard as BasePreviewCard } from '@base-ui/react/preview-card';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRPreviewCardPopupProps = ComponentProps<typeof BasePreviewCard.Popup>;
export const TRPreviewCardPopup = createComponentPart(
  BasePreviewCard.Popup,
  'tr-layer tr-preview-card-popup',
);
