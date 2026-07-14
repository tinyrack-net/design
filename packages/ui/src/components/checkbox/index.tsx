import { CheckboxIndicator } from './checkbox-indicator.js';
import { CheckboxRoot } from './checkbox-root.js';

export const Checkbox = {
  Root: CheckboxRoot,
  Indicator: CheckboxIndicator,
} as const;

export type {
  CheckboxIndicatorState,
  CheckboxRootState,
} from '@base-ui/react/checkbox';
export type { CheckboxIndicatorProps } from './checkbox-indicator.js';
export type { CheckboxRootProps } from './checkbox-root.js';
export { CheckboxIndicator, CheckboxRoot };
