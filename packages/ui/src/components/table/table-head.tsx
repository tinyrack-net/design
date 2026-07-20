import type { ComponentProps } from 'react';
import { mergeClassNames } from '../../internal/component-class-name.js';

export type TRTableHeadProps = ComponentProps<'th'>;

export function TRTableHead({ className, ...props }: TRTableHeadProps) {
  return <th {...props} className={mergeClassNames('tr-table-head', className)} />;
}
