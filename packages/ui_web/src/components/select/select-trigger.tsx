'use client';

import { Select as BaseSelect } from '@base-ui/react/select';
import type { ComponentPropsWithRef } from 'react';
import type { TRFieldAppearance } from '../../core/field-appearance.js';
import type { TRControlUiSize } from '../../core/tokens.js';
import { createComponentPart } from '../../internal/component-part.js';

export type TRSelectTriggerUiSize = TRControlUiSize;
export type TRSelectTriggerAppearance = TRFieldAppearance;
export type TRSelectTriggerProps = ComponentPropsWithRef<typeof BaseSelect.Trigger> & {
  uiSize?: TRSelectTriggerUiSize;
  appearance?: TRSelectTriggerAppearance;
};

const SelectTriggerPart = createComponentPart(BaseSelect.Trigger, 'tr-select-trigger');

export function TRSelectTrigger({
  className,
  uiSize = 'md',
  appearance = 'solid',
  ...props
}: TRSelectTriggerProps) {
  return (
    <SelectTriggerPart
      {...props}
      className={className}
      data-appearance={appearance}
      data-ui-size={uiSize}
    />
  );
}
