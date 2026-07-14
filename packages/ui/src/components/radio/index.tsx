import { RadioIndicator } from './radio-indicator.js';
import { RadioRoot } from './radio-root.js';

export const Radio = {
  Root: RadioRoot,
  Indicator: RadioIndicator,
} as const;

export type {
  RadioIndicatorState,
  RadioRootState,
} from '@base-ui/react/radio';
export type { RadioIndicatorProps } from './radio-indicator.js';
export type { RadioRootProps } from './radio-root.js';
export { RadioIndicator, RadioRoot };
