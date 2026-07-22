import { Separator as BaseSeparator } from '@base-ui/react/separator';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRSeparatorProps = ComponentProps<typeof BaseSeparator>;

const SeparatorPart = createComponentPart(BaseSeparator, 'tr-separator');

export function TRSeparator({
  'aria-orientation': ariaOrientation,
  orientation = 'horizontal',
  role = 'separator',
  ...props
}: TRSeparatorProps) {
  return (
    <SeparatorPart
      {...props}
      aria-orientation={
        role === 'separator' ? (ariaOrientation ?? orientation) : undefined
      }
      orientation={orientation}
      role={role}
    />
  );
}
