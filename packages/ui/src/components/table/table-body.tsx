import type { ComponentProps } from 'react';
import { mergeClassNames } from '../../internal/component-class-name.js';

export type TRTableBodyProps = ComponentProps<'tbody'>;

export function TRTableBody({ className, ...props }: TRTableBodyProps) {
  return <tbody {...props} className={mergeClassNames('tr-table-body', className)} />;
}
