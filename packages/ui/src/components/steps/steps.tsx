import type { ComponentPropsWithRef } from 'react';
import { mergeClassNames } from '../../internal/component-class-name.js';

export type TRStepsRootProps = ComponentPropsWithRef<'ol'>;
export type TRStepsItemProps = ComponentPropsWithRef<'li'>;

export function TRStepsRoot({ className, ...props }: TRStepsRootProps) {
  return <ol {...props} className={mergeClassNames('tr-steps', className)} />;
}

export function TRStepsItem({ className, ...props }: TRStepsItemProps) {
  return <li {...props} className={mergeClassNames('tr-steps-item', className)} />;
}
