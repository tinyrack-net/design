import { TRSliderControl } from './slider-control.js';
import { TRSliderIndicator } from './slider-indicator.js';
import { TRSliderLabel } from './slider-label.js';
import { TRSliderRoot } from './slider-root.js';
import { TRSliderThumb } from './slider-thumb.js';
import { TRSliderTrack } from './slider-track.js';
import { TRSliderValue } from './slider-value.js';

export const TRSlider = {
  Root: TRSliderRoot,
  Label: TRSliderLabel,
  Value: TRSliderValue,
  Control: TRSliderControl,
  Track: TRSliderTrack,
  Thumb: TRSliderThumb,
  Indicator: TRSliderIndicator,
} as const;

export type {
  SliderControlState as TRSliderControlState,
  SliderIndicatorState as TRSliderIndicatorState,
  SliderLabelState as TRSliderLabelState,
  SliderRootState as TRSliderRootState,
  SliderThumbState as TRSliderThumbState,
  SliderTrackState as TRSliderTrackState,
  SliderValueState as TRSliderValueState,
} from '@base-ui/react/slider';
export type { TRSliderControlProps } from './slider-control.js';
export type { TRSliderIndicatorProps } from './slider-indicator.js';
export type { TRSliderLabelProps } from './slider-label.js';
export type { TRSliderRootProps, TRSliderUiSize } from './slider-root.js';
export type { TRSliderThumbProps } from './slider-thumb.js';
export type { TRSliderTrackProps } from './slider-track.js';
export type { TRSliderValueProps } from './slider-value.js';
export {
  TRSliderControl,
  TRSliderIndicator,
  TRSliderLabel,
  TRSliderRoot,
  TRSliderThumb,
  TRSliderTrack,
  TRSliderValue,
};
