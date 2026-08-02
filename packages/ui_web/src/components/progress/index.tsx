import { TRProgressIndicator } from './progress-indicator.js';
import { TRProgressLabel } from './progress-label.js';
import { TRProgressRoot } from './progress-root.js';
import { TRProgressTrack } from './progress-track.js';
import { TRProgressValue } from './progress-value.js';

export const TRProgress = {
  Root: TRProgressRoot,
  Track: TRProgressTrack,
  Indicator: TRProgressIndicator,
  Label: TRProgressLabel,
  Value: TRProgressValue,
} as const;

export type {
  ProgressIndicatorState as TRProgressIndicatorState,
  ProgressLabelState as TRProgressLabelState,
  ProgressRootState as TRProgressRootState,
  ProgressStatus as TRProgressStatus,
  ProgressTrackState as TRProgressTrackState,
  ProgressValueState as TRProgressValueState,
} from '@base-ui/react/progress';
export type { TRProgressIndicatorProps } from './progress-indicator.js';
export type { TRProgressLabelProps } from './progress-label.js';
export type {
  TRProgressRootProps,
  TRProgressUiSize,
  TRProgressVariant,
} from './progress-root.js';
export type { TRProgressTrackProps } from './progress-track.js';
export type { TRProgressValueProps } from './progress-value.js';
export {
  TRProgressIndicator,
  TRProgressLabel,
  TRProgressRoot,
  TRProgressTrack,
  TRProgressValue,
};
