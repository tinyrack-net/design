'use client';

import { PreviewCard as BasePreviewCard } from '@base-ui/react/preview-card';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRPreviewCardArrowProps = ComponentProps<typeof BasePreviewCard.Arrow>;
export const TRPreviewCardArrow = createComponentPart(
  BasePreviewCard.Arrow,
  'tr-layer-arrow tr-preview-card-arrow',
);
