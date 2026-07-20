'use client';

import { Tooltip as BaseTooltip } from '@base-ui/react/tooltip';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRTooltipPortalProps = ComponentProps<typeof BaseTooltip.Portal>;
export const TRTooltipPortal = createComponentPart(BaseTooltip.Portal);
