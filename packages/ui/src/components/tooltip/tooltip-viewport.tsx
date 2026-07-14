'use client';

import { Tooltip as BaseTooltip } from '@base-ui/react/tooltip';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TooltipViewportProps = ComponentProps<typeof BaseTooltip.Viewport>;
export const TooltipViewport = createComponentPart(
  BaseTooltip.Viewport,
  'tr-tooltip-viewport',
);
