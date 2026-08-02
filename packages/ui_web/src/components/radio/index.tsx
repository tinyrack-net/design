import { TRRadioIndicator } from './radio-indicator.js';
import { TRRadioRoot } from './radio-root.js';

export const TRRadio = {
  Root: TRRadioRoot,
  Indicator: TRRadioIndicator,
} as const;

export type {
  RadioIndicatorState as TRRadioIndicatorState,
  RadioRootState as TRRadioRootState,
} from '@base-ui/react/radio';
export type { TRRadioIndicatorProps } from './radio-indicator.js';
export type { TRRadioRootProps, TRRadioUiSize } from './radio-root.js';
export { TRRadioIndicator, TRRadioRoot };
