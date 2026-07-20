'use client';

import { Tooltip as BaseTooltip } from '@base-ui/react/tooltip';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRTooltipArrowProps = ComponentProps<typeof BaseTooltip.Arrow>;
export const TRTooltipArrow = createComponentPart(
  BaseTooltip.Arrow,
  'tr-layer-arrow tr-tooltip-arrow',
);
