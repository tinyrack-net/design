import { forwardRef, type HTMLAttributes, type LabelHTMLAttributes } from 'react';
import {
  type FormControlSize,
  type FormMessageVariant,
  fieldClassName,
  formContract,
  formMessageClassName,
  labelClassName,
} from './contract.js';

export type FieldProps = HTMLAttributes<HTMLDivElement> & {
  size?: FormControlSize;
};

export type LabelProps = LabelHTMLAttributes<HTMLLabelElement>;

export type FormMessageProps = HTMLAttributes<HTMLParagraphElement> & {
  variant?: FormMessageVariant;
};

function mergeClassNames(...classNames: Array<string | undefined>) {
  return classNames.filter(Boolean).join(' ');
}

export const Field = forwardRef<HTMLDivElement, FieldProps>(function Field(
  { className, size = formContract.defaultSize, ...fieldProps },
  ref,
) {
  return (
    <div
      {...fieldProps}
      className={mergeClassNames(fieldClassName, className)}
      data-size={size}
      ref={ref}
    />
  );
});

export const Label = forwardRef<HTMLLabelElement, LabelProps>(function Label(
  { className, htmlFor, ...labelProps },
  ref,
) {
  return (
    // biome-ignore lint/a11y/noLabelWithoutControl: Label forwards htmlFor or wrapped controls from callers.
    <label
      {...labelProps}
      className={mergeClassNames(labelClassName, className)}
      htmlFor={htmlFor}
      ref={ref}
    />
  );
});

export const FormMessage = forwardRef<HTMLParagraphElement, FormMessageProps>(
  function FormMessage(
    { className, variant = formContract.defaultMessageVariant, ...messageProps },
    ref,
  ) {
    return (
      <p
        {...messageProps}
        className={mergeClassNames(formMessageClassName, className)}
        data-variant={variant}
        ref={ref}
      />
    );
  },
);
