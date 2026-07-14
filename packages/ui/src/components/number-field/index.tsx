import { NumberFieldDecrement } from './number-field-decrement.js';
import { NumberFieldGroup } from './number-field-group.js';
import { NumberFieldIncrement } from './number-field-increment.js';
import { NumberFieldInput } from './number-field-input.js';
import { NumberFieldRoot } from './number-field-root.js';
import { NumberFieldScrubArea } from './number-field-scrub-area.js';
import { NumberFieldScrubAreaCursor } from './number-field-scrub-area-cursor.js';

export const NumberField = {
  Root: NumberFieldRoot,
  Group: NumberFieldGroup,
  Increment: NumberFieldIncrement,
  Decrement: NumberFieldDecrement,
  Input: NumberFieldInput,
  ScrubArea: NumberFieldScrubArea,
  ScrubAreaCursor: NumberFieldScrubAreaCursor,
} as const;

export type {
  NumberFieldDecrementState,
  NumberFieldGroupState,
  NumberFieldIncrementState,
  NumberFieldInputState,
  NumberFieldRootState,
  NumberFieldScrubAreaCursorState,
  NumberFieldScrubAreaState,
} from '@base-ui/react/number-field';
export type { NumberFieldDecrementProps } from './number-field-decrement.js';
export type { NumberFieldGroupProps } from './number-field-group.js';
export type { NumberFieldIncrementProps } from './number-field-increment.js';
export type { NumberFieldInputProps } from './number-field-input.js';
export type { NumberFieldRootProps } from './number-field-root.js';
export type { NumberFieldScrubAreaProps } from './number-field-scrub-area.js';
export type { NumberFieldScrubAreaCursorProps } from './number-field-scrub-area-cursor.js';
export {
  NumberFieldDecrement,
  NumberFieldGroup,
  NumberFieldIncrement,
  NumberFieldInput,
  NumberFieldRoot,
  NumberFieldScrubArea,
  NumberFieldScrubAreaCursor,
};
