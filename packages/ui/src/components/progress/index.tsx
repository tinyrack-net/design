import { ProgressIndicator } from './progress-indicator.js';
import { ProgressLabel } from './progress-label.js';
import { ProgressRoot } from './progress-root.js';
import { ProgressTrack } from './progress-track.js';
import { ProgressValue } from './progress-value.js';

export const Progress = {
  Root: ProgressRoot,
  Track: ProgressTrack,
  Indicator: ProgressIndicator,
  Label: ProgressLabel,
  Value: ProgressValue,
} as const;

export type {
  ProgressIndicatorState,
  ProgressLabelState,
  ProgressRootState,
  ProgressTrackState,
  ProgressValueState,
} from '@base-ui/react/progress';
export type { ProgressIndicatorProps } from './progress-indicator.js';
export type { ProgressLabelProps } from './progress-label.js';
export type {
  ProgressRootProps,
  ProgressSize,
  ProgressVariant,
} from './progress-root.js';
export type { ProgressTrackProps } from './progress-track.js';
export type { ProgressValueProps } from './progress-value.js';
export { ProgressIndicator, ProgressLabel, ProgressRoot, ProgressTrack, ProgressValue };
