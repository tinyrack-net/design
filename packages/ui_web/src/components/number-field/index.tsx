import { TRNumberFieldDecrement } from './number-field-decrement.js';
import { TRNumberFieldGroup } from './number-field-group.js';
import { TRNumberFieldIncrement } from './number-field-increment.js';
import { TRNumberFieldInput } from './number-field-input.js';
import { TRNumberFieldRoot } from './number-field-root.js';
import { TRNumberFieldScrubArea } from './number-field-scrub-area.js';
import { TRNumberFieldScrubAreaCursor } from './number-field-scrub-area-cursor.js';

export const TRNumberField = {
  Root: TRNumberFieldRoot,
  Group: TRNumberFieldGroup,
  Increment: TRNumberFieldIncrement,
  Decrement: TRNumberFieldDecrement,
  Input: TRNumberFieldInput,
  ScrubArea: TRNumberFieldScrubArea,
  ScrubAreaCursor: TRNumberFieldScrubAreaCursor,
} as const;

export type {
  NumberFieldDecrementState as TRNumberFieldDecrementState,
  NumberFieldGroupState as TRNumberFieldGroupState,
  NumberFieldIncrementState as TRNumberFieldIncrementState,
  NumberFieldInputState as TRNumberFieldInputState,
  NumberFieldRootState as TRNumberFieldRootState,
  NumberFieldScrubAreaCursorState as TRNumberFieldScrubAreaCursorState,
  NumberFieldScrubAreaState as TRNumberFieldScrubAreaState,
} from '@base-ui/react/number-field';
export type { TRNumberFieldDecrementProps } from './number-field-decrement.js';
export type { TRNumberFieldGroupProps } from './number-field-group.js';
export type { TRNumberFieldIncrementProps } from './number-field-increment.js';
export type { TRNumberFieldInputProps } from './number-field-input.js';
export type { TRNumberFieldRootProps } from './number-field-root.js';
export type { TRNumberFieldScrubAreaProps } from './number-field-scrub-area.js';
export type { TRNumberFieldScrubAreaCursorProps } from './number-field-scrub-area-cursor.js';
export {
  TRNumberFieldDecrement,
  TRNumberFieldGroup,
  TRNumberFieldIncrement,
  TRNumberFieldInput,
  TRNumberFieldRoot,
  TRNumberFieldScrubArea,
  TRNumberFieldScrubAreaCursor,
};
