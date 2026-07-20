'use client';

import { Moon, Sun } from 'lucide-react';
import type { Ref } from 'react';
import { mergeComponentClassName } from '../../internal/component-class-name.js';
import { TRIconButton, type TRIconButtonProps } from '../icon-button/index.js';

export type TRColorScheme = 'dark' | 'light';
export type TRColorSchemeToggleProps = {
  className?: TRIconButtonProps['className'];
  darkLabel?: string;
  disabled?: boolean;
  lightLabel?: string;
  onValueChange: (value: TRColorScheme) => void;
  ref?: Ref<HTMLButtonElement>;
  uiSize?: TRIconButtonProps['uiSize'];
  value: TRColorScheme;
};

export function TRColorSchemeToggle({
  darkLabel = 'Use dark color scheme',
  className,
  disabled,
  lightLabel = 'Use light color scheme',
  onValueChange,
  ref,
  uiSize,
  value,
}: TRColorSchemeToggleProps) {
  const nextValue = value === 'dark' ? 'light' : 'dark';
  return (
    <TRIconButton
      {...(disabled === undefined ? {} : { disabled })}
      {...(ref === undefined ? {} : { ref })}
      {...(uiSize === undefined ? {} : { uiSize })}
      appearance="ghost"
      aria-label={nextValue === 'dark' ? darkLabel : lightLabel}
      aria-pressed={value === 'dark'}
      className={mergeComponentClassName('tr-color-scheme-toggle', className)}
      onClick={() => onValueChange(nextValue)}
    >
      {nextValue === 'dark' ? (
        <Moon aria-hidden="true" className="tr-color-scheme-toggle-icon" />
      ) : (
        <Sun aria-hidden="true" className="tr-color-scheme-toggle-icon" />
      )}
    </TRIconButton>
  );
}
