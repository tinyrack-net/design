import type { ComponentProps } from 'react';
import { mergeClassNames } from '../../internal/component-class-name.js';

export type TableCellProps = ComponentProps<'td'>;

export function TableCell({ className, ...props }: TableCellProps) {
  return <td {...props} className={mergeClassNames('tr-table-cell', className)} />;
}
