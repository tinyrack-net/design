import { SliderControl } from './slider-control.js';
import { SliderIndicator } from './slider-indicator.js';
import { SliderLabel } from './slider-label.js';
import { SliderRoot } from './slider-root.js';
import { SliderThumb } from './slider-thumb.js';
import { SliderTrack } from './slider-track.js';
import { SliderValue } from './slider-value.js';

export const Slider = {
  Root: SliderRoot,
  Label: SliderLabel,
  Value: SliderValue,
  Control: SliderControl,
  Track: SliderTrack,
  Thumb: SliderThumb,
  Indicator: SliderIndicator,
} as const;

export type {
  SliderControlState,
  SliderIndicatorState,
  SliderLabelState,
  SliderRootState,
  SliderThumbState,
  SliderTrackState,
  SliderValueState,
} from '@base-ui/react/slider';
export type { SliderControlProps } from './slider-control.js';
export type { SliderIndicatorProps } from './slider-indicator.js';
export type { SliderLabelProps } from './slider-label.js';
export type { SliderRootProps } from './slider-root.js';
export type { SliderThumbProps } from './slider-thumb.js';
export type { SliderTrackProps } from './slider-track.js';
export type { SliderValueProps } from './slider-value.js';
export {
  SliderControl,
  SliderIndicator,
  SliderLabel,
  SliderRoot,
  SliderThumb,
  SliderTrack,
  SliderValue,
};
