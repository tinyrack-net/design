import { FieldControl } from './field-control.js';
import { FieldDescription } from './field-description.js';
import { FieldError } from './field-error.js';
import { FieldItem } from './field-item.js';
import { FieldLabel } from './field-label.js';
import { FieldRoot } from './field-root.js';
import { FieldValidity } from './field-validity.js';

export const Field = {
  Root: FieldRoot,
  Label: FieldLabel,
  Error: FieldError,
  Description: FieldDescription,
  Control: FieldControl,
  Validity: FieldValidity,
  Item: FieldItem,
} as const;

export type {
  FieldControlState,
  FieldDescriptionState,
  FieldErrorState,
  FieldItemState,
  FieldLabelState,
  FieldRootState,
  FieldValidityState,
} from '@base-ui/react/field';
export type { FieldControlProps } from './field-control.js';
export type { FieldDescriptionProps } from './field-description.js';
export type { FieldErrorProps } from './field-error.js';
export type { FieldItemProps } from './field-item.js';
export type { FieldLabelProps } from './field-label.js';
export type { FieldRootProps } from './field-root.js';
export type { FieldValidityProps } from './field-validity.js';
export {
  FieldControl,
  FieldDescription,
  FieldError,
  FieldItem,
  FieldLabel,
  FieldRoot,
  FieldValidity,
};
