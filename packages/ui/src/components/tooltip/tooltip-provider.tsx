'use client';

import { Tooltip as BaseTooltip } from '@base-ui/react/tooltip';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TooltipProviderProps = ComponentProps<typeof BaseTooltip.Provider>;
export const TooltipProvider = createComponentPart(BaseTooltip.Provider);
