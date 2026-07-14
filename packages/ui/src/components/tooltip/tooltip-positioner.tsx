'use client';

import { Tooltip as BaseTooltip } from '@base-ui/react/tooltip';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TooltipPositionerProps = ComponentProps<typeof BaseTooltip.Positioner>;
export const TooltipPositioner = createComponentPart(
  BaseTooltip.Positioner,
  'tr-tooltip-positioner',
);
