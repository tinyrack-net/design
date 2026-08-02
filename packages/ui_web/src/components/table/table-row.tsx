import type { ComponentProps } from 'react';
import { mergeClassNames } from '../../internal/component-class-name.js';

export type TRTableRowProps = ComponentProps<'tr'>;

export function TRTableRow({ className, ...props }: TRTableRowProps) {
  return <tr {...props} className={mergeClassNames('tr-table-row', className)} />;
}
