'use client';

import { Tooltip as BaseTooltip } from '@base-ui/react/tooltip';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRTooltipProviderProps = ComponentProps<typeof BaseTooltip.Provider>;
export const TRTooltipProvider = createComponentPart(BaseTooltip.Provider);
