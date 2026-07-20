import type { ComponentProps } from 'react';
import { mergeClassNames } from '../../internal/component-class-name.js';

export type TRTableFooterProps = ComponentProps<'tfoot'>;

export function TRTableFooter({ className, ...props }: TRTableFooterProps) {
  return <tfoot {...props} className={mergeClassNames('tr-table-footer', className)} />;
}
