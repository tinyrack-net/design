import type { ComponentProps } from 'react';
import { mergeClassNames } from '../../internal/component-class-name.js';

export type TableHeadProps = ComponentProps<'th'>;

export function TableHead({ className, ...props }: TableHeadProps) {
  return <th {...props} className={mergeClassNames('tr-table-head', className)} />;
}
