'use client';

import { Tooltip as BaseTooltip } from '@base-ui/react/tooltip';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRTooltipViewportProps = ComponentProps<typeof BaseTooltip.Viewport>;
export const TRTooltipViewport = createComponentPart(
  BaseTooltip.Viewport,
  'tr-layer-viewport tr-tooltip-viewport',
);
