import { MeterIndicator } from './meter-indicator.js';
import { MeterLabel } from './meter-label.js';
import { MeterRoot } from './meter-root.js';
import { MeterTrack } from './meter-track.js';
import { MeterValue } from './meter-value.js';

export const Meter = {
  Root: MeterRoot,
  Track: MeterTrack,
  Indicator: MeterIndicator,
  Value: MeterValue,
  Label: MeterLabel,
} as const;

export type {
  MeterIndicatorState,
  MeterLabelState,
  MeterRootState,
  MeterTrackState,
  MeterValueState,
} from '@base-ui/react/meter';
export type { MeterIndicatorProps } from './meter-indicator.js';
export type { MeterLabelProps } from './meter-label.js';
export type { MeterRootProps } from './meter-root.js';
export type { MeterTrackProps } from './meter-track.js';
export type { MeterValueProps } from './meter-value.js';
export { MeterIndicator, MeterLabel, MeterRoot, MeterTrack, MeterValue };
