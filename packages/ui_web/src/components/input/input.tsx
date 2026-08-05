'use client';

import { Input as BaseInput } from '@base-ui/react/input';
import type { ComponentPropsWithRef } from 'react';
import type { TRFieldAppearance } from '../../core/field-appearance.js';
import type { TRControlUiSize } from '../../core/tokens.js';
import { mergeComponentClassName } from '../../internal/component-class-name.js';
import { useIsInsideTRInputGroup } from './input-group-context.js';

export type TRInputUiSize = TRControlUiSize;
export type TRInputAppearance = TRFieldAppearance;
export type TRInputProps = ComponentPropsWithRef<typeof BaseInput> & {
  uiSize?: TRInputUiSize;
  appearance?: TRInputAppearance;
};

export function TRInput({
  className,
  uiSize = 'md',
  appearance = 'solid',
  ...props
}: TRInputProps) {
  // Inside a Group the frame belongs to the group, so the input drops its own
  // border and background and inherits the group's height.
  const insideGroup = useIsInsideTRInputGroup();

  return (
    <BaseInput
      {...props}
      className={mergeComponentClassName(
        insideGroup ? 'tr-input tr-input-group-input' : 'tr-input',
        className,
      )}
      data-appearance={appearance}
      data-ui-size={uiSize}
    />
  );
}
