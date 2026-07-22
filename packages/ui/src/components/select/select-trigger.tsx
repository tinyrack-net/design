'use client';

import { Select as BaseSelect } from '@base-ui/react/select';
import type { ComponentPropsWithRef } from 'react';
import type { TRControlUiSize } from '../../core/tokens/control-metrics.js';
import { createComponentPart } from '../../internal/component-part.js';

export type TRSelectTriggerUiSize = TRControlUiSize;
export type TRSelectTriggerProps = ComponentPropsWithRef<typeof BaseSelect.Trigger> & {
  uiSize?: TRSelectTriggerUiSize;
};

const SelectTriggerPart = createComponentPart(BaseSelect.Trigger, 'tr-select-trigger');

export function TRSelectTrigger({
  className,
  uiSize = 'md',
  ...props
}: TRSelectTriggerProps) {
  return <SelectTriggerPart {...props} className={className} data-ui-size={uiSize} />;
}
