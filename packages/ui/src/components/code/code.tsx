import type { ComponentProps } from 'react';
import { mergeClassNames } from '../../internal/component-class-name.js';

export type CodeProps = ComponentProps<'code'>;

export function Code({ className, ...props }: CodeProps) {
  return <code {...props} className={mergeClassNames('tr-code', className)} />;
}
