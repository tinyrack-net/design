import type { ComponentProps } from 'react';
import { mergeClassNames } from '../../internal/component-class-name.js';

export type TRCodeProps = ComponentProps<'code'>;

export function TRCode({ className, ...props }: TRCodeProps) {
  return <code {...props} className={mergeClassNames('tr-code', className)} />;
}
