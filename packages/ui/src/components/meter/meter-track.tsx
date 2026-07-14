'use client';

import { Meter as BaseMeter } from '@base-ui/react/meter';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type MeterTrackProps = ComponentProps<typeof BaseMeter.Track>;
export const MeterTrack = createComponentPart(BaseMeter.Track, 'tr-meter-track');
