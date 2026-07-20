'use client';

import { Meter as BaseMeter } from '@base-ui/react/meter';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRMeterTrackProps = ComponentProps<typeof BaseMeter.Track>;
export const TRMeterTrack = createComponentPart(BaseMeter.Track, 'tr-meter-track');
