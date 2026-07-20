'use client';

import { Form as BaseForm, type FormProps as BaseFormProps } from '@base-ui/react/form';
import { mergeComponentClassName } from '../../internal/component-class-name.js';

export type TRFormValues = Record<string, unknown>;
export type TRFormProps<Values extends TRFormValues = TRFormValues> =
  BaseFormProps<Values>;

export function TRForm<Values extends TRFormValues = TRFormValues>({
  className,
  ...props
}: TRFormProps<Values>) {
  return (
    <BaseForm<Values>
      {...props}
      className={mergeComponentClassName('tr-form', className)}
    />
  );
}
