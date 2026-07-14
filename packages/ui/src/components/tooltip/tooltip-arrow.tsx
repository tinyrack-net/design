'use client';

import { Tooltip as BaseTooltip } from '@base-ui/react/tooltip';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TooltipArrowProps = ComponentProps<typeof BaseTooltip.Arrow>;
export const TooltipArrow = createComponentPart(BaseTooltip.Arrow, 'tr-tooltip-arrow');
