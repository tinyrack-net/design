'use client';

import { PreviewCard as BasePreviewCard } from '@base-ui/react/preview-card';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRPreviewCardRootProps = ComponentProps<typeof BasePreviewCard.Root>;
export const TRPreviewCardRoot = createComponentPart(
  BasePreviewCard.Root,
  'tr-preview-card',
);
