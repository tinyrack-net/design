import {
  type ChangeEvent,
  type FieldsetHTMLAttributes,
  forwardRef,
  type InputHTMLAttributes,
  type ReactNode,
  useState,
} from 'react';
import {
  checkboxClassName,
  checkboxControlClassName,
  checkboxInputClassName,
  checkboxLabelClassName,
  type FormControlSize,
  formContract,
  type RadioGroupOrientation,
  radioClassName,
  radioControlClassName,
  radioGroupClassName,
  radioInputClassName,
  radioLabelClassName,
  switchClassName,
  switchInputClassName,
  switchLabelClassName,
  switchThumbClassName,
  switchTrackClassName,
} from './contract.js';

export type CheckboxProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'children' | 'size' | 'type'
> & {
  children?: ReactNode;
  invalid?: boolean;
  size?: FormControlSize;
};

export type RadioGroupProps = FieldsetHTMLAttributes<HTMLFieldSetElement> & {
  orientation?: RadioGroupOrientation;
};

export type RadioProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'children' | 'size' | 'type'
> & {
  children?: ReactNode;
  invalid?: boolean;
  size?: FormControlSize;
};

export type SwitchProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'children' | 'size' | 'type'
> & {
  children?: ReactNode;
  invalid?: boolean;
  size?: FormControlSize;
};

function mergeClassNames(...classNames: Array<string | undefined>) {
  return classNames.filter(Boolean).join(' ');
}

function invalidState(invalid: boolean | undefined) {
  return invalid ? 'true' : undefined;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { children, className, invalid, size = formContract.defaultSize, ...checkboxProps },
  ref,
) {
  return (
    <label
      className={mergeClassNames(checkboxClassName, className)}
      data-invalid={invalidState(invalid)}
      data-size={size}
    >
      <input
        {...checkboxProps}
        aria-invalid={invalid ? true : checkboxProps['aria-invalid']}
        className={checkboxInputClassName}
        ref={ref}
        type="checkbox"
      />
      <span aria-hidden="true" className={checkboxControlClassName} />
      {children === undefined ? null : (
        <span className={checkboxLabelClassName}>{children}</span>
      )}
    </label>
  );
});

export const RadioGroup = forwardRef<HTMLFieldSetElement, RadioGroupProps>(
  function RadioGroup(
    {
      className,
      orientation = formContract.defaultRadioGroupOrientation,
      ...groupProps
    },
    ref,
  ) {
    return (
      <fieldset
        {...groupProps}
        className={mergeClassNames(radioGroupClassName, className)}
        data-orientation={orientation}
        ref={ref}
      />
    );
  },
);

export const Radio = forwardRef<HTMLInputElement, RadioProps>(function Radio(
  { children, className, invalid, size = formContract.defaultSize, ...radioProps },
  ref,
) {
  return (
    <label
      className={mergeClassNames(radioClassName, className)}
      data-invalid={invalidState(invalid)}
      data-size={size}
    >
      <input
        {...radioProps}
        aria-invalid={invalid ? true : radioProps['aria-invalid']}
        className={radioInputClassName}
        ref={ref}
        type="radio"
      />
      <span aria-hidden="true" className={radioControlClassName} />
      {children === undefined ? null : (
        <span className={radioLabelClassName}>{children}</span>
      )}
    </label>
  );
});

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(function Switch(
  {
    children,
    className,
    checked,
    defaultChecked,
    invalid,
    onChange,
    size = formContract.defaultSize,
    ...switchProps
  },
  ref,
) {
  const isControlled = checked !== undefined;
  const [uncontrolledChecked, setUncontrolledChecked] = useState(
    Boolean(defaultChecked),
  );
  const currentChecked = isControlled ? checked : uncontrolledChecked;

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    if (!isControlled) {
      setUncontrolledChecked(event.currentTarget.checked);
    }

    onChange?.(event);
  }

  return (
    <label
      className={mergeClassNames(switchClassName, className)}
      data-invalid={invalidState(invalid)}
      data-size={size}
    >
      <input
        {...switchProps}
        aria-checked={currentChecked}
        aria-invalid={invalid ? true : switchProps['aria-invalid']}
        checked={checked}
        className={switchInputClassName}
        defaultChecked={defaultChecked}
        onChange={handleChange}
        ref={ref}
        role="switch"
        type="checkbox"
      />
      <span aria-hidden="true" className={switchTrackClassName}>
        <span className={switchThumbClassName} />
      </span>
      {children === undefined ? null : (
        <span className={switchLabelClassName}>{children}</span>
      )}
    </label>
  );
});
