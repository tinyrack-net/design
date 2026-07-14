'use client';

import { PreviewCard as BasePreviewCard } from '@base-ui/react/preview-card';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type PreviewCardTriggerProps = ComponentProps<typeof BasePreviewCard.Trigger>;
export const PreviewCardTrigger = createComponentPart(
  BasePreviewCard.Trigger,
  'tr-preview-card-trigger',
);
