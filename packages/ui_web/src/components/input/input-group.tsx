'use client';

import type { ComponentPropsWithRef } from 'react';
import type { TRControlUiSize } from '../../core/tokens.js';
import { mergeClassNames } from '../../internal/component-class-name.js';
import { useTinyrackFocusModality } from '../../providers/focus-modality/focus-modality-provider.js';
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
  // The group's ring uses `:focus-within`, which carries no modality
  // information, so the tracker has to be running for it to stay off on a
  // pointer focus.
  useTinyrackFocusModality();

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
