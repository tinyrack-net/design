'use client';

import { PreviewCard as BasePreviewCard } from '@base-ui/react/preview-card';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type PreviewCardArrowProps = ComponentProps<typeof BasePreviewCard.Arrow>;
export const PreviewCardArrow = createComponentPart(
  BasePreviewCard.Arrow,
  'tr-preview-card-arrow',
);
