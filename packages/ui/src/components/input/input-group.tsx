'use client';

import type { ComponentPropsWithRef } from 'react';
import type { TRControlUiSize } from '../../core/tokens/control-metrics.js';
import { mergeClassNames } from '../../internal/component-class-name.js';
import { TRInputGroupContext } from './input-group-context.js';

export type TRInputGroupProps = ComponentPropsWithRef<'div'> & {
  uiSize?: TRControlUiSize;
};

/**
 * Frames an input together with adornments and actions so they read as one
 * control: the border, background, and focus ring belong to the group, and the
 * input inside it goes flat.
 *
 * The group owns the control height, so size it here rather than on the input.
 */
export function TRInputGroup({
  children,
  className,
  uiSize = 'md',
  ...props
}: TRInputGroupProps) {
  return (
    <div
      {...props}
      className={mergeClassNames('tr-input-group', className)}
      data-ui-size={uiSize}
    >
      <TRInputGroupContext value={true}>{children}</TRInputGroupContext>
    </div>
  );
}
