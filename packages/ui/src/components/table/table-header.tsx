import type { ComponentProps } from 'react';
import { mergeClassNames } from '../../internal/component-class-name.js';

export type TRTableHeaderProps = ComponentProps<'thead'>;

export function TRTableHeader({ className, ...props }: TRTableHeaderProps) {
  return <thead {...props} className={mergeClassNames('tr-table-header', className)} />;
}
