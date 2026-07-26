'use client';

import { Input as BaseInput } from '@base-ui/react/input';
import type { ComponentPropsWithRef } from 'react';
import type { TRControlUiSize } from '../../core/tokens/control-metrics.js';
import { mergeComponentClassName } from '../../internal/component-class-name.js';
import { useIsInsideTRInputGroup } from './input-group-context.js';

export type TRInputUiSize = TRControlUiSize;
export type TRInputProps = ComponentPropsWithRef<typeof BaseInput> & {
  uiSize?: TRInputUiSize;
};

export function TRInput({ className, uiSize = 'md', ...props }: TRInputProps) {
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
      data-ui-size={uiSize}
    />
  );
}
