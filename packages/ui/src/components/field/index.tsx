import { TRFieldControl } from './field-control.js';
import { TRFieldDescription } from './field-description.js';
import { TRFieldError } from './field-error.js';
import { TRFieldItem } from './field-item.js';
import { TRFieldLabel } from './field-label.js';
import { TRFieldRoot } from './field-root.js';
import { TRFieldValidity } from './field-validity.js';

export const TRField = {
  Root: TRFieldRoot,
  Label: TRFieldLabel,
  Error: TRFieldError,
  Description: TRFieldDescription,
  Control: TRFieldControl,
  Validity: TRFieldValidity,
  Item: TRFieldItem,
} as const;

export type {
  FieldControlState as TRFieldControlState,
  FieldDescriptionState as TRFieldDescriptionState,
  FieldErrorState as TRFieldErrorState,
  FieldItemState as TRFieldItemState,
  FieldLabelState as TRFieldLabelState,
  FieldRootState as TRFieldRootState,
  FieldValidityState as TRFieldValidityState,
} from '@base-ui/react/field';
export type { TRFieldControlProps } from './field-control.js';
export type { TRFieldDescriptionProps } from './field-description.js';
export type { TRFieldErrorProps } from './field-error.js';
export type { TRFieldItemProps } from './field-item.js';
export type { TRFieldLabelProps } from './field-label.js';
export type { TRFieldRootProps, TRFieldUiSize } from './field-root.js';
export type { TRFieldValidityProps } from './field-validity.js';
export {
  TRFieldControl,
  TRFieldDescription,
  TRFieldError,
  TRFieldItem,
  TRFieldLabel,
  TRFieldRoot,
  TRFieldValidity,
};
