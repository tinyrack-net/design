import type { ComponentProps } from 'react';
import { mergeClassNames } from '../../internal/component-class-name.js';

export type TableFooterProps = ComponentProps<'tfoot'>;

export function TableFooter({ className, ...props }: TableFooterProps) {
  return <tfoot {...props} className={mergeClassNames('tr-table-footer', className)} />;
}
