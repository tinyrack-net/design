'use client';

import {
  TRIconButton,
  type TRIconButtonProps,
} from '@tinyrack/ui/components/icon-button';
import type { TinyrackColorSchemePreference } from '@tinyrack/ui/providers/color-scheme';
import { Monitor, Moon, Sun } from 'lucide-react';
import { mergeComponentClassName } from '../utils/component-class-name.ts';

export type TRColorScheme = TinyrackColorSchemePreference;
export type TRColorSchemeToggleProps = Omit<
  TRIconButtonProps,
  | 'appearance'
  | 'aria-label'
  | 'aria-labelledby'
  | 'aria-pressed'
  | 'children'
  | 'loading'
  | 'loadingLabel'
  | 'nativeButton'
  | 'render'
> & {
  'aria-labelledby'?: string;
  automaticLabel?: string;
  darkLabel?: string;
  lightLabel?: string;
  onValueChange: (value: TRColorScheme) => void;
  value: TRColorScheme;
};

type ColorSchemeToggleClickEvent = Parameters<
  NonNullable<TRIconButtonProps['onClick']>
>[0];

export function TRColorSchemeToggle({
  'aria-labelledby': ariaLabelledBy,
  automaticLabel = 'Use automatic color scheme',
  darkLabel = 'Use dark color scheme',
  className,
  lightLabel = 'Use light color scheme',
  onClick,
  onValueChange,
  value,
  ...props
}: TRColorSchemeToggleProps) {
  const nextValue = value === 'auto' ? 'light' : value === 'light' ? 'dark' : 'auto';
  const label =
    nextValue === 'auto'
      ? automaticLabel
      : nextValue === 'dark'
        ? darkLabel
        : lightLabel;

  function handleClick(event: ColorSchemeToggleClickEvent) {
    onClick?.(event);
    if (!event.defaultPrevented) onValueChange(nextValue);
  }

  return (
    <TRIconButton
      {...props}
      {...(ariaLabelledBy === undefined
        ? { 'aria-label': label }
        : { 'aria-labelledby': ariaLabelledBy })}
      appearance="ghost"
      className={mergeComponentClassName('tr-color-scheme-toggle', className)}
      onClick={handleClick}
    >
      {nextValue === 'auto' ? (
        <Monitor aria-hidden="true" className="tr-color-scheme-toggle-icon" />
      ) : nextValue === 'dark' ? (
        <Moon aria-hidden="true" className="tr-color-scheme-toggle-icon" />
      ) : (
        <Sun aria-hidden="true" className="tr-color-scheme-toggle-icon" />
      )}
    </TRIconButton>
  );
}
