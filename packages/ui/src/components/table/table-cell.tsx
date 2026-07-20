import type { ComponentProps } from 'react';
import { mergeClassNames } from '../../internal/component-class-name.js';

export type TRTableCellProps = ComponentProps<'td'>;

export function TRTableCell({ className, ...props }: TRTableCellProps) {
  return <td {...props} className={mergeClassNames('tr-table-cell', className)} />;
}
