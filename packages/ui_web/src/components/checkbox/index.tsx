import { TRCheckboxIndicator } from './checkbox-indicator.js';
import { TRCheckboxRoot } from './checkbox-root.js';

export const TRCheckbox = {
  Root: TRCheckboxRoot,
  Indicator: TRCheckboxIndicator,
} as const;

export type {
  CheckboxIndicatorState as TRCheckboxIndicatorState,
  CheckboxRootState as TRCheckboxRootState,
} from '@base-ui/react/checkbox';
export type { TRCheckboxIndicatorProps } from './checkbox-indicator.js';
export type { TRCheckboxRootProps, TRCheckboxUiSize } from './checkbox-root.js';
export { TRCheckboxIndicator, TRCheckboxRoot };
