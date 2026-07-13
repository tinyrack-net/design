import type { ComponentProps } from 'react';
import { mergeClassNames } from '../../internal/component-class-name.js';

export type SeparatorOrientation = 'horizontal' | 'vertical';
export type SeparatorProps = ComponentProps<'hr'> & {
  orientation?: SeparatorOrientation;
};

export function Separator({
  className,
  orientation = 'horizontal',
  role,
  ...props
}: SeparatorProps) {
  const resolvedRole = role ?? (orientation === 'vertical' ? 'separator' : undefined);

  return (
    <hr
      {...props}
      aria-orientation={resolvedRole === 'separator' ? orientation : undefined}
      className={mergeClassNames('tr-separator', className)}
      data-orientation={orientation}
      role={resolvedRole}
    />
  );
}
