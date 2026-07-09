import { type ButtonHTMLAttributes, forwardRef } from 'react';
import {
  type ButtonAppearance,
  type ButtonSize,
  type ButtonVariant,
  buttonClassName,
  buttonContract,
} from './contract.js';

export type {
  ButtonAppearance,
  ButtonSize,
  ButtonVariant,
} from './contract.js';

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  appearance?: ButtonAppearance;
  size?: ButtonSize;
  variant?: ButtonVariant;
};

function mergeClassNames(...classNames: Array<string | undefined>) {
  return classNames.filter(Boolean).join(' ');
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    appearance = buttonContract.defaultAppearance,
    className,
    size = buttonContract.defaultSize,
    type = 'button',
    variant = buttonContract.defaultVariant,
    ...buttonProps
  },
  ref,
) {
  return (
    <button
      {...buttonProps}
      className={mergeClassNames(buttonClassName, className)}
      data-appearance={appearance}
      data-size={size}
      data-variant={variant}
      ref={ref}
      type={type}
    />
  );
});
