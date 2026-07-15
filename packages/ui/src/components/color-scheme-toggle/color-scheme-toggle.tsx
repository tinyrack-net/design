'use client';

import type { Ref } from 'react';
import { mergeComponentClassName } from '../../internal/component-class-name.js';
import { IconButton, type IconButtonProps } from '../icon-button/index.js';

export type ColorScheme = 'dark' | 'light';
export type ColorSchemeToggleProps = {
  className?: IconButtonProps['className'];
  darkLabel?: string;
  disabled?: boolean;
  lightLabel?: string;
  onValueChange: (value: ColorScheme) => void;
  ref?: Ref<HTMLButtonElement>;
  size?: IconButtonProps['size'];
  value: ColorScheme;
};

export function ColorSchemeToggle({
  darkLabel = 'Use dark color scheme',
  className,
  disabled,
  lightLabel = 'Use light color scheme',
  onValueChange,
  ref,
  size,
  value,
}: ColorSchemeToggleProps) {
  const nextValue = value === 'dark' ? 'light' : 'dark';
  return (
    <IconButton
      {...(disabled === undefined ? {} : { disabled })}
      {...(ref === undefined ? {} : { ref })}
      {...(size === undefined ? {} : { size })}
      appearance="ghost"
      aria-label={nextValue === 'dark' ? darkLabel : lightLabel}
      aria-pressed={value === 'dark'}
      className={mergeComponentClassName('tr-color-scheme-toggle', className)}
      onClick={() => onValueChange(nextValue)}
    >
      <span
        aria-hidden="true"
        className="tr-color-scheme-toggle-icon"
        data-scheme={nextValue}
      />
    </IconButton>
  );
}
