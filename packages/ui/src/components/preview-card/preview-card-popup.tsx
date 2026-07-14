'use client';

import { PreviewCard as BasePreviewCard } from '@base-ui/react/preview-card';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type PreviewCardPopupProps = ComponentProps<typeof BasePreviewCard.Popup>;
export const PreviewCardPopup = createComponentPart(
  BasePreviewCard.Popup,
  'tr-preview-card-popup',
);
