'use client';

import { Meter as BaseMeter } from '@base-ui/react/meter';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRMeterLabelProps = ComponentProps<typeof BaseMeter.Label>;
export const TRMeterLabel = createComponentPart(BaseMeter.Label, 'tr-meter-label');
