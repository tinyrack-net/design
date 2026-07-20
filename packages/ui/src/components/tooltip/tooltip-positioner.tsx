'use client';

import { Tooltip as BaseTooltip } from '@base-ui/react/tooltip';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRTooltipPositionerProps = ComponentProps<typeof BaseTooltip.Positioner>;
export const TRTooltipPositioner = createComponentPart(
  BaseTooltip.Positioner,
  'tr-layer-positioner tr-tooltip-positioner',
);
