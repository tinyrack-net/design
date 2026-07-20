import { TRMeterIndicator } from './meter-indicator.js';
import { TRMeterLabel } from './meter-label.js';
import { TRMeterRoot } from './meter-root.js';
import { TRMeterTrack } from './meter-track.js';
import { TRMeterValue } from './meter-value.js';

export const TRMeter = {
  Root: TRMeterRoot,
  Track: TRMeterTrack,
  Indicator: TRMeterIndicator,
  Value: TRMeterValue,
  Label: TRMeterLabel,
} as const;

export type {
  MeterIndicatorState as TRMeterIndicatorState,
  MeterLabelState as TRMeterLabelState,
  MeterRootState as TRMeterRootState,
  MeterTrackState as TRMeterTrackState,
  MeterValueState as TRMeterValueState,
} from '@base-ui/react/meter';
export type { TRMeterIndicatorProps } from './meter-indicator.js';
export type { TRMeterLabelProps } from './meter-label.js';
export type { TRMeterRootProps, TRMeterVariant } from './meter-root.js';
export type { TRMeterTrackProps } from './meter-track.js';
export type { TRMeterValueProps } from './meter-value.js';
export { TRMeterIndicator, TRMeterLabel, TRMeterRoot, TRMeterTrack, TRMeterValue };
